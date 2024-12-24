// import multer from "multer";

// const storage = multer.diskStorage({
//     destination(req, file, callback) {
//         callback(null , './uploads')
//     },
//     filename(req, file, callback) {
//         callback(null , file.originalname)
//     },
// })

// export const singlePicUpload = multer({storage}).single('photos');


import multer from "multer";
import path from "path";
import {v4 as uuid} from 'uuid'

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './uploads'); // Ensure this folder exists
  },
  filename(req, file, callback) {

    const id = uuid();
    const extname = file.originalname.split('.').pop();
    const filename = `${id}.${extname}`
    callback(null, filename);
  },
});



// Middleware for Single File Upload
export const singlePicUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
}).single('photos');
