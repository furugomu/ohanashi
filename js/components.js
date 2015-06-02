"use strict";

import Vue from 'vue';
import store from './store';

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

Vue.component('og-item', {
  template: '#item-template',
  props: ['idol', 'image', 'text'],
  data() {
    return { idol: null, image: null, text: '' };
  },
});

function clone(x) { return Object.assign({}, x); }
