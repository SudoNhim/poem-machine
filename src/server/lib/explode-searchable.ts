import CanonData from 'cohen-db';
import * as jsonpath from "jsonpath";
import { isString } from "util";

export enum CanonShardType {
    Title,
    Metadata,
    CanonContent
}

export interface CanonShard {
    path: string;
    text: string;
    kind: CanonShardType;
}

// Return all shards in the database that can be used for text search
export function ExplodeAllSearchable(): CanonShard[] {
    const out: CanonShard[] = [];

    // titles
    out.push(...jsonpath.nodes(CanonData, '$..title')
        .map(node => ({ path: jsonpath.stringify(node.path), text: node.value, kind: CanonShardType.Title })));

    // metadata properties appropriate for searching
    for (var expr of [
        '$..metadata.event',
        '$..metadata.location.city',
        '$..metadata.location.country',
        '$..metadata.location.venue'])
        out.push(...jsonpath.nodes(CanonData, expr)
            .map(node => ({ path: jsonpath.stringify(node.path), text: node.value, kind: CanonShardType.Metadata })));

    // text strings in simple and then multipart documents
    for (var expr of [
        '$..content.content.text.*',
        '$..content.content.text.*.*',
        '$..content.content..content.text.text.*',
        '$..content.content..content.text.text.*.*'])
        out.push(...jsonpath.nodes(CanonData, expr)
            .filter(node => isString(node.value)) // above will also match paragraphs, so filter down to leaf nodes
            .map(node => ({ path: jsonpath.stringify(node.path), text: node.value, kind: CanonShardType.CanonContent })));

    return out;
}