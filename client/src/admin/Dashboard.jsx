import React, { useState, useEffect, useContext } from "react";
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
  Grid,
  TextField,
} from "@mui/material";
import axios from "axios";
import Posts from "../components/home/post/Posts";
import ApproveUpdateRequest from "../components/updatePost/ApproveUpdateRequest";
import { DataContext } from "../context/DataProvider";
import { useParams } from "react-router-dom";

const StyledButton = styled(Button)`
  margin: 20px;
  width: 85%;
  background: #6495ed;
  color: #fff;
  text-decoration: none;
  background-color: black;
`;
const BoxUser = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  display: flex;
  align-items: center;
`;
const BoxName = styled(Box)`
  width: 150px;
  height: 100px;
`;
const UserButton = styled(Button)`
  width: 10px;
  height: 20px;
  margin: 5px;
  background: #6495ed;
  color: #fff;
  text-decoration: none;
`;
const UserName = styled(Typography)`
  margin: 2px 60px;
  width: 150px;
  height: 18px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: bold;
  margin: 10px 15px;
  padding: 8px;

  background-color: #f1f1f1;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
`;
const Wrapper = styled(Box)`
  width: 400px;
`;
const StyledButtonPending = styled(Button)`
  margin: 20px;
  width: 46%;

  background: #6495ed;
  color: #fff;
  text-decoration: none;
  background-color: black;
`;
const ButtonReq = styled(Button)`
  width: 60%;
  margin: 10px;
`;
const ButtonReqRej = styled(Button)`
  background: red;
  width: 60%;
  margin: 10px;
`;
const TableView = styled(TableContainer)`
  width: 600px;
`;
const TableContainerRejected = styled(TableContainer)`
  width: 700px;
`;
const TableCellContent = styled(TableCell)`
  font-weight: bold;
  vertical-align: middle;
  text-align: center;
`;
const TextFieldReason = styled(TextField)`
  line-height: 10px;
`;
const TableContainerUpdate = styled(TableContainer)`
  width: 900px;
