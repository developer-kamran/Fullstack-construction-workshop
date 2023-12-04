export interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface OrderProps {
  service: {
    id: number;
    customer: {
      name: string;
      address: string;
    };
    serviceType: string;
    cost: number;
    projectDescription: string;
    expectedCompletionDate: string;
    isCompleted: boolean;
  };
}

export interface Service {
  id: number;
  serviceType: string;
  cost: number;
  projectDescription: string;
  orderDate: string;
  expectedCompletionDate: string;
  isCompleted: boolean;
  customer: Customer;
}

export interface UpdateService {
  id: number;
  serviceType: string;
  isCompleted: boolean;
  cost: number;
  expectedCompletionDate: string;
}

export interface UpdateServiceProps {
  service: UpdateService;
  isOpen: boolean;
  onClose: () => void;
}

export interface StatisticsProps {
  showCompletedOrders: boolean;
  toggleCompletedOrders: () => void;
  orderedServicesLength: number;
  completedServicesLength: number;
  totalEarning: number;
}
