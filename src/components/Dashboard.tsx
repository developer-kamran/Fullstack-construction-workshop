import React, { useState } from 'react';

import { useQuery } from '@apollo/client';
import { GET_ORDERED_SERVICES } from '../graphql/queries';
import { GET_COMPLETED_SERVICES } from '../graphql/queries';
import { Service } from '../graphql/interface';

import Orders from './Orders';
import Mutations from './Mutations';
import Statistics from './Statistics';

const Dashboard = () => {
  const [showCompletedOrders, setShowCompletedOrders] = useState(false);

  const toggleCompletedOrders = () => {
    setShowCompletedOrders(!showCompletedOrders);
  };

  const {
    loading: orderedServicesLoading,
    error: orderedServicesError,
    data: orderedServicesData,
  } = useQuery(GET_ORDERED_SERVICES);
  const {
    loading: completedServicesLoading,
    error: completedServicesError,
    data: completedServicesData,
  } = useQuery(GET_COMPLETED_SERVICES);

  const orderedServices = orderedServicesData?.orderedServices || [];
  const completedServices = completedServicesData?.completedServices || [];

  const totalEarning = completedServices.reduce(
    (total: any, service: any) => total + (service.cost || 0),
    0
  );

  return (
    <main className='min-h-screen'>
      <div className='text-center w-2/4 m-auto rounded text-2xl mt-5 bg-gray-300 px-2'>
        {(orderedServicesLoading || completedServicesLoading) && (
          <p>Loading... ⏳</p>
        )}
        {(orderedServicesError || completedServicesError) && (
          <p>Something went wrong while fetching the service orders. ❌</p>
        )}
      </div>

      {/* Main Content */}
      <section className='container mx-auto p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 space-y-4 md:space-y-0'>
          {/* Service Orders */}
          <div className='bg-white p-4 shadow-md rounded-md border border-gray-300 '>
            <h2 className='text-2xl font-semibold mb-6'>
              {showCompletedOrders ? '📌 Completed' : '🛠️ Pending Service'}{' '}
              Orders
            </h2>
            {showCompletedOrders
              ? completedServices.map((service: Service, index: number) => (
                  <Orders service={service} key={index} />
                ))
              : orderedServices.map((service: Service, index: number) => (
                  <Orders service={service} key={index} />
                ))}
          </div>

          {/* Mutations */}
          <div className='md:order-first '>
            <Mutations />
          </div>

          {/* Service Statistics */}
          <div className='md:order-2'>
            <Statistics
              showCompletedOrders={showCompletedOrders}
              toggleCompletedOrders={toggleCompletedOrders}
              orderedServicesLength={orderedServices.length}
              completedServicesLength={completedServices.length}
              totalEarning={totalEarning}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
