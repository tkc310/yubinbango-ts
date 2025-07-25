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

export const YUBINBANGO_PREFECTURE = [
  { value: '1', id: 'hokkaido', label: '北海道' },
  { value: '2', id: 'aomori', label: '青森県' },
  { value: '3', id: 'iwate', label: '岩手県' },
  { value: '4', id: 'miyagi', label: '宮城県' },
  { value: '5', id: 'akita', label: '秋田県' },
  { value: '6', id: 'yamagata', label: '山形県' },
  { value: '7', id: 'fukushima', label: '福島県' },
  { value: '8', id: 'ibaraki', label: '茨城県' },
  { value: '9', id: 'tochigi', label: '栃木県' },
  { value: '10', id: 'gunma', label: '群馬県' },
  { value: '11', id: 'saitama', label: '埼玉県' },
  { value: '12', id: 'chiba', label: '千葉県' },
  { value: '13', id: 'tokyo', label: '東京都' },
  { value: '14', id: 'kanagawa', label: '神奈川県' },
  { value: '15', id: 'niigata', label: '新潟県' },
  { value: '16', id: 'toyama', label: '富山県' },
  { value: '17', id: 'ishikawa', label: '石川県' },
  { value: '18', id: 'fukui', label: '福井県' },
  { value: '19', id: 'yamanashi', label: '山梨県' },
  { value: '20', id: 'nagano', label: '長野県' },
  { value: '21', id: 'gifu', label: '岐阜県' },
  { value: '22', id: 'shizuoka', label: '静岡県' },
  { value: '23', id: 'aichi', label: '愛知県' },
  { value: '24', id: 'mie', label: '三重県' },
  { value: '25', id: 'shiga', label: '滋賀県' },
  { value: '26', id: 'kyoto', label: '京都府' },
  { value: '27', id: 'osaka', label: '大阪府' },
  { value: '28', id: 'hyogo', label: '兵庫県' },
  { value: '29', id: 'nara', label: '奈良県' },
  { value: '30', id: 'wakayama', label: '和歌山県' },
  { value: '31', id: 'tottori', label: '鳥取県' },
  { value: '32', id: 'shimane', label: '島根県' },
  { value: '33', id: 'okayama', label: '岡山県' },
  { value: '34', id: 'hiroshima', label: '広島県' },
  { value: '35', id: 'yamaguchi', label: '山口県' },
  { value: '36', id: 'tokushima', label: '徳島県' },
  { value: '37', id: 'kagawa', label: '香川県' },
  { value: '38', id: 'ehime', label: '愛媛県' },
  { value: '39', id: 'kochi', label: '高知県' },
  { value: '40', id: 'fukuoka', label: '福岡県' },
  { value: '41', id: 'saga', label: '佐賀県' },
  { value: '42', id: 'nagasaki', label: '長崎県' },
  { value: '43', id: 'kumamoto', label: '熊本県' },
  { value: '44', id: 'oita', label: '大分県' },
  { value: '45', id: 'miyazaki', label: '宮崎県' },
  { value: '46', id: 'kagoshima', label: '鹿児島県' },
  { value: '47', id: 'okinawa', label: '沖縄県' },
];
export interface YubinBangoOptions {
  url?: string;
}

export class YubinBango {
  URL: string;
  PREFECTURE: (string | null)[] = [
    null,
    ...YUBINBANGO_PREFECTURE.map(p => p.label),
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
