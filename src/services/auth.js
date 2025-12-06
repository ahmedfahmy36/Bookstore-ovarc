import api from './api';

const authService = {
  async login(credentials) {
    try {
      // For JSON server, we'll check the users array for a matching user
      const response = await api.get('/users', {
        params: {
          username: credentials.username,
          password: credentials.password
        }
      });
      
      if (response.data && response.data.length > 0) {
        const user = response.data[0];
        // In a real app, you should never store passwords in localStorage
        // This is just for demo purposes with JSON server
        localStorage.setItem('user', JSON.stringify(user));
        // Generate a simple token (in a real app, this would come from the server)
        const token = btoa(JSON.stringify(user));
        localStorage.setItem('authToken', token);
        return { user, token };
      }
      throw new Error('Invalid username or password');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
};

export default authService;