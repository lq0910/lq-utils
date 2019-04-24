declare var fetch
declare var window
export class HttpJsonClient {
    auth_faild: any;
    private get_options = {
        method: 'GET',
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
            'X-Requested-With': 'Fetch'
        },
        credentials: 'include'
    }
    http_get(url): Promise<any> {
        return fetch(url, this.get_options).then(
            (response: Response) => {
                if (response.ok) {
                    // console.log("HTTP GET SUCCESS:")
                    return response.json().then(
                        (res) => {
                            return res;
                        }
                    ).catch(() => {
                        Promise.resolve(null)
                    })
                } else if (response.status == 401) {
                    if (this.auth_faild) {
                        this.auth_faild(url)
                    }
                    Promise.reject(403)
                } else if (response.status == 200) {
                    console.log("正确返回");

                    Promise.resolve(null)
                } else {
                    Promise.reject("服务器错误：" + response.status + "," + response.statusText)
                }
            });
    }
    http_post(url: string, body): Promise<OperationStatus> {
        return this.do_http_post(url, body)
    }
    http_search(url: string, body): Promise<any> {
        return this.do_http_post(url, body)
    }
    http_post_form(url: string, formData): Promise<OperationStatus> {
        var form_options = {
            //mode: 'no-cors',//会导致出现status：0的问题。
            method: 'POST',
            headers: {
                'Accept': 'application/json'
                //不能加ContentType，否则出现错误 Missing boundary in multipart/form-data POST
            },
            credentials: 'include',
            body: formData
        }
        return fetch(url, form_options).then(
            (response: Response) => {
                if (response.ok) {
                    // console.log("HTTP POST SUCCESS:")
                    return response.json()

                } else if (response.status == 403) {
                    Promise.reject("权限不够或登陆超时！")
                } else if (response.status == 0) {
                    console.log("文件上传总是0");
                    Promise.resolve()
                    //return response.json()
                } else {
                    Promise.reject("服务器错误：" + response.status + "," + response.statusText)
                }

            });
    }
    private do_http_post(url: string, body): Promise<any> {
        let b;
        if ((typeof body) == "string") {
            b = body;
        } else {
            b = JSON.stringify(body)
        }
        let options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'Accept': 'application/json',
                'X-Requested-With': 'Fetch'
            },
            credentials: 'include',
            body: b
        }
        return fetch(url, options).then(
            (response: Response) => {
                if (response.ok) {
                    console.log("HTTP POST SUCCESS:")
                    return response.json()

                } else if (response.status == 403) {
                    Promise.reject("权限不够或登陆超时！")
                } else {
                    Promise.reject("服务器错误：" + response.status + "," + response.statusText)
                }

            });
    }
}
export class Counter {
    is_counting: boolean = false;
    count: number = 0;
    private timer: any;
    start(seconds: number) {
        console.log("count from:" + seconds);

        this.count = seconds;
        this.is_counting = true;
        this.timer = setInterval(this.handler, 1000)
    }
    private handler = () => {
        console.log("counting..." + this.count);

        if (this.count > 0) {
            this.count -= 1;
        } else {
            clearInterval(this.timer)
            this.count = 0
            this.is_counting = false
        }
    }
}


export class OperationStatus {
    ok: boolean;
    msg: string;
    handled: boolean;
    payload: any;
}

export class DateUtils {
    static getMonday(d: Date) {

        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));

    }
    static getTodayStart() {
        let d = new Date()
        d.setHours(0, 0, 0, 0)
        return d;
    }
    static getYesterdayStart() {
        let d = new Date()
        d.setDate(d.getDate() - 1);
        d.setHours(0, 0, 0, 0)

        return d;
    }
    static getLastMonthStart() {
        let d = new Date()
        return new Date(d.getFullYear(), d.getMonth() - 1, 1);

    }
    static getThisMonthStart() {
        let d = new Date()
        return new Date(d.getFullYear(), d.getMonth(), 1);

    }
    static getFirstDayOfMonth(date: Date) {

        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        return firstDay;
    }
    static format_with_dash(date: Date): string {
        var mm = date.getMonth() + 1; // getMonth() is zero-based
        var dd = date.getDate();

        return [date.getFullYear(), "-",
        (mm > 9 ? '' : '0') + mm, "-",
        (dd > 9 ? '' : '0') + dd
        ].join('');
    }
    static addDays(date: Date, days: number) {
        let dat = new Date(date.valueOf());
        dat.setDate(dat.getDate() + days);

        return dat;
    }

}
export class Utils {

