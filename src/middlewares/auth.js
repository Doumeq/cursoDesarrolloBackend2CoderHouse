export const authorization = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ status: "error", error: "No autorizado. Inicia sesión." });
        }

        const userRole = req.user.user ? req.user.user.role : req.user.role;

        if (!roles.includes(userRole)) {
            return res.status(403).json({ status: "error", error: "Forbidden - No tienes permisos suficientes para esta acción." });
        }

        next();
    };
};