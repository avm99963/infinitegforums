import * as xmldom from '@xmldom/xmldom';
import * as fs from 'fs';

function main() {
  // Array contains pairs of source and target files.
  const xliffFilePaths = process.argv.splice(2);

  if (xliffFilePaths.length % 2 != 0) {
    console.error(
      'Input files are malformed. The script should be called with alternating source and target files as arguments.',
    );
    console.debug('Supplied file args:');
    console.debug(xliffFilePaths);
    process.exit(1);
  }

  for (let i = 0; i < xliffFilePaths.length; i += 2) {
    normalizeXliffFile(xliffFilePaths[i], xliffFilePaths[i + 1]);
  }
}

function normalizeXliffFile(source: string, target: string) {
  console.log(`Processing ${source} -> ${target}`);
  const contents = fs.readFileSync(source, 'utf8');
  const doc = new xmldom.DOMParser().parseFromString(
    contents,
    xmldom.MIME_TYPE.XML_TEXT,
  );

  const transUnits = doc.getElementsByTagName('trans-unit');
  for (let i = 0; i < transUnits.length; i++) {
    // This prevents Weblate from modifying the spacing and messing up the
    // //src/lit-locales:extract target's test.
    transUnits[i].setAttribute('xml:space', 'preserve');
  }

  const serializer = new xmldom.XMLSerializer();
  const newContents = serializer.serializeToString(doc).trimEnd() + '\n';
  fs.writeFileSync(target, newContents);
}

main();
