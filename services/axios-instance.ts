import axios from "axios";
import { toast } from "sonner";


export const baseUrl = "http://localhost:4000/";

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const setToken = (token: string, refreshToken: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("Refresh-token", refreshToken);
};

const attachToken = (config: any) => {
    const token = localStorage.getItem("token")?.trim();
    const refreshToken = localStorage.getItem("Refresh-token")?.trim();

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (refreshToken) {
        config.headers["x-Refresh-Token"] = `Bearer ${refreshToken}`;
    }
    return config;
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
    if ((status === 401 || status === 502) && !originalRequest._retry) {
        // clear all toasts
        toast.dismiss();

        // Check if we're already on the login page
        const isOnLoginPage = window.location.pathname === "/auth/login";

        if (isOnLoginPage) {
            // Already on login page, just show toast
            console.log("on login page");
            toast.error(
                data?.message || "Login failed. Please check your credentials."
            );
        } else {
            // Not on login page, redirect to login
            localStorage.clear();
            window.location.href = "/auth/login";
        }
    }

    const messages: Record<number, string> = {
        500: "Internal Server Error: Please try again later.",
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
