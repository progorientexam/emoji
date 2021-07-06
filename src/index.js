import "./styles.scss";

import Vue from "vue/dist/vue.esm";

const emojiPath = "./images/";
const emojiSuffix = ".gif";
const emojiList = [...Array(8).keys()].map((item) => ++item);

let emojiMap = {};
emojiList.forEach((item) => {
  let key = `[${item}]`;
  let fullPath = `${emojiPath}${item}${emojiSuffix}`;
  emojiMap[key] = fullPath;
});

let rangeOfInputBox;

let count = 1;

let emojiDisplayEl = document.querySelector("#emoji");
let vmEmoji = new Vue({
  el: emojiDisplayEl,
  data: {
    emoji: {
      isVisible: false,
      path: emojiPath,
      list: emojiList,
      suffix: emojiSuffix
    },
    chatMessageList: []
  },
  methods: {
    handleBoxClick(event) {
      let target = event.target;
      this.setCaretForEmoji(target);
    },
    setCaretForEmoji(target) {
      if (target.tagName.toLowerCase() === "img") {
        let range = new Range();
        range.setStartBefore(target);
        range.collapse(true);
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(range);
      }
    },
    toggleEmojiBox() {
      this.emoji.isVisible = !this.emoji.isVisible;
    },
    insertEmoji(name) {
      let emojiEl = document.createElement("img");
      emojiEl.src = `${this.emoji.path}${name}${this.emoji.suffix}`;

      if (!rangeOfInputBox) {
        rangeOfInputBox = new Range();
        rangeOfInputBox.selectNodeContents(this.$refs.inputBox);
      }

      if (rangeOfInputBox.collapsed) {
        rangeOfInputBox.insertNode(emojiEl);
      } else {
        rangeOfInputBox.deleteContents();
        rangeOfInputBox.insertNode(emojiEl);
      }
      rangeOfInputBox.collapse(false);
    },
    doSend() {
      let content = this.$refs.inputBox.innerHTML;

      if (content !== "") {
        let name = "我";
        let messageItem = {
          id: count++,
          name,
          content
        };
        this.chatMessageList.push(messageItem);
        vmEmoji.$refs.inputBox.innerHTML = "";
      }
    }
  }
});

document.onselectionchange = () => {
  let selection = document.getSelection();

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);

    if (vmEmoji.$refs.inputBox.contains(range.commonAncestorContainer)) {
      rangeOfInputBox = range;
    }
  }
};
