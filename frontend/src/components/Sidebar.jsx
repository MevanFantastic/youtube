import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const categories = ['All', 'Music', 'Sports', 'Education', 'Gaming', 'News'];

export default function Sidebar({ visible }) {
  const navigate = useNavigate();
  const handleCategory = (cat) => {
    const query = cat === 'All' ? '' : `?category=${encodeURIComponent(cat)}`;
    navigate(`/${query}`);
  };

  return (
    <aside className={`sidebar ${visible ? 'visible' : ''}`}>
      {categories.map(cat => (
        <button key={cat} onClick={() => handleCategory(cat)}>{cat}</button>
      ))}
    </aside>
  );
}
