import { Component, createSignal, createEffect } from "solid-js";
import { Note } from "../App";

type Props = {
  onToggleSidebar: () => void;
  onNewNote: () => void;
  onChooseDir: () => void;
  onToggleTheme: () => void;
  onHelp: () => void;
  onRenameNote: (note: Note, newTitle: string) => void;
  theme: "light" | "dark";
  dataDir: string;
  activeNote: Note | null;
};

const Toolbar: Component<Props> = (props) => {
  const [editing, setEditing] = createSignal(false);
  const [titleValue, setTitleValue] = createSignal("");

  // Sync quand la note active change
  createEffect(() => {
    setTitleValue(props.activeNote?.title || "");
    setEditing(false);
  });

  const confirmRename = () => {
    setEditing(false);
    const note = props.activeNote;
    if (!note) return;
    const newTitle = titleValue().trim();
    if (newTitle && newTitle !== note.title) {
      props.onRenameNote(note, newTitle);
    } else {
      setTitleValue(note.title);
    }
  };

  return (
    <div class="navbar bg-base-200 border-b border-base-300 px-3 min-h-12 shrink-0">
      {/* Gauche */}
      <div class="flex-none gap-2">
        <button
          class="btn btn-ghost btn-sm btn-square"
          onClick={props.onToggleSidebar}
          title="Ouvrir/fermer le panneau (Ctrl+/)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <button
          class="btn btn-ghost btn-sm btn-square"
          onClick={props.onNewNote}
          title="Nouvelle note (Ctrl+N)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Centre - titre éditable */}
      <div class="flex-1 px-4 flex justify-center">
        {editing() ? (
          <input
            class="input input-ghost input-sm text-center font-medium w-full max-w-sm focus:outline-none"
            value={titleValue()}
            onInput={(e) => setTitleValue(e.currentTarget.value)}
            onBlur={confirmRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmRename();
              if (e.key === "Escape") {
                setTitleValue(props.activeNote?.title || "");
                setEditing(false);
              }
            }}
            autofocus
          />
        ) : (
          <span
            class="text-sm font-medium opacity-70 cursor-pointer hover:opacity-100 transition-opacity px-2 py-1 rounded hover:bg-base-300"
            onClick={() => {
              if (props.activeNote) setEditing(true);
            }}
            title={props.activeNote ? "Cliquer pour renommer" : ""}
          >
            {props.activeNote ? titleValue() : "Aucune note sélectionnée"}
          </span>
        )}
      </div>

      {/* Droite */}
      <div class="flex-none gap-2">
        <button
          class="btn btn-ghost btn-sm btn-square"
          onClick={props.onChooseDir}
          title={props.dataDir || "Choisir un dossier"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            />
          </svg>
        </button>

        <button
          class="btn btn-ghost btn-sm btn-square"
          onClick={props.onHelp}
          title="Raccourcis clavier (F1)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        <button
          class="btn btn-ghost btn-sm btn-square"
          onClick={props.onToggleTheme}
          title="Changer le thème"
        >
          {props.theme === "light" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707.707M6.343 6.343l-.707.707M12 7a5 5 0 100 10A5 5 0 0012 7z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
