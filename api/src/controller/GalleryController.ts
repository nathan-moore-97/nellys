import { NextFunction, Request, Response } from "express";
import { GalleryImage } from "../entity/GalleryImage";
import { AppDataSource } from "../data-source";
import { LocalStorageService } from "../gallery/ImageStorageService";


interface GalleryItem {
    id: number;
    filename: string;
}

interface PhotoListResponse {
    error: string | null;
    page: number;
    pageSize: number;
    isLastPage: boolean;
    images: GalleryItem[];
}

export class GalleryController {
    
    private galleryRepository = AppDataSource.getRepository(GalleryImage);
    private storageService = new LocalStorageService();

    async getAllPhotos(request: Request, response: Response, next: NextFunction) {
        const resp: PhotoListResponse = {
            error: null,
            page: 0,
            pageSize: 0,
            // Returning an empty response should not tell the client to keep iterating
            isLastPage: true, 
            images: [],
        }

        const { page, pageSize } = request.body;

        let pageNum = Number(page);
        let pageSizeNum = Number(pageSize);

        if (Number.isNaN(page) || Number.isNaN(pageSizeNum)) {
            resp.error = "Provide valid values for Page and PageSize";
            response.json(resp).end();
            return;
        }

        resp.page = pageNum;
        resp.pageSize = pageSizeNum;
        resp.isLastPage = false;

        try {

            const [result, total] = await this.galleryRepository.findAndCount({ take: pageSizeNum, skip: pageSize * pageNum });

            result.forEach((pic) => {
                // Dont really need to be sending all the information in the Photo entity, like the url
                const item: GalleryItem = {
                    id: pic.id,
                    filename: pic.filename,
                };

                resp.images.push(item);
            });


            resp.isLastPage = result.length < pageSize;
            resp.images = result;
            response.json(resp);

        } catch (error) {
            console.error(error);
            resp.error = "An unexpeceted error occurred. Please try again later";
            response.status(500).json(resp);
        }
    }

    async getPhoto(request: Request, response: Response, next: NextFunction) {

        const photoId = Number(request.params.photoId);

        if (Number.isNaN(photoId)) {
            response.json({"error": "Photo ID required"}).end();
            return;
        }

        try {
            const photo = await this.galleryRepository.findOneBy({ id: photoId });

            if (photo == null) {
                response.json({ "error": "Invalid Photo ID"}).end();
            } else {
                const photoFile = this.storageService.getFromUrl(photo.url);
                response.end(Buffer.from(photoFile));
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({error: "An unexpected error occurred when retrieving the photo. Please try again later"});
        }
    }
}