import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

async function createUser(data) {
  try {
    const newUser = new User({
      name: data.name,
      email: data.email,
      password: data.password,
      dob: data.dob,
      avatar: data.avatar || "https://avatar.iran.liara.run/public/boy",
      bio: data.bio,
      interests: data.interests || [],
    });

    await newUser.save();
    return { success: true, message: "User created successfully" };
  } 
  catch (error) 
  {
    return { success: false, message: `Error while creating user ${error}` };
  }
}
async function findUser(id) {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    return null;
  }
}

async function updateUser(data) 
{
  // console.log(data);
  const update = 
  {
    name: data.name,
    dob: data.dob,
    avatar: data.avatar || "https://avatar.iran.liara.run/public",
    bio: data.bio,
    socialLinks: data.socialLinks || [],
    interests: data.interests || [],
  };
  // console.log(update);
  try 
  {
    let result = await User.findByIdAndUpdate(data._id, update);
    // console.log(result);
    return { success: true, message: "User updated successfully" };
  } 
  catch (error) 
  {
    console.log(error);
    return { success: false, message: `Error while updating user ${error}` };
  }
}

async function loginUser(data) {
  try 
  {
    const { email, password } = data;
    const user = await User.findOne({ email }).select("+password");
    if (!user) 
    {
      return { success: false, message: "User not found" };
    }
    const isRight = await bcrypt.compare(password, user.password);
    if (!isRight) 
    {
      return { success: false, message: "Invalid credentials" };
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const { password: pass, ...rest } = user;
    return { success: true, token, rest};
  }
  catch (error) 
  {
    return { success: false, message: `Error while logging in ${error}` };
  }
}





export { createUser, findUser, updateUser, loginUser };
