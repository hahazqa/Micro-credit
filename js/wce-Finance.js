/**
 * Created by lei on 4/29/16.
 * 理财风评 借口成功回调
 */
/**
 * lei
 * 此方法 主要是用来实现代码优化 减少代码量
 * @param url  图片路径
 * @param callback 回调函数
 * @param outputFormat 输出图片格式
 */
function ZLConvertImgToBase64(url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
}

/**
 * 联网核查 成功回调 公共方法
 * @param msg  成功报文
 * @param jsonObj  模块JSON 用于接收图片联网核查的BASE64图片
 * @param preUrl   上一步地址
 * @param nextUrl  下一步地址
 * @param nextFun 在联网核查异常时(即不存在联网核查照片),点击下一步操作
 * @param errFun  出现错误时 Function
 */
function icitizenCertificateIdenifyComSucc(msg,jsonObj,preUrl,nextUrl,nextFun,errFun) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        lianwanghechaData.CheckResult = responseBody[0].results;
        if (responseBody[1].citizenCertificateIdentifyVO[0].CHECKRESULT == "00") { //联网核查成功
            $(".common-read .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
            jsonObj.checkPhoto = base64decode(responseBody[1].citizenCertificateIdentifyVO[0].PHOTO); //联网核查返回照片
            $('.footter .previous:eq(1)').addClass('btn_next');
        } else {
            $(".common-read .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
        }
    } else if (responseBody[0].results == "08") {
        $(".common-read .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
    } else if (responseBody[0].results == "09") {
        $(".lianwanghecha-yichang").show();
        $(".common-read .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查异常！</div>');
        ZLConvertImgToBase64('../../images/09chaoshiyichang.png', function (base64Img) {
            jsonObj.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
        });
        lianwanghechaData.CheckResult = responseBody[0].results;
        $('.footter .previous:eq(1)').removeClass('btn_next');
    } else if (responseBody[0].results == "02") {
        lianwanghechaData.CheckResult = responseBody[0].results;
        $(".common-read .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
        ZLConvertImgToBase64('../../images/02yichang.png', function (base64Img) {
            jsonObj.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
        });
        $('.footter .previous:eq(1)').addClass('btn_next');
        showTags({
            'title': '提示',
            'content': '公民身份号码与姓名一致，但不存在照片，是否继续办理业务？',
            'ok': {
                'title': '放弃',
                'fun': function () {
                    $.mobile.changePage(preUrl, {transition: "slide"});
                }
            },
            'cancel': {
                'title': '继续',
                'fun': function () {

                    if(nextFun != ''){
                        //此处用于调用其他接口
                        nextFun();
                    }else{
                        $.mobile.changePage(nextUrl, {transition: "slide"});
                    }
                }
            }
        });
    } else {
        $(".common-read .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
       
            showTags({
                'title': '提示',
                'content': responseBody[0].message,
                'ok': {
                    fun:function () {
                        if(typeof errFun ==='function'){
                            errFun();
                        }
                    }
                }
            });
    }
}
/**
 * 查核心  仅适用于理财风评
 */
function icitizenCertificateIdenifyConF() {
    showLoader('客户信息查询中...');
    var sendJson = {
        "b": [{
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "orgId.s": commonJson.orgId,//机构号
            "moduleId.s": financeJson.moduleId,//模块编号
            "tranId.s": financeJson.tranId,//交易编号
            "operatorNo.s": commonJson.adminCount,//操作员
            "deviceNo.s": commonJson.udId,//设备编号
            "CLIENT_TYPE.s": "P",//客户类型 N组织 P个人
            "CARD.s": "",//卡号
            "ACCT_NO.s": "",//账号
            "CLIEMT_NO.s": "",//客户号
            "DOC_TYPE.s": "0",//证件类型
            "DOC_ID.s": custermerInfo.cerNO,//证件号
            "CLIENT_SHORT.s": "",//简称
            "BIRTH_DATE.s": "",//出生日
            "CELL_PHONE.s": "",//手机
            "PHONE.s": "",//住宅电话
            "LEGAL_REP.s": "",//法人代表
            "REVERSE_FLAG.s": "D",//证件号内部检查标志 默认D
            "CARD_CATEGORY.s": "2"//虚拟卡查核心标识 1
        }]
    };
    icustomerInfoServiceFun(sendJson, function (msg) {
        icustomerInfoServiceComSucc(msg, financeJson, 'Finance-reading.html', 'finance-character.html', sendJson, '');
    }, function (err) {
        funFail(err);
    });
}
/**
 * 人脸比对成功回调  公共   lei.
 * @param msg   成功报文
 * @param bussObj  业务模块对象
 * @constructor
 */
function iFacelRecognitionServiceComSucc(msg,bussObj) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == '0') {
        $('.personFace .previous:last').addClass('btn_next');
        bussObj.platGlobalSeq = responseBody[0].platGlobalSeq; //流水号
        bussObj.cardResult = responseBody[1].photoCompareVO[0].CARD_RESULT; //联网核查结果
        bussObj.chipResult = responseBody[1].photoCompareVO[0].CHIP_RESULT; //芯片结果
        if (responseBody[1].photoCompareVO[0].CHIP_RESULT == "0") { //芯片通过
            $(".personFace .face-result:eq(0)").text('通过');
        } else {
            $(".personFace .face-result:eq(0)").addClass('no-pass').text('未通过');
        }
        if (responseBody[1].photoCompareVO[0].CARD_RESULT == "0") { //联网核查通过
            $(".personFace .face-result:eq(1)").text('通过');
        } else {
            $(".personFace .face-result:eq(1)").addClass('no-pass').text('未通过');
        }
        if (responseBody[1].photoCompareVO[0].CHIP_RESULT == "0" && responseBody[1].photoCompareVO[0].CARD_RESULT == "0") {
            bussObj.isCompress = true; //远程复核成功
            bussObj.faceRecogn = '1'; //自动通过
            $(".personFace .center-header").text('人脸识别通过！');
            $("#managerList").hide();
        } else {
            bussObj.faceRecogn = '2'; //自动不通过
            $(".personFace .center-header").text('人脸识别未通过！');
            $('.personFace .previous:last').text('远程复核');
        }


    } else if (responseBody[0].results == '08') {
        hideLoader();
    } else {
        bussObj.faceRecogn = '2'; //自动不通过
        $(".personFace .face-result").addClass('no-pass').text('未通过');
        $(".personFace .center-header").text('人脸识别未通过！');
        $('.personFace .previous:last').addClass('btn_next').text('远程复核');
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}
/**
 * 查核心 成功回调 lei.
 * @param msg  成功报文
 * @param bussObj       每个模块的业务参数对象
 * @param preUrl        报错终止业务 跳转的路径
 * @param nextUrl       成功向下跳转的路径
 * @param sendJson      查询核心的上送报文
 * @param nextFunc      借口方法
 */
function icustomerInfoServiceComSucc(msg,bussObj,preUrl,nextUrl,sendJson,nextFunc) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        if ($.trim(responseBody[1].customerInfoVO[0].CH_CLIENT_NAME) != '' && $.trim(responseBody[1].customerInfoVO[0].CH_CLIENT_NAME) != custermerInfo.name) {
            showTags({
                'title': '提示',
                'content': '身份证姓名与核心姓名不一致,无法办理',
                'ok': {
                    fun: function () {
                        $.mobile.changePage(preUrl, {reverse: true});
                    }
                }
            });
            return;
        }
        bussObj.CLIENT_NO = responseBody[1].customerInfoVO[0].CLIENT_NO; //获取客户号
        bussObj.isCoreHas = bussObj.CLIENT_NO != "" ? true : false; //判断客户号是否为空
        if (bussObj.isCoreHas) { //如果核心有客户号 进行客户信息查询
            if(nextFunc !=''){
                nextFunc(bussObj,preUrl,nextUrl);
            }else{
                $.mobile.changePage(nextUrl, {reverse: true});
            }
        }else{
            showTags({
                'title': '提示',
                'content': '非我行客户,业务终止办理!',
                'ok': {
                    fun: function() {
                        $.mobile.changePage(preUrl, {reverse: true});
                    }
                }
            });
        }
    } else if (responseBody[0].results == "08") {
        showLoader('客户信息查询中...');
        icustomerInfoServiceFun(sendJson, function (msg) {
            icustomerInfoServiceComSucc(msg, financeJson, 'Finance-reading.html', 'finance-character.html', sendJson, '');
        }, function (err) {
            funFail(err);
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function() {
                    $.mobile.changePage(preUrl, {reverse: true});
                }
            }
        });
    }
    //21  存折过多 不能开卡
    //01  异常 查询核心异常
    //12  客户号大于1 不能开卡
    //00  ok
}




