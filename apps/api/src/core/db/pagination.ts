export interface PaginationQuery {
    page: number;
    limit: number;
}

export function paginate({ page, limit }: PaginationQuery) {
    return {
        skip: (page - 1) * limit,
        take: limit,
    };
}
