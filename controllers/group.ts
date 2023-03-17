import {Request, Response} from "express";
import prisma from "../db";
import randomstring from "randomstring";

export async function findGroups(req: Request, res: Response): Promise<any> {
  try {
    if ((req?.body?.skip === 0 || req?.body?.skip) && req.body.take) {
      const resp = await prisma.group.findMany({
        where: req.body.where,
        skip: req.body.skip,
        take: req.body.take,
      });
      if (resp.length > 0) {
        res
          .status(200)
          .json({status: "SUCCESS", response: resp, message: null});
      } else {
        res.status(200).json({
          status: "SUCCESS",
          response: resp,
          message: "ERRORS.NO_RECORDS_FOUND",
        });
      }
    } else {
      const resp = await prisma.group.findMany({
        where: req.body.where,
      });
      if (resp.length > 0) {
        res
          .status(200)
          .json({status: "SUCCESS", response: resp, message: null});
      } else {
        res.status(200).json({
          status: "SUCCESS",
          response: resp,
          message: "ERRORS.NO_RECORDS_FOUND",
        });
      }
    }
  } catch (error: any) {
    console.log(error);
    res
      .status(400)
      .json({status: "FAIL", response: null, message: error.message});
  }
}

export async function addGroup(req: Request, res: Response): Promise<any> {
    try {
      let resp;
      if (req.body && Array.isArray(req.body)) {
        let body: any[] = [];
        for (let data of req.body) {
          let group = JSON.parse(JSON.stringify(data));
          do {
            group["ref"] =
              "G" + randomstring.generate({length: 5, charset: "numeric"});
          } while ((await prisma.group.count({where: {ref: group.ref}})) > 0);
          body.push(group);
        }
        resp = await prisma.group.createMany({data: body});
        res
          .status(200)
          .json({status: "SUCCESS", response: resp, message: null});
      } else if (req.body) {
        let body = JSON.parse(JSON.stringify(req.body));
  
        do {
          body["ref"] =
            "G" + randomstring.generate({length: 5, charset: "numeric"});
        } while ((await prisma.group.count({where: {ref: body.ref}})) > 0);
        resp = await prisma.group.create({data: body});
        //res.json(resp)
        res
          .status(200)
          .json({status: "SUCCESS", response: resp, message: null});
      } else {
        res.status(200).json({
          status: "SUCCESS",
          response: resp,
          message: "Insertion failed",
        });
      }
    } catch (error: any) {
      console.log(error);
      res.status(400).json({
        status: "FAIL",
        response: null,
        message: error.message,
      });
    }
  }
