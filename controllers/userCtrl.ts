import { Request, Response } from 'express'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const getAllUser = async (req: Request, res: Response) => {
    try {
        const data = await prisma.user.findMany({
            skip: (req.body.skip - 1) * req.body.take, take: req.body.take,
            where: req.body.where
            , include: { groupOwned: true }
        });
        res.status(200).json({ status: "Success", response: data, message: null });

    } catch (err: any) {
        res.status(400).json({ status: "Failed", message: err.message, response: null });
    }
}

export const updateGroup = async (req: Request, res: Response) => {
    try {
        const data = await prisma.group.update({ where: { id: req.body.id }, data: req.body })
        res.status(200).json({ status: "Success", response: data, message: null });
    } catch (err: any) {
        res.status(400).json({ status: "Failed", message: err.message, response: null });
    }
}



