import { Component, For, createSignal } from "solid-js";
import { Note } from "../App";

type Props = {
  notes: Note[];
  activeNote: Note | null;
  open: boolean;
  pinned: boolean;
  onSelect: (note: Note) => void;
  onDelete: (note: Note) => void;
  onRename: (note: Note, newTitle: string) => void;
  onPin: () => void;
};

const Sidebar: Component<Props> = (props) => {
  const [editingNote, setEditingNote] = createSignal<string | null>(null);
  const [editValue, setEditValue] = createSignal("");

  const startRename = (note: Note) => {
    setEditingNote(note.filename);
    setEditValue(note.title);
  };

  const confirmRename = (note: Note) => {
    if (editValue().trim() && editValue() !== note.title) {
      props.onRename(note, editValue().trim());
    }
    setEditingNote(null);
  };

  return (
    <div
      class="flex flex-col bg-base-200 border-r border-base-300 shrink-0 transition-all duration-300 overflow-hidden"
      style={{ width: props.open ? "260px" : "0px" }}
    >
      {/* Header sidebar */}
      <div class="flex items-center justify-between px-3 py-2 border-b border-base-300 shrink-0">
        <span class="text-xs font-semibold uppercase tracking-widest opacity-50">
          Notes
        </span>
        <button
          class="btn btn-ghost btn-xs btn-square"
          onClick={props.onPin}
          title={props.pinned ? "Désépingler" : "Épingler"}
        >
          {props.pinned ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M16 4a1 1 0 00-1.447-.894L8 6.382V5a1 1 0 00-2 0v14a1 1 0 002 0v-1.382l6.553 3.276A1 1 0 0016 20V4z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Liste des notes */}
      <div class="flex-1 overflow-y-auto py-1">
        <For
          each={props.notes}
          fallback={
            <div class="px-4 py-8 text-center text-xs opacity-40">
              Aucune note.
              <br />
              Créez-en une !
            </div>
          }
        >
          {(note) => (
            <div
              class="group flex items-center gap-1 px-2 py-1 mx-1 my-0.5 rounded-lg cursor-pointer transition-colors"
              classList={{
                "bg-primary text-primary-content":
                  props.activeNote?.filename === note.filename,
                "hover:bg-base-300":
                  props.activeNote?.filename !== note.filename,
              }}
              onClick={() => props.onSelect(note)}
            >
              {/* Titre ou champ d'édition */}
              {editingNote() === note.filename ? (
                <input
                  class="input input-xs flex-1 bg-base-100 text-base-content"
                  value={editValue()}
                  onInput={(e) => setEditValue(e.currentTarget.value)}
                  onBlur={() => confirmRename(note)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmRename(note);
                    if (e.key === "Escape") setEditingNote(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  autofocus
                />
              ) : (
                <span class="flex-1 text-sm truncate select-none">
                  {note.title}
                </span>
              )}

              {/* Actions */}
              <div class="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  class="btn btn-ghost btn-xs btn-square"
                  onClick={(e) => {
                    e.stopPropagation();
                    startRename(note);
                  }}
                  title="Renommer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"
                    />
                  </svg>
                </button>
                <button
                  class="btn btn-ghost btn-xs btn-square text-error"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Supprimer "${note.title}" ?`)) {
                      props.onDelete(note);
                    }
                  }}
                  title="Supprimer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 00-1-1h-4a1 1 0 00-1 1H5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default Sidebar;
