import { Col, Container, Ratio, Row } from "react-bootstrap";
import NewsletterView from "../Newsletter/NewsletterView";

function ContactView() {
    const VITE_GMAPS_API_KEY = import.meta.env.VITE_GMAPS_API_KEY;

    return (
        <Container fluid="md" className="px-3 px-md-4 py-4">
            {/* Title Row - Always stays at top */}
            <Row className="mb-4">
                <Col>
                    <h1 className="mb-3">Contact Us</h1>
                    <p className="lead">Located in the historical Pope-Leighy house, we do lots of needlework stuff and are happy to chit chat about it!</p>
                </Col>
            </Row>

            {/* Content Row - Adjusts columns for mobile */}
            <Row className="g-4">
                {/* Contact Info Column - Comes first in mobile */}
                <Col md={6}>
                    <div className="mb-4">
                        <address>
                            <strong className="h5">
                                9000 Richmond Hwy<br />
                                Alexandria, VA<br />
                                22309
                            </strong>
                        </address>
                        
                        <div className="mt-3">
                            <p>
                                <a href="tel:1-703-780-4000" className="text-decoration-none">(703) 780-4000</a><br />
                                <a href="mailto:nellysneedlers@gmail.com" className="text-decoration-none">nellysneedlers@gmail.com</a>
                            </p>
                        </div>
                    </div>
                    
                    <NewsletterView />
                </Col>

                {/* Map Column - Comes second in mobile */}
                <Col md={6} className="mt-4 mt-md-0">
                    <div className="shadow-sm rounded overflow-hidden">
                        <Ratio aspectRatio="16x9">
                            <iframe
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.google.com/maps/embed/v1/place?q=place_id:ChIJxTajSlust4kR7c9Nv51eMSs&key=${VITE_GMAPS_API_KEY}`}
                                title="Our Location"
                            />
                        </Ratio>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ContactView;