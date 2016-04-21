import Vue from 'vue';

export default Vue.extend({
  name: 'list',
  template: '#list-template',
  props: {
    paragraphs: {type: Array, default: ()=>[]},
  },
  methods: {
    moveup(i) {
      this.$dispatch('swapParagraphs', i, i - 1);
    },
    movedown(i) {
      this.$dispatch('swapParagraphs', i, i + 1);
    },
    remove(i) {
      this.$dispatch('removeParagraph', i);
    },
  },
});
