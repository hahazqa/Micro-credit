//临时缓存处理
var TempCache = {
    name: "0",
    cache: function (key, value) {
        localStorage.setItem(key, value);
    },
    getCache: function (key) {
        return localStorage.getItem(key);
    },
    removeCache: function (key) {
        return localStorage.removeItem(key);
    }
};
//Session失效加上遮罩层和密码输入框再处理
var SessionLost = function () {
    var successCallBack = "successCallBack";
    var failureCallBack = "failureCallBack";
    var pathName = window.document.location.pathname;
    var projectName = pathName.substring(0, pathName.indexOf('www') + 4);
    var len = arguments.length;
    var randomId = "";
    if (len == 1) {
        successCallBack = arguments[0];
    } else if (len == 2) {
        successCallBack = arguments[0];
        failureCallBack = arguments[1];
    }
    var sessionOpt = {
        uuid: function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            var uuid = s.join("");
            return uuid;
        },
        blocking: function (event) {
            //遮罩层
            var div = document.createElement("div");
            div.setAttribute("id", "sessionMask");
            div.setAttribute("class", "sessionMask");
            div.setAttribute("style", "position: absolute; top: 0px; background-color:rgba(0,0,0,0.3);z-index: 1002; left: 0px;");

            //锁图像
            //var img = document.createElement("img");
            //img.setAttribute("src", projectName + "/images/icon_key_login.png");
            //img.setAttribute("style", "width: 38.5px;height:50px;position: absolute;top:" + (document.body.scrollTop + document.body.clientHeight / 2 - img.clientHeight / 2 + 80) + "px;left:" + ((document.body.clientWidth - img.clientWidth) / 2 - 150) + "px;z-index: 110000;");

            //锁图像
            var img = document.createElement("div");
            img.setAttribute("id", "sessionImg");
            img.setAttribute("style", "width: 323px;height:161px;background-color:#ffffff;border-radius: 4px; position: absolute;top:" + (document.body.scrollTop + document.body.clientHeight / 2 - 80) + "px;left:" + ((document.body.clientWidth - img.clientWidth) / 2 - 150) + "px;z-index: 110000;");


            //密码输入框
            var input = document.createElement("input");
            //var inputPwdId = sessionOpt.uuid();
            //randomId = inputPwdId;
            input.setAttribute("id", "guoxinglingtongpwd");
            input.setAttribute("type", "password");
            input.setAttribute("style", "color: #D2D9E5;width:260px;font-size: 15px; background-color:#ADB8C6;border:0;text-align: center;margin-top:10px;");
            input.setAttribute("placeholder", "请输入密码解锁");

			var div2 = document.createElement("div");
            div2.setAttribute("style", "width:260px;height:44px;background-color:#ADB8C6;box-sizing: border-box;box-show:none;position: absolute;top:" + (document.body.scrollTop + document.body.clientHeight / 2 - 55) + "px;left:" + ((document.body.clientWidth - img.clientWidth) / 2 - 120) + "px;z-index: 110000;");
            div2.appendChild(input);

            //提交按钮
            var inputbutton = document.createElement("div");
            inputbutton.setAttribute("id", "login-submit");
            //inputbutton.setAttribute("type", "button");
            inputbutton.setAttribute("style", "color: #666666;width: 200px;font-size: 14px;height:39px;text-align: center;line-height: 39px;background-color: #1899DA;color: #FFFFFF; position: absolute;top:" + (document.body.scrollTop + document.body.clientHeight / 2 + 15) + "px;left:" + ((document.body.clientWidth - img.clientWidth) / 2 - 90) + "px;z-index: 110000;");
            inputbutton.innerHTML = "提交";
            inputbutton.onclick = event;

            div.appendChild(img);
            div.appendChild(div2);
            div.appendChild(inputbutton);
            document.getElementsByTagName("body")[0].appendChild(div);

            sessionOpt.showMask();
        },
        showMask: function () {
            $(".sessionMask").css("height", $(document).height());
            $(".sessionMask").css("width", $(document).width());
            $(".sessionMask").show();
        },
        hideMask: function () {
            var slen = document.getElementsByClassName("sessionMask").length;
            $(".sessionMask").hide();
        },
        removeMask:function () {
            var slen = document.getElementsByClassName("sessionMask").length;
            if (document.getElementsByClassName("sessionMask").length > 0) {
                for (var j = 0; j < slen; j++) {
                    document.getElementsByClassName("sessionMask")[j].remove();
                }

            }
        },
        getCallBack: function () {
            var length = arguments.length;
            if (length == 1 && arguments[0] == 0) {
                return failureCallBack;
            } else {
                return successCallBack;
            }
        },
        setCallBack: function (callBack) {
            var length = arguments.length;
            if (length == 2 && arguments[1] == 0) {
                failureCallBack = callBack;
            } else {
                successCallBack = callBack;
            }
        },
        sessionLoginOut:function (successBackFun) {
            showLoader('退出加载登录页面...');
            var bodyJson = {
                "b": [{
                    "deviceNo.s": commonJson.udId, //设备编号
                    "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                    "workAddress.s": "",
                    "userId.s": commonJson.adminCount

                }]
            };
            loginOut(bodyJson, function (msg) { //退出登录
                msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
                var responseObj = JSON.parse(msg);
                var responseCode = responseObj.b;
                BackAttr.moduleID = '-1';
                if (responseCode[0].results == "00") {
                    hideLoader();
                    sessionOpt.removeMask();
                    Menu.init = false;
                    $.mobile.changePage(projectName + 'index.html');
                } else {
                    hideLoader();
                    sessionOpt.removeMask();
                    showTags({
                        'title': '提示',
                        'content': '签退超时,是否继续?',
                        'ok': {
                            title:'强制退出',
                            fun:function () {
                                Menu.init = false;
                                $.mobile.changePage(projectName + 'index.html');
                            }
                        },
                        'cancel':{
                            title:'继续',
                            fun:function () {
                                sessionOpt.sessionLoginOut();
                            }
                        }
                    });
                }
            }, function (err) {
                sessionOpt.removeMask();
                hideLoader();
                showTags({
                    'title': '提示',
                    'content': '签退超时,是否继续?',
                    'ok': {
                        title:'强制退出',
                        fun:function () {
                            Menu.init = false;
                            $.mobile.changePage(projectName + 'index.html');
                        }
                    },
                    'cancel':{
                        title:'继续',
                        fun:function () {
                            sessionOpt.sessionLoginOut();
                        }
                    }
                });
            });
        },
        successCallBack: function (msg) {
            //			alert(document.getElementById("mimashurukuang").value);
            var _msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
            var responseObj = JSON.parse(_msg);
            var responseCode = responseObj.b;
            if (responseCode[0].results == "08") {
                showTags({
                    'title': '提示',
                    'content': responseCode[0].message,
                    'ok': {
                        fun: function () {
                            commonJson.sessionLoginAccount = 0;
                        }
                    }
                });
                hideLoader();
                sessionOpt.blocking(function (inputPwdId) {
                    //alert(document.getElementsByClassName('sessionMask').length);
                    var len = document.getElementsByClassName('sessionMask').length;
                    for (var rm = 0; rm < len - 1; rm++) {
                        document.getElementsByClassName('sessionMask')[rm].remove();
                    }
                    var pwd = document.getElementById("guoxinglingtongpwd").value;
                    if (null != pwd && pwd != "") {
                    } else {
                        showTags({
                            'title': '提示',
                            'content': '请输入密码。',
                            'ok': {}
                        });
                        return;
                    }
                    showLoader('解锁中...');
                    getCurrentVersion('', function (vision) {
                        Meap.getCurrentLocationAddress('', function(msg) {
                            msg = JSON.parse(msg);
                            commonJson.workAddress = msg.FormattedAddressLines[0];
                            commonJson.workCountry = msg.Country;
                            commonJson.workState = msg.State;
                            commonJson.workCity = msg.City;
                            commonJson.workSubLocality = msg.SubLocality;
                            //重新登陆
                            var bodyJson = {
                                "b": [{
                                    "deviceNo.s": commonJson.udId, //设备编号
                                    "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                                    "workAddress.s": "",
                                    "userId.s": commonJson.adminCount,
                                    "userPwd.s": pwd,
                                    "lastLoginIP.s": "",
                                    "APP_VISION.s": vision
                                }]
                            };
                            login(bodyJson, function (msg) {
                                msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
                                var responseObj = JSON.parse(msg);
                                var responseCode = responseObj.b;
                                sessionOpt.hideMask();
                                commonJson.sessionLoginAccount++;
                                if (responseCode[0].results == "00") {
                                    commonJson.loginTime = responseCode[1].sysUserVO[0].lastLoginTime;
                                    sessionOpt.removeMask();
                                    //2016-04-06 影像未上传查询功能修改(改为查询本地数据库)-----麦田
                                    queryTableDataByConditions({
                                        "databaseName": "myDatabase", //数据库名
                                        "tableName": "up_download_info" //表名
                                    }, function (msg) {
                                        hideLoader();
                                        if (msg.length > 0) {
                                            showTags({
                                                'title': '提示',
                                                'content': "当前还有<span style='color:red; font-size:20px;'>" + msg.length + "</span>笔影像未上传",
                                                'ok': {
                                                    //						title: '确定		',
                                                    fun: function () {
                                                        eval(successCallBack(_msg));
                                                    }
                                                }
                                            });
                                        } else {
                                            eval(successCallBack(_msg));
                                        }
                                    }, function (err) {
                                        //showMsg('查询数据库失败' + msg);
                                        eval(successCallBack(_msg));
                                    });
                                } else {
                                    hideLoader();
                                    if (responseCode[0].results == '306') {
                                       	showTags({
                                            'title': '提示',
                                            'content': responseCode[0].message,
                                            'ok': {
                                                fun:function () {
                                                    $('#guoxinglingtongpwd').val('');
                                                    sessionOpt.showMask();
                                                }
                                            }
                                        });
                                    } else {
                                    	 showTags({
                                            'title': '提示',
                                            'content': responseCode[0].message,
                                            'ok': {
                                                fun: function () {
                                                    sessionOpt.sessionLoginOut();
                                                }
                                            }
                                        });
                                    }

                                }
                            }, function (err) {
                                hideLoader();
                                showTags({
                                    'title': '提示',
                                    'content': '验证超时,请重新验证!',
                                    'ok': {}
                                });
                            });
                        }, function(err) {
                            console.log(456);
                            hideLoader();
                            showTags({
                                'title': '提示',
                                'content': err,
                                'ok': {}
                            });
                        });
                    }, function () {
                        hideLoader();
                        showTags({
                            'title': '提示',
                            'content': '获取版本失败！',
                            'ok': {}
                        });
                    });
                });
            } else {
                eval(successCallBack(msg));
            }
        },
        failureCallBack: function (msg) {
            var _msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
            eval(failureCallBack(_msg));
        }
    };
    return sessionOpt;
};