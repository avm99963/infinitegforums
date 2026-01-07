# Fix pekb/381989895

This feature fixes the performance issues reported at [pekb/381989895][thread].

## Context

Part of the issue is caused by the
`profile_abuse.manual_review_timestamp_micro` field found in user profiles. For
some users, this field contains hundreds of thousands of entries, which is
downloaded to the Community Console in different ways.

This feature deletes the information from this field in as many places as we
have found, to make sure that the Community Console code doesn't keep this
information in memory (and hoping that it will be garbage-collected soon by the
browser to free up memory).

We can't do better, since we're deleting the data as soon as we can. The full
fix can only be made by Google by not sending this data over the wire, or
fixing the bug that makes this list contain too many elements (many of them are
repeated).

Deleting the field works because it doesn't seem to be used by the Community
Console frontend for any purpose.

Furthermore, we intercept the `ViewForum` requests which are used to show the
unread message count in the sidebar chips (e.g. "Needs review (999+)"). These
requests ask for 1000 messages, which exacerbates the memory issue. We modify
these requests to ask for 0 messages instead.

[thread]: https://support.google.com/s/community/forum/51488989/thread/381989895
