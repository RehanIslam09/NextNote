import { Mark, mergeAttributes } from "@tiptap/core";

// --- Module Augmentation for TS ---
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tag: {
      /**
       * Set a tag (#tagname)
       */
      setTag: (value: string) => ReturnType;
      /**
       * Remove tag
       */
      unsetTag: () => ReturnType;
    };
  }
}

const Tag = Mark.create({
  name: "tag",

  addAttributes() {
    return {
      value: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-tag]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-tag": HTMLAttributes.value,
        class:
          "inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium " +
          "bg-gradient-to-r from-purple-400/20 to-pink-400/20 " +
          "text-purple-700 dark:text-pink-300 " +
          "hover:from-purple-400/30 hover:to-pink-400/30 " +
          "cursor-pointer transition select-none",
      }),
      `#${HTMLAttributes.value}`,
    ];
  },

  addCommands() {
    return {
      setTag:
        (value: string) =>
        ({ chain }) => {
          return chain()
            .focus()
            .setMark(this.name, { value })
            .run();
        },

      unsetTag:
        () =>
        ({ chain }) => {
          return chain().focus().unsetMark(this.name).run();
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Space: ({ editor }) => {
        // Exit tag mark on Space
        if (editor.isActive(this.name)) {
          return editor
            .chain()
            .unsetMark(this.name) // stop the tag
            .insertContent(" ")   // add plain space
            .run();
        }
        return false; // let normal space happen if not inside a tag
      },
    };
  },
});



export default Tag;
