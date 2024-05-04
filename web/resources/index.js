import axios from 'axios'
import qs from "qs"

export class AxiosWrapper {
    constructor(baseURL) {
        this.instance = axios.create({
            baseURL: baseURL,
            withCredentials: true,
            timeout: 5000, // You can adjust the timeout as needed
        });
    }

    // Custom methods for HTTP requests
    async get(url, params, config = {}) {
        try {
            const queryParams = qs.stringify(params);
            const fullUrl = queryParams ? `${url}?${queryParams}` : url;
            const response = await this.instance.get(fullUrl, config);
            return response.data;
        } catch (error) {
            throw this.handleRequestError(error);
        }
    }

    async post(url, data = {}, config = {}) {
        try {
            const response = await this.instance.post(url, data, {
                ...config, headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw this.handleRequestError(error);
        }
    }

    async put(url, data = {}, config = {}) {
        try {
            const response = await this.instance.put(url, data, config);
            return response.data;
        } catch (error) {
            throw this.handleRequestError(error);
        }
    }

    async delete(url, config = {}) {
        try {
            const response = await this.instance.delete(url, config);
            return response.data;
        } catch (error) {
            throw this.handleRequestError(error);
        }
    }

    // Handle request errors
    handleRequestError(error) {
        // Add your custom error handling logic here
        const errorMessage = error.response?.data?.message || false

        if (errorMessage) {
            return { status: error.response.status, message: errorMessage }
        }

        throw error;
    }
}