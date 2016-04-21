import Vue from 'vue';

export default Vue.extend({
  name: 'Canvas_', // Canvas だと <canvas> で再帰する
  template: '<div><canvas v-el:canvas width=640 :height="height" style="width: 320px"></canvas></div>',
  props: {
    paragraphs: {type: Array, default: ()=>[]},
  },
  data() {
    return {
      unitHeight: 168,
      wakuUrl: 'images/11006e59e67.png',
      bgUrl: 'images/11002c9b1d8.png',
    };
  },
  created() {
    this.waku = new Image();
    this.waku.src = this.wakuUrl;
    this.bg = new Image();
    this.bg.src = this.bgUrl;
  },
  watch: {
    paragraphs(ps) {
      let ctx = this.$els.canvas.getContext('2d');

      // 背景
      for (let y = 0; y < this.height; y += this.bg.height) {
        ctx.drawImage(this.bg, 0, y);
      }
      // せりふ
      ps.forEach((p, i) => {
        let y = i * this.unitHeight;
        // 顔
        drawImage(p.image, 8, 8 + y);
        // ふきだし
        ctx.drawImage(this.waku, 174, 8 + y);
        // なまえ
        ctx.font = 'bold 28px/35px "Arial", sans-serif';
        ctx.fillStyle = '#f33281';
        ctx.fillText(p.idol.name, 184, 42 + y);
        // せりふ
        ctx.fillStyle = 'black';
        let lines = wrapText(p.text, ctx, 428);
        lines.forEach((line, j) => {
          let ty = y + 76 + j * 35;
          ctx.fillText(line, 184, ty);
        });
      });

      function drawImage(url, x, y) {
        let i = new Image();
        i.src = url;
        i.onload = () => ctx.drawImage(i, x, y);
      }
    },
  },
  computed: {
    height() {
      return this.paragraphs.length * this.unitHeight;
    },
  },
  methods: {
    // できあがった画像の data URL を返す
    getUrl() {
      let canvas = this.$els.canvas;
      // 可能なら blob にしたいがポップアップブロックされるのでこまった
      /*
      if (canvas.toBlob) {
        return new Promise((resolve, reject) => {
          // canvas が空だと blob が null になる
          canvas.toBlob((blob) => blob ? resolve(URL.createObjectURL(blob)) : reject());
        });
      }
      */
      return canvas.toDataURL();
    },
  },
});

function wrapText(text, ctx, width) {
  let lines = [];
  if (!text) { return lines; }
  for (let i = 1; i < text.length; ++i) {
    let metrics = ctx.measureText(text.substring(0, i));
    if (metrics.width > width) {
      lines.push(text.substring(0, i - 1));
      text = text.substring(i - 1);
      i = 0;
    }
  }
  lines.push(text);
  return lines;
}
