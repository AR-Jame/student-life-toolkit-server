import { Router } from "express";
import { userRoutes } from "../modules/user/user.route.js";
import { authRoutes } from "../modules/auth/auth.route.js";
import { scheduleRoute } from "../modules/schedule-tracker/schedule-tracker.route.js";
import { budgetRoutes } from "../modules/Budget/budget.route.js";
import { examRoutes } from "../modules/Exam/exam.route.js";

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
    {
        path: "/budget",
        route: budgetRoutes
    },
    {
        path: "/exam",
        route: examRoutes
    },
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})