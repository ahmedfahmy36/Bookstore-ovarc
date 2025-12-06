// src/components/StoreCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StoreCard = ({ name, noOfBooks, averagePrice, id }) => {
  const navigate = useNavigate();

  const handleViewStore = () => {
    if (id) {
      navigate(`/store/${id}`);
    } else {
      console.error('Store ID is undefined');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 h-[214px] w-112 flex gap-2">
      {/* Store Placeholder (instead of an image) */}
      <div
        className="grid items-center h-full w-32 rounded-lg"
        style={{ backgroundColor: '#E0F7FA' }} // Light cyan background
      >
        <p className="text-center font-medium text-gray-800 text-wrap px-2">{name}</p>
      </div>

      {/* Store Details */}
      <div className="flex flex-col px-3 w-full h-full flex-1">
        <div className="flex-1">
          <p className="text-wrap text-lg font-bold text-gray-800">{name}</p>
          <p className="text-sm text-main">Books in stock: {noOfBooks}</p>
          <p className="text-sm text-main">
            Average Price: ${averagePrice.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-end items-end">
          <button
            className="bg-main font-light text-white px-2 py-1 rounded"
            onClick={handleViewStore}
          >
            View Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;