import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
//create group

export const createGroup = async (req: Request, res: Response) => {
  try {
    const memberDetails = req.body.userId;
    const id = req.body.id;

    let groupMembers = [];
    let resp = [];
    for (let ele of memberDetails) {
      groupMembers.push(ele);
    }
    /*
    valiadating owner with member
    owner should not be member
     */
    let data = groupMembers.filter((element, index) => {
      return element.id == id;
    });

    /*
    creating new group 
    if userCount is greater than 2
    and if owner is not a member
    */
    if (groupMembers.length >= 2 && data.length < 1) {
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
      resp.push("unable to create group :criteria does not match ");
    }
    res.send(resp);
  } catch (error) {
    res.send(error);
  }
};
