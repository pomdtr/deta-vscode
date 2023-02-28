import * as vscode from "vscode";
import * as path from "path";

export function isDiscoveryDocument(document: vscode.TextDocument) {
  return path.basename(document.fileName) === "Discovery.md";
}
