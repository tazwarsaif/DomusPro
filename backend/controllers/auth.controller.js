import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import User from "../models/user.model.js";

export const signup = async (req,res)=>{
    try {
        const {username,user_type,email,password} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error:"Invalid email fromat"});
        }
        const existingUser = await User.findOne({ where: { username } })
        if(existingUser){
            return res.status(400).json({error:"Username already Taken"})
        }
        const existingEmail = await User.findOne({where: {email}})
        if(existingEmail){
            return res.status(400).json({error:"Email already in use"})
        }
        if(password.length<6){
            return res.status(400).json({error:"Password must be at least 6 characters"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = await User.create({
            username,user_type,email,password:hashedPassword
        })
        
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            res.status(201).json({
                message: "User created Successfully."
            })
        }else{
            res.status(400).json({error:"Invalid User Data."})
        }
    } catch (error) {
        console.log("Error in signup controller:",error.message)
        res.status(500).json({error:"Server Error"})
    }
}

export const login = async (req,res)=>{
    console.log(req.body)
    try {
        const {username,password} = req.body;
        const user = await User.findOne({ where: { username } });
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: 'Invalid username or Password'})
        }
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            email: user.email
        })
    } catch (error) {
        console.log("Error in login controller:",error.message)
        res.status(500).json({eroor:"Server Error"})
    }
}

export const logout = async (req,res)=>{
    try {
        res.cookie('jwt',"",{maxAge:0});
        res.status(200).json({message:"logged out successfully!"})
    } catch (error) {
        console.log("Error in login controller:",error.message)
        res.status(500).json({eroor:"Server Error"})
    }
}

export const getMe = async (req,res) => {
    try {
        const user = await User.findOne(req.user._id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in login controller:",error.message)
        res.status(500).json({eroor:"Server Error"})
    }
}