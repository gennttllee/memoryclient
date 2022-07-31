import FileBase from 'react-file-base64';
import './auth.css'
import { useState, useEffect } from 'react';
import { theme } from '../features/themes/themeSlice';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { addUser, user, signIn, signUp, getStatus, googleReg } from '../features/users/userSlice';


const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const initial = { firstName: '', lastName: '', email: '',picture : '' , password: '', confirmPassword: '' }
    const [data, setData] = useState(initial)
    const [log, setLog] = useState(true)
    const mode = useSelector(theme);
    const status = useSelector(getStatus);
    const [message, setMessage] = useState('idle')
    const userInfo = useSelector(user);


    const handleCallbackResponse = async (response) => {
        dispatch(googleReg({ profile: response.credential }));
    };

    useEffect(() => {
        if (userInfo !== null) {
            navigate('/home')
        } else {
            /* global google */
            try {
                google.accounts.id.initialize({
                    client_id: "406093640089-bv6bqbckvl4uh0svln5j0d3u2algnqpf.apps.googleusercontent.com",
                    callback: handleCallbackResponse,
                })

                google.accounts.id.renderButton(
                    document.getElementById('div'),
                    { theme: 'outline', size: 'large' }
                )

                google.accounts.id.prompt();
            } catch (error) {
                setMessage('fail')
                console.log(error)
            }
        }

    }, [message, userInfo]);

    const sign = (e) => {
        e.preventDefault()
        setLog(!log);
    }

    const login = (e) => {
        e.preventDefault()
        setLog(!log);
    }

    const submitForm = (e) => {
        e.preventDefault();
        if (log) {
            dispatch(signIn(data))
        } else {
            if(data.picture){
                dispatch(signUp(data))
            } else return;
        }
    }

    const handle = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    if (status.idle === 'failed') {
        return(
            <h1 className='loading'>Invalid credentials refresh the page to try again</h1>
        )
    }

    return (
        <form onSubmit={submitForm} className={mode ? 'form1 darkForm' : 'form1'}>
            {!log &&
                <>
                    <fieldset className='fieldset1'>
                        <legend>First Name</legend>
                        <input required onChange={handle} className='input1' name='firstName' type='text' />
                    </fieldset>
                    <fieldset className='fieldset1'>
                        <legend>Last Name</legend>
                        <input required onChange={handle} className='input1' name='lastName' type='text' />
                    </fieldset>
                </>
            }
            <fieldset className='fieldset1'>
                <legend>Email Address</legend>
                <input name='email' required onChange={handle} className='input1' type='email' />
            </fieldset>
            {!log && <div className='fieldset1'>
                <FileBase
                    type='file'
                    multiple={false}
                    onDone={({base64}) => setData({...data, picture :base64})}
                />
            </div>}
            <fieldset className='fieldset1'>
                <legend>Password</legend>
                <input className='input1' required onChange={handle} name='password' type='password' />
            </fieldset>
            {!log && <fieldset className='fieldset1'>
                <legend>Confirm Password</legend>
                <input className='input1' required onChange={handle} name='confirmPassword' type='password' />
            </fieldset>}
            <button className='btnSubmit' type='submit'>{status === 'loading' ? 'loading' : 'Submit'}</button>
            <div className='google' id='div'></div>
            {!log ? <button className='btnLog' onClick={login}>already have an account ? Login here</button> : <button className='btnLog' onClick={sign}>Don't have an account ? sign up</button>}
        </form>
    )
}

export default Auth