import type {Request} from "express";

export const getBaseUrl = (req: Request): string => {
    return `${req.protocol}://${req.get('host')}`;
}

export const getUrl = (req: Request): string => {
    return req.originalUrl.split("?")[0]!;
}

export const generateQueryParams = (obj: any): string => {
    if (typeof obj == "object") {
        let str = [];
        for (const p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    } else {
        return ''
    }
}
