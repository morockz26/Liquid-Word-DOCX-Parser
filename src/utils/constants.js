module.exports = {
  TABLE_ROW_REGEX: /<w:tr\b[^>]*>([\s\S]*?)<\/w:tr>/gm,
  FOR_LOOP_REGEX: /{%\s*for\s+\w+(\.\w+)?\s+in\s+\w+(\.\w+)?\s*%}/,
  END_FOR_REGEX: /{%\s*endfor\s*%}/,
  LIQUID_REGEX_PATTERN:
    /(?:\{%\s*(?:(?:for|if)\s+[^{}]*\s*%})[\s\S]*?\{%\s*end(?:for|if)\s*%})|(?:\{%\s*assign\s+[^{}]*\s*%\})|(?:\{\{[^{}]*\}\})/gm,
  LIQUID_TAG_REGEX: /{.*}/gm,
  specialCharacterMap: {
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
  },
};
