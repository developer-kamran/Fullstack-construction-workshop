import React, { useState } from 'react';
import UpdateOrders from './UpdateOrders';

import { capitalized } from '../utils/getCapitalized';
import { truncateDescription } from '../utils/getDescription';
import { getDays } from '../utils/getDays';

import { OrderProps } from '../graphql/interface';

const Order: React.FC<OrderProps> = ({ service }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className='my-4 p-4 pb-5 bg-white rounded-lg border border-gray-300 transition duration-300 ease-in-out space-y-1'>
      <div className='flex justify-between items-center mb-3'>
        <h2 className='text-lg font-semibold '>📋 Order Details:</h2>
        {service.isCompleted && (
          <span className='text-xl float-right inline-block'>✅</span>
        )}
        {!service.isCompleted && (
          <>
            <button
              onClick={openModal}
              className='text-blue-500 cursor-pointer text-lg font-semibold'
            >
              ✏️
            </button>
            {/* Modal */}
            {isModalOpen && (
              <UpdateOrders
                service={service}
                isOpen={isModalOpen}
                onClose={closeModal}
              />
            )}
          </>
        )}
      </div>

      <p className='text-md text-gray-600 font-semibold'>
        👤 <span className='font-bold'>Customer Name: </span>
        {service.customer.name}
      </p>
      {!service.isCompleted && (
        <p className='text-md text-gray-600'>
          🏠 <span className='font-bold'>Address: </span>
          {service.customer.address}
        </p>
      )}
      <p className='text-md text-gray-600 font-semibold'>
        ⚒️ <span className='font-bold'>Service Type:</span>{' '}
        {capitalized(service.serviceType)}
      </p>
      <p className='text-md text-gray-600 font-semibold'>
        💰 <span className='font-bold'>Cost: </span>${service.cost.toFixed(2)}
      </p>
      {!service.isCompleted && (
        <div>
          <p className='text-md text-gray-600'>
            📄 <span className='font-bold'>Project Description: </span>
            {showFullDescription
              ? service.projectDescription
              : truncateDescription(service.projectDescription)}{' '}
            <button
              onClick={toggleDescription}
              className='text-blue-500 cursor-pointer text-md'
            >
              {showFullDescription ? 'See Less' : 'See More'}
            </button>
          </p>
        </div>
      )}
      <p className='text-md text-gray-600 font-semibold mb-6 flex items-center gap-x-2'>
        📅{' '}
        {service.isCompleted ? (
          <span className='font-bold'>Completed on:</span>
        ) : (
          <span className='font-bold'>Completion Due Date:</span>
        )}
        {service.expectedCompletionDate}{' '}
        {!service.isCompleted && (
          <small className='hidden sm:inline'>
            {' '}
            ({getDays(
              new Date(Date.parse(service.expectedCompletionDate))
            )}{' '}
            days remaining)
          </small>
        )}
      </p>
    </div>
  );
};

export default Order;
