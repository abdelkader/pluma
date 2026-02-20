import {
  Component,
  onMount,
  onCleanup,
  createEffect,
  createSignal,
} from "solid-js";
import { Editor as TiptapEditor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import LinkModal from "./LinkModal";

type Props = {
  content: string;
  contentKey: number;
  onSave: (content: string) => void;
  active: boolean;
};

let globalEditor: TiptapEditor | undefined;

export function saveCurrentNote() {
  if (globalEditor) {
    return globalEditor.getHTML();
  }
  return null;
}

const Editor: Component<Props> = (props) => {
  let editorEl: HTMLDivElement | undefined;
  let saveTimer: ReturnType<typeof setTimeout>;
  const [showLinkModal, setShowLinkModal] = createSignal(false);
  const [selectedText, setSelectedText] = createSignal("");
  const [linkSelection, setLinkSelection] = createSignal<{
    from: number;
    to: number;
  } | null>(null);

  onMount(() => {
    globalEditor = new TiptapEditor({
      element: editorEl!,
      extensions: [
        StarterKit,
        Image.configure({ inline: false, allowBase64: true }),
        Link.configure({
          openOnClick: true,
          autolink: true,
          linkOnPaste: true,
          HTMLAttributes: {
            class: "link link-primary",
            rel: "noopener noreferrer",
            target: "_blank",
          },
        }),
      ],
      content: props.content || "<p></p>",
      editorProps: {
        attributes: { class: "tiptap" },
        handlePaste(view, event) {
          const items = event.clipboardData?.items;
          if (!items) return false;
          for (const item of Array.from(items)) {
            if (item.type.startsWith("image/")) {
              event.preventDefault();
              const file = item.getAsFile();
              if (!file) continue;
              const reader = new FileReader();
              reader.onload = (e) => {
                const base64 = e.target?.result as string;
                globalEditor
                  ?.chain()
                  .focus()
                  .deleteSelection()
                  .setImage({ src: base64 })
                  .run();
              };
              reader.readAsDataURL(file);
              return true;
            }
          }
          return false;
        },
        handleKeyDown(view, event) {
          if (event.ctrlKey && event.key === "k") {
            event.preventDefault();
            const { from, to } = view.state.selection;
            const text = view.state.doc.textBetween(from, to);
            setSelectedText(text);
            setLinkSelection({ from, to });
            setShowLinkModal(true);
            return true;
          }
          return false;
        },
      },
      onUpdate({ editor }) {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
          props.onSave(editor.getHTML());
        }, 500);
      },
    });
  });

  createEffect(() => {
    const _ = props.contentKey;
    if (globalEditor) {
      globalEditor.commands.setContent(props.content || "<p></p>", false);
      setTimeout(() => globalEditor?.commands.focus(), 50);
    }
  });

  onCleanup(() => {
    clearTimeout(saveTimer);
    globalEditor?.destroy();
    globalEditor = undefined;
  });

  const handleLinkConfirm = (text: string, url: string) => {
    const sel = linkSelection();
    if (!sel) return;
    setTimeout(() => {
      globalEditor
        ?.chain()
        .focus()
        .setTextSelection(sel)
        .deleteSelection()
        .insertContent(
          `<a href="${url}" target="_blank" rel="noopener noreferrer">${text || url}</a>`,
        )
        .run();
    }, 50);
  };

  return (
    <div class="flex-1 flex flex-col overflow-hidden bg-base-100">
      <div
        ref={editorEl}
        class="flex-1 overflow-y-auto"
        style={{ display: props.active ? "block" : "none" }}
      />
      {!props.active && (
        <div class="flex-1 flex items-center justify-center opacity-30 select-none">
          <div class="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <p class="text-sm">Sélectionnez ou créez une note</p>
          </div>
        </div>
      )}
      <LinkModal
        open={showLinkModal()}
        selectedText={selectedText()}
        onConfirm={handleLinkConfirm}
        onClose={() => setShowLinkModal(false)}
      />
    </div>
  );
};

export default Editor;
