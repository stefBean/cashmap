// src/GroupItem.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Form, Button } from 'react-bootstrap';
import './index.css'; // Custom CSS for styling
import { Header } from './components/Header';
import { Balance } from './components/Balance';
import { IncomeExpenses } from './components/IncomeExpenses';
import { TransactionList } from './components/TransactionList';
import { AddTransaction } from './components/AddTransaction';
import { GlobalProvider } from './context/GlobalState';
import 'bootstrap/dist/css/bootstrap.min.css';
import './context/ExpenseTracker.css';

const GroupItem = ({ group, deleteGroup, addMember, updateMembers }) => {
    const [newExpense, setNewExpense] = useState('');
    const [newMemberName, setNewMemberName] = useState('');
    const [joke, setJoke] = useState('');

    useEffect(() => {
        // Fetch initial data or perform other side effects here
    }, []); // Empty dependency array means this effect runs only once, like componentDidMount

    const addExpense = () => {
        if (newExpense.trim() === '') {
            return; // Prevent adding empty expenses
        }

        const expense = {
            description: newExpense,
            amount: Math.floor(Math.random() * 100) + 1, // Random amount for demo
            type: 'spend' // Assuming all added expenses are spends for now
        };

        const updatedMembers = group.Members.map(member => ({
            ...member,
            amountOwing: member.amountOwing + Math.floor(Math.random() * 10),
            amountOwed: member.amountOwed + Math.floor(Math.random() * 10)
        }));
        updateMembers(group.GroupId, updatedMembers);
        setNewExpense('');
    };

    const handleAddMember = () => {
        if (newMemberName.trim() === '') {
            return;
        }

        const newMember = { name: newMemberName, amountOwing: 0, amountOwed: 0 };
        addMember(newMember);
        setNewMemberName('');
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
                        <Header />
                        <div className="container">
                            <Balance />
                            <IncomeExpenses />
                            <TransactionList />
                            <AddTransaction />
                        </div>
                    </GlobalProvider>
                </Col>
                <Col xs={12} md={6} className="right-sidebar">
                    <h3>Group Members</h3>
                    <Card style={{ width: '18rem' }}>
                        <ListGroup variant="flush">
                            {group.Members.map((member, index) => (
                                <ListGroup.Item key={index}>
                                    {member.name} - Owing: ${member.amountOwing} / Owed: ${member.amountOwed}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                    <Form className="mt-3">
                        <Form.Group controlId="formMemberName">
                            <Form.Label>New Member Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter member name"
                                value={newMemberName}
                                onChange={(e) => setNewMemberName(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" className="mt-2" onClick={handleAddMember}>
                            Add Member
                        </Button>
                    </Form>
                    <Button variant="danger" className="mt-3" onClick={deleteGroup}>
                        Delete Group
                    </Button>
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
