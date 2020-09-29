import * as vscode from 'vscode';

export default function getFoucsLineNumber(textEditor: vscode.TextEditor): number {
 // 获取光标所在行
  const selection: vscode.Selection = textEditor.selection;
  const line: number = selection.start.line;
  return line;
}