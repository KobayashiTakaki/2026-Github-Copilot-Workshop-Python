# フロントエンドドキュメント

ポモドーロタイマーアプリのフロントエンド構成と各モジュールの仕様を説明します。

---

## ファイル構成

```
static/
├── css/
│   └── style.css     # UIスタイルシート
└── js/
    └── timer.js      # タイマーロジック

templates/
└── index.html        # メイン画面テンプレート
```

---

## `templates/index.html`

Jinja2テンプレートで記述されたメイン画面HTMLです。

### 主要なDOM構造

| セレクタ | 説明 |
|----------|------|
| `#app` | アプリ全体のコンテナ |
| `.window-header` | タイトルとウィンドウコントロール（×、□、-）を含むヘッダー |
| `.timer-circle` | SVGによる円形プログレスバーとタイマー表示 |
| `.timer-state` | 現在の状態テキスト（「作業中」または「休憩中」） |
| `.timer-time` | 残り時間テキスト（例：`25:00`） |
| `.start-btn` | 開始ボタン |
| `.reset-btn` | リセットボタン |
| `.progress-section` | 今日の進捗セクション |
| `.progress-count` | 今日の完了回数（現在ハードコード値: `4`） |
| `.progress-total` | 今日の集中時間（現在ハードコード値: `1時間40分`） |

### 円形プログレスバー（SVG）

SVGの2つの `<circle>` 要素で構成されています。

```html
<svg width="180" height="180">
  <!-- 背景円（グレー） -->
  <circle cx="90" cy="90" r="80" stroke="#e5e7eb" stroke-width="14" fill="none" />
  <!-- 進捗円（紫・JavaScriptで stroke-dashoffset を操作） -->
  <circle cx="90" cy="90" r="80" stroke="#7c83ea" stroke-width="14" fill="none"
    stroke-dasharray="502" stroke-dashoffset="0" />
</svg>
```

- `r=80` の円の円周：`2π × 80 ≈ 502`（`FULL_DASH_ARRAY` 定数に対応）
- `stroke-dashoffset` を `0〜502` の範囲で変化させることで進捗を視覚化

---

## `static/js/timer.js`

タイマーのすべてのロジックを担うJavaScriptファイルです。フレームワークは使用せず、バニラJSで実装されています。

### 定数・変数

| 名前 | 種類 | 初期値 | 説明 |
|------|------|--------|------|
| `WORK_MINUTES` | 定数 | `25` | 作業セッションの分数 |
| `BREAK_MINUTES` | 定数 | `5` | 休憩セッションの分数 |
| `FULL_DASH_ARRAY` | 定数 | `502` | SVGプログレス円の全周長（`2π × 80`） |
| `timer` | 変数 | `null` | `setInterval` のタイマーID |
| `remainingSeconds` | 変数 | `1500` | 残り秒数（`WORK_MINUTES × 60`） |
| `isRunning` | 変数 | `false` | タイマー動作中フラグ |
| `isWork` | 変数 | `true` | 作業セッション中フラグ |

### 関数

#### `updateDisplay()`

タイマーの表示（残り時間テキストと円形プログレスバー）を現在の状態に合わせて更新します。

- `.timer-time` に `MM:SS` 形式の残り時間を表示
- セッション全体に対する経過割合を計算し、SVGの `stroke-dashoffset` を更新

```javascript
const percent = 1 - (remainingSeconds / total);
progressCircle.setAttribute('stroke-dashoffset', FULL_DASH_ARRAY * percent);
```

#### `startTimer()`

タイマーを開始します。

- `isRunning` が `true` の場合は何もしない（二重起動防止）
- `setInterval` で1秒ごとに `remainingSeconds` をデクリメント
- `remainingSeconds` が0になるとタイマーを停止し、作業/休憩を自動切り替え

**自動切り替えの動作：**
- `isWork` を反転（作業 ↔ 休憩）
- `.timer-state` のテキストを更新（「作業中」または「休憩中」）
- 次のセッションの秒数をセット
- `updateDisplay()` を呼び出して表示を更新

#### `resetTimer()`

タイマーをリセットします。

- `clearInterval` でタイマーを停止
- `isRunning` を `false` にリセット
- 現在のセッション（作業/休憩）に応じた初期秒数をセット
- `updateDisplay()` を呼び出して表示を更新

### イベントリスナー

```javascript
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
```

### 初期化

スクリプト読み込み時に以下を実行します。

```javascript
timerState.textContent = isWork ? '作業中' : '休憩中';
updateDisplay();
```

---

## `static/css/style.css`

アプリ全体のスタイルを定義するCSSファイルです。

### 主要なスタイル

| セレクタ | 説明 |
|----------|------|
| `body` | 紫系グラデーション背景（`#7c83ea` → `#a7b8f5`） |
| `#app` | 白背景・角丸・シャドウのカードUI（幅370px、中央寄せ） |
| `.window-header` | タイトルとウィンドウコントロールのFlexboxレイアウト |
| `.timer-circle` | `position: relative` で SVGとラベルを重ねるコンテナ（180×180px） |
| `.timer-label` | `position: absolute` + `transform: translate(-50%, -50%)` でSVG中央に配置 |
| `.timer-time` | 残り時間テキスト（2.6rem、太字） |
| `.start-btn` | 紫グラデーションの角丸ボタン |
| `.reset-btn` | 白背景・紫ボーダーの角丸ボタン |
| `.progress-box` | 薄紫背景（`#eef1fb`）の進捗カード |

### 使用フォント

```css
font-family: 'Segoe UI', 'Meiryo', sans-serif;
```

Windowsでの日本語表示（Meiryo）にも対応しています。
