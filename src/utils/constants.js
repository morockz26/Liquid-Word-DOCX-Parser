module.exports = {
  BROKEN_TAG_REGEX:
    /<w:p[^>]*>[\s\S]*?((?:{{|{%)[\s\S]*?(?:}}|%})[\s\S]*?(?=<\/w:t>))[\s\S]*?<\/w:p>/g,
  END_FOR_REGEX: /{%\s*endfor\s*%}(?![\s\S.]*{%\s*endfor\s*%})/,
  FOR_LOOP_REGEX: /{%\s*for\s+\w+(\.\w+)?\s+in\s+\w+(\.\w+)?\s*%}/,
  TABLE_ROW_REGEX: /<w:tr\b[^>]*>([\s\S]*?)<\/w:tr>/gm,
  LIQUID_REGEX_PATTERN:
    /(?:\{%\s*(?:(?:for|if)\s+[^{}]*\s*%})[\s\S]*?\{%\s*end(?:for|if)\s*%})|(?:\{%\s*assign\s+[^{}]*\s*%\})|(?:\{\{[^{}]*\}\})/gm,
  LIQUID_TAG_SPLIT_REGEX: /<\/w:t>[\s\S]*?<w:t(?!ab)[^>]*>/g,
  specialCharacterMap: {
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "”": '"',
  },
};
