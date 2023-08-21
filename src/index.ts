// @ts-ignore
import imageToBase64 from 'image-to-base64/browser';
// @ts-ignore
import HTMLtoDOCX from 'html-to-docx/dist/html-to-docx.esm';

const regex = /<img[^>]+src="([^">]+)"/gi;

export default function richToWord(richText: string): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    let result = richText;
    let match;
    while ((match = regex.exec(richText)) !== null) {
      // 获取图片src
      const src = match[1];
      // 如果src是http/https链接的图片
      if (src.startsWith('http')) {
        try {
          // 异步下载图片
          const base64 = await imageToBase64(src);
          // 将src替换为base64编码
          result = result.replace(src, `data:image/png;base64,${base64}`);
        } catch (error) {
          reject(error);
        }
      }
    }
    try {
      const blob = await HTMLtoDOCX(result);
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
}
