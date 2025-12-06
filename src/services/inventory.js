import api from './api';

const inventoryService = {
  getInventory() {
    return api.get('/inventory');
  },

  getInventoryItem(id) {
    return api.get(`/inventory/${id}`);
  },

  createInventoryItem(data) {
    return api.post('/inventory', data);
  },

  updateInventoryItem(id, data) {
    return api.put(`/inventory/${id}`, data);
  },

  deleteInventoryItem(id) {
    return api.delete(`/inventory/${id}`);
  }
};

export default inventoryService;