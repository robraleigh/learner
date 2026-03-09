import * as vscode from 'vscode';
import { LearnerViewProvider } from './LearnerViewProvider';

export function activate(context: vscode.ExtensionContext) {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '';

  const provider = new LearnerViewProvider(context.extensionUri, workspaceRoot);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(LearnerViewProvider.viewType, provider)
  );

  if (workspaceRoot) {
    // Watch active.json — refreshes sidebar when the student switches projects
    const activeWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, '.learner/active.json')
    );
    activeWatcher.onDidChange(() => provider.refresh());
    activeWatcher.onDidCreate(() => provider.refresh());
    context.subscriptions.push(activeWatcher);

    // Watch all per-student/per-project state files — catches state.json and build-map.md changes
    const projectsWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, '.learner/students/**')
    );
    projectsWatcher.onDidChange(() => provider.refresh());
    projectsWatcher.onDidCreate(() => provider.refresh());
    context.subscriptions.push(projectsWatcher);
  }
}

export function deactivate() {}
