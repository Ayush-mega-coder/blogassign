import Post from "../model/post.js";
import UpdateRequest from "../model/updatePost.js";

export const createPost = async (request, response) => {
  try {
    const post = new Post({
      ...request.body,
      status: "pending",
    });

    await post.save();

    response.status(200).json("Post saved successfully");
  } catch (error) {
    response.status(500).json(error);
  }
};

export const getPendingPosts = async (request, response) => {
  try {
 
    // if (request.user.role !== 'admin') {
    //   return response.status(403).json({ error: 'Access denied' });
    // }

    // Fetch all the pending blog requests
    const pendingPosts = await Post.find({ status: "pending" });

    response.status(200).json(pendingPosts);
  } catch (error) {
    response.status(500).json(error);
  }
};
export const getApprovedPost = async (request, response) => {
  try {
    const approvedPosts = await Post.find({ status: "approved" });
    response.status(200).json(approvedPosts);
  } catch (error) {
    response.status(500).json("error in getting approved posts", error);
  }
};
export const getRejectedPosts = async (request, response) => {
  try {
    const rejectedPosts = await Post.find({ status: "rejected" });
    response.status(200).json(rejectedPosts);
  } catch (error) {
    response.status(500).json("error in getting rejected posts", error);
  }
};
export const approvePost = async (request, response) => {
  try {
  
    const postId = request.params.id;
    const post = await Post.findByIdAndUpdate(
      postId,
      { status: "approved" },
      { new: true }
    );

    response.status(200).json(post);
  } catch (error) {
    response.status(500).json(error);
  }
};


export const rejectPost = async (request, response) => {
  try {
   

    const postId = request.params.id;
    const { reason } = request.body;
    // const {reason} = request.body;
    //this is used to update the database with given information like status is rejected
    const post = await Post.findByIdAndUpdate(
      postId,
      { status: "rejected", reason },
      { new: true }
    );

    response.status(200).json(post);
  } catch (error) {
    response.status(500).json(error);
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Create a new update request
    const updateRequest = new UpdateRequest({
      postId: req.params.id,
      updatedData: req.body,
      status: "pending",
    });

    await updateRequest.save();

    res.status(200).json("Update request sent for approval");
    console.log("update request sent");
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getUpdateRequest = async (req, res) => {
  try {
    const updateRequests = await UpdateRequest.find({ status: "pending" });
    
    res.status(200).json(updateRequests);
  } catch(error) {
    res.status(500).json(error);
  }
};

export const approveUpdateRequest = async (req, res) => {
  try {
    const updateRequest = await UpdateRequest.findById(req.params.id);

    if (!updateRequest) {
      return res.status(404).json({ msg: "Update request not found" });
    }

  

    // Update the post with the approved data
    const postId = updateRequest.postId;
    const updatedData = updateRequest.updatedData;
    const post = await Post.findByIdAndUpdate(
      postId,
      { $set: updatedData },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Update the status of the update request to 'approved'
    updateRequest.status = "approved";
    await updateRequest.save();

    res.status(200).json("Update request approved");
  } catch (error) {
    res.status(500).json(error);
  }
};
export const deletePost = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);
    if (post) {
      console.log("post found");
    }
    if (!post) {
      return response.status(404).json("Post not found");
    }

    await post.delete();

    response.status(200).json("Post deleted successfully");
  } catch (error) {
    response.status(500).json(error);
  }
};

export const getPost = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);

    response.status(200).json(post);
  } catch (error) {
    response.status(500).json(error);
  }
};
// export const getPendingPost = async (request,response){

// }



export const getAllPosts = async (request, response) => {
  let username = request.query.username;

  let posts;

  try {
    if (username) {
      posts = await Post.find({ username: username });
    
    } else {
      
      // if (request.user.role === 'admin') {
      //   posts = await Post.find({});
      // } else {
      
      posts = await Post.find({ status: "approved" });
      // }
    }

    response.status(200).json(posts);
  } catch (error) {
    response.status(500).json(error);
  }
};
