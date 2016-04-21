"use strict";

import 'babel-polyfill';

import App from './components/app';
import './components/register';

let app = new App({
  el: 'main',
});
app.model.fetchIdols();

if (typeof window !== 'undefined') { window.app = app; }

if (location.search === '?debug') {
  (function f() {
    let model = app.model;
    if (model.idols.length === 0) return setTimeout(f, 100);
    let idol = model.idols[37];
    model.addParagraph(idol, idol.images[0], 'test');
    model.addParagraph(idol, idol.images[2], 'foo');
    model.addParagraph(idol, idol.images[3], '明日はﾊﾞ-ｹﾞﾝ…ではなくて､せ､ｾﾚﾌﾞの社交場へ出かけなくてはいけませんの!忙しいですわ～｡');
    model.addParagraph(idol, idol.images[5], 'baz');
  })();
}
