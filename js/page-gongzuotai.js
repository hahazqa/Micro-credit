/**
 *丁宗花－2015-9-8
 */
//暂存办理主界面－(gongzuotai-zcbl.html)
$(document).on("pageshow", '#gongzuotai-zcywjxbl', function() {
    workbenchJson.isTemp = false; //初始化非暂存业务继续办理
    //暂存数据库查询
    queryTableDataByConditions({
        "databaseName": "myDatabase", //数据库名
        "tableName": "temporary_info", //表名
        "conditions": {
            "operatorNo": commonJson.adminCount
        }
    }, function(msg) {
        workbenchTempListSucc(msg,{"operatorNo": commonJson.adminCount});
    }, function(err) {
        alert(err)
        funDataFail(err);
    });

    // $("#seach-day").css("margin-top", ($(window).height() - 365) / 2);
    $(".seach-botton").on("click", function() {
        $("#gongzuotai-zcywjxbl input[type='date']:first").val(dateGetYMD(10)[1]);
        $("#gongzuotai-zcywjxbl input[type='date']:last").val(dateGetYMD(10)[0]);
        $("#seach-day-con").show();
    });
    //点击搜索框放弃按钮
    $("#gongzuotai-zcywjxbl .fangqi-seach:first").on('click', function() {
            $("#seach-day-con").hide();
        })
        //点击搜索框搜索按钮
    $("#gongzuotai-zcywjxbl .fangqi-seach:last").on('click', function() {

            var sT = $("#gongzuotai-zcywjxbl input[type='date']:first").val();
            var eT = $("#gongzuotai-zcywjxbl input[type='date']:last").val();
            if (!sT || !eT) {
                showMsg('查询时间不能为空!');
                return;
            }
            if (myTime.DateToUnix(sT) > myTime.DateToUnix(eT)) {
                showMsg('查询开始时间不能小于终止时间!');
                return;
            }
            var cusName = $("#gongzuotai-zcywjxbl input.input-test-con:eq(0)").val();
            var cusNo = $("#gongzuotai-zcywjxbl input.input-test-con:eq(1)").val();
            if (cusName != "" && !fmReg.cnName.test(cusName)) {
                showMsg(fmRegMsg.cnName);
                return;
            }
            if (cusNo != "" && !fmReg.cerNo.test(cusNo)) {
                showMsg(fmRegMsg.cerNo);
                return;
            }
            var conJson = {
                    "operatorNo": commonJson.adminCount,
                    "MASCARDNAME": cusName,
                    "CERTNUM": cusNo,
                    "BUSINESSTYPE": $("#gongzuotai-zcywjxbl select.drop-down").val(),
                    "SUBMITTIME": "between " + myTime.DateToUnix(sT) + " and " + (Number(myTime.DateToUnix(eT)) + 86400)
                };
            var loanJson = {
                "operatorNo": commonJson.adminCount,
                "mname": cusName,
                "mcerNo": cusNo,
                "BUSINESSTYPE": $("#gongzuotai-zcywjxbl select.drop-down").val(),
                "SUBMITTIME": "between " + myTime.DateToUnix(sT) + " and " + (Number(myTime.DateToUnix(eT)) + 86400)
            }

                //alert(JSON.stringify(conJson));
            queryTableDataByConditions({
                "databaseName": "myDatabase", //数据库名
                "tableName": "temporary_info", //表名
                "conditions": conJson
            }, function(msg) {
                $("#seach-day-con").hide();
                workbenchTempListSucc(msg,loanJson);
            }, function(err) {
                funDataFail(err);
            });
        })
        //为每一条数据添加class=‘click'
    $("#gongzuotai-zcywjxbl .box-content").on("click", ".box-rows", function() {
        if ($(this).hasClass('click')) {
            $(this).removeClass('click');
            $('#gongzuotai-zcywjxbl .previous').removeClass('btn_next');
        } else {
            //遍历每一条数据恢复初始状态
            $('#gongzuotai-zcywjxbl .box-rows').each(function() {
                //console.log(this);
                if ($(this).hasClass('click')) {
                    $(this).removeClass('click');
                    $('#gongzuotai-zcywjxbl .previous').addClass('btn_next');
                }
            });
            $(this).addClass('click');
            if (commonJson.offlineOnline == 'offline' && $(this).attr('offlineOnline') == 'online') {
                $('#gongzuotai-zcywjxbl .previous:eq(0)').addClass('btn_next');
                $('#gongzuotai-zcywjxbl .previous:eq(1)').removeClass('btn_next');
            } else {
                $('#gongzuotai-zcywjxbl .previous').addClass('btn_next');
            }

        }
    });
    //点击终止办理
    $("#gongzuotai-zcywjxbl .previous:first").on("click", function() {
        if (!($(this).hasClass('btn_next'))) return;
        showTags({
            'title': '您将会终止办理该业务',
            'content': '',
            'ok': {
                title: '放弃'
            },
            'cancel': {
                title: '终止',
                fun: function() {
                    var data = JSON.parse($("#gongzuotai-zcywjxbl .box-content").find(".click").attr('data'));
                    //判断当前要终止办理的业务是申请贷款还是申请信用卡
                    var tableName ='temporary_info';
                    if(data.BUSINESSTYPE == '申请贷款'||data.BUSINESSTYPE == '面签'||data.BUSINESSTYPE == '申请小微贷款'||data.BUSINESSTYPE == '申请信用贷款'||data.BUSINESSTYPE == '小贷客户信息管理'){
                        tableName = 'loanapply_info';
                    }
                    deleteTableData({
                        "databaseName": "myDatabase",
                        "tableName": tableName,
                        "conditions": [{
                            "SUBMITTIME": data.SUBMITTIME
                        }]
                    }, function(msg) {
                        queryTableDataByConditions({
                            "databaseName": "myDatabase", //数据库名
                            "tableName": "temporary_info", //表名
                            "conditions": {
                                "operatorNo": commonJson.adminCount
                            }
                        }, function(msg) {
                            workbenchTempListSucc(msg,{"operatorNo": commonJson.adminCount});
                        }, function(err) {
                            funDataFail(err);
                        });
                    }, function(err) {})
                }
            }
        });
    });
    //点击继续办理办理
    $("#gongzuotai-zcywjxbl .previous:last").on("click", function() {
        if (!($(this).hasClass('btn_next'))) return;
        showTags({
            'title': '您将继续办理该业务',
            'content': '',
            'ok': {
                title: '放弃'
            },
            'cancel': {
                title: '继续',
                fun: function() {
                    var data = $("#gongzuotai-zcywjxbl .box-content").find(".click").attr('data');
                    workbenchJson.temp = JSON.parse(data);
                    workbenchJson.isTemp = true;
                    var tableName = 'temporary_info'
;                    if(workbenchJson.temp.BUSINESSTYPE =='申请贷款' ||workbenchJson.temp.BUSINESSTYPE == '面签'||workbenchJson.temp.BUSINESSTYPE == '申请小微贷款'||workbenchJson.temp.BUSINESSTYPE == '申请信用贷款'||workbenchJson.temp.BUSINESSTYPE == '小贷客户信息管理'){
                        tableName = 'loanapply_info';
                    }
                    deleteTableData({
                        "databaseName": "myDatabase",
                        "tableName": tableName,
                        "conditions": [{
                            "SUBMITTIME": workbenchJson.temp.SUBMITTIME
                        }]
                    }, function(msg) {}, function(err) {})
                    if(workbenchJson.temp.BUSINESSTYPE =='申请贷款'){
                        $.mobile.changePage('../loan/' + workbenchJson.temp.TEMPFROM);
                    }else if(workbenchJson.temp.BUSINESSTYPE =='申请信用贷款'){
                        $.mobile.changePage('../loan/' + workbenchJson.temp.TEMPFROM);
                    }else if(workbenchJson.temp.BUSINESSTYPE =='申请小微贷款'){
                        $.mobile.changePage('../loan/' + workbenchJson.temp.TEMPFROM);
                    }else if(workbenchJson.temp.TEMPFROM == '小贷客户信息管理'){
                    	$.mobile.changePage('../loan/' + workbenchJson.temp.TEMPFROM);
                    }else if(workbenchJson.temp.BUSINESSTYPE =='面签'){
                        $.mobile.changePage('../faceSign/' + workbenchJson.temp.TEMPFROM);
                    }else{
                        $.mobile.changePage('../xinyongka/' + workbenchJson.temp.TEMPFROM);
                    }
                }
            }
        });
    });
    //点击按姓名搜索
    $("#gongzuotai-zcywjxbl .seach_icon").on('click', function() {
        if (!fmReg.cnName.test($("#gongzuotai-zcywjxbl .head-seach-input").val())) {
            showMsg(fmRegMsg.cnName);
            return;
        }
        queryTableDataByConditions({
            "databaseName": "myDatabase", //数据库名
            "tableName": "temporary_info", //表名
            "conditions": {
                "operatorNo": commonJson.adminCount,
                "MASCARDNAME": $("#gongzuotai-zcywjxbl .head-seach-input").val()
            }
        }, function(msg) {
            workbenchTempListSucc(msg,{"operatorNo": commonJson.adminCount, "mname": $("#gongzuotai-zcywjxbl .head-seach-input").val()});
        }, function(err) {
            funDataFail(err);
        });
    })

});
var tuojiConditions = null; //脱机已受理 查询条件
var tuojiPtConditions = null; //脱机已受理 查询条件
var tuoCurIndex = 0; //当前是脱机已受理还是平台待受理 0脱机已受理 1平台待受理
var tuojiCurData = 0;
var tuojiCurDataLastVal = 0;
var tuoPtDataLastVal = 0;
var tuojiPtPLATGLOBALSEQ = ''; //平台待处理 选中状态数据的流水号
var tuojiPtListData = '';
var tuojiSearchBtn = 'tabs';
//脱机办理－(gongzuotai-tjbl.html)
$(document).on("pageshow", '#gongzuotai-tuojibanli', function() {
    getCurrentLocationCoordinateFun(function(){
        tuojiSearchBtn = 'tabs';
        showLoader('加载中...');

        tuojiConditions = {
            "operatorNo": commonJson.adminCount,
            "SUBMITTIME": "between " + (myTime.CurTime() - 86400 * 10) + " and " + myTime.CurTime() //十天内时间
        };

        //tabs切换
        $('#gongzuotai-tuojibanli .tuoji-pingtaidai-con li').on('click', function() {
            tuojiSearchBtn = 'tabs';
            tuoCurIndex = $(this).index();
            if ($(this).hasClass('tuoji-pingtaidai-bgcolor')) return;
            $(this).addClass('tuoji-pingtaidai-bgcolor').siblings('li').removeClass('tuoji-pingtaidai-bgcolor'); //头部
            $('.conter-auto:eq(' + tuoCurIndex + ')').show().siblings('.conter-auto').hide(); //内容
            $('.footter:eq(' + tuoCurIndex + ')').show().siblings('.footter').hide(); //底部
            $('#gongzuotai-tuojibanli .footter:eq(1) .previous').removeClass('btn_next');
            $("#gongzuotai-tuojibanli .footter:eq(1) .tuojiyishouli-xq").hide();
            if (tuoCurIndex == '0') {
                tuojiConditions = {
                    "operatorNo": commonJson.adminCount,
                    "SUBMITTIME": "between " + (myTime.CurTime() - 86400 * 10) + " and " + myTime.CurTime() //十天内时间
                };
                //脱机数据库查询
                queryTableDataByConditions({
                    "databaseName": "myDatabase", //数据库名
                    "tableName": "nonetcustomer_info", //表名
                    "conditions": tuojiConditions
                }, function(msg) {
                    workbenchOfflineListSucc(msg);
                }, function(err) {
                    funDataFail(err);
                });
            } else {
                showLoader('加载中...');
                tuojiPtConditions = {
                    "b": [{
                        "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                        "deviceNo.s": commonJson.deviceNo, //设备编号
                        "orgId.s": commonJson.orgId,
                        "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                        "tranId.s": workbenchJson.tranId2,//creditJson.tranId, //交易编号
                        "operatorNo.s": commonJson.adminCount, //操作员
                        "workAddress.s": commonJson.workAddress, //工作地址
                        "masCardName.s": "", //客户姓名
                        "certNum.s": "", //证件号
                        "bussType.s": "", //业务类型
                        "stime.s": "", //办理开始时间
                        "etime.s": "", //办理结束时间
                        "handleState.s": "", //业务处理状态
                        "pageSize.s": "",
                        "pageNo.s": ""
                    }]
                };
                ptQueryOfflineBussFun(tuojiPtConditions, function(msg) {
                    ptQueryOfflineBussSucc(msg);
                }, function(err) {
                    funFail(err);
                })
            }
        })
        //脱机数据库查询
        queryTableDataByConditions({
            "databaseName": "myDatabase", //数据库名
            "tableName": "nonetcustomer_info", //表名
            "conditions": tuojiConditions
        }, function(msg) {
            workbenchOfflineListSucc(msg);
        }, function(err) {
            alert(err)
            funDataFail(err);
        });
        //平台脱机业务列表查询
        tuojiPtConditions = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                "deviceNo.s": commonJson.deviceNo, //设备编号
                "orgId.s": commonJson.orgId,
                "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                "tranId.s": workbenchJson.tranId2,//creditJson.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "workAddress.s": commonJson.workAddress, //工作地址
                "masCardName.s": "", //客户姓名
                "certNum.s": "", //证件号
                "bussType.s": "", //业务类型
                "stime.s": "", //办理开始时间
                "etime.s": "", //办理结束时间
                "handleState.s": "", //业务处理状态
                "pageSize.s": "",
                "pageNo.s": ""
            }]
        };
        ptQueryOfflineBussFun(tuojiPtConditions, function(msg) {
            ptQueryOfflineBussSucc(msg);
        }, function(err) {
            funFail(err);
        })
        // $("#seach-day").css("margin-top", ($(window).height() - 365) / 2);
        $(".seach-botton").on("click", function() {
            $("#gongzuotai-tuojibanli input[type='date']:first").val(dateGetYMD(10)[1]);
            $("#gongzuotai-tuojibanli input[type='date']:last").val(dateGetYMD(10)[0]);
            $("#seach-day-con").show();
        });
        //为每一条数据添加class=‘click'
        $("#gongzuotai-tuojibanli .box-content:eq(0)").on("click", ".box-rows", function(ev) {
            if ($(this).hasClass('click')) {
                $(this).removeClass('click');
                $('#gongzuotai-tuojibanli .footter:eq(0) .back-zhongzhi').removeClass('btn_next');
                $("#gongzuotai-tuojibanli .footter:eq(0) .tuojiyishouli-xq").hide();
                if ($("#gongzuotai-tuojibanli .box-content:eq(0)").find('.tuojibanli-value:contains(脱机已受理)').length > 0) { //有可以继续办理的业务
                    $("#gongzuotai-tuojibanli .footter:eq(0) .previous:eq(1)").html('全部继续').addClass('btn_next');
                } else {
                    $("#gongzuotai-tuojibanli .footter:eq(0) .previous:eq(1)").html('全部继续').removeClass('btn_next');
                }
            } else {
                tuojiCurData = JSON.parse($(this).attr('data'));
                tuojiCurDataLastVal = $(this).find('.tuojibanli-value').text();
                $('#gongzuotai-tuojibanli .box-content:eq(0) .box-rows').removeClass('click');
                $(this).addClass('click');
                $("#gongzuotai-tuojibanli .footter:eq(0) .tuojiyishouli-xq").show();
                $("#gongzuotai-tuojibanli .footter:eq(0) .previous:eq(1)").html("继续");
                if (tuojiCurDataLastVal == '客户经理终止办理') {
                    $('#gongzuotai-tuojibanli .footter:eq(0) .previous').removeClass('btn_next');
                } else {
                    $('#gongzuotai-tuojibanli .footter:eq(0) .back-zhongzhi').addClass('btn_next');
                }
            }
        });
        //脱机已受理 点击终止办理
        $("#gongzuotai-tuojibanli .footter:eq(0) .previous:first").on("click", function() {
            if (!($(this).hasClass('btn_next'))) return;
            showTags({
                'title': '您将会终止办理该业务',
                'content': '',
                'ok': {
                    title: '放弃'
                },
                'cancel': {
                    title: '终止',
                    fun: function() {
                        offlineGoOnSubmit({
                            curCacheStopContinue: JSON.stringify(tuojiCurData)
                        });
                        // var data = JSON.parse($("#gongzuotai-tuojibanli .box-content:eq(0)").find(".click").attr('data'));
                        // modifyTableData({
                        //     "databaseName": "myDatabase",
                        //     "tableName": "nonetcustomer_info",
                        //     "conditions": [{
                        //         "SUBMITTIME": data.SUBMITTIME
                        //             //"SUBMITTIME": "between " + data.SUBMITTIME + " and " + data.SUBMITTIME
                        //     }],
                        //     "data": [{
                        //         "BUSSINESSSTATUS": "客户经理终止办理" //卡产品代码
                        //     }]
                        // }, function(msg) {
                        //     $("#gongzuotai-tuojibanli .box-content:eq(0)").find(".click .tuojibanli-value").text('客户经理终止办理');
                        //     $('#gongzuotai-tuojibanli .footter:eq(0) .back-zhongzhi').removeClass('btn_next');
                        //     $("#gongzuotai-tuojibanli .footter:eq(0) .tuojiyishouli-xq").hide();
                        //     $("#gongzuotai-tuojibanli .footter:eq(0) .next-btn").html('全部继续');
                        // }, function(err) {
                        // })
                    }
                }
            });
        });
        //脱机已受理 点击继续办理办理
        $("#gongzuotai-tuojibanli .footter:eq(0) .previous:last").on("click", function() {
            if (!($(this).hasClass('btn_next'))) return;
            var _this = $(this);
            Meap.isNetConnect(function(msg) {
                if (msg == '03') {
                    showTags({
                        'title': '提示',
                        'content': '当前网络不可用，请检测网络！',
                        'ok': {}
                    });
                } else {
                    if (_this.text() == "全部继续") {
                        if (!_this.hasClass('btn_next')) return;
                        showTags({
                            'title': '您将继续办理全部业务',
                            'content': '',
                            'ok': {
                                title: '放弃'
                            },
                            'cancel': {
                                title: '继续',
                                fun: function() {
                                    offlineGoOnSubmit({
                                        "curCacheAllContinue": 0
                                    });
                                }
                            }
                        });
                    } else {
                        showTags({
                            'title': '您将继续办理该业务',
                            'content': '',
                            'ok': {
                                title: '放弃'
                            },
                            'cancel': {
                                title: '继续',
                                fun: function() {
                                    //alert('继续办理');
                                    //var data = JSON.parse($("#gongzuotai-tuojibanli .box-content").find(".click").attr('data'));
                                    offlineGoOnSubmit({
                                        curCacheOneContinue: $("#gongzuotai-tuojibanli .box-content:eq(0)").find("li.click").index()
                                    });
                                }
                            }
                        });
                    }
                }
            }, function(err) {

            });

        });
        //点击详情
        $("#gongzuotai-tuojibanli .tuojiyishouli-xq:eq(0)").on('click', function() {
            var data = $("#gongzuotai-tuojibanli .box-content:eq(0)").find(".click").attr('data');
            workbenchJson.detail = JSON.parse(data);
            if (workbenchJson.detail.BUSI_TYPE == '02') {
                $.mobile.changePage('gongzuotai-creditCardDetails.html');
            }else if(workbenchJson.detail.BUSI_TYPE == '05'){
                if (workbenchJson.detail.REMARK2 == 'Y004' || workbenchJson.detail.REMARK2 == 'Y008') {
                    $.mobile.changePage('gongzuotai-yunyingPersonDetails.html');
                } else if (workbenchJson.detail.REMARK2 == 'Y001' || workbenchJson.detail.REMARK2 == 'Y003') {
                    $.mobile.changePage('gongzuotai-yunyingDetails.html');
                } else if (workbenchJson.detail.REMARK2 == 'Y005') {
                    $.mobile.changePage('gongzuotai-yunyingPersonAgencyKaihuDetails.html');
                } else if (workbenchJson.detail.REMARK2 == 'Y006') {
                    $.mobile.changePage('gongzuotai-yunyingPersonBuyLicaiDetails.html');
                } else if (workbenchJson.detail.REMARK2 == 'Y007') {
                    $.mobile.changePage('gongzuotai-yunyingPersonBuyBaoxianDetails.html');
                } else if (workbenchJson.detail.REMARK2 == 'Y009') {
                    $.mobile.changePage('gongzuotai-yunyingPersonAgencyLicaiDetails.html');
                }

            }
        })
        //平台待处理 每一条数据点击
        $("#gongzuotai-tuojibanli .box-content:eq(1)").on("click", ".box-rows", function(ev) {
            tuoPtDataLastVal = $(this).find('.tuojibanli-value').text();
            if ($(this).hasClass('click')) {
                $(this).removeClass('click');
                $('#gongzuotai-tuojibanli .footter:eq(1) .previous').removeClass('btn_next');
                $("#gongzuotai-tuojibanli .footter:eq(1) .tuojiyishouli-xq").hide();
            } else {
                $('#gongzuotai-tuojibanli .box-content:eq(1) .box-rows').removeClass('click');
                $(this).addClass('click');
                $("#gongzuotai-tuojibanli .footter:eq(1) .tuojiyishouli-xq").show();
                if (tuoPtDataLastVal == '人脸识别失败') {
                    $('#gongzuotai-tuojibanli .footter:eq(1) .previous').addClass('btn_next');
                } else {
                    $('#gongzuotai-tuojibanli .footter:eq(1) .previous').removeClass('btn_next');
                }

            }
        });
        //平台点击详情
        $("#gongzuotai-tuojibanli .tuojiyishouli-xq:eq(1)").on('click', function() {
            tuoPtDataLastVal = $("#gongzuotai-tuojibanli .box-content:eq(1)").find('.click .tuojibanli-value').text();
            tuojiPtPLATGLOBALSEQ = $("#gongzuotai-tuojibanli .box-content:eq(1)").find(".click").attr('PLATGLOBALSEQ');
            tuojiPtListData = $("#gongzuotai-tuojibanli .box-content:eq(1)").find(".click").attr('tuojiPtListData');
            $.mobile.changePage('gongzuotai-creditCardPtDetails.html');
        })
        //平台待受理 点击终止
        $("#gongzuotai-tuojibanli .footter:eq(1) .previous:eq(0)").on('click', function() {
            if (!($(this).hasClass('btn_next'))) return;
            tuojiPtPLATGLOBALSEQ = $("#gongzuotai-tuojibanli .box-content:eq(1)").find(".click").attr('PLATGLOBALSEQ');
            showTags({
                'title': '您将会终止办理该业务',
                'content': '',
                'ok': {
                    title: '放弃'
                },
                'cancel': {
                    title: '终止',
                    fun: function() {
                        showLoader('提交中...');
                        var sendJson = {
                            "b": [{
                                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                                "deviceNo.s": commonJson.deviceNo, //设备编号
                                "orgId.s": commonJson.orgId,
                                "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                                "tranId.s": workbenchJson.tranId2,//creditJson.tranId, //交易编号
                                "operatorNo.s": commonJson.adminCount, //操作员
                                "workAddress.s": commonJson.workAddress, //工作地址
                                "PLATGLOBALSEQ.s": tuojiPtPLATGLOBALSEQ, //业务流水号
                                "stopBuss.s": "", //是否终止业务办理
                                "handleState.s": "08" //业务处理状态
                            }]
                        };
                        dealOfflineBussFun(sendJson, function(msg) {
                            dealOfflineBussSucc(msg);
                        }, function(err) {
                            funFail(err);
                        })
                    }
                }
            });
        })
        //点击人工授权
        $("#gongzuotai-tuojibanli .footter:eq(1) .previous:eq(1)").on('click', function() {
            if (!($(this).hasClass('btn_next'))) return;
            tuojiPtPLATGLOBALSEQ = $("#gongzuotai-tuojibanli .box-content:eq(1)").find(".click").attr('PLATGLOBALSEQ');
            tuojiPtListData = $("#gongzuotai-tuojibanli .box-content:eq(1)").find(".click").attr('tuojiPtListData');
            $.mobile.changePage('gongzuotai-tuojibanli-lldb.html');
        })
        //点击按姓名搜索
        $("#gongzuotai-tuojibanli .seach_icon").on('click', function() {
            if (!fmReg.cnName.test($("#gongzuotai-tuojibanli .head-seach-input").val())) {
                showMsg(fmRegMsg.cnName);
                return;
            }
            tuojiConditions = { //姓名搜索的条件
                "operatorNo": commonJson.adminCount,
                "MASCARDNAME": $.trim($("#gongzuotai-tuojibanli .head-seach-input").val())
            };
            tuojiSearchBtn = 'name';
            if (tuoCurIndex == '0') { //脱机已受理
                queryTableDataByConditions({
                    "databaseName": "myDatabase", //数据库名
                    "tableName": "nonetcustomer_info", //表名
                    "conditions": tuojiConditions
                }, function(msg) {
                    workbenchOfflineListSucc(msg);
                }, function(err) {
                    funDataFail(err);
                });
            } else { //平台待受理
                //平台脱机业务列表查询
                showLoader('查询中...');
                tuojiPtConditions = {
                    "b": [{
                        "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                        "deviceNo.s": commonJson.deviceNo, //设备编号
                        "orgId.s": commonJson.orgId,
                        "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                        "tranId.s": workbenchJson.tranId2,//creditJson.tranId, //交易编号
                        "operatorNo.s": commonJson.adminCount, //操作员
                        "workAddress.s": commonJson.workAddress, //工作地址
                        "masCardName.s": $.trim($("#gongzuotai-tuojibanli .head-seach-input").val()), //客户姓名
                        "certNum.s": "", //证件号
                        "bussType.s": "", //业务类型
                        "stime.s": "", //办理开始时间
                        "etime.s": "", //办理结束时间
                        "handleState.s": "", //业务处理状态
                        "pageSize.s": "",
                        "pageNo.s": ""
                    }]
                };
                ptQueryOfflineBussFun(tuojiPtConditions, function(msg) {
                    ptQueryOfflineBussSucc(msg);
                }, function(err) {
                    funFail(err);
                })
            }


        })
        //点击搜索框放弃按钮
        $("#gongzuotai-tuojibanli .fangqi-seach:first").on('click', function() {
            $("#seach-day-con").hide();
        })
        //点击搜索框搜索按钮
        $("#gongzuotai-tuojibanli .fangqi-seach:last").on('click', function() {
            var sT = $("#gongzuotai-tuojibanli input[type='date']:first").val();
            var eT = $("#gongzuotai-tuojibanli input[type='date']:last").val();
            if (!sT || !eT) {
                showMsg('查询时间不能为空!');
                return;
            }
            if (myTime.DateToUnix(sT) > myTime.DateToUnix(eT)) {
                showMsg('查询开始时间不能小于终止时间!');
                return;
            }
            var cusName = $("#gongzuotai-tuojibanli input.input-test-con:eq(0)").val();
            var cusNo = $("#gongzuotai-tuojibanli input.input-test-con:eq(1)").val();
            if (cusName != "" && !fmReg.cnName.test(cusName)) {
                showMsg(fmRegMsg.cnName);
                return;
            }
            if (cusNo != "" && !fmReg.cerNo.test(cusNo)) {
                showMsg(fmRegMsg.cerNo);
                return;
            }
            /*if(!$("#gongzuotai-tuojibanli select.drop-down:eq(0)").val()){
             showMsg('业务类型不能为空!');
             return;
             }
             if(!$("#gongzuotai-tuojibanli select.drop-down:eq(1)").val()){
             showMsg('处理状态不能为空!');
             return;
             }*/
            tuojiSearchBtn = 'search';

            $("#seach-day-con").hide();
            tuojiConditions = { //条件搜索的条件
                "operatorNo": commonJson.adminCount,
                "MASCARDNAME": $.trim($("#gongzuotai-tuojibanli input.input-test-con:eq(0)").val()),
                "CERTNUM": $.trim($("#gongzuotai-tuojibanli input.input-test-con:eq(1)").val()),
                "BUSINESSTYPE": $("#gongzuotai-tuojibanli select.drop-down:eq(0)").val(),
                "BUSSINESSSTATUS": $("#gongzuotai-tuojibanli select.drop-down:eq(1)").val(),
                "SUBMITTIME": "between " + myTime.DateToUnix(sT) + " and " + (Number(myTime.DateToUnix(eT)) + 86400)
            }
            if (tuoCurIndex == '0') { //脱机已受理
                //alert(JSON.stringify(conJson));
                queryTableDataByConditions({
                    "databaseName": "myDatabase", //数据库名
                    "tableName": "nonetcustomer_info", //表名
                    "conditions": tuojiConditions
                }, function(msg) {
                    $("#seach-day-con").hide();
                    workbenchOfflineListSucc(msg);
                }, function(err) {
                    funDataFail(err);
                });
            } else { //平台待处理
                showLoader('查询中...');
                tuojiPtConditions = {
                    "b": [{
                        "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                        "deviceNo.s": commonJson.deviceNo, //设备编号
                        "orgId.s": commonJson.orgId,
                        "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                        "tranId.s": workbenchJson.tranId2,//creditJson.tranId, //交易编号
                        "operatorNo.s": commonJson.adminCount, //操作员
                        "workAddress.s": commonJson.workAddress, //工作地址
                        "masCardName.s": $.trim($("#gongzuotai-tuojibanli input.input-test-con:eq(0)").val()), //客户姓名
                        "certNum.s": $.trim($("#gongzuotai-tuojibanli input.input-test-con:eq(1)").val()), //证件号
                        "bussType.s": "", //业务类型
                        "stime.s": sT.replace(/-/g, ''), //办理开始时间
                        "etime.s": eT.replace(/-/g, ''), //办理结束时间
                        "handleState.s": $("#gongzuotai-tuojibanli select.drop-down:eq(1)").val(), //业务处理状态
                        "pageSize.s": "",
                        "pageNo.s": ""
                    }]
                };
                ptQueryOfflineBussFun(tuojiPtConditions, function(msg) {
                    ptQueryOfflineBussSucc(msg);
                }, function(err) {
                    funFail(err);
                })
            }
        })
    });
});

