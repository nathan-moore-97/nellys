import { Col, Row, Card, Container } from "react-bootstrap";
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
                                <h1 className="mb-4">Visit Nelly's Needlers</h1>
                                <p>
                                    Located in the heart of Alexandria, we're your premier destination for 
                                    needlework supplies, expert guidance, and a warm community of crafters. 
                                    Come discover the art of beautiful stitching!
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
                                    <div className="mb-3">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <h3>Visit Our Studio</h3>
                                    <p className="text-muted">
                                        Find us in beautiful Alexandria, Virginia
                                    </p>
                                </div>
                                
                                <div className="mb-4">
                                    <AddressView />
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
                            <Card.Body className="p-0">
                                <div className="p-4">
                                    <div className="mb-2">
                                        <i className="fas fa-map"></i>
                                    </div>
                                    <h3 className="mb-1">Find Us Here</h3>
                                    <p className="text-muted mb-0">
                                        Convenient location with parking available
                                    </p>
                                </div>
                                <div>
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
                                <h2>Why Choose Nelly's Needlers?</h2>
                                <p className="text-muted">
                                    More than just a needlework shop – we're your crafting community
                                </p>
                            </div>
                            
                            <Row className="g-4">
                                <Col md={4}>
                                    <div className="text-center">
                                        <div className="mb-3">
                                            <i className="fas fa-scissors"></i>
                                        </div>
                                        <h4>Expert Guidance</h4>
                                        <p className="text-muted">
                                            Our experienced staff provides personalized advice and 
                                            techniques for crafters of all skill levels.
                                        </p>
                                    </div>
                                </Col>
                                
                                <Col md={4}>
                                    <div className="text-center">
                                        <div className="mb-3">
                                            <i className="fas fa-users"></i>
                                        </div>
                                        <h4>Welcoming Community</h4>
                                        <p className="text-muted">
                                            Join our friendly community of needlework enthusiasts 
                                            and make lasting friendships.
                                        </p>
                                    </div>
                                </Col>
                                
                                <Col md={4}>
                                    <div className="text-center">
                                        <div className="mb-3">
                                            <i className="fas fa-star"></i>
                                        </div>
                                        <h4>Quality Supplies</h4>
                                        <p className="text-muted">
                                            Premium threads, fabrics, and tools from trusted 
                                            brands for your finest projects.
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