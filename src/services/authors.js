import api from './api';

const authorsService = {
  getAllAuthors() {
    return api.get('/authors');
  },

  getAuthorById(id) {
    return api.get(`/authors/${id}`);
  }
};

export default authorsService;