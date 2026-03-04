// Storage for verse-specific notes

export interface VerseNote {
  id: string; // UUID
  bookSlug: string;
  chapter: number;
  verse: number;
  text: string;
  createdAt: number;
  updatedAt: number;
}

export interface VersesWithNotes {
  bookSlug: string;
  chapter: number;
  verse: number;
  noteCount: number;
}

const NOTES_STORAGE_KEY = 'ibible:verse-notes';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getAllNotes(): VerseNote[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(NOTES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveAllNotes(notes: VerseNote[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

export function getVerseNotes(bookSlug: string, chapter: number, verse: number): VerseNote[] {
  const allNotes = getAllNotes();
  return allNotes.filter(
    (n) => n.bookSlug === bookSlug && n.chapter === chapter && n.verse === verse
  );
}

export function addVerseNote(
  bookSlug: string,
  chapter: number,
  verse: number,
  text: string
): VerseNote {
  const allNotes = getAllNotes();
  const newNote: VerseNote = {
    id: generateId(),
    bookSlug,
    chapter,
    verse,
    text,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  allNotes.push(newNote);
  saveAllNotes(allNotes);
  return newNote;
}

export function updateVerseNote(noteId: string, newText: string): VerseNote | null {
  const allNotes = getAllNotes();
  const note = allNotes.find((n) => n.id === noteId);
  if (!note) return null;
  note.text = newText;
  note.updatedAt = Date.now();
  saveAllNotes(allNotes);
  return note;
}

export function deleteVerseNote(noteId: string): boolean {
  const allNotes = getAllNotes();
  const index = allNotes.findIndex((n) => n.id === noteId);
  if (index === -1) return false;
  allNotes.splice(index, 1);
  saveAllNotes(allNotes);
  return true;
}

export function getAllVersesWithNotes(): VersesWithNotes[] {
  const allNotes = getAllNotes();
  const grouped = new Map<string, number>();

  allNotes.forEach((note) => {
    const key = `${note.bookSlug}:${note.chapter}:${note.verse}`;
    grouped.set(key, (grouped.get(key) || 0) + 1);
  });

  return Array.from(grouped.entries()).map(([key, count]) => {
    const [bookSlug, chapter, verse] = key.split(':');
    return {
      bookSlug,
      chapter: parseInt(chapter, 10),
      verse: parseInt(verse, 10),
      noteCount: count,
    };
  });
}

export function getNotesForChapter(bookSlug: string, chapter: number): VerseNote[] {
  const allNotes = getAllNotes();
  return allNotes.filter((n) => n.bookSlug === bookSlug && n.chapter === chapter);
}

export function getNotesForBook(bookSlug: string): VerseNote[] {
  const allNotes = getAllNotes();
  return allNotes.filter((n) => n.bookSlug === bookSlug);
}
