/**
 * Created by lei on 5/13/16.
 */

function findOrdersFaceSignConF(){
    findOrdersFaceSignFun(loanFaceSign.ctbussinessDetail, function (msg) {
        findOrdersFaceSignSucc(msg);
    }, function (err) {
        hideLoader();
        showTags({
            'title': '提示',
            'content': '系统超时,是否继续?',
            'ok': {
                'title':'放弃',
                fun: function () {
                    loanFaceSign.isContractNo = false;
                    $.mobile.changePage('faceSign-reading.html', {reverse: true});
                }
            },
            'cancel': {
                'title': '继续',
                fun: function () {
                    showLoader('合同号查询中...');
                    setTimeout(function () {
                        findOrdersFaceSignConF();
                    },300);
                }
            }
        });
    });
}

//合同号查询
function findOrdersFaceSignSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    var textHtml = '';
    if (responseBody[0].results == '00') {  //借口处理成功
        if (responseBody.length < 2) {
            textHtml += '<p style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</p>';
            $('.customerPVideo .box-content').html(textHtml);
        } else {
            $.each(responseBody, function (index, val) {
                if (index == 0) {
                    return;
                }
                textHtml += '<li class="box-rows" flag="'+val.contractVO[0].FLAG+'" clientNo="' + val.contractVO[0].CLIENT_NO + '" contractSerialno="' + val.contractVO[0].CONTRACT_SERIALNO + '">' +
                    '<div>' + val.contractVO[0].CONTRACT_NO + '</div>' +
                    '<div>' + val.contractVO[0].CUSTOMER_NAME + '</div>' +
                    '<div>' + idCardType[val.contractVO[0].DOCUMENT_TYPE] + '</div>' +
                    '<div>' + val.contractVO[0].DOCUMENT_ID + '</div>' +
                    '<div>' + fmoney(val.contractVO[0].ORIG_LOAN_AMT) + '</div>' +
                    '<div>' + val.contractVO[0].LOAN_TERM + '</div>' +
                    '</li>';
            });
            $('.customerPVideo .box-content').empty().html(textHtml);
            //为每条数据添加'click' class 选择使用点击的数据
            $(".box-content").on('tap', function (ev) {
                var oTarget = ev.target;
                var _this = $(oTarget).closest('.box-rows');
                $(_this).addClass('click').siblings().removeClass('click');
                $('.footter .previous:eq(1)').addClass('btn_next');
            });
            //分页
            $(".customerPVideo .page-number-con").createPage({
                pageCount: Math.ceil(responseBody[0]['totalNum.i'] / 7),
                current: loanFaceSign.ctbussinessDetailPg,
                backFn: function (p) {
                    showLoader('客户信息查询中...');
                    loanFaceSign.ctbussinessDetail.b[0]["page.s"] = String(p - 1);
                    loanFaceSign.ctbussinessDetailPg = p;
                    findOrdersFaceSignFun(loanFaceSign.ctbussinessDetail, function (msg) {
                        findOrdersFaceSignSucc(msg);
                    }, function (err) {
                        funFail(err);
                    })
                }
            });
        }
    } else if (responseBody[0].results == '03') {
        textHtml = '<p style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</p>';
        $('.customerPVideo .box-content').html(textHtml);
    } else if (responseBody[0].results == '08') { //session 失效
        hideLoader();
        showLoader('合同号查询中...');
        findOrdersFaceSignConF();
    } else if(responseBody[0].results == '09'){
        hideLoader();
        showTags({
            'title': '提示',
            'content': '系统超时,是否继续?',
            'ok': {
                'title':'放弃',
                fun: function () {
                    loanFaceSign.isContractNo = false;
                    $.mobile.changePage('faceSign-reading.html', {reverse: true});
                }
            },
            'cancel': {
                'title': '继续',
                fun: function () {
                    showLoader('合同号查询中...');
                    findOrdersFaceSignConF();
                }
            }
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function () {
                    loanFaceSign.isContractNo = false;
                    $.mobile.changePage('faceSign-reading.html', {reverse: true});
                }
            }
        });
    }
}
function findRolesFaceSignConF() {
    showLoader('信息查询中...');
    var sendJson = {      //发送请求的参数
        "b": [{
            "deviceNo.s": commonJson.udId, //设备编号
            "moduleId.s": loanFaceSign.moduleId, //模块编号
            "tranId.s": loanFaceSign.tranId, //交易编号
            "orgId.s": commonJson.orgId,//机构号
            "operatorNo.s": commonJson.adminCount,//操作员
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "CONTRACT_NO.s": loanFaceSign.contractNo   //合同号
        }]
    };
    findRolesFaceSignFun(sendJson, function (msg) {
        findRolesFaceSignSucc(msg);
    }, function (err) {
        hideLoader();
        showTags({
            'title': '提示',
            'content': '系统超时,是否继续?',
            'ok': {
                'title':'放弃',
                fun: function () {
                    loanFaceSign.isContractNo = false;
                    $.mobile.changePage('faceSign-reading.html', {reverse: true});
                }
            },
            'cancel': {
                'title': '继续',
                fun: function () {
                    showLoader('信息查询中...');
                    setTimeout(function () {
                        findRolesFaceSignConF();
                    },300);
                }
            }
        });
    });
}
//角色信息查询
function findRolesFaceSignSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == '00') {  //借口处理成功
        loanFaceSign.roleArr = responseBody[1].contractInfoVO[1].ARRAY;
        loanFaceSign.contractSerialNo = responseBody[1].contractInfoVO[0].CONTRACT_SERIALNO;  //合同流水号
        loanFaceSign.flag = responseBody[1].contractInfoVO[0].FLAG; //标记
        if(loanFaceSign.flag == '1'){
            $('.msg_box').eq(1).find('.ple').html('请勾选需补充验证客户');
            $('.msg_box').eq(2).find('.ple').html('已完成补充验证客户');
        }else{
            $('.msg_box').eq(1).find('.ple').html('请勾选在场未验证客户');
            $('.msg_box').eq(2).find('.ple').html('已完成验证客户');
        }
        loanFaceSign.isFirst = true;
        findRolesFaceSignOption(loanFaceSign.roleArr);
    } else if (responseBody[0].results == '08') { //session 失效
        hideLoader();
        findRolesFaceSignConF();
    }else if(responseBody[0].results == '09'){
        hideLoader();
        showTags({
            'title': '提示',
            'content': '系统超时,是否继续?',
            'ok': {
                'title':'放弃',
                fun: function () {
                    loanFaceSign.isContractNo = false;
                    $.mobile.changePage('faceSign-reading.html', {reverse: true});
                }
            },
            'cancel': {
                'title': '继续',
                fun: function () {
                    findRolesFaceSignConF();
                }
            }
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function () {
                    loanFaceSign.isContractNo = false;
                    $.mobile.changePage('faceSign-reading.html', {reverse: true});
                }
            }
        });
    }
}

