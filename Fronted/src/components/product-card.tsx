
import { Link } from "react-router-dom";
import { FaExpandAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

type ProductsProps = {
  productId: string;
  photos: {
    url: string;
    public_id: string;
  }[];
  name: string;
  price: number;
  stock: number;
  //handler: (cartItem: CartItem) => string | undefined;
};

const server = 'sdbsdbv';

const ProductCard = ({
    productId,
    price,
    name,
    photos,
    stock,
    handler,
  }: ProductsProps) => {
    return (
      <div className="product-card">
        <img src={`${server} ${photos}`} alt={name} />
        <p>{name}</p>
        <span>₹{price}</span>
  
        <div>
          <button
            onClick={() =>
              handler()
            }
          >
            <FaPlus />
          </button>
  
          <Link to={`/product/${productId}`}>
            <FaExpandAlt />
          </Link>
        </div>
      </div>
    );
  };

export default  ProductCard
