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
    Utils.triger_change = function (el) {
        $(el).on('change', function (event) {
            var changeEvent;
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
    Utils.init_drop = function () {
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrainWidth: false,
            hover: false,
            gutter: 0,
            belowOrigin: true,
            alignment: 'left',
            stopPropagation: false
        });
    };
    Utils.init_input = function () {
        var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';
        setTimeout(function () {
            $(input_selector).each(function (index, element) {
                if ($(element).val().length > 0 || element.autofocus || $(this).attr('placeholder') !== undefined || $(element)[0].validity.badInput === true) {
                    $(this).siblings('label').addClass('active');
                }
                else {
                    $(this).siblings('label').removeClass('active');
                }
            });
        }, 100);
    };
    Utils.init_datepicker = function () {
        $('.datepicker').pickadate({
            selectMonths: false,
            selectYears: 15,
            format: 'yyyy/mm/dd',
            weekdaysLetter: ['日', '一', '二', '三', '四', '五', '六'],
            today: '今天',
            clear: '清除',
            close: '关闭',
            monthsFull: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            weekdaysFull: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        });
    };
    Utils._cache = new Map();
    return Utils;
}());
exports.Utils = Utils;
