import bcrypt from "bcryptjs";
import {User} from "../models/user.model.js";
import {RefreshToken} from "../models/RefreshToken.js";
import {env} from "../config/env";
import {asyncHandler} from "../utils/asyncHandler.js";
import {HttpError} from "../utils/httpError.js";
import {signAccessToken, signRefreshToken, verifyRefreshToken} from "../utils/jwt.js";


const sanitizeUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    lastSeenAt: user.lastSeenAt,
    createdAt: user.createdAt
});

const refreshExpiry = () => {
    return new Date(Date.now() + env.refreshTokenTtlDays * 24 * 60 * 60 * 1000);
}

const buildAuthResponse = async(user) => {
    const accessToken = await signAccessToken(user);
    const refreshToken = await signRefreshToken(user);

    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiresAt: refreshExpiry()
    })

    return {
        user: sanitizeUser(user),
        accessToken,
        refreshToken
    };
};

const register = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if(!name || !normalizedEmail || !password){
        throw new HttpError(400, "Name, email and password are required");
    }

    // check existing user with same email address in Database.
    const existingUser = await User.findOne({email: normalizedEmail});
    if(existingUser){
        throw new HttpError(409, "Email is already in use");
    }

    const hashedPassword = await bcrypt.hash(password, env.bcryptRounds);
    const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff`
    });

    res.status(201).json(await buildAuthResponse(user));
});

const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if(!normalizedEmail || !password) {
        throw new HttpError(400, "Email and password are required");
    };

    const user = await User.findOne({email: normalizedEmail});
    if(!user){
        throw new HttpError(401, "Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if(!passwordMatches){
        throw new HttpError(401, "Invalid email or password");
    }

    res.json(await buildAuthResponse(user));
});

const refresh = asyncHandler(async(req, res) => {
    const {refreshToken} = req.body;
    if(!refreshToken) {
        throw new HttpError(400, "Refresh token is required");
    }

    const storedToken = await RefreshToken.findOne({token: refreshToken});
    if(!storedToken) {
        throw new HttpError(401, "Invalid refresh token");
    }

    const payload = await verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);

    if(!user){
        throw new HttpError(401, "Invalid refresh token: user not found");
    }

    await RefreshToken.deleteOne({_id: storedToken._id});

    res.json(await buildAuthResponse(user));
});

export const logout = () => asyncHandler(async(req, res) => {
    const {refreshToken} = req.body;

    if(refreshToken){
        await RefreshToken.deleteOne({token: refreshToken});
    }

    res.status(204).send();
});

export const me = asyncHandler(async(req, res) => {
    res.json({
        user: sanitizeUser(req.user)
    })
})