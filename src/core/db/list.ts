export interface PaginationMetadata {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface ListResult<T> {
    data: T[];
    pagination: PaginationMetadata;
}

export function createListResult<T>(
    data: T[],
    totalItems: number,
    page: number,
    pageSize: number,
): ListResult<T> {
    return {
        data,
        pagination: {
            page,
            pageSize,
            totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
            hasPreviousPage: page > 1,
            hasNextPage: page * pageSize < totalItems,
        },
    };
}
