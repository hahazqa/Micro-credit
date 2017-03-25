/**
 * Created by lei on 4/29/16.
 * 理财风评
 */


/*读取身份证界面*/
$(document).on('pageshow', '#finance-reading', function () {
    getCurrentLocationCoordinateFun();
    financeJson = {
        characterCache: false, //风评等级页面缓存
        imageCache: false, //影像采集页面缓存
        questCache: false, //填写问卷页面
        messageCache: false, //信息录入页面缓存
        moduleId: '26',  //模块
        tranId: '27' //交易编号
    };
    //调用刷身份证方法
    $(".footter .previous").on('click', function () {
        creditReadCard(function () {
            $.mobile.changePage('Finance-read.html');
        }, function (err) {
            $.mobile.changePage('Finance-read.html');
        });
    });
    commonJson.isCustermerInfoMultiplex = false; //确定影像复用
    //点击影像复用按钮
    $(".common-reading .conter-con .picRe").on('click', function () {
        $.mobile.changePage('finance-video.html');
    });
});

/*读取身份证界面*/
$(document).on('pageshow', '#finance-video', function () {
    //从数据库中查询可复用的个人信息
    queryAllcacheCustermerInfo();
    //点击取消
    $('.previous-con').on('click', function () {
        $.mobile.changePage('Finance-reading.html', {reverse: true});
    });
    //点击影像复用
    $('#btn_next').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        commonJson.isCustermerInfoMultiplex = true; //使用影像复用功能
        $.mobile.changePage('Finance-read.html');
    })
});

