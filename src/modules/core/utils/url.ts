import path from 'path';

export const formatUrlFromPath = (urlBase: string, path: string) => {
  // Normalise into relative path and remove duplicate slashes
  const normPath = `./${path}`.replace(/\/{2,}/g, '/').trim();
  const url = new URL(normPath, urlBase).toString();
  return url;
};

export const formatUrlFromStaticPath = (urlBase: string, localPath: string) => {
  const assetsPath = path.resolve('./static');
  const relativeLocalPath = path.relative(assetsPath, localPath);
  const url = formatUrlFromPath(urlBase, relativeLocalPath);
  return url;
};

export const formatAssetMediaPath = (assetFileName: string) => {
  const fileBase = path.basename(assetFileName);
  const mediaPath = `/assets/media/${fileBase}`;
  return mediaPath;
};
