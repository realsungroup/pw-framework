import {
  getCmsWhere,
  getResid,
  paa,
  downloadFile,
  isDateString
} from '../util';

describe('util', () => {
  // getResid
  it('getResid() 不传参数时', () => {
    expect(getResid()).toBe(undefined);
  });
  it('getResid() dataMode 为 main 时', () => {
    expect(getResid('main', 111, 222)).toBe(111);
  });
  it('getResid() dataMode 为 sub 时', () => {
    expect(getResid('sub', 111, 222)).toBe(222);
  });

  // getCmsWhere
  it('getCmsWhere() 不传参数时', () => {
    expect(getCmsWhere()).toBe('');
  });
  it('getCmsWhere() 参数为字符串数组时', () => {
    expect(getCmsWhere('name = xl', 'age = 22')).toBe('name = xl and age = 22');
  });
  it('getCmsWhere() 参数为一个对象时', () => {
    expect(getCmsWhere({ name: 'xl', age: 22, sex: 1 })).toBe(
      "name = 'xl' and age = '22' and sex = '1'"
    );
  });

  // paa
  const fnArr = [
    () => {
      const condition = true;
      if (condition) {
        return true;
      }
    },
    () => {
      const condition = false;
      if (condition) {
        return true;
      }
    }
  ];
  it('paa() 第一个参数为空数组，第二个参数 isExecute 为 false 时', () => {
    const ret = paa([], false);
    expect(ret).toEqual([]);
  });
  it('paa() 第一个参数为非空数组， isExecute 为 false 时', () => {
    const ret = paa(fnArr, false);
    expect(ret).toEqual([true, undefined]);
  });
  it('paa() 第一个参数为非空数组， isExecute 为 true 时', () => {
    const ret = paa(fnArr, true);
    return ret.then(data => {
      expect(data).toEqual([true, undefined]);
    });
  });

  // downloadFile
  it('downloadFile()', () => {
    const href = 'http://localhost:3000';
    const fileName = 'fileName';
    expect(downloadFile(href, fileName)).toEqual(undefined);
  });

  // isDateString
  it("isDateString() 参数为 '2014-2-2' 时", () => {
    expect(isDateString('2014-2-2')).toEqual(true);
  });
  it("isDateString() 参数为 '2014-02-02' 时", () => {
    expect(isDateString('2014-02-02')).toEqual(true);
  });
  it("isDateString() 参数为 '2014-02-02 14:02:02' 时", () => {
    expect(isDateString('2014-02-02 14:02:02')).toEqual(true);
  });
  it("isDateString() 参数为 'xxxx'", () => {
    expect(isDateString('xxxx')).toEqual(false);
  });
});
