import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const register=async(req,res,next)=>{
    const{firstName,lastName,email,password}=req.body;
    //validate the fields
    if(!(firstName || lastName || email || password)){
        next("Provide Required Fields!");
        return;
    }

    try{
        //if email already registered
        const userExist=await Users.findOne({email});
        if(userExist){
            next("Email Address already exist");
            return;
        }
        //if donot exist create new one
        const hashedPassword=await hashString(password);

        //create the user
        const user=await Users.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,

        });

        //when the account is successfull send verification email
        sendVerificationEmail(user,res);

    }catch(error){
        console.log(error);
        res.status(404).json({message:error.message});
    }



};


export const login=async(req,res,next)=>{
    const{email,password}=req.body;
    try{
        //validation
        if(!email||!password){
            next("Please provide User Credentials");
            return;
        }
        //find user by mail
        const user=await Users.findOne({email}).select("+password").populate({
            path:"friends",
            select:"firstName lastName location profileUrl -password",
        });

            //if user doesnot exist
        if(!user){
            next("Invalid email or password");
            return;
        }

            //if verified property result false
        if(!user?.verified){
            next(
                "User email is not verified.Check your email account and verify your email"
            );
            return;
        }

        //if account got verified
        const isMatch=await compareString(password,user?.password);


        if(!isMatch){
            next("Invalid email or password");
            return;
        }

        user.password=undefined;
        const token=createJWT(user?._id);

        //sending feedback to the user
        res.status(201).json({
            success:true,
            message:"Login Successfully",
            user,
            token,
        });

    }
    catch(error){
        console.log(error);
        res.status(404).json({message:error.message});
    }
};
