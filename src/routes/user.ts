const express = require('express');
const router = express.Router();
import {userController} from "../controllers";
import {checkUserAuth} from "../middlewares/verifyJwt";
import validateUser from "../validations/validateUser";

const userRoute =router
    .post('/signup',validateUser, userController.userRegistration)
    .post('/login', userController.userLogin)
    .post('/logout',checkUserAuth, userController.logoutUser)
    .post('/forgot-password', userController.forgotPassword)
    .put('/reset-password', userController.resetPassword)
    // .get('/user/:id', userController.getUserById)
    .put('/:id', checkUserAuth, userController.updateUser)

export default userRoute;