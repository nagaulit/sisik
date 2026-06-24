import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "#config/env.config.js";

import type { PutObjectOptions, Storage } from "./storage.js";

class S3Storage implements Storage {
    private readonly client = new S3Client({
        forcePathStyle: true,
        region: env.S3_REGION,
        endpoint: env.S3_ENDPOINT,
        credentials: {
            accessKeyId: env.S3_ACCESS_KEY,
            secretAccessKey: env.S3_SECRET_KEY,
        },
    });

    async put({ key, body, contentType }: PutObjectOptions) {
        await this.client.send(
            new PutObjectCommand({
                Bucket: env.S3_BUCKET,
                Key: key,
                Body: body,
                ContentType: contentType,
            }),
        );
    }

    async delete(key: string) {
        await this.client.send(
            new DeleteObjectCommand({
                Bucket: env.S3_BUCKET,
                Key: key,
            }),
        );
    }

    async getSignedUrl(key: string, expiresIn = 60 * 60) {
        return getSignedUrl(
            this.client,
            new GetObjectCommand({
                Bucket: env.S3_BUCKET,
                Key: key,
            }),
            {
                expiresIn,
            },
        );
    }

    getPublicUrl(key: string) {
        return `${env.S3_ENDPOINT}/${key}`;
    }
}

export const storage = new S3Storage();
