import axios from 'axios';
import { FETCH_USER, FETCH_BLOGS, FETCH_BLOG } from './types';

export const fetchUser = () => async (dispatch) => {
  const res = await axios.get('http://localhost:5000/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = (token) => async (dispatch) => {
  const res = await axios.post('http://localhost:5000/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitBlog = (values, file, history) => async (dispatch) => {
  // TODO create presigned AWS S3 url
  const uploadConfig = await axios.get('http://localhost:5000/api/upload');
  const upload = await axios.put(uploadConfig.data.url, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
  console.log(upload);
  const res = await axios.post('http://localhost:5000/api/blogs', {
    ...values,
    imageUrl: uploadConfig.data.key,
  });

  history.push('/blogs');
  dispatch({ type: FETCH_BLOG, payload: res.data });
};

export const fetchBlogs = () => async (dispatch) => {
  const res = await axios.get('http://localhost:5000/api/blogs');

  dispatch({ type: FETCH_BLOGS, payload: res.data });
};

export const fetchBlog = (id) => async (dispatch) => {
  const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);

  dispatch({ type: FETCH_BLOG, payload: res.data });
};
