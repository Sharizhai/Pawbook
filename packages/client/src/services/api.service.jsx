import AuthService from './auth.service';

const authenticatedFetch = async (url, options = {}) => {
    const token = AuthService.getToken();
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    
    const response = await fetch(url, options);
    
    if (response.status === 401) {
        AuthService.removeToken();
        window.location.href = '/login';
    }
    
    return response;
};

export default authenticatedFetch;