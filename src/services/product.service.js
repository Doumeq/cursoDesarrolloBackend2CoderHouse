import ProductRepository from "../repository/product.repository.js";

const productRepository = new ProductRepository();

export const getProductsService = async (filter, options) => {
    return await productRepository.getProducts(filter, options);
};

export const getProductByIdService = async (id) => {
    return await productRepository.getProductById(id);
};

export const createProductService = async (productData) => {
    return await productRepository.createProduct(productData);
};

export const updateProductService = async (id, productData) => {
    return await productRepository.updateProduct(id, productData);
};

export const deleteProductService = async (id) => {
    return await productRepository.deleteProduct(id);
};