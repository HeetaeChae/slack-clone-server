import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as fs from 'fs';
import path from 'path';
import { diskStorage } from 'multer';

const getStorage = async () => {
  // upload 폴더
  try {
    fs.readdirSync('uploads');
  } catch (error) {
    console.log('uploads폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }

  // 파일 저장 구현
  return diskStorage({
    // 저장 위치
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    // 파일 이름
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  });
};

export const multerOptions = () => {
  const result: MulterOptions = {
    storage: getStorage(),
  };
  return result;
};
