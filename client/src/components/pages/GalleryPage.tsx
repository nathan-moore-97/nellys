import { useEffect, useRef, useState } from "react";
import { Carousel, Modal, Spinner } from "react-bootstrap";
import ImageComponent from "../gallery/ImageComponent";

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

const API_URL = import.meta.env.VITE_API_URL

async function fetchImagePage(pageNumber: number) {
    const resp = await fetch(`${API_URL}/gallery/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({"page": pageNumber, "pageSize": 25}),
    });

    return await resp.json() as PhotoListResponse;
}


function GalleryView() {
    const [imageItems, setImageItems] = useState<GalleryItem[]>([]);

    const [isLoading, setIsLoading ] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [index, setActiveIndex] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const [columnCount, setColumnCount] = useState(4);
    const [imageCol0, setImageCol0] = useState<GalleryItem[]>([]);
    const [imageCol1, setImageCol1] = useState<GalleryItem[]>([]);
    const [imageCol2, setImageCol2] = useState<GalleryItem[]>([]);
    const [imageCol3, setImageCol3] = useState<GalleryItem[]>([]);
    const isLoadingRef = useRef(isLoading);
    const isLastPageRef = useRef(isLastPage);

    // Sync refs with state
    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    useEffect(() => {
        isLastPageRef.current = isLastPage;
    }, [isLastPage]);
    
    // Trigger new image page loading when one of the scroll sentinels
    // is visible on the screen
    useEffect(() => {
        
        // Trigger when 10% visible, sentinels are only a few px wide
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isLoadingRef.current && !isLastPageRef.current) {
                    setPageNumber(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        const sentinel0 = document.querySelector('#scroll-sentinel0');
        const sentinel1 = document.querySelector('#scroll-sentinel1');
        const sentinel2 = document.querySelector('#scroll-sentinel2');
        const sentinel3 = document.querySelector('#scroll-sentinel3');
        
        if (sentinel0) observer.observe(sentinel0);
        if (sentinel1) observer.observe(sentinel1);
        if (sentinel2) observer.observe(sentinel2);
        if (sentinel3) observer.observe(sentinel3);

        return () => observer.disconnect();
    }, [isLoading, isLastPage]);

    // Set the number of columns based on window size
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
    }, []);

    // Allocate images to columns
    useEffect(() => {
        const columns = Array.from({ length: 4 }, () => [] as GalleryItem[]);
        imageItems.forEach((image, index) => {
            columns[index % columnCount].push(image);
        });
        
        setImageCol0(columns[0]);
        setImageCol1(columns[1]);
        setImageCol2(columns[2]);
        setImageCol3(columns[3]);

    }, [columnCount, imageItems]);

    // fetch a page of images 
    useEffect(() => {
        const fetchSomeImages = async() => {
            setIsLoading(true);
            const galleryImages = await fetchImagePage(pageNumber);
            setIsLastPage(galleryImages.isLastPage);
            setImageItems(prev => prev.concat(galleryImages.images));
            setIsLoading(false);
        };

        fetchSomeImages();
    }, [pageNumber]);

    // Opens selected image for single viewing
    const openModal = (targetImageId?: number) => {
        setShowModal(true);
        if (targetImageId) {
            // Find index of the target image if items are already loaded
            const targetIndex = imageItems.findIndex(img =>  img.id === targetImageId);
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
            <div className="image-columns-container" style={{display: "flex"}}>
                <div className="image-col">
                    {imageCol0.map((image) => (
                        <div key={image.id} className="masonry-item">
                            <ImageComponent 
                                id={image.id} 
                                altText={image.filename}
                                className="masonry-image"
                                onClick={() => openModal(image.id)}
                            />
                        </div>
                    ))}
                    <div id="scroll-sentinel0" style={{ height: '1px' }} />
                </div>
                <div className="image-col">
                    {imageCol1.map((image) => (
                        <div key={image.id} className="masonry-item">
                            <ImageComponent 
                                id={image.id} 
                                altText={image.filename}
                                className="masonry-image"
                                onClick={() => openModal(image.id)}
                            />
                        </div>
                    ))}
                    <div id="scroll-sentinel1" style={{ height: '1px' }} />
                </div>
                <div className="image-col">
                    {imageCol2.map((image) => (
                        <div key={image.id} className="masonry-item">
                            <ImageComponent 
                                id={image.id} 
                                altText={image.filename}
                                className="masonry-image"
                                onClick={() => openModal(image.id)}
                            />
                        </div>
                    ))}
                    <div id="scroll-sentinel2" style={{ height: '1px' }} />
                </div>
                <div className="image-col">
                    {imageCol3.map((image) => (
                        <div key={image.id} className="masonry-item">
                            <ImageComponent 
                                id={image.id} 
                                altText={image.filename}
                                className="masonry-image"
                                onClick={() => openModal(image.id)}
                            />
                        </div>
                    ))}
                    <div id="scroll-sentinel3" style={{ height: '1px' }} />
                </div>
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

export default GalleryView;