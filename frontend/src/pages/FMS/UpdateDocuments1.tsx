import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconUserPlus from '../../components/Icon/IconUserPlus';
import IconListCheck from '../../components/Icon/IconListCheck';
import IconLayoutGrid from '../../components/Icon/IconLayoutGrid';
import IconSearch from '../../components/Icon/IconSearch';
import IconUser from '../../components/Icon/IconUser';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconInstagram from '../../components/Icon/IconInstagram';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconX from '../../components/Icon/IconX';
import axios from 'axios';
import config from '../../congif/config';

const UpdateDocuments1 = () => {
    const dispatch = useDispatch();
    const [defaultParams] = useState({
        id: null,
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
    });
    const [userData, setUserData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<any>(true);

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [viewContactModal, setViewContactModal] = useState<any>(false);
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
        const fetch = async () => {
            const responce = await axios.get('${config.API_BASE_URL}/driverDocuments');

            setUserData(responce.data);
        };
        fetch();
    }, [addContactModal]);
    useEffect(() => {
    }, [userData]);

    const [value, setValue] = useState<any>('list');

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const [search, setSearch] = useState<any>('');
    // static for now
    let [contactList] = useState<any>(userData);

    const [filteredItems, setFilteredItems] = useState<any>(userData);

    useEffect(() => {
        setFilteredItems(() => {
            return userData.filter((item: any) => {
                return item.driver.name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList, userData]);
    contactList = userData;

    const saveUser = async () => {
        if (!params.company_name) {
            showMessage('company name is required.', 'error');
            return true;
        }
        if (!params.email) {
            showMessage('Email is required.', 'error');
            return true;
        }
        if (!params.phone_number) {
            showMessage('Phone is required.', 'error');
            return true;
        }
        if (!params.contact_person) {
            showMessage('contact person name is required.', 'error');
            return true;
        }
        if (!params.password) {
            showMessage('Password is required.', 'error');
            return true;
        }

        if (params.client_id) {
            //update user

            delete params.id;
            let user: any = filteredItems.find((d: any) => d.client_id === params.client_id);
            // const update = await axios.put(`http://localhost:3004/api/users:${params.id}`,params)
            // console.log(update);
            const update = await axios.put(`http://localhost:3004/api/client/${params.client_id}`, params);
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
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
            // console.log(update);
        }
        // const update = await axios.put(`http://localhost:3004/api/client/${params.id}`,params)
        // console.log(update , "update >>>>>>>>>>>>>>>>>>>");
        setViewContactModal(false);
        setAddContactModal(true);
    };

    const deleteUser = async (user: any = null) => {
        // setFilteredItems(filteredItems.filter((d: any) => d.id !== user.id));
        await axios.delete(`http://localhost:3004/api/client/${user.client_id}`);
        showMessage('client has been deleted successfully.');
    };

    const ViewUser = async (user: any = null) => {
        // await axios.get(`http://localhost:3004/api/client/${user.client_id}`);
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
                <h2 className="text-xl">Client</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => editUser()}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Documents
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
                                    <th>Driver Name</th>
                                    <th>Documnet type</th>
                                    <th>Documnet numbar</th>
                                    <th>issue Date</th>
                                    <th>Expired Date</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((contact: any) => {
                                    return (
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
                                                    <div>{contact.driver.name}</div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap">{contact.documentType}</td>
                                            <td className="whitespace-nowrap">{contact.documentNumber}</td>
                                            {/* <td className="whitespace-nowrap">{contact.Issue_date}</td> */}
                                            <td className="whitespace-nowrap">{`${(new Date(contact.Issue_date)).getFullYear().toString()}-${(new Date(contact.Issue_date)).getMonth() + 1}-${(new Date(contact.Issue_date)).getDate().toString().padStart(2, '0')}`}</td>
                                            <td className="whitespace-nowrap">{`${(new Date(contact.Expired_date)).getFullYear().toString().slice()}-${(new Date(contact.Expired_date)).getMonth() + 1}-${(new Date(contact.Expired_date)).getDate().toString().padStart(2, '0')}`}</td>
                                            {/* <td className="whitespace-nowrap">{contact.Expired_date}</td> */}
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
                                        {params.client ? 'Edit Contact' : 'Add Contact'}
                                    </div>
                                    <div className="p-5">
                                        <form>
                                            <div className="mb-5">
                                                <label htmlFor="name">Driver name</label>
                                                <input id="name" type="text" placeholder="Enter  Name" className="form-input" value={params.name} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="contactNumber">contact Number</label>
                                                <input
                                                    id="contactNumber"
                                                    type="number"
                                                    placeholder="Enter Contact Number"
                                                    className="form-input"
                                                    value={params.contactNumber}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="whatsappNumber">whatsappNumber</label>
                                                <input
                                                    id="whatsappNumber"
                                                    type="number"
                                                    placeholder="Enter Whatapp  Number"
                                                    className="form-input"
                                                    value={params.whatsappNumber}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="number">Email</label>
                                                <input id="email" type="email" placeholder="Enter Email" className="form-input" value={params.email} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="address">Address</label>
                                                <textarea
                                                    id="address1"
                                                    rows={3}
                                                    placeholder="Enter Address"
                                                    className="form-textarea resize-none min-h-[130px]"
                                                    value={params.address}
                                                    onChange={(e) => changeValue(e)}
                                                ></textarea>
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="address1">Address2</label>
                                                <textarea
                                                    id="address1"
                                                    rows={3}
                                                    placeholder="Enter Address"
                                                    className="form-textarea resize-none min-h-[130px]"
                                                    value={params.address}
                                                    onChange={(e) => changeValue(e)}
                                                ></textarea>
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="occupation">city1</label>
                                                <input id="city" type="text" placeholder="Enter City Name" className="form-input" value={params.city1} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="occupation">postal_code</label>
                                                <input id="postal_code" type="postal_code" placeholder="" className="form-input" value={params.postal_code} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="state">state</label>
                                                <input id="state" type="text" placeholder="Enter State" className="form-input" value={params.state} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="occupation">country</label>
                                                <input id="country" type="text" placeholder="Enter Country" className="country" value={params.country} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="truckType">truckType</label>
                                                <input id="truckType" type="text" placeholder="Enter Country" className="country" value={params.truckType} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="passportNumber">passport Number</label>
                                                <input id="passportNumber" type="text" placeholder="Enter Country" className="country" value={params.passportNumber} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="idCardNumber">id Card Number</label>
                                                <input id="idCardNumber" type="text" placeholder="Enter Country" className="country" value={params.idCardNumber} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="idCardExpiryDate">id Card Expiry Date</label>
                                                <input
                                                    id="idCardExpiryDate"
                                                    type="date"
                                                    placeholder="Enter Country"
                                                    className="country"
                                                    value={params.idCardExpiryDate}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="drivingLicenseNumber">driving License Number</label>
                                                <input
                                                    id="drivingLicenseNumber"
                                                    type="date"
                                                    placeholder="Enter drivingLicenseNumber"
                                                    className="country"
                                                    value={params.drivingLicenseNumber}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="drivingLicenseExpiryDate">driving LicenseExpiry Date</label>
                                                <input
                                                    id="drivingLicenseExpiryDate"
                                                    type="number"
                                                    placeholder="Enter driving License ExpiryDate"
                                                    className="country"
                                                    value={params.drivingLicenseExpiryDate}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="truckNumber">truck Number</label>
                                                <input id="truckNumber" type="text" placeholder="Enter truck Number" className="country" value={params.truckNumber} onChange={(e) => changeValue(e)} />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="truckExpiryDate">truck Expiry Date</label>
                                                <input
                                                    id="truckExpiryDate"
                                                    type="date"
                                                    placeholder="Enter truck Expiry Date"
                                                    className="country"
                                                    value={params.truckExpiryDate}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="idCardExpiryDate">idCardExpiryDate</label>
                                                <input
                                                    id="idCardExpiryDate"
                                                    type="date"
                                                    placeholder="Enter Country"
                                                    className="country"
                                                    value={params.idCardExpiryDate}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5">
                                                <label htmlFor="status">status</label>
                                                <input id="status" type="text" placeholder="Enter staus" className="form-input" value="active" onChange={(e) => changeValue(e)} />
                                            </div>

                                            {!viewContactModal && (
                                                <div className="flex justify-end items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                        Cancel
                                                    </button>
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveUser}>
                                                        {params.driver_id ? 'Update' : 'Add'}
                                                    </button>
                                                </div>
                                            )}

                                            {/* <div className="flex justify-end items-center mt-8">
                                                <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={saveUser}>
                                                    {params.client_id ? 'Update' : 'Add'}
                                                </button>
                                            </div> */}
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

export default UpdateDocuments1;
