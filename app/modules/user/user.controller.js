import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { userServices } from "./user.services.js";

const createUser = catchAsync(async (req, res) => {
    const user = await userServices.createUser(req.body);

    sendResponse(res, {
        statusCode: 201,
        data: user,
        message: "User created Successfully",
        success: true
    })

})

const getMe = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const user = await userServices.getMe(userId);

    sendResponse(res, {
        statusCode: 200,
        data: user,
        message: "User retrieved Successfully",
        success: true
    })

})


export const userController = {
    createUser,
    getMe
};