import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
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
import moment from 'moment';

const Truck = () => {
    const dispatch = useDispatch();
    const [defaultParams] = useState({
        registrationNumber: '',
        vehicleType: '',
        capacityTons: '',
        TruckExpiryDate: '',
        TruckDocument: '',
    });
    const [userData, setUserData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<any>(true);

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [viewContactModal, setViewContactModal] = useState<any>(false);
    const [viewMode, setViewMode] = useState(false);

    const fetch = async () => {
        const responce = await axios.get(`${config.API_BASE_URL}/vehicles`);
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
            return userData.filter((item: any) => {
                return item.vehicleType.toLowerCase().includes(search.toLowerCase());
                // return item.currentLocation.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList, userData]);
    contactList = userData;

    const saveUser = async () => {
        try {
            console.log(params, '>>>>>>>>>>>>>>>>>>>>');

            const Data = await axios.post(`${config.API_BASE_URL}/vehicles`, params);
            console.log(Data);

            if (Data.status === 201) {
                showMessage(`New vechile added`);
                setAddContactModal(false);
            } else {
            }
        } catch (error: any) {
            if (error.response.data.message) console.log(error.response.data.message);
            Object.values(error.response.data.message).map((m: any) => {
                showMessage(m);
            });
            console.log('something erroror', error);
        }
    };

    const editUser = async (user: any = null) => {
        console.log(user, 'user');
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
        await axios.delete(`${config.API_BASE_URL}/vehicles/${user.vehicle_id}`);
        showMessage('Truck has been deleted successfully.');
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
    //formik

    const validationSchema = Yup.object().shape({
        vehicleType: Yup.string().required('Truck Type is required'),
        registrationNumber: Yup.string().required(' Registration Number is required'),
        capacityTons: Yup.mixed()
            .test('is-number', 'Capacity Tones must be a number', (value) => {
                // Check if the value is undefined or a valid number
                return !value || !isNaN(value);
            })
            .required('Capasity Tones is required'),
        TruckDocument: Yup.string().required('Truck Document is required'),
        TruckExpiryDate: Yup.string().required('Truck Expiry Date is required'),
    });

    const initialValues = {
        registrationNumber: '',
        vehicleType: '',
        capacityTons: '',
        TruckExpiryDate: '',
        TruckDocument: '',
    };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (params.vehicle_id) {
                    const response = await axios.put(`${config.API_BASE_URL}/vehicles/${params.vehicle_id}`, values);

                    if (response.status === 200 || response.status === 204) {
                        showMessage(`Vehicle updated`);
                        formik.resetForm();
                        setAddContactModal(false);
                    } else {
                    }
                } else {
                    const Data = await axios.post(`${config.API_BASE_URL}/vehicles`, values);

                    console.log(Data);

                    if (Data.status === 201) {
                        showMessage(`New Vehicle created`);
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

    const addTruck = async (user: any = null) => {
        formik.setValues(initialValues); // Set the initial values
        formik.resetForm({}); // Reset errors
        setAddContactModal(true);
        setParams(initialValues);
    };

    console.log(formik, 'formik');

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Truck</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => addTruck()}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Truck Details
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
                                    <th>Truck Type</th>
                                    <th>Truck Capacity</th>
                                    <th>expiry Date</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((contact: any) => {
                                    return (
                                        <tr key={contact.id}>
                                            <td className="whitespace-nowrap">{contact.vehicleType}</td>
                                            <td className="whitespace-nowrap">{contact.capacityTons}</td>
                                            <td className="whitespace-nowrap">
                                                {contact.TruckExpiryDate ? new Date(contact.TruckExpiryDate).toISOString().split('T')[0].split('-').reverse().join('-') : ''}
                                            </td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => viewUser(contact)}>
                                                        view
                                                    </button>
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
                                        {viewMode ? 'Truck Details' : params.vehicle_id ? 'Edit Truck' : 'Add Truck'}
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div>
                                                <label htmlFor="countryname">Truck Type</label>
                                                <input
                                                    id="vehicleType"
                                                    type="text"
                                                    // placeholder="Enter Truck Type"
                                                    name="vehicleType"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.vehicleType}
                                                    className="form-input"
                                                    disabled={viewMode}
                                                ></input>
                                                {formik.touched.vehicleType && formik.errors.vehicleType && <div className="text-red-500 text-sm">{formik.errors.vehicleType}</div>}
                                            </div>
                                            <div className="mt-4">
                                                <label htmlFor="registrationNumber">Registration Number</label>
                                                <input
                                                    id="registrationNumber"
                                                    name="registrationNumber"
                                                    type="text"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.registrationNumber}
                                                    placeholder="Enter Registration Number"
                                                    className="form-input"
                                                    required
                                                    disabled={viewMode}
                                                />
                                                {formik.touched.registrationNumber && formik.errors.registrationNumber && (
                                                    <div className="text-red-500 text-sm">{formik.errors.registrationNumber}</div>
                                                )}
                                            </div>

                                            <div className="mt-4">
                                                <label htmlFor="capacityTons">Capacity Tons</label>
                                                <input
                                                    id="capacityTons"
                                                    name="capacityTons"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.capacityTons}
                                                    type="text"
                                                    placeholder="Enter Capacity Tons"
                                                    className="form-input"
                                                    required
                                                    disabled={viewMode}
                                                />
                                                {formik.touched.capacityTons && formik.errors.capacityTons && <div className="text-red-500 text-sm">{formik.errors.capacityTons}</div>}
                                            </div>

                                            <div className="mt-4">
                                                <label className="mb-2 inline-block text-neutral-700 dark:text-neutral-200" htmlFor="TruckDocument">
                                                    Truck Document
                                                </label>
                                                <input
                                                    id="TruckDocument"
                                                    name="TruckDocument"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    // value={formik.values.TruckDocument}
                                                    type="file"
                                                    placeholder="Enter Truck Document"
                                                    className="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                                    required
                                                    disabled={viewMode}
                                                />
                                                {formik.touched.TruckDocument && formik.errors.TruckDocument && <div className="text-red-500 text-sm">{formik.errors.TruckDocument}</div>}
                                            </div>

                                            <div className="mt-4">
                                                <label htmlFor="TruckExpiryDate">Truck Expiry Date</label>
                                                <input
                                                    id="TruckExpiryDate"
                                                    name="TruckExpiryDate"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    // value={formik.values.TruckExpiryDate}
                                                    type="date"
                                                    placeholder="Enter Truck Expiry Date"
                                                    className="form-input"
                                                    required
                                                    disabled={viewMode}
                                                    defaultValue={moment(formik?.values?.TruckExpiryDate).format('YYYY-MM-DD')} // Format the date using moment
                                                    // defaultValue={"2024-07-12"}
                                                />
                                                {formik.touched.TruckExpiryDate && formik.errors.TruckExpiryDate && <div className="text-red-500 text-sm">{formik.errors.TruckExpiryDate}</div>}
                                            </div>

                                            {!viewContactModal && !viewMode && (
                                                <div className="flex justify-end items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                        Cancel
                                                    </button>

                                                    {params.vehicle_id ? ( // Check if params.vehicle_id exists
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                            onClick={() => {
                                                                // Handle edit action
                                                            }}
                                                        >
                                                            Update
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                            onClick={() => {
                                                                // Handle submit action
                                                            }}
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
        </div>
    );
};

export default Truck;
