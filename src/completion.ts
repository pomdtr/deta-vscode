import * as vscode from "vscode";
import { isDiscoveryDocument } from "./utils";
import { getFrontmatterRange, directives } from "./frontmatter";
import * as YAML from "yaml";

const directiveCompletionItemProvider: vscode.CompletionItemProvider = {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ) {
    if (!isDiscoveryDocument(document)) {
      return;
    }

    // If there is no word at the position, return nothing
    const wordPos = document.getWordRangeAtPosition(position, /\w+/);
    if (!wordPos && position.character !== 0) {
      return;
    }

    const frontmatterRange = getFrontmatterRange(document);
    if (!frontmatterRange || !frontmatterRange.contains(position)) {
      return;
    }

    let frontmatter: any;
    try {
      frontmatter = YAML.parse(document.getText(frontmatterRange));
    } catch (e) {
      return;
    }

    // const word = wordPos ? document.getText(wordPos) : "";
    return {
      items: directives
        .filter(
          (directive) => !Object.keys(frontmatter).includes(directive.name)
        )
        .map((directive) => ({
          label: directive.name,
          kind: vscode.CompletionItemKind.Property,
          documentation: directive.description,
          insertText: `${directive.name}: `,
        })),
    };
  },
};

export function registerCompletions(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "markdown",
      directiveCompletionItemProvider
    )
  );
}
