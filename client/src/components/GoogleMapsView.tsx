import { Ratio } from "react-bootstrap";

const API_KEY = import.meta.env.VITE_GMAPS_API_KEY;
const PLACE_ID = import.meta.env.VITE_GMAPS_PLACE_ID;

function GoogleMapsView() {
    return (
       <>
       <div className="shadow-sm rounded overflow-hidden">
            <Ratio aspectRatio="16x9">
                <iframe
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?q=place_id:${PLACE_ID}&key=${API_KEY}`}
                    title="Our Location"
                />
            </Ratio>
        </div>
        </> 
    );
}

export default GoogleMapsView;