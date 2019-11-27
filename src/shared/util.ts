import { IDocReference } from "./IApiTypes";
import { isNullOrUndefined } from "util";

export function SerializeDocRef(ref: IDocReference): string {
  const parts: string[] = [];
  if (!isNullOrUndefined(ref.section)) parts.push(`s${ref.section}`);
  if (!isNullOrUndefined(ref.paragraph)) parts.push(`p${ref.paragraph}`);
  if (!isNullOrUndefined(ref.line)) parts.push(`l${ref.line}`);

  if (!isNullOrUndefined(ref.substrings))
    parts.push(ref.substrings.map(s => `i${s[0]}-${s[1]}`).join(""));

  return `${ref.docId}${parts.length ? "#" : ""}${parts.join(".")}`;
}

export function DeserializeDocRef(ref: string): IDocReference {
  const [docId, parts] = ref.split("#");
  const out: IDocReference = {
    docId
  };

  if (!parts) return out;

  for (var part of parts.split(".")) {
    const code = part[0];
    const valueStr = part.substring(1);
    switch (code) {
      case "s":
        out.section = Number.parseInt(valueStr);
        break;
      case "p":
        out.paragraph = Number.parseInt(valueStr);
        break;
      case "l":
        out.line = Number.parseInt(valueStr);
        break;
      case "i":
        out.substrings = valueStr
          .split("i")
          .map(s => s.split("-").map(Number.parseInt));
      default:
        throw "Unrecognized code in docref";
    }
  }

  return out;
}
