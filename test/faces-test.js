"use strict";

import assert from 'power-assert';
import sinon from 'sinon';
import store from '../js/store';
import {Faces} from '../js/components';

describe('Faces', () => {
  let faces;
  beforeEach(() => faces = new Faces());
  afterEach(() => faces.$destroy());

  describe('store on idol-selected', () => {
    it('idol がそれになる', () => {
      let idol = {name: '豊川風花', images: ['x']};
      store.emit('idol-selected', idol);
      assert.deepEqual(faces.idol, idol);
    });
  });

  describe('#select(url)', () => {
    it('store.selectImage(url) を呼ぶ', () => {
      let url = 'http://m.ip.bn765.com/1100751673a3b61a7d';
      store.selectImage = sinon.spy();
      faces.select(url);
      assert(store.selectImage.calledWith(url));
    });
  });
});
