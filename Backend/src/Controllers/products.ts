import { rm } from "fs";
import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/product.js";
import { NewProductRequestBody } from "../Types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Request, Response, NextFunction } from "express";

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res: Response, next: NextFunction) => {
    // console.log('📦 Body:', req.body); // Log incoming body
    // console.log('📸 File:', req.file); // Log uploaded file

    const { name, price, stock, category } = req.body;
    const photos = req.file;

    // ✅ Input Validation

    if (!photos) return next(new ErrorHandler("Please add Photo", 400));
    if (!name || !price || !stock || !category || !photos) {
      // to delete the as wahi par 
      rm(photos.path, () => {
        console.log('pic is deleted ')
      })
      return next(new ErrorHandler("All fields (name, price, stock, category, photos) are required!", 400));
    }

    const formattedCategory = typeof category === 'string' ? category.toLowerCase() : '';

    await Product.create({
      name,
      price,
      stock,
      category: formattedCategory,
      photos: photos.path,
    });

    res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
    return;
  }
);


// ger the latest producty 
export const getLatestProduct = TryCatch(
  async (req, res, next) => {
    const product = Product.find({}).sort({ createdAt: -1 }).limit(5);
    res.status(201).json({
      success: true,
      product
    });
    return;
  }
);


// get all the categories prds 
export const getAllCategoriesProduct = TryCatch(
  async (req, res, next) => {
    const categories = await Product.distinct('category');
    res.status(201).json({
      success: true,
      categories
    });
    return;
  }
);


// get all the admin products so that we can search it and in this only pagination 
// will work and all the product get filter acc to tge property 
export const getAllAdminProduct = TryCatch(
  async (req, res, next) => {
    const product = Product.find({})
    res.status(201).json({
      success: true,
      product
    });
    return;
  }
);

// for the single products 

export const getSingleProduct = TryCatch(
  async (req, res, next) => {
    const product = Product.findById(req.params.id);
    res.status(201).json({
      success: true,
      product
    });
    return;
  }
);

// to update the products 
export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category, description } = req.body;
  const photos = req.file;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));
  // to update the photo 
  if (photos) {
    rm(product.photos!, () => {
      console.log('old pic is deleted ')
    });
    product.photos = photos.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;
  if (description) product.description = description;

  await product.save();


  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
  return;
});


// to deelte the products 
export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));
  // deelte the pic also 
  rm(product.photos!, () => {
    console.log('pic is deleted ')
  });


  await product.deleteOne();
  
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
  return;
});
