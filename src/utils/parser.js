"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
exports.generateDocx =
  exports.parseXmlFile =
  exports.cleanXml =
  exports.escapeSpecialCharacters =
  exports.formatTableXmlStringForLiquid =
  exports.parseLiquidString =
  exports.replaceSubstring =
    void 0;
var liquidjs_1 = require("liquidjs");
var constants_1 = require("./constants");
function replaceSubstring(str, startIdx, endIdx, newSubstr) {
  if (startIdx < 0 || endIdx > str.length || startIdx > endIdx) {
    throw new Error("Invalid start or end indexes.");
  }
  var prefix = str.substring(0, startIdx);
  var suffix = str.substring(endIdx + 1);
  return prefix + newSubstr + suffix;
}
exports.replaceSubstring = replaceSubstring;
function registerCurrencyFilter(engine) {
  engine.registerFilter("currency", function (value) {
    var numberValue = parseFloat(
      value === null || value === void 0 ? void 0 : value.toString()
    );
    return !Number.isNaN(numberValue)
      ? "$".concat(numberValue.toFixed(2))
      : null;
  });
}
function parseLiquidString(liquidString, data) {
  var engine = new liquidjs_1.Liquid();
  registerCurrencyFilter(engine);
  var parsedString = engine.parseAndRenderSync(liquidString, data);
  return parsedString;
}
exports.parseLiquidString = parseLiquidString;
function formatTableXmlStringForLiquid(xmlString) {
  var formattedString = xmlString;
  var match;
  // eslint-disable-next-line no-cond-assign
  while ((match = constants_1.TABLE_ROW_REGEX.exec(formattedString)) !== null) {
    var matchedString = match[0];
    var forLoopString = matchedString.match(constants_1.FOR_LOOP_REGEX);
    var endForLoopString = matchedString.match(constants_1.END_FOR_REGEX);
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
exports.formatTableXmlStringForLiquid = formatTableXmlStringForLiquid;
function escapeSpecialCharacters(xmlString) {
  // TODO: Need to fix the special characters inside liquid tags
  return xmlString;
}
exports.escapeSpecialCharacters = escapeSpecialCharacters;
function cleanXml(xmlString) {
  // TODO: Need to clean the xmlstring
  // The paragraphs are still in a <w:p> tag
  // Find all liquid tags, and find a way to put all the text
  // Account for page breaks, xml:space="preserve", etc
  // back together in one <w:t>
  return escapeSpecialCharacters(xmlString);
}
exports.cleanXml = cleanXml;
function parseXmlFile(xmlFile, data) {
  return __awaiter(this, void 0, void 0, function () {
    var xmlString, cleanedXml, parsedXmlString;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, xmlFile.async("string")];
        case 1:
          xmlString = _a.sent();
          cleanedXml = cleanXml(xmlString);
          parsedXmlString = parseLiquidString(
            formatTableXmlStringForLiquid(cleanedXml),
            data
          );
          return [2 /*return*/, parsedXmlString];
      }
    });
  });
}
exports.parseXmlFile = parseXmlFile;
function generateDocx(zipFiles, data) {
  return __awaiter(this, void 0, void 0, function () {
    var parsedPromises, updatedZipFile;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          parsedPromises = Object.keys(zipFiles.files).map(function (fileKey) {
            return __awaiter(_this, void 0, void 0, function () {
              var parsedXmlString;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    if (
                      !(fileKey.startsWith("word/") && fileKey.endsWith(".xml"))
                    )
                      return [3 /*break*/, 2];
                    return [
                      4 /*yield*/,
                      parseXmlFile(zipFiles.files[fileKey], data),
                    ];
                  case 1:
                    parsedXmlString = _a.sent();
                    // Update the XML content in the zipFiles object
                    zipFiles.file(fileKey, parsedXmlString);
                    _a.label = 2;
                  // eslint-disable-next-line no-fallthrough
                  case 2:
                    return [2 /*return*/];
                }
              });
            });
          });
          return [4 /*yield*/, Promise.all(parsedPromises)];
        case 1:
          _a.sent();
          return [4 /*yield*/, zipFiles.generateAsync({ type: "nodebuffer" })];
        case 2:
          updatedZipFile = _a.sent();
          return [2 /*return*/, updatedZipFile];
      }
    });
  });
}
exports.generateDocx = generateDocx;
