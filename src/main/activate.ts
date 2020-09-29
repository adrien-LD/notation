import * as vscode from 'vscode';
import getFormatField from './getFormatField';
import getFoucsLineNumber from './getFoucsLineNumber';
import getParams from './getParams';

/**
 * 转换输出注释字符串
 * @param {vscode.TextEditor} textEditor
 */
function getNotationString(textEditor: vscode.TextEditor): string {
  // 获取光标所在行
  const document: vscode.TextDocument = textEditor.document;
  const line = getFoucsLineNumber(textEditor);
  // 截取到函数的参数

  const finalArray = getParams(document, line);
  
  if (finalArray.length) {
   const { finalArr, other} = getFormatField(finalArray);
    return `
/**
 * @param {object} props
${finalArr.join('\n')}
${other}
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
