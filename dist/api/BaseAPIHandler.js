"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAPIHandler = void 0;
// BaseAPIHandler.ts
class BaseAPIHandler {
    constructor(baseUrl) {
        this.endpoint = '';
        this.baseUrl = baseUrl;
        this.params = new URLSearchParams();
        this.headers = new Headers();
    }
    setEndpointWithParams(endpoint, pathParams) {
        if (pathParams) {
            // Replace path parameters in the endpoint
            for (const key in pathParams) {
                endpoint = endpoint.replace(`{${key}}`, encodeURIComponent(pathParams[key]));
            }
        }
        this.setEndpoint(endpoint);
        return this;
    }
    setHeader(key, value) {
        this.headers.append(key, value);
        return this;
    }
    getHeaders() {
        return this.headers;
    }
    getAuthHeader() {
        throw Error("Auth Header Undefined");
    }
    setEndpoint(endpoint) {
        this.endpoint = endpoint;
        return this;
    }
    getUrl() {
        const query = this.params.toString();
        return `${this.baseUrl}${this.endpoint}?${query}`;
    }
    setQueryParam(key, value) {
        this.params.set(key, value);
        return this; // Allows for method chaining
    }
    fetchData() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getUrl();
            const response = yield fetch(url, { headers: this.headers });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return yield response.json();
        });
    }
}
exports.BaseAPIHandler = BaseAPIHandler;
