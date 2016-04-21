import Vue from 'vue';
import store from '../store';

export default Vue.extend({
  name: 'App',
  template: '#app-template',
  data() {
    return {
      idols: [],
      selectedIdol: null,
      selectedImage: null,
      paragraphs: [],
    };
  },
  created() {
    store.on('idols-updated', this.onIdolsUpdated);
    store.on('idol-selected', this.onIdolSelected);
    store.on('image-selected', this.onImageSelected);
    store.on('paragraphs-updated', this.onParagraphsUpdated);
    store.fetchIdols();
  },
  destroyed() {
    store.removeListener('idols-updated', this.onIdolsUpdated);
    store.removeListener('idol-selected', this.onIdolSelected);
    store.removeListener('image-selected', this.onImageSelected);
    store.removeListener('paragraphs-updated', this.onParagraphsUpdated);
  },
  methods: {
    onIdolsUpdated(idols) {
      this.idols = idols;
      store.selectIdol(idols.find((idol) => idol.id === 'chizuru'));
    },
    onIdolSelected(idol) {
      this.selectedIdol = idol;
    },
    onImageSelected(url) {
      this.selectedImage = url;
    },
    onParagraphsUpdated(paragraphs) {
      this.paragraphs = paragraphs;
    }
  },
  events: {
    selectIdol(idol) {
      store.selectIdol(idol);
    },
    selectImage(url) {
      store.selectImage(url);
    },
    addParagraph(idol, image, text) {
      store.addParagraph(idol, image, text);
    },
    swapParagraphs(i, j) {
      store.swapParagraphs(i, j);
    },
    removeParagraph(i) {
      store.removeParagraph(i);
    }
  },
});
