"use strict";

import 'babel/polyfill';
import Vue from 'vue';
import 'fetch';

// 店
let store = window.store = new Vue({
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

// アイドルを選ぶ
Vue.component('og-idols', {
  template: '#idols-template',
  data() {
    return {
      idols: [],
      search: {type: ''},
      searchText: '',
      selectedIdol: null,
    };
  },
  created() {
    store.$addChild(this);
    store.$on('idols-updated', (idols) => {
      this.idols = idols;
    });
    store.$on('idol-selected', (idol) => {
      this.selectedIdol = idol;
    });
  },
  methods: {
    select(idol) {
      store.selectIdol(idol);
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

// 絵を選ぶ
Vue.component('og-faces', {
  template: '#faces-template',
  data() {
    return { idol: null };
  },
  created() {
    store.$on('idol-selected', (idol) => {
      this.idol = idol;
      this.select(idol.images[0]);
    });
  },
  methods: {
    select(url) {
      store.selectImage(url);
    },
  },
});

// 文字を書く
Vue.component('og-form', {
  template: '#form-template',
  data() {
    return { idol: null, image: null, text: '' };
  },
  created() {
    store.$on('idol-selected', (idol) => {
      this.idol = idol;
      if (!this.text) { this.text = idol['default_text']; }
    });
    store.$on('image-selected', (url) => this.image = url);
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
  },
  components: {
    unko: {
      paramAttributes: ['idol', 'image', 'text'],
      template: '<p>unko: {{idol}}, {{image}}, {{text}}</p>',
    }
  },
});

// 並べる
Vue.component('og-list', {
  template: '#list-template',
  data() {
    return { paragraphs: [], };
  },
  created() {
    store.$on('paragraphs-updated', (ps) => this.paragraphs = clone(ps));
  },
  computed: {
    showAlert() {
      this.paragraphs.length === 0;
    },
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

let app = window.app = new Vue({
  name: 'app',
  el: 'main',
  data: {
  },
  methods: {
  },
  created() {
    store.$on('idols-updated', (idols) => {
      store.selectIdol(idols.find((idol) => idol.id === 'chizuru'));
    });
    store.fetchIdols();
  },
});


function clone(x) { return Object.assign({}, x); }
