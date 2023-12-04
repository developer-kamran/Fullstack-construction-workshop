import React, { useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { GET_ORDERED_SERVICES } from '../graphql/queries';
import { GET_CUSTOMERS } from '../graphql/queries';
import { CREATE_CUSTOMER } from '../graphql/mutations';
import { CREATE_SERVICE } from '../graphql/mutations';

import { Customer } from '../graphql/interface';
import serviceOptions from '../utils/getServices';

const Mutations = () => {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const [serviceData, setServiceData] = useState({
    customer: '',
    serviceType: '',
    cost: '',
    projectDescription: '',
    expectedCompletionDate: '',
  });

  const handleCustomerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCustomerData({
      ...customerData,
      [name]: value,
    });
  };

  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServiceData({
      ...serviceData,
      [name]: value,
    });
  };

  const handleServiceSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setServiceData({
      ...serviceData,
      [name]: value,
    });
  };

  const handleServiceTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setServiceData({
      ...serviceData,
      [name]: value,
    });
  };

  const [createCustomer, { loading: customerLoading, error: customerError }] =
    useMutation(CREATE_CUSTOMER, {
      refetchQueries: [{ query: GET_CUSTOMERS }],
    });

  const addCustomer = async (e: any) => {
    e.preventDefault();
    const { name, email, phoneNumber, address } = customerData;

    try {
      if (!name && !email && !phoneNumber && !address) {
        alert('Please fill the required fields!');
      } else {
        await createCustomer({
          variables: { name, email, phoneNumber, address },
        });

        // Reset form fields
        setCustomerData({
          name: '',
          email: '',
          phoneNumber: '',
          address: '',
        });
        alert('Customer added successfully!');
      }
    } catch (error) {
      alert(`An error occurred: ${error}`);
    }
  };

  const { data: customersData } = useQuery(GET_CUSTOMERS);

  const customers: Customer[] = customersData?.allCustomers || [];

  const [createService, { loading: serviceLoading, error: serviceError }] =
    useMutation(CREATE_SERVICE, {
      refetchQueries: [{ query: GET_ORDERED_SERVICES }],
    });

  const addService = async (e: any) => {
    try {
      const {
        customer,
        serviceType,
        cost,
        projectDescription,
        expectedCompletionDate,
      } = serviceData;

      if (
        !serviceType ||
        !cost ||
        !projectDescription ||
        !expectedCompletionDate ||
        !customer
      ) {
        alert('Please fill out all fields and select a customer.');
      } else {
        await createService({
          variables: {
            customer, // Customer ID
            serviceType,
            cost: parseFloat(cost), // Parse cost to a number if needed.
            projectDescription,
            expectedCompletionDate,
          },
        });

        // Reset form fields
        setServiceData({
          serviceType: '',
          cost: '',
          projectDescription: '',
          expectedCompletionDate: '',
          customer: '', // Reset customer to an empty value
        });

        alert('Service added successfully!');
      }
    } catch (error) {
      alert(`An error occurred: ${error}`);
    }
  };
  return (
    <div className='bg-white p-4 shadow-md rounded-md flex-1'>
      <h2 className='text-2xl font-semibold mb-8'>Services Management</h2>
      <div className='flex flex-col space-y-4'>
        <div className='flex flex-col space-y-3'>
          <select
            name='customer'
            value={serviceData.customer}
            onChange={handleServiceSelectChange}
            className='border-opacity-50 transition duration-300 focus:ring focus:ring-blue-400 focus:ring-opacity-50 focus:border-blue-500 focus:border-opacity-100 outline-none py-2 px-4 border rounded focus:border-none'
            required
          >
            <option value=''>Select a Customer</option>

            {customers &&
              customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
          </select>
          <select
            name='serviceType'
            value={serviceData.serviceType}
            onChange={handleServiceSelectChange}
            className='border-opacity-50 transition duration-300 focus:ring focus:ring-blue-400 focus:ring-opacity-50 focus:border-blue-500 focus:border-opacity-100 outline-none py-2 px-4 border rounded focus:border-none'
            required
          >
            <option value=''>Select a Service Type</option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type='text'
            name='cost'
            placeholder='Cost'
            value={serviceData.cost}
            onChange={handleServiceInputChange}
            className='border-opacity-50 transition duration-300 focus:ring focus:ring-blue-400 focus:ring-opacity-50 focus:border-blue-500 focus:border-opacity-100 outline-none py-2 px-4 border rounded focus:border-none '
            required
          />
          <textarea
            name='projectDescription'
            placeholder='Project Description'
            value={serviceData.projectDescription}
            onChange={handleServiceTextareaChange}
            className='border-opacity-50 transition duration-300 focus:ring focus:ring-blue-400 focus:ring-opacity-50 focus:border-blue-500 focus:border-opacity-100 outline-none py-2 px-4 border rounded focus:border-none '
            required
          />
          <input
            type='date'
            name='expectedCompletionDate'
            placeholder='Expected Completion Date'
            value={serviceData.expectedCompletionDate || ''}
            onChange={handleServiceInputChange}
            className='border-opacity-50 transition duration-300 focus:ring focus:ring-blue-400 focus:ring-opacity-50 focus:border-blue-500 focus:border-opacity-100 outline-none py-2 px-4 mb-8 border focus:border-none rounded'
            required
          />
          <button
            className='bg-blue-500 text-white block font-semibold py-2 px-4  rounded hover:bg-blue-600 transition duration-300 ease-in-out'
            onClick={addService}
            disabled={serviceLoading ? true : false}
          >
            ➤ Add Service
          </button>
        </div>

        <hr className='bg-pink-500' />

        <div className='flex flex-col space-y-3 '>
          <input
            type='text'
            name='name'
            placeholder='Customer Name'
            value={customerData.name}
            onChange={handleCustomerInputChange}
            className='border-opacity-50 transition duration-300 focus:ring focus:ring-blue-400 focus:ring-opacity-50 focus:border-blue-500 focus:border-opacity-100 outline-none py-2 px-4 border rounded focus:border-none '
            required
          />
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={customerData.email}
            onChange={handleCustomerInputChange}
            className='border-opacity-50 transition duration-300 focus:ring focus:ring-blue-400 focus:ring-opacity-50 focus:border-blue-500 focus:border-opacity-100 outline-none py-2 px-4 border rounded focus:border-none '
            required
          />
          <input
            type='text'
            name='phoneNumber'
            placeholder='Phone No'
            value={customerData.phoneNumber}
            onChange={handleCustomerInputChange}
            className='border-opacity-50 transition duration-300 focus:ring focus:ring-blue-400 focus:ring-opacity-50 focus:border-blue-500 focus:border-opacity-100 outline-none py-2 px-4 border rounded focus:border-none '
            required
          />
          <input
            type='text'
            name='address'
            placeholder='Address'
            value={customerData.address}
            onChange={handleCustomerInputChange}
            className='outline-none py-2 px-4 rounded border-opacity-50 transition duration-300 focus:ring focus:ring-blue-400 focus:ring-opacity-50 focus:border-blue-500 focus:border-opacity-100 outline-none py-2 px-4 border rounded focus:border-none'
            required
          />
          <button
            className='bg-green-500 block text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-300 ease-in-out '
            onClick={addCustomer}
            disabled={customerLoading ? true : false}
          >
            ➤ Add Customer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mutations;
