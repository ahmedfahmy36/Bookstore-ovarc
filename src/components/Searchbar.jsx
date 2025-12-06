import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import searchIcon from '../assets/search.png';

const Searchbar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    useEffect(() => {
        if (searchTerm) {
            setSearchParams({ search: searchTerm });
        } else {
            setSearchParams({});
        }
    }, [searchTerm, setSearchParams]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="flex items-center rounded py-1.5 px-3 bg-white ">
            <img src={searchIcon} alt="Search" className="w-4 h-4 mr-2" />
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search..."
                className="flex-1 outline-none"
           
           />
        </div>
    );
};

export default Searchbar;