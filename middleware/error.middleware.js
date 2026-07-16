const errorHandler = (err, req, res, next) => {

    console.error("=================================");
    console.error("❌ ERROR");
    console.error(err);
    console.error("=================================");

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // MongoDB Cast Error
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID";
    }

    // Duplicate Key
    if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate value found";
    }

    // Validation Error
    if (err.name === "ValidationError") {

        const errors = Object.values(err.errors).map(
            item => item.message
        );

        statusCode = 400;
        message = errors.join(", ");
    }

    // JWT Errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid Token";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token Expired";
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== "production" && {
            stack: err.stack
        })
    });

};

module.exports = errorHandler;
