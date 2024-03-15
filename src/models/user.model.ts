import mongoose, {Schema, Document} from 'mongoose';
import {bcryptPassword} from "../middlewares/auth.middleware";


const UserSchema: Schema = new Schema({
    meta_tags:{
        metaTitle: {type: String},
        slug: {type: String},
        MetaDescription: {type: String},
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "admin"
    },
}, {timestamps: true});

// Password hash function
UserSchema.pre('save', async function (next) {
    const user = this;
    try {
        const hashedPassword = await bcryptPassword(user.password);
        user.password = hashedPassword;
        next();
    } catch (error:any) {
        return next(error);
    }
});
export const UserModel = mongoose.model('users', UserSchema);
