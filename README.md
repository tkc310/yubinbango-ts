# yubinbango-ts

このライブラリは [yubinbango](https://github.com/yubinbango/yubinbango) の内部で利用されている処理をTypeScript化したものです。 

## インストール

```bash
npm i -S yubinbango-ts
```

## 使用方法

### 基本的な使用方法

```typescript
import { YubinBango } from 'yubinbango-ts';

// 郵便番号から住所を取得
const yubin = new YubinBango('1000001', (address) => {
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

### 非同期での使用

```typescript
import { YubinBango } from 'yubinbango-ts';

// 郵便番号を指定して住所を取得
const yubin = new YubinBango('1000001');

// 後から住所を取得
yubin.getAddr('1000001', (address) => {
  console.log('住所:', address.prefecture + address.city + address.street);
});
```

### 型定義

```typescript
import { Address } from 'yubinbango-ts';

// Address型を使用
const address: Address = {
  prefecture_id: '13',
  prefecture: '東京都',
  city: '千代田区',
  street: '千代田',
  building: ''
};
```

## API

### YubinBango クラス

#### コンストラクタ

```typescript
new YubinBango(inputVal?: string, callback?: (addr: Address) => void)
```

- `inputVal`: 郵便番号（7桁の数字、ハイフン付きでも可）
- `callback`: 住所取得後のコールバック関数

#### メソッド

##### getAddr(yubin7: string, fn?: (addr: Address) => void): void

指定された郵便番号から住所を取得します。

- `yubin7`: 7桁の郵便番号
- `fn`: 住所取得後のコールバック関数

### Address 型

```typescript
interface Address {
  prefecture_id: string;  // 都道府県ID
  prefecture: string;     // 都道府県名
  city: string;          // 市区町村名
  street: string;        // 町域名
  building: string;      // 建物名
}
```

## 特徴

- TypeScriptで完全に型安全
- ブラウザ環境での動作を前提
- 郵便番号データのキャッシュ機能
- 全角数字の自動変換
- ハイフン付き郵便番号の対応

## 注意事項

- このライブラリはブラウザ環境でのみ動作します
- 郵便番号データは外部APIから取得されます
- ネットワーク接続が必要です

## ライセンス

MIT License

## 開発

### Setup

```bash
# 依存関係のインストール
npm i

# .git/hooksの設定
npx lefthook install
```

### Usage

```bash
# 開発モードでビルド（ファイル監視）
npm run dev

# ビルド
npm run build

# リント
npm run lint
npm run lint:fix

# フォーマット
npm run format
npm run format:check

# 型チェック
npm run type-check
```
