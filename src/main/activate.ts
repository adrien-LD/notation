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
  console.log(count);
  // 得到最终需要的文本
   const startPosition: vscode.Position = new vscode.Position(line, 0);
   const endPosition: vscode.Position = new vscode.Position(line + count, 0);
   const finalText: string = document.getText(new vscode.Range(startPosition, endPosition));

   const strArray: RegExpMatchArray | null = finalText.match(/\(\{([\s\S]*)\}\)/);
   const str:string = strArray[1]; 
   const finalStr:string = str.replace(/[(\r\n)|(\n)|(\s)]*/gm, '');
   console.log(finalStr);
   const finalArray: Array<string> = finalStr.split(',');
   console.log(finalArray);
  return `
/**
 * @param {{
 ${finalArray.forEach((item) => '* ${item}: any')}
 * }}
 *
 */`;
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
