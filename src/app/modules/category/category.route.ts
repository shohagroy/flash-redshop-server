import express from "express";
import auth from "../../middlewares/auth";
import { categoryController } from "./category.controller";
import { ENUM_USER_ROLE } from "../user/user.constants";

const router = express.Router();

router
  .route("/create-category")
  .post(
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    categoryController.createNewCategory
  );

export const categoryRoutes = router;
