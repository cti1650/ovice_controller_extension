# はじめに

このリポジトリは、Google Chrome の拡張を Next.js で書くためのテンプレートリポジトリになります。

# 使い方

## 1. リポジトリを clone する

```bash
git clone https://github.com/cti1650/github-search-extension.git
```

## 2. ライブラリをインストールする

```bash
yarn
```

## 3. Chrome Extension を作成する

```bash
yarn export
```
以下のコマンドを実行するとPopupページの見た目を  
localhostで検証することができます！
```bash
yarn dev
```

## 4. Chrome Extension を登録する

#### a. Chrome 拡張機能ページにアクセス

```
chrome://extensions/
```

#### b. 拡張機能をパッケージ化

#### c. extensions ディレクトリをアップロード

# 開発について

- `Link`は可能ですが、`URL`の指定を`.html`まで記述する必要があります.
- アプリ名などを指定する場合には`dist/manifest.json`を書き換えます.

## 1. 公開用ファイルの生成

```bash
yarn export
```
以下のコマンドを実行するとPopupページの見た目を  
localhostで検証することができます！
```bash
yarn dev
```

## 2. 各オプション機能の実行

#### a. 拡張機能の ZIP 化

```bash
yarn ext-zip
```

#### b. 拡張機能用アイコンの自動生成

https://github.com/cti1650/chrome_extension_maker_tools

manifest.json と同一階層に icons/icon.png ファイル(サイズ 128px 以上)を格納してから以下のコマンドを実行してください。  
実行すると各サイズ(16px,19px,48px,128px)のアイコン生成と manifest.json へのパス設定を自動的に行います！

```bash
yarn ext-icon-transparent --eq
```

## 3. 拡張機能のバージョン管理

#### a. メジャーアップデート（機能に大きな変更があった場合）

```bash
yarn ext-major
```

#### b. マイナーアップデート（後方互換性を保つ変更があった場合）

```bash
yarn ext-minor
```

#### c. パッチアップデート（バグ修正が行われた場合）

```bash
yarn ext-patch
```

※ `yarn export`時にはパッチアップデートが自動実行されます！
