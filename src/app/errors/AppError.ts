class AppError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string | undefined, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;

// The constructor in a class is a special method used for creating and initializing an object instance of that class.

// Passing the message to the Parent Error Class:

// The Error class expects a message argument, which is passed via super(message). This ensures that the AppError class inherits the error message functionality of the Error class.

// The constructor and super allow you to seamlessly extend the built-in Error class while adding custom functionality, such as a statusCode property for HTTP error handling.

// const error = new AppError(404, 'Not Found');
// console.log(error.message); // Outputs: "Not Found"
