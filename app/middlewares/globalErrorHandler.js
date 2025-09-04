import { env } from "../config/env.js";
import AppError from "../errorHelper/AppError.js";

export const globalErrorHandler = async (err, req, res, next) => {

    let statusCode = 500
    let message = `something went wrong!`;
    let errorSources = [];

    // // mongoose validation err
    // if (err.code === 11000) {
    //     const simplifiedErr = handleDuplicateError(err);
    //     statusCode = simplifiedErr.statusCode;
    //     message = simplifiedErr.message
    // }
    // else if (err.name === "CastError") {
    //     const simplifiedErr = handleCastError(err);
    //     statusCode = simplifiedErr.statusCode;
    //     message = simplifiedErr.message;
    // }
    // else if (err.name === 'ValidationError') {
    //     const simplifiedErr = handleValidationError(err);
    //     statusCode = simplifiedErr.statusCode;
    //     message = simplifiedErr.message;
    //     errorSources = simplifiedErr.errorSources as TErrorSources[]

    // }

    // // ZodError
    // else if (err.name === "ZodError") {
    //     const simplifiedErr = handleZodError(err);
    //     statusCode = simplifiedErr.statusCode;
    //     message = simplifiedErr.message;
    //     errorSources = simplifiedErr.errorSources

    // }
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errorSources,
        err: env.NODE_ENV === 'development' ? err.err : null,
        stack: env.NODE_ENV === 'development' ? err.stack : null
    })
}