import Vue from 'vue';

export default Vue.extend({
  name: 'Item',
  template: '#item-template',
  props: {
    idol: {default: ()=>null},
    image: {default: ()=>null},
    text: {default: ()=>''},
  },
});
