import * as productService from "../services/product.service.js";

export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const filter = query ? { category: query } : {};
        const options = { limit, page, sort: sort ? { price: sort === "asc" ? 1 : -1 } : {} };

        const products = await productService.getProductsService(filter, options);
        res.json({ status: "success", payload: products });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductByIdService(req.params.pid);
        if (!product) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        res.json({ status: "success", payload: product });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createProductService(req.body);
        res.status(201).json({ status: "success", payload: newProduct });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productService.updateProductService(req.params.pid, req.body);
        if (!updatedProduct) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        res.json({ status: "success", payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await productService.deleteProductService(req.params.pid);
        if (!deletedProduct) return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        res.json({ status: "success", message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};