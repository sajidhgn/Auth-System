import path from 'path';
import fs from 'fs';
import {UserModel} from "../models/User";
import {generateToken} from "../middlewares/verifyJwt";
import passport from '../config/passport';
import { generateRandomPassword } from '../utils/helpers';
import { bcryptPassword } from '../middlewares/verifyJwt';
import { createTransporter } from '../utils/helpers';
import { VerificationCodeModel } from '../models/verificationToken.model';

// User Registration
export const userRegistration = async (req: any, res: any, next: any) => {
    const {name, email, password, phone} = req.body
    const user = await UserModel.findOne({email: email})

    if (user) {
        res.json({"status": "warning", "message": "Email already exists"})
    } else {
        try {
            const getUser = await UserModel.create(req.body);
            return res.json({
                "status": "success", "message": "Registration Success", "user": getUser});
        } catch (error) {
            res.json({
                message: "Internal server error",
                status: "error"
            });
        }
    }
};

// User Login
export const userLogin = (req: any, res: any, next: any) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
        try {
            if (err) {
                throw err;
            }
            if (!user) {
                let errorMessage = "Login failed. Please check your credentials.";
                if (info && info.message) {
                    errorMessage = info.message;
                }
                return res.json({"status": "error", "message": errorMessage});
            }
            // If authentication is successful, generate JWT token or perform other actions
            const token = generateToken(user);
            return res.json({"status": "success", "message": "Login Success", "token": token, "user": user});
        } catch (error) {
             res.json({"status": "error", "message": "Unable to Login"});
        }
    })(req, res, next);
};

// Forgot Password
export const forgotPassword = async (req: any, res: any) => {
    const { email } = req.body;
    const user = await UserModel.findOne({"email":email});
    try {
        if (!user) {
            return res.json({"status": "error", message: 'Email is not valid'});
        }
        // 6 digits code generate
        const code = generateRandomPassword(6);
        await VerificationCodeModel.create({email:email, code: code});

        // send email template with generate code
        const templatePath = path.join(__dirname, '../utils/email-template.html');
        const template = fs.readFileSync(templatePath, 'utf-8');
        const htmlContent = template.replace('{{verificationCode}}', code);

        const transporter = createTransporter();
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Forgot Password',
            html: htmlContent,
          };
        
          transporter.sendMail(mailOptions, (error:any, info:any) => {
            if (error) {
              return res.status(500).json({ error: error.toString() });
            }
            res.status(200).json({ message: 'Email sent successfully', info });
          });
       

    } catch (error) {
        res.json({"status": "error", message: 'Internal Server Error'});
    }
};

// Reset password
export const resetPassword = async (req:any, res:any) => {
    const { email, verificationCode, newPassword } = req.body;
  
    try {
      // Check if the verification code is valid
      const storedVerificationCode = await VerificationCodeModel.findOne({ email });
      if (!storedVerificationCode || storedVerificationCode.code !== verificationCode) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }
  
      // Hash the new password
      const hashedPassword = await bcryptPassword(newPassword);
  
      // Update the user's password
      const user = await UserModel.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Delete the verification code from the VerificationCodes collection
      const deletedCode = await VerificationCodeModel.findOneAndDelete({ email });
      console.log('Deleted verification code:', deletedCode);
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // get by id
export const getUserById = async (req: any, res: any) => {
    try {
        const user = await UserModel.findById(req.params.id);
        if (!user) {

            return res.json({"status": "error", "message": "User not found"});
        }
        res.json(user);
    } catch (error) {
        res.json({"status": "error", message: 'Internal Server Error'});
    }
};

// update user
export const updateUser = async (req: any, res: any) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!user) {
            return res.json({"status": "error", message: 'User not found'});
        }
        res.json(user);
    } catch (error) {
        res.json({"status": "error", message: 'Internal Server Error'});
    }
};

// logout
export const logoutUser = async (req: any, res: any) => {
    try {
        const user = await UserModel.findById(req.body.userId);
        if (!user) {

            req.session.destroy((error: any) => {
                if (error) {
                    return res.json({"status": "error", message: 'Error logging out'});
                }
                return res.json({"status": "success", message: 'Logout successful'});

            });
        }

    } catch (error) {
         res.json({"status": "error", message: 'Internal Server Error'});
    }

};