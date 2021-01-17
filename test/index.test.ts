import * as amqplib from 'amqplib';
// import { expect } from 'chai';
import {
  DataBase,
  Dispatcher,
  EmitFunction,
  RegisterHandler,
} from '../src';

let connection: amqplib.Connection;
let channel: amqplib.Channel;

describe('Tests', () => {
  before(async () => {
    connection = await amqplib.connect('amqp://rabbit');
    channel = await connection.createChannel();

    const emit: EmitFunction = async (topic, data) => {
      await channel.assertQueue(topic);
      channel.sendToQueue(topic, Buffer.from(JSON.stringify(data)));
    };

    const register: RegisterHandler = async (topic, handler) => {
      await channel.assertQueue(topic);
      await channel.consume(topic, (data) => {
        if (!data) {
          return;
        }

        try {
          const jsonData = JSON.parse(data.content.toString());
          handler(jsonData);
          channel.ack(data);
        } catch (error) {
          channel.nack(data);
        }
      });
    };

    Dispatcher.initialize({
      emit,
      register,
      serviceName: 'test',
      environment: 'local',
    });
  });

  it('Should receive the right topic messages to the right handlers', async () => {
    const events = [...Array(10)]
      .map((_, idx) => `event-${idx}`);
    const tasks = [...Array(10)]
      .map((_, idx) => `task-${idx}`);

    // register event handlers
    const eventPromises = events.map((eventTopic) => (
      new Promise((resolve, reject) => {
        setTimeout(reject, 5000);
        Dispatcher.registerEventHandler(
          eventTopic,
          async (data: DataBase) => {
            if (data.payload.eventTopic === eventTopic) {
              return resolve(data);
            }
            return reject();
          },
        );
      })
    ));

    // register task handlers
    const taskPromises = tasks.map((taskTopic) => (
      new Promise((resolve, reject) => {
        setTimeout(reject, 5000);
        Dispatcher.registerTaskHandler(
          taskTopic,
          async (data: DataBase) => {
            if (data.payload.taskTopic === taskTopic) {
              return resolve(data);
            }
            return reject();
          },
        );
      })
    ));

    events.forEach((eventTopic) => {
      Dispatcher.emitEvent(
        `tid-${eventTopic}`,
        eventTopic,
        { eventTopic },
      );
    });

    tasks.forEach((taskTopic) => {
      Dispatcher.emitTask(
        `tid-${taskTopic}`,
        Dispatcher.getServiceName(),
        taskTopic,
        { taskTopic },
      );
    });

    await Promise.all(eventPromises);
    await Promise.all(taskPromises);
  });

  after(async () => {
    await channel.close();
    await connection.close();
  });
});
