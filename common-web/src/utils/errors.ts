export enum CommonErrorCode {
  unauthorized = 'unauthorized',
  forbidden = 'forbidden',
  notFound = 'notFound',
  unkown = 'unkown',
}
export class CustomError<Detail = any> {
  public constructor(public code: string, public message: string, public detail?: Detail, public quiet?: boolean) {}
}
