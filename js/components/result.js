import Vue from 'vue';

export default Vue.extend({
  name: 'Result',
  template: '#result-template',
  props: {
    paragraphs: {type: Array, default: ()=>[]},
  },
  data() {
    return { editting: false };
  },
  methods: {
    // できあがった画像のURLを別タブで開く
    open(event) {
      event.preventDefault();
      window.open(this.$refs.canvas.getUrl());
    },
  }
});
