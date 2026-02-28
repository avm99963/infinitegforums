# 기능 목록

TW Power Tools 확장 프로그램은 다음 기능을 제공합니다:

[TOC]

## 일반

### 다크 모드

커뮤니티 콘솔에서 자체 제작 다크 모드와 기본 라이트 모드를 선택할 수 있습니다.

*** promo
_자동:_ 시스템 설정에서 정의된 화면 모드를 사용합니다.  
_수동:_ 화면 모드를 변경하는 버튼이 커뮤니티 콘솔에 추가됩니다.
***

_커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/ccDarkTheme/presentation/options/assets/screenshot.avif)

### 커뮤니티 콘솔로 리디렉션

기본 Tailwind에서 열리는 모든 게시글을 커뮤니티 콘솔로 리디렉션합니다.

_기본 Tailwind_

### 컴팩트 모드

UI의 여백을 줄입니다.

_기본 Tailwind, 커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/uiSpacing/presentation/options/assets/screenshot.avif)

### 성능 이슈 해결 시도

[pekb/381989895](https://support.google.com/s/community/forum/51488989/thread/381989895)에서 논의된 이슈에 대한 최선의 임시 해결책을 적용합니다.

_커뮤니티 콘솔_

### 사소한 UI 개선

#### 사이드바 헤더 고정

사이드바에 있는 접이식 섹션의 헤더가 스크롤을 내려도 사라지지 않도록 상단에 고정됩니다.

_커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/stickySidebarHeaders/presentation/options/assets/demo.avif)

#### 기본적으로 사이드바 숨기기

커뮤니티 콘솔을 열 때 사이드바를 숨깁니다.

_커뮤니티 콘솔_

#### 공지사항 알림 강조

커뮤니티 콘솔에서 Google 직원이 새 공지를 게시할 때 나타나는 점을 더 눈에 띄게 표시합니다.

_커뮤니티 콘솔_

## 게시글 목록

### 아바타

각 게시글 옆에 참여자들의 아바타를 표시합니다.

_커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/avatars/presentation/options/assets/screenshot.avif)

### 업데이트 알림

게시글 목록에 새 업데이트가 있을 때, 사용자를 방해하지 않는 알림을 표시합니다.

_커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/autoRefresh/presentation/options/assets/screenshot.avif)

### 무한 스크롤

아래로 스크롤할 때 더 많은 게시글을 자동으로 불러옵니다.

*** promo
확장 프로그램이 없어도 커뮤니티 콘솔에서 이 기능을 사용할 수 있습니다.
***

_기본 Tailwind_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/infiniteScroll/presentation/options/assets/demo_thread_list.avif)

### 일괄 작업

#### 일괄 잠금

선택한 모든 게시글을 한 번에 잠그는 버튼을 추가합니다.

_커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/batchLock/presentation/options/assets/demo.avif)

#### 일괄 이동

선택한 모든 게시글을 한 번에 이동시키는 버튼을 추가합니다.

_커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/bulkMove/presentation/options/assets/demo.avif)

### 사소한 UI 개선

#### 일괄 작업 툴바 고정

스크롤을 내려도 툴바가 사라지지 않도록 합니다.

_커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/fixedToolbar/presentation/options/assets/demo.avif)

#### 확장 버튼을 왼쪽으로 이동

"게시글 확장" 버튼을 왼쪽에 위치시킵니다.

_커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/repositionExpandThread/presentation/options/assets/screenshot.avif)

#### 대비 강화

읽은 게시글과 읽지 않은 게시글을 배경색으로 더 쉽게 구분할 수 있도록 대비를 강화합니다.

_커뮤니티 콘솔_

## 게시글

### 댓글을 순서대로 표시

대화형식으로 보기를 비활성화하여 댓글을 목록 형태로 볼 수 있는 토글 버튼을 표시합니다.

_커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/flattenThreads/presentation/options/assets/demo.avif)

### OP가 작성한 메시지 수

OP의 사용자 이름 옆에 지금까지 작성한 메시지 수를 나타내는 배지를 표시합니다.

_기본 Tailwind, 커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/profileIndicator/presentation/options/assets/screenshot.avif)

### 무한 스크롤

아래로 스크롤할 때 더 많은 댓글을 자동으로 불러옵니다.

_기본 Tailwind, 커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/infiniteScroll/presentation/options/assets/demo_thread.avif)

### 게시글 페이지 디자인 변경

신 버전 또는 구 버전 게시글 페이지 디자인을 강제로 표시합니다.

*** promo
구 버전 게시글 페이지 디자인은 부분적으로 손상되었지만, 신 버전 디자인에서 사라진 일부 기능을 필요로 하는 PE분들을 위해 유지되고 있습니다.
***

_커뮤니티 콘솔_

### 일괄 작업

#### 메시지 간편 신고

한 번의 클릭만으로 신고할 수 있는 간편 신고 버튼을 모든 메시지에 추가합니다.

_기본 Tailwind, 커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/bulkReportReplies/presentation/options/assets/demo.avif)

### 사소한 UI 개선

#### 이미지 크기 제한

메시지 내 인라인 이미지의 높이가 현재 창보다 커지지 않도록 합니다.

_기본 Tailwind, 커뮤니티 콘솔_

## 메시지 작성기

### 링크 대화상자 수정

링크를 추가하거나 수정할 때 링크 대화상자가 비정상적으로 여러 번 열리는 버그를 수정합니다.

_커뮤니티 콘솔_

### 사소한 UI 개선

#### Fix canned responses popup

Fixes the selection popup that appears when inserting a CR, so it is shown correctly when some CR has a very long title.

_기본 Tailwind, 커뮤니티 콘솔_

## 구 버전 메시지 작성기

*** promo
이 기능들은 새 게시글이나 CR를 만들 때, 스레드 내에서 `r` 키를 누를 때, 또는 이전 게시글 보기에서 새 답장을 작성할 때 표시되는 커뮤니티 콘솔의 구 버전 메시지 작성기에만 영향을 미칩니다. 신 버전 메시지 작성기에서는 이러한 문제가 발생하지 않습니다.
***

### 링크 드래그 앤 드롭 오류 수정

링크 텍스트를 유지한 채로 텍스트 편집기에 링크를 드래그 앤 드롭할 수 있습니다.

_커뮤니티 콘솔_

### 임시 저장 차단

커뮤니티 콘솔에서 댓글을 작성하는 동안 해당 내용이 Google 서버에 자동으로 임시 저장되는 것을 차단합니다.

_커뮤니티 콘솔_

### 댓글을 작성할 때 임시 저장 메시지 불러오기

커뮤니티 콘솔 기능 `enableLoadingDraftMessages` 을 활성화하여, 새 댓글 작성을 시작할 때 Google 서버에 저장된 기존 임시 글을 불러올 수 있도록 합니다.

_커뮤니티 콘솔_

## 프로필

### 포럼별 활동

프로필에서 포럼별 활동을 표시합니다.

_기본 Tailwind, 커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/extraInfo/presentation/options/assets/per_forum_stats.avif)

### 이전 활동

"이전 활동" 링크를 사용자 프로필에 표시합니다.

_기본 Tailwind, 커뮤니티 콘솔_ | [\[데모\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/previousPosts/presentation/options/assets/screenshot.avif)

