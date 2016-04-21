import Vue from 'vue';

export default Vue.extend({
  name: 'Faces',
  template: '#faces-template',
  props: {
    idol: {type: Object, default: null},
  },
  methods: {
    select(url) {
      this.$dispatch('selectImage', url);
    },
  },
});
