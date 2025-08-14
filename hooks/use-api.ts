import { axiosInstance } from "@/services/axios-instance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetSharedUsersResponse } from "@/types/album";
import { UnshareAlbumRequest } from "@/types/user";

// Base API hook for making HTTP requests
export const useApi = () => {
    return {
        get: async (url: string, params?: any) => {
            const response = await axiosInstance.get(url, { params });
            return response.data;
        },
        post: async (url: string, data?: any) => {
            const response = await axiosInstance.post(url, data);
            return response.data;
        },
        put: async (url: string, data?: any) => {
            const response = await axiosInstance.put(url, data);
            return response.data;
        },
        delete: async (url: string) => {
            const response = await axiosInstance.delete(url);
            return response.data;
        }
    };
};

// Album sharing hook
export const useAlbumShare = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ albumId, userIds }: { albumId: string; userIds: string[] }) => {
            const response = await axiosInstance.post(`/albums/${albumId}/share`, {
                albumId,
                userIdsToShareWith: userIds
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            // Invalidate album queries to reflect new sharing status
            queryClient.invalidateQueries({ queryKey: ["album", variables.albumId] });
            queryClient.invalidateQueries({ queryKey: ["albums"] });
        }
    });
};

// Album unsharing hook
export const useAlbumUnshare = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ albumId, userIds }: { albumId: string; userIds: string[] }) => {
            const response = await axiosInstance.post(`/albums/${albumId}/unshare`, {
                albumId,
                userIdsToRemove: userIds
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            // Invalidate album queries to reflect new sharing status
            queryClient.invalidateQueries({ queryKey: ["album", variables.albumId] });
            queryClient.invalidateQueries({ queryKey: ["albums"] });
        }
    });
};

// User search hook
export const useSearchUsers = (searchTerm: string) => {
    return useQuery({
        queryKey: ["users", "search", searchTerm],
        queryFn: async () => {
            if (!searchTerm || searchTerm.trim().length < 2) return { users: [] };

            const response = await axiosInstance.get("/users", {
                params: { search: searchTerm, limit: "10", offset: "0" }
            });
            return response.data;
        },
        enabled: !!searchTerm && searchTerm.trim().length >= 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

import {
    GetPhotosQuery,
    // AddPhotoRequest,
    DeletePhotoRequest,
    PhotosResponse,
    AddPhotoParams
} from "@/types/photo";
import { Album } from "@/types/album";

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
        mutationFn: async (formData: FormData) => {
            const token = localStorage.getItem("token");

            const response = await axiosInstance.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
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
export const useDeleteData = (url: string) => {
    return useMutation({
        mutationFn: async (id: string) => {
            const finalUrl = url.replace(":id", id)
            const response = await axiosInstance.delete(finalUrl)
            return response.data
        }
    })
}

export const useUploadPutData = (url: string) => {
    return useMutation({
        mutationFn: async (params: { id: string; formData: FormData }) => {
            const finalUrl = url.replace(":id", params.id)
            const response = await axiosInstance.put(finalUrl, params.formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            return response.data
        }
    })
}

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
        enabled: !!url,
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

// Photo Management Functions
export const useGetPhotos = (albumId: string, query: GetPhotosQuery = {}) => {
    return useQuery({
        queryKey: ["photos", albumId, query],
        queryFn: async (): Promise<PhotosResponse> => {
            const response = await axiosInstance.get(`/photos/${albumId}/photos`, {
                params: query,
            });
            return response.data.data; // Extract the nested data from the API response
        },
        enabled: !!albumId,
    });
};

export const useAddPhoto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ albumId, formData }: AddPhotoParams) => {
            const response = await axiosInstance.post(
                `/photos/${albumId}/add-photo`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // Let axios set this correctly
                    },
                }
            );
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["photos", variables.albumId] });
            queryClient.invalidateQueries({ queryKey: ["albums"] });
        },
    });
};

