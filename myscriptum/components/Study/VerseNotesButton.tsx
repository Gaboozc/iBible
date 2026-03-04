'use client';

import { useState } from 'react';
import { Trash2, Send, MessageCircle } from 'lucide-react';
import { getVerseNotes, addVerseNote, deleteVerseNote, updateVerseNote } from '@/lib/storage/verseNotes';
import type { VerseNote } from '@/lib/storage/verseNotes';

interface VerseNotesDisplayProps {
  bookSlug: string;
  chapter: number;
  verse: number;
}

export function VerseNotesDisplay({
  bookSlug,
  chapter,
  verse,
}: VerseNotesDisplayProps) {
  const [notes, setNotes] = useState<VerseNote[]>(getVerseNotes(bookSlug, chapter, verse));
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleSaveNote = () => {
    if (!newNoteText.trim()) return;
    const newNote = addVerseNote(bookSlug, chapter, verse, newNoteText);
    setNotes([...notes, newNote]);
    setNewNoteText('');
  };

  const handleDeleteNote = (noteId: string) => {
    if (deleteVerseNote(noteId)) {
      setNotes(notes.filter((n) => n.id !== noteId));
    }
  };

  const handleUpdateNote = (noteId: string) => {
    if (!editingText.trim()) return;
    const updated = updateVerseNote(noteId, editingText);
    if (updated) {
      setNotes(notes.map((n) => (n.id === noteId ? updated : n)));
      setEditingNoteId(null);
      setEditingText('');
    }
  };

  return (
    <div 
      className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 space-y-3 mt-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-amber-600" />
        <h4 className="font-semibold text-amber-900">Notas para {bookSlug} {chapter}:{verse}</h4>
        {notes.length > 0 && (
          <span className="ml-auto text-xs font-medium bg-amber-200 text-amber-900 px-2 py-1 rounded-full">
            {notes.length}
          </span>
        )}
      </div>

      {/* Notas existentes */}
      {notes.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg p-3 border border-amber-200 space-y-2"
            >
              {editingNoteId === note.id ? (
                <>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="w-full text-sm text-slate-900 p-2 border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => handleUpdateNote(note.id)}
                      className="flex-1 px-2 py-1.5 bg-amber-500 text-white rounded hover:bg-amber-600 transition font-medium"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditingNoteId(null);
                        setEditingText('');
                      }}
                      className="flex-1 px-2 py-1.5 bg-slate-300 text-slate-700 rounded hover:bg-slate-400 transition font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-700">{note.text}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {new Date(note.updatedAt).toLocaleDateString('es-ES', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setEditingNoteId(note.id);
                          setEditingText(note.text);
                        }}
                        className="px-2 py-1 text-blue-600 hover:bg-blue-100 rounded transition font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input nueva nota */}
      <div className="bg-white rounded-lg p-3 border border-amber-200 space-y-2">
        <textarea
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          placeholder="Agrega una nota para este versículo..."
          className="w-full text-sm text-slate-900 p-2 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          rows={2}
        />
        <button
          onClick={handleSaveNote}
          disabled={!newNoteText.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
        >
          <Send className="h-4 w-4" />
          Guardar Nota
        </button>
      </div>
    </div>
  );
}