/**
 * 远程复核  贷款面签
 * @param msg
 * @param jsonObj
 */
function iissuesServiceLoanFaceSignSucc(msg,jsonObj) {
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
            getTsRevieweleComtSignSucc(msg,jsonObj);
        }, function (err) {
            funFail(err);
        })
    }else if(responseCode[0].results == '08'){
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

/**
 * 远程复核成功回调  贷款面签
 * @param msg
 * @param jsonObj
 */
function getTsRevieweleComtSignSucc(msg,jsonObj) {
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
                        loanFaceSign.isCachePage.isFacePic = false;
                        if(loanFaceSign.noOption.length == 1){  //说明签名只勾选了一个人
                            loanFaceSign.groupRole.push(loanFaceSign.temp);
                            $.mobile.changePage('faceSign-audio.html', {transition: "slide"});
                        }else{
                            if(loanFaceSign.curOption == loanFaceSign.noOption.length-1){  //判断循环是否到了最后一个
                                loanFaceSign.groupRole.push(loanFaceSign.temp);
                                $.mobile.changePage('faceSign-audio.html', {transition: "slide"});
                            }else{
                                loanFaceSign.curOption++;
                                loanFaceSign.groupRole.push(loanFaceSign.temp);
                                $.mobile.changePage('faceSign-perReading.html', {reverse: true});
                            }
                        }
                        
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
                    getTsRevieweleComtSignSucc(msg,jsonObj);
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


/*面签成功回调*/
function signAContractFaceSign(event,compressCount){
    if(!compressCount || compressCount != 1){
        return;
    }
    showLoader('信息提交中...');
    // 事件发布执行回调方法前，取订事件，避免重复发布
    topicUtil.unsubscribe("faceSign/signAContractFaceSign");
    var citizens = [];// 角色的证件类型、证件号码、姓名、联网核查状态和人脸识别状态
    var mFaceRecogn = '1';//主申请人
    var mCheckResult = '';
    $.each(loanFaceSign.roleArrObj,function (index,ele) {
       if(ele.faceRecogn =='3'){  //远程复核状态  手动通过
           mFaceRecogn = '3';
       }
        if(ele.CheckResult =='09'){
            mCheckResult = '09';
        }
        var roleObj = {
            custName:ele.name, //姓名
            custCredType:'0',//证件类型
            custCredNo:ele.cerNO,  //证件号码
            checkResult:ele.CheckResult,//联网核查状态
            tsReviewerId:ele.ReviewUserId,//远程复核用户
            faceRecognition:ele.faceRecogn//人脸识别状态
        };
        citizens.push(roleObj);
    });
    citizens = JSON.stringify(citizens);
    var crmPhoto = '1';
    if(loanFaceSign.flag == '1'){
        crmPhoto = '0'
    }
    var sendJson = {
        "b": [{
            "citizens.s":citizens,// 角色的证件类型、证件号码、姓名、联网核查状态、人脸识别状态和远程复核用户
            "FILE_COUNT.s":'1',//文件上传数量
            "BussinessCode.s":'01', //联网核查 业务类型
            "CheckResult.s": mCheckResult,//身份证联网核查结果
            "CLIENT_NAME.s":loanFaceSign.loanName,//客户姓名
            "DOCUMENT_ID.s":loanFaceSign.documentId,//证件号
            "DOCUMENT_TYPE.s":'Ind01',//证件类型
            "faceRecogn.s":mFaceRecogn,//人脸识别状态
            "platGlobalSeq.s":loanFaceSign.platGlobalSeq,//流水号
            "longitude.s":commonJson.longitude,//经度
            "latitude.s":commonJson.latitude,//纬度
            "deviceNo.s": commonJson.udId, //设备编号
            "moduleId.s": loanFaceSign.moduleId, //模块编号
            "tranId.s": loanFaceSign.tranId, //交易编号
            "orgId.s": commonJson.orgId,//机构号
            "operatorNo.s": commonJson.adminCount,//操作员
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "CONTRACT_NO.s": loanFaceSign.contractNo,  //合同号
            "FLAG.s":loanFaceSign.flag, //标识
            "crmLog.s":'1',
            "crmPhoto.s":crmPhoto,
            "BUS_NO.s": loanFaceSign.contractSerialNo //合同流水号
        }]
    };
    signAContractFaceSignFun(sendJson,function (msg) {
        signAContractFaceSignSucc(msg,event,compressCount);
    },function (err) {
        hideLoader();
        showTags({
            'title': '提示',
            'content': '业务处理超时!',
            'ok': {
                title: '继续处理',
                fun: function() {
                    setTimeout(function () {
                        signAContractFaceSign(event,compressCount);
                    },300);
                }
            }
        });
    });
}

function signAContractFaceSignSucc(msg,event,compressCount) {
    var responseBody = responseBodySuccFormat(msg);
    var sql = "";
    if (responseBody[0].results == '00' || responseBody[0].results == "13") {
        //提交成功,修改数据库中对应压缩包的上传状态
        changeUploadStatus("02", loanFaceSign.phoneTime);
        if(responseBody[0].results == "13"){   //联网核查超时
            showTags({
                'title': '提示',
                'content': responseBody[0].message,
                'ok': {
                    fun: function () {
                        $.mobile.changePage('faceSign-complete.html', {transition: "slide"});
                    }
                }
            });
        }else{
            $.mobile.changePage('faceSign-complete.html', {transition: "slide"});
        }

    }else if(responseBody[0].results == '08'){
        hideLoader();
        signAContractFaceSign(event,compressCount);
    }else if(responseBody[0].results == '09'){
        hideLoader();
        showTags({
            'title': '提示',
            'content': '业务处理超时!&nbsp;'+responseBody[0].message,
            'ok': {
                title: '继续处理',
                fun: function() {
                    setTimeout(function () {
                        signAContractFaceSign(event,compressCount);
                    },300);
                }
            }
        });
    }else{
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function () {}
            }
        });
    }

}

