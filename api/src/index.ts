import * as express from "express"
import * as cors from "cors"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"


AppDataSource.initialize().then(async () => {

    dotenv.config();

    const app = express();

    app.use(cors());
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    });
    
    app.listen(3000);
    console.log("Server started at http://localhost:3000/");

}).catch(error => console.log(error))
