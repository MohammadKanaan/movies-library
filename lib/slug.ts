/** Longest slug `slugify` produces; unique-slug suffixes (`-2`) are added on top by the DAL. */
export const SLUG_MAX_LENGTH = 80

/**
 * URL slug of a title or name: diacritics stripped (NFKD, then the combining marks removed),
 * lowercased, every run of anything but `a-z0-9` becomes one hyphen, no leading or trailing hyphen,
 * cut at `SLUG_MAX_LENGTH`. Text with no ASCII letters or digits yields `''`; the caller decides
 * what to do with that.
 */
export const slugify = (text: string): string => {
  const ascii = text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return ascii.slice(0, SLUG_MAX_LENGTH).replace(/-+$/, '')
}
