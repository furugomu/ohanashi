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
