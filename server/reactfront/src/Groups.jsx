// src/Groups.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Form, Button } from 'react-bootstrap';
import './index.css'; // Custom CSS for styling
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import GroupItem from './GroupItem';

const Groups = () => {
    const [groups, setGroups] = useState([
        { key: 'home', title: 'Home', members: [] },
        { key: 'school', title: 'School' , members: [] },
        { key: 'holiday', title: 'Holiday', members: [] }
    ]);
    const [activeKey, setActiveKey] = useState(groups[0]?.key || 'home');
    const [newGroupTitle, setNewGroupTitle] = useState('');

    const addGroup = () => {
        const key = newGroupTitle.toLowerCase().replace(/\s+/g, '-');
        const newGroup = { key, title: newGroupTitle, members: [] };
        setGroups([...groups, newGroup]);
        setNewGroupTitle('');
        setActiveKey(key);
    };

    const deleteGroup = (key) => {
        setGroups(groups.filter(group => group.key !== key));
        if (activeKey === key && groups.length > 1) {
            setActiveKey(groups[0].key);
        } else if (groups.length === 1) {
            setActiveKey('');
        }
    };

    const addMemberToGroup = (key, member) => {
        setGroups(groups.map(group =>
        group.key === key ? { ...group, members: [...group.members, member] } : group));
    };

    return (
        <Container fluid className="groups-container">
            <Row>
                <Col className="text-center">
                    <h2>Groups</h2>
                </Col>
            </Row>
            <Row>
                <Tabs
                    activeKey={activeKey}
                    onSelect={(k) => setActiveKey(k)}
                    id="uncontrolled-tab-example"
                    className="mb-3">
                    {groups.map(group => (
                        <Tab key={group.key} eventKey={group.key} title={group.title}>
                            <GroupItem
                                group={group}
                                deleteGroup={() => deleteGroup(group.key)}
                                addMember={(member) => addMemberToGroup(group.key, member)}
                            />
                        </Tab>
                    ))}
                    <Tab eventKey="add-group" title="+">
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
