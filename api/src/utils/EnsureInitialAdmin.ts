// src/seeds/seedInitialAdmin.ts
import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entity/User";
import logger from "../logging/Logger";
import { AuthenticationService } from "../core/auth/AuthenticationService";

async function seedInitialAdmin() {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const authService = new AuthenticationService(userRepository);

        // Check if any admin user already exists
        const existingAdmin = await userRepository.findOne({
            where: { roleId: UserRole.ADMIN } // Adjust based on your UserRole enum
        });

        if (existingAdmin) {
            logger.info("Admin user already exists. Skipping seed.");
            return;
        }
        
        logger.info("Creating ADMIN user");
        authService.register("ADMIN", "password", UserRole.ADMIN, "Admin", "Admin");


    } catch (error) {
        logger.error("Error seeding admin user:", error);
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    }
}

export default seedInitialAdmin;