import { Grid } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataContext } from "../../context/DataProvider";

import {
  styled,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";

//components
import Banner from "../banner/Banner";
import Categories from "./Categories";
import Posts from "./post/Posts";

const Wrapper = styled(Box)`
  width: 400px;
`;

const StyledButtonPending = styled(Button)`
  margin: 20px;
  width: 46%;
  background: #6495ed;
  color: #fff;
  text-decoration: none;
  background: black;
`;

const ButtonReq = styled(Button)`
  width: 60%;
  margin: 10px;
`;

const StyledButton = styled(Button)`
  margin: 20px;
  width: 85%;
  background: #6495ed;
  color: #fff;
  text-decoration: none;
`;
const TableCellContent = styled(TableCell)`
  font-weight: bold;
`;

const Home = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showTableApp, setShowTableApp] = useState(false);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [showPost, setShowPost] = useState(true);
  const [rejectedPosts, setRejectedPosts] = useState([]);
  const [showTableRej, setShowTableRej] = useState(false);

  const { account } = useContext(DataContext);

  const fetchPendingPosts = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const headers = { Authorization: token };
      if (token) {
        const response = await axios.get(
          "http://localhost:8000/posts/pending",
          { headers }
        );
        setPendingPosts(response.data);
      } else {
        // Handle the case when the token is not available (e.g., user is not logged in)
        // You can redirect to the login page or display an appropriate message
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchApprovedPosts = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const headers = { Authorization: token };
      if (token) {
        const response = await axios.get(
          "http://localhost:8000/posts/approved",
          { headers }
        );
        setApprovedPosts(response.data);
      } else {
        // Handle the case when the token is not available (e.g., user is not logged in)
        // You can redirect to the login page or display an appropriate message
      }
    } catch (error) {
      console.error(error);
    }
  };
  const hidePost = () => {
    setShowPost(!showPost);
  };
  const fetchRejectedPosts = async () => {
    try {
      // Retrieve the token from wherever it is stored in your frontend (e.g., local storage, cookies, etc.)
      // const token = localStorage.getItem('token'); // Replace with your specific storage method
      const token = sessionStorage.getItem("accessToken");

      console.log("token is: ", token);

      const headers = { Authorization: token };
      if (token) {
        //   const headers = { Authorization: token };

        const response = await axios.get(
          "http://localhost:8000/posts/rejected",
          { headers }
        );
        setRejectedPosts(response.data);
        // setShowTable(true);
      } else {
        // Handle the case when the token is not available (e.g., user is not logged in)
        // You can redirect to the login page or display an appropriate message
      }
    } catch (error) {
      console.error(error);
    }
  };

  const togglePost = () => {
    setShowTable(!showTable);
  };
  const togglePostRej = () => {
    setShowTableRej(!showTableRej);
  };

  const togglePostApp = () => {
    setShowTableApp(!showTableApp);
  };

  useEffect(() => {
    if (showTable) {
      fetchPendingPosts();
    }
  }, [showTable]);

  useEffect(() => {
    fetchApprovedPosts();
  }, []);

  return (
    <>
      {/* <Banner /> */}
      <Grid container>
        <Grid item lg={2} xs={12} sm={2}>
          <Wrapper>
            <Categories />
            <Box>
              <StyledButtonPending
                variant="contained"
                onClick={() => {
                  fetchPendingPosts();
                  togglePost();
                  hidePost();
                }}
              >
                Pending Blogs
              </StyledButtonPending>
              {showTable && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCellContent>Title</TableCellContent>
                        {/* <TableCellContent>Author</TableCellContent> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingPosts.map(
                        (post) =>
                          account.username === post.username && (
                            <TableRow key={post._id}>
                              <TableCellContent>{post.title}</TableCellContent>
                              {/* <TableCell>{post.username}</TableCell> */}
                            </TableRow>
                          )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <StyledButtonPending
                variant="contained"
                onClick={() => {
                  fetchApprovedPosts();
                  togglePostApp();
                  hidePost();
                }}
              >
                Approved Blogs
              </StyledButtonPending>
              {showTableApp && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCellContent>Title</TableCellContent>
                        {/* <TableCellContent>Author</TableCellContent> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {approvedPosts.map(
                        (post) =>
                          account.username === post.username && (
                            <TableRow key={post._id}>
                              <TableCellContent>{post.title}</TableCellContent>
                              {/* <TableCell>{post.username}</TableCell> */}
                            </TableRow>
                          )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <StyledButtonPending
                variant="contained"
                onClick={() => {
                  fetchRejectedPosts();
                  togglePostRej();
                  hidePost();
                }}
              >
                rejected Posts
              </StyledButtonPending>
              {showTableRej && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCellContent>Title</TableCellContent>
                        {/* <TableCellContent>Author</TableCellContent> */}

                        <TableCellContent>Reason</TableCellContent>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rejectedPosts.map(
                        (post) =>
                          account.username === post.username && (
                            <TableRow key={post._id}>
                              <TableCellContent>{post.title}</TableCellContent>
                              {/* <TableCell>{post.username}</TableCell> */}
                              <TableCell>{post.reason}</TableCell>
                            </TableRow>
                          )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Wrapper>
        </Grid>
        <Grid container item xs={12} sm={10} lg={10}>
          {/* <Categories /> */}
          {showPost && <Posts />}
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
