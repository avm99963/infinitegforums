import { msg } from '@lit/localize';
import { FeatureCategory } from './models/category';
import { FeatureSection } from './models/section';
import { ccDarkThemeFeature } from '../../features/ccDarkTheme/presentation/options/feature';
import { redirectFeature } from '../../features/redirect/presentation/options/feature';
import { uiSpacingFeature } from '../../features/uiSpacing/presentation/options/feature';
import { stickySidebarHeadersFeature } from '../../features/stickySidebarHeaders/presentation/options/feature';
import { ccForceHideDrawerFeature } from '../../features/ccForceHideDrawer/presentation/options/feature';
import { enhancedAnnouncementsDotFeature } from '../../features/enhancedAnnouncementsDot/presentation/options/feature';
import { avatarsFeature } from '../../features/avatars/presentation/options/feature';
import { autoRefreshFeature } from '../../features/autoRefresh/presentation/options/feature';
import {
  threadListsInfiniteScrollFeature,
  threadsInfiniteScrollAllAtOnceFeature,
  threadsInfiniteScrollInBatchesFeature,
} from '../../features/infiniteScroll/presentation/options/feature';
import { batchLockFeature } from '../../features/batchLock/presentation/options/feature';
import { bulkMoveFeature } from '../../features/bulkMove/presentation/options/feature';
import { fixedToolbarFeature } from '../../features/fixedToolbar/presentation/options/feature';
import { repositionExpandThreadFeature } from '../../features/repositionExpandThread/presentation/options/feature';
import { increaseContrastFeature } from '../../features/increaseContrast/presentation/options/feature';
import { flattenThreadsFeature } from '../../features/flattenThreads/presentation/options/feature';
import { bulkReportRepliesFeature } from '../../features/bulkReportReplies/presentation/options/feature';
import {
  profileIndicatorDotFeature,
  profileIndicatorFeature,
} from '../../features/profileIndicator/presentation/options/feature';
import { interopThreadPageFeature } from '../../features/interopThreadPage/presentation/options/feature';
import { imageMaxHeightFeature } from '../../features/imageMaxHeight/presentation/options/feature';
import { blockDraftsFeature } from '../../features/blockDrafts/presentation/options/feature';
import { loadDraftsFeature } from '../../features/loadDrafts/presentation/options/feature';
import { ccDragAndDropFixFeature } from '../../features/ccDragAndDropFix/presentation/options/feature';
import { html } from 'lit';
import { perForumActivityFeature } from '../../features/extraInfo/presentation/options/feature';
import { previousPostsFeature } from '../../features/previousPosts/presentation/options/feature';

const minorUIEnhancementsSectionName = () => msg('Minor UI enhancements', {
  desc: 'Name of a generic section of features, which includes features that minimally enhance the user interface of the forums platform.',
});
const bulkActionsSectionName = () => msg('Bulk actions', {
  desc: 'Name of a generic section of features that let users perform actions to many threads at once.',
});

export const getFeatureCategories = () => [
  new FeatureCategory({
    id: 'general',
    name: msg('General', {
      desc: 'Name of the category of extension features that apply to multiple areas of the forums platform.',
    }),
    features: [ccDarkThemeFeature(), redirectFeature(), uiSpacingFeature()],
    sections: [
      new FeatureSection({
        name: minorUIEnhancementsSectionName(),
        features: [
          stickySidebarHeadersFeature(),
          ccForceHideDrawerFeature(),
          enhancedAnnouncementsDotFeature(),
        ],
      }),
    ],
  }),
  new FeatureCategory({
    id: 'threadLists',
    name: msg('Thread lists', {
      desc: 'Name of the category of extension features related to thread lists.',
    }),
    features: [
      avatarsFeature(),
      autoRefreshFeature(),
      threadListsInfiniteScrollFeature(),
    ],
    sections: [
      new FeatureSection({
        name: bulkActionsSectionName(),
        features: [batchLockFeature(), bulkMoveFeature()],
      }),
      new FeatureSection({
        name: minorUIEnhancementsSectionName(),
        features: [
          fixedToolbarFeature(),
          repositionExpandThreadFeature(),
          increaseContrastFeature(),
        ],
      }),
    ],
  }),
  new FeatureCategory({
    id: 'threads',
    name: msg('Threads', {
      desc: 'Name of the category of extension features related to threads.',
    }),
    features: [
      flattenThreadsFeature(),
      profileIndicatorFeature(),
      profileIndicatorDotFeature(),
      threadsInfiniteScrollInBatchesFeature(),
      threadsInfiniteScrollAllAtOnceFeature(),
      interopThreadPageFeature(),
    ],
    sections: [
      new FeatureSection({
        name: bulkActionsSectionName(),
        features: [bulkReportRepliesFeature()],
      }),
      new FeatureSection({
        name: minorUIEnhancementsSectionName(),
        features: [imageMaxHeightFeature()],
      }),
    ],
  }),
  new FeatureCategory({
    id: 'oldMessageComposer',
    name: msg('Old message composer', {
      desc: 'Name of the category of extension features related to the old message composer.',
    }),
    note: msg(
      html`
        These features only affect the Community Console's old message composer,
        which is shown when creating a new thread or canned response, when
        pressing
        <kbd>r</kbd>
        inside a thread, or when creating a new reply in the old thread view.
        The new message composer doesn't suffer from these issues.
      `,
      {
        desc: 'Explanatory note for the features that relate to the old reply editor in the Community Console.',
      },
    ),
    features: [
      // #!if browser_target == 'chromium_mv3'
      ccDragAndDropFixFeature(),
      blockDraftsFeature(),
      // #!endif
      loadDraftsFeature(),
    ],
  }),
  new FeatureCategory({
    id: 'profiles',
    name: msg('Profiles', {
      desc: 'Name of the category of extension features related to profiles.',
    }),
    features: [perForumActivityFeature(), previousPostsFeature()],
  }),
];
