import { gql } from '@apollo/client';

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer(
    $name: String!
    $email: String!
    $address: String!
    $phoneNumber: String!
  ) {
    createCustomer(
      name: $name
      email: $email
      address: $address
      phoneNumber: $phoneNumber
    ) {
      customer {
        name
        email
        address
        phoneNumber
      }
    }
  }
`;

export const CREATE_SERVICE = gql`
  mutation CreateService(
    $customer: ID!
    $serviceType: String!
    $cost: Float!
    $projectDescription: String!
    $expectedCompletionDate: Date!
  ) {
    createService(
      customer: $customer
      serviceType: $serviceType
      cost: $cost
      projectDescription: $projectDescription
      expectedCompletionDate: $expectedCompletionDate
    ) {
      service {
        serviceType
        cost
        expectedCompletionDate
      }
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $input: ServiceInput!) {
    updateService(id: $id, input: $input) {
      service {
        id
        isCompleted
        cost
        expectedCompletionDate
      }
    }
  }
`;
