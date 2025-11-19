import * as cheerio from "cheerio";

/**
 * Detects if a page is likely a React / SPA
 * @param {string} html - the raw HTML
 * @returns {boolean} true if likely SPA
 */
export function isLikelySPA(html) {
  const $ = cheerio.load(html);

  // Common SPA / React patterns
  const reactRoot = $('[id="root"], [id="app"], [id^="__next"]').length > 0;
  const bodyEmpty = $('body').text().trim().length === 0;
  const missingH1 = $('h1').length === 0;

  // Presence of React / SPA scripts
  const hasReactScript = $('script[src*="react"], script[src*="next"], script[src*="webpack"]').length > 0;

  return reactRoot && (bodyEmpty || missingH1 || hasReactScript);
}
