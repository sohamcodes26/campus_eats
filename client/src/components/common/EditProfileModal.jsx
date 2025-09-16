import React, { useState, useEffect } from 'react';

const EditProfileModal = ({ isOpen, onClose, onSave, user }) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '+91 98765 43210', // Placeholder
                canteenName: user.canteenDetails?.canteenName || '',
                canteenAddress: user.canteenDetails?.canteenAddress || '',
                // <-- ADDED 1: Load cuisines as a comma-separated string
                cuisineTypes: user.canteenDetails?.cuisineTypes?.join(', ') || ''
            });
        }
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // <-- ADDED 2: Convert the cuisine string back to an array before saving
        const dataToSave = {
          ...formData,
          cuisineTypes: formData.cuisineTypes
            .split(',')             // Split the string into an array
            .map(s => s.trim())     // Remove whitespace
            .filter(s => s)          // Remove any empty strings (like from ",,")
        };

        await onSave(dataToSave); // Pass the new, corrected data
        setLoading(false);
    };

    if (!isOpen || !user) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg m-4">
                <h2 className="text-2xl font-bold text-brand-dark-blue mb-6">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Common Fields */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        </div>

                        {/* Canteen-specific Fields */}
                        {user.role === 'canteen' && (
                            <>
                                <hr className="my-4"/>
                                <div>
                                    <label htmlFor="canteenName" className="block text-sm font-medium text-gray-700">Canteen Name</label>
                                    <input type="text" name="canteenName" id="canteenName" value={formData.canteenName} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                                </div>
                                <div>
                                    <label htmlFor="canteenAddress" className="block text-sm font-medium text-gray-700">Canteen Address</label>
                                    <input type="text" name="canteenAddress" id="canteenAddress" value={formData.canteenAddress} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                                </div>

                                {/* <-- ADDED 3: The new input field for Cuisines --> */}
                                <div>
                                  <label htmlFor="cuisineTypes" className="block text-sm font-medium text-gray-700">
                                    Cuisines (comma-separated)
                                  </label>
                                  <input 
                                    type="text" 
                                    name="cuisineTypes" 
                                    id="cuisineTypes" 
                                    value={formData.cuisineTypes} 
                                    onChange={handleChange} 
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    placeholder="e.g. Indian, Chinese, Snacks"
                                  />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-[#111184] text-white rounded-md hover:bg-slate-700 disabled:bg-slate-400">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;