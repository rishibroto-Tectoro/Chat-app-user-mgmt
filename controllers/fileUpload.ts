import { NextFunction, Request, Response } from "express";

export const fileUpload = async (req: Request,res: Response) => {
    try {
        console.log('File: ',req.file)
    } catch(err:any) {
        console.log(err)
    }
}

export const fileUploadError = async (err: any, req: Request, res: Response, next: NextFunction) => {
    try {
        if (err) {
            console.log("Error in Upload: ", err.message);
            res.json({ status: "FAIL", message: err.message, response: null });
          }
    } catch(error:any) {
        console.log(error)
    }
}