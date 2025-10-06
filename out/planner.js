"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Planner = void 0;
// src/planner.ts
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const agent_1 = require("./agent");
class Planner {
    constructor(context) {
        this.agents = [];
        this.context = context;
        this.agents = [
            new agent_1.AgentSimulator('CodeGen'),
            new agent_1.AgentSimulator('Tester'),
            new agent_1.AgentSimulator('Shell'),
        ];
    }
    showCreativePlanner() {
        if (this.panel) {
            this.panel.reveal(vscode.ViewColumn.One);
            return;
        }
        this.panel = vscode.window.createWebviewPanel('traycerCreative', 'Traycer — Creative Planner', vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(this.context.extensionPath, 'webview-src')),
            ],
        });
        this.panel.webview.html = this.getWebviewHtml(this.panel.webview);
        // After loading HTML, send restore state if exists
        const saved = this.context.globalState.get('traycerPlannerState');
        if (saved) {
            this.panel.webview.postMessage({ type: 'restoreState', state: saved });
        }
        if (!this.panel.webview.__messageHandlerRegistered) {
            this.panel.webview.onDidReceiveMessage(async (msg) => {
                switch (msg.type) {
                    case 'requestAgents':
                        this.panel?.webview.postMessage({
                            type: 'agents',
                            agents: this.agents.map((a) => a.serialize()),
                        });
                        break;
                    case 'planAndRun': {
                        const goal = msg.goal;
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
            this.panel.webview.__messageHandlerRegistered = true;
        }
        this.panel.onDidDispose(() => {
            this.panel = undefined;
        });
    }
    getWebviewHtml(webview) {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'webview-src', 'index.js'));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'webview-src', 'webview.css'));
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
    createPlanFromGoal(goal) {
        return [
            `Analyze goal: ${goal}`,
            `Generate code stubs`,
            `Run tests`,
            `Summarize results`,
        ];
    }
    async dispatchPlan(plan) {
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
exports.Planner = Planner;
//# sourceMappingURL=planner.js.map