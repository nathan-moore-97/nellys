import { Image } from "react-bootstrap";
import type { MouseEvent } from 'react';

interface ImageComponentProps {
    id: number;
    altText: string;
    className?: string;
    style?: React.CSSProperties;
    onClick?: (id: number, event: MouseEvent<HTMLImageElement>) => void;
}

function ImageComponent(props: Readonly<ImageComponentProps>) {
    const handleClick = (event: MouseEvent<HTMLImageElement>) => {
        if (props.onClick) {
            props.onClick(props.id, event);
        }
    };

    return (
        <Image src={`/api/gallery/${props.id}`} 
            alt={props.altText}
            className={`d-block w-100 h-100 object-fit-contain ${props.className || ''}`}
            onClick={handleClick}
            loading="lazy"
        />
    );
}

export default ImageComponent;