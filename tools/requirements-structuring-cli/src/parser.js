/**
 * Requirements Parser
 *
 * Reads natural language requirements from the markdown template format.
 * Extracts structured sections: use case metadata, actors, flows, etc.
 */

const fs = require('fs-extra');
const path = require('path');

class RequirementsParser {
  /**
   * Parse a requirements input markdown file
   * @param {string} filePath - Path to the requirements markdown file
   * @returns {object} Parsed requirement data
   */
  async parse(filePath) {
    const resolvedPath = path.resolve(filePath);
    if (!(await fs.pathExists(resolvedPath))) {
      throw new Error(`Requirements file not found: ${resolvedPath}`);
    }

    const content = await fs.readFile(resolvedPath, 'utf8');
    return this.parseContent(content);
  }

  /**
   * Parse raw markdown content into structured sections
   * @param {string} content - Raw markdown text
   * @returns {object} Parsed requirement sections
   */
  parseContent(content) {
    const sections = this._extractSections(content);

    return {
      useCaseId: this._extractField(sections, 'use case id') || null,
      useCaseName: this._extractField(sections, 'use case name') || null,
      actors: this._extractList(sections, 'actors'),
      preconditions: this._extractList(sections, 'preconditions'),
      postconditions: this._extractList(sections, 'postconditions'),
      basicFlow: this._extractList(sections, 'basic flow'),
      alternativeFlows: this._extractList(sections, 'alternative flows'),
      exceptionFlows: this._extractList(sections, 'exception flows'),
      businessObjects: this._extractList(sections, 'business objects'),
      relatedUseCases: this._extractList(sections, 'related use cases'),
      rawText: content,
    };
  }

  /**
   * Extract markdown sections by heading
   */
  _extractSections(content) {
    const sections = {};
    const lines = content.split('\n');
    let currentHeading = null;
    let currentContent = [];

    for (const line of lines) {
      const headingMatch = line.match(/^#{1,3}\s+(.+)/);
      if (headingMatch) {
        if (currentHeading) {
          sections[currentHeading] = currentContent.join('\n').trim();
        }
        currentHeading = headingMatch[1].trim().toLowerCase();
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    if (currentHeading) {
      sections[currentHeading] = currentContent.join('\n').trim();
    }

    return sections;
  }

  /**
   * Extract a single-value field from a section
   */
  _extractField(sections, key) {
    const content = sections[key];
    if (!content) return null;
    // Strip markdown formatting, return first non-empty line
    const lines = content
      .split('\n')
      .map((l) => l.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean);
    return lines[0] || null;
  }

  /**
   * Extract a list of items from a section (numbered or bulleted)
   */
  _extractList(sections, key) {
    const content = sections[key];
    if (!content) return [];

    return content
      .split('\n')
      .map((line) => line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim())
      .filter(Boolean);
  }
}

module.exports = RequirementsParser;
