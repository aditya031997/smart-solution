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

const Client = () => {
    const dispatch = useDispatch();
    const [defaultParams] = useState({
        company_name: '',
        contact_person: '',
        email: '',
        phone_number: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        username: '',
        password: '',
        credit_limit: '',
        address1_2: '',
        address2: '',
        address2_2: '',
        country2: '',
        state2: '',
        citys2: '',
        pinCode2: '',
        // Tax_reg_no: '',
    });

    const validationSchema = Yup.object().shape({
        company_name: Yup.string().required('Company Name is required'),
        contact_person: Yup.string().required('Contact Person is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phone_number: Yup.number()
            .typeError('Phone number must be a number')
            .positive('Phone number must be a positive number')
            .integer('Phone number must be an integer')
            .required('Phone number is required'),
        address: Yup.string().required('Address is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        postal_code: Yup.string().required('Pin Code is required'),
        // Tax_reg_no: Yup.number().required('Tex Registration Number is required'),
        country: Yup.string().required('Country is required'),
        address2: Yup.string().required('Address is required'),
        citys2: Yup.string().required('City 2 is required'),
        state2: Yup.string().required('State 2 is required'),
        postal_code2: Yup.string().required('Pin Code 2 is required'),
        country2: Yup.string().required('Country 2 is required'),
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
    });

    const initialValues = {
        company_name: '',
        contact_person: '',
        email: '',
        phone_number: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        address2: '',
        citys2: '',
        state2: '',
        postal_code2: '',
        country2: '',
        username: '',
        password: '',
        // Tax_reg_no: '',
    };

    const [userData, setUserData] = useState<any>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<any>(true);

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [viewContactModal, setViewContactModal] = useState<any>(false);

    const fetch = async () => {
        const responce = await axios.get(`${config.API_BASE_URL}/client`);

        setUserData(responce.data.data);
    };
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));

        fetch();
    }, [addContactModal]);

    const [value, setValue] = useState<any>('list');
    const [viewMode, setViewMode] = useState(false);

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
                return item.company_name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList, userData]);
    contactList = userData;

    const saveUser = async () => {
        if (Object.values(params).some((x) => x === null || x === '')) {
            showMessage('somthing  is missing', 'error');
            return true;
        }

        const formik = useFormik({
            initialValues: initialValues,
            validationSchema: validationSchema,
            onSubmit: (values) => {
                // Handle form submission logic here
            },
        });

        if (params.client_id) {
            //update user

            delete params.id;
            let user: any = filteredItems.find((d: any) => d.client_id === params.client_id);
            // const update = await axios.put(`http://localhost:3004/api/users:${params.id}`,params)
            // console.log(update);
            const update = await axios.put(`${config.API_BASE_URL}/client/${params.client_id}`, params);
            console.log(update, 'lets checck');
        } else {
            //add user
            let maxUserId = filteredItems.length ? filteredItems.reduce((max: any, character: any) => (character.id > max ? character.id : max), filteredItems[0].id) : 0;

            let user = {
                id: maxUserId + 1,
                path: 'profile-35.png',
                name: params.name,
                email: params.email,
                phone: params.phone,
                role: params.role,
                location: params.location,
                posts: 20,
                followers: '5K',
                following: 500,
            };
            filteredItems.splice(0, 0, user);
            //   searchContacts()s
            delete params.id;
            delete params.location;
            // params.params.id = 10000
            params.username = params.phone_number;
            let addUSer = await axios.post(`${config.API_BASE_URL}/client`, params);
            setAddContactModal(false);
            showMessage('User has been saved successfully.');
        }
        setAddContactModal(false);
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            console.log(values, 'values');
            try {
                if (params?.client_id) {
                    console.log('dsds');
                    const response = await axios.put(`${config.API_BASE_URL}/client/${params?.client_id}`, values);

                    if (response.status === 200 || response.status === 204) {
                        showMessage(`Client updated`);
                        formik.resetForm();
                        setAddContactModal(false);
                    } else {
                    }
                } else {
                    const Data = await axios.post(`${config.API_BASE_URL}/client`, values);

                    console.log(Data);

                    if (Data.status === 201) {
                        showMessage(`New Client created`);
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

    const handleReset = () => {
        formik.resetForm();
    };

    const editUser = async (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
            formik.setValues(json1);
        }
        setAddContactModal(true);
    };

    const deleteUser = async (user: any = null) => {
        // setFilteredItems(filteredItems.filter((d: any) => d.customer_id !== user.customer_id));
        const Data = axios.delete(`${config.API_BASE_URL}/client/${user.client_id}`);
        showMessage('Client deleted successfully.');
        await fetch();
    };

    // const ViewUser = async (user: any = null) => {
    //     // await axios.get(`http://localhost:3004/api/client/${user.client_id}`);
    //     setViewContactModal(true);
    //     setAddContactModal(true);
    // };

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

    const addClient = async (user: any = null) => {
        formik.setValues(initialValues); // Set the initial values
        setAddContactModal(true);
        setParams(initialValues);
    };
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Client</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => addClient()}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Client
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
                                    <th>Client Name</th>
                                    <th>Contact Person Name</th>
                                    <th>Contect Number</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((contact: any) => {
                                    return (
                                        <tr key={contact.id}>
                                            <td className="whitespace-nowrap">{contact.client_id}</td>
                                            <td className="whitespace-nowrap">{contact.company_name}</td>
                                            <td className="whitespace-nowrap">{contact.contact_person}</td>
                                            <td className="whitespace-nowrap">{contact.phone_number}</td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button
                                                        onClick={() => viewUser(contact)}
                                                        className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                                                    >
                                                        view
                                                    </button>

                                                    {/* Pop-up Box */}
                                                    {isOpen && (
                                                        <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
                                                            <div className="bg-white p-8 rounded shadow-lg w-96">
                                                                <p>Details of Client</p>
                                                                <button
                                                                    onClick={() => setIsOpen(false)}
                                                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
                                                                >
                                                                    Close
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
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

                                        <div>
                                            {/* Button trigger modal */}
                                            <button
                                                type="button"
                                                className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                                data-te-toggle="modal"
                                                data-te-target="#exampleModal"
                                                data-te-ripple-init
                                                data-te-ripple-color="light"
                                            >
                                                View
                                            </button>
                                            {/* Modal */}
                                            <div
                                                data-te-modal-init
                                                className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                                                id="exampleModal"
                                                tabIndex={-1}
                                                aria-labelledby="exampleModalLabel"
                                                aria-hidden="true"
                                            >
                                                <div
                                                    data-te-modal-dialog-ref
                                                    className="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]"
                                                >
                                                    <div className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
                                                        <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                                                            {/*Modal title*/}
                                                            <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200" id="exampleModalLabel">
                                                                Full Details
                                                            </h5>
                                                            {/*Close button*/}
                                                            <button
                                                                type="button"
                                                                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                                                data-te-modal-dismiss
                                                                aria-label="Close"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        {/*Modal body*/}
                                                        <div className="relative flex-auto p-4" data-te-modal-body-ref>
                                                            Client Full Details
                                                        </div>
                                                        {/*Modal footer*/}
                                                        <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                                                            <button
                                                                type="button"
                                                                className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                                                                data-te-modal-dismiss
                                                                data-te-ripple-init
                                                                data-te-ripple-color="light"
                                                            >
                                                                Close
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                                        {viewMode ? 'Client Details' : params.client_id ? 'Edit Client' : 'Add Client'}
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={formik.handleSubmit}>
                                            {/* Company Name */}
                                            <div className="grid mt-2 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="">
                                                    <label htmlFor="company_name">Company Name</label>
                                                    <input
                                                        type="text"
                                                        id="company_name"
                                                        name="company_name"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Company Name"
                                                        value={formik.values.company_name}
                                                        className="form-input"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.company_name && formik.errors.company_name && <div className="text-red-500 text-sm">{formik.errors.company_name}</div>}
                                                </div>

                                                {/* Contact Person */}
                                                <div>
                                                    <label htmlFor="contact_person">Contact Person</label>
                                                    <input
                                                        type="text"
                                                        id="contact_person"
                                                        name="contact_person"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Contect Person"
                                                        value={formik.values.contact_person}
                                                        className="form-input"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.contact_person && formik.errors.contact_person && <div className="text-red-500 text-sm">{formik.errors.contact_person}</div>}
                                                </div>
                                            </div>

                                            {/* Email */}
                                            {/* <div className="mt-4">
                                                <label htmlFor="email">Email</label>
                                                <input
                                                    type="text"
                                                    id="email"
                                                    name="email"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    placeholder="Enter Email"
                                                    value={formik.values.email}
                                                    className="form-input"
                                                    disabled={viewMode}
                                                />
                                                {formik.touched.email && formik.errors.email && <div className="text-red-500 text-sm">{formik.errors.email}</div>}
                                            </div> */}
                                            <div className="grid mt-2 grid-cols-1 sm:grid-cols-2 gap-4">
                                                {/* Phone Number */}

                                                {/* <div className="mt-4">
                                                    <label htmlFor="Tax_reg_no.">Tax Registration Number</label>
                                                    <input
                                                        type="number"
                                                        id="Tax_reg_no"
                                                        name="Tax_reg_no"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Tax Registration Number"
                                                        className="form-input"
                                                        value={formik.values.Tax_reg_no}
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.Tax_reg_no && formik.errors.Tax_reg_no && <div className="text-red-500 text-sm">{formik.errors.Tax_reg_no}</div>}
                                                </div> */}
                                                <div className="mt-4">
                                                    <label htmlFor="email">Email</label>
                                                    <input
                                                        type="text"
                                                        id="email"
                                                        name="email"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Email"
                                                        value={formik.values.email}
                                                        className="form-input"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.email && formik.errors.email && <div className="text-red-500 text-sm">{formik.errors.email}</div>}
                                                </div>
                                                <div className="mt-4">
                                                    <label htmlFor="phone_number">Phone Number</label>
                                                    <input
                                                        type="text"
                                                        id="phone_number"
                                                        name="phone_number"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Phone Number"
                                                        value={formik.values.phone_number}
                                                        className="form-input"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.phone_number && formik.errors.phone_number && <div className="text-red-500 text-sm">{formik.errors.phone_number}</div>}
                                                </div>
                                            </div>

                                            {/* Address */}
                                            <div className="inline-flex mt-4 items-center justify-center w-full">
                                                <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                                                <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Address 1</span>
                                            </div>

                                            <div className="mt-4">
                                                <div>
                                                    <label htmlFor="address">Address 1</label>
                                                    <input
                                                        type="text"
                                                        id="address"
                                                        name="address"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Address"
                                                        className="form-input"
                                                        value={formik.values.address}
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.address && formik.errors.address && <div className="text-red-500 text-sm">{formik.errors.address}</div>}
                                                </div>
                                                {/* <div>
                                                    <label htmlFor="address">Address 2</label>
                                                    <input
                                                        type="text"
                                                        id="address"
                                                        name="address"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Address"
                                                        className="form-input"
                                                        value={formik.values.address}
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.address && formik.errors.address && <div className="text-red-500 text-sm">{formik.errors.address}</div>}
                                                </div> */}
                                            </div>

                                            {/* City */}
                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="mb-4">
                                                    <label htmlFor="city">City</label>
                                                    <input
                                                        type="text"
                                                        id="city"
                                                        name="city"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter City"
                                                        value={formik.values.city}
                                                        className="form-input"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.city && formik.errors.city && <div className="text-red-500 text-sm">{formik.errors.city}</div>}
                                                </div>

                                                {/* State */}
                                                <div className="mb-4">
                                                    <label htmlFor="state">State</label>
                                                    <input
                                                        type="text"
                                                        id="state"
                                                        name="state"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter State"
                                                        value={formik.values.state}
                                                        className="form-input"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.state && formik.errors.state && <div className="text-red-500 text-sm">{formik.errors.state}</div>}
                                                </div>
                                            </div>

                                            {/* Postal Code */}
                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="mb-4">
                                                    <label htmlFor="postal_code">Pin Code</label>
                                                    <input
                                                        type="text"
                                                        id="postal_code"
                                                        name="postal_code"
                                                        placeholder="Enter Pin Code"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.postal_code}
                                                        className="form-input"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.postal_code && formik.errors.postal_code && <div className="text-red-500 text-sm">{formik.errors.postal_code}</div>}
                                                </div>

                                                {/* Country */}
                                                <div className="mb-4">
                                                    <label htmlFor="country">Country</label>
                                                    <input
                                                        type="text"
                                                        id="country"
                                                        name="country"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Country"
                                                        value={formik.values.country}
                                                        className="form-input"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.country && formik.errors.country && <div className="text-red-500 text-sm">{formik.errors.country}</div>}
                                                </div>
                                            </div>

                                            {/* Address 2 */}
                                            <div className="inline-flex mt-4 items-center justify-center w-full">
                                                <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                                                <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">Address 2</span>
                                            </div>

                                            <div className="mt-4">
                                                <div>
                                                    <label htmlFor="address2">Address 1</label>
                                                    <input
                                                        type="text"
                                                        id="address2"
                                                        name="address2"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Address"
                                                        className="form-input"
                                                        value={formik.values.address2}
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.address2 && formik.errors.address2 && <div className="text-red-500 text-sm">{formik.errors.address2}</div>}
                                                </div>
                                                {/* <div>
                                                    <label htmlFor="address2">Address 2</label>
                                                    <input
                                                        type="text"
                                                        id="address2"
                                                        name="address2"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Address"
                                                        className="form-input"
                                                        value={formik.values.address2}
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.address2 && formik.errors.address2 && <div className="text-red-500 text-sm">{formik.errors.address2}</div>}
                                                </div> */}
                                            </div>

                                            {/* City 2 */}
                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="mb-4">
                                                    <label htmlFor="citys2">City 2</label>
                                                    <input
                                                        type="text"
                                                        id="citys2"
                                                        name="citys2"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter City"
                                                        value={formik.values.citys2}
                                                        className="form-input"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.citys2 && formik.errors.citys2 && <div className="text-red-500 text-sm">{formik.errors.citys2}</div>}
                                                </div>

                                                {/* State 2 */}
                                                <div className="mb-4">
                                                    <label htmlFor="state2">State 2</label>
                                                    <input
                                                        type="text"
                                                        id="state2"
                                                        name="state2"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter State"
                                                        value={formik.values.state2}
                                                        className="form-input"
                                                        disabled={viewMode}
                                                    />

                                                    {formik.touched.state2 && formik.errors.state2 && <div className="text-red-500 text-sm">{formik.errors.state2}</div>}
                                                </div>
                                            </div>

                                            {/* Postal Code 2 */}
                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="mb-4">
                                                    <label htmlFor="postal_code2">Pin Code 2</label>
                                                    <input
                                                        type="text"
                                                        id="postal_code2"
                                                        name="postal_code2"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Pin Code"
                                                        value={formik.values.postal_code2}
                                                        className="form-input"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.postal_code2 && formik.errors.postal_code2 && <div className="text-red-500 text-sm">{formik.errors.postal_code2}</div>}
                                                </div>

                                                {/* Country 2 */}
                                                <div className="mb-4">
                                                    <label htmlFor="country2">Country 2</label>
                                                    <input
                                                        type="text"
                                                        id="country2"
                                                        name="country2"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Enter Country"
                                                        value={formik.values.country2}
                                                        className="form-input"
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.country2 && formik.errors.country2 && <div className="text-red-500 text-sm">{formik.errors.country2}</div>}
                                                </div>
                                            </div>

                                            {/* Username */}
                                            <div className="mb-4">
                                                <label htmlFor="username">Username</label>
                                                <input
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    placeholder="Enter Username"
                                                    value={formik.values.username}
                                                    className="form-input"
                                                    disabled={viewMode}
                                                />
                                                {formik.touched.username && formik.errors.username && <div className="text-red-500 text-sm">{formik.errors.username}</div>}
                                            </div>

                                            {/* Password */}
                                            <div className="mb-4">
                                                <label htmlFor="password">Password</label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    placeholder="Enter Password"
                                                    value={formik.values.password}
                                                    className="form-input"
                                                    disabled={viewMode}
                                                />
                                                {formik.touched.password && formik.errors.password && <div className="text-red-500 text-sm">{formik.errors.password}</div>}
                                            </div>
                                            <div className="flex justify-end items-center mt-8">
                                                {viewMode ? (
                                                    // No buttons for view mode
                                                    ''
                                                ) : (
                                                    <>
                                                        <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                            {params?.client_id ? 'Edit Client' : 'Add Client'}
                                                        </button>
                                                        <button type="button" onClick={handleReset} className="btn btn-danger ltr:ml-4 rtl:mr-4">
                                                            Reset
                                                        </button>
                                                    </>
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

export default Client;
