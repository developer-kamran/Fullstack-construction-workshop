import React from 'react';

import { StatisticsProps } from '../graphql/interface';

const Statistics: React.FC<StatisticsProps> = ({
  showCompletedOrders,
  toggleCompletedOrders,
  orderedServicesLength,
  completedServicesLength,
  totalEarning,
}) => {
  const isSmallScreen = window.innerWidth <= 640; // Define your small screen breakpoint

  const handleButtonClick = () => {
    if (isSmallScreen) {
      // Scroll to the top only on small screens
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    toggleCompletedOrders();
  };

  return (
    <div className='bg-white p-4 shadow-md rounded-md flex-1'>
      <h2 className='text-2xl font-semibold mb-6'>📊 Service Statistics</h2>
      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-blue-200 p-4 rounded-md'>
          <h3 className='text-lg font-semibold'>✅ Completed Services</h3>
          <p className='text-3xl font-bold'>{completedServicesLength}</p>
        </div>
        <div className='bg-yellow-200 p-4 rounded-md'>
          <h3 className='text-lg font-semibold'>🚧 Incompleted Services</h3>
          <p className='text-3xl font-bold'>{orderedServicesLength}</p>
        </div>
      </div>
      {/* Display the total earnings */}
      <div className='bg-green-200 p-4 rounded-md mt-6 text-center'>
        <h3 className='text-lg font-semibold'>💰 Total Earning</h3>
        <p className='text-3xl font-bold'>$ {totalEarning.toFixed(2)}</p>
      </div>
      {/* Button for Completed Services */}
      <button
        className='bg-indigo-500 text-white p-2 rounded-lg my-10 w-full text-md md:text-xl'
        onClick={() => handleButtonClick()}
      >
        {showCompletedOrders ? 'Show Pending Orders' : 'Show Completed Orders'}
      </button>
    </div>
  );
};

export default Statistics;
