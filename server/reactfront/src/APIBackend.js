// src/apiService.js
import authAxios from './authAxios';

// Get all groups
export const getGroups = async () => {
    try {
        const response = await authAxios.get('/api/groups');
        return response.data;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
    }
};

// Get a group by ID
export const getGroupById = async (groupId) => {
    try {
        const response = await authAxios.get(`/api/groups/${groupId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching group with ID ${groupId}:`, error);
        throw error;
    }
};

// Create a new group
export const createGroup = async (groupData) => {
    try {
        const response = await authAxios.post('/api/groups', groupData);
        return response.data;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
};

// Update a group
export const updateGroup = async (groupId, groupData) => {
    try {
        const response = await authAxios.patch(`/api/groups/${groupId}`, groupData);
        return response.data;
    } catch (error) {
        console.error(`Error updating group with ID ${groupId}:`, error);
        throw error;
    }
};

// Delete a group
export const deleteGroup = async (groupId) => {
    try {
        const response = await authAxios.delete(`/api/groups/${groupId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting group with ID ${groupId}:`, error);
        throw error;
    }
};