//脱机业务继续/终止办理
function offlineGoOnSubmit(msgJSON){
    var time_cunchuchaoshi = myTime.CurTimeStamp();
    showLoader('提交中...');
    ImagingOperaTions.busiStatus = '';
    var handleState = '';
    var curIndex = 0; //当前执行数据在ul中得序列号
    var offlineSendJson  = {};
    if (msgJSON.curCacheOneContinue || msgJSON.curCacheOneContinue == '0') { //本地脱机业务单笔提交
        offlineSendJson = JSON.parse($('#gongzuotai-tuojibanli .box-content li:eq(' + msgJSON.curCacheOneContinue + ')').attr('data'));
        curIndex = msgJSON.curCacheOneContinue;
    }
    if (msgJSON.curCacheAllContinue || msgJSON.curCacheAllContinue == '0') { //全部提交
        offlineSendJson = JSON.parse($('#gongzuotai-tuojibanli .box-content li:eq(' + msgJSON.curCacheAllContinue + ')').attr('data'));
        curIndex = msgJSON.curCacheAllContinue;
    }
    if (msgJSON.curCacheOneDetailContinue) { //详情提交
        offlineSendJson = JSON.parse(msgJSON.curCacheOneDetailContinue);
        curIndex = 'detail';
    }
    if (msgJSON.curCacheStopContinue) { //终止提交
        offlineSendJson = JSON.parse(msgJSON.curCacheStopContinue);
        curIndex = 'stop';
        handleState = '-1';
        ImagingOperaTions.busiStatus = '01';
    }
    if (xinyonfkaJson.shijianChuo == '1') {} else {
        xinyonfkaJsonone.shijianChuo = time_cunchuchaoshi;
    }
    var platGlobalSeq = offlineSendJson.REMARK6;    //上次提交的流水号
    if(platGlobalSeq){
        if (offlineSendJson.BUSI_TYPE == '02') {    //信用卡申请
            creditJson.platGlobalSeq = platGlobalSeq;
            offlineGoonCutoutSubmit(offlineSendJson, curIndex, msgJSON, handleState);
        } else if (offlineSendJson.BUSI_TYPE == '05') {     //运营视频提交
            creditJson.storage.picFileAllARR = offlineSendJson.picFileARR.split('&&');
            ImagingOperaTions.platGlobalSeq = platGlobalSeq;
            offlineGoonCutoutSubmit(offlineSendJson, curIndex, msgJSON, handleState);
        }
    }else{
        if (offlineSendJson.BUSI_TYPE == '02') {    //信用卡申请
            getPlatGlobalSeq(creditJson, function (msg) {
                showLoader("插入流水号...");
                modifyTableData({       //业务数据插入流水号
                    "databaseName": "myDatabase",
                    "tableName": "nonetcustomer_info",
                    "conditions": [{
                        "SUBMITTIME": offlineSendJson.SUBMITTIME
                    }],
                    "data": [{
                        "REMARK6": creditJson.platGlobalSeq
                    }]
                }, function(msg) {
                    hideLoader();
                    offlineGoonCutoutSubmit(offlineSendJson, curIndex, msgJSON, handleState);
                }, function(err) {
                    hideLoader();
                    funDataFail(err);
                });
            });
        } else if (offlineSendJson.BUSI_TYPE == '05') {     //运营视频提交
            creditJson.storage.picFileAllARR = offlineSendJson.picFileARR.split('&&');
            getPlatGlobalSeq(ImagingOperaTions, function (msg) {
                showLoader("插入流水号...");
                modifyTableData({       //业务数据插入流水号
                    "databaseName": "myDatabase",
                    "tableName": "nonetcustomer_info",
                    "conditions": [{
                        "SUBMITTIME": offlineSendJson.SUBMITTIME
                    }],
                    "data": [{
                        "REMARK6": ImagingOperaTions.platGlobalSeq
                    }]
                }, function(msg) {
                    hideLoader();
                    offlineGoonCutoutSubmit(offlineSendJson, curIndex, msgJSON, handleState);
                }, function(err) {
                    hideLoader();
                    funDataFail(err);
                });
            });
        }
    }
}

