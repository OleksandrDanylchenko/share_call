/**
 * Inspired with https://uploadcare.com/docs/uploads/file-uploader/#upload-an-image-from-base64
 */
export const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0]!.match(/:(.*?);/)![1];
  const bstr = atob(arr[1]!);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
