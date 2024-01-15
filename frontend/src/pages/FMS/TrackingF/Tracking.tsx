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

const Tracking = () => {
    const dispatch = useDispatch();
    const [defaultParams] = useState({
        s_no: '',
        trackingId: '',
        date: '',
        booking_id: '',
        // tracking_stage: '',
        trackingStage_id: '',
        remark: '',
     
    });
    const [userData, setUserData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<any>(true);

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [viewContactModal, setViewContactModal] = useState<any>(false);
    const [bookingData, setBookingData] = useState([]);
    const [trackingData, setTrackingData] = useState([]);
    const [viewMode, setViewMode] = useState(false);

    const fetchTrackingData = async () => {
        try {
            const { data } = await axios.get(`${config.API_BASE_URL}/tracking/getHistory`);
            
            return data;
        } catch (error) {
            console.error('Error fetching tracking data:', error);
            throw error;
        }
    };
    function generateTrackingNumber() {
        const prefix = 'TRACKING';
        const timestamp = new Date().getTime(); // Get the current timestamp
        const randomSuffix = Math.floor(Math.random() * 1000); // Generate a random number

        const bookingNumber = `${prefix}-${timestamp}-${randomSuffix}`;

        return bookingNumber;
    }

    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
        const fetch = async () => {
            const trackingHistoryData = await fetchTrackingData();
            setUserData(trackingHistoryData);
            const bookings = await axios.get(`${config.API_BASE_URL}/bookings`);
            setBookingData(bookings?.data?.data);

            const tracking = await axios.get(`${config.API_BASE_URL}/tracking/get`);
            setTrackingData(tracking.data);
        };
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
                return item?.name?.toLowerCase().includes(search?.toLowerCase());
            });
        });
    }, [search, contactList, userData]);
    contactList = userData;

    const saveUser = async () => {
        if (Object.values(params).some((x) => x === null || x === '')) {
            showMessage('somthing  is missing', 'error');
            return true;
        }

        if (params.client_id) {
            //update user

            delete params.id;
            let user: any = filteredItems.find((d: any) => d.client_id === params.client_id);

            const update = await axios.put(`${config.API_BASE_URL}/client/${params.client_id}`, params);
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
            //   searchContacts()
            delete params.id;
            delete params.location;
            // params.params.id = 10000
            params.username = params.phone_number;
            let addUSer = await axios.post('http://localhost:3004/api/client', params);
            setAddContactModal(false);
            showMessage('User has been saved successfully.');
        }
        setAddContactModal(false);
    };

    const editUser = async (user: any = null) => {
        console.log(user,"user")
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
            formik.setValues(json1);
        }
        setViewContactModal(false);
        setAddContactModal(true);
        setViewMode(false);
    };

    const ViewUser = async (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
            formik.setValues(json1);
        }
        setAddContactModal(true);
        setViewMode(true);
    };

    const deleteTracking = async (tracking: any = null) => {
        await axios.delete(`${config.API_BASE_URL}/tracking/trackingHistory/${tracking.tracking_history_id}`);
        showMessage('Tracking history has been deleted successfully.');
        const countryData = await fetchTrackingData();
        setUserData(countryData);
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
        // trackingId: Yup.string().required('Tracking Id is required'),
        date: Yup.string().required('Date is required'),

        booking_id: Yup.string().required('Booking Id is required'),
        trackingStage_id: Yup.string().required('Tracking Stages is required'),
        remark: Yup.string().required('Remark is required'),
    });

    const initialValues = {
        trackingId: '',
        date: '',
        booking_id: '',
        trackingStage_id: '',
        remark: '',
        trackingNumber: generateTrackingNumber(),
    };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (params.trackingId) {
                    const trackData = {
                        booking_id: values.booking_id,
                        date: values.date,
                        remark: values.remark,
                        trackingId: values.trackingId,
                        trackingStage_id: values.trackingStage_id,
                    };
                    const response = await axios.put(`${config.API_BASE_URL}/tracking/trackingHistory/${params.tracking_history_id}`, trackData);
                    if (response.status === 200 || response.status === 204) {
                        showMessage(`Country updated`);
                        formik.resetForm();
                        setAddContactModal(false);
                    }
                } else {
                    console.log(values, 'values');
                    let Data = await axios.post(`${config.API_BASE_URL}/tracking/trackingHistory`, values);
                    if (Data.status === 201) {
                        showMessage(`Tracking created`);
                        formik.resetForm();
                        setAddContactModal(false);
                    }
                    formik.resetForm();
                    setAddContactModal(false);
                }
            } catch (error) {}
            // Handle form submission logic here
        },
    });

    const handleCloseModal = () => {
        setAddContactModal(false);
        formik.resetForm();
    };

    const addTracking = async (user: any = null) => {
        formik.setValues(initialValues); // Set the initial values
        formik.resetForm({}); // Reset errors
        setAddContactModal(true);
        setParams(initialValues);
        setViewMode(false);
    };


    console.log(userData,"userData")
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Tracking</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => addTracking()}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Tracking
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
                                    <th>S. Number</th>
                                    <th>Tracking Id</th>
                                    <th>Booking Id</th>
                                    <th>Tracking Stage</th>
                                    <th>Remark</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userData.map((tracking: any, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td className="whitespace-nowrap">{index + 1}</td>
                                            <td className="whitespace-nowrap">{tracking.trackingId}</td>
                                            <td className="whitespace-nowrap">{tracking.booking?.new_booking_id}</td>
                                            <td className="whitespace-nowrap">{tracking?.tracking?.tracking_stage}</td>
                                            <td className="whitespace-nowrap">{tracking.remark}</td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => ViewUser(tracking)}>
                                                        view
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editUser(tracking)}>
                                                        Edit
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteTracking(tracking)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        ;
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
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Transition appear show={addContactModal} as={Fragment}>
                <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
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
                                        onClick={() => setAddContactModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                        {viewMode ? 'Tracking detail' : params.trackingId ? 'Edit Tracking' : 'Add Tracking'}
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div>
                                                <label htmlFor="routename">Tracking Id</label>
                                                <input
                                                    id="trackingid"
                                                    name="trackingId"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.trackingId || generateTrackingNumber()}
                                                    type="text"
                                                    placeholder="Enter Tracking Id"
                                                    className="form-input"
                                                    required
                                                    disabled={viewMode}
                                                />
                                                {/* {formik.touched.trackingId && formik.errors.trackingId && <div className="text-red-500 text-sm">{formik.errors.trackingId}</div>} */}
                                            </div>
                                            <div className="mt-4">
                                                <label htmlFor="routename">Select Booking Id</label>
                                                <select
                                                    name="booking_id"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.booking_id}
                                                    className="form-select text-white-dark"
                                                    required
                                                    disabled={viewMode}
                                                >
                                                    <option value="">Select Booking Id</option>
                                                    {bookingData?.map((booking: any) => (
                                                        <option key={booking.booking_id} value={booking?.booking_id}>
                                                            {booking?.new_booking_id}
                                                        </option>
                                                    ))}
                                                </select>

                                                {formik.touched.booking_id && formik.errors.booking_id && <div className="text-red-500 text-sm">{formik.errors.booking_id}</div>}
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="routename">Date</label>
                                                    <input
                                                        id="date"
                                                        type="date"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        // value={formik.values.date}
                                                        name="date"
                                                        placeholder="--/--/--"
                                                        className="form-input"
                                                        required
                                                        disabled={viewMode}
                                                        defaultValue={moment(formik?.values?.date).format('YYYY-MM-DD')} // Format the date using moment
                                                    />
                                                    {formik.touched.date && formik.errors.date && <div className="text-red-500 text-sm">{formik.errors.date}</div>}
                                                </div>
                                                <div>
                                                    <label htmlFor="routename">Tracking Stages</label>
                                                    <select
                                                        name="trackingStage_id"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.trackingStage_id}
                                                        className="form-select text-white-dark"
                                                        required
                                                        disabled={viewMode}
                                                    >
                                                        <option value="">Select Stage</option>
                                                        {trackingData?.map((tracking: any) => (
                                                            <option key={tracking.tracking_id} value={tracking?.tracking_id}>
                                                                {tracking?.tracking_stage}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {formik.touched.trackingStage_id && formik.errors.trackingStage_id && <div className="text-red-500 text-sm">{formik.errors.trackingStage_id}</div>}
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <div>
                                                    <label htmlFor="routename">Remark</label>
                                                    <input
                                                        id="routename"
                                                        type="text"
                                                        name="remark"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.remark}
                                                        placeholder="Enter Remark"
                                                        className="form-input"
                                                        required
                                                        disabled={viewMode}
                                                    />
                                                    {formik.touched.remark && formik.errors.remark && <div className="text-red-500 text-sm">{formik.errors.remark}</div>}
                                                </div>
                                            </div>

                                            <div className="flex justify-end items-center mt-8">
                                                {!viewMode && (
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => handleCloseModal()}>
                                                        Cancel
                                                    </button>
                                                )}
                                                {!viewMode && (
                                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                        {params.trackingId ? 'Update' : 'Submit'}
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

export default Tracking;
