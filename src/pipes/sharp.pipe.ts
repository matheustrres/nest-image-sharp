import { basename, extname } from 'node:path';
import * as sharp from 'sharp';
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SharpImagePipe
  implements PipeTransform<Express.Multer.File, Promise<string>>
{
  async transform(image: Express.Multer.File): Promise<string> {
    const originalName = image.originalname;
    const formattedName = basename(originalName, extname(originalName));

    const fileName = `${Date.now()}-${formattedName}.webp`;

    /**
     * JPEG -> WEBP (quality: 85)  = 346.26b  -> 59.322b
     * AVIF -> WEBP (quality: 85)  = 45.326b  -> 40.948b
     * WEBP -> WEBP (quality: 85)  = 51.472b  -> 30.876b
     * JPG  -> WEBP (quality: 85)  = 303.488b -> 25.534b
     * PNG  -> WEBP (quality: 85)  = 762.942b -> 42.322b
     * PNG  -> WEBP (quality: 90)  = 762.942b -> 54.422b
     * PNG  -> WEBP (quality: 100) = 762.942b -> 101.288b
     * PNG  -> WEBP (quality: 100 / no resize) = 762.942b -> 177.376b
     */
    await sharp(image.buffer)
      .resize({ width: 800 })
      .webp({
        quality: 100,
        effort: 6,
        lossless: false,
        alphaQuality: 100,
      })
      .toFile(fileName);

    return fileName;
  }
}
