import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import VideoThumbnail from '../components/VideoThumbnail';
import './categories.css';

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const search = params.get('search') || '';
  const category = params.get('category') || '';

  const categories = [
    'All',
    'Education',
    'Music',
    'Sports',
    'Gaming',
    'News',
    'Technology',
    'Entertainment'
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/videos', {
          params: { search, category: category === 'All' ? '' : category }
        });
        if (!cancelled) setVideos(Array.isArray(res.data) ? res.data : []);
      } catch {
        if (!cancelled) setVideos([]);
      }
    })();
    return () => { cancelled = true; };
  }, [search, category]);

  const handleCategoryClick = (cat) => {
    navigate(cat === 'All' ? '/' : `/?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="home-page">
      <Header onToggleSidebar={() => setSidebarVisible(!sidebarVisible)} />
      <Sidebar visible={sidebarVisible} />

      <div className="category-bar">
        <div className="inner">
          {categories.map((cat) => (
            <button
              key={cat}
              className={cat === category || (category === '' && cat === 'All') ? 'active' : ''}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="video-grid" role="main" aria-label="Videos">
        {videos.length > 0 ? (
          videos.map((video) => (
            <VideoThumbnail key={video._id || video.id} video={video} />
          ))
        ) : (
          <div style={{ padding: 24, color: 'var(--muted)' }}>
            No videos to display.
          </div>
        )}
      </main>
    </div>
  );
}
