"use client";
import { Icon } from "./icon";
import { useState, type FormEvent } from "react";
import {
  formatJson,
  convertBase64,
  inspectUrl,
  convertUrlComponent,
  type UrlDetails,
} from "@codein-community/toolkit/developer";
import type { DeveloperToolKind } from "@/lib/community";
const examples: Record<DeveloperToolKind, string> = {
  "json-formatter":
    '{"project":"CodeIN","contributors":150,"tools":["JSON","Base64","URLs"]}',
  base64: "Hello, CodeIN! नमस्ते 👋",
  "url-inspector":
    "https://example.com/search?q=open+source&tag=react&tag=typescript#results",
};
export function DeveloperWorkbench({ kind }: { kind: DeveloperToolKind }) {
  const [input, setInput] = useState(""),
    [mode, setMode] = useState("default"),
    [output, setOutput] = useState<string | null>(null),
    [details, setDetails] = useState<UrlDetails | null>(null),
    [error, setError] = useState(""),
    [status, setStatus] = useState("");
  const json = kind === "json-formatter",
    base64 = kind === "base64";
  const modes = json
    ? [
        ["default", "Pretty print"],
        ["compact", "Minify"],
      ]
    : base64
      ? [
          ["default", "Encode text"],
          ["decode", "Decode Base64"],
        ]
      : [
          ["default", "Inspect URL"],
          ["encode", "Encode component"],
          ["decode", "Decode component"],
        ];
  const action = json
    ? mode === "compact"
      ? "Minify JSON"
      : "Format JSON"
    : base64
      ? mode === "decode"
        ? "Decode Base64"
        : "Encode text"
      : mode === "default"
        ? "Inspect URL"
        : mode === "encode"
          ? "Encode component"
          : "Decode component";
  function clear() {
    setOutput(null);
    setDetails(null);
    setError("");
    setStatus("");
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    clear();
    try {
      if (json)
        setOutput(formatJson(input, mode === "compact" ? "compact" : "pretty"));
      else if (base64)
        setOutput(
          convertBase64(input, mode === "decode" ? "decode" : "encode"),
        );
      else if (mode === "default") {
        const result = inspectUrl(input);
        setDetails(result);
        setOutput(JSON.stringify(result, null, 2));
      } else
        setOutput(
          convertUrlComponent(input, mode === "encode" ? "encode" : "decode"),
        );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Check the input and try again.",
      );
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(output ?? "");
      setStatus("Copied to clipboard.");
    } catch {
      setStatus("Clipboard unavailable. Use the download button instead.");
    }
  }
  function download() {
    const name = json
      ? "formatted.json"
      : details
        ? "url-details.json"
        : "converted.txt";
    const blob = new Blob([output ?? ""], {
      type:
        json || details
          ? "application/json;charset=utf-8"
          : "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <p className="local-tool-note">
        <Icon name="lock" size={18} /> Runs entirely in your browser. Your input
        is never sent to a server.
      </p>
      <div className="developer-workbench">
        <form className="developer-input" onSubmit={submit}>
          <div className="editor-heading">
            <h2>Your input</h2>
            <button
              type="button"
              className="subtle-button"
              onClick={() => {
                clear();
                setInput(examples[kind]);
                setMode("default");
              }}
            >
              Use example
            </button>
          </div>
          <label>
            Operation
            <select
              value={mode}
              onChange={(e) => {
                clear();
                setMode(e.target.value);
              }}
            >
              {modes.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="editor-label">
            {json
              ? "JSON input"
              : base64
                ? "Text or Base64 input"
                : "URL or text input"}
            <textarea
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              value={input}
              maxLength={1000000}
              onChange={(e) => {
                setInput(e.target.value);
                clear();
              }}
              placeholder={examples[kind]}
            />
          </label>
          <div className="editor-actions">
            <button type="submit" className="button">
              {action} <span aria-hidden="true">→</span>
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={() => {
                setInput("");
                clear();
              }}
            >
              Clear
            </button>
          </div>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
        </form>
        <section
          className="developer-output"
          aria-label="Tool output"
          aria-live="polite"
        >
          <div className="editor-heading">
            <h2>Your result</h2>
            <span className="badge">
              {output === null ? "READY WHEN YOU ARE" : "COMPLETE"}
            </span>
          </div>
          {output === null ? (
            <div className="developer-empty">
              <span aria-hidden="true">
                {json ? "{}" : base64 ? "Aa" : "↗"}
              </span>
              <h3>A little less manual work.</h3>
              <p>
                {json
                  ? "Readable, valid JSON in a moment."
                  : base64
                    ? "Convert text without losing its Unicode characters."
                    : "See the parts of a URL, including every query parameter."}
              </p>
              <p>Paste your input or try the example to get started.</p>
            </div>
          ) : (
            <>
              {details ? (
                <div className="url-details">
                  <dl>
                    {[
                      ["Protocol", details.protocol],
                      ["Hostname", details.hostname],
                      ["Port", details.port || "(default)"],
                      ["Path", details.pathname],
                      ["Fragment", details.fragment || "(none)"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <h3>
                    Query parameters{" "}
                    <span className="muted">({details.query.length})</span>
                  </h3>
                  {details.query.length ? (
                    <table>
                      <thead>
                        <tr>
                          <th scope="col">Key</th>
                          <th scope="col">Decoded value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.query.map((param, i) => (
                          <tr key={i}>
                            <td>{param.key || "(empty)"}</td>
                            <td>{param.value || "(empty)"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No query parameters in this URL.</p>
                  )}
                </div>
              ) : (
                <label className="editor-label">
                  {json ? "Formatted JSON" : "Converted text"}
                  <textarea
                    className="developer-result"
                    readOnly
                    value={output}
                    spellCheck={false}
                  />
                </label>
              )}
              <div className="result-actions">
                <button type="button" className="button" onClick={copy}>
                  <Icon name="copy" size={15} /> Copy result
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={download}
                >
                  Download {json || details ? "JSON" : "text"} ↓
                </button>
              </div>
            </>
          )}
          {status && (
            <p className="pagination-note" role="status">
              {status}
            </p>
          )}
        </section>
      </div>
      <div className="developer-tips">
        <h2>
          {json
            ? "JSON, without the guesswork."
            : base64
              ? "Built for real text."
              : "Every parameter, accounted for."}
        </h2>
        <p>
          {json
            ? "Pretty print for reading, or minify for a compact payload. Numeric literals, key order, and escape sequences are preserved. Input is validated as JSON and never executed."
            : base64
              ? "Uses standard Base64 and UTF-8 for emoji and multilingual text. Whitespace in encoded input is accepted. This converter handles text, not binary files; Base64 is an encoding, not encryption."
              : "Inspect HTTP and HTTPS URLs without visiting them. Repeated query keys remain separate rows. Component mode uses percent encoding; a plus sign stays a plus sign when decoding a component."}
        </p>
        <p className="hint">
          Input limit: 1,000,000 characters. Refreshing or leaving this page
          clears your input.
        </p>
      </div>
    </>
  );
}
