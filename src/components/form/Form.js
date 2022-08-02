import './form.css'
import FileBase from 'react-file-base64';
import { useState, useEffect } from 'react';
import { createPost, updatePost, selectUpdate, populated, setShow } from '../../features/posts/postSlice'
import {user} from '../../features//users/userSlice'
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


    const save = postData.message  && postData.file.length > 0 && postData.tags

    const submit = (e) => {
        e.preventDefault();
        if (postData._id) {
            dispatch(updatePost({
                id: postData._id,
                data: postData,
            }))
        } else {
            console.log('boy')
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

    const poster = (base64) => {
        let newData = []
        base64.forEach(obj => {
            newData.push(obj.base64)
        })
        setPostData({ ...postData, file: [...newData] })
    }

    return (
        <form className={`form ${mode && 'dark'}`}>
            <button onClick={()=> dispatch(setShow())} className='x'>
                <span className="material-symbols-outlined scale">
                    close
                </span>
            </button>
            <h3 className='h3'>{postData._id ? 'Edit' : 'Create'} a memory</h3>
            <fieldset className='fieldSet'>
                <legend>Message</legend>
                <textarea onChange={(e) => setPostData({ ...postData, message: e.target.value })} className='input'  maxLength={500} value={postData.message} />
            </fieldset>
            <fieldset className='fieldSet'>
                <legend>Tags</legend>
                <textarea onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(/[, ]+/) })} className='input' placeholder='No # symbol allowed' maxLength={30}  value={postData.tags} />
            </fieldset>
            <div className='fileDiv'>
            <legend>Upload images</legend>
                <FileBase
                    type='file'
                    multiple={true}
                    onDone={(base64) => poster(base64)}
                />
            </div>
            <button onClick={submit} type='submit' disabled={!save} className={save ? 'btn' : 'none'}>submit</button>
            <button onClick={clear} disabled={!save} className={save ? 'btn' : 'none'}>clear</button>
        </form>
    )
}

export default Form