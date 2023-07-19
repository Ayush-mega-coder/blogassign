import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GoogleButton from "react-google-button";

import {
  TextField,
  Box,
  Button,
  Typography,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { API } from "../../service/api";
import { DataContext } from "../../context/DataProvider";

const Component = styled(Box)`
  width: 400px;
  margin: auto;
  box-shadow: 5px 2px 5px 2px rgb(0 0 0/ 0.6);
`;

const Image = styled("img")({
  width: 100,
  display: "flex",
  margin: "auto",
  padding: "10px 0 0",
});
const GButton = styled(GoogleButton)`
margin-left:45px;
`

const Wrapper = styled(Box)`
  padding: 25px 35px;
  display: flex;
  flex: 1;
  overflow: auto;
  flex-direction: column;
  & > div,
  & > button,
  & > p {
    margin-top: 20px;
  }
`;

const LoginButton = styled(Button)`
  text-transform: none;
  background: #fb641b;
  color: #fff;
  height: 48px;
  border-radius: 2px;
`;

const SignupButton = styled(Button)`
  text-transform: none;
  background: #fff;
  color: #2874f0;
  height: 48px;
  border-radius: 2px;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
`;

const Text = styled(Typography)`
  color: #878787;
  font-size: 12px;
`;

const Error = styled(Typography)`
  font-size: 10px;
  color: #ff6161;
  line-height: 0;
  margin-top: 10px;
  font-weight: 600;
`;
//initial values for login, initally values will be empty
const loginInitialValues = {
  username: "",
  password: "",
};

const signupInitialValues = {
  name: "",
  username: "",
  password: "",
  role: "",
  state: "",
};

const Login = ({ isUserAuthenticated }) => {
  //using usestate to store the state of the components
  const [login, setLogin] = useState(loginInitialValues);
  const [signup, setSignup] = useState(signupInitialValues);
  const [error, showError] = useState("");
  const [account, toggleAccount] = useState("login");

  const navigate = useNavigate();
  const { setAccount } = useContext(DataContext);

  const imageURL =
    "https://bloggingfornewbloggers.com/wp-content/uploads/2020/08/cropped-Blogging-for-New-Bloggers-logo-nv.png";

  useEffect(() => {
    showError(false);
  }, [login]);

  //using function to store the values that the user entered to login
  const onValueChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const onInputChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };
  const loginUser = async () => {
    try {
      let response = await API.userLogin(login);
      let isAdmin = response.data.role;
      let isState = response.data.state;
      console.log("role is", isAdmin);
      if (response.isSuccess) {
        showError("");

        sessionStorage.setItem(
          "accessToken",
          `Bearer ${response.data.accessToken}`
        );
        sessionStorage.setItem(
          "refreshToken",
          `Bearer ${response.data.refreshToken}`
        );
        setAccount({
          name: response.data.name,
          username: response.data.username,
          role: response.data.role,
          state: response.data.state,
        });

        //if user logs in then set it true otherwise it will be false
        isUserAuthenticated(true);
        setLogin(loginInitialValues);
        if (isAdmin == "admin") navigate("/admin");
        else if (isState == "blocked") navigate("/block");
        else navigate("/");
        console.log(response.data.state);
        console.log(response.data.role);
        // isAdmin == "admin" ? navigate("/admin") : navigate("/");
        // if(isState=='blocked') navigate("/block")
      } else {
        showError("Something went wrong! please try again later");
      }
    } catch (error) {
      // Handle any errors that occurred during the API call
      console.error(error);
      // You can display an error message or take any other appropriate action here
      showError("An error occurred during user login. Please try again later.");
    }
  };

  const googleLogin = async () => {
    try {
      const res = await axios.get("http://localhost:8000/auth/google", {
        withCredentials: true,
      });
      window.location.href = res.data.redirectUrl;
      navigate("/admin");
    } catch (error) {
      console.log(error);
    }
  };

  const signupUser = async () => {
    try {
      let response = await API.userSignup(signup);
      if (response.isSuccess) {
        showError("");
        setSignup(signupInitialValues);
        toggleAccount("login");
      } else {
        showError("Something went wrong! please try again later");
      }
    } catch (error) {
      console.log("Error found in signupUser", error);
    }
  };

  const toggleSignup = () => {
    account === "signup" ? toggleAccount("login") : toggleAccount("signup");
  };

  return (
    <Component>
      <Box>
        <Image src={imageURL} alt="blog" />
        {account === "login" ? (
          <Wrapper>
            <TextField
              variant="standard"
              value={login.username}
              onChange={(e) => onValueChange(e)}
              name="username"
              label="Enter Username"
            />
            <TextField
              variant="standard"
              value={login.password}
              onChange={(e) => onValueChange(e)}
              name="password"
              label="Enter Password"
            />

            {error && <Error>{error}</Error>}

            <LoginButton variant="contained" onClick={() => loginUser()}>
              Login
            </LoginButton>
            <Text style={{ textAlign: "center" }}>OR</Text>
            <SignupButton
              onClick={() => toggleSignup()}
              style={{ marginBottom: 50 }}
            >
              Create an account
            </SignupButton>
            <a
              style={{ textDecoration: "none" }}
              href="http://localhost:8000/auth/google"
            >
              <GButton >
                Google login
              </GButton>
            </a>
          </Wrapper>
        ) : (
          <Wrapper>
            <TextField
              variant="standard"
              onChange={(e) => onInputChange(e)}
              name="name"
              label={signup.name ? "" : "Enter Name"}
            />
            <TextField
              variant="standard"
              onChange={(e) => onInputChange(e)}
              name="username"
              label={signup.username ? "" : "Enter Username"}
            />
            <TextField
              variant="standard"
              onChange={(e) => onInputChange(e)}
              name="password"
              label={signup.password ? "" : "Enter Password"}
            />
            <FormControl>
              <InputLabel id="role-label">
                {signup.role ? "" : "Role"}
              </InputLabel>
              <Select
                labelId="role-label"
                // label={signup.role ? " " : "Role"}
                value={signup.role}
                onChange={(e) => onInputChange(e)}
                name="role"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
              {signup.role === "admin" && (
                <TextField
                  variant="standard"
                  onChange={(e) => onInputChange(e)}
                  name="adminCode"
                  label={signup.adminCode ? "" : "Enter Admin Code"}
                />
              )}
            </FormControl>

            <SignupButton onClick={() => signupUser()}>Signup</SignupButton>
            <Text style={{ textAlign: "center" }}>OR</Text>
            <LoginButton variant="contained" onClick={() => toggleSignup()}>
              Already have an account
            </LoginButton>
          </Wrapper>
        )}
      </Box>
    </Component>
  );
};

