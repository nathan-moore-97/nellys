import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function HomePage() {

    const navigate = useNavigate();

    return (
        <Container className="p-0">
            {/* Hero Section */}
            <Row className="mb-5">
                <Col>
                    <div className="text-center bg-light rounded p-5 mb-4">
                        <h1 className="display-3 text-primary mb-3">Welcome to Nelly's Needlers</h1>
                        <p className="lead mb-4">
                            Celebrating 50 years of supporting the preservation of historic Woodlawn and sharing an appreciation for the needle arts!
                        </p>
                        <div className="p-0">
                            <Button variant="primary" size="lg" className="me-3">Join Us</Button>
                            <Button variant="outline-primary" size="lg">Learn More</Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* What's in a Name? */}
            <Row className="mb-5">
                <Col md={8} className="mx-auto text-center">
                    <h2 className="h3 mb-3">What's in a Name?</h2>
                    <p className="text-muted">
                        The Nelly's are named after one of the first inhabitants of the Woodlawn mansion, Eleanor "Nelly" Parke Custis Lewis.<br/>
                        She was an avid needleworker and many of her pieces are on display at Woodlawn and preserved in their collection. 
                    </p>
                </Col>
            </Row>

            {/* Mission Statement */}
            <Row className="mb-5">
                <Col md={8} className="mx-auto text-center">
                    <h2 className="h3 mb-3">Our Mission</h2>
                    <p className="text-muted">
                        As a 501(c)3 nonprofit organization, Nelly's Needlers is committed to fostering 
                        creativity, building community connections, and keeping traditional needle arts 
                        alive for future generations through education, exhibitions, and shared experiences.
                    </p>
                </Col>
            </Row>

            {/* Highlights */}
            <Row className="mb-4">
                <Col>
                    <h2 className="text-center mb-2">Highlights</h2>
                </Col>
            </Row>
            
            <Row className="mb-5">
                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="mb-3">
                                <i className="fas fa-chalkboard-teacher fa-3x text-primary"></i>
                            </div>
                            <Card.Title>Monthly Meetings & Volunteering</Card.Title>
                            <Card.Text>
                                As a volunteer organization, rather than charging dues we require 50 hours of service 
                                and attendance at three General Meetings for active membership.
                                We meet once a month for our General Meeting either in person or virtually. 
                                Visitors are also welcome to attend to learn more about what we do!
                            </Card.Text>
                            <Button variant="outline-primary">Membership Requirements</Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="mb-3">
                                <i className="fas fa-palette fa-3x text-success"></i>
                            </div>
                            <Card.Title>Needlework Classes & Excursions</Card.Title>
                            <Card.Text>
                                Learn from experienced instructors and fellow Nelly's to refine your skills or learn a new technique.
                                With our broad range of expertise, there is sure to be something for all skill levels!
                            </Card.Text>
                            <Button variant="outline-success">Learn More</Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="mb-3">
                                <i className="fas fa-coffee fa-3x text-warning"></i>
                            </div>
                            <Card.Title>Woodlawn's Annual Needlework Show <br/>& Nelly's Café</Card.Title>
                            <Card.Text>
                                Visit Woodlawn in March to see the house beautifully decorated with hundreds of pieces of needlework
                                from around the country and around the globe. 
                                For lunch, stop by the Nelly's Café for freshly baked quiche, our famous chicken salad, 
                                and be sure to save room for dessert. Our Lemon Tarts, Decadent Chocolate Cake, 
                                and Martha Washington's Ginger Cookies are not to be missed!
                            </Card.Text>
                            <Button variant="outline-warning">Café Details</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Upcoming Events */}
            <Row className="mb-5">
                <Col>
                    <Card className="bg-primary text-white">
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col md={8}>
                                    <h3 className="mb-2">Upcoming Events</h3>
                                    <p className="mb-2">
                                        <strong>Annual Children's Workshop</strong> - August 4 - 8, 2025
                                    </p>
                                    <p className="mb-2">
                                        <strong>Punch Card Embroidery Class</strong> - August 24, 2025
                                    </p>
                                    <p className="mb-0">
                                        <strong>Take In for the Annual Needlework Show</strong> - January 2026
                                    </p>
                                </Col>
                                <Col md={4} className="text-center">
                                    <Button variant="light" size="lg" onClick={() => {navigate("/calendar")}}>View All Events</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Community Impact */}
            <Row className="mb-5">
                <Col>
                    <div className="text-center">
                        <h2 className="mb-4">Making a Difference One Stitch at a Time</h2>
                        <Row>
                            <Col sm={6} md={3} className="mb-3">
                                <h3 className="display-6 text-primary">60+</h3>
                                <p className="text-muted">Active Members</p>
                            </Col>
                            <Col sm={6} md={3} className="mb-3">
                                <h3 className="display-6 text-primary">45</h3>
                                <p className="text-muted">Years of the Annual Children's Workshop</p>
                            </Col>
                            <Col sm={6} md={3} className="mb-3">
                                <h3 className="display-6 text-primary">1000+</h3>
                                <p className="text-muted">Lemon Tarts Served</p>
                            </Col>
                            <Col sm={6} md={3} className="mb-3">
                                <h3 className="display-6 text-primary">50</h3>
                                <p className="text-muted">Years and Counting</p>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>

            {/* Call to Action */}
            <Row>
                <Col>
                    <Card className="bg-light">
                        <Card.Body className="text-center py-5">
                            <h3 className="mb-3">We hope to see  you soon!</h3>
                            <p className="mb-4">
                                Whether you're an avid needleworker, an advocate for historic preservation, or simply
                                <br/>looking for a worthwhile place to volunteer your time, there's a place for you at Nelly's Needlers.
                            </p>
                            <div>
                                <Button variant="primary" size="lg" className="me-3">
                                    Join Us
                                </Button>
                                <Button variant="outline-primary" size="lg" className="me-3">
                                    Learn More
                                </Button>
                                <Button variant="success" size="lg">
                                    <i className="fas fa-heart me-2"></i>Donate
                                </Button>
                            </div>
                            <div className="mt-3">
                                <Badge bg="secondary">501(c)3 Nonprofit Organization</Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;