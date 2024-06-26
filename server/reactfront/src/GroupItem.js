// src/GroupItem.js

import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Container, Form, ListGroup, Row} from 'react-bootstrap';
import './index.css'; // Custom CSS for styling
import {Header} from './components/Header';
import {Balance} from './components/Balance';
import {IncomeExpenses} from './components/IncomeExpenses';
import {TransactionList} from './components/TransactionList';
import {AddTransaction} from './components/AddTransaction';
import {GlobalProvider} from './context/GlobalState';
import 'bootstrap/dist/css/bootstrap.min.css';
import './context/ExpenseTracker.css';

const GroupItem = ({ group, deleteGroup, addMember, updateMembers, removeMember }) => {
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
        addMember(newMemberName);
        setNewMemberName('');
    };

    const handleRemoveMember = (memberName) => {
        removeMember(memberName);
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
                                <ListGroup.Item key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{member.toString()} - Owing: ${member.amountOwing} / Owed: ${member.amountOwed}</span>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            padding: '0',
                                            fontSize: '12px',
                                            lineHeight: '24px',
                                            textAlign: 'center',
                                            verticalAlign: 'middle'
                                        }}
                                        onClick={() => handleRemoveMember(member.toString())}
                                    >
                                        &times;
                                    </Button>
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
