# アーキテクチャ概要

ポモドーロタイマーWebアプリの現在の実装アーキテクチャを説明します。

---

## ディレクトリ構成

```
1.pomodoro/
├── app.py                # FlaskアプリケーションのエントリーポイントとRouting定義
├── models.py             # データモデル（現在は未実装・スタブ）
├── static/
│   ├── css/
│   │   └── style.css     # UIスタイルシート
│   └── js/
│       └── timer.js      # タイマーロジック（フロントエンド）
├── templates/
│   └── index.html        # メイン画面HTMLテンプレート（Jinja2）
└── test_app.py           # Flaskルートのユニットテスト
```

---

## レイヤー構成

現在の実装は以下のシンプルな2層構造です。

```
[クライアント（ブラウザ）]
    ↕ HTTP GET /
[Flaskサーバー (app.py)]
    → テンプレートレンダリング (templates/index.html)
    → 静的ファイル配信 (static/)
```

### バックエンド（Flask）

- **`app.py`**
  - `Flask(__name__)` でアプリケーションを生成
  - `GET /` ルートが `render_template('index.html')` を返す
  - `app.run()` で開発サーバー起動
  - 現時点でAPIエンドポイントは存在しない

- **`models.py`**
  - 進捗管理用モデルのスタブファイル（コメントのみ、実装なし）

### フロントエンド（HTML/CSS/JS）

- **`templates/index.html`**
  - ポモドーロタイマーのUIレイアウト（Jinja2テンプレート）
  - SVGによる円形プログレスバー
  - タイマー表示・状態表示・操作ボタン
  - 今日の進捗セクション（完了数・集中時間）は静的なハードコード値

- **`static/css/style.css`**
  - アプリ全体のスタイル定義

- **`static/js/timer.js`**
  - タイマーのカウントダウンロジックをすべてクライアントサイドで管理

---

## データフロー

現在の実装では、進捗データのサーバー送受信は実装されていません。

```
ページアクセス
    → Flask が index.html を返す
    → ブラウザで timer.js が読み込まれる
    → ユーザー操作（開始・リセット）がJS内で完結
    → 進捗表示はHTMLにハードコードされた値（4完了・1時間40分）
```

---

## 技術スタック

| 要素 | 技術 |
|------|------|
| バックエンド | Python / Flask |
| テンプレートエンジン | Jinja2 |
| フロントエンド | HTML / CSS / JavaScript（バニラ） |
| スタイル | カスタムCSS（グラデーション、SVG） |
| テスト | Python unittest |
