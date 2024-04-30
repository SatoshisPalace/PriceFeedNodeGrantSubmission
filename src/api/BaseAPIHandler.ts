
// BaseAPIHandler.ts
export class BaseAPIHandler {
    baseUrl: string;
    endpoint: string = '';
    params: URLSearchParams;
    headers: Headers;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.params = new URLSearchParams();
        this.headers = new Headers();
    }

    public setEndpointWithParams(endpoint: string, pathParams?: Record<string, string>): this {
        if (pathParams) {
            // Replace path parameters in the endpoint
            for (const key in pathParams) {
                endpoint = endpoint.replace(`{${key}}`, encodeURIComponent(pathParams[key]));
            }
        }
        this.setEndpoint(endpoint)
        return this;
    }

    public setHeader(key: string, value: string): this {
        this.headers.append(key, value);
        return this;
    }

    public getHeaders(): Headers {
        return this.headers
    }

    public setEndpoint(endpoint: string): this {
        this.endpoint = endpoint;
        return this;
    }

    public getUrl(): string {
        const query = this.params.toString();
        return `${this.baseUrl}${this.endpoint}?${query}`;
    }

    public setQueryParam(key: string, value: string): this {
        this.params.set(key, value);
        return this; // Allows for method chaining
    }

    public async fetchData(): Promise<any> {
        const url = this.getUrl();
        const response = await fetch(url, { headers: this.headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
}
