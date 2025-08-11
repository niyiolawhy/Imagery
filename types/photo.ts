export interface Photo {
  id: string;
  albumId: string;
  imageUrl: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetPhotosQuery {
  page?: string;
  limit?: string;
  search?: string;
}

// // For the frontend API call arguments, use this type:
export interface AddPhotoParams {
  albumId: string;
  formData: FormData;
}


export interface DeletePhotoRequest {
  albumId: string;
  photoId: string;
}

export interface PhotosResponse {
  photos: Photo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
