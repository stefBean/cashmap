// src/Groups.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Tabs, Tab } from 'react-bootstrap';
import './index.css'; // Custom CSS for styling
import GroupItem from './GroupItem';
import authAxios from './authAxios';
import './index.css';


const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [activeKey, setActiveKey] = useState('');
    const [newGroupTitle, setNewGroupTitle] = useState('');

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await authAxios.get('/groups');
            console.log('Fetched groups:', response.data);
            const fetchedGroups = Object.values(response.data);
            setGroups(fetchedGroups);
            if (fetchedGroups.length > 0) {
                setActiveKey(fetchedGroups[0].GroupId);
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const addGroup = async () => {
        if (newGroupTitle.trim() === '') return;
        const newGroup = {
            GroupName: newGroupTitle,
            Members: [] // Initial members can be an empty array
        };
        try {
            const response = await authAxios.post('/groups', newGroup);
            setGroups([...groups, response.data.newGroup]);
            setNewGroupTitle('');
            setActiveKey(response.data.newGroup.GroupId);
        } catch (error) {
            console.error('Error adding group:', error);
        }
    };

    const deleteGroup = async (groupId) => {
        try {
            await authAxios.delete(`/groups/${groupId}`);
            setGroups(groups.filter(group => group.GroupId !== groupId));
            if (activeKey === groupId && groups.length > 1) {
                setActiveKey(groups[0].GroupId);
            } else if (groups.length === 1) {
                setActiveKey('');
            }
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    const addTransaction = async (groupId, transaction) => {
        try {
            const response = await authAxios.post(`/transactions/${groupId}`, transaction);
            const updatedGroup = { ...groups.find(group => group.GroupId === groupId) };
            updatedGroup.Transactions.push(response.data.transaction);
            setGroups(groups.map(group => (group.GroupId === groupId ? updatedGroup : group)));
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    return (
        <Container fluid className="groups-container whiteBackground">
            <Row>
                <Col className="text-center">
                    <h1 className="headline">Groups</h1>
                </Col>
            </Row>
            <Row>
                <Tabs
                    activeKey={activeKey}
                    onSelect={(k) => setActiveKey(k)}
                    id="group-tabs"
                    className="mb-3 whiteBackground">
                    {Array.isArray(groups) && groups.map(group => (
                        <Tab key={group.GroupId} eventKey={group.GroupId} title={group.GroupName}>
                            <GroupItem
                                group={group}
                                deleteGroup={() => deleteGroup(group.GroupId)}
                                addTransaction={(transaction) => addTransaction(group.GroupId, transaction)}
                            />
                        </Tab>
                    ))}
                    <Tab eventKey="add-group" title="+" className='whiteBackground'>
                        <Form className="p-3">
                            <Form.Group controlId="formGroupTitle">
                                <Form.Label>New Group Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter group title"
                                    value={newGroupTitle}
                                    onChange={(e) => setNewGroupTitle(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" className="mt-2" onClick={addGroup}>
                                Add Group
                            </Button>
                        </Form>
                    </Tab>
                </Tabs>
            </Row>
        </Container>
    );
};

export default Groups;
