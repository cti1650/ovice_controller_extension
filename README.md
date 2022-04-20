# はじめに

このリポジトリは、[バーチャルオフィス oVice](https://ovice.in/ja/) ユーザーとしてあるといいなと感じた機能を  
手軽に使えるようにChrome拡張機能化するために作成したリポジトリです。

[Chrome拡張機能インストールページ](https://chrome.google.com/webstore/detail/ovice-controller-extensio/bebojhcmkpcojcalbadohngjiacdcdde?hl=ja&authuser=0)  
![oVice_controller_extension](https://user-images.githubusercontent.com/15701307/164227814-36149a49-9f6e-49be-9c14-9546f454ba7c.gif)


## 実装している機能

- oViceタブを別タブから操作
  - マイク切替（mic）
  - 音声ミュート切替(volume)
  - 画面共有切替(ScreenShare)
  - oViceタブを前面に表示
  - 離席
  - 会議室、oViceを退室

- oViceタブの状態を表示
  - マイク ON, OFF
  - ミュート ON, OFF
  - 画面共有 ON, OFF
  - 所在確認　ログアウト, パブリックスペース, 会議室

- 拡張機能アイコンに状態を表示
  - マイク ON, OFF

## 使用方法

- 拡張機能をインストール  
  https://chrome.google.com/webstore/detail/ovice-controller-extensio/bebojhcmkpcojcalbadohngjiacdcdde?hl=ja&authuser=0  

- 拡張機能の表示・非表示を切り替え  
![スクリーンショット 2022-04-18 2 09 15](https://user-images.githubusercontent.com/15701307/163725085-1a18b160-6858-47d0-99b7-21d76bbf7abc.png)

- 拡張機能のアクションボタンを押下  
- 任意のボタンで動作を実行  
![スクリーンショット 2022-04-18 2 10 34](https://user-images.githubusercontent.com/15701307/163725121-df885c5d-a0d6-4057-8b64-f37d1700d2fc.png)





# ローカル環境構築

## 1. リポジトリを clone する

```bash
git clone https://github.com/cti1650/ovice_controller_extension.git
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
