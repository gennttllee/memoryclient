import './form.css'
import { useState, useEffect } from 'react';
import { createPost, updatePost, selectUpdate, populated, setShow } from '../../features/posts/postSlice'
import { user } from '../../features//users/userSlice'
import { theme } from '../../features/themes/themeSlice';
import { useDispatch, useSelector } from 'react-redux';

const Form = () => {
    const dispatch = useDispatch();
    const updates = useSelector(selectUpdate);
    const mode = useSelector(theme)
    const userInfo = useSelector(user);

    const [postData, setPostData] = useState({
        name: `${userInfo.name}`, email: `${userInfo.email}`, picture: `${userInfo.picture}`, title: '', message: '', file: [], tags: ''
    })

    useEffect(() => {
        if (updates) {
            setPostData(updates)
        }
    }, [updates]);

    const save = postData.message && postData.file.length > 0 && postData.tags.length > 0

    const submit = () => {
        if (postData._id) {
            dispatch(updatePost({
                id: postData._id,
                data: postData,
            }))
        } else {
            dispatch(createPost(postData))
        }
        clear();
        dispatch(setShow());
    }

    const clear = () => {
        dispatch(populated())
        setPostData({
            name: `${userInfo.name}`, email: `${userInfo.email}`, picture: `${userInfo.picture}`, title: '', message: '', file: [], tags: ''
        })
    }

    const poster = (e) => {
        let items = [...postData.file];
        Array.from(e.target.files).forEach(file => {
            const base64 = URL.createObjectURL(file)
            items.push({ base64, file })
        })
        setPostData({ ...postData, file: items })
    }

    const remover = (file) => {
        const data = postData.file.filter(item => item !== file)
        setPostData({ ...postData, file: [...data] })
    }

    return (
        <div className={`form ${mode && 'dark'}`}>
            <button onClick={() => dispatch(setShow())} className='x'>
                <span className="material-symbols-outlined scale">
                    close
                </span>
            </button>
            <h3 className='h3'>{postData._id ? 'Edit' : 'Create'} a memory</h3>
            <div className='postFileRow'>
                <label htmlFor='fame' className={postData.file.length > 0 ? 'label1' : 'label'}>
                    {postData.file.length > 0 ? <div className='instagram'>
                        <span className='plus1'>+</span>
                    </div>
                        : <div className='facebook'><span className='plus'>+</span>
                            <span>upload images</span> </div>}
                    <input onChange={poster} className='hide' multiple id='fame' type='file' accept="image/png, image/jpg, image/gif, image/jpeg" />
                </label>
                {postData.file.length > 0 && postData.file.map((item, index) => <div className='postFileCon' key={index}>
                    <img className='fileRow' src={item.base64 || item} alt='energy' />
                    <button onClick={() => remover(item)} className='place'>
                        <span className="material-symbols-outlined">
                            close
                        </span>
                    </button>
                </div>)}
            </div>
            <fieldset className='fieldSet'>
                <legend>Caption</legend>
                <input type='text' onChange={(e) => setPostData({ ...postData, message: e.target.value })} className='input' maxLength={500} value={postData.message} />
            </fieldset>
            <fieldset className='fieldSet'>
                <legend>Tags</legend>
                <input type='text' onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(/[, ]+/) })} className='input' placeholder='No # symbol allowed' maxLength={30} value={postData.tags} />
            </fieldset>
            <button onClick={submit} type='submit' disabled={!save} className={save ? 'btn' : 'none'}>Post</button>
            <button onClick={clear} disabled={!save} className={save ? 'btn' : 'none'}>clear</button>
        </div>
    )
}

export default Form