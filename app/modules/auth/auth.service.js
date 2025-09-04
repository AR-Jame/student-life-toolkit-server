import { env } from "../../config/env.js";
import { generateToken } from "../../utils/jwt.js";
import { User } from "../user/user.model.js";
import bcrypt from "bcryptjs";

const credentialsLogin = async (payload) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(400, "Email Does not exist")
    }

    const isPasswordMatch = await bcrypt.compare(password, isUserExist.password)

    if (!isPasswordMatch) {
        throw new AppError(500, "Incorrect Password")
    }

    const userTokenData = {
        _id: isUserExist._id,
        email: isUserExist.email,
    }

    const accessToken = generateToken(userTokenData, env.JWT_ACCESS_SECRET, env.JWT_ACCESS_EXPIRES)
    const refreshToken = generateToken(userTokenData, env.JWT_REFRESH_SECRET, env.JWT_REFRESH_EXPIRES)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: passcode, ...rest } = isUserExist.toObject(); // for remove mongoose specific fields.
    return {
        accessToken,
        refreshToken,
        user: rest
    }
}

export const authServices = {
    credentialsLogin
}