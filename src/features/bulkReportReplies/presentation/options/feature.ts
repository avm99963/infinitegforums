import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import {
  COMMUNITY_CONSOLE_TAG,
  TAILWIND_BASIC_TAG,
} from '../../../../options/presentation/utils/featureUtils';
import demo from './assets/demo.avif';

export const bulkReportRepliesFeature = () =>
  new Feature({
    optionCodename: 'bulkreportreplies',
    name: msg('Report messages quickly', {
      desc: 'Name of an extension feature.',
    }),
    description: msg(
      'Adds quick report buttons to all messages, so you can report each one with a single click.',
      {
        desc: 'Description of the "Report messages quickly" feature.',
      },
    ),
    demoMedia: {
      imgUrl: demo,
    },
    tags: [TAILWIND_BASIC_TAG(), COMMUNITY_CONSOLE_TAG()],
  });
