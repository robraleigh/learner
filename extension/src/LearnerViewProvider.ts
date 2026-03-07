import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import {
  LearnerState,
  BuildMapItem,
  readState,
  writePendingAnswer,
  parseBuildMap,
  isSetUp,
  getLevelForXP,
} from './state';

export class LearnerViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'learner.sidebar';

  private _view?: vscode.WebviewView;
  private _workspaceRoot: string;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    workspaceRoot: string
  ) {
    this._workspaceRoot = workspaceRoot;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case 'submitAnswer': {
          const state = readState(this._workspaceRoot);
          if (state?.pendingReview?.active) {
            writePendingAnswer(
              this._workspaceRoot,
              state.pendingReview.question,
              message.answer,
              state.pendingReview.questionLevel,
              state.pendingReview.hintsUsed
            );
            // Show confirmation in VS Code
            vscode.window.showInformationMessage(
              'Answer submitted! Send a message to Claude to continue.'
            );
          }
          break;
        }
        case 'requestHint': {
          // Tell the user to type /hint in Claude Code chat
          vscode.window.showInformationMessage('Type /hint in the Claude Code chat for a hint.');
          break;
        }
        case 'ready': {
          // Webview is ready, send initial state
          this.refresh();
          break;
        }
      }
    });

    // Send initial data
    this.refresh();
  }

  public refresh() {
    if (!this._view) {
      return;
    }

    const state = readState(this._workspaceRoot);
    const buildMap = parseBuildMap(this._workspaceRoot);
    const setUp = isSetUp(this._workspaceRoot);

    let levelInfo = { level: 1, title: 'Debug Mode', nextLevelXP: 200 };
    if (state) {
      levelInfo = getLevelForXP(state.xp);
    }

    this._view.webview.postMessage({
      type: 'stateUpdate',
      state,
      buildMap,
      setUp,
      levelInfo,
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const webviewDir = vscode.Uri.joinPath(this._extensionUri, 'webview');
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewDir, 'main.js'));
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewDir, 'style.css'));

    // Content Security Policy
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="${styleUri}" rel="stylesheet">
  <title>Learner</title>
</head>
<body>
  <div id="app">
    <div id="not-started" class="hidden">
      <div class="empty-state">
        <div class="empty-icon">🎓</div>
        <h2>Ready to start?</h2>
        <p>Open the Claude Code chat and type:</p>
        <code>/start "your project idea"</code>
        <p class="hint">For example: /start "I want to make a quiz app"</p>
      </div>
    </div>

    <div id="main-content" class="hidden">
      <!-- Header: name + level -->
      <div id="header">
        <div id="student-name"></div>
        <div id="level-badge"></div>
      </div>

      <!-- XP Bar -->
      <div id="xp-section">
        <div id="xp-bar-container">
          <div id="xp-bar"></div>
        </div>
        <div id="xp-label"></div>
      </div>

      <!-- Review Card (shown when a review is pending) -->
      <div id="review-card" class="hidden">
        <div id="review-header">
          <span id="review-level-badge"></span>
          <span>Review</span>
        </div>
        <div id="review-question"></div>
        <div id="review-input-area">
          <textarea id="review-answer" placeholder="Type your answer here..." rows="3"></textarea>
          <div id="review-buttons">
            <button id="hint-btn" class="btn-secondary">Hint</button>
            <button id="submit-btn" class="btn-primary">Submit</button>
          </div>
        </div>
        <div id="hints-used-label"></div>
      </div>

      <!-- Build Map -->
      <div id="build-map-section">
        <div id="build-map-header">Build Map</div>
        <div id="build-map-progress-label"></div>
        <ul id="build-map-list"></ul>
      </div>

      <!-- Badges -->
      <div id="badges-section" class="hidden">
        <div id="badges-header">Badges</div>
        <div id="badges-list"></div>
      </div>

      <!-- Streak -->
      <div id="streak-section">
        <span id="streak-icon">🔥</span>
        <span id="streak-label"></span>
      </div>
    </div>
  </div>

  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