    private static _cache: Map<string, any> = new Map<string, any>();
    public static get Cache() {
        return Utils._cache;
    }
    /**
     * 拷贝对象
     * @param a 源对象
     * @param b 目标对象
     */
    static copy_object(a, b) {

        for (var prop in a) {
            b[prop] = a[prop];
        }
        return b;
    }
    static removeArrayItem(arr: Array<any>, item: any) {
        let index = arr.indexOf(item)
        if (index >= 0) {
            arr.splice(index, 1)
        }
    }
    static removeFromArray(arr: Array<any>, func: any) {
        let item: Array<any> = arr.filter(func)
        if (item.length > 0) {
            item.forEach(
                v => {
                    let index = arr.indexOf(v)
                    console.log(index);

                    if (index >= 0) {
                        arr.splice(index, 1)
                    }
                }
            )

        }


    }
    /**
     * 
     * @param el CSS选择器
     * @param change change回调
     */
    static triger_change(el: string, change: Function) {
        document.querySelector(el).addEventListener('change', (event: any) => {
            let changeEvent: any;
            console.log("change date...");

            if (event.originalEvent) { return; }
            if (window.CustomEvent) {
                changeEvent = new CustomEvent('change', {
                    detail: {
                        value: event.target.value
                    },
                    bubbles: true
                });
            } else {
                changeEvent = document.createEvent('CustomEvent');
                changeEvent.initCustomEvent('change', true, true, {
                    detail: {
                        value: event.target.value
                    }
                });
            }
            event.target.dispatchEvent(changeEvent);
            console.log('changeEvent......');
            change()
        })
    }
    static upDigit(n) {
        var fraction = ['角', '分'];
        var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
        var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
        var head = n < 0 ? '欠' : '';
        n = Math.abs(n);

        var s = '';

        for (var i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);

        for (var i = 0; i < unit[0].length && n > 0; i++) {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    }
    static format_date(d: number) {

        var newdate = new Date(d)
        return newdate.toLocaleDateString("zh-CN");
    }

    /**支持单个对象或对象数组的替换
    /* {}
    /*/
    static replace(str: string, obj: any): string {
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/replace
        return str.replace(/\{([^{}]+)\}/g, function (match, key) {

            var ret;
            if (Utils.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    var v = obj[i][key];
                    if (v !== undefined) {
                        //check null.
                        if (v != null) {
                            ret = '' + v;
                        } else {
                            ret = '';
                        }


                        break;
                    } else {
                        ret = '{' + key + '}';
                    }
                }
            } else {
                var v2 = obj[key];
                ret = (v2 !== undefined) ? '' + v2 : '{' + key + '}';
            }

            return ret;
        });
    }

    static toMoneyString(money: number) {
        return '¥' + money.toFixed(2);
    }
    static replaceOne(str: string, obj: any): string {
        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/replace
        return str.replace(/\{([^{}]+)\}/g, function (match, key) {
            var value = obj[key];
            console.log(key);
            return (value !== undefined) ? '' + value : '{' + key + '}';
        });
    }
    static urlToObject(): any {
        var url: string = window.location.toString();
        var paramsString: string = url.substring(url.indexOf("?") + 1, url.length);
        return Utils.queryToObject(paramsString);
    }
    static queryToObject(/*String*/ str: string): any {
        // summary:
        //		Create an object representing a de-serialized query section of a
        //		URL. Query keys with multiple values are returned in an array.
        //
        // example:
        //		This string:
        //
        //	|		"foo=bar&foo=baz&thinger=%20spaces%20=blah&zonk=blarg&"
        //
        //		results in this object structure:
        //
        //	|		{
        //	|			foo: [ "bar", "baz" ],
        //	|			thinger: " spaces =blah",
        //	|			zonk: "blarg"
        //	|		}
        //
        //		Note that spaces and other urlencoded entities are correctly
        //		handled.

        // FIXME: should we grab the URL string if we're not passed one?
        var dec = decodeURIComponent, qp = str.split("&"), ret = {}, name, val;
        for (var i = 0, l = qp.length, item; i < l; ++i) {
            item = qp[i];
            if (item.length) {
                var s = item.indexOf("=");
                if (s < 0) {
                    name = dec(item);
                    val = "";
                } else {
                    name = dec(item.slice(0, s));
                    val = dec(item.slice(s + 1));
                }
                if (typeof ret[name] == "string") { // inline'd type check

                    ret[name] = [ret[name]];
                }

                if (this.isArray(ret[name])) {
                    ret[name].push(val);
                } else {

                    if (val == "true") {
                        val = true;
                    } else if (val == "false") {
                        val = false;
                    }
                    ret[name] = val;
                }
            }
        }
        return ret;
    }
    static isArray(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    }
    /* formatPassTime */
    static formatPassTime(startTime) {
        var currentTime = Date.parse(new Date().toString()),
            time = currentTime - startTime,
            day = parseInt(time / (1000 * 60 * 60 * 24) + ''),
            hour = parseInt(time / (1000 * 60 * 60) + ''),
            min = parseInt(time / (1000 * 60) + ''),
            month = parseInt(day / 30 + ''),
            year = parseInt(month / 12 + '');
        if (year) return year + "年前"
        if (month) return month + "个月前"
        if (day) return day + "天前"
        if (hour) return hour + "小时前"
        if (min) return min + "分钟前"
        else return '刚刚'
    }
    /**
   * 
   * @param n: 列表id
   */
    collapsible(n: string) {

        var eleMore = document.getElementById(n);
        if (eleMore.style.display == "none") {
            eleMore.style.display = 'block';
        } else {
            eleMore.style.display = 'none';
        }
        return;
    }

