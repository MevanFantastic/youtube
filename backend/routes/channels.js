const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const Channel = require('../models/Channel');


router.post('/', auth, async (req, res) => {
  try {
    const existing = await Channel.findOne({ user: req.userId });
    if (existing) return res.status(400).json({ message: 'Channel already exists' });
    
    const { name, description } = req.body;
    const channel = new Channel({ user: req.userId, name, description });
    await channel.save();
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/mine', auth, async (req, res) => {
  try {
    const channel = await Channel.findOne({ user: req.userId });
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// get channel by id 
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: 'Channel not found' });
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
