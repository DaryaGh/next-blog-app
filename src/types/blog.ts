export interface Blog {
    id: number;
    title: string;
    category: string;
    tags: string[];
    image: string;
    summary: string;
    slug: string;
    gallery: string[];
}

export type Category = string
export type Tag = string