import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const removeMemberFromGroups = async (req: any, res: any) => {
  try {
    const body = req.body;
    let result: any;
    const count = await prisma.group.count();

    if (count > 2) {
      result = await prisma.group.deleteMany({
        where: {
          ref: {
            in: req.body.ref,
          },
        },
      });
    } else {
      res.send("no member in group to delete");
    }
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errorResponse: error,
    });
  }
};
