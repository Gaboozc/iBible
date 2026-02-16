'use server';

import { getBibleCatalog } from '@/data/bibleCatalog';

export async function fetchBibleCatalog() {
  return getBibleCatalog();
}
