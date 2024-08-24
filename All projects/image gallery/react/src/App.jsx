// src/App.jsx
import React, { useState } from 'react';
import Header from './components/header';
import ImageGallery from './components/ImageGallery';
import './styles/global.css';
import './styles/components.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <Header onSearch={setSearchTerm} />
      <ImageGallery searchTerm={searchTerm} />
    </div>
  );
}

export default App;