function findRolesFaceSignOption(arr) {
    if (arr.length < 1) {
        showTags({
            'title': '提示',
            'content': '没有查询到符合条件的数据!',
            'ok': {
                fun: function () {
                    loanFaceSign.isContractNo = false;
                    $.mobile.changePage('faceSign-reading.html', {reverse: true});
                }
            }
        });
    }
    var textHtml = '';

    $.each(arr, function (index, ele) {
        if(ele.custRoleVO[0].DOCUMENT_TYPE !='Ind01') {  //不是身份证
            showTags({
                'title': '提示',
                'content': ''+roleType[ele.custRoleVO[0].CUSTOMER_ROLE]+' '+ele.custRoleVO[0].CUSTOMER_NAME+' 证件类型不是身份证,暂无法办理面签!',
                'ok': {
                    fun:function () {
                        loanFaceSign.isContractNo = false;
                        $.mobile.changePage('faceSign-reading.html', {reverse: true});
                    }
                }
            });
            return false;
        }
        if(loanFaceSign.isFirst){
            ele.custRoleVO[0].arrNum =index;
        }
        textHtml += '<li arrNum="'+ele.custRoleVO[0].arrNum+'">' +
            '<div>' + roleType[ele.custRoleVO[0].CUSTOMER_ROLE] + '</div>' +
            '<div>' + ele.custRoleVO[0].CUSTOMER_NAME + '</div>' +
            '<div>' + idCardType[ele.custRoleVO[0].DOCUMENT_TYPE] + '</div>' +
            '<div class="colTty">' + ele.custRoleVO[0].DOCUMENT_ID + '</div>' +
            '<img class="op_y" src="../../images/ic_agree.png" alt="">' +
            '<img class="op_n" src="../../images/ic_disagree.png" alt="">' +
            '</li>';
        // }
    });
    $('#faceSign-choseT .op_box').html(textHtml);
    $('.op_box li').on('click', function () {
        if ($(this).children(".op_y").css("display") == "none") {   //未选中
            $(this).attr('isselected', true).children(".op_y").show().siblings(".op_n").hide();
            if ($('[isselected= true]').length == $('.op_box li').length) {
                $('.op_header').children(".op_y").show().siblings(".op_n").hide();
            }
        } else {   //选中态
            $(this).attr('isselected', false).children(".op_n").show().siblings(".op_y").hide();
            if ($('[isselected= true]').length != $('.op_box li').length) {
                $('.op_header').children(".op_n").show().siblings(".op_y").hide();
            }
        }
    });
    //为所有的添加事件
    $('.op_header').on('click', function () {
        if ($(this).children(".op_y").css("display") == "none") {   //未选中
            $('.op_box li').attr('isselected', true).children(".op_y").show().siblings(".op_n").hide();
            $(this).children(".op_y").show().siblings(".op_n").hide();
        } else {
            $('.op_box li').attr('isselected', false).children(".op_n").show().siblings(".op_y").hide();
            $(this).children(".op_n").show().siblings(".op_y").hide();
        }
    })
}
function CopyCustermerInfo(mgObj) {
    mgObj.role = loanFaceSign.curRoleNum;//身份角色
    mgObj.nation = custermerInfo.nation;
    mgObj.cerNO = custermerInfo.cerNO;
    mgObj.address = custermerInfo.address;
    mgObj.name = custermerInfo.name;
    mgObj.cerExpdDt = custermerInfo.cerExpdDt;
    mgObj.birthday = custermerInfo.birthday;
    mgObj.sex = custermerInfo.sex;
    mgObj.issAuthority = custermerInfo.issAuthority;
    mgObj.image = custermerInfo.image;   //身份证照片
    mgObj.lianPic = custermerInfo.checkPhoto;  //联网核查照片
    mgObj.isCustermerInfoMultiplex = false;     //默认情况下是没有影响复用的
    mgObj.CheckResult = lianwanghechaData.CheckResult;  //联网核查的状态
}

