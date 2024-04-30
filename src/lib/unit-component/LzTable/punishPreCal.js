let _res;
let loopCal = (bol, counter, result) => {
    let nCounter = {
        p: counter.p,
        j: counter.j,
        x: counter.x,
        d: counter.d,
    }
    let res = result;
    let b = bol;
    if (counter.p === 2) {
        nCounter.p = 0;
        nCounter.j = nCounter.j + 1;
        res = '生成一条警告';
    } else if (counter.j === 3) {
        nCounter.j = 0;
        nCounter.x = nCounter.x + 1;
        res = '生成一条小过';
    } else if ((counter.j === 2) && (counter.x === 1)) {
        nCounter.x = 0;
        nCounter.j = 0;
        nCounter.d = nCounter.d + 1;
        res = '生成一条大过'
    } else if (counter.x === 2) {
        nCounter.x = 0;
        nCounter.d = nCounter.d + 1;
        res = '生成一条大过'
    } else if (counter.d === 2) {
        res = '生成一条特别重大违纪';
        b = true;
    } else if (counter.d === 1 && counter.x != 0) {
        res = '生成一条特别重大违纪';
        b = true;
    } else {
        b = true
    }
    if (!b) {
        loopCal(b, nCounter, res);
    } else {
        _res = res
        return res
    }
}
let punishPreCal = (arr, type) => {
    let a = arr;
    let counter = {
        p: 0,
        j: 0,
        x: 0,
        d: 0
    };
    if (type === '绩效处分') {
        counter.p = counter.p + 1;
    } else if (type === '警告') {
        counter.j = counter.j + 1;
    } else if (type === '小过') {
        counter.x = counter.x + 1;
    } else if (type === '大过') {
        counter.d = counter.d + 1;
    }
    //计算初始各类处分数量
    for (let i = 0; i < a.length; i++) {
        if (arr[i].C3_590512169985 === '绩效处分') {
            counter.p = counter.p + 1;
        } else if (arr[i].C3_590512169985 === '警告') {
            counter.j = counter.j + 1;
        } else if (arr[i].C3_590512169985 === '小过') {
            counter.x = counter.x + 1;
        } else if (arr[i].C3_590512169985 === '大过') {
            counter.d = counter.d + 1;
        }
    }
    console.log(a, counter)
    //循环计算升级
    let res = loopCal(false, counter, _res);
    if (_res) {
        let result = arr[0].C3_590510740042 + '(' + arr[0].C3_590510737521 + ')将' + _res + '记录,是否继续提交？';
        return result;
    } else {
        return false;
    }
}
export default punishPreCal;