
import { Link } from "react-router-dom";
import { FaExpandAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { CartItem } from "../types/types";

type ProductsProps = {
  productId: string;
  photo: {
    url: string;
    public_id: string;
  }[];
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const server = 'sdbsdbv';

const ProductCard = ({
    productId,
    price,
    name,
    photo,
    stock,
    handler,
  }: ProductsProps) => {
    return (
      <div className="product-card">
        <img src={`${server} ${photo}`} alt={name} />
        <p>{name}</p>
        <span>₹{price}</span>
  
        <div>
          <button
            onClick={() =>
              handler({ productId, name, price, photo, stock })
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
