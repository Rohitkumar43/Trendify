import { FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/productAPI";
import { RootState } from "../../../redux/store";
import { Skeleton } from "../../../components/loader";
import { responseToast } from "../../../utils/feature";

const Productmanagement = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const params = useParams();
  const navigate = useNavigate();

  if (!params.id) {
    navigate("/admin/product");
    return null;
  }

  const { data, isLoading, error } = useProductDetailsQuery(params.id as string);

  const [nameUpdate, setNameUpdate] = useState<string>("");
  const [priceUpdate, setPriceUpdate] = useState<number>(0);
  const [stockUpdate, setStockUpdate] = useState<number>(0);
  const [photoUpdate, setPhotoUpdate] = useState<string[]>([]);

  useEffect(() => {
    if (data?.product) {
      setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setPhotoUpdate(data.product.photos.map((photo: any) => photo.url));
    }
  }, [data]);

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?._id) {
      responseToast("Please login first", false);
      return;
    }

    const formData = new FormData();
    formData.set("name", nameUpdate);
    formData.set("price", priceUpdate.toString());
    formData.set("stock", stockUpdate.toString());

    try {
      await updateProduct({
        formData,
        userId: user._id,
        productId: params.id!
      }).unwrap();
      responseToast("Product Updated Successfully", true, navigate, "/admin/product");
    } catch (error) {
      responseToast("Error Updating Product", false);
    }
  };

  const deleteHandler = async () => {
    if (!user?._id) {
      responseToast("Please login first", false);
      return;
    }

    try {
      await deleteProduct({
        userId: user._id,
        productId: params.id!
      }).unwrap();
      responseToast("Product Deleted Successfully", true, navigate, "/admin/product");
    } catch (error) {
      responseToast("Error Deleting Product", false);
    }
  };

  if (error) {
    responseToast("Error loading product", false);
    navigate("/admin/product");
    return null;
  }

  if (isLoading) return <Skeleton />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <section>
          <h2>Manage Product</h2>
          <form onSubmit={submitHandler}>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={nameUpdate}
                onChange={(e) => setNameUpdate(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={priceUpdate}
                onChange={(e) => setPriceUpdate(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stockUpdate}
                onChange={(e) => setStockUpdate(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Photos</label>
              <div className="photo-grid">
                {photoUpdate.map((photo, index) => (
                  <img key={index} src={photo} alt={`Product ${index + 1}`} />
                ))}
              </div>
            </div>

            <button type="submit">Update</button>
          </form>
        </section>
        <article>
          <button className="delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
        </article>
      </main>
    </div>
  );
};

export default Productmanagement;
