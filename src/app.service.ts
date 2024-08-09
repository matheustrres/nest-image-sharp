import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async sendImage(imageName: string) {
    // your logic goes here...
    console.log(imageName);
  }
}
