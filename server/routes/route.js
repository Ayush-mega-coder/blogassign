import express from 'express';
// import passport from 'passport'; // Path to your passport.js file
import passport from './passport.js'
import cors from 'cors'
import session from 'express-session'
// const session = require('express-session');

import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
  getPendingPosts,
  getRejectedPosts,
  approvePost,
  rejectPost,
  getApprovedPost,
  approveUpdateRequest,
  getUpdateRequest,
} from '../controller/post-controller.js';
import { uploadImage, getImage } from '../controller/image-controller.js';

import {
  loginUser,
  singupUser,
  logoutUser,
  getUsers,
  homePage,
  blockUser,
  googleAuth

} from '../controller/user-controller.js';
import { authenticateToken, createNewToken } from '../controller/jwt-controller.js';

import upload from '../utils/upload.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', singupUser);
router.post('/logout', logoutUser);
// router.post('/googleLog', googleAuth);


router.post('/token', createNewToken);

router.post('/create', authenticateToken, createPost);
router.put('/update/:id', authenticateToken, updatePost);
router.put('/update/request/approve/:id', authenticateToken, approveUpdateRequest);
router.get('/update/requests', authenticateToken, getUpdateRequest);

router.delete('/delete/:id', authenticateToken, deletePost);
router.put('/block/:id', blockUser);

router.get('/post/:id', authenticateToken, getPost);
router.get('/posts', authenticateToken, getAllPosts);
router.get('/posts/pending', authenticateToken, getPendingPosts);
router.get('/posts/approved', authenticateToken, getApprovedPost);
router.get('/posts/rejected', authenticateToken, getRejectedPosts);
router.put('/post/approve/:id', approvePost);
router.put('/post/reject/:id', rejectPost);

router.post('/file/upload', upload.single('file'), uploadImage);
router.get('/file/:filename', getImage);

router.get('/users', getUsers);
// router.get('/', homePage);

router.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
router.use(passport.initialize());
router.use(passport.session())
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// Passport routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google', googleAuth);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirect or send response after successful authentication
    console.log("login succesful")
    res.redirect('/users')
  }
);
router.get('/auth/protected', isLoggedIn, (req, res) => {
  let name = req.user.displayName;
  res.send(`hello there ${name}`);
});

router.get('/auth/google/failure', (req, res) => {
  res.send('failure');
});

export default router;
