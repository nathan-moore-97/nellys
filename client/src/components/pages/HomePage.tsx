import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";

function HomePage() {
    return (
        <Container className="py-4">
            {/* Hero Section */}
            <Row className="mb-5">
                <Col>
                    <div className="text-center bg-light rounded p-5 mb-4">
                        <h1 className="display-4 text-primary mb-3">Welcome to Nelly's Needlers</h1>
                        <p className="lead mb-4">
                            A vibrant community of needlework enthusiasts dedicated to preserving and sharing 
                            the beautiful art of embroidery, cross-stitch, and fiber arts.
                        </p>
                        <Button variant="primary" size="lg" className="me-3">Join Our Classes</Button>
                        <Button variant="outline-primary" size="lg">Learn More</Button>
                    </div>
                </Col>
            </Row>

            {/* Mission Statement */}
            <Row className="mb-5">
                <Col md={8} className="mx-auto text-center">
                    <h2 className="h3 mb-3">Our Mission</h2>
                    <p className="text-muted">
                        As a 501(c)(3) nonprofit organization, Nelly's Needlers is committed to fostering 
                        creativity, building community connections, and keeping traditional needlework arts 
                        alive for future generations through education, exhibitions, and shared experiences.
                    </p>
                </Col>
            </Row>

            {/* What We Offer */}
            <Row className="mb-5">
                <Col>
                    <h2 className="text-center mb-4">What We Offer</h2>
                </Col>
            </Row>
            
            <Row className="mb-5">
                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="mb-3">
                                <i className="fas fa-chalkboard-teacher fa-3x text-primary"></i>
                            </div>
                            <Card.Title>Needlework Classes</Card.Title>
                            <Card.Text>
                                Learn from experienced instructors in our comprehensive classes covering 
                                embroidery, cross-stitch, quilting, and more. All skill levels welcome!
                            </Card.Text>
                            <Button variant="outline-primary">View Classes</Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="mb-3">
                                <i className="fas fa-palette fa-3x text-success"></i>
                            </div>
                            <Card.Title>Art Shows & Exhibitions</Card.Title>
                            <Card.Text>
                                Showcase your beautiful work and admire creations from fellow artists 
                                at our regular exhibitions and community shows.
                            </Card.Text>
                            <Button variant="outline-success">Upcoming Shows</Button>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="mb-3">
                                <i className="fas fa-coffee fa-3x text-warning"></i>
                            </div>
                            <Card.Title>Annual Needlework Café</Card.Title>
                            <Card.Text>
                                Join us for our signature yearly event featuring workshops, vendor booths, 
                                delicious refreshments, and a celebration of needlework artistry.
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
                                        <strong>Beginner's Embroidery Workshop</strong> - March 15, 2025
                                    </p>
                                    <p className="mb-2">
                                        <strong>Spring Needlework Showcase</strong> - April 20-22, 2025
                                    </p>
                                    <p className="mb-0">
                                        <strong>Annual Needlework Café</strong> - June 14, 2025
                                    </p>
                                </Col>
                                <Col md={4} className="text-center">
                                    <Button variant="light" size="lg">View All Events</Button>
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
                        <h2 className="mb-4">Making a Difference</h2>
                        <Row>
                            <Col sm={6} md={3} className="mb-3">
                                <h3 className="display-6 text-primary">500+</h3>
                                <p className="text-muted">Students Taught</p>
                            </Col>
                            <Col sm={6} md={3} className="mb-3">
                                <h3 className="display-6 text-primary">25</h3>
                                <p className="text-muted">Classes Offered</p>
                            </Col>
                            <Col sm={6} md={3} className="mb-3">
                                <h3 className="display-6 text-primary">12</h3>
                                <p className="text-muted">Art Shows Yearly</p>
                            </Col>
                            <Col sm={6} md={3} className="mb-3">
                                <h3 className="display-6 text-primary">8</h3>
                                <p className="text-muted">Years Serving</p>
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
                            <h3 className="mb-3">Ready to Join Our Community?</h3>
                            <p className="mb-4">
                                Whether you're a complete beginner or an experienced needleworker, 
                                there's a place for you at Nelly's Needlers.
                            </p>
                            <div>
                                <Button variant="primary" size="lg" className="me-3">
                                    Register for Classes
                                </Button>
                                <Button variant="outline-primary" size="lg" className="me-3">
                                    Become a Member
                                </Button>
                                <Button variant="success" size="lg">
                                    <i className="fas fa-heart me-2"></i>Donate
                                </Button>
                            </div>
                            <div className="mt-3">
                                <Badge bg="secondary">501(c)(3) Nonprofit Organization</Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;