//脱机业务继续/终止办理提交
function offlineGoonCutoutSubmit(offlineSendJson, curIndex, msgJSON, handleState){
    showLoader('影像压缩中...');
    if (offlineSendJson.BUSI_TYPE == '02') {    //信用卡申请
        //订阅事件
        var compressCount = 0;  //压缩成功次数,为2时发起提交
        var ussbCallback = function(){
            hideLoader();
            topicUtil.unsubscribe("gongzuotai/offlineGoOnCreditSubmit");    //发布前取订事件防止重复发布
            offlineGoOnCreditSubmit(offlineSendJson, curIndex, msgJSON, handleState);
        };
        topicUtil.subscribe("gongzuotai/offlineGoOnCreditSubmit", ussbCallback);

        creditJson.phoneTime = myTime.CurTimeStamp();
        creditJson.signTime = creditJson.phoneTime + 1;
        //影像上传文件打包压缩插件
        offlineSendJson.picFileARR = offlineSendJson.picFileARR.split('&&');
        offlineSendJson.picFileARR.push(offlineSendJson.image);
        var imageNameIndex = offlineSendJson.image.lastIndexOf('\/') + 1;
        var imageName = offlineSendJson.image.substring(imageNameIndex);
        offlineSendJson.picFileInfoARR = JSON.parse(offlineSendJson.picFileInfoARR);
        offlineSendJson.picFileInfoARR[0].b.push({
            FILE_NAME: imageName,
            FILE_TYPE: 'F0000'
        });
        //将要上传的影像插入到ios断点上传的数据库中
        Meap.zipCompression(creditJson.platGlobalSeq + 'image', offlineSendJson.picFileARR, function (msg) {
            //影像上传 业务参数
            var appBussPhone = {
                'busiGloablaSeq': creditJson.platGlobalSeq, //业务编号
                'attchType': '0', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                'deviceNo': offlineSendJson.deviceNo, //设备编号
                'moduleId': workbenchJson.moduleID, //模块编号
                'tranId': workbenchJson.tranId2, //交易编号
                'orgId': '', //机构编号
                'operatorNo': offlineSendJson.operatorNo, //操作员
                'custName': offlineSendJson.MASCARDNAME, //客户名称
                'custCredType': '0', //客户证件类型
                'custCredNo': offlineSendJson.CERTNUM, //客户证件号
                'offlineOnline': offlineSendJson.offlineOnline, //脱机/联机
                'workAddress': offlineSendJson.ipadWorkAddress, //工作地址
                //'FILE_ADD': offlineSendJson.picFileInfoARR[0].b, //每个图片的名称和类型
                'OPER_TYPE': 'ADD',
                'userId': '', //柜员号
                'branchId': '' //机构号
            };
            appBussPhone = JSON.stringify(appBussPhone);
            var sendDataJson = {
                "databaseName": "myDatabase",
                "tableName": "up_download_info",
                "data": [{
                    "fileToken": creditJson.phoneTime, //文件唯一ID(可以为时间挫
                    "pos": "0", //文件的断点信息(初始为0)
                    "filePath": msg, //文件路径
                    "appPath": "c001", //自定义文件路径
                    "appBuss": appBussPhone, //业务参数
                    "downloadToken": "", //文件的下载ID(初始为空)
                    "leng": "1", //文件的长度(初始为1)
                    "isNotice": "yes",//是否调用后台(一直是yes)
                    "fileType": "0",
                    "REMARK1": '01'
                }]
            };
            insertTableData(sendDataJson, function (msg) {
            	deletePhoto(offlineSendJson.picFileARR,function(msg){
            	},function(err){
            	});
                if(++compressCount == 2){
                    topicUtil.publish("gongzuotai/offlineGoOnCreditSubmit");
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
        	if(err.indexOf("文件不存在")>-1&&offlineSendJson.REMARK6!=null)
        	{//当该笔交易是历史上已经查过pl_seq流水号、且本次提交时源照片文件不存在导致压缩报错的情况，则直接提交交易即可。对于服务端，之前成功的话就直接提示成功，不成功的话，再次处理即可。
        		if(++compressCount == 2){//认为zip文件已经上传服务器
                    topicUtil.publish("gongzuotai/offlineGoOnCreditSubmit");
              }
        		return;
        	}
            hideLoader();
            showTags({
                'title': '提示',
                'content': '影像压缩失败',
                'ok': {}
            });
        });
        //将要上传的签名插入到ios断点上传的数据库中
        
        
        var sql="select fileToken from up_download_info  where filePath like '%"+creditJson.platGlobalSeq + "sign%'";
            executeSqlString(sql, 'exe', function(data){
            	if(data.length>0)
            	{
            		//alert("照片文件已经开始断点续传，不再重新记入文件上传表");
            		if(++compressCount == 2){
                    topicUtil.publish("gongzuotai/offlineGoOnCreditSubmit");
            		}
            	}
            	else{
            		//alert("经过查询，没有签名文件已经在传，所以现在开始生成文件并记到断点上传表中");
            		Meap.transFormImage(creditJson.platGlobalSeq + 'sign', offlineSendJson.signHref, 'picSty', function (msg) {
            //签名上传 业务参数
            var appBussSign = {
                'busiGloablaSeq': creditJson.platGlobalSeq, //业务编号
                'attchType': '1', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                'deviceNo': offlineSendJson.deviceNo, //设备编号
                'moduleId': workbenchJson.moduleID, //模块编号
                'tranId': workbenchJson.tranId2, //交易编号
                'orgId': '', //机构编号
                'operatorNo': offlineSendJson.operatorNo, //操作员
                'custName': offlineSendJson.MASCARDNAME, //客户名称
                'custCredType': '0', //客户证件类型
                'custCredNo': offlineSendJson.CERTNUM, //客户证件号
                'offlineOnline': offlineSendJson.offlineOnline, //脱机/联机
                'workAddress': offlineSendJson.ipadWorkAddress //工作地址
            };
            appBussSign = JSON.stringify(appBussSign);
            var sendDataJson = {
                "databaseName": "myDatabase",
                "tableName": "up_download_info",
                "data": [{
                    "fileToken": creditJson.signTime, //文件唯一ID(可以为时间挫
                    "pos": "0", //文件的断点信息(初始为0)
                    "filePath": msg, //文件路径＝offlineSendJson.signHref／filePath
                    "appPath": "c002", //自定义文件路径
                    "appBuss": appBussSign, //业务参数
                    "downloadToken": "", //文件的下载ID(初始为空)
                    "leng": "1", //文件的长度(初始为1)
                    "isNotice": "yes", //是否调用后台(一直是yes)
                    "fileType": "1",
                    "REMARK1": '01'
                }]
            };
            insertTableData(sendDataJson, function (msg) {
                if(++compressCount == 2){
                    topicUtil.publish("gongzuotai/offlineGoOnCreditSubmit");
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
            },function(err){
            hideLoader();
            showTags({
                'title': '提示',
                'content': '数据库读写失败，请联系技术人员。'+err,
                'ok': {}
            });
        });
        
    } else if (offlineSendJson.BUSI_TYPE == '05') { 
    	//运营视频提交
    	ImagingOperaTions.phoneTime = null;
    	if(offlineSendJson.REMARK6!=null)
        {
        	//已经有流水的情况下，查看是否存在相应的zip文件记录。如果有的话，则用现有zip的filetoken
        	 var sql="select fileToken from up_download_info  where filePath like '%"+offlineSendJson.REMARK6 + "%'";
            executeSqlString(sql, 'exe', function(data){
            	if(data.length==1)
            	ImagingOperaTions.phoneTime=data[0].fileToken;
            },function(err){});
            
        }
        ImagingOperaTions.phoneTime =ImagingOperaTions.phoneTime==null? myTime.CurTime():ImagingOperaTions.phoneTime;
        //将要上传的文件插入到ios断点上传的数据库中
        
        
        Meap.zipCompression(ImagingOperaTions.platGlobalSeq, creditJson.storage.picFileAllARR, function (msg) {
            //上传 业务参数
            var appBussPhone = {
                'busiGloablaSeq': ImagingOperaTions.platGlobalSeq, //业务编号
                'attchType': '0', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                'deviceNo': offlineSendJson.deviceNo, //设备编号
                'moduleId': offlineSendJson.moduleId, //模块编号
                'tranId': offlineSendJson.tranId, //交易编号
                'orgId': commonJson.orgId, //机构编号
                'operatorNo': offlineSendJson.operatorNo, //操作员
                'custName': offlineSendJson.MASCARDNAME, //客户名称
                'custCredType': offlineSendJson.CERTTYPE, //客户证件类型
                'custCredNo': offlineSendJson.CERTNUM, //客户证件号
                'offlineOnline': offlineSendJson.offlineOnline, //脱机/联机
                'workAddress': offlineSendJson.ipadWorkAddress, //工作地址
                'IMG_NO': ImagingOperaTions.imageNo,//影音编号
                //'FILE_ADD': creditJson.storage.picFileInfoARR[0].b, //每个图片的名称和类型
                'OPER_TYPE': 'ADD',
                'userId': '9107', //orgIdToUserId[creditJson.storage.orgId], //柜员号
                'branchId': '00862' //creditJson.storage.orgId //机构号
            };
            appBussPhone = JSON.stringify(appBussPhone);
            var sendDataJson = {
                "databaseName": "myDatabase",
                "tableName": "up_download_info",
                "data": [{
                    "fileToken": ImagingOperaTions.phoneTime, //文件唯一ID(可以为时间挫
                    "pos": "0", //文件的断点信息(初始为0)
                    "filePath": msg, //文件路径
                    "appPath": offlineSendJson.REMARK2, //自定义文件路径
                    "appBuss": appBussPhone, //业务参数
                    "downloadToken": "", //文件的下载ID(初始为空)
                    "leng": "1", //文件的长度(初始为1)
                    "isNotice": "yes", //是否调用后台(一直是yes)
                    "fileType": "0",
                    "REMARK1": '01'
                }]
            };
            insertTableData(sendDataJson, function (msg) {
                hideLoader();
                //删除视频文件释放空间
                creditJson.storage.picFileAllARR = creditJson.storage.picFileAllARR.join('&').replace(/&[^&]*avator\d+[^&]*/g, '').split(/&+/);
                deletePhoto(creditJson.storage.picFileAllARR, function (msg) {
                    tuojiSaveOperateVideoFun(offlineSendJson, curIndex, msgJSON);
                }, function (err) {
                });
            }, function (err) {
                hideLoader();
                showTags({
                    'title': '提示',
                    'content': '数据库读写失败，请联系技术人员',
                    'ok': {}
                });
            });
        }, function (err) {
        	//增加判断：如果之前已经成功获取到平台流水号，且本次报错“文件不存在”则认为之前已经上传成功了文件，此时只需要重新提交交易即可
        	if(err.indexOf("文件不存在")>-1&&offlineSendJson.REMARK6!=null)
        	{//当该笔交易是历史上已经查过pl_seq流水号、且本次提交时源照片文件不存在导致压缩报错的情况，则直接提交交易即可。对于服务端，之前成功的话就直接提示成功，不成功的话，再次处理即可。
        		tuojiSaveOperateVideoFun(offlineSendJson, curIndex, msgJSON);
        		return;        		
        	}
            hideLoader();
            showTags({
                'title': '提示',
                'content': '影像压缩失败',
                'ok': {}
            });
        });
    }
}

//删除数据库和影像资料 tab表名  arr图片数组
function offlineDelDatebaseAndImg(tab, data, fun) {
    deleteTableData({
        "databaseName": "myDatabase",
        "tableName": tab,
        "conditions": [{
            "SUBMITTIME": data.SUBMITTIME
        }]
    }, function(msg) {
        //alert('删除数据库成功'+msg);
        var _arr = [data.CUSTFACEPIC, data.CUSTANDCUSTOWNERPIC, data.CUSTAUTHPIC, data.FRONTIDCARDPIC, data.BACKIDCARDPIC];
        var mediaArr = data.OTHERIMG.split(',');
        $.each(mediaArr, function(index, val) {
            _arr.push(val);
        });
        deletePhoto(_arr, function(msg) {
            //alert('删除本地图片成功'+msg);
            fun && fun();
        }, function(err) {

        })
    }, function(err) {
        // alert('删除数据库失败'+err);
    })
}

//运营影像非个人信息详情页面（gongzuotai-yunyingDetails.html）
$(document).on("pageshow", '#gongzuotai-yunyingDetails', function() {
     //if (tuojiCurDataLastVal == '客户经理终止办理') {
     //    $('#gongzuotai-yunyingDetails .footter:eq(0) .previous').removeClass('btn_next');
     //} else {
         $('#gongzuotai-yunyingDetails .footter:eq(0) .previous').addClass('btn_next');
     //}
    //基本信息
    $(".basic_name").next().text(workbenchJson.detail.MASCARDNAME); //姓名
    $(".basic_businessType").next().text(bussinessTypeImaging[workbenchJson.detail.REMARK2]); //业务类型
    $(".basic_docType").next().text(certTypeImaging[workbenchJson.detail.CERTTYPE]); //证件类型／法人
    $(".basic_docNo").next().text(workbenchJson.detail.CERTNUM); //证件号码／法人
    $(".basic_acctNo").next().text(workbenchJson.detail.ACCT_NO); //帐卡号
    $(".basic_tranMoney").next().text(workbenchJson.detail.CUSCARDAPPLY); //金额
    $(".basic_agentType").next().text(clientTypeImaging[workbenchJson.detail.CLIENT_TYPE]); //客户类型
    $(".basic_creditCode").next().text(workbenchJson.detail.CREDIT_CODE); //统一社会信用代码
    $(".basic_orgCode").next().text(workbenchJson.detail.ORG_CODE); //组织机构代码
    $(".basic_license").next().text(workbenchJson.detail.LICENSE); //营业执照或其他批文号
    $(".basic_currency").next().text( currencyTypeImaging[workbenchJson.detail.currency]); //币种
    $(".basic_remark").next().text(workbenchJson.detail.REMARK1); ///备注
    $(".basic_unitName").next().text(workbenchJson.detail.UNITNAME); ///单位名称

    //终止办理弹窗
    $("#gongzuotai-yunyingDetails .footter .previous:eq(0)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        showTags({
            'title': '您将终止办理该业务',
            'content': '',
            'ok': {
                title: '放弃'
            },
            'cancel': {
                title: '继续',
                fun: function() {
                    offlineGoOnSubmit({
                        curCacheStopContinue: JSON.stringify(tuojiCurData)
                    });

                    // modifyTableData({
                    //     "databaseName": "myDatabase",
                    //     "tableName": "nonetcustomer_info",
                    //     "conditions": [{
                    //         "SUBMITTIME": tuojiCurData.SUBMITTIME
                    //             //"SUBMITTIME": "between " + data.SUBMITTIME + " and " + data.SUBMITTIME
                    //     }],
                    //     "data": [{
                    //         "BUSSINESSSTATUS": "客户经理终止办理" //卡产品代码
                    //     }]
                    // }, function(msg) {
                    //     $('#gongzuotai-creditCardDetails .footter .previous').removeClass('btn_next');
                    // }, function(err) {
                    // })

                }
            }
        });
    });
    //继续办理弹窗
    $("#gongzuotai-yunyingDetails .footter .previous:eq(1)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        Meap.isNetConnect(function(msg) {
            if (msg == '03') {
                showTags({
                    'title': '提示',
                    'content': '当前网络不可用，请检测网络！',
                    'ok': {}
                });
            } else {
                showTags({
                    'title': '您将继续办理该业务',
                    'content': '',
                    'ok': {
                        title: '放弃'
                    },
                    'cancel': {
                        title: '继续',
                        fun: function() {
                            offlineGoOnSubmit({
                                curCacheOneDetailContinue: JSON.stringify(tuojiCurData)
                            });
                        }
                    }
                });
            }
        }, function(err) {});

    });
});
//运营影像个人开户其他信息详情页面
$(document).on("pageshow", '#gongzuotai-yunyingPersonDetails', function() {
     //if (tuojiCurDataLastVal == '客户经理终止办理') {
     //    $('#gongzuotai-yunyingDetails .footter:eq(0) .previous').removeClass('btn_next');
     //} else {
         $('#gongzuotai-yunyingPersonDetails .footter:eq(0) .previous').addClass('btn_next');
     //}
    //基本信息
    $(".basic_name").next().text(workbenchJson.detail.MASCARDNAME); //姓名
    $(".basic_businessType").next().text(bussinessTypeImaging[workbenchJson.detail.REMARK2]); //业务类型
    $(".basic_docType").next().text(certTypeImaging[workbenchJson.detail.CERTTYPE]); //证件类型／法人
    $(".basic_docNo").next().text(workbenchJson.detail.CERTNUM); //证件号码／法人
    $(".basic_acctNo").next().text(workbenchJson.detail.ACCT_NO); //帐卡号
    $(".basic_tranMoney").next().text(workbenchJson.detail.CUSCARDAPPLY); //金额
    $(".basic_agentName").next().text(workbenchJson.detail.LEGAL_REP); //经办人姓名
    $(".basic_agentType").next().text(clientTypeImaging[workbenchJson.detail.CLIENT_TYPE]); //客户类型
    $(".basic_agentDocType").next().text(certTypeImaging[workbenchJson.detail.DOC_TYPE]); //经办人证件类型
    $(".basic_agentDocNo").next().text(workbenchJson.detail.CLIEMT_NO); //经办人证件号码
    $(".basic_creditCode").next().text(workbenchJson.detail.CREDIT_CODE); //统一社会信用代码
    $(".basic_orgCode").next().text(workbenchJson.detail.ORG_CODE); //组织机构代码
    $(".basic_license").next().text(workbenchJson.detail.LICENSE); //营业执照或其他批文号
    $(".basic_currency").next().text( currencyTypeImaging[workbenchJson.detail.currency]); //币种
    $(".basic_remark").next().text(workbenchJson.detail.REMARK1); ///备注
    $(".basic_productNo").next().text(workbenchJson.detail.REMARK3); //产品编号
    $(".basic_productName").next().text(workbenchJson.detail.REMARK4); ///产品名称

    //终止办理弹窗
    $("#gongzuotai-yunyingPersonDetails .footter .previous:eq(0)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        showTags({
            'title': '您将终止办理该业务',
            'content': '',
            'ok': {
                title: '放弃'
            },
            'cancel': {
                title: '继续',
                fun: function() {
                    offlineGoOnSubmit({
                        curCacheStopContinue: JSON.stringify(tuojiCurData)
                    });

                    // modifyTableData({
                    //     "databaseName": "myDatabase",
                    //     "tableName": "nonetcustomer_info",
                    //     "conditions": [{
                    //         "SUBMITTIME": tuojiCurData.SUBMITTIME
                    //             //"SUBMITTIME": "between " + data.SUBMITTIME + " and " + data.SUBMITTIME
                    //     }],
                    //     "data": [{
                    //         "BUSSINESSSTATUS": "客户经理终止办理" //卡产品代码
                    //     }]
                    // }, function(msg) {
                    //     $('#gongzuotai-creditCardDetails .footter .previous').removeClass('btn_next');
                    // }, function(err) {
                    // })

                }
            }
        });
    });
    //继续办理弹窗
    $("#gongzuotai-yunyingPersonDetails .footter .previous:eq(1)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        Meap.isNetConnect(function(msg) {
            if (msg == '03') {
                showTags({
                    'title': '提示',
                    'content': '当前网络不可用，请检测网络！',
                    'ok': {}
                });
            } else {
                showTags({
                    'title': '您将继续办理该业务',
                    'content': '',
                    'ok': {
                        title: '放弃'
                    },
                    'cancel': {
                        title: '继续',
                        fun: function() {
                            offlineGoOnSubmit({
                                curCacheOneDetailContinue: JSON.stringify(tuojiCurData)
                            });
                        }
                    }
                });
            }
        }, function(err) {});

    });
});
//运营影像个人代买理财信息详情页面（gongzuotai-yunyingDetails.html）
$(document).on("pageshow", '#gongzuotai-yunyingPersonAgencyLicaiDetails', function() {
     //if (tuojiCurDataLastVal == '客户经理终止办理') {
     //    $('#gongzuotai-yunyingDetails .footter:eq(0) .previous').removeClass('btn_next');
     //} else {
         $('#gongzuotai-yunyingPersonAgencyLicaiDetails .footter:eq(0) .previous').addClass('btn_next');
     //}
    //基本信息
    $(".basic_name").next().text(workbenchJson.detail.MASCARDNAME); //姓名
    $(".basic_businessType").next().text(bussinessTypeImaging[workbenchJson.detail.REMARK2]); //业务类型
    $(".basic_docType").next().text(certTypeImaging[workbenchJson.detail.CERTTYPE]); //证件类型／法人
    $(".basic_docNo").next().text(workbenchJson.detail.CERTNUM); //证件号码／法人
    $(".basic_acctNo").next().text(workbenchJson.detail.ACCT_NO); //帐卡号
    $(".basic_tranMoney").next().text(workbenchJson.detail.CUSCARDAPPLY); //金额
    $(".basic_agentName").next().text(workbenchJson.detail.LEGAL_REP); //经办人姓名
    $(".basic_agentType").next().text(clientTypeImaging[workbenchJson.detail.CLIENT_TYPE]); //客户类型
    $(".basic_agentDocType").next().text(certTypeImaging[workbenchJson.detail.DOC_TYPE]); //经办人证件类型
    $(".basic_agentDocNo").next().text(workbenchJson.detail.CLIEMT_NO); //经办人证件号码

    $(".basic_currency").next().text( currencyTypeImaging[workbenchJson.detail.currency]); //币种
    $(".basic_remark").next().text(workbenchJson.detail.REMARK1); ///备注
    $(".basic_productNo").next().text(workbenchJson.detail.REMARK3); //产品编号
    $(".basic_productName").next().text(workbenchJson.detail.REMARK4); ///产品名称

    //终止办理弹窗
    $("#gongzuotai-yunyingPersonAgencyLicaiDetails .footter .previous:eq(0)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        showTags({
            'title': '您将终止办理该业务',
            'content': '',
            'ok': {
                title: '放弃'
            },
            'cancel': {
                title: '继续',
                fun: function() {
                    offlineGoOnSubmit({
                        curCacheStopContinue: JSON.stringify(tuojiCurData)
                    });

                    // modifyTableData({
                    //     "databaseName": "myDatabase",
                    //     "tableName": "nonetcustomer_info",
                    //     "conditions": [{
                    //         "SUBMITTIME": tuojiCurData.SUBMITTIME
                    //             //"SUBMITTIME": "between " + data.SUBMITTIME + " and " + data.SUBMITTIME
                    //     }],
                    //     "data": [{
                    //         "BUSSINESSSTATUS": "客户经理终止办理" //卡产品代码
                    //     }]
                    // }, function(msg) {
                    //     $('#gongzuotai-creditCardDetails .footter .previous').removeClass('btn_next');
                    // }, function(err) {
                    // })

                }
            }
        });
    });
    //继续办理弹窗
    $("#gongzuotai-yunyingPersonAgencyLicaiDetails .footter .previous:eq(1)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        Meap.isNetConnect(function(msg) {
            if (msg == '03') {
                showTags({
                    'title': '提示',
                    'content': '当前网络不可用，请检测网络！',
                    'ok': {}
                });
            } else {
                showTags({
                    'title': '您将继续办理该业务',
                    'content': '',
                    'ok': {
                        title: '放弃'
                    },
                    'cancel': {
                        title: '继续',
                        fun: function() {
                            offlineGoOnSubmit({
                                curCacheOneDetailContinue: JSON.stringify(tuojiCurData)
                            });
                        }
                    }
                });
            }
        }, function(err) {});

    });
});
//运营影像个人代理开户信息详情
$(document).on("pageshow", '#gongzuotai-yunyingPersonAgencyKaihuDetails', function() {
     //if (tuojiCurDataLastVal == '客户经理终止办理') {
     //    $('#gongzuotai-yunyingDetails .footter:eq(0) .previous').removeClass('btn_next');
     //} else {
         $('#gongzuotai-yunyingPersonAgencyKaihuDetails .footter:eq(0) .previous').addClass('btn_next');
     //}
    //基本信息
    $(".basic_name").next().text(workbenchJson.detail.MASCARDNAME); //姓名
    $(".basic_businessType").next().text(bussinessTypeImaging[workbenchJson.detail.REMARK2]); //业务类型
    $(".basic_docType").next().text(certTypeImaging[workbenchJson.detail.CERTTYPE]); //证件类型／法人
    $(".basic_docNo").next().text(workbenchJson.detail.CERTNUM); //证件号码／法人
    $(".basic_acctNo").next().text(workbenchJson.detail.ACCT_NO); //帐卡号

    $(".basic_agentName").next().text(workbenchJson.detail.LEGAL_REP); //经办人姓名
    $(".basic_agentType").next().text(clientTypeImaging[workbenchJson.detail.CLIENT_TYPE]); //客户类型
    $(".basic_agentDocType").next().text(certTypeImaging[workbenchJson.detail.DOC_TYPE]); //经办人证件类型
    $(".basic_agentDocNo").next().text(workbenchJson.detail.CLIEMT_NO); //经办人证件号码

    $(".basic_remark").next().text(workbenchJson.detail.REMARK1); ///备注


    //终止办理弹窗
    $("#gongzuotai-yunyingPersonAgencyKaihuDetails .footter .previous:eq(0)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        showTags({
            'title': '您将终止办理该业务',
            'content': '',
            'ok': {
                title: '放弃'
            },
            'cancel': {
                title: '继续',
                fun: function() {
                    offlineGoOnSubmit({
                        curCacheStopContinue: JSON.stringify(tuojiCurData)
                    });

                    // modifyTableData({
                    //     "databaseName": "myDatabase",
                    //     "tableName": "nonetcustomer_info",
                    //     "conditions": [{
                    //         "SUBMITTIME": tuojiCurData.SUBMITTIME
                    //             //"SUBMITTIME": "between " + data.SUBMITTIME + " and " + data.SUBMITTIME
                    //     }],
                    //     "data": [{
                    //         "BUSSINESSSTATUS": "客户经理终止办理" //卡产品代码
                    //     }]
                    // }, function(msg) {
                    //     $('#gongzuotai-creditCardDetails .footter .previous').removeClass('btn_next');
                    // }, function(err) {
                    // })

                }
            }
        });
    });
    //继续办理弹窗
    $("#gongzuotai-yunyingPersonAgencyKaihuDetails .footter .previous:eq(1)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        Meap.isNetConnect(function(msg) {
            if (msg == '03') {
                showTags({
                    'title': '提示',
                    'content': '当前网络不可用，请检测网络！',
                    'ok': {}
                });
            } else {
                showTags({
                    'title': '您将继续办理该业务',
                    'content': '',
                    'ok': {
                        title: '放弃'
                    },
                    'cancel': {
                        title: '继续',
                        fun: function() {
                            offlineGoOnSubmit({
                                curCacheOneDetailContinue: JSON.stringify(tuojiCurData)
                            });
                        }
                    }
                });
            }
        }, function(err) {});

    });
});
// 运营影像个人购买保险信息详情
$(document).on("pageshow", '#gongzuotai-yunyingPersonBuyBaoxianDetails', function() {
     //if (tuojiCurDataLastVal == '客户经理终止办理') {
     //    $('#gongzuotai-yunyingDetails .footter:eq(0) .previous').removeClass('btn_next');
     //} else {
         $('#gongzuotai-yunyingPersonBuyBaoxianDetails .footter:eq(0) .previous').addClass('btn_next');
     //}
    //基本信息
    $(".basic_name").next().text(workbenchJson.detail.MASCARDNAME); //姓名
    $(".basic_businessType").next().text(bussinessTypeImaging[workbenchJson.detail.REMARK2]); //业务类型
    $(".basic_docType").next().text(certTypeImaging[workbenchJson.detail.CERTTYPE]); //证件类型／法人
    $(".basic_docNo").next().text(workbenchJson.detail.CERTNUM); //证件号码／法人
    $(".basic_tranMoney").next().text(workbenchJson.detail.CUSCARDAPPLY); //金额

    $(".basic_agentType").next().text(clientTypeImaging[workbenchJson.detail.CLIENT_TYPE]); //客户类型

    $(".basic_remark").next().text(workbenchJson.detail.REMARK1); ///备注

    $(".basic_productName").next().text(workbenchJson.detail.REMARK4); ///产品名称

    //终止办理弹窗
    $("#gongzuotai-yunyingPersonBuyBaoxianDetails .footter .previous:eq(0)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        showTags({
            'title': '您将终止办理该业务',
            'content': '',
            'ok': {
                title: '放弃'
            },
            'cancel': {
                title: '继续',
                fun: function() {
                    offlineGoOnSubmit({
                        curCacheStopContinue: JSON.stringify(tuojiCurData)
                    });

                    // modifyTableData({
                    //     "databaseName": "myDatabase",
                    //     "tableName": "nonetcustomer_info",
                    //     "conditions": [{
                    //         "SUBMITTIME": tuojiCurData.SUBMITTIME
                    //             //"SUBMITTIME": "between " + data.SUBMITTIME + " and " + data.SUBMITTIME
                    //     }],
                    //     "data": [{
                    //         "BUSSINESSSTATUS": "客户经理终止办理" //卡产品代码
                    //     }]
                    // }, function(msg) {
                    //     $('#gongzuotai-creditCardDetails .footter .previous').removeClass('btn_next');
                    // }, function(err) {
                    // })

                }
            }
        });
    });
    //继续办理弹窗
    $("#gongzuotai-yunyingPersonBuyBaoxianDetails .footter .previous:eq(1)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        Meap.isNetConnect(function(msg) {
            if (msg == '03') {
                showTags({
                    'title': '提示',
                    'content': '当前网络不可用，请检测网络！',
                    'ok': {}
                });
            } else {
                showTags({
                    'title': '您将继续办理该业务',
                    'content': '',
                    'ok': {
                        title: '放弃'
                    },
                    'cancel': {
                        title: '继续',
                        fun: function() {
                            offlineGoOnSubmit({
                                curCacheOneDetailContinue: JSON.stringify(tuojiCurData)
                            });
                        }
                    }
                });
            }
        }, function(err) {});

    });
});
// 运营影像个人购买理财信息详情
$(document).on("pageshow", '#gongzuotai-yunyingPersonBuyLicaiDetails', function() {
     //if (tuojiCurDataLastVal == '客户经理终止办理') {
     //    $('#gongzuotai-yunyingDetails .footter:eq(0) .previous').removeClass('btn_next');
     //} else {
         $('#gongzuotai-yunyingPersonBuyLicaiDetails .footter:eq(0) .previous').addClass('btn_next');
     //}
    //基本信息
    $(".basic_name").next().text(workbenchJson.detail.MASCARDNAME); //姓名
    $(".basic_businessType").next().text(bussinessTypeImaging[workbenchJson.detail.REMARK2]); //业务类型
    $(".basic_docType").next().text(certTypeImaging[workbenchJson.detail.CERTTYPE]); //证件类型／法人
    $(".basic_docNo").next().text(workbenchJson.detail.CERTNUM); //证件号码／法人
    $(".basic_acctNo").next().text(workbenchJson.detail.ACCT_NO); //帐卡号
    $(".basic_tranMoney").next().text(workbenchJson.detail.CUSCARDAPPLY); //金额
    $(".basic_agentType").next().text(clientTypeImaging[workbenchJson.detail.CLIENT_TYPE]); //客户类型
    $(".basic_currency").next().text( currencyTypeImaging[workbenchJson.detail.currency]); //币种
    $(".basic_remark").next().text(workbenchJson.detail.REMARK1); ///备注
    $(".basic_productNo").next().text(workbenchJson.detail.REMARK3); //产品编号
    $(".basic_productName").next().text(workbenchJson.detail.REMARK4); ///产品名称

    //终止办理弹窗
    $("#gongzuotai-yunyingPersonBuyLicaiDetails .footter .previous:eq(0)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        showTags({
            'title': '您将终止办理该业务',
            'content': '',
            'ok': {
                title: '放弃'
            },
            'cancel': {
                title: '继续',
                fun: function() {
                    offlineGoOnSubmit({
                        curCacheStopContinue: JSON.stringify(tuojiCurData)
                    });

                    // modifyTableData({
                    //     "databaseName": "myDatabase",
                    //     "tableName": "nonetcustomer_info",
                    //     "conditions": [{
                    //         "SUBMITTIME": tuojiCurData.SUBMITTIME
                    //             //"SUBMITTIME": "between " + data.SUBMITTIME + " and " + data.SUBMITTIME
                    //     }],
                    //     "data": [{
                    //         "BUSSINESSSTATUS": "客户经理终止办理" //卡产品代码
                    //     }]
                    // }, function(msg) {
                    //     $('#gongzuotai-creditCardDetails .footter .previous').removeClass('btn_next');
                    // }, function(err) {
                    // })

                }
            }
        });
    });
    //继续办理弹窗
    $("#gongzuotai-yunyingPersonBuyLicaiDetails .footter .previous:eq(1)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        Meap.isNetConnect(function(msg) {
            if (msg == '03') {
                showTags({
                    'title': '提示',
                    'content': '当前网络不可用，请检测网络！',
                    'ok': {}
                });
            } else {
                showTags({
                    'title': '您将继续办理该业务',
                    'content': '',
                    'ok': {
                        title: '放弃'
                    },
                    'cancel': {
                        title: '继续',
                        fun: function() {
                            offlineGoOnSubmit({
                                curCacheOneDetailContinue: JSON.stringify(tuojiCurData)
                            });
                        }
                    }
                });
            }
        }, function(err) {});

    });
});
//信用卡信息详情页面（gongzuotai-creditCardDetails.html）
$(document).on("pageshow", '#gongzuotai-creditCardDetails', function() {
    // if (tuojiCurDataLastVal == '客户经理终止办理') {
    //     $('#gongzuotai-creditCardDetails .footter:eq(0) .previous').removeClass('btn_next');
    // } else {
         $('#gongzuotai-creditCardDetails .footter:eq(0) .previous').addClass('btn_next');
    // }
    $('#gongzuotai-creditCardDetails .footter:eq(0) .previous').addClass('btn_next');
    //基本信息
    $(".basic_name").next().text(workbenchJson.detail.MASCARDNAME); //姓名
    $(".basic_sex").next().text(sexJsonToWZ[workbenchJson.detail.SEX]); //性别
    $(".basic_pinX").next().text(workbenchJson.detail.BRAFULLNAME); //拼音
    $(".basic_birth").next().text(workbenchJson.detail.BIRTH); //出生日期
    $(".basic_married").next().text(chunyinJson[workbenchJson.detail.MASRTATU]); //是否已婚
    $(".basic_zhengJH").next().text(workbenchJson.detail.CERTNUM); //身份证号码
    $(".basic_zhengJY").next().text(workbenchJson.detail.CERTVALIDDATE); //证件有效期
    $(".basic_phoneN").next().text(workbenchJson.detail.MOBILENUM); //手机号码
    $(".basic_youB").next().text(workbenchJson.detail.UNITZIPCODE); //邮编
    $(".basic_teach").next().text(eduJson[workbenchJson.detail.EDUCATION]); //教育程度
    $(".basic_houseType").next().text(roomStyleJson[workbenchJson.detail.HOUSTYPE]); //住宅类型
    $(".basic_addressH").next().text(workbenchJson.detail.DOMICILE); //户籍所在地
    $(".basic_addressZ").next().text(workbenchJson.detail.HOUSREGADD); //户籍地址
    $(".basic_mailbox").next().text(workbenchJson.detail.EMAILADD); //邮箱
    $(".basic_addressZN").next().text(workbenchJson.detail.UNITADD); //单位地址
    //职业信息
    $(".work_danW").next().text(workbenchJson.detail.UNITNAME); //单位全称
    $(".work_danWType").next().text(compropertyJson[workbenchJson.detail.UNITPROPERTY]); //单位性质
    $(".work_danWPoneN").next().text(workbenchJson.detail.UNITPHONEAREANUM + '-' + workbenchJson.detail.UNITPHONENUM); //单位固话
    $(".work_marriage").next().text(ndustryJson[workbenchJson.detail.INDCATEGORY]); //行业类型
    $(".work_occupation").next().text(zhigangJson[workbenchJson.detail.OFFICE]); //岗位
    $('.work_workTimeN').next().text(workbenchJson.detail.UNITWORKEXP + '年'); //在现单位工作年限
    $(".work_allIncomeN").next().text(workbenchJson.detail.ANNINCOME + '万元'); //年收入
    //联系人信息
    $(".family_emergentName").next().text(workbenchJson.detail.URGNAME); //紧急联系人姓名
    $(".family_emergentNum").next().text(workbenchJson.detail.URGMOBILENUM); //紧急联系人手机
    //主卡信息
    $(".masterID_lines").next().text(cardAnnualfeeJson[workbenchJson.detail.CARDFEETYPE]); //年费类型
    //$(".masterID_billType").next().text(isAutoPurchaseJson[workbenchJson.detail.ISAUTOPURCHASE]);
    $(".masterID_billType").next().text('否'); //自动还款功能
    $(".masterID_cardAddress").next().text(workbenchJson.detail.UNITADD); //卡片寄送地址
    $(".basic_reference").next().text(workbenchJson.detail.RECEMPNUM); //推荐人
    $('.basic_jinjianly').next().text(jinjianlaiyuanJson[workbenchJson.detail.INTOSOURCE]); //进件来源
    $('.basic_shenqinged').next().text(workbenchJson.detail.CUSCARDAPPLY + '元'); //申请额度
    $('.masterID_billDate').next().text(workbenchJson.detail.REMARK2 + '日'); //账单日
    //终止办理弹窗
    $("#gongzuotai-creditCardDetails .footter .previous:eq(0)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        showTags({
            'title': '您将终止办理该业务',
            'content': '',
            'ok': {
                title: '放弃'
            },
            'cancel': {
                title: '继续',
                fun: function() {
                    offlineGoOnSubmit({
                        curCacheStopContinue: JSON.stringify(tuojiCurData)
                    });

                    // modifyTableData({
                    //     "databaseName": "myDatabase",
                    //     "tableName": "nonetcustomer_info",
                    //     "conditions": [{
                    //         "SUBMITTIME": tuojiCurData.SUBMITTIME
                    //             //"SUBMITTIME": "between " + data.SUBMITTIME + " and " + data.SUBMITTIME
                    //     }],
                    //     "data": [{
                    //         "BUSSINESSSTATUS": "客户经理终止办理" //卡产品代码
                    //     }]
                    // }, function(msg) {
                    //     $('#gongzuotai-creditCardDetails .footter .previous').removeClass('btn_next');
                    // }, function(err) {
                    // })

                }
            }
        });
    });
    //继续办理弹窗
    $("#gongzuotai-creditCardDetails .footter .previous:eq(1)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        Meap.isNetConnect(function(msg) {
            if (msg == '03') {
                showTags({
                    'title': '提示',
                    'content': '当前网络不可用，请检测网络！',
                    'ok': {}
                });
            } else {
                showTags({
                    'title': '您将继续办理该业务',
                    'content': '',
                    'ok': {
                        title: '放弃'
                    },
                    'cancel': {
                        title: '继续',
                        fun: function() {
                            offlineGoOnSubmit({
                                curCacheOneDetailContinue: JSON.stringify(tuojiCurData)
                            });
                        }
                    }
                });
            }
        }, function(err) {});

    });
});
//信用卡信息平台详情页面（gongzuotai-creditCardPtDetails.html）
$(document).on("pageshow", '#gongzuotai-creditCardPtDetails', function() {
    showLoader('加载中...');
    var sendJson = {
        "b": [{
            "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
            "deviceNo.s": commonJson.deviceNo, //设备编号
            "orgId.s": commonJson.orgId,
            "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
            "tranId.s": workbenchJson.tranId2,//creditJson.tranId, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "workAddress.s": commonJson.workAddress, //工作地址
            "PLATGLOBALSEQ.s": tuojiPtPLATGLOBALSEQ //业务流水号
        }]
    };
    ptQueryOfflineBussDetail(sendJson, function(msg) {
            ptQueryOfflineBussDetailSucc(msg);
        }, function(err) {
            funFail(err);
        })
        //终止
    $("#gongzuotai-creditCardPtDetails .footter .previous:eq(0)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
//      showTags({
//          'title': '您将终止办理该业务',
//          'content': '',
//          'ok': {
//              title: '放弃'
//          },
//          'cancel': {
//              title: '继续',
//              fun: function() {
                    showLoader('提交中...');
                    var sendJson = {
                        "b": [{
                            "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                            "deviceNo.s": commonJson.deviceNo, //设备编号
                            "orgId.s": commonJson.orgId,
                            "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                            "tranId.s": workbenchJson.tranId2,//creditJson.tranId, //交易编号
                            "operatorNo.s": commonJson.adminCount, //操作员
                            "workAddress.s": commonJson.workAddress, //工作地址
                            "PLATGLOBALSEQ.s": tuojiPtPLATGLOBALSEQ, //业务流水号
                            "stopBuss.s": "", //是否终止业务办理
                            "handleState.s": "08" //业务处理状态
                        }]
                    };
                    dealOfflineBussFun(sendJson, function(msg) {
                        dealOfflineBussDetailSucc(msg);
                    }, function(err) {
                        funFail(err);
                    })

//              }
//          }
//      });

    });
    //人工授权
    $("#gongzuotai-creditCardPtDetails .footter .previous:eq(1)").on("click", function() {
        if (!$(this).hasClass('btn_next')) return;
        $.mobile.changePage('gongzuotai-tuojibanli-lldb.html');
    });
});

var tuojiLLDBimgBase = '';
var tuojiLLDBcardImgBase = '';
var tuojiLLDBidImgBase = '';
//脱机业务继续办理 人工授权页面
$(document).on("pageshow", '#gongzuotai-tuojibanli-lldb', function() {
        tuojiPtListData = JSON.parse(tuojiPtListData);
        $('.tuojibanli-lldb-info').html('<span>业务类型:' + offlineBUSINESSTYPEJson[tuojiPtListData.BUSINESSTYPE] + '</span>' +
            '<span>办理时间:' + tuojiPtListData.CREATEDATE + '</span>' +
            '<span>客户姓名:' + tuojiPtListData.MASCARDNAME + '</span>' +
            '<span>证件号码:' + tuojiPtListData.CERTNUM + '</span>')
        tuojiLLDBimgBase = '';
        tuojiLLDBcardImgBase = '';
        tuojiLLDBidImgBase = '';
        showLoader('加载中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                "deviceNo.s": commonJson.deviceNo, //设备编号
                "orgId.s": commonJson.orgId,
                "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                "tranId.s": workbenchJson.tranId2,//creditJson.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "workAddress.s": commonJson.workAddress, //工作地址
                "PLATGLOBALSEQ.s": tuojiPtPLATGLOBALSEQ //业务流水号
            }]
        };
        ptQueryOfflineBussDetail(sendJson, function(msg) {
            ptQueryOfflineBussLLDBSucc(msg);
        }, function(err) {
            funFail(err);
        })
        $('#gongzuotai-tuojibanli-lldb .footter .previous:eq(1)').on('click', function() {
//          showTags({
//              'title': '您将继续审核通过,继续申请',
//              'content': '',
//              'ok': {
//                  title: '放弃'
//              },
//              'cancel': {
//                  title: '继续',
//                  fun: function() {
                        showLoader('提交中...');
                        var sendJson = {
                            "b": [{
                                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                                "deviceNo.s": commonJson.deviceNo, //设备编号
                                "orgId.s": commonJson.orgId,
                                "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                                "tranId.s": workbenchJson.tranId2,//creditJson.tranId, //交易编号
                                "operatorNo.s": commonJson.adminCount, //操作员
                                "workAddress.s": commonJson.workAddress, //工作地址
                                "PLATGLOBALSEQ.s": tuojiPtPLATGLOBALSEQ, //业务流水号
                                "stopBuss.s": "", //是否终止业务办理
                                "handleState.s": "07" //业务处理状态
                            }]
                        };
                        dealOfflineBussFun(sendJson, function(msg) {
                            dealOfflineBussLLDBSucc(msg);
                        }, function(err) {
                            funFail(err);
                        })
//                  }
//              }
//          });

        })
        $('#gongzuotai-tuojibanli-lldb .footter .previous:eq(0)').on('click', function() {
//          showTags({
//              'title': '您将审核不通过,终止申请',
//              'content': '',
//              'ok': {
//                  title: '放弃'
//              },
//              'cancel': {
//                  title: '终止',
//                  fun: function() {
                        showLoader('提交中...');
                        var sendJson = {
                            "b": [{
                                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                                "deviceNo.s": commonJson.deviceNo, //设备编号
                                "orgId.s": commonJson.orgId,
                                "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                                "tranId.s": workbenchJson.tranId2,//creditJson.tranId, //交易编号
                                "operatorNo.s": commonJson.adminCount, //操作员
                                "workAddress.s": commonJson.workAddress, //工作地址
                                "PLATGLOBALSEQ.s": tuojiPtPLATGLOBALSEQ, //业务流水号
                                "stopBuss.s": "", //是否终止业务办理
                                "handleState.s": "08" //业务处理状态
                            }]
                        };
                        dealOfflineBussFun(sendJson, function(msg) {
                            dealOfflineBussLLDBSucc(msg);
                        }, function(err) {
                            funFail(err);
                        })
//                  }
//              }
//          });

        })
    })
    //业务办理情况查询－(gongzuotai-ywblqkcx.html)
$(document).on("pageshow", '#gongzuotai-ywblqkcx', function() {
	var gDataEnd = appTime.appCurDate('');     //当前时间
    var gDataStart = appTime.appPreDate('', 1000 * 60 * 60 * 24 * 30);
    showLoader('加载中...');
    var bussDateMin;
    var bussDateMax;
    if(workbenchJson.sT == undefined || workbenchJson.sT == null || workbenchJson.sT == ''){
		bussDateMin = getLastMonthYestdy(myTime.curDate());
	} else {
		bussDateMin = workbenchJson.sT;
	}
	if(workbenchJson.eT == undefined || workbenchJson.eT == null || workbenchJson.eT == ''){
		bussDateMax = dateGetYMD(10)[0];
	} else {
		bussDateMax = workbenchJson.eT;
	}
    var sendJson = {
        "b": [{
            "workAddress.s": commonJson.workAddress, //工作地址
            "orgId.s": commonJson.orgId, //机构号
            "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
            "tranId.s": workbenchJson.tranId3,//creditJson.tranId, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "deviceNo.s": commonJson.udId, //设备编号
            "offOnLine.s": "", //脱机/联机
            "bussDateMin.s":dateYYYYMMDD(bussDateMin), //起始时间
            "bussDateMax.s":dateYYYYMMDD(bussDateMax), //截止时间
            "bussType.s": "", //业务类型
            "status.s": "", //处理状态
            "faceRecogn.s": "", //人脸识别
            "currency.s": "", //币种
            "amountMin.s": "", //金额下线
            "amountMax.s": "", //金额上限
            "page.s": "1" //页码

        }]
    };
    workbenchJson.bussinessDetailPg = 1;
    workbenchJson.bussinessDetail = sendJson;
    ibussinessDetailServiceFun(sendJson, function(msg) {
        ibussinessDetailServiceSucc(msg);
    }, function(err) {
        funFail(err);
    })


    //为每一条数据添加class=‘click'
    $("#gongzuotai-ywblqkcx .box-content").on("click", ".box-rows", function() {
        if ($(this).hasClass('click')) {
            $(this).removeClass('click');
            $('#gongzuotai-ywblqkcx .previous:last').removeClass('btn_next');
            $('#gongzuotai-ywblqkcx .previous:first').removeClass('back-1');
        } else {
            //遍历每一条数据恢复初始状态
            $('#gongzuotai-ywblqkcx .box-rows').removeClass('click');
            $(this).addClass('click');
            //alert($(this).attr('path'));
            if ($(this).attr('path') != '') {
                $('#gongzuotai-ywblqkcx .previous:last').addClass('btn_next');
            } else {
                $('#gongzuotai-ywblqkcx .previous:last').removeClass('btn_next');
            }
            if($(this).attr('bussinessType')){
                workbenchJson.lPlatSeq = $(this).attr('platSeq');
                workbenchJson.bussType =$(this).attr('bussinessType')=='58'?$(this).attr('busiCategory'):$(this).attr('bussinessType') ;
                $('#gongzuotai-ywblqkcx .previous:first').addClass('back-1');
            }else{
                $('#gongzuotai-ywblqkcx .previous:first').removeClass('back-1');
            }
        }
    });

    // $("#seach-day").css("margin-top", ($(window).height() - 365) / 2);
    $("#gongzuotai-ywblqkcx .custom").on("click", function() {  //自定义查询 ---->新增 lei
    	//Gchange
    	$('#gongzuotai-ywblqkcx .previous:first').removeClass('back-1');
    	if(workbenchJson.sT == undefined || workbenchJson.sT == null || workbenchJson.sT == ''){
    		//$("#gongzuotai-ywblqkcx input[type='date']:first").val(getLastMonthYestdy(myTime.curDate()));
            $("#gongzuotai-ywblqkcx input[type='date']:first").val(dateGetYMD(30)[1]);
		} else {
			$("#gongzuotai-ywblqkcx input[type='date']:first").val(workbenchJson.sT);
		}

		if(workbenchJson.eT == undefined || workbenchJson.eT == null || workbenchJson.eT == ''){
			$("#gongzuotai-ywblqkcx input[type='date']:last").val(dateGetYMD(10)[0]);
		} else {
			$("#gongzuotai-ywblqkcx input[type='date']:last").val(workbenchJson.eT);
		}

        $("#seach-day-con").show();
    });
    $("#gongzuotai-ywblqkcx .previous:first").on("click", function() {  //详情按钮 ---->新增  lei
        if(!$(this).hasClass('back-1')){return;}
        if(workbenchJson.bussType=='02'){
            $.mobile.changePage('credityw-detail.html');
        } else if (workbenchJson.bussType == 'Y004' || workbenchJson.bussType == 'Y008') {
            $.mobile.changePage('yunyingPerson_detail.html');
        } else if (workbenchJson.bussType == 'Y001' || workbenchJson.bussType == 'Y003') {
            $.mobile.changePage('yunying_detail.html');
        } else if (workbenchJson.bussType == 'Y005') {
            $.mobile.changePage('yunyingPersonAgencyKaihu_detail.html');
        } else if (workbenchJson.bussType == 'Y006') {
            $.mobile.changePage('yunyingPersonBuyLicai_detail.html');
        } else if (workbenchJson.bussType == 'Y007') {
            $.mobile.changePage('yunyingPersonBuyBaoxian_detail.html');
        } else if (workbenchJson.bussType == 'Y009') {
            $.mobile.changePage('yunyingPersonAgencyLicai_detail.html');
        } else{
            showMsg('暂未开通');
            return;
        }
        //if(){  //信用卡
          //  $.mobile.changePage('credityw-detail.html');
        //}else if(){  //电子渠道
        //    $.mobile.changePage('eleSignyw-detail.html');
        //}else if(){  //基金
        //    $.mobile.changePage('citigoldyw-detail.html');
        //}else{  //数字卡
        //    $.mobile.changePage('debityw-detail.html');
        //}
    });
    $("#gongzuotai-ywblqkcx .previous:last").on("click", function() {
        if (!($(this).hasClass('btn_next'))) return;
        transformStringToImage($(".box-content .click").attr('path'), function(msg) {
            $('#ywbl-erweima img').attr('src', msg);
            $('#ywbl-erweima').show();
        }, function(err) {
            alert(err + '生成二维码失败');
        })
    })
    $("#ywbl-erweima").on('click', function() {
            $("#ywbl-erweima").hide();
        })
        //点击搜索框放弃按钮
    $("#gongzuotai-ywblqkcx .fangqi-seach:first").on('click', function() {
            $("#seach-day-con").hide();
        })


        //点击搜索框搜索按钮
    $("#gongzuotai-ywblqkcx .fangqi-seach:last").on('click', function() {
        workbenchJson.sT = $("#gongzuotai-ywblqkcx .seach-day-ul input[type='date']:first").val();
        workbenchJson.eT = $("#gongzuotai-ywblqkcx .seach-day-ul input[type='date']:last").val();
        var sT = $("#gongzuotai-ywblqkcx .seach-day-ul input[type='date']:first").val();//开始时间
 		var eT = $("#gongzuotai-ywblqkcx .seach-day-ul input[type='date']:last").val();//结束时间
        var eT0 = $("#gongzuotai-ywblqkcx .seach-day-ul input[type='date']:last").val().split('-'); //结束时间
        var sTs = $("#gongzuotai-ywblqkcx .seach-day-ul input[type='date']:first").val().replace(/-/g, '');

        var eTs=appTime.suiDate(eT0[0], eT0[1], eT0[2], '', 1000 * 60 * 60 * 24 * 30);

        var sR = $("#gongzuotai-ywblqkcx input.input-test-con:eq(0)").val(); //开始金额
        var eR = $("#gongzuotai-ywblqkcx input.input-test-con:eq(1)").val(); //结束金额
        if (!sT || !eT) {
            //showMsg('查询时间不能为空!');
            showTags({
                'title': '提示',
                'content': '查询时间不能为空',
                'ok': {
                }
            });
            return;
        };
        if (dateYYYYMMDD(sT) > dateYYYYMMDD(eT)) {
            //showMsg('查询起始时间不能大于截止时间!');
            showTags({
                'title': '提示',
                'content': '查询起始时间不能大于截止时间',
                'ok': {
                }
            });
            return;
        };
//      if (dateYYYYMMDD(eT)-dateYYYYMMDD(sT) >30) {
//          //showMsg('对不起，搜索区间应不大于30天！');
//          showTags({
//              'title': '提示',
//              'content': '对不起，搜索区间应不大于30天！',
//              'ok': {
//              }
//          });
//          return;
//      };
		if (sTs < eTs) {
            //showMsg('对不起，搜索区间应不大于30天！');
            showTags({
                'title': '提示',
                'content': '对不起，搜索区间应不大于30天！',
                'ok': {
                }
            });
            return;
       };
        if (sR != "" && !/^\d+(\.\d+)?$/.test(sR)) {
            //showMsg('请输入正确金额格式!');
            showTags({
                'title': '提示',
                'content': '请输入正确金额格式',
                'ok': {
                }
            });
            return;
        };
        if (eR != "" && !/^\d+(\.\d+)?$/.test(eR)) {
            //showMsg('请输入正确金额格式!');
            showTags({
                'title': '提示',
                'content': '请输入正确金额格式',
                'ok': {
                }
            });
            return;
        };
        if ((sR == "" && eR != "") || (sR != "" && eR == "")) {
            //showMsg('请输入正确的金额区间！');
            showTags({
                'title': '提示',
                'content': '请输入正确的金额区间',
                'ok': {
                }
            });
            return;
        };
        if (parseFloat(sR) > parseFloat(eR)) {
            //showMsg('金额下限不能大于金额上限！');
            showTags({
                'title': '提示',
                'content': '金额下限不能大于金额上限',
                'ok': {
                }
            });
            return;
        };
        showLoader('查询中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                "workAddress.s": commonJson.workAddress, //工作地址
                "orgId.s": commonJson.orgId, //机构号
                "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                "tranId.s": workbenchJson.tranId3,//creditJson.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "bussDateMin.s": dateYYYYMMDD(sT), //起始时间
                "bussDateMax.s": dateYYYYMMDD(eT), //截止时间
                "bussType.s": $("#gongzuotai-ywblqkcx .seach-day-ul select:eq(0)").val(), //业务类型
                "status.s": $("#gongzuotai-ywblqkcx .seach-day-ul select:eq(1)").val(), //处理状态
                "faceRecogn.s": $("#gongzuotai-ywblqkcx .seach-day-ul select:eq(2)").val(), //人脸识别
                "offOnLine.s": $("#gongzuotai-ywblqkcx .seach-day-ul select:eq(3)").val(), //脱机/联机
                "currency.s": $("#gongzuotai-ywblqkcx .seach-day-ul select:eq(4)").val(), //币种
                "amountMin.s": sR, //金额下线
                "amountMax.s": eR, //金额上限
                "page.s": "1" //页码
            }]
        };
        workbenchJson.bussinessDetailPg = 1;
        workbenchJson.bussinessDetail = sendJson;
        ibussinessDetailServiceFun(sendJson, function(msg) {
            $("#seach-day-con").hide();
            ibussinessDetailServiceSucc(msg);
        }, function(err) {
            funFail(err);
        })
    })
});
$(document).on("pageshow", '#credityw', function() {
    showLoader('业务查询中...');
    var sendJson = {
        "b":[{
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "moduleId.s":workbenchJson.moduleID , //模块编号
            "tranId.s": workbenchJson.tranId3, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "deviceNo.s": commonJson.udId, //设备编号
            "orgId.s": commonJson.orgId,
            "seqNum.s":workbenchJson.lPlatSeq   //流水号

        }]
    };
    findCreditCardDetailFun(sendJson, function (msg) {
        findCreditCardDetailSucc(msg);
    }, function (err) {
        funFail(err);
    })
})
$(document).on("pageshow", '#yunyingPersonBuyLicai_detail', function() {
    showLoader('业务查询中...');
    var sendJson = {
        "b":[{
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "moduleId.s":workbenchJson.moduleID , //模块编号
            "tranId.s": workbenchJson.tranId3, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "deviceNo.s": commonJson.udId, //设备编号
            "orgId.s": commonJson.orgId,
            "PLAT_GLOBAL_SEQ.s":workbenchJson.lPlatSeq   //流水号

        }]
    };
    getOperateVideo(sendJson, function (msg) {
        hideLoader();
        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(msg);
        var responseCode = responseObj.b;
        if (responseCode[0].results == "00"){
            $(".basic_name").next().text(responseCode[1].operateVideoVO[0].CLIENT_NAME); //姓名
            $(".basic_businessType").next().text(bussinessTypeImaging[responseCode[1].operateVideoVO[0].BUSSINESS_TYPE]); //业务类型
            $(".basic_docType").next().text(certTypeImaging[responseCode[1].operateVideoVO[0].DOC_TYPE]); //证件类型／法人
            $(".basic_docNo").next().text(responseCode[1].operateVideoVO[0].DOC_NO); //证件号码／法人
            $(".basic_acctNo").next().text(responseCode[1].operateVideoVO[0].ACCOUNT); //帐卡号
            $(".basic_agentType").next().text(clientTypeImaging[responseCode[1].operateVideoVO[0].CLIENT_TYPE]); //客户类型
            $(".basic_remark").next().text(responseCode[1].operateVideoVO[0].REMARK); ///备注
            $(".basic_productNo").next().text(responseCode[1].operateVideoVO[0].FUND_NO); //产品编号
            $(".basic_productName").next().text(responseCode[1].operateVideoVO[0].FUND_NAME); ///产品名称
            $(".basic_currency").next().text(currencyTypeImaging[responseCode[1].operateVideoVO[0].CURRENCY]); //币种
            $(".basic_tranMoney").next().text(fmoney($.trim(responseCode[1].operateVideoVO[0].AMOUNT))); //金额
            $("#imageNo").text(responseCode[1].operateVideoVO[0].IMAGE_NO); ///影音编号
        }else{
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {}
            });
        }
    }, function (err) {
        funFail(err);
    })
})
$(document).on("pageshow", '#yunying_detail', function() {
    showLoader('业务查询中...');
    var sendJson = {
        "b":[{
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "moduleId.s":workbenchJson.moduleID , //模块编号
            "tranId.s": workbenchJson.tranId3, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "deviceNo.s": commonJson.udId, //设备编号
            "orgId.s": commonJson.orgId,
            "PLAT_GLOBAL_SEQ.s":workbenchJson.lPlatSeq   //流水号

        }]
    };
    getOperateVideo(sendJson, function (msg) {
        hideLoader();
        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(msg);
        var responseCode = responseObj.b;
        if (responseCode[0].results == "00"){
            $(".basic_name").next().text(responseCode[1].operateVideoVO[0].CLIENT_NAME); //姓名
            $(".basic_businessType").next().text(bussinessTypeImaging[responseCode[1].operateVideoVO[0].BUSSINESS_TYPE]); //业务类型
            $(".basic_docType").next().text(certTypeImaging[responseCode[1].operateVideoVO[0].DOC_TYPE]); //证件类型／法人
            $(".basic_docNo").next().text(responseCode[1].operateVideoVO[0].DOC_NO); //证件号码／法人
            $(".basic_acctNo").next().text(responseCode[1].operateVideoVO[0].ACCOUNT); //帐卡号
            $(".basic_agentType").next().text(clientTypeImaging[responseCode[1].operateVideoVO[0].CLIENT_TYPE]); //客户类型
            $(".basic_remark").next().text(responseCode[1].operateVideoVO[0].REMARK); ///备注
            $(".basic_currency").next().text( currencyTypeImaging[responseCode[1].operateVideoVO[0].CURRENCY]); //币种
            $(".basic_tranMoney").next().text(fmoney($.trim(responseCode[1].operateVideoVO[0].AMOUNT))); //金额

            $(".basic_creditCode").next().text(responseCode[1].operateVideoVO[0].CREDIT_CODE); //统一社会信用代码
            $(".basic_orgCode").next().text(responseCode[1].operateVideoVO[0].ORG_CODE); //组织机构代码
            $(".basic_license").next().text(responseCode[1].operateVideoVO[0].LICENSE); //营业执照或其他批文号
            $(".basic_unitName").next().text(responseCode[1].operateVideoVO[0].COMPNY_NAME); ///单位名称
            $("#imageNo").text(responseCode[1].operateVideoVO[0].IMAGE_NO); ///影音编号
        }else{
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {}
            });
        }
    }, function (err) {
        funFail(err);
    })
})

$(document).on("pageshow", '#yunyingPersonAgencyKaihu_detail', function() {
    showLoader('业务查询中...');
    var sendJson = {
        "b":[{
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "moduleId.s":workbenchJson.moduleID , //模块编号
            "tranId.s": workbenchJson.tranId3, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "deviceNo.s": commonJson.udId, //设备编号
            "orgId.s": commonJson.orgId,
            "PLAT_GLOBAL_SEQ.s":workbenchJson.lPlatSeq   //流水号

        }]
    };
    getOperateVideo(sendJson, function (msg) {
        hideLoader();
        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(msg);
        var responseCode = responseObj.b;
        if (responseCode[0].results == "00"){
            $(".basic_name").next().text(responseCode[1].operateVideoVO[0].CLIENT_NAME); //姓名
            $(".basic_businessType").next().text(bussinessTypeImaging[responseCode[1].operateVideoVO[0].BUSSINESS_TYPE]); //业务类型
            $(".basic_docType").next().text(certTypeImaging[responseCode[1].operateVideoVO[0].DOC_TYPE]); //证件类型／法人
            $(".basic_docNo").next().text(responseCode[1].operateVideoVO[0].DOC_NO); //证件号码／法人
            $(".basic_acctNo").next().text(responseCode[1].operateVideoVO[0].ACCOUNT); //帐卡号
            $(".basic_agentType").next().text(clientTypeImaging[responseCode[1].operateVideoVO[0].CLIENT_TYPE]); //客户类型
            $(".basic_remark").next().text(responseCode[1].operateVideoVO[0].REMARK); ///备注
            $(".basic_agentName").next().text(responseCode[1].operateVideoVO[0].AGENT_NAME); //经办人姓名
            $(".basic_agentDocType").next().text(certTypeImaging[responseCode[1].operateVideoVO[0].AGENT_DOC_TYPE]); //经办人证件类型
            $(".basic_agentDocNo").next().text(responseCode[1].operateVideoVO[0].AGENT_DOC_NO); //经办人证件号码
            $("#imageNo").text(responseCode[1].operateVideoVO[0].IMAGE_NO); ///影音编号
        }else{
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {}
            });
        }
    }, function (err) {
        funFail(err);
    })
})
$(document).on("pageshow", '#yunyingPersonAgencyLicai_detail', function() {
    showLoader('业务查询中...');
    var sendJson = {
        "b":[{
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "moduleId.s":workbenchJson.moduleID , //模块编号
            "tranId.s": workbenchJson.tranId3, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "deviceNo.s": commonJson.udId, //设备编号
            "orgId.s": commonJson.orgId,
            "PLAT_GLOBAL_SEQ.s":workbenchJson.lPlatSeq   //流水号

        }]
    };
    getOperateVideo(sendJson, function (msg) {
        hideLoader();
        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(msg);
        var responseCode = responseObj.b;
        if (responseCode[0].results == "00"){
            $(".basic_name").next().text(responseCode[1].operateVideoVO[0].CLIENT_NAME); //姓名
            $(".basic_businessType").next().text(bussinessTypeImaging[responseCode[1].operateVideoVO[0].BUSSINESS_TYPE]); //业务类型
            $(".basic_docType").next().text(certTypeImaging[responseCode[1].operateVideoVO[0].DOC_TYPE]); //证件类型／法人
            $(".basic_docNo").next().text(responseCode[1].operateVideoVO[0].DOC_NO); //证件号码／法人
            $(".basic_acctNo").next().text(responseCode[1].operateVideoVO[0].ACCOUNT); //帐卡号
            $(".basic_agentType").next().text(clientTypeImaging[responseCode[1].operateVideoVO[0].CLIENT_TYPE]); //客户类型
            $(".basic_remark").next().text(responseCode[1].operateVideoVO[0].REMARK); ///备注
            $(".basic_agentName").next().text(responseCode[1].operateVideoVO[0].AGENT_NAME); //经办人姓名
            $(".basic_agentDocType").next().text(certTypeImaging[responseCode[1].operateVideoVO[0].AGENT_DOC_TYPE]); //经办人证件类型
            $(".basic_agentDocNo").next().text(responseCode[1].operateVideoVO[0].AGENT_DOC_NO); //经办人证件号码
            $(".basic_productNo").next().text(responseCode[1].operateVideoVO[0].FUND_NO); //产品编号
            $(".basic_productName").next().text(responseCode[1].operateVideoVO[0].FUND_NAME); ///产品名称
            $(".basic_currency").next().text( currencyTypeImaging[responseCode[1].operateVideoVO[0].CURRENCY]); //币种
            $(".basic_tranMoney").next().text(fmoney($.trim(responseCode[1].operateVideoVO[0].AMOUNT))); //金额
            $("#imageNo").text(responseCode[1].operateVideoVO[0].IMAGE_NO); ///影音编号
        }else{
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {}
            });
        }
    }, function (err) {
        funFail(err);
    })
})
$(document).on("pageshow", '#yunyingPersonBuyBaoxian_detail', function() {
    showLoader('业务查询中...');
    var sendJson = {
        "b":[{
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "moduleId.s":workbenchJson.moduleID , //模块编号
            "tranId.s": workbenchJson.tranId3, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "deviceNo.s": commonJson.udId, //设备编号
            "orgId.s": commonJson.orgId,
            "PLAT_GLOBAL_SEQ.s":workbenchJson.lPlatSeq   //流水号

        }]
    };
    getOperateVideo(sendJson, function (msg) {
        hideLoader();
        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(msg);
        var responseCode = responseObj.b;
        if (responseCode[0].results == "00"){
            $(".basic_name").next().text(responseCode[1].operateVideoVO[0].CLIENT_NAME); //姓名
            $(".basic_businessType").next().text(bussinessTypeImaging[responseCode[1].operateVideoVO[0].BUSSINESS_TYPE]); //业务类型
            $(".basic_docType").next().text(certTypeImaging[responseCode[1].operateVideoVO[0].DOC_TYPE]); //证件类型／法人
            $(".basic_docNo").next().text(responseCode[1].operateVideoVO[0].DOC_NO); //证件号码／法人
            $(".basic_acctNo").next().text(responseCode[1].operateVideoVO[0].ACCOUNT); //帐卡号
            $(".basic_agentType").next().text(clientTypeImaging[responseCode[1].operateVideoVO[0].CLIENT_TYPE]); //客户类型
            $(".basic_remark").next().text(responseCode[1].operateVideoVO[0].REMARK); ///备注
            $(".basic_productName").next().text(responseCode[1].operateVideoVO[0].FUND_NAME); ///产品名称
            $(".basic_tranMoney").next().text(fmoney($.trim(responseCode[1].operateVideoVO[0].AMOUNT))); //金额
            $("#imageNo").text(responseCode[1].operateVideoVO[0].IMAGE_NO); ///影音编号
        }else{
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {}
            });
        }
    }, function (err) {
        funFail(err);
    })
})
$(document).on("pageshow", '#yunyingPerson_detail', function() {
    showLoader('业务查询中...');
    var sendJson = {
        "b":[{
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "moduleId.s":workbenchJson.moduleID , //模块编号
            "tranId.s": workbenchJson.tranId3, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "deviceNo.s": commonJson.udId, //设备编号
            "orgId.s": commonJson.orgId,
            "PLAT_GLOBAL_SEQ.s":workbenchJson.lPlatSeq   //流水号

        }]
    };
    getOperateVideo(sendJson, function (msg) {
        hideLoader();
        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(msg);
        var responseCode = responseObj.b;
        if (responseCode[0].results == "00"){
            $(".basic_name").next().text(responseCode[1].operateVideoVO[0].CLIENT_NAME); //姓名
            $(".basic_businessType").next().text(bussinessTypeImaging[responseCode[1].operateVideoVO[0].BUSSINESS_TYPE]); //业务类型
            $(".basic_docType").next().text(certTypeImaging[responseCode[1].operateVideoVO[0].DOC_TYPE]); //证件类型／法人
            $(".basic_docNo").next().text(responseCode[1].operateVideoVO[0].DOC_NO); //证件号码／法人
            $(".basic_acctNo").next().text(responseCode[1].operateVideoVO[0].ACCOUNT); //帐卡号
            $(".basic_tranMoney").next().text(fmoney($.trim(responseCode[1].operateVideoVO[0].AMOUNT))); //金额
            $(".basic_agentType").next().text(clientTypeImaging[responseCode[1].operateVideoVO[0].CLIENT_TYPE]); //客户类型
            $(".basic_currency").next().text( currencyTypeImaging[responseCode[1].operateVideoVO[0].CURRENCY]); //币种
            $(".basic_remark").next().text(responseCode[1].operateVideoVO[0].REMARK); ///备注
            $("#imageNo").text(responseCode[1].operateVideoVO[0].IMAGE_NO); ///影音编号
        }else{
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {}
            });
        }
    }, function (err) {
        funFail(err);
    })
})

//我的业务－(gongzuotai-myResults.html)
$(document).on("pageshow", '#gongzuotai-myResults', function() {
    //查询条件初始化
    dateSelBuss('#myBussTimeType', '#myBussTimeDetail', '2015-1');
    $("#gongzuotai-myResults .gongzuotai-danshu").on("click", function() {
        $(".msg-con").show();
        showLoader('查询中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                "workAddress.s": commonJson.workAddress, //工作地址
                "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                "tranId.s": workbenchJson.tranId12,//creditJson.tranId, //交易编号
                "orgId.s": commonJson.orgId, //机构号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
           //     "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                "bussDateType.s": $("#myBussTimeType").val(), //时间段类型1、3、6、12 月 季度 半年 年
                "bussPeriod.s": $("#myBussTimeDetail").val() //时间段201509
            }]
        };
        IBussinessMetricsServiceFun(sendJson, function(msg) {
            ibussinessMetricsServiceSucc(msg);
        }, function(err) {
            funFail(err);
        })
    });
});






//远程复核应答－(gongzuotai-ycfhyd.html)
$(document).on("pageshow", '#gongzuotai-ycfhyd', function() {
    //为每一条数据添加class=‘click'
    $(".box-rows").bind("click", this, function() {
        console.log(this.className);
        if ($(this).hasClass('click')) {
            $(this).removeClass('click');
            $('#gongzuotai-ycfhyd .previous').removeClass('btn_next');
        } else {
            //遍历每一条数据恢复初始状态
            $('.box-rows').each(function() {
                //console.log(this);
                if ($(this).hasClass('click')) {
                    $(this).removeClass('click');
                    $('#gongzuotai-ycfhyd .previous').addClass('btn_next');
                }
            });
            $(this).addClass('click');
            $('#gongzuotai-ycfhyd .previous').addClass('btn_next');
        }
    });
});
//我的工作证-(gongzuotai-myWorkPermit.html)
$(document).on("pageshow", "#gongzuotai-myWorkPermit", function() {
        showLoader('加载中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                "workAddress.s": commonJson.workAddress, //工作地址
                "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                "tranId.s": workbenchJson.tranId13,//creditJson.tranId, //交易编号
                "orgId.s": commonJson.orgId, //机构号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "offOnline.s": commonJson.offlineOnline, //脱机/联机
                "USERID.s": commonJson.adminCount //用户工号
            }]
        };
        imyWorkPermitServiceFun(sendJson, function(msg) {
            imyWorkPermitServiceSucc(msg);
        }, function(err) {
            funFail(err);
        })
    })
    //通知公告列表-(gongzuotai-announcement.html)
$(document).on("pageshow", "#gongzuotai-announcement", function() {
        showLoader('加载中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                "workAddress.s": commonJson.workAddress, //工作地址
                "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                "tranId.s": workbenchJson.tranId11,//creditJson.tranId, //交易编号
                "orgId.s": commonJson.orgId, //机构号
                "operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
                "deviceNo.s": commonJson.udId, //设备编号
                "offOnline.s": commonJson.offlineOnline, //脱机/联机
                "page.s": "1" //页数
            }]
        };
        workbenchJson.inoticePg = 1;
        workbenchJson.inotice = sendJson;
        inoticeServiceFun(sendJson, function(msg) {
            inoticeServiceSucc(msg);
        }, function(err) {
            funFail(err);
        })
        $("#gongzuotai-announcement .box-content").on("click", ".box-rows", function() {
            workbenchJson.noticeId = $(this).attr('noticeId');
            //commonJson.noticeCount=$('.box-content .box-rows:not(.box-rows-color)').length;
            //if ($(this).has('box-rows-color')) {
            //    commonJson.noticeCount = commonJson.noticeCount - 1;
            //}
            //alert(commonJson.noticeCount);
            $.mobile.changePage('gongzuotai-announcementTwo.html');
        })
    })
    //通知公告详情-(gongzuotai-announcementTwo.html)
$(document).on("pageshow", "#gongzuotai-announcementTwo", function() {
    showLoader('加载中...');
    var sendJson = {
        "b": [{
            "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
            "workAddress.s": commonJson.workAddress, //工作地址
            "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
            "tranId.s": workbenchJson.tranId11,//creditJson.tranId, //交易编号
            "orgId.s": commonJson.orgId, //机构号
            "operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
            "deviceNo.s": commonJson.udId, //设备编号
            "offOnline.s": commonJson.offlineOnline, //脱机/联机
            "NOTICE_ID.s": workbenchJson.noticeId //通知编号
        }]
    };
    inoticeServiceDetailFun(sendJson, function(msg) {
        inoticeServiceDetailSucc(msg);
    }, function(err) {
        hideLoader();
        funFail(err);
    });
});
//工作提醒-(gongzuotai-jobAlertsTwo.html)
$(document).on("pageshow", "#gongzuotai-jobAlertsOne", function() {
    var jobCalendar = new JobCalendar();
    var curTT = myTime.curDate();
    var tt = curTT.getFullYear() + "-" + ((curTT.getMonth() + 1) > 9 ? (curTT.getMonth() + 1) : ("0" + (curTT.getMonth() + 1)));
    var ttD=  tt+'-'+ (curTT.getDate() < 10 ? '0' + curTT.getDate() : curTT.getDate());
    jobCalendar.req(tt, 'navigation-steps-day', 'gongzuotai-date-con');
    $(".ic_add").on("click", function() { //点击加号图片显示弹窗
        $(".tianjiagongzuotixing-con").show();
        $('.tianjiagongzuotixing-con textarea').val('');
        $('.seach-change-input:eq(0) input').val(ttD);
        $('.dayTixing-con').hide();
    });
    $(".tianjiagongzuotixing-quxiao").on("click", function() { //点击弹窗的取消按钮关闭弹窗
        $(".tianjiagongzuotixing-con").hide();
    });
    $(".tianjiagongzuotixing-tianjia").on("click", function () {//点击添加
        //$('.tianjiagongzuotixing-con textarea').val('');
        //判断必输值
        var searchD=$('.seach-change-input:eq(0) input').val();
        if (!(fmReg.date.test(searchD))) {
            showMsg('请输入正确的提醒时间！');
            return;
        }
        if(searchD<ttD){
            showMsg('提醒日期不能小于当前日期！');
            return;
        }
        //if ($('.seach-change-input:eq(1) select option:selected').text() == '') {
        //    showMsg('请选择提醒方式！');
        //    return;
        //}
        //var startTime = $('.input-test-con:eq(1)').val() + ':' + $('.input-test-con:eq(2)').val() + ':' + $('.input-test-con:eq(3)').val();
        //var startT = Number('' + $('.input-test-con:eq(1)').val() + $('.input-test-con:eq(2)').val() + $('.input-test-con:eq(3)').val());
        //if (!(fmReg.time.test(startTime))) {
        //    showMsg('请输入开始时间！');
        //    return;
        //}
        //var endTime = $('.input-test-con:eq(4)').val() + ':' + $('.input-test-con:eq(5)').val() + ':' + $('.input-test-con:eq(6)').val();
        //var endT = Number('' + $('.input-test-con:eq(4)').val() + $('.input-test-con:eq(5)').val() + $('.input-test-con:eq(6)').val());
        //if (!(fmReg.time.test(endTime))) {
        //    showMsg('请输入结束时间！');
        //    return;
        //}
        //if (startT >= endT) {
        //    showMsg('开始时间应不小于结束时间！');
        //    return;
        //}
        if ($('.tianjiagongzuotixing-con textarea').val() == '') {
            showMsg('请输入提醒内容！');
            return;
        }
        var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                "tranId.s": workbenchJson.tranId10,//creditJson.tranId, //交易编号
                "orgId.s": commonJson.orgId, //机构号
                "operatorNo.s": commonJson.adminCount, //操作员
                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                "workAddress.s": commonJson.workAddress, //工作地址
                "REMIND_DATE.s": $('.seach-change-input:eq(0) input').val(), //提醒日期
                "START_TIME.s": '00:00:00',//startTime, //开始时间
                "END_TIME.s": '23:59:59',//endTime, //结束时间
                "REMIND_MODE.s": 'E',//$('.seach-change-input:eq(1) select option:selected').val(),//提醒方式
                "REMIND_USER.s": commonJson.adminCount,//提醒对象
                "REMIND_CONTENT.s": $('.tianjiagongzuotixing-con textarea').val()//提醒内容
            }]
        };
        addJobAlertListFun(sendJson, function (msg) {
            var jobCalendarC = new JobCalendar($('.navigation-steps-day').attr('curTime'));
            jobCalendarC.req( $('.navigation-steps-day').attr('curTime'), 'navigation-steps-day', 'gongzuotai-date-con');
            $(".tianjiagongzuotixing-con").hide();
        }, function (err) {
            $(".tianjiagongzuotixing-con").hide();
            funFail(err);
        });
    });
    // 显示工作提醒详细
    //var dayTixing = $('.dayTixing-con');
    //$('.gongzuotai-date-con').unbind('.works').delegate('li.jobAlertsOne-bgcolor', 'tap.works', function() {
    //    dayTixing.show();
    //    var _this = $(this);
    //    var winWidth = $(window).width(); //获取屏幕宽度
    //    var winHeight = $(window).height(); //获取屏幕高度
    //    var dayTixingWidth = dayTixing.outerWidth(); //获取显示容器宽度
    //    var dayTixingHeight = dayTixing.outerHeight();
    //    var _objHeight = _this.outerHeight() + 12;
    //    var _objWidth = _this.outerWidth() + 12;
    //    var oft = _this.offset(); //获取点击对象位移屏幕的位置 {left:100,top:100}
    //    //左右显示位置判断
    //    if (winWidth - oft.left - _objWidth < dayTixingWidth) {
    //        //当右边不够显示的时候在左边显示
    //        oft.left -= dayTixingWidth + 12;
    //        dayTixing.addClass('showleft').removeClass('showright');
    //    } else {
    //        //默认显示右边
    //        oft.left += _objWidth;
    //        dayTixing.addClass('showright').removeClass('showleft');
    //    }
    //    //上下显示位置判断
    //    if (winHeight - oft.top < dayTixingHeight) {
    //        //当下边不够显示的时候在上边显示
    //        oft.top -= (dayTixingHeight - _objHeight);
    //        dayTixing.addClass('showtop').removeClass('showbottom');
    //    } else {
    //        dayTixing.addClass('showbottom').removeClass('showtop');
    //        //默认显示上面
    //    }
    //    dayTixing.css(oft);
    //})

    //事件
    $('.navigation-steps-icon:eq(0)').on('click', function () {
        $('.gongzuotai-date-con').html('');
        $('.dayTixing-con').hide();
        var ym = jobCalendar.getPreMonth($('.navigation-steps-day').attr('curTime'));
        $('.navigation-steps-day').html(Number(ym.split("-")[0]) + '年' + Number(ym.split("-")[1]) + '月').attr('curTime', ym);
        var jobCalendarP = new JobCalendar($('.navigation-steps-day').attr('curTime'));
        jobCalendarP.req(ym, 'navigation-steps-day', 'gongzuotai-date-con');
    });
    $('.navigation-steps-icon:eq(1)').on('click', function () {
        $('.gongzuotai-date-con').html('');
        $('.dayTixing-con').hide();
        var ym = jobCalendar.getNextMonth($('.navigation-steps-day').attr('curTime'));
        $('.navigation-steps-day').html(Number(ym.split("-")[0]) + '年' + Number(ym.split("-")[1]) + '月').attr('curTime', ym);
        var jobCalendarN = new JobCalendar($('.navigation-steps-day').attr('curTime'));
        jobCalendarN.req(ym, 'navigation-steps-day', 'gongzuotai-date-con');
    });
    //搜索
    $("#gongzuotai-jobAlertsOne .ic_search_gztx").on('click', function () {
        commonJson.searchAlerts='';
        if ($("#gongzuotai-jobAlertsOne .input-test-con:eq(0)").val()=='') {
            showMsg('请输入搜索的关键字！');
            return;
        }else{
            commonJson.searchAlerts=$("#gongzuotai-jobAlertsOne .input-test-con:eq(0)").val();
            $.mobile.changePage('./gongzuotai-jobAlertsTwo.html', {
                transition: "slide"
            });
        }
    });
    $("#gongzuotai-jobAlertsOne .input-test-con:eq(0)").on('keydown', function (eve) {
        var keyCode = eve.keyCode;
        if (keyCode == '13') {
            commonJson.searchAlerts='';
            if ($("#gongzuotai-jobAlertsOne .input-test-con:eq(0)").val()=='') {
                showMsg('请输入搜索的关键字！');
                return;
            }else{

                commonJson.searchAlerts=$("#gongzuotai-jobAlertsOne .input-test-con:eq(0)").val();
                $.mobile.changePage('./gongzuotai-jobAlertsTwo.html', {
                    transition: "slide"
                });
            }
        }

    });
});
//工作提醒-(gongzuotai-jobAlertsTwo.html)
$(document).on("pageshow", "#gongzuotai-jobAlertsTwo", function() {
    var JobAlertsJson = {
        "b": [{
            "deviceNo.s": commonJson.udId, //设备编号
            "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
            "tranId.s": workbenchJson.tranId10,//creditJson.tranId, //交易编号
            "orgId.s": commonJson.orgId, //机构号
            "operatorNo.s": commonJson.adminCount, //操作员
            "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
            "workAddress.s": commonJson.workAddress, //工作地址
            "searchDate.s": '', //查询日期
            "searchContent.s": commonJson.searchAlerts, //搜索内容
            "page.s":'1',// 当前页
            "isLoginNow.s": 'false' //是否是登陆时查询

        }]
    };
    showLoader('数据加载中...');
    workbenchJson.alertsPg = 1;
    workbenchJson.alerts = JobAlertsJson;
    IJobAlertsServiceFun(JobAlertsJson, function (msg) {
        alertsServiceSucc(msg);
    }, function (err) {
        err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(err);
        var responseCode = responseObj.b[0].error[0];
        if ($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
            responseCode.message = '当前网络不可用,请检测网络!';
        }
        showTags({
            'content': responseCode.message, //必输
            'ok': {
                fun:function(){
                    $.mobile.changePage('./gongzuotai-jobAlertsOne.html',{reverse: true});
                }
            }
        });
    });
    $(".ic-delete").on("click", function() { //点击废纸篓图片隐藏弹窗
        $(".submitted-successfully").hide();
        showTags({
            'title': '提示',
            'content': '您确定要删除此条消息提醒吗？',
            'ok': {
                fun: function () {
                    var JobAlertsJson = {
                        "b": [{
                            "deviceNo.s": commonJson.udId, //设备编号
                            "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                            "tranId.s": workbenchJson.tranId10,//creditJson.tranId, //交易编号
                            "orgId.s": commonJson.orgId, //机构号
                            "operatorNo.s": commonJson.adminCount, //操作员
                            "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                            "workAddress.s": commonJson.workAddress, //工作地址
                            "REMIND_NUM.s": $('.submitted-successfully .ic-delete').attr('REMIND_NUM')//提醒编号
                        }]
                    };
                    deleteJobAlertListFun(JobAlertsJson,function(msg){
                        var remind_num=$('.submitted-successfully .ic-delete').attr('REMIND_NUM');
                        $(".box-content>li").each(function(){
                            if($(this).attr('REMIND_NUM')==remind_num) {
                                $(this).remove();
                            }
                        });
                    },function(err){
                        funFail(err);
                    });
                }
            },
            'cancel':{}
        });
    });
    $(".mian-tanchuang-yes").on("click", function() { //点击确定
        $(".submitted-successfully").hide();
    });
});
//查询贷款利率列表
$(document).on("pageshow", "#gongzuotai-lilvandwaihui", function() {
    workbenchJson.dkSucc = workbenchJson.ckSucc = workbenchJson.whSucc = false;
    $('.lilvandwaihui-tabs li').on('click', function() {
        var curIndex = $(this).index();
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.lilvandwaihui-tabs-contwrap:eq(' + curIndex + ')').show().siblings('.lilvandwaihui-tabs-contwrap').hide();
        if(curIndex=='0'){
            if(!workbenchJson.dkSucc){
                showLoader('加载中...');
                lilvandwaihuiILoanRateServiceFun();
            }
        }
        else if(curIndex=='1'){
            if(!workbenchJson.ckSucc){
                showLoader('加载中...');
                lilvandwaihuiIMcRateServiceFun();
            }
        }
        else{
            if(!workbenchJson.whSucc){
                showLoader('加载中...');
                lilvandwaihuiIExchangeQuotationServiceFun();
            }
        }

    })

    $('.lilvandwaihui-tabs-contwrap-ck .lilvandwaihui-in-tabs-hd li').on('click', function() {
        var curIndex = $(this).index();
        $(this).addClass('active').siblings('li').removeClass('active');
        $('.lilvandwaihui-tabs-contwrap-ck .lilvandwaihui-in-tabs-bd:eq(' + curIndex + ')').show().siblings('.lilvandwaihui-in-tabs-bd').hide();
    })
    showLoader('加载中...');
    //查询贷款利率列表
    lilvandwaihuiILoanRateServiceFun();


})
//续传影像
$(document).on("pageshow", "#gongzuotai-xuchuanyingxiangziliao",function(){
    queryProgress();

    function queryProgress(){
        showLoader("查询中...")
        queryTableDataByConditions({
            "databaseName": "myDatabase", //数据库名
            "tableName": "up_download_info" //表名
        }, function(msg) {
            photoXuChuan(msg);
            hideLoader();
        }, function(err) {
            hideLoader();
            showMsg('查询数据库失败' + msg);
        });
    }

    function photoXuChuan(msg){
        var textHtml='';
        $.each(msg,function(index,ele){
            var appBuss=JSON.parse(ele.appBuss);
            var parInt=parseInt((ele.pos)/(ele.leng)*100);

            if(ele.pos == '' ||ele.pos == undefined){
            		parInt = 100;
            }
            if(ele.leng == '' || ele.leng == undefined){
            		parInt = 100;
            }
            var bT='';
            if(appBuss.offlineOnline=='online'){
                bT=myTime.UnixToDate(ele.fileToken).split(' ')[0];
            }else{
                if (appBuss.moduleId == '58') {
                    bT = myTime.UnixToDate(ele.fileToken).split(' ')[0];
                } else {
                    bT = myTime.UnixToDate(parseInt(Number(ele.fileToken) / 1000)).split(' ')[0];
                }
            }
            //字符串
            textHtml += '<li class="box-rows">' +
                '<div>'+bT+'</div>' +
                '<div>'+appBuss.operatorNo+'</div>' +
                '<div>'+moduleObj[appBuss.tranId]+'</div>' +
                '<div>'+attchTypeObj[ele.fileType]+'</div>' +
                '<div>'+appBuss.custName+'</div>' +
                '<div class="idCard">'+appBuss.custCredNo+'</div>' +
                '<div class="process"><span class="jindutiao-con"><div class="jindutiao-jindu"><div class="jindutiao-bgcolor" style="width:'+parInt+'% !important;"></div></div><span>'+parInt+'%</span></span></div>' +
                '</li>';
        });
        if(textHtml==''){
            textHtml='<li style="text-align:center;height: 55px;line-height: 55px">文件已全部上传完成!</li>'
        }
        $('#gongzuotai-xuchuanyingxiangziliao .box-content').html(textHtml);
    }

    $('#btnFlash').on('click', function(){
        queryProgress();
    });
});
//查询贷款利率列表
function lilvandwaihuiILoanRateServiceFun(){
    var sendJsonILoanRate = {
        "b": [{
            //"offlineOnline":creditJson.storage.offlineOnline,//脱机/联机
            "orgId.s": commonJson.orgId,
            "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
            "tranId.s": workbenchJson.tranId6,//creditJson.tranId, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "deviceNo.s": commonJson.deviceNo, //设备编号
            "offlineOnline.s": commonJson.offlineOnline,
            "workAddress.s": commonJson.workAddress,
            "RTCYNO.s": "01", //货币代号
            "RTINKD.s": "101", //利率种类
            "RTYEMO.s": "Y" //年/月利率
        }]
    };
    ILoanRateServiceFun(sendJsonILoanRate,function(msg) {
            ILoanRateServiceSucc(msg);
        }, function(err) {
            workbenchJson.dkSucc = true;
            funFail(err);
        })
}
//查询存款利率列表
function lilvandwaihuiIMcRateServiceFun(){
    var sendJsonIMcRate = {
        "b": [{
            //"offlineOnline":creditJson.storage.offlineOnline,//脱机/联机
            "orgId.s": commonJson.orgId,
            "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
            "tranId.s": workbenchJson.tranId6,//creditJson.tranId, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "deviceNo.s": commonJson.deviceNo, //设备编号
            "offlineOnline.s": commonJson.offlineOnline,
            "workAddress.s": commonJson.workAddress,
            "FLAG.s": "1"
        }]
    };
    IMcRateServiceFun(sendJsonIMcRate, function(msg) {
            IMcRateServiceSucc(msg);
        }, function(err) {
            workbenchJson.ckSucc = true;
            funFail(err);
        })

}
//外汇牌价
function lilvandwaihuiIExchangeQuotationServiceFun(){
    var sendJsonIExchangeQuotation = {
        "b": [{
            "orgId.s": commonJson.orgId,
            "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
            "tranId.s": workbenchJson.tranId6,//creditJson.tranId, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "deviceNo.s": commonJson.deviceNo, //设备编号
            "offlineOnline.s": commonJson.offlineOnline,
            "workAddress.s": commonJson.workAddress,
            "FLAG.s":'1' //交易编号
        }]
    };
    IExchangeQuotationServiceFun(sendJsonIExchangeQuotation, function(msg) {
        IExchangeQuotationServiceSucc(msg);
    }, function(err) {
        workbenchJson.whSucc = true;
            $('.lilvandwaihui-tabs-contwrap-wh .lilvandwaihui-in-tabs-bd').html('<li><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>100</div></li><li><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>100</div></li><li><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>100</div></li>');
        funFail(err);
    })
}

