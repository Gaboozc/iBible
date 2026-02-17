'use server';

import path from 'node:path';
import { generateBibleCatalog } from '@/lib/bible/catalog-generator';

export interface ChapterLink {
  number: number;
  slug: string;
  available: boolean;
}

export interface BookEntry {
  id: string;
  testamentId: string;
  name: string;
  abbreviation: string;
  slug: string;
  description: string;
  descriptionEs?: string;
  descriptionEn?: string;
  chapters: ChapterLink[];
}

export interface TestamentEntry {
  id: string;
  name: string;
  slug: string;
  order: number;
  books: BookEntry[];
}

let catalogCache: TestamentEntry[] | null = null;

export async function getBibleCatalog(): Promise<TestamentEntry[]> {
  if (!catalogCache) {
    const biblePath = path.join(process.cwd(), 'data', 'bible');
    catalogCache = generateBibleCatalog(biblePath) as TestamentEntry[];
  }
  return catalogCache;
}
