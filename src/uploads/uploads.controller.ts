import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

const client = new S3Client({});

const BUCKET_NAME = 'kimchinubereats20070017';

@Controller('uploads')
export class UploadsController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    // console.log(file);

    try {
      // 버킷 생성 (버킷이 없으면 생성. 한번만 하면 됨. 버킷 이름은 unique 해야한다.)
      // const createBucketCommand = new CreateBucketCommand({
      //   Bucket: 'kimchinubereats20070017',
      // });
      // const response = await client.send(createBucketCommand);

      const objectName = `${Date.now() + file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectName,
        Body: file.buffer,
        ACL: 'public-read',
      });
      await client.send(command);

      const url = `https://${BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com/${objectName}`;
      return { url };
    } catch (err) {
      return null;
    }
  }
}
