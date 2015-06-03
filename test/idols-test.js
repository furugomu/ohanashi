"use strict";

import assert from 'power-assert';
import sinon from 'sinon';
import store from '../js/store';
import {Idols} from '../js/components';

describe('Idols', () => {
  let idols;
  beforeEach(() => idols = new Idols());
  afterEach(() => idols.$destroy());

  describe('store on idols-updated', () => {
    let newIdols = [{name: '二階堂千鶴'}];
    beforeEach(() => store.emit('idols-updated', newIdols));

    it('同じ内容が入る', () => {
      assert.deepEqual(idols.idols, newIdols);
    });
  });

  describe('store on idol-selected', () => {
    it('selectedIdol がそれになる', () => {
      let idol = {name: '徳川まつり'};
      store.emit('idol-selected', idol);
      assert.deepEqual(idols.selectedIdol, idol);
    });
  });

  describe('#select(idol)', () => {
    it('store.selectIdol(idol) を呼ぶ', () => {
      let idol = {name: '高槻かすみ'};
      store.selectIdol = sinon.spy();
      idols.select(idol);
      assert(store.selectIdol.calledWith(idol));
    });
  });

  describe('filter search', () => {
    let chizuru = {name: '二階堂千鶴', yomi: 'にかいどうちづる', type: 'vi'};
    let iori = {name: '水瀬伊織', yomi: 'みなせいおり', type: 'vo'};
    let idolsData = [chizuru, iori];

    describe('by type', () => {
      it('同じのを選ぶ', () => {
        idols.search.type = 'vi';
        let filtered = idols.$options.filters.search.call(idols, idolsData);
        assert.deepEqual(filtered, [chizuru]);
      });

      it('空文字列だったら全て選ぶ', () => {
        idols.search.type = '';
        let filtered = idols.$options.filters.search.call(idols, idolsData);
        assert.deepEqual(filtered, idolsData);
      });
    });

    describe('by name', () => {
      it('漢字', () => {
        idols.searchText = '堂';
        let filtered = idols.$options.filters.search.call(idols, idolsData);
        assert.deepEqual(filtered, [chizuru]);
      });

      it('読みがな', () => {
        idols.searchText = 'いお';
        let filtered = idols.$options.filters.search.call(idols, idolsData);
        assert.deepEqual(filtered, [iori]);
      });
    });
  });

});
