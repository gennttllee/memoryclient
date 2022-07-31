import {useEffect} from 'react'
import Layout from '../components/Layout'
import { searchStatus, searchWord, search } from '../features/search/searchSlice';
import { useSelector, useDispatch } from 'react-redux';
import './profile.css'
import Post from '../components/posts/post/Post'
import { useParams } from 'react-router-dom';


const Search = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const status = useSelector(searchStatus);
    const result = useSelector(searchWord);

    useEffect(() => {
        if (params){
            const {key} = params;
            dispatch(search(key))
        }
    }, [params, dispatch]);

    if (status === 'loading') { return (<Layout><h1 className='loading'>Loading...</h1></Layout>) }

    if (status === 'failed') { return (<Layout><h1 className='loading'>Sorry could not process request at the moment please try again later</h1></Layout>) }

    if (status === 'success') {
        return (
            <Layout>
                <div className='profileContainer'>
                    {result.length > 0 ? result.map((post, index) => <Post
                        key={index}
                        post={post}
                    />) : <h1 className='loading'>No result found</h1>}
                </div>
            </Layout>
        )
    }
}

export default Search