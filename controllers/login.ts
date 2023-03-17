import { Request, Response } from "express";
import { Group, PrismaClient, User } from "@prisma/client"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"
import * as io from 'socket.io-client'
import {getRecordsFromCache} from '../controllers/cache'
import appConst from "../constants";
const prisma = new PrismaClient();


export const signup = async (req: Request, res: Response) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = encryptedPassword;
        console.log("password::   " + encryptedPassword);
        const resp = await prisma.user.create({
            data: req.body,
        });
        res.send(resp)
    } catch (error: any) {
        console.log(error)
        res.status(400).json({
            status: 'FAIL',
            message: error.message,
            response: null
        });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        let secretKey = "gffhjhguyhbghvyh"
        let logincredentials = JSON.parse(JSON.stringify(req.body.login));
        const find_user = await prisma.user.findFirst({
            where: {
                OR: [{
                    email: String(logincredentials.email)
                },
                {
                    phoneNum: String(logincredentials.phoneNum)
                }
                ]
            }
        })
        console.log(find_user)
        if (find_user != null) {
            let password: string = find_user?.password as string;
            let id: string = find_user?.id as string;
            const issame = await bcrypt.compare(logincredentials.password, password);
            if (issame) {
                let token = jwt.sign({ id: id }, secretKey);
                res.cookie("jwt", token)
                console.log(token)
                console.log('Logged In. Fetching Messages.')
                // res.status(200).json({
                //     message: "login successfully",
                // });
                const groups = await prisma.group.findMany({ where: { OR: [{ OwnerId: { equals: find_user.id } }, { members: { some: { id: find_user.id } } }] }, select:{id: true} })
                await setSocketConnection(find_user, groups)
                console.log('Socket setup done')
                const messages = await getMessages(find_user,groups)
                res.status(200).json({status: appConst.STATUS.SUCCESS, response: messages.response, message: null})
                } else {
                res.status(400).json({
                    status: appConst.STATUS.FAIL,
                    message: "incorrect password",
                });
            }
        } else {
            res.status(400).json({
                status: appConst.STATUS.FAIL,
                message: "incorrect username or phonenum",
            });
        }
    } catch (error) {
        res.send(error)
    }
}

async function setSocketConnection(user: User, groups: any[]) {
    const socket = io.connect('http://localhost:4002', { reconnection: true })
    const eventList: string[] = [user.id]
    if (socket) {
        
        for(let group of groups) {
            eventList.push(group._id.toString())
        }
        console.log('event list: ', eventList)
        for(let event of eventList) {
            socket.on(event, (data: any) => {
                console.log('listening to: ', event)
                console.log('Message received: ', data)
            })
        }
    }
}

async function getMessages(user: User, groups: { id: string; }[]) {
    let keyList = ['*'+user.id+'*']
    for(let group of groups) {
        keyList.push('*'+group.id+'*')
    }
    const messages = await getRecordsFromCache(keyList)
    console.log('Messages: ', messages)
    return messages
}