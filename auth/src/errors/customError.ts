export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    super(message);
  }

  abstract serializeErrors(): (
    | { message: string; filed?: string }
    | undefined
  )[];
}

// export interface CustomError {
//   statusCode: number;
//   serializeErrors: () => ({ message: string; filed?: string } | undefined)[];
// }

// two way of implementation:
// 1.with interface
// 2. with abstract class.
// in this case errors code must to extend the abstract class only
