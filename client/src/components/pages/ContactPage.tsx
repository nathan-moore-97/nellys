import { Col, Row } from "react-bootstrap";
import NewsletterView from "../newsletter/NewsletterView";
import GoogleMapsView from "../GoogleMapsView";
import AddressView from "../AddressView";

function ContactPage() {

    return (
        <>
            <h2 className="mb-3">Contact Us</h2>
            <Row className="mb-4">
                <Col>
                    <p className="lead">Located in the historic Whatever house, we do lots of needlework stuff and are happy to chit-chat about it!</p>
                </Col>
            </Row>

            {/* Content Row - Adjusts columns for mobile */}
            <Row className="g-4">
                {/* Contact Info Column - Comes first in mobile */}
                <Col md={6}>
                    <AddressView />
                    <NewsletterView />
                </Col>

                {/* Map Column - Comes second in mobile */}
                <Col md={6} className="mt-4 mt-md-0">
                    <GoogleMapsView />
                </Col>
            </Row>
        </>
    );
}

export default ContactPage;