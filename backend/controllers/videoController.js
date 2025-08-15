const Video = require('../models/Video');

exports.getVideoById = async (req, res) => {
  try {
    const v = await Video.findById(req.params.id)
      .populate('channel', 'name')
      .lean();
    if (!v) return res.status(404).json({ message: 'Video not found' });
    return res.json(v);
  } catch (e) {
    return res.status(500).json({ message: 'Error fetching video' });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    let v = await Video.findById(req.params.id);
    if (!v) return res.status(404).json({ message: 'Video not found' });

    if (v.likes.includes(userId)) {
      v.likes.pull(userId);
    } else {
      v.likes.push(userId);
      v.dislikes.pull(userId);
    }
    await v.save();

    v = await Video.findById(req.params.id)
      .populate('channel', 'name')
      .lean();
    res.json(v);
  } catch (err) {
    res.status(500).json({ message: 'Error toggling like' });
  }
};

exports.toggleDislike = async (req, res) => {
  try {
    const userId = req.user.id;
    let v = await Video.findById(req.params.id);
    if (!v) return res.status(404).json({ message: 'Video not found' });

    if (v.dislikes.includes(userId)) {
      v.dislikes.pull(userId);
    } else {
      v.dislikes.push(userId);
      v.likes.pull(userId);
    }
    await v.save();

    v = await Video.findById(req.params.id)
      .populate('channel', 'name')
      .lean();
    res.json(v);
  } catch (err) {
    res.status(500).json({ message: 'Error toggling dislike' });
  }
};