import { ChangeEvent, useState, FormEvent } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { responseToast } from "../../../utils/feature";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const { user } = useSelector((state: RootState) => state.user);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [photos, setPhotos] = useState<File[]>([]);
  const [description, setDescription] = useState<string>("");

  const [newProduct] = useNewProductMutation();
  const navigate = useNavigate();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos(files);
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!name || !price || stock < 0 || !category || !description) {
        setIsLoading(false);
        responseToast(
          { data: { success: false, message: "Please fill all fields" } },
          navigate,
          "/admin/products"
        );
        return;
      }

      if (photos.length === 0) {
        setIsLoading(false);
        responseToast(
          { data: { success: false, message: "Please add at least one photo" } },
          navigate,
          "/admin/products"
        );
        return;
      }

      const formData = new FormData();
      formData.set("name", name);
      formData.set("description", description);
      formData.set("price", price.toString());
      formData.set("stock", stock.toString());
      formData.set("category", category);

      photos.forEach((file) => {
        formData.append("photos", file);
      });

      const res = await newProduct({ id: user?._id!, formData }).unwrap();

      if (res.success) {
        responseToast(
          { data: { success: true, message: res.message } },
          navigate,
          "/admin/products"
        );
      } else {
        responseToast(
          { data: { success: false, message: res.message || "Error creating product" } },
          navigate,
          "/admin/products"
        );
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      responseToast(
        { 
          data: { 
            success: false, 
            message: error.data?.message || "Failed to create product" 
          } 
        },
        navigate,
        "/admin/products"
      );
    }

    setIsLoading(false);
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
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Photos</label>
              <input
                required
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </div>
            {photos.length > 0 && (
              <div className="preview">
                {photos.map((photo, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${index + 1}`}
                  />
                ))}
              </div>
            )}
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;