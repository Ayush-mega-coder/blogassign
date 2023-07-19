import React from "react";
import { Box, styled, Button } from "@mui/material";
import Header from "../components/header/Header";
import Posts from "../components/home/post/Posts";
import { Grid } from "@mui/material";
import Dashboard from "./Dashboard";
import Categories from "../components/home/Categories";

const Component = styled(Box)`
  width: 400px;
  margin: auto;
  align-content: center;
  display: flex;
  margin-top: 90px;
  margin-bottom: 30px;
  justify-content: center;
  font-size: 40px;
`;

const Admin = () => {
  return (
    <>
      <Header />
      <Component>
        <Box>Admin panel</Box>
      </Component>

      <Dashboard />
    </>
  );
};

export default Admin;
