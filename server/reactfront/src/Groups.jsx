// src/Groups.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Tabs, Tab } from 'react-bootstrap';
import './index.css';
import GroupItem from './GroupItem';
import authAxios from './authAxios';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [activeKey, setActiveKey] = useState('');
    const [newGroupTitle, setNewGroupTitle] = useState('');

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await authAxios.get('/api/groups');
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
        };
        try {
            const response = await authAxios.post('/api/groups', newGroup);
            setGroups([...groups, response.data.newGroup]);
            setNewGroupTitle('');
            setActiveKey(response.data.newGroup.GroupId);
        } catch (error) {
            console.error('Error adding group:', error);
        }
    };

    const deleteGroup = async (groupId) => {
        try {
            await authAxios.delete(`/api/groups/${groupId}`);
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

    const addMemberToGroup = async (groupId, member) => {
        try {
            const groupToUpdate = groups.find(group => group.GroupId === groupId);
            const updatedMembers = [...groupToUpdate.Members, member];
            const response = await authAxios.put(`/api/groups/${groupId}`, {
                ...groupToUpdate,
                Members: updatedMembers
            });
            setGroups(prevGroups =>
                prevGroups.map(group =>
                    group.GroupId === groupId ? response.data.group : group
                )
            );
        } catch (error) {
            console.error('Error adding member to group:', error);
        }
    };

    const removeMemberFromGroup = async (groupId, memberName) => {
        try {
            const groupToUpdate = groups.find(group => group.GroupId === groupId);
            const updatedMembers = groupToUpdate.Members.filter(member => member !== memberName);

            const response = await authAxios.patch(`/api/groups/${groupId}`, {
                Members: updatedMembers
            });

            setGroups(prevGroups =>
                prevGroups.map(group =>
                    group.GroupId === groupId ? { ...group, Members: updatedMembers } : group
                )
            );
        } catch (error) {
            console.error('Error removing member from group:', error);
        }
    };



    const updateGroupMembers = (groupId, updatedMembers) => {
        setGroups(groups.map(group =>
            group.GroupId === groupId ? { ...group, Members: updatedMembers } : group
        ));
    };

    return (
        <Container fluid className="groups-container whiteBackground">
            <Row>
                <Col className="text-center">
                    <h2>Groups</h2>
                </Col>
            </Row>
            <Row>
                <Tabs
                    activeKey={activeKey}
                    onSelect={(k) => setActiveKey(k)}
                    id="group-tabs"
                    className="mb-3">
                    {Array.isArray(groups) && groups.map(group => (
                        <Tab key={group.GroupId} eventKey={group.GroupId} title={group.GroupName}>
                            <GroupItem
                                group={group}
                                deleteGroup={() => deleteGroup(group.GroupId)}
                                addMember={(member) => addMemberToGroup(group.GroupId, member)}
                                removeMember={(memberName) => removeMemberFromGroup(group.GroupId, memberName)}
                                updateMembers={(updatedMembers) => updateGroupMembers(group.GroupId, updatedMembers)}
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
