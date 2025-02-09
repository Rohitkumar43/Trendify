import { rm } from "fs";
import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/product.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../Types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Request, Response, NextFunction, response } from "express";
import { myCache } from "../app.js";


// to create the new product 
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
// cahche wil store its value in th elocalstorage in theformof key valuepair 
// if it has value in the storagethen it will use it from there 
// and there is no use to call the mongoose again and again
let products
if (myCache.has('latest-product')) {
  return products = JSON.parse(myCache.get('latest-product') as string)
} else {
  const products = Product.find({}).sort({ createdAt: -1 }).limit(5);
  myCache.set('latest-product' , JSON.stringify(products))
}
    
    res.status(201).json({
      success: true,
      products
    });
    return;
  }
);


// get all the categories prds 
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


// get all the admin products so that we can search it and in this only pagination 
// will work and all the product get filter acc to tge property 
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

// for the single products 

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


// logic for all of the routing based ont he search and th ecategoreis 
// get all the prd based on the filter and the categories wise 
// here we use the pagination and the sorting and the filtering 


export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;

      const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
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

      // to add the sort of price range and the limit 
      // of pagination as we defined t elimit is 8 
      // and the skip for the no of prd we have to skip for the next page 
      // and similar goes on 

      const productsPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);

      const [products, filteredOnlyProduct] = await Promise.all([
        productsPromise,
        Product.find(baseQuery),
      ]);

      
      const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

      res.status(200).json({
      success: true,
      products,
      totalPage
    });
  }
);
// 