/*远程复核成功回调*/
function iissuesServiceComSucc(msg,jsonObj,nextUrl) {
    //var responseBody = responseBodySuccFormat(msg);
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00' || responseCode[0].results == '66') {
        jsonObj.tsReviewId = responseCode[0].tsReviewId;
        $(".ui-loader").append('<div id="loaderCancel" style="width:300px; height:40px; line-height:40px; text-align:center; border:1px solid #FFFFFF; position:absolute; bottom:220px; left:50%; margin-left:-150px;color: #FFFFFF;">放弃<span id="time-daojishi"></div>');
        var timeout = new Timeout('loaderCancel', 15);
        timeout.blocking('time-daojishi'); //spanid:延迟过程中显示ID
        localStorage.intervalID = timeout.getIntervalID();
        $("#loaderCancel").off('click').on('click', function () {
            jsonObj.telCheck = false;
            hideLoader();
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                    "workAddress.s": commonJson.workAddress, //工作地址
                    "orgId.s": commonJson.orgId, //机构号
                    "moduleId.s": jsonObj.moduleId, //模块编号
                    "tranId.s": jsonObj.tranId, //交易编号
                    "operatorNo.s": commonJson.adminCount, //操作员
                    "deviceNo.s": commonJson.udId, //设备编号
                    "tsReviewId.s": jsonObj.tsReviewId
                }]
            };
            iphotoServiceStopFun(sendJson, function (msg) {

            }, function (err) {

            });
            setTimeout(function () {
                hideLoader();
            }, 3500)
        });
        var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                "workAddress.s": commonJson.workAddress, //工作地址
                "orgId.s": commonJson.orgId, //机构号
                "moduleId.s": jsonObj.moduleId, //模块编号
                "tranId.s": jsonObj.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "tsReviewId.s": jsonObj.tsReviewId,
                "userIds.s": $('#managerList select').val() //用户ID
            }]
        };

        getTsRevieweleSignFun(sendJson, function (msg) {
            getTsRevieweleComtSucc(msg,jsonObj,nextUrl);
        }, function (err) {
            funFail(err);
        })
    } else if(responseCode[0].results == '08'){
        hideLoader();
    }else {
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}
/*远程复核获取客户经理列表*/
function ISysUserServiceManListComSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == '00') {
        var textHtml = '<option></option>';
        $.each(responseBody[1].TsReviewerVOs, function (index, el) {
            if (el.sysUserVO[0].onlineFlag != "1") return;
            textHtml += '<option realName="' + el.sysUserVO[0].realName + '" cellPhone="' + el.sysUserVO[0].cellPhone + '" value="' + el.sysUserVO[0].userId + '">' + el.sysUserVO[0].userId + el.sysUserVO[0].realName + '</option>';
        });
        $('#managerList select').html(textHtml).selectmenu('refresh');
    } else if (responseBody[0].results == '08') {
        hideLoader();
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
        $('#managerList select').html('<option></option>').selectmenu('refresh');
    }
}
/*远程复核查询  成功回调*/
function getTsRevieweleComtSucc(msg,jsonObj,nextUrl) {
    //var responseBody = responseBodySuccFormat(msg);
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (jsonObj.telCheck == false) return;
    if (responseCode[0].results == '00') {
        if (responseCode[0].status == '5') {
            hideLoader();
            showTags({
                'title': '提示',
                'content': '远程复核通过！',
                'ok': {
                    fun: function () {
                        jsonObj.isCompress = true;
                        jsonObj.faceRecogn = '3';
                        jsonObj.ReviewUserId = $('#managerList select').val();
                        lianwanghechaData.ReviewUserId = $('#managerList select').val();
                        $.mobile.changePage(nextUrl);
                    }
                }
            });
            clearInterval(localStorage.intervalID);
        } else if (responseCode[0].status == '2' || responseCode[0].status == '3') {
            setTimeout(function () {
                var sendJson = {
                    "b": [{
                        "deviceNo.s": commonJson.udId, //设备编号
                        "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                        "workAddress.s": commonJson.workAddress, //工作地址
                        "orgId.s": commonJson.orgId, //机构号
                        "moduleId.s": jsonObj.moduleId, //模块编号
                        "tranId.s": jsonObj.tranId, //交易编号
                        "operatorNo.s": commonJson.adminCount, //操作员
                        "tsReviewId.s": jsonObj.tsReviewId,
                        "userIds.s": $('#managerList select').val() //用户ID
                    }]
                };
                getTsRevieweleSignFun(sendJson, function (msg) {
                    getTsRevieweleComtSucc(msg,jsonObj,nextUrl);
                }, function (err) {
                    funFail(err);
                });
            }, 5000);
        } else {
            hideLoader();
            jsonObj.faceRecogn = '4'; //远程复核不通过
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {}
            });
            clearInterval(localStorage.intervalID);
        }
    } else if (responseCode[0].results == '08') {
        hideLoader();
    } else {
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}



