import PG from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Client } = PG

const client = new Client({
    password: process.env.PG_PASSWORD,
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    port: process.env.DB_PORT,

})

await client.connect()


export default client

