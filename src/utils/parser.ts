import * as JSZip from "jszip";
import { Liquid } from "liquidjs";
import {
  END_FOR_REGEX,
  FOR_LOOP_REGEX,
  LIQUID_TAG_REGEX,
  LIQUID_TAG_SPLIT_REGEX,
  TABLE_ROW_REGEX,
} from "./constants";

type CharacterMap = Record<string, string>;

const specialCharacterMap: CharacterMap = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "“": '"', // Left double quotation mark
  "”": '"', // Right double quotation mark
};

const symbolMap: CharacterMap = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
};

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
  engine.registerFilter("currency", (value: string | number) => {
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

export function escapeSpecialCharacters(xmlString: string) {
  const escapedText = Object.keys(specialCharacterMap).reduce(
    (xmlStringAcc, specialCharacter) => {
      const result = xmlStringAcc.replace(
        new RegExp(`${specialCharacter}`, "g"),
        specialCharacterMap[specialCharacter]
      );
      return result;
    },
    xmlString
  );
  return escapedText;
}

export function cleanData(data: object) {
  return data;
}

export function cleanXml(xmlString: string) {
  let cleanedXmlString = xmlString;
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = LIQUID_TAG_REGEX.exec(cleanedXmlString)) !== null) {
    const matchedString = match[0];

    const cleanedText = escapeSpecialCharacters(
      matchedString.split(LIQUID_TAG_SPLIT_REGEX).join("")
    );

    cleanedXmlString = replaceSubstring(
      cleanedXmlString,
      match.index,
      match.index + matchedString.length - 1,
      cleanedText
    );

    // reset index where regex should continue search from to the last index of the replacement text
    LIQUID_TAG_REGEX.lastIndex = match.index + cleanedText.length;
  }

  return cleanedXmlString;
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
      matchedString = matchedString.replace(FOR_LOOP_REGEX, "");
      matchedString = matchedString.replace(END_FOR_REGEX, "");
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

export async function getXmlString(zipFiles: JSZip) {
  const documentXml: JSZip.JSZipObject = zipFiles.files["word/document.xml"];
  const xmlString = await documentXml.async("string");

  return xmlString;
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

export async function generateDocx(
  zipFiles: JSZip,
  data: object,
  type: JSZip.OutputType
) {
  const cleanedData = cleanData(data); // clean document data of any special character

  const parsedPromises = Object.keys(zipFiles.files).map(async (fileKey) => {
    if (fileKey.startsWith("word/") && fileKey.endsWith(".xml")) {
      const parsedXmlString = await parseXmlFile(
        zipFiles.files[fileKey],
        cleanedData
      );

      // Update the XML content in the zipFiles object
      zipFiles.file(fileKey, parsedXmlString);
    }
  });

  await Promise.all(parsedPromises);

  // Generate the updated zip file
  const updatedZipFile = await zipFiles.generateAsync({ type });

  return updatedZipFile;
}
