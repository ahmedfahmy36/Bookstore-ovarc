import api from './api';

const storesService = {
  getAllStores() {
    return api.get('/stores');
  },

  getStoreById(id) {
    return api.get(`/stores/${id}`);
  },

  getStoreInventory(storeId) {
    return api.get(`/stores/${storeId}/inventory`);
  }
};

export default storesService;