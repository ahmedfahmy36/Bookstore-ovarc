// src/pages/Browse.jsx
import React from 'react';
import Loading from '../pages/Loading';
import BookCard from '../components/Cards/BookCard';
import useLibraryData from '../hooks/useLibraryData';

const BrowseBooks = () => {
  // Use the custom hook
  const { booksWithStores, isLoading } = useLibraryData();

  if (isLoading) {
    return <Loading />;
  }

return (
    <div className="py-6 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse All Books</h2>
        <div className="flex flex-wrap gap-6 ">
            {booksWithStores.map((book, index) => (
                <BookCard
                    key={index}
                    title={book.title}
                    author={book.author}
                    stores={book.stores}
                />
            ))}
        </div>
    </div>
);
};

export default BrowseBooks;