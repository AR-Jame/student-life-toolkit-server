import { env } from "../../config/env.js";
import AppError from "../../errorHelper/AppError.js";
import { User } from "./user.model.js";
import bcrypt from "bcryptjs";

const createUser = async (payload) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email: email });
    if (isUserExist) {
        throw new AppError(500, "Email already exists.")
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(env.BCRYPT_SALT_ROUND));

    const user = await User.create({
        email,
        password: hashedPassword,
        ...rest
    });
    return user
}

const getMe = async (userId) => {
    const user = await User.findById(userId);
    const { password, ...rest } = user.toObject();
    return rest
}

export const userServices = {
    createUser,
    getMe
}