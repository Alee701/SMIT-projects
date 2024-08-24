// src/components/Header.jsx
import React from 'react';

const Header = ({ onSearch }) => {
  return (
    <header className="header">
      <div className="header-logo">Image Gallery</div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search images..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </header>
  );
};

export default Header;