export default Login;

// import React, { useEffect, useContext } from 'react';
// import { TextField, Box, Button, Typography, styled, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser, signupUser, toggleAccount, resetError, toggleSignup } from './authSlice';
// import { DataContext } from '../../context/DataProvider';

// import { API } from "../../service/api";

// const Component = styled(Box)`
//   width: 400px;
//   margin: auto;
//   box-shadow: 5px 2px 5px 2px rgb(0 0 0/ 0.6);
// `;

// const Image = styled("img")({
//   width: 100,
//   display: "flex",
//   margin: "auto",
//   padding: "10px 0 0",
// });

// const Wrapper = styled(Box)`
//   padding: 25px 35px;
//   display: flex;
//   flex: 1;
//   overflow: auto;
//   flex-direction: column;
//   & > div,
//   & > button,
//   & > p {
//     margin-top: 20px;
//   }
// `;

// const LoginButton = styled(Button)`
//   text-transform: none;
//   background: #fb641b;
//   color: #fff;
//   height: 48px;
//   border-radius: 2px;
// `;

// const SignupButton = styled(Button)`
//   text-transform: none;
//   background: #fff;
//   color: #2874f0;
//   height: 48px;
//   border-radius: 2px;
//   box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
// `;

// const Text = styled(Typography)`
//   color: #878787;
//   font-size: 12px;
// `;

