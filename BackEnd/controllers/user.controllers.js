const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { sendMail } = require("../utils/mail.util.js");

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
    await sendMail(data.name, data.email, 'CreateAccount');
    return { success: true, message: "User created successfully" };
  } 
  catch (error) 
  {
    return { success: false, message: `Error while creating user ${error}` };
  }
}
async function findUser(id) {
  try {
    const user = await User.findById(id)
    .populate('articles')
    .populate('contributions.articleId')
    .populate('readArticles')
    .populate('lastRead');
    return user;
  } catch (error) {
    return null;
  }
}

async function updateUser(data) 
{
  const update = 
  {
    name: data.name,
    dob: data.dob,
    avatar: data.avatar || "https://avatar.iran.liara.run/public",
    bio: data.bio,
    socialLinks: data.socialLinks || [],
    interests: data.interests || [],
  };
  try 
  {
    let result = await User.findByIdAndUpdate(data._id, update);
    return { success: true, message: "User updated successfully" };
  } 
  catch (error) 
  {
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
    
    await sendMail(data.name, data.email, 'Login');
    return { success: true, token, rest};
  }
  catch (error) 
  {
    return { success: false, message: `Error while logging in ${error}` };
  }
}


const client = new OAuth2Client(process.env.client_id);


async function googleLogin(token) 
{
  try 
  {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.client_id,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const avatar = payload.picture;

    let user = await User.findOne({ email });
    if (!user) 
    {
      user = new User({
        name,
        email,
        avatar,
        password: "GooGleAuthAccount",
      });
      await sendMail(name, email, 'CreateAccount');   
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    
    const { ...userWithoutPassword } = user.toObject();
    await sendMail(name, email, 'Login');
    return { success: true, token: jwtToken, user: userWithoutPassword };
  } catch (error) {
    return { success: false, message: "Error during Google login" };
  }
}

function findUserByEmail(email) 
{
  return User.findOne({ email});
}

module.exports = { createUser, findUser, updateUser, loginUser, googleLogin, findUserByEmail };
