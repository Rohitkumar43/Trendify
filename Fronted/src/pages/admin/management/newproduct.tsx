import { ChangeEvent, FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import { responseToast } from "../../../utils/feature";
import { RootState } from "../../../redux/store";
import AdminSidebar from "../../../components/admin/AdminSidebar";

const NewProduct = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [photo, setPhoto] = useState<File>();

  const [newProduct] = useNewProductMutation();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?._id) {
      responseToast("Please login first", false);
      return;
    }

    if (!name || !price || !stock || !photo) {
      responseToast("Please fill all fields", false);
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price.toString());
    formData.set("stock", stock.toString());
    formData.set("photo", photo);

    try {
      await newProduct({
        id: user._id,
        formData,
      }).unwrap();
      responseToast("Product Created Successfully", true, navigate, "/admin/product");
    } catch (error) {
      responseToast("Error Creating Product", false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Photo</label>
              <input
                required
                type="file"
                onChange={changeImageHandler}
              />
            </div>

            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;