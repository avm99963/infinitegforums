# 機能

TW Power Tools 拡張機能は、以下の機能を提供します。

[TOC]

## 一般

### ダークテーマ

コミュニティコンソールで、独自に作成されたダークテーマと標準のライトテーマのいずれかを選択できるようにします

*** promo
_自動:_ は、システム設定で定義されたテーマを使用します。  
_手動:_ は、コミュニティ コンソールにテーマを切り替えられるボタンを追加します。
***

_コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/ccDarkTheme/presentation/options/assets/screenshot.avif)

### コミュニティコンソールにリダイレクトします

Tailwind Basic で開かれたすべてのスレッドを、コミュニティコンソールにリダイレクトします

_Tailwind Basic_

### コンパクトモード

ユーザーインターフェース内の余白を減らします

_Tailwind Basic, コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/uiSpacing/presentation/options/assets/screenshot.avif)

### パフォーマンス問題の修正を試みます

[pekb/381989895](https://support.google.com/s/community/forum/51488989/thread/381989895) で議論されている問題に対する、可能な範囲での対応策です。

_コミュニティコンソール_

### 軽微なUI改善

#### サイドバーのヘッダーを固定表示します

サイドバー内の折りたたみ可能なセクションのヘッダーを固定し、スクロールしても非表示にならないようにします

_コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/stickySidebarHeaders/presentation/options/assets/demo.avif)

#### デフォルトでサイドバーを非表示にします

コミュニティコンソールを開いたときにサイドバーを非表示にします

_コミュニティコンソール_

#### お知らせ通知のドットを強調表示します

Googlerが新しいお知らせを公開した際に、コミュニティコンソールに表示されるドットをより目立つ形で表示します

_コミュニティコンソール_

## スレッド リスト

### アバター

各スレッドの横に参加者のアバターを表示

_コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/avatars/presentation/options/assets/screenshot.avif)

### 更新を通知

スレッド一覧に新しい更新があった際に、控えめな通知を表示します

_コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/autoRefresh/presentation/options/assets/screenshot.avif)

### 無限スクロール

下にスクロールすると、スレッドが自動的にさらに読み込まれます

*** promo
この機能はすでにコミュニティコンソールに標準搭載されており、拡張機能は必要ありません
***

_Tailwind Basic_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/infiniteScroll/presentation/options/assets/demo_thread_list.avif)

### 一括操作

#### 一括ロック

選択したすべてのスレッドを一括でロックするためのボタンを追加します

_コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/batchLock/presentation/options/assets/demo.avif)

#### 一括移動

選択したすべてのスレッドを一括で移動するためのボタンを追加します

_コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/bulkMove/presentation/options/assets/demo.avif)

### 軽微なUI改善

#### 一括操作ツールバーを固定表示します

下にスクロールしてもツールバーが消えないようにします

_コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/fixedToolbar/presentation/options/assets/demo.avif)

#### 展開ボタンを左側に配置します

「スレッドを展開」ボタンを一番左端に配置します

_コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/repositionExpandThread/presentation/options/assets/screenshot.avif)

#### コントラストを強化します

既読スレッドと未読スレッドの背景のコントラストを強めます

_コミュニティコンソール_

## スレッド

### 返信をフラット表示にします

返信をフラット表示にするために、ネスト表示を無効にできる切り替えスイッチを表示します

_コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/flattenThreads/presentation/options/assets/demo.avif)

### スレッド作成者(OP)のメッセージ数

スレッド作成者（OP）のユーザー名の横に、そのユーザーが投稿したメッセージ数を示すバッジを表示します

_Tailwind Basic, コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/profileIndicator/presentation/options/assets/screenshot.avif)

### 無限スクロール

下にスクロールすると、返信が自動的にさらに読み込まれます

_Tailwind Basic, コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/infiniteScroll/presentation/options/assets/demo_thread.avif)

### スレッドページのデザインを変更します

新しいスレッドページデザインまたは古いスレッドページデザインのいずれかを強制的に表示させます

*** promo
「スレッドページのデザインを変更」機能に関する追加情報が、オプションページに表示されます
***

_コミュニティコンソール_

### 一括操作

#### Report messages quickly

Adds quick report buttons to all messages, so you can report each one with a single click.

_Tailwind Basic, コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/bulkReportReplies/presentation/options/assets/demo.avif)

### 軽微なUI改善

#### 画像サイズを制限します

メッセージ内のインライン画像が現在のウィンドウの高さを超えて表示されないようにします

_Tailwind Basic, コミュニティコンソール_

## メッセージ作成画面

### リンクダイアログを修正

リンクを追加または編集する際に、リンクダイアログが誤って複数回開いてしまうバグを修正します

_コミュニティコンソール_

### 軽微なUI改善

#### Fix canned responses popup

Fixes the selection popup that appears when inserting a CR, so it is shown correctly when some CR has a very long title.

_Tailwind Basic, コミュニティコンソール_

## 旧メッセージ作成画面

*** promo
これらの機能は、コミュニティコンソールの旧メッセージ作成画面にのみ影響します。 旧メッセージ作成画面は、新しいスレッドや定型返信を作成する際、スレッド内で `r` キーを押したとき、または旧スレッドビューで新しい返信を作成する際に表示されます。 新しいメッセージ作成画面では、これらの問題は発生しません。
***

### リンクのドラッグ＆ドロップ機能を修正します

リンクテキストを保持したまま、リンクをテキストエディタにドラッグ＆ドロップできるようにします

_コミュニティコンソール_

### 下書きの保存をブロックする

コミュニティコンソールにおいて、入力中の返信の下書きをGoogleのサーバーに保存する処理をブロックします

_コミュニティコンソール_

### 返信時に下書きメッセージを読み込みます

コミュニティコンソールの `enableLoadingDraftMessages` フラグを有効にします。これにより、新しい返信を開始する際に、Google のサーバーに保存されている既存の下書きを復元できるようになります。

_コミュニティコンソール_

## プロファイル

### フォーラム別のアクティビティ

プロフィール内に、フォーラムごとの活動チャートを表示します

_Tailwind Basic, コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/extraInfo/presentation/options/assets/per_forum_stats.avif)

### 過去の投稿

ユーザープロフィールに「過去の投稿」リンクを表示します

_Tailwind Basic, コミュニティコンソール_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/previousPosts/presentation/options/assets/screenshot.avif)

