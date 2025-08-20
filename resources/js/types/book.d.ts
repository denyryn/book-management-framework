import { type Author } from './author';
import { type Category } from './category';
import { type Publisher } from './publisher';

export interface Book {
    id: number;
    title: string;
    slug: string;
    author_id: number;
    publisher_id: number;
    category_id: number;
    cover_image?: string | null;
    publication_date?: string | null; // ISO date string
    number_of_pages?: number | null;
    created_at: string;
    updated_at: string;

    // Relations
    author?: Author;
    publisher?: Publisher;
    category?: Category;
}
