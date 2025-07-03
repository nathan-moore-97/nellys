import { useEffect, useState } from "react";
import { Carousel, Modal, Spinner } from "react-bootstrap";
import ImageComponent from "./ImageComponent";

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

async function fetchImagePage(pageNumber: number) {
    const resp = await fetch(`http://localhost:3000/gallery/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({"page": pageNumber, "pageSize": null}),
    });

    return await resp.json() as PhotoListResponse;
}


function CarouselView() {
    const [imageItems, setImageItems] = useState<GalleryItem[]>([]);
    const [flattenedImageCols, setFlattenedImageCols] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [index, setActiveIndex] = useState(0);
    const [columnCount, setColumnCount] = useState(4);

    useEffect(() => {
        const updateColumnCount = () => {
            const width = window.innerWidth;
            if (width > 1200) setColumnCount(4);
            else if (width > 800) setColumnCount(3);
            else if (width > 500) setColumnCount(2);
            else setColumnCount(1);
        }

        updateColumnCount();
        window.addEventListener('resize', updateColumnCount);
        return () => window.removeEventListener('resize', updateColumnCount)
    });

    useEffect(() => {
        console.log(`Col count ${columnCount}`);

        const columns = Array.from({ length: columnCount }, () => [] as GalleryItem[]);
        imageItems.forEach((image, index) => {
            console.log(`${image.id}, ${index % columnCount}`);
            columns[index % columnCount].push(image);
        });
        
        setFlattenedImageCols(columns.reduce((acc, val) => acc.concat(val), []));
        console.log(columns);
    }, [columnCount]);

    useEffect(() => {
        const fetchAllImages = async() => {
            setIsLoading(true);
            let pageNumber = 0;
            const allImages: GalleryItem[] = [];
            let loading = true;

            while(loading) {
                const listPage = await fetchImagePage(pageNumber);
                allImages.push(...listPage.images);
                loading = !listPage.isLastPage;
                pageNumber++;
            }

            setImageItems(allImages);
            setIsLoading(false);
            console.log("Done");
        };

        fetchAllImages();

    }, []);

    const openModal = (targetImageId?: number) => {
        console.log(`Opening modal on ${targetImageId}`)
        setShowModal(true);
        if (targetImageId) {
            // Find index of the target image if items are already loaded
            const targetIndex = imageItems.findIndex(img => img.id === targetImageId);
            if (targetIndex >= 0) {
                setActiveIndex(targetIndex);
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSelect = (selectedIndex: number) => {
        setActiveIndex(selectedIndex);
    };

    return (
        <>
            <div className="css-masonry">
                {flattenedImageCols.map((image) => (
                    <div key={image.id} className="masonry-item">
                    <ImageComponent 
                        id={image.id} 
                        altText={image.filename}
                        className="masonry-image"
                        onClick={() => openModal(image.id)}
                    />
                    </div>
                ))}
            </div>
            {/* Modal with spinner or content */}
            <Modal 
                show={showModal} 
                onHide={handleCloseModal}
                className="gallery-carousel" 
                centered
            >
                <Modal.Body className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    {isLoading ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : (
                        <Carousel 
                            activeIndex={index} 
                            interval={null} 
                            indicators={false}
                            onSelect={handleSelect}
                        >
                            {imageItems.map((image) => (
                                <Carousel.Item key={image.id}>
                                    <ImageComponent id={image.id} altText={image.filename} />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default CarouselView;