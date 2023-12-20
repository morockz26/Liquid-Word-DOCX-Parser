"use strict";

const argv = require('minimist')(process.argv.slice(2));
const path = require("path");
const fs = require("fs");
const JSZip = require("jszip");
const { Liquid } = require("liquidjs");
const {
  FOR_LOOP_REGEX,
  END_FOR_REGEX,
  TABLE_ROW_REGEX,
  LIQUID_REGEX_PATTERN
} = require("./utils/constants");
const copyPaste = require('copy-paste');

function getFilePath(fileName) {
  return path.resolve(__dirname, fileName)
}

async function getData() {
  const filePath = path.resolve(__dirname, argv.d);
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw error;
  }
}

async function getFile() {
  const filePath = getFilePath(argv.f);

  try {
    const file = new JSZip.external.Promise((resolve, reject) => {
      fs.readFile(filePath, function(err, data) {
        if (err) {
          reject(e);
        } else {
          resolve(data);
        }
      });
    }).then(async (data) => {
      return await JSZip.loadAsync(data);
    })

    return file;
  } catch (error) {
    throw error;
  }
}

function replaceSubstring(str, startIdx, endIdx, newSubstr) {
  if (startIdx < 0 || endIdx > str.length || startIdx > endIdx) {
    throw new Error('Invalid start or end indexes.');
  }

  const prefix = str.substring(0, startIdx);
  const suffix = str.substring(endIdx + 1);
  
  return prefix + newSubstr + suffix;
}

function registerCurrencyFilter(engine) {
  engine.registerFilter("currency", (value) => {
    const numberValue = parseFloat(value?.toString());
    return !isNaN(numberValue) ? `$${numberValue.toFixed(2)}` : null;
  });
}

function parseLiquidString(liquidString, data) {
  const engine = new Liquid();

  registerCurrencyFilter(engine);

  const parsedString = engine.parseAndRenderSync(liquidString, data);

  return parsedString;
};

function formatTableXmlStringForLiquid(xmlString) {
  let formattedString = xmlString;
  let match;
  while ((match = TABLE_ROW_REGEX.exec(formattedString)) !== null) {
    let matchedString = match[0];
    const forLoopString = matchedString.match(FOR_LOOP_REGEX);
    const endForLoopString = matchedString.match(END_FOR_REGEX);
    if (forLoopString && endForLoopString) {
      matchedString = matchedString.replace(forLoopString[0], '');
      matchedString = matchedString.replace(endForLoopString[0], '');
      matchedString = [forLoopString[0], matchedString, endForLoopString[0]].join('');
      formattedString = replaceSubstring(
        formattedString,
        match.index,
        match.index + matchedString.length - 1,
        matchedString
      );
    }
  }
  return formattedString;
}

const specialCharacterMap = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&"
}

function escapeSpecialCharacters(xmlString) {
  // TODO: Need to fix the special characters inside liquid tags
  return xmlString
}

function cleanXml(xmlString) {
  // TODO: Need to clean the xmlstring
  // The paragraphs are still in a <w:p> tag
  // Find all liquid tags, and find a way to put all the text
  // Account for page breaks, xml:space="preserve", etc
  // back together in one <w:t>
  return escapeSpecialCharacters(xmlString);
}

async function parseXmlFile(xmlFile, data, fileKey) {
  const xmlString = await xmlFile.async("string");

  const cleanedXml = cleanXml(xmlString);

  // Copy the parsed XML string to the clipboard
  if (fileKey == "word/document.xml") {
    console.log(fileKey, cleanedXml.length)
    await copyPaste.copy(formatTableXmlStringForLiquid(cleanedXml));
  }

  const parsedXmlString  =  parseLiquidString(formatTableXmlStringForLiquid(cleanedXml), data);

  return parsedXmlString;
}

async function generateDocx(data) {
  const zipFiles = await getFile();

  const parsedPromises = Object.keys(zipFiles.files).map(async (fileKey) => {
    if (fileKey.startsWith("word/") && fileKey.endsWith(".xml")) {
      const parsedXmlString = await parseXmlFile(zipFiles.files[fileKey], data, fileKey);

      // Update the XML content in the zipFiles object
      zipFiles.file(fileKey, parsedXmlString);
    }
  });

  await Promise.all(parsedPromises);

  // Generate the updated zip file
  const updatedZipFile = await zipFiles.generateAsync({ type: "nodebuffer" });

  // Save the updated zip file
  const outputPath = path.resolve(__dirname, "output/output.docx");
  await fs.promises.writeFile(outputPath, updatedZipFile);

  console.log("Document XML updated and saved to:", outputPath)
}

function main() {
  getData()
  .then(async (data) => {
    generateDocx(data);
  })
  .catch((err) => { console.log(err); })
}

main();