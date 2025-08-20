import User from '../models/userModel.js';
import logger from '../../../logger.js';

// @desc    Get user profile
// @route   GET /api/v1/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        logger.error('Error fetching user profile', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Server error' });
    }
};

export { getUserProfile };
