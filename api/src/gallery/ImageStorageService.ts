import multer from "multer";

export interface StorageService {
    upload(file: File): Promise<string>;
    getFromUrl(filename: string);
}

export class LocalStorageService implements StorageService {
    upload(file: File): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getFromUrl(filename: string) {
        throw new Error("Method not implemented.");
    }

}