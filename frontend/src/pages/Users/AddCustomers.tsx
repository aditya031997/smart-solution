import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconHome from '../../components/Icon/IconHome';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconUser from '../../components/Icon/IconUser';
import IconPhone from '../../components/Icon/IconPhone';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconGithub from '../../components/Icon/IconGithub';
import axios from 'axios';

const AddCustomers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Account Setting'));
    });
    const [tabs, setTabs] = useState<string>('home');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };
    const [formData, setFormData] = useState<any>({});
    const formRef : any = useRef(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const { name, value } = e.target;
      setFormData((prevData : any) => ({ ...prevData, }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      // Add your form submission logic here
      formData.Admin_id = 1
      const responce = await axios.post("http://localhost:3004/api/user/customers",JSON.stringify(formData))
      console.log(responce);
      
      console.log('Form submitted with data:', formData);
      formRef.current.reset();
      setFormData("")
    };
    const handleReset = () => {
        formRef.current.reset();
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Customers</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Customers</h5>
                </div>
                <div>
                    <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('home')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'home' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconHome />
                                Home
                            </button>
                        </li>
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('payment-details')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'payment-details' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconDollarSignCircle />
                                Payment Details
                            </button>
                        </li>
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('preferences')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'preferences' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconUser className="w-5 h-5" />
                                Preferences
                            </button>
                        </li>
                        <li className="inline-block">
                            <button
                                onClick={() => toggleTabs('danger-zone')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'danger-zone' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconPhone />
                                Danger Zone
                            </button>
                        </li>
                    </ul>
                </div>
                {tabs === 'home' ? (
                    <div>
                        <form ref={formRef} onSubmit={handleSubmit}  className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
                            <h6 className="text-lg font-bold mb-5">General Information</h6>
                            <div className="flex flex-col sm:flex-row">
                                {/* <div className="ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5">
                                    <img src="/assets//images/profile-34.jpeg" alt="img" className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto" />
                                </div> */}
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="company_name">company name</label>
                                        <input id="company_name" name='company_name'  type="text" placeholder="" className="form-input" onChange={(e)=>{formData.company_name = e.target.value}} />
                                    </div>
                                    <div>
                                        <label htmlFor="contact_person">contact person</label>
                                        <input id="contact_person" name='contact_person'  type="text" placeholder="" className="form-input" onChange={(e)=>{formData.contact_person = e.target.value}} />
                                    </div>

                                    <div>
                                        <label htmlFor="phone_number">phone number</label>
                                        <input id="phone_number" name='phone_number'  type="number" placeholder="" className="form-input" onChange={(e)=>{formData.phone_number = e.target.value}} />
                                    </div>
                                    <div>
                                        <label htmlFor="email">email</label>
                                        <input id="email" name='email'  type="email" placeholder="" className="form-input" onChange={(e)=>{formData.email = e.target.value}} />
                                    </div>

                                    <div>
                                        <label htmlFor="Tax_reg_no">Tax Regsiatrion Number</label>
                                        <input id="Tax_reg_no" name='Tax_reg_no'  type="number" placeholder="" className="form-input" onChange={(e)=>{formData.Tax_reg_no = e.target.value}} />
                                    </div>

                                    <div>
                                        <label htmlFor="address">address</label>
                                        <input id="address" name='address'  type="text" placeholder="" className="form-input" onChange={(e)=>{formData.address = e.target.value}} />
                                    </div>
                                    <div>
                                        <label htmlFor="country">Country</label>
                                        <select name='country'  defaultValue="United States" id="country" className=" onChange={(e)=>{formData.country = e.target.value}}form-select text-white-dark">
                                            <option value="All Countries">All Countries</option>
                                            <option value="United States">United States</option>
                                            <option value="India">India</option>
                                            <option value="Japan">Japan</option>
                                            <option value="China">China</option>
                                            <option value="Brazil">Brazil</option>
                                            <option value="Norway">Norway</option>
                                            <option value="Canada">Canada</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="state">state</label>
                                        <input id="state" name='state'  type="text" placeholder="" className="form-input" onChange={(e)=>{formData.state = e.target.value}} />
                                    </div>
                                    <div>
                                        <label htmlFor="city">city</label>
                                        <input id="city" name='city'  type="text" placeholder="" className="form-input" onChange={(e)=>{formData.city = e.target.value}} />
                                    </div>

                                    <div>
                                        <label htmlFor="address2">address2</label>
                                        <input id="address2" name='address2'  type="text" placeholder="" className="form-input" onChange={(e)=>{formData.address2 = e.target.value}} />
                                    </div>
                                    <div>
                                        <label htmlFor="country2">Country2</label>
                                        <select defaultValue="United States" id="country2" className="form-select text-white-dark">
                                            <option value="All Countries">All Countries</option>
                                            <option value="United States">United States</option>
                                            <option value="India">India</option>
                                            <option value="Japan">Japan</option>
                                            <option value="China">China</option>
                                            <option value="Brazil">Brazil</option>
                                            <option value="Norway">Norway</option>
                                            <option value="Canada">Canada</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="state2">state2</label>
                                        <input id="state2" name='state2'  type="text" placeholder="" className="form-input" onChange={(e)=>{formData.state2 = e.target.value}} />
                                    </div>
                                    <div>
                                        <label htmlFor="city2">city2</label>
                                        <input id="city2" name='city2'  type="text" placeholder="" className="form-input" onChange={(e)=>{formData.city2 = e.target.value}} />
                                    </div>

                                    <div>
                                        <label htmlFor="credit_limit">credit limit</label>
                                        <input id="credit_limit" name='credit_limit'  type="text" placeholder="" className="form-input" onChange={(e)=>{formData.credit_limit = e.target.value}} />
                                    </div>

                                    <div>
                                        <label htmlFor="balance">balance</label>
                                        <input id="balance" name='balance'  type="text" placeholder="" className="form-input" onChange={(e)=>{formData.balance = e.target.value}} />
                                    </div>


                                            <br />
                                    <div className="sm:flex sm:space-x-3 mt-3">
                                        <div className="sm:w-1/2">
                                            <button type="button" onClick={handleReset} className="w-full btn btn-primary">
                                                Reset
                                            </button>
                                        </div>
                                        <div className="sm:w-1/2 mt-3 sm:mt-0">
                                            <button type="submit" className="w-full btn btn-primary">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 bg-white dark:bg-black">
                            <h6 className="text-lg font-bold mb-5">Social</h6>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="flex">
                                    <div className="bg-[#eee] flex justify-center items-center rounded px-3 font-semibold dark:bg-[#1b2e4b] ltr:mr-2 rtl:ml-2">
                                        <IconLinkedin className="w-5 h-5" />
                                    </div>
                                    <input type="text" placeholder="jimmy_turner" className="form-input" />
                                </div>
                                <div className="flex">
                                    <div className="bg-[#eee] flex justify-center items-center rounded px-3 font-semibold dark:bg-[#1b2e4b] ltr:mr-2 rtl:ml-2">
                                        <IconTwitter className="w-5 h-5" />
                                    </div>
                                    <input type="text" placeholder="jimmy_turner" className="form-input" />
                                </div>
                                <div className="flex">
                                    <div className="bg-[#eee] flex justify-center items-center rounded px-3 font-semibold dark:bg-[#1b2e4b] ltr:mr-2 rtl:ml-2">
                                        <IconFacebook className="w-5 h-5" />
                                    </div>
                                    <input type="text" placeholder="jimmy_turner" className="form-input" />
                                </div>
                                <div className="flex">
                                    <div className="bg-[#eee] flex justify-center items-center rounded px-3 font-semibold dark:bg-[#1b2e4b] ltr:mr-2 rtl:ml-2">
                                        <IconGithub />
                                    </div>
                                    <input type="text" placeholder="jimmy_turner" className="form-input" />
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (
                    // coustomers
                    ''
                )}

                {tabs === 'danger-zone' ? (
                    <div className="switch">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="panel space-y-5">
                                <h5 className="font-semibold text-lg mb-4">Purge Cache</h5>
                                <p>Remove the active resource from the cache without waiting for the predetermined cache expiry time.</p>
                                <button className="btn btn-secondary">Clear</button>
                            </div>
                            <div className="panel space-y-5">
                                <h5 className="font-semibold text-lg mb-4">Deactivate Account</h5>
                                <p>You will not be able to receive messages, notifications for up to 24 hours.</p>
                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox7" />
                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>
                            <div className="panel space-y-5">
                                <h5 className="font-semibold text-lg mb-4">Delete Account</h5>
                                <p>Once you delete the account, there is no going back. Please be certain.</p>
                                <button className="btn btn-danger btn-delete-account">Delete my account</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default AddCustomers;
