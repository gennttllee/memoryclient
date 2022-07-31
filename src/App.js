import Layout from './components/Layout';
import './App.css';
import { useSelector } from 'react-redux';
import { user } from './features/users/userSlice'
import { useNavigate } from 'react-router-dom';
import Posts from './components/posts/Posts';
import {useEffect} from 'react';

function App() {
  const navigate = useNavigate();
  const userInfo = useSelector(user);

  useEffect(() => {
    if (!userInfo) {
      navigate('/')
    }
  }, [userInfo, navigate]);

  return (
    userInfo && <Layout>
      <Posts />
    </Layout>
  );
}

export default App;
