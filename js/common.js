//加快点击的相应速度
$(document).on('pagecreate', function(event) {
	FastClick.attach(document.body);
});
/*
 表单验证
 */
var fmReg = {
	// enName: /^([A-Za-z]{0,}\s{1}[A-Za-z]{0,})(\s{1}[A-Za-z]{0,})?/,//英文名称 最大长度为19位，超过19位取姓的全拼，名的首字母；需要大写
	enName: /^[A-Za-z]{0,}$/, //英文名称 最大长度为19位，超过19位取姓的全拼，名的首字母；需要大写
	mobile: /^1[0-9]{10}$/, //手机
	zipCode: /^\d{6}$/, //邮编 6位数字
	email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, //邮箱xx@xx.xxx
	tel: /^0[0-9]{2,3}-[1-9]\d{6,7}$/, //固定电话 区号以0开头的3或4位数字 电话非0开通的7或8位数字
	cerNo: /(^[1-9]\d{16}[X|x]$)|(^[1-9]\d{17}$)|(^[1-9]\d{14}$)/, //身份证号码15位非0开头纯数字或18位非0开头纯数字/非0开头+数字+X
	qitaCerNo: /^[0-9a-zA-Z]{1,20}$/, //证件号码只支持大小写字母和数字,且不多于20个！
	managerId: /^\d{8}$|^\d{10}$/, //客户经理号8或10
	managerId12: /^\d{12}$/, //客户经理号12
	pwD6: /^\d{6}$/, //密码\6位数字
	num: /^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/, //金额
	telQh: /^0[0-9]{2,3}$/, //固定电话 区号以0开头的3或4位数字 
	telHm: /^[1-9]\d{6,7}$/, //固定电话  电话非0开通的7或8位数字
	numSZ: /^[1-9]\d*$/, //数字
	eleNum: /^(([0-9]|([1-9][0-9]{0,5}))((\.[0-9]{1,2})?))$/, //电子签约金额
	loanNum: /^(([0-9]|([1-9][0-9]{0,10}))((\.[0-9]{1,2})?))$/, //贷款金额
	address: /^[a-zA-Z0-9\u4e00-\u9fa5\s#\-]*$/, //只能输入汉字字母空格
	cnName: /^[a-zA-Z\u4e00-\u9fa5]+$/, //只能输入汉字字母
	money: /^((\d{1,3}(,\d{3})*)|(\d+))(\.\d{1,2})?$/, //固定格式的金额 11，123.00
	pwd8: /^([a-z]|[A-Z]|[0-9]){6,10}$/,
	date: /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/, //date：yyyy-mm-dd
	time: /^(?:[01]\d|2[0-3])(?::[0-5]\d){2}$/, //时间 hh:ss:mm
	numZU: /^[0-9]+$/,
	loanTel: /^[0-9][0-9\-]{1,20}$/,
	income: /^[1-9]*[1-9][0-9]*$/
};
/*
 表单验证提示信息
 */
var fmRegMsg = {
	enName: '请输入正确格式的拼音', //英文名称
	mobile: '请输入正确格式的手机号码', //手机
	zipCode: '请输入正确格式的邮编', //邮编
	tel: '请输入正确格式的固定号码 如：区号-号码', //固定号码
	cerNo: '请输入正确格式的身份证号码', //身份证号码
	qitaCerNo: '证件号码只支持大小写字母和数字,且不多于20个！', //
	managerId: '请输入正确格式的经理号格式', //客户经理号8或10
	managerId12: '请输入正确格式的经理号格式', //客户经理号12
	pwD6: '请输入正确格式的密码', //密码\6位数字
	num: '请输入正确格式的金额', //金额
	email: '请输入正确格式的邮箱', //邮箱
	telQh: '请输入正确格式的区号', //固定电话 区号以0开头的3或4位数字 
	telHm: '请输入正确格式的固定号码', //固定电话  电话非0开通的7或8位数字
	numSZ: '请输入正确的次数', //数字
	address: '请输入正确格式的地址', //只能输入汉字字母空格
	cnName: '请输入正确格式的姓名', //只能输入汉字字母
	loanTel: '请输入正确格式的电话号码',
	numZU: '请输入正确格式的数字', //数字(可为0)
	income: '年收入应为整数' //年收入，只能是整数，不可为0
};
/*var regEnName=/^[A-Za-z\s]{1,}$/;//英文名称
 var regMobile=/^1[0-9]{10}$/;//手机
 var regZipCode=/^\d{6}$/;//邮编
 var regManagerId=/^\d{8}$|^\d{10}$/;//客户经理号
 var regManagerId12=/^\d{12}$/;//客户经理号
 var regPwD6=/^\d{6}$/;//密码\6位数字
 var regNum=/^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/;//金额
 var regEmail=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;//邮箱*/
//精确计算乘法
Math.mul = function(v1, v2) {
	var m = 0;
	var s1 = v1.toString();
	var s2 = v2.toString();
	try {
		m += s1.split(".")[1].length;
	} catch(e) {}
	try {
		m += s2.split(".")[1].length;
	} catch(e) {}

	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
Number.prototype.mul = function(v) {
	return Math.mul(v, this);
};

function decimal(num, v) {
	var vv = Math.pow(10, v);
	var nv = Math.round(num * vv) / vv + '';
	var l = nv.split(".")[0].split("").reverse();
	var t = "";
	var r = nv.split(".")[1];
	var ra = nv.split('');
	if(ra.length == '0') {
		r = '00'
	} else if(ra.length == '1') {
		r += '0';
	}
	for(var i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	var ret = t.split("").reverse().join("") + "." + r;
	if(ret == 0.00) ret = '';
	return ret;
}

function accMul(arg1, arg2) {
	var m = 0,
		s1 = arg1.toString(),
		s2 = arg2.toString();
	try {
		m += s1.split(".")[1].length
	} catch(e) {}
	try {
		m += s2.split(".")[1].length
	} catch(e) {}
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

function division(arg1, arg2) {
	var s1 = arg1.toString(),
		s2 = arg2.toString();
	return Number(s1) / Number(s2);
}
//短消息提示
var showMsgTime = null;

function showMsg(msg) {
	if(showMsgTime) {
		clearTimeout(showMsgTime);
	}
	/*var msgHtml='<div  data-role="popup" id="popup-showmsg" data-overlay-theme="b" data-theme="b" data-dismissible="false">'+
	 '<p>'+msg+'</p>'+
	 '</div>';
	 $('.ui-page').append(msgHtml).trigger('create');
	 $('#popup-showmsg').popup('open');
	 setTimeout(function(){
	 $('#popup-showmsg').popup('close');
	 },1500)*/
	if($('.showmsg-screen').length) {
		$('.showmsg-container').html(msg).trigger('create');
	} else {
		var msgHtml = '<div class="showmsg-screen"></div>' +
			'<div class="showmsg-container">' + msg + '</div>';
		$('.ui-page').append(msgHtml).trigger('create');
	}
	$('.showmsg-screen').removeClass('hide');
	$('.showmsg-container').addClass('showmsg-in').removeClass('showmsg-out');
	showMsgTime = setTimeout(function() {
		$('.showmsg-container').removeClass('showmsg-in').addClass('showmsg-out').remove();
		$('.showmsg-screen').addClass('hide').remove();
	}, 2000);
}
//故障页面提示
function showTags(msgJson) {
	/*showTags({
	 'title': '提示标题', //非必输  默认值：提示
	 'content': '提示内容',//必输
	 'ok': {
	 'title':'第一个按钮文字',//非必输  默认值：确认
	 'fun':function(){ //非必输  如果输入则执行此函数

	 }
	 },
	 'cancel': {
	 'title':'第二个按钮文字',//非必输  默认值：取消
	 'fun':function(){ //非必输  如果输入则执行此函数

	 },
	 'noClose': 'true',//非必输 为true表示 点击不关闭pop
	 }

	 })*/

	if($('.showTags-container').length > 0) {
		$('.showTags-bd-cont').html(msgJson.content);
	} else {
		var okHtml = '',
			cancelHtml = '',
			isOneBtn = '',
			contHtml = '';
		if(msgJson.ok) { //第一个按钮
			if(!msgJson.ok.title) msgJson.ok.title = '确认';
			okHtml = '<span class="showTags-btn" flagmsg="ok">' + msgJson.ok.title + '</span>';
		}
		if(msgJson.cancel) { //第二个按钮
			if(!msgJson.cancel.title) msgJson.cancel.title = '取消';
			cancelHtml = '<span class="showTags-btn" flagmsg="cancel">' + msgJson.cancel.title + '</span>';
		}
		if(!(msgJson.ok && msgJson.cancel)) { //是否只有一个按钮 只有一个按钮 要添加下边css 使按钮居中显示
			isOneBtn = 'showTags-btnarea-one';
		}
		if(msgJson.content) {
			contHtml = '<p class="showTags-bd-cont">' + msgJson.content + '</p>';
		}
		if(!msgJson.title) msgJson.title = '提示';
		$('.ui-page').append('<div class="showTags-screen"></div><div class="showTags-container">' +
			'<div class="showTags-content">' +
			'<div class="showTags-hd">' + msgJson.title + '</div>' +
			'<div class="showTags-bd">' + contHtml +
			'<div class="showTags-btnarea ' + isOneBtn + '">' + okHtml + cancelHtml +
			'</div>' +
			'</div>' +
			'</div>');
		$('.showTags-btnarea .showTags-btn').bind('click', function() {
			var okORcancel = $(this).attr('flagmsg');
			if(!msgJson[okORcancel].noClose) { //如果msgJson.isClose是否执行下边代码
				hideTags(); //关闭提示信息
			}
			if(msgJson[okORcancel].fun) {
				eval(msgJson[okORcancel].fun)();
			}
		})
	}
}

function hideTags() {
	//  $('.showTags-screen,.showTags-container').animate({
	//      opacity: 0
	//  }, 1, function () {
	$('.showTags-screen,.showTags-container').remove();
	//  });
	//$('#popup-showmsg').popup('close')
}

//base64图片解码
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64decode(str) {
	var c1, c2, c3, c4;
	var i, len, out;
	len = str.length;
	i = 0;
	out = "";
	while(i < len) {
		/* c1 */
		do {
			c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		}
		while (i < len && c1 == -1);
		if(c1 == -1)
			break;
		/* c2 */
		do {
			c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
		}
		while (i < len && c2 == -1);
		if(c2 == -1)
			break;
		out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
		/* c3 */
		do {
			c3 = str.charCodeAt(i++) & 0xff;
			if(c3 == 61)
				return out;
			c3 = base64DecodeChars[c3];
		}
		while (i < len && c3 == -1);
		if(c3 == -1)
			break;
		out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
		/* c4 */
		do {
			c4 = str.charCodeAt(i++) & 0xff;
			if(c4 == 61)
				return out;
			c4 = base64DecodeChars[c4];
		}
		while (i < len && c4 == -1);
		if(c4 == -1)
			break;
		out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
	}
	return out;
}

//显示加载器
function showLoader(msg) {
	$.mobile.loading('show', {
		text: msg, //加载器中显示的文字  
		textVisible: true, //是否显示文字  
		theme: 'c', //加载器主题样式a-e  
		textonly: false, //是否只显示文字  
		html: "" //要显示的html内容，如图片等  
	});
}
//隐藏加载器
function hideLoader() {
	$.mobile.loading('hide');
}
//获取当前时间戳及时间转换
var myTime = {
		/**
		 * 当前时间戳
		 * @return <int>        unix时间戳(秒)
		 */
		CurTime: function() {
			if(commonJson.loginTime != undefined && commonJson.loginTime != null && commonJson.loginTime != '') {
				var curDate = new Date();
				return myTime.DateToUnix(commonJson.loginTime.substr(0, 10) + ' ' + curDate.getHours() + ':' + curDate.getMinutes() + ':' + curDate.getSeconds());
			} else {
				return Date.parse(new Date()) / 1000;
			}
		},
		/**
		 * 当前时间戳
		 * named by lei.
		 * @return <int>        unix时间戳(毫秒)
		 */
		CurTimeStamp: function() {
			if(commonJson.loginTime != undefined && commonJson.loginTime != null && commonJson.loginTime != '') {
				return myTime.CurTime() * 1000 + (new Date()).getMilliseconds();
			} else {
				return new Date().getTime();
			}
		},
		/**
		 * 日期 转换为 Unix时间戳
		 * @param <string> 2014-01-01 20:20:20  日期格式
		 * @return <int>        unix时间戳(秒)
		 */
		DateToUnix: function(string) {
			var f = string.split(' ', 2);
			var d = (f[0] ? f[0] : '').split('-', 3);
			var t = (f[1] ? f[1] : '').split(':', 3);
			return(new Date(
				parseInt(d[0], 10) || null,
				(parseInt(d[1], 10) || 1) - 1,
				parseInt(d[2], 10) || null,
				parseInt(t[0], 10) || null,
				parseInt(t[1], 10) || null,
				parseInt(t[2], 10) || null
			)).getTime() / 1000;
		},
		/**
		 * 时间戳转换日期
		 * @param <int> unixTime    待时间戳(秒)
		 * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
		 * @param <int>  timeZone   时区
		 */
		UnixToDate: function(unixTime) {
			unixTime = parseInt(unixTime);
			var time = new Date(unixTime * 1000);
			var ymdhis = "";
			/*ymdhis += time.getFullYear() + "-";
			 ymdhis += (time.getMonth() + 1) + "-";
			 ymdhis += time.getDate();

			 ymdhis += " " + time.getHours() + ":";
			 ymdhis += time.getMinutes() + ":";
			 ymdhis += time.getSeconds();*/
			ymdhis += time.getFullYear() + "-";
			ymdhis += time.getMonth() < 9 ? "0" + (time.getMonth() + 1) + "-" : (time.getMonth() + 1) + "-";
			ymdhis += time.getDate() < 10 ? "0" + time.getDate() : time.getDate();

			ymdhis += time.getHours() < 10 ? " 0" + time.getHours() + ":" : " " + time.getHours() + ":";
			ymdhis += time.getMinutes() < 10 ? "0" + time.getMinutes() + ":" : time.getMinutes() + ":";
			ymdhis += time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
			return ymdhis;
		},
		/**
		 * 时间戳相减小于一个小时
		 * @param <string> redate    数据库记录间戳(秒)
		 * @param <string> currDate    当前时间间戳(秒)
		 * @return <string>    true  1小时以内
		 * @return <string>    false   1小时以外
		 */
		dateLessHour: function(reDate, currDate) {
			console.log(currDate - reDate);
			if(currDate - reDate < 3600) {
				return true;
			} else {
				return false;
			}
		},
		/**
		 * 获取当前系统时间
		 * @return <Date>                unix时间
		 */
		curDate: function() {
			if(commonJson.loginTime != undefined && commonJson.loginTime != null && commonJson.loginTime != '') {
				var dateArray = commonJson.loginTime.substr(0, 10).split('-');
				var nowDate = new Date();
				nowDate.setFullYear(dateArray[0]);
				nowDate.setMonth(dateArray[1] - 1, dateArray[2]);
				return nowDate;
			} else {
				return new Date();
			}
		},
		/**
		 * 获取当前系统时间毫秒数
		 * @return <Date>                3位毫秒数
		 */
		getCurMilliseconds: function() {
			if(commonJson.loginTime != undefined && commonJson.loginTime != null && commonJson.loginTime != '') {
				var milliseconds = new Date(myTime.CurTimeStamp()).getMilliseconds();
				milliseconds < 100 && milliseconds >= 10 && (milliseconds = '0' + milliseconds);
				milliseconds < 10 && (milliseconds = '00' + milliseconds);
				return milliseconds;
			} else {
				var milliseconds = new Date().getMilliseconds();
				milliseconds < 100 && milliseconds >= 10 && (milliseconds = '0' + milliseconds);
				milliseconds < 10 && (milliseconds = '00' + milliseconds);
				return milliseconds;
			}
		}
	}
	/**
	 *
	 * @param date  基础时间
	 * @param value 加上的月份
	 * @returns {*} 总时间
	 * @constructor
	 */
function AddMonths(date, value) {
	date.setMonth(date.getMonth() + Number(value));
	var y = date.getFullYear() + '';
	var m = date.getMonth() + 1 + '';
	var d = date.getDate() + '';
	var dateYMD = y + (m.length == 1 ? "0" + m : m) + (d.length == 1 ? "0" + d : d);
	return(dateYMD);
}
/*
 *日期格式转换
 *@param <string> inpDate  yyyy-mm-dd
 *@return <string> expDate yyyymmdd
 */
function dateYYYYMMDD(inpDate) {
	var expDate = inpDate.split('-')[0] + inpDate.split('-')[1] + inpDate.split('-')[2];
	return expDate;
}
/**
 *  日期格式转换
 * @param inpDate   yyyymmdd
 * @returns {string}  yyyy年mm月dd日
 */
function dataYearMonthData(inpDate) {
	var expDate = inpDate.substr(0, 4) + '年' + inpDate.substr(4, 2) + '月' + inpDate.substr(6, 2) + '日';
	return expDate;
}
/**
 *  日期格式转换
 * @param inpDate yyyymmdd
 * @param hasTime true:加上时间;false:不加;
 * @returns {string}  yyyy-mm-dd
 */
function dateToYMDhms(inpDate, hasTime) {
	if(inpDate == undefined || inpDate == null || inpDate == '' || inpDate.length < 8) {
		return '';
	}
	var expDate = inpDate.substr(0, 4) + '-' + inpDate.substr(4, 2) + '-' + inpDate.substr(6, 2);
	if(hasTime && inpDate.length > 11) {
		expDate += ' ' + inpDate.substr(8, 2) + ':' + inpDate.substr(10, 2) + ':' + inpDate.substr(12, 2);
	}
	return expDate;
}
/*
 *身份证是否有效(过期前三个月。如今天01-01,那么有效期为04-01之前的都无效)
 *@param <string> 身份证有效期  yyyy.mm.dd-yyyy.mm.dd
 *@return <string> true or false ;true：快过期 false：未过期
 */
function idCardIsExpired(validDate) {
	var cerExpdDt = myTime.DateToUnix(validDate.split('-')[1].replace(/\./g, '-') + ' 23:59:59'); //身份证有效期时间戳
	var curDate = myTime.curDate();
	var cy = curDate.getFullYear();
	var cm = curDate.getMonth() + 1;
	var cd = curDate.getDate();
	if(cm + 3 > 12) {
		cy++;
		cm = cm + 3 - 12;
	} else {
		cm += 3;
	}
	var ed = (new Date(cy, cm, 0)).getDate(); //3个月后的月末日期
	cd = cd > ed ? ed : cd;
	var curUnix = myTime.DateToUnix([cy, cm, cd].join("-") + " 23:59:59");
	if(cerExpdDt - curUnix < 0) {
		return true;
	} else {
		return false;
	}
}

/**
 * 身份证人是否年满十八岁
 * @param birthDay  yyyy-mm-dd 身份证人出生日期
 * @returns {boolean}  true 不满十八岁  false 年满十八岁
 */
function isGtEighteenAge(birthDay) {
	if(birthDay.split('-')[0] < '1970') {
		return false;
	}
	var curUnix = myTime.CurTime(); //当前时间戳
	var eighteenY = Number(birthDay.split('-')[0]) + 18; //出生年+18
	var birth = myTime.DateToUnix(eighteenY + '-' + birthDay.split('-')[1] + '-' + birthDay.split('-')[2] + ' 00:00:00'); //身份证出生日期的时间戳;
	if(birth > curUnix) {
		return true;
	} else {
		return false;
	}
}

/*获取当前和num天前年月日格式   yyyy-mm-dd   nT:当前时间  bT:num天前时间*/
function dateGetYMD(num) {
	var _date = myTime.curDate();
	var _dateB = _date.valueOf()
	_dateB = _date - num * 24 * 60 * 60 * 1000
	_dateB = new Date(_dateB)
	var y = _date.getFullYear();
	var m = _date.getMonth() + 1 + '';
	var d = _date.getDate() + '';
	var yB = _dateB.getFullYear();
	var mB = _dateB.getMonth() + 1 + '';
	var dB = _dateB.getDate() + '';
	var nT = y + '-' + (m.length == 1 ? "0" + m : m) + '-' + (d.length == 1 ? "0" + d : d);
	var bT = yB + '-' + (mB.length == 1 ? "0" + mB : mB) + '-' + (dB.length == 1 ? "0" + dB : dB);
	return [nT, bT];
}
/*获取上个月今日  yyyy-mm-dd*/
function getLastMonthYestdy(date) {
	var daysInMonth = new Array([0], [31], [28], [31], [30], [31], [30], [31], [31], [30], [31], [30], [31]);
	var strYear = date.getFullYear();
	var strDay = date.getDate() + 1; //业务查询开始+1
	var strMonth = date.getMonth() + 1;
	if(strYear % 4 == 0 && strYear % 100 != 0) {
		daysInMonth[2] = 29;
	}
	if(strMonth - 1 == 0) {
		strYear -= 1;
		strMonth = 12;
	} else {
		strMonth -= 1;
	}
	strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
	if(strMonth < 10) {
		strMonth = "0" + strMonth;
	}
	if(strDay < 10) {
		strDay = "0" + strDay;
	}
	datastr = strYear + "-" + strMonth + "-" + strDay;
	return datastr;
}

(function($) {
	var ms = {
		init: function(obj, args) {
			return(function() {
				ms.fillHtml(obj, args);
				ms.bindEvent(obj, args);
			})();
		},
		//濉厖html
		fillHtml: function(obj, args) {
			return(function() {
				obj.empty();
				//涓婁竴椤�
				if(args.current > 1) {
					obj.append('<a href="javascript:;" class="prevPage">上一页</a>');
				} else {
					obj.remove('.prevPage');
					obj.append('<span class="disabled">上一页</span>');
				}
				//涓棿椤电爜
				if(args.current != 1 && args.current >= 4 && args.pageCount != 4) {
					obj.append('<a href="javascript:;" class="tcdNumber">' + 1 + '</a>');
				}
				if(args.current - 2 > 2 && args.current <= args.pageCount && args.pageCount > 5) {
					obj.append('<span>...</span>');
				}
				var start = args.current - 2,
					end = args.current + 2;
				if((start > 1 && args.current < 4) || args.current == 1) {
					end++;
				}
				if(args.current > args.pageCount - 4 && args.current >= args.pageCount) {
					start--;
				}
				for(; start <= end; start++) {
					if(start <= args.pageCount && start >= 1) {
						if(start != args.current) {
							obj.append('<a href="javascript:;" class="tcdNumber">' + start + '</a>');
						} else {
							obj.append('<span class="current">' + start + '</span>');
						}
					}
				}
				if(args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5) {
					obj.append('<span>...</span>');
				}
				if(args.current != args.pageCount && args.current < args.pageCount - 2 && args.pageCount != 4) {
					obj.append('<a href="javascript:;" class="tcdNumber">' + args.pageCount + '</a>');
				}
				//涓嬩竴椤�
				if(args.current < args.pageCount) {
					obj.append('<a href="javascript:;" class="nextPage">下一页</a>');
				} else {
					obj.remove('.nextPage');
					obj.append('<span class="disabled">下一页</span>');
				}
			})();
		},
		//缁戝畾浜嬩欢
		bindEvent: function(obj, args) {
			return(function() {
				obj.off('click');
				obj.on("click", "a.tcdNumber", function() {
					var current = parseInt($(this).text());
					ms.fillHtml(obj, {
						"current": current,
						"pageCount": args.pageCount
					});
					if(typeof(args.backFn) == "function") {
						args.backFn(current);
					}
				});
				//涓婁竴椤�
				obj.on("click", "a.prevPage", function() {
					var current = parseInt(obj.children("span.current").text());
					ms.fillHtml(obj, {
						"current": current - 1,
						"pageCount": args.pageCount
					});
					if(typeof(args.backFn) == "function") {
						args.backFn(current - 1);
					}
				});
				//涓嬩竴椤�
				obj.on("click", "a.nextPage", function() {
					var current = parseInt(obj.children("span.current").text());
					ms.fillHtml(obj, {
						"current": current + 1,
						"pageCount": args.pageCount
					});
					if(typeof(args.backFn) == "function") {
						args.backFn(current + 1);
					}
				});
			})();
		}
	}
	$.fn.createPage = function(options) {
		var args = $.extend({
			pageCount: 10,
			current: 1,
			backFn: function() {}
		}, options);
		ms.init(this, args);
	}
})(jQuery);

/*
 *日期格式转换
 *@param <string> a select输入id 月 季度 年 半年
 *@param <string> b select输入id
 *@param <string> sTime 开始年月  2015-01
 *@return <string>
 */
function dateSelBuss(a, b, sTime) {
	$(a).on('change', function() {
		var selOpt = $(this).find('option:selected').text();
		var reHtml = "";
		var date = myTime.curDate();
		var eY = date.getFullYear();
		var eM = date.getMonth() + 1;
		var sY = sTime.split('-')[0];
		var sM = sTime.split('-')[1];
		var totM = 0;
		if(eY - sY == 0) {
			totM = eM - sM + 1;
		} else if(eY - sY == 1) {
			totM = 13 - sM + eM;
		} else {
			totM = 13 - sM + eM + 12 * (eY - sY - 1);
		}
		for(var i = 0; i < totM; i++) {
			switch(selOpt) {
				case "月":
					var m = (sM - 0 + i - 1) % 12 + 1;
					var y = parseInt(sY - 0 + (sM - 0 + i - 1) / 12);
					var valD = y + '年' + m + '月';
					var valDVal = String(y) + (String(m).length == 1 ? '0' + m : m);
					reHtml += '<option value="' + valDVal + '">' + valD + '</option>';
					break;
				case "季度":
					if((sM - 0 + i) % 3 == 1) {
						var j = (sM - 0 + i - 1) % 12 + 1;
						var y = parseInt(sY - 0 + (sM - 0 + i - 1) / 12);
						if(j >= 1 && j <= 3) {
							var valD = y + '第一季度';
							var valDVal = String(y) + '01';
						}
						if(j >= 4 && j <= 6) {
							var valD = y + '第二季度';
							var valDVal = String(y) + '02';
						}
						if(j >= 7 && j <= 9) {
							var valD = y + '第三季度';
							var valDVal = String(y) + '03';
						}
						if(j >= 10 && j <= 12) {
							var valD = y + '第四季度';
							var valDVal = String(y) + '04';
						}
						reHtml += '<option value="' + valDVal + '">' + valD + '</option>';
					}
					break;
				case "半年":
					if(i == 0 || (sM - 0 + i - 1) % 6 == 0) {
						var y = parseInt(sY - 0 + (sM - 0 + i - 1) / 12);
						var valD = (sM - 0 + i - 1) % 12 == 0 ? y + '上半年' : y + '下半年';
						var valDVal = (sM - 0 + i - 1) % 12 == 0 ? (String(y) + '01') : (String(y) + '02');
						if((sM - 0 + i - 1) < 6) {
							valD = y + '上半年';
							valDVal = String(y) + '01';
						}
						reHtml += '<option value="' + valDVal + '">' + valD + '</option>';
					}
					break;
				case "年":
					if(i == 0 || (sM - 0 + i - 1) % 12 == 0) {
						var y = parseInt(sY - 0 + (sM - 0 + i - 1) / 12);
						var valD = y + '年';
						var valDVal = String(y) + '01';
						reHtml += '<option value="' + valDVal + '">' + valD + '</option>';
					}
					break;
				default:
					reHtml += "";
					$(b).html(reHtml);
					return false;
			}
		}
		$(b).html(reHtml).selectmenu('refresh');
		$(b).val($(b).find('option:last').val()).selectmenu('refresh');

	})
	$(a).change();
}

var zhangArr = [0, '']; //zhangArr 第0位标志位  第二2位修改的卡账号  第3位修改的卡账号voucher  第4位加挂还是解挂  第5位之前修改的卡账号

function showSelTip(msgJson) {
	if($('.showSelTip-container').length > 0) {
		$('.paycard-icon').html(msg);
	} else {
		var okHtml = '',
			cancelHtml = '',
			isOneBtn = '',
			contHtml = '';
		if(msgJson.ok) { //第一个按钮
			if(!msgJson.ok.title) msgJson.ok.title = '确定';
			okHtml = '<div class="gua-btn" flagmsg="ok">' + msgJson.ok.title + '</div>';
		}
		if(msgJson.cancel) { //第二个按钮
			if(!msgJson.cancel.title) msgJson.cancel.title = '放弃';
			cancelHtml = '<div class="cancel-btn" flagmsg="cancel">' + msgJson.cancel.title + '</div>';
		}
		if(!(msgJson.ok && msgJson.cancel)) { //是否只有一个按钮 只有一个按钮 要添加下边css 使按钮居中显示
			isOneBtn = 'showTags-btnarea-one';
		}
		//if(msgJson.content){
		//    contHtml='<p class="showTags-bd-cont">'+msgJson.content+'</p>';
		//}
		if(!msgJson.title) msgJson.title = '提示';
		$('.ui-page').append('<div class="showSelTip-screen"></div><div class="showSelTip-container">' +
			'<div class="showTags-content">' +
			'<div class="pop-header">' + msgJson.title + '</div>' +
			'<div class="pop-content"><div class="pop-gua"></div></div>' +
			'<div class="pop-footer">' +
			cancelHtml + okHtml +
			'</div>' +
			'</div>' +
			'</div>');
		$(msgJson.content + ' .kai-list:not(.no-list)').each(function() {
			contHtml += '<div class="gua-rows"><span voucher="' + $(this).attr('voucher') + '">' + $(this).text() + '</span><img src="../../images/ic-gou.png" /></div>';
		});
		$('.pop-content .pop-gua').append(contHtml);
		$('.pop-footer .gua-btn').addClass('disgua-btn');
		$('.pop-gua .gua-rows').bind('click', this, function() {
			if(eleSignJson.NETBANK_STATE_N == 'L' || eleSignJson.NETBANK_STATE_N == 'U') {
				hideSelTip();
				showTags({
					'title': '提示',
					'content': '网银状态非正常，不可操作网银相关交易！',
					'ok': {}
				});
				return;
			}
			$('.pop-gua .gua-rows').find('img').css('display', 'none');
			if(zhangArr.length > 1) {
				if(zhangArr[5] != undefined && zhangArr[5] != $(this).find('span').text()) {
					hideSelTip();
					showTags({
						'title': '提示',
						'content': '不可以操作多个账号',
						'ok': {
							fun: function() {}
						}
					});
					return;
				} else {
					zhangArr[0] = 1;
					$(this).find('img').css('display', 'inline-block');
					zhangArr[2] = $(this).find('span').text();
					zhangArr[3] = $(this).find('span').attr('voucher');
					//eleSignJson.zhangACCT=$(this).find('span').text();
					//eleSignJson.zhangType=$(this).find('span').attr('voucher');
					zhangArr[4] = msgJson.jiaJ;
					$('.pop-footer .gua-btn').removeClass('disgua-btn');
				}
			} else {
				$(this).find('img').css('display', 'inline-block');
				zhangArr[2] = $(this).find('span').text();
				zhangArr[3] = $(this).find('span').attr('voucher');
				//eleSignJson.zhangACCT=$(this).find('span').text();
				//eleSignJson.zhangType=$(this).find('span').attr('voucher');
				zhangArr[4] = msgJson.jiaJ;
				$('.pop-footer .gua-btn').removeClass('disgua-btn');
			}
		});
		$('.pop-footer .gua-btn').bind('click', function() {
			if($('.gua-btn').hasClass('disgua-btn')) { //判断页面的已挂靠账户状态是否存在
				return;
			}
			var okORcancel = $(this).attr('flagmsg');
			if(msgJson[okORcancel].fun) {
				eval(msgJson[okORcancel].fun)();
			}
			if(!msgJson[okORcancel].noClose) { //如果msgJson.isClose是否执行下边代码
				hideSelTip(); //关闭提示信息
			}
		})
		$('.pop-footer .cancel-btn').bind('click', function() {
			hideSelTip();
			return;
		});
	}
}

function hideSelTip() {
	$('.showSelTip-screen,.showSelTip-container').animate({
		opacity: 0
	}, 200, function() {
		$('.showSelTip-screen,.showSelTip-container').remove();
	});
	//$('#popup-showmsg').popup('close')
}

function getYMDHMSM(msg) {
	var myDate = myTime.curDate();
	var y = myDate.getFullYear();
	var m = (myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1) : '0' + (myDate.getMonth() + 1);
	var d = myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate();
	var h = myDate.getHours() > 9 ? myDate.getHours() : '0' + myDate.getHours();
	var mi = myDate.getMinutes() > 9 ? myDate.getMinutes() : '0' + myDate.getMinutes();
	var s = myDate.getSeconds() > 9 ? myDate.getSeconds() : '0' + myDate.getSeconds();
	var ms = myDate.getMilliseconds();
	if(ms.toString().length == 2) {
		ms = '0' + ms;
	} else if(ms.toString().length == 1) {
		ms = '00' + ms;
	}
	return msg + y + '' + m + '' + d + '' + h + '' + mi + '' + s + '' + ms; //年月日时分秒
}
// 金额格式化 s：金额   n：保留小数位
function fmoney(s, n) {
	if(!s) return '';
	if(s == '.') return '';
	n = n > 0 && n <= 20 ? n : 2;
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	var l = s.split(".")[0].split("").reverse(),
		r = s.split(".")[1];
	t = "";
	for(i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	var ret = t.split("").reverse().join("") + "." + r;
	if(ret == 0.00) ret = '';
	return ret;
}
//金额格式化 ----> s：金额   n：保留小数位 --->返回格式不带逗号
function fmoneySQB(s, n) {
	if(!s) return '';
	if(s == '.') return '';
	n = n > 0 && n <= 20 ? n : 2;
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	return s;
}

function fmoneyEle(s, n) {
	if(!s) return '';
	if(s == '.') return '0.00';
	n = n > 0 && n <= 20 ? n : 2;
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	var l = s.split(".")[0].split("").reverse(),
		r = s.split(".")[1];
	t = "";
	for(i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	return t.split("").reverse().join("") + "." + r;
}
//金额格式化，对负数做特殊处理
function transmoney(s, n) {
	if(s == '0' || s == '0.0' || s == '0.00') {
		return '0.00';
	} else {
		if(!s) return '';
		if(s == '.') return '';
		//	var Num = /^([-]?0|[1-9]\d{0,})\.?\d{1,2}$/;
		var Num = /^-?\d+(\.\d+)?$/;
		var ret;
		if(Num.test(s)) {
			var start = '';
			if(parseFloat(s) < 0) {
				start = "-";
			} else {
				start = "";
			}
			t = "";
			n = n > 0 && n <= 20 ? n : 2;
			s = parseFloat((s + "").replace(/[^\d\.]/g, "")).toFixed(n) + "";
			var l = s.split(".")[0].split("").reverse(),
				r = s.split(".")[1];
			for(i = 0; i < l.length; i++) {
				t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
			}
			ret = t.split("").reverse().join("") + "." + r;
			ret = start + ret;
			if(ret == 0.00) ret = '';
		} else {
			showTags({
				'title': '提示',
				'content': '请输入正确格式的金额！',
				'ok': {}
			});
			ret = '';
		}

		return ret;
	}
}
//金额格式转换数字
function rmoney(s) {
	if(!s) return '';
	return parseFloat(s.replace(/[^\d\.-]/g, ""));
}
//日期转换  yyyymmdd  to  yyyy-mm-dd
function dateToShowType(msg) {
	if(!msg) return "";
	return msg.substring(0, 4) + '-' + msg.substring(4, 6) + '-' + msg.substring(6);
}
//时间转换 hhmmss to hh:mm:ss
function timeToShowType(msg) {
	if(!msg) return "";
	var _msg = msg.length < 6 ? "0" + msg : msg;
	return _msg.substring(0, 2) + ':' + _msg.substring(2, 4) + ':' + _msg.substring(4);
}

//卡号、手机号、身份证号格式化  ' 123 232 ' to  '123232'
function removeSpace(val) {
	return val.replace(/\s+/g, '');
}

function telNum(val) {
	return val.replace(/(\d{3})(\d{4})(\d{4})/, "$1  $2  $3");
}
//卡号、手机号、身份证号格式化  '123232' to  '1232 32 '
function addSpace(value) {
	return value.replace(/\s+/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
	//var result='';
	//var value=value.replace(/\s+/g,'').split('').reverse();
	//for(var i=0;i<value.length;i++){
	//    if(i%num==0&&i!=0){
	//        result+=style;
	//    }
	//    result+=value[i];
	//}
	//return result.split('').reverse().join('');
}
//var ts=removeSpace('1000',',',3);
//console.log(ts);

//视频下载
function dowanloadVideo(filePath, markId) {
	var divObj = $('#after_div_' + markId);
	var fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
	CRMAddress("", function(msg) {
		var url = msg + 'video-download/getVideo?filePath=' + filePath;
		if(divObj.attr('loadingInd') == 'true') {
			downLoadFile(url, fileName, markId, '4', function(msg) {
				divObj.attr('loadingInd', false).html('继续下载');
			}, function(err) {
				alertMessage(err);
			});
		} else {
			downLoadFile(url, fileName, markId, '3', function(msg) {
				divObj.attr('loadingInd', true).html('下载中');
				var i = setInterval(function() {
					if(divObj.attr('loadingInd') == 'false') {
						clearInterval(i);
					}
					downLoadFile(url, fileName, markId, '2', function(msg) {
						divObj.css('background-size', msg + '% 110%');
						if(Number(msg) >= 100) {
							clearInterval(i);
							downLoadFile(url, fileName, markId, '5', function(msg) {
								var videoObj = $('#vedio_' + markId);
								if(videoObj == undefined || videoObj.attr('id') == undefined) {
									divObj.html('下载完成').css('background-size', '0%');
									$('#after_a_' + markId).unbind().attr('data-video', msg).addClass('womendeyinhang-click');
								} else {
									videoObj.attr('src', msg).show();
									divObj.hide();
									$('#img_' + markId).hide();
								}
							}, function(err) {
								clearInterval(i);
								alertMessage(err);
								divObj.attr('loadingInd', false).html('继续下载');
							});
						}
					}, function(err) {
						clearInterval(i);
						alertMessage(err);
						divObj.attr('loadingInd', false).html('继续下载');
					});
				}, 1000);
			}, function(err) {
				alertMessage(err);
			});
		}
	});
}

//提示弹出框
function alertMessage(msg) {
	if(msg.indexOf('403') > -1) {
		msg = '7点至19点间禁止下载视频，请在其余时间下载！';
	} else if(msg.indexOf('404') > -1) {
		msg = '下载失败，文件不存在！';
	} else if(msg.indexOf('502') > -1) {
		msg = '网络错误，请重新再试！';
	}
	showTags({
		'title': '提示',
		'content': msg,
		'ok': {}
	});
}

function dzhShouyeNo() {
	$.mobile.changePage('../main.html', {
		reverse: true
	});
}
//所有模块首页按钮统一提示弹窗
function dzhShouye() {
	showTags({
		'title': '提示',
		'content': '确认返回首页？',
		'ok': {
			'title': '放弃',
			'fun': function() {

			}
		},
		'cancel': {
			'title': '确认',
			'fun': function() {
				$.mobile.changePage('../main.html', {
					reverse: true
				});
			}
		}
	})
};

function dzhFanhuiNo(msg) {
	$.mobile.changePage(msg, {
		reverse: true
	});
}
//所有模块退出按钮统一提示弹窗
function dzhFanhui(msg) {
	showTags({
		'title': '提示',
		'content': '确认退出交易？',
		'ok': {
			'title': '放弃',
			'fun': function() {

			}
		},
		'cancel': {
			'title': '确认',
			'fun': function() {
				$.mobile.changePage(msg, {
					reverse: true
				});
			}
		}
	})
};

function dataCheckCn(nf) {
	var reg = /[^!-~]$/g;
	if(nf.length > 0) {
		if(!reg.test(nf)) {
			return false;
		}
	}
	return true;
}

checkAs400ChineseLength = function(str) { //
	var isCn = false; //是否中文或全角字符
	var isNotCn = false; //是否非全角或中文字符
	var numOfCn = 0; //中文或全角字符数量
	var numOfChineseLock = 0; //表示汉字块的数量
	var lengthOfStr = 0; //输入字符串长度
	var strList = str.split("");
	lengthOfStr = strList.length;
	for(var i = 0; i < lengthOfStr; i++) {
		if(dataCheckCn(strList[i])) { //表明为汉字字符
			isCn = true;
			isNotCn = false;
			numOfCn++;
		} else { //表明为非汉字字符
			isNotCn = true;
		}
		if(isCn && isNotCn) { //表示连续汉字字符被中断
			numOfChineseLock++;
			isCn = false;
		}
		if((lengthOfStr - 1) == i && isCn) { //表示汉字字符结尾
			numOfChineseLock++;
		}
	}
	var LengthOfStrAscII = 0; //ASCII字节长度
	LengthOfStrAscII = numOfCn * 2 + (lengthOfStr - numOfCn);
	//		alert("ASCII:" + LengthOfStrAscII);
	//		alert("汉字:" + numOfCn);
	//		alert("汉字块:" + numOfChineseLock);
	//计算EBCDIC码的字节长度
	var LengthOfStrEBCDIC = 0;
	LengthOfStrEBCDIC = LengthOfStrAscII + numOfChineseLock * 2;
	//		alert("EBCDIC:" + LengthOfStrEBCDIC);
	return LengthOfStrEBCDIC;
}

/**
 * 平台交易流水号公共获取方法
 * @param json 对应模块的json对象
 * @param callback 回调函数
 * @param url 可选择失败返回地址
 */
function getPlatGlobalSeq(json, callback, url) {
	hideLoader();
	showLoader('获取交易流水号中..');
	var sendJson = {
		"b": [{
			"deviceNo.s": commonJson.udId, //设备编号
			"moduleId.s": json.moduleId, //模块编号
			"tranId.s": json.tranId, //loan.tranId, //交易编号
			"orgId.s": commonJson.orgId, //机构号
			"operatorNo.s": commonJson.adminCount, //操作员
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"CLIENT_NAME.s": custermerInfo.name, //客户姓名
			"DOCUMENT_TYPE.s": '0', //证件类型
			"DOCUMENT_ID.s": custermerInfo.cerNO //证件号码
		}]
	};
	getPlatGlobalSeqFun(sendJson, function(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseBody = responseObj.b;
		if(responseBody[0].results == '00') {
			json.platGlobalSeq = responseBody[0].platGlobalSeq; //获取平台流水号
			if(callback) {
				callback(this);
			}
		} else {
			showTags({
				'title': '提示',
				'content': '获取平台交易流水号超时!',
				'cancel': {
					'title': '继续提交', //非必输  默认值：确认
					'fun': function() { //非必输  如果输入则执行此函数
						getPlatGlobalSeq(json, callback);
					}
				},
				'ok': {
					'title': '放弃提交', //非必输  默认值：取消
					'fun': function() { //非必输  如果输入则执行此函数
						if(url) {
							$.mobile.changePage(url);
						}
					}
				}
			});
		}
	}, function(err) {
		hideLoader();
		showTags({
			'title': '提示',
			'content': '获取平台交易流水号超时!',
			'ok': {
				'fun': function() { //非必输  如果输入则执行此函数
					if(url) {
						$.mobile.changePage(url);
					}
				}
			}
		});
	});
}

/*
 * 保存客户及其影像信息
 * @param busiType 业务类型
 */
function saveCustermerAndPhotoIno(busiType) {
	cacheCustermerInfo({
		"databaseName": "myDatabase",
		"tableName": "customer_info",
		"data": [{
			"ADMINCOUNT": commonJson.adminCount, //登陆账号
			"SUBMITTIME": myTime.CurTime(), //提交时间
			"BUSINESSTYPE": busiType, //业务类型
			"NATION": custermerInfo.nation, //民族
			"CERTNUM": custermerInfo.cerNO, //身份证号码
			"ADDRESS": custermerInfo.address, //地址
			"MASCARDNAME": custermerInfo.name, //姓名
			"CERTVALIDDATE": custermerInfo.cerExpdDt, //有效日期
			"BIRTH": custermerInfo.birthday, //出生日期
			"SEX": custermerInfo.sex, //性别
			"ISSAUTHORITY": custermerInfo.issAuthority, //签发机关
			"IMAGE": custermerInfo.image, //身份证头像图片
			"CUSTANDCUSTOWNERPIC": custermerInfo.custAndCustOwnerPic, //与客户合影照片
			"FRONTIDCARDPIC": custermerInfo.frontIDCardPic, //身份证正面
			"BACKIDCARDPIC": custermerInfo.backIDCardPic, //身份证反面
			"checkPhoto": custermerInfo.checkPhoto //联网核查图片
		}]
	});
}

//获取短信验证码
/*
 * json:模块、交易编号
 * codeTime：定时器
 * callback: 回调函数  可不输
 * */
function getImessageAuthentionServiceFun(json, codeTime, callback) {
	showLoader('获取中...')
	var sendJson = {
		"b": [{
			"orgId.s": commonJson.orgId,
			"moduleId.s": json.moduleId, //模块编号
			"tranId.s": json.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员
			"deviceNo.s": commonJson.deviceNo, //设备编号
			"SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
			"Flags.s": "BBBB", //标记位
			"MOBILE_NO.s": json.mobile, //手机号码debitEnter.tel
			"REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
			"faceRecogn.s": json.faceRecogn //人脸识别状态
		}]
	};

	imessageAuthentionServiceFun(sendJson, function(msg) {
		console.log(msg);
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		if(responseCode[0].results == '00') {
			json.USER_NO = responseCode[1].messageAuthentionVO[0].USER_NO; //用户唯一标识
			json.MSG_INFO = responseCode[1].messageAuthentionVO[0].MSG_INFO; //动态口令
			callback && callback();
		} else if(responseCode[0].results == '08') {
			getImessageAuthentionServiceFun(json, codeTime, callback);
		} else {
			json.hasYZM = false;
			if(codeTime) {
				clearInterval(codeTime);
			}
			$('#getMsg').removeClass('cannt-click').text('重新获取');
			$('.codetime').html('请在<span style="color:red;">80秒</span>内输入验证码');
			$('#inp').removeAttr('disabled').val('');
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}, function(err) {
		hideLoader();
		json.hasYZM = false;
		if(codeTime) {
			clearInterval(codeTime);
		}
		$('#getMsg').removeClass('cannt-click').text('重新获取');
		$('.codetime').html('请在<span style="color:red;">80秒</span>内输入验证码');
		$('#inp').removeAttr('disabled').val('');
		funFail(err);
	});
}
//验证短信验证码
function ckeckImessageAuthentionServiceYFun(json, callback) {
	var sendJson = {
		"b": [{
			"orgId.s": commonJson.orgId,
			"moduleId.s": json.moduleId, //模块编号
			"tranId.s": json.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员
			"deviceNo.s": commonJson.deviceNo, //设备编号
			"SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
			"USER_NO.s": json.USER_NO, //用户唯一标识
			"EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
			"MSG_INFO.s": json.msgInfo, //动态口令 取手工输入的值  //json.MSG_INFO, //动态口令
			"Flags.s": "BBBB", //标记位
			"MOBILE_NO.s": json.mobile, //手机号码debitEnter.tel
			"REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
			"faceRecogn.s": json.faceRecogn //人脸识别状态
		}]
	};
	imessageAuthentionServiceYFun(sendJson, function(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		if(responseCode[0].results == '00') {
			json.USER_NO = "";
			callback && callback();
		} else if(responseCode[0].results == "08") {
			ckeckImessageAuthentionServiceYFun(json, callback);
		} else {
			json.USER_NO = "";
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}, function(err) {
		json.USER_NO = "";
		funFail(err);
	});
}

/**
 * 获取坐标
 */
function getCurrentLocationCoordinateFun(callback) {
	showLoader('正在获取当前位置...');
	getCurrentLocationCoordinate('', function(msg) {
		if($('body .ui-loader h1').text() == "正在获取当前位置...") { //隐藏获取坐标的Loader,避免异步隐藏其他Loader
			hideLoader();
		}
		var pointArr = msg.split(","); //114.12379217,225495628
		commonJson.longitude = pointArr[0]; //经度
		commonJson.latitude = pointArr[1]; //纬度
		if(typeof callback === 'function') {
			callback();
		}
	}, function(err) {
		if($('body .ui-loader h1').text() == "正在获取当前位置...") {
			hideLoader();
		}
		showTags({
			'content': err,
			'ok': {
				'fun': function() {
					$.mobile.changePage("../main.html", {
						reverse: true
					});
				}
			}
		});
		return;
	});
}

/**
 * 事件订阅、发布工具(观察者模式)
 * @Example
    topicUtil.subscribe("module/custom", function(event, a, b) {
        console.log(a + b);
    });
    topicUtil.publish("module/custom", ["aa", "bb"]);
 */
var topicUtil = new function() {
	var topics = $({});
	/**
	 * 订阅
	 * @Param Sting 自定义事件名称
	 * @Param Function 收到消息执行的函数
	 */
	this.subscribe = function() {
		topics.on.apply(topics, arguments);
	};
	/**
	 * 取订
	 * @Param Sting 自定义事件名称
	 */
	this.unsubscribe = function() {
		topics.off.apply(topics, arguments);
	};
	/**
	 * 发布
	 * @Param Sting 自定义事件名称
	 * @Param Array 执行函数的参数
	 */
	this.publish = function() {
		topics.trigger.apply(topics, arguments);
	};
}

/**
 * 修改数据库待上传文件的可上传状态
 * @Param status 上传状态 01-默认,02-成功,03-失败
 * @Param fileToken1 图像压缩包的文件唯一ID
 * @Param fileToken2 签名压缩包的文件唯一ID
 * @Param fileToken3 录像压缩包的文件唯一ID
 */
function changeUploadStatus(status, fileToken1, fileToken2, fileToken3, fileToken4) {
	sql = "UPDATE up_download_info SET REMARK1 = '" + status + "' WHERE fileToken = '" + fileToken1 + "'";
	if(fileToken2) {
		sql += " OR fileToken = '" + fileToken2 + "'";
		if(fileToken3) {
			sql += " OR fileToken = '" + fileToken3 + "'";
			if(fileToken4) {
				sql += " OR fileToken = '" + fileToken4 + "'";
			}
		}
	}
	executeSqlString(sql, 'exe', function() {

	}, function(err) {
		funDataFail(err);
	});
}

/**
 * 修改数据库待上传文件的 appBus
 * @param fileToken  文件唯一ID
 * @param appBus     文件的业务参数
 * @param callback   修改成功的回调函数
 */
function changeUploadAppBus(fileToken, appBus, callback) {
	appBus = JSON.stringify(appBus);
	var sql = "UPDATE up_download_info SET appBuss = '" + appBus + "' WHERE fileToken = '" + fileToken + "'";
	executeSqlString(sql, 'exe', function() {
		if(callback) {
			callback();
		}
	}, function(err) {
		funDataFail(err);
	});
}

//监听jqueryMoible切换页面时删掉上个页面
$(function() {
	$(document).on('pagebeforehide', 'div[data-role="page"]', function() {
		$(this).remove();
	});
});

//小贷评分卡反显的选项值去除掉前面的序号
function choiceformat(s) {
	var ret = '';
	ret = s.substring(s.indexOf('-') + 1, s.length);
	return ret;
}

//根据身份证计算年龄
function calculateage(cerNo) {
	var myDate = new Date();
	var month = myDate.getMonth() + 1;
	var day = myDate.getDate();

	var age = myDate.getFullYear() - cerNo.substring(6, 10) - 1;
	if(cerNo.substring(10, 12) < month || cerNo.substring(10, 12) == month && cerNo.substring(12, 14) <= day) {
		age++;
	}
	return age;
}