//暂存数据
function loanFaceZanCunCustomerInfo() {
    var sendDataJson = {
        "databaseName": "myDatabase",
        "tableName": "loanapply_info",
        "data": [{
            'organCode':loanFaceSign.isContractNo ,   //  loanFaceSign.isContractNo 是否是刷身份证进入的
            'modifiable':loanFaceSign.contractNo,     //  合同号
            'proType':loanFaceSign.documentType,      //贷款证件类型
            'isPicturePage':loanFaceSign.loanAMT,   //贷款金额
            'ispeiPicturePage':loanFaceSign.loanTerm,  //贷款期限
            'inputLogo':loanFaceSign.contractSerialNo,  //贷款合同流水号
            'isInputChange': loanFaceSign.flag,        // 贷款标识
            'mCLIENT_NO': '',    //贷款证件号码
            'BUSINESSTYPE': '面签',
            'TEMPFROM': 'faceSign-choseT.html',
            'YWXS': loanFaceSign.contractNo,//业务线索----->暂定合同号
            'SUBMITTIME': myTime.CurTime(),
            'buildArr': JSON.stringify(loanFaceSign.roleArr),   //初始角色列表
            'accountArr': JSON.stringify(loanFaceSign.groupOption),      //已验证的角色的分组信息以及(录音和场景照片)
            //基础的
            'mfaceRecogn':'',
            'gfaceRecogn':'',
            'mCheckResult':'',
            'gCheckResult':'',
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress,//工作地址
            'moduleId': loanFaceSign.moduleId, //模块编号
            'tranId': loanFaceSign.tranId, //交易编号
            'operatorNo': commonJson.adminCount, //操作员
            'deviceNo': commonJson.udId, //设备编号
            'orgId': commonJson.orgId,
            'isLoanMaster':'',  //设置
            //主借人 --- 证件信息
            'misTrue': '',  //存在
            'mNation': '', //
            'mcerNo': loanFaceSign.documentId,
            'maddress': '',
            'proCODE':'',     //刷身份证姓名
            'mname': loanFaceSign.loanName,//贷款姓名
            'mcerExpdDt': '',
            'mbirthday': '',
            'msex': '',
            'missAuthority': '',
            'mimage': '',
            'mMGCompareFace': JSON.stringify(loanFaceSign.roleArrObj), //已验证的角色的个人信息
            //配偶身份证信息
            'gisTrue': commonJson.longitude,  //经度
            'gNation': commonJson.latitude, //纬度
            'gcerNo': '',
            'gaddress': '',
            'gname': '',
            'gcerExpdDt': '',
            'gbirthday': '',
            'gsex': '',
            'gissAuthority': '',
            'gimage': '',
            'gMGCompareFace': ''
        }]
    };
    if(loanFaceSign.isContractNo == false){
        sendDataJson.data[0].mNation = loanFaceSign.nation;
        sendDataJson.data[0].mCLIENT_NO = loanFaceSign.cerNO; //主申请人
        sendDataJson.data[0].maddress = loanFaceSign.address;
        sendDataJson.data[0].proCODE = loanFaceSign.name;
        sendDataJson.data[0].mcerExpdDt = loanFaceSign.cerExpdDt;
        sendDataJson.data[0].mbirthday = loanFaceSign.birthday;
        sendDataJson.data[0].msex = loanFaceSign.sex;
        sendDataJson.data[0].missAuthority = loanFaceSign.issAuthority;
        sendDataJson.data[0].mimage =  loanFaceSign.image;
    }
    insertTableData(sendDataJson, function (msg) {
    }, function (err) {
        showMsg('存储个人信息失败' + err);
    });

}

