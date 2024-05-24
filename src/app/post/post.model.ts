export interface Post {
    _id: string;
    title: string;
    content: string;
    imageUrl?: string;
    videoUrl?: string; // Add the videoUrl property
    createdAt: Date;
    updatedAt?: Date;
    token?: string;
    category: string;
}
