import { Box, styled, Typography, Link } from "@mui/material";

const Wrapper = styled(Box)`
  padding: 20px;
  & > h3,
  & > h5 {
    margin-top: 50px;
  }
`;

const Text = styled(Typography)`
  color: #878787;
`;

const Block = () => {
  return (
    <Box>
      <Wrapper>
        <Text variant="h3">You are blocked!</Text>
      </Wrapper>
    </Box>
  );
};

export default Block;
