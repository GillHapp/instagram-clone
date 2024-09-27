import express from 'express';
const router = express.Router();


import { register, login, logOut, getProfile, updateProfile, getSuggestedUsers, followAndUnfollow } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';



router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logOut);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router.route("/profile/update").post(isAuthenticated, upload.single('profilePitcure'), updateProfile);
router.route("/suggestedUsers").get(isAuthenticated, getSuggestedUsers);
router.route("followAndUnfollow/:id").post(isAuthenticated, followAndUnfollow);

export default router;

