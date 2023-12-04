import { gql } from '@apollo/client';

export const GET_ORDERED_SERVICES = gql`
  query GetOrderedServices {
    orderedServices {
      id
      serviceType
      cost
      projectDescription
      orderDate
      expectedCompletionDate
      isCompleted
      customer {
        name
        address
        email
        phoneNumber
      }
    }
  }
`;

export const GET_COMPLETED_SERVICES = gql`
  query GetCompletedServices {
    completedServices {
      id
      serviceType
      cost
      projectDescription
      orderDate
      expectedCompletionDate
      isCompleted
      customer {
        name
        address
        email
        phoneNumber
      }
    }
  }
`;

export const GET_CUSTOMERS = gql`
  query GetCustomers {
    allCustomers {
      id
      name
      address
      email
      phoneNumber
    }
  }
`;
