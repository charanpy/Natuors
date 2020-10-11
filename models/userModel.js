const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
            name: {
                        type: String,
                        required: [true, 'Please provide your name']
            },
            email: {
                        type: String,
                        required: [true, 'Please provide your email'],
                        unique: true
            },
            password: {
                        type: String,
                        required: [true, 'Please provide your password'],
                        minlength: 8,
                        select: false
            },
            role: {
                        type: String,
                        enum: ['user', 'guide', 'lead-guide', 'admin'],
                        default: 'user'
            },
            passwordChangedAt: {
                        type: Date
            },
            passwordConfirm: {
                        type: String,
                        required: [true, 'Please confirm your password'],
                        minlength: 8,
                        validate: {
                                    //This works on create and  save
                                    validator: function (el) {
                                                return el === this.password
                                    },
                                    message: 'Passwords are not same'
                        }
            },
            passwordResetToken: String,
            passwordResetExpires: Date,
            active: {
                        type: Boolean,
                        default: true,
                        select: false
            }
})

//~Hashing password
userSchema.pre("save", async function (next) {
            //to check password is changed or not (while updating)
            if (!this.isModified("password")) return next()

            this.password = await bcrypt.hash(this.password, 12);
            this.passwordConfirm = undefined;
            next();
})

//^creating passwordChangedAt
userSchema.pre("save", function (next) {
            if (!this.isModified("password") || this.isNew) return next();
            this.passwordChangedAt = Date.now() - 1000;
            next();
})

//*Compare password
userSchema.methods.correctPassword = async function (canditatePassword, userPassword) {
            return await bcrypt.compare(canditatePassword, userPassword);
}


userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
            if (this.passwordChangedAt) {
                        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
                        console.log(changedTimestamp, JWTTimestamp)

                        return JWTTimestamp < changedTimestamp
            }

            return false;
}
//^Password Reset Token
userSchema.methods.createPasswordResetToken = function () {
            const resetToken = crypto.randomBytes(32).toString('hex');

            this.passwordResetToken = crypto
                        .createHash('sha256')
                        .update(resetToken)
                        .digest('hex');

            this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

            return resetToken;

}

//^Filter out inactive user
userSchema.pre(/^find/, function (next) {
            this.find({ active: { $ne: false } })
            next();
})

const User = mongoose.model("User", userSchema);
module.exports = User;