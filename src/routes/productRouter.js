import { Router } from "express";
import passport from "passport";
import * as productController from "../controllers/product.controller.js";
import { authorization } from "../middlewares/auth.js"; 

const router = Router();

router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);

router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    authorization(["ADMIN"]), 
    productController.createProduct
);

router.put(
    "/:pid",
    passport.authenticate("jwt", { session: false }),
    authorization(["ADMIN"]),
    productController.updateProduct
);

router.delete(
    "/:pid",
    passport.authenticate("jwt", { session: false }),
    authorization(["ADMIN"]),
    productController.deleteProduct
);

export default router;