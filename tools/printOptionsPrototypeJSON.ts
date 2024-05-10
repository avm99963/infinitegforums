import { optionsPrototype } from '../src/common/optionsPrototype';

const optionsPrototypeJson = JSON.stringify(optionsPrototype, null, 2);
process.stdout.write(`${optionsPrototypeJson}\n`);
