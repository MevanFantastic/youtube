import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditVideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await axios.get(`/api/videos/${id}`);
      setVideo(res.data);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setThumbnailUrl(res.data.thumbnailUrl);
      setCategory(res.data.category);
    };
    fetchVideo();
  }, [id]);

  const handleUpdate = async () => {
    await axios.put(`/api/videos/${id}`, { 
      title, description, thumbnailUrl, category, channelId: video.channel._id 
    });
    navigate('/channel');
  };


  if (!video) return <div>Loading...</div>;
  return (
    <div className="form-container">
      <h2>Edit Video</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <input value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} placeholder="Thumbnail URL" />
      <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
      <button onClick={handleUpdate}>Save Changes</button>
    </div>
  );
}
