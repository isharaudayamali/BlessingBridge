const express = require('express');
const router = express.Router();
const {
	registerUser,
	loginUser,
	getProfile,
	updateUserProfile,
} = require('../controllers/userController');
const authUser = require('../auth/userAuth');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/get-profile', authUser, getProfile);
router.put('/update-profile', authUser, updateUserProfile);

module.exports = router;
