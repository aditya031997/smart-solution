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

const Country = () => {
    const dispatch = useDispatch();
    const [defaultParams] = useState({
        country_name: '',
    });
    const [userData, setUserData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<any>(true);

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [editContactModal, seteditContactModal] = useState<any>(false);
    const [countryData, setCountryData] = useState<any>(false);
    const [viewContactModal, setViewContactModal] = useState<any>(false);
    const [viewMode, setViewMode] = useState(false);

    const fetchCountryData = async () => {
        try {
            const { data } = await axios.get(`${config.API_BASE_URL}/location/countries`);
            return data;
        } catch (error) {
            console.error('Error fetching country data:', error);
            throw error;
        }
    };
    useEffect(() => {
        dispatch(setPageTitle('Contacts'));
        const fetch = async () => {
            try {
                const countryData = await fetchCountryData();
                setUserData(countryData);
            } catch (error) {
                console.log(error);
            }
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
                return item.country_name.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, contactList, userData]);
    contactList = userData;

    const editUser = async (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
            formik.setValues(json1);
        }
        setViewContactModal(false);
        setAddContactModal(true);
    };

    const viewUser = async (user: any = null) => {
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

    const editCountry = async (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        setViewMode(false);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
            formik.setValues(json1);
        }
        setViewContactModal(false);
        setAddContactModal(true);
    };

    const deleteCountry = async (country: any = null) => {
        await axios.delete(`${config.API_BASE_URL}/location/countrie/${country.country_id}`);
        showMessage('Country has been deleted successfully.');
        const countryData = await fetchCountryData();
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
        country_name: Yup.string().required('Country Name is required'),
    });

    const initialValues = {
        country_name: '',
    };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (params.country_id) {
                    const response = await axios.put(`${config.API_BASE_URL}/location/countrie/${params.country_id}`, values);
                    if (response.status === 200 || response.status === 204) {
                        showMessage(`Country updated`);
                        formik.resetForm();
                        setAddContactModal(false);
                    }
                } else {
                    let Data = await axios.post(`${config.API_BASE_URL}/location/countries`, values);
                    if (Data.status === 201) {
                        showMessage(`Country created`);
                        formik.resetForm();
                        setAddContactModal(false);
                    }
                    formik.resetForm();
                    setAddContactModal(false);
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

    const handleCloseModal = () => {
        setAddContactModal(false);
        formik.resetForm();
    };
    const addcountry = async (user: any = null) => {
        formik.setValues(initialValues); // Set the initial values
        formik.resetForm({}); // Reset errors
        setAddContactModal(true);
        setParams(initialValues);
        setViewMode(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Country</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <button type="button" className="btn btn-primary" onClick={() => addcountry()}>
                                <IconUserPlus className="ltr:mr-2 rtl:ml-2" />
                                Add Country
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
                                    <th>Country Name</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((contact: any) => {
                                    return (
                                        <tr key={contact.id}>
                                            <td className="whitespace-nowrap">{contact.country_id}</td>
                                            <td className="whitespace-nowrap">{contact.country_name}</td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => viewUser(contact)}>
                                                        view
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editCountry(contact)}>
                                                        Edit
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteCountry(contact)}>
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
                                        {viewMode ? 'Country Details' : params.country_id ? 'Edit Country' : 'Add Country'}
                                    </div>
                                    <div className="p-5">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="mt-4">
                                                <label htmlFor="country_name">Country Name</label>
                                                <input
                                                    id="countryname"
                                                    type="text"
                                                    name="country_name"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.country_name}
                                                    placeholder="Enter Country Name"
                                                    className="form-input"
                                                    required
                                                    disabled={viewMode}
                                                    // readOnly={viewMode} // Set readOnly attribute if viewing
                                                />

                                                {formik.touched.country_name && formik.errors.country_name && <div className="text-red-500 text-sm">{formik.errors.country_name}</div>}
                                            </div>

                                            {!viewContactModal && !viewMode && (
                                                <div className="flex justify-end items-center mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setAddContactModal(false)}>
                                                        Cancel
                                                    </button>

                                                    {params.country_id ? ( // Check if params.vehicle_id exists
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

export default Country;
