import { env } from "../config/env.js";

export const setAuthCookie = (res, cookieInfo) => {

    if (cookieInfo.accessToken) {
        res.cookie("accessToken", cookieInfo.accessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production" ? true : false,
            sameSite: env.NODE_ENV === "production" ? "none" : "lax"
        });
    }
    if (cookieInfo.refreshToken) {
        res.cookie("refreshToken", cookieInfo.refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production" ? true : false,
            sameSite: env.NODE_ENV === "production" ? "none" : "lax"
        });
    }

}