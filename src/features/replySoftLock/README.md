# Soft lock when replying

Feature that adds a "soft lock" button to the message composer when replying in
a thread.

## General overview

We have a challenge: after injecting an element to the reply editor, Tailwind
will delete it when it rerenders the reply editor. We have observed that this
happens when the "Post" button is clicked.

Thus, the feature works around this by doing the following:

1. When the reply editor is shown (for creating a top-level reply or a nested
   reply, not when editing an existing reply!) the "Soft lock" checkbox is
   injected to the top row of the editor.
2. A global state (saved in `window.twptReplySoftLockStatus`) is initialized
   indicating the current thread and whether the thread should be soft locked
   after posting a reply.
3. When the user toggles the "Soft lock" checkbox, this state is updated.
4. When the user clicks the "Post" button, Tailwind rerenders the editor to
   show a spinner, which deletes our checkbox. Tailwind also sends the `CreateMessage`
   request, which we intercept. We query the global state and decide whether to
   send a request to soft lock the thread before the request to post the
   message is done.

## Known issues

The method described in the previous section has some issues:

### Stale state

If the user:

1. Opens the reply editor and enables "Soft lock".
2. Closes the reply editor.
3. Opens another reply editor, but the checkbox fails to be injected.
4. Posts the reply.

Then the thread will be soft locked. But it shouldn't!

### Visibility when the thread is already soft locked

When a thread is already soft locked, the checkbox is still shown. It would be
a better user experience if it didn't in this case, and in the future we should
aim to achieve this.

### The thread will still be soft locked even if the reply fails to be posted

Since the requests to soft lock the thread and post the reply are done in
parallel, the thread will be soft locked independently of whether the reply was
posted or not.
