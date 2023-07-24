export function convertImageToDataUrl(file: File): Promise<string> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = function () {
      resolve(this.result as string);
    };
    reader.onerror = function () {
      reject(this.error);
    };
    reader.readAsDataURL(file);
  });
}
