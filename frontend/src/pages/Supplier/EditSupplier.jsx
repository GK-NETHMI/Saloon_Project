import { useState, useEffect } from "react";
import React from 'react';
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

const EditSupplier = () => {
  const [SupplierID, setSupplierID] = useState('');
  const [SupplierName, setSupplierName] = useState('');
  const [ItemNo, setItemNo] = useState('');
  const [ItemName, setItemName] = useState('');
  const [ContactNo, setContactNo] = useState('');
  const [Email, setEmail] = useState('');
  const [Address, setAddress] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8076/suppliers/${id}`)
      .then((response) => {
        const data = response.data;
        setSupplierID(data.SupplierID);
        setSupplierName(data.SupplierName);
        setItemNo(data.ItemNo);
        setItemName(data.ItemName);
        setContactNo(data.ContactNo);
        setEmail(data.Email);
        setAddress(data.Address);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching supplier:", error);
      });

    axios.get("http://localhost:8076/inventories")
      .then((response) => {
        const itemsData = response.data.data;
        setItems(itemsData);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching items:", error);
      });
  }, [id]);

  const handleItemNoChange = (e) => {
    const selectedItemNo = e.target.value;
    setItemNo(selectedItemNo);

    const selectedItem = items.find(item => item.ItemNo === selectedItemNo);
    if (selectedItem) {
      setItemName(selectedItem.ItemName);
    } else {
      setItemName('');
    }
  };

  const handleEditSupplier = () => {
    if (!SupplierName || !ItemNo || !ItemName || !ContactNo || !Email || !Address) {
      Swal.fire({
        icon: 'error',
        title: 'All fields are required',
        text: 'Please fill in all the fields before submitting the form.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
      });
      return;
    }

    if (!/^\d{10}$/.test(ContactNo)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Contact No',
        text: 'Contact number should be 10 digits.',
      });
      return;
    }

    const data = {
      SupplierName,
      ItemNo,
      ItemName,
      ContactNo,
      Email,
      Address,
    };
    
    setLoading(true);
    axios.put(`http://localhost:8076/suppliers/${id}`, data)
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Supplier updated',
          text: 'Supplier details have been successfully updated.',
        }).then(() => {
          navigate('/suppliers/allSupplier');
        });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error updating the supplier. Please try again.',
        });
        console.error('Error editing supplier:', error);
      });
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div style={containerStyle}>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <BackButton destination='/suppliers/allSupplier' />
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
          <img className="mx-auto h-10 w-auto" src={Logo} alt="logo" style={{ width: '50px', height: '50px', marginRight: '400px'}} />
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Edit Supplier
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {loading && <Spinner />}
            <form onSubmit={(e) => { e.preventDefault(); handleEditSupplier(); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* SupplierID */}
              <div>
                <label htmlFor="SupplierID" className="block text-sm font-medium leading-5 text-gray-700">SupplierID</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="SupplierID"
                    name="SupplierID"
                    type="text"
                    value={SupplierID}
                    readOnly
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Supplier Name */}
              <div>
                <label htmlFor="SupplierName" className="block text-sm font-medium leading-5 text-gray-700">Supplier Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="SupplierName"
                    name="SupplierName"
                    type="text"
                    value={SupplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Item No */}
              <div>
                <label htmlFor="ItemNo" className="block text-sm font-medium leading-5 text-gray-700">Item No</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <select
                    id="ItemNo"
                    name="ItemNo"
                    value={ItemNo}
                    onChange={handleItemNoChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  >
                    <option value="" disabled>Select Item No</option>
                    {items.map((item) => (
                      <option key={item.ItemNo} value={item.ItemNo}>
                        {item.ItemNo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Item Name */}
              <div>
                <label htmlFor="ItemName" className="block text-sm font-medium leading-5 text-gray-700">Item Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="ItemName"
                    name="ItemName"
                    type="text"
                    value={ItemName}
                    readOnly
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Contact No */}
              <div>
                <label htmlFor="ContactNo" className="block text-sm font-medium leading-5 text-gray-700">Contact No</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="ContactNo"
                    name="ContactNo"
                    type="text"
                    value={ContactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="Email" className="block text-sm font-medium leading-5 text-gray-700">Email</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="Email"
                    name="Email"
                    type="email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="col-span-2">
                <label htmlFor="Address" className="block text-sm font-medium leading-5 text-gray-700">Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <textarea
                    id="Address"
                    name="Address"
                    rows="3"
                    value={Address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:border-pink-800 focus:ring focus:ring-pink-200 transition duration-150 ease-in-out"
                >
                  Update Supplier
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSupplier;
