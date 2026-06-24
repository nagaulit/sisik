import sharp, { type FitEnum } from "sharp";

export interface ProcessedImage {
    buffer: Buffer;
    width: number;
    height: number;
    size: number;
    mimeType: string;
}

export interface ProcessedMedia {
    original: ProcessedImage;
    large?: ProcessedImage;
    medium?: ProcessedImage;
    thumbnail?: ProcessedImage;
}

export async function createVariant(
    buffer: Buffer,
    width?: number,
    fit: keyof FitEnum = "inside",
): Promise<ProcessedImage> {
    const pipeline = sharp(buffer);

    if (width) {
        pipeline.resize({
            width,
            height: width,
            fit,
            withoutEnlargement: true,
            position: "centre",
        });
    }

    const output = await pipeline
        .webp({
            quality: 85,
        })
        .toBuffer();

    const meta = await sharp(output).metadata();

    return {
        buffer: output,
        width: meta.width!,
        height: meta.height!,
        size: output.length,
        mimeType: "image/webp",
    };
}

export function getMediaKey(id: string, variant: "original" | "large" | "medium" | "thumbnail") {
    return `${id}/${variant}.webp`;
}
