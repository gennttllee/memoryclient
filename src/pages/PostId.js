import Layout from "../components/Layout"
import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postStatus, searchPost, getPost } from "../features/search/searchSlice";
import { user } from '../features/users/userSlice'
import './profile.css'
import Post from '../components/posts/post/Post'

const PostId = () => {
    const userInfo = useSelector(user)
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const status = useSelector(postStatus);
    const result = useSelector(getPost);

    useEffect(() => {
        if (userInfo === null) {
            navigate('/')
        }
        if (params) {
            dispatch(searchPost(params))
        }
    }, [params, userInfo, navigate, dispatch]);

    if (status === 'loading') { return ( <Layout><h1 className="loading">Loading...</h1></Layout>)}

    if (status === 'failed') { return (<Layout><h1 className="loading">sorry something went wrong please try again later</h1></Layout>) }

    if (status === 'success') { return ( <Layout><Post post={result.post} /> </Layout> )}
}

export default PostId