
import { Box, styled, Typography, Link } from '@mui/material';
import { GitHub, Instagram, Email } from '@mui/icons-material';

const Banner = styled(Box)`
    background-image: url(https://www.wallpapertip.com/wmimgs/23-236943_us-wallpaper-for-website.jpg);
    width: 100%;
    height: 50vh;
    background-position: left 0px bottom 0px;
    background-size: cover;
`;

const Wrapper = styled(Box)`
    padding: 10px;
    & > h3, & > h5 {
        margin-top: 30px;
    }
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
`;

const Text = styled(Typography)`
    color: #878787;
`;

const About = () => {

    return (
        <Box>
            <Banner/>
            <Wrapper>
                <Typography variant="h3">BLOG VERSE</Typography>
                <Text variant="h5">BLOG PUBLISHING WEBSITE
<br />

                    
                </Text>
            </Wrapper>
        </Box>
    )
}

export default About;