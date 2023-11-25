import { User } from "@prisma/client";
import prisma from "../../../shared/prisma";

const insertUserToDB = async (data: User): Promise<User> => {
  const result = await prisma.user.create({
    data: data,
  });

  return result;
};

const findById = async (email: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return result;
};

const findALl = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

export const userService = {
  insertUserToDB,
  findById,
  findALl,
};
