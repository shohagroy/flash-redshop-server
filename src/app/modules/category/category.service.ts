import { Category } from "@prisma/client";
import prisma from "../../../shared/prisma";
import imagesUpload from "../../../helpers/imagesUpload";

const insertCategoryToDB = async (tittle: string, imageBlob: string[]) => {
  const result = await prisma.$transaction(async (prismaTransaction) => {
    const images = await imagesUpload(imageBlob);

    const category = await prismaTransaction.category.create({
      data: {
        tittle: tittle,
      },
    });
    const iconInfo = {
      categoryId: category?.id,
      public_id: images[0]?.public_id,
      secure_url: images[0]?.secure_url,
    };
    await prismaTransaction.categoryImage.create({ data: iconInfo });
    return category;
  });
  return result;
};

const findByName = async (name: string): Promise<Category | null> => {
  const result = await prisma.category.findUnique({
    where: {
      tittle: name,
    },
  });

  return result;
};

const findALl = async () => {
  const result = await prisma.category.findMany({
    include: {
      images: true,
    },
  });

  return result;
};

export const categoryService = {
  insertCategoryToDB,
  findByName,
  findALl,
};
