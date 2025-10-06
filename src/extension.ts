import * as vscode from 'vscode';
import { Planner } from './planner';
export function activate(context: vscode.ExtensionContext) {
    console.log('✅ Traycer extension activated');
    vscode.window.showInformationMessage('✅ Traycer extension activated');
  
    let disposable = vscode.commands.registerCommand(
      'traycer-creative.openPlanner',
      () => {
        console.log('🟢 traycer-creative.openPlanner triggered');
        vscode.window.showInformationMessage('🟢 Planner command triggered');
        const planner = new Planner(context);
        planner.showCreativePlanner();
      }
    );
  
    context.subscriptions.push(disposable);
  }
  
  export function deactivate() {
    console.log('🔧 Traycer extension: deactivate() called');
  }
