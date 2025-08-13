export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthUser {
  email: string;
  name: string;
}

export interface ExtendedRequest {
  query: {
    search?: string;
    limit?: string;
    offset?: string;
  };
}

export interface ShareAlbumRequest {
  albumId: string;
  userIdsToShareWith: string[] | string;
}

export interface UnshareAlbumRequest {
  albumId: string;
  userIdsToRemove: string[] | string;
}
