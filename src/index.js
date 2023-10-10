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
} = require("./utils/constants");

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

function parseLiquidString(liquidString, data) {
  const engine = new Liquid();

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

// async function parseXmlFile(xmlString, data) {
//   const formattedTableString = formatTableXmlStringForLiquid(xmlString);
//   const parsedXmlString = parseLiquidString(formatBodyXmlStringForLiquid(formattedTableString), data);
  
//   return parsedXmlString;
// }

// async function generateDocx(data) {
//   // Get the XML files from the source location
//   const zipFiles = await getFile();

//   // Combine XML strings with a separator
//   const separator = "<!-- XML_SEPARATOR -->";

//   const combinedStringArray = await Promise.all(
//     Object.keys(zipFiles.files).map(async (fileKey) => {
//       if (fileKey.startsWith("word/") && fileKey.endsWith(".xml")) {
//         const xmlString = await zipFiles.files[fileKey].async("string");
//         return xmlString + separator;
//       }
//       return separator;
//     })
//   );

//   const combinedXmlString = combinedStringArray.join("");

//   // Parse the combined XML string
//   const parsedXmlString = await parseXmlFile(combinedXmlString, data);

//   // Split the parsed XML string back into individual XML strings
//   const parsedXmlArray = parsedXmlString.split(separator);

//   // Update the XML content in the zipFiles object
//   Object.keys(zipFiles.files).map((fileKey, index) => {
//     if (fileKey.startsWith("word/") && fileKey.endsWith(".xml")) {
//       zipFiles.file(fileKey, parsedXmlArray[index]);
//     }
//   });

//   // Generate the updated zip file
//   const updatedZipData = await zipFiles.generateAsync({ type: "nodebuffer" });

//   // Save the updated zip file
//   const outputPath = path.resolve(__dirname, "XMLs/parsed/output.docx");
//   await fs.promises.writeFile(outputPath, updatedZipData);

//   console.log("Document XML updated and saved to:", outputPath);
// }

async function parseXmlFile(xmlFile, data) {
  const xmlString = await xmlFile.async("string");

  const parsedXmlString  =  parseLiquidString(formatTableXmlStringForLiquid(xmlString), data);

  return parsedXmlString;
}

async function generateDocx(data) {
  const zipFiles = await getFile();

  const parsedPromises = Object.keys(zipFiles.files).map(async (fileKey) => {
    if (fileKey.startsWith("word/") && fileKey.endsWith(".xml")) {
      const parsedXmlString = await parseXmlFile(zipFiles.files[fileKey], data);

      // Update the XML content in the zipFiles object
      zipFiles.file(fileKey, parsedXmlString);
    }
  });

  await Promise.all(parsedPromises);

  // Generate the updated zip file
  const updatedZipFile = await zipFiles.generateAsync({ type: "nodebuffer" });

  // Save the updated zip file
  const outputPath = path.resolve(__dirname, "XMLs/parsed/output.docx");
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