import { inferredTypeOfDefaultValue, inferredTypeOfParamName } from "./inferrType";

interface FormatField {
  other: string;
  finalArr: string[];
}

export default function getFormatField(finalArray: string[]): FormatField {
  let finalArr: Array<string> = [];
  let other: string = '';
  // 格式化得到最后输出的字符串
  for (let i = 0; i < finalArray.length; i++) {
    if (finalArray[i] !== '') {
      if (finalArray[i].includes('...')) {
        const str: string = finalArray[i].replace(/.../, '');
        other = `{[other:string]: any}`;
      } else if (finalArray[i].includes('=')) {
        const [param, value] = finalArray[i].split('=');
        let { name, type, defaultValue = '' } = inferredTypeOfDefaultValue(
          param,
          value
        );
        finalArr.push(` * ${name}?: ${type}`);
      } else {
        const { name, type } = inferredTypeOfParamName(finalArray[i]);
        finalArr.push(` * ${name}: ${type}`);
      }
    }
  }

  return { other, finalArr };
}