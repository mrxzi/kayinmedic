import { S3Client, ListBucketsCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

export const isS3Configured = Boolean(
  process.env.AWS_ENDPOINT_URL_S3 &&
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY
);

export const s3Client = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

export async function testS3Connection(): Promise<{ success: boolean; buckets?: any[]; error?: string }> {
  if (!isS3Configured) {
    return { success: false, error: 'S3 environment variables are not configured' };
  }

  try {
    const res = await s3Client.send(new ListBucketsCommand({}));
    return { success: true, buckets: res.Buckets || [] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
