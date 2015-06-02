"use strict";

import 'babel/polyfill';
import 'fetch';
import Vue from 'vue';
import './components';
import store from './store';

let app = window.app = new Vue({
  name: 'app',
  el: 'main',
  created() {
    store.$on('idols-updated', (idols) => {
      store.selectIdol(idols.find((idol) => idol.id === 'chizuru'));
    });
    store.fetchIdols();
  },
});

if (location.search === '?debug') {
  store.$on('idols-updated', (idols) => {
    let idol = idols[37];
    store.addParagraph(idol, idol.images[0], 'test');
    store.addParagraph(idol, idol.images[2], 'foo');
    store.addParagraph(idol, idol.images[3], '明日はﾊﾞ-ｹﾞﾝ…ではなくて､せ､ｾﾚﾌﾞの社交場へ出かけなくてはいけませんの!忙しいですわ～｡');
    store.addParagraph(idol, idol.images[5], 'baz');
  });
}
