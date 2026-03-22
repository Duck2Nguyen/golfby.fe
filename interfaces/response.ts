export interface RestResponse<T = Record<string, unknown>> {
  success: boolean;
  message: string;
  data: T;
  error: RestError | null;
  meta: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
}

export interface RestError {
  status: number;
  code?: string;
  message?: string;
  messageParams?: Record<string, unknown>;
}
