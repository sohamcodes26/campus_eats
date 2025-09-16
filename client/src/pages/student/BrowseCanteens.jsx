import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import CanteenCard from '../../components/student/CanteenCard'; 
import FilterSidebar from '../../components/student/FilterSidebar';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10m-7 8h4" />
    </svg>
);

const BrowseCanteens = () => {
    const [canteens, setCanteens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({ cuisines: [] });

    useEffect(() => {
        const fetchCanteens = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/canteens');
                console.log("CANTEEN DATA:", data);
                setCanteens(data);
            } catch (error) {
                toast.error('Could not fetch canteens. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchCanteens();
    }, []);
    
    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
    };

    const filteredCanteens = useMemo(() => {
        return canteens.filter(canteen => {
            const nameMatch = canteen.canteenDetails.canteenName.toLowerCase().includes(searchTerm.toLowerCase());
            
            const cuisineMatch = activeFilters.cuisines.length === 0 || 
                activeFilters.cuisines.some(cuisine => 
                    canteen.canteenDetails.cuisineTypes?.includes(cuisine)
                );

            return nameMatch && cuisineMatch;
        });
    }, [canteens, searchTerm, activeFilters]);

    const SkeletonCard = () => (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-300"></div>
            <div className="p-4">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-300 rounded w-full"></div>
            </div>
        </div>
    );

    return (
        <>
            {/* 1. ADDED CONTAINER and PADDING to center all page content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    {/* 2. ADDED 'text-center' to the <h1> */}
                    <h1 className="text-3xl font-bold text-brand-dark-blue text-center">Browse Canteens</h1>
                </div>

                {/* 3. CHANGED 'justify-between' to 'justify-center' and added 'gap-4' */}
                <div className="flex flex-col sm:flex-row justify-center items-center mb-6 gap-4">
                    {/* 4. REMOVED 'sm:flex-grow' and 'mr-0 sm:mr-4' */}
                    <div className="relative w-full sm:w-[40rem]">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search canteens..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green"
                        />
                    </div>
                    <button 
                        onClick={() => setIsFilterOpen(true)}
                        className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <FilterIcon />
                        Filters
                    </button>
                </div>
                
                {loading ? (
                    // Also centered the skeleton grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                        {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : (
                    // Also centered the main card grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center">
                        {filteredCanteens.length > 0 ? (
                            filteredCanteens.map(canteen => (
                                <CanteenCard key={canteen._id} canteen={canteen} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500">No canteens found matching your criteria.</p>
                        )}
                    </div>
                )}
            </div>

            <FilterSidebar 
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleApplyFilters}
                canteens={canteens}
            />
        </>
    );
};

export default BrowseCanteens;

