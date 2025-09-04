export const setAuthCookie = (res, cookieInfo) => {

    if (cookieInfo.accessToken) {
        res.cookie("accessToken", cookieInfo.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
    }
    if (cookieInfo.refreshToken) {
        res.cookie("refreshToken", cookieInfo.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
    }

}