import axios from "axios";
import { toast } from "sonner";

export const baseUrl = "http://localhost:4000/";

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

export const setToken = (token: string, refreshToken: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("Refresh-token", refreshToken);
};

export const clearTokens = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Refresh-token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
};

const attachToken = (config: any) => {
    const token = localStorage.getItem("token")?.trim();

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        console.log('Attaching token to request:', config.url);
    } else {
        console.log('No token found for request:', config.url);
    }
    return config;
};

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    failedQueue = [];
};

const refreshToken = async (): Promise<string | null> => {
    try {
        const refreshTokenValue = localStorage.getItem("Refresh-token")?.trim();
        if (!refreshTokenValue) {
            return null;
        }

        const response = await axios.post(`${baseUrl}auth/refresh-token`, {
            refreshToken: refreshTokenValue,
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;

        if (newToken) {
            setToken(newToken, newRefreshToken);
            return newToken;
        }
        return null;
    } catch (error) {
        console.error("Token refresh failed:", error);
        return null;
    }
};

let isShowingError = false;
const errorResetTimeout = 5000; // 5 seconds

const handleError = async (error: any) => {
    if (!error.response) {
        if (error.message === "Network Error") {
            toast.error("Network Error");
        }
        return Promise.reject(
            error instanceof Error ? error : new Error(error.message)
        );
    }

    const { status, data } = error.response;
    const originalRequest = error.config;

    // Handle 401 errors with token refresh
    if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            // If already refreshing, add to queue
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
                return axiosInstance(originalRequest);
            }).catch((err) => {
                return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const newToken = await refreshToken();
            if (newToken) {
                processQueue(null, newToken);
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } else {
                // Refresh failed, redirect to login
                processQueue(new Error("Token refresh failed"), null);
                clearTokens();
                if (window.location.pathname !== "/auth/login") {
                    window.location.href = "/auth/login";
                }
                return Promise.reject(new Error("Authentication failed"));
            }
        } catch (refreshError) {
            processQueue(refreshError, null);
            clearTokens();
            if (window.location.pathname !== "/auth/login") {
                window.location.href = "/auth/login";
            }
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }

    // Handle other errors
    const messages: Record<number, string> = {
        500: "Internal Server Error: Please try again later.",
        502: "Bad Gateway: Please try again later.",
    };

    const errorMessage =
        data?.message ||
        messages[status as keyof typeof messages] ||
        "An unexpected error occurred.";

    if (!isShowingError) {
        isShowingError = true;

        toast.error(errorMessage, {
            position: "top-right",
        });

        setTimeout(() => {
            isShowingError = false;
        }, errorResetTimeout);
    }

    return Promise.reject(new Error(errorMessage));
};

axiosInstance.interceptors.request.use(attachToken, Promise.reject);
axiosInstance.interceptors.response.use((res) => res, handleError);

export { axiosInstance };
