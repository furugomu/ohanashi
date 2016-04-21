"use strict";

import 'babel-polyfill';
import Vue from 'vue';
import './components';
import store from './store';

let app = new Vue({
  name: 'app',
  el: 'main',
  template: '#app-template',
  created() {
    store.on('idols-updated', (idols) => {
      store.selectIdol(idols.find((idol) => idol.id === 'chizuru'));
    });
    store.fetchIdols();
  },
});

export default app;
if (typeof window !== 'undefined') { window.app = app; }

if (location.search === '?debug') {
  store.on('idols-updated', (idols) => {
    let idol = idols[37];
    store.addParagraph(idol, idol.images[0], 'test');
    store.addParagraph(idol, idol.images[2], 'foo');
    store.addParagraph(idol, idol.images[3], '明日はﾊﾞ-ｹﾞﾝ…ではなくて､せ､ｾﾚﾌﾞの社交場へ出かけなくてはいけませんの!忙しいですわ～｡');
    store.addParagraph(idol, idol.images[5], 'baz');
  });
}