`;
const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showTableApp, setShowTableApp] = useState(false);
  const [showTableRej, setShowTableRej] = useState(false);
  const [showPost, setShowPost] = useState(true);
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [rejectedPosts, setRejectedPosts] = useState([]);
  const [rejectedReason, setRejectedReason] = useState("");
  const [showReason, setShowReason] = useState(false);
  const [showRejectedButton, setShowRejectedButton] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [blockUserName, setBlockUserName] = useState([]);
  const [updateRequests, setUpdateRequests] = useState([]);
  const [showUpdate, setShowUpdate] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (showUpdate) {
      fetchUpdateRequests();
    }
  }, [showUpdate]);

  // const [home,setHome] = useState();
  useEffect(() => {
    if (showTable) {
      fetchPendingPosts();
    }
  }, [showTable]);
  useEffect(() => {
    if (showTableApp) fetchApprovedPosts();
  }, [showTableApp]);
  useEffect(() => {
    if (showTableRej) fetchRejectedPosts();
  }, [showTableRej]);

  const fetchPendingPosts = async () => {
    try {
      
      const token = sessionStorage.getItem("accessToken");
      const headers = { Authorization: token };

      console.log("token is: ", token);

      if (token) {
        //   const headers = { Authorization: token };

        const response = await axios.get(
          "http://localhost:8000/posts/pending",
          { headers }
        );
        setPendingPosts(response.data);
        // setShowTable(true);
      } else {
        
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchApprovedPosts = async () => {
    try {
    
      const token = sessionStorage.getItem("accessToken");

      console.log("token is: ", token);

      const headers = { Authorization: token };
      if (token) {
        //   const headers = { Authorization: token };

        const response = await axios.get(
          "http://localhost:8000/posts/approved",
          { headers }
        );
        setApprovedPosts(response.data);
        // setShowTable(true);
      } else {
        
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchRejectedPosts = async () => {
    try {
    
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
        
      }
    } catch (error) {
      console.error(error);
    }
  };
  const approvePost = async (postId) => {
    try {
      //not using the authetication token because in route we have not given the authentication require for this endpoint
      //if authentications is made required for this then we have to fetch the token first and then access
      // const token = sessionStorage.getItem("accessToken");

      // const headers = { Authorization: token };
      await axios.put(`http://localhost:8000/post/approve/${postId}`);

      fetchPendingPosts();

      // Update the state or fetch pending posts again
    } catch (error) {
      console.error("error is", error);
    }
  };


  const rejectPost = async (postId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/post/reject/${postId}`,
        {
          status: "rejected",
          reason: rejectedReason,
        }
      );
      console.log("post rejected successfully", response.data);
      // Update the state or fetch pending posts again
      setShowReason(!showReason);
      setShowRejectedButton(!showRejectedButton);
      fetchPendingPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      const filteredUsers = response.data.filter(
        (user) => user.state !== "blocked"
      );

      setUsers(filteredUsers);
      console.log("Data fetched");
    } catch (error) {
      console.log("Error in fetching users", error);
    }
  };
  const blockUser = async (userId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/block/${userId}`,
        { state: "blocked" }
      );
      fetchUsers();
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      console.log("User deleted successfully");
    } catch (error) {
      console.log("Error while deleting user", error);
      console.log("user id is", userId);
    }
  };


  const fetchUpdateRequests = async () => {
    const token = sessionStorage.getItem("accessToken");

    console.log("token is: ", token);

    const headers = { Authorization: token };
    try {
      const response = await axios.get(
        "http://localhost:8000/update/requests",
        { headers }
      );
      setUpdateRequests(response.data);
      console.log("update requests fetched");
    } catch (error) {
      console.log("error while fetching update requests", error);
    }
  };

  const onInputChange = (e) => {
    setRejectedReason(e.target.value);
  };
  const toggleUsers = () => {
    setShowUsers(!showUsers);
  };
  const togglePost = () => {
    setShowTable(!showTable);
  };
  const togglePostApp = () => {
    setShowTableApp(!showTableApp);
  };
  const togglePostRej = () => {
    setShowTableRej(!showTableRej);
  };
  const toggleUpdate = () => {
    setShowUpdate(!showUpdate);
  };
  const toggleReason = (postId) => {
    if (selectedPostId === postId) {
      setSelectedPostId(null);
    } else {
      setSelectedPostId(postId);
    }

    setShowReason(!showReason);
    setShowRejectedButton(!showRejectedButton);
  };
  //using this function to hide the Posts from screen when we click some other button, this function is called everytime we click a button
  const hidePost = () => {
    setShowPost(!showPost);
  };
  return (
    <>
      {/* {/* <button>hello</button> */}

      <Grid container>
        <Grid item lg={2} xs={12} sm={2}>
          <Wrapper>
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
                <TableView>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCellContent>Title</TableCellContent>
                        <TableCellContent>Author</TableCellContent>
                        <TableCellContent>Action</TableCellContent>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingPosts.map((post) => (
                        <TableRow key={post._id}>
                          <TableCellContent>{post.title}</TableCellContent>
                          <TableCell>{post.username}</TableCell>

                          {/* <TableCell>{post.author}</TableCell> */}
                          <TableCell>
                            <ButtonReq
                              onClick={() => approvePost(post._id)}
                              variant="contained"
                            >
                              Approve
                            </ButtonReq>
                            {showRejectedButton && (
                              <ButtonReqRej
                                variant="contained"
                                onClick={() => toggleReason(post._id)}
                              >
                                Reject
                              </ButtonReqRej>
                            )}

                            {showReason && selectedPostId === post._id && (
                              <TableCell>
                                <TextFieldReason
                                  variant="standard"
                                  onChange={(e) => onInputChange(e)}
                                  name="reason"
                                  label={"Enter Reason"}
                                ></TextFieldReason>
                                <ButtonReqRej
                                  onClick={() => rejectPost(post._id)}
                                  variant="contained"
                                >
                                  Reject
                                </ButtonReqRej>
                              </TableCell>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableView>
              )}
              <StyledButtonPending
                variant="contained"
                onClick={() => {
                  fetchApprovedPosts();
                  togglePostApp();
                  hidePost();
                }}
              >
                approved Blogs
              </StyledButtonPending>
              {showTableApp && (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCellContent>Title</TableCellContent>
                        <TableCellContent>Author</TableCellContent>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {approvedPosts.map((post) => (
                        <TableRow key={post._id}>
                          <TableCellContent>{post.title}</TableCellContent>
                          <TableCell>{post.username}</TableCell>
                        </TableRow>
                      ))}
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
                <TableContainerRejected>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCellContent>Title</TableCellContent>
                        <TableCellContent>Author</TableCellContent>
                        <TableCellContent>Reason</TableCellContent>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rejectedPosts.map((post) => (
                        <TableRow key={post._id}>
                          <TableCellContent>{post.title}</TableCellContent>
                          <TableCell>{post.username}</TableCell>
                          <TableCell>{post.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainerRejected>
              )}
            </Box>
          </Wrapper>

          {/* <StyledButton variant="contained">Blog request</StyledButton> */}

          <StyledButton
            variant="contained"
            onClick={() => {
              fetchUsers();
              toggleUsers();
              hidePost();
            }}
          >
            Users
          </StyledButton>

          {showUsers && (
            <>
              {users.map((user) => (
                <BoxUser>
                  {/* <BoxName> */}
                  <UserName key={user._id}>{user.name}</UserName>

                  {/* </BoxName> */}
                  <UserButton
                    onClick={() => {
                      blockUser(user._id);
                    }}
                    variant="contained"
                  >
                    Block
                  </UserButton>
                </BoxUser>
              ))}
            </>
          )}

          <StyledButton
            variant="contained"
            onClick={() => {
              toggleUpdate();
              hidePost();
            }}
          >
            Update Requests
          </StyledButton>

          {/* <>
              {updateRequests.map((request) => (
                <div key={request.id}>
                  <p>Title: {request.updatedData.title}</p>
                  <p>Title: {request.updatedData.description}</p>

                  {/* Render other request details as needed */}
          {/* <ApproveUpdateRequest requestId={request._id} /> */}
          {/* </div> */}
          {/* */}
          {showUpdate && (
            <TableContainerUpdate>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCellContent>Title</TableCellContent>
                    <TableCellContent>Description</TableCellContent>
                    <TableCellContent>Action</TableCellContent>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {updateRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCellContent>
                        {request.updatedData.title}
                      </TableCellContent>
                      <TableCell>{request.updatedData.description}</TableCell>
                      {/* Render other request details as needed */}
                      <TableCell>
                        <ApproveUpdateRequest
                          requestId={request._id}
                          fetchUpdateRequests={fetchUpdateRequests}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainerUpdate>
          )}
        </Grid>
        <Grid container item xs={12} sm={10} lg={10}>
          {showPost && <Posts />}
        </Grid>
      </Grid>
    </>
  );
};
export default Dashboard;
