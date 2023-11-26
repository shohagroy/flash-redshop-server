"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const imagesUpload_1 = __importDefault(require("../../../helpers/imagesUpload"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const product_constants_1 = require("./product.constants");
const insertProductToDB = (data, imageBlob) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((prismaTransaction) => __awaiter(void 0, void 0, void 0, function* () {
        const images = yield (0, imagesUpload_1.default)(imageBlob);
        const product = yield prismaTransaction.product.create({
            data,
        });
        const imagesInfo = images.map((image) => ({
            secure_url: image.secure_url,
            public_id: image.public_id,
            productId: product.id,
        }));
        yield prismaTransaction.productImage.createMany({
            data: imagesInfo,
        });
        return product;
    }));
    return result;
});
const findALl = (paginationOptions, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { size, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm, categoryId } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: product_constants_1.productSearchableFields.map((field) => ({
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.product.findMany({
        where: whereConditions,
        include: {
            images: true,
            category: true,
        },
        skip,
        take: size,
        orderBy: paginationOptions.sortBy && paginationOptions.sortOrder
            ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.product.count({
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
});
exports.productService = {
    insertProductToDB,
    findALl,
};
