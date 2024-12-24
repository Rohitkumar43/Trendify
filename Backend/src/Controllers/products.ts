import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/product.js";
import { NewProductRequestBody } from "../Types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Request } from "express";

export const newProduct = TryCatch(
    async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
      const { name, price, stock, category } = req.body;
      const photos = req.file;
    //   const photos = req.files as Express.Multer.File[] | undefined;
  
    //   if (!photos) return next(new ErrorHandler("Please add Photo", 400));
  
    //   if (photos.length < 1)
    //     return next(new ErrorHandler("Please add atleast one Photo", 400));
  
    //   if (photos.length > 5)
    //     return next(new ErrorHandler("You can only upload 5 Photos", 400));
  
    //   if (!name || !price || !stock || !category || !description)
    //     return next(new ErrorHandler("Please enter All Fields", 400));
  
      // Upload Here
  
      //const photosURL = await uploadToCloudinary(photos);
  
      await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photos: photos?.path
      });
  
     // await invalidateCache({ product: true, admin: true });
  
        res.status(201).json({
        success: true,
        message: "Product Created Successfully",
      });
      return;
    }
  );