import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Header.css';

export default function Header({ onToggleSidebar }) {
  const { user, setUser, setToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = e => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <header className="header">
      <button onClick={onToggleSidebar}>☰</button>
      <Link to="/">YouTube</Link>
      <form onSubmit={handleSearch}>
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search"
        />
        <button type="submit">GO! </button>
      </form>
      {user ? (
        <>
          <Link to="/channel" style={{ marginLeft: '10px' }}>
            My Channel
          </Link>
          <span style={{ marginLeft: '10px' }}>
            Hello, {user.name} | <button onClick={handleLogout}>Logout</button>
          </span>
        </>
      ) : (
        <Link to="/login">Sign In</Link>
      )}
    </header>
  );
}
