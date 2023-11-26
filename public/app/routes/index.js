"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const category_route_1 = require("../modules/category/category.route");
const product_route_1 = require("../modules/product/product.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: user_route_1.userRoutes,
    },
    {
        path: "/categories",
        route: category_route_1.categoryRoutes,
    },
    {
        path: "/products",
        route: product_route_1.productsRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
