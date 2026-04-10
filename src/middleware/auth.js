import {User} from '../models/User';
import { HttpError } from '../utils/httpError';
import { verifyAccessToken } from '../utils/token';

const authMiddleware = async(req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return next(new HttpError(401, 'Authentication required'));
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyAccessToken(token);
        const user = await User.findById(payload.sub).select(-password);

        if(!user){
            throw new HttpError(404, 'Invalid token: user not found');
        }
        req.user = user;
        next();
    } catch(err) {
        next(new HttpError(401, err.message ||'Invalid access token'));
    }
}