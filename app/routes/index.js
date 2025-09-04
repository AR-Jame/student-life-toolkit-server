import { Router } from "express";
import { userRoutes } from "../modules/user/user.route.js";
import { authRoutes } from "../modules/auth/auth.route.js";
import { scheduleRoute } from "../modules/schedule-tracker/schedule-tracker.route.js";

export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/schedule",
        route: scheduleRoute
    },
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})