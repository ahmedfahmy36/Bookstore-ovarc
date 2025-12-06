import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import storesService from '../services/stores';
import booksService from '../services/books';
import authorsService from '../services/authors';
import inventoryService from '../services/inventory';
import { PencilIcon, TrashIcon, PlusIcon, XIcon, CheckIcon } from '@heroicons/react/outline';

const StoreInventory = () => {
  const { storeId } = useParams();
  const { isAuthenticated } = useAuth();
  // const navigate = useNavigate();
  
  const [store, setStore] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [editingPrice, setEditingPrice] = useState(null);
  const [priceValue, setPriceValue] = useState('');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Fetch store details
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await storesService.getStoreById(storeId);
        setStore(response.data);
      } catch (error) {
        console.error('Error fetching store:', error);
      }
    };

    fetchStore();
  }, [storeId]);

  // Fetch inventory, books, and authors
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [inventoryRes, booksRes, authorsRes] = await Promise.all([
          storesService.getStoreInventory(storeId),
          booksService.getAllBooks(),
          authorsService.getAllAuthors()
        ]);

        setInventory(inventoryRes.data);
        setBooks(booksRes.data);
        setAuthors(authorsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId]);

  // Create a map of authors for quick lookup
  const authorMap = useMemo(() => {
    return authors.reduce((map, author) => {
      map[author.id] = `${author.first_name} ${author.last_name}`;
      return map;
    }, {});
  }, [authors]);

  // Create a map of books for quick lookup
  const bookMap = useMemo(() => {
    return books.reduce((map, book) => {
      map[book.id] = book;
      return map;
    }, {});
  }, [books]);

  // Filter and sort inventory
  const filteredAndSortedInventory = useMemo(() => {
    let result = [...inventory];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => {
        const book = bookMap[item.book_id];
        if (!book) return false;
        
        const bookName = book.name.toLowerCase();
        const authorName = authorMap[book.author_id]?.toLowerCase() || '';
        
        return bookName.includes(term) || authorName.includes(term);
      });
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const bookA = bookMap[a.book_id];
        const bookB = bookMap[b.book_id];
        
        if (!bookA || !bookB) return 0;

        let valueA, valueB;
        
        switch (sortConfig.key) {
          case 'name':
            valueA = bookA.name;
            valueB = bookB.name;
            break;
          case 'author':
            valueA = authorMap[bookA.author_id] || '';
            valueB = authorMap[bookB.author_id] || '';
            break;
          case 'pages':
            valueA = bookA.page_count;
            valueB = bookB.page_count;
            break;
          case 'price':
            valueA = a.price;
            valueB = b.price;
            break;
          default:
            valueA = bookA.id;
            valueB = bookB.id;
        }

        if (valueA < valueB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [inventory, searchTerm, sortConfig, bookMap, authorMap]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleEditPrice = (item) => {
    setEditingPrice(item.id);
    setPriceValue(item.price);
  };

  const handleSavePrice = async (itemId) => {
    try {
      await inventoryService.updateInventoryItem(itemId, { price: parseFloat(priceValue) });
      
      // Update local state
      setInventory(inventory.map(item => 
        item.id === itemId ? { ...item, price: parseFloat(priceValue) } : item
      ));
      
      setEditingPrice(null);
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryService.deleteInventoryItem(itemId);
        setInventory(inventory.filter(item => item.id !== itemId));
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!selectedBook || !newPrice) return;

    try {
      const response = await inventoryService.createInventoryItem({
        book_id: parseInt(selectedBook),
        store_id: parseInt(storeId),
        price: parseFloat(newPrice)
      });

      setInventory([...inventory, response.data]);
      setShowAddBookModal(false);
      setSelectedBook('');
      setNewPrice('');
    } catch (error) {
      console.error('Error adding book to inventory:', error);
    }
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return (
      <span className="ml-1">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!store) {
    return <div className="text-center py-10">Store not found</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">{store.name} - Inventory</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage the inventory for {store.name}. You can add, edit, or remove books.
          </p>
        </div>
        {isAuthenticated && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => setShowAddBookModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Book
            </button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="mb-4">
          <div className="relative rounded-md shadow-sm max-w-md">
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md h-10 border"
              placeholder="Search by book or author"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('id')}
                      >
                        Book ID <SortIcon column="id" />
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        Name <SortIcon column="name" />
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('pages')}
                      >
                        Pages <SortIcon column="pages" />
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('author')}
                      >
                        Author <SortIcon column="author" />
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('price')}
                      >
                        Price <SortIcon column="price" />
                      </th>
                      {isAuthenticated && (
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedInventory.length > 0 ? (
                      filteredAndSortedInventory.map((item) => {
                        const book = bookMap[item.book_id];
                        if (!book) return null;
                        
                        const authorName = authorMap[book.author_id] || 'Unknown Author';
                        
                        return (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {book.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {book.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {book.page_count}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {authorName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {editingPrice === item.id ? (
                                <div className="flex items-center">
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    value={priceValue}
                                    onChange={(e) => setPriceValue(e.target.value)}
                                  />
                                  <button
                                    onClick={() => handleSavePrice(item.id)}
                                    className="ml-2 text-green-600 hover:text-green-800"
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setEditingPrice(null)}
                                    className="ml-1 text-red-600 hover:text-red-800"
                                  >
                                    <XIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                `$${item.price.toFixed(2)}`
                              )}
                            </td>
                            {isAuthenticated && (
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => handleEditPrice(item)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={isAuthenticated ? 6 : 5}
                          className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500"
                        >
                          No books found in inventory.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Add Book to Inventory</h3>
                  <div className="mt-4">
                    <form onSubmit={handleAddBook}>
                      <div className="mb-4">
                        <label htmlFor="book" className="block text-sm font-medium text-gray-700 text-left mb-1">
                          Book
                        </label>
                        <select
                          id="book"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={selectedBook}
                          onChange={(e) => setSelectedBook(e.target.value)}
                          required
                        >
                          <option value="">Select a book</option>
                          {books
                            .filter(book => !inventory.some(item => item.book_id === book.id))
                            .slice(0, 7)
                            .map(book => (
                              <option key={book.id} value={book.id}>
                                {book.name} - {authorMap[book.author_id] || 'Unknown Author'}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 text-left mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          id="price"
                          step="0.01"
                          min="0"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        >
                          Add Book
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                          onClick={() => setShowAddBookModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreInventory;