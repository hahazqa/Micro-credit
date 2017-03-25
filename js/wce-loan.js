/**
 * Created by lei on 1/8/16.
 */
/*处理响应体--格式化*/
function responseBodySuccFormat(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    return responseCode;
}

/*人行征信搜索成功回调*/
function findCreditReportInquirySucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == '00') {  //借口处理成功
    	$('#credit-search .tixing-zoushitu li').remove();
        $.each(responseBody, function (index, val) {
        	if(index == 0){
        		return;
        	}
        	var data = val.creditInquiry[0];
            data.expList = val.creditInquiry[1].expList;
            var li = $('<li>').data('creditInfo', data);
            li.append($('<div>').html(data.name));
            li.append($('<div>').html(data.certNum));
            li.append($('<div>').html(data.inquiryDate.split(' ')[0]));
            li.append($('<div>').html(creditTypeJson[data.creditType]));
            li.append($('<div>').html(yesOrNoJson[data.supplementInd]));
            li.append($('<div>').html(creditStatusResult[data.status]));
            $('#credit-search .tixing-zoushitu').append(li);
        });
        //重置按钮
        $('.loan .footter div:last').removeClass('btn_next');
        $('.loan .footter div:first').removeClass('back-1');
        $('#supplementBtn').addClass('btn-unclick');
        /*点击 click list*/
        $(".loan .tixing-zoushitu>li").on("click", function () {
//          var navigation = $('.tixing-zoushitu>li').index($(this));
            $(this).addClass("list-bgcolor").siblings("li").removeClass("list-bgcolor");
            loan.fileType = '001';   //文件类型  ---> 001 征信文件
            $('.loan .footter div:first').addClass('back-1');
            loan.creditInfo = $(this).data('creditInfo');
            loan.lcStatus = loan.creditInfo.status;
            if(loan.creditInfo.createdBy == commonJson.adminCount && loan.lcStatus != '-3'){
            	$('.loan .footter div:first').addClass('back-1');
            } else {
            	$('.loan .footter div:first').removeClass('back-1');
            }
            if (loan.lcStatus != '0' && loan.lcStatus != '-3') {  //查询中  记录空状态
                loan.isCreaditorBank = true;
                loan.creditErrRea = loan.creditInfo.remark;  //失败原因
                loan.creditReferPath = loan.creditInfo.creditReferPath;  //文件路径
                $('.loan .footter div:last').addClass('btn_next');
            } else {
                $('.loan .footter div:last').removeClass('btn_next');
            }
            if(loan.creditInfo.supplementInd == '1'){
            	$('#supplementBtn').removeClass('btn-unclick');
            	$('.loan .footter div:first').removeClass('back-1');
            } else {
            	$('#supplementBtn').addClass('btn-unclick');
            }
        });
        //分页
        $("#credit-search .page-number-con").createPage({
            pageCount: Math.ceil(responseBody[0]['totalNum.i'] / 7),
            current: loan.ctbussinessDetailPg,
            backFn: function (p) {
                showLoader('客户信息查询中...');
                loan.ctbussinessDetail.b[0]["page.s"] = String(p);
                loan.ctbussinessDetailPg = p;
                findCreditReportInquiryFun(loan.ctbussinessDetail, function (msg) {
                    findCreditReportInquirySucc(msg);
                }, function (err) {
                    funFail(err);
                })
            }
        });
    } else if (responseBody[0].results == '03') {
    	//重置按钮
        $('.loan .footter div:last').removeClass('btn_next');
        $('.loan .footter div:first').removeClass('back-1');
        $('#supplementBtn').addClass('btn-unclick');
        $('#credit-search .tixing-zoushitu li').remove();
        $('#credit-search .tixing-zoushitu').append($('<li>').css({
        	'line-height': '40px',
        	'margin-top': '30px',
        	'text-align': 'center',
        	'background': 'none'
        }).html('未查询到业务数据'));
    } else if (responseBody[0].results == '08' || responseBody[0].results == '09') { //session 失效
        //findCreditReportInquiryConF(loan.ctbussinessDetail);
        showLoader('客户信息查询中...');
        findCreditReportInquiryFun(loan.ctbussinessDetail, function (msg) {
            findCreditReportInquirySucc(msg);
        }, function (err) {
            funFail(err);
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}

/*人行征信删除成功回调*/
function delCreditReportInquirySucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == '00') { // 删除成功!
        showLoader('客户信息查询中...');
        //var aboutJson = {      //发送请求的参数
        //    "b": [{
        //        "deviceNo.s": commonJson.udId, //设备编号
        //        "moduleId.s": loan.moduleId, //模块编号
        //        "tranId.s": '100',//loan.tranId, //交易编号
        //        "orgId.s": commonJson.orgId,//机构号
        //        "operatorNo.s": commonJson.adminCount,//操作员
        //        "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
        //        "workAddress.s": commonJson.workAddress,//工作地址
        //        "inquiryDateMin.s": dateYYYYMMDD(dateGetYMD(1)[0]),    //申请日期开始
        //        "inquiryDateMax.s": dateYYYYMMDD(dateGetYMD(1)[0]),      //申请日期结束
        //        "name.s": '', //姓名
        //        "certNum.s": '',  //证件号码
        //        "status.s": '',   //状态
        //        "page.s": loan.ctbussinessDetailPg //页码
        //    }]
        //};
        findCreditReportInquiryFun(loan.ctbussinessDetail, function (msg) {
            findCreditReportInquirySucc(msg);
        }, function (err) {
            funFail(err);
        });
    } else if (responseBody[0].results == '08') {
        hideLoader();
        showLoader('客户信息删除中...');
        var removeJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId1, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "seqNum.s": loan.creditInfo.seqNum,  //流水号
                "userId.s": commonJson.adminCount   //工号
            }]
        };
        delCreditReportInquiryFun(removeJson, function (msg) {
            delCreditReportInquirySucc(msg);
        }, function (err) {
            funFail(err);
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}

/*个人征信新查询成功回调*/
function createCreditReportInquirySucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == '00') {
        showTags({
            'title': '提示',
            'content': '人行征信系统查询请求已提交,请稍后查看结果!',
            'ok': {
                fun: function () {
                    $.mobile.changePage('./credit-search.html', {
                        reverse: true
                    });
                }
            }
        });
    } else if (responseBody[0].results == '06') {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'cancel': {
                'title': '确认',
                fun: function () {
                    showLoader('客户信息查询中...');
                    var createJson = {      //发送请求的参数
                        "b": [{
                            "deviceNo.s": commonJson.udId, //设备编号
                            "moduleId.s": loan.moduleId, //模块编号
                            "tranId.s": loan.tranId1, //交易编号
                            "orgId.s": commonJson.orgId,//机构号
                            "operatorNo.s": commonJson.adminCount,//操作员
                            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                            "workAddress.s": commonJson.workAddress,//工作地址
                            "name.s": $('.input-test-con:last').val(), //姓名
                            "certType.s": $('#c-com-property option:selected').val(), //证件类型
                            "certNum.s": $('.input-test-con:first').val(),  //证件号码
                            "needQueryCreditReport.s": $('#needQueryCredit').val(), //是否需要查询征信报告
                            "signature.s": loan.creditData,   //签名文件
                            'loginUser.s': commonJson.losUserId,//Los用户
                            'superOrgId.s': commonJson.superOrgId, //一级机构
                            'enforced.s': '1' //  强制查询
                        }]
                    };
                    createCreditReportInquiryFun(createJson, function (msg) {
                        createCreditReportInquirySucc(msg);
                    }, function (err) {
                        funFail(err);
                    });
                }
            },
            'ok': {
                'title': '放弃',
                'fun': function () {
                }
            }
        });
    } else if (responseBody[0].results == '08') {
        hideLoader();
        showLoader('客户信息查询中...');
        var createJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId1, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "name.s": $('.input-test-con:last').val(), //姓名
                "certType.s": $('#c-com-property option:selected').val(), //证件类型
                "certNum.s": $('.input-test-con:first').val(),  //证件号码
                "needQueryCreditReport.s": $('#needQueryCredit').val(), //是否需要查询征信报告
                "signature.s": loan.creditData,   //签名文件
                'loginUser.s': commonJson.losUserId, //Los用户
                'superOrgId.s': commonJson.superOrgId, //一级机构
                'enforced.s': '0' //  强制查询
            }]
        };
        createCreditReportInquiryFun(createJson, function (msg) {
            createCreditReportInquirySucc(msg);
        }, function (err) {
            funFail(err);
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}

/*银行对账单查询成功回调---------->对账单界面*/
function findStatementSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    $('#bank-bill .head-seach-input').val('');//输入框内容制空
    var textHtml = '<div class="bank-bill-title com-title"><div>客户姓名</div><div>查询时间</div><div>证件类型</div><div style="width: 20%;">证件号码</div><div style="width: 20%;">卡/账号</div><div>查询结果</div></div>';
    if (responseBody[0].results == '00') {  //借口处理成功
        $.each(responseBody, function (index, val) {
            if (index == 0) {
                return;
            }
            textHtml += '<li  inquiryDate="' + val.bkStatementInquiry[0].inquiryDate + '" lcseqNum="' + val.bkStatementInquiry[0].seqNum + '" lcStatus="' + val.bkStatementInquiry[0].status + '" creditReferPath="' + val.bkStatementInquiry[0].bkstFile + '" remark="' + val.bkStatementInquiry[0].remark + '">' +
                '<div>' + val.bkStatementInquiry[0].name + '</div>' +
                '<div>' + val.bkStatementInquiry[0].inquiryDate.split(' ')[0] + '</div>' +
                '<div>' + certTypeObj[val.bkStatementInquiry[0].certType] + '</div>' +
                '<div style="width: 20%;">' + val.bkStatementInquiry[0].certNum + '</div>' +
                '<div style="width: 20%;">' + val.bkStatementInquiry[0].account + '</div>' +
                '<div>' + statusResultObj[val.bkStatementInquiry[0].status] + '</div>' +
                '</li>';
        });
        $('#bank-bill .bank-bill-con').empty();
        $('#bank-bill .bank-bill-con').html(textHtml);
        //
        $('.loan .footter div:first').removeClass('back-1');
        $('.loan .footter div:last').removeClass('btn_next');
        /*点击 click list*/
        $(".loan .bank-bill-con>li").on("click", function () {
            var navigation = $('.bank-bill-con>li').index($(this));
            $(this).addClass("list-bgcolor").siblings("li").removeClass("list-bgcolor");
            $('.loan .footter div:first').addClass('back-1');
            loan.fileType = '002';  //对账单 --->002 自定义的
            loan.lcStatus = $(this).attr('lcStatus');
            if (loan.lcStatus != '0' && loan.lcStatus != '-3') {  // 查询中 记录空
                loan.isCreaditorBank = false;
                loan.creditErrRea = $(this).attr('remark');  //失败原因
                loan.creditReferPath = $(this).attr('creditReferPath');  //文件路径
                $('.loan .footter div:last').addClass('btn_next');
            } else {
                $('.loan .footter div:last').removeClass('btn_next');
            }
        });
        //分页
        $("#bank-bill .page-number-con").createPage({
            pageCount: Math.ceil(responseBody[0]['totalNum.i'] / 7),
            current: loan.ctbussinessDetailPg,
            backFn: function (p) {
                showLoader('客户信息查询中...');
                loan.ctbussinessDetail.b[0]["page.s"] = String(p);
                loan.ctbussinessDetailPg = p;
                findStatementFun(loan.ctbussinessDetail, function (msg) {
                    findStatementSucc(msg);
                }, function (err) {
                    funFail(err);
                })
            }
        });
    } else if (responseBody[0].results == '03') {
    	$('.loan .footter div:first').removeClass('back-1');
        $('.loan .footter div:last').removeClass('btn_next');
        textHtml += '<p style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</p>';
        $('#bank-bill .bank-bill-con').html(textHtml);
    } else if (responseBody[0].results == '08') { //session 失效
        hideLoader();
        findStatementFun(loan.ctbussinessDetail, function (msg) {
            findStatementSucc(msg);
        }, function (err) {
            funFail(err);
        });
    } else if (responseBody[0].results == '09') {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function () {
                    findStatementFun(loan.ctbussinessDetail, function (msg) {
                        findStatementSucc(msg);
                    }, function (err) {
                        funFail(err);
                    });
                }
            }
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}
//人行征信搜索成功回调-------->主流程
function loanFindCreditReportInquirySucc(msg) {
    hideLoader();
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == '00') {  //借口处理成功
        $(".searchCredit ul").empty();
        $.each(responseBody, function (index, val) {
            if (index == 0) {
                return;
            }
            var data = val.creditInquiry[0];
            data.expList = val.creditInquiry[1].expList;
            var creditFile = "";
            $.each(data.creditReferPath.split(';'), function(index, path){
            	var fileName = path.split('/');
            	creditFile += fileName[fileName.length - 1] + ',';
            });
            var li = $('<li>').data('creditInfo', data);
            li.append($('<div>').css('width', '20%').html(data.inquiryDate.split(' ')[0]));
            li.append($('<div>').css('width', '20%').html(creditTypeJson[data.creditType]));
            li.append($('<div>').css({'width':'50%', 'overflow-x':'auto'}).append($('<u>').html(creditFile.substr(0, creditFile.length - 1))));
            li.append($('<div>').css('width', '10%').append($('<img>').addClass('dzdImg').attr('src', '../../images/ic_sqwc.png')));
            $(".searchCredit ul").append(li);
        });
        
        $(".searchCredit").show();
        /*点击 click list*/
        $(".searchCredit ul>li div:last-child").on("click", function () {
            var diaPlay = $(this).find('.dzdImg').css('display');
            if (diaPlay == 'none') {
                $(this).find('.dzdImg').css('display', 'block');
                $(this).closest('li').attr('sel', 'true');
            } else {
                $(this).find('.dzdImg').css('display', 'none');
                $(this).closest('li').attr('sel', 'false');
            }
        });
    } else if (responseBody[0].results == '08') { //
        showLoader("征信报告查询中...");
        var inquiryDate = dateGetYMD(30);//查询30天内的征信文件
        var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId1, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "inquiryDateMin.s": dateYYYYMMDD(inquiryDate[1]),    //申请日期开始
                "inquiryDateMax.s": dateYYYYMMDD(inquiryDate[0]),      //申请日期结束
                "name.s": loan.mInfo.name, //姓名
                "certNum.s": loan.mInfo.cerNO,  //证件号码
                "status.s": '1,3',   //状态(成功和不需查询征信报告)
                "page.s": '' ,    //页码
                "username.s":'',
                'creditType.s': '',	//征信类型
	            'supplementInd.s': '' //是否允许补查
            }]
        };
        findCreditReportInquiryFun(sendJson, function (msg) {
            loanFindCreditReportInquirySucc(msg);
        }, function (err) {
            hideLoader();
            funFail(err);
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}
/*银行对账单查询成功回调-------->主流程*/
function findStatementMainSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == '00') {  //借口处理成功
        var textHtml = '';
        $.each(responseBody, function (index, val) {
            if (index == 0) {
                return;
            }
            var fileName = val.bkStatementInquiry[0].bkstFile.split('/');
            fileName = fileName[fileName.length - 1];
            textHtml += '<li sel="false" lcseqNum="' + val.bkStatementInquiry[0].seqNum + '" lcStatus="' + val.bkStatementInquiry[0].status + '" creditReferPath="' + val.bkStatementInquiry[0].bkstFile + '" remark="' + val.bkStatementInquiry[0].remark + '">' +
                '<div style="width: 12%">' + val.bkStatementInquiry[0].name + '</div>' +
                '<div style="width: 15%">' + val.bkStatementInquiry[0].inquiryDate.split(' ')[0] + '</div>' +
                '<div style="width: 20%;">' + val.bkStatementInquiry[0].account + '</div>' +
                '<div style="width: 43%"><u>' + fileName + '</u></div>' +
                '<div style="width: 10%" ><img class="dzdImg" src="../../images/ic_sqwc.png" alt=""></div>' +
                '</li>';
        });
        $('#loan-cusInfo .searchBank ul').empty();
        $('#loan-cusInfo .searchBank ul').html(textHtml);
        $("#loan-cusInfo .searchBank").show();
        /*点击 click list*/
        $("#loan-cusInfo .searchBank ul>li div:last-child").on("click", function () {
            var diaPlay = $(this).find('.dzdImg').css('display');
            if (diaPlay == 'none') {
                $(this).closest('li').attr('sel', 'true');
                $(this).find('.dzdImg').css('display', 'block');
                $("#loan-cusInfo .searchBank a:last").addClass('btn_next');
            } else {
                $(this).closest('li').attr('sel', 'false');
                $(this).find('.dzdImg').css('display', 'none');
                if ($('#loan-cusInfo .searchBank ul>li[sel=false]').length < 1) {
                    $("#loan-cusInfo .searchBank a:last").removeClass('btn_next');
                }
            }
        });
    } else if (responseBody[0].results == '08') { //
        hideLoader();
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}
/*银行对账单查询成功回调-------->进度查询*/
function findStatementAddDataSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    console.log(responseBody);
    if (responseBody[0].results == '00') {  //借口处理成功
        var textHtml = '';
        $.each(responseBody, function (index, val) {
            if (index == 0) {
                return;
            }
            var fileName = val.bkStatementInquiry[0].bkstFile.split('/');
            fileName = fileName[fileName.length - 1];
            textHtml += '<li sel="false" lcseqNum="' + val.bkStatementInquiry[0].seqNum + '" lcStatus="' + val.bkStatementInquiry[0].status + '" creditReferPath="' + val.bkStatementInquiry[0].bkstFile + '" remark="' + val.bkStatementInquiry[0].remark + '">' +
                '<div style="width: 12%">' + val.bkStatementInquiry[0].name + '</div>' +
                '<div style="width: 15%">' + val.bkStatementInquiry[0].inquiryDate.split(' ')[0] + '</div>' +
                '<div style="width: 20%;">' + val.bkStatementInquiry[0].account + '</div>' +
                '<div style="width: 43%"><u>' + fileName + '</u></div>' +
                '<div style="width: 10%" ><img class="dzdImg" src="../../images/ic_sqwc.png" alt=""></div>' +
                '</li>';
        });
        $('.searchBank ul').empty();
        $('.searchBank ul').html(textHtml);
        $(".searchBank").show();
        /*点击 click list*/
        $(".searchBank ul>li div:last-child").on("click", function () {
            var diaPlay = $(this).find('.dzdImg').css('display');
            if (diaPlay == 'none') {
                $(this).closest('li').attr('sel', 'true');
                $(this).find('.dzdImg').css('display', 'block');
                // $("#addData .searchBank a:last").addClass('btn_next');
            } else {
                $(this).closest('li').attr('sel', 'false');
                $(this).find('.dzdImg').css('display', 'none');
                // if ($('#addData .searchBank ul>li[sel=false]').length < 1) {
                //     $("#addData .searchBank a:last").removeClass('btn_next');
                // }
            }
        });
    } else if (responseBody[0].results == '08') { //
        hideLoader();
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}
/*银行对账单删除成功回调*/
function delStatementSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == '00') { // 删除成功!
        showLoader('客户信息查询中...');
        //var aboutJson = {      //发送请求的参数
        //    "b": [{
        //        "deviceNo.s": commonJson.udId, //设备编号
        //        "moduleId.s": loan.moduleId, //模块编号
        //        "tranId.s": '100',//loan.tranId, //交易编号
        //        "orgId.s": commonJson.orgId,//机构号
        //        "operatorNo.s": commonJson.adminCount,//操作员
        //        "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
        //        "workAddress.s": commonJson.workAddress,//工作地址
        //        "inquiryDateMin.s": '',//dateYYYYMMDD(dateGetYMD(10)[1]),    //申请日期开始
        //        "inquiryDateMax.s": '',//dateYYYYMMDD(dateGetYMD(10)[0]),      //申请日期结束
        //        "name.s": '', //姓名
        //        "certNum.s": '',  //证件号码
        //        "status.s": '',   //状态
        //        "page.s":''+loan.ctbussinessDetailPg  //页码
        //    }]
        //};
        //loan.ctbussinessDetailPg = '1';
        findStatementFun(loan.ctbussinessDetail, function (msg) {
            findStatementSucc(msg);
        }, function (err) {
            funFail(err);
        });
    } else {
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}
/*银行对账单新查询成功回调*/
function createStatementSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == '00') { // 新查询成功!
        showTags({
            'title': '提示',
            'content': '对账单查询请求已提交,请稍后查看结果!',
            'ok': {
                fun: function () {
                    $.mobile.changePage('./bank-bill.html', {
                        reverse: true
                    });
                }
            }
        });
    } else if (responseBody[0].results == '08') {
        hideLoader();
        showLoader('对账单查询中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId2, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "name.s": $('#bank-newBill .input-test-con:eq(1)').val(),//姓名
                "certType.s": $('#c-com-property option:selected').val(),//证件类型
                "certNum.s": $('#bank-newBill .input-test-con:eq(0)').val(),//证件号码
                "account.s": $("#bank-newBill #cardAccount option:selected").val(),//账号
                "acctType.s": '20',//账户类型 20-huoqi 30-dingqi
                "currency.s": '000',//币种 000-人民币  344-港币  840-美元
                //"loginUser.s":'',//LOS用户
                "startDate.s": dateYYYYMMDD($("#bank-newBill input[type='date']:first").val()),//开始时间
                "endDate.s": dateYYYYMMDD($("#bank-newBill input[type='date']:last").val())//结束时间
            }]
        };
        createStatementFun(sendJson, function (msg) {
            createStatementSucc(msg);
        }, function (err) {
            funFail(err);
        })
    } else if (responseBody[0].results == '09') {
        showTags({
            'title': '提示',
            'content': '',
            'ok': {
                fun: function () {
                    showLoader('对账单查询中...');
                    var sendJson = {
                        "b": [{
                            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                            "workAddress.s": commonJson.workAddress,//工作地址
                            "moduleId.s": loan.moduleId, //模块编号
                            "tranId.s": loan.tranId2, //交易编号
                            "operatorNo.s": commonJson.adminCount, //操作员
                            "deviceNo.s": commonJson.udId, //设备编号
                            "orgId.s": commonJson.orgId,
                            "name.s": $('#bank-newBill .input-test-con:eq(1)').val(),//姓名
                            "certType.s": $('#c-com-property option:selected').val(),//证件类型
                            "certNum.s": $('#bank-newBill .input-test-con:eq(0)').val(),//证件号码
                            "account.s": $("#bank-newBill #cardAccount option:selected").val(),//账号
                            "acctType.s": '20',//账户类型 20-huoqi 30-dingqi
                            "currency.s": '000',//币种 000-人民币  344-港币  840-美元
                            //"loginUser.s":'',//LOS用户
                            "startDate.s": dateYYYYMMDD($("#bank-newBill input[type='date']:first").val()),//开始时间
                            "endDate.s": dateYYYYMMDD($("#bank-newBill input[type='date']:last").val())//结束时间
                        }]
                    };
                    createStatementFun(sendJson, function (msg) {
                        createStatementSucc(msg);
                    }, function (err) {
                        funFail(err);
                    })
                }
            }
        });

    } else {
        showTags({
            'title': '提示',
            'content': '对账单查询请求出错,请稍后再次查询!',
            'ok': {
                fun: function () {
                }
            }
        });
    }
}
/*银行对账单查核心询成功回调*/
function icustomerInfoServiceBankSucc(msg) {
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
        // if (responseBody[0].results == "00") {
        loan.bankCLIENT_NO = responseCode[1].customerInfoVO[0].CLIENT_NO; //获取客户号
        loan.isCoreHas = loan.bankCLIENT_NO != "" ? true : false; //判断客户号是否为空
        if (loan.isCoreHas) {
            //核心有客户信息
            // showLoader("银行对账单查核心询成功回调...");
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                    "workAddress.s": commonJson.workAddress, //工作地址
                    "orgId.s": commonJson.orgId, //机构号
                    "moduleId.s": loan.moduleId, //模块编号
                    "tranId.s": loan.tranId2, //交易编号
                    "operatorNo.s": commonJson.adminCount, //操作员
                    "deviceNo.s": commonJson.udId, //设备编号
                    "CLIENT_NO.s": loan.bankCLIENT_NO, //客户号debitEnter.CLIENT_NO   0700358223
                    "AGENT_FLAG.s": "", //法人代表
                    "CLIENT_TYPE.s": "P" //N单位 P个人
                }]
            };
            IEstablishCustomerInformationServiceFFun(sendJson, function (msg) {
                IEstablishCustomerInformationServiceBankSucc(msg);
            }, function (err) {
                funFail(err);
            })
        } else {
            hideLoader();
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {}
            });
        }
    } else if(responseCode[0].results == '08') {
        
    } else {
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}
/*维护客户信息成功回调*/
function IEstablishCustomerInformationServiceBankSucc(msg) {
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
        //客户号查询客户信息成功  返显信息 PHR  PHM
        loan.xTel = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[1].contactInfo[0].CONTACT_ID); //手机号码
        var cusName = $('#bank-newBill .input-test-con:eq(1)').val();
        if ($.trim(responseCode[1].clientDescVO[0].CH_GIVEN_NAME) != $.trim(cusName)) {
            hideLoader();
            showTags({
                'title': '提示',
                'content': '用户姓名与核心不一致，无法办理！',
                'ok': {
                    fun: function () {
                    }
                }
            });
            return;
        }
        if (loan.xTel == '') {
            hideLoader();
            showTags({
                'title': '提示',
                'content': '核心无法查询到手机号码，无法办理！',
                'ok': {
                    fun: function () {
                    }
                }
            });
            return;
        }
        //showLoader("维护客户信息成功回调...");
        var queryAccountJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId2, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "CLIENT_NO.s": loan.bankCLIENT_NO //客户类型 N组织 P个人
            }]
        };
        getDocLicenceListBankFun(queryAccountJson, function (msg) {
            getDocLicenceListBankSucc(msg);
        }, function (err) {
            funFail(err);
        })
    } else {
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}
/*卡账号查询成功回调*/
function getDocLicenceListBankSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    var textHtml = '<option></option>';
    if (responseBody[0].results == "00") {
        $.each(responseBody, function (index, val) {
            if (index == 0) return;
            if (val.docLicenceVO[0].ISSUE_ACCT_NO != '') {
                textHtml += '<option DOC_TYPE="' + val.docLicenceVO[0].DOC_TYPE + '">' + val.docLicenceVO[0].ISSUE_ACCT_NO + '</option>';
            }
        });

        $("#bank-newBill #cardAccount").html(textHtml).selectmenu('refresh', true);
    } else {
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}
/*短信验证码成功回调*/
function imessageAuthentionServiceBankSucc(msg, sendJson) {
    hideLoader();
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        loan.BMSG_INFO = responseBody[1].messageAuthentionVO[0].MSG_INFO; //获取短信验证码
        loan.BUSER_NO = responseBody[1].messageAuthentionVO[0].USER_NO; //获取用户唯一标识
        var _ind = 80;
        loan.BTime = setInterval(function () {
            _ind--;
            $("#lb-auth-time").text(_ind);
            if (_ind == 0) {
                $("#getMsg").text('重新获取');
                $('.duanX_con input#inp').val('');
                $("#lb-auth-time").text('0');
                loan.getBankYZM = true;
                $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
                loan.BUSER_NO = "";
                clearInterval(loan.BTime);
            }
        }, 1000);
    } else if (responseBody[0].results == "08") {
        imessageAuthentionServiceConF(sendJson);
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function () {
                    loan.getBankYZM = true;
                    $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
                    if(loan.BTime){
                        clearInterval(loan.BTime);
                    }
                    $("#lb-auth-time").text('80');
                }
            }

        });
    }
}
/*对账单短信验证码验证成功回调*/
function imessageAuthentionServiceYBankNewSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        showLoader('对账单查询中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId2, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "name.s": $('#bank-newBill .input-test-con:eq(1)').val(),//姓名
                "certType.s": $('#c-com-property option:selected').val(),//证件类型
                "certNum.s": $('#bank-newBill .input-test-con:eq(0)').val(),//证件号码
                "account.s": $("#bank-newBill #cardAccount option:selected").val(),//账号
                "acctType.s": $("#bank-newBill #cardAccount option:selected").attr('DOC_TYPE'),//账户类型 20-huoqi 30-dingqi
                // "currency.s": '000',//币种 000-人民币  344-港币  840-美元
                //"loginUser.s":'',//LOS用户
                "startDate.s": dateYYYYMMDD($("#bank-newBill input[type='date']:first").val()),//开始时间
                "endDate.s": dateYYYYMMDD($("#bank-newBill input[type='date']:last").val())//结束时间
            }]
        };
        createStatementFun(sendJson, function (msg) {
            createStatementSucc(msg);
        }, function (err) {
            funFail(err);
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}
/*申请贷款短信验证码验证成功回调*/
function imessageAuthentionServiceYLoanSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        loan.BUSER_NO = "";
        showLoader('贷款信息提交中...');
        custermerInfo.name = loan.mInfo.name;
        custermerInfo.cerNO = loan.mInfo.cerNO;
        getPlatGlobalSeq(loan.applicationObj, function () {
            showLoader('影像压缩中...');
            if (loan.mInfo.CheckResult == '00' || loan.mInfo.CheckResult == '02') {
                if (!loan.gInfo.isTrue || (loan.gInfo.isTrue && (loan.gInfo.CheckResult == '00' || loan.gInfo.CheckResult == '02'))) {
                    //缓存个人信息
                    cacheCustermerInfo({
                        "databaseName": "myDatabase",
                        "tableName": "customer_info",
                        "data": [{
                            "ADMINCOUNT": commonJson.adminCount,//登陆账号
                            "SUBMITTIME": myTime.CurTime(),//提交时间
                            "BUSINESSTYPE": "申请贷款",//业务类型
                            "NATION": loan.mInfo.nation,//民族
                            "CERTNUM": loan.mInfo.cerNO,//身份证号码
                            "ADDRESS": loan.mInfo.address,//地址
                            "MASCARDNAME": loan.mInfo.name,//姓名
                            "CERTVALIDDATE": loan.mInfo.cerExpdDt,//有效日期
                            "BIRTH": loan.mInfo.birthday,//出生日期
                            "SEX": loan.mInfo.sex,//性别
                            "ISSAUTHORITY": loan.mInfo.issAuthority,//签发机关
                            "IMAGE": loan.mInfo.image,//身份证头像图片
                            "CUSTANDCUSTOWNERPIC": loan.applicationObj.mPicFileARR[1],//与客户合影照片
                            "FRONTIDCARDPIC": loan.applicationObj.mPicFileARR[2],//身份证正面
                            "BACKIDCARDPIC": loan.applicationObj.mPicFileARR[3],//身份证反面
                            "checkPhoto": loan.mInfo.lianPic //联网核查图片
                        }]
                    });
                }
            }
            //影像上传文件打包压缩插件
            topicUtil.subscribe("loan/applyLendingLoanConF", applyLendingLoanConF);
            var compressCount = 0;  //压缩成功次数,为3或4时完成压缩
            var phoneTime = myTime.CurTime();
            var applyTime = phoneTime + 1;
            var signTime = phoneTime + 2;
            var gSignTime = phoneTime + 3;
            loan.applicationObj.applyTime = applyTime;
            loan.applicationObj.phoneTime = phoneTime;
            loan.applicationObj.signTime = signTime;
            loan.applicationObj.gSignTime = gSignTime;
            //影像上传文件打包压缩插件--->客户资料
            MT_zipCompression('loanType', loan.applicationObj.platGlobalSeq + 'CustInfo', zipCompressionFilePathFun('customer'), function (msg) {
                //将要上传的影像插入到ios断点上传的数据库中
//              var creditArr = [];
//              if (loan.mInfo.cFileStr) {  //征信文件  征信授权书
//                  creditArr.push(loan.mInfo.cFileStr.netFilePath, loan.mInfo.cFileStr.sqFilePath);
//              }
                //影像上传 业务参数
                var appBus = {
                    'busiGloablaSeq': loan.applicationObj.platGlobalSeq,//业务编号
                    'TRADE_TYPE': '00005',//客户资料
                    'APPLY_NO': '',//loan.applicationObj.APPLY_NO,//业务申请编号
                    'CUSTOMER_NO': '',//loan.applicationObj.CUSTOMER_NO,//客户流水号
                    'attchType': '0',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                    'deviceNo': commonJson.udId,//设备编号
                    'moduleId': loan.moduleId,//模块编号
                    'tranId': loan.tranId,//交易编号
                    'orgId': commonJson.orgId,//机构编号
                    'operatorNo': commonJson.adminCount,//操作员
                    'custName': loan.mInfo.name,//客户名称
                    'custCredType': '0',//客户证件类型
                    'custCredNo': loan.mInfo.cerNO,//客户证件号
                    'offlineOnline': commonJson.offlineOnline,//脱机/联机
                    'workAddress': commonJson.workAddress,//工作地址
                    'userId': commonJson.losUserId,  //los用户
                    'OPER_TYPE': 'ADD',//操作类型 add-->表示新增  mod-->表示修改
                    'FILE_LIST': []//creditArr
                };
                appBus = JSON.stringify(appBus);
                var sendDataJson = {
                    'databaseName': 'myDatabase',
                    'tableName': 'up_download_info',
                    'data': [{
                        'fileToken': loan.applicationObj.phoneTime,//文件唯一ID(可以为时间挫
                        'pos': '0',//文件的断点信息(初始为0)
                        'filePath': msg,//文件路径
                        'appPath': 'l002',//自定义文件路径
                        'appBuss': appBus,//业务参数
                        'downloadToken': '',//文件的下载ID(初始为空)
                        'leng': '1',//文件的长度(初始为1)
                        'isNotice': 'yes', //是否调用后台(一直是yes)
                        "fileType": '3',
                        "REMARK1": "01" //上传状态01-默认
                    }]
                };
                insertTableData(sendDataJson, function (msg) {
                    topicUtil.publish("loan/applyLendingLoanConF", ++compressCount);
                }, function (err) {
                    hideLoader();
                    showTags({
                        'title': '提示',
                        'content': '数据库读写失败，请联系技术人员',
                        'ok': {}
                    });
                });
            }, function(err) {
				hideLoader();
				showTags({
					'title': '提示',
					'content': '压缩影像失败！',
					'ok': {}
				});
			});
            //影像上传文件打包压缩插件--->受理审批资料
            MT_zipCompression('loanType', loan.applicationObj.platGlobalSeq + 'Apply', zipCompressionFilePathFun(''), function (msg1) {
                //将要上传的影像插入到ios断点上传的数据库中
                // var arrFile = [lendingInfo, circulateBlank];
                // if (investigation != '') {
                //     arrFile.push(investigation);
                // }
                // if (loan.dzd.length != 0) {
                //     $.each(loan.dzd, function (index, ele) {
                //         arrFile.push(ele);
                //     })
                // }
                // if (loan.fdzd.length != 0) {
                //     $.each(loan.fdzd, function (index, ele) {
                //         arrFile.push(ele);
                //     })
                // }

                //影像上传 业务参数
                var appApplyBus = {
                    'busiGloablaSeq': loan.applicationObj.platGlobalSeq,//loan.platGlobalSeq,//业务编号
                    'TRADE_TYPE': '00006',//受理审批资料
                    'APPLY_NO': '',//loan.applicationObj.APPLY_NO,//业务申请编号
                    'CUSTOMER_NO': '',//loan.applicationObj.CUSTOMER_NO,//客户流水号
                    'attchType': '0',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                    'deviceNo': commonJson.udId,//设备编号
                    'moduleId': loan.moduleId,//模块编号
                    'tranId': loan.tranId,//交易编号
                    'orgId': commonJson.orgId,//机构编号
                    'operatorNo': commonJson.adminCount,//操作员
                    'custName': loan.mInfo.name,//客户名称
                    'custCredType': '0',//客户证件类型
                    'custCredNo': loan.mInfo.cerNO,//客户证件号
                    'offlineOnline': commonJson.offlineOnline,//脱机/联机
                    'workAddress': commonJson.workAddress,//工作地址
                    'userId': commonJson.losUserId,  //los用户
                    'OPER_TYPE': 'ADD',//操作类型 add-->表示新增  mod-->表示修改
                    'FILE_LIST': []//arrFile
                };
                appApplyBus = JSON.stringify(appApplyBus);
                var sendDataJson = {
                    'databaseName': 'myDatabase',
                    'tableName': 'up_download_info',
                    'data': [{
                        'fileToken': loan.applicationObj.applyTime,//文件唯一ID(可以为时间挫
                        'pos': '0',//文件的断点信息(初始为0)
                        'filePath': msg1,//文件路径
                        'appPath': 'l002',//自定义文件路径
                        'appBuss': appApplyBus,//业务参数
                        'downloadToken': '',//文件的下载ID(初始为空)
                        'leng': '1',//文件的长度(初始为1)
                        'isNotice': 'yes', //是否调用后台(一直是yes)
                        "fileType": '4',
                        "REMARK1": "01" //上传状态01-默认
                    }]
                };
                insertTableData(sendDataJson, function (msg) {
                    topicUtil.publish("loan/applyLendingLoanConF", ++compressCount);
                }, function (err) {
                    hideLoader();
                    showTags({
                        'title': '提示',
                        'content': '数据库读写失败，请联系技术人员',
                        'ok': {}
                    });
                });
                // transFormImageAndInsertTableData(appBus, phoneTime + 1, 'l002', msg, '4');
            }, function(err) {
				hideLoader();
				showTags({
					'title': '提示',
					'content': '压缩影像失败！',
					'ok': {}
				});
			});
            //签名base64转路径  主申请人
            Meap.transFormImage(loan.applicationObj.platGlobalSeq + 'mSign', loan.mInfo.signaData, 'picSty', function (msg2) {
                //将要上传的签名插入到ios断点上传的数据库中
                //签名上传 业务参数
                var appmSignBus = {
                    'busiGloablaSeq': loan.applicationObj.platGlobalSeq,//loan.platGlobalSeq,//业务编号
                    'APPLY_NO': '',//loan.applicationObj.APPLY_NO,//业务申请编号
                    'CUSTOMER_NO': '',//loan.applicationObj.CUSTOMER_NO,//客户流水号
                    'attchType': '1',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                    'deviceNo': commonJson.udId,//设备编号
                    'moduleId': loan.moduleId,//模块编号
                    'tranId': loan.tranId,//交易编号
                    'orgId': commonJson.orgId,//机构编号
                    'operatorNo': commonJson.adminCount,//操作员
                    'custName': loan.mInfo.name,//客户名称
                    'custCredType': '0',//客户证件类型
                    'custCredNo': loan.mInfo.cerNO,//客户证件号
                    'offlineOnline': commonJson.offlineOnline,//脱机/联机
                    'workAddress': commonJson.workAddress//工作地址
                };
                appmSignBus = JSON.stringify(appmSignBus);
                var sendDataJson = {
                    'databaseName': 'myDatabase',
                    'tableName': 'up_download_info',
                    'data': [{
                        'fileToken': loan.applicationObj.signTime,//文件唯一ID(可以为时间挫
                        'pos': '0',//文件的断点信息(初始为0)
                        'filePath': msg2,//文件路径
                        'appPath': 'l001',//自定义文件路径
                        'appBuss': appmSignBus,//业务参数
                        'downloadToken': '',//文件的下载ID(初始为空)
                        'leng': '1',//文件的长度(初始为1)
                        'isNotice': 'yes', //是否调用后台(一直是yes)
                        "fileType": '1',
                        "REMARK1": "01" //上传状态01-默认
                    }]
                };
                insertTableData(sendDataJson, function (msg) {
                    topicUtil.publish("loan/applyLendingLoanConF", ++compressCount);
                }, function (err) {
                    hideLoader();
                    showTags({
                        'title': '提示',
                        'content': '数据库读写失败，请联系技术人员',
                        'ok': {}
                    });
                });
                //transFormImageAndInsertTableData(appBus, phoneTime + 2, 'l001', msg, '1');
            }, function (err) {
                hideLoader();
                showTags({
                    'title': '提示',
                    'content': '文件格式转换失败',
                    'ok': {}
                });
                // alert('失败回调' + err);
            });
            //签名base64转路径  配偶
            if (loan.mInfo.maritalStatus == '20' || loan.mInfo.maritalStatus == '21' || loan.mInfo.maritalStatus == '40' || loan.mInfo.maritalStatus == '23') {
                Meap.transFormImage(loan.applicationObj.platGlobalSeq + 'wSign', loan.gInfo.signaData, 'picSty', function (msg3) {
                    //将要上传的签名插入到ios断点上传的数据库中
                    //签名上传 业务参数
                    var appwSignBus = {
                        'busiGloablaSeq': loan.applicationObj.platGlobalSeq,//业务编号
                        'APPLY_NO': '',//loan.applicationObj.APPLY_NO,//业务申请编号
                        'CUSTOMER_NO': '',//loan.applicationObj.CUSTOMER_NO,//客户流水号
                        'attchType': '1',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                        'deviceNo': commonJson.udId,//设备编号
                        'moduleId': loan.moduleId,//模块编号
                        'tranId': loan.tranId,//交易编号
                        'orgId': commonJson.orgId,//机构编号
                        'operatorNo': commonJson.adminCount,//操作员
                        'custName': (loan.gInfo.name || ''),//客户名称
                        'custCredType': '0',//客户证件类型
                        'custCredNo': (loan.gInfo.cerNO || ''),//客户证件号
                        'offlineOnline': commonJson.offlineOnline,//脱机/联机
                        'workAddress': commonJson.workAddress//工作地址
                    };
                    appwSignBus = JSON.stringify(appwSignBus);
                    var sendDataJson = {
                        'databaseName': 'myDatabase',
                        'tableName': 'up_download_info',
                        'data': [{
                            'fileToken': loan.applicationObj.gSignTime,//文件唯一ID(可以为时间挫
                            'pos': '0',//文件的断点信息(初始为0)
                            'filePath': msg3,//文件路径
                            'appPath': 'l001',//自定义文件路径
                            'appBuss': appwSignBus,//业务参数
                            'downloadToken': '',//文件的下载ID(初始为空)
                            'leng': '1',//文件的长度(初始为1)
                            'isNotice': 'yes', //是否调用后台(一直是yes)
                            "fileType": '1',
                            "REMARK1": "01" //上传状态01-默认
                        }]
                    };
                    insertTableData(sendDataJson, function (msg) {
                        topicUtil.publish("loan/applyLendingLoanConF", ++compressCount);
                    }, function (err) {
                        hideLoader();
                        showTags({
                            'title': '提示',
                            'content': '数据库读写失败，请联系技术人员',
                            'ok': {}
                        });
                    });
                   // transFormImageAndInsertTableData(appBus, phoneTime + 3, 'l001', msg, '1');
                }, function (err) {
                    hideLoader();
                    showTags({
                        'title': '提示',
                        'content': '文件格式转换失败',
                        'ok': {}
                    });
                    // alert('失败回调' + err);
                });
            }


        });
        // var platSendJson = {
        //     "b": [{
        //         "deviceNo.s": commonJson.udId, //设备编号
        //         "moduleId.s": loan.moduleId, //模块编号
        //         "tranId.s": loan.tranId, //交易编号
        //         "orgId.s": commonJson.orgId,//机构号
        //         "operatorNo.s": commonJson.adminCount,//操作员
        //         "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
        //         "workAddress.s": commonJson.workAddress,//工作地址
        //         "CLIENT_NAME.s": loan.mInfo.name,//客户姓名
        //         "DOCUMENT_TYPE.s":'0',//证件类型
        //         "DOCUMENT_ID.s": loan.mInfo.cerNO//证件号码
        //     }]
        // };
        // getPlatGlobalSeqConF(platSendJson);
    } else if (responseBody[0].results == "08") {
        hideLoader();
        var checkJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "SUSER_ID.s": commonJson.orgId + commonJson.adminCount,//机构号+柜员号
                "USER_NO.s": loan.BUSER_NO, //用户唯一标识
                "EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
                "MSG_INFO.s": $('#loan-cusConfirm #inp').val(), //动态口令
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": '', //手机号码 '018232053662',//
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s": loan.mInfo.faceRecogn //人脸识别
            }]
        };
        imessageAuthentionServiceYConF(checkJson);
    } else {
        loan.BUSER_NO = "";
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}

/**
 * 申请贷款
 **/
/*产品查询*/
function getLoanProductListSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    var textHtml = '';
    if (responseBody[0].results == '00') {
        $.each(responseBody, function (index, el) {
            if (index == 0) return true;
            var imgUrl = base64decode(el.loanProductVO[0].PRO_ATTACH);
            textHtml += '<div class="product_box">' +
                '<img src="data:image/png;base64,' + imgUrl + '" proREMARK1="' + el.loanProductVO[0].PRO_REMARK1 + '" class="product_img">' +
                '<div class="product_content">' +
                '<div class="product_register" proType="' + el.loanProductVO[0].PRO_TYPE + '" proCODE="' + el.loanProductVO[0].PRO_CODE + '" proTOCOL="' + el.loanProductVO[0].PRO_PROTOCOL + '">立即申请</div>' +
                '<p class="product_title">' + el.loanProductVO[0].PRO_NAME + '</p>' +
                '<div class="product_Intro">' + el.loanProductVO[0].PRO_DESC + '</div>' +
                '</div>' +
                '</div>'
        });
        $('#loan-product .conter-auto').html(textHtml);
        $('#loan-product .product_register').on('click', function () {
            if (commonJson.losUserId == '') {
                showTags({
                    'title': '提示',
                    'content': '没有LOS用户号,无法办理贷款业务!',
                    'ok': {
                        fun: function () {
                            $.mobile.changePage('../main.html');
                        }
                    }
                });
            } else {
                loan.applicationObj.proCODE = $(this).attr("proCODE"); //业务品种
                loan.applicationObj.proType = $(this).attr("proType"); //营销产品
                //if (loan.applicationObj.proCODE == '401001010') {  //一手楼
                //    loan.applicationObj.proTOCOL = '010540'; //营销产品
                //} else if (loan.applicationObj.proCODE == '401002010') {  //一手楼商铺
                //    loan.applicationObj.proTOCOL = '010560'; //营销产品
                //}
                $.mobile.changePage('loan-reading.html');
            }
        });
        //营销话术
        $('#loan-product .product_img').on('taphold', function () {
            productTapHold($(this));
        });
        $("#loan-product").on('tap', function (ev) {
            var oTarget = ev.target;
            if ($(oTarget).closest('.product_img').length || $(oTarget).closest('.product_img_msg').length) {

            } else {
                $(".product_img_msg").remove();
            }
        })
        deleteTableData({
            "databaseName": "myDatabase", //数据库名
            "tableName": "loanproductlist_info" //表名
        }, function (msg) {
            //再插入数据库
            var dataNum = 1;
            loanProductInfoServiceInsert(responseBody, dataNum);
        }, function (err) {

        });
    } else if (responseBody[0].results == '08') {
        hideLoader();
        var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress//工作地址
            }]
        };
        getLoanProductListConF(sendJson);
    } else {
        localStorage.loanProductTime = 1;
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function () {
                }
            }
        });
    }
}

/*贷款人信息查询*/
//function findLenderInfoSucc(msg) {
//    var responseBody = responseBodySuccFormat(msg);
//    if (responseBody[0].results == '00') {
//        if (commonJson.orgId != responseBody[1].iBorrowerInfoService[0].orgId) {  // 判断 LOS机构 和 登录机构
//            //若登录用户对应LOS用户名与LOS客户信息所属用户相同，则按照上述修改/不修改规则设定；否则，以上从LOS系统同步的全部字段都不可以修改；
//            inputLosValue(responseBody[1]);
//            showLoader("楼盘查询中...");
//            var sendJson = {
//                "b": [{
//                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
//                    "workAddress.s": commonJson.workAddress,//工作地址
//                    "moduleId.s": loan.moduleId, //模块编号 4
//                    "tranId.s": '100', //交易编号   2
//                    "operatorNo.s": commonJson.adminCount, //操作员  admin
//                    "deviceNo.s": commonJson.udId, //设备编号       ""
//                    "orgId.s": commonJson.orgId,
//                    "summary.s": ''//楼盘名称 模糊查询
//                }]
//            };
//            findBuildingInfoConF(sendJson, findBuildingInfoMSucc);
//        } else {
//            showTags({
//                'title': '提示',
//                'content': '登录机构不一致,不允许继续操作!',
//                'ok': {
//                    fun: function () {
//                        $.mobile.changePage('loan-reading.html', {
//                            reverse: true
//                        });
//                    }
//                }
//            });
//        }
//
//    } else if (responseBody[0].results == 'LOS0066'||responseBody[0].results == 'ESB1097') { // Los无信息  查询核心
//        showLoader('核心客户信息查询中...');
//        var sendJson = {
//            "b": [{
//                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
//                "workAddress.s": commonJson.workAddress, //工作地址
//                "orgId.s": commonJson.orgId, //机构号
//                "moduleId.s": loan.moduleId, //模块编号
//                "tranId.s": '100', //交易编号
//                "operatorNo.s": commonJson.adminCount, //操作员
//                "deviceNo.s": commonJson.udId, //设备编号
//                "CLIENT_NO.s": loan.mCLIENT_NO, //客户号
//                "AGENT_FLAG.s": "", //法人代表
//                "CLIENT_TYPE.s": "P" //N单位 P个人
//            }]
//        };
//        //核心联查
//        IEstablishCustomerInformationServiceLoanAddMsgConF(sendJson);
//    } else if (responseBody[0].results == '08') {
//        var sendJson = {
//            "b": [{
//                "deviceNo.s": commonJson.udId, //设备编号
//                "moduleId.s": loan.moduleId, //模块编号
//                "tranId.s": '100',//loan.tranId, //交易编号
//                "orgId.s": commonJson.orgId,//机构号
//                "operatorNo.s": commonJson.adminCount,//操作员
//                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
//                "workAddress.s": commonJson.workAddress,//工作地址
//                "CLIENT_NO.s": loan.mCLIENT_NO, //客户号
//                "certType.s": 'Ind01',//证件类型
//                "certNum.s": loan.mInfo.cerNO//证件号码
//            }]
//        };
//        findLenderInfoConF(sendJson);
//    } else {
//        showTags({
//            'title': '提示',
//            'content': responseBody[0].message,
//            'ok': {
//                fun: function () {
//                }
//            }
//        });
//    }
//}
/*影像两两对比成功回调*/
function IFacelRecognitionServiceLoanSucc(msg, cusFacePic, mgInfo, json) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == '0') {
        if (responseBody[1].photoCompareVO[0].CHIP_RESULT == "0") { //芯片通过
            $(".face-result:eq(0)").text('通过');
        } else {
            $(".face-result:eq(0)").addClass('no-pass').text('未通过');
        }
        if (responseBody[1].photoCompareVO[0].CARD_RESULT == "0") { //联网核查通过
            $(".face-result:eq(1)").text('通过');
        } else {
            $(".face-result:eq(1)").addClass('no-pass').text('未通过');
        }
        if (responseBody[1].photoCompareVO[0].CHIP_RESULT == "0" && responseBody[1].photoCompareVO[0].CARD_RESULT == "0") {
            $(".center-header").text('人脸识别通过！');
        } else {
            $(".center-header").text('人脸识别未通过！');
        }
        $('.previous:last').addClass('btn_next');

    } else if (responseBody[0].results == '08') {
        //ifacelRecognitionSeMGFun(cusFacePic,mgInfo,json);
    } else {
        $(".center-header").text('人脸识别失败！');
        $(".face-result:eq(0)").addClass('no-pass').text('未通过');
        $(".face-result:eq(1)").addClass('no-pass').text('未通过');
        $('.previous:last').addClass('btn_next');
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}
/*查核心成功回调*/
function customerInfoServiceLoanSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        if ($.trim(responseBody[1].customerInfoVO[0].CH_CLIENT_NAME) != '' && $.trim(responseBody[1].customerInfoVO[0].CH_CLIENT_NAME) != custermerInfo.name) {
            showTags({
                'title': '提示',
                'content': '身份证姓名与核心姓名不一致,无法办理',
                'ok': {
                    fun: function () {
                        $.mobile.changePage('loan-reading.html', {
                            reverse: true
                        });
                    }
                }
            });
            return;
        }
        if (loan.isLoanMaster) {
            mgInfo(loan.mInfo);
            loan.mCLIENT_NO = responseBody[1].customerInfoVO[0].CLIENT_NO; //获取客户号
            if (loan.mCLIENT_NO == '') {
                showTags({
                    'title': '提示',
                    'content': '核心无此客户信息!',
                    'ok': {
                        fun: function () {
                            $.mobile.changePage('loan-product.html', {reverse: true});
                        }
                    }
                });
                return;
            }
            if (loan.mInfo.isTrue && loan.gInfo.isTrue) {  //主 配 都存在的情况下  判断性别状况
                if (loan.mInfo.sex == loan.gInfo.sex) {
                    showTags({
                        'title': '提示',
                        'content': '主申请人与配偶信息相同!',
                        'ok': {
                            fun: function () {
                                $.mobile.changePage('loan-reading.html', {
                                    reverse: true
                                });
                            }
                        }
                    });
                    return;
                }
            }
            $.mobile.changePage('loan-cusPicture.html', {reverse: true});
        }
    } else if (responseBody[0].results == "08") {
        hideLoader();
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号 4
                "tranId.s": loan.tranId, //交易编号   2
                "operatorNo.s": commonJson.adminCount, //操作员  admin
                "deviceNo.s": commonJson.udId, //设备编号       ""
                "orgId.s": commonJson.orgId,
                "CLIENT_TYPE.s": "P", //客户类型 N组织 P个人
                "CARD.s": "", //卡号
                "ACCT_NO.s": "", //账号
                "CLIENT_NO.s": "", //客户号
                "DOC_TYPE.s": "0", //证件类型
                "DOC_ID.s": custermerInfo.cerNO, //证件号
                "CLIENT_SHORT.s": "", //简称
                "BIRTH_DATE.s": "", //出生日
                "CELL_PHONE.s": "", //手机
                "PHONE.s": "", //住宅电话
                "LEGAL_REP.s": "", //法人代表
                "REVERSE_FLAG.s": "D" //证件号内部检查标志 默认D
            }]
        };
        //核心联查
        icustomerInfoServiceFun(sendJson, function (msg) {
            customerInfoServiceLoanSucc(msg);
        }, function (err) {
            funFail(err);
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function () {
                    $.mobile.changePage('loan-reading.html', {reverse: true});
                }
            }
        });
    }
}

/*楼盘信息查询 弹出窗 成功回调*/
function findBuildingInfoSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        loan.buildArr = [];
        var selectHtml = '<option></option>';
        $.each(responseBody, function (index, val) {
            if (index == 0) {
                return;
            }
            loan.buildArr.push(val);
            selectHtml += '<option developers="' + val.buildingInfo[0].developers + '" address="' + val.buildingInfo[0].address + '" summary="' + val.buildingInfo[0].summary + '" relativeAgreement="' + val.buildingInfo[0].relativeAgreement + '"  value="' + val.buildingInfo[0].id + '">' + val.buildingInfo[0].summary + '</option>';
        });
        $('#buildingInfoId').html(selectHtml).selectmenu('refresh');
        var textHtml = '';
        $.each(responseBody, function (index, val) {
            if (index == 0) {
                return;
            }
            textHtml += '<li address="' + val.buildingInfo[0].address + '" buildingId="' + val.buildingInfo[0].id + '">' +
                // '<div>' + val.buildingInfo[0].summary + '</div>' +
                '<div style="width: 25%">' + val.buildingInfo[0].summary + '</div>' +
                '<div style="width: 45%">' + val.buildingInfo[0].address + '</div>' +
                '<div style="width: 30%">' + val.buildingInfo[0].developers + '</div></li>'
        });
        $('#loan-cusInfo .searchHu ul').html(textHtml);
        /*点击 click list*/
        $("#loan-cusInfo .searchHu ul>li").on("click", function () {
            var navigation = $('#loan-cusInfo .searchHu ul>li').index($(this));
            $(this).addClass("list-bgcolor").siblings("li").removeClass("list-bgcolor");
            $('#loan-cusInfo .searchHu .footter a').addClass(' btn_next');
        });
        $('#loan-cusInfo .searchHu .footter a').removeClass(' btn_next');
        $("#loan-cusInfo .searchHu").show();
    } else if (responseBody[0].results == "08") {
        hideLoader();
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号 4
                "tranId.s": loan.tranId, //交易编号   2
                "operatorNo.s": commonJson.adminCount, //操作员  admin
                "deviceNo.s": commonJson.udId, //设备编号       ""
                "orgId.s": commonJson.orgId,
                "summary.s": ''//楼盘名称 模糊查询
            }]
        };
        findBuildingInfoConF(sendJson, findBuildingInfoSucc);
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function () {
                    $("#loan-cusInfo .searchHu").show();
                }
            }
        });
    }
}
/*楼盘信息查询 成功回调*/
function findBuildingInfoMSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        loan.buildArr = [];
        var textHtml = '<option></option>';
        $.each(responseBody, function (index, val) {
            if (index == 0) {
                return;
            }
            loan.buildArr.push(val);
            textHtml += '<option developers="' + val.buildingInfo[0].developers + '" address="' + val.buildingInfo[0].address + '" summary="' + val.buildingInfo[0].summary + '" relativeAgreement="' + val.buildingInfo[0].relativeAgreement + '"  value="' + val.buildingInfo[0].id + '">' + val.buildingInfo[0].summary + '</option>';
        });
        $('#buildingInfoId').html(textHtml).selectmenu('refresh');

    } else if (responseBody[0].results == "08") {
        hideLoader();
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号 4
                "tranId.s": loan.tranId, //交易编号   2
                "operatorNo.s": commonJson.adminCount, //操作员  admin
                "deviceNo.s": commonJson.udId, //设备编号       ""
                "orgId.s": commonJson.orgId,
                "summary.s": ''//楼盘名称 模糊查询
            }]
        };
        findBuildingInfoConF(sendJson, findBuildingInfoMSucc);
    } else {
        loan.inputLogo = false;
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function () {
                }
            }
        });
    }
}
/*添加楼盘信息 成功回调*/
function insertBuildingInfoSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        showTags({
            'title': '提示',
            'content': '楼盘项目添加成功!',
            'ok': {
                fun: function () {
                    showLoader("楼盘查询中...");
                    var sendJson = {
                        "b": [{
                            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                            "workAddress.s": commonJson.workAddress,//工作地址
                            "moduleId.s": loan.moduleId, //模块编号 4
                            "tranId.s": loan.tranId, //交易编号   2
                            "operatorNo.s": commonJson.adminCount, //操作员  admin
                            "deviceNo.s": commonJson.udId, //设备编号       ""
                            "orgId.s": commonJson.orgId,
                            "summary.s": ''//楼盘名称 模糊查询
                        }]
                    };

                    findBuildingInfoConF(sendJson, findBuildingInfoSucc);
                }
            }
        });
    } else if (responseBody[0].results == "08") {
        hideLoader();
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "summary.s": loan.buildPro, //楼盘项目
                "address.s": loan.buildAdd,// 地址
                "developers.s": loan.developer,//开发商
                "relativeAgreement.s": ''//第三方额度号
            }]
        };
        insertBuildingInfoConF(sendJson);
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function () {
                }
            }
        });
    }
}

/*删除楼盘信息 成功回调*/
function deleteBuildingInfoSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        showTags({
            'title': '提示',
            'content': '楼盘项目信息删除成功!',
            'ok': {
                fun: function () {
                    showLoader("楼盘查询中...");
                    var sendJson = {
                        "b": [{
                            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                            "workAddress.s": commonJson.workAddress,//工作地址
                            "moduleId.s": loan.moduleId, //模块编号 4
                            "tranId.s": loan.tranId, //交易编号   2
                            "operatorNo.s": commonJson.adminCount, //操作员  admin
                            "deviceNo.s": commonJson.udId, //设备编号       ""
                            "orgId.s": commonJson.orgId,
                            "summary.s": ''//楼盘名称 模糊查询
                        }]
                    };
                    findBuildingInfoConF(sendJson, findBuildingInfoSucc);
                }
            }
        });
    } else if (responseBody[0].results == "08") {
        hideLoader();
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号 4
                "tranId.s": loan.tranId, //交易编号   2
                "operatorNo.s": commonJson.adminCount, //操作员  admin
                "deviceNo.s": commonJson.udId, //设备编号       ""
                "orgId.s": commonJson.orgId,
                "id.s": $('#loan-cusInfo .searchHu ul>li.list-bgcolor').attr('buildingId')//序号
            }]
        };
        deleteBuildingInfoConF(sendJson);
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function () {
                }
            }
        });
    }
}

/*同步楼盘信息查询 成功回调*/
function seekBuildingInfoSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        var textHtml = '';
        $.each(responseBody, function (index, ele) {
            if (index == 0) {
                return;
            }
            textHtml += '<li>' +
                '<div class="widthF">' + ele.buildingInfoVO[0].BUILDING_NAME + '</div>' +
                '<div class="widthS">' + ele.buildingInfoVO[0].BUILDING_ADDR + '</div>' +
                '<div class="widthT"><div class="tong seach-botton" relativeAgreement="' + ele.buildingInfoVO[0].RELATIVE_AGREEMENT + '"  developer="' + ele.buildingInfoVO[0].BUILDER_NAME + '">同步</div></div></li>'
        });
        $('.searchLos ul').html(textHtml);
        $('.searchLos ul .tong').on('click', function () {
            $("#loan-cusInfo .searchLos").hide();
            showLoader('楼盘同步中...');
            loan.developer = $(this).attr('developer');
            loan.buildPro = $(this).closest('li').find('.widthF').text();
            loan.buildAdd = $(this).closest('li').find('.widthS').text();
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "moduleId.s": loan.moduleId, //模块编号
                    "tranId.s": loan.tranId, //交易编号
                    "operatorNo.s": commonJson.adminCount, //操作员
                    "deviceNo.s": commonJson.udId, //设备编号
                    "orgId.s": commonJson.orgId,
                    "summary.s": loan.buildPro, //楼盘项目
                    "address.s": loan.buildAdd,// 地址
                    "developers.s": loan.developer,//开发商
                    "relativeAgreement.s": $(this).attr('relativeAgreement')//第三方额度号
                }]
            };
            insertBuildingInfoConF(sendJson);
        });
        $("#loan-cusInfo .searchLos").show();
    } else if (responseBody[0].results == "08") {
        hideLoader();
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号 4
                "tranId.s": loan.tranId, //交易编号   2
                "operatorNo.s": commonJson.adminCount, //操作员  admin
                "deviceNo.s": commonJson.udId, //设备编号       ""
                "orgId.s": commonJson.orgId,
                "summary.s": ''//楼盘名称 模糊查询
            }]
        };
        seekBuildingInfoConF(sendJson);
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function () {
                }
            }
        });
    }
}

/*LOS系统无信息 查询核心填写信息 成功回调*/
//function IEstablishCustomerInformationServiceLoanAddMsgSucc(msg) {
//    var responseBody = responseBodySuccFormat(msg);
//    if (responseBody[0].results == "00") {
//        inputICBSValue(responseBody[1].clientDescVO);
//        showLoader("楼盘查询中...");
//        var sendJson = {
//            "b": [{
//                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
//                "workAddress.s": commonJson.workAddress,//工作地址
//                "moduleId.s": loan.moduleId, //模块编号 4
//                "tranId.s": '100', //交易编号   2
//                "operatorNo.s": commonJson.adminCount, //操作员  admin
//                "deviceNo.s": commonJson.udId, //设备编号       ""
//                "orgId.s": commonJson.orgId,
//                "summary.s": ''//楼盘名称 模糊查询
//            }]
//        };
//        findBuildingInfoConF(sendJson, findBuildingInfoMSucc);
//    } else if (responseBody[0].results == "08") {
//        var sendJson = {
//            "b": [{
//                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
//                "workAddress.s": commonJson.workAddress, //工作地址
//                "orgId.s": commonJson.orgId, //机构号
//                "moduleId.s": loan.moduleId, //模块编号
//                "tranId.s": '100', //交易编号
//                "operatorNo.s": commonJson.adminCount, //操作员
//                "deviceNo.s": commonJson.udId, //设备编号
//                "CLIENT_NO.s": loan.mCLIENT_NO, //客户号
//                "AGENT_FLAG.s": "", //法人代表
//                "CLIENT_TYPE.s": "P" //N单位 P个人
//            }]
//        };
//        IEstablishCustomerInformationServiceLoanAddMsgConF(sendJson);
//    } else {
//        showTags({
//            'title': '提示',
//            'content': responseBody[0].message,
//            'ok': {
//                fun: function () {
//                }
//            }
//        });
//    }
//
//}
/*LOS ICBS系统整合接口 成功回调*/
function queryLoanCustomerInfoSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == '00') {
        LOSinputLosValue(responseBody[1], responseBody[0].resource);
        //配偶信息
        if (responseBody[0].resource == '3') {  //LOS系统存在信息
            if (loan.gInfo.isTrue) {
                if (responseBody[1].clientDescVO[0].consortCertType == 'Ind01' && loan.gInfo.cerNO == $.trim(responseBody[1].clientDescVO[0].consortCertId)) {
                    $('.input-test-con:eq(11)').val($.trim(responseBody[1].clientDescVO[0].consortCellphone));//配偶手机号
                    //$('.input-test-con:eq(12)').val($.trim(obj.clientDescVO[0].)); //工作单位---->借口没有提供
                    $('.input-test-con:eq(13)').val(fmoney(responseBody[1].clientDescVO[0].consortIncome));//配偶月均稳定收入
                    $('#consortHeadship').val($.trim(responseBody[1].clientDescVO[0].consortHeadship)).selectmenu('refresh');
                } else {
                    if (responseBody[1].clientDescVO[0].consortCertType != '' && $.trim(responseBody[1].clientDescVO[0].consortCertId) != '') {
                        showTags({
                            'title': '提示',
                            'content': '配偶证件信息与LOS系统不一致,无法办理!',
                            'ok': {
                                fun: function () {
                                    $.mobile.changePage('loan-product.html', {reverse: true});
                                }
                            }
                        });
                        return;
                    }
                }
            }
        }
        if (responseBody[0].resource == '3' && responseBody[1].clientDescVO[0].ORGAN_CODE != '' && commonJson.superOrgId != responseBody[1].clientDescVO[0].ORGAN_CODE) {  // 判断 LOS机构(在不为空的情况下) 和 登录机构(信息源来自LOS且LOS机构和登录机构不一致)
            $('.info-enter-item:eq(0) input,.info-enter-item:eq(1) input').attr('disabled', 'disabled');
            $('.input-test-con:eq(2)').attr('disabled', 'disabled');  //手机号码
            $('.addrAndArea:eq(0),.addrAndArea:eq(1),.addrAndArea:eq(3)').removeAttr('disabled');
            $('.info-enter-item:eq(1) input:eq(1)').removeAttr('disabled');
            $('.info-enter-item:eq(0) select,.info-enter-item:eq(1) select').attr('disabled', 'disabled');
            showTags({
                'title': '提示',
                'content': '登录机构不一致,不允许操作页面字段!',
                'ok': {
                    fun: function () {
                        loan.applicationObj.modifiable = '0';  //登录机构不一致 不允许修改
                        showLoader('卡账号查询中...');
                        var sendJson = {
                            "b": [{
                                "deviceNo.s": commonJson.udId, //设备编号
                                "moduleId.s": loan.moduleId, //模块编号
                                "tranId.s": loan.tranId, //交易编号
                                "orgId.s": commonJson.orgId,//机构号
                                "operatorNo.s": commonJson.adminCount,//操作员
                                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                                "workAddress.s": commonJson.workAddress,//工作地址
                                "CLIENT_NO.s": loan.mCLIENT_NO //客户号
                            }]
                        };
                        getDocLicenceListBankConF(sendJson);
                    }
                }
            });
        } else {
            if (responseBody[0].resource == '3') {
                $('.input-test-con:eq(2)').attr('disabled', 'disabled');  //手机号码
            } else {
                $('.information-input input').removeAttr('disabled', 'disabled');
                $('.information-input select').removeAttr('disabled', 'disabled');
            }
            loan.applicationObj.modifiable = '1';
            showLoader('卡账号查询中...');
            var sendJson = {
                "b": [{
                    "deviceNo.s": commonJson.udId, //设备编号
                    "moduleId.s": loan.moduleId, //模块编号
                    "tranId.s": loan.tranId, //交易编号
                    "orgId.s": commonJson.orgId,//机构号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "CLIENT_NO.s": loan.mCLIENT_NO //客户号
                }]
            };
            getDocLicenceListBankConF(sendJson);
        }


    } else if (responseBody[0].results == '08') {
        hideLoader();
        showLoader("客户信息查询中...");
        var bodyJSon = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "IDTYPE.s": '0',//证件类型
                "IDNO.s": loan.mInfo.cerNO,//证件号码
                "CLIENT_TYPE.s": "P", //N单位 P个人
                "CLIENT_NO.s": loan.mCLIENT_NO, //客户号
                "AGENT_FLAG.s": "" //法人代表
            }]
        };
        queryLoanCustomerInfoConF(bodyJSon);
    } else if (responseBody[0].results == 'LOS0060') {
        loan.inputLogo = false;
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function () {
                    $.mobile.changePage('loan-product.html', {
                        reverse: true
                    });
                }
            }
        });
    } else {
        loan.inputLogo = false;
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }


}
/*查询卡账号 成功回调*/
function getDocLicenceListLoanSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    var textHtml = '<option></option>';
    if (responseBody[0].results == "00") {
        $.each(responseBody, function (index, val) {
            if (index == 0) return;
            loan.accountArr.push(val);
            var docType;
            if (val.docLicenceVO[0].DOC_TYPE == '001') {
                docType = '1';
            } else if (val.docLicenceVO[0].DOC_TYPE == '') {
                docType = '2';
            }
            if (val.docLicenceVO[0].ACCT_NO != '') {
                textHtml += '<option docType ="' + docType + '" value="' + val.docLicenceVO[0].ACCT_NO + '">' + val.docLicenceVO[0].ACCT_NO + '</option>';
            }
            if (val.docLicenceVO[0].ISSUE_ACCT_NO != '') {
                textHtml += '<option docType ="' + docType + '" value="' + val.docLicenceVO[0].ISSUE_ACCT_NO + '">' + val.docLicenceVO[0].ISSUE_ACCT_NO + '</option>';
            }
        });
        $("#loan-cusInfo #cardAccount").html(textHtml).selectmenu('refresh', true);

        showLoader("楼盘查询中...");

        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号 4
                "tranId.s": loan.tranId, //交易编号   2
                "operatorNo.s": commonJson.adminCount, //操作员  admin
                "deviceNo.s": commonJson.udId, //设备编号       ""
                "orgId.s": commonJson.orgId,
                "summary.s": ''//楼盘名称 模糊查询
            }]
        };
        findBuildingInfoConF(sendJson, findBuildingInfoMSucc);

    } else if (responseBody[0].results == "08") {
        hideLoader();
        var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "CLIENT_NO.s": loan.mCLIENT_NO //客户号
            }]
        };
        getDocLicenceListBankConF(sendJson);
    } else if (responseBody[0].results == "03") {   //还款账号无凭证
        loan.inputLogo = false;
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                fun: function () {
                    $.mobile.changePage('./loan-product.html', {reverse: true});
                }
            }
        });
    } else {
        loan.inputLogo = false;
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        })
    }
}
/*人脸比对*/
function ifacelRecognitionSeMGFun(cusFacePic, mgInfo, json) {
    //影像两两对比
    var sendJson = {
        "b": [{
            "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
            "workAddress.s": commonJson.workAddress, //工作地址
            "orgId.s": commonJson.orgId,//机构号
            "moduleId.s": json.moduleId, //模块编号
            "tranId.s": json.tranId, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "deviceNo.s": commonJson.udId, //设备编号
            "OPERATOR_NO.s": commonJson.adminCount, //业务经办人工号
            "TRANS_SCENE.s": "0001", //交易场景
            "COMPARE_TYPE.s": "2", //    比对类型1-客户经理比对，2-客户比对
            "WS_TYPE.s": "2", // 终端类型1-PC，2-IOS，3-Android
            "WSNO.s": commonJson.udId, //    终端号
            "VERSION.s": "v1.1.4", //当前控件版本
            "TRANS_CHANNEL.s": "301", //   渠道301
            "ID_CARD.s": '',// 身份证号码
            "IMG_BASE.s": '',//      现场照片
            "CRYPT_TYPE.s": "0", //   图像是否经过加密0-未加密，1-加密方式一，2加密方式二
            "ID_IMG_BASE.s": $(".camera:eq(3)").attr('src'), //联网核查照片
            "CARD_IMG_BASE.s": '', //  芯片照片
            "BUSI_TYPE.s": "03" //

        }]
    };
    transFormBase64MGFun(cusFacePic, mgInfo, json, sendJson);

}
function transFormBase64MGFun(cusFacePic, mgInfo, json, sendJson) {
    transFormBase64(cusFacePic, function (msg) { //面部图片转base64
        mgInfo.cusFaceBase64 = msg;
        transFormBase64(mgInfo.image, function (msg1) { //身份证图片转base64
            mgInfo.imageBase64 = msg1;
            sendJson.b[0]['ID_CARD.s'] = mgInfo.cerNO;
            sendJson.b[0]['IMG_BASE.s'] = mgInfo.cusFaceBase64;
            sendJson.b[0]['CARD_IMG_BASE.s'] = mgInfo.imageBase64;
            showLoader("影像对比中...");
            ifacelRecognitionSeFun(sendJson, function (msg) {
                mgInfo.MGCompareFace = true;  //人脸比对完成
                IFacelRecognitionServiceLoanSucc(msg, cusFacePic, mgInfo, json);
            }, function (err) {
                $(".center-header").text('人脸识别失败！');
                $(".face-result:eq(0)").addClass('no-pass').text('未通过');
                $(".face-result:eq(1)").addClass('no-pass').text('未通过');
                $('.previous:last').addClass('btn_next');
                funFail(err);
            })
        }, function (err) {
            alert('影像转换失败！')
        });
    }, function (err) {
        alert('影像转换失败！')
    });
}
/*更新贷款人信息 成功回调*/
function updateLenderInfoSucc(msg) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00") {
        $.mobile.changePage('./loan-cusConfirm.html', {transition: "slide"});
    } else if (responseBody[0].results == "08") {
        hideLoader();
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {}
        });
    }
}
/*申请贷款 成功回调*/
function applyLendingLoanSucc(msg,event, compressCount) {
    var responseBody = responseBodySuccFormat(msg);
    if (responseBody[0].results == "00" || responseBody[0].results == "13") {
        // loan.applicationObj.globalSeq = responseBody[1].loan[0].globalSeq;//平台流水号
        loan.applicationObj.CUSTOMER_NO = responseBody[1].loan[0].customerNo;  //客户流水号
        loan.applicationObj.APPLY_NO = responseBody[1].loan[0].applyNo; //业务申请编号
        var lendingInfo = responseBody[1].loan[0].lendingInfo;   //贷款申请表
        var circulateBlank = responseBody[1].loan[0].circulateBlank; //
        var investigation = responseBody[1].loan[0].investigation;  //面谈笔录

        //成功替换appBus
        var creditArr = [];
        if (loan.mInfo.cFileStr && loan.mInfo.cFileStr.length > 0) {  //征信文件  征信授权书
        	$.each(loan.mInfo.cFileStr, function (index, data) {
        		if(data.creditReferPath) {
					$.each(data.creditReferPath.split(';'), function(index, path) {
						creditArr.push(path);
					});
				}
	            if(data.accredit){
	                creditArr.push(data.accredit);
	            }
	        });
        }
        var CustInfoAppBus = {
            'busiGloablaSeq': loan.applicationObj.platGlobalSeq,//业务编号
            'TRADE_TYPE': '00005',//客户资料
            'APPLY_NO': loan.applicationObj.APPLY_NO,//业务申请编号
            'CUSTOMER_NO': loan.applicationObj.CUSTOMER_NO,//客户流水号
            'attchType': '0',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': commonJson.udId,//设备编号
            'moduleId': loan.moduleId,//模块编号
            'tranId': loan.tranId,//交易编号
            'orgId': commonJson.orgId,//机构编号
            'operatorNo': commonJson.adminCount,//操作员
            'custName': loan.mInfo.name,//客户名称
            'custCredType': '0',//客户证件类型
            'custCredNo': loan.mInfo.cerNO,//客户证件号
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress,//工作地址
            'userId': commonJson.losUserId,  //los用户
            'OPER_TYPE': 'ADD',//操作类型 add-->表示新增  mod-->表示修改
            'FILE_LIST': creditArr
        };
        changeUploadAppBus(loan.applicationObj.phoneTime,CustInfoAppBus);

        var arrFile = [lendingInfo, circulateBlank];
        if (investigation != '') {
            arrFile.push(investigation);
        }
        if (loan.dzd.length != 0) {
            $.each(loan.dzd, function (index, ele) {
                arrFile.push(ele);
            })
        }
        if (loan.fdzd.length != 0) {
            $.each(loan.fdzd, function (index, ele) {
                arrFile.push(ele);
            })
        }
        //影像上传 业务参数
        var appApplyBus = {
            'busiGloablaSeq': loan.applicationObj.platGlobalSeq,//loan.platGlobalSeq,//业务编号
            'TRADE_TYPE': '00006',//受理审批资料
            'APPLY_NO': loan.applicationObj.APPLY_NO,//业务申请编号
            'CUSTOMER_NO': loan.applicationObj.CUSTOMER_NO,//客户流水号
            'attchType': '0',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': commonJson.udId,//设备编号
            'moduleId': loan.moduleId,//模块编号
            'tranId': loan.tranId,//交易编号
            'orgId': commonJson.orgId,//机构编号
            'operatorNo': commonJson.adminCount,//操作员
            'custName': loan.mInfo.name,//客户名称
            'custCredType': '0',//客户证件类型
            'custCredNo': loan.mInfo.cerNO,//客户证件号
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress,//工作地址
            'userId': commonJson.losUserId,  //los用户
            'OPER_TYPE': 'ADD',//操作类型 add-->表示新增  mod-->表示修改
            'FILE_LIST': arrFile
        };
        changeUploadAppBus(loan.applicationObj.applyTime,appApplyBus);

        var appmSignBus = {
            'busiGloablaSeq': loan.applicationObj.platGlobalSeq,//loan.platGlobalSeq,//业务编号
            'APPLY_NO': loan.applicationObj.APPLY_NO,//业务申请编号
            'CUSTOMER_NO': loan.applicationObj.CUSTOMER_NO,//客户流水号
            'attchType': '1',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': commonJson.udId,//设备编号
            'moduleId': loan.moduleId,//模块编号
            'tranId': loan.tranId,//交易编号
            'orgId': commonJson.orgId,//机构编号
            'operatorNo': commonJson.adminCount,//操作员
            'custName': loan.mInfo.name,//客户名称
            'custCredType': '0',//客户证件类型
            'custCredNo': loan.mInfo.cerNO,//客户证件号
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress//工作地址
        };
        changeUploadAppBus(loan.applicationObj.signTime,appmSignBus);



        //提交成功,修改数据库中对应压缩包的上传状态
        if(loan.mInfo.maritalStatus == '20' || loan.mInfo.maritalStatus == '21' || loan.mInfo.maritalStatus == '40' || loan.mInfo.maritalStatus == '23'){
            var appwSignBus = {
                'busiGloablaSeq': loan.applicationObj.platGlobalSeq,//业务编号
                'APPLY_NO': loan.applicationObj.APPLY_NO,//业务申请编号
                'CUSTOMER_NO': loan.applicationObj.CUSTOMER_NO,//客户流水号
                'attchType': '1',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                'deviceNo': commonJson.udId,//设备编号
                'moduleId': loan.moduleId,//模块编号
                'tranId': loan.tranId,//交易编号
                'orgId': commonJson.orgId,//机构编号
                'operatorNo': commonJson.adminCount,//操作员
                'custName': (loan.gInfo.name || ''),//客户名称
                'custCredType': '0',//客户证件类型
                'custCredNo': (loan.gInfo.cerNO || ''),//客户证件号
                'offlineOnline': commonJson.offlineOnline,//脱机/联机
                'workAddress': commonJson.workAddress//工作地址
            };
            changeUploadAppBus(loan.applicationObj.gSignTime,appwSignBus,function () {
                changeUploadStatus("02",loan.applicationObj.phoneTime, loan.applicationObj.applyTime,loan.applicationObj.signTime,loan.applicationObj.gSignTime);
            });
        }else{
            changeUploadStatus("02",loan.applicationObj.phoneTime, loan.applicationObj.applyTime,loan.applicationObj.signTime);
        }

        if (responseBody[0].results == "13") {   //联网核查超时
            showTags({
                'title': '提示',
                'content': responseBody[0].message,
                'ok': {
                    fun: function () {
                        $.mobile.changePage('./loan-complete.html', {transition: "slide"});

                    }
                }
            });
        } else {
            $.mobile.changePage('./loan-complete.html', {transition: "slide"});
        }
    }else if (responseBody[0].results == "08") {
        hideLoader();
        applyLendingLoanConF(event, compressCount);
    } else if (responseBody[0].results == "09") {
        hideLoader();
        showTags({
            'title': '提示',
            'content': '业务处理超时!&nbsp;' + responseBody[0].message,
            'ok': {
                title: '继续处理',
                fun: function () {
                    applyLendingLoanConF(event, compressCount);
                }
            }
        });
    } else {
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
                title: '确认',
                fun: function () {
                    if(loan.mInfo.maritalStatus == '20' || loan.mInfo.maritalStatus == '21' || loan.mInfo.maritalStatus == '40' || loan.mInfo.maritalStatus == '23') {
                        changeUploadStatus("03",loan.applicationObj.phoneTime, loan.applicationObj.applyTime,loan.applicationObj.signTime,loan.applicationObj.gSignTime);
                    }else{
                        changeUploadStatus("03",loan.applicationObj.phoneTime, loan.applicationObj.applyTime,loan.applicationObj.signTime);
                    }
                    loan.applicationObj.uploadTime = "" + myTime.CurTime(); //本地上传时间
                }
            }
        });
    }
}
//贷款进度查询，成功回调。
function ProcessQueryFunSucc(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    var textHtml = '<div class="queryProcess-title com-title"><div>姓名</div><div>证件号码</div><div>申请时间</div><div>办理进度</div><div>楼盘名称</div><div>房屋地址</div><div>拒绝原因</div></div>';
    if (responseCode[0].results == "00") { // 接口处理成功
//      daikuanapplicationObj.cardApplicationVO=responseCode[1].processQueryInfoVO[0];
        if (responseCode.length <= 1) {
            textHtml += '<li style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</li>';
            $("#queryProcess .page-number-con").show();
        } else {
            daikuanapplicationObj.responseCode = responseCode[1].processQueryInfoVO;
            daikuanapplicationObjon = new Array();
            $.each(responseCode, function (i, d) {
                var DATA = d.processQueryInfoVO;
                if (DATA) {
                    //拿数据  DATA[0].DISAGREE_REASON
                    textHtml += '<li class="box-rows">' +
                        '<div>' + DATA[0].CUSTOMER_NAME + '</div>' +
                        '<div class="id-card">' + DATA[0].DOCUMENT_ID + '</div>' +
                        '<div>' + DATA[0].APPLY_TIME + '</div>' +
                        '<div>' + daikuanpcardStatusObj[DATA[0].APPLY_STATUS] + '</div>' +
                        '<div>' + DATA[0].BUILDING_NAME + '</div>' +
                        '<div>' + DATA[0].BUILDING_ADDR + '</div>' +
                        '<div>' + DATA[0].DISAGREE_REASON + '</div>' +
                        '</li>';
                    daikuanapplicationObjon.push(DATA);
                }
            });
        }
        ;
        $('#queryProcess #queryProcess-con').html(textHtml);
        $("#queryProcess .page-number-con").show();
        //分页
        $("#queryProcess .page-number-con").createPage({
            pageCount: Math.ceil(responseCode[0]['totalNum.i'] / 7),
            current: daikuanapplicationObj.pageIndex,
            backFn: function (p) {
                showLoader('贷款申请进度查询中...');
                daikuanapplicationObj.pageIndex = p;
                daikuanapplicationObj.bussinessDetail.b[0]["pageNum.s"] = String(p);
                $("#queryProcess .box-rows").hide();
                ProcessQueryFun(daikuanapplicationObj.bussinessDetail, function (msg) {
                    ProcessQueryFunSucc(msg);
                }, function (err) {
                    hideLoader();
                    funFail(err);
                })
            }
        });
        //添加事件
        $(".queryProcess-con .box-rows").on('tap', function (ev) {
            var oTarget = ev.target;
            _this = $(oTarget).closest('.box-rows');
            $(_this).addClass('list-bgcolor').siblings().removeClass('list-bgcolor');
            $('#daikuan_bucongziliao').addClass('btn_next');
        });

    } else if (responseCode[0].results == "03") {
        hideLoader();
        $('#queryProcess .box-content').html(textHtml + '<li style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</li>');
        $("#queryProcess .page-number-con").hide();
    }
    else if (responseCode[0].results == "08") {
        hideLoader();
        showLoader("贷款申请进度查询中...");
        ProcessQueryFun(daikuanapplicationObj.bussinessDetail, function (msg) {
            ProcessQueryFunSucc(msg);
        }, function (err) {
            hideLoader();
            funFail(err);
        });
    } else {
        hideLoader();
//      $('#queryProcess .box-content').html(textHtml + '<li style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</li>');
        $("#queryProcess .page-number-con").hide();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}
//资料清单成功回调
function getMaterialListFunSucc(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    var textHtml = '';
    if (responseCode[0].results == "00") { // 接口处理成功
        $.each(responseCode, function (i, d) {
            var DATA = d.materialListVO;
            if (DATA) {
                //拿数据  DATA[0].DISAGREE_REASON
                textHtml += '<li>' + DATA[0].FILE_NAME + '<div class="qingdanliebiao_tupian qingdanliebiao_gou"></div></li>';
            }
        });
        if (responseCode.length == 1) {
            textHtml = '<li style="text-align:center;margin-top:30px;">未查询到业务数据</li>';
            $("#queryProcess .page-number-con").show();
        }
        ;
        $('#addData .qingdanliebiao_ul').html(textHtml);
    } else if (responseCode[0].results == "08") {
        hideLoader();
        showLoader('资料清单查询中...');
        var aboutJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId3, //交易编号
                "orgId.s": commonJson.orgId,//机构号commonJson.orgId
                "operatorNo.s": commonJson.adminCount,//操作员commonJson.adminCount
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "DOCID.s": '1'//影像批次号
            }]
        };
        getMaterialListFun(suoJson, function (msg) {
            getMaterialListFunSucc(msg);
        }, function (err) {
            hideLoader();
            funFail(err);
        })
    } else {
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}

//提交查询征信报告
function creditReportQuery(sendJson){
	showLoader('征信查询信息提交中..');
	createCreditReportInquiryFun(sendJson, function(msg){
		var responseBody = responseBodySuccFormat(msg);
	    if(responseBody[0].results == '00'){
	        showTags({
	            'title': '提示',
	            'content': '征信查询请求已提交，请稍后查看结果!',
	            'ok': {
	                fun: function () {
	                    $.mobile.changePage('./credit-search.html', {
	                        reverse: true
	                    });
	                }
	            }
	        });
	    } else if (responseBody[0].results == '08') {
	    	creditReportQuery(sendJson);
	    } else {
	    	showTags({
	            'title': '提示',
	            'content': responseBody[0].message,
	            'ok': {}
	        });
	        if(commonJson.cipUserId){
	        	$('#queryTypeSelect').val('1').selectmenu("refresh", true);
	        }
	    }
    }, function(err){
        hideLoader();
        funFail(err);
        if(commonJson.cipUserId){
        	$('#queryTypeSelect').val('1').selectmenu("refresh", true);
        }
    });
}

//获取行政区划代码
function getAreaCode(){
	showLoader('数据加载中..');
	getAreaCodeFun({      //发送请求的参数
        "b": [{
            'deviceNo.s': commonJson.udId, //设备编号
            'moduleId.s': loan.moduleId, //模块编号
            'tranId.s': loan.tranId1, //交易编号
            'orgId.s': commonJson.orgId, //机构号
            'operatorNo.s': commonJson.adminCount, //操作员
            'offlineOnline.s': commonJson.offlineOnline, //脱机/联机
            'workAddress.s': commonJson.workAddress //工作地址
        }]
    }, function(msg){
    	var responseBody = responseBodySuccFormat(msg);
	    if(responseBody[0].results == '00'){
	    	responseBody.shift();
	        window.localStorage.areaCode = JSON.stringify(responseBody);
	        initAreaCode();
	    } else if(responseBody[0].results == '08'){
	        getAreaCode();
	    } else {
	    	showTags({
	            'title': '提示',
	            'content': responseBody[0].message,
	            'ok': {
	            	fun: function () {
	                    $.mobile.changePage('./credit-search.html', {
	                        reverse: true
	                    });
	                }
	            }
	        });
	    }
	}, function(err){
		hideLoader();
        showTags({
            'title': '提示',
            'content': '获取行政区划代码失败!',
            'ok': {
            	fun: function () {
                    $.mobile.changePage('./credit-search.html', {
                        reverse: true
                    });
                }
            }
        });
	});
}
//获取可短信通知征信查询人员
function getNoticeCreditUser(){
	showLoader('数据加载中..');
	getNoticeCreditUserFun({      //发送请求的参数
        "b": [{
            'deviceNo.s': commonJson.udId, //设备编号
            'moduleId.s': loan.moduleId, //模块编号
            'tranId.s': loan.tranId1, //交易编号
            'orgId.s': commonJson.orgId, //机构号
            'operatorNo.s': commonJson.adminCount, //操作员
            'offlineOnline.s': commonJson.offlineOnline, //脱机/联机
            'workAddress.s': commonJson.workAddress, //工作地址
            'supeOrgId.s': commonJson.superOrgId //上级机构号
        }]
    }, function(msg){
    	var responseBody = responseBodySuccFormat(msg);
	    if(responseBody[0].results == '00' || responseBody[0].results == '03'){
	    	if(responseBody.length > 1){
	    		responseBody.shift();
	    		$.each(responseBody, function(index, data) {
	    			data = data.sysUser[0];
		        	$('#noticeUser').append($('<option>').val(data.cellPhone).html(data.userId + ' ' + data.realName));
		        });
	    	}
	    	initAreaCode();
	    } else if(responseBody[0].results == '08'){
	        getNoticeCreditUser();
	    } else {
	    	showTags({
	            'title': '提示',
	            'content': responseBody[0].message,
	            'ok': {
	            	fun: function () {
	                    $.mobile.changePage('./credit-search.html', {
	                        reverse: true
	                    });
	                }
	            }
	        });
	    }
    }, function(err){
    	hideLoader();
        showTags({
            'title': '提示',
            'content': '获取征信查询人员失败!',
            'ok': {
            	fun: function () {
                    $.mobile.changePage('./credit-search.html', {
                        reverse: true
                    });
                }
            }
        });
    });
}
