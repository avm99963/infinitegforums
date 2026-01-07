import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import {
  COMMUNITY_CONSOLE_TAG,
  TAILWIND_BASIC_TAG,
} from '../../../../options/presentation/utils/featureUtils';
import perForumStats from './assets/per_forum_stats.avif';

export const perForumActivityFeature = () =>
  new Feature({
    optionCodename: 'perforumstats',
    name: msg('Per-forum activity', {
      desc: 'Name of an extension feature.',
    }),
    description: msg('Shows a per-forum activity chart in profiles.', {
      desc: 'Description of the "Per-forum activity" feature.',
    }),
    demoMedia: {
      imgUrl: perForumStats,
    },
    tags: [TAILWIND_BASIC_TAG(), COMMUNITY_CONSOLE_TAG()],
  });
