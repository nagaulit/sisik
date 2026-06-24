import { storage } from "#core/storage/s3.storage.js";

import type { Media } from "generated/prisma/client";

const IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export async function toMediaResponse(media: Media) {
    if (!media.key) {
        return media;
    }

    if (!IMAGE_MIME_TYPES.has(media.mimeType)) {
        return {
            ...media,
            url: await storage.getSignedUrl(
                `${media.key}/original.${media.filename.split(".").pop()}`,
            ),
        };
    }

    return {
        ...media,
        url: await storage.getSignedUrl(`${media.key}/original.webp`),
        largeUrl: await storage.getSignedUrl(`${media.key}/large.webp`),
        mediumUrl: await storage.getSignedUrl(`${media.key}/medium.webp`),
        thumbnailUrl: await storage.getSignedUrl(`${media.key}/thumbnail.webp`),
    };
}
