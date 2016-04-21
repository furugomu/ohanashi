// おはなしのモデル
// アイドル一覧とできあがったおはなしを保持する
export class Ohanashi {
  constructor() {
    this.idols = [];
    this.paragraphs = [];
  }

  fetchIdols() {
    getJson('./millionstars.json')
    .then((idols) => {
      this.idols.splice(0, this.idols.length, ...idols);
    })
    .catch((err) => alert('アイドルデータの読み込みに失敗しました: ' + err));
  }

  // 追加する
  addParagraph(idol, image, text) {
    this.paragraphs.push({idol, image, text});
  }

  // 入れ替える
  swapParagraphs(i, j) {
    let ps = this.paragraphs;
    let t = ps[i];
    ps[i] = ps[j];
    ps[j] = t;
  }

  // 取り除く
  removeParagraph(i) {
    this.paragraphs.splice(i, 1);
  }
}

function getJson(url) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', './millionstars.json');
  xhr.responseType = 'json';
  xhr.send();
  return new Promise((resolve, reject) => {
    xhr.addEventListener('load', () => resolve(xhr.response));
    xhr.addEventListener('error', reject);
  });
}
