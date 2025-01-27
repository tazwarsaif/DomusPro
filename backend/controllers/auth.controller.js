import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import User from "../models/user.model.js";

export const signup = async (req,res)=>{
    try {
        const {fullName,username,email,password} = req.body;
        console.log(req.body);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error:"Invalid email fromat"});
        }
        const existingUser = await User.findOne({username:username})
        if(existingUser){
            return res.status(400).json({error:"Username already Taken"})
        }
        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({error:"Email already in use"})
        }
        if(password.length<6){
            return res.status(400).json({error:"Password must be at least 6 characters"})
        }
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullName,
            username,
            email,
            password:hasedPassword
        })
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save()
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg
            })
        }else{
            res.status(400).json({eroor:"Invalid User Data."})
        }
    } catch (error) {
        console.log("Error in signup controller:",error.message)
        res.status(500).json({eroor:"Server Error"})
    }
}

export const login = async (req,res)=>{
    console.log(req.body)
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: 'Invalid username or Password'})
        }
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg
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