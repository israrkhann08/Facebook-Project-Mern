import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:4000"); // Connect to the backend socket server

const Timeline = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/user/post/timeline_post",
        {
          headers: { token },
        }
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();

  


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
  
  const handleProfile = () => {
    navigate('/profile')
}


  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" align="center">
        Timeline

        <Button sx={{ml: 4}}
        variant="outlined"
        onClick={ handleProfile }
        >Profile</Button>
      </Typography>
      {posts.map((post) => (
        <Card key={post._id} sx={{ mb: 2, mx: "auto", maxWidth: 500 }}>
          <CardContent>
            <Box>
              <img
                style={{ height: "260px", width: "500px" }}
                src={`http://localhost:4000/${post.image}`}
                alt={post.title}
              />
            </Box>
            <Typography variant="h6">
              {post.user?.name || "Unknown User"} {/* Display username */}
            </Typography>
            <Typography variant="h5">{post.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {post.content}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Likes: {post.likes || 0}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleLike(post._id)}
              sx={{ mt: 2 }}
            >
              Like
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Timeline;
