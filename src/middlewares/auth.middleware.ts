import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config";
import {UserModel} from "../models/user.model";
export const bcryptPassword = async (password:any) => {
    const salt = await bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

export const generateToken=(user: any): string => {
    const payload = {
        sub: user.id
    };

    return jwt.sign(payload, config.secret, { expiresIn: '1d' });
}

export  const checkUserAuth = async (req:any, res:any, next:any) => {
    let token
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            // Get Token from header
            token = authorization.split(' ')[1]

            // Verify Token
            const { userID }:any = jwt.verify(token, config.secret)

            req.user = await UserModel.findById(userID).select('id')

            next()
        } catch (error) {

            res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
        }
    }
    if (!token) {
        res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
    }
}
