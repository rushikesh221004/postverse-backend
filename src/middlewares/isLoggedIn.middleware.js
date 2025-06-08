import { ApiError } from "../utils/apiError.util.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

const isLoggedIn = (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
    
        if(!refreshToken) {
            return res.status(401).json(new ApiError(401, "You are not logged in. Please log in to access this resource."));
        }
    
        const verifiedUser = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        if(!verifiedUser) {
            return res.status(401).json(new ApiError(401, "Invalid refresh token. Please log in again."))
        }
    
        req.user = verifiedUser;
        next();
    } catch (error) {
        res.status(401).json(new ApiError(401, "Invalid refresh token. Please log in again."));
    }
}

export default isLoggedIn;