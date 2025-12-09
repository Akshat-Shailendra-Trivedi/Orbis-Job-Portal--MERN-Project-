import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "Please enter your name"],
        maxLength:[30, "Name cannot exceed 30 characters"],
        minLength:[4, "Name should have more than 4 characters"]
    },
    email:{
        type: String,
        required:[true, "Please enter your email"],
        unique:true,
        validate:[validator.isEmail, "Please enter valid email address"]
    },
    phone:{
        type: String,
        required:[true, "Please enter your phone number"],
        unique:true
    },
    address:{
        type: String,
        required:[true, "Please enter your address"]
    },
    niches:{
        firstNiche: String,
        secondNiche: String,
        thirdNiche: String,
       
    },
    password:{
        type: String,
        required:[true, "Please enter your password"],
        minLength:[8, "Password should be greater than 8 characters"],
        maxLength:[32, "Password should be less than 32 characters"],
        select: false
    },
    resume:{
        public_id: String,
        url: String
    },
    coverLetter:{
        type: String
    },
    role:{
        type: String,
        required:true,
        enum: ["Job Seeker", "Job Provider"]

    },
    createdAt:{
        type: Date,
        default: Date.now
    },
});


userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}


userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}



export const User  = mongoose.model("User", userSchema);