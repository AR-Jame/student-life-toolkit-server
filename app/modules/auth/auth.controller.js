import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { setAuthCookie } from "../../utils/setAuthCookie.js";
import { authServices } from "./auth.service.js";

const credentialsLogin = catchAsync(async (req, res) => {
    const user = await authServices.credentialsLogin(req.body);

    setAuthCookie(res, user);

    sendResponse(res, {
        statusCode: 201,
        data: user,
        message: "User logged in successfully",
        success: true
    })

})

const logout = catchAsync(async (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Logout successfully.',
        data: {}
    })
})

export const authControllers = {
    credentialsLogin,
    logout
};