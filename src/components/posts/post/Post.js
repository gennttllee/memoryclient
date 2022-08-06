import './post.css'
import moment from 'moment';
import { populate, deletePost, likePost, commentPost } from '../../../features/posts/postSlice'
import { useDispatch, useSelector, } from 'react-redux';
import { Navigation, Pagination, A11y } from 'swiper';
import { theme } from '../../../features/themes/themeSlice';
import { user } from '../../../features/users/userSlice'
import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRef } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Post = ({ post }) => {
    const myRef = useRef();
    const [show, setShow] = useState('')
    const [liked, setLiked] = useState('')
    const [comments, setComments] = useState('')
    const userInfo = useSelector(user)
    const dispatch = useDispatch();
    const mode = useSelector(theme)

    const comment = useCallback((post) => {
        if (show) {
            setShow('')
        } else {
            setShow(post)
        }
    }, [show])

    const liker = (post) => {
        if (liked) {
            setLiked('')
        } else {
            setLiked(post)
        }
    }

    const send = () => {
        if (comments) {
            dispatch(commentPost(
                { post, comments, userInfo }
            ))
            setComments('')
            myRef.current.scrollIntoView({ behavior: 'smooth' })
        } else {
            return;
        }
    }

    const finder =() => {
        const comp = post.likes.find(item => {
            return item.email === userInfo.email
        })
        if (comp) return 'iconic'
        else return;
    }

    const share = async (post) => {
        const url = `/post/${post._id}`
        const title = post.name
        const text = post.message
        const shareDetails = { url, title, text };
        try {
            await navigator.share(shareDetails)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={mode ? 'postDiv dark' : 'postDiv'}>
            <div className='postHead'>
                <Link className='headDiv' to={`/profile/${post.creator}`}>
                    <img className='picnic' referrerPolicy="no-referrer" src={post.picture} alt='source' />
                    <h2 className='postName'> {post.name}</h2>
                </Link>
                {post.email === userInfo.email && <button className='edit' onClick={() => dispatch(populate(post))}>
                    <span className="material-symbols-outlined ">
                        more_vert
                    </span>
                </button>}
            </div>
            <div className='swipeHarry'>
                <Swiper
                    modules={[Navigation, Pagination, A11y]}
                    spaceBetween={0}
                    slidesPerView={1}
                    scrollbar={{draggable : true}}
                    navigation
                    pagination={{ clickable: true }}
                >
                    {post.file.map((item, index) => <SwiperSlide key={index}> <img className='slider' src={item} alt='upload' /></SwiperSlide>)}
                    .
                </Swiper>
            </div>

            <div className='btnDiv'>
                <button onClick={() => dispatch(likePost({ id: post._id, userInfo }))} className='likesBtn'>
                    <span className={`fa fa-thumbs-up ${finder()}`}></span>
                </button>
                <button onClick={() => comment(post._id)} className='comments'>
                    <span className="material-symbols-outlined">
                        comment
                    </span>
                </button>
                {userInfo.email === post.email && <button className='likesBtn' onClick={() => dispatch(deletePost(post._id))}>
                    <span className='fa fa-trash'></span>
                </button>}
                <button onClick={() => share(post)} className='shareBtn'><span className="material-symbols-outlined">share </span></button>
            </div>

            <div className='likeBox'>
                <p onClick={() => liker(post._id)} className='likes'>{post.likes.length}  {post.likes.length < 2 ? 'like' : 'likes'}</p>
                <p className='likes'>{post.comments.length}  {post.comments.length < 2 ? 'comment' : 'comments'}</p>
            </div>

            <p className='postMess'>{post.message}</p>

            {post._id === liked && <div className={mode ? 'babyDark' : 'baby'}>
                <button onClick={() => setLiked('')} className='materialBtn'>
                    <span className="material-symbols-outlined">
                        close
                    </span>
                </button>
                <div className='picnicDiv'>
                    {post.likes.length > 0 && post.likes.map((data, index) => <div className='pixelDiv' key={index}>
                        <div className='pixel'>
                            <img referrerPolicy="no-referrer" className='picnic' src={data.picture} alt='co' />
                            <p className='pixelName'>{data.name}</p>
                        </div>
                    </div>)}
                </div>
            </div>}

            {post._id === show && <div className={mode ? 'babyDark' : 'baby'}>
                <button onClick={() => setShow('')} className='materialBtn'>
                    <span className="material-symbols-outlined">
                        close
                    </span>
                </button>
                <div className='picnicDiv'>
                    {post.comments.length > 0 && post.comments.map((data, index) => <div className='pixelDiv' key={index}>
                        <div className='pixel'>
                            <img referrerPolicy="no-referrer" className='picnic' src={data.picture} alt='co' />
                            <p className='pixelName'>{data.name}</p>
                        </div>
                        <p className='pixelComment'>{data.comment}</p>
                    </div>)}
                    <div ref={myRef}></div>
                </div>
                <div className='babyDiv'>
                    <input className='babyInput' type='text' value={comments} placeholder='add comment' onChange={(e) => setComments(e.target.value)} />
                    <button onClick={send} className='babyBtn'>
                        <span className="material-symbols-outlined plane">
                            send
                        </span>
                    </button>
                </div>
            </div>}
            <p className='postTags'>{post.tags.map((tag, index) => <span className='tag' key={index}>#{tag}</span>)}</p>
            <p className='postTime'>{moment(post.createdAt).fromNow()}</p>
        </div>
    )
}

export default Post