import { useState, useEffect } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import backgroundImage from "../../images/logobg.jpg";
import Logo from '../../images/logo.png';

const CreateSuppliers = () => {
  // State variables for managing form data and loading state
  const [SupplierName, setSupplierName] = useState('');
  const [ItemNo, setItemNo] = useState('');
  const [ItemName, setItemName] = useState('');
  const [ContactNo, setContactNo] = useState('');
  const [Email, setEmail] = useState('');
  const [Address, setAddress] = useState('');
  const [items, setItems] = useState([]); // State to hold all items (with ItemNo and ItemName)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch items data from the server when the component loads
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8076/inventories') // Assuming this endpoint returns items with ItemNo and ItemName
      .then((response) => {
        const itemsData = response.data.data; 
        if (Array.isArray(itemsData)) {
          setItems(itemsData); // Set items data to state
        } else {
          console.error('Unexpected response format:', response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
        setLoading(false);
      });
  }, []);

  // Event handler for when ItemNo is selected
  const handleItemNoChange = (e) => {
    const selectedItemNo = e.target.value;
    setItemNo(selectedItemNo);

    // Find the item based on the selected ItemNo and update ItemName
    const selectedItem = items.find(item => item.ItemNo === selectedItemNo);
    setItemName(selectedItem ? selectedItem.ItemName : '');
  };

  // Event handler for saving the Supplier with validation
  const handleSaveSupplier = () => {
    if (!SupplierName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Supplier Name is required!',
      });
      return;
    }
    if (!ItemNo.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Item No is required!',
      });
      return;
    }
    if (!ContactNo.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Contact No is required!',
      });
      return;
    }
    if (!/^[0-9]{10}$/.test(ContactNo)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Contact No must be a valid 10-digit number!',
      });
      return;
    }
    if (!Email.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Email is required!',
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(Email)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Email must be a valid email address!',
      });
      return;
    }
    if (!Address.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Address is required!',
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
    axios
      .post('http://localhost:8076/suppliers', data)
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Supplier created successfully!',
        }).then(() => {
          navigate('/suppliers/allSupplier');
        });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred. Please check console.',
        });
        console.log(error);
      });
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div style={containerStyle} className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
       <BackButton destination='/suppliers/allSupplier' />
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <img
          className="mx-auto h-10 w-auto"
          src={Logo}
          alt="logo"
          style={{ width: '50px', height: '50px' }}
        />
        <h1 className="text-center text-3xl leading-9 font-extrabold text-gray-900 mt-6">
          Create Supplier
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="supplierName" className="block text-sm font-medium leading-5 text-gray-700">Supplier Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="supplierName"
                  name="supplierName"
                  type="text"
                  value={SupplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="itemNo" className="block text-sm font-medium leading-5 text-gray-700">Item No</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <select
                  id="itemNo"
                  name="itemNo"
                  value={ItemNo}
                  onChange={handleItemNoChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
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

            <div>
              <label htmlFor="itemName" className="block text-sm font-medium leading-5 text-gray-700">Item Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="itemName"
                  name="itemName"
                  type="text"
                  value={ItemName}
                  readOnly
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contactNo" className="block text-sm font-medium leading-5 text-gray-700">Contact No</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="contactNo"
                  name="contactNo"
                  type="text"
                  value={ContactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium leading-5 text-gray-700">Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={Address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-pink-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
            </div>

            <div className="flex items-center justify-end mt-6">
              <button
                type="button"
                onClick={handleSaveSupplier}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:border-pink-700 focus:ring focus:ring-pink-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? <Spinner size="small" /> : 'Save Supplier'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSuppliers;
