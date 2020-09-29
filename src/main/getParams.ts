import * as vscode from 'vscode';

export default function getParams(
  document: vscode.TextDocument,
  line: number
): string[] {
  let lintText: string = '';

  // 通过循环逐行检测得到最终需要截取的部分行号
  let count: number = 0;
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

  //正则匹配得到参数部分
  const strArray: RegExpMatchArray | null = finalText.match(
    /\(\{([\s\S]*)\}\)/
  );
  if (strArray !== null) {
    const str: string = strArray[1];
    // 去除参数字符串种的换行、空格字符
    const finalStr: string = str.replace(/[(\r\n)|(\n)|(\s)]*/gm, '');
    const finalArray: Array<string> = finalStr.split(',');
    return finalArray;
  }
  return [];
}
