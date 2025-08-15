const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();
const authRoutes = require('./routes/auth');
const channelRoutes = require('./routes/channels');
const videoRoutes = require('./routes/videos');
const commentRoutes = require('./routes/comments');


const app = express();
app.use(cors());
app.use(express.json());

// mango
mongoose.connect(process.env.MONGODB_URI, {
useNewUrlParser: true,
useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
