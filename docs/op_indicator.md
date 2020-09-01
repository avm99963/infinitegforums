[En español](op_indicator.es.md)

# OP indicator
This is a feature which shows an indicator in threads next to the OP's username,
in order to help PEs notice whether the OP has participated in other threads,
which helps PEs find duplicate threads or get more context about the user
problem by visiting the other threads in which they posted/replied.

There are two options, which use different methods and indicators to help you
determine whether the OP participated in other threads:

1. The first option searches in the current Forum for the 5 most recent posts
in which the OP participated. Then, depending on the thread list returned, a dot
is displayed next to their username with one of the following states:
    * Blue dot: if the search only returned the current thread.
    * Orange dot: if the search returned more threads, but the other threads are
    marked as read.
    * Red dot: if the search returned more threads, but at least one of the other
    threads is not marked as read.
2. The second option makes a request to load the user profile instead of
searching in the forum the actual threads. This returns the number of posts
(including new threads, normal replies and recommended replies) made by the user
over the last year, aggregated by month. The extension sums the values for the
`n` most recent months (`n` is a configurable value) and then shows this
resulting number next to the OP's username.
