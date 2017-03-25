//获取客户手机号成功回调
function socialSecurityIEstablishCustomerInformationServiceSucc(msg){
    //alert(msg);
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    hideLoader();
    //alert(responseCode[0].results);
    if (responseCode[0].results == '00') {
        //手机号
        customerInfoY.MOBILEPHONE = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[1].contactInfo[0].CONTACT_ID)
        if (customerInfoY.MOBILEPHONE == '') {
            showTags({
                'title': '提示',
                'content': '核心无法查询到手机号码，无法办理！',
                'ok': {
                    fun: function () {
                    }
                }
            });
            return;
        } else {
            return;
        }
    } else if(responseCode[0].results == '08'){
        
    }else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}

//获取验证码 成功回调
function imessageAuthentionServicesocialSecuritySucc(msg) {
	hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    //alert(JSON.stringify(responseCode))
    if (responseCode[0].results == '00') {
        statusY.hasYZM = true;
        customerInfoY.USER_NO = responseCode[1].messageAuthentionVO[0].USER_NO //用户唯一标识
        customerInfoY.MSG_INFO = responseCode[1].messageAuthentionVO[0].MSG_INFO //动态口令
        var num = 80; //设置验证码有效定时器
        socialSecurity.codeTime = setInterval(function () {
            num--;
            $('.codetime').html('请在<span style="color:red;">' + num + '秒</span>内输入验证码');
            if (num == 0) {
                clearInterval(socialSecurity.codeTime);
                $('#getMsg').removeClass('cannt-click').text('重新获取');
                $('.codetime').html('请在<span style="color:red;">0秒</span>内输入验证码');
                statusY.hasYZM = false;
                $('#inp').removeAttr('disabled').val('');
                customerInfoY.USER_NO = "";
            }
        }, 1000)
    } else if (responseCode[0].results == '08') {
        //获取验证码
        var sendJson = {
            "b": [{
                "orgId.s": commonJson.orgId,
                "moduleId.s": socialSecurity.moduleId, //模块编号
                "tranId.s": socialSecurity.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": customerInfoY.MOBILEPHONE//手机号码debitEnter.tel
            }]
        };
        showLoader('获取中...');
        imessageAuthentionServiceFun(sendJson, function (msg) {
            imessageAuthentionServicesocialSecuritySucc(msg);
        }, function (err) {
            hideLoader();
            statusY.hasYZM = false;
            funFail(err);
            $('#getMsg').removeClass('cannt-click').text('重新获取');
        });
    } else {
        statusY.hasYZM = false;
        $('#getMsg').removeClass('cannt-click').text('重新获取');
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}

//验证码是否有效 成功回调
function  imessageAuthentionServiceYFunSocialSecuritySucc(msg) {
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
        customerInfoY.USER_NO = "";
        getPlatGlobalSeq(socialSecurity , function() {
            socialSecurityImgUpload(function(){ //影像插库完成后提交报文
                showLoader('签约提交..');
                // var againFun = arguments.callee;
                var sendJson = {
                    'b': [{
                        'deviceNo.s'        : commonJson.udId,//设备编号
                        'moduleId.s'        : socialSecurity.moduleId,//模块名
                        'tranId.s'          : socialSecurity.tranId,//交易名
                        'operatorNo.s'      : commonJson.adminCount,//机构号
                        'offlineOnline.s'   : commonJson.offlineOnline,//操作员
                        'workAddress.s'     : commonJson.workAddress,//工作地址
                        'JBRXM.s'           : commonJson.TLRNAME,//经办人姓名
                        'XM.s'              : custermerInfo.name,//姓名
                        //'XM.s'            :'吴丽珍',
                        'YHKH.s'            : socialSecurity.YHKH,//银行卡号
                        //'YHKH.s'          :'6230351601758671',
                        'ZJHM.s'            : custermerInfo.cerNO,//证件号
                        //'ZJHM.s'          :'440301194102174128',
                        'ZJLX.s'            : '0',//证件类型
                        'signature.s'       : socialSecurity.data, //用户签名
                        'JBRZH.s'           : commonJson.orgName,//机构名
                        'faceRecogn.s'      : socialSecurity.faceRecogn, //人脸识别状态
                        'platGlobalSeq.s'   : socialSecurity.platGlobalSeq,//客户流水号
                        'FILE_COUNT.s'      : '2',//文件上传数量
                        'CheckResult.s'     : lianwanghechaData.CheckResult,//联网核查结果
                        'ReviewUserId.s'    : lianwanghechaData.ReviewUserId,//人脸识别状态
                        "longitude.s"       : commonJson.longitude,//经度
                        "latitude.s"        : commonJson.latitude//纬度
                    }]
                };
                treatAssuranceFun(sendJson, function (msg) {
                    treatAssuranceSucc(msg, sendJson);
                }, function (err) {
                    treatAssuranceFail(err, sendJson);
                });
            });
        });
    } else if (responseCode[0].results == "08") {
        hideLoader();
        var sendJson = {
            "b": [{
                //"offlineOnline.s":creditJson.storage.offlineOnline,//脱机/联机
                "orgId.s": commonJson.orgId,
                "moduleId.s": socialSecurity.moduleId, //模块编号
                "tranId.s": socialSecurity.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
                "USER_NO.s": customerInfoY.USER_NO, //用户唯一标识
                "EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
                "MSG_INFO.s": customerInfoY.MSG_INFO, //动态口令
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": customerInfoY.MOBILENUM, //手机号码debitEnter.tel
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s": socialSecurity.storage.faceRecogn //人脸识别状态
            }]
        };
        imessageAuthentionServiceYFun(sendJson, function (msg) {
            imessageAuthentionServiceYFunSocialSecuritySucc(msg);
        }, function (err) {
            funFail(err);
        });
    } else {
        customerInfoY.USER_NO = "";
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}

//社保待遇的确认成功处理方法
function treatAssuranceSucc(msg, taSendJson){
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00' || responseCode[0].results == '13') {
        customerInfoY.pdfUrl = responseCode[0].pdfUrl
        // alert(customerInfoY.pdfUrl)
        if (lianwanghechaData.CheckResult == "09") {

        } else {
            //暂存本地数据库
            //暂存本地数据库
            cacheCustermerInfo({
                "databaseName": "myDatabase",
                "tableName": "customer_info",
                "data": [{
                    "ADMINCOUNT": commonJson.adminCount.toString(),//登陆账号
                    "SUBMITTIME": myTime.CurTime().toString(),//提交时间
                    "BUSINESSTYPE": '特色产品',//业务类型
                    "NATION": custermerInfo.nation,//民族
                    "CERTNUM": custermerInfo.cerNO,//身份证号码
                    "ADDRESS": custermerInfo.address,//地址
                    "MASCARDNAME": custermerInfo.name,//姓名
                    "CERTVALIDDATE": custermerInfo.cerExpdDt,//有效日期
                    "BIRTH": custermerInfo.birthday,//出生日期
                    "SEX": custermerInfo.sex,//性别
                    "ISSAUTHORITY": custermerInfo.issAuthority,//签发机关
                    "IMAGE": custermerInfo.image,//身份证头像图片
                    "CUSTANDCUSTOWNERPIC" : '',
                    "FRONTIDCARDPIC": socialSecurity.frontIDCardPic,//身份证正面
                    "BACKIDCARDPIC": socialSecurity.backIDCardPic,//身份证反面
                    "checkPhoto": custermerInfo.checkPhoto //联网核查图片
                }]
            });
        }
        //断点上传签名
        // saveAndUploadSignFileInfo(socialSecurity, '1', 's001');
        //断点上传影像
        // saveAndUploadPhotoFileInfo(socialSecurity, '2', 's002');
        changeUploadStatus("02", socialSecurity.phoneTime, socialSecurity.signTime);
        if (responseCode[0].results == '13'){
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {
                    'fun' : function(){
                        $.mobile.changePage('socialSecurity_complete.html', {transition: "slide"})
                    }
                }
            });
        } else {
            $.mobile.changePage('socialSecurity_complete.html', {transition: "slide"})
        }
        
    } else if(responseCode[0].results == '08') {
        // againFun();
        showLoader('签约提交..');
        treatAssuranceFun(taSendJson, function (msg) {
            treatAssuranceSucc(msg, taSendJson);
        }, function (err) {
            treatAssuranceFail(err, taSendJson);
        });
    }else if (responseCode[0].results == '09') {
        showTags({
            'title': '提示',
            'content': "业务处理超时!" + responseCode[0].message,
            'ok': {
                'title': '继续处理',
                'fun': function(){
                    // againFun();
                    showLoader('签约提交..');
                    treatAssuranceFun(taSendJson, function (msg) {
                        treatAssuranceSucc(msg, taSendJson);
                    }, function (err) {
                        treatAssuranceFail(err, taSendJson);
                    });
                }
            }
        });
    }else {
        changeUploadStatus("03", socialSecurity.phoneTime, socialSecurity.signTime);
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}

