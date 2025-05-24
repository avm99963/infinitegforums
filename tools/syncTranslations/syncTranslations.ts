/**
 * @fileoverview Script to fetch strings from the Community Console
 * source code and sync them to our code.
 */

import {
  extractDataFromCCCode,
  ExtractedDataItem,
} from './ccTranslationsParser';
import { writeTranslations } from './translationsWriter';

const SCRIPT_URL =
  'https://ssl.gstatic.com/support/content/forums/resources/prod/assets/main.js';

main();

async function main(): Promise<void> {
  console.log('Starting script...');
  try {
    const scriptCode = await fetchCCCode(SCRIPT_URL);
    const extractedData = extractDataFromCCCode(scriptCode);
    logResults(extractedData);
    writeTranslations(extractedData);
  } catch (error: unknown) {
    console.error('The script encountered an unhandled error:', error);
  } finally {
    console.log('Script finished.');
  }
}

async function fetchCCCode(url: string): Promise<string> {
  console.log(`Fetching Community Console code from: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status} - ${response.statusText}`,
      );
    }
    const scriptText = await response.text();
    console.log(`Successfully fetched ${scriptText.length} characters.`);
    return scriptText;
  } catch (error: unknown) {
    console.error(`Failed to fetch code from ${url}:`, error);
    throw error;
  }
}

function logResults(extractedData: ExtractedDataItem[]): void {
  if (extractedData.length > 0) {
    console.log(`\n--- Found ${extractedData.length} Matches ---`);
    extractedData.forEach((item, index) => {
      console.log(
        `  Match ${index + 1}: Lang = ${item.language}, ` +
          `JSON (start) = ${JSON.stringify(item.translations).substring(0, 70)}...`,
      );
    });
    console.log('-----------------------\n');
  } else {
    console.log('No matching data found.');
  }
}
