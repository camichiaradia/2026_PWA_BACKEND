import ENVIRONMENT from "../config/environment.config.js";

const apiKeyMiddleware = (req, res, next) => {
    //Lista de rutas que NO necesitan API Key (Rutas públicas)
    const publicPaths = ['/api/auth/verify-email']
    // Si la ruta actual está en la lista, saltamos la validación
    if (publicPaths.some(path => req.path.startsWith(path))) {
        return next();
    }

    const apiKey = req.headers['x-api-key'];
    const serverKey = process.env.API_KEY || "4864da4a-2791-4113-931e-132644f2a3aa";
    if (!apiKey || apiKey !== serverKey) {
        console.error(`Acceso denegado. Recibido: [${apiKey}], Esperado: [${serverKey}]`);
        return res.status(401).json({ 
            ok: false,
            message: "API Key inválida o faltante" });
    }
    next();
};

export default apiKeyMiddleware;
