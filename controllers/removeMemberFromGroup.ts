import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const removeMemberFromGroups = async (req: Request, res: Response) => {
  try {
    let result: any;

    result = await prisma.group.findUnique({
      where: {
        ref: req.body.ref,
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });
    // console.log(result._count.members);

    if (result._count.members >= 2) {
      result = await prisma.group.deleteMany({
        where: {
          ref: req.body.ref,
        },
      });
      res.status(200).json({
        response: "record deleted successfully",
        record: result,
      });
    } else {
      res.send("no member in group to  be delete");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errorResponse: error,
    });
  }
};
