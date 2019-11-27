import { Text } from 'cohen-db/schema';
import { IDocReferencePreview, IDocReference } from '../../shared/IApiTypes';
import { isNullOrUndefined } from 'util';
import CanonData from "cohen-db";

export function GeneratePreview(docRef: IDocReference): IDocReferencePreview {
    const doc = CanonData[docRef.docId];

    if (!doc.content) {
      return {
        docRef,
        preview: {
          text: ["No content"]
        }
      };
    }

    // Build a preview around the first match position
    const activeText: Text = Array.isArray(doc.content.content) ?
      doc.content.content[docRef.section || 0].content
      : doc.content.content;

    const adjustedRef: IDocReference = {
      docId: docRef.docId
    };

    if (!isNullOrUndefined(docRef.section))
      adjustedRef.section = docRef.section;

    return {
      docRef,
      preview: GeneratePreviewText(activeText, docRef.paragraph || 0, docRef.line || 0)
    };
}

// Generate a shortened preview view of the text that includes the indicated paragraph/line
function GeneratePreviewText(text: Text, paragraph: number, line: number): Text {
    const budget = 4;
    const linelen = 64;
    var cost = 0;

    var out: string[][] = [];
    while (cost < budget && paragraph < text.text.length) {
        var pout: string[] = [];

        const p = text.text[paragraph];
        const start = Math.max(line - 1, 0);
        const end = Math.max(line + 3, 3);
        let lines: string[];
        if (Array.isArray(p)) {
            lines = p.filter((_, i) => i >= start && i <= end);
        } else {
            lines = [p];
        }

        for (const str of lines) {
            const c = Math.ceil(str.length / linelen);
            cost += c;
            if (cost <= budget)
                pout.push(str);
            else {
                pout.push(TrimString(str, (budget - cost + c) * linelen));
                break;
            }
        }

        out.push(pout);
        paragraph = paragraph + 1;
    }

    return {
        text: out
    };
}

function TrimString(str: string, len: number): string {
    if (str.length < len) return str;

    const lastSpace = str.substr(0, len).lastIndexOf(' ');
    return str.substr(0, lastSpace) + '...';
}
