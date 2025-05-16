import { Col, Row } from "react-bootstrap";
import NewsletterView from "../NewsletterView";
import GoogleMapsView from "../GoogleMapsView";
import AddressView from "../AddressView";
import { Link } from "react-router-dom";

function ContactPage() {

    return (
        <>
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
                    <AddressView />
                    <NewsletterView subscribing={true}/>
                    <Link to="/unsubscribe">Unsubscribe</Link>
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