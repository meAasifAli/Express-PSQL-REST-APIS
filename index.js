import express from 'express'
import dotenv from 'dotenv'
import client from './database.js'
import { v4 as uuid } from 'uuid'
dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.listen(process.env.PORT_NO, () => {
    console.log(`Server is running on port ${process.env.PORT_NO}`);
})

app.post('/create', async (req, res) => {
    const { name, email, password } = req.body

    const existQuery = "SELECT * FROM users WHERE name = $1"
    const existResult = await client.query(existQuery, [name])
    if (existResult.rows.length) {
        return res.status(400).json({ message: "User already exists" })
    }

    const q = "INSERT INTO users (id,name,email,password) VALUES ($1,$2,$3,$4)"
    const result = await client.query(q, [uuid(), name, email, password])
    res.status(201).json(result)
})

app.get("/getusers", async (req, res) => {
    const q = "SELECT * FROM users"
    const result = await client.query(q)
    res.status(200).json(result.rows)
})

app.get("/getuser/:id", async (req, res) => {
    const { id } = req.params;
    const q = "SELECT * FROM users WHERE id = $1"
    const result = await client.query(q, [id])
    res.status(200).json(result.rows[0])
})

app.delete("/deleteuser/:id", async (req, res) => {
    const { id } = req.params;
    const q = "DELETE FROM users WHERE id = $1"
    await client.query(q, [id])
    res.status(200).json({ message: "User Deleted" })
})

app.put("/updateuser/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const q = "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4"
    const result = await client.query(q, [name, email, password, id])
    res.status(200).json(result)
})