    //图片压缩
    resizeImage(settings) {

        const file = settings.file;
        const maxSize = settings.maxSize;
        const reader = new FileReader();
        const image = new Image();
        const canvas = document.createElement('canvas');
        const dataURItoBlob = (dataURI: string) => {
            const bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
                atob(dataURI.split(',')[1]) :
                unescape(dataURI.split(',')[1]);
            const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
            const max = bytes.length;
            const ia = new Uint8Array(max);
            for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
            return new Blob([ia], { type: mime });
        };
        const resize = () => {
            let width = image.width;
            let height = image.height;

            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(image, 0, 0, width, height);
            let dataUrl = canvas.toDataURL('image/jpeg');
            return dataURItoBlob(dataUrl);
        };

        return new Promise((ok, no) => {
            if (!file.type.match(/image.*/)) {
                no(new Error("Not an image"));
                return;
            }

            reader.onload = (readerEvent: any) => {
                image.onload = () => ok(resize());
                image.src = readerEvent.target.result;
            };
            reader.readAsDataURL(file);
        })
    }

    /* 
     *身份证验证
     */
    static checkIdcard(code) {
        var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
        var tip = "";
        var pass = true;

        if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
            tip = "身份证号格式错误";
            pass = false;
        }

        else if (!city[code.substr(0, 2)]) {
            tip = "身份证号有误";//地址编码错误
            pass = false;
        }
        else {
            //18位身份证需要验证最后一位校验位
            if (code.length == 18) {
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                //校验位
                var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                parity[sum % 11];
                if (parity[sum % 11] != code[17]) {
                    tip = "身份证号有误";//校验位错误
                    pass = false;
                }
            }
        }
        if (!pass) alert(tip);
        return pass;
    }

    /**
    * 日期格式化
    * @param {*} value
    * @param {*} pattern
    * @returns
    * @memberof YmApp
    *  formatDate("2017-02-23 12:09:12", "ymd");  //17223
       formatDate("2017-02-23 12:09:12", "y年m月d日 h时i分s秒");  //17年2月23日 12时9分12秒
       formatDate("1398200549", "yy-mm-dd");  //2014-04-23
       formatDate("1398200549000", "y-m-d h:i:s");  //14-4-23 5:2:29
       formatDate("1398200549000", "yy-mm-dd hh:ii:ss");  //2014-04-23 05:02:29
       formatDate("1398200549000", "yy/mm/dd hh:i:s");  //2014/04/23 05:2:29
       formatDate("1398200549000", "yy年m月d日 h时i分s秒");  //2014年4月23日 5时2分29秒
    */
    formatDate(val: any, pattern: any) {
        var value = val.toString();
        var date = value.indexOf('-') >= 0 ? Date.parse(value) : value.length == 10 ? value * 1000 : value;
        date = new Date(parseInt(date));
        var YY = date.getFullYear();
        var y = YY.toString().substr(2);
        var m = date.getMonth() + 1;
        var MM = m < 10 ? '0' + m : m;
        var d = date.getDate();
        var DD = d < 10 ? '0' + d : d;
        var h = date.getHours();
        var HH = h < 10 ? '0' + h : h;
        var i = date.getMinutes();
        var II = i < 10 ? '0' + i : i;
        var s = date.getSeconds();
        var SS = s < 10 ? '0' + s : s;
        var newdate;

        newdate = pattern.replace(/yy/g, YY).replace(/y/g, y);
        newdate = newdate.replace(/mm/g, MM).replace(/m/g, m);
        newdate = newdate.replace(/dd/g, DD).replace(/d/g, d);
        newdate = newdate.replace(/hh/g, HH).replace(/h/g, h);
        newdate = newdate.replace(/ii/g, II).replace(/i/g, i);
        newdate = newdate.replace(/ss/g, SS).replace(/s/g, s);

        return newdate;
    }

}