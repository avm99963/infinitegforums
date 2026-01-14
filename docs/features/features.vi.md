# Features

The TW Power Tools extension offers the following features:

[TOC]

## General

### Dark theme

Enables choosing between a custom-built dark theme and the vanilla light theme in the Community Console.

*** promo
_Automatic:_ will use the theme defined in the system settings.  
_Manual:_ will add a button to the Community Console that lets you switch the theme.
***

_Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/ccDarkTheme/presentation/options/assets/screenshot.avif)

### Redirect to the Community Console

Redirects all threads opened in Tailwind Basic to the Community Console.

_Tailwind Basic_

### Compact mode

Reduce the whitespace in the UI.

_Tailwind Basic, Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/uiSpacing/presentation/options/assets/screenshot.avif)

### Attempt to fix performance issues

Best-effort workaround for the issues discussed at [pekb/381989895](https://support.google.com/s/community/forum/51488989/thread/381989895).

_Community Console_

### Minor UI enhancements

#### Sticky sidebar headers

Makes the headers of the collapsible sections in the sidebar sticky so they don't disappear when scrolling down.

_Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/stickySidebarHeaders/presentation/options/assets/demo.avif)

#### Hide sidebar by default

Hides the sidebar when opening the Community Console.

_Community Console_

#### Highlight announcements notification dot

Shows more prominently the dot that appears in the Community Console when Googlers publish a new announcement.

_Community Console_

## Thread lists

### Avatars

Shows avatars of participants next to each thread.

_Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/avatars/presentation/options/assets/screenshot.avif)

### Notify updates

Shows a non-intrusive notification when a thread list has new updates.

_Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/autoRefresh/presentation/options/assets/screenshot.avif)

### Infinite scroll

Automatically loads more threads when scrolling down.

*** promo
The Community Console already has this feature built-in without the need of the extension.
***

_Tailwind Basic_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/infiniteScroll/presentation/options/assets/demo_thread_list.avif)

### Bulk actions

#### Bulk lock

Adds a button to lock all selected threads at once.

_Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/batchLock/presentation/options/assets/demo.avif)

#### Bulk move

Adds a button to move all selected threads at once.

_Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/bulkMove/presentation/options/assets/demo.avif)

### Minor UI enhancements

#### Sticky bulk actions toolbar

Makes the toolbar not disappear when scrolling down.

_Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/fixedToolbar/presentation/options/assets/demo.avif)

#### Place expand button in the left

Places the "expand thread" button all the way to the left.

_Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/repositionExpandThread/presentation/options/assets/screenshot.avif)

#### Increase contrast

Increases contrast between the background of read and unread threads.

_Community Console_

## Threads

### Flatten replies

Shows a toggle which lets you disable nested view to display the replies flattened.

_Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/flattenThreads/presentation/options/assets/demo.avif)

### OP messages count

Shows a badge next to the OP's username with the number of messages posted by them.

_Tailwind Basic, Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/profileIndicator/presentation/options/assets/screenshot.avif)

### Infinite scroll

Automatically loads more replies when scrolling down.

_Tailwind Basic, Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/infiniteScroll/presentation/options/assets/demo_thread.avif)

### Change thread page design

Forces showing the new or old thread page design.

*** promo
The old thread page design is partially broken, but this feature is kept since some PEs rely on it to access some features that are missing in the new design.
***

_Community Console_

### Bulk actions

#### Report replies quickly

Adds quick report buttons to all replies, so you can report each one with a single click.

_Tailwind Basic, Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/bulkReportReplies/presentation/options/assets/demo.avif)

### Minor UI enhancements

#### Limit image size

Prevents inline images in messages from being taller than the current window.

_Tailwind Basic, Community Console_

## Message composer

### Fix link dialog

Patches the bug that incorrectly opens the link dialog multiple times when adding or editing a link.

_Community Console_

## Old message composer

*** promo
These features only affect the Community Console's old message composer, which is shown when creating a new thread or canned response, when pressing `r` inside a thread, or when creating a new reply in the old thread view. The new message composer doesn't suffer from these issues.
***

### Fix drag and dropping links

Allows to drag and drop links to the text editor while preserving the link text.

_Community Console_

### Block saving drafts

Blocks saving drafts of your replies as you type to Google servers in the Community Console.

_Community Console_

### Load draft messages when replying

Enables the `enableLoadingDraftMessages` Community Console flag, which enables recovering an existing draft saved in the Google servers when you start a new reply.

_Community Console_

## Profiles

### Per-forum activity

Shows a per-forum activity chart in profiles.

_Tailwind Basic, Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/extraInfo/presentation/options/assets/per_forum_stats.avif)

### Previous posts

Shows a "previous posts" link in user profiles.

_Tailwind Basic, Community Console_ | [\[demo\]](https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/src/features/previousPosts/presentation/options/assets/screenshot.avif)

