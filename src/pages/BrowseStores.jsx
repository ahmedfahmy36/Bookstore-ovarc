// src/pages/BrowseStores.jsx
import React from 'react';
import Loading from '../pages/Loading';
import StoreCard from '../components/Cards/StoreCard';
import useLibraryData from '../hooks/useLibraryData';

const BrowseStores = () => {
  const { stores, inventory, isLoading } = useLibraryData();

  // Calculate metrics for each store
  const storesWithMetrics = React.useMemo(() => {
    return stores.map((store) => {
      const storeInventory = inventory.filter(
        (item) => item.store_id === store.id
      );

      // Number of books in the store
      const noOfBooks = storeInventory.length;

      // Calculate average price
      const totalPrice = storeInventory.reduce((sum, item) => sum + item.price, 0);
      const averagePrice = noOfBooks > 0 ? totalPrice / noOfBooks : 0;
      const id = store.id;

      return {
        name: store.name,
        noOfBooks,
        averagePrice,
        id,
      };
    });
  }, [stores, inventory]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="py-6 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse All Stores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {storesWithMetrics.map((store, index) => (
          <StoreCard
            key={index}
            name={store.name}
            noOfBooks={store.noOfBooks}
            averagePrice={store.averagePrice}
            id={store.id}
          />
        ))}
      </div>
    </div>
  );
};

export default BrowseStores;