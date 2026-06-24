import { bodyLimit } from "hono/body-limit";

import { createRouter } from "#core/app/create-app.js";
import { BadRequestError } from "#core/errors/bad-request.error.js";

import { getByIdOrThrow, upload } from "./media.action";
import { toMediaResponse } from "./media.presenter";

const mediaRoutes = createRouter()
    .post(
        "/upload",
        bodyLimit({
            maxSize: 10 * 1024 * 1024, // 10 MiB
            onError: (c) => {
                return c.text("File too large", 413);
            },
        }),
        async (c) => {
            const { file } = await c.req.parseBody();

            if (!(file instanceof File)) {
                throw new BadRequestError("File is required");
            }

            const allowedMimeTypes = [
                "image/png",
                "image/jpeg",
                "image/webp",
                "image/gif",
                "image/svg+xml",
                "application/pdf",
            ];

            if (!allowedMimeTypes.includes(file.type)) {
                throw new BadRequestError("Unsupported file type");
            }

            const processedMedia = await upload(file);

            return c.json(processedMedia);
        },
    )
    .get("/media/:id", async (c) => {
        const id = c.req.param("id");
        const media = await getByIdOrThrow(id);

        return c.json(await toMediaResponse(media));
    });
export default mediaRoutes;
