import express from 'express'
import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import { config } from 'dotenv'
import * as http from 'http'

import router from './routes'

config()
const app = express()
app.use(urlencoded({ extended: true }))
app.use(json())
app.use('/', router)
app.use(cors())

async function init() {
    try {
        app.listen(process.env.PORT || 4001, () => {
            console.log(`Server listening at ${process.env.PORT || 4001}`)
        })
    } catch (err: any) {
        console.log(err)
    }
}
init()