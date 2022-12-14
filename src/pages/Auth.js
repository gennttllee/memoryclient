
import './auth.css'
import { useState, useEffect, useRef } from 'react';
import { theme } from '../features/themes/themeSlice';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { error, mess, user, signIn, signUp, getStatus, googleReg, savePassword, resetPassword } from '../features/users/userSlice';

const Auth = () => {
    const pic = useRef()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const initial = { firstName: '', lastName: '', email: '', token: '', newPassword: '', picture: '', password: '', confirmPassword: '' }
    const [data, setData] = useState(initial)
    const [log, setLog] = useState(true)
    const mode = useSelector(theme);
    const status = useSelector(getStatus);
    const [message, setMessage] = useState('idle')
    const userInfo = useSelector(user);
    const errorMessage = useSelector(error)
    const [forget, setForget] = useState(false)
    const otp = useSelector(mess)

    useEffect(() => {
        if (userInfo !== null) {
            navigate('/home')
        } else {
            /* global google */
            try {
                const handleCallbackResponse = async (response) => {
                    dispatch(googleReg({ profile: response.credential }));
                };

                google.accounts.id.initialize({
                    client_id: process.env.REACT_APP_CLIENT_ID,
                    callback: handleCallbackResponse,
                })

                google.accounts.id.renderButton(
                    document.getElementById('div'),
                    { theme: 'outline', size: 'large' }
                )

                google.accounts.id.prompt();
            } catch (error) {
                setMessage(error)
            }
        }

    }, [dispatch, navigate, userInfo]);

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
            if (data.picture) {
                dispatch(signUp(data))
            } else return;
        }
    }


    const handle = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const forgot = (e) => {
        e.preventDefault();
        setForget(!forget)
    }

    const extracted = data.email;

    const changes = (e) => {
        const url = URL.createObjectURL(e.target.files[0])
        setData({ ...data, picture: e.target.files[0] })
        pic.current.style.background = `url(${url})`
        pic.current.style.backgroundSize = 'cover'
        pic.current.style.backgroundPosition = 'center'
    }

    const passwordReset = (e) => {
        e.preventDefault()

        if (otp) {
            if (Number(otp) === Number(data.token)) {
                dispatch(savePassword(data))
            } else {
                window.alert('invalid otp')
                return;
            }
        } else {
            dispatch(resetPassword(extracted))
        }
    }

    return (
        <>
            {forget ?
                <form onSubmit={passwordReset} className={mode ? 'form1 darkForm' : 'form1'}>
                    <p style={{ textAlign: 'center' }}>Kindly provide your email address</p>
                    {status === 'failed' || status === 'success' ? <h2 className='invalid'> {errorMessage}</h2> : null}
                    <fieldset className='fieldset1'>
                        <legend>Email Address</legend>
                        <input name='email' required onChange={handle} className='input1' type='email' />
                    </fieldset>
                    {status === 'success' && <fieldset className='fieldset1'>
                        <legend>Token Generated</legend>
                        <input className='input1' required onChange={handle} name='token' type='text' />
                    </fieldset>}
                    {status === 'success' && <fieldset className='fieldset1'>
                        <legend>New Password</legend>
                        <input className='input1' required onChange={handle} name='newPassword' type='password' />
                    </fieldset>}
                    <button className='btnSubmit' type='submit'>{status === 'loading' ? 'loading...' : 'Submit'}</button>
                </form>
                :
                <form onSubmit={submitForm} className={mode ? 'form1 darkForm' : 'form1'}>
                    {status === 'failed' && <h2 className='invalid'> {errorMessage}</h2>}
                    {!log &&
                        <>
                            <label ref={pic} className='profilePicPlus' htmlFor='fame'>
                                <span className='material-symbols-outlined spanCoverPlus'> photo_camera</span>
                                <input onChange={changes} className='file' id='fame' type='file' accept="image/png, image/jpg, image/gif, image/jpeg" />
                            </label>
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
                    <fieldset className='fieldset1'>
                        <legend >Password</legend>
                        <input autoComplete="off" className='input1' required onChange={handle} name='password' type='password' />
                    </fieldset>
                    {!log && <fieldset className='fieldset1'>
                        <legend>Confirm Password</legend>
                        <input autoComplete="off" className='input1' required onChange={handle} name='confirmPassword' type='password' />
                    </fieldset>}
                    <button className='btnSubmit' type='submit'>{status === 'loading' ? 'loading' : 'Submit'}</button>
                    <div className='google' id='div'></div>
                    {!log ? <button className='btnLog' onClick={login}>already have an account ? Login here</button> : <div>
                        <button className='btnLog' onClick={forgot}>forget password ? reset here</button>
                        <button className='btnLog' onClick={sign}>Don't have an account ? sign up</button>
                    </div>}
                </form>
            }
        </>
    )
}

export default Auth