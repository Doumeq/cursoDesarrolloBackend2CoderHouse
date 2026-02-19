import ProductModel from "../dao/models/productModel.js";

export default class ProductRepository {
    constructor() {
        this.dao = ProductModel;
    }

    async getProducts(filter, options) {
        return await this.dao.paginate(filter, options);
    }

    async getProductById(id) {
        return await this.dao.findById(id);
    }

    async createProduct(productData) {
        return await this.dao.create(productData);
    }

    async updateProduct(id, productData) {
        return await this.dao.findByIdAndUpdate(id, productData, { new: true });
    }

    async deleteProduct(id) {
        return await this.dao.findByIdAndDelete(id);
    }
}