import { ReactElement } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import { RootState } from "../../redux/store";
import { Skeleton } from "../../components/loader";
import { Product } from "../../types/api-types";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { data, isLoading, isError } = useAllProductsQuery(user?._id || "");

  if (isLoading) return <Skeleton />;
  if (isError) return <div>Error loading products</div>;

  const rows = data?.products.map((product: Product) => ({
    photo: <img src={product.photos[0].url} alt={product.name} />,
    name: product.name,
    price: product.price,
    stock: product.stock,
    action: <Link to={`/admin/product/${product._id}`}>Manage</Link>,
  })) || [];

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    true
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main><Table /></main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
