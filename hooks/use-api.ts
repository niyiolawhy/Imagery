import { axiosInstance } from "@/services/axios-instance";
import { useQuery, useMutation } from "@tanstack/react-query";


// Post Data
export const usePostData = (url: string) => {
    return useMutation({
        mutationFn: async (arg: any) => {
            const response = await axiosInstance.post(url, arg);
            return response.data;
        },
    });
};

export const usePostExportData = (url: string) => {
    return useMutation({
        mutationFn: async (arg: any) => {
            const response = await axiosInstance.post(url, arg, {
                responseType: "blob",
            });
            return response.data;
        },
    });
};

// Get Export Data
export const useGetExportData = (url: string) => {
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.get(url, {
                responseType: "blob",
            });
            return response.data;
        },
    });
};

// Upload Data
export const useUploadData = (url: string) => {
    return useMutation({
        mutationFn: async (arg: any) => {
            const response = await axiosInstance.post(url, arg, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
    });
};

export const useUploadPatchData = (url: string) => {
    return useMutation({
        mutationFn: async (arg: any) => {
            const response = await axiosInstance.patch(url, arg, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
    });
};

export const useUploadPutData = (url: string) => {
    return useMutation({
        mutationFn: async (arg: any) => {
            const response = await axiosInstance.put(url, arg, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
    });
};

// Update (PUT) Data
export const usePutData = (url: string) => {
    return useMutation({
        mutationFn: async (arg: any) => {
            const response = await axiosInstance.put(url, arg);
            return response.data;
        },
    });
};

// Update (PATCH) Data
export const usePatchData = (url: string) => {
    return useMutation({
        mutationFn: async (arg: any) => {
            const response = await axiosInstance.patch(url, arg);
            return response.data;
        },
    });
};

// Delete Data
export const useDeleteData = (url: string) => {
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.delete(url);
            return response.data;
        },
    });
};

// Get Data (Single Fetch)
export const useGetData = (url: string) => {
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.get(url);
            return response.data;
        },
    });
};

// Fetch Data (GET with Query)
export const useFetchData = (url: string, options?: any) => {
    const query = useQuery({
        queryKey: [url, options],
        queryFn: async () => {
            if (!url || url === "") {
                return { data: null, error: "URL cannot be empty", isLoading: false };
            }

            const response = await axiosInstance.get(url, {
                params: options,
            });
            return response.data;
        },
    });

    return { ...query, isLoading: query.isFetching || query.isLoading };
};

// Fetch Post Data (POST with Query)
export const useFetchPostData = (url: string, options: any) => {
    const query = useQuery({
        queryKey: [url, options],
        queryFn: async () => {
            const response = await axiosInstance.post(url, options);
            return response.data;
        },
    });

    return { ...query, isLoading: query.isFetching || query.isLoading };
};
