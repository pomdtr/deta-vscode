// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as os from "os";
import { registerCompletions } from "./completion";
import path = require("path");
import { registerTaskProvider } from "./tasks";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  vscode.commands.executeCommand("setContext", "deta.space.active", true);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    vscode.commands.registerCommand("deta.space.open", async () => {
      const workspaceUri = vscode.workspace.workspaceFolders?.[0].uri;
      if (!workspaceUri) {
        vscode.window.showErrorMessage("No workspace folder found");
        return;
      }

      const metaUri = vscode.Uri.joinPath(workspaceUri, ".space", "meta");
      if (!fileExists(metaUri)) {
        vscode.window.showErrorMessage("No deta space project found", {
          detail: "Please run `deta new` or `deta link` in your terminal",
        });
        return;
      }

      const meta = await parseMeta(metaUri);
      await vscode.env.openExternal(
        vscode.Uri.parse(`https://deta.space/builder/${meta.id}`)
      );
    })
  );

  registerCompletions(context);

  const spacePath =
    vscode.workspace.getConfiguration("deta.cli").get<string>("path") ||
    path.join(os.homedir(), ".detaspace", "bin", "space");

  if (!spacePath || !fileExists(vscode.Uri.file(spacePath))) {
    vscode.window
      .showInformationMessage(
        "Please install the deta space cli to use this extension",
        "Installation Guide",
        "Configure Path"
      )
      .then((selection) => {
        switch (selection) {
          case "Installation Guide":
            vscode.env.openExternal(
              vscode.Uri.parse(
                "https://deta.space/docs/en/basics/cli#installation"
              )
            );
            return;
          case "Configure Path":
            vscode.commands.executeCommand(
              "workbench.action.openSettings",
              "deta.cli.path"
            );
            return;
        }
      });
  } else {
    registerTaskProvider(spacePath, context);
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function fileExists(uri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(uri);
    return true;
  } catch (e) {
    return false;
  }
}

type Meta = {
  id: string;
  name: string;
  alias: string;
};

async function parseMeta(uri: vscode.Uri): Promise<Meta> {
  const data = await vscode.workspace.fs.readFile(uri);
  return JSON.parse(data.toString()) as Meta;
}
