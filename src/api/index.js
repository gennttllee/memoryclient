import axios from 'axios';


const API = axios.create({baseURL :'https://gennttllee.herokuapp.com'})

API.interceptors.request.use((req)=> {
    if (localStorage.getItem('user')){
        const token = JSON.parse(localStorage.getItem('user')).token
        req.headers.authorization = `Bearer ${token}`;
        return req;
    }

    return req;
})

export const fetchData =()=> API.get('/posts');
export const createPost =(newPost)=> API.post('/posts', newPost);
export const updatePost =(id, post) => API.patch(`/posts/${id}`, post);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost =(id, data)=> API.patch(`/posts/${id}/likePost`, data);
export const commentPost =(data, id)=> API.patch(`/posts/${id}/commentPost`, data);
export const searchPost =(id)=> API.get(`/posts/${id}`);
export const search =(id)=> API.get(`/posts/${id}/search`);

export const signIn =(data)=> API.post('/user/signIn', data);
export const resetPass =(email)=> API.get(`user/reset/${email}`)
export const savePass =(data)=> API.patch(`user/reset/${data.email}`, data)
export const signUp =(data)=> API.post('/user/signUp', data);
export const searchProfile =(id)=> API.get(`/user/${id}/profile`, id);
export const google =(data)=> API.post('/user/google', data)