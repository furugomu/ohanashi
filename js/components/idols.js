import Vue from 'vue';

export default Vue.extend({
  name: 'Idols',
  template: '#idols-template',
  props: {
    idols: {type: Array, default: () => []},
    selectedIdol: {type: Object, default: null},
  },
  data() {
    return {
      searchType: '',
      searchText: '',
    };
  },
  methods: {
    select(idol) {
      this.$dispatch('selectIdol', idol);
    },
  },
  filters: {
    search(idols) {
      return idols.filter((idol) => {
        if (this.searchType && idol.type !== this.searchType) { return false; }
        return idol.name.includes(this.searchText) ||
          idol.yomi.includes(this.searchText);
      });
    },
  },
});
