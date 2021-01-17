import { config as configureEnvironmentVariables } from 'dotenv';
import {
  PayloadData,
  HandlerBase,
  EmitFunction,
  RegisterHandler,
  InitOptions,
} from './types';
import { ERROR_MESSAGES } from './errors';

// require our environment variables
configureEnvironmentVariables();

export class Dispatcher {
  private static _serviceName: string;
  private static _environment: string;
  private static _instance: string;
  private static _emit: EmitFunction;
  private static _register: RegisterHandler;

  public static initialize(
    {
      serviceName,
      environment,
      instance,
      emit,
      register,
    }: InitOptions,
  ): void {
    Dispatcher._serviceName = serviceName || process.env.SERVICE_NAME;
    if (!Dispatcher._serviceName || Dispatcher._serviceName === '') {
      throw new Error(ERROR_MESSAGES.MISSING_SERVICE_NAME);
    }

    Dispatcher._environment = environment || process.env.ENVIRONMENT;
    if (!Dispatcher._environment || Dispatcher._environment === '') {
      throw new Error(ERROR_MESSAGES.MISSING_ENVIRONMENT);
    }

    if (!emit || typeof emit !== 'function') {
      throw new Error(ERROR_MESSAGES.MISSING_EMIT_FUNCTION);
    }
    Dispatcher._emit = emit;

    if (!register || typeof register !== 'function') {
      throw new Error(ERROR_MESSAGES.MISSING_REGISTER_HANDLER);
    }
    Dispatcher._register = register;

    if (instance) {
      Dispatcher._instance = instance;
    } else {
      Dispatcher._instance = `${Dispatcher._environment}-${Dispatcher._serviceName}-${process.pid}`;
    }
  }

  public static getServiceName(): string {
    if (!Dispatcher.isInitialized()) {
      throw new Error(ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
    }
    return Dispatcher._serviceName;
  }

  public static getEnvironment(): string {
    if (!Dispatcher.isInitialized()) {
      throw new Error(ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
    }
    return Dispatcher._environment;
  }

  public static getInstance(): string {
    if (!Dispatcher.isInitialized()) {
      throw new Error(ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
    }
    return Dispatcher._instance;
  }

  public static isInitialized(): boolean {
    return !!(
      Dispatcher._serviceName
      && Dispatcher._environment
      && Dispatcher._instance
      && Dispatcher._emit
      && Dispatcher._register
    );
  }

  public static emitEvent(
    transactionId: string,
    event: string,
    payload: PayloadData,
  ): void {
    if (!Dispatcher.isInitialized()) {
      throw new Error(ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
    }

    const topic = `${Dispatcher._environment}.${event}`;
    Dispatcher._emit(
      topic,
      {
        transactionId,
        payload,
        service: {
          environment: Dispatcher._environment,
          serviceName: Dispatcher._serviceName,
          instance: Dispatcher._instance,
        },
      },
    );
  }

  public static emitTask(
    transactionId: string,
    service: string,
    task: string,
    payload: PayloadData,
  ): void {
    if (!Dispatcher.isInitialized()) {
      throw new Error(ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
    }

    const topic = `${Dispatcher._environment}.${service}.${task}`;
    Dispatcher._emit(
      topic,
      {
        transactionId,
        payload,
        service: {
          environment: Dispatcher._environment,
          serviceName: Dispatcher._serviceName,
          instance: Dispatcher._instance,
        },
      },
    );
  }

  public static emitInstanceTask(
    transactionId: string,
    instance: string,
    service: string,
    task: string,
    payload: PayloadData,
  ): void {
    if (!Dispatcher.isInitialized()) {
      throw new Error(ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
    }

    const topic = `${Dispatcher._environment}.${service}.${instance}.${task}`;
    Dispatcher._emit(
      topic,
      {
        transactionId,
        payload,
        service: {
          environment: Dispatcher._environment,
          serviceName: Dispatcher._serviceName,
          instance: Dispatcher._instance,
        },
      },
    );
  }

  public static async registerEventHandler(event: string, handler: HandlerBase): Promise<void> {
    if (!Dispatcher.isInitialized()) {
      throw new Error(ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
    }

    try {
      Dispatcher._register(
        `${Dispatcher._environment}.${event}`,
        (data) => {
          try {
            handler(data);
          } catch (error) {
            error(ERROR_MESSAGES.HANDLING_EVENT, event, error.message);
          }
        },
      );
    } catch (error) {
      error(ERROR_MESSAGES.REGISTERING_EVENT, event, error.message);
    }
  }

  public static async registerTaskHandler(task: string, handler: HandlerBase): Promise<void> {
    if (!Dispatcher.isInitialized()) {
      throw new Error(ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
    }

    try {
      Dispatcher._register(
        `${Dispatcher._environment}.${Dispatcher._serviceName}.${task}`,
        (data) => {
          try {
            handler(data);
          } catch (error) {
            error(ERROR_MESSAGES.HANDLING_EVENT, task, error.message);
          }
        },
      );
    } catch (error) {
      error(ERROR_MESSAGES.REGISTERING_TASK, task, error.message);
    }
  }

  public static async registerInstanceTaskHandler(
    task: string,
    handler: HandlerBase,
  ): Promise<void> {
    if (!Dispatcher.isInitialized()) {
      throw new Error(ERROR_MESSAGES.SERVICE_NOT_INITIALIZED);
    }

    try {
      Dispatcher._register(
        `${Dispatcher._environment}.${Dispatcher._serviceName}.${Dispatcher._instance}.${task}`,
        (data) => {
          try {
            handler(data);
          } catch (error) {
            error(ERROR_MESSAGES.HANDLING_EVENT, task, error.message);
          }
        },
      );
    } catch (error) {
      error(ERROR_MESSAGES.REGISTERING_TASK, task, error.message);
    }
  }
}
