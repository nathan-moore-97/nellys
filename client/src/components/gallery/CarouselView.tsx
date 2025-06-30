import { Component, useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import CarouselImage from "./CarouselImage";

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

const imageItems: GalleryItem[] = [];

async function loadImages() {

    let loading = true;
    let pageNumber = 0;
    while(loading) {
        const resp = await fetch(`http://localhost:3000/gallery/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({"page": pageNumber, "pageSize": null}),
        });

        const listPage = await resp.json() as PhotoListResponse;

        listPage.images.forEach((i) => {
            imageItems.push(i);
        });

        loading = !listPage.isLastPage;
    }

    console.log(`Loaded ${imageItems.length} images`);
}


function CarouselView() {
    useEffect(() => {
        loadImages();
    }, []);


    return (
        <Carousel>
            {
                imageItems.map(item => (<><Carousel.Item><CarouselImage id={item.id} altText={`${item.filename}`} /></Carousel.Item></>))
            }
        </Carousel>
    );
}

export default CarouselView;