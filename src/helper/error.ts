import { log } from "./logger";

export class ErrorHandler {
  private message: string;
  private code: number;

  constructor(message: string, error: Error | null ,code: number = 500,) {
    this.message = message;
    this.code = code;

    this.showError(message, error, code);
  }

  public getMessage():string {
    return this.message;
  }

  public getCode(): number {
    return this.code;
  }

  public toJSON(): any {
    return {
      message: this.message,
      code: this.code,
    };
  }

  private showError(message: string, error: Error | null, code: number): void {
    log.error(`Error Code: ${code}, Message: ${message}`);
    if (error) {
      log.error(`Error Stack: ${error.stack}`);
    }
  }
}
