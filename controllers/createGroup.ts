import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  try {
    let userDetails = req.body.userDetails;
    // const resp=await prisma.user.createMany(group)
    const user = await prisma.user.createMany({
      data: [...userDetails],
    });
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};

//create group

export const createGroup = async (req: Request, res: Response) => {
  try {
    const memberDetails = req.body.userId;

    let arr = [];
    let ownerIsMember: any[] = [];
    let resp = [];
    for (let index = 0; index < memberDetails.length; index++) {
      const element = memberDetails[index];
      arr.push(element.id);
    }
    /*
    valiadating owner with member
    owner should not be member
     */
    arr.map((elment) => {
      if (elment === req.body.id) {
        ownerIsMember.push(elment);
      }
    });

    /*
    creating new group 
    if userCount is greater than 2
    and if owner is not a member
    */
    if ((await prisma.user.count()) >= 2 && ownerIsMember.length === 0) {
      const group = await prisma.group.create({
        data: {
          ref: req.body.ref,
          name: req.body.name,
          members: {
            connect: [...memberDetails],
          },
          Owner: {
            connect: {
              id: req.body.id,
            },
          },
        },
      });
      resp.push(group);
    } else {
      resp.push("owner shoud not be a member");
    }
    res.send(resp);
  } catch (error) {
    res.send(error);
  }
};
