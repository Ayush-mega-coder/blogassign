import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, styled } from "@mui/material";

const StyledButton = styled(Button)`
  margin: 20px;
  width: 85%;
  background: #6495ed;
  color: #fff;
  text-decoration: none;
  background-color: blue;
`;
const ApproveUpdateRequest = ({ requestId, fetchUpdateRequests }) => {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    try {
      setLoading(true);

      // Retrieve the token from wherever it is stored in your frontend (e.g., local storage, cookies, etc.)
      // const token = sessionStorage.getItem('token'); // Replace with your specific storage method
      const token = sessionStorage.getItem("accessToken");
      console.log("update token is :", token);
      const headers = { Authorization: token };

      await axios.put(
        `http://localhost:8000/update/request/approve/${requestId}`,
        {},
        { headers }
      );

      // Perform any necessary actions after approving the request
      // For example, you can fetch updated data or update the UI
      fetchUpdateRequests();
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <StyledButton
        variant="contained"
        onClick={() => {
          handleApprove();
        }}
        disabled={loading}
      >
        Approve
      </StyledButton>
    </div>
  );
};

export default ApproveUpdateRequest;
