const express = require('express');
const router = express.Router();
const Post = require('../model/postSchema.js');
const authenticate = require('../middleware/authenticate.js');
const multer = require('multer');



// Multer Configer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Upload directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

router.post("/create_post", authenticate, upload.single("image"), async (req, res) => {
    const { title, content } = req.body;

    try {
        // Validate input
        if (!title || !content) {
            return res.status(400).json("Title and content are required.");
        }

        // Create post
        const post = new Post({
            title,
            content,
            image: req.file ? req.file.path : null, 
            user: req.user.id, 
        });

        await post.save();
        res.status(201).json({
            message: "Post created!__",
            post,
        });
      
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json("Error creating post: " + error.message);
    }
});

// router.get("/timeline_post", authenticate, async (req, res) => {
//     try {
//         const posts = await Post.find()
//         res.status(200).json(posts);
//     } catch (error) {
//         console.error("Error fetching timeline:", error);
//         res.status(500).json("Error fetching timeline");
//     }
// });

router.get("/timeline_post", authenticate, async (req, res) => {
    try {
      // Fetch posts and populate the 'user' field with the user's name
      const posts = await Post.find()
        .populate("user", "name") // Populate 'user' with only the 'name' field from the User model
        .sort({ createdAt: -1 }); // Optional: Sort posts by newest first
  
      res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching timeline:", error);
      res.status(500).json("Error fetching timeline");
    }
  });

router.get("/profile", authenticate, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id })
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json("Error fetching user posts: " + error.message);
    }
});

router.put("/profile/edit/:id", authenticate, multer({ dest: "uploads/" }).single("image"), async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content } = req.body;

        // Find post by ID and check if it belongs to the logged-in user
        const post = await Post.findOne({ _id: postId, user: req.user.id });

        if (!post) {
            return res.status(404).json("Post not found or you are not authorized to edit this post.");
        }

        // Update post fields
        post.title = title || post.title;
        post.content = content || post.content;

        if (req.file) {
            post.image = req.file.path; // Update image if provided
        }

        await post.save();
        res.status(200).json({ message: "Post updated successfully.", post });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json("Error updating post: " + error.message);
    }
});

router.delete("/profile/delete/:id", authenticate, async (req, res) => {
    try {
        const postId = req.params.id;

        // Find and delete post if it belongs to the logged-in user
        const post = await Post.findOneAndDelete({ _id: postId, user: req.user.id });

        if (!post) {
            return res.status(404).json("Post not found or you are not authorized to delete this post.");
        }

        res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json("Error deleting post: " + error.message);
    }
});


// Like/Unlike Route
router.post("/like/:id", authenticate, async (req, res) => {
    const postId = req.params.id; // Post ID from the route
    const userId = req.user.id; // Authenticated user ID from token

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Ensure `likedBy` is initialized
        if (!post.likedBy) post.likedBy = [];

        const alreadyLiked = post.likedBy.includes(userId);

        if (alreadyLiked) {
            // Unlike the post
            post.likes -= 1;
            post.likedBy = post.likedBy.filter(id => id.toString() !== userId);
        } else {
            // Like the post
            post.likes += 1;
            post.likedBy.push(userId);
        }

        // Save the updated post
        await post.save();

        // Emit real-time update using Socket.io
        const io = req.app.get('io');
        io.emit("likeUpdated", {
            postId: post._id,
            likes: post.likes,
        });

        res.status(200).json({
            message: alreadyLiked ? "Post unliked successfully" : "Post liked successfully",
            postId: post._id,
            likes: post.likes,
        });
    } catch (error) {
        console.error("Error in like API:", error);
        res.status(500).json({ message: "Error in like API: " + error.message });
    }
});

module.exports = router;