// const Error = styled(Typography)`
//   font-size: 10px;
//   color: #ff6161;
//   line-height: 0;
//   margin-top: 10px;
//   font-weight: 600;
// `;

// const loginInitialValues = {
//   username: "",
//   password: "",
// };

// const signupInitialValues = {
//   name: "",
//   username: "",
//   password: "",
//   role:"",
//   state:"",
// };

// const Login = ({ isUserAuthenticated }) => {
//   const dispatch = useDispatch();
//   const { login, signup, error, account } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const { setAccount } = useContext(DataContext);

//   const imageURL = 'https://bloggingfornewbloggers.com/wp-content/uploads/2020/08/cropped-Blogging-for-New-Bloggers-logo-nv.png';

//   useEffect(() => {
//     dispatch(resetError());
//   }, [dispatch, login]);

//   const onValueChange = (e) => {
//     dispatch(toggleAccount());
//   };

//   const onInputChange = (e) => {
//     dispatch(toggleAccount());
//   };

//   const loginUserHandler = () => {
//     dispatch(loginUser(login));
//   };

//   const signupUserHandler = () => {
//     dispatch(signupUser(signup));
//   };

//   const toggleSignupHandler = () => {
//     dispatch(toggleSignup());
//   };

//   return (
//     <Component>
//       <Box>
//         <Image src={imageURL} alt="blog" />
//         {account === 'login' ? (
//           <Wrapper>
//             <TextField
//               variant="standard"
//               value={login.username}
//               onChange={onValueChange}
//               name="username"
//               label="Enter Username"
//             />
//             <TextField
//               variant="standard"
//               value={login.password}
//               onChange={onValueChange}
//               name="password"
//               label="Enter Password"
//             />

//             {error && <Error>{error}</Error>}

//             <LoginButton variant="contained" onClick={loginUserHandler}>
//               Login
//             </LoginButton>
//             <Text style={{ textAlign: 'center' }}>OR</Text>
//             <SignupButton onClick={toggleSignupHandler} style={{ marginBottom: 50 }}>
//               Create an account
//             </SignupButton>
//           </Wrapper>
//         ) : (
//           <Wrapper>
//             <TextField
//               variant="standard"
//               onChange={onInputChange}
//               name="name"
//               label={signup.name ? '' : 'Enter Name'}
//             />
//             <TextField
//               variant="standard"
//               onChange={onInputChange}
//               name="username"
//               label={signup.username ? '' : 'Enter Username'}
//             />
//             <TextField
//               variant="standard"
//               onChange={onInputChange}
//               name="password"
//               label={signup.password ? '' : 'Enter Password'}
//             />
//             <FormControl>
//               <InputLabel id="role-label">{signup.role ? '' : 'Role'}</InputLabel>
//               <Select
//                 labelId="role-label"
//                 value={signup.role}
//                 onChange={onInputChange}
//                 name="role"
//               >
//                 <MenuItem value="user">User</MenuItem>
//                 <MenuItem value="admin">Admin</MenuItem>
//               </Select>
//               {signup.role === 'admin' && (
//                 <TextField
//                   variant="standard"
//                   onChange={onInputChange}
//                   name="adminCode"
//                   label={signup.adminCode ? '' : 'Enter Admin Code'}
//                 />
//               )}
//             </FormControl>

//             <SignupButton onClick={signupUserHandler}>Signup</SignupButton>
//             <Text style={{ textAlign: 'center' }}>OR</Text>
//             <LoginButton variant="contained" onClick={toggleSignupHandler}>
//               Already have an account
//             </LoginButton>
//           </Wrapper>
//         )}
//       </Box>
//     </Component>
//   );
// };

// export default Login;
