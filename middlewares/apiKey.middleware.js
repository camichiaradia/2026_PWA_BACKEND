import ENVIRONMENT from "../config/environment.config.js";

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== ENVIRONMENT.API_KEY) {
        return res.status(401).json({ message: "Unauthorized: Invalid or missing API Key" });
    }
    next();
};

export default apiKeyMiddleware;
