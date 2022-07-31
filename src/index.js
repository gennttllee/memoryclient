import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { fetchPosts } from './features/posts/postSlice'
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Auth from './pages/Auth'
import Profile from './pages/Profile';
import Search from './pages/Search';
import Creator from './pages/Creator';
import PostId from './pages/PostId';

store.dispatch(fetchPosts())


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="home" element={<App />} />
          <Route path="profile" element={<Profile />} />
          <Route path='search/:key' element={<Search />} />
          <Route path="profile/:creator" element={<Creator />} />
          <Route path="post/:id" element={<PostId />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
