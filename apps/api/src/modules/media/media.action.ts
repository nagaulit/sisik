import sharp from "sharp";

import { prisma } from "#core/db/prisma.js";
import { BadRequestError, NotFoundError } from "#core/errors";
import { logger } from "#core/logger/logger.js";
import { storage } from "#core/storage/s3.storage.js";

import { toMediaResponse } from "./media.presenter.js";
import { createVariant } from "./media.util";

import type { MediaCreateInput, MediaUpdateInput } from "generated/prisma/models";

const resourceSlug = "media";

const IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

const IMAGE_VARIANTS = [
    {
        name: "original",
    },
    {
        name: "large",
        width: 2048,
    },
    {
        name: "medium",
        width: 1024,
    },
    {
        name: "thumbnail",
        width: 320,
        fit: "cover" as const,
    },
];

export async function createMedia(data: MediaCreateInput) {
    return prisma.media.create({
        data,
    });
}

export async function getById(id: string) {
    return prisma.media.findUnique({
        where: { id },
    });
}

export async function getByIdOrThrow(id: string) {
    const media = await getById(id);

    if (!media) {
        throw new NotFoundError(resourceSlug);
    }

    return media;
}

export async function update(id: string, data: MediaUpdateInput) {
    return prisma.media.update({
        where: { id },
        data,
    });
}

async function cleanup(mediaId: string, keys: string[]) {
    await Promise.allSettled(keys.map((key) => storage.delete(key)));

    await prisma.media.delete({
        where: {
            id: mediaId,
        },
    });
}

export async function upload(file: File) {
    logger.info(`Processing "${file.name}"`);

    const buffer = Buffer.from(await file.arrayBuffer());

    const media = await createMedia({
        key: crypto.randomUUID(),
        filename: file.name,
        mimeType: file.type,
        size: buffer.length,
    });

    if (!IMAGE_MIME_TYPES.has(file.type)) {
        const objectKey = `${media.key}/original.${file.name.split(".").pop()}`;

        try {
            await storage.put({
                key: objectKey,
                body: buffer,
                contentType: file.type,
            });

            const updatedMedia = await update(media.id, {
                mimeType: file.type,
                size: buffer.length,
            });

            return await toMediaResponse(updatedMedia);
        } catch (error) {
            await cleanup(media.id, [objectKey]);
            throw error;
        }
    }

    const image = sharp(buffer).rotate();

    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
        throw new BadRequestError("Invalid image");
    }

    logger.info(
        `Image detected (${metadata.width}x${metadata.height}, ${Math.round(buffer.length / 1024)} KiB)`,
    );

    const normalized = await image
        .webp({
            quality: 90,
        })
        .toBuffer();

    const variants = await Promise.all(
        IMAGE_VARIANTS.map(async (variant) => ({
            key: `${media.key}/${variant.name}.webp`,
            ...(await createVariant(normalized, variant.width, variant.fit ?? "inside")),
        })),
    );

    try {
        await Promise.all(
            variants.map((variant) =>
                storage.put({
                    key: variant.key,
                    body: variant.buffer,
                    contentType: variant.mimeType,
                }),
            ),
        );

        const original = variants[0]!;

        const updatedMedia = await update(media.id, {
            mimeType: original.mimeType,
            size: original.size,
            width: original.width,
            height: original.height,
        });

        return await toMediaResponse(updatedMedia);
    } catch (error) {
        await cleanup(
            media.id,
            variants.map((variant) => variant.key),
        );

        throw error;
    }
}
