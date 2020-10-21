interface Param {
  name: string;
  type: string;
  defaultValue?: string;
}

// 根据参数的默认值推算类型
export function inferredTypeOfDefaultValue(
  param: string,
  defaultValue: string
): Param {
  let type = 'any';

  if (defaultValue === 'true' || defaultValue === 'false') {
    type = 'boolean';
  } else if (defaultValue.includes('{') && defaultValue.includes('}')) {
    type = 'object';
  } else if (/'(\S*)'/.test(defaultValue)) {
    type = 'string';
  }

  // 如果通过默认值没能推算出类型，再调用一次使用参数名判断
  if (type === 'any') {
    const { type: typeCopy } = inferredTypeOfParamName(param);
    type = typeCopy;
  }
  return {
    type,
    defaultValue,
    name: param,
  };
}

// 根据参数名字推算类型
export function inferredTypeOfParamName(param: string): Param {
  let type = 'any';

  // 如果是on开头的参数 判断为函数，直接返回
  if (/^on[.*]/.test(param)) {
    type = 'function';
  } else if (/^is[.*]/.test(param)) {
    type = 'boolean';
  } else if (param === 'children') {
    type = 'ReactNode';
  } else if (param.toLowerCase() === 'classname') {
    type = 'string';
  }

  return {
    type,
    name: param,
  };
}