//社保待遇的确认失败处理方法
function treatAssuranceFail(err, taSendJson){
    hideLoader();
    //核查失败
    // err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    // var responseObj = JSON.parse(err);
    // var responseCode = responseObj.b[0].error[0];
    // if ($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
    //     responseCode.message = '当前网络不可用,请检测网络!';
    // }
    // if ($.trim(responseCode.message).toUpperCase() == 'THE REQUEST TIMED OUT') { //全部改成大写即可捕获
    //     responseCode.message = '系统超时,请重新操作!';
    // }
    showTags({
        'content': "业务处理超时!", //必输
        'ok': {
            'title' : '继续处理',
            'fun'   : function(){
                // againFun();
                showLoader('签约提交..');
                treatAssuranceFun(taSendJson, function (msg) {
                    treatAssuranceSucc(msg, taSendJson);
                }, function (err) {
                    treatAssuranceFail(err, taSendJson);
                });
            }
        }
    });
}

//社保待遇相关影响上传
function socialSecurityImgUpload(callback){
    showLoader("影像压缩中...");
    // 事件发布执行回调方法前，取订事件，避免重复发布
    var ussbCallback = function(){
        topicUtil.unsubscribe("socialSecurity/socialSecurityImgUpload");
        hideLoader();
        callback();
    };
    topicUtil.subscribe("socialSecurity/socialSecurityImgUpload", ussbCallback);
    var compressCount = 0;  //压缩成功次数,为2时完成压缩
    var phoneTime = myTime.CurTime();
    var signTime = phoneTime + 1;
    socialSecurity.phoneTime = phoneTime;
    socialSecurity.signTime = signTime;
    //保存并上传影像文件信息
    Meap.zipCompression(socialSecurity.platGlobalSeq + 'image', socialSecurity.picFileARR, function (msg) {
        //将要上传的影像插入到ios断点上传的数据库中
        //影像上传 业务参数
        var appBus = {
            'busiGloablaSeq': socialSecurity.platGlobalSeq,//业务编号
            'attchType': "2",//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': commonJson.udId,//设备编号
            'moduleId': socialSecurity.moduleId,//模块编号
            'tranId': socialSecurity.tranId,//交易编号
            'orgId': commonJson.orgId,//机构编号
            'operatorNo': commonJson.adminCount,//操作员
            'custName': custermerInfo.name,//客户名称
            'custCredType': '0',//客户证件类型
            'custCredNo': custermerInfo.cerNO,//客户证件号
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress//工作地址
        };
        appBus = JSON.stringify(appBus);
        var sendDataJson = {
            "databaseName": "myDatabase",
            "tableName": "up_download_info",
            "data": [{
                "fileToken": phoneTime,//文件唯一ID(可以为时间挫
                "pos": "0",//文件的断点信息(初始为0)
                "filePath": msg,//文件路径
                "appPath": "s002",//自定义文件路径
                "appBuss": appBus,//业务参数
                "downloadToken": "",//文件的下载ID(初始为空)
                "leng": "1",//文件的长度(初始为1)
                "isNotice": "yes", //是否调用后台(一直是yes)
                "fileType": "0",
                "REMARK1": "01" //上传状态01-默认
            }]
        };
        insertTableData(sendDataJson, function (msg) {
            if(++compressCount == 2){
                topicUtil.publish("socialSecurity/socialSecurityImgUpload");
            }
        }, function (err) {
            hideLoader();
            showTags({
                'title': '提示',
                'content': '数据库读写失败，请联系技术人员',
                'ok': {}
            });
        });
    }, function (err) {
        hideLoader();
        showTags({
            'title': '提示',
            'content': '影像压缩失败',
            'ok': {}
        });
    });
    //签名base64转路径
    Meap.transFormImage(socialSecurity.platGlobalSeq + 'sign', socialSecurity.data, 'picSty', function (msg) {
        //将要上传的签名插入到ios断点上传的数据库中
        //签名上传 业务参数
        var appBus = {
            'busiGloablaSeq': socialSecurity.platGlobalSeq,//业务编号
            'attchType': "1",//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': commonJson.udId,//设备编号
            'moduleId': socialSecurity.moduleId,//模块编号
            'tranId': socialSecurity.tranId,//交易编号
            'orgId': commonJson.orgId,//机构编号
            'operatorNo': commonJson.adminCount,//操作员
            'custName': custermerInfo.name,//客户名称
            'custCredType': '0',//客户证件类型
            'custCredNo': custermerInfo.cerNO,//客户证件号
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress//工作地址
        };
        appBus = JSON.stringify(appBus);
        var sendDataJson = {
            'databaseName': 'myDatabase',
            'tableName': 'up_download_info',
            'data': [{
                'fileToken': signTime,//文件唯一ID(可以为时间挫
                'pos': '0',//文件的断点信息(初始为0)
                'filePath': msg,//文件路径
                'appPath': "s001",//自定义文件路径
                'appBuss': appBus,//业务参数
                'downloadToken': '',//文件的下载ID(初始为空)
                'leng': '1',//文件的长度(初始为1)
                'isNotice': 'yes', //是否调用后台(一直是yes)
                "fileType":"1",
                "REMARK1": "01" //上传状态01-默认
            }]
        };
        insertTableData(sendDataJson, function (msg) {
            if(++compressCount == 2){
                topicUtil.publish("socialSecurity/socialSecurityImgUpload");
            }
        }, function (err) {
            hideLoader();
            showTags({
                'title': '提示',
                'content': '数据库读写失败，请联系技术人员',
                'ok': {}
            });
        });
    }, function (err) {
        hideLoader();
        showTags({
            'title': '提示',
            'content': '签名转换失败',
            'ok': {}
        });
    });
}