"use strict";

import assert from 'power-assert';
import sinon from 'sinon';
import store from '../js/store';
import {Form} from '../js/components';

describe('Form', () => {
  let form;
  beforeEach(() => form = new Form());
  afterEach(() => form.$destroy());

  describe('store on idol-selected', () => {
    it('idol がそれになる', () => {
      let idol = {name: '豊川風花'};
      store.emit('idol-selected', idol);
      assert.deepEqual(form.idol, idol);
    });
  });

  describe('store on image-selected', () => {
    it('idol がそれになる', () => {
      let url = 'http://m.ip.bn765.com/1100751673a3b61a7d';
      store.emit('image-selected', url);
      assert(form.image === url);
    });
  });

  describe('#addParagraph(event)', () => {
    it('event.preventDefault() を呼ぶ', () => {
      let event = {preventDefault: sinon.spy()};
      form.addParagraph(event);
      assert(event.preventDefault.called);
    });

    it('store.addParagraph(idol, image, text) を呼ぶ', () => {
      let spy = store.addParagraph = sinon.spy();
      let idol = form.idol = {name: '木下ひなた'};
      let image = form.image = 'http://m.ip.bn765.com/1100673f00f18074ac';
      let text = form.text = 'とろくさくてもね､ちゃあんと一歩ずつ前に進んでいくんさ｡';
      form.addParagraph({preventDefault(){}});
      assert(spy.calledWith(idol, image, text));
    });

    it('text を消す', () => {
      let text = form.text = 'ﾌﾟﾛﾃﾞｭ-ｻ-､劇場の裏っ側に花が咲いとったよ｡ちっちゃいけどもｷﾚｲな花｡皆にも教えてあげねば｡';
      form.addParagraph({preventDefault(){}});
      assert(form.text === '');
    });
  });
});
