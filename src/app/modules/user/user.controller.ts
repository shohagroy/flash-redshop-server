import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { User } from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import { hashedPassword } from "../../../utils/hashedPassword";
import { jwtHelpers } from "../../../utils/jwtHelpers";

const createNewUser = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const isAlreadyExist = await userService.findById(email);

  if (isAlreadyExist?.id) {
    throw new ApiError(httpStatus.CONFLICT, "User Already Exits!");
  }
  req.body.password = await hashedPassword.createhas(req.body.password);

  const result = await userService.insertUserToDB(req.body);
  sendResponse<User>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Create Successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.findALl();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Get Successfully!",
    data: result,
  });
});

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const isAlreadyExist = await userService.findById(email);

  if (!isAlreadyExist?.id) {
    throw new ApiError(httpStatus.CONFLICT, "User Not Found!");
  }

  const isPasswordMatched = await hashedPassword.comparePassword(
    password,
    isAlreadyExist.password
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.CONFLICT, "Password Not Matched!");
  }

  const token = await jwtHelpers.createToken(isAlreadyExist, "24H");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Get Successfully!",
    data: { token },
  });
});

export const userController = {
  createNewUser,
  getAllUsers,
  userLogin,
};
