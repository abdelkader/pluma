import { Component, createSignal, Show } from "solid-js";

type Props = {
  open: boolean;
  selectedText: string;
  onConfirm: (text: string, url: string) => void;
  onClose: () => void;
};

const LinkModal: Component<Props> = (props) => {
  const [text, setText] = createSignal("");
  const [url, setUrl] = createSignal("");

  const handleOpen = () => {
    setText(props.selectedText);
    setUrl("");
  };

  const handleConfirm = () => {
    if (!url().trim()) return;
    props.onConfirm(text().trim(), url().trim());
    props.onClose();
  };

  return (
    <Show when={props.open}>
      <div
        class="fixed inset-0 z-50 flex items-center justify-center"
        onClick={props.onClose}
      >
        {/* Backdrop */}
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Modal */}
        <div
          class="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden border border-base-300"
          onClick={(e) => e.stopPropagation()}
          ref={(el) => {
            if (props.open) {
              handleOpen();
            }
          }}
        >
          {/* Header */}
          <div class="flex items-center justify-between px-6 py-4 border-b border-base-300">
            <h2 class="font-semibold text-base">Insérer un lien</h2>
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

          {/* Inputs */}
          <div class="px-6 py-4 flex flex-col gap-4">
            <div class="form-control gap-1">
              <label class="label py-0">
                <span class="label-text text-xs opacity-60">Texte affiché</span>
              </label>
              <input
                type="text"
                class="input input-bordered input-sm w-full"
                placeholder="Mon lien"
                value={text()}
                onInput={(e) => setText(e.currentTarget.value)}
              />
            </div>
            <div class="form-control gap-1">
              <label class="label py-0">
                <span class="label-text text-xs opacity-60">URL</span>
              </label>
              <input
                type="url"
                class="input input-bordered input-sm w-full"
                placeholder="https://..."
                value={url()}
                onInput={(e) => setUrl(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleConfirm();
                  if (e.key === "Escape") props.onClose();
                }}
                autofocus
              />
            </div>
          </div>

          {/* Footer */}
          <div class="flex justify-end gap-2 px-6 py-4 bg-base-200">
            <button class="btn btn-ghost btn-sm" onClick={props.onClose}>
              Annuler
            </button>
            <button
              class="btn btn-primary btn-sm"
              onClick={handleConfirm}
              disabled={!url().trim()}
            >
              Insérer
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};

export default LinkModal;
