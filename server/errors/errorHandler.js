export function catchAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}

export function errorHandler(err, req, res, next) {
    const status = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (err.errors) return res.status(status).json({ errors: err.errors });
    res.status(status).json({ message });
}