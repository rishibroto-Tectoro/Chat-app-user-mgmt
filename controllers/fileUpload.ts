import { NextFunction, Request, Response } from "express";
import appConst from "../constants"
export const fileUpload = async (req: Request,res: Response) => {
    try {
        console.log('File: ',req.file)
        res.status(200).json({status:appConst.STATUS.SUCCESS,response:null,message:null})
    } catch(err:any) {
        console.log(err);
        res.status(400).json({status:appConst.STATUS.FAIL,response:null,message:null})
    }
}

export const fileUploadError = async (err: any, req: Request, res: Response, next: NextFunction) => {
    try {
        if (err) {
            console.log("Error in Upload: ", err.message);
            res.status(400).json({ status:appConst.STATUS.FAIL , message: err.message, response: null });
          }
    } catch(error:any) {
        console.log(error)
        res.status(400).json({ status:appConst.STATUS.FAIL , message: error.message, response: null });
    }
}