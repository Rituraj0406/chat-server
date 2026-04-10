import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';


export const signAccessToken = (user) => {
    return jwt.sign({ sub: user._id, email: user.email }, env.jwtAccessSecret, { expiresIn: env.accessTokenTtl });
}

export const signRefreshToken = (user) => {
    return jwt.sign(
        {
            sub: user._id,
            jti: crypto.randomUUID()
        },
        env.jwtRefreshSecret,
        {expiresIn: `${env.refreshTokenTtlDays}d`}
    )
}

export const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret);

export const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);