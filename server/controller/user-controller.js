import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Token from '../model/token.js'
import User from '../model/user.js';
import passport from 'passport'
dotenv.config();

export const singupUser = async (request, response) => {
    try {
        // const salt = await bcrypt.genSalt();
        // const hashedPassword = await bcrypt.hash(request.body.password, salt);
        const hashedPassword = await bcrypt.hash(request.body.password, 10);

        const user = { username: request.body.username, name: request.body.name, password: hashedPassword,role:request.body.role }

        const newUser = new User(user);
        await newUser.save();

        return response.status(200).json({ msg: 'Signup successfull' });
    } catch (error) {
        return response.status(500).json({ msg: 'Error while signing up user' });
    }
}


export const loginUser = async (request, response) => {
    //checking if the user exist in database
    // let isAdmin = false;
    let user = await User.findOne({ username: request.body.username });
    if (!user) {
        return response.status(400).json({ msg: 'Username does not match' });
    }

    try {
        //if user matches then also have to compare the password
        //comparing the password provided by user to the password saved in the database
        let match = await bcrypt.compare(request.body.password, user.password);
        // let role = await request.body.role;
        // console.log("role is", role);
        if (match) {
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m'});
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
            
            const newToken = new Token({ token: refreshToken });
            await newToken.save();
        
            response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken,name: user.name, username: user.username,role:user.role,state:user.state });
        
        } else {
            response.status(400).json({ msg: 'Password does not match' })
        }
        // let role = await request.body.role;
        // if(role=='admin'){
        //     isAdmin = true;
        // }
    } catch (error) {
        response.status(500).json({ msg: 'error while login the user' })
    }
}
//Admin login


export const logoutUser = async (request, response) => {
    const token = request.body.token;
    await Token.deleteOne({ token: token });

    response.status(204).json({ msg: 'logout successfull' });
}

//passport authetication
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });


export const getUsers = async (request, response) => {
    try {
      const users = await User.find({ state: { $ne: 'blocked' } }, 'name');
      response.json(users);
    } catch (error) {
      console.log("Error while fetching users", error);
      response.status(500).json({ message: "Server error" });
    }
  };
    

// export const blockUser = async (request, response) => {
//     try {
//       const blockUser = await User.findById(request.params.id);
//       if (blockUser) {
//         console.log("Block user found");
//         // await blockUser.remove();
//         response.status(200).json({ message: "User blocked successfully" });
//       } else {
//         response.status(404).json({ message: "User not found" });
//       }
//     } catch (error) {
//       console.log("Error while fetching user to block", error);
//       response.status(500).json({ message: "Server error in block" });
//     }
//   };
  
  export const blockUser = async (request, response) => {
    try {
      const userId = await User.findById(request.params.id);
      const user = await User.findByIdAndUpdate(userId, { state: 'blocked' }, { new: true });
      response.status(200).json(user);

     
    } catch (error) {
      console.log("Error while fetching user to block", error);
      response.status(500).json({ message: "Server error in block" });
    }
  };
  
export const homePage = async (request,response)=>{
    try{
        let nameObj={
            
                myName:'ayush',
                myPos:'MERN stack'
        }
        response.json(nameObj);

        
    } catch(error){
        console.log("error found",error);
        response.status(500).json({message:"server error"})
    }
}