// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Loading from '../pages/Loading';
import StoreCard from '../components/Cards/StoreCard';
import BookCard from '../components/Cards/BookCard';
import AuthorCard from '../components/Cards/AuthorCard';
import useLibraryData from '../hooks/useLibraryData';

const Home = () => {
  const {
    stores,
    booksWithStores,
    authors,
    books,
    inventory,
    isLoading,
  } = useLibraryData();

  const storesWithMetrics = React.useMemo(() => {
    return stores.slice(0, 5).map((store) => { 
      const storeInventory = inventory.filter(
        (item) => item.store_id === store.id
      );
      const noOfBooks = storeInventory.length;
      const totalPrice = storeInventory.reduce((sum, item) => sum + item.price, 0);
      const averagePrice = noOfBooks > 0 ? totalPrice / noOfBooks : 0;

      return {
        name: store.name,
        noOfBooks,
        averagePrice,
      };
    });
  }, [stores, inventory]);

  const limitedBooksWithStores = booksWithStores.slice(0, 5);

  const authorsWithBookCount = React.useMemo(() => {
    return authors.slice(0, 5).map((author) => { 
      const noOfBooks = books.filter((book) => book.author_id === author.id).length;
      return {
        name: `${author.first_name} ${author.last_name}`,
        noOfBooks,
      };
    });
  }, [authors, books]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="py-6 px-4">
      {/* Stores Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Stores</h2>
          <Link 
            to="/stores" 
            className="bg-main text-white px-4 py-2 rounded-md hover:bg-main/90 transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {storesWithMetrics.map((store, index) => (
            <div key={index} className="flex-shrink-0">
              <StoreCard
                name={store.name}
                noOfBooks={store.noOfBooks}
                averagePrice={store.averagePrice}
                id={store.id}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Books Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Books</h2>
          <Link 
            to="/books" 
            className="bg-main text-white px-4 py-2 rounded-md hover:bg-main/90 transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {limitedBooksWithStores.map((book, index) => (
            <div key={index} className="flex-shrink-0">
              <BookCard
                title={book.title}
                author={book.author}
                stores={book.stores}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Authors Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Authors</h2>
          <Link 
            to="/authors" 
            className="bg-main text-white px-4 py-2 rounded-md hover:bg-main/90 transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {authorsWithBookCount.map((author, index) => (
            <div key={index} className="flex-shrink-0">
              <AuthorCard
                name={author.name}
                noOfBooks={author.noOfBooks}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;