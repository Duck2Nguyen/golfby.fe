export type RestResponse<T = Record<string, unknown>> = T;

export interface RestError {
  status: number;
  code?: string;
  message?: string;
  messageParams?: Record<string, unknown>;
}
