type Language = 'es' | 'en';
type BibleVersion = 'rv1909' | 'kjv';
type ThemeMode = 'light' | 'dark';

type Preferences = {
  language: Language;
  bibleVersion: BibleVersion;
  theme: ThemeMode;
  lastViewedChapter?: string | null;
};

type AppData = {
  version: 1;
  preferences: Preferences;
  progress: {
    readChapters: string[];
  };
  reflections: Record<string, Record<string, string>>;
  notes: Record<string, string>;
  downloads: {
    bibleVersions: Record<string, { downloaded: boolean; updatedAt: string | null }>;
  };
};

const STORAGE_KEY = 'myscriptum:data';

const defaultData: AppData = {
  version: 1,
  preferences: {
    language: 'es',
    bibleVersion: 'rv1909',
    theme: 'light',
  },
  progress: {
    readChapters: [],
  },
  reflections: {},
  notes: {},
  downloads: {
    bibleVersions: {
      rv1909: { downloaded: true, updatedAt: null },
      kjv: { downloaded: true, updatedAt: null },
    },
  },
};

const isBrowser = () => typeof window !== 'undefined';

export const hasStoredData = () => {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(STORAGE_KEY) !== null;
};

const mergeData = (raw: Partial<AppData>): AppData => {
  return {
    ...defaultData,
    ...raw,
    preferences: {
      ...defaultData.preferences,
      ...(raw.preferences ?? {}),
    },
    progress: {
      ...defaultData.progress,
      ...(raw.progress ?? {}),
    },
    reflections: raw.reflections ?? {},
    notes: raw.notes ?? {},
    downloads: {
      ...defaultData.downloads,
      ...(raw.downloads ?? {}),
      bibleVersions: {
        ...defaultData.downloads.bibleVersions,
        ...(raw.downloads?.bibleVersions ?? {}),
      },
    },
  };
};

const readStorage = (): AppData => {
  if (!isBrowser()) return defaultData;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return mergeData(parsed);
  } catch {
    return defaultData;
  }
};

const writeStorage = (data: AppData) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const updateStorage = (updater: (current: AppData) => AppData) => {
  const current = readStorage();
  const next = updater(current);
  writeStorage(next);
  return next;
};

export const getPreferences = () => readStorage().preferences;

export const setPreferences = (patch: Partial<Preferences>) => {
  updateStorage((current) => ({
    ...current,
    preferences: {
      ...current.preferences,
      ...patch,
    },
  }));
};

export const getReadChapters = () => new Set(readStorage().progress.readChapters);

export const setReadChapters = (readChapters: Set<string>) => {
  updateStorage((current) => ({
    ...current,
    progress: {
      ...current.progress,
      readChapters: Array.from(readChapters),
    },
  }));
};

export const toggleReadChapter = (bookId: string, chapterNumber: number) => {
  const key = `${bookId}:${chapterNumber}`;
  const current = getReadChapters();
  if (current.has(key)) {
    current.delete(key);
  } else {
    current.add(key);
  }
  setReadChapters(current);
  setLastViewedChapter(key);
  return current;
};

export const getLastViewedChapter = () => {
  return readStorage().preferences.lastViewedChapter ?? null;
};

export const setLastViewedChapter = (chapterKey: string) => {
  updateStorage((current) => ({
    ...current,
    preferences: {
      ...current.preferences,
      lastViewedChapter: chapterKey,
    },
  }));
};

export const getReflectionAnswers = (chapterKey: string) => {
  const stored = readStorage().reflections[chapterKey] ?? {};
  const result: Record<number, string> = {};
  Object.entries(stored).forEach(([key, value]) => {
    const idx = Number(key);
    if (!Number.isNaN(idx)) {
      result[idx] = value;
    }
  });
  return result;
};

export const setReflectionAnswer = (chapterKey: string, index: number, value: string) => {
  updateStorage((current) => {
    const nextReflections = { ...current.reflections };
    const existing = { ...(nextReflections[chapterKey] ?? {}) };
    if (value.trim().length === 0) {
      delete existing[String(index)];
    } else {
      existing[String(index)] = value;
    }
    nextReflections[chapterKey] = existing;
    return {
      ...current,
      reflections: nextReflections,
    };
  });
};

export const getChapterNote = (chapterKey: string) => {
  return readStorage().notes[chapterKey] ?? '';
};

export const setChapterNote = (chapterKey: string, value: string) => {
  updateStorage((current) => ({
    ...current,
    notes: {
      ...current.notes,
      [chapterKey]: value,
    },
  }));
};

export const getDownloadedBibleVersions = () => readStorage().downloads.bibleVersions;

export const setDownloadedBibleVersion = (version: string, downloaded: boolean) => {
  updateStorage((current) => ({
    ...current,
    downloads: {
      ...current.downloads,
      bibleVersions: {
        ...current.downloads.bibleVersions,
        [version]: { downloaded, updatedAt: new Date().toISOString() },
      },
    },
  }));
};
