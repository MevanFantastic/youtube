import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';




export default function VideoPage() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  const userId = useMemo(() => (user?.id || user?._id || null), [user]);
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/videos/${id}`);
        setVideo(res.data);
      } catch (err) {
        console.error('Error fetching video:', err);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/comments/${id}`);
        setComments(res.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchVideo();
    fetchComments();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment) return;
    try {
      const res = await axios.post(
        'http://localhost:5000/api/comments',
        { videoId: id, text: newComment },
        { headers: authHeader }
      );
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: authHeader,
      });
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text);
  };

  const handleSaveEdit = async (commentId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        { text: editText },
        { headers: authHeader }
      );
      setComments(comments.map((c) => (c._id === commentId ? res.data : c)));
      setEditingCommentId(null);
      setEditText('');
    } catch (err) {
      console.error('Error editing comment:', err);
    }
  };

  const isLiked = useMemo(() => {
    if (!video || !userId) return false;
    return (video.likes || []).some((u) => String(u) === String(userId));
  }, [video, userId]);

  const isDisliked = useMemo(() => {
    if (!video || !userId) return false;
    return (video.dislikes || []).some((u) => String(u) === String(userId));
  }, [video, userId]);

  const handleLike = async () => {
    if (!token) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/videos/${id}/like`,
        {},
        { headers: authHeader }
      );
      setVideo(res.data);
    } catch (err) {
      console.error('Error liking video:', err);
    }
  };

  const handleDislike = async () => {
    if (!token) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/videos/${id}/dislike`,
        {},
        { headers: authHeader }
      );
      setVideo(res.data);
    } catch (err) {
      console.error('Error disliking video:', err);
    }
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div className="video-page">
      <h2>{video.title}</h2>
      <video src={video.videoUrl} controls width="100%" />
      <p>{video.views} views • Channel: {video.channel?.name || 'Unknown'}</p>
      <p>{video.description}</p>

      <div className="video-actions">
        <button
          onClick={handleLike}
          disabled={!token}
          style={{ fontWeight: isLiked ? '700' : '400' }}
        >
          Like👍 {video.likes?.length || 0}
        </button>
        <button
          onClick={handleDislike}
          disabled={!token}
          style={{ fontWeight: isDisliked ? '700' : '400', marginLeft: 8 }}
        >
          Dislike👎 {video.dislikes?.length || 0}
        </button>
      </div>

      <h3>Comments</h3>
      {user && (
        <div className="add-comment">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>Post</button>
        </div>
      )}
      <ul className="comments-list">
        {comments.map((comment) => (
          <li key={comment._id}>
            <p><strong>{comment.user?.name || 'Anonymous'}</strong></p>
            {editingCommentId === comment._id ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(comment._id)}>Save</button>
                <button onClick={() => setEditingCommentId(null)}>Cancel</button>
              </>
            ) : (
              <p>{comment.text}</p>
            )}
            <p className="comment-date">{new Date(comment.createdAt).toLocaleString()}</p>
            {userId && String(userId) === String(comment.user?._id) && (
              <>
                <button onClick={() => handleEditComment(comment)}>Edit</button>
                <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
