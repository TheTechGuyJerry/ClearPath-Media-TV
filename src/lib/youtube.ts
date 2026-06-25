/**
 * Re-designed YouTube Utilities for ClearPath Media
 * Contains purely helper utility functions. All legacy crawls, fallbacks and API hooks have been removed.
 */

/**
 * Extracts the 11-character YouTube video ID from a standard URL.
 */
export function getYoutubeVideoId(url: string): string {
  if (!url) return '';
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  } catch (err) {
    return '';
  }
}
