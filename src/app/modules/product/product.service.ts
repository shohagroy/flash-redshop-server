import prisma from "../../../shared/prisma";
import imagesUpload from "../../../helpers/imagesUpload";
import { Product } from "@prisma/client";

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

const findALl = async () => {
  const result = await prisma.product.findMany({
    include: {
      images: true,
      category: true,
    },
  });

  return result;
};

export const productService = {
  insertProductToDB,
  findALl,
};