function getLoanFaceTempORPreToObject(obj) {
    if (obj.organCode == '0') { //是否刷身份证进入
        loanFaceSign.isContractNo = false;
    } else {
        loanFaceSign.isContractNo = true;
    }
    if(loanFaceSign.isContractNo == false){
        loanFaceSign.nation = obj.nation;
        loanFaceSign.cerNO = obj.mCLIENT_NO; //主申请人
        loanFaceSign.address = obj.maddress;
        loanFaceSign.name = obj.proCODE;
        loanFaceSign.cerExpdDt = obj.mcerExpdDt;
        loanFaceSign.birthday = obj.mbirthday;
        loanFaceSign.sex = obj.msex;
        loanFaceSign.issAuthority = obj.missAuthority;
        loanFaceSign.image = obj.mimage;
    }
    commonJson.latitude = obj.gisTrue; //经度
    commonJson.latitude = obj.gNation; //纬度
    loanFaceSign.contractNo = obj.modifiable;//合同号
    loanFaceSign.documentType = obj.proType;     //贷款证件类型
    loanFaceSign.loanAMT = obj.isPicturePage;   //贷款金额
    loanFaceSign.loanTerm = obj.ispeiPicturePage;  //贷款期限
    loanFaceSign.contractSerialNo = obj.inputLogo;  //贷款合同流水号
    loanFaceSign.flag = obj.isInputChange;       // 贷款标识
    loanFaceSign.documentId = obj.mcerNo;   //贷款证件号码
    loanFaceSign.roleArr = JSON.parse(obj.buildArr);   //初始角色列表
    loanFaceSign.groupOption = JSON.parse(obj.accountArr);      //已验证的角色的分组信息以及(录音和场景照片)
    loanFaceSign.loanName = obj.mname;//贷款姓名
    loanFaceSign.roleArrObj =  JSON.parse(obj.mMGCompareFace); //已验证的角色的个人信息
    //身份证照片
    if(!loanFaceSign.isContractNo){  //刷身份证进入
        var namMImg = obj.mimage.lastIndexOf('\/') +1;
        var checkNameP = obj.mimage.substring(namMImg);
        loanFaceSign.image = MT_path + checkNameP;
    }
    //面部照片 And 身份证照片
    for(var i =0;i< loanFaceSign.roleArrObj.length;i++){
        if(loanFaceSign.roleArrObj[i].custFacePic != ''){
            var elIFPic = loanFaceSign.roleArrObj[i].custFacePic.lastIndexOf('\/') + 1;
            var fileNFPic = loanFaceSign.roleArrObj[i].custFacePic.substring(elIFPic);
            loanFaceSign.roleArrObj[i].custFacePic = MT_path +fileNFPic;
        }else{
            loanFaceSign.roleArrObj[i].custFacePic = '';
        }
        if(loanFaceSign.roleArrObj[i].image !=''){
            var elIMPic = loanFaceSign.roleArrObj[i].image.lastIndexOf('\/') + 1;
            var fileNMPic = loanFaceSign.roleArrObj[i].image.substring(elIMPic);
            loanFaceSign.roleArrObj[i].image = MT_path +fileNMPic;
        }else{
            loanFaceSign.roleArrObj[i].image = '';
        }
    }
    //场景照片 And 录音文件
    for(var p =0;p< loanFaceSign.groupOption.length;p++){
        for(var q = 0;q<loanFaceSign.groupOption[p].screenPic.length;q++){
            if(loanFaceSign.groupOption[p].screenPic[q] !=''){
                var elISPic = loanFaceSign.groupOption[p].screenPic[q].lastIndexOf('\/') + 1;
                var fileNSPic = loanFaceSign.groupOption[p].screenPic[q].substring(elISPic);
                loanFaceSign.groupOption[p].screenPic[q] = MT_path +fileNSPic;
            }else{
                loanFaceSign.groupOption[p].screenPic[q] = '';
            }
        }
        if(loanFaceSign.groupOption[p].audio != ''){
            var elIAPic = loanFaceSign.groupOption[p].audio.lastIndexOf('\/') + 1;
            var fileNAPic = loanFaceSign.groupOption[p].audio.substring(elIAPic);
            loanFaceSign.groupOption[p].audio = MT_path +fileNAPic;
        }else{
            loanFaceSign.groupOption[p].audio = '';
        }
    }

}