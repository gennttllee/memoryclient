import Layout from './components/Layout';
import styles from './app.module.css'
import { useSelector } from 'react-redux';
import { user } from './features/users/userSlice'
import { show } from './features/posts/postSlice';
import { useNavigate } from 'react-router-dom';
import Posts from './components/posts/Posts';
import { useEffect } from 'react';
import Form from './components/form/Form';

function App() {
  const shows = useSelector(show)
  const navigate = useNavigate();
  const userInfo = useSelector(user);

  useEffect(() => {
    if (!userInfo) {
      navigate('/')
    }
  }, [userInfo, navigate]);

  return (
    userInfo && <Layout>
      <div className={styles.flex}>
        <Posts />
        <div className={styles.form}>
          <Form />
        </div>
      </div>
    </Layout>
  );
}

export default App;
