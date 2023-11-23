import { IHeaders, Kafka } from 'kafkajs';
import { v4 as uuidV4 } from 'uuid';
import { Subject, filter, throwError, timeout, first, from, concatMap } from 'rxjs';

export interface MessageBusOpt {
  topic: string;
  group: string;
  timeout?: number;
}

export interface MessageBusEvent<P = any> {
  action: string;
  payload: P;
}

export interface TopicEvent<P = any> extends MessageBusEvent<P> {
  key: string;
  headers: IHeaders;
}

const SECONDE = 1000;
const createReplyKey = (key: string) => `${key}.reply`;
const createReplyAction = (action: string) => `${action}.reply`;

export async function createMessageBusClient<P = any>(kafkaClient: Kafka, opt: MessageBusOpt) {
  // create kafka producer
  const kafkaProducer = kafkaClient.producer();
  await kafkaProducer.connect();
  // create kafka producer - END

  // create kafka consumer + pipe messages through rxjs Subject
  const messageBusSubject = new Subject<TopicEvent<P>>();
  const kafkaConsumer = kafkaClient.consumer({ groupId: `${opt.group}-${uuidV4()}` });
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topics: [opt.topic] });
  await kafkaConsumer.run({
    eachMessage: async (event) => {
      try {
        const parseData = JSON.parse(event.message.value.toString()) as MessageBusEvent<P>;
        messageBusSubject.next({
          ...parseData,
          key: event.message.key.toString(),
          headers: event.message.headers,
        });
      } catch (e) {
        console.error(e);
      }
    },
  });
  // create kafka consumer - END

  function send(action: string, payload: P) {
    const sendKey = uuidV4();
    const replyKey = createReplyKey(sendKey);

    // create reply listener
    return from(kafkaProducer.send({
        topic: opt.topic,
        messages: [{ key: sendKey, value: JSON.stringify({ action, payload }) }],
      }))
      .pipe(concatMap(() => messageBusSubject))
      .pipe(filter((event) => event.key == replyKey))
      .pipe(first())
      .pipe(
        timeout({
          each: opt.timeout || 30 * SECONDE,
          with: () => throwError(() => new Error('MessageBusEventTimeout')),
        }),
      );
  }

  async function subscribeToReplyOf(action: string, replyCb: { (payload: MessageBusEvent<P>): any | Promise<any> }) {
    messageBusSubject.pipe(filter((event) => event.action == action)).subscribe(async (event) => {
      const replyPayload = await replyCb(event);
      if (!replyPayload) {
        return;
      }

      const replyKey = createReplyKey(event.key);
      const replyAction = createReplyAction(event.action);

      // produce reply message
      kafkaProducer.send({
        topic: opt.topic,
        messages: [
          {
            key: replyKey,
            value: JSON.stringify({ action: replyAction, payload: replyPayload }),
          },
        ],
      });
    });
  }

  function disconnect() {
    return Promise.all([kafkaProducer.disconnect(), kafkaConsumer.disconnect()]);
  }

  return {
    disconnect,
    send,
    subscribeToReplyOf,
  };
}
