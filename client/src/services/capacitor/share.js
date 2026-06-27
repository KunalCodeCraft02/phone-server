import { Share } from '@capacitor/share';

export const shareContent = async ({ title, text, url, files }) => {
  const options = { title, text };
  if (url) options.url = url;
  if (files && files.length > 0) options.files = files;
  const result = await Share.share(options);
  return result;
};
