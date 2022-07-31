import './layout.css';
import { useSelector, useDispatch } from 'react-redux';
import { toggle, theme } from '../features/themes/themeSlice';
import { useEffect } from 'react';
import { setShow, show } from '../features/posts/postSlice';
import { useNavigate } from "react-router-dom";
import { search } from '../features/search/searchSlice'
import Form from './form/Form'
import { user, logout } from '../features/users/userSlice';
import decode from 'jwt-decode'
import { useState } from 'react'

const Layout = ({ children }) => {
    const mode = useSelector(theme);
    const shows = useSelector(show)
    const userInfo = useSelector(user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [word, setWord] = useState('');
    const time = new Date().getTime();

    useEffect(() => {
        if (mode) {
            document.getElementById('body').style.backgroundColor = 'black'
            document.getElementById('body').style.color = 'white'
        } else {
            document.getElementById('body').style.backgroundColor = '#F4F4F4'
            document.getElementById('body').style.color = 'black'
        }
    }, [mode]);


    useEffect(() => {
        const { token } = userInfo;
        const decoded = decode(token);
        const { exp } = decoded
        if (Number(exp) * 1000 < time) {
            navigate('/');
            dispatch(logout());
        }
    }, [time, userInfo, navigate, dispatch]);

    const pressed = (e) => {
        if (e.keyCode === 13) {
            dispatch(search(word));
            navigate(`/search/${word}`);
            setWord('');
        }
    }

    return (
        <section className={mode ? 'darkTheme' : 'light'}>
            <section className='layoutChild'>
                <nav className='nav'>
                    <div className='loginDiv'>
                        <button className='homeBtn' onClick={() => navigate('/home')}><span className="material-symbols-outlined">storage</span></button>
                        <h5 className='memo'>Memories</h5>
                    </div>
                    <input value={word} type='search' onChange={(e) => setWord(e.target.value)} onKeyDown={pressed} placeholder='Search' className={mode ? 'searchDark' : 'search'} />
                    <button className='navButton' onClick={() => dispatch(toggle())}>
                        Theme :
                        <span className="material-symbols-outlined">
                            {mode ? '   toggle_on' : ' toggle_off'}
                        </span>
                    </button>
                </nav>
                {shows && <div className={mode ? 'darkDiver' : 'diver'}>
                    <Form />
                </div>}
                <main>
                    <div className='pictureIcon'>
                        <button onClick={() => navigate('/profile')} className='pictureButton'>
                            <img referrerPolicy="no-referrer" className='picture' src={userInfo.picture} alt='pictures' />
                        </button>
                        <button className={mode ? 'createBtn darkness' : 'createBtn'} onClick={() => dispatch(setShow())}>Create a memory <span className='fa fa-pencil write'></span> <span className='fa fa-hashtag write'></span>
                            <span className='fa fa-image write'></span>
                        </button>
                    </div>
                    {children}
                </main>
                <footer>

                </footer>
            </section>
        </section>
    )
}

export default Layout