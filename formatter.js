const { normalizeWhitespace, cleanSpacing, indent, addSpacesAroundOperators, addSpaceAfterKeywords, moveBraceToSameLine, addBlankLinesBetweenBlocks, removeExtraBlankLines, formatCollections, formatComments } = require('./utils');

function formatGroovyCode(text, tabSize = 2) {

  let formatted = normalizeWhitespace(text);
  formatted = cleanSpacing(formatted);
  formatted = indent(formatted, tabSize);
  formatted = addSpacesAroundOperators(formatted);
  formatted = addSpaceAfterKeywords(formatted);
  formatted = addBlankLinesBetweenBlocks(formatted);
  formatted = removeExtraBlankLines(formatted);
  formatted = formatCollections(formatted);
  formatted = formatComments(formatted);

  return formatted;
}

module.exports = { formatGroovyCode };