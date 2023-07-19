
import { styled, Box, Typography } from '@mui/material';

const Image = styled(Box)`
    width: 100%;
    background: url(https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg) center/55% repeat-x #000;
    height: 30vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    
`;

const Heading = styled(Typography)`
    font-size: 70px;
    
    line-height: 1;
    background: #FFFFFF;
`;

const SubHeading = styled(Typography)`
    font-size: 20px;
    background: #FFFFFF;
`;

const Banner = () => {
    
    return (
        <Image >
       
            <Heading>BLOG VERSE</Heading>
            <br/>
            <SubHeading>Create Something Unique</SubHeading>
          
        </Image>
    )
}

export default Banner;