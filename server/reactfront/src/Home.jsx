import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Card } from 'react-bootstrap';
import { useState } from 'react';
import './index.css';



function Home() {
    const [joke, setJoke] = useState('');


    const fetchJoke = () => {
        fetch('https://api.allorigins.win/get?url=https://www.yomama-jokes.com/api/v1/jokes/random/')
            .then(response => response.json())
            .then(data => {
                const parsedData = JSON.parse(data.contents);
                setJoke(parsedData.joke);
            })
            .catch(error => {
                console.error('Error fetching joke:', error);
            });
    };

    return (
        <Container fluid className="mt-5"> 
        <Row>
            <Col className="text-center">
                <h1 className="headline">Welcome to Cashmap</h1>
            </Col>
        </Row>
        <Row className="justify-content-center"> 
            <Col xs={12} md={6} lg={4}> 
                <Card> 
                    <Card.Body> 
                        <Card.Title>Latest Transactions</Card.Title> 
                        <Card.Text> 
                            Check out the latest transactions.
                            <Button variant="primary" href="/group">View Transactions</Button>
                        </Card.Text> 
                    </Card.Body> 
                </Card> 
            </Col> 
            <Col xs={12} md={6} lg={4}> 
                <Card> 
                    <Card.Body> 
                        <Card.Title>Missing some money?</Card.Title> 
                        <Card.Text> 
                            Friendly or wicket reminder to your friends to pay you back.
                            <Button variant="primary" className="mt-3" onClick={fetchJoke}>
                                Get Yo Mama Joke
                            </Button>
                            {joke && (
                                <Card className="mt-3">
                                    <Card.Body>
                                        <Card.Text>{joke}</Card.Text>
                                        <Button variant="secondary" onClick={() => window.location.href = `mailto:?body=${joke}`}>
                                            Send by Email
                                        </Button>
                                    </Card.Body>
                                </Card>
                            )}
                        </Card.Text> 
                    </Card.Body> 
                </Card> 
            </Col> 
        </Row> 
    </Container> 
    );
}

export default Home;