import appConst from "../constants";
import { Request, Response } from "express";
import { Tedis } from "tedis";
let cache: Tedis | null;
async function tedisInit() {
    if (cache) {
        return cache;
    } else {
        cache = new Tedis({
            host: process.env.REDIS_HOST || "localhost",
            port: parseInt(process.env.REDIS_PORT || "") || 6379,
        });

        cache.on("connect", () => {
            console.log(appConst.MESSAGES.CACHE_CONNECT_SUCCESS);
        });
        cache.on("timeout", () => {
            console.log(appConst.ERRORS.CACHE_CONNECT_TIMEOUT);
        });
        cache.on("error", (err) => {
            console.log(appConst.ERRORS.CACHE_CONNECT, ": ", err);
            cache = null;
        });
        cache.on("close", (had_error) => {
            console.log(appConst.ERRORS.CACHE_CONNECT_HAD_ERROR, ": ", had_error);
            cache = null;
        });
        return cache;
    }
}
export const redisConnect = async () => {
    try {
        let cache = await tedisInit();
        if (cache) {
            return cache;
        } else {
            return null;
        }
    } catch (err: any) {
        console.log(err);
        return null;
    }
};


export async function getRecordsFromCache(patternList: string[]) {
    try {
        let cache: Tedis | null = await redisConnect();
        let records: any[] = []
        for (let pattern of patternList) {
            let keys: string[] = await cache?.keys(pattern) || []

            let msgList = await cache?.mget('', ...keys) || []
            for (let msg of msgList) {
                msg ? records.push(JSON.parse(msg.toString())):{}
            }
        }
        return {status: appConst.STATUS.SUCCESS, response: [...new Map(records.map(item => [item['_id'], item])).values()], message: null}
    } catch (err: any) {
        console.log(err);
        return { status: appConst.STATUS.FAIL, response: null, message: err.message };
    }
}