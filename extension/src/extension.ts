import * as vscode from 'vscode';
import { LearnerViewProvider } from './LearnerViewProvider';

export function activate(context: vscode.ExtensionContext) {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '';

  const provider = new LearnerViewProvider(context.extensionUri, workspaceRoot);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(LearnerViewProvider.viewType, provider)
  );

  // Watch .learner/state.json — refreshes sidebar whenever Claude updates it
  if (workspaceRoot) {
    const stateWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, '.learner/state.json')
    );
    stateWatcher.onDidChange(() => provider.refresh());
    stateWatcher.onDidCreate(() => provider.refresh());
    context.subscriptions.push(stateWatcher);

    // Also watch build-map.md so the checklist updates when items are completed
    const buildMapWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceRoot, '.learner/build-map.md')
    );
    buildMapWatcher.onDidChange(() => provider.refresh());
    buildMapWatcher.onDidCreate(() => provider.refresh());
    context.subscriptions.push(buildMapWatcher);
  }
}

export function deactivate() {}
