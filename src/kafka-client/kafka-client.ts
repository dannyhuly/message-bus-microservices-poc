import config from 'config';
import { Kafka, KafkaConfig, logLevel } from 'kafkajs';

export function getKafkaClient() {
  const kafkaConfig: KafkaConfig = {
    clientId: 'test-app',
    logLevel: logLevel.ERROR, 
    brokers: config.get<Array<string>>('kafka.brokers'),

    // // Hack: https://github.com/tulios/kafkajs/issues/931#issuecomment-713447600
    // connectionTimeout: 10_000,
    // authenticationTimeout: 10_000,
    // // Hack - END
  };

  return new Kafka(kafkaConfig);
}