$(document).on("pageshow", "#gongzuotai-renLianShiBie", function(){
    $('#gongzuotai-renLianShiBie .renlianxinxi-zhi:eq(0)').text(commonJson.TLRNAME);
    $('#gongzuotai-renLianShiBie .renlianxinxi-zhi:eq(1)').text(commonJson.idCardNo);
    $('#gongzuotai-renLianShiBie .renlianxinxi-photo-add').on('click',function(){
        faceDistinguish('trans',function(msg){
            var imgSrc=$('.renlianxinxi-photo-img').attr('src');
            $('.renlianxinxi-photo-img').attr('src',msg);

            deletePhoto([imgSrc],function(msg){

            },function(err){

            })
        },function(err){
            showMsg('拍摄失败');
        })
    })
    $('#gongzuotai-renLianShiBie .renlianxinxi-reg').on('click',function(){
        if(!$('.renlianxinxi-photo-img').attr('src')){
            showMsg('请录入头像');
            return false;
        }
        if($(".renlianshibie-password").val() == ''){
            showMsg('请输入用户密码');
            return false;
        }
        showLoader('注册中...');
        transFormBase64($('.renlianxinxi-photo-img').attr('src'),function(msg){
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                    "workAddress.s": commonJson.workAddress, //工作地址
                    "orgId.s": commonJson.orgId, //机构号
                     "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                    "tranId.s": workbenchJson.tranId14,//creditJson.tranId, //交易编号
                    "operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
                    "deviceNo.s": commonJson.udId, //设备编号
                    "offOnline.s": commonJson.offlineOnline, //脱机/联机
                    "CARD_NO.s": commonJson.idCardNo,//身份证号
                    "TELLER.s": commonJson.adminCount,//柜员号
                    "USER_NAME.s":commonJson.TLRNAME,//姓名
                    "USER_TYPE.s":"1",
                    "TRANS_CHANNEL.s":"301",
                    "TRANS_SUB_NO.s":commonJson.orgId, //二级分行
                    "IMG_BASE64.s":msg,//照片
                    "PWD.s":$(".renlianshibie-password").val()//密码
                }]
            };
            //alert(JSON.stringify(sendJson))
            IFaceRecognitionServiceRegFun(sendJson, function(msg) {
                IFaceRecognitionServiceRegSucc(msg);
            }, function(err) {
                hideLoader();
                funFail(err);
            });
        })
    })
})

/*按关键字搜索 成功回调*/
function  alertsServiceSucc(msg){
    hideLoader();
    var textHtml = '';
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == "00") {
        var jobList = responseCode;
        if(jobList.length > 1){
            $.each(jobList,function(index,element){
                if(index==0){return;}
                textHtml += '<li class="box-rows" REMIND_MODE="' + element.jobAlerts[0].REMIND_MODE + '" START_TIME="' + element.jobAlerts[0].START_TIME + '"END_TIME="'+element.jobAlerts[0].END_TIME+'"REMIND_NUM="'+element.jobAlerts[0]['REMIND_NUM.l']+'">' +
                    '<div>' + element.jobAlerts[0].REMIND_CONTENT + '</div>' +
                    '<div>' + element.jobAlerts[0].REMIND_DATE + '</div>' +
                    '</li>';
            });
            $("#gongzuotai-jobAlertsTwo .box-content").empty();
            $("#gongzuotai-jobAlertsTwo .box-content").html(textHtml);
            //分页
            $("#gongzuotai-jobAlertsTwo .page-number-con").createPage({
                pageCount: responseCode[0]['pageCount.i'],
                current: workbenchJson.alertsPg,
                backFn: function(p) {
                    showLoader('加载中...');
                    workbenchJson.alerts.b[0]["page.s"] = String(p);
                    workbenchJson.alertsPg = p;
                    IJobAlertsServiceFun(workbenchJson.alerts, function(msg) {
                        alertsServiceSucc(msg);
                    }, function(err) {
                        funFail(err);
                    })
                }
            });
            $(".box-content>li").on("click", function () {
                $(".submitted-successfully").show();
                //var alertStyle='';
                //if($(this).attr('REMIND_MODE')=='E'){
                //    alertStyle='登陆提醒';
                //}else{
                //    alertStyle='首次登陆提醒';
                //}
                $('.submitted-successfully .mian-tanchuang-same:eq(0)').html($(this).find('div').eq(1).html());
                //$('.submitted-successfully .mian-tanchuang-same:eq(1)').html(alertStyle);
                //$('.submitted-successfully .mian-tanchuang-same:eq(2)').html($(this).find('div').eq(1).html());
                //$('.submitted-successfully .mian-tanchuang-same:eq(3)').html($(this).attr('START_TIME'));
                //$('.submitted-successfully .mian-tanchuang-same:eq(4)').html($(this).attr('END_TIME'));
                $('.submitted-successfully .mian-tanchuang-neirong').html($(this).find('div').eq(0).html());
                $('.submitted-successfully .ic-delete').attr('REMIND_NUM',$(this).attr('REMIND_NUM'));
            });

        }else{
            showTags({
                'title': '提示',
                'content':"无相关工作提醒!",
                'ok': {
                    fun:function(){
                        $.mobile.changePage('./gongzuotai-jobAlertsOne.html', {reverse: true});
                    }
                }
            });
        }

    }
    else {
    	if (responseCode[0].results == "08") {
			hideLoader();
		}else{
			showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun:function(){
                    $.mobile.changePage('./gongzuotai-jobAlertsOne.html', {reverse: true});
                }
            }
        });
		}
    }
}

//2016年5月26日  --- 麦田
//工作轨迹  gongzuoguiji.html
$(document).on("pageshow", "#gongzuotai-jobTrajectory", function () {
    //添加客户经理姓名
    $("#gongzuotai-jobTrajectory .managerText span").text(commonJson.TLRNAME);
    //接口请求
    var gDataEnd = appTime.appCurDate('');  //当前时间
    var mday = appTime.myCurDate.getDate()-1;//当前日期
    var gDataStart = appTime.appPreDate('', 1000 * 60 * 60 * 24 * mday);//获取当月1号
    var bussDateMin;//查询初始日期
    var bussDateMax;//查询结束日期

    //自定义搜索框参数显示
    var firstDate = "";//搜索初始日期
    var lastDate = "";//搜索结束日期
    //默认搜索参数
    if(firstDate == ""){
        bussDateMin = dateGetYMD(mday)[1];//初始日期
    }else {
        bussDateMin = firstDate;
    }
    if(lastDate == ""){
        bussDateMax = dateGetYMD(10)[0];//当前日期
    } else {
        bussDateMax = lastDate;
    }
    //查询传递参数
    var sendJson = {
        "b": [{
            "workAddress.s": commonJson.workAddress, //工作地址
            "orgId.s": commonJson.orgId, //机构号
            "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
            "tranId.s": workbenchJson.tranId15,//creditJson.tranId, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "deviceNo.s": commonJson.udId, //设备编号
            "offOnLine.s": "", //脱机/联机
            "bussDateMin.s":dateYYYYMMDD(bussDateMin), //起始时间
            "bussDateMax.s":dateYYYYMMDD(bussDateMax), //截止时间
            "bussType.s": "", //业务类型
        }]
    };

    //showLoader("地图加载中...");
    //地图初始化,设置地图的最大最小级别
    var map = new BMap.Map("MT_jobTrajectory_map",{minZoom:13,maxZoom:18});
    map.addEventListener('load', function () {         //屏蔽百度logo的跳转
        setTimeout(function () {
            $('a[href="http://map.baidu.com/?sr=1"]').attr('href', '#').on('click', function () {
                showTags({
                    'content': "处理异常",
                    'ok': {}
                });
            });
        }, 1000);
    });

    map.centerAndZoom("深圳",15);
    map.addControl(new BMap.NavigationControl());
    map.enableScrollWheelZoom(true);

    //添加地图加载完成监听事件
    map.addEventListener("tilesloaded",loadBMap);

    function loadBMap(){
        //移除地图监听事件
        map.removeEventListener("tilesloaded",loadBMap);
        showLoader("查询数据中,请等待...")
        //调用工作轨迹查询接口
        getJobTrajectoryQueryFun(sendJson,function(msg){
            showJobTrajectorySucc(msg,bussDateMin,bussDateMax,map);
        },function(err){
            funFail(err);
        });
    }

    //自定义搜索按钮
    $("#gongzuotai-jobTrajectory .search").on("click",function(){
        //搜索起始日期
        if(firstDate == ""){
            $("#gongzuotai-jobTrajectory input[type='date']:first").val(dateGetYMD(mday)[1]);
        } else {
            $("#gongzuotai-jobTrajectory input[type='date']:first").val(firstDate);
        }
        //搜索结束日期
        if(lastDate == ""){
            $("#gongzuotai-jobTrajectory input[type='date']:last").val(dateGetYMD(10)[0]);
        } else {
            $("#gongzuotai-jobTrajectory input[type='date']:last").val(lastDate);
        }

        $("#gongzuotai-jobTrajectory .seach-day-con").show();
    });

    //放弃按钮
    $("#gongzuotai-jobTrajectory .fangqi-seach:first").on("click",function(){
        $("#gongzuotai-jobTrajectory .seach-day-con").hide();
    });

    //搜索按钮
    $("#gongzuotai-jobTrajectory .fangqi-seach:last").on("click",function(){
        firstDate = $("#gongzuotai-jobTrajectory input[type='date']:first").val();//开始时间
        lastDate = $("#gongzuotai-jobTrajectory input[type='date']:last").val();//结束时间
        var bussType = $("#gongzuotai-jobTrajectory .checkBusiness select").val();//业务类型
        if (!firstDate || !lastDate) {
            //showMsg('查询时间不能为空!');
            showTags({
                'title': '提示',
                'content': '查询时间不能为空',
                'ok': {
                }
            });
            return;
        };

        if(dateYYYYMMDD(firstDate)>dateYYYYMMDD(lastDate)){

            showTags({
               "title" : "提示",
                "content" : "查询起始时间不能大于截止时间",
                "ok": {
                }
            });
            return
        };
        var sendJson = {
            "b": [{
                "workAddress.s": commonJson.workAddress, //工作地址
                "orgId.s": commonJson.orgId, //机构号
                "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
                "tranId.s": workbenchJson.tranId15,//creditJson.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "offOnLine.s": "", //脱机/联机
                "bussDateMin.s":dateYYYYMMDD(firstDate), //起始时间
                "bussDateMax.s":dateYYYYMMDD(lastDate), //截止时间
                "bussType.s":bussType, //业务类型
            }]
        };
        showLoader("查询数据中,请等待...")
        //调用工作轨迹查询接口
        getJobTrajectoryQueryFun(sendJson,function(msg){
            $("#gongzuotai-jobTrajectory .seach-day-con").hide();
            showJobTrajectorySucc(msg,firstDate,lastDate,map);
        },function(err){
            $("#gongzuotai-jobTrajectory .seach-day-con").hide();
            funFail(err);
        });
    });
});