/*显示身份证界面*/
$(document).on('pageshow', '#finance-read', function () {
    if (creditJson.isReadCardSucc) { //读卡成功
        $(".common-read .ziduan-value:eq(0)").text(custermerInfo.name);
        $(".common-read .ziduan-value:eq(1)").text(custermerInfo.sex);
        $(".common-read .ziduan-value:eq(2)").text(custermerInfo.nation);
        $(".common-read .ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
        $(".common-read .ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
        $(".common-read .ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
        $(".common-read .ziduan-value:eq(6)").text(custermerInfo.address);
        $(".common-read .ziduan-value:eq(7)").text(custermerInfo.cerNO);
        $(".common-read .ziduan-value:eq(8)").text(custermerInfo.issAuthority);
        $(".common-read .ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
        $('.common-read .sfz-img').attr('src', custermerInfo.image);
        if(isGtEighteenAge(custermerInfo.birthday)){
            $(".common-read .loading_box").html('');
            showTags({
                'title': '提示',
                'content': '未满18周岁不允许办理!',
                'ok': {
                    fun:function () {
                        $.mobile.changePage('Finance-reading.html', {reverse: true});
                    }
                }
            });
            return;
        }
        if (commonJson.isCustermerInfoMultiplex) { //如果是影像复用不需要进行联网核查
            $(".common-read .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
            $('.footter .previous:eq(1)').addClass('btn_next');
        } else {
            $('.footter .previous:eq(1)').removeClass('btn_next');
            $('.sh_loading_box_shadow').remove();
            $('.header .head-left,.header .head-right').addClass('btn-cannt-click');
            $('.ui-page').append('<div class="sh_loading_box_shadow" style="position:absolute;right:0;top:0;left:0;bottom:0;z-index:24;background-color: rgba(0,0,0,.0);"></div>');
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": financeJson.moduleId,//模块编号
                    "tranId.s": financeJson.tranId,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    "DOCUMENT_TYPE.s": "0",//证件类型
                    "DOCUMENT_ID.s": custermerInfo.cerNO,//身份证号码
                    "CLIENT_NAME.s": custermerInfo.name,//被核对人姓名
                    "BUSSINESSCODE.s": "01",//业务总类
                    "BRANCH_ID.s": commonJson.orgId//机构号
                }]
            };
            //身份证联网核查
            icitizenCertificateIdenifyFun(sendJson, function (msg) {
                $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
                $('.sh_loading_box_shadow').remove();
                icitizenCertificateIdenifyComSucc(msg, financeJson, 'Finance-reading.html', 'finance-character.html', icitizenCertificateIdenifyConF);
            }, function (err) {
                $('.footter .previous:eq(1)').removeClass('btn_next');
                $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
                $('.sh_loading_box_shadow').remove();
                $(".common-read .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
                funFail(err);
            })
        }
    } else {
        if (commonJson.isCustermerInfoMultiplex) {
            $(".common-read .ziduan-value:eq(0)").text(custermerInfo.name);
            $(".common-read .ziduan-value:eq(1)").text(custermerInfo.sex);
            $(".common-read .ziduan-value:eq(2)").text(custermerInfo.nation);
            $(".common-read .ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
            $(".common-read .ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
            $(".common-read .ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
            $(".common-read .ziduan-value:eq(6)").text(custermerInfo.address);
            $(".common-read .ziduan-value:eq(7)").text(custermerInfo.cerNO);
            $(".common-read .ziduan-value:eq(8)").text(custermerInfo.issAuthority);
            $(".common-read .ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
            $('.common-read .sfz-img').attr('src', custermerInfo.image);
            if(isGtEighteenAge(custermerInfo.birthday)){
                $(".common-read .loading_box").html('');
                showTags({
                    'title': '提示',
                    'content': '未满18周岁不允许办理!',
                    'ok': {
                        fun:function () {
                            $.mobile.changePage('Finance-reading.html', {reverse: true});
                        }
                    }
                });
                return;
            }
            $(".common-read .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
            $('.footter .previous:eq(1)').addClass('btn_next');
        } else {
            $(".common-read .pic_suc").text('身份证读取失败!');
            $(".common-read .loading_box").html('');
        }
    }

    //点击上一步，跳转页面
    $('.footter .previous:eq(0)').on('click', function () {
        $.mobile.changePage('Finance-reading.html', {reverse: true});
    });

    //下一步
    $('.footter .previous:eq(1)').on('click', function () {  // 查核心
        if (!($(this).hasClass('btn_next'))) return;
        showLoader('客户信息查询中...');
        icitizenCertificateIdenifyConF();
    });

    $(".lianwanghecha-chongxin").on("click", function () {//重新联网核查
        showLoader('信息查询中...');
        $(".lianwanghecha-yichang").hide();
        $('.footter .previous:eq(1)').removeClass('btn_next');
        $('.sh_loading_box_shadow').remove();
        $('.header .head-left,.header .head-right').addClass('btn-cannt-click');
        $('.ui-page').append('<div class="sh_loading_box_shadow" style="position:absolute;right:0;top:0;left:0;bottom:0;z-index:24;background-color: rgba(0,0,0,.0);"></div>');
        $(".loading_box").html('<img class="img_loading" src="../../images/ic_load.gif" alt=""/><div class="read_loading">信息审核中…</div>');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "orgId.s": commonJson.orgId,//机构号
                "moduleId.s": financeJson.moduleId,//模块编号
                "tranId.s": financeJson.tranId,//交易编号
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId,//设备编号
                "DOCUMENT_TYPE.s": "0",//证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO,//身份证号码
                "CLIENT_NAME.s": custermerInfo.name,//被核对人姓名
                "BUSSINESSCODE.s": "01",//业务总类
                "BRANCH_ID.s": commonJson.orgId//机构号
            }]
        };
        //身份证联网核查
        icitizenCertificateIdenifyFun(sendJson, function (msg) {
            $('.footter .previous:eq(1)').addClass('btn_next');
            $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
            $('.sh_loading_box_shadow').remove();
            icitizenCertificateIdenifyComSucc(msg, financeJson, 'Finance-reading.html', 'finance-character.html', icitizenCertificateIdenifyConF);
        }, function (err) {
            $('.footter .previous:eq(1)').removeClass('btn_next');
            $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
            $('.sh_loading_box_shadow').remove();
            $(".common-read .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
            funFail(err);
        })
    });

    $(".lianwanghecha-jixu").on("click", function () {//继续业务办理
        $(".lianwanghecha-yichang").hide();
        showLoader('客户信息查询中...');
        icitizenCertificateIdenifyConF();
    });

    $(".lianwanghecha-tuichu").on("click", function () {//退出
        $.mobile.changePage('Finance-reading.html', {transition: "slide"});
        $(".lianwanghecha-yichang").hide();
    });
});

/*风评等级界面*/
$(document).on('pageshow', '#finance-character', function () {
    if (financeJson.characterCache) {
        $('.msg_con').html(riskLevelOne[financeJson.zRiskLevel]);//
        if (financeJson.riskDate == '空') {
            $('.msg_foot span').html(financeJson.riskDate);
        } else {
            $('.msg_foot span').html(dataYearMonthData(financeJson.riskDate));//
        }
        $('.footter .previous:eq(1)').addClass('btn_next');
    } else {
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
                "CLIENT_NAME.s": custermerInfo.name,//客户名称
                "DOCUMENT_TYPE..s": '0',//证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO,//证件号码
                "CUST_TYPE_ID.s": '',//客户分组
                "CLIENT_TYPE.s": '1',//客户类型 0--机构  1--个人
                "OFFSET.s": '',//定位串
                "QUERY_NUM.s": '',//查询行数
                "PRO_MANAGER.s": ''//产品管理人
            }]
        };
        getRiskLevelFun(sendJson, function (msg) {
            getRiskLevelSucc(msg);
        }, function (err) {
            funFail(err);
        })
    }
    financeJson.characterCache = true;
    //点击上一步，跳转页面
    $('.footter .previous:eq(0)').on('click', function () {
        $.mobile.changePage('Finance-reading.html', {reverse: true});
    });
    //点击下一步，跳转页面
    $('.footter .previous:eq(1)').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        $.mobile.changePage('./Finance-customeP.html');
    });
});

/*影响采集界面*/
$(document).on('pageshow', '#finance-customerP', function () {
    if (financeJson.characterCache && financeJson.imageCache) {
        if (financeJson.custFacePic != undefined) {
            $('.img_box:eq(0) .rephoto').text('重拍');
            $('.img_box:eq(0) .camera').hide();
            $('.img_box:eq(0) .customer').append('<img src="' + financeJson.custFacePic + '" width="100%" height="115px" class="camera-pic">');
        }
        if (financeJson.frontIDCardPic != undefined) {
            $('.img_box:eq(1) .rephoto').text('重拍');
            $('.img_box:eq(1) .camera').hide();
            $('.img_box:eq(1) .customer').append('<img src="' + financeJson.frontIDCardPic + '" width="100%" height="115px" class="camera-pic">');
        }
        if (financeJson.backIDCardPic != undefined) {
            $('.img_box:eq(2) .rephoto').text('重拍');
            $('.img_box:eq(2) .camera').hide();
            $('.img_box:eq(2) .customer').append('<img src="' + financeJson.backIDCardPic + '" width="100%" height="115px" class="camera-pic">');
        }
        var ind = 0;
        for (var i = 0; i < 3; i++) {
            if ($(' .customer:eq(' + i + ')').find("img").length == 2) {
                ind++;
                if (ind >= 3) {
                    $('.footter .previous:eq(1)').addClass('btn_next');
                } else {
                    $('.footter .previous:eq(1)').removeClass('btn_next');
                }
            }
        }
    } else {
        if (commonJson.isCustermerInfoMultiplex) { //如果影像复用 影像进行返显
            queryTableDataByConditions({
                "databaseName": "myDatabase",
                "tableName": "customer_info",
                "conditions": {
                    "SUBMITTIME": "between " + commonJson.submitTime + " and " + commonJson.submitTime
                }
            }, function (msg) {
                var FRONTIDCARDPICBase64 = msg[0].FRONTIDCARDPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');
                var BACKIDCARDPICBase64 = msg[0].BACKIDCARDPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');
                //身份证正面base64转路径
                Meap.transFormImage(getYMDHMSM('frontIDCardPic') + commonJson.udId, FRONTIDCARDPICBase64, 'picSty', function (msg2) {
                    $('.img_box:eq(1) .customer').append('<img src="' + msg2 + '" width="100%" height="115px" class="camera-pic">');
                }, function (err) {
                    showMsg('身份证正面base64转路径失败');
                });
                //身份证反面base64转路径
                Meap.transFormImage(getYMDHMSM('backIDCardPic') + commonJson.udId, BACKIDCARDPICBase64, 'picSty', function (msg3) {
                    $('.img_box:eq(2) .customer').append('<img src="' + msg3 + '" width="100%" height="115px" class="camera-pic">');

                }, function (err) {
                    showMsg('身份证反面base64转路径失败');
                });
                $('.img_box:eq(1) .rephoto,.img_box:eq(2) .rephoto').text('重拍');
                $('.img_box:eq(1) .camera,.img_box:eq(2) .camera').hide();
            }, function (err) {

            })
        }
    }
    financeJson.imageCache = true;
    //预览大图 点击关闭
    $('.bigpic-review-close').click(function (event) {
        commonImageAcquisition.reviewImgClose();
    });
    //预览大图 删除图片
    $('.bigpic-review-del').click(function (event) {
        commonImageAcquisition.delImg(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc, 3);
    });
    //预览大图 重新拍照
    $('.bigpic-review-rephone').click(function (event) {
        commonImageAcquisition.reGetImg(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc, financeJson);
    });
    //点击拍照
    $('.customerP .conter-con').on('click', '.customer', function (ev) {
        commonImageAcquisition.curParentObj = $(this);
        commonImageAcquisition.imgSrc = $(this).find('.camera-pic').attr('src');
        var oTarget = ev.target;
        if ($(this).find('.rephoto').html() == '重拍') { //重拍
            if ($(oTarget).hasClass('rephoto')) {
                commonImageAcquisition.reGetImg(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc, financeJson);
            }
            if ($(oTarget).hasClass('camera-pic')) { //预览大图
                commonImageAcquisition.imgSrc = $(oTarget).attr('src');
                commonImageAcquisition.reviewImg($(oTarget).attr('src'));
            }
            return;
        }
        //拍照
        if (commonImageAcquisition.curParentObj.parent().hasClass('get-face')) {
            commonImageAcquisition.getFace(commonImageAcquisition.curParentObj, 3, financeJson);
        } else {
            commonImageAcquisition.getImg(commonImageAcquisition.curParentObj, 3);
        }

    });

    //上一步
    $('.footter .previous:eq(0)').on('click', function () {
        financeJson.custFacePic = $('.customerP .img_box:eq(0) .camera-pic:eq(0)').attr('src'); //客户面部照片
        financeJson.frontIDCardPic = $('.customerP .img_box:eq(1) .camera-pic:eq(0)').attr('src'); //身份证正面
        financeJson.backIDCardPic = $('.customerP .img_box:eq(2) .camera-pic:eq(0)').attr('src'); //身份证反面
        $.mobile.changePage('./finance-character.html', {reverse: true});
    });
    //下一步
    $('.footter .previous:eq(1)').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        financeJson.custFacePic = $('.customerP .img_box:eq(0) .camera-pic:eq(0)').attr('src'); //客户面部照片
        financeJson.frontIDCardPic = $('.customerP .img_box:eq(1) .camera-pic:eq(0)').attr('src'); //身份证正面
        financeJson.backIDCardPic = $('.customerP .img_box:eq(2) .camera-pic:eq(0)').attr('src'); //身份证反面
        if (financeJson.isCompress) {
            $.mobile.changePage('Finance-questionnaires.html', {transition: "slide"});
        } else {
            $.mobile.changePage('./Finance-personFace.html', {transition: "slide"});
        }
    });
});

