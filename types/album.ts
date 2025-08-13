export interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  photoCount?: number;
}

export interface SharedUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  sharedAt?: string;
}

export interface GetSharedUsersResponse {
  message: string;
  data: SharedUser[];
}

