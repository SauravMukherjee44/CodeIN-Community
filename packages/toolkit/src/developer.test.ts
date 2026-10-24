import { describe, it, expect } from "vitest";
import {
  formatJson,
  convertBase64,
  inspectUrl,
  convertUrlComponent,
} from "./developer";
describe("developer tools", () => {
  it("formats and minifies JSON while preserving arrays and primitive values", () => {
    expect(formatJson('{"a":[1,true,null]}')).toBe(
      '{\n  "a": [\n    1,\n    true,\n    null\n  ]\n}',
    );
    expect(formatJson('{ "a": 1 }', "compact")).toBe('{"a":1}');
    expect(formatJson("false")).toBe("false");
    expect(formatJson('"text"')).toBe('"text"');
  });
  it("preserves numeric precision, duplicate keys, string escapes and empty structures", () => {
    const source =
      '{"id":9007199254740993,"id":1.234567890123456789,"quote":"a\\"b","empty":{},"list":[]}';
    expect(formatJson(formatJson(source), "compact")).toBe(source);
  });
  it("bounds deep pretty-print output without losing compact support", () => {
    const input = "[".repeat(101) + "0" + "]".repeat(101);
    expect(() => formatJson(input)).toThrow("nesting");
    expect(formatJson(input, "compact")).toBe(input);
  });
  it("rejects invalid or empty JSON without executing input", () => {
    expect(() => formatJson("{oops}")).toThrow("Invalid JSON");
    expect(() => formatJson("")).toThrow("Enter JSON");
    expect(() => formatJson("(()=>alert(1))()")).toThrow();
  });
  it.each(["Hello world", "नमस्ते 👋 café", "", "line 1\nline 2"])(
    "round trips Unicode Base64: %s",
    (text) =>
      expect(convertBase64(convertBase64(text, "encode"), "decode")).toBe(text),
  );
  it("accepts wrapped and unpadded standard Base64 but refuses invalid bytes or padding", () => {
    expect(convertBase64("aG Vs\nbG8=", "decode")).toBe("hello");
    expect(convertBase64("aGk", "decode")).toBe("hi");
    for (const bad of ["a", "abcd=", "%%%", "/w=="])
      expect(() => convertBase64(bad, "decode")).toThrow();
  });
  it("handles large text without overflowing the call stack and bounds input", () => {
    const input = "🚀".repeat(25000);
    expect(convertBase64(convertBase64(input, "encode"), "decode")).toBe(input);
    expect(() => formatJson(" ".repeat(1000001))).toThrow("under 1,000,000");
  });
  it("preserves repeated query keys, decoding, empty values, ports and fragments", () => {
    expect(
      inspectUrl(
        "https://example.com:8443/path?q=hello+world&q=%F0%9F%91%8B&empty=#section",
      ),
    ).toEqual({
      protocol: "https:",
      hostname: "example.com",
      port: "8443",
      pathname: "/path",
      fragment: "section",
      query: [
        { key: "q", value: "hello world" },
        { key: "q", value: "👋" },
        { key: "empty", value: "" },
      ],
    });
  });
  it.each(["javascript:alert(1)", "file:///etc/passwd", "not a URL"])(
    "rejects non-web URLs: %s",
    (value) => expect(() => inspectUrl(value)).toThrow(),
  );
  it("encodes/decode URL components without treating plus as a space", () => {
    expect(convertUrlComponent("a+b/नमस्ते", "decode")).toBe("a+b/नमस्ते");
    expect(
      convertUrlComponent(convertUrlComponent("a+b/👋", "encode"), "decode"),
    ).toBe("a+b/👋");
    expect(() => convertUrlComponent("%E0%A4", "decode")).toThrow(
      "percent-encoded",
    );
  });
});
