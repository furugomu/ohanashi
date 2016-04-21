"use strict";

import Vue from 'vue';
import EventEmitter from 'events';

// 店
class Store extends EventEmitter {
  constructor() {
    super();
    this.data = {
      paragraphs: [/* {idol, image, text} */],
    };
  }

  fetchIdols() {
    getJson('./millionstars.json')
    .then((idols) => {
      this.data.idols = idols;
      this.emit('idols-updated', clone(idols));
    })
    .catch((err) => alert('アイドルデータの読み込みに失敗しました: ' + err));
  }

  // アイドルを選ぶ
  selectIdol(idolOrId) {
    let id = idolOrId.id ? idolOrId.id : idolOrId;
    let idol = (this.data.idols || []).find((idol) => idol.id === id);
    this.emit('idol-selected', clone(idol));
  }

  // 絵の URL を選ぶ
  selectImage(url) {
    this.emit('image-selected', clone(url));
  }

  // 追加する
  addParagraph(idol, image, text) {
    this.data.paragraphs.push({idol, image, text});
    this.emit('paragraphs-updated', clone(this.data.paragraphs));
  }

  // 入れ替える
  swapParagraphs(i, j) {
    let ps = this.data.paragraphs;
    let t = ps[i];
    ps[i] = ps[j];
    ps[j] = t;
    this.emit('paragraphs-updated', clone(ps));
  }

  // 取り除く
  removeParagraph(i) {
    this.data.paragraphs.splice(i, 1);
    this.emit('paragraphs-updated', clone(this.data.paragraphs));
  }
}

export default new Store();

function clone(x) {
  if (typeof x !== 'object' || x === null) { return x; }
  if (Array.isArray(x)) { return x.slice(); }
  return Object.assign({}, x);
}

function getJson(url) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', './millionstars.json');
  xhr.responseType = 'json';
  xhr.send();
  return new Promise((resolve, reject) => {
    xhr.addEventListener('load', () => resolve(xhr.response));
    xhr.addEventListener('error', reject);
  });
}