/*影像对比界面*/
$(document).on('pageshow', '#finance-personFace', function () {
    showLoader("影像对比中...");
    transFormBase64(financeJson.custFacePic, function (msg) {
        financeJson.faceBase64 = msg;
        transFormBase64(custermerInfo.image, function (msg1) {
            financeJson.imageBase64 = msg1;
            $(".personFace .camera:eq(0)").attr('src', financeJson.custFacePic);
            $(".personFace .camera:eq(1)").attr('src', custermerInfo.image);
            $(".personFace .camera:eq(2)").attr('src', financeJson.custFacePic);
            if (commonJson.isCustermerInfoMultiplex) {
                financeJson.checkPhoto = custermerInfo.checkPhoto;
            }
            if (lianwanghechaData.CheckResult == '09' || lianwanghechaData.CheckResult == '02') {
                $(".personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + financeJson.checkPhoto);
            } else {
                $(".personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + financeJson.checkPhoto);
            }
            //影像两两对比
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": financeJson.moduleId,//模块编号
                    "tranId.s": financeJson.tranId,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    "OPERATOR_NO.s": commonJson.adminCount, //业务经办人工号
                    "TRANS_SCENE.s": "0006",  //交易场景  //TODO 这个地方
                    "COMPARE_TYPE.s": "2",  //    比对类型1-客户经理比对，2-客户比对
                    "WS_TYPE.s": "2",  // 终端类型1-PC，2-IOS，3-Android
                    "WSNO.s": commonJson.udId,  //    终端号
                    "VERSION.s": "v1.1.4",  //当前控件版本
                    "TRANS_CHANNEL.s": "301",  //   渠道301
                    "ID_CARD.s": custermerInfo.cerNO,  // 身份证号码
                    "IMG_BASE.s": financeJson.faceBase64,  //      现场照片
                    "CRYPT_TYPE.s": "0",  //   图像是否经过加密0-未加密，1-加密方式一，2加密方式二
                    "ID_IMG_BASE.s": financeJson.checkPhoto,  //联网核查照片
                    "CARD_IMG_BASE.s": financeJson.imageBase64,  //  芯片照片
                    "BUSI_TYPE.s": "31"  //  理财

                }]
            };
            ifacelRecognitionSeFun(sendJson, function (msg) {
                iFacelRecognitionServiceComSucc(msg, financeJson);
            }, function (err) {
                financeJson.faceRecogn = '2'; //自动不通过
                $(".personFace .face-result").addClass('no-pass').text('未通过');
                $(".personFace .center-header").text('人脸识别未通过！');
                $('.personFace .previous:last').addClass('btn_next').text('远程复核');
                funFail(err);
            })
        }, function (err) {
            alert('影像转换失败！')
        })
    }, function (err) {
        alert('影像转换失败！')
    });


    //点击查询在线客户经理
    $('#managerList a').on('click', function () {
        showLoader("获取远程复核客户经理...");
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId//设备编号
            }]
        };
        ISysUserServiceManListFun(sendJson, function (msg) {
            ISysUserServiceManListComSucc(msg);
        }, function (err) {
            funFail(err);
        })
    })
    //点击继续 
    $('.personFace .previous:last').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        if ($(this).text() == '继续') {
            $.mobile.changePage('Finance-questionnaires.html', {reverse: true});
        } else {
            if ($('#managerList select').val() == '') {
                showMsg('请选择一个客户经理');
                return;
            }
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": financeJson.moduleId,//模块编号
                    "tranId.s": financeJson.tranId,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    "platGlobalSeq.s": financeJson.platGlobalSeq, //流水号
                    "topic.s": "N/A", //主题N/A
                    "code.s": "101", //指令101
                    "paramUrl.s": "abc", //参数地址
                    "days.s": "0", //有效天数
                    "appKey.s": "com.nqsky.bank.service", //appKey  com.nqsky.bank.service
                    "context.s": "您有一条远程复核业务需要办理",//推送内容
                    "userIds.s": $('#managerList select').val(),//用户ID  $('#xinka-managerList select').val()
                    "busiType.s": "01", //电子卡01
                    "cardResult.s": financeJson.cardResult,//联网核查对比
                    "chipResult.s": financeJson.chipResult//芯片对比
                }]
            };
            showLoader("正在等待" + $('#managerList option:selected').attr('realName') + "[手机:" + $('#managerList     option:selected').attr('cellPhone') + "]复核...");
            financeJson.telCheck = true;
            iissuesServiceFun(sendJson, function (msg) {
                iissuesServiceComSucc(msg, financeJson, 'Finance-questionnaires.html');
            }, function (err) {
                funFail(err);
            })
        }

    });
    //点击F放弃
    $('.personFace .previous:first').on('click', function () {
        financeJson.isCompress = false;
        $.mobile.changePage('Finance-customeP.html', {reverse: true});
    });
});

