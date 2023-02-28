import { Request, Response } from 'express'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const getAllUser = async (req: Request, res: Response) => {
    try {
        const obj= filtering(req.body);
        console.log("Object --> ",obj)
        const data = await prisma.user.findMany({skip:(req.body.skip -1) * req.body.take ,take:req.body.take , where: obj,include:{groupOwned:true} });
        res.status(200).json({ status: "Success", response: data, message: null });

    } catch (err:any) {
        res.status(400).json({ status: "Failed", message: err.message, response: null });
    }
}

const filtering=(body:any)=>{
    let whereObj:any={};
    if(body.id){
        whereObj["id"]=body.id
    }
    if(body.ref){
        whereObj["ref"]={contains:body.ref}
    }
    if(body.name){
        whereObj["name"]={contains:body.name}
    }
    if(body.email){
        whereObj["email"]={contains:body.email}
    }
    if(body.phoneNum){
        whereObj["phoneNum"]={contains:body.phoneNum}
    }
    if(body.createdAt){
        whereObj['createdAt']={contains:body.createdAt}
    }
    if(body.hasOwnProperty('is_active')){
        whereObj["is_active"]=body.is_active
    }
    if(body.updatedAt){
        whereObj['updatedAt']={contains:body.updatedAt}
    }
    if(body.lastLogin){
        whereObj['lastLogin']={contains:body.lastLogin}
    }
    return whereObj;
}

export const updateGroup = async (req: Request, res: Response) => {
    try {
        
        const obj=updateData(req.body);
        console.log(obj)
        const data = await prisma.group.update({where:{id:req.body.id},data:obj})
        res.status(200).json({ status: "Success", response: data, message: null });
    } catch (err:any) {
        res.status(400).json({ status: "Failed", message: err.message, response: null });
    }
}

const updateData=(body:any)=>{
    console.log(body)
    let whereObj:any={}
    if(body.name){
        whereObj["name"]=body.name
    }
    if(body.hasOwnProperty('is_active')){
        whereObj["is_active"]=body.is_active
    }
    return whereObj;
}

