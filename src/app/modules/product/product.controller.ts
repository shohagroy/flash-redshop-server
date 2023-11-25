import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { Product } from "@prisma/client";
import { productService } from "./product.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { productFilterableFields } from "./product.constants";

const createNewProduct = catchAsync(async (req: Request, res: Response) => {
  const { images, ...others } = req.body;

  const result = await productService.insertProductToDB(others, images);
  sendResponse<Product>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product Create Successfully!",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filters = pick(req.query, productFilterableFields);

  const result = await productService.findALl(paginationOptions, filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products Get Successfully!",
    data: result,
  });
});

export const productController = {
  createNewProduct,
  getAllProducts,
};
