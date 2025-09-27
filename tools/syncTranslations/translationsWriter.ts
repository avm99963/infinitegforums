import { ExtractedDataItem } from './ccTranslationsParser';
import * as fs from 'fs';
import * as path from 'path';
import { DOMParser, XMLSerializer, Document, Element } from '@xmldom/xmldom';
import { LANGUAGE_TRANSFORMATIONS, SYNC_TRANSLATIONS } from './config';

const NEEDED_ENV_VARS = ['JS_BINARY__RUNFILES', 'BUILD_WORKSPACE_DIRECTORY'];
for (const envVar of NEEDED_ENV_VARS) {
  if (!process.env[envVar]) {
    console.error(
      `ERROR: ${envVar} env variable is empty. This script should be run with Bazel.`,
    );
    process.exit(1);
  }
}

const OUTPUT_DIR = path.join(process.env.JS_BINARY__RUNFILES, 'sourceFiles');

const RELATIVE_XLIFF_DIR = 'src/lit-locales/source';
const RUNFILES_XLIFF_DIR = path.join(
  process.env.JS_BINARY__RUNFILES,
  '_main',
  RELATIVE_XLIFF_DIR,
);
const WORKSPACE_XLIFF_DIR = path.join(
  process.env.BUILD_WORKSPACE_DIRECTORY,
  RELATIVE_XLIFF_DIR,
);

/**
 * Main function to write JSON and update XLIFF files.
 */
export function writeTranslations(extractedData: ExtractedDataItem[]): void {
  const outputDir = OUTPUT_DIR;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  writeJsonFiles(extractedData, outputDir);
  processXliffFiles(extractedData);
}

/**
 * Writes the extracted translations to JSON files for debugging purposes.
 */
function writeJsonFiles(
  extractedData: ExtractedDataItem[],
  outputDir: string,
): void {
  for (const item of extractedData) {
    const filePath = path.join(outputDir, `${item.language}.json`);
    fs.writeFileSync(
      filePath,
      JSON.stringify(item.translations, null, 2),
      'utf8',
    );
    console.log(`Wrote translations for ${item.language} to ${filePath}`);
  }
}

/**
 * Iterates through extracted data and processes corresponding XLIFF files.
 */
function processXliffFiles(extractedData: ExtractedDataItem[]): void {
  for (const item of extractedData) {
    const destinationLanguage = LANGUAGE_TRANSFORMATIONS.get(item.language);
    if (!destinationLanguage) {
      continue;
    }

    const sourceXlfFilePath = path.join(
      RUNFILES_XLIFF_DIR,
      `${destinationLanguage}.xlf`,
    );
    if (!fs.existsSync(sourceXlfFilePath)) {
      console.error(
        `XLIFF file not found for language ${destinationLanguage}: ${sourceXlfFilePath}`,
      );
      continue;
    }
    const outputXlfFilePath = path.join(
      WORKSPACE_XLIFF_DIR,
      `${destinationLanguage}.xlf`,
    );

    try {
      processSingleXliffFile(item, sourceXlfFilePath, outputXlfFilePath);
    } catch (error) {
      console.error(`Error processing XLIFF file ${sourceXlfFilePath}:`, error);
    }
  }
}

/**
 * Processes a single XLIFF file, updating translations.
 */
function processSingleXliffFile(
  item: ExtractedDataItem,
  sourceXlfFilePath: string,
  outputXlfFilePath: string,
): void {
  const xlfContent = fs.readFileSync(sourceXlfFilePath, 'utf8');
  const parser = new DOMParser();
  const doc = parser.parseFromString(xlfContent, 'text/xml');

  let isUpdated = false;
  for (const syncItem of SYNC_TRANSLATIONS) {
    const sourceTranslation = item.translations[syncItem.sourceKey];
    if (!sourceTranslation) {
      continue;
    }

    const transformedTranslation = syncItem.transformation(sourceTranslation);
    const transUnit = findTransUnitById(doc, syncItem.destinationKey);

    if (
      transUnit &&
      createTargetIfMissing(doc, transUnit, transformedTranslation)
    ) {
      isUpdated = true;
    }
  }

  if (isUpdated) {
    const serializer = new XMLSerializer();
    const newXlfContent = serializer.serializeToString(doc);
    fs.writeFileSync(outputXlfFilePath, newXlfContent + '\n', 'utf8');
    console.log(`Successfully updated XLIFF file: ${outputXlfFilePath}`);
  } else {
    console.log(`No updates needed for ${outputXlfFilePath}.`);
  }
}

/**
 * Finds a <trans-unit> element by its ID attribute.
 */
function findTransUnitById(doc: Document, id: string): Element | null {
  const transUnits = doc.getElementsByTagName('trans-unit');
  for (const transUnit of transUnits) {
    if (transUnit.getAttribute('id') === id) {
      return transUnit;
    }
  }
  return null;
}

/**
 * Creates a <target> with the synced translations if non-existant,
 * returning true if changes were made.
 */
function createTargetIfMissing(
  doc: Document,
  transUnit: Element,
  translation: string,
): boolean {
  let target = transUnit.getElementsByTagName('target')[0];
  let changed = false;

  if (!target) {
    target = doc.createElement('target');
    target.appendChild(doc.createTextNode(translation));
    const source = transUnit.getElementsByTagName('source')[0];
    // If source is the last sibling, passing null will place it in the end.
    source.parentNode?.insertBefore(target, source.nextSibling ?? null);
    console.log(`Adding target for "${transUnit.getAttribute('id')}"`);
    changed = true;
  }

  return changed;
}
