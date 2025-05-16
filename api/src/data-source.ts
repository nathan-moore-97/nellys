import "reflect-metadata"
import { DataSource } from "typeorm"
import { NewsletterSignup } from "./entity/NewsletterSignup"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [NewsletterSignup],
    migrations: [],
    subscribers: [],
})
