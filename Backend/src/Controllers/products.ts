import { rm } from "fs";
import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/product.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../Types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Request, Response, NextFunction } from "express";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/feature.js";

// Create new product
export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res: Response, next: NextFunction) => {
    const { name, price, stock, category, description } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(new ErrorHandler("Please add at least one photo", 400));
    }

    if (!name || !price || !stock || !category || !description) {
      // Delete uploaded files if validation fails
      files.forEach(file => {
        rm(file.path, () => {
          console.log('Deleted file:', file.path);
        });
      });
      return next(new ErrorHandler("All fields are required!", 400));
    }

    const photoPaths = files.map(file => file.path);
    const formattedCategory = typeof category === 'string' ? category.toLowerCase() : '';

    await Product.create({
      name,
      price,
      stock,
      category: formattedCategory,
      photos: photoPaths,
      description
    });

    await invalidateCache({ product: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);

// Get all products (public)
export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProducts] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const totalPages = Math.ceil(filteredOnlyProducts.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPages,
    });
  }
);

// Get all products (admin)
export const getAdminProducts = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  
  console.log("Admin Products Request - User ID:", id);
  console.log("Request params:", req.params);
  console.log("Request query:", req.query);
  
  if (!id) {
    return next(new ErrorHandler("Please provide user ID", 400));
  }

  let products;
  
  if (myCache.has("admin-products"))
    products = JSON.parse(myCache.get("admin-products") as string);
  else {
    products = await Product.find({}).sort({ createdAt: -1 });
    myCache.set("admin-products", JSON.stringify(products));
  }

  console.log("Sending response with products:", products.length);
  return res.status(200).json({
    success: true,
    products,
  });
});

// Get latest products
export const getLatestProduct = TryCatch(
  async (req, res, next) => {
    let products;
    if (myCache.has('latest-product')) {
      products = JSON.parse(myCache.get('latest-product') as string)
    } else {
      const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
      myCache.set('latest-product', JSON.stringify(products))
    }
    
    res.status(201).json({
      success: true,
      products
    });
    return;
  }
);

// Get all categories products
export const getAllCategoriesProduct = TryCatch(
  async (req, res, next) => {

    let categories;

    if (myCache.has('all-categories')) {
      categories = JSON.parse(myCache.get('all-categories') as string);
    } else {
      categories = await Product.distinct('category');
      myCache.set('all-categories', JSON.stringify(categories));
    }

    res.status(201).json({
      success: true,
      categories
    });
    return;
  }
);

// Get all admin products
export const getAllAdminProduct = TryCatch(
  async (req, res, next) => {
    let products;

    if (myCache.has('all-admin-products')) {
      products = JSON.parse(myCache.get('all-admin-products') as string);
    } else {
      products = await Product.find({});
      myCache.set('all-admin-products', JSON.stringify(products));
    }
    res.status(201).json({
      success: true,
      products
    });
    return;
  }
);

// Get single product
export const getSingleProduct = TryCatch(
  async (req, res, next) => {
    const productId = req.params.id
    let product;
    // here we will check if the product is in the cache or not 
    // if it is in the cache then we will use it from the cache 
    // if it is not in the cache then we will use it from the database 
    // and then we will store it in the cache 
    if (myCache.has(`product-${productId}`)) {
      product = JSON.parse(myCache.get(`product-${productId}`) as string);
    } else {
      product = await Product.findById(productId);
      if (!product) {
         res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      myCache.set(`product-${productId}`, JSON.stringify(product));
    }
    res.status(201).json({
      success: true,
      product
    });
    return;
  }
);

// Update product
export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category, description } = req.body;
  const files = req.files as Express.Multer.File[];

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  // Update photos
  if (files) {
    // Delete old photos
    product.photos.forEach(photo => {
      rm(photo, () => {
        console.log('Old photo deleted:', photo);
      });
    });
    // Add new photos
    const newPhotos = files.map(file => file.path);
    product.photos = newPhotos;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;
  if (description) product.description = description;

  await product.save();

  await invalidateCache({ product: true, productId: String(product._id), admin: true });

  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
  return;
});

// Delete product
export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  // Delete photos
  product.photos.forEach(photo => {
    rm(photo, () => {
      console.log('Photo deleted:', photo);
    });
  });

  await product.deleteOne();

  await invalidateCache({ product: true, productId: String(product._id), admin: true });

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
  return;
});