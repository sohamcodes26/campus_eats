import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';
import OrderCard from '../../components/student/OrderCard';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Orders');

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/my-orders');
            setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            // We don't show a toast on polling errors to avoid spamming the user
            console.error("Fetch Orders Error:", error);
        } finally {
            setLoading(false); // Only set loading to false on the initial fetch
        }
    };

    useEffect(() => {
        // Fetch orders immediately when the component mounts
        fetchOrders();

        // Set up an interval to poll for new order data every 10 seconds
        const intervalId = setInterval(() => {
            fetchOrders();
        }, 10000); // 10000ms = 10 seconds

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    const filterOrders = () => {
        const activeStatuses = ['Placed', 'Accepted', 'Preparing', 'Ready'];
        const completedStatuses = ['Completed', 'Cancelled'];

        switch (activeTab) {
            case 'Active Orders':
                return orders.filter(order => activeStatuses.includes(order.status));
            case 'Completed Orders':
                return orders.filter(order => completedStatuses.includes(order.status));
            default:
                return orders;
        }
    };

    const filteredOrders = filterOrders();

    const TabButton = ({ name }) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === name
                    ? 'bg-[green] text-white shadow-sm'
                    : 'text-brand-text-light hover:bg-gray-200'
            }`}
        >
            {name}
        </button>
    );

    const SkeletonOrderCard = () => (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse p-6">
          <div className="flex justify-between items-start mb-4">
              <div>
                  <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-64"></div>
              </div>
              <div className="h-6 bg-gray-300 rounded-full w-20"></div>
          </div>
          <div className="border-t border-b border-gray-200 py-4 my-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
          <div className="flex justify-between items-center h-8 bg-gray-300 rounded w-1/3">
          </div>
      </div>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-dark-blue">My Orders</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex space-x-2">
                <TabButton name="All Orders" />
                <TabButton name="Active Orders" />
                <TabButton name="Completed Orders" />
            </div>

            {/* 1. REMOVED 'space-y-6' from this wrapper div */}
            <div>
                {loading ? (
                    
                    /* 2. WRAPPED Skeletons in a grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SkeletonOrderCard />
                        <SkeletonOrderCard />
                    </div>

                ) : filteredOrders.length > 0 ? (
                    
                    /* 3. WRAPPED the mapped cards in a grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrders.map(order => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </div>

                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-700">No Orders Found</h3>
                        <p className="text-gray-500 mt-2">You have no {activeTab.toLowerCase().replace(' orders','')} orders yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;

