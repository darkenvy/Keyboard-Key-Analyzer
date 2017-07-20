const fs = require('fs');
const path = require('path');
const readdir = require('recursive-readdir');
const async = require('async');
const projectDir = path.join(__dirname, '../');
const filetypes = ['js', 'py', 'yml', 'json', 'html', 'css', 'md'];

let collection = {};

function processFile(file, cb) {
  const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(file)
  });

  lineReader.on('close', cb);
  lineReader.on('line', line => {
    line.split('').forEach(char => {
      collection[char] = collection.hasOwnProperty(char) ? collection[char] + 1 : 1;
    });
  });
}

readdir(projectDir).then(files => {
  let contentFiles = [];

  files.forEach(file => {
    let ext = file.split('.');
    ext = ext[ext.length - 1];
    if (filetypes.indexOf(ext) !== -1 && !/node_modules/.test(file)) contentFiles.push(file);
  });

  async.each(contentFiles, processFile, () => {
    let sortedChars = [];
    for (let key in collection) {
      if (collection[key] > 5 && !/[A-Za-z0-9]/.test(key)) sortedChars.push([key, collection[key]]);
    }
    sortedChars = sortedChars.sort((a, b) => a[1] - b[1]).reverse();
    console.log(sortedChars);
  });
});
