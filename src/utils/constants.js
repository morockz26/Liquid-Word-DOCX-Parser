module.exports = {
  END_FOR_REGEX: /{%\s*endfor\s*%}(?![\s\S.]*{%\s*endfor\s*%})/,
  FOR_LOOP_REGEX: /{%\s*for\s+\w+(\.\w+)?\s+in\s+\w+(\.\w+)?\s*%}/,
  LIQUID_TAG_REGEX: /(?:{{|{%|{)[\s\S]*?(?:}}|%}|})/g,
  LIQUID_TAG_SPLIT_REGEX: /<\/w:t>[\s\S]*?<w:t(?!ab)[^>]*>/g,
  TABLE_ROW_REGEX: /<w:tr\b[^>]*>([\s\S]*?)<\/w:tr>/gm,
};