/*填写问卷界面*/
$(document).on('pageshow', '#finance-question', function () {
    if (financeJson.questCache) {
        questionToPage(financeJson.AssessQuestion);
        if(financeJson.qAnswer !=undefined && financeJson.qAnswer.length>0){   //反显问卷的答题
            $.each(financeJson.qAnswer,function (index, ele) {
                if(ele !='' && ele !=undefined &&ele != null){
                    // $('.dx_box').eq(index).find('li[riskOption ='+ele+']')
                    $('.dx_box').eq(index).find('li[riskOption ='+ele+']').parent().attr({
                            'isSelected': true,
                            'riskOption': $('.dx_box').eq(index).find('li[riskOption ='+ele+']').attr('riskOption')
                        });
                        if ($('[isSelected]').length == $('.dx_answer').length) {
                            $('.footter .previous:eq(1)').addClass('btn_next');
                        }
                    $('.dx_box').eq(index).find('li[riskOption ='+ele+']').children(".dx-yes").show().siblings(".dx-no").hide();
                    $('.dx_box').eq(index).find('li[riskOption ='+ele+']').siblings().children(".dx-no").show();
                    $('.dx_box').eq(index).find('li[riskOption ='+ele+']').siblings().children(".dx-yes").hide();
                }
            })
        }
    } else {
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
    }

    //上一步
    $('.footter .previous:eq(0)').on('click', function () {
        financeJson.qTitle = [];
        financeJson.qAnswer = [];
        $('.dx_box').each(function (index, ele) {
            financeJson.qTitle.push($(this).find('.dx_title').attr('questionNo'));
            financeJson.qAnswer.push($(this).find('.dx_answer').attr('riskOption'));
        });
        $.mobile.changePage('./Finance-customeP.html', {reverse: true});
    });
    //下一步
    $('.footter .previous:eq(1)').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        financeJson.qTitle = [];
        financeJson.qAnswer = [];
        $('.dx_box').each(function (index, ele) {
            financeJson.qTitle.push($(this).find('.dx_title').attr('questionNo'));
            financeJson.qAnswer.push($(this).find('.dx_answer').attr('riskOption'));
        });
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
    });
});

