import { NextFunction, Request, Response, Router } from 'express'
const router = Router()
import multer, { MulterError } from 'multer'
import randomstring from 'randomstring';
import path from 'path'
import {fileUpload, fileUploadError} from './controllers/fileUpload'
import * as Controller from './controllers/login'
import * as group from './controllers/group'

export const storage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: any) {
        cb(null, 'uploads/')
    },

    filename: function (req: Request, file: any, cb: any) {
        cb(null, randomstring.generate({charset:"alphanumeric", length: 10})+path.extname(file?.originalname))
    },
})
export const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req: Request, file: any, cb: any) => {
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
            console.log("file", file.mimetype)
            cb(null, true)
        } else {
            cb(null, false)
            return cb(new Error('Only JPEG and PNG files allowed!'))
        }
    },
})
router.post('/testFileUpload',uploadFile.single('file'),fileUpload, fileUploadError)
router.post('/login',Controller.login)
router.post('/signup',Controller.signup)
router.post('/addGroups',group.addGroup)
router.post('/findgroups',group.findGroups )


export default router
