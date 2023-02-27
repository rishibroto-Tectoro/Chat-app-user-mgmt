
import { Request, Response } from 'express'
import prisma from '../db'

export async function findGroups(req: Request, res: Response): Promise<any> {

    try {
        if ((req?.body?.skip === 0 || req?.body?.skip) && req.body.take) {
            const resp = await prisma.group.findMany({
                where: req.body.where,
                skip: req.body.skip,
                take: req.body.take
            })
            if (resp.length > 0) {
                res.status(200).json({ status: "SUCCESS", response: resp, message: null })
            }
            else {
                res.status(200).json({ status: "SUCCESS", response: resp, message: "ERRORS.NO_RECORDS_FOUND" })
            }
        }
        else {
            const resp = await prisma.group.findMany({
                where: req.body.where
            })
            if (resp.length > 0) {
                res.status(200).json({ status: "SUCCESS", response: resp, message: null })
            }
            else {
                res.status(200).json({ status: "SUCCESS", response: resp, message: "ERRORS.NO_RECORDS_FOUND" })
            }
        }

    } catch (error: any) {
        console.log(error)
        res.status(400).json({ status: 'FAIL', response: null, message: error.message })
    }
}