/*确认签名界面*/
$(document).on('pageshow', '#finance-confirm', function () {
    $('.info_box .info_name').html(custermerInfo.name);   //姓名
    $('.info_box .info_card').html(custermerInfo.cerNO);  //身份证
    $('.info_box_tw .msg_con').html(riskLevelOne[financeJson.riskLevel]);        //等级
    $('.info_box_tw .msg_foot span').html(dataYearMonthData(AddMonths(myTime.curDate(),financeJson.riskMonth)));//有效期

    $('.rw').on('click',function () {
        $.mobile.changePage('./Finance-questionnaires.html', {reverse: true})
    });
    //初始化签名栏
    signature.init({
        div: $('#qianM'), //签名容器
        finishBtn: $("#qianOK"), //完成签名按钮
        clearBtn: $("#clear-botton"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function (data) { //签名完成回调函数
            if ($('#ic_disagree').is(':hidden')) {
                $('#ic_agree').hide();
                $('#ic_disagree').show();
                $("#com-sign-over").remove();
                $('.footter .previous:eq(0)').removeClass('btn_next');
            } else {
                $('#ic_disagree').hide();
                $('#ic_agree').show();
                $('.box_con_r .qian-box').css('position', 'relative').append('<div id="com-sign-over" style="position:absolute; top:0; right:0;left:0;bottom:0"></div>');
                financeJson.data = data.replace('data:image/png;base64,', '');
                setTimeout(function () {
                    $('.footter .previous:eq(0)').addClass('btn_next');
                },50);
            }
        }
    });
    //下一步
    $('.footter .previous:eq(0)').on('click', function () {
        if (!($(this).hasClass('btn_next'))){
            showMsg('请确认签名!');
            return;
        }
        showLoader('客户风险等级提交中...');
        var sendJson = {
            "b":[{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": financeJson.moduleId, //模块编号
                "tranId.s": financeJson.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "CLIENT_NAME.s": custermerInfo.name,//客户姓名
                "DOCUMENT_TYPE.s":'0',//证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO//证件号码
            }]
        };
        getPlatGlobalSeqFinFun(sendJson,financeJson,function(){
            cacheAndImageAndSign(function(){    //影像压缩插库成功后发报文
                financeSubmit();
            });
        });
    });
});

/*完成界面*/
$(document).on('pageshow', '#finance-complete', function () {
    $('.name_cn').html(custermerInfo.name); // 姓名
    $('.zheng_num').html(custermerInfo.cerNO); // 身份证
    $('.ping_num').html(riskLevelOne[financeJson.riskLevel]); // 风险等级
    if(financeJson.pdfUrl != undefined){
        transformStringToImage(financeJson.pdfUrl,function(msg){
            $('.basic_erweima img').attr('src',msg);
        },function(err){
            alert(err+'生成二维码失败');
        })
    }
    //完成
    $('.footter .previous:eq(0)').on('click', function () {
        $.mobile.changePage('./Finance-reading.html', {reverse: true});
    });
});


/**
 *   卡账号查询
 * @param bussObj
 * @param preUrl
 * @param nextUrl
 */
function getDocLicenceListBankConF(bussObj, preUrl, nextUrl) {
    var queryAccountJson = {      //发送请求的参数
        "b": [{
            "deviceNo.s": commonJson.udId, //设备编号
            "moduleId.s": loan.moduleId, //模块编号
            "tranId.s": bussObj.tranId, //交易编号
            "orgId.s": commonJson.orgId,//机构号
            "operatorNo.s": commonJson.adminCount,//操作员
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "CLIENT_NO.s": bussObj.CLIENT_NO //客户类型 N组织 P个人
        }]
    };
    getDocLicenceListBankFun(queryAccountJson, function (msg) {
        var responseBody = responseBodySuccFormat(msg);
        if (responseBody[0].results == "00") {
            $.mobile.changePage(nextUrl, {reverse: true});
        } else if (responseBody[0].results == "08") {
            hideLoader();
            getDocLicenceListBankConF(bussObj);
        } else {
            showTags({
                'title': '提示',
                'content': responseBody[0].message,
                'ok': {
                    fun: function () {
                        $.mobile.changePage(preUrl, {reverse: true});
                    }
                }
            });
        }
    }, function (err) {
        funFail(err);
    })
}

function questionToPage(arr) {
    var textHtml = '';
    var ansImg = '<img src="../../images/diaocawenjuan-no.png" class="dx-no"/><img src="../../images/diaocawenjuan-yes.png" class="dx-yes"/>';
    $.each(arr,function (index, el) {
        if(index == 0) return ;
        var data = el.assessQuestionInquiryVO[0];
        if(data.RISK_OPTION == '0'){  //题目
            $('.dxwj').append('<div class="dx_box"><div class="dx_title" questionNo="'+data.QUESTION_NO+'">'+data.QUESTION_NO+'.'+data.SUBJECT+'</div><ul class="dx_answer"></ul></div>');
        }else{
            $('.dx_answer:last').append('<li riskOption = "'+data.RISK_OPTION+'"><span>'+data.RISK_OPTION+'.'+data.SUBJECT+'</span>'+ansImg+'</li>');
        }
    });
    $(".dx_answer>li").on("click", function () {
        if ($(this).children(".dx-yes").css("display") == "none") {
            $(this).parent().attr({
                'isSelected': true,
                'riskOption': $(this).attr('riskOption')
            });
            if ($('[isSelected]').length == $('.dx_answer').length) {
                $('.footter .previous:eq(1)').addClass('btn_next');
            }
            $(this).children(".dx-yes").show().siblings(".dx-no").hide();
            $(this).siblings().children(".dx-no").show();
            $(this).siblings().children(".dx-yes").hide();
        }
    });
}
function getPlatGlobalSeqFinFun(bodyJson,bussObj,nextFun) {
    showLoader('获取交易流水号中..');
    getPlatGlobalSeqFun(bodyJson, function (msg) {
        hideLoader();
        var responseBody = responseBodySuccFormat(msg);
        if(responseBody[0].results == '00') {
            bussObj.platGlobalSeq = responseBody[0].platGlobalSeq;//获取平台流水号
            nextFun();
        } else{
            showTags({
                'title': '提示',
                'content': '获取平台交易流水号超时!',
                'cancel': {
                    'title': '继续提交', //非必输  默认值：确认
                    'fun': function() { //非必输  如果输入则执行此函数
                        showLoader('获取交易流水号中..');
                        getPlatGlobalSeqFinFun(bodyJson,bussObj,nextFun);
                    }
                },
                'ok': {
                    'title': '放弃提交', //非必输  默认值：取消
                    'fun': function() { //非必输  如果输入则执行此函数
                        hideTags(); //关闭提示信息
                        hideLoader();
                    }
                }
            });
        }
    }, function (err) {
        hideLoader();
        showTags({
            'title': '提示',
            'content': '获取平台交易流水号超时!',
            'ok': {}
        });
    });
}