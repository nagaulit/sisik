export interface PutObjectOptions {
    key: string;
    body: Buffer;
    contentType: string;
}

export interface Storage {
    put(options: PutObjectOptions): Promise<void>;
    delete(key: string): Promise<void>;
}
