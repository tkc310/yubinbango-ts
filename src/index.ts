/**
 * 郵便番号から住所を取得するためのクラス
 * 下記ライブラリのコードを流用してTS化したコード
 * @refs: https://github.com/yubinbango/yubinbango
 */

const CACHE: { [key: string]: { [key: string]: string[] } } = {};

type YubinBangoData = { [key: string]: string[] };

declare global {
  interface Window {
    $yubin: (data: YubinBangoData) => void;
  }
}

// Node.js環境でのグローバル変数
declare global {
  var $yubin: ((data: YubinBangoData) => void) | undefined;
}

export type Address = ReturnType<YubinBango['addrDic']>;

export class YubinBango {
  URL = 'https://yubinbango.github.io/yubinbango-data/data';
  PREFECTURE: (string | null)[] = [
    null,
    '北海道',
    '青森県',
    '岩手県',
    '宮城県',
    '秋田県',
    '山形県',
    '福島県',
    '茨城県',
    '栃木県',
    '群馬県',
    '埼玉県',
    '千葉県',
    '東京都',
    '神奈川県',
    '新潟県',
    '富山県',
    '石川県',
    '福井県',
    '山梨県',
    '長野県',
    '岐阜県',
    '静岡県',
    '愛知県',
    '三重県',
    '滋賀県',
    '京都府',
    '大阪府',
    '兵庫県',
    '奈良県',
    '和歌山県',
    '鳥取県',
    '島根県',
    '岡山県',
    '広島県',
    '山口県',
    '徳島県',
    '香川県',
    '愛媛県',
    '高知県',
    '福岡県',
    '佐賀県',
    '長崎県',
    '熊本県',
    '大分県',
    '宮崎県',
    '鹿児島県',
    '沖縄県',
  ];
  constructor(inputVal: string = '', callback?: (addr: Address) => void) {
    if (inputVal) {
      // 全角の数字を半角に変換、ハイフンが入っていても数字のみを抽出
      const a: string = inputVal.replace(/[０-９]/g, (s: string) =>
        String.fromCharCode(s.charCodeAt(0) - 65248)
      );
      const b: RegExpMatchArray | [] = a.match(/\d/g) || [];
      const c: string = b.join('');
      const yubin7: string | undefined = this.chk7(c);
      // 7桁の数字の時のみ作動
      if (yubin7) {
        this.getAddr(yubin7, callback);
      } else {
        callback?.(this.addrDic());
      }
    }
  }
  chk7(val: string) {
    if (val.length === 7) {
      return val;
    }
  }
  addrDic(
    prefecture_id = '',
    prefecture: string | null = '',
    city = '',
    street = '',
    building = ''
  ) {
    return {
      prefecture_id: prefecture_id,
      prefecture: prefecture || '',
      city: city,
      street: street,
      building: building,
    };
  }
  selectAddr(addr: string[]): Address {
    if (addr && addr[0] && addr[1]) {
      const prefectureId = parseInt(addr[0], 10);
      return this.addrDic(
        addr[0],
        this.PREFECTURE[prefectureId],
        addr[1],
        addr[2],
        addr[3]
      );
    } else {
      return this.addrDic();
    }
  }
  jsonp(url: string, fn: (data: YubinBangoData) => void) {
    // ブラウザ環境の場合
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      window['$yubin'] = data => fn(data);
      const scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'text/javascript');
      scriptTag.setAttribute('charset', 'UTF-8');
      scriptTag.setAttribute('src', url);
      document.head.appendChild(scriptTag);
    } else {
      // Node.js環境の場合
      const https = require('https');
      const http = require('http');

      const protocol = url.startsWith('https:') ? https : http;

      protocol
        .get(url, (res: any) => {
          let data = '';
          res.on('data', (chunk: string) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              // JSONPレスポンスからデータを抽出
              const match = data.match(/\$yubin\((.+)\)/);
              if (match) {
                const jsonData = JSON.parse(match[1]);
                fn(jsonData);
              } else {
                throw new Error('Invalid JSONP response');
              }
            } catch (error) {
              console.error('Error parsing JSONP response:', error);
              fn({});
            }
          });
        })
        .on('error', (error: Error) => {
          console.error('Error fetching data:', error);
          fn({});
        });
    }
  }
  getAddr(yubin7: string, fn?: (addr: Address) => void): void {
    const yubin3 = yubin7.substring(0, 3);
    // 郵便番号上位3桁でキャッシュデータを確認
    if (yubin3 in CACHE && yubin7 in CACHE[yubin3]) {
      fn?.(this.selectAddr(CACHE[yubin3][yubin7]));
    } else {
      this.jsonp(`${this.URL}/${yubin3}.js`, data => {
        CACHE[yubin3] = data;
        fn?.(this.selectAddr(data[yubin7]));
      });
    }
  }
}
