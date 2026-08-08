import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AboutPage = () => {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="text-center mb-4">About RM Store</h1>
          <p className="lead text-center">
            Your trusted destination for quality products and exceptional service
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={6} className="mb-4">
          <div className="p-4 bg-light rounded shadow-sm h-100">
            <h2 className="h4 mb-3">Our Story</h2>
            <p>
              RM Store was founded with a simple mission: to provide customers with high-quality products
              at competitive prices while delivering an exceptional shopping experience. We believe in
              building lasting relationships with our customers through transparency, reliability, and
              outstanding service.
            </p>
          </div>
        </Col>
        <Col md={6} className="mb-4">
          <div className="p-4 bg-light rounded shadow-sm h-100">
            <h2 className="h4 mb-3">Our Values</h2>
            <ul className="list-unstyled">
              <li className="mb-2">✓ Quality Assurance</li>
              <li className="mb-2">✓ Customer Satisfaction</li>
              <li className="mb-2">✓ Innovation</li>
              <li className="mb-2">✓ Sustainability</li>
              <li className="mb-2">✓ Community Support</li>
            </ul>
          </div>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <div className="text-center p-4">
            <h3 className="h5 mb-3">Quality Products</h3>
            <p>
              We carefully select each product to ensure it meets our high standards
              of quality and value.
            </p>
          </div>
        </Col>
        <Col md={4} className="mb-4">
          <div className="text-center p-4">
            <h3 className="h5 mb-3">Fast Shipping</h3>
            <p>
              Quick and reliable delivery to your doorstep, with real-time tracking
              for your peace of mind.
            </p>
          </div>
        </Col>
        <Col md={4} className="mb-4">
          <div className="text-center p-4">
            <h3 className="h5 mb-3">24/7 Support</h3>
            <p>
              Our dedicated customer service team is always ready to assist you
              with any questions or concerns.
            </p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <h2 className="h4 mb-4">Join Our Community</h2>
          <p className="mb-4">
            We're more than just a store - we're a community of satisfied customers
            who trust us for their shopping needs. Join us today and experience
            the RM Store difference!
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage; 