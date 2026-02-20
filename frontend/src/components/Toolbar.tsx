import { Component } from "solid-js";
import { Note } from "../App";

type Props = {
  onToggleSidebar: () => void;
  onNewNote: () => void;
  onChooseDir: () => void;
  onToggleTheme: () => void;
  theme: "light" | "dark";
  dataDir: string;
  activeNote: Note | null;
};

const Toolbar: Component<Props> = (props) => {
  return (
    <div class="navbar bg-base-200 border-b border-base-300 px-3 min-h-12 shrink-0">
      {/* Gauche */}
      <div class="flex-none gap-2">
        <button
          class="btn btn-ghost btn-sm btn-square"
          onClick={props.onToggleSidebar}
          title="Ouvrir/fermer le panneau"
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
          title="Nouvelle note"
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

      {/* Centre - titre de la note active */}
      <div class="flex-1 px-4">
        <span class="text-sm font-medium opacity-70">
          {props.activeNote
            ? props.activeNote.title
            : "Aucune note sélectionnée"}
        </span>
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
