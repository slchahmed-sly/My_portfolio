import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const fetchTimelineEvents = async () => {
    try {
        const response = await axios.get(`${API_URL}/timeline/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching timeline events:", error);
        return [];
    }
};

export const fetchSkills = async () => {
    try {
        const response = await axios.get(`${API_URL}/skills/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching skills:", error);
        return [];
    }
};

export const fetchProjects = async () => {
    try {
        const response = await axios.get(`${API_URL}/projects/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
};

export const fetchProjectBySlug = async (slug) => {
    try {
        const response = await axios.get(`${API_URL}/projects/${slug}/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching project details:", error);
        return null;
    }
};

export const sendContactMessage = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/contact/`, data);
        return response.data;
    } catch (error) {
        console.error("Error sending contact message:", error);
        throw error;
    }
};

export const fetchPosts = async () => {
    try {
        const response = await axios.get(`${API_URL}/posts/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
};

export const fetchPostBySlug = async (slug) => {
    try {
        const response = await axios.get(`${API_URL}/posts/${slug}/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching post details:", error);
        return null;
    }
};

export const createComment = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/comments/`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
};
