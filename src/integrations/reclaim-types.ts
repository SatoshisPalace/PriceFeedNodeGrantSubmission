import * as _reclaimprotocol_witness_sdk from '@reclaimprotocol/witness-sdk/lib/types';
import * as _reclaimprotocol_witness_sdk_lib_proto_api from '@reclaimprotocol/witness-sdk/lib/proto/api';
export interface Options {
    method: string;
    body?: string;
    headers?: {
        [key: string]: string;
    };
}
export interface secretOptions {
    body?: string;
    headers?: {
        [key: string]: string;
    };
}
export interface ResponseMatches {
    value: string;
    type: "regex" | "contains";
    invert?: boolean;
}