# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [api_proto/common.proto](#api_proto_common-proto)
    - [Environment](#-Environment)
  
    - [Environment.Browser](#-Environment-Browser)
    - [Environment.VersionChannel](#-Environment-VersionChannel)
  
- [api_proto/kill_switch.proto](#api_proto_kill_switch-proto)
    - [AddAuthorizedUserRequest](#-AddAuthorizedUserRequest)
    - [AddAuthorizedUserResponse](#-AddAuthorizedUserResponse)
    - [DeleteAuthorizedUserRequest](#-DeleteAuthorizedUserRequest)
    - [DeleteAuthorizedUserResponse](#-DeleteAuthorizedUserResponse)
    - [DisableKillSwitchRequest](#-DisableKillSwitchRequest)
    - [DisableKillSwitchResponse](#-DisableKillSwitchResponse)
    - [EnableKillSwitchRequest](#-EnableKillSwitchRequest)
    - [EnableKillSwitchResponse](#-EnableKillSwitchResponse)
    - [GetKillSwitchOverviewRequest](#-GetKillSwitchOverviewRequest)
    - [GetKillSwitchOverviewResponse](#-GetKillSwitchOverviewResponse)
    - [GetKillSwitchStatusRequest](#-GetKillSwitchStatusRequest)
    - [GetKillSwitchStatusResponse](#-GetKillSwitchStatusResponse)
    - [ListAuthorizedUsersRequest](#-ListAuthorizedUsersRequest)
    - [ListAuthorizedUsersResponse](#-ListAuthorizedUsersResponse)
    - [ListFeaturesRequest](#-ListFeaturesRequest)
    - [ListFeaturesResponse](#-ListFeaturesResponse)
    - [SyncFeaturesRequest](#-SyncFeaturesRequest)
    - [SyncFeaturesResponse](#-SyncFeaturesResponse)
    - [UpdateAuthorizedUserRequest](#-UpdateAuthorizedUserRequest)
    - [UpdateAuthorizedUserResponse](#-UpdateAuthorizedUserResponse)
  
    - [KillSwitchService](#-KillSwitchService)
  
- [api_proto/kill_switch_objects.proto](#api_proto_kill_switch_objects-proto)
    - [AuthorizedUserTransformation](#-AuthorizedUserTransformation)
    - [Feature](#-Feature)
    - [KillSwitch](#-KillSwitch)
    - [KillSwitchAuditLogEntry](#-KillSwitchAuditLogEntry)
    - [KillSwitchAuditLogEntry.AuthorizedUserAdded](#-KillSwitchAuditLogEntry-AuthorizedUserAdded)
    - [KillSwitchAuditLogEntry.AuthorizedUserDeleted](#-KillSwitchAuditLogEntry-AuthorizedUserDeleted)
    - [KillSwitchAuditLogEntry.AuthorizedUserUpdated](#-KillSwitchAuditLogEntry-AuthorizedUserUpdated)
    - [KillSwitchAuditLogEntry.KillSwitchDisabled](#-KillSwitchAuditLogEntry-KillSwitchDisabled)
    - [KillSwitchAuditLogEntry.KillSwitchEnabled](#-KillSwitchAuditLogEntry-KillSwitchEnabled)
    - [KillSwitchAuthorizedUser](#-KillSwitchAuthorizedUser)
    - [KillSwitchTransformation](#-KillSwitchTransformation)
  
    - [Feature.Type](#-Feature-Type)
    - [KillSwitchAuthorizedUser.AccessLevel](#-KillSwitchAuthorizedUser-AccessLevel)
  
- [Scalar Value Types](#scalar-value-types)



<a name="api_proto_common-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## api_proto/common.proto



<a name="-Environment"></a>

### Environment



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| browser | [Environment.Browser](#Environment-Browser) |  |  |
| version | [string](#string) |  |  |
| version_channel | [Environment.VersionChannel](#Environment-VersionChannel) |  |  |





 


<a name="-Environment-Browser"></a>

### Environment.Browser


| Name | Number | Description |
| ---- | ------ | ----------- |
| BROWSER_UNKNOWN | 0 |  |
| BROWSER_CHROMIUM | 1 |  |
| BROWSER_GECKO | 2 |  |



<a name="-Environment-VersionChannel"></a>

### Environment.VersionChannel


| Name | Number | Description |
| ---- | ------ | ----------- |
| CHANNEL_UNKNOWN | 0 |  |
| CHANNEL_STABLE | 1 |  |
| CHANNEL_BETA | 2 |  |


 

 

 



<a name="api_proto_kill_switch-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## api_proto/kill_switch.proto



<a name="-AddAuthorizedUserRequest"></a>

### AddAuthorizedUserRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| user | [KillSwitchAuthorizedUser](#KillSwitchAuthorizedUser) |  |  |






<a name="-AddAuthorizedUserResponse"></a>

### AddAuthorizedUserResponse







<a name="-DeleteAuthorizedUserRequest"></a>

### DeleteAuthorizedUserRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| user_id | [int32](#int32) |  |  |






<a name="-DeleteAuthorizedUserResponse"></a>

### DeleteAuthorizedUserResponse







<a name="-DisableKillSwitchRequest"></a>

### DisableKillSwitchRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| kill_switch_id | [int32](#int32) |  |  |






<a name="-DisableKillSwitchResponse"></a>

### DisableKillSwitchResponse







<a name="-EnableKillSwitchRequest"></a>

### EnableKillSwitchRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| kill_switch | [KillSwitch](#KillSwitch) |  |  |






<a name="-EnableKillSwitchResponse"></a>

### EnableKillSwitchResponse







<a name="-GetKillSwitchOverviewRequest"></a>

### GetKillSwitchOverviewRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| with_nonactive_kill_switches | [bool](#bool) |  |  |






<a name="-GetKillSwitchOverviewResponse"></a>

### GetKillSwitchOverviewResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| kill_switches | [KillSwitch](#KillSwitch) | repeated |  |






<a name="-GetKillSwitchStatusRequest"></a>

### GetKillSwitchStatusRequest
Retrieve kill switch status depending on the environment.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| environment | [Environment](#Environment) |  |  |






<a name="-GetKillSwitchStatusResponse"></a>

### GetKillSwitchStatusResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| kill_switches | [KillSwitch](#KillSwitch) | repeated |  |






<a name="-ListAuthorizedUsersRequest"></a>

### ListAuthorizedUsersRequest







<a name="-ListAuthorizedUsersResponse"></a>

### ListAuthorizedUsersResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| users | [KillSwitchAuthorizedUser](#KillSwitchAuthorizedUser) | repeated |  |






<a name="-ListFeaturesRequest"></a>

### ListFeaturesRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| with_deprecated_features | [bool](#bool) |  |  |






<a name="-ListFeaturesResponse"></a>

### ListFeaturesResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| features | [Feature](#Feature) | repeated |  |






<a name="-SyncFeaturesRequest"></a>

### SyncFeaturesRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| features | [Feature](#Feature) | repeated |  |






<a name="-SyncFeaturesResponse"></a>

### SyncFeaturesResponse







<a name="-UpdateAuthorizedUserRequest"></a>

### UpdateAuthorizedUserRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| user_id | [int32](#int32) |  |  |
| user | [KillSwitchAuthorizedUser](#KillSwitchAuthorizedUser) |  |  |






<a name="-UpdateAuthorizedUserResponse"></a>

### UpdateAuthorizedUserResponse






 

 

 


<a name="-KillSwitchService"></a>

### KillSwitchService


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetKillSwitchStatus | [.GetKillSwitchStatusRequest](#GetKillSwitchStatusRequest) | [.GetKillSwitchStatusResponse](#GetKillSwitchStatusResponse) |  |
| GetKillSwitchOverview | [.GetKillSwitchOverviewRequest](#GetKillSwitchOverviewRequest) | [.GetKillSwitchOverviewResponse](#GetKillSwitchOverviewResponse) |  |
| ListFeatures | [.ListFeaturesRequest](#ListFeaturesRequest) | [.ListFeaturesResponse](#ListFeaturesResponse) |  |
| SyncFeatures | [.SyncFeaturesRequest](#SyncFeaturesRequest) | [.SyncFeaturesResponse](#SyncFeaturesResponse) |  |
| EnableKillSwitch | [.EnableKillSwitchRequest](#EnableKillSwitchRequest) | [.EnableKillSwitchResponse](#EnableKillSwitchResponse) |  |
| DisableKillSwitch | [.DisableKillSwitchRequest](#DisableKillSwitchRequest) | [.DisableKillSwitchResponse](#DisableKillSwitchResponse) |  |
| ListAuthorizedUsers | [.ListAuthorizedUsersRequest](#ListAuthorizedUsersRequest) | [.ListAuthorizedUsersResponse](#ListAuthorizedUsersResponse) |  |
| AddAuthorizedUser | [.AddAuthorizedUserRequest](#AddAuthorizedUserRequest) | [.AddAuthorizedUserResponse](#AddAuthorizedUserResponse) |  |
| UpdateAuthorizedUser | [.UpdateAuthorizedUserRequest](#UpdateAuthorizedUserRequest) | [.UpdateAuthorizedUserResponse](#UpdateAuthorizedUserResponse) |  |
| DeleteAuthorizedUser | [.DeleteAuthorizedUserRequest](#DeleteAuthorizedUserRequest) | [.DeleteAuthorizedUserResponse](#DeleteAuthorizedUserResponse) |  |

 



<a name="api_proto_kill_switch_objects-proto"></a>
<p align="right"><a href="#top">Top</a></p>

## api_proto/kill_switch_objects.proto



<a name="-AuthorizedUserTransformation"></a>

### AuthorizedUserTransformation



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| old | [KillSwitchAuthorizedUser](#KillSwitchAuthorizedUser) |  |  |
| new | [KillSwitchAuthorizedUser](#KillSwitchAuthorizedUser) |  |  |






<a name="-Feature"></a>

### Feature



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  |  |
| codename | [string](#string) |  |  |
| type | [Feature.Type](#Feature-Type) |  |  |






<a name="-KillSwitch"></a>

### KillSwitch



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  |  |
| feature | [Feature](#Feature) |  |  |
| min_version | [string](#string) |  |  |
| max_version | [string](#string) |  |  |
| browsers | [Environment.Browser](#Environment-Browser) | repeated |  |
| active | [bool](#bool) |  |  |






<a name="-KillSwitchAuditLogEntry"></a>

### KillSwitchAuditLogEntry
Log entry which describes an action which has taken place.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| timestamp | [google.protobuf.Timestamp](#google-protobuf-Timestamp) |  | Timestamp in which the action was taken. |
| user | [KillSwitchAuthorizedUser](#KillSwitchAuthorizedUser) |  | User who/which performed the action. |
| kill_switch_enabled | [KillSwitchAuditLogEntry.KillSwitchEnabled](#KillSwitchAuditLogEntry-KillSwitchEnabled) |  |  |
| kill_switch_disabled | [KillSwitchAuditLogEntry.KillSwitchDisabled](#KillSwitchAuditLogEntry-KillSwitchDisabled) |  |  |
| authorized_user_added | [KillSwitchAuditLogEntry.AuthorizedUserAdded](#KillSwitchAuditLogEntry-AuthorizedUserAdded) |  |  |
| authorized_user_updated | [KillSwitchAuditLogEntry.AuthorizedUserUpdated](#KillSwitchAuditLogEntry-AuthorizedUserUpdated) |  |  |
| authorized_user_deleted | [KillSwitchAuditLogEntry.AuthorizedUserDeleted](#KillSwitchAuditLogEntry-AuthorizedUserDeleted) |  |  |






<a name="-KillSwitchAuditLogEntry-AuthorizedUserAdded"></a>

### KillSwitchAuditLogEntry.AuthorizedUserAdded



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| user | [KillSwitchAuthorizedUser](#KillSwitchAuthorizedUser) |  |  |






<a name="-KillSwitchAuditLogEntry-AuthorizedUserDeleted"></a>

### KillSwitchAuditLogEntry.AuthorizedUserDeleted



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| old_user | [KillSwitchAuthorizedUser](#KillSwitchAuthorizedUser) |  |  |






<a name="-KillSwitchAuditLogEntry-AuthorizedUserUpdated"></a>

### KillSwitchAuditLogEntry.AuthorizedUserUpdated



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| transformation | [AuthorizedUserTransformation](#AuthorizedUserTransformation) |  |  |






<a name="-KillSwitchAuditLogEntry-KillSwitchDisabled"></a>

### KillSwitchAuditLogEntry.KillSwitchDisabled



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| transformation | [KillSwitchTransformation](#KillSwitchTransformation) |  |  |






<a name="-KillSwitchAuditLogEntry-KillSwitchEnabled"></a>

### KillSwitchAuditLogEntry.KillSwitchEnabled



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| kill_switch | [KillSwitch](#KillSwitch) |  |  |






<a name="-KillSwitchAuthorizedUser"></a>

### KillSwitchAuthorizedUser



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [int32](#int32) |  |  |
| google_uid | [string](#string) |  |  |
| email | [string](#string) |  |  |
| access_level | [KillSwitchAuthorizedUser.AccessLevel](#KillSwitchAuthorizedUser-AccessLevel) |  |  |






<a name="-KillSwitchTransformation"></a>

### KillSwitchTransformation



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| old | [KillSwitch](#KillSwitch) |  |  |
| new | [KillSwitch](#KillSwitch) |  |  |





 


<a name="-Feature-Type"></a>

### Feature.Type


| Name | Number | Description |
| ---- | ------ | ----------- |
| TYPE_UNKNOWN | 0 |  |
| TYPE_EXPERIMENT | 1 |  |
| TYPE_OPTION | 2 |  |
| TYPE_INTERNAL_KILL_SWITCH | 3 |  |
| TYPE_DEPRECATED | 10 |  |



<a name="-KillSwitchAuthorizedUser-AccessLevel"></a>

### KillSwitchAuthorizedUser.AccessLevel


| Name | Number | Description |
| ---- | ------ | ----------- |
| ACCESS_LEVEL_NONE | 0 |  |
| ACCESS_LEVEL_ACTIVATOR | 5 | The user may enable/disable kill switches. |
| ACCESS_LEVEL_ADMIN | 10 | The user may perform any action. |


 

 

 



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

