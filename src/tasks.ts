import * as vscode from "vscode";

type SpaceTaskDefinition = {
  command: string;
  args?: string[];
  label: string;
};
const spaceTasks: SpaceTaskDefinition[] = [
  {
    command: "new",
    label: "Create new project",
  },
  {
    command: "push",
    label: "Push code for project",
  },
  {
    command: "release",
    label: "Create release for project",
  },
  {
    command: "validate",
    label: "Validate Spacefile",
  },
];

class DetaTaskProvider implements vscode.TaskProvider {
  private tasks: vscode.Task[] | undefined;
  private spacePath: string;

  constructor(spacePath: string) {
    this.spacePath = spacePath;
  }

  provideTasks(): vscode.ProviderResult<vscode.Task[]> {
    if (this.tasks) {
      return this.tasks;
    }

    const tasks = spaceTasks.map((_task) => {
      const task = new vscode.Task(
        {
          type: "space",
          command: _task.command,
        },
        vscode.TaskScope.Workspace,
        _task.args ? `${_task.command} ${_task.args.join(" ")}` : _task.command,
        "space",
        new vscode.ProcessExecution(
          this.spacePath,
          _task.args ? [_task.command, ..._task.args] : [_task.command]
        ),
        []
      );

      task.detail = _task.label;

      return task;
    });

    this.tasks = tasks;

    return tasks;
  }

  resolveTask(_task: vscode.Task): vscode.ProviderResult<vscode.Task> {
    const command = _task.definition.command;

    if (command) {
      return;
    }

    return this.tasks?.find((task) => task.definition.command === command);
  }
}

export function registerTaskProvider(
  spacePath: string,
  context: vscode.ExtensionContext
) {
  context.subscriptions.push(
    vscode.tasks.registerTaskProvider("space", new DetaTaskProvider(spacePath))
  );
}
