"use strict";

import Vue from 'vue';

// 店
// TODO: eventemitter に変える
export default new Vue({
  data: {
    paragraphs: [/* {idol, image, text} */],
  },
  methods: {
    // アイドル一覧をとってくる
    fetchIdols() {
      fetch('./millionstars.json')
      .then((response) => response.json())
      .then((idols) => {
        this.idols = idols;
        this.$emit('idols-updated', idols);
      })
      .catch((err) => alert('遺憾の意'));
    },
    // アイドルを選ぶ
    selectIdol(idolOrId) {
      let id = idolOrId.id ? idolOrId.id : idolOrId;
      let idol = (this.idols || []).find((idol) => idol.id === id);
      this.$emit('idol-selected', idol);
    },
    // 絵の URL を選ぶ
    selectImage(url) {
      this.$emit('image-selected', url);
    },
    // 追加する
    addParagraph(idol, image, text) {
      this.paragraphs.push({idol, image, text});
      this.$emit('paragraphs-updated', this.paragraphs);
    },
    // 入れ替える
    swapParagraphs(i, j) {
      let t = this.paragraphs[i];
      this.paragraphs[i] = this.paragraphs[j];
      this.paragraphs[j] = t;
      this.$emit('paragraphs-updated', this.paragraphs);
    },
    // 取り除く
    removeParagraph(i) {
      this.paragraphs.splice(i, 1);
      this.$emit('paragraphs-updated', this.paragraphs);
    },
  },
});
