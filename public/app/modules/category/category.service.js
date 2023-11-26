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
exports.categoryService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const imagesUpload_1 = __importDefault(require("../../../helpers/imagesUpload"));
const insertCategoryToDB = (tittle, imageBlob) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((prismaTransaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const images = yield (0, imagesUpload_1.default)(imageBlob);
        const category = yield prismaTransaction.category.create({
            data: {
                tittle: tittle,
            },
        });
        const iconInfo = {
            categoryId: category === null || category === void 0 ? void 0 : category.id,
            public_id: (_a = images[0]) === null || _a === void 0 ? void 0 : _a.public_id,
            secure_url: (_b = images[0]) === null || _b === void 0 ? void 0 : _b.secure_url,
        };
        yield prismaTransaction.categoryImage.create({ data: iconInfo });
        return category;
    }));
    return result;
});
const findByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findUnique({
        where: {
            tittle: name,
        },
    });
    return result;
});
const findALl = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany({
        include: {
            images: true,
            products: {
                include: {
                    images: true,
                },
            },
        },
    });
    return result;
});
exports.categoryService = {
    insertCategoryToDB,
    findByName,
    findALl,
};
