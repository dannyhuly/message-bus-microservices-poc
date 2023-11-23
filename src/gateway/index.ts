import express from 'express';
import { createMessageBusClient, getKafkaClient } from '../kafka-client';
import config from 'config';
import { lastValueFrom } from 'rxjs';

const app = express();
const port = 8080; // default port to listen

async function bootstrap() {
  const kafkaClient = getKafkaClient();
  const messageBusClient = await createMessageBusClient(kafkaClient, {
    topic: config.get('kafka.topics.messageBus'),
    group: config.get('kafka.group'),
  });

  // define a route handler for the default home page
  app.get('/',  async (req, res) => {
    const serviceResponse = await lastValueFrom(messageBusClient.send('HELLO_WORLD', 'Danny'));
    res.send(serviceResponse.payload);
  });

  // start the Express server
  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
  });
}

bootstrap();