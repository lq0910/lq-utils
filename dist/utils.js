"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpJsonClient = (function () {
    function HttpJsonClient() {
        this.get_options = {
            method: 'GET',
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'Accept': 'application/json',
                'X-Requested-With': 'Fetch'
            },
            credentials: 'include'
        };
    }
    HttpJsonClient.prototype.http_get = function (url) {
        var _this = this;
        return fetch(url, this.get_options).then(function (response) {
            if (response.ok) {
                return response.json().then(function (res) {
                    return res;
                }).catch(function () {
                    Promise.resolve(null);
                });
            }
            else if (response.status == 401) {
                if (_this.auth_faild) {
                    _this.auth_faild(url);
                }
                Promise.reject(403);
            }
            else if (response.status == 200) {
                console.log("正确返回");
                Promise.resolve(null);
            }
            else {
                Promise.reject("服务器错误：" + response.status + "," + response.statusText);
            }
        });
    };
    HttpJsonClient.prototype.http_post = function (url, body) {
        return this.do_http_post(url, body);
    };
    HttpJsonClient.prototype.http_search = function (url, body) {
        return this.do_http_post(url, body);
    };
    HttpJsonClient.prototype.http_post_form = function (url, formData) {
        var form_options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: formData
        };
        return fetch(url, form_options).then(function (response) {
            if (response.ok) {
                return response.json();
            }
            else if (response.status == 403) {
                Promise.reject("权限不够或登陆超时！");
            }
            else if (response.status == 0) {
                console.log("文件上传总是0");
                Promise.resolve();
            }
            else {
                Promise.reject("服务器错误：" + response.status + "," + response.statusText);
            }
        });
    };
    HttpJsonClient.prototype.do_http_post = function (url, body) {
        var b;
        if ((typeof body) == "string") {
            b = body;
        }
        else {
            b = JSON.stringify(body);
        }
        var options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'Accept': 'application/json',
                'X-Requested-With': 'Fetch'
            },
            credentials: 'include',
            body: b
        };
        return fetch(url, options).then(function (response) {
            if (response.ok) {
                console.log("HTTP POST SUCCESS:");
                return response.json();
            }
            else if (response.status == 403) {
                Promise.reject("权限不够或登陆超时！");
            }
            else {
                Promise.reject("服务器错误：" + response.status + "," + response.statusText);
            }
        });
    };
    return HttpJsonClient;
}());
exports.HttpJsonClient = HttpJsonClient;
var Counter = (function () {
    function Counter() {
        var _this = this;
        this.is_counting = false;
        this.count = 0;
        this.handler = function () {
            console.log("counting..." + _this.count);
            if (_this.count > 0) {
                _this.count -= 1;
            }
            else {
                clearInterval(_this.timer);
                _this.count = 0;
                _this.is_counting = false;
            }
        };
    }
    Counter.prototype.start = function (seconds) {
        console.log("count from:" + seconds);
        this.count = seconds;
        this.is_counting = true;
        this.timer = setInterval(this.handler, 1000);
    };
    return Counter;
}());
exports.Counter = Counter;
var OperationStatus = (function () {
    function OperationStatus() {
    }
    return OperationStatus;
}());
exports.OperationStatus = OperationStatus;
var DateUtils = (function () {
    function DateUtils() {
    }
    DateUtils.getMonday = function (d) {
        var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };
    DateUtils.getTodayStart = function () {
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    };
    DateUtils.getYesterdayStart = function () {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        d.setHours(0, 0, 0, 0);
        return d;
    };
    DateUtils.getLastMonthStart = function () {
        var d = new Date();
        return new Date(d.getFullYear(), d.getMonth() - 1, 1);
    };
    DateUtils.getThisMonthStart = function () {
        var d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    };
    DateUtils.getFirstDayOfMonth = function (date) {
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        return firstDay;
    };
    DateUtils.format_with_dash = function (date) {
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        return [date.getFullYear(), "-",
            (mm > 9 ? '' : '0') + mm, "-",
            (dd > 9 ? '' : '0') + dd
        ].join('');
    };
    DateUtils.addDays = function (date, days) {
        var dat = new Date(date.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };
    return DateUtils;
}());
exports.DateUtils = DateUtils;
var Utils = (function () {
    function Utils() {
    }
    Object.defineProperty(Utils, "Cache", {
        get: function () {
            return Utils._cache;
        },
        enumerable: true,
        configurable: true
    });
    Utils.copy_object = function (a, b) {
        for (var prop in a) {
            b[prop] = a[prop];
        }
        return b;
    };
    Utils.removeArrayItem = function (arr, item) {
        var index = arr.indexOf(item);
        if (index >= 0) {
            arr.splice(index, 1);
        }
    };
    Utils.removeFromArray = function (arr, func) {
        var item = arr.filter(func);
        if (item.length > 0) {
            item.forEach(function (v) {
                var index = arr.indexOf(v);
                console.log(index);
                if (index >= 0) {
                    arr.splice(index, 1);
                }
            });
        }
    };
    Utils.triger_change = function (el, change) {
        document.querySelector(el).addEventListener('change', function (event) {
            var changeEvent;
            console.log("change date...");
            if (event.originalEvent) {
                return;
            }
            if (window.CustomEvent) {
                changeEvent = new CustomEvent('change', {
                    detail: {
                        value: event.target.value
                    },
                    bubbles: true
                });
            }
            else {
                changeEvent = document.createEvent('CustomEvent');
                changeEvent.initCustomEvent('change', true, true, {
                    detail: {
                        value: event.target.value
                    }
                });
            }
            event.target.dispatchEvent(changeEvent);
            console.log('changeEvent......');
            change();
        });
    };
    Utils.upDigit = function (n) {
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
    };
    Utils.format_date = function (d) {
        var newdate = new Date(d);
        return newdate.toLocaleDateString("zh-CN");
    };
    Utils.replace = function (str, obj) {
        return str.replace(/\{([^{}]+)\}/g, function (match, key) {
            var ret;
            if (Utils.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    var v = obj[i][key];
                    if (v !== undefined) {
                        if (v != null) {
                            ret = '' + v;
                        }
                        else {
                            ret = '';
                        }
                        break;
                    }
                    else {
                        ret = '{' + key + '}';
                    }
                }
            }
            else {
                var v2 = obj[key];
                ret = (v2 !== undefined) ? '' + v2 : '{' + key + '}';
            }
            return ret;
        });
    };
    Utils.toMoneyString = function (money) {
        return '¥' + money.toFixed(2);
    };
    Utils.replaceOne = function (str, obj) {
        return str.replace(/\{([^{}]+)\}/g, function (match, key) {
            var value = obj[key];
            console.log(key);
            return (value !== undefined) ? '' + value : '{' + key + '}';
        });
    };
    Utils.urlToObject = function () {
        var url = window.location.toString();
        var paramsString = url.substring(url.indexOf("?") + 1, url.length);
        return Utils.queryToObject(paramsString);
    };
    Utils.queryToObject = function (str) {
        var dec = decodeURIComponent, qp = str.split("&"), ret = {}, name, val;
        for (var i = 0, l = qp.length, item; i < l; ++i) {
            item = qp[i];
            if (item.length) {
                var s = item.indexOf("=");
                if (s < 0) {
                    name = dec(item);
                    val = "";
                }
                else {
                    name = dec(item.slice(0, s));
                    val = dec(item.slice(s + 1));
                }
                if (typeof ret[name] == "string") {
                    ret[name] = [ret[name]];
                }
                if (this.isArray(ret[name])) {
                    ret[name].push(val);
                }
                else {
                    if (val == "true") {
                        val = true;
                    }
                    else if (val == "false") {
                        val = false;
                    }
                    ret[name] = val;
                }
            }
        }
        return ret;
    };
    Utils.isArray = function (o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };
    Utils.formatPassTime = function (startTime) {
        var currentTime = Date.parse(new Date().toString()), time = currentTime - startTime, day = parseInt(time / (1000 * 60 * 60 * 24) + ''), hour = parseInt(time / (1000 * 60 * 60) + ''), min = parseInt(time / (1000 * 60) + ''), month = parseInt(day / 30 + ''), year = parseInt(month / 12 + '');
        if (year)
            return year + "年前";
        if (month)
            return month + "个月前";
        if (day)
            return day + "天前";
        if (hour)
            return hour + "小时前";
        if (min)
            return min + "分钟前";
        else
            return '刚刚';
    };
    Utils.prototype.collapsible = function (n) {
        var eleMore = document.getElementById(n);
        if (eleMore.style.display == "none") {
            eleMore.style.display = 'block';
        }
        else {
            eleMore.style.display = 'none';
        }
        return;
    };
    Utils.prototype.resizeImage = function (settings) {
        var file = settings.file;
        var maxSize = settings.maxSize;
        var reader = new FileReader();
        var image = new Image();
        var canvas = document.createElement('canvas');
        var dataURItoBlob = function (dataURI) {
            var bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
                atob(dataURI.split(',')[1]) :
                unescape(dataURI.split(',')[1]);
            var mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var max = bytes.length;
            var ia = new Uint8Array(max);
            for (var i = 0; i < max; i++)
                ia[i] = bytes.charCodeAt(i);
            return new Blob([ia], { type: mime });
        };
        var resize = function () {
            var width = image.width;
            var height = image.height;
            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            }
            else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(image, 0, 0, width, height);
            var dataUrl = canvas.toDataURL('image/jpeg');
            return dataURItoBlob(dataUrl);
        };
        return new Promise(function (ok, no) {
            if (!file.type.match(/image.*/)) {
                no(new Error("Not an image"));
                return;
            }
            reader.onload = function (readerEvent) {
                image.onload = function () { return ok(resize()); };
                image.src = readerEvent.target.result;
            };
            reader.readAsDataURL(file);
        });
    };
    Utils.checkIdcard = function (code) {
        var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
        var tip = "";
        var pass = true;
        if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
            tip = "身份证号格式错误";
            pass = false;
        }
        else if (!city[code.substr(0, 2)]) {
            tip = "身份证号有误";
            pass = false;
        }
        else {
            if (code.length == 18) {
                code = code.split('');
                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
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
                    tip = "身份证号有误";
                    pass = false;
                }
            }
        }
        if (!pass)
            alert(tip);
        return pass;
    };
    Utils.prototype.formatDate = function (val, pattern) {
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
    };
    Utils.countDown = function (end_) {
        var MSG = '已过期';
        var start = new Date();
        var end = new Date(end_);
        var result = parseInt((end.getTime() - start.getTime()) / 1000 + '');
        var d = parseInt(result / (24 * 60 * 60) + '');
        var h = parseInt(result / (60 * 60) % 24 + '');
        var m = parseInt(result / 60 % 60 + '');
        var s = parseInt(result % 60 + '');
        setTimeout(this.countDown, 500);
        if (result <= 0) {
            return MSG;
        }
        return d + '天' + h + '时' + m + '分' + s + '秒';
    };
    Utils._cache = new Map();
    return Utils;
}());
exports.Utils = Utils;
