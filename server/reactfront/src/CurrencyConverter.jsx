import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import authAxios from './authAxios';

const CurrencyConverter = () => {
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [convertedAmount, setConvertedAmount] = useState('');

    const handleConvert = async () => {
        try {
            const response = await authAxios.get(`http://localhost:3000/api/currency/convert?currencyIn=${fromCurrency}&currencyOut=${toCurrency}&amount=${amount}`);
            setConvertedAmount(response.data.convertedAmount);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={6}>
                    <h2>Currency Converter</h2>
                    <Form>
                        <Form.Group>
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>From Currency</Form.Label>
                            <Form.Control
                                as="select"
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                {/* Add more currencies as needed */}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>To Currency</Form.Label>
                            <Form.Control
                                as="select"
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                {/* Add more currencies as needed */}
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" onClick={handleConvert}>
                            Convert
                        </Button>
                    </Form>
                    {convertedAmount && (
                        <p className="mt-3">
                            Converted Amount: {convertedAmount} {toCurrency}
                        </p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default CurrencyConverter;