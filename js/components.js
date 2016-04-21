"use strict";

import Vue from 'vue';
import store from './store';

// アイドルを選ぶ
export let Idols = Vue.extend({
  name: 'idols',
  template: '#idols-template',
  data() {
    return {
      idols: [],
      // TODO: searchType で良いと思う
      search: {type: ''},
      searchText: '',
      selectedIdol: null,
    };
  },
  created() {
    store.on('idols-updated', this.onIdolsUpdated);
    store.on('idol-selected', this.onIdolSelected);
  },
  destroyed() {
    store.removeListener('idols-updated', this.onIdolsUpdated);
    store.removeListener('idol-selected', this.onIdolSelected);
  },
  methods: {
    select(idol) {
      store.selectIdol(idol);
    },
    onIdolsUpdated(idols) {
      this.idols = idols;
    },
    onIdolSelected(idol) {
      this.selectedIdol = idol;
    },
  },
  filters: {
    search(idols) {
      return idols.filter((idol) => {
        if (this.search.type && idol.type !== this.search.type) { return false; }
        return idol.name.includes(this.searchText) ||
          idol.yomi.includes(this.searchText);
      });
    },
  },
});
Vue.component('og-idols', Idols);

// 絵を選ぶ
export let Faces = Vue.extend({
  name: 'faces',
  template: '#faces-template',
  data() {
    return { idol: null };
  },
  created() {
    store.on('idol-selected', this.onIdolSelected);
  },
  destroyed() {
    store.removeListener('idol-selected', this.onIdolSelected);
  },
  methods: {
    select(url) {
      store.selectImage(url);
    },
    onIdolSelected(idol) {
      this.idol = idol;
      this.select(idol.images[0]);
    },
  },
});
Vue.component('og-faces', Faces);

// 文字を書く
export let Form = Vue.extend({
  name: 'form',
  template: '#form-template',
  data() {
    return { idol: null, image: null, text: '' };
  },
  created() {
    store.on('idol-selected', this.onIdolSelected);
    store.on('image-selected', this.onImageSelected);
  },
  destroyed() {
    store.removeListener('idol-selected', this.onIdolSelected);
    store.removeListener('image-selected', this.onImageSelected);
  },
  computed: {
    isReady() {
      return this.idol !== null && this.image !== null;
    }
  },
  methods: {
    addParagraph(event) {
      event.preventDefault();
      store.addParagraph(this.idol, this.image, this.text);
      this.text = '';
    },
    onIdolSelected(idol) {
      this.idol = idol;
      if (!this.text) { this.text = idol['default_text']; }
    },
    onImageSelected(url) {
      this.image = url;
    },
  },
});
Vue.component('og-form', Form);

// できあがり
Vue.component('og-result', {
  template: '#result-template',
  data() {
    return { editting: false };
  },
  methods: {
    // できあがった画像のURLを別タブで開く
    open(event) {
      event.preventDefault();
      window.open(this.$refs.canvas.getUrl());
    },
  }
});

// 並べる
export let List = Vue.extend({
  name: 'list',
  template: '#list-template',
  data() {
    return { paragraphs: [], };
  },
  created() {
    store.on('paragraphs-updated', (ps) => this.paragraphs = ps);
  },
  methods: {
    moveup(i) {
      store.swapParagraphs(i, i - 1);
    },
    movedown(i) {
      store.swapParagraphs(i, i + 1);
    },
    remove(i) {
      store.removeParagraph(i);
    }
  }
});
Vue.component('og-list', List);

Vue.component('og-item', {
  template: '#item-template',
  props: {
    idol: {default: ()=>null},
    image: {default: ()=>null},
    text: {default: ()=>''},
  },
});

Vue.component('og-canvas', {
  template: '<canvas width=640 height="{{height}}" style="width: 320px"></canvas>',
  replace: true,
  data() {
    return {
      paragraphs: [],
      unitHeight: 168,
      wakuUrl: 'images/11006e59e67.png',
      bgUrl: 'images/11002c9b1d8.png',
    };
  },
  created() {
    store.on('paragraphs-updated', (ps) => this.paragraphs = ps);
    this.waku = new Image();
    this.waku.src = this.wakuUrl;
    this.bg = new Image();
    this.bg.src = this.bgUrl;
  },
  watch: {
    paragraphs(ps) {
      let ctx = this.$el.getContext('2d');

      // 背景
      for (let y = 0; y < this.height; y += this.bg.height) {
        ctx.drawImage(this.bg, 0, y);
      }
      // せりふ
      ps.forEach((p, i) => {
        let y = i * this.unitHeight;
        // 顔
        drawImage(p.image, 8, 8 + y);
        // ふきだし
        ctx.drawImage(this.waku, 174, 8 + y);
        // なまえ
        ctx.font = 'bold 28px/35px "Arial", sans-serif';
        ctx.fillStyle = '#f33281';
        ctx.fillText(p.idol.name, 184, 42 + y);
        // せりふ
        ctx.fillStyle = 'black';
        let lines = wrapText(p.text, ctx, 428);
        lines.forEach((line, j) => {
          let ty = y + 76 + j * 35;
          ctx.fillText(line, 184, ty);
        });
      });

      function drawImage(url, x, y) {
        let i = new Image();
        i.src = url;
        i.onload = () => ctx.drawImage(i, x, y);
      }
    },
  },
  computed: {
    height() {
      return this.paragraphs.length * this.unitHeight;
    },
  },
  methods: {
    // できあがった画像の data URL を返す
    getUrl() {
      let canvas = this.$el;
      // 可能なら blob にしたいがポップアップブロックされるのでこまった
      /*
      if (canvas.toBlob) {
        return new Promise((resolve, reject) => {
          // canvas が空だと blob が null になる
          canvas.toBlob((blob) => blob ? resolve(URL.createObjectURL(blob)) : reject());
        });
      }
      */
      return canvas.toDataURL();
    }
  }
});

function wrapText(text, ctx, width) {
  let lines = [];
  if (!text) { return lines; }
  for (let i = 1; i < text.length; ++i) {
    let metrics = ctx.measureText(text.substring(0, i));
    if (metrics.width > width) {
      lines.push(text.substring(0, i - 1));
      text = text.substring(i - 1);
      i = 0;
    }
  }
  lines.push(text);
  return lines;
}
