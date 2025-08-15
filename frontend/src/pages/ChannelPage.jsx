import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ChannelPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [category, setCategory] = useState('');

  const [newChannelName, setNewChannelName] = useState('');

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axios.get('/api/channels/mine');
        setChannel(res.data);
      } catch (err) {
        setChannel(null); // no channel yet
      }
    };
    fetchChannel();
  }, []);

  useEffect(() => {
    if (!channel) return;
    const fetchVideos = async () => {
      const res = await axios.get(`/api/videos?channelId=${channel._id}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [channel]);

  const handleAddVideo = async () => {
    if (!title || !videoUrl) return;
    const res = await axios.post('/api/videos', {
      title, description, videoUrl, thumbnailUrl, category, channelId: channel._id
    });
    setVideos([res.data, ...videos]);
    setTitle(''); setDescription(''); setVideoUrl(''); setThumbnailUrl(''); setCategory('');
  };

  const handleDelete = async (videoId) => {
    await axios.delete(`/api/videos/${videoId}`, { data: { channelId: channel._id } });
    setVideos(videos.filter(v => v._id !== videoId));
  };

  const handleCreateChannel = async () => {
    if (!newChannelName) return;
    const res = await axios.post('/api/channels', { name: newChannelName });
    setChannel(res.data);
    setNewChannelName('');
  };

  if (!channel) {
    return (
      <div className="channel-page">
        <h2>Create Your Channel</h2>
        <input
          value={newChannelName}
          onChange={(e) => setNewChannelName(e.target.value)}
          placeholder="Channel Name"
        />
        <button onClick={handleCreateChannel}>Create Channel</button>
      </div>
    );
  }

  return (
    <div className="channel-page">
      <h2>{channel.name} Channel</h2>
      <div className="new-video-form">
        <h3>Add New Video</h3>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="Video URL" required />
        <input value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} placeholder="Thumbnail URL" />
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
        <button onClick={handleAddVideo}>Upload Video</button>
      </div>
      <h3>Your Videos</h3>
      <ul className="video-list">
        {videos.map(video => (
          <li key={video._id}>
            {video.title}
            <button onClick={() => navigate(`/edit/${video._id}`)}>Edit</button>
            <button onClick={() => handleDelete(video._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
