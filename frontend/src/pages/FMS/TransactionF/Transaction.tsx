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
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

const Transaction = () => {
    const dispatch = useDispatch();
    const [defaultParams] = useState({
        transaction_id: '',
        date: '',
        route_name: '',
        origin: '',
        bookings: '',
        destination: '',
        driver_name: '',
        payable_ammount: '',
        ammount_to_driver: '',
        mode: '',
        cheque_number: '',
        bookingID: '',
        new_trackingId: '',
    });
    const [userData, setUserData] = useState<any>([]);
    const [bookingData, setBookingData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<any>(true);
    const [opened, { open, close }] = useDisclosure(false);

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [viewContactModal, setViewContactModal] = useState<any>(false);

    const [currentDate, setCurrentDate] = useState(getFormattedDate());
    const [viewMode, setViewMode] = useState(false);
    const [bookingId, setBookingId] = useState('');
    // Helper function to get the current date in "YYYY-MM-DD" format

    const fetch = async () => {
        const { data } = await axios.get(`${config.API_BASE_URL}/bookings?payment_status=unpaid`);

        setUserData(data.data);
        const responce = await axios.get(`${config.API_BASE_URL}/transactions`);
        setBookingData(responce.data);
    };

    useEffect(() => {
        dispatch(setPageTitle('Contacts'));

        fetch();
    }, [addContactModal]);

    const [value, setValue] = useState<any>('list');

    const changeValue = (e: any) => {
        const { value, id, name } = e.target;
        setParams({ ...params, [name]: value });
    };

    const [search, setSearch] = useState<any>('');
    // static for now
    let [contactList] = useState<any>(userData);

    const [filteredItems, setFilteredItems] = useState<any>(userData);

    useEffect(() => {
        setFilteredItems(() => {
            return userData.filter((item: any) => {
                return item.payment_status.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList, userData]);
    contactList = userData;

    // const saveUser = async () => {
    //     if (Object.values(params).some((x) => x === null || x === '')) {
    //         showMessage('somthing  is missing', 'error');
    //         return true;
    //     }
    //     // if (!params.company_name) {
    //     //     showMessage('somthing  is missing', 'error');
    //     //     return true;
    //     // }
    //     // if (!params.email) {
    //     //     showMessage('somthing  is missing', 'error');
    //     //     return true;
    //     // }
    //     // if (!params.phone_number) {
    //     //     showMessage('somthing  is missing', 'error');
    //     //     return true;
    //     // }
    //     // if (!params.contact_person) {
    //     //     showMessage('somthing  is missing', 'error');
    //     //     return true;
    //     // }
    //     // if (!params.password) {
    //     //     showMessage('Password is required.', 'error');
    //     //     return true;
    //     // }

    //     console.log(params, 'paraams >>>>>>>>>>>>>>>>>');
    //     if (params.client_id) {
    //         //update user

    //         delete params.id;
    //         let user: any = filteredItems.find((d: any) => d.client_id === params.client_id);
    //         // const update = await axios.put(`http://localhost:3004/api/users:${params.id}`,params)
    //         // console.log(update);
    //         const update = await axios.put(`${config.API_BASE_URL}/client/${params.client_id}`, params);
    //         console.log(update, 'lets checck');
    //     } else {
    //         //add user
    //         let maxUserId = filteredItems.length ? filteredItems.reduce((max: any, character: any) => (character.id > max ? character.id : max), filteredItems[0].id) : 0;

    //         let user = {
    //             id: maxUserId + 1,
    //             path: 'profile-35.png',
    //             name: params.name,
    //             email: params.email,
    //             phone: params.phone,
    //             role: params.role,
    //             location: params.location,
    //             posts: 20,
    //             followers: '5K',
    //             following: 500,
    //         };
    //         filteredItems.splice(0, 0, user);
    //         //   searchContacts()
    //         delete params.id;
    //         delete params.location;
    //         // params.params.id = 10000
    //         params.username = params.phone_number;
    //         let addUSer = await axios.post('http://localhost:3004/api/client', params);
    //         setAddContactModal(false);
    //         showMessage('User has been saved successfully.');
    //     }
    //     setAddContactModal(false);
    // };

    const editUser = async (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            // setParams(json);
            setParams(json1);
            formik.setValues(json1);

            // console.log(update);
        }
        // const update = await axios.put(`http://localhost:3004/api/client/${params.id}`,params)
        // console.log(update , "update >>>>>>>>>>>>>>>>>>>");
        setViewContactModal(false);
        setAddContactModal(true);
    };

    const deleteUser = async (user: any = null) => {
        // setFilteredItems(filteredItems.filter((d: any) => d.id !== user.id));
        await axios.delete(`${config.API_BASE_URL}/transactions/${user.transaction_id}`);
        showMessage('Transection has been deleted successfully.');
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
        // transaction_id: Yup.string().required('Transaction Id is required'),
        date: Yup.string().required('Date is required'),
        route_name: Yup.string().required('Route Name is required'),
        origin: Yup.string().required('Origin is required'),
        bookings: Yup.string().required('Bookings is required'),
        destination: Yup.string().required('Destination is required'),
        payable_ammount: Yup.string().required('Payable Ammount is required'),
        ammount_to_driver: Yup.string().required('Ammout To Driver is required'),
        mode: Yup.string().required('Mode is required'),
        cheque_number: Yup.string().when('mode', {
            is: (mode: string) => mode !== 'cash', // Add conditions based on your validation logic
            then: Yup.string().required('Cheque Number is required'),
            otherwise: Yup.string().notRequired(),
        }),
        driver_name: Yup.string().required('Driver Name is required'),
    });

    const initialValues = {
        transaction_id: '',
        date: '',
        route_name: '',
        origin: '',
        bookings: '',
        destination: '',
        driver_name: '',
        payable_ammount: '',
        ammount_to_driver: '',
        mode: '',
        cheque_number: '',
        new_trackingId: '',
        ammount_to_balance_driver: '',
    };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (params.transaction_id) {
                    const totalAmmount = Number(formik.values.ammount_to_driver) - Number(formik.values.payable_ammount);
                    const totalAmmountPaid = Number(formik.values.ammount_to_driver) + Number(formik.values.payable_ammount);

                    const trasectionOject = {
                        ammount_to_driver: totalAmmount,
                        ammount_to_balance_driver: totalAmmountPaid,
                    };

                    // const update = await axios.put(`${config.API_BASE_URL}/bookings/${params.bookingID}`, trasectionOject);

                    // const data = { ...params };
                    // data.ammount_to_driver = totalAmmount;
                    // const response = await axios.put(`${config.API_BASE_URL}/transactions/${params.transaction_id}`, data);
                    // console.log(data, 'data');

                    // if (response.status === 200 || response.status === 204) {
                    //     showMessage(`Customer updated`);
                    //     formik.resetForm();
                    //     setAddContactModal(false);
                    // } else {
                    // }
                } else {
                    const totalAmmount = Number(formik.values.ammount_to_driver) - Number(formik.values.payable_ammount);
                    const totalAmmountPaid = Number(formik.values.ammount_to_balance_driver) + Number(formik.values.payable_ammount);

                    const trasectionOject = {
                        ammount_to_driver: totalAmmount,
                        ammount_to_balance_driver: totalAmmountPaid,
                    };

                    const update = await axios.put(`${config.API_BASE_URL}/bookings/${values.bookingID}`, trasectionOject);
                    const data = { ...values };
                    data.ammount_to_driver = totalAmmount;
                    data.new_trackingId = generateTransectionNumber();
                    const Data = await axios.post(`${config.API_BASE_URL}/transactions`, data);
                    showMessage('Booking has been updated successfully.');

                    if (Data.status === 201) {
                        showMessage(`New customer created`);
                        formik.resetForm();
                        setAddContactModal(false);
                    } else {
                    }
                }
            } catch (error: any) {
                if (error.response && error.response.data && error.response.data.message) {
                    Object.values(error.response.data.message).map((m: any) => {
                        showMessage(m);
                    });
                } else {
                    console.log('Something went wrong:', error);
                }
            }
        },
    });

    const saveUser = async (e: any) => {
        const trasction = await axios.post(`${config.API_BASE_URL}/transactions`, formik.values);
        if (trasction.status === 201) {
            setViewContactModal(false);
            showMessage('transactions has been saved successfully.');
        }
        e.preventDefault();
    };

    function getFormattedDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const addTransection = async (user: any = null) => {
        formik.setValues(initialValues); // Set the initial values
        setAddContactModal(true);
        setParams(initialValues);
    };

    function generateTransectionNumber() {
        const prefix = 'TRANSACTION';
        const timestamp = new Date().getTime(); // Get the current timestamp
        const randomSuffix = Math.floor(Math.random() * 1000); // Generate a random number

        const bookingNumber = `${prefix}-${timestamp}-${randomSuffix}`;

        return bookingNumber;
    }

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Booking Payments</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => addTransection()}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Booking Payments
                            </button>
                        </div>
                        <div>
                            <Button className="btn btn-primary" onClick={open}>
                                Filter
                            </Button>
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
                                    <th>Payment Id</th>
                                    <th>Date</th>
                                    <th>Booking Id</th>
                                    <th>Driver Name</th>
                                    <th>Amount</th>
                                    <th>mode</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingData.map((contact: any, index: any) => {
                                    return (
                                        <tr key={contact.id}>
                                            <td className="whitespace-nowrap">{index === 0 ? 1 : index + 1}</td>
                                            <td className="whitespace-nowrap">{contact?.transaction_id}</td>
                                            <td className="whitespace-nowrap">{moment(contact?.date).format('MM/DD/YYYY')}</td>
                                            <td className="whitespace-nowrap">{contact?.bookings}</td>
                                            <td className="whitespace-nowrap">{contact?.driver_name}</td>
                                            <td className="whitespace-nowrap">{contact?.payable_ammount}</td>
                                            <td className="whitespace-nowrap">{contact?.mode}</td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => viewUser(contact)}>
                                                        view
                                                    </button>
                                                    {/* <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(contact)}>
                                                        Edit
                                                    </button> */}
                                                    {/* <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(contact)}>
                                                        Delete
                                                    </button> */}
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
                    {filteredItems?.map((contact: any) => {
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
                                        {/* <button type="button" className="btn btn-outline-primary w-1/2" onClick={() => editUser(contact)}>
                                            Edit
                                        </button> */}
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
                                        {viewMode ? 'Transection Details' : params.transaction_id ? 'Edit Transection' : 'Add Transection'}
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div>
                                                <label htmlFor="routename">Transaction Id</label>
                                                <input
                                                    id="transactionid"
                                                    name="transaction_id"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.new_trackingId || generateTransectionNumber()}
                                                    type="text"
                                                    placeholder="Enter Transaction Id"
                                                    className="form-input"
                                                    required
                                                    disabled={viewMode || params.transaction_id}
                                                />
                                                {formik.touched.transaction_id && formik.errors.transaction_id && <div className="text-red-500 text-sm">{formik.errors.transaction_id}</div>}
                                            </div>
                                            <div className="mt-4">
                                                <div>
                                                    <label htmlFor="routename">Select Bookings</label>
                                                    <select
                                                        name="bookings"
                                                        onChange={(e) => {
                                                            formik.values.bookings = e.target.value;
                                                            userData?.map((v: any) => {
                                                                if (v.new_booking_id === formik.values.bookings) {
                                                                    formik.values.route_name = v.border_Route.route_name;
                                                                    formik.values.origin = v.border_Route.Booking_origin_Country.country_name;
                                                                    formik.values.destination = v.border_Route.Booking_destination_Country.country_name;
                                                                    formik.values.driver_name = v.driver.name;
                                                                    // formik.values.payable_ammount = v.total_ammount;
                                                                    formik.values.ammount_to_driver = v.ammount_to_driver;
                                                                    formik.values.date = v.date;
                                                                    formik.values.bookingID = v.booking_id;
                                                                    formik.values.ammount_to_balance_driver = v.ammount_to_balance_driver;
                                                                    // setBookingId(v.booking_id);
                                                                }
                                                                formik.handleChange(e);
                                                            });
                                                        }}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.bookings}
                                                        className="form-select text-white-dark"
                                                        required
                                                        disabled={viewMode}
                                                    >
                                                        <option value="">Select Bookings</option>
                                                        {userData?.map((booking_: any) => (
                                                            <option key={booking_.route_id} value={booking_.new_booking_id}>
                                                                {booking_.new_booking_id}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {formik.touched.bookings && formik.errors.bookings && <div className="text-red-500 text-sm">{formik.errors.bookings}</div>}
                                                </div>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="routename">Date</label>
                                                    <input
                                                        id="date"
                                                        type="date"
                                                        name="date"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        // value={formik?.values?.date  }
                                                        placeholder="--/--/--"
                                                        className="form-input"
                                                        disabled={viewMode}
                                                        defaultValue={moment(formik?.values?.date).format('YYYY-MM-DD')}
                                                        required
                                                    />
                                                    {formik.touched.date && formik.errors.date && <div className="text-red-500 text-sm">{formik.errors.date}</div>}
                                                </div>
                                                <div>
                                                    <label htmlFor="routename">Route Name</label>
                                                    <input
                                                        id="routename"
                                                        type="text"
                                                        name="route_name"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.route_name}
                                                        placeholder="Enter Route Name"
                                                        className="form-input"
                                                        required
                                                        disabled={viewMode}
                                                        readOnly
                                                    />
                                                    {formik.touched.route_name && formik.errors.route_name && <div className="text-red-500 text-sm">{formik.errors.route_name}</div>}
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <div>
                                                    <label htmlFor="routename">Origin</label>
                                                    <input
                                                        name="origin"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.origin}
                                                        placeholder="Enter Origin"
                                                        className="form-input text-white-dark"
                                                        required
                                                        disabled={viewMode}
                                                        readOnly
                                                    ></input>
                                                    {formik.touched.origin && formik.errors.origin && <div className="text-red-500 text-sm">{formik.errors.origin}</div>}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div>
                                                    <label htmlFor="routename">Destination</label>
                                                    <input
                                                        name="destination"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.destination}
                                                        placeholder="Enter Destination"
                                                        className="form-input text-white-dark"
                                                        required
                                                        disabled={viewMode}
                                                        readOnly
                                                    ></input>
                                                    {formik.touched.destination && formik.errors.destination && <div className="text-red-500 text-sm">{formik.errors.destination}</div>}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div>
                                                    <label htmlFor="routename">Driver Name</label>
                                                    <input
                                                        id="routename"
                                                        type="text"
                                                        name="driver_name"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.driver_name}
                                                        placeholder="Enter Driver Name"
                                                        className="form-input"
                                                        required
                                                        disabled={viewMode}
                                                        readOnly
                                                    />
                                                    {formik.touched.driver_name && formik.errors.driver_name && <div className="text-red-500 text-sm">{formik.errors.driver_name}</div>}
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <div>
                                                    <label htmlFor="routename">Amount To Driver</label>
                                                    <input
                                                        id="payable_ammount"
                                                        type="number"
                                                        name="ammount_to_driver"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.ammount_to_driver}
                                                        placeholder="Enter Amount To Driver"
                                                        className="form-input"
                                                        required
                                                        disabled={viewMode}
                                                        readOnly
                                                    />
                                                    {formik.touched.ammount_to_driver && formik.errors.ammount_to_driver && (
                                                        <div className="text-red-500 text-sm">{formik.errors.ammount_to_driver}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div>
                                                    <label htmlFor="routename">Pay Amount</label>
                                                    <input
                                                        id="routename"
                                                        type="number"
                                                        name="payable_ammount"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.payable_ammount}
                                                        placeholder="Enter Amount"
                                                        className="form-input"
                                                        required
                                                        disabled={viewMode}
                                                        // readOnly
                                                    />
                                                    {formik.touched.payable_ammount && formik.errors.payable_ammount && <div className="text-red-500 text-sm">{formik.errors.payable_ammount}</div>}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div>
                                                    <label htmlFor="routename">Payment Mode</label>
                                                    <select
                                                        name="mode"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.mode}
                                                        className="form-select text-white-dark"
                                                        required
                                                        disabled={viewMode}
                                                    >
                                                        <option value="">Select payment mode</option>
                                                        <option value="cash"> cash</option>
                                                        <option value="check"> check</option>
                                                        <option value="wire"> wire</option>
                                                    </select>
                                                    {/* {formik.touched.bookings && formik.errors.bookings && <div className="text-red-500 text-sm">{formik.errors.bookings}</div>} */}
                                                    {formik.touched.mode && formik.errors.mode && <div className="text-red-500 text-sm">{formik.errors.mode}</div>}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                {formik.values.mode != 'cash' ? (
                                                    <div>
                                                        <label htmlFor="routename">Cheque Number / Ref No</label>
                                                        <input
                                                            id="payable_ammount"
                                                            type="number"
                                                            name="cheque_number"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.cheque_number}
                                                            placeholder="Enter Cheque Number / ref No"
                                                            className="form-input"
                                                            required
                                                            disabled={viewMode}
                                                        />
                                                        {formik.touched.cheque_number && formik.errors.cheque_number && <div className="text-red-500 text-sm">{formik.errors.cheque_number}</div>}
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>

                                            {!viewContactModal && !viewMode && (
                                                <div className="flex justify-end items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                        Cancel
                                                    </button>

                                                    {params.transaction_id ? ( // Check if params.vehicle_id exists
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                            // onClick={() => {
                                                            //     // Handle edit action
                                                            // }}
                                                        >
                                                            Update
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                            // onClick={() => {
                                                            //     // Handle submit action
                                                            // }}
                                                        >
                                                            Submit
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            {/* filter */}
            <Modal opened={opened} onClose={close} title="Filter">
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="routename">Date From</label>
                            <input id="date" type="date" name="date_from" onChange={(e) => changeValue(e)} value={params.date_from} placeholder="--/--/--" className="form-input" required />
                        </div>
                        <div>
                            <label htmlFor="routename">Date To</label>
                            <input id="date" type="date" name="date_to" onChange={(e) => changeValue(e)} value={params.date_to} placeholder="--/--/--" className="form-input" required />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="routename">Select Driver</label>
                        <select id="routename" name="driver" onChange={(e) => changeValue(e)} value={params.driver_name} className="form-select" required>
                            <option value="">Select Driver</option>
                            <option value="c1">D1</option>
                            <option value="c2">D2</option>
                            <option value="c3">D3</option>
                        </select>
                    </div>
                    <div className="flex justify-end items-center w-100 mt-8">
                        <button type="button" className="btn btn-outline-success">
                            Filter
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Transaction;
