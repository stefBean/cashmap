// src/Groups.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Form, Button } from 'react-bootstrap';
import './index.css'; // Custom CSS for styling
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import GroupItem from './GroupItem';


const Groups = () => {
    return (
        <Container fluid className="groups-container">
            <Row>
                <Col className="text-center">
                <h2>Groups</h2>
                </Col>
            </Row>
            <Row>
                <Tabs
                    defaultActiveKey="profile"
                    id="uncontrolled-tab-example"
                    className="mb-3">
                    <Tab eventKey="home" title="Home">  
                        <GroupItem />              
                    </Tab>
                    <Tab eventKey="profile" title="School">
                        <GroupItem />
                    </Tab>
                    <Tab eventKey="contact" title="Holiday">
                        <GroupItem />
                    </Tab>
                </Tabs>
            </Row>
        </Container>
    );
};

export default Groups;
