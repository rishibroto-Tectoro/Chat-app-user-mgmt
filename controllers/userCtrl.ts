import { Request, Response } from 'express'
import appConst from "../constants"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const getAllUser = async (req: Request, res: Response) => {
    try {
        let data:any = await prisma.user.findMany({
            skip: (req.body.skip - 1) * req.body.take, take: req.body.take,
            where: req.body.where
            , include: { groupOwned: true }
        });
        res.status(200).json({ status:appConst.STATUS.SUCCESS , response: data, message: null });

    } catch (err: any) {
        console.log("error",err)
        res.status(400).json({ status:appConst.STATUS.FAIL, message: err.message, response: null });
    }
}

export async function updateGroup(req: Request, res: Response):Promise<any> {
 
    try {
        let data:any = await prisma.group.update({ where:  req.body.where , data: req.body.updateValue })
        res.status(200).json({ status: appConst.STATUS.SUCCESS, response: data, message: null });
    } catch (err: any) {
        console.log("err",err)
        res.status(400).json({ status: appConst.STATUS.FAIL, message: err.message, response: null });
    }
}



