"use strict";

const path = require("path");
const fs = require("fs");
const JSZip = require("jszip");
const minimist = require("minimist");
const { generateDocx } = require("../src/utils/parser");

const argv = minimist(process.argv.slice(2));

function getFilePath(fileName) {
  return path.resolve(__dirname, "..", fileName);
}

async function getData() {
  const filePath = path.resolve(__dirname, "..", argv.d);

  const data = await fs.promises.readFile(filePath, "utf8");
  return JSON.parse(data);
}

async function getFile() {
  const filePath = getFilePath(argv.f);

  const file = new JSZip.external.Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).then(async (data) => JSZip.loadAsync(data));

  return file;
}

function main() {
  getData()
    .then(async (data) => {
      const zipFiles = await getFile();

      const generatedFile = await generateDocx(zipFiles, data, "nodebuffer");

      // Save the updated zip file
      const outputPath = path.resolve(
        __dirname,
        "..",
        "src/output/output.docx"
      );
      await fs.promises.writeFile(outputPath, generatedFile);
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
}

main();
