import JSZip from "jszip";
import { Liquid } from "liquidjs";
import {
  FOR_LOOP_REGEX,
  END_FOR_REGEX,
  TABLE_ROW_REGEX,
  LIQUID_REGEX_PATTERN,
  specialCharacterMap,
} from "./constants";

export function replaceSubstring(
  str: string,
  startIdx: number,
  endIdx: number,
  newSubstr: string
) {
  if (startIdx < 0 || endIdx > str.length || startIdx > endIdx) {
    throw new Error("Invalid start or end indexes.");
  }

  const prefix = str.substring(0, startIdx);
  const suffix = str.substring(endIdx + 1);

  return prefix + newSubstr + suffix;
}

function registerCurrencyFilter(engine: Liquid) {
  engine.registerFilter("currency", (value: any) => {
    const numberValue = parseFloat(value?.toString());
    return !Number.isNaN(numberValue) ? `$${numberValue.toFixed(2)}` : null;
  });
}

export function parseLiquidString(liquidString: string, data: object) {
  const engine = new Liquid();

  registerCurrencyFilter(engine);

  const parsedString = engine.parseAndRenderSync(liquidString, data);

  return parsedString;
}

export function formatTableXmlStringForLiquid(xmlString: string) {
  let formattedString = xmlString;
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = TABLE_ROW_REGEX.exec(formattedString)) !== null) {
    let matchedString = match[0];
    const forLoopString = matchedString.match(FOR_LOOP_REGEX);
    const endForLoopString = matchedString.match(END_FOR_REGEX);
    if (forLoopString && endForLoopString) {
      matchedString = matchedString.replace(forLoopString[0], "");
      matchedString = matchedString.replace(endForLoopString[0], "");
      matchedString = [
        forLoopString[0],
        matchedString,
        endForLoopString[0],
      ].join("");
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

export function escapeSpecialCharacters(xmlString: string) {
  // TODO: Need to fix the special characters inside liquid tags
  return xmlString;
}

export function cleanXml(xmlString: string) {
  // TODO: Need to clean the xmlstring
  // The paragraphs are still in a <w:p> tag
  // Find all liquid tags, and find a way to put all the text
  // Account for page breaks, xml:space="preserve", etc
  // back together in one <w:t>
  return escapeSpecialCharacters(xmlString);
}

export async function parseXmlFile(xmlFile: JSZip.JSZipObject, data: object) {
  const xmlString = await xmlFile.async("string");

  const cleanedXml = cleanXml(xmlString);

  const parsedXmlString = parseLiquidString(
    formatTableXmlStringForLiquid(cleanedXml),
    data
  );

  return parsedXmlString;
}

export async function generateDocx(zipFiles: JSZip, data: object) {
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

  return updatedZipFile;
}
