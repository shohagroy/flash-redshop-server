import express from "express";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../user/user.constants";
import { productController } from "./product.controller";

const router = express.Router();

router
  .route("/create-product")
  .post(
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    productController.createNewProduct
  );

router.route("/").get(
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  productController.getAllProducts
);

export const productsRoutes = router;
