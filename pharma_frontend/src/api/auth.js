import api from './axiosConfig';

export const login = async (username, password) => {
    const Response = await api.post('/token/', { username, password });
    if (Response.status === 200) {
        localStorage.setItem('access_token', Response.data.access);
        localStorage.setItem('refresh_token', Response.data.refresh);
        window.location.href = '/dashboard';
        return true;
    } else {
        error= Response.data.detail || 'Login failed';
        console.error('Login error:', error);
        return false;}
};

export const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
};

