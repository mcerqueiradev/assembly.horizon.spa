export interface UserPost {
  id: string;
  userId: string;
  content: string;
  type: PostType;
  isActive: boolean;
  createdAt: string;
  likesCount: number;
  sharesCount: number;
  mediaUrl?: string;
}

export enum PostType {
  UserIdea = 0,
  NewProperty = 1,
  SystemUpdate = 2,
}

export interface UserPostResponse {
  responses: UserPost[];
}
