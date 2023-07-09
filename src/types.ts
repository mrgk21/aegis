import { _RESTOptions } from "@REST/types.rest";

export type _CheckerType = "REST";

export type voidFn = () => void | Promise<void>;
export type anyFn = (...args: any[]) => any | Promise<any> | Promise<object>;

export interface _ErrorObj {
    code: number;
    tag: string;
    url: string;
    error: Error;
}

export enum SupportedLibraries {
    fetch = "fetch",
    axios = "axios",
}

export enum HTTPMethods {
    CONNECT = "CONNECT",
    DELETE = "DELETE",
    GET = "GET",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
    PATCH = "PATCH",
    POST = "POST",
    PUT = "PUT",
    TRACE = "TRACE",
}

export interface APITypes {
    REST: Partial<_RESTOptions>;
}
