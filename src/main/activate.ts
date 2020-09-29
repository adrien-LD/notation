import { S_IFIFO } from 'constants';
import * as vscode from 'vscode';

/**
 * 转换输出注释字符串
 * @param {vscode.TextEditor} textEditor
 */
function getNotationString(textEditor: vscode.TextEditor): string {
  // 获取光标所在行
  const document: vscode.TextDocument = textEditor.document;
  const selection: vscode.Selection = textEditor.selection;
  const line: number = selection.start.line;
  // 循环得到从光标开始往下每一行的代码，直到})结束
  let count: number = 0;
  let lintText: string = '';
  while (!lintText.includes('})')) {
    count += 2;
    const startPosition: vscode.Position = new vscode.Position(line, 0);
    const endPosition: vscode.Position = new vscode.Position(line + count, 0);
    // 得到该行文本
    lintText = document.getText(new vscode.Range(startPosition, endPosition));
  }
  // 得到最终需要的文本
  const startPosition: vscode.Position = new vscode.Position(line, 0);
  const endPosition: vscode.Position = new vscode.Position(line + count, 0);
  const finalText: string = document.getText(
    new vscode.Range(startPosition, endPosition)
  );

  const strArray = finalText.match(/\(\{([\s\S]*)\}\)/);
  if (strArray !== null) {
    const str: string = strArray[1];
    const finalStr: string = str.replace(/[(\r\n)|(\n)|(\s)]*/gm, '');
    const finalArray: Array<string> = finalStr.split(',');
    let finalArr: Array<string> = [];
    let other: string = '';
    // 格式化得到最后输出的字符串
    for (let i = 0; i < finalArray.length; i++) {
      if (finalArray[i] !== '') {
        if (finalArray[i].includes('...')) {
          other = `{[other:string]: any}`;
        } else if (finalArray[i].includes('=')) {
          const key: string = finalArray[i].split('=')[0];
          finalArr.push(` * ${key}: any`);
        } else {
          finalArr.push(` * ${finalArray[i]}: any`);
        }
      }
    }
    return `
/**
 * @param {{
${finalArr.join('\n')}
 * }${other === '' ? '' : ` | ${other}`}} prop
 *
 */`;
  }
  return '';
}

// 插件被激活时触发，是所有代码的总入口
export default function activate(context: vscode.ExtensionContext) {
  // 注册命令
  let disposable = vscode.commands.registerTextEditorCommand(
    'notation.insertNotation',
    async (textEditor: vscode.TextEditor) => {
      // 得到注释字符串
      const notationText: string = await getNotationString(textEditor);
      // 将字符串插入光标所在位置
      const snippetString = new vscode.SnippetString(notationText);
      textEditor.insertSnippet(snippetString);
    }
  );

  context.subscriptions.push(disposable);
}
