import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import Swal from 'sweetalert2'; // Ensure you import SweetAlert
import Spinner from "../../components/Spinner";
import StoreReport from './StoreReport';
import Nav from '../../components/Dashborad/DashNav';
import SideBar from './SideBar1';

const ShowStore = () => {
    const [store, setStore] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
     useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:8076/store')
            .then((response) => {
                console.log('API Response:', response.data);
                const data = response.data;
                if (Array.isArray(data)) {
                    setStore(data);

                    // Check for low inventory items
                    data.forEach(item => {
                        if (item.Quantity < 5) {
                            Swal.fire({
                                title: 'Low Inventory!',
                                text: `Item "${item.ItemName}" has a low quantity: ${item.Quantity}`,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'OK',
                                cancelButtonText: 'Cancel',
                            });
                        }
                    });
                } else {
                    console.warn('Data is not an array:', data);
                    setStore([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching store data:', error);
                setStore([]);
                setLoading(false);
            });
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredStores = Array.isArray(store) ? store.filter((store) => {
        const searchMatch = store.ItemNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.ItemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.Description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.Quantity.toString().includes(searchQuery) ||  
            store.cost.toString().includes(searchQuery) ||  
            store.SPrice.toString().includes(searchQuery);

        return searchMatch;
    }) : [];

    return (
        <div className='flex flex-col min-h-screen'>
            <Nav />
            <SideBar />
            <div className="flex-grow p-6 ml-[18%] mt-[4%]">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900">
                        Item <span className="text-pink-600">List</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search Item"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                </div>
                <div className='mb-4'>
                    <StoreReport filteredStores={filteredStores} />
                </div>
                {loading ? (
                    <Spinner />
                ) : (
                    <table className="w-full border-separate border-spacing-2">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2 text-left">Picture</th>
                                <th className="border px-4 py-2 text-left">Item No</th>
                                <th className="border px-4 py-2 text-left">Item Name</th>
                                <th className="border px-4 py-2 text-left">Description</th>
                                <th className="border px-4 py-2 text-left">Quantity</th>
                                <th className="border px-4 py-2 text-left">Cost</th>
                                <th className="border px-4 py-2 text-left">Selling Price</th>
                                <th className="border px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStores.length > 0 ? (
                                filteredStores.map((store, index) => (
                                    <tr key={store._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="border px-4 py-2">
                                            <img src={store.image} alt="Item" width={'100'} />
                                        </td>
                                        <td className="border px-4 py-2">{store.ItemNo}</td>
                                        <td className="border px-4 py-2">{store.ItemName}</td>
                                        <td className="border px-4 py-2">{store.Description}</td>
                                        <td className="border px-4 py-2">{store.Quantity}</td>
                                        <td className="border px-4 py-2">{store.cost}</td>
                                        <td className="border px-4 py-2">{store.SPrice}</td>
                                        <td className="border px-4 py-2">
                                            <div className="flex justify-center gap-x-4">
                                                <Link to={`/store/edit/${store._id}`}>
                                                    <AiOutlineEdit className="text-xl text-yellow-600 hover:text-yellow-800 transition-colors" />
                                                </Link>
                                                <Link to={`/store/delete/${store._id}`}>
                                                    <MdOutlineDelete className="text-xl text-red-600 hover:text-red-800 transition-colors" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-gray-500">No items found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ShowStore;
