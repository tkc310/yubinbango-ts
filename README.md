# yubinbango-ts

- このライブラリは [yubinbango-core](https://github.com/yubinbango/yubinbango-core) の内部で利用されている処理をTypeScript化したものです。  
  住所のマスタデータは[yubinbango-data](https://github.com/yubinbango/yubinbango-data) から取得されます。
- ブラウザ環境とNode.js環境(httpsモジュールを利用)の両方で動作します。
- 郵便番号データは外部APIから取得されます。(ネットワーク接続が必要です)

## Install

```bash
npm i yubinbango-ts
yarn add yubinbango-ts
pnpm install yubinbango-ts
```

## Usage

```typescript
import { YubinBango } from 'yubinbango-ts';

// 郵便番号から住所を取得
new YubinBango('1000001', address => {
  console.log(address);
  // {
  //   prefecture_id: '13',
  //   prefecture: '東京都',
  //   city: '千代田区',
  //   street: '千代田',
  //   building: ''
  // }
});
```

## API

### constructor

```typescript
import { YubinBango } from 'yubinbango-ts';

new YubinBango(yubinBango?: string, callback?: (addr: Address) => void)
```

- `yubinBango`: 郵便番号（7桁の数字、ハイフン付きでも可）
- `callback`: 住所取得後のコールバック関数

### Address 型

```typescript
import { Address } from 'yubinbango-ts';

interface Address {
  prefecture_id: string; // 都道府県ID
  prefecture: string; // 都道府県名
  city: string; // 市区町村名
  street: string; // 町域名
  building: string; // 建物名
}
```

### 都道府県マスタ

```typescript
import { YUBINBANGO_PREFECTURE } from 'yubinbango-ts';

const YUBINBANGO_PREFECTURE = [
  { value: '1', id: 'hokkaido', label: '北海道' },
  { value: '2', id: 'aomori', label: '青森県' },
  { value: '3', id: 'iwate', label: '岩手県' },
  ...
];
```
