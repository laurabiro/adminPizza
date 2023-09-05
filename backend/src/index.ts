import express from "express"
import type { Request, Response } from "express"
import cors from "cors"
/* import fs from "fs/promises" */
import fs from "fs"
import { z } from "zod"
import path from "path"

/* const fileUpload = require("express-fileupload"); */
const server = express()
server.use(cors())
/* app.use(fileUpload()) */
/* app.use("/database/pictures", express.static("dist/assets")) */
server.use(express.static("database"))
server.use(express.json())

const folderPath = '/database/orders'

type JSONData = Record<string, unknown>

function readJSONFile(filePath: string):JSONData | null {
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
    return null;
  }
}

const PizzaSchema = z.object ({

  id: z.string(),
  name: z.string(),
  toppings: z.string().array(),
  url: z.string(),

}).array()


server.get("/api/pizza", async (req: Request, res: Response) => {
 
  const pizzaData = await JSON.parse(fs.readFileSync('database/pizza.json', 'utf-8'))
  return res.json(pizzaData)
})

server.post('/api/order', async (req: Request, res: Response) => {
  const fileData = req.body
  // zod
  try {
    const fileDataString = JSON.stringify(fileData, null, 2); // Adjust spacing as needed
    /* const uploadPath = __dirname + '/../database/' + 'profile.json'
 */
    const uploadPath = __dirname + '/../database/orders/' + `${req.body.id}.json`
    fs.writeFileSync(uploadPath, fileDataString)

    res.send(fileDataString)
  } catch (error) {
    console.error('Error writing to file:', error)
    res.status(500).send('Error writing to file')
  }

})

/* server.get("/api/admin"), async (req: Request, res: Response) => {

} */



server.listen(3333) 
