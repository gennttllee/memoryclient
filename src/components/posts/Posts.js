import { useSelector, useDispatch } from 'react-redux';
import { selectAllPosts, getPostStatus, fetchPosts } from '../../features/posts/postSlice';
import Post from './post/Post';
import { useEffect } from 'react';
import './posts.css';

const Posts = () => {
    const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts)
    const status = useSelector(getPostStatus)

    useEffect(() => {
        if (posts.length < 1) {
            dispatch(fetchPosts());
        }
    }, [posts, dispatch]);

    if (status === 'succeeded') {

        return (
            <div className='postsDiv'>
                {posts.map((post, index) => <Post
                    key={index}
                    post={post}
                />)}
            </div>
        )
    }

    if (status === 'loading') {
        return (
            <h1 className='loading'>Loading...</h1>
        )
    }

    if (status === 'failed') {
        return (
            <h1 className='loading'>Sorry something went wrong try again later</h1>
        )
    }
}

export default Posts