/*客户风险等级查询   成功回调*/
function getRiskLevelSucc(msg){
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        financeJson.zRiskLevel = responseBody[1].riskLevelInquiryVO[0].RISK_LEVEL;
        financeJson.riskDate = responseBody[1].riskLevelInquiryVO[0].RISK_DATE;
        $('.msg_con').html(riskLevelOne[financeJson.zRiskLevel]);
        $('.msg_foot span').html(dataYearMonthData(financeJson.riskDate));
        $('.footter .previous:eq(1)').addClass('btn_next');
    }else if(responseBody[0].results == "03"){  //不存在客户风险评级
        financeJson.isCreateGrade = true;
        $('.msg_con').html('未评级');
        $('.msg_foot span').html('空');
        financeJson.riskLevel = '';
        financeJson.riskDate = '空';
        $('.footter .previous:eq(1)').addClass('btn_next');
    } else if(responseBody[0].results == "08"){
        showLoader('客户风险等级查询中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "orgId.s": commonJson.orgId,//机构号
                "moduleId.s": financeJson.moduleId,//模块编号
                "tranId.s": financeJson.tranId,//交易编号
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId,//设备编号
                "ACCT_TYPE.s": "1",//客户表示类型 0--入账账号  1--客户号  2--证件号  3--卡号  默认使用1
                "ACCT_NO.s": "",//账号
                "CLIENT_NO.s": financeJson.CLIENT_NO,//客户号
                "CLIENT_NAME.s":custermerInfo.name,//客户名称
                "DOCUMENT_TYPE..s":'0',//证件类型
                "DOCUMENT_ID.s":custermerInfo.cerNO,//证件号码
                "CUST_TYPE_ID.s":'',//客户分组
                "CLIENT_TYPE.s":'1',//客户类型 0--机构  1--个人
                "OFFSET.s":'',//定位串
                "QUERY_NUM.s":'',//查询行数
                "PRO_MANAGER.s":''//产品管理人
            }]
        };
        getRiskLevelFun(sendJson, function (msg) {
            getRiskLevelSucc(msg);
        }, function (err) {
            funFail(err);
        })
    } else{
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun:function () {
                    $.mobile.changePage('Finance-reading.html', {reverse: true});
                }
            }
        });
    }
}
/*调查问卷 成功回调*/
function getAssessQuestionSucc(msg){
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        financeJson.questCache = true;
        financeJson.AssessQuestion= responseBody;
        financeJson.paperNo = responseBody[1].assessQuestionInquiryVO[0].PAPER_NO;
        questionToPage(financeJson.AssessQuestion);
    }else if(responseBody[0].results == "08"){
        showLoader("问卷获取中...");
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "orgId.s": commonJson.orgId,//机构号
                "moduleId.s": financeJson.moduleId,//模块编号
                "tranId.s": financeJson.tranId,//交易编号
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId,//设备编号
                "CLIENT_NAME.s":custermerInfo.name,//客户名称
                "DOCUMENT_TYPE.s":'0',//证件类型
                "DOCUMENT_ID.s":custermerInfo.cerNO,//证件号码
                "CLIENT_TYPE.s":'1',//客户类型
                "CUST_TYPE_ID.s":'',//客户分组
                "PAPER_TYPE.s":'0',//问卷类型 默认0风险等级卷子
                "OFFSET.s":'',//定位串
                "QUERY_NUM.s":'',//查询行数
                "ENABLE_FLAG.s":'',//启用标识 默认 1-启用
                "PAPER_NO.s":''//问卷编号
            }]
        };
        getAssessQuestionFun(sendJson,function (msg) {
            getAssessQuestionSucc(msg);
        },function (err) {
            funFail(err);
        })
    }else{
        financeJson.questCache = false;
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}

function getAssessResultSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        financeJson.lastScore = responseBody[1].assessQuestionResultVO[0].LAST_SCORE; //分数
        financeJson.riskLevel = responseBody[1].assessQuestionResultVO[0].RISK_LEVEL;  //等级
        financeJson.riskMonth = responseBody[1].assessQuestionResultVO[0].RISK_MONTHS;  //问卷风评 有效期
        //financeJson.riskDate = AddMonths(myTime.curDate(),financeJson.riskMonth);
        $.mobile.changePage('./Finance-confirm.html', {transition: "slide"});
    }else if(responseBody[0].results == "08"){
        showLoader("问卷提交中...");
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "orgId.s": commonJson.orgId,//机构号
                "moduleId.s": financeJson.moduleId,//模块编号
                "tranId.s": financeJson.tranId,//交易编号
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId,//设备编号
                "ACCT_TYPE.s":'1',//客户表示类型 0--入帐账号  1--客户号  2--证件号  3--卡号  默认使用1
                "ACCT_NO.s":'',//账卡号
                "CLIENT_NO.s":financeJson.CLIENT_NO,//客户号
                "CLIENT_NAME.s":custermerInfo.name,//客户名称
                "DOCUMENT_TYPE.s":'0',//证件类型
                "DOCUMENT_ID.s":custermerInfo.cerNO,//证件号码
                "CLIENT_TYPE.s":'1',//客户类型
                "CUST_TYPE_ID.s":'',//客户分组
                "PAPER_TYPE.s":'0',//问卷类型 默认0风险等级卷子
                "ACC_NO.s":'',//银行账号
                "CUSTNO.s":'',//客户号
                "PAPER_NO.s":financeJson.paperNo,//试卷编号
                "QUESTION_LIST.s":financeJson.qTitle.join(','),//选中题干题目号列表  以,分割
                "SCORE_LIST.s":'',//每个题目被选择项的分数  以,分割
                "OPTION_LIST.s":financeJson.qAnswer.join(',')//没个题目被选择的项  以,分割 如果题目为复选题目各个复选中的选项之间用|分割
            }]
        };
        getAssessResultFun(sendJson,function (msg) {
            getAssessResultSucc(msg);
        },function (err) {
            funFail(err);
        });
    }else{
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}

