import { useState, useEffect, useContext } from "react";

import { Box, Typography, styled } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";

import { API } from "../../service/api";

import { DataContext } from "../../context/DataProvider";

// components

const Container = styled(Box)(({ theme }) => ({
  margin: "50px 100px",
  [theme.breakpoints.down("md")]: {
    margin: 0,
  },
}));

const Image = styled("img")({
  width: "100%",
  height: "50vh",
  objectFit: "cover",
});

const EditIcon = styled(Edit)`
  margin: 5px;
  padding: 5px;
  border: 1px solid #878787;
  border-radius: 10px;
`;

const DeleteIcon = styled(Delete)`
  margin: 5px;
  padding: 5px;
  border: 1px solid #878787;
  border-radius: 10px;
  cursor: pointer;
`;

const Heading = styled(Typography)`
  font-size: 38px;
  font-weight: 600;
  text-align: center;
  margin: 50px 0 10px 0;
`;

const Author = styled(Box)(({ theme }) => ({
  color: "#878787",
  display: "flex",
  margin: "20px 0",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));

const DetailView = () => {
  const url =
    "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80";

  //setting the current post as post
  const [post, setPost] = useState({});
  const { account } = useContext(DataContext);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await API.getPostById(id);
        if (response.isSuccess) {
          setPost(response.data);
          console.log("post is set");
        }
      } catch (error) {
        console.log("error deleting", error);
      }
    };
    fetchData();
  }, []);

  const deleteBlog = async () => {
    try {
      await API.deletePost(post._id);
      account.role == "admin" ? navigate("/admin") : navigate("/");
    } catch (error) {
      console.log("error deleting via API", error);
      
    }
  };
  // const deleteBlog = async () => {
  //     try {
  //         // const token = localStorage.getItem('token'); // Retrieve the token from local storage or any other storage mechanism
  //         const token = sessionStorage.getItem("accessToken");
  //         console.log("token is", token)

  //       if (!token) {
  //         // Handle case when token is missing
  //         console.log('No token found');
  //         return;
  //       }

  //       await API.deletePost(post._id,{ headers: { 'x-auth-token': token } }); // Pass the token in the headers

  //       navigate('/');
  //     } catch (error) {
  //       console.log('Error deleting', error);
  //     }
  //   };
  // console.log(account);

  return (
    <Container>
      <Image src={post.picture || url} alt="post" />
      <Box style={{ float: "right" }}>
        {account.username === post.username && (
          <>
            <Link to={`/update/${post._id}`}>
              <EditIcon color="primary" />
            </Link>
            <DeleteIcon onClick={() => deleteBlog()} color="error" />
          </>
        )}
      </Box>
      <Box style={{ float: "right" }}>
        {account.role === "admin" && (
          <>
            {/* <Link to={`/update/${post._id}`}><EditIcon color="primary" /></Link> */}
            <DeleteIcon onClick={() => deleteBlog()} color="error" />
            {/* <h1>Hekllo from {account.username}</h1> */}
          </>
        )}
      </Box>

      <Heading>{post.title}</Heading>

      <Author>
        <Link
          to={`/?username=${post.username}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography>
            Author: <span style={{ fontWeight: 600 }}>{post.username}</span>
          </Typography>
        </Link>
        <Typography style={{ marginLeft: "auto" }}>
          {new Date(post.createdDate).toDateString()}
        </Typography>

      </Author>

      <Typography>{post.description}</Typography>
      {/* <Comments post={post} /> */}
    </Container>
  );
};

export default DetailView;
