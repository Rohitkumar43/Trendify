import { NextFunction , Request , Response} from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../Types/types.js";


// make the fxb 
export const newUser = async (
    req: Request<{}, {}, NewUserRequestBody>
    , res: Response,
    next: NextFunction
) => {
    // to create the user 
    try {
        const { name, email, photo, gender, _id, dob } = req.body;
        const user = await User.create({
            name,
            email,
            photo,
            gender,
            _id,
            dob: new Date(dob),
        });

        return res.status(201).json({
            success: true,
            message: `Welcome, ${user.name}`,
        });

    } catch (error) {

    }

}