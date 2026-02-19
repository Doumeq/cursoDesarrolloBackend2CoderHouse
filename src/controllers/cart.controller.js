import * as cartService from "../services/cart.service.js";

export const purchaseCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const purchaserEmail = req.user.user ? req.user.user.email : req.user.email;

        const result = await cartService.purchaseCartService(cartId, purchaserEmail);

        if (!result.ticket) {
            return res.status(400).json({ 
                status: "error", 
                message: "No se puede procesar la compra. Falta stock en todos los productos.", 
                unpurchasedProducts: result.unpurchasedProducts 
            });
        }

        res.json({ 
            status: "success", 
            message: "Compra finalizada con éxito",
            payload: result 
        });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};