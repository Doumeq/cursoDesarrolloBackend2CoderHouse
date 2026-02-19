import CartRepository from "../repository/cart.repository.js";
import ProductRepository from "../repository/product.repository.js";
import TicketRepository from "../repository/ticket.repository.js";

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketRepository();

export const purchaseCartService = async (cartId, purchaserEmail) => {
    const cart = await cartRepository.getCartById(cartId);
    if (!cart) throw new Error("No se encontro el carrito");

    let totalAmount = 0;
    const productsToKeep = [];

    for (const item of cart.products) {
        const product = item.product; 
        const quantityInCart = item.quantity;

        if (product.stock >= quantityInCart) {
            product.stock -= quantityInCart;
            totalAmount += product.price * quantityInCart;
            
            await productRepository.updateProduct(product._id, { stock: product.stock });
        } else {
            productsToKeep.push(item);
        }
    }

    let ticket = null;
    if (totalAmount > 0) {
        ticket = await ticketRepository.createTicket({
            amount: totalAmount,
            purchaser: purchaserEmail
        });
    }

    await cartRepository.updateCart(cartId, productsToKeep);

    return {
        ticket,
        unpurchasedProducts: productsToKeep.map(p => p.product._id)
    };
};