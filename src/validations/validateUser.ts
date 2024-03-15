import Joi from 'joi';

const userSchema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().min(5).max(30).required(),
    phone: Joi.string(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'user').default('admin'),
});

const validateUser = (req: any, res: any, next: any) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({status:"error", message: error.details[0].message });
    }
    next();
};

export default validateUser;