import React from 'react';
import { Link } from 'react-router-dom';
import './VideoThumbnail.css';

const PLACEHOLDER = 'https://picsum.photos/400/220?grayscale&blur=2';

export default function VideoThumbnail({ video }) {
  const channelName =
    (video.channel && (video.channel.name || video.channel.channelName)) ||
    video.channelName ||
    video.uploaderName ||
    video.uploader ||
    (typeof video.channel === 'string' ? video.channel : 'Unknown Channel');

  const thumbnailUrl = video.thumbnailUrl || video.thumbnail || PLACEHOLDER;
  const views = video.views != null ? video.views : 0;
  const id = video._id || video.id || video.videoId;

  return (
    <div className="video-thumb card">
      <Link to={`/videos/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img
          src={thumbnailUrl}
          alt={video.title || 'Video'}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
        />
        <h3>{video.title || 'Untitled'}</h3>
      </Link>
      <p className="muted">{channelName} • {views} views</p>
    </div>
  );
}
