const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const authMiddleware = require('../middleware/authMiddleware');
const { getVideoById, toggleLike, toggleDislike } = require('../controllers/videoController');

function buildQuery(query) {
    const q = {};
    if (query.category) q.category = query.category;
    if (query.search) q.title = new RegExp(query.search, 'i');
    if (query.channelId) q.channel = query.channelId;
    return q;
}

// Create a new video
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, videoUrl, thumbnailUrl, category, channelId } = req.body;
        const video = new Video({ title, description, videoUrl, thumbnailUrl, category, channel: channelId });
        await video.save();
        res.json(video);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all videos
router.get('/', async (req, res) => {
    try {
        const filter = buildQuery(req.query);
        const videos = await Video.find(filter).populate('channel', 'name').sort({ createdAt: -1 });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get video by id (using controller)
router.get('/:id', getVideoById);

// Update video
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        if (video.channel.toString() !== req.body.channelId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        const { title, description, thumbnailUrl, category } = req.body;
        video.title = title || video.title;
        video.description = description || video.description;
        video.thumbnailUrl = thumbnailUrl || video.thumbnailUrl;
        video.category = category || video.category;
        await video.save();
        res.json(video);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete video
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        if (video.channel.toString() !== req.body.channelId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await video.remove();
        res.json({ message: 'Video deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle like via controller
router.post('/:id/like', authMiddleware, toggleLike);

// Toggle dislike via controller
router.post('/:id/dislike', authMiddleware, toggleDislike);

module.exports = router;