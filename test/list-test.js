"use strict";

import assert from 'power-assert';
import sinon from 'sinon';
import store from '../js/store';
import {List} from '../js/components';

describe('List', () => {
  let list;
  beforeEach(() => list = new List());
  afterEach(() => list.$destroy());

  describe('store on paragraphs-updated', () => {
    it('paragraphs がそれになる', () => {
      let paragraphs = [{idol: {}, image: 'x.png', text: 'hoge'}];
      store.emit('paragraphs-updated', paragraphs);
      assert.deepEqual(list.paragraphs, paragraphs);
    });
  });

  describe('#moveup(i)', () => {
    it('store.swapParagraphs(i, i - 1) を呼ぶ', () => {
      store.swapParagraphs = sinon.spy();
      list.moveup(501);
      assert(store.swapParagraphs.calledWith(501, 500));
    });
  });

  describe('#movedown(i)', () => {
    it('store.swapParagraphs(i, i + 1) を呼ぶ', () => {
      store.swapParagraphs = sinon.spy();
      list.movedown(10);
      assert(store.swapParagraphs.calledWith(10, 11));
    });
  });
});
