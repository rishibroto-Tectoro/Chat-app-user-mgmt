import {Request, Response } from "express";
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
const prisma = new PrismaClient();


export const signup= async (req:Request,res:Response)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = encryptedPassword;
        console.log("password::   " + encryptedPassword);
        const resp = await prisma.user.create({
          data: req.body,
        });
        res.send(resp)
    } catch (error) {
        res.status(400).json({
            message:"error",
            response:error
          });
    }
}

export const login= async (req:Request,res:Response)=>{
    try {
        let secretKey = "gffhjhguyhbghvyh"
        let logincredentials = JSON.parse(JSON.stringify(req.body.login));
        const find_user = await prisma.user.findFirst({
            where:{
                OR:[{
                    email:String(logincredentials.email)   
                },
                {
                    phoneNum:String(logincredentials.phoneNum)
                }
                ] 
            }   
        })
        console.log(find_user)
        if (find_user != null) {
            let password:string = find_user?.password as string;
            let id:string = find_user?.id as string;
            const issame = await bcrypt.compare(logincredentials.password,password);
            if(issame){
                    let token = jwt.sign({ id:id },secretKey);
                    res.cookie("jwt", token)
                    console.log(token)
                    res.status(200).json({
                        message:"login successfully",
                       }); 
                }else{
                    res.status(400).json({
                        message:"incorrect password",
                       }); 
                }
           }else {
            res.status(400).json({
            message:"incorrect username or phonenum",
           }); 
        }
    } catch (error) {
        res.send(error)
    }
}

