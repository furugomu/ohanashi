import Vue from 'vue';

export default Vue.extend({
  name: 'Form',
  template: '#form-template',
  props: {
    // TODO: idol を変更した時に this.text ||= idol.default_text したい
    idol: {type: Object, default: null},
    image: {type: String, default: null},
  },
  data() {
    return {text: ''};
  },
  computed: {
    isReady() {
      return this.idol !== null && this.image !== null;
    },
  },
  watch: {
    idol(idol) {
      if (!this.text) {
        this.text = idol['default_text'];
      }
    },
  },
  methods: {
    addParagraph(event) {
      event.preventDefault();
      this.$dispatch('addParagraph', this.idol, this.image, this.text);
      this.text = '';
    },
  },
});
