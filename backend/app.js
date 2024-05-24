require('dotenv').config(); 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Post = require('./models/post.js');
const User = require('./models/user.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); // Ensure this package is installed
const bcrypt = require('bcryptjs'); // For password hashing

app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

mongoose.connect("mongodb+srv://07209292:09984831193@janrey.cym6m47.mongodb.net/janrey?retryWrites=true&w=majority&appName=janrey&connectTimeoutMS=30000")
.then(() => {
    console.log('Connected to the database');
})
.catch(() => {
    console.log('connection failed');
}); 

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, x-Requested-with, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.get('/api/posts/:id', async (req, res) => {
  try {
      const post = await Post.findById(req.params.id);
      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/posts/comments', async (req, res) => {
  const comment = new Comment({
    content: req.body.content,
    postId: req.body.postId,
    userId: req.body.userId,
  });

  try {
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving comment', error: error.message });
  }
});

// POST route for adding a new post
app.post('/api/posts', (req, res) => {
  const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
      videoUrl: req.body.videoUrl
  });
 
  console.log('Received Post Data:', req.body); // Add this console log
 
  post.save()
    .then(savedPost => {
        console.log('Saved Post:', savedPost); // Add this console log
        res.status(201).json(savedPost);
      })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Error saving post', error: err.message });
      });
 });

 app.get('/api/posts/search', async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;
  const regex = new RegExp(query, 'i'); // Case-insensitive search
  const skipIndex = (page - 1) * limit;

  try {
    const posts = await Post.find({
      $or: [
        { title: regex },
        { content: regex },
        { imageUrl: regex },
        { videoUrl: regex }
      ]
    })
      .limit(parseInt(limit))
      .skip(parseInt(skipIndex));

    const total = await Post.countDocuments({
      $or: [
        { title: regex },
        { content: regex },
        { imageUrl: regex },
        { videoUrl: regex }
      ]
    });

    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: posts,
      totalPosts: total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Fetching posts failed', error });
  }
});



 

// DELETE route for deleting a post
app.delete('/api/posts/:id', async (req, res) => {
    try {
       const post = await Post.findByIdAndDelete(req.params.id);
       if (!post) {
         return res.status(404).json({ message: 'Post not found' });
       }
       res.json({ message: 'Post deleted successfully' });
    } catch (error) {
       res.status(500).json({ message: 'Server error' });
    }
});

// PUT route for updating a post
app.put('/api/posts/:id', async (req, res) => {
    try {
       const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
       if (!post) {
         return res.status(404).json({ message: 'Post not found' });
       }
       res.json(post);
    } catch (error) {
       res.status(500).json({ message: 'Server error' });
    }
});

// GET route for fetching all posts with pagination
app.get('/api/posts', async (req, res) => {
 const page = parseInt(req.query.page) || 1;
 const limit = parseInt(req.query.limit) || 5;
 const skipIndex = (page - 1) * limit;

 try {
      const posts = await Post.find().limit(limit).skip(skipIndex);
      const total = await Post.countDocuments();

      res.status(200).json({
          message: 'Posts fetched successfully',
          posts: posts,
          totalPosts: total,
          page: page,
          limit: limit
      });
 } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
 }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// app.js

app.post('/api/auth/users', async (req, res) => {
  try {
      const { action, username, password } = req.body; // Removed email from destructuring

      if (action === 'signup') {
          // Signup logic
          const existingUser = await User.findOne({ username });
          if (existingUser) {
              return res.status(400).json({ message: 'User already exists' });
          }

          const hashedPassword = await bcrypt.hash(password, 10);
          const user = new User({
              username,
              password: hashedPassword,
              // Removed email from the user object
          });

          await user.save();
          res.status(201).json({ message: 'User created successfully' });
      } else if (action === 'login') {
        console.log('login request received:', req.body);
          // Login logic
          const user = await User.findOne({ username });
          if (!user) {
              return res.status(400).json({ message: 'User not found' });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
              return res.status(400).json({ message: 'Invalid credentials' });
          }

          const token = jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '1h' });
          const refreshToken = jwt.sign({ id: user._id }, 'your_refresh_key', { expiresIn: '1h' });
          // Include user details in the response
          res.json({ token, refreshToken, user: { username: user.username } });
      } else {
          return res.status(400).json({ message: 'Invalid action' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Example protected route
app.get('/api/auth/protected', isAuthenticated, (req, res) => {
 res.json({ message: 'This is a protected route' });
});

module.exports = app;