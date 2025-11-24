import type {HttpInput, HttpOutput} from "./http.types"

export const httpService = async (input: HttpInput): Promise<HttpOutput> => {
    return {
        finalUrl: "",
        statusCode: 0,
        statusText: "",
        protocol: "",
        headers: {}
    }
}
