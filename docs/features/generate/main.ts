import { UncompiledTemplateResult } from 'lit';
import * as fs from 'fs/promises';
import { configureLocalization } from '@lit/localize';
import {
  sourceLocale,
  targetLocales,
} from '@/lit-locales/generated/locales.js';
import { getFeatureCategories } from '@/options/presentation/data/featureCategories';
import { FeatureCategory } from '@/options/presentation/models/category';
import { convertPossibleTemplateToString } from './utils';
import { Feature } from '@/options/presentation/models/feature';
import { FeatureSection } from '@/options/presentation/models/section';
import { FEATURES_DEMO_LINK, FEATURES_INTRO, FEATURES_TITLE } from './l10n';

const REPO_RAW_CONTENT_BASE_URL =
  'https://raw.githubusercontent.com/avm99963/infinitegforums/HEAD/';

// @lit/localize is intended to run in a browser, and calls
// window.dispatchEvent. This is a small patch so that we can use it here.
//
// WARNING: this is a very fragile hack. Updating @lit/localize can make this
// script fail. But we accept the consequences of such fragility due to the low
// criticality of this generator.
global.window = {
  dispatchEvent: (..._: unknown[]): void => undefined,
} as any;

async function main(): Promise<void> {
  if (process.argv.length < 4) {
    console.error(
      '2 arguments must be provided: the output file path and the locale.',
    );
    process.exit(1);
  }

  const filePath = process.argv[2];
  const locale = process.argv[3];

  configureLocale(locale);

  const file = await fs.open(filePath, 'wx');
  await writeDoc(file);
  await file.close();
}

async function configureLocale(locale: string): Promise<void> {
  const { setLocale } = configureLocalization({
    sourceLocale,
    targetLocales,
    loadLocale: (locale) => {
      // We want to eager import the files so that we only compile one unique
      // bundle. We're running this in NodeJS, so there is no need to split it.
      return import(
        /* webpackMode: "eager" */
        /* webpackExclude: /locales\.json$/ */
        `@/lit-locales/generated/${locale}.js`
      );
    },
  });

  await setLocale(locale);
}

async function writeDoc(file: fs.FileHandle): Promise<void> {
  await file.write(`# ${FEATURES_TITLE()}\n\n`);
  await file.write(`${FEATURES_INTRO()}\n\n`);
  await file.write('[TOC]\n\n');

  const featureCategories = getFeatureCategories();
  for (const category of featureCategories) {
    await writeCategory(file, category);
  }
}

async function writeCategory(
  file: fs.FileHandle,
  category: FeatureCategory,
): Promise<void> {
  await file.write(`## ${category.name}\n\n`);

  if (category.note !== undefined) {
    await writeNote(file, category.note);
  }

  if (category.features !== undefined) {
    for (const feature of category.features) {
      await writeFeature(file, feature, 3);
    }
  }

  if (category.sections !== undefined) {
    for (const section of category.sections) {
      await writeSection(file, section);
    }
  }
}

async function writeSection(
  file: fs.FileHandle,
  section: FeatureSection,
): Promise<void> {
  await file.write(`### ${section.name}\n\n`);

  if (section.note !== undefined) {
    await writeNote(file, section.note);
  }

  if (section.features !== undefined) {
    for (const feature of section.features) {
      await writeFeature(file, feature, 4);
    }
  }
}

async function writeFeature(
  file: fs.FileHandle,
  feature: Feature,
  headingLevel: number,
): Promise<void> {
  await file.write(`${'#'.repeat(headingLevel)} ${feature.name}\n\n`);

  if (feature.description !== undefined) {
    await file.write(
      convertPossibleTemplateToString(feature.description) + '\n\n',
    );
  }

  if (feature.note !== undefined) {
    await writeNote(file, feature.note);
  }

  await writeFeatureFooter(file, feature);
}

async function writeFeatureFooter(
  file: fs.FileHandle,
  feature: Feature,
): Promise<void> {
  const details: string[] = [];

  if (feature.tags !== undefined && feature.tags.length > 0) {
    details.push(`_${feature.tags.join(', ')}_`);
  }

  const demoMedia = feature.demoMedia?.imgUrl;
  if (demoMedia !== undefined) {
    // We have to insert a link to GitHub because Gitiles doesn't render AVIF images.
    details.push(
      `[\\\[${FEATURES_DEMO_LINK()}\\\]](${REPO_RAW_CONTENT_BASE_URL}${demoMedia.replace(/(\(|\))/g, '\\$1')})`,
    );
  }

  if (details.length > 0) {
    await file.write(details.join(' | ') + '\n\n');
  }
}

async function writeNote(
  file: fs.FileHandle,
  note: string | UncompiledTemplateResult,
): Promise<void> {
  await file.write('*** promo\n');
  await file.write(
    convertPossibleTemplateToString(note)
      .split('\n')
      .map((line) => `** ${line}`)
      .join('\n') + '\n',
  );
  await file.write('***\n\n');
}

main();
