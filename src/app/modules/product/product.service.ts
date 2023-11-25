import prisma from "../../../shared/prisma";
import imagesUpload from "../../../helpers/imagesUpload";
import { Prisma, Product } from "@prisma/client";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IProductFilters } from "./product.interface";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import {
  productFilterableFields,
  productSearchableFields,
} from "./product.constants";

const insertProductToDB = async (data: Product, imageBlob: string[]) => {
  const result = await prisma.$transaction(async (prismaTransaction) => {
    const images = await imagesUpload(imageBlob);

    const product = await prismaTransaction.product.create({
      data,
    });

    const imagesInfo = images.map((image) => ({
      secure_url: image.secure_url,
      public_id: image.public_id,
      productId: product.id,
    }));

    await prismaTransaction.productImage.createMany({
      data: imagesInfo,
    });

    return product;
  });
  return result;
};

const findALl = async (
  paginationOptions: IPaginationOptions,
  filters: IProductFilters
) => {
  const { size, page, skip } =
    paginationHelpers.calculatePagination(paginationOptions);
  const { searchTerm, categoryId } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: productSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (categoryId) {
    andConditions.push({
      AND: [
        {
          categoryId: {
            equals: categoryId,
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.ProductWhereInput | {} =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.product.findMany({
    where: whereConditions,
    include: {
      images: true,
      category: true,
    },
    skip,
    take: size,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.product.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      size,
    },
    data: result,
  };
};

export const productService = {
  insertProductToDB,
  findALl,
};
