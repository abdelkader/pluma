import { Component } from "solid-js";

type Props = {
  open: boolean;
  onClose: () => void;
};

const shortcuts = [
  { keys: ["Ctrl", "N"], description: "Nouvelle note" },
  { keys: ["Ctrl", "B"], description: "Gras" },
  { keys: ["Ctrl", "I"], description: "Italique" },
  { keys: ["Ctrl", "K"], description: "Insérer un lien" },
  { keys: ["Ctrl", "\/"], description: "Ouvrir/fermer la sidebar" },
  { keys: ["Ctrl", "Delete"], description: "Supprimer la note active" },
  { keys: ["Ctrl", "Z"], description: "Annuler" },
  { keys: ["Ctrl", "Y"], description: "Rétablir" },
  { keys: ["F1"], description: "Ouvrir/fermer l'aide" },
];

const HelpModal: Component<Props> = (props) => {
  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center transition-all duration-200"
      style={{ display: props.open ? "flex" : "none" }}
      onClick={props.onClose}
    >
      {/* Backdrop */}
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        class="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-base-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div class="flex items-center justify-between px-6 py-4 border-b border-base-300">
          <div class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
              />
            </svg>
            <h2 class="font-semibold text-base">Raccourcis clavier</h2>
          </div>
          <button
            class="btn btn-ghost btn-sm btn-square"
            onClick={props.onClose}
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Liste des raccourcis */}
        <div class="px-6 py-4 flex flex-col gap-2">
          {shortcuts.map((s) => (
            <div class="flex items-center justify-between py-1.5 border-b border-base-200 last:border-0">
              <span class="text-sm opacity-70">{s.description}</span>
              <div class="flex items-center gap-1">
                {s.keys.map((key, i) => (
                  <>
                    <kbd class="kbd kbd-sm">{key}</kbd>
                    {i < s.keys.length - 1 && (
                      <span class="text-xs opacity-40">+</span>
                    )}
                  </>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div class="px-6 py-3 bg-base-200 text-center">
          <span class="text-xs opacity-40">
            Appuie sur F1 ou clique en dehors pour fermer
          </span>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
