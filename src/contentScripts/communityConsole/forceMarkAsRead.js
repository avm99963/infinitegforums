import {CCApi} from '../../common/api.js';
import {getAuthUser} from '../../common/communityConsoleUtils.js';

var authuser = getAuthUser();

// Send a request to mark the current thread as read
export function markCurrentThreadAsRead() {
  console.debug(
      '[forceMarkAsRead] %cTrying to mark a thread as read.',
      'color: #1a73e8;');

  var threadRegex =
      /\/s\/community\/?.*\/forum\/([0-9]+)\/?.*\/thread\/([0-9]+)/;

  var url = location.href;
  var matches = url.match(threadRegex);
  if (matches !== null && matches.length > 2) {
    var forumId = matches[1];
    var threadId = matches[2];

    console.debug('[forceMarkAsRead] Thread details:', {forumId, threadId});

    return CCApi(
               'ViewThread', {
                 1: forumId,
                 2: threadId,
                 // options
                 3: {
                   // pagination
                   1: {
                     2: 0,  // maxNum
                   },
                   3: false,   // withMessages
                   5: false,   // withUserProfile
                   6: true,    // withUserReadState
                   9: false,   // withRequestorProfile
                   10: false,  // withPromotedMessages
                   11: false,  // withExpertResponder
                 },
               },
               true, authuser)
        .then(thread => {
          if (thread?.[1]?.[6] === true) {
            console.debug(
                '[forceMarkAsRead] This thread is already marked as read, but marking it as read anyways.');
          }

          var lastMessageId = thread?.[1]?.[2]?.[10];

          console.debug('[forceMarkAsRead] lastMessageId is:', lastMessageId);

          if (lastMessageId === undefined)
            throw new Error(
                'Couldn\'t find lastMessageId in the ViewThread response.');

          return CCApi(
              'SetUserReadStateBulk', {
                1: [{
                  1: forumId,
                  2: threadId,
                  3: lastMessageId,
                }],
              },
              true, authuser);
        })
        .then(_ => {
          console.debug(
              '[forceMarkAsRead] %cSuccessfully set as read!',
              'color: #1e8e3e;');
        })
        .catch(err => {
          console.error(
              '[forceMarkAsRead] Error while marking current thread as read: ',
              err);
        });
  } else {
    console.error(
        '[forceMarkAsRead] Couldn\'t retrieve forumId and threadId from the current URL.',
        url);
  }
}
