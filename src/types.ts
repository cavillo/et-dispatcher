export type PayloadData = { [key: string]: unknown };
export interface ServiceBase {
  serviceName: string;
  environment: string;
  instance: string;
}
export interface DataBase {
  transactionId: string;
  service: ServiceBase;
  payload: PayloadData;
}
export type HandlerBase = { (data: DataBase): Promise<void> }
export type EmitFunction = (
  topic: string,
  data: DataBase,
  options?: PayloadData
) => Promise<void>;
export type RegisterHandler = (
  topic: string,
  handler: (data: DataBase) => void,
  options?: PayloadData
) => Promise<void>;
export type InitOptions = Partial<ServiceBase> & {
  emit: EmitFunction;
  register: RegisterHandler;
};
