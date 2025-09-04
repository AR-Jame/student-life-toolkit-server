import jwt from 'jsonwebtoken'


export const generateToken = (payload, secret, expiredIn) => {
    const token = jwt.sign(payload, secret, { expiresIn: expiredIn })

    return token
}


export const verifyToken = (token, secret) => {
    const verifiedToken = jwt.verify(token, secret);

    return verifiedToken
}