import Vue from 'vue';
import {Ohanashi} from '../models';

export default Vue.extend({
  name: 'App',
  template: '#app-template',
  data() {
    return {
      model: new Ohanashi(),
      selectedIdol: null,
      selectedImage: null,
      paragraphs: [],
    };
  },
  computed: {
    idols() {
      return this.model.idols;
    },
    paragraphs() {
      return this.model.paragraphs;
    },
  },
  watch: {
    idols(idols) {
      if (idols.length === 0) return;
      if (this.selectedIdol) return;
      this.$emit('selectIdol', idols.find((idol) => idol.id === 'chizuru'));
    },
  },
  events: {
    selectIdol(idol) {
      this.selectedIdol = idol;
      this.$emit('selectImage', idol.images[0]);
    },
    selectImage(url) {
      this.selectedImage = url;
    },
    addParagraph(idol, image, text) {
      this.model.addParagraph(idol, image, text);
    },
    swapParagraphs(i, j) {
      this.model.swapParagraphs(i, j);
    },
    removeParagraph(i) {
      this.model.removeParagraph(i);
    },
  },
});
