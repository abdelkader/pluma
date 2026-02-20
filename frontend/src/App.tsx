import { Component, createSignal, onMount, onCleanup } from "solid-js";
import {
  GetNotes,
  ReadNote,
  SaveNote,
  DeleteNote,
  RenameNote,
  ChooseDirectory,
  SetDataDir,
} from "../wailsjs/go/main/App";
import Sidebar from "./components/Sidebar";
import Editor, { saveCurrentNote } from "./components/Editor";
import Toolbar from "./components/Toolbar";
import HelpModal from "./components/HelpModal";

export type Note = {
  filename: string;
  title: string;
};

const App: Component = () => {
  const [notes, setNotes] = createSignal<Note[]>([]);
  const [activeNote, setActiveNote] = createSignal<Note | null>(null);
  const [content, setContent] = createSignal("");
  const [contentKey, setContentKey] = createSignal(0);
  const [sidebarOpen, setSidebarOpen] = createSignal(true);
  const [sidebarPinned, setSidebarPinned] = createSignal(false);
  const [theme, setTheme] = createSignal<"light" | "dark">("light");
  const [dataDir, setDataDir] = createSignal("");
  const [showHelp, setShowHelp] = createSignal(false);

  const handleKeyDown = async (e: KeyboardEvent) => {
    // Ctrl+N - Nouvelle note
    if (e.ctrlKey && e.key === "n") {
      e.preventDefault();
      await newNote();
    }
    // Ctrl+\ - Toggle sidebar
    if (e.ctrlKey && e.key === "\/") {
      e.preventDefault();
      setSidebarOpen((o) => !o);
    }
    // Ctrl+Delete - Supprimer la note active
    if (e.ctrlKey && e.key === "Delete") {
      e.preventDefault();
      const note = activeNote();
      if (note && confirm(`Supprimer "${note.title}" ?`)) {
        await deleteNote(note);
      }
    }
    // F1 - Aide (on l'ajoutera après)
    if (e.key === "F1") {
      e.preventDefault();
      setShowHelp((h) => !h);
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });

  onMount(async () => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) setTheme(savedTheme);

    const savedDir = localStorage.getItem("dataDir");
    if (savedDir) {
      await SetDataDir(savedDir);
      setDataDir(savedDir);
      await loadNotes();
    }
  });

  const loadNotes = async () => {
    const n = await GetNotes();
    setNotes(n || []);
  };

  const flushSave = async () => {
    const current = activeNote();
    if (!current) return;
    const html = saveCurrentNote();
    if (html) await SaveNote(current.filename, html);
  };

  const selectNote = async (note: Note) => {
    await flushSave();
    const c = await ReadNote(note.filename);
    setActiveNote(note);
    setContent(c);
    setContentKey((k) => k + 1);
    if (!sidebarPinned()) {
      setSidebarOpen(false);
    }
  };

  const newNote = async () => {
    if (!dataDir()) {
      await chooseDir();
      if (!dataDir()) return;
    }
    await flushSave();
    const title = "Nouvelle note " + (notes().length + 1);
    const filename = title + ".html";
    await SaveNote(filename, "<p></p>");
    await loadNotes();
    setActiveNote({ filename, title });
    setContent("<p></p>");
    setContentKey((k) => k + 1);
  };

  const saveNote = async (newContent: string) => {
    if (!activeNote()) return;
    await SaveNote(activeNote()!.filename, newContent);
  };

  const deleteNote = async (note: Note) => {
    await DeleteNote(note.filename);
    if (activeNote()?.filename === note.filename) {
      setActiveNote(null);
      setContent("");
    }
    await loadNotes();
  };

  const renameNote = async (note: Note, newTitle: string) => {
    await flushSave();
    const newFilename = await RenameNote(note.filename, newTitle);
    if (activeNote()?.filename === note.filename) {
      setActiveNote({ filename: newFilename, title: newTitle });
    }
    await loadNotes();
  };

  const chooseDir = async () => {
    const dir = await ChooseDirectory();
    if (dir) {
      setDataDir(dir);
      localStorage.setItem("dataDir", dir);
      await loadNotes();
    }
  };

  const toggleTheme = () => {
    const next = theme() === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  return (
    <div
      data-theme={theme()}
      class="flex flex-col h-screen bg-base-100 text-base-content"
    >
      <Toolbar
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onNewNote={newNote}
        onChooseDir={chooseDir}
        onToggleTheme={toggleTheme}
        onHelp={() => setShowHelp((h) => !h)}
        theme={theme()}
        dataDir={dataDir()}
        activeNote={activeNote()}
      />
      <div class="flex flex-1 overflow-hidden relative">
        <Sidebar
          notes={notes()}
          activeNote={activeNote()}
          open={sidebarOpen()}
          pinned={sidebarPinned()}
          onSelect={selectNote}
          onDelete={deleteNote}
          onRename={renameNote}
          onPin={() => {
            const newPinned = !sidebarPinned();
            setSidebarPinned(newPinned);
            if (newPinned) setSidebarOpen(true);
          }}
        />
        <Editor
          content={content()}
          contentKey={contentKey()}
          onSave={saveNote}
          active={!!activeNote()}
        />
      </div>
      <HelpModal open={showHelp()} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default App;
