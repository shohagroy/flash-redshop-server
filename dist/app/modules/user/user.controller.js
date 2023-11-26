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
exports.userController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const hashedPassword_1 = require("../../../utils/hashedPassword");
const jwtHelpers_1 = require("../../../utils/jwtHelpers");
const createNewUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const isAlreadyExist = yield user_service_1.userService.findById(email);
    if (isAlreadyExist === null || isAlreadyExist === void 0 ? void 0 : isAlreadyExist.id) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User Already Exits!");
    }
    req.body.password = yield hashedPassword_1.hashedPassword.createhas(req.body.password);
    const result = yield user_service_1.userService.insertUserToDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Create Successfully!",
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.findALl();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Get Successfully!",
        data: result,
    });
}));
const userLogin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const isAlreadyExist = yield user_service_1.userService.findById(email);
    if (!(isAlreadyExist === null || isAlreadyExist === void 0 ? void 0 : isAlreadyExist.id)) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User Not Found!");
    }
    const isPasswordMatched = yield hashedPassword_1.hashedPassword.comparePassword(password, isAlreadyExist.password);
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Password Not Matched!");
    }
    const token = yield jwtHelpers_1.jwtHelpers.createToken(isAlreadyExist, "24H");
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User Get Successfully!",
        data: { token },
    });
}));
exports.userController = {
    createNewUser,
    getAllUsers,
    userLogin,
};
