import 'dotenv/config';
import fs from 'fs';

const directory = process.env.WORKING_DIRECTORY || './';
const fileName = `${new Date().toUTCString()}.txt`;
const fullUri = `${directory}${fileName}`;

export const writeDataText = (data) => {
  fs.appendFileSync(fullUri, data);
};
