import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function Home() {

    return (
        <Container className="text-center my-5">
            <Row>
                <Col><h1>Welcome</h1></Col>
            </Row>   
            <Row>
                <Col md={6} className="bg-primary text-white p-4">
                    <h2>Recent Transactions</h2>
                    <p>This is a visually appealing layout using the grid system approach.</p>
                    <Button variant="light">More</Button>
                </Col>
                <Col md={6} className="bg-secondary text-white p-4">
                    <h2>New messages</h2>
                    <p>Responsive and stunning design to enhance user experience.</p>
                    <Button variant="light">Explore</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;