//理财客户签约  成功回调
function autoClientSignSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        financeJson.pdfUrl = responseBody[0].pdfUrl;
        if(lianwanghechaData.CheckResult =='00' ||lianwanghechaData.CheckResult =='02'){
            cacheCustermerInfo({
                "databaseName": "myDatabase",
                "tableName": "customer_info",
                "data": [{
                    "ADMINCOUNT": commonJson.adminCount,//登陆账号
                    "SUBMITTIME": myTime.CurTime(),//提交时间
                    "BUSINESSTYPE": "理财风评",//业务类型
                    "NATION": custermerInfo.nation,//民族
                    "CERTNUM": custermerInfo.cerNO,//身份证号码
                    "ADDRESS": custermerInfo.address,//地址
                    "MASCARDNAME": custermerInfo.name,//姓名
                    "CERTVALIDDATE": custermerInfo.cerExpdDt,//有效日期
                    "BIRTH": custermerInfo.birthday,//出生日期
                    "SEX": custermerInfo.sex,//性别
                    "ISSAUTHORITY": custermerInfo.issAuthority,//签发机关
                    "IMAGE": custermerInfo.image,//身份证头像图片
                    "CUSTANDCUSTOWNERPIC": '',//与客户合影照片
                    "FRONTIDCARDPIC": financeJson.frontIDCardPic,//身份证正面
                    "BACKIDCARDPIC": financeJson.backIDCardPic,//身份证反面
                    "checkPhoto": financeJson.checkPhoto //联网核查图片
                }]
            });
        }
        // cacheAndImageAndSign();
        changeUploadStatus("02", financeJson.phoneTime, financeJson.signTime);
        if (responseBody[0].results == '13') {//业务处理成功后台报错弹窗
            showTags({
                'title': '提示',
                'content': responseBody[0].message,
                'ok': {
                    fun: function () {
                        $.mobile.changePage('./Finance-complete.html', {transition: "slide"});
                    }
                }
            });
        } else {
            $.mobile.changePage('./Finance-complete.html', {transition: "slide"});
        }
    }else if(responseBody[0].results == "08"){
        financeSubmit();
    }else if(responseBody[0].results == "09"){
        showTags({
            'title': '提示',
            'content': "业务处理超时!" + responseBody[0].message,
            'ok': {
                title: '继续处理',
                fun: function() {
                    // cacheAndImageAndSign();
                    changeUploadStatus("02", financeJson.phoneTime, financeJson.signTime);
                    $.mobile.changePage('./Finance-reading.html', {reverse: true});
                }
            }
        });
    }else{
        changeUploadStatus("03", financeJson.phoneTime, financeJson.signTime);
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}

//(废弃)
function updateRiskLevelSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        financeJson.pdfUrl = responseBody[0].pdfUrl;
        if(lianwanghechaData.CheckResult =='00' ||lianwanghechaData.CheckResult =='02'){
            cacheCustermerInfo({
                "databaseName": "myDatabase",
                "tableName": "customer_info",
                "data": [{
                    "ADMINCOUNT": commonJson.adminCount,//登陆账号
                    "SUBMITTIME": myTime.CurTime(),//提交时间
                    "BUSINESSTYPE": "理财风评",//业务类型
                    "NATION": custermerInfo.nation,//民族
                    "CERTNUM": custermerInfo.cerNO,//身份证号码
                    "ADDRESS": custermerInfo.address,//地址
                    "MASCARDNAME": custermerInfo.name,//姓名
                    "CERTVALIDDATE": custermerInfo.cerExpdDt,//有效日期
                    "BIRTH": custermerInfo.birthday,//出生日期
                    "SEX": custermerInfo.sex,//性别
                    "ISSAUTHORITY": custermerInfo.issAuthority,//签发机关
                    "IMAGE": custermerInfo.image,//身份证头像图片
                    "CUSTANDCUSTOWNERPIC": '',//与客户合影照片
                    "FRONTIDCARDPIC": financeJson.frontIDCardPic,//身份证正面
                    "BACKIDCARDPIC": financeJson.backIDCardPic,//身份证反面
                    "checkPhoto": financeJson.checkPhoto //联网核查图片
                }]
            });
        }
        // cacheAndImageAndSign();
        if (responseBody[0].results == '13') {//业务处理成功后台报错弹窗
            showTags({
                'title': '提示',
                'content': responseBody[0].message,
                'ok': {
                    fun: function () {
                        $.mobile.changePage('./Finance-complete.html', {transition: "slide"});
                    }
                }
            });
        } else {
            $.mobile.changePage('./Finance-complete.html', {transition: "slide"});
        }
    }else if(responseBody[0].results == "08"){
        showLoader('客户风险等级提交中...');
        var bodyJson = {
            "b": [{
                "fileData.s":financeJson.data, //签名文件
                "FILE_COUNT.s":'2',//文件上传数量
                "faceRecogn.s":financeJson.faceRecogn,//人脸识别状态
                "BussinessCode.s":'01', //联网核查 业务类型
                "CheckResult.s": lianwanghechaData.CheckResult,//身份证联网核查结果
                "platGlobalSeq.s":financeJson.platGlobalSeq,//流水号
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "orgId.s": commonJson.orgId,//机构号
                "moduleId.s": financeJson.moduleId,//模块编号
                "tranId.s": financeJson.tranId,//交易编号
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId,//设备编号
                "ACCT_TYPE.s": "1",//客户表示类型 0--入账账号  1--客户号  2--证件号  3--卡号  默认使用1
                "ACCT_NO.s": "",//账号
                "CLIENT_NO.s": financeJson.CLIENT_NO,//客户号
                "CLIENT_NAME.s": custermerInfo.name,//客户名称
                "DOCUMENT_TYPE..s": '0',//证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO,//证件号码
                "CUST_TYPE_ID.s": '',//客户分组
                "CLIENT_TYPE.s": '1',//客户类型 0--机构  1--个人
                "ACC_NO.s":'',//银行账号
                "PASSWORD.s":'',//交易密码
                "RISK_LEVEL.s":financeJson.riskLevel,//风险等级
                "RISK_NAME.s":riskLevelOne[financeJson.riskLevel],//风险等级名称
                "RISK_MONTHS.s":financeJson.riskDate,//风险又想起月数
                "CHANNEL_ABLE_FLAG.s":'',//高风险产品柜台以外渠道允许购买标识
                "PRD_MANAGER.s":'',//产品管理人
                "LAST_SCORE.s":financeJson.lastScore//风险评估总分
            }]
        };
        updateRiskLevelFun(bodyJson,function (msg) {
            updateRiskLevelSucc(msg);
        },function (err) {
            funFail(err);
        });
    }else{
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}
/**
 * 理财提交数据
 */
function financeSubmit() {
    showLoader('客户风险等级提交中...');
    var sendJson = {
        "b": [{
            "longitude.s":commonJson.longitude,//经度
            "latitude.s":commonJson.latitude,//纬度
            "fileData.s":financeJson.data, //签名文件
            "FILE_COUNT.s":'2',//文件上传数量
            "faceRecogn.s":financeJson.faceRecogn,//人脸识别状态
            "BussinessCode.s":'01', //联网核查 业务类型
            "CheckResult.s": lianwanghechaData.CheckResult,//身份证联网核查结果
            "platGlobalSeq.s":financeJson.platGlobalSeq,//流水号
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "orgId.s": commonJson.orgId,//机构号
            "moduleId.s": financeJson.moduleId,//模块编号
            "tranId.s": financeJson.tranId,//交易编号
            "operatorNo.s": commonJson.adminCount,//操作员
            "deviceNo.s": commonJson.udId,//设备编号
            "ACCT_TYPE.s": "1",//客户表示类型 0--入账账号  1--客户号  2--证件号  3--卡号  默认使用1
            "ACCT_NO.s": "",//账号
            "CLIENT_NO.s": financeJson.CLIENT_NO,//客户号
            "CLIENT_NAME.s": custermerInfo.name,//客户名称
            "DOCUMENT_TYPE..s": '0',//证件类型
            "DOCUMENT_ID.s": custermerInfo.cerNO,//证件号码
            "CUST_TYPE_ID.s": '',//客户分组
            "CLIENT_TYPE.s": '1',//客户类型 0--机构  1--个人
            "ACC_NO.s":'',//银行账号
            "OPEN_BRAN.s":commonJson.orgId,//开卡机构   和orgId上送的一样
            "CUSTNO.s":'',//客户编号
            "PASSWORD.s":'',//交易密码
            "BROKER_ID.s":'',//客户经理代码代码
            "RISK_LEVEL.s":financeJson.riskLevel,//风险等级
            "RISK_NAME.s":riskLevelOne[financeJson.riskLevel],//风险等级名称
            "RISK_MONTHS.s":financeJson.riskMonth,//风险又想起月数
            "CHANNEL_ABLE_FLAG.s":'',//高风险产品柜台以外渠道允许购买标识
            "RESERVE2.s":'0',//附加信息  0--不需要  1--需要  默认0
            "LAST_SCORE.s":financeJson.lastScore,//风险评估总分
            "CARD_TYPE.s":''//卡种
        }]
    };
    autoClientSignFun(sendJson,function (msg) {
        autoClientSignSucc(msg);
    },function (err) {
        hideLoader();
        err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(err);
        var responseCode = responseObj.b[0].error[0];
        if ($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
            responseCode.message = '业务处理超时!';
        }
        if ($.trim(responseCode.message).toUpperCase() == 'THE REQUEST TIMED OUT') { //全部改成大写即可捕获
            responseCode.message = '业务处理超时!';
        }
        showTags({
            'title': '提示',
            'content': responseCode.message,
            'ok': {
                title: '继续处理',
                fun: function() {
                    // cacheAndImageAndSign();
                    changeUploadStatus("02", financeJson.phoneTime, financeJson.signTime);
                    $.mobile.changePage('./Finance-reading.html', {reverse: true});
                }
            }
        });
    });
}

