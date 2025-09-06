import jwt from 'jsonwebtoken'
import { env } from '../config/env.js';
import AppError from '../errorHelper/AppError.js';

export const checkAuth = () => (req, res, next) => {
    const accessToken = req.cookies.accessToken || req.headers.authorization;
    if (!accessToken) {
        throw new AppError(403, 'You get an 403 error')
    }

    const verifyToken = jwt.verify(accessToken, env.JWT_ACCESS_SECRET);

    req.user = verifyToken
    next()
}