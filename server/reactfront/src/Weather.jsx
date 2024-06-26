import React, {useEffect, useState} from 'react';
import {Form, Button, Container, Row, Col} from 'react-bootstrap';

function Weather() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [selectedItem, setSelectedItem] = useState('');
    const [recommendation, setRecommendation] = useState('');
    const [error, setError] = useState(null);

    const apiKey = 'kltMisTLf100bVJ77KEjhhz600YCbiHx';

    const fetchWeatherData = () => {
        if (city) {
            const options = {
                method: 'GET',
                headers: {accept: 'application/json'}
            };

            fetch(`https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=${apiKey}`, options)
                .then(response => response.json())
                .then(data => {
                    setWeatherData(data);
                })
                .catch(err => {
                    setError(err);
                    console.error(err);
                });
        }
    };

    const recommend = () => {
        if (weatherData && weatherData.data && weatherData.data.values) {
            const weatherCode = weatherData.data.values.weatherCode;
            let message;

            if (selectedItem === 'umbrella' && (weatherCode === 4001 || weatherCode === 4200 || weatherCode === 4201)) {
                message = 'Yes it is raining, buy an umbrella!';
            } else if (selectedItem === 'sunglasses' && (weatherCode === 1000 || weatherCode === 1100)) {
                message = 'Yes is sunny, buy sunglasses!';
            } else if (selectedItem === 'mittens' && (weatherCode === "5000" || weatherCode === "5100" || weatherCode === "5101")) {
                message = 'Yes it is snowing, buy mittens!';
            } else if (selectedItem === 'raincoat' && (weatherCode === 4001 || weatherCode === 4200 || weatherCode === 4201)) {
                message = 'Yes it is raining, buy an raincoat!';
            } else if (selectedItem === 'lightening rod' && (weatherCode === 8000)) {
                message = 'Yes it is stormy, buy an lightening rod!';
            } else if (selectedItem === 'Please choose') {
                message = '';
            } else message = 'The current weather does not give a clear indication!';
            setRecommendation(message);
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={6}>
                    <h2>Should you buy...</h2>
                    <Form>
                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Items to Buy</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedItem}
                                onChange={(e) => setSelectedItem(e.target.value)}
                            >
                                <option value="Please choose">Please choose</option>
                                <option value="umbrella">umbrella</option>
                                <option value="sunglasses">sunglasses</option>
                                <option value="raincoat">raincoat</option>
                                <option value="mittens">mittens</option>
                                <option value="lightening rod">lightening rod</option>

                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" onClick={() => {
                            fetchWeatherData();
                            recommend();
                        }}>
                            Check!
                        </Button>
                    </Form>
                    {recommendation && <p>{recommendation}</p>}
                    {error && <p>Error: {error.message}</p>}
                </Col>
            </Row>
        </Container>
    );
}

export default Weather;
