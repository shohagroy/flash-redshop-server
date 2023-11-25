import express from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "./user.constants";

const router = express.Router();

router.route("/create-user").post(
  // auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  userController.createNewUser
);

router
  .route("/login")
  .post(
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    userController.userLogin
  );

router
  .route("/")
  .get(
    auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
    userController.getAllUsers
  );

export const userRoutes = router;
