import express from "express"
import { loginUser, logoutUser, registerUser, userProfile } from "../controllers/Auth.controller.js"
import { loginUserValidator, registerUserValidator } from "../validators/Auth.validator.js"
import validate from "../middlewares/Validation.middleware.js"
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js"

const authRoutes = express.Router()

authRoutes.route("/register").post(registerUserValidator(), validate,registerUser)
authRoutes.route("/login").post(loginUserValidator(), validate,loginUser)
authRoutes.route("/logout").post(isLoggedIn ,logoutUser)
authRoutes.route("/profile").get(isLoggedIn, userProfile)


export default authRoutes