import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const fetchTimelineEvents = async (lang = 'en') => {
    try {
        const response = await axios.get(`${API_URL}/timeline/`, {
            headers: { 'Accept-Language': lang }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching timeline events:", error);
        return [];
    }
};

export const fetchSkills = async (lang = 'en') => {
    try {
        const response = await axios.get(`${API_URL}/skills/`, {
            headers: { 'Accept-Language': lang }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching skills:", error);
        return [];
    }
};

export const fetchProjects = async (lang = 'en') => {
    try {
        const response = await axios.get(`${API_URL}/projects/`, {
            headers: { 'Accept-Language': lang }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
};

export const fetchProjectBySlug = async (slug, lang = 'en') => {
    try {
        const response = await axios.get(`${API_URL}/projects/${slug}/`, {
            headers: { 'Accept-Language': lang }
        });
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

export const fetchPosts = async (lang = 'en') => {
    try {
        const response = await axios.get(`${API_URL}/posts/`, {
            headers: { 'Accept-Language': lang }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
};

export const fetchPostBySlug = async (slug, lang = 'en') => {
    try {
        const response = await axios.get(`${API_URL}/posts/${slug}/`, {
            headers: { 'Accept-Language': lang }
        });
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
