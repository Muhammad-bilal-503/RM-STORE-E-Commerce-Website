import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="text-center mb-4">Contact Us</h1>
          <p className="lead text-center">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </Col>
      </Row>

      <Row>
        <Col lg={6} className="mb-4">
          <div className="bg-light p-4 rounded shadow-sm h-100">
            <h2 className="h4 mb-4">Get in Touch</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this regarding?"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Your message here..."
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </Form>
          </div>
        </Col>

        <Col lg={6}>
          <div className="bg-light p-4 rounded shadow-sm h-100">
            <h2 className="h4 mb-4">Contact Information</h2>
            
            <div className="mb-4">
              <h3 className="h5 mb-3">Address</h3>
              <p className="mb-0">
                123 Store Street<br />
                City, State 12345<br />
                Country
              </p>
            </div>

            <div className="mb-4">
              <h3 className="h5 mb-3">Phone</h3>
              <p className="mb-0">
                Customer Service: +1 (555) 123-4567<br />
                Support: +1 (555) 987-6543
              </p>
            </div>

            <div className="mb-4">
              <h3 className="h5 mb-3">Email</h3>
              <p className="mb-0">
                General Inquiries: info@rmstore.com<br />
                Support: support@rmstore.com<br />
                Sales: sales@rmstore.com
              </p>
            </div>

            <div>
              <h3 className="h5 mb-3">Business Hours</h3>
              <p className="mb-0">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage; 