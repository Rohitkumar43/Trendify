import { FaHeadset, FaShippingFast, FaShieldAlt, FaMoneyBillWave } from "react-icons/fa";
import { ReactElement } from "react";

// Client logos for the "Our Clients" section
export const clients = [
  {
    src: "https://via.placeholder.com/150x50?text=Client+1",
    alt: "Client 1"
  },
  {
    src: "https://via.placeholder.com/150x50?text=Client+2",
    alt: "Client 2"
  },
  {
    src: "https://via.placeholder.com/150x50?text=Client+3",
    alt: "Client 3"
  },
  {
    src: "https://via.placeholder.com/150x50?text=Client+4",
    alt: "Client 4"
  },
  {
    src: "https://via.placeholder.com/150x50?text=Client+5",
    alt: "Client 5"
  }
];

// Service information for the "Our Services" section
export interface Service {
  icon: ReactElement;
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    icon: <FaShippingFast />,
    title: "Fast Shipping",
    description: "Free delivery on orders over ₹1000"
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Support",
    description: "Customer service available round the clock"
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure Payments",
    description: "Multiple secure payment options available"
  },
  {
    icon: <FaMoneyBillWave />,
    title: "Easy Returns",
    description: "Hassle-free return policy within 30 days"
  }
];