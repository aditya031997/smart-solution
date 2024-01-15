import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconUserPlus from '../../../components/Icon/IconUserPlus';
import IconListCheck from '../../../components/Icon/IconListCheck';
import IconLayoutGrid from '../../../components/Icon/IconLayoutGrid';
import IconSearch from '../../../components/Icon/IconSearch';
import IconUser from '../../../components/Icon/IconUser';
import IconFacebook from '../../../components/Icon/IconFacebook';
import IconInstagram from '../../../components/Icon/IconInstagram';
import IconLinkedin from '../../../components/Icon/IconLinkedin';
import IconTwitter from '../../../components/Icon/IconTwitter';
import IconX from '../../../components/Icon/IconX';
import axios from 'axios';
import config from '../../../congif/config';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

const Driver = () => {
    const dispatch = useDispatch();
    const [defaultParams] = useState({
        name: '',
        phone: '',
        contactNumber: '',
        email: '',
        address1: '',
        address2: '',
        country: '',
        state: '',
        city: '',
        truckType: '',
        passport_number: '',
        passportExpiryDate: '',
        idCardNumber: '',
        idCardExpiryDate: '',
        drivingLicenseNumber: '',
        drivingLicenseExpiryDate: '',
        truckNumber: '',
        truckExpiryDate: '',
        status: '',
        whatsappNumber: '',
        remark: '',
    });
    const [userData, setUserData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<any>(true);

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [viewContactModal, setViewContactModal] = useState<any>(false);
    const [viewMode, setViewMode] = useState(false);
    const [truckData, setTruckData] = useState([]);
    const fetch = async () => {
        console.log('hello');
        const response = await axios.get(`${config.API_BASE_URL}/vehicles`);
        console.log(response, 'response');
        setTruckData(response.data);
        const responce = await axios.get(`${config.API_BASE_URL}/drivers`);

        console.log(responce.data);

        setUserData(responce.data);
        console.log(userData);
    };

    useEffect(() => {
        dispatch(setPageTitle('Contacts'));

        fetch();
    }, [addContactModal]);
    useEffect(() => {
        console.log(userData);
    }, [userData]);

    const [value, setValue] = useState<any>('list');

    const changeValue = (e: any) => {
        const { value, id, name } = e.target;
        setParams({ ...params, [name]: value });
    };

    const [search, setSearch] = useState<any>('');
    // static for now
    let [contactList] = useState<any>(userData);

    const [filteredItems, setFilteredItems] = useState<any>(userData);
    console.log(filteredItems, 'filteredItems', userData);

    useEffect(() => {
        setFilteredItems(() => {
            return userData?.filter((item: any) => {
                return item.name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList, userData]);
    contactList = userData;

    const saveUser = async () => {
        let addUSer = await axios.post(`${config.API_BASE_URL}/drivers`, params);
        setAddContactModal(false);
        showMessage('User has been saved successfully.');
        setAddContactModal(false);
    };

    const editUser = async (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        if (user) {
            console.log(user, 'user');
            let json1 = JSON.parse(JSON.stringify(user));
            console.log(json1, 'json1');
            // setParams(json);
            setParams(json1);
            formik.setValues(json1);
            // console.log(update);
        }
        setViewContactModal(false);
        setAddContactModal(true);
    };

    const deleteUser = async (user: any = null) => {
        await axios.delete(`${config.API_BASE_URL}/drivers/${user.driver_id}`);
        showMessage('Driver has been deleted successfully.');
        await fetch();
    };

    const viewUser = async (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
            formik.setValues(json1);
        }
        setAddContactModal(true);
        setViewMode(true);
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Driver Name is required'),
        phone: Yup.number()
            .typeError('Phone number must be a number')
            .positive('Phone number must be a positive number')
            .integer('Phone number must be an integer')
            .required('Phone number is required'),
        // contactNumber: Yup.string().required('Contect Number is required'),
        email: Yup.string().required('Email is required'),
        address1: Yup.string().required('Address1 is required'),
        address2: Yup.string().required('Address2 is required'),
        country: Yup.string().required(' country is required'),
        state: Yup.string().required('State is required'),
        city: Yup.string().required('City is required'),
        truckType: Yup.string().required('Truck Expiry Date is required'),
        passport_number: Yup.string().required('Passport Number is required'),
        passportExpiryDate: Yup.string().required('Passport Expiry Date is required'),
        idCardNumber: Yup.string().required('Id Card Number is required'),
        idCardExpiryDate: Yup.string().required(' Id Card Expiry Date is required'),
        drivingLicenseNumber: Yup.string().required('Driving License Number is required'),
        drivingLicenseExpiryDate: Yup.string().required('Driving License Expiry Date is required'),
        truckNumber: Yup.string().required('Truck Number is required'),
        // status: Yup.string().required(' Status is required'),
        truckExpiryDate: Yup.string().required('Truck Expiry Date Tones is required'),
        // whatsappNumber: Yup.string().required('Whatsapp Number is required'),
        whatsappNumber: Yup.number()
            .typeError('whatsapp number must be a number')
            .positive('whatsapp number must be a positive number')
            .integer('whatsapp number must be an integer')
            .required('whatsapp number is required'),
        id_card: Yup.string().required('Id Card is required'),
        driving_license: Yup.string().required('Driving License is required'),
        truck_document: Yup.string().required('Truck Document is required'),
    });

    const initialValues = {
        name: '',
        phone: '',
        // contactNumber: '',
        email: '',
        address1: '',
        address2: '',
        country: '',
        state: '',
        city: '',
        truckType: '',
        passport_number: '',
        passportExpiryDate: '',
        idCardNumber: '',
        idCardExpiryDate: '',
        drivingLicenseNumber: '',
        drivingLicenseExpiryDate: '',
        truckNumber: '',
        truckExpiryDate: '',
        status: '',
        whatsappNumber: '',
        passport: '',
        id_card: '',
        driving_license: '',
        truck_document: '',
    };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (params.driver_id) {
                    const response = await axios.put(`${config.API_BASE_URL}/drivers/${params.driver_id}`, values);

                    if (response.status === 200 || response.status === 204) {
                        showMessage(`Customer updated`);
                        formik.resetForm();
                        setAddContactModal(false);
                    } else {
                    }
                } else {
                    const Data = await axios.post(`${config.API_BASE_URL}/drivers`, values);

                    console.log(Data);

                    if (Data.status === 201) {
                        showMessage(`New customer created`);
                        formik.resetForm();
                        setAddContactModal(false);
                    } else {
                    }
                }
            } catch (error: any) {
                if (error.response && error.response.data && error.response.data.message) {
                    console.log(error.response.data.message);
                    Object.values(error.response.data.message).map((m: any) => {
                        showMessage(m);
                    });
                } else {
                    console.log('Something went wrong:', error);
                }
            }
        },
    });

    const addDriver = async (user: any = null) => {
        formik.setValues(initialValues); // Set the initial values
        formik.resetForm({}); // Reset errors
        setAddContactModal(true);
        setParams(initialValues);
    };

    console.log(formik,"formik")

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Driver</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => addDriver()}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Driver
                            </button>
                        </div>
                        <div>
                            <button type="button" className={`btn btn-outline-primary p-2 ${value === 'list' && 'bg-primary text-white'}`} onClick={() => setValue('list')}>
                                <IconListCheck />
                            </button>
                        </div>
                        <div>
                            <button type="button" className={`btn btn-outline-primary p-2 ${value === 'grid' && 'bg-primary text-white'}`} onClick={() => setValue('grid')}>
                                <IconLayoutGrid />
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Search Contacts" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
            {value === 'list' && (
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Driver Name</th>
                                    <th>Truck Type</th>
                                    <th>Phone</th>
                                    <th>Whatsapp No.</th>
                                    <th>Status</th>
                                    <th>Remark</th>
                                    <th>Address</th>

                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((contact: any) => {
                                    return (
                                        <tr key={contact.id}>
                                            <td className="whitespace-nowrap">{contact.driver_id}</td>
                                            <td className="whitespace-nowrap">{contact.name}</td>
                                            <td className="whitespace-nowrap">{contact.truckType}</td>
                                            <td className="whitespace-nowrap">{contact.phone}</td>
                                            <td className="whitespace-nowrap">{contact.whatsappNumber}</td>
                                            <td className="whitespace-nowrap">{contact.status}</td>
                                            <td className="whitespace-nowrap">{contact.remark}</td>
                                            <td className="whitespace-nowrap">{contact.address1}</td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => viewUser(contact)}>
                                                        view Full Details
                                                    </button>
                                                    {/* <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => viewUser(contact)}>
                                                        view Doc
                                                    </button> */}
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(contact)}>
                                                        Edit
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(contact)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {value === 'grid' && (
                <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-5 w-full">
                    {filteredItems.map((contact: any) => {
                        return (
                            <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative" key={contact.id}>
                                <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative">
                                    <div
                                        className="bg-white/40 rounded-t-md bg-center bg-cover p-6 pb-0 bg-"
                                        style={{
                                            backgroundImage: `url('/assets/images/notification-bg.png')`,
                                            backgroundRepeat: 'no-repeat',
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    >
                                        <img className="object-contain w-4/5 max-h-40 mx-auto" src={`/assets/images/${contact.path}`} alt="contact_image" />
                                    </div>
                                    <div className="px-6 pb-24 -mt-10 relative">
                                        <div className="shadow-md bg-white dark:bg-gray-900 rounded-md px-2 py-4">
                                            <div className="text-xl">{contact.name}</div>
                                            <div className="text-white-dark">{contact.role}</div>
                                            <div className="flex items-center justify-between flex-wrap mt-6 gap-3">
                                                <div className="flex-auto">
                                                    <div className="text-info">{contact.posts}</div>
                                                    <div>Posts</div>
                                                </div>
                                                <div className="flex-auto">
                                                    <div className="text-info">{contact.following}</div>
                                                    <div>Following</div>
                                                </div>
                                                <div className="flex-auto">
                                                    <div className="text-info">{contact.followers}</div>
                                                    <div>Followers</div>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <ul className="flex space-x-4 rtl:space-x-reverse items-center justify-center">
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                            <IconFacebook />
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                            <IconInstagram />
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                            <IconLinkedin />
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                            <IconTwitter />
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                                            <div className="flex items-center">
                                                <div className="flex-none ltr:mr-2 rtl:ml-2">Email :</div>
                                                <div className="truncate text-white-dark">{contact.email}</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex-none ltr:mr-2 rtl:ml-2">Phone :</div>
                                                <div className="text-white-dark">{contact.phone}</div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="flex-none ltr:mr-2 rtl:ml-2">Address :</div>
                                                <div className="text-white-dark">{contact.location}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex gap-4 absolute bottom-0 w-full ltr:left-0 rtl:right-0 p-6">
                                        <button type="button" className="btn btn-outline-primary w-1/2" onClick={() => editUser(contact)}>
                                            Edit
                                        </button>
                                        <button type="button" className="btn btn-outline-danger w-1/2" onClick={() => deleteUser(contact)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* formik */}

            <Transition appear show={addContactModal} as={Fragment}>
                <Dialog
                    as="div"
                    open={addContactModal}
                    onClose={() => {
                        setAddContactModal(false);
                        setViewMode(false);
                    }}
                    className="relative z-[51]"
                >
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAddContactModal(false);
                                            setViewMode(false);
                                        }}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {viewMode ? 'Driver Details' : params.driver_id ? 'Edit Driver' : 'Add Driver'}
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="mt-4">
                                                <label htmlFor="name">Driver Name</label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    placeholder="Enter Driver Name"
                                                    className="form-input"
                                                    disabled={viewMode}
                                                    required
                                                />
                                                {formik.touched.name && formik.errors.name && <div className="text-red-500 text-sm">{formik.errors.name}</div>}
                                            </div>
                                            <div className="mt-4">
                                                <label htmlFor="name">Email</label>
                                                <input
                                                    id="name"
                                                    type="email"
                                                    name="email"
                                                    value={formik.values.email}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    placeholder="Enter Email"
                                                    className="form-input"
                                                    disabled={viewMode}
                                                    required
                                                />
                                                {formik.touched.email && formik.errors.email && <div className="text-red-500 text-sm">{formik.errors.email}</div>}
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="phone">Phone Number</label>
                                                    <input
                                                        id="phone"
                                                        type="tel"
                                                        name="phone"
                                                        value={formik.values.phone}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className="form-input"
                                                        placeholder="Enter Phone Number"
                                                        disabled={viewMode}
                                                        required
                                                    />
                                                    {formik.touched.phone && formik.errors.phone && <div className="text-red-500 text-sm">{formik.errors.phone}</div>}
                                                </div>
                                                <div>
                                                    <label htmlFor="whatsappNumber">Whatsapp Number</label>
                                                    <input
                                                        id="whatsappNumber"
                                                        type="text"
                                                        name="whatsappNumber"
                                                        value={formik.values.whatsappNumber}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Whatsapp Number"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        required
                                                    />
                                                    {formik.touched.whatsappNumber && formik.errors.whatsappNumber && <div className="text-red-500 text-sm">{formik.errors.whatsappNumber}</div>}
                                                </div>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="address1">Address1</label>
                                                    <input
                                                        id="address1"
                                                        type="text"
                                                        name="address1"
                                                        value={formik.values.address1}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Address"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        required
                                                    />
                                                    {formik.touched.address1 && formik.errors.address1 && <div className="text-red-500 text-sm">{formik.errors.address1}</div>}
                                                </div>
                                                <div>
                                                    <label htmlFor="address2">Address2</label>
                                                    <input
                                                        id="address2"
                                                        type="text"
                                                        name="address2"
                                                        value={formik.values.address2}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Address"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        required
                                                    />
                                                    {formik.touched.address2 && formik.errors.address2 && <div className="text-red-500 text-sm">{formik.errors.address2}</div>}
                                                </div>
                                            </div>
                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="country">Country</label>
                                                    <input
                                                        id="country"
                                                        type="text"
                                                        name="country"
                                                        value={formik.values.country}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Country"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        required
                                                    />
                                                    {formik.touched.country && formik.errors.country && <div className="text-red-500 text-sm">{formik.errors.country}</div>}
                                                </div>
                                                <div>
                                                    <label htmlFor="state">State</label>
                                                    <input
                                                        id="state"
                                                        type="text"
                                                        name="state"
                                                        value={formik.values.state}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter State"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        required
                                                    />
                                                    {formik.touched.state && formik.errors.state && <div className="text-red-500 text-sm">{formik.errors.state}</div>}
                                                </div>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="city">City</label>
                                                    <input
                                                        id="city"
                                                        type="text"
                                                        name="city"
                                                        value={formik.values.city}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter City"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        required
                                                    />

                                                    {formik.touched.city && formik.errors.city && <div className="text-red-500 text-sm">{formik.errors.city}</div>}
                                                </div>
                                                <div>
                                                    <label htmlFor="truckType">Truck Type</label>
                                                    <select
                                                        id="truckType"
                                                        name="truckType"
                                                        value={formik.values.truckType}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        disabled={viewMode}
                                                        className="form-select"
                                                        required
                                                    >
                                                        <option value="">Select Truck Type</option>
                                                        {truckData?.map((vehicle: any) => (
                                                            <option key={vehicle.vehicle_id} value={vehicle?.vehicleType}>
                                                                {vehicle?.vehicleType}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {formik.touched.truckType && formik.errors.truckType && <div className="text-red-500 text-sm">{formik.errors.truckType}</div>}
                                                </div>
                                            </div>
                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="truckNumber">Truck Number</label>
                                                    <input
                                                        id="truckNumber"
                                                        type="text"
                                                        name="truckNumber"
                                                        value={formik.values.truckNumber}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Truck Number"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        required
                                                    />
                                                    {formik.touched.truckNumber && formik.errors.truckNumber && <div className="text-red-500 text-sm">{formik.errors.truckNumber}</div>}
                                                </div>

                                                <div>
                                                    <label htmlFor="truckExpiryDate">Truck Expiry Date</label>
                                                    <input
                                                        id="truckExpiryDate"
                                                        type="date"
                                                        name="truckExpiryDate"
                                                        // value={formik.values.truckExpiryDate}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Truck Expiry Date"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        defaultValue={moment(formik?.values?.truckExpiryDate).format('YYYY-MM-DD')}
                                                        required
                                                    />
                                                    {formik.touched.truckExpiryDate && formik.errors.truckExpiryDate && <div className="text-red-500 text-sm">{formik.errors.truckExpiryDate}</div>}
                                                </div>
                                            </div>
                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="idCardNumber">Id Card Number</label>
                                                    <input
                                                        id="idCardNumber"
                                                        type="text"
                                                        name="idCardNumber"
                                                        value={formik.values.idCardNumber}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Id Card Number"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        required
                                                    />
                                                    {formik.touched.idCardNumber && formik.errors.idCardNumber && <div className="text-red-500 text-sm">{formik.errors.idCardNumber}</div>}
                                                </div>
                                                <div>
                                                    <label htmlFor="idCardExpiryDate">Id Card Expiry Date</label>
                                                    <input
                                                        id="idCardExpiryDate"
                                                        type="date"
                                                        name="idCardExpiryDate"
                                                        // value={formik.values.idCardExpiryDate}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Id Card Expiry Date"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        required
                                                        defaultValue={moment(formik?.values?.idCardExpiryDate).format('YYYY-MM-DD')}
                                                    />

                                                    {formik.touched.idCardExpiryDate && formik.errors.idCardExpiryDate && <div className="text-red-500 text-sm">{formik.errors.idCardExpiryDate}</div>}
                                                </div>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="drivingLicenseNumber">Driving License Number</label>
                                                    <input
                                                        id="drivingLicenseNumber"
                                                        type="text"
                                                        name="drivingLicenseNumber"
                                                        value={formik.values.drivingLicenseNumber}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter License Number"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        required
                                                    />
                                                    {formik.touched.drivingLicenseNumber && formik.errors.drivingLicenseNumber && (
                                                        <div className="text-red-500 text-sm">{formik.errors.drivingLicenseNumber}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="drivingLicenseExpiryDate">Driving License Expiry Date</label>
                                                    <input
                                                        id="drivingLicenseExpiryDate"
                                                        type="date"
                                                        name="drivingLicenseExpiryDate"
                                                        // value={formik.values.drivingLicenseExpiryDate}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter License Expiry Date"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        defaultValue={moment(formik?.values?.drivingLicenseExpiryDate).format('YYYY-MM-DD')}
                                                        required
                                                    />
                                                    {formik.touched.drivingLicenseExpiryDate && formik.errors.drivingLicenseExpiryDate && (
                                                        <div className="text-red-500 text-sm">{formik.errors.drivingLicenseExpiryDate}</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* <div className="mt-4">
                                                <label htmlFor="drivingLicenseExpiryDate">Driving License Expiry Date</label>
                                                <input
                                                    id="drivingLicenseExpiryDate"
                                                    type="date"
                                                    name="drivingLicenseExpiryDate"
                                                    // value={formik.values.drivingLicenseExpiryDate}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    placeholder="Enter License Expiry Date"
                                                    className="form-input"
                                                    disabled={viewMode}
                                                    defaultValue={moment(formik?.values?.drivingLicenseExpiryDate).format('YYYY-MM-DD')}
                                                    required
                                                />
                                                {formik.touched.drivingLicenseExpiryDate && formik.errors.drivingLicenseExpiryDate && (
                                                    <div className="text-red-500 text-sm">{formik.errors.drivingLicenseExpiryDate}</div>
                                                )}
                                            </div> */}
                                            {/* <div className="mt-4">
                                                <label htmlFor="drivingLicenseExpiryDate">Passport Expiry Date</label>
                                                <input
                                                    id="passportExpiryDate"
                                                    type="date"
                                                    name="passportExpiryDate"
                                                    // value={formik.values.passportExpiryDate}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    placeholder="Enter Passport Expiry Date"
                                                    className="form-input"
                                                    disabled={viewMode}
                                                    defaultValue={moment(formik?.values?.passportExpiryDate).format('YYYY-MM-DD')}
                                                    required
                                                />
                                                {formik.touched.passportExpiryDate && formik.errors.passportExpiryDate && (
                                                    <div className="text-red-500 text-sm">{formik.errors.passportExpiryDate}</div>
                                                )}
                                            </div> */}
                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="passportNumber">Passport Number</label>
                                                    <input
                                                        id="passport_number"
                                                        type="text"
                                                        name="passport_number"
                                                        value={formik.values.passport_number}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Passport Number"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        required
                                                    />
                                                    {formik.touched.passport_number && formik.errors.passport_number && <div className="text-red-500 text-sm">{formik.errors.passport_number}</div>}
                                                </div>
                                                <div>
                                                    <label htmlFor="drivingLicenseExpiryDate">Passport Expiry Date</label>
                                                    <input
                                                        id="passportExpiryDate"
                                                        type="date"
                                                        name="passportExpiryDate"
                                                        // value={formik.values.passportExpiryDate}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Passport Expiry Date"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        defaultValue={moment(formik?.values?.passportExpiryDate).format('YYYY-MM-DD')}
                                                        required
                                                    />
                                                    {formik.touched.passportExpiryDate && formik.errors.passportExpiryDate && (
                                                        <div className="text-red-500 text-sm">{formik.errors.passportExpiryDate}</div>
                                                    )}
                                                </div>
                                            </div>
                                            {/* <div className="mt-4">
                                                <label htmlFor="status">status</label>
                                                <input
                                                    id="status"
                                                    type="text"
                                                    name="status"
                                                    value={formik.values.status}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    placeholder="Enter Status"
                                                    className="form-input"
                                                    disabled={viewMode}
                                                    required
                                                />
                                                {formik.touched.status && formik.errors.status && <div className="text-red-500 text-sm">{formik.errors.status}</div>}
                                            </div> */}

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="formFileLg" className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
                                                        {' '}
                                                        Passport
                                                    </label>
                                                    <input
                                                        className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                                        name="passport"
                                                        // value={formik.values.passport}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        id="formFileLg"
                                                        type="file"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.passport && formik.errors.passport && <div className="text-red-500 text-sm">{formik.errors.passport}</div>}
                                                </div>
                                                <div>
                                                    <label htmlFor="formFileLg" className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
                                                        {' '}
                                                        Id Card
                                                    </label>
                                                    <input
                                                        className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                                        name="id_card"
                                                        // value={formik.values.id_card}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        id="formFileLg"
                                                        type="file"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.id_card && formik.errors.id_card && <div className="text-red-500 text-sm">{formik.errors.id_card}</div>}
                                                </div>
                                            </div>
                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="formFileLg" className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
                                                        {' '}
                                                        Driving Licence
                                                    </label>
                                                    <input
                                                        className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                                        name="driving_license"
                                                        // value={formik.values.driving_license}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        id="formFileLg"
                                                        type="file"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.driving_license && formik.errors.driving_license && <div className="text-red-500 text-sm">{formik.errors.driving_license}</div>}
                                                </div>
                                                <div>
                                                    <label htmlFor="formFileLg" className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
                                                        {' '}
                                                        Truck Document
                                                    </label>
                                                    <input
                                                        className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                                        name="truck_document"
                                                        id="formFileLg"
                                                        // value={formik.values.truck_document}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        type="file"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.truck_document && formik.errors.truck_document && <div className="text-red-500 text-sm">{formik.errors.truck_document}</div>}
                                                </div>
                                            </div>
                                            <div className="flex justify-end items-center mt-4">
                                                {!viewMode && (
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                        Cancel
                                                    </button>
                                                )}

                                                {!viewMode && (
                                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                        {params.driver_id ? 'Update' : 'Submit'}
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Driver;
