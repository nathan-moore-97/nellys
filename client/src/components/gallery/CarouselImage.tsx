import { Image } from "react-bootstrap";

interface CarouselProps {
    id: number;
    altText: string;
}

const API_URL = 'http://localhost:3000'

function CarouselImage(props: CarouselProps) {
    return (
        <>
            <Image src={`${API_URL}/gallery/${props.id}`} />
        </>
    );
}

export default CarouselImage;