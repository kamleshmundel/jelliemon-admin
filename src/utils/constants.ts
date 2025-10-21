export const ROUTES = {
    // auth
    login: "/auth/login",
    forgetPass: "/auth/forget-password",

    home: "/",
    users: "/users",
    subjects: "/subjects",
    units: "/units",
    lessons: "/lessons",
    questions: "/questions",
    queAddEdit: "/questions/add-edit",
}

export const STORAGE_VAR = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    USER: "user_data",
}

export const quetype: { [key: string]: string } = {
    ssl: "Single Selection",
    mcq: "Multiple Choice",
    true_false: "True/False",
}