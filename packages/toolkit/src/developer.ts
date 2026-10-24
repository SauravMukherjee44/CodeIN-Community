/** Browser-portable developer utilities. No network, storage, or code execution. */
const MAX_INPUT = 1_000_000;
function checkSize(input: string) {
  if (input.length > MAX_INPUT)
    throw new Error("Use input under 1,000,000 characters.");
}
export function formatJson(
  input: string,
  mode: "pretty" | "compact" = "pretty",
): string {
  checkSize(input);
  if (!input.trim()) throw new Error("Enter JSON to format.");
  try {
    JSON.parse(input);
  } catch (error) {
    throw new Error(
      "Invalid JSON: " +
        (error instanceof Error ? error.message : "Check the syntax."),
      { cause: error },
    );
  }
  // Format lexical tokens so large numbers, duplicate keys, and escape sequences
  // survive unchanged. Parsing is used only to validate syntax.
  const tokens =
    input.match(/"(?:\\.|[^"\\])*"|[^\s"{}[\],:]+|[{}[\],:]/g) ?? [];
  if (mode === "compact") return tokens.join("");
  let depth = 0,
    output = "";
  const line = () => "\n" + "  ".repeat(depth);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "{" || token === "[") {
      output += token;
      if (tokens[i + 1] !== (token === "{" ? "}" : "]")) {
        depth++;
        if (depth > 100)
          throw new Error(
            "JSON nesting is too deep to pretty print. Use minify for deeply nested data.",
          );
        output += line();
      }
    } else if (token === "}" || token === "]") {
      if (tokens[i - 1] !== (token === "}" ? "{" : "[")) {
        depth--;
        output += line();
      }
      output += token;
    } else if (token === ",") output += token + line();
    else if (token === ":") output += ": ";
    else output += token;
    if (output.length > 5000000)
      throw new Error(
        "Formatted output is too large. Use minify or a smaller input.",
      );
  }
  return output;
}
export function convertBase64(
  input: string,
  mode: "encode" | "decode",
): string {
  checkSize(input);
  if (mode === "encode") {
    const bytes = new TextEncoder().encode(input);
    // Bound argument counts for large Unicode input.
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192)
      binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    return btoa(binary);
  }
  const value = input.replace(/\s/g, "");
  if (
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}(?:==)?|[A-Za-z0-9+/]{3}=?)?$/.test(
      value,
    )
  )
    throw new Error(
      "Enter valid standard Base64. Check its characters and padding.",
    );
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(
      Uint8Array.from(atob(value), (c) => c.charCodeAt(0)),
    );
  } catch {
    throw new Error(
      "This value is not valid Base64-encoded UTF-8 text. Binary files are not supported.",
    );
  }
}
export interface UrlDetails {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  fragment: string;
  query: { key: string; value: string }[];
}
export function inspectUrl(input: string): UrlDetails {
  checkSize(input);
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error("Enter a full HTTP or HTTPS URL, including https://.");
  }
  if (!["http:", "https:"].includes(url.protocol))
    throw new Error("Use an HTTP or HTTPS URL.");
  return {
    protocol: url.protocol,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    fragment: url.hash.slice(1),
    query: [...url.searchParams].map(([key, value]) => ({ key, value })),
  };
}
export function convertUrlComponent(
  input: string,
  mode: "encode" | "decode",
): string {
  checkSize(input);
  try {
    return mode === "encode"
      ? encodeURIComponent(input)
      : decodeURIComponent(input);
  } catch {
    throw new Error(
      "Invalid percent-encoded text. Check the percent sequences and UTF-8 characters.",
    );
  }
}
