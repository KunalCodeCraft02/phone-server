import { Clipboard } from '@capacitor/clipboard';

export const readClipboard = async () => {
  const result = await Clipboard.read();
  return {
    type: result.type,
    value: result.value,
    timestamp: new Date().toISOString(),
  };
};

export const writeClipboard = async (text) => {
  await Clipboard.write({ string: text });
};