/**
 *  理财 影像复用  上传影像
 *  callback - 插入数据库完成后触发的回调方法
 */
function cacheAndImageAndSign(callback) {
    showLoader("影像压缩中...");
    // 事件发布执行回调方法前，取订事件，避免重复发布
    var ussbCallback = function(){
        topicUtil.unsubscribe("finance/cacheAndImageAndSign");
        callback();
    };
    topicUtil.subscribe("finance/cacheAndImageAndSign", ussbCallback);
    var compressCount = 0;  //压缩成功次数,为2时完成压缩
    //存储个人信息
    var phoneTime = myTime.CurTime();
    var signTime = phoneTime + 1;
    financeJson.phoneTime = phoneTime;
    financeJson.signTime = signTime;
    var imageArr = [financeJson.custFacePic,financeJson.frontIDCardPic,financeJson.backIDCardPic];
    Meap.zipCompression(financeJson.platGlobalSeq + 'image', imageArr, function (msg) {
        //将要上传的影像插入到ios断点上传的数据库中
        //影像上传 业务参数
        var appBus = {
            'busiGloablaSeq': financeJson.platGlobalSeq,//业务编号
            'attchType': '2',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': financeJson.udId,//设备编号
            'moduleId': financeJson.moduleId,//模块编号
            'tranId': financeJson.tranId,//交易编号
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
                "appPath": "f004",//自定义文件路径
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
                topicUtil.publish("finance/cacheAndImageAndSign");
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
    Meap.transFormImage(financeJson.platGlobalSeq + 'sign', financeJson.data, 'picSty', function (msg) {
        //将要上传的签名插入到ios断点上传的数据库中
        //签名上传 业务参数
        var appBus = {
            'busiGloablaSeq': financeJson.platGlobalSeq,//业务编号
            'attchType': '1',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': financeJson.udId,//设备编号
            'moduleId': financeJson.moduleId,//模块编号
            'tranId': financeJson.tranId,//交易编号
            'orgId': financeJson.orgId,//机构编号
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
                'appPath': 'f003',//自定义文件路径
                'appBuss': appBus,//业务参数
                'downloadToken': '',//文件的下载ID(初始为空)
                'leng': '1',//文件的长度(初始为1)
                'isNotice': 'yes', //是否调用后台(一直是yes)
                "fileType": "1",
                "REMARK1": "01" //上传状态01-默认
            }]
        };
        insertTableData(sendDataJson, function (msg) {
            if(++compressCount == 2){
                topicUtil.publish("finance/cacheAndImageAndSign");
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