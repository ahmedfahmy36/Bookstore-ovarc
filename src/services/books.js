import api from './api';

const booksService = {
  getAllBooks() {
    return api.get('/books');
  },

  getBookById(id) {
    return api.get(`/books/${id}`);
  },

  searchBooks(query) {
    return api.get('/books', { params: { q: query } });
  }
};

export default booksService;