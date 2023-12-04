import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useMutation } from '@apollo/client';

import { UpdateServiceProps, UpdateService } from '../graphql/interface';
import {
  GET_ORDERED_SERVICES,
  GET_COMPLETED_SERVICES,
} from '../graphql/queries';
import { UPDATE_SERVICE } from '../graphql/mutations';

import { capitalized } from '../utils/getCapitalized';
import { today, getDays } from '../utils/getDays';

const UpdateOrders: React.FC<UpdateServiceProps> = ({
  service,
  isOpen,
  onClose,
}) => {
  const [updatedService, setUpdatedService] = useState<UpdateService>({
    ...service,
  });
  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setUpdatedService({
        ...updatedService,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (name === 'cost') {
      // Handle non-numeric values and empty strings
      const parsedValue = parseFloat(value);
      setUpdatedService({
        ...updatedService,
        [name]: isNaN(parsedValue) ? 0 : parsedValue,
      });
    } else if (name === 'expectedCompletionDate') {
      // Handle empty date input
      setUpdatedService({
        ...updatedService,
        [name]: value || 'YYYY-MM-DD', // Set a default date or use your preferred format
      });
    } else {
      setUpdatedService({
        ...updatedService,
        [name]: value,
      });
    }
  };

  const [updateService, { loading: serviceLoading, error: serviceError }] =
    useMutation(UPDATE_SERVICE, {
      refetchQueries: [
        { query: GET_COMPLETED_SERVICES },
        { query: GET_ORDERED_SERVICES },
      ],
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { isCompleted, cost, expectedCompletionDate } = updatedService;
      await updateService({
        variables: {
          id: service.id,
          input: {
            isCompleted,
            cost,
            expectedCompletionDate,
          },
        },
      });

      onClose(); // Close the modal after successful update
      alert('Service Updated Successfully!');
    } catch (error) {
      // Handle error
      alert('Something went wrong while updating the service!' + serviceError);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      {/* Modal Backdrop */}
      <div
        className='absolute inset-0 bg-black opacity-50'
        onClick={onClose}
      ></div>
      <div className='relative w-4/5 md:w-full max-w-md max-h-full'>
        {/* <!-- Modal content --> */}
        <div className='relative bg-white rounded-lg shadow'>
          {/* <!-- Modal header --> */}
          <div className='flex items-start justify-between p-4 border-b rounded-t'>
            <h3 className='text-xl font-semibold text-gray-900'>
              Edit Service
            </h3>
            <button
              type='button'
              className=' bg-transparent rounded-lg w-8 h-8 ml-auto inline-flex justify-center items-center text-md'
              onClick={onClose}
            >
              ❌
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div className='p-6 pr-0 space-y-6'>
            <div className='bg-white'>
              <form onSubmit={handleSubmit}>
                <div>
                  <label className='block text-gray-500 text-md font-semibold mb-2'>
                    Service:
                  </label>
                  <input
                    type='text'
                    name='cost'
                    className='border-opacity-50 transition duration-300 focus:ring focus:ring-blue-400 focus:ring-opacity-50 focus:border-blue-500 focus:border-opacity-100 outline-none py-2 px-4 border rounded focus:border-none border-gray-400 text-gray-600'
                    value={capitalized(updatedService.serviceType)}
                    disabled
                  />
                </div>
                <div className='mt-4'>
                  <label className='block text-gray-700 text-md font-semibold mb-2'>
                    $Cost:
                  </label>
                  <input
                    type='text'
                    name='cost'
                    className='border-opacity-50 transition duration-300 focus:ring focus:ring-blue-400 focus:ring-opacity-50 focus:border-blue-500 focus:border-opacity-100 outline-none py-2 px-4 border rounded focus:border-none border-gray-600'
                    value={updatedService.cost}
                    onChange={handleFieldChange}
                  />
                </div>
                <div className='mt-4'>
                  <label className='block text-gray-700 text-md font-semibold mb-2'>
                    Expected Completion Date:
                  </label>
                  <input
                    type='date'
                    name='expectedCompletionDate'
                    className='border-opacity-50 transition duration-300 focus:ring focus:ring-blue-400 focus:ring-opacity-50 focus:border-blue-500 focus:border-opacity-100 outline-none py-2 px-4 border rounded focus:border-none border-gray-600'
                    value={updatedService.expectedCompletionDate}
                    onChange={handleFieldChange}
                    min={today} // Set the minimum date to today
                  />
                </div>
                {getDays(new Date(updatedService.expectedCompletionDate)) <=
                  1 && (
                  <div className='mt-4 flex items-center'>
                    <label className='block text-gray-700 text-md font-semibold mb-1 mr-3'>
                      Is Completed:
                    </label>
                    <input
                      type='checkbox'
                      name='isCompleted'
                      className='h-5 w-5 appearance-none border border-gray-500 rounded-md  focus:outline-none'
                      checked={updatedService.isCompleted}
                      onChange={handleFieldChange}
                    />
                  </div>
                )}

                {/* <!-- Modal footer --> */}
                <div className='bg-gray-50 px-4 py-3 sm:px-6 space-x-2 text-center sm:ml-32 mt-2'>
                  <button
                    type='submit'
                    className='sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:text-sm '
                  >
                    💾 Save Changes
                  </button>
                  <button
                    type='button'
                    onClick={onClose}
                    className='mt-3 sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:text-sm'
                    disabled={serviceLoading ? true : false}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrders;
