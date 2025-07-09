import { LocalStorageService, S3StorageService } from "./ImageStorageService";

class StorageServiceFactory {
    public static Create() {
        switch(process.env.ENVIORNMENT) {
            case "local":
                return new LocalStorageService();
            case "dev":
            case "prod":
                return new S3StorageService();
        }
    }
}