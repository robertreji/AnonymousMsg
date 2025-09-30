
export class ApiError extends Error {
  status?: number;
  success?: boolean;

  constructor(message: string, status: number, success = false) {
    super(message);
    this.status = status;
    this.success = success;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
