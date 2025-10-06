// src/planner.ts
import * as vscode from 'vscode';
import * as path from 'path';
import { AgentSimulator } from './agent';

export class Planner {
  private context: vscode.ExtensionContext;
  private panel?: vscode.WebviewPanel;
  private agents: AgentSimulator[] = [];

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.agents = [
      new AgentSimulator('CodeGen'),
      new AgentSimulator('Tester'),
      new AgentSimulator('Shell'),
    ];
  }

  public showCreativePlanner() {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.One);
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      'traycerCreative',
      'Traycer — Creative Planner',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this.context.extensionPath, 'webview-src')),
        ],
      }
    );

    this.panel.webview.html = this.getWebviewHtml(this.panel.webview);

    // After loading HTML, send restore state if exists
    const saved = this.context.globalState.get<any>('traycerPlannerState');
    if (saved) {
      this.panel.webview.postMessage({ type: 'restoreState', state: saved });
    }

    if (!(this.panel.webview as any).__messageHandlerRegistered) {
      this.panel.webview.onDidReceiveMessage(async (msg: { type: string; [key: string]: any }) => {
        switch (msg.type) {
          case 'requestAgents':
            this.panel?.webview.postMessage({
              type: 'agents',
              agents: this.agents.map((a) => a.serialize()),
            });
            break;

          case 'planAndRun': {
            const goal: string = msg.goal;
            const plan = this.createPlanFromGoal(goal);
            this.panel?.webview.postMessage({ type: 'planCreated', plan });
            await this.dispatchPlan(plan);
            break;
          }

          case 'runTask': {
            const task = msg.task;
            const agentId = msg.agentId;
            const agent = this.agents.find((a) => a.id === agentId);
            if (agent) {
              this.panel?.webview.postMessage({ type: 'taskStarted', task, agentId });
              const res = await agent.executeStep(task);
              this.panel?.webview.postMessage({
                type: 'taskFinished',
                task,
                result: res,
                agentId,
              });
            }
            break;
          }


          case 'saveState': {
            // msg.state is a JSON object from webview
            this.context.globalState.update('traycerPlannerState', msg.state);
            break;
          }
        }
      });

      (this.panel.webview as any).__messageHandlerRegistered = true;
    }

    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });
  }

  private getWebviewHtml(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'webview-src', 'index.js')
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'webview-src', 'webview.css')
    );

    const csp = `
      default-src 'none';
      img-src ${webview.cspSource} https:;
      script-src ${webview.cspSource};
      style-src ${webview.cspSource} 'unsafe-inline';
    `;

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="Content-Security-Policy" content="${csp}" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Traycer Creative Planner</title>
          <link rel="stylesheet" href="${styleUri}" />
        </head>
        <body>
          <div id="root"></div>
          <script src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }

  private createPlanFromGoal(goal: string): string[] {
    return [
      `Analyze goal: ${goal}`,
      `Generate code stubs`,
      `Run tests`,
      `Summarize results`,
    ];
  }

  private async dispatchPlan(plan: string[]) {
  for (const step of plan) {
    const agent = this.agents[Math.floor(Math.random() * this.agents.length)];
    this.panel?.webview.postMessage({ type: 'taskStarted', task: step, agentId: agent.id });
    const res = await agent.executeStep(step);
    this.panel?.webview.postMessage({
      type: 'taskFinished',
      task: step,
      result: res,
      agentId: agent.id,
    });
  }
  this.panel?.webview.postMessage({ type: 'allDone' });
}

}
