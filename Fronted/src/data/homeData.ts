import { FaHeadset, FaShippingFast, FaShieldAlt, FaMoneyBillWave } from "react-icons/fa";
import { ReactElement } from "react";

// Client logos for the "Our Clients" section
export const clients = [
  {
    src: "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253433/client1_zcxuhs.png",
    alt: "Client 1"
  },
  {
    src: "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253433/client2_fxbcqz.png",
    alt: "Client 2"
  },
  {
    src: "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253433/client3_ixhpyq.png",
    alt: "Client 3"
  },
  {
    src: "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253433/client4_wnhcji.png",
    alt: "Client 4"
  },
  {
    src: "https://res.cloudinary.com/dj5q966nb/image/upload/v1719253433/client5_yjnglk.png",
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