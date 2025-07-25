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

## 公開手順

### 1. 事前準備

```bash
# npmにログイン（初回のみ）
npm login

# パッケージ名の確認
npm view yubinbango-ts
```

### 2. 公開前の確認

```bash
# コードの品質チェック
npm run lint
npm run format:check
npm run type-check

# ビルドの確認
npm run build

# パッケージの内容確認
npm pack --dry-run
```

### 3. バージョン管理

```bash
# パッチバージョンの更新（1.0.0 → 1.0.1）
npm version patch

# マイナーバージョンの更新（1.0.0 → 1.1.0）
npm version minor

# メジャーバージョンの更新（1.0.0 → 2.0.0）
npm version major
```

### 4. 公開

```bash
# npmに公開
npm publish

# または、公開前にビルドを実行
npm run prepublishOnly
npm publish
```

### 5. 公開後の確認

```bash
# 公開されたパッケージの確認
npm view yubinbango-ts

# インストールテスト
npm install yubinbango-ts
```

#### 注意事項

- 公開前に必ずテストを実行してください
- `package.json`の`version`が正しく更新されていることを確認してください
- 初回公開時は`npm publish --access public`を使用してください
- スコープ付きパッケージの場合は適切なスコープを設定してください
