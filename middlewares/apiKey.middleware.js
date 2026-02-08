import ENVIRONMENT from "../config/environment.config.js";

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const serverKey = process.env.API_KEY || "4864da4a-2791-4113-931e-132644f2a3aa";
    if (!apiKey || apiKey !== serverKey) {
        console.error(`Acceso denegado. Recibido: [${apiKey}], Esperado: [${serverKey}]`);
        return res.status(401).json({ message: "API Key inválida o faltante" });
    }
    next();
};

export default apiKeyMiddleware;
