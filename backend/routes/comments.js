const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const Comment = require('../models/Comment');

//post comment
router.post('/', auth, async (req, res) => {
  try {
    const { videoId, text } = req.body;
    const comment = new Comment({ text, user: req.userId, video: videoId });
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/:videoId', async (req, res) => {
  const comments = await Comment.find({ videoId: req.params.videoId })
    .populate('user', 'name _id') 
    .sort({ createdAt: -1 });
  res.json(comments);
});


//edit comment
router.put('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    comment.text = req.body.text || comment.text;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

//delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await comment.remove();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

exports.getCommentsByVideo = async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate('user', 'name _id') // <-- this is the fix
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

module.exports = router;
