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

const Company = () => {
    const dispatch = useDispatch();
    const [defaultParams] = useState({
        company_name: '',
        city: '',
        state: '',
        pincode: '',
        tax_no: '',
        address1: '',
        address2: '',
        logo: '',
        country: '',
    });
    const [userData, setUserData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<any>(true);

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [viewContactModal, setViewContactModal] = useState<any>(false);
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
        const fetch = async () => {
            const { data } = await axios.get(`${config.API_BASE_URL}/companies`);
            console.log(data.data);

            setUserData(data.data);
            console.log(userData);
        };
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
                return item.business_name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList, userData]);
    contactList = userData;

    const saveUser = async () => {
        if (Object.values(params).some((x) => x === null || x === '')) {
            showMessage('somthing  is missing', 'error');
            return true;
        }

        console.log(params, 'paraams >>>>>>>>>>>>>>>>>');
        if (params.company_id) {
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
            //   searchContacts()
            delete params.id;
            delete params.location;
            // params.params.id = 10000
            params.username = params.phone_number;
            let addUSer = await axios.post(`${config.API_BASE_URL}/companies`, params);
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
        await axios.delete(`${config.API_BASE_URL}/client/${user.client_id}`);
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
    const validationSchema = Yup.object().shape({
        company_name: Yup.string().required('Company Name is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        pincode: Yup.string().required('Pin Code is required'),
        tax_no: Yup.string().required('Tax Number is required'),
        address1: Yup.string().required('Address is required'),
        address2: Yup.string().required('Address is required'),
        logo: Yup.string().required('Logo is required'),
        country: Yup.string().required('Country is required'),
        email: Yup.string().required('Email is required')
    });

    const initialValues = {
        company_name: '',
        city: '',
        state: '',
        pincode: '',
        tax_no: '',
        address1: '',
        address2: '',
        logo: '',
        country: '',
        email:''
    };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            // Handle form submission logic here
            console.log(values);
        },
    });

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Company</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => editUser()}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Company Details
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
                                    <th>Componey Name</th>
                                    <th>contact_person_full_name</th>
                                    <th>type</th>
                                    <th>email</th>
                                    <th>phone</th>
                                    <th>Status</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((contact: any) => {
                                    return (
                                        <tr key={contact.id}>
                                            <td className="whitespace-nowrap">{contact.company_id}</td>
                                            <td className="whitespace-nowrap">{contact.business_name}</td>
                                            <td className="whitespace-nowrap">{contact.contact_person_full_name}</td>
                                            <td className="whitespace-nowrap">{contact.business_type}</td>
                                            <td className="whitespace-nowrap">{contact.email}</td>
                                            <td className="whitespace-nowrap">{contact.phone}</td>
                                            <td className="whitespace-nowrap">{contact.status === 1 ? 'Active' : 'InActive'}</td>
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
                                        <button type="button" className="btn btn-outline-success w-1/2">
                                            View
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
                                        {params.client ? 'Edit Tracking' : 'Add Company'}
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div>
                                                <label htmlFor="routename">Company Name</label>
                                                <input
                                                    id="routename"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.company_name}
                                                    name="company_name"
                                                    type="text"
                                                    placeholder="Enter Componey Name"
                                                    className="form-input"
                                                    required
                                                />
                                                  {formik.touched.company_name && formik.errors.company_name && <div className="text-red-500 text-sm">{formik.errors.company_name}</div>}
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="Address Line-1">Address 1</label>
                                                    <input
                                                        id="routename"
                                                        name="address1"
                                                        type="text"
                                                        placeholder="Enter Address"
                                                        className="form-input"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.address1}
                                                        required
                                                    />
                                                    {formik.touched.address1 && formik.errors.address1 && <div className="text-red-500 text-sm">{formik.errors.address1}</div>}
                                                </div>
                                                <div>
                                                    <label htmlFor="routename">Address 2</label>
                                                    <input
                                                        id="routename"
                                                        name="address2"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.address2}
                                                        type="text"
                                                        placeholder="Enter Address"
                                                        className="form-input"
                                                        required
                                                    />
                                                      {formik.touched.address2 && formik.errors.address2 && <div className="text-red-500 text-sm">{formik.errors.address2}</div>}
                                                </div>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="ctnSelect2"> Country</label>
                                                    <input
                                                        id="ctnSelect1"
                                                        name="country"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.country}
                                                        placeholder="Enter Country"
                                                        className="form-input text-white-dark"
                                                        required
                                                    ></input>
                                                     {formik.touched.country && formik.errors.country && <div className="text-red-500 text-sm">{formik.errors.country}</div>}
                                                </div>
                                                <div>
                                                    <label htmlFor="ctnSelect2"> State </label>
                                                    <input
                                                        id="ctnSelect1"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.state}
                                                        placeholder="Enter State"
                                                        name="state"
                                                        className="form-input text-white-dark"
                                                        required
                                                    ></input>
                                                       {formik.touched.state && formik.errors.state && <div className="text-red-500 text-sm">{formik.errors.state}</div>}
                                                </div>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="ctnSelect2">City</label>
                                                    <input
                                                        id="ctnSelect1"
                                                        name="city"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.city}
                                                        placeholder="Enter City"
                                                        className="form-input text-white-dark"
                                                        required
                                                    ></input>
                                                     {formik.touched.city && formik.errors.city && <div className="text-red-500 text-sm">{formik.errors.city}</div>}
                                                </div>
                                                <div>
                                                    <label htmlFor="ctnSelect2">Pin Code</label>
                                                    <input
                                                        id="ctnSelect1"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.pincode}
                                                        placeholder="Enter Pin Code"
                                                        name="pincode"
                                                        className="form-input text-white-dark"
                                                        required
                                                    ></input>
                                                    {formik.touched.pincode && formik.errors.pincode && <div className="text-red-500 text-sm">{formik.errors.pincode}</div>}
                                                </div>
                                            </div>

                                            <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="routename">Tax Number</label>
                                                    <input
                                                        id="routename"
                                                        name="tax_no"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.tax_no}
                                                        type="number"
                                                        placeholder="Enter Tax Number"
                                                        className="form-input"
                                                        required
                                                    />
                                                    {formik.touched.tax_no && formik.errors.tax_no && <div className="text-red-500 text-sm">{formik.errors.tax_no}</div>}
                                                </div>
                                                <div>
                                                    <label htmlFor="ctnFile">Select LOGO</label>
                                                    <input
                                                        id="ctnFile"
                                                        type="file"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.logo}
                                                        name="logo"
                                                        className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 ltr:file:mr-5 rtl:file-ml-5 file:text-white file:hover:bg-primary"
                                                        required
                                                    />
                                                    {formik.touched.logo && formik.errors.logo && <div className="text-red-500 text-sm">{formik.errors.logo}</div>}
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <label htmlFor="routename">Email </label>
                                                <input
                                                    id="routename"
                                                    name="email"
                                                    type="email"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.email}
                                                    placeholder="Enter Email "
                                                    className="form-input"
                                                    required
                                                />
                                                {formik.touched.email && formik.errors.email && <div className="text-red-500 text-sm">{formik.errors.email}</div>}
                                            </div>

                                         

                                       

                                            {!viewContactModal && (
                                                <div className="flex justify-end items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                        Cancel
                                                    </button>
                                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4" >
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

export default Company;
