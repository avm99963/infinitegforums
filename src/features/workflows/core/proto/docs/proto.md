# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [main.proto](#main-proto)
    - [Action](#workflows-Action)
    - [Action.AttributeAction](#workflows-Action-AttributeAction)
    - [Action.MarkAsReadAction](#workflows-Action-MarkAsReadAction)
    - [Action.MarkAsUnreadAction](#workflows-Action-MarkAsUnreadAction)
    - [Action.MarkDuplicateAction](#workflows-Action-MarkDuplicateAction)
    - [Action.MoveAction](#workflows-Action-MoveAction)
    - [Action.MoveAction.PropertyEntry](#workflows-Action-MoveAction-PropertyEntry)
    - [Action.ReplyAction](#workflows-Action-ReplyAction)
    - [Action.ReplyWithCRAction](#workflows-Action-ReplyWithCRAction)
    - [Action.ReportAction](#workflows-Action-ReportAction)
    - [Action.StarAction](#workflows-Action-StarAction)
    - [Action.SubscribeAction](#workflows-Action-SubscribeAction)
    - [Action.UnmarkDuplicateAction](#workflows-Action-UnmarkDuplicateAction)
    - [Action.VoteAction](#workflows-Action-VoteAction)
    - [Thread](#workflows-Thread)
    - [Workflow](#workflows-Workflow)
  
    - [Action.AttributeAction.AttributeAction](#workflows-Action-AttributeAction-AttributeAction)
    - [Action.ReportAction.ReportType](#workflows-Action-ReportAction-ReportType)
    - [Action.VoteAction.Vote](#workflows-Action-VoteAction-Vote)
  
- [Scalar Value Types](#scalar-value-types)



<a name="main-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## main.proto



<a name="workflows-Action"></a>

### Action



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| reply_action | [Action.ReplyAction](#workflows-Action-ReplyAction) |  |  |
| move_action | [Action.MoveAction](#workflows-Action-MoveAction) |  |  |
| mark_duplicate_action | [Action.MarkDuplicateAction](#workflows-Action-MarkDuplicateAction) |  |  |
| unmark_duplicate_action | [Action.UnmarkDuplicateAction](#workflows-Action-UnmarkDuplicateAction) |  |  |
| attribute_action | [Action.AttributeAction](#workflows-Action-AttributeAction) |  |  |
| reply_with_cr_action | [Action.ReplyWithCRAction](#workflows-Action-ReplyWithCRAction) |  |  |
| star_action | [Action.StarAction](#workflows-Action-StarAction) |  |  |
| subscribe_action | [Action.SubscribeAction](#workflows-Action-SubscribeAction) |  |  |
| vote_action | [Action.VoteAction](#workflows-Action-VoteAction) |  |  |
| report_action | [Action.ReportAction](#workflows-Action-ReportAction) |  |  |
| mark_as_read_action | [Action.MarkAsReadAction](#workflows-Action-MarkAsReadAction) |  |  |
| mark_as_unread_action | [Action.MarkAsUnreadAction](#workflows-Action-MarkAsUnreadAction) |  |  |






<a name="workflows-Action-AttributeAction"></a>

### Action.AttributeAction



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| attribute_action | [Action.AttributeAction.AttributeAction](#workflows-Action-AttributeAction-AttributeAction) |  |  |






<a name="workflows-Action-MarkAsReadAction"></a>

### Action.MarkAsReadAction







<a name="workflows-Action-MarkAsUnreadAction"></a>

### Action.MarkAsUnreadAction







<a name="workflows-Action-MarkDuplicateAction"></a>

### Action.MarkDuplicateAction



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| destination | [Thread](#workflows-Thread) |  |  |






<a name="workflows-Action-MoveAction"></a>

### Action.MoveAction



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| forum_id | [int64](#int64) |  |  |
| category | [string](#string) |  |  |
| language | [string](#string) |  |  |
| property | [Action.MoveAction.PropertyEntry](#workflows-Action-MoveAction-PropertyEntry) | repeated |  |






<a name="workflows-Action-MoveAction-PropertyEntry"></a>

### Action.MoveAction.PropertyEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [string](#string) |  |  |






<a name="workflows-Action-ReplyAction"></a>

### Action.ReplyAction



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| payload | [string](#string) |  |  |
| subscribe | [bool](#bool) |  |  |
| mark_as_answer | [bool](#bool) |  |  |






<a name="workflows-Action-ReplyWithCRAction"></a>

### Action.ReplyWithCRAction



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| canned_response_id | [int64](#int64) |  |  |
| subscribe | [bool](#bool) |  |  |
| mark_as_answer | [bool](#bool) |  |  |






<a name="workflows-Action-ReportAction"></a>

### Action.ReportAction



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| report_type | [Action.ReportAction.ReportType](#workflows-Action-ReportAction-ReportType) |  |  |






<a name="workflows-Action-StarAction"></a>

### Action.StarAction



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| star | [bool](#bool) |  | true stars, and false unstars. |






<a name="workflows-Action-SubscribeAction"></a>

### Action.SubscribeAction



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| subscribe | [bool](#bool) |  | true subscribes, false unsubscribes. |






<a name="workflows-Action-UnmarkDuplicateAction"></a>

### Action.UnmarkDuplicateAction







<a name="workflows-Action-VoteAction"></a>

### Action.VoteAction



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| vote | [Action.VoteAction.Vote](#workflows-Action-VoteAction-Vote) |  |  |






<a name="workflows-Thread"></a>

### Thread



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| forum_id | [int64](#int64) |  |  |
| thread_id | [int64](#int64) |  |  |






<a name="workflows-Workflow"></a>

### Workflow



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| name | [string](#string) |  |  |
| description | [string](#string) |  |  |
| index | [int32](#int32) |  |  |
| actions | [Action](#workflows-Action) | repeated |  |





 


<a name="workflows-Action-AttributeAction-AttributeAction"></a>

### Action.AttributeAction.AttributeAction


| Name | Number | Description |
| ---- | ------ | ----------- |
| AA_NONE | 0 |  |
| AA_LOCK | 1 |  |
| AA_UNLOCK | 2 |  |
| AA_PIN | 3 |  |
| AA_UNPIN | 4 |  |
| AA_NON_ISSUE | 5 |  |
| AA_OBSOLETE | 6 |  |
| AA_REVERT | 7 |  |
| AA_SET_TRENDING | 8 |  |
| AA_UNSET_TRENDING | 9 |  |
| AA_SET_ISSUE_RESOLVED | 10 |  |
| AA_UNSET_ISSUE_RESOLVED | 11 |  |
| AA_SOFT_LOCK | 12 |  |
| AA_UNSOFT_LOCK | 13 |  |
| AA_EXCLUDE_FROM_GOLDEN | 14 |  |
| AA_UNEXCLUDE_FROM_GOLDEN | 15 |  |
| AA_INCLUDE_IN_GOLDEN | 16 |  |



<a name="workflows-Action-ReportAction-ReportType"></a>

### Action.ReportAction.ReportType


| Name | Number | Description |
| ---- | ------ | ----------- |
| RT_UNKNOWN | 0 |  |
| RT_OFF_TOPIC | 1 |  |
| RT_ABUSE | 2 |  |



<a name="workflows-Action-VoteAction-Vote"></a>

### Action.VoteAction.Vote


| Name | Number | Description |
| ---- | ------ | ----------- |
| NONE | 0 |  |
| UP | 1 |  |
| DOWN | -1 |  |


 

 

 



## Scalar Value Types

| .proto Type | Notes | C++ | Java | Python | Go | C# | PHP | Ruby |
| ----------- | ----- | --- | ---- | ------ | -- | -- | --- | ---- |
| <a name="double" /> double |  | double | double | float | float64 | double | float | Float |
| <a name="float" /> float |  | float | float | float | float32 | float | float | Float |
| <a name="int32" /> int32 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="int64" /> int64 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="uint32" /> uint32 | Uses variable-length encoding. | uint32 | int | int/long | uint32 | uint | integer | Bignum or Fixnum (as required) |
| <a name="uint64" /> uint64 | Uses variable-length encoding. | uint64 | long | int/long | uint64 | ulong | integer/string | Bignum or Fixnum (as required) |
| <a name="sint32" /> sint32 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="sint64" /> sint64 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="fixed32" /> fixed32 | Always four bytes. More efficient than uint32 if values are often greater than 2^28. | uint32 | int | int | uint32 | uint | integer | Bignum or Fixnum (as required) |
| <a name="fixed64" /> fixed64 | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. | uint64 | long | int/long | uint64 | ulong | integer/string | Bignum |
| <a name="sfixed32" /> sfixed32 | Always four bytes. | int32 | int | int | int32 | int | integer | Bignum or Fixnum (as required) |
| <a name="sfixed64" /> sfixed64 | Always eight bytes. | int64 | long | int/long | int64 | long | integer/string | Bignum |
| <a name="bool" /> bool |  | bool | boolean | boolean | bool | bool | boolean | TrueClass/FalseClass |
| <a name="string" /> string | A string must always contain UTF-8 encoded or 7-bit ASCII text. | string | String | str/unicode | string | string | string | String (UTF-8) |
| <a name="bytes" /> bytes | May contain any arbitrary sequence of bytes. | string | ByteString | str | []byte | ByteString | string | String (ASCII-8BIT) |

