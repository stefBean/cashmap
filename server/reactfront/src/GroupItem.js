// src/Groups.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Form, Button } from 'react-bootstrap';
import './index.css'; // Custom CSS for styling
import {Header} from './components/Header'
import{Balance} from './components/Balance'
import {IncomeExpenses} from './components/IncomeExpenses'
import {TransactionList} from './components/TransactionList'
import{AddTransaction} from './components/AddTransaction'
import{GlobalProvider} from './context/GlobalState'
import 'bootstrap/dist/css/bootstrap.min.css';
import './context/ExpenseTracker.css';


const GroupItem = () => {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState('');
    const [lastExpenses, setLastExpenses] = useState([]);
    const [people, setPeople] = useState([
        { name: 'Aida', amountOwed: 0, amountOwing: 0 },
        { name: 'Tobias', amountOwed: 0, amountOwing: 0 },
        { name: 'Anna', amountOwed: 0, amountOwing: 0 }
        // Add more members as needed
    ]);
    const [joke, setJoke] = useState('');

    const addExpense = () => {
        if (newExpense.trim() === '') {
            return; // Prevent adding empty expenses
        }

        const expense = {
            description: newExpense,
            amount: Math.floor(Math.random() * 100) + 1, // Random amount for demo
            type: 'spend' // Assuming all added expenses are spends for now
        };

        setExpenses([expense, ...expenses.slice(0, 4)]); // Add new expense to expenses list
        setLastExpenses([newExpense, ...lastExpenses.slice(0, 4)]); // Add new expense description to lastExpenses list
        setNewExpense(''); // Clear input field

        // Update people's amounts (demo: randomly assign amounts owed)
        const updatedPeople = people.map(person => ({
            ...person,
            amountOwing: person.amountOwing + Math.floor(Math.random() * 10),
            amountOwed: person.amountOwed + Math.floor(Math.random() * 10)
        }));
        setPeople(updatedPeople);
    };

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
        <Container fluid className="groups-container">
            
            <Row>
                <Col xs={12} md={6} className="left-sidebar">
                    <GlobalProvider>
                    <Header/>
                    <div className="container">
                    <Balance/>
                    <IncomeExpenses/>
                    <TransactionList/>
                    <AddTransaction/>
                    </div>
                    </GlobalProvider>
                </Col>
                <Col xs={12} md={6} className="right-sidebar">
                    <h3>Group Members</h3>
                    <Card style={{ width: '18rem' }}>
                        <ListGroup variant="flush">
                                {people.map((person, index) => (
                                    <ListGroup.Item key={index}>
                                        {person.name} - Owing: ${person.amountOwing} / Owed: ${person.amountOwed}
                                    </ListGroup.Item>
                                ))}
                        </ListGroup>
                    </Card>
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
                </Col>
            </Row>                    
        </Container>
    );
};

export default GroupItem;
