import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { Category } from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import { categoryService } from "./category.service";

const createNewCategory = catchAsync(async (req: Request, res: Response) => {
  const { tittle, icon } = req.body;

  const isAlreadyExist = await categoryService.findByName(tittle);

  if (isAlreadyExist?.id) {
    throw new ApiError(httpStatus.CONFLICT, "Category Already Exits!");
  }

  const result = await categoryService.insertUserToDB(tittle, icon);
  sendResponse<Category>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category Create Successfully!",
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.findALl();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories Get Successfully!",
    data: result,
  });
});

export const categoryController = {
  createNewCategory,
  getAllCategories,
};
