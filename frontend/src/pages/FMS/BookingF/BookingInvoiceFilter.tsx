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
import moment from 'moment';

const BookingInvoiceFilter = () => {
    const dispatch = useDispatch();
    const [defaultParams] = useState({
        startDate: '',
        endDate: '',
        customer: '',
        // status: '',
    });
    const [userData, setUserData] = useState<any>([]);
    const [filterInvoice, setFilterInvoice] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<any>(false);
    const [customerData, setCustomerData] = useState<any>([]);
    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [viewContactModal, setViewContactModal] = useState<any>(false);
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
        const fetch = async () => {
            const responce = await axios.get(`${config.API_BASE_URL}/invoice`);
            setUserData(responce.data);

            const customerData = await axios.get(`${config.API_BASE_URL}/customers`);
            setCustomerData(customerData.data.data);
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
                return item.customer.company_name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList, userData]);
    contactList = userData;

    const saveUser = async (e) => {
        e.preventDefault();

        if (Object.values(params).some((x) => x === null || x === '')) {
            showMessage('Something is missing', 'error');
            return true;
        }

        try {
            const response = await axios.post(`${config.API_BASE_URL}/invoice/filter`, params);
            const filteredData = response.data;

            setFilterInvoice(filteredData);
            setIsLoading(true);
            showMessage('Data has been filtered successfully.', 'success');
        } catch (error) {
            console.error('Error filtering data:', error);
            showMessage('Error filtering data. Please try again.', 'error');
        }

        setAddContactModal(false);
    };
    const editUser = async (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
        }
        setViewContactModal(false);
        setAddContactModal(true);
    };

    const deleteUser = async (user: any = null) => {
        await axios.delete(`${config.API_BASE_URL}/client/${user.client_id}`);
        showMessage('client has been deleted successfully.');
    };

    const ViewUser = async (user: any = null) => {
        setViewContactModal(true);
        setAddContactModal(true);
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

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Invoice</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => editUser()}>
                                Filter
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
                                    <th>Invoice Date</th>
                                    <th>Invoice Number</th>
                                    <th>Booking Id</th>
                                    <th>Customer</th>
                                    <th>Route Name</th>
                                    <th>Total Ammount</th>
                                    <th>Recived</th>
                                    <th>Balance Ammount</th>
                                    <th>pay To Driver</th>
                                    <th>Driver Balance</th>
                                    <th>Document Status</th>
                                    {/* <th>Tracking Status</th> */}
                                    {/* <th>Upload Documents</th> */}
                                    <th>Consignment Document Status</th>
                                    <th>Invoice Status</th>

                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(isLoading ? filterInvoice : filteredItems).length > 0 ? (
                                    (isLoading ? filterInvoice : filteredItems).map((contact: any, index: any) => (
                                        <tr key={contact.id}>
                                            <td>
                                                <div className="flex items-center w-max">
                                                    {contact.path && (
                                                        <div className="w-max">
                                                            <img src={`/assets/images/${contact.path}`} className="h-8 w-8 rounded-full object-cover ltr:mr-2 rtl:ml-2" alt="avatar" />
                                                        </div>
                                                    )}
                                                    {!contact.path && contact.company_name && (
                                                        <div className="grid place-content-center h-8 w-8 ltr:mr-2 rtl:ml-2 rounded-full bg-primary text-white text-sm font-semibold"></div>
                                                    )}
                                                    {!contact.path && !contact.company_name && (
                                                        <div className="border border-gray-300 dark:border-gray-800 rounded-full p-2 ltr:mr-2 rtl:ml-2">
                                                            <IconUser className="w-4.5 h-4.5" />
                                                        </div>
                                                    )}
                                                    <div>{index + 1}</div>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap">{moment(contact?.updatedAt).format('MM/DD/YYYY')}</td>
                                            <td className="whitespace-nowrap">{contact?.invoiceNumber}</td>

                                            <td className="whitespace-nowrap">{contact?.booking?.new_booking_id}</td>
                                            <td className="whitespace-nowrap">{contact?.customer?.company_name}</td>
                                            <td className="whitespace-nowrap">{contact?.border_Route?.route_name}</td>
                                            <td className="whitespace-nowrap">{contact?.booking?.total_ammount}</td>
                                            <td className="whitespace-nowrap">{contact?.received !== null ? contact.received : 'unpaid'}</td>

                                            <td className="whitespace-nowrap">{contact?.received !== null ? 'No Balance' : contact?.booking?.total_ammount}</td>

                                            <td className="whitespace-nowrap">{contact?.payToDriver}</td>
                                            <td className="whitespace-nowrap">{contact?.booking?.ammount_to_driver}</td>
                                            <td className="whitespace-nowrap">{contact?.booking?.document_path ? 'complete' : 'pending'}</td>
                                            {/* <td className="whitespace-nowrap">
                                                {contact?.booking?.trackingsses && contact.booking.trackingsses.length > 0
                                                    ? contact.booking.trackingsses.map((tracking: any) => <span key={tracking.tracking_history_id}>{tracking.tracking?.tracking_stage}</span>)
                                                    : 'No tracking data available'}
                                            </td> */}

                                            <td className="whitespace-nowrap">{contact?.consignmentDocumentStatus ? 'complete' : 'Pending'}</td>

                                            <td className="whitespace-nowrap">{contact?.isReceived ? 'Paid' : 'UnPaid'}</td>

                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => ViewUser(contact)}>
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
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', margin: 'auto' }}>
                                        <p>No data found</p>
                                    </div>
                                )}
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
                                        {params.client ? 'Edit Contact' : 'Filter'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="routename">StartDate</label>
                                                    <input
                                                        id=""
                                                        type="date"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.date}
                                                        name="startDate"
                                                        placeholder="--/--/--"
                                                        className="form-input"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="routename">EndDate</label>
                                                    <input
                                                        id=""
                                                        type="date"
                                                        onChange={(e) => changeValue(e)}
                                                        value={params.date}
                                                        name="endDate"
                                                        placeholder="--/--/--"
                                                        className="form-input"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="">Select Customer</label>
                                                    <select name="customer" onChange={(e) => changeValue(e)} value={params.customer} className="form-select text-white-dark" required>
                                                        <option value={0}>Select Customer</option>
                                                        {customerData?.map((customer: any) => (
                                                            <option key={customer.customer_id} value={customer.company_name}>
                                                                {customer.company_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            {!viewContactModal && (
                                                <div className="flex justify-end items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                        Cancel
                                                    </button>
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={(e) => saveUser(e)}>
                                                        {params.driver_id ? 'Update' : 'Submit'}
                                                    </button>
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

export default BookingInvoiceFilter;
