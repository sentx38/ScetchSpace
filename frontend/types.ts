type CategoriesType =  {
    id: number
    title: string
    code: string
}

type UserType = {
    id?: number
    name?: string
    profile_image?: string
    username?: string
    email?: string
}

type APIResponseType<T> = {
    data: Array<T>;
    path: string;
    per_page: number;
    next_cursor: string;
    next_page_url?: string;
    prev_cursor?: string;
    prev_page_url?: string;
};