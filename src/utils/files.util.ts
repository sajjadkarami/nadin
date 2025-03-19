export function getFileFormat(file: Express.Multer.File) {
  const split = file.originalname.split('.');
  return split[split.length - 1];
}
