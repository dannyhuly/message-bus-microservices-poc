import { createMessageBusClient, getKafkaClient } from '../kafka-client';
import config from 'config';

async function bootstrap() {
  const kafkaClient = getKafkaClient();
  const messageBusClient = await createMessageBusClient(kafkaClient, {
    topic: config.get('kafka.topics.messageBus'),
    group: config.get('kafka.group'),
  });

  messageBusClient.subscribeToReplyOf('HELLO_WORLD', (payload) => {
    return `Hello ${payload.payload}! ${Date.now()}`;
  });
}

bootstrap();
