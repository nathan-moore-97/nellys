import { NextFunction, Request, Response } from "express";
import { GalleryImage } from "../entity/GalleryImage";
import { AppDataSource } from "../data-source";
import { LocalStorageService } from "../gallery/ImageStorageService";

interface PhotoListResponse {
    error: string | null;
    images: GalleryImage[];
}

interface PhotoResponse {
    error: string | null;
    imageMetadata: GalleryImage | null;
    image: object | null;
}

export class GalleryController {
    
    private galleryRepository = AppDataSource.getRepository(GalleryImage);
    private storageService = new LocalStorageService();

    async getAllPhotos(request: Request, response: Response, next: NextFunction) {
        const resp: PhotoListResponse = {
            error: null,
            images: [],
        }

        try {
            console.log("Fetching photos");
            resp.images = await this.galleryRepository.find();
            response.json(resp);
        } catch (error) {
            console.error(error);
            resp.error = "An unexpeceted error occurred. Please try again later";
            response.status(500).json(resp);
        }
    }

    async getPhoto(request: Request, response: Response, next: NextFunction) {
        const resp: PhotoResponse = {
            error: null,
            imageMetadata: null,
            image: null,
        }

        try {

            // Get Photo with ID 10
            const photo = this.galleryRepository.findOneBy({ id: 10 });
            response.send(photo);


        } catch (error) {
            console.error(error);
            resp.error = "An unexpected error occurred when retrieving the photo. Please try again later";
            response.status(500).json(resp);
        }
    }
}