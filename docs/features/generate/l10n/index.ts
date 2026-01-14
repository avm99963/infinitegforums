import { msg } from '@lit/localize';

export const FEATURES_TITLE = () =>
  msg('Features', {
    id: 'features_doc.title',
    desc: 'Title for the features document (a document that includes all the features).',
  });

export const FEATURES_INTRO = () =>
  msg('The TW Power Tools extension offers the following features:', {
    id: 'features_doc.intro',
    desc: 'Introduction for the features document.',
  });

export const FEATURES_DEMO_LINK = () =>
  msg('demo', {
    id: 'features_doc.demo',
    desc: 'Text of a link which points to a screencast or screenshot showing a feature.',
  });