export const useDeletePhoto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ albumId, photoId }: DeletePhotoRequest) => {
            console.log('Attempting to delete photo:', { albumId, photoId });
            try {
                const response = await axiosInstance.delete(`/photos/${albumId}/delete-photos/${photoId}`);
                console.log('Delete photo response:', response);
                return response.data;
            } catch (error) {
                console.error('Delete photo error:', error);
                throw error;
            }
        },
        onSuccess: (_, variables) => {
            console.log('Photo deleted successfully, invalidating queries');
            // Invalidate and refetch photos for the album
            queryClient.invalidateQueries({ queryKey: ["photos", variables.albumId] });
            // Also invalidate album data to update photo count
            queryClient.invalidateQueries({ queryKey: ["albums"] });
        },
        onError: (error) => {
            console.error('Delete photo mutation error:', error);
        }
    });
};

// Album management hooks
export const useGetAlbum = (albumId: string) => {
    return useQuery({
        queryKey: ["album", albumId],
        queryFn: async (): Promise<Album> => {
            console.log('Fetching album:', albumId);
            try {
                const response = await axiosInstance.get(`/albums/${albumId}`);
                console.log('Album response:', response);
                return response.data.data; // Extract the nested data from the API response
            } catch (error) {
                console.error('Failed to fetch album:', error);
                throw error;
            }
        },
        enabled: !!albumId,
    });
};

export const useGetAlbums = (query: { search?: string; page?: string; limit?: string } = {}) => {
    return useQuery({
        queryKey: ["albums", query],
        queryFn: async (): Promise<{ albums: Album[]; total: number; page: number; limit: number; totalPages: number }> => {
            console.log('Fetching albums with query:', query);
            try {
                const response = await axiosInstance.get("/albums/album", {
                    params: query,
                });
                console.log('Albums response:', response);
                return response.data.data; // Extract the nested data from the API response
            } catch (error: any) {
                console.error('Failed to fetch albums:', error);

                // Check if it's an auth error
                if (error.message?.includes('Authentication failed') ||
                    error.message?.includes('Token refresh failed') ||
                    error.response?.status === 401) {
                    console.log('Auth error in albums fetch, will be handled by interceptor');
                }

                throw error;
            }
        },
        retry: (failureCount, error: any) => {
            // Don't retry on auth errors
            if (error.message?.includes('Authentication failed') ||
                error.message?.includes('Token refresh failed') ||
                error.response?.status === 401) {
                return false;
            }
            // Retry up to 2 times for other errors
            return failureCount < 2;
        },
    });
};

export const useDeleteAlbum = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (albumId: string) => {
            console.log('Attempting to delete album:', albumId);
            try {
                const response = await axiosInstance.delete(`/albums/${albumId}`);
                console.log('Delete album response:', response);
                return response.data;
            } catch (error) {
                console.error('Delete album error:', error);
                throw error;
            }
        },

        onSuccess: (data, albumId) => {
            console.log('Album deleted successfully, invalidating queries');
            queryClient.invalidateQueries({ queryKey: ["albums"] });
        },
        onError: (error) => {
            console.error('Delete album mutation error:', error);
        }
    });
};

export const useEditAlbum = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ albumId, data }: { albumId: string; data: { title: string; description: string; file?: File } }) => {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);

            if (data.file) {
                formData.append("file", data.file);
            }

            const response = await axiosInstance.put(`/albums/${albumId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["albums"] });
            queryClient.invalidateQueries({ queryKey: ["album", variables.albumId] });
        },
    });
};

export const useCreateAlbum = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { title: string; description: string; file?: File }) => {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);

            if (data.file) {
                formData.append("coverImage", data.file);
            }

            const response = await axiosInstance.post("/albums/album", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["albums"] });
        },
    });
};

// Get shared users hook
export const useGetSharedUsers = (albumId: string) => {
    return useQuery({
        queryKey: ["shared-users", albumId],
        queryFn: async (): Promise<GetSharedUsersResponse> => {
            const response = await axiosInstance.get(`/albums/${albumId}/shared`);
            return response.data;
        },
        enabled: !!albumId,
    });
};

// Remove shared user hook
export const useRemoveSharedUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UnshareAlbumRequest) => {
            const response = await axiosInstance.post(`/albums/${data.albumId}/unshare`, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            // Invalidate shared users query to reflect changes
            queryClient.invalidateQueries({ queryKey: ["shared-users", variables.albumId] });
            queryClient.invalidateQueries({ queryKey: ["album", variables.albumId] });
            queryClient.invalidateQueries({ queryKey: ["albums"] });
        },
    });
};
