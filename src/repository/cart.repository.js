import CartModel from "../dao/models/cartModel.js";

export default class CartRepository {
    constructor() {
        this.dao = CartModel;
    }
    
    async getCartById(id) {
        return await this.dao.findById(id).populate("products.product");
    }

    async updateCart(id, products) {
        return await this.dao.findByIdAndUpdate(id, { products }, { new: true });
    }
}