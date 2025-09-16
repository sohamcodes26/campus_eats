import React, { useState } from 'react';

const FilterSidebar = ({ isOpen, onClose, onApplyFilters, canteens }) => {
    const [selectedCuisines, setSelectedCuisines] = useState([]);

    // Dynamically generate cuisine options from the available canteens
    const allCuisines = canteens.flatMap(canteen => canteen.canteenDetails.cuisineTypes || []);
    const uniqueCuisines = [...new Set(allCuisines)];

    const handleCuisineChange = (cuisine) => {
        setSelectedCuisines(prev => 
            prev.includes(cuisine) 
                ? prev.filter(c => c !== cuisine) 
                : [...prev, cuisine]
        );
    };

    const handleApply = () => {
        onApplyFilters({ cuisines: selectedCuisines }); 
        onClose();
    };

    const handleClear = () => {
        setSelectedCuisines([]);
        onApplyFilters({ cuisines: [] });
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div 
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-semibold text-brand-dark-blue">Filters</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-grow p-6 overflow-y-auto">
                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Cuisine</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {uniqueCuisines.map(cuisine => (
                                    <label key={cuisine} className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            className="rounded text-brand-green focus:ring-brand-green"
                                            checked={selectedCuisines.includes(cuisine)}
                                            onChange={() => handleCuisineChange(cuisine)}
                                        />
                                        <span>{cuisine}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t flex justify-end space-x-4">
                        <button onClick={handleClear} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Clear
                        </button>
                        <button onClick={handleApply} className="px-6 py-2 bg-[green] text-white rounded-md hover:bg-green-600">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterSidebar;

