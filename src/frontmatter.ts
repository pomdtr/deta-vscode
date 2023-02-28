import * as vscode from "vscode";

type Directive = {
  name: string;
  description: string;
};

export const directives: Directive[] = [
  {
    name: "title",
    description: `Use title to give your app a friendly and descriptive name on Discovery.`,
  },
  {
    name: "tagline",
    description: `Use the tagline to provide a short description of your app. This will be shown across Discovery on both the app’s page and in featured sections or search.`,
  },
  {
    name: "theme_color",
    description: `Use theme_color to style the color of your app’s Discovery page to match your app.`,
  },
  {
    name: "git",
    description: `Use git to link to your app’s Git repository, so users can view its source and can contribute to your app.`,
  },
  {
    name: "homephage",
    description: `Use homepage to link to an abitrary URL related to your app. This could be your app’s marketing page or a description website for example.`,
  },
];

export function getFrontmatterRange(
  document: vscode.TextDocument
): vscode.Range | undefined {
  if (document.lineAt(0).text.trim() !== "---") {
    return;
  }

  let currentLine = 1;
  while (document.lineAt(currentLine).text.trim() !== "---") {
    if (currentLine === document.lineCount) {
      return;
    }
    currentLine++;
  }

  const firstLine = document.lineAt(1);
  const lastLine = document.lineAt(currentLine - 1);
  return new vscode.Range(firstLine.range.start, lastLine.range.end);
}
