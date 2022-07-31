import Layout from "../components/Layout"
import { useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchUser, resultStatus, userProfile } from "../features/search/searchSlice";
import { user } from '../features/users/userSlice'
import Post from "../components/posts/post/Post";
import './profile.css';

const Creator = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const params = useParams()
    const searchResult = useSelector(userProfile);
    const loader = useSelector(resultStatus);
    const userInfo = useSelector(user);

    useEffect(() => {
        if (userInfo === null) {
            navigate('/')
        }
        if (params) {
            dispatch(searchUser(params))
        }
    }, [params, dispatch, userInfo, navigate]);

    if (loader === 'loading') {
        return (
            <Layout>
                <h1 className="loading">Loading</h1>
            </Layout>
        )
    }

    if (loader === 'failed') {
        return (
            <Layout>
                <h1 className="loading">something went wrong please try again later</h1>
            </Layout>
        )
    }

    if (loader === 'success') {
        const { post } = searchResult;
        const user1 = searchResult.user;
        return (
            <Layout>
                <div>
                    <div className="profile">
                        {user1 && <>
                            <img className="profilePic" src={user1.picture} alt='profile' />
                            <p>{user1.name}</p>
                            <p>{user1.email}</p>
                        </>}
                        {post.length > 0 ? <div className="profileContainer">
                            {post.map((item, index) => <Post
                                key={index}
                                post={item}
                            />)}
                        </div> : <p>No post yet</p>}
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Creator