import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // to handle cookies
});

export const login = async (email: string, password: string) => {
  return await API.post('/user/login', { email, password });
};

export const register = async (email: string, password: string) => {
  return await API.post('/user/register', { email, password });
};

export const getCandidates = async () => {
  return await API.get('/api/voting/candidates');
};

export const vote = async (candidateID: number) => {
  return await API.post('/api/voting/vote', { candidateID });
};
