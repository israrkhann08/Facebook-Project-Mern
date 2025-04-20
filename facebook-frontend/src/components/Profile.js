import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:4000"); // Connect to the backend socket server

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const gotToNewPage = () => {
    navigate("/createPost");
  };

  const updatePostHandler = () => {
    navigate("/updatePost");
  };

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/user/post/profile", {
        headers: { token },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    fetchUserPosts();

    // Listen for real-time "likeUpdated" events
    socket.on("likeUpdated", ({ postId, likes }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes } : post
        )
      );
    });

    return () => {
      socket.off("likeUpdated"); // Cleanup listener on component unmount
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/user/post/profile/delete/${id}`, {
        headers: { token },
      });
      alert("Post deleted successfully.");
      fetchUserPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:4000/user/post/like/${postId}`,
        {},
        { headers: { token } }
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ mb: 4, color: "primary.main" }}
      >
        My Posts
        <br />
        <Button variant="outlined" onClick={gotToNewPage}>
          CREATE POST
        </Button>

      </Typography>

      {posts.map((post) => (
        <Card
          key={post._id}
          sx={{ mb: 2, mx: "auto", maxWidth: 500, boxShadow: 3 }}
        >
          <CardContent>
            <Box>
              <img
                style={{
                  height: "240px",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
                src={`http://localhost:4000/${post.image}`}
                alt="Post"
              />
            </Box>
            <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
              {post.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {post.content}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Likes: {post.likes}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleLike(post._id)}
              sx={{
                mr: 2,
                bgcolor: "primary.main",
                ":hover": { bgcolor: "primary.dark" },
              }}
            >
              Like
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDelete(post._id)}
              sx={{
                mr: 2,
                bgcolor: "error.main",
                ":hover": { bgcolor: "error.dark" },
              }}
            >
              Delete
            </Button>
            <Button
              onClick={updatePostHandler}
              variant="contained"
              color="primary"
              sx={{
                bgcolor: "primary.main",
                ":hover": { bgcolor: "primary.dark" },
              }}
            >
              Update Post
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Profile;
