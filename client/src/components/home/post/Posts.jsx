import { useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from './postsSlice';

//components
import Post from './Post';

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector((state) => state.posts);

  const [searchParams] = useSearchParams();
  // const category = searchParams.get('category');

  useEffect(() => {
    dispatch(fetchPosts());
  }, [ dispatch]); 

  return (
    <>
      {status === 'loading' && <p>Loading posts...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && (
        <>
          {posts?.length ? (
            posts.map((post) => (
              <Grid item lg={3} sm={4} xs={12} key={post._id}>
                <Link
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  to={`/details/${post._id}`}
                >
                  <Post post={post} />
                </Link>
              </Grid>
            ))
          ) : (
            <Box style={{ color: '878787', margin: '30px 80px', fontSize: 18 }}></Box>
          )}
        </>
      )}
    </>
  );
};

export default Posts;
// import { useEffect, useState } from "react";

// import { Grid, Box } from "@mui/material";
// import { Link, useSearchParams } from "react-router-dom";

// // import { getAllPosts } from '../../../service/api';
// import { API } from "../../../service/api";

// //components
// import Post from "./Post";

// const Posts = () => {
//   const [posts, getPosts] = useState([]);

//   const [searchParams] = useSearchParams();
//   const category = searchParams.get("category");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let response = await API.getAllPosts({ category: category || "" });
//         if (response.isSuccess) {
//           getPosts(response.data);
//         }
//       } catch (error) {
//         console.log("Error:", error);
//       }
//     };
//     fetchData();
//   }, [category]);

//   return (
//     <>
//       {posts?.length ? (
//         posts.map((post) => (
//           <Grid item lg={3} sm={4} xs={12}>
//             <Link
//               style={{ textDecoration: "none", color: "inherit" }}
//               to={`/details/${post._id}`}
//             >
//               <Post post={post} />
//             </Link>
//           </Grid>
//         ))
//       ) : (
//         <Box style={{ color: "878787", margin: "30px 80px", fontSize: 18 }}>

//         </Box>
//       )}
//     </>
//   );
// };

// export default Posts;
