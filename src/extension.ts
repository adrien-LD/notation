import * as vscode from 'vscode';

// 插件被激活时触发，是所有代码的总入口
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "notation" is now active!');

  // 注册命令
	let disposable = vscode.commands.registerCommand('notation.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from notation!');
	});

	context.subscriptions.push(disposable);
}

// 插件被释放时触发
export function deactivate() {}
