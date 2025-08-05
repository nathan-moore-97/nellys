import { Col, Row, Card, Container, Button } from "react-bootstrap";
import NewsletterView from "../newsletter/NewsletterView";
import GoogleMapsView from "../contact/GoogleMapsView";
import AddressView from "../contact/AddressView";
import { useEffect, useState } from "react";

function ContactPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animations on mount
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Container fluid>
            {/* Hero Section */}
            <div>
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col lg={10} xl={8}>
                            <div className={isVisible ? 'animate-in' : ''}>
                                <h1 className="mb-4">Keep in Touch!</h1>
                                <p>
                                    Have a question? Want to learn more?
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Main Content */}
            <Container className="py-5">
                <Row className="g-4 g-lg-5 justify-content-center">
                    {/* Contact Information Card */}
                    <Col lg={5} md={6}>
                        <Card className={`h-100 ${isVisible ? 'animate-in-left' : ''}`}>
                            <Card.Body className="p-4 p-xl-5">
                                <div className="mb-4">
                                    <i><h3>Nelly's News</h3></i>
                                    <p className="text-muted">
                                        Our monthly newsletter is the best way to stay <br/>up-to-date on events, projects, and volunteer opportunities!
                                    </p>
                                </div>
 
                                <div></div>
                                
                                <div>
                                    <div className="mb-3">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <NewsletterView />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Map Card */}
                    <Col lg={5} md={6}>
                        <Card className={`h-100 ${isVisible ? 'animate-in-right' : ''}`}>
                            <Card.Body className="p-4 p-xl-5">
                                <div className="p-0">
                                    <h3 className="mb-4">Woodlawn & <br/>Pope-Leighey House</h3>
                               
                                <div className="mb-4">
                                    <AddressView />
                                </div>
                                
                                    <p className="text-muted mb-3">
                                        Visit their website for hours and tour availabilty!
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <Button onClick={() => {window.open("https://www.woodlawnpopeleighey.org/")}}>
                                       Woodlawn & Pope-Leighey House
                                    </Button>         
                                </div>
                                <div className="mb-0">
                                    <GoogleMapsView />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Features Section */}
                <Row className="mt-5 pt-4">
                    <Col>
                        <div className={isVisible ? 'animate-in-up' : ''}>
                            <div className="text-center mb-5">
                                <h2>Join Nelly's Needlers</h2>
                                <p className="text-muted">
                                    Whether you're an avid needleworker, an advocate for historic preservation, or simply <br/>
                                    looking for a worthwhile place to volunteer your time, there's a place for you at Nelly's Needlers.
                                </p>
                            </div>
                            
                            <Row className="g-4">
                                <Col md={4}>
                                    <div className="text-center">
                                        <div className="mb-3">
                                            <i className="fas fa-scissors"></i>
                                        </div>
                                        <h4>Education</h4>
                                        <p className="text-muted">
                                            With our collective knowledge of a wide variety of techniques, we are able to offer a broad range
                                            of classes for those just starting their needlework journey to those looking to expand their skill set.
                                        </p>
                                    </div>
                                </Col>
                                
                                <Col md={4}>
                                    <div className="text-center">
                                        <div className="mb-3">
                                            <i className="fas fa-users"></i>
                                        </div>
                                        <h4>Community</h4>
                                        <p className="text-muted">
                                            Join our welcoming group of needlework enthusiasts 
                                            and make lasting friendships.
                                        </p>
                                    </div>
                                </Col>
                                
                                <Col md={4}>
                                    <div className="text-center">
                                        <div className="mb-3">
                                            <i className="fas fa-star"></i>
                                        </div>
                                        <h4>Service</h4>
                                        <p className="text-muted">
                                            As the core of our organization, our projects and events aim to support the preservation of Woodlawn - 
                                            from stitching pieces for the Woodlawn gift shop to volunteering in the Nelly's Café.
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default ContactPage;