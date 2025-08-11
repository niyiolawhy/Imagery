import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/services/axios-instance";
import { 
  Photo, 
  GetPhotosQuery, 
  AddPhotoRequest, 
  PhotosResponse 
} from "@/types/photo";

// Get photos for an album
export const useGetPhotos = (albumId: string, query: GetPhotosQuery = {}) => {
  return useQuery({
    queryKey: ["photos", albumId, query],
    queryFn: async (): Promise<PhotosResponse> => {
      const response = await axiosInstance.get(`/photos/${albumId}/photos`, {
        params: query,
      });
      return response.data;
    },
    enabled: !!albumId,
  });
};

// Add photo to album
export const useAddPhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AddPhotoRequest): Promise<Photo> => {
      const response = await axiosInstance.post(`/photos/${data.albumId}/add-photo`, {
        albumId: data.albumId,
        imageUrl: data.imageUrl,
        description: data.description,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch photos for the album
      queryClient.invalidateQueries({ queryKey: ["photos", variables.albumId] });
      // Also invalidate album data to update photo count
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
  });
};

// Get a single photo by ID
export const useGetPhoto = (photoId: string, albumId: string) => {
  return useQuery({
    queryKey: ["photo", photoId, albumId],
    queryFn: async (): Promise<Photo> => {
      const response = await axiosInstance.get(`/photos/${albumId}/photos/${photoId}`);
      return response.data;
    },
    enabled: !!photoId && !!albumId,
  });
};
