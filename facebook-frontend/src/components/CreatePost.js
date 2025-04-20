import React, { useState } from "react";
import { TextField, Button, Box, Typography, Card, CardContent } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const CreatePost = () => {
    const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in to create a post.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/user/post/create_post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
        }
      );
      setMessage(response.data.message);
      setTitle("");
      setContent("");
      setImage(null);
      alert('post Created');
      navigate('/profile');
    } catch (error) {
      console.error("Error creating post:", error);
      setMessage("Error creating post: " + error.response?.data || error.message);
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Create a Post
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Content"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <Button
              variant="contained"
              component="label"
              sx={{ mb: 2 }}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {image && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                Selected file: {image.name}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              sx={{
                mr: 2,
                bgcolor: "error.main",
                ":hover": { bgcolor: "error.dark" },
              }}
              fullWidth
            >
              Create Post
            </Button>
          </form>
          {message && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreatePost;
