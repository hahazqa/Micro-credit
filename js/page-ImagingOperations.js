/**
 * 2016-3-28---ding
 */

/*业务选择*/
$(document).on("pageshow", '#yewuxuanze-one', function () {
    if (commonJson.offlineOnline != 'offline') { //连机模式
        getCurrentLocationCoordinateFun();
    }

    $(".zhuti_qiehuan>li").on("click", function () {//非个人、个人切换
        $(this).addClass("change_color").siblings("li").removeClass("change_color");
        var xuanzePH = $(".zhuti_qiehuan>li").index($(this));
        $(".neirong_qiehuan_ul").eq(xuanzePH).show().siblings(".neirong_qiehuan_ul").hide();
    });
    $(".kaihu_unit").on("click", function () {//点击开户弹窗
        showTags({
            'title': '提示',
            'content': '请准备好<span style="color:red; font-size:20px;">法定代表人</span>身份证件!',
            'ok': {
                'title': '放弃',
                'fun': function () {

                }
            },
            'cancel': {
                'title': '继续',
                'fun': function () {
                    ImagingOperaTions.BUSSINESS_TYPE = 'Y001';//业务类型=> 01-开户（单位）(Y001)/02-购买理财（单位）(Y002)等等。。。。
                    ImagingOperaTions.CLIENT_TYPE = 'N';//客户类型==>p个人／N单位
                    $.mobile.changePage('ImagingOperations-readingID.html', {reverse: true});
                }
            }
        });
    });
    $(".qita_unit").on("click", function () {//点击非个人其他弹窗
        ImagingOperaTions.BUSSINESS_TYPE = 'Y003';//业务类型=> 01-开户（单位）(Y001)/02-购买理财（单位）(Y002)等等。。。。
        ImagingOperaTions.CLIENT_TYPE = 'N';//客户类型==>p个人／N单位
        $.mobile.changePage('ImagingOperations-readingID.html', {reverse: true});
    });
    $(".kaihu_person").on("click", function () {//点击开户弹窗
        showTags({
            'title': '提示',
            'content': '请准备好<span style="color:red; font-size:20px;">开户人</span>身份证件!',
            'ok': {
                'title': '放弃',
                'fun': function () {

                }
            },
            'cancel': {
                'title': '继续',
                'fun': function () {
                    ImagingOperaTions.BUSSINESS_TYPE = 'Y004';//业务类型=> 01-开户（单位）(Y001)/02-购买理财（单位）(Y002)等等。。。。
                    ImagingOperaTions.CLIENT_TYPE = 'P';//客户类型==>p个人／N单位
                    $.mobile.changePage('ImagingOperations-readingID.html', {reverse: true});
                }


            }
        });
    });
    $(".agency_kaihu_person").on("click", function () {//点击代理开户弹窗
        showTags({
            'title': '提示',
            'content': '请准备好<span style="color:red; font-size:20px;">代理人</span>身份证件!',
            'ok': {
                'title': '放弃',
                'fun': function () {

                }
            },
            'cancel': {
                'title': '继续',
                'fun': function () {
                    ImagingOperaTions.BUSSINESS_TYPE = 'Y005';//业务类型=> 01-开户（单位）(Y001)/02-购买理财（单位）(Y002)等等。。。。
                    ImagingOperaTions.CLIENT_TYPE = 'P';//客户类型==>p个人／N单位
                    $.mobile.changePage('ImagingOperations-readingID.html', {reverse: true});
                }


            }
        });
    });
    $(".buy_licai_person").on("click", function () {//点击购买理财弹窗
        showTags({
            'title': '提示',
            'content': '请准备好<span style="color:red; font-size:20px;">客户</span>身份证件!',
            'ok': {
                'title': '放弃',
                'fun': function () {

                }
            },
            'cancel': {
                'title': '继续',
                'fun': function () {
                    ImagingOperaTions.BUSSINESS_TYPE = 'Y006';//业务类型=> 01-开户（单位）(Y001)/02-购买理财（单位）(Y002)等等。。。。
                    ImagingOperaTions.CLIENT_TYPE = 'P';//客户类型==>p个人／N单位
                    $.mobile.changePage('ImagingOperations-readingID.html', {reverse: true});
                }


            }
        });
    });
    $(".agency_licai_person").on("click", function () {//点击代理理财弹窗
        showTags({
            'title': '提示',
            'content': '请准备好<span style="color:red; font-size:20px;">代办人</span>身份证件!',
            'ok': {
                'title': '放弃',
                'fun': function () {

                }
            },
            'cancel': {
                'title': '继续',
                'fun': function () {
                    ImagingOperaTions.BUSSINESS_TYPE = 'Y009';//业务类型=> 01-开户（单位）(Y001)/02-购买理财（单位）(Y002)等等。。。。
                    ImagingOperaTions.CLIENT_TYPE = 'P';//客户类型==>p个人／N单位
                    $.mobile.changePage('ImagingOperations-readingID.html', {reverse: true});
                }


            }
        });
    });
    $(".buy_baoxian_person").on("click", function () {//点击购买保险弹窗
        showTags({
            'title': '提示',
            'content': '请准备好<span style="color:red; font-size:20px;">客户</span>身份证件!',
            'ok': {
                'title': '放弃',
                'fun': function () {

                }
            },
            'cancel': {
                'title': '继续',
                'fun': function () {
                    ImagingOperaTions.BUSSINESS_TYPE = 'Y007';//业务类型=> 01-开户（单位）(Y001)/02-购买理财（单位）(Y002)等等。。。。
                    ImagingOperaTions.CLIENT_TYPE = 'P';//客户类型==>p个人／N单位
                    $.mobile.changePage('ImagingOperations-readingID.html', {reverse: true});
                }


            }
        });
    });
    $(".qita_person").on("click", function () {//点击个人其他弹窗
        ImagingOperaTions.BUSSINESS_TYPE = 'Y008';//业务类型=> 01-开户（单位）(Y001)/02-购买理财（单位）(Y002)等等。。。。
        ImagingOperaTions.CLIENT_TYPE = 'P';//客户类型==>p个人／N单位
        $.mobile.changePage('ImagingOperations-readingID.html', {reverse: true});
    });
});
/*读取身份证*/
$(document).on("pageshow", '#ImagingOperations-readingID', function () {
    debitEnter.messageCache = false;//信息录用界面来判断是否下一步返回
    creditJson.isPrev.YXCJisFromPrev = false;//照片是否缓存返回继续办理初始化为否
    creditJson.isPrev.QTZJcanJump = false;//其他证件点击下一步核查身份证通过是否跳转
    citigoldJson.msgSureCache = false;//确认页面视频是否准备初始化为否
    citigoldJson.isCanClickNEXT.isVideo = false;//重新读取身份证后是确认页面的视频初始化为false；
    ImagingOperaTions.CLIENT_NO = '';//返回读取身份证界面清空客户号
    creditJson.storage.image = '';//身份证上照片
    ImagingOperaTions.imageNo = '';//影音编号
    creditJson.storage.faceRecogn = '';//人脸识别状态初始化
    ImagingOperaTions.AGENT_DOC_NO = '';//经办人证件号码
    ImagingOperaTions.AGENT_NAME = '';//经办人姓名
    ImagingOperaTions.CLIENT_NAME = '';//
    ImagingOperaTions.DOCUMENT_ID = '';
    ImagingOperaTions.qitaCanBack = false;//信息录入界面返回采集影像或其他采集影像
    ImagingOperaTions.T_adminNo = '';//脱机影音编号
    //调用刷身份证方法
    $(".footter .previous").on('click', function () {
        creditReadCard(function () {
            $.mobile.changePage('ImagingOperations-readID.html');
        }, function (err) {
            $.mobile.changePage('ImagingOperations-readID.html');

        });
    })
    //点击其他证件按钮
    $("#ImagingOperations-readingID .conter-con .picRe").on('click', function () {
        $.mobile.changePage('ImagingOperations-QitaZhengjiann.html');
    });
});
/*身份证读取成功*/
$(document).on("pageshow", '#ImagingOperations-readID', function () {
    if (creditJson.isReadCardSucc) { //读卡成功
        $("#ImagingOperations-readID .ziduan-value:eq(0)").text(custermerInfo.name);
        $("#ImagingOperations-readID .ziduan-value:eq(1)").text(custermerInfo.sex);
        $("#ImagingOperations-readID .ziduan-value:eq(2)").text(custermerInfo.nation);
        $("#ImagingOperations-readID .ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
        $("#ImagingOperations-readID .ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
        $("#ImagingOperations-readID .ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
        $("#ImagingOperations-readID .ziduan-value:eq(6)").text(custermerInfo.address);
        $("#ImagingOperations-readID .ziduan-value:eq(7)").text(custermerInfo.cerNO);
        $("#ImagingOperations-readID .ziduan-value:eq(8)").text(custermerInfo.issAuthority);
        $("#ImagingOperations-readID .ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
        $('#ImagingOperations-readID .sfz-img').attr('src', custermerInfo.image);

        creditJson.storage.image = custermerInfo.image;
        if (ImagingOperaTions.BUSSINESS_TYPE == 'Y005' || ImagingOperaTions.BUSSINESS_TYPE == 'Y009') {
            ImagingOperaTions.AGENT_DOC_TYPE = '0';//经办人证件类型
            ImagingOperaTions.AGENT_DOC_NO = custermerInfo.cerNO;//经办人证件号码
            ImagingOperaTions.AGENT_NAME = custermerInfo.name;//经办人姓名
        } else {
            ImagingOperaTions.DOCUMENT_TYPE = '0';
            ImagingOperaTions.CLIENT_NAME = custermerInfo.name;
            ImagingOperaTions.DOCUMENT_ID = custermerInfo.cerNO;
        }


        if (commonJson.offlineOnline == 'offline') { //脱机模式
            $('.footter .previous:eq(0)').addClass('btn_next');
            $('.footter .previous:eq(0)').addClass('back-1');
            $('.sh_loading_box_shadow').remove();
            $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
            $(".loading_box").html('');
            $('.footter .previous:eq(1)').addClass('btn_next');
        } else {//联机就联网核查
            $('#xk-read-pre').removeClass('btn_next');
            $('.sh_loading_box_shadow').remove();
            $('.header .head-left,.header .head-right').addClass('btn-cannt-click');
            $('.ui-page').append('<div class="sh_loading_box_shadow" style="position:absolute;right:0;top:0;left:0;bottom:0;z-index:24;background-color: rgba(0,0,0,.0);"></div>');
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": ImagingOperaTions.moduleId,//模块编号
                    "tranId.s": ImagingOperaTions.tranId,//交易编号
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
                $('#xk-read-pre').addClass('btn_next');
                $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
                $('.sh_loading_box_shadow').remove();
                imagingItizenCertificateIdenifySucc(msg);
            }, function (err) {
                $('#xk-read-pre').addClass('btn_next');
                $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
                $('.sh_loading_box_shadow').remove();
                $("#ImagingOperations-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
                hideLoader();
                funFail(err);
            })
        }
        $(".lianwanghecha-chongxin").on("click", function () {//重新联网核查
            $(".lianwanghecha-yichang").hide();
            $('.sh_loading_box_shadow').remove();
            $('.header .head-left,.header .head-right').addClass('btn-cannt-click');
            $("#ImagingOperations-readID .loading_box").html('<img class="img_loading" src="../../images/ic_load.gif" alt=""/><div class="read_loading">信息审核中…</div>');
            $('.ui-page').append('<div class="sh_loading_box_shadow" style="position:absolute;right:0;top:0;left:0;bottom:0;z-index:24;background-color: rgba(0,0,0,.0);"></div>');
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": ImagingOperaTions.moduleId,//模块编号
                    "tranId.s": ImagingOperaTions.tranId1,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    "DOCUMENT_TYPE.s": "0",//证件类型
                    "DOCUMENT_ID.s": ImagingOperaTions.DOCUMENT_ID,//身份证号码
                    "CLIENT_NAME.s": ImagingOperaTions.CLIENT_NAME,//被核对人姓名
                    "BUSSINESSCODE.s": "01",//业务总类
                    "BRANCH_ID.s": commonJson.orgId//机构号
                }]
            };
            //身份证联网核查
            icitizenCertificateIdenifyFun(sendJson, function (msg) {
                $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
                $('.sh_loading_box_shadow').remove();
                imagingItizenCertificateIdenifySucc(msg);
            }, function (err) {
                $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
                $('.sh_loading_box_shadow').remove();
                funFail(err);
            })

        });
        $(".lianwanghecha-jixu").on("click", function () {//继续业务办理
            lianwanghechaData.CheckResult = '09';
            $(".lianwanghecha-yichang").hide();
            $.mobile.changePage('ImagingOperations-customerP.html');
        });
        $(".lianwanghecha-tuichu").on("click", function () {//退出
            $.mobile.changePage('yewuxuanze-one.html', {transition: "slide"});
            $(".lianwanghecha-yichang").hide();
        });
    } else {
        $("#ImagingOperations-readID .pic_suc").text('身份证读取失败!')
        $("#ImagingOperations-readID .loading_box").html('');
    }
    //点击下一步
    $('#xk-read-next').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;

        $.mobile.changePage('ImagingOperations-customerP.html');

    });
    //点击上一步，跳转页面
    $('#xk-read-pre').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        $.mobile.changePage('ImagingOperations-readingID.html', {reverse: true});
    });
});
/*影像采集*/
var imagingImageAcquisition = {
    imgSrc: '', //记录照片路径,
    curParentObj: '', //记录要删除的对象
    delImg: function (curParentObj, imgSrc) { //删除照片
        creditJson.isPrev.LLDBisFromPrev = false;
        deletePhoto([imgSrc], function (msg) {
            curParentObj.find('.camera-pic').remove();
            curParentObj.find('.camera').show();
            curParentObj.find('.rephoto').html('必拍');
            $('.bigpic-review-box').animate({
                    opacity: '0'
                },
                200,
                function () {
                    $('.bigpic-review-box').hide()
                });
            if (curParentObj.find('.cameraMul').length > 0) { //如果是其他证明
                curParentObj.closest('.img_box').remove();
            }
            //监测下一步是否可点击
            var ind = 0;
            for (var i = 0; i < 3; i++) {
                if ($('#ImagingOperations-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 3) {
                        $('#ImagingOperations-customerP-next').addClass('btn_next');
                    } else {
                        $('#ImagingOperations-customerP-next').removeClass('btn_next');
                    }
                }
                ;
            }
        }, function (err) {

        })
    },
    getFace: function (curParentObj) {
        faceDistinguish('trans', function (msg) {
            creditJson.isPrev.LLDBisFromPrev = false;
            imagingImageAcquisition.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');

            //监测下一步是否可点击
            var ind = 0;
            for (var i = 0; i < 3; i++) {
                if ($('#ImagingOperations-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 3) {
                        $('#ImagingOperations-customerP-next').addClass('btn_next');
                    } else {
                        $('#ImagingOperations-customerP-next').removeClass('btn_next');
                    }
                }
                ;
            }
        }, function (err) {
            showMsg(err);
        })
    },
    getImg: function (curParentObj) { //拍照
        if ($('#ImagingOperations-customerP .cameraMul').length == 18) {
            $('#ImagingOperations-customerP .cameraMul').eq(17).parents(".img_box").remove();
            showTags({
                'title': '提示',
                'content': "拍摄照片已到最大限度[最大限度为20张]",
                'ok': {}
            });
            return;

        }
        Meap.media('camera', curParentObj.attr('picname'), function (msg) {
            creditJson.isPrev.LLDBisFromPrev = false;
            imagingImageAcquisition.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.find('.camera-pic').remove();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');
            var ele = $('.img_box:last').find('.rephoto').text();
            if (curParentObj.find('.cameraMul').length > 0 && ele != '选拍，可多张拍摄') { //如果是其他证明

                var htmltext = "";

                htmltext += '<div class="img_box" style="position: relative;">' +
                '<div class="customer customer_six" picName="qitazhengming">' +
                '<div class="rephoto">选拍，可多张拍摄</div>' +
                '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/>' +
                '</div>' +
                '<div class="img_notes">其他</div>';
                $('#ImagingOperations-customerP .img_content').append(htmltext).trigger("create");

            } else {

            }
            //监测下一步是否可点击
            var ind = 0;
            for (var i = 0; i < 3; i++) {
                if ($('#ImagingOperations-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 3) {
                        $('#ImagingOperations-customerP-next').addClass('btn_next');
                    } else {
                        $('#ImagingOperations-customerP-next').removeClass('btn_next');
                    }
                }
            }
        }, function (err) {
            showMsg(err);
        })
    },
    reGetImg: function (curParentObj, imgSrc) { //重拍
        if (curParentObj.parent().hasClass('get-face')) {
            faceDistinguish('trans', function (returnGetMsg) {
                creditJson.isPrev.LLDBisFromPrev = false;
                deletePhoto([imgSrc], function (returnDelMsg) {
                    imagingImageAcquisition.imgSrc = returnGetMsg;
                    curParentObj.find('.camera-pic').attr('src', returnGetMsg);
                    $('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
                }, function (err) {

                })
            }, function (err) {
                showMsg('重拍失败');
            })
        } else {
            Meap.media('camera', curParentObj.attr('picname'), function (returnGetMsg) {
                creditJson.isPrev.LLDBisFromPrev = false;
                imgSrc = curParentObj.find('.camera-pic').attr('src');
                deletePhoto([imgSrc], function (returnDelMsg) {
                    imagingImageAcquisition.imgSrc = returnGetMsg;
                    curParentObj.find('.camera-pic').attr('src', returnGetMsg);
                    $('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
                }, function (err) {
                })
            }, function (err) {
                showMsg('重拍失败');
            })
        }

    },
    reviewImg: function (imgSrc) { //拍照预览
        $('.bigpic-review').html('<img src=' + imgSrc + ' height="100%">');
        $('.bigpic-review-box').show().animate({
            opacity: '1'
        }, 200);
    },
    reviewImgClose: function () { //关闭拍照预览
        $('.bigpic-review-box').animate({
            opacity: '0'
        }, 200, function () {
            $('.bigpic-review-box').hide()
        });
    }
};
$(document).on("pageshow", '#ImagingOperations-customerP', function () {
    if (creditJson.isPrev.YXCJisFromPrev) { //从下一页返回继续办理跳转此页面
        $('.img_content .camera-pic').remove();
        var img_boxLength = creditJson.storage.picFileARR.length;
        $.each(creditJson.storage.picFileARR, function (index, el) {
            if (index < 3 && el) {
                el = MT_path + el.split("/")[el.split("/").length - 1];
                $('.img_box:eq(' + index + ') .customer').find('.camera-pic').remove();
                $('.img_box:eq(' + index + ') .customer').append('<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">');
                $('.img_box:eq(' + index + ') .rephoto').text('重拍');
                $('.img_box:eq(' + index + ') .camera').hide();
            } else {
                if (!el) return true;
                el = MT_path + el.split("/")[el.split("/").length - 1];
                var activeEn = creditJson.storage.picFileMsgType[index - 3];
                $('<div class="img_box" style="position: relative;">' +
                '<div class="customer customer_six" picname="' + activeEn + '">' +
                '<div class="rephoto">重拍</div>' +
                '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/ style ="display:none">' +
                '<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">' +
                '</div>' + '<div class="img_notes">其他</div>').insertBefore('.img_box:last');

            }
        });
        //监测下一步是否可点击
        var ind = 0;
        for (var i = 0; i < 3; i++) {
            if ($('#ImagingOperations-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                ind++;
                if (ind >= 3) {
                    $('#ImagingOperations-customerP-next').addClass('btn_next');
                } else {
                    $('#ImagingOperations-customerP-next').removeClass('btn_next');
                }
            }
        }
    }
    //预览大图 点击关闭
    $('.bigpic-review-close').click(function (event) {
        imagingImageAcquisition.reviewImgClose();
    });
    //预览大图 删除图片
    $('.bigpic-review-del').click(function (event) {
        imagingImageAcquisition.delImg(imagingImageAcquisition.curParentObj, imagingImageAcquisition.imgSrc);
    });
    //预览大图 重新拍照
    $('.bigpic-review-rephone').click(function (event) {
        imagingImageAcquisition.reGetImg(imagingImageAcquisition.curParentObj, imagingImageAcquisition.imgSrc);
    });
    $('#ImagingOperations-customerP .conter-con').on('click', '.customer', function (ev) {
        imagingImageAcquisition.curParentObj = $(this);
        imagingImageAcquisition.imgSrc = $(this).find('.camera-pic').attr('src');
        var oTarget = ev.target;
        if ($(this).find('.rephoto').html() == '重拍') { //重拍
            if ($(oTarget).hasClass('rephoto')) {
                imagingImageAcquisition.reGetImg(imagingImageAcquisition.curParentObj, imagingImageAcquisition.imgSrc);
            }
            if ($(oTarget).hasClass('camera-pic')) { //预览大图
                imagingImageAcquisition.imgSrc = $(oTarget).attr('src');
                imagingImageAcquisition.reviewImg($(oTarget).attr('src'));
            }
            return;
        }
        //拍照
        if (imagingImageAcquisition.curParentObj.parent().hasClass('get-face')) {
            imagingImageAcquisition.getFace(imagingImageAcquisition.curParentObj);
        } else {
            imagingImageAcquisition.getImg(imagingImageAcquisition.curParentObj);
        }

    });
    //点击上一步，跳转页面
    $('#ImagingOperations-customerP-pre').on('click', function () {
        creditJson.isPrev.YXCJisFromPrev = true;
        imagingCacheYXCJ("ImagingOperations-customerP");
        $.mobile.changePage('ImagingOperations-readingID.html', {
            reverse: true
        });
    });
    //点击下一步
    $('#ImagingOperations-customerP-next').on('click', function () {
        if (!$(this).hasClass('btn_next')) return;
        imagingCacheYXCJ("ImagingOperations-customerP");
        if (commonJson.offlineOnline == 'offline' || creditJson.isPrev.LLDBisFromPrev) { //脱机模式
            if (ImagingOperaTions.BUSSINESS_TYPE == 'Y001') {//非个人开户
                $.mobile.changePage('ImagingOperations-messageIn.html');
            } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y003') {//非个人其他
                $.mobile.changePage('ImagingOperations-qitaMessageIn.html');
            } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y004') {//个人开户
                $.mobile.changePage('ImagingOperations-personMessageIn.html');
            } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y005') {//代理开户
                $.mobile.changePage('ImagingOperations-personAgencyKaihuMessageIn.html');
            } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y006') {//购买理财(个人)
                $.mobile.changePage('ImagingOperations-personBuyLicaiMessageIn.html');
            } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y007') {//购买保险(个人)
                $.mobile.changePage('ImagingOperations-personBuyBaoxianMessageIn.html');
            } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y009') {//代买理财(个人)
                $.mobile.changePage('ImagingOperations-personAgencyLicaiMessageIn.html');
            } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y008') {//其他(个人)
                $.mobile.changePage('ImagingOperations-personQitaMessageIn.html');
            }
        } else {
            $.mobile.changePage('ImagingOperations-personFace.html');
        }
    });
});
/*人脸识别*/
$(document).on("pageshow", '#ImagingOperations-personFace', function () {
    creditJson.isPrev.LLDBisFromPrev = false; //如果点击了继续或者从信息录入页面返回 则下次不用进入两两对比页面 否则都是要进入两两对比
    $("#ImagingOperations-personFace .camera:eq(0)").attr('src', creditJson.storage.custFacePic);
    if (!creditJson.storage.image) {
        creditJson.storage.imageBase64 = ImagingOperaTions.base64Img.replace('data:image/png;base64,', '');
        $("#ImagingOperations-personFace .camera:eq(1)").attr('src', ImagingOperaTions.base64Img);
    } else {
        $("#ImagingOperations-personFace .camera:eq(1)").attr('src', MT_path + creditJson.storage.image.split("/")[creditJson.storage.image.split("/").length - 1]);
    }
    $("#ImagingOperations-personFace .camera:eq(2)").attr('src', creditJson.storage.custFacePic);
    if (lianwanghechaData.CheckResult == '09' || lianwanghechaData.CheckResult == '02') {
        $("#ImagingOperations-personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + creditJson.storage.checkPhoto);
    } else {
        $("#ImagingOperations-personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + creditJson.storage.checkPhoto);
    }
    //点击继续
    $('#ImagingOperations-personFace .previous:last').on('click', function () {
        if ($(this).hasClass('btn_next')) {
            if ($("#ImagingOperations-personFace .face-result:eq(0)").text() == '通过' && $("#ImagingOperations-personFace .face-result:eq(1)").text() == '通过') {
                creditJson.storage.faceRecogn = '1'; //自动通过
            } else if ($("#ImagingOperations-personFace .face-result:eq(0)").text() == '不通过' && $("#ImagingOperations-personFace .face-result:eq(1)").text() == '不通过') {
                creditJson.storage.faceRecogn = '2'; //自动不通过
            } else {
                creditJson.storage.faceRecogn = '5'; //手动通过
            }
            creditJson.isPrev.LLDBisFromPrev = true;
            if (ImagingOperaTions.BUSSINESS_TYPE == 'Y001') {//非个人开户
                $.mobile.changePage('ImagingOperations-messageIn.html');
            } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y003') {//非个人其他
                $.mobile.changePage('ImagingOperations-qitaMessageIn.html');
            } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y004') {//个人开户
                $.mobile.changePage('ImagingOperations-personMessageIn.html');
            } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y005') {//代理开户
                $.mobile.changePage('ImagingOperations-personAgencyKaihuMessageIn.html');
            } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y006') {//购买理财(个人)
                $.mobile.changePage('ImagingOperations-personBuyLicaiMessageIn.html');
            } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y007') {//购买保险(个人)
                $.mobile.changePage('ImagingOperations-personBuyBaoxianMessageIn.html');
            } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y009') {//代买理财(个人)
                $.mobile.changePage('ImagingOperations-personAgencyLicaiMessageIn.html');
            } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y008') {//其他(个人)
                $.mobile.changePage('ImagingOperations-personQitaMessageIn.html');
            }
        }
    });
    //点击F放弃
    $('#ImagingOperations-personFace .previous:first').on('click', function () {
        creditJson.storage.faceRecogn = '6'; //手动不通过
        creditJson.isPrev.YXCJisFromPrev = true;
        creditJson.isPrev.LLDBisFromPrev = false;
        $.mobile.changePage('ImagingOperations-customerP.html', {
            reverse: true
        });
    });
    showLoader("影像对比中...");
    transFormBase64(creditJson.storage.custFacePic, function (msg) { //面部图片转base64
        creditJson.storage.custFacePicBase64 = msg;
        transFormBase64(creditJson.storage.image, function (msg1) { //身份证图片转base64
            creditJson.storage.image && (creditJson.storage.imageBase64 = msg1);
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                    "workAddress.s": commonJson.workAddress, //工作地址
                    "orgId.s": commonJson.orgId, //机构号
                    "moduleId.s": ImagingOperaTions.moduleId, //模块编号
                    "tranId.s": ImagingOperaTions.tranId, //交易编号
                    "operatorNo.s": commonJson.adminCount, //操作员
                    "deviceNo.s": commonJson.udId, //设备编号
                    "OPERATOR_NO.s": commonJson.adminCount, //业务经办人工号
                    "TRANS_SCENE.s": "0002", //交易场景 电子卡0006
                    "COMPARE_TYPE.s": "2", //    比对类型1-客户经理比对，2-客户比对
                    "WS_TYPE.s": "2", // 终端类型1-PC，2-IOS，3-Android
                    "WSNO.s": commonJson.udId, //    终端号
                    "VERSION.s": "v1.1.4", //当前控件版本
                    "TRANS_CHANNEL.s": "301", //   渠道301
                    "ID_CARD.s": ImagingOperaTions.DOCUMENT_ID, // 身份证号码
                    "IMG_BASE.s": creditJson.storage.custFacePicBase64, //      现场照片
                    "CRYPT_TYPE.s": "0", //   图像是否经过加密0-未加密，1-加密方式一，2加密方式二
                    "ID_IMG_BASE.s": creditJson.storage.checkPhoto, //联网核查照片
                    "CARD_IMG_BASE.s": creditJson.storage.imageBase64, //  芯片照片
                    "BUSI_TYPE.s": "01" //  开户01

                }]
            };
            ifacelRecognitionSeFun(sendJson, function (msg) {
                ImagingFacelRecognitionServiceCreditSucc(msg);
            }, function (err) {
                $("#ImagingOperations-personFace .center-header").text('人脸识别失败！');
                $("#ImagingOperations-personFace .face-result:eq(0)").addClass('no-pass').text('未通过');
                $("#ImagingOperations-personFace .face-result:eq(1)").addClass('no-pass').text('未通过');
                $('#ImagingOperations-personFace .previous:last').addClass('btn_next');
                funFail(err);
            })

        }, function (err) {
            alert('影像转换失败！')
        })
    }, function (err) {
    })

});
/*个人开户信息录入*/
$(document).on("pageshow", '#ImagingOperations-personMessageIn', function () {
    $('#imaging-customerType').text(clientTypeImaging[ImagingOperaTions.CLIENT_TYPE]); //客户类型
    $('#imaging-cerType').text(certTypeImaging[ImagingOperaTions.DOCUMENT_TYPE]); //证件类型
    $('#imaging-businessType').text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]); //业务类型

    $('#imaging-name').text(ImagingOperaTions.CLIENT_NAME); //姓名
    $('#imaging-cerNo').text(ImagingOperaTions.DOCUMENT_ID); //证件号码
    if (commonJson.offlineOnline == 'offline') {//脱机影音编号
        $("#offline-show").show();
        $("#offline-show .input-test span").text(commonJson.adminCount);
    }
    if (debitEnter.messageCache) {
        $('#img-zhangkahao').val(ImagingOperaTions.ACCT_NO);//帐卡号
        $('#img_beizhu').val(ImagingOperaTions.REMARK);//备注
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            $("#offline-show .input-test .input-test-con").val(ImagingOperaTions.T_adminNo);
        }
    }
    $("#ImagingOperations-personMessageIn .selectCard").on('click', function () {
        if (commonJson.offlineOnline != 'offline') {
            imagingIcustomerInfoServiceFun();
        } else if (commonJson.offlineOnline == 'offline') {//脱机模式
            showTags({
                'title': '提示',
                'content': '脱机模式无法查询卡账号！',
                'ok': {
                    'title': '确认',
                    'fun': function () {

                    }
                }
            });

        }
    })
    $('#ImagingOperations-personMessageIn  .backContainer ul').delegate('li', 'click', function () {
        $(this).addClass('bgColor').siblings('li').removeClass('bgColor');
        ImagingOperaTions.ACCT_NO = $.trim($(this).find('span:only-child').text());
    })
    $('#contChoose').on('click', function () {
        if (!ImagingOperaTions.ACCT_NO) {
            showMsg('请先点选账卡号');
            return;
        }
        $('#img-zhangkahao').val(ImagingOperaTions.ACCT_NO);
        ImagingOperaTions.ACCT_NO = '';
        $('#ImagingOperations-personMessageIn .backContainer').hide();
    })
    $('#contClose').on('click', function () {
        $('#img-zhangkahao').text('');
        $('#ImagingOperations-personMessageIn .backContainer').hide();
    })

    $('#ImagingOperations_messageIn_pre').on('click', function () {
        ImagingOperaTions.ACCT_NO = $.trim($('#img-zhangkahao').val());//帐卡号
        ImagingOperaTions.REMARK = $.trim($('#img_beizhu').val());//备注
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
        }
        debitEnter.messageCache = true;
        creditJson.isPrev.YXCJisFromPrev = true;
        if (ImagingOperaTions.qitaCanBack) {
            $.mobile.changePage('ImagingOperations-customerPp.html', {reverse: true});
        } else {
            $.mobile.changePage('ImagingOperations-customerP.html', {reverse: true});
        }

    });

    //点击下一步
    $("#ImagingOperations_messageIn_next").on('click', function () {
        if ($("#img-zhangkahao").val() && !(/^\d{12}$|^\d{16}$/.test($("#img-zhangkahao").val()))) {
            showMsg('账卡号只能是12位或16位数字！');
            $("#img-zhangkahao").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        } else {
            $("#img-zhangkahao").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        ImagingOperaTions.ACCT_NO = $.trim($('#img-zhangkahao').val());//帐卡号
        ImagingOperaTions.PRODUCT_NAME = '';//产品名称
        ImagingOperaTions.PRODUCT_NO = '';//产品编号
        ImagingOperaTions.currency = '';//币种
        ImagingOperaTions.tranMoney = '';//金额
        ImagingOperaTions.AGENT_DOC_TYPE = '';//经办人证件类型
        ImagingOperaTions.AGENT_DOC_NO = '';//经办人证件号码
        ImagingOperaTions.AGENT_NAME = '';//经办人姓名
        ImagingOperaTions.CREDIT_CODE = '';//统一社会信用代码
        ImagingOperaTions.ORG_CODE = '';//组织机构代码
        ImagingOperaTions.LICENSE = '';//营业执照或其他批文号
        ImagingOperaTions.COMPNY_NAME = '';//公司名称
        ImagingOperaTions.REMARK = $.trim($('#img_beizhu').val());//备注
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
            ImagingOperaTions.OFF_IMAGE_NO = $.trim('T' + commonJson.adminCount + ImagingOperaTions.T_adminNo);
            if (!ImagingOperaTions.T_adminNo) {
                showMsg('脱机模式影像编号中序列号不能为空！');
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
                return;
            } else if (!(/^\d{3}$/.test(ImagingOperaTions.T_adminNo))) {

                showMsg('脱机影音编号中序列号应为3位数字！');
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
                return;
            }
        }
        debitEnter.messageCache = true;
        $.mobile.changePage('ImagingOperations-personConfirmation.html');
    })


});
/*个人代理开户信息录入*/
$(document).on("pageshow", '#ImagingOperations-personAgencyKaihuMessageIn', function () {
    $('#imaging-cerType').text(certTypeImaging[ImagingOperaTions.AGENT_DOC_TYPE]); //经办人证件类型
    $('#imaging-businessType').text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]); //业务类型
    $('#imaging-customerType').text(clientTypeImaging[ImagingOperaTions.CLIENT_TYPE]); //客户类型
    $('#imaging-name').text(ImagingOperaTions.AGENT_NAME); //经办人姓名
    $('#imaging-cerNo').text(ImagingOperaTions.AGENT_DOC_NO); //经办人证件号码
    if (commonJson.offlineOnline == 'offline') {//脱机影音编号
        $("#offline-show").show();
        $("#offline-show .input-test span").text(commonJson.adminCount);
    }
    if (debitEnter.messageCache) {
        $("#QitaZhengjiann_Leixing").val(ImagingOperaTions.DOCUMENT_TYPE).selectmenu('refresh'); //证件类型
        $("#depositorName").val(ImagingOperaTions.CLIENT_NAME);//姓名
        $("#depositorId").val(ImagingOperaTions.DOCUMENT_ID);//证件号码
        $('#img-zhangkahao').val(ImagingOperaTions.ACCT_NO);//帐卡号
        $('#img_beizhu').val(ImagingOperaTions.REMARK);//备注
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            $("#offline-show .input-test .input-test-con").val(ImagingOperaTions.T_adminNo);
        }
    }
    $("#ImagingOperations-personAgencyKaihuMessageIn .selectCard").on('click', function () {
        if (commonJson.offlineOnline != 'offline') { //脱机模式
            if (!$("#depositorId").val()) {
                showTags({
                    'title': '提示',
                    'content': '存款人证件号码不能为空！',
                    'ok': {
                        'title': '确认',
                        'fun': function () {

                        }
                    }
                });
                return;
            }
            ImagingOperaTions.DOCUMENT_TYPE = $.trim($("#QitaZhengjiann_Leixing").val()); //证件类型
            ImagingOperaTions.DOCUMENT_ID = $.trim($("#depositorId").val());//证件号码
            imagingIcustomerInfoServiceFun();

        } else if (commonJson.offlineOnline == 'offline') {
            showTags({
                'title': '提示',
                'content': '脱机模式无法查询卡账号！',
                'ok': {
                    'title': '确认',
                    'fun': function () {

                    }
                }
            });

        }
    })
    $('#ImagingOperations-personAgencyKaihuMessageIn  .backContainer ul').delegate('li', 'click', function () {
        $(this).addClass('bgColor').siblings('li').removeClass('bgColor');
        ImagingOperaTions.ACCT_NO = $.trim($(this).find('span:only-child').text());
    })
    $('#contChoose').on('click', function () {
        if (!ImagingOperaTions.ACCT_NO) {
            showMsg('请先点选账卡号');
            return;
        }
        $('#img-zhangkahao').val(ImagingOperaTions.ACCT_NO);
        ImagingOperaTions.ACCT_NO = '';
        $('#ImagingOperations-personAgencyKaihuMessageIn .backContainer').hide();
    })
    $('#contClose').on('click', function () {
        $('#img-zhangkahao').text('');
        $('#ImagingOperations-personAgencyKaihuMessageIn .backContainer').hide();
    })
    function ocrIdCardFun() {
        ocrIdCard('', function (msg) {
            var msg = msg.split('+');
            $("#depositorName").val($.trim(msg[0]));
            $("#depositorId").val($.trim(msg[1]));
        }, function (err) {

        })

    }

    $("#ImagingOperations-personAgencyKaihuMessageIn .OCRID_scan").on('click', function () {

        if ($("#QitaZhengjiann_Leixing").val() == 0) {
            ocrIdCardFun();
        } else {
            showTags({
                'title': '提示',
                'content': "OCR暂时只支持身份证",
                'ok': {}
            });
            return;
        }

    });
    debitEnter.messageCache = true;
    $('#ImagingOperations_messageIn_pre').on('click', function () {
        ImagingOperaTions.ACCT_NO = $.trim($('#img-zhangkahao').val());//帐卡号
        ImagingOperaTions.DOCUMENT_TYPE = $.trim($("#QitaZhengjiann_Leixing").val()); //证件类型
        ImagingOperaTions.CLIENT_NAME = $.trim($("#depositorName").val());//姓名
        ImagingOperaTions.DOCUMENT_ID = $.trim($("#depositorId").val());//证件号码
        ImagingOperaTions.REMARK = $.trim($('#img_beizhu').val());//备注
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
        }
        creditJson.isPrev.YXCJisFromPrev = true;
        if (ImagingOperaTions.qitaCanBack) {
            $.mobile.changePage('ImagingOperations-customerPp.html', {reverse: true});
        } else {
            $.mobile.changePage('ImagingOperations-customerP.html', {reverse: true});
        }
    });

    //点击下一步
    $("#ImagingOperations_messageIn_next").on('click', function () {
        var num = 0; //纪录为空或者格式不正确的个数
        if (!$("#depositorId").val()) {
            num++;
            $("#depositorId").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
        } else {
            $("#depositorId").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }

        if (!$("#depositorName").val()) {
            num++;
            $("#depositorName").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
        } else {
            $("#depositorName").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            if (!$("#offline-show .input-test .input-test-con").val()) {
                num++;
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
            } else {
                $('#offline-show .fm-item').removeClass('fm-item-error'); //错误字段取消点亮
            }
        }
        if (num > 0) {
            showMsg('必填项不能为空');
            return;
        }
        if ($("#img-zhangkahao").val() && !(/^\d{12}$|^\d{16}$/.test($("#img-zhangkahao").val()))) {
            showMsg('账卡号只能是12位或16位数字！');
            $("#img-zhangkahao").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        } else {
            $("#img-zhangkahao").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (!fmReg.qitaCerNo.test($.trim($("#depositorId").val()))) {
            showMsg(fmRegMsg.qitaCerNo);
            $("#depositorId").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        }
        ImagingOperaTions.PRODUCT_NAME = '';//产品名称
        ImagingOperaTions.PRODUCT_NO = '';//产品编号

        ImagingOperaTions.ACCT_NO = $.trim($('#img-zhangkahao').val());//帐卡号
        ImagingOperaTions.currency = '';//币种
        ImagingOperaTions.tranMoney = '';//金额
        ImagingOperaTions.DOCUMENT_TYPE = $.trim($("#QitaZhengjiann_Leixing").val()); //证件类型
        ImagingOperaTions.CLIENT_NAME = $.trim($("#depositorName").val());//姓名
        ImagingOperaTions.DOCUMENT_ID = $.trim($("#depositorId").val());//证件号码
        ImagingOperaTions.CREDIT_CODE = '';//统一社会信用代码
        ImagingOperaTions.ORG_CODE = '';//组织机构代码
        ImagingOperaTions.LICENSE = '';//营业执照或其他批文号
        ImagingOperaTions.COMPNY_NAME = '';//公司名称
        ImagingOperaTions.REMARK = $.trim($('#img_beizhu').val());//备注
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
            ImagingOperaTions.OFF_IMAGE_NO = $.trim('T' + commonJson.adminCount + ImagingOperaTions.T_adminNo);

            if (!(/^\d{3}$/.test(ImagingOperaTions.T_adminNo))) {
                showMsg('脱机影音编号中序列号应为3位数字！');
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
                return;
            }
        }

        $.mobile.changePage('ImagingOperations-personAgencyKaihuConfirmation.html');
    })

});
/*个人购买理财信息录入*/
$(document).on("pageshow", '#ImagingOperations-personBuyLicaiMessageIn', function () {
    $('#imaging-customerType').text(clientTypeImaging[ImagingOperaTions.CLIENT_TYPE]); //客户类型
    $('#imaging-cerType').text(certTypeImaging[ImagingOperaTions.DOCUMENT_TYPE]); //证件类型
    $('#imaging-businessType').text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]); //业务类型

    $('#imaging-name').text(ImagingOperaTions.CLIENT_NAME); //姓名
    $('#imaging-cerNo').text(ImagingOperaTions.DOCUMENT_ID); //证件号码
    if (commonJson.offlineOnline == 'offline') {//脱机影音编号
        $("#offline-show").show();
        $("#offline-show .input-test span").text(commonJson.adminCount);
    }
    if (debitEnter.messageCache) {
        $('#img-zhangkahao').val(ImagingOperaTions.ACCT_NO);//帐卡号
        $('#img_beizhu').val(ImagingOperaTions.REMARK);//备注
        $('#productNo').val(ImagingOperaTions.PRODUCT_NO);//产品编号
        $('#productName').val(ImagingOperaTions.PRODUCT_NAME);//产品名称
        $('#currency').val(ImagingOperaTions.currency).selectmenu('refresh');//币种
        $('#tranMoney').val(ImagingOperaTions.tranMoney);//金额
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            $("#offline-show .input-test .input-test-con").val(ImagingOperaTions.T_adminNo);
        }
    }
    $("#ImagingOperations-personBuyLicaiMessageIn .selectCard").on('click', function () {
        if (commonJson.offlineOnline != 'offline') { //脱机模式
            imagingIcustomerInfoServiceFun();

        } else if (commonJson.offlineOnline == 'offline') {
            showTags({
                'title': '提示',
                'content': '脱机模式无法查询卡账号！',
                'ok': {
                    'title': '确认',
                    'fun': function () {

                    }
                }
            });

        }
    })
    $('#ImagingOperations-personBuyLicaiMessageIn  .backContainer ul').delegate('li', 'click', function () {
        $(this).addClass('bgColor').siblings('li').removeClass('bgColor');
        ImagingOperaTions.ACCT_NO = $.trim($(this).find('span:only-child').text());
    })
    $('#contChoose').on('click', function () {
        if (!ImagingOperaTions.ACCT_NO) {
            showMsg('请先点选账卡号');
            return;
        }
        $('#img-zhangkahao').val(ImagingOperaTions.ACCT_NO);
        ImagingOperaTions.ACCT_NO = '';
        $('#ImagingOperations-personBuyLicaiMessageIn .backContainer').hide();
    })
    $('#contClose').on('click', function () {
        $('#img-zhangkahao').text('');
        $('#ImagingOperations-personBuyLicaiMessageIn .backContainer').hide();
    })
    $('#ImagingOperations_messageIn_pre').on('click', function () {
        ImagingOperaTions.ACCT_NO = $.trim($('#img-zhangkahao').val());//帐卡号
        ImagingOperaTions.currency = $.trim($('#currency').val());//币种
        ImagingOperaTions.tranMoney = $.trim($('#tranMoney').val());//金额
        ImagingOperaTions.PRODUCT_NO = $.trim($('#productNo').val());//产品编号
        ImagingOperaTions.PRODUCT_NAME = $.trim($('#productName').val());//产品名称
        ImagingOperaTions.REMARK = $.trim($('#img_beizhu').val());//备注
        debitEnter.messageCache = true;
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
        }
        creditJson.isPrev.YXCJisFromPrev = true;
        if (ImagingOperaTions.qitaCanBack) {
            $.mobile.changePage('ImagingOperations-customerPp.html', {reverse: true});
        } else {
            $.mobile.changePage('ImagingOperations-customerP.html', {reverse: true});
        }
    });
    $('#tranMoney').on('tap', function () {
        var _val = $(this).val();
        $(this).val(rmoney(_val))
    })
    $('#tranMoney').on('blur', function () {
        var _val = $(this).val().replace(/[^0-9\.]/ig, "");
        $(this).val(fmoney(_val))
    })
    //点击下一步
    $("#ImagingOperations_messageIn_next").on('click', function () {
        var num = 0; //纪录为空或者格式不正确的个数
        if (!$('#productName').val()) {
            num++;
            $("#productName").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
        } else {
            $("#productName").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (!$('#productNo').val()) {
            num++;
            $("#productNo").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
        } else {
            $("#productNo").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (!$('#img-zhangkahao').val()) {
            num++;
            $("#img-zhangkahao").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
        } else {
            $("#img-zhangkahao").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (!$('#tranMoney').val()) {
            num++;
            $('#tranMoney').closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
        } else {
            $("#tranMoney").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            if (!$("#offline-show .input-test .input-test-con").val()) {
                num++;
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
            } else {
                $('#offline-show .fm-item').removeClass('fm-item-error'); //错误字段取消点亮
            }
        }
        if (num > 0) {
            showMsg('必填项不能为空');
            return;
        }
        if ($("#img-zhangkahao").val() && !(/^\d{12}$|^\d{16}$/.test($("#img-zhangkahao").val()))) {
            showMsg('账卡号只能是12位或16位数字！');
            $("#img-zhangkahao").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        } else {
            $("#img-zhangkahao").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (rmoney($('#tranMoney').val()).toString().length > 15) {
            showMsg('金额长度包含小数点不能超过15位！');
            $('#tranMoney').closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        }
        ImagingOperaTions.ACCT_NO = $.trim($('#img-zhangkahao').val());//帐卡号
        ImagingOperaTions.currency = $.trim($('#currency').val());//币种
        ImagingOperaTions.tranMoney = $('#tranMoney').val();//金额
        ImagingOperaTions.AGENT_DOC_TYPE = '';//经办人证件类型
        ImagingOperaTions.AGENT_DOC_NO = '';//经办人证件号码
        ImagingOperaTions.AGENT_NAME = '';//经办人姓名
        ImagingOperaTions.CREDIT_CODE = '';//统一社会信用代码
        ImagingOperaTions.ORG_CODE = '';//组织机构代码
        ImagingOperaTions.LICENSE = '';//营业执照或其他批文号
        ImagingOperaTions.COMPNY_NAME = '';//公司名称
        ImagingOperaTions.PRODUCT_NO = $.trim($('#productNo').val());//产品编号
        ImagingOperaTions.PRODUCT_NAME = $.trim($('#productName').val());//产品名称
        ImagingOperaTions.REMARK = $.trim($('#img_beizhu').val());//备注
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
            ImagingOperaTions.OFF_IMAGE_NO = $.trim('T' + commonJson.adminCount + ImagingOperaTions.T_adminNo);
            if (!(/^\d{3}$/.test(ImagingOperaTions.T_adminNo))) {
                showMsg('脱机影音编号中序列号应为3位数字！');
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
                return;
            }
        }
        debitEnter.messageCache = true;
        $.mobile.changePage('ImagingOperations-personBuyLicaiConfirmation.html');
    })

});
/*个人购买保险信息录入*/
$(document).on("pageshow", '#ImagingOperations-personBuyBaoxianMessageIn', function () {
    $('#imaging-customerType').text(clientTypeImaging[ImagingOperaTions.CLIENT_TYPE]); //客户类型
    $('#imaging-cerType').text(certTypeImaging[ImagingOperaTions.DOCUMENT_TYPE]); //证件类型
    $('#imaging-businessType').text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]); //业务类型

    $('#imaging-name').text(ImagingOperaTions.CLIENT_NAME); //姓名
    $('#imaging-cerNo').text(ImagingOperaTions.DOCUMENT_ID); //证件号码
    if (commonJson.offlineOnline == 'offline') {//脱机影音编号
        $("#offline-show").show();
        $("#offline-show .input-test span").text(commonJson.adminCount);
    }
    if (debitEnter.messageCache) {
        //$('#img-zhangkahao').val(ImagingOperaTions.ACCT_NO);//帐卡号

        $('#productName').val(ImagingOperaTions.PRODUCT_NAME);//产品名称
        $('#tranMoney').val(ImagingOperaTions.tranMoney);//首期保费
        $('#img_beizhu').val(ImagingOperaTions.REMARK);//备注
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            $("#offline-show .input-test .input-test-con").val(ImagingOperaTions.T_adminNo);
        }
    }
    debitEnter.messageCache = true;
    $('#ImagingOperations_messageIn_pre').on('click', function () {
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
        }
        ImagingOperaTions.PRODUCT_NAME = $.trim($('#productName').val());//产品名称
        ImagingOperaTions.tranMoney = $.trim($('#tranMoney').val());//金额
        ImagingOperaTions.REMARK = $.trim($('#img_beizhu').val());//备注
        creditJson.isPrev.YXCJisFromPrev = true;
        if (ImagingOperaTions.qitaCanBack) {
            $.mobile.changePage('ImagingOperations-customerPp.html', {reverse: true});
        } else {
            $.mobile.changePage('ImagingOperations-customerP.html', {reverse: true});
        }
    });
    $('#tranMoney').on('tap', function () {
        var _val = $(this).val();
        $(this).val(rmoney(_val))
    })
    $('#tranMoney').on('blur', function () {
        var _val = $(this).val().replace(/[^0-9\.]/ig, "");
        $(this).val(fmoney(_val))
    })
    //点击下一步
    $("#ImagingOperations_messageIn_next").on('click', function () {
        var num = 0; //纪录为空或者格式不正确的个数
        if (!$('#productName').val()) {
            num++;
            $("#productName").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
        } else {
            $("#productName").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (!$('#tranMoney').val()) {
            num++;
            $('#tranMoney').closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
        } else {
            $("#tranMoney").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            if (!$("#offline-show .input-test .input-test-con").val()) {
                num++;
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
            } else {
                $('#offline-show .fm-item').removeClass('fm-item-error'); //错误字段取消点亮
            }
        }
        if (num > 0) {
            showMsg('必填项不能为空');
            return;
        }
        if (rmoney($('#tranMoney').val()).toString().length > 15) {
            showMsg('金额长度包含小数点不能超过15位！');
            $('#tranMoney').closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        }
        ImagingOperaTions.PRODUCT_NAME = $.trim($('#productName').val());//产品名称
        ImagingOperaTions.PRODUCT_NO = '';//产品编号
        ImagingOperaTions.ACCT_NO = '';//帐卡号
        ImagingOperaTions.currency = '';//币种
        ImagingOperaTions.tranMoney = $('#tranMoney').val();//金额
        ImagingOperaTions.AGENT_DOC_TYPE = '';//经办人证件类型
        ImagingOperaTions.AGENT_DOC_NO = '';//经办人证件号码
        ImagingOperaTions.AGENT_NAME = '';//经办人姓名
        ImagingOperaTions.CREDIT_CODE = '';//统一社会信用代码
        ImagingOperaTions.ORG_CODE = '';//组织机构代码
        ImagingOperaTions.LICENSE = '';//营业执照或其他批文号
        ImagingOperaTions.COMPNY_NAME = '';//公司名称
        ImagingOperaTions.REMARK = $.trim($('#img_beizhu').val());//备注
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
            ImagingOperaTions.OFF_IMAGE_NO = $.trim('T' + commonJson.adminCount + ImagingOperaTions.T_adminNo);
            if (!(/^\d{3}$/.test(ImagingOperaTions.T_adminNo))) {
                showMsg('脱机影音编号中序列号应为3位数字！');
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
                return;
            }
        }

        $.mobile.changePage('ImagingOperations-personBuyBaoxianConfirmation.html');
    })

});
/*个人代买理财信息录入*/
$(document).on("pageshow", '#ImagingOperations-personAgencyLicaiMessageIn', function () {
    $('#imaging-cerType').text(certTypeImaging[ImagingOperaTions.AGENT_DOC_TYPE]); //经办人证件类型
    $('#imaging-businessType').text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]); //业务类型
    $('#imaging-customerType').text(clientTypeImaging[ImagingOperaTions.CLIENT_TYPE]); //客户类型
    $('#imaging-name').text(ImagingOperaTions.AGENT_NAME); //经办人姓名
    $('#imaging-cerNo').text(ImagingOperaTions.AGENT_DOC_NO); //经办人证件号码
    if (commonJson.offlineOnline == 'offline') {//脱机影音编号
        $("#offline-show").show();
        $("#offline-show .input-test span").text(commonJson.adminCount);
    }
    if (debitEnter.messageCache) {
        $("#QitaZhengjiann_Leixing").val(ImagingOperaTions.DOCUMENT_TYPE).selectmenu('refresh'); //证件类型
        $("#depositorName").val(ImagingOperaTions.CLIENT_NAME);//姓名
        $("#depositorId").val(ImagingOperaTions.DOCUMENT_ID);//证件号码
        $('#img-zhangkahao').val(ImagingOperaTions.ACCT_NO);//帐卡号
        $('#img_beizhu').val(ImagingOperaTions.REMARK);//备注
        $('#productNo').val(ImagingOperaTions.PRODUCT_NO);//产品编号
        $('#productName').val(ImagingOperaTions.PRODUCT_NAME);//产品名称
        $('#currency').val(ImagingOperaTions.currency).selectmenu('refresh');//币种
        $('#tranMoney').val(ImagingOperaTions.tranMoney);//金额
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            $("#offline-show .input-test .input-test-con").val(ImagingOperaTions.T_adminNo);
        }
    }
    $("#ImagingOperations-personAgencyLicaiMessageIn .selectCard").on('click', function () {
        if (commonJson.offlineOnline != 'offline') { //脱机模式
            if (!$("#depositorId").val()) {
                showTags({
                    'title': '提示',
                    'content': '存款人证件号码不能为空！',
                    'ok': {
                        'title': '确认',
                        'fun': function () {

                        }
                    }
                });
                return;
            }
            ImagingOperaTions.DOCUMENT_TYPE = $.trim($("#QitaZhengjiann_Leixing").val()); //证件类型
            ImagingOperaTions.DOCUMENT_ID = $.trim($("#depositorId").val());//证件号码
            imagingIcustomerInfoServiceFun();

        } else if (commonJson.offlineOnline == 'offline') {
            showTags({
                'title': '提示',
                'content': '脱机模式无法查询卡账号！',
                'ok': {
                    'title': '确认',
                    'fun': function () {

                    }
                }
            });

        }
    })
    $('#ImagingOperations-personAgencyLicaiMessageIn  .backContainer ul').delegate('li', 'click', function () {
        $(this).addClass('bgColor').siblings('li').removeClass('bgColor');
        ImagingOperaTions.ACCT_NO = $.trim($(this).find('span:only-child').text());
    })
    $('#contChoose').on('click', function () {
        if (!ImagingOperaTions.ACCT_NO) {
            showMsg('请先点选账卡号');
            return;
        }
        $('#img-zhangkahao').val(ImagingOperaTions.ACCT_NO);
        ImagingOperaTions.ACCT_NO = '';
        $('#ImagingOperations-personAgencyLicaiMessageIn .backContainer').hide();
    })
    $('#contClose').on('click', function () {
        $('#img-zhangkahao').text('');
        $('#ImagingOperations-personAgencyLicaiMessageIn .backContainer').hide();
    })
    function ocrIdCardFun() {
        ocrIdCard('', function (msg) {
            var msg = msg.split('+');
            $("#depositorName").val($.trim(msg[0]));
            $("#depositorId").val($.trim(msg[1]));
        }, function (err) {

        })

    }

    $("#ImagingOperations-personAgencyLicaiMessageIn .OCRID_scan").on('click', function () {

        if ($("#QitaZhengjiann_Leixing").val() == 0) {
            ocrIdCardFun();
        } else {
            showTags({
                'title': '提示',
                'content': "OCR暂时只支持身份证",
                'ok': {}
            });
            return;
        }

    });
    $('#tranMoney').on('tap', function () {
        var _val = $(this).val();
        $(this).val(rmoney(_val))
    })
    $('#tranMoney').on('blur', function () {
        var _val = $(this).val().replace(/[^0-9\.]/ig, "");
        $(this).val(fmoney(_val))
    })
    debitEnter.messageCache = true;
    $('#ImagingOperations_messageIn_pre').on('click', function () {
        ImagingOperaTions.PRODUCT_NO = $.trim($('#productNo').val());//产品编号
        ImagingOperaTions.PRODUCT_NAME = $.trim($('#productName').val());//产品名称
        ImagingOperaTions.ACCT_NO = $.trim($('#img-zhangkahao').val());//帐卡号
        ImagingOperaTions.currency = $.trim($('#currency').val());//币种
        ImagingOperaTions.tranMoney = $.trim($('#tranMoney').val());//金额
        ImagingOperaTions.DOCUMENT_TYPE = $.trim($("#QitaZhengjiann_Leixing").val()); //证件类型
        ImagingOperaTions.CLIENT_NAME = $.trim($("#depositorName").val());//姓名
        ImagingOperaTions.DOCUMENT_ID = $.trim($("#depositorId").val());//证件号码
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
        }
        creditJson.isPrev.YXCJisFromPrev = true;
        if (ImagingOperaTions.qitaCanBack) {
            $.mobile.changePage('ImagingOperations-customerPp.html', {reverse: true});
        } else {
            $.mobile.changePage('ImagingOperations-customerP.html', {reverse: true});
        }
    });

    //点击下一步
    $("#ImagingOperations_messageIn_next").on('click', function () {
        var num = 0; //纪录为空或者格式不正确的个数
        if (!$("#depositorId").val()) {
            num++;
            $("#depositorId").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
        } else {
            $("#depositorId").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }

        if (!$("#depositorName").val()) {
            num++;
            $("#depositorName").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
        } else {
            $("#depositorName").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (!$('#productName').val()) {
            num++;
            $("#productName").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
        } else {
            $("#productName").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (!$('#productNo').val()) {
            num++;
            $("#productNo").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
        } else {
            $("#productNo").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (!$('#img-zhangkahao').val()) {
            num++;
            $("#img-zhangkahao").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
        } else {
            $("#img-zhangkahao").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (!$('#tranMoney').val()) {
            num++;
            $('#tranMoney').closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
        } else {
            $("#tranMoney").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            if (!$("#offline-show .input-test .input-test-con").val()) {
                num++;
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
            } else {
                $('#offline-show .fm-item').removeClass('fm-item-error'); //错误字段取消点亮
            }
        }
        if (num > 0) {
            showMsg('必填项不能为空');
            return;
        }
        if ($("#img-zhangkahao").val() && !(/^\d{12}$|^\d{16}$/.test($("#img-zhangkahao").val()))) {
            showMsg('账卡号只能是12位或16位数字！');
            $("#img-zhangkahao").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        } else {
            $("#img-zhangkahao").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        if (rmoney($('#tranMoney').val()).toString().length > 15) {
            showMsg('金额长度包含小数点不能超过15位！');
            $('#tranMoney').closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        }
        if (!fmReg.qitaCerNo.test($.trim($("#depositorId").val()))) {
            showMsg(fmRegMsg.qitaCerNo);
            $("#depositorId").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        }


        ImagingOperaTions.PRODUCT_NO = $.trim($('#productNo').val());//产品编号
        ImagingOperaTions.PRODUCT_NAME = $.trim($('#productName').val());//产品名称
        ImagingOperaTions.ACCT_NO = $.trim($('#img-zhangkahao').val());//帐卡号
        ImagingOperaTions.currency = $.trim($('#currency').val());//币种
        //ImagingOperaTions.tranMoney = $.trim($('#tranMoney').val());//金额
        ImagingOperaTions.tranMoney = $('#tranMoney').val();//金额
        ImagingOperaTions.DOCUMENT_TYPE = $.trim($("#QitaZhengjiann_Leixing").val()); //证件类型
        ImagingOperaTions.CLIENT_NAME = $.trim($("#depositorName").val());//姓名
        ImagingOperaTions.DOCUMENT_ID = $.trim($("#depositorId").val());//证件号码
        ImagingOperaTions.CREDIT_CODE = '';//统一社会信用代码
        ImagingOperaTions.ORG_CODE = '';//组织机构代码
        ImagingOperaTions.LICENSE = '';//营业执照或其他批文号
        ImagingOperaTions.COMPNY_NAME = '';//公司名称
        ImagingOperaTions.REMARK = $.trim($('#img_beizhu').val());//备注
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
            ImagingOperaTions.OFF_IMAGE_NO = $.trim('T' + commonJson.adminCount + ImagingOperaTions.T_adminNo);
            if (!(/^\d{3}$/.test(ImagingOperaTions.T_adminNo))) {
                showMsg('脱机影音编号中序列号应为3位数字！');
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
                return;
            }
        }

        $.mobile.changePage('ImagingOperations-personAgencyLicaiConfirmation.html');
    })


});

/*个人其他信息录入*/
$(document).on("pageshow", '#ImagingOperations-personQitaMessageIn', function () {
    $('#imaging-customerType').text(clientTypeImaging[ImagingOperaTions.CLIENT_TYPE]); //客户类型
    $('#imaging-cerType').text(certTypeImaging[ImagingOperaTions.DOCUMENT_TYPE]); //证件类型
    $('#imaging-businessType').text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]); //业务类型

    $('#imaging-name').text(ImagingOperaTions.CLIENT_NAME); //姓名
    $('#imaging-cerNo').text(ImagingOperaTions.DOCUMENT_ID); //证件号码
    if (commonJson.offlineOnline == 'offline') {//脱机影音编号
        $("#offline-show").show();
        $("#offline-show .input-test span").text(commonJson.adminCount);
    }
    if (debitEnter.messageCache) {
        $('#currency').val(ImagingOperaTions.currency).selectmenu('refresh');//币种
        $('#tranMoney').val(ImagingOperaTions.tranMoney);//金额
        $('#img-zhangkahao').val(ImagingOperaTions.ACCT_NO);//帐卡号
        $('#img_beizhu').val(ImagingOperaTions.REMARK);//备注
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            $("#offline-show .input-test .input-test-con").val(ImagingOperaTions.T_adminNo);
        }
    }
    $("#ImagingOperations-personQitaMessageIn .selectCard").on('click', function () {
        if (commonJson.offlineOnline != 'offline') { //脱机模式
            imagingIcustomerInfoServiceFun();

        } else if (commonJson.offlineOnline == 'offline') {
            showTags({
                'title': '提示',
                'content': '脱机模式无法查询卡账号！',
                'ok': {
                    'title': '确认',
                    'fun': function () {

                    }
                }
            });

        }
    });
    $('#ImagingOperations-personQitaMessageIn  .backContainer ul').delegate('li', 'click', function () {
        $(this).addClass('bgColor').siblings('li').removeClass('bgColor');
        ImagingOperaTions.ACCT_NO = $.trim($(this).find('span:only-child').text());
    });
    $('#contChoose').on('click', function () {
        if (!ImagingOperaTions.ACCT_NO) {
            showMsg('请先点选账卡号');
            return;
        }
        $('#img-zhangkahao').val(ImagingOperaTions.ACCT_NO);
        ImagingOperaTions.ACCT_NO = '';
        $('#ImagingOperations-personQitaMessageIn .backContainer').hide();
    });
    $('#contClose').on('click', function () {
        $('#img-zhangkahao').text('');
        $('#ImagingOperations-personQitaMessageIn .backContainer').hide();
    });
    $('#tranMoney').on('tap', function () {
        var _val = $(this).val();
        $(this).val(rmoney(_val))
    });
    $('#tranMoney').on('blur', function () {
        var _val = $(this).val().replace(/[^0-9\.]/ig, "");
        $(this).val(fmoney(_val))
    });
    $('#ImagingOperations_messageIn_pre').on('click', function () {
        ImagingOperaTions.ACCT_NO = $.trim($('#img-zhangkahao').val());//帐卡号
        ImagingOperaTions.currency = $.trim($('#currency').val());//币种
        ImagingOperaTions.tranMoney = $.trim($('#tranMoney').val());//金额
        ImagingOperaTions.REMARK = $.trim($('#img_beizhu').val());//备注
        debitEnter.messageCache = true;
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
        }
        creditJson.isPrev.YXCJisFromPrev = true;
        if (ImagingOperaTions.qitaCanBack) {
            $.mobile.changePage('ImagingOperations-customerPp.html', {reverse: true});
        } else {
            $.mobile.changePage('ImagingOperations-customerP.html', {reverse: true});
        }
    });

    //点击下一步
    $("#ImagingOperations_messageIn_next").on('click', function () {
        if ($("#img-zhangkahao").val() && !(/^\d{12}$|^\d{16}$/.test($("#img-zhangkahao").val()))) {
            showMsg('账卡号只能是12位或16位数字！');
            $("#img-zhangkahao").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        } else {
            $("#img-zhangkahao").closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
        }
        ImagingOperaTions.ACCT_NO = $.trim($('#img-zhangkahao').val());//帐卡号
        ImagingOperaTions.PRODUCT_NAME = '';//产品名称
        ImagingOperaTions.PRODUCT_NO = '';//产品编号
        ImagingOperaTions.currency = $.trim($('#currency').val());//币种
        ImagingOperaTions.tranMoney = $.trim($('#tranMoney').val());//金额
        //ImagingOperaTions.tranMoney = $.trim($('#tranMoney').val());//金额
        ImagingOperaTions.AGENT_DOC_TYPE = '';//经办人证件类型
        ImagingOperaTions.AGENT_DOC_NO = '';//经办人证件号码
        ImagingOperaTions.AGENT_NAME = '';//经办人姓名
        ImagingOperaTions.CREDIT_CODE = '';//统一社会信用代码
        ImagingOperaTions.ORG_CODE = '';//组织机构代码
        ImagingOperaTions.LICENSE = '';//营业执照或其他批文号
        ImagingOperaTions.COMPNY_NAME = '';//公司名称
        ImagingOperaTions.REMARK = $.trim($('#img_beizhu').val());//备注
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
            ImagingOperaTions.OFF_IMAGE_NO = $.trim('T' + commonJson.adminCount + ImagingOperaTions.T_adminNo);
            if (!ImagingOperaTions.T_adminNo) {
                showMsg('脱机模式影像编号中序列号不能为空！');
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
                return;
            } else if (!(/^\d{3}$/.test(ImagingOperaTions.T_adminNo))) {
                showMsg('脱机影音编号中序列号应为3位数字！');
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
                return;
            }
        }
        if (rmoney($('#tranMoney').val()).toString().length > 15) {

            showMsg('金额长度包含小数点不能超过15位！');
            $('#tranMoney').closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        }
        debitEnter.messageCache = true;
        $.mobile.changePage('ImagingOperations-personConfirmation.html');
    });

});
/*非个人开户信息录入*/
$(document).on("pageshow", '#ImagingOperations-messageIn', function () {

    //反显的信息
    $('#imaging_customerType').text(clientTypeImaging[ImagingOperaTions.CLIENT_TYPE]); //客户类型
    $('#imaging_businessType').text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]); //业务类型
    $('#imaging_cerType').text(certTypeImaging[ImagingOperaTions.DOCUMENT_TYPE]); //证件类型
    $('#documentIdr').text(ImagingOperaTions.DOCUMENT_ID); //证件号码
    $('#clientName').text(ImagingOperaTions.CLIENT_NAME); //姓名
    // 脱机影音编号，序号栏位手工输入,脱机模式，显示该字段
    if (commonJson.offlineOnline == "offline") {
        $("#offline-show").show();
        $("#offline-show .input-test span").text(commonJson.adminCount);
    }
    if (debitEnter.messageCache) {
        $('#x_zhanghao').val(ImagingOperaTions.ACCT_NO);//帐卡号
        $('#x_shtydm').val(ImagingOperaTions.CREDIT_CODE);//统一社会信用代码
        $('#x_zjjgdm').val(ImagingOperaTions.ORG_CODE);//组织机构代码
        $('#x_yyzzhqtpwh').val(ImagingOperaTions.LICENSE);//营业执照或其他批文号
        if (ImagingOperaTions.inputIsDisabled) {
            $('#x_dwmc').val(ImagingOperaTions.COMPNY_NAME).attr('disabled', 'disabled');//公司名称
        } else {
            $('#x_dwmc').val(ImagingOperaTions.COMPNY_NAME);//公司名称
        }

        $('#x_beizhu').val(ImagingOperaTions.REMARK);//备注
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            $("#offline-show .input-test .input-test-con").val(ImagingOperaTions.T_adminNo);
        }
    }
    //组织机构代码失去焦点 发请求查询客户号
    $("#x_zjjgdm").on('blur', function () {
        if (commonJson.offlineOnline != "offline") {
            ImagingOperaTions.CLIENT_NO = '';//客户号置空
            $("#x_yyzzhqtpwh").val('');//营业执照
            $('#x_zhanghao').val('');//账卡号
            $('#x_dwmc').removeAttr('disabled').val('');//单位名称
            var city = $(this).val();
            if (city == "") return;
            ImagingOperaTions.ORG_CODE = $.trim($('#x_zjjgdm').val());//组织机构代码
            showLoader('客户信息查询中...');
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": ImagingOperaTions.moduleIdD,//模块编号
                    "tranId.s": ImagingOperaTions.tranId,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    "CLIENT_TYPE.s": "N",//客户类型 N组织 P个人
                    'CHECK_BLACK.s': false,//黑名单校验
                    "CARD.s": "",//卡号
                    "ACCT_NO.s": "",//账号
                    "CLIEMT_NO.s": "",//客户号
                    "DOC_TYPE.s": "F",//证件类型
                    "DOC_ID.s": ImagingOperaTions.ORG_CODE,//证件号 $.trim($("#x_zjjgdm").val())
                    "CLIENT_SHORT.s": "",//简称
                    "BIRTH_DATE.s": "",//出生日
                    "CELL_PHONE.s": "",//手机
                    "PHONE.s": "",//住宅电话
                    "LEGAL_REP.s": "",//法人代表
                    "REVERSE_FLAG.s": "D"//证件号内部检查标志 默认D
                }]
            };
            icustomerInfoServiceFun(sendJson, function (msg) {
                icustomerInfoServiceYunyingSucc(msg);
            }, function (err) {
                funFail(err);
            });
        }
    });
    //对公账号账号查询
    $("#ImagingOperations-messageIn .selectCard").on('click', function () {
        if (commonJson.offlineOnline != "offline" && ImagingOperaTions.CLIENT_NO) {
            imagingQueryCompanyAcctNoFun();
        } else if (commonJson.offlineOnline == "offline") {
            showTags({
                'title': '提示',
                'content': "脱机模式无法查询，请手动输入！",
                'ok': {}
            });
            return;
        } else if (!ImagingOperaTions.CLIENT_NO) {
            showTags({
                'title': '提示',
                'content': "没有客户号，无法查询！",
                'ok': {}
            });
            return;
        }
    });
    $('#ImagingOperations-messageIn  .backContainer ul').delegate('li', 'click', function () {
        $('#selectCard').show();
        $(this).addClass('bgColor').siblings('li').removeClass('bgColor');
        ImagingOperaTions.ACCT_NO = $.trim($(this).children('p').children(".xuanze_li").html());
    })
    $('#contChoose').on('click', function () {
        if (!ImagingOperaTions.ACCT_NO) {
            showMsg('请先点选账卡号');
            return;
        }
        $('#selectCard').hide();
        $('#x_zhanghao').val(ImagingOperaTions.ACCT_NO);
        ImagingOperaTions.ACCT_NO = '';
        $('#ImagingOperations-messageIn .backContainer').hide();
    })
    $('#contClose').on('click', function () {
        $('#x_zhanghao').val('');
        $('#selectCard').hide();
        $('#ImagingOperations-messageIn .backContainer').hide();
    })
    $('#selectCard').on('click', function () {
        imagingQueryCompanyAcctNoDetailFun();

    })
    $('#closeCardContainter').on('click', function () {
        $('.cardBackContainer').hide();
    })
    debitEnter.messageCache = true;
    //点击上一步，跳转页面
    $('#ImagingOperations_messageIn_pre').on('click', function () {
        ImagingOperaTions.ACCT_NO = $.trim($('#x_zhanghao').val());//帐卡号
        ImagingOperaTions.currency = '';//币种
        ImagingOperaTions.tranMoney = '';//金额
        ImagingOperaTions.AGENT_DOC_TYPE = '';//经办人证件类型
        ImagingOperaTions.AGENT_DOC_NO = '';//经办人证件号码
        ImagingOperaTions.AGENT_NAME = '';//经办人姓名
        ImagingOperaTions.CREDIT_CODE = $.trim($('#x_shtydm').val());//统一社会信用代码
        ImagingOperaTions.ORG_CODE = $.trim($('#x_zjjgdm').val());//组织机构代码
        ImagingOperaTions.LICENSE = $.trim($('#x_yyzzhqtpwh').val());//营业执照或其他批文号
        ImagingOperaTions.COMPNY_NAME = $.trim($('#x_dwmc').val());//公司名称
        ImagingOperaTions.REMARK = $.trim($('#x_beizhu').val());//备注
        ImagingOperaTions.inputIsDisabled = $('#x_dwmc').attr('disabled') ? true : false;//反显是否禁用

        creditJson.isPrev.YXCJisFromPrev = true;
        if (ImagingOperaTions.qitaCanBack) {
            $.mobile.changePage('ImagingOperations-customerPp.html', {reverse: true});
        } else {
            $.mobile.changePage('ImagingOperations-customerP.html', {reverse: true});
        }
    });

    //点击下一步
    $("#ImagingOperations_messageIn_next").on('click', function () {

        var num = 0; //纪录为空或者格式不正确的个数
        if (!$("#x_dwmc").val()) {
            $("#x_dwmc").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            num++;
        } else {
            $("#x_dwmc").closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
        }
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            if (!$("#offline-show .input-test .input-test-con").val()) {
                num++;
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
            } else {
                $('#offline-show .fm-item').removeClass('fm-item-error'); //错误字段取消点亮
            }
        }
        if (num > 0) {
            showMsg('必填项不能为空');
            return;
        }
        if (!(/^[0-9]{12}$/.test($.trim($('#x_zhanghao').val()))) && $.trim($('#x_zhanghao').val())) {
            showMsg('账号应为12位数字');
            $("#x_zhanghao").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        } else {
            $("#x_zhanghao").closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
        }
        if (!(/^[0-9A-Z\-]+$/.test($.trim($('#x_zjjgdm').val()))) && $.trim($('#x_zjjgdm').val())) {
            showMsg('组织机构代码应为大写字母、-或数字');
            $("#x_zjjgdm").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        } else {
            $("#x_zjjgdm").closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
        }
        ImagingOperaTions.ACCT_NO = $.trim($('#x_zhanghao').val());//帐卡号
        ImagingOperaTions.currency = '';//币种
        ImagingOperaTions.tranMoney = '';//金额
        ImagingOperaTions.AGENT_DOC_TYPE = '';//经办人证件类型
        ImagingOperaTions.AGENT_DOC_NO = '';//经办人证件号码
        ImagingOperaTions.AGENT_NAME = '';//经办人姓名
        ImagingOperaTions.PRODUCT_NO = '';//产品编号
        ImagingOperaTions.PRODUCT_NAME = '';//产品名称
        ImagingOperaTions.CREDIT_CODE = $.trim($('#x_shtydm').val());//统一社会信用代码
        ImagingOperaTions.ORG_CODE = $.trim($('#x_zjjgdm').val());//组织机构代码
        ImagingOperaTions.LICENSE = $.trim($('#x_yyzzhqtpwh').val());//营业执照或其他批文号
        ImagingOperaTions.COMPNY_NAME = $.trim($('#x_dwmc').val());//公司名称
        ImagingOperaTions.REMARK = $.trim($('#x_beizhu').val());//备注
        ImagingOperaTions.inputIsDisabled = $('#x_dwmc').attr('disabled') ? true : false;//反显是否禁用
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
            ImagingOperaTions.OFF_IMAGE_NO = $.trim('T' + commonJson.adminCount + ImagingOperaTions.T_adminNo);
            if (!(/^\d{3}$/.test(ImagingOperaTions.T_adminNo))) {
                showMsg('脱机影音编号中序列号应为3位数字！');
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
                return;
            }
        }

        $.mobile.changePage('ImagingOperations-confirmation.html');
    })

});
/*非个人其他信息录入*/
$(document).on("pageshow", '#ImagingOperations-qitaMessageIn', function () {

    //反显的信息
    $('#imaging_customerType').text(clientTypeImaging[ImagingOperaTions.CLIENT_TYPE]); //客户类型
    $('#imaging_businessType').text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]); //业务类型
    $('#imaging_cerType').text(certTypeImaging[ImagingOperaTions.DOCUMENT_TYPE]); //证件类型
    $('#documentIdr').text(ImagingOperaTions.DOCUMENT_ID); //证件号码
    $('#clientName').text(ImagingOperaTions.CLIENT_NAME); //姓名
    // 脱机影音编号，序号栏位手工输入,脱机模式，显示该字段
    if (commonJson.offlineOnline == "offline") {
        $("#offline-show").show();
        $("#offline-show .input-test span").text(commonJson.adminCount);
    }
    if (debitEnter.messageCache) {
        $('#x_zhanghao').val(ImagingOperaTions.ACCT_NO);//帐卡号
        $('#x_shtydm').val(ImagingOperaTions.CREDIT_CODE);//统一社会信用代码
        $('#x_zjjgdm').val(ImagingOperaTions.ORG_CODE);//组织机构代码
        $('#x_yyzzhqtpwh').val(ImagingOperaTions.LICENSE);//营业执照或其他批文号
        if (ImagingOperaTions.inputIsDisabled) {
            $('#x_dwmc').val(ImagingOperaTions.COMPNY_NAME).attr('disabled', 'disabled');//公司名称
        } else {
            $('#x_dwmc').val(ImagingOperaTions.COMPNY_NAME);//公司名称
        }
        $('#x_beizhu').val(ImagingOperaTions.REMARK);//备注
        $('#currency').val(ImagingOperaTions.currency).selectmenu('refresh');//币种
        $('#tranMoney').val(ImagingOperaTions.tranMoney);//金额
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            $("#offline-show .input-test .input-test-con").val(ImagingOperaTions.T_adminNo);
        }
    }
    //组织机构代码失去焦点 发请求查询客户号
    $("#x_zjjgdm").on('blur', function () {
        if (commonJson.offlineOnline != "offline") {
            ImagingOperaTions.CLIENT_NO = '';//客户号置空
            $("#x_yyzzhqtpwh").val('');//营业执照
            $('#x_zhanghao').val('');//账卡号
            $('#x_dwmc').removeAttr('disabled').val('');//单位名称
            var city = $(this).val();
            if (city == "") return;
            ImagingOperaTions.ORG_CODE = $.trim($('#x_zjjgdm').val());//组织机构代码
            showLoader('客户信息查询中...');
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": ImagingOperaTions.moduleIdD,//模块编号
                    "tranId.s": ImagingOperaTions.tranId,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    'CHECK_BLACK.s': false,//黑名单校验
                    "CLIENT_TYPE.s": "N",//客户类型 N组织 P个人
                    "CARD.s": "",//卡号
                    "ACCT_NO.s": "",//账号
                    "CLIEMT_NO.s": "",//客户号
                    "DOC_TYPE.s": "F",//证件类型
                    "DOC_ID.s": ImagingOperaTions.ORG_CODE,//证件号 $.trim($("#x_zjjgdm").val())
                    "CLIENT_SHORT.s": "",//简称
                    "BIRTH_DATE.s": "",//出生日
                    "CELL_PHONE.s": "",//手机
                    "PHONE.s": "",//住宅电话
                    "LEGAL_REP.s": "",//法人代表
                    "REVERSE_FLAG.s": "D"//证件号内部检查标志 默认D
                }]
            };
            icustomerInfoServiceFun(sendJson, function (msg) {
                icustomerInfoServiceYunyingSucc(msg);
            }, function (err) {
                funFail(err);
            });
        }
    });
    //对公账号账号查询
    $("#ImagingOperations-qitaMessageIn .selectCard").on('click', function () {
        if (commonJson.offlineOnline != "offline" && ImagingOperaTions.CLIENT_NO) {
            imagingQueryCompanyAcctNoFun();
        } else if (commonJson.offlineOnline == "offline") {
            showTags({
                'title': '提示',
                'content': "脱机模式无法查询，请手动输入！",
                'ok': {}
            });
            return;
        } else if (!ImagingOperaTions.CLIENT_NO) {
            showTags({
                'title': '提示',
                'content': "没有客户号，无法查询！",
                'ok': {}
            });
            return;
        }
    });
    $('#ImagingOperations-qitaMessageIn  .backContainer ul').delegate('li', 'click', function () {
        $('#selectCard').show();
        $(this).addClass('bgColor').siblings('li').removeClass('bgColor');
        ImagingOperaTions.ACCT_NO = $.trim($(this).children('p').children(".xuanze_li").html());
    })
    $('#contChoose').on('click', function () {
        if (!ImagingOperaTions.ACCT_NO) {
            showMsg('请先点选账卡号');
            return;
        }
        $('#selectCard').hide();
        $('#x_zhanghao').val(ImagingOperaTions.ACCT_NO);
        ImagingOperaTions.ACCT_NO = '';
        $('#ImagingOperations-qitaMessageIn .backContainer').hide();
    })
    $('#contClose').on('click', function () {
        $('#x_zhanghao').val('');
        $('#selectCard').hide();
        $('#ImagingOperations-qitaMessageIn .backContainer').hide();
    })
    $('#selectCard').on('click', function () {
        imagingQueryCompanyAcctNoDetailFun();

    })
    $('#closeCardContainter').on('click', function () {
        $('.cardBackContainer').hide();
    })
    $('#tranMoney').on('tap', function () {
        var _val = $(this).val();
        $(this).val(rmoney(_val))
    })
    $('#tranMoney').on('blur', function () {
        var _val = $(this).val().replace(/[^0-9\.]/ig, "");
        $(this).val(fmoney(_val))
    })
    debitEnter.messageCache = true;
    //点击上一步，跳转页面
    $('#ImagingOperations_messageIn_pre').on('click', function () {
        ImagingOperaTions.ACCT_NO = $.trim($('#x_zhanghao').val());//帐卡号
        ImagingOperaTions.currency = $.trim($('#currency').val());//币种
        ImagingOperaTions.tranMoney = $.trim($('#tranMoney').val());//金额
        ImagingOperaTions.AGENT_DOC_TYPE = '';//经办人证件类型
        ImagingOperaTions.AGENT_DOC_NO = '';//经办人证件号码
        ImagingOperaTions.AGENT_NAME = '';//经办人姓名
        ImagingOperaTions.CREDIT_CODE = $.trim($('#x_shtydm').val());//统一社会信用代码
        ImagingOperaTions.ORG_CODE = $.trim($('#x_zjjgdm').val());//组织机构代码
        ImagingOperaTions.LICENSE = $.trim($('#x_yyzzhqtpwh').val());//营业执照或其他批文号
        ImagingOperaTions.COMPNY_NAME = $.trim($('#x_dwmc').val());//公司名称
        ImagingOperaTions.REMARK = $.trim($('#x_beizhu').val());//备注
        ImagingOperaTions.inputIsDisabled = $('#x_dwmc').attr('disabled') ? true : false;//反显是否禁用

        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
        }
        creditJson.isPrev.YXCJisFromPrev = true;
        if (ImagingOperaTions.qitaCanBack) {
            $.mobile.changePage('ImagingOperations-customerPp.html', {reverse: true});
        } else {
            $.mobile.changePage('ImagingOperations-customerP.html', {reverse: true});
        }
    });

    //点击下一步
    $("#ImagingOperations_messageIn_next").on('click', function () {


        var num = 0; //纪录为空或者格式不正确的个数
        if (!$("#x_dwmc").val()) {
            $("#x_dwmc").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            num++;
        } else {
            $("#x_dwmc").closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
        }
        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            if (!$("#offline-show .input-test .input-test-con").val()) {
                num++;
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
            } else {
                $('#offline-show .fm-item').removeClass('fm-item-error'); //错误字段取消点亮
            }
        }
        if (num > 0) {
            showMsg('必填项不能为空');
            return;
        }
        if (!(/^[0-9]{12}$/.test($.trim($('#x_zhanghao').val()))) && $.trim($('#x_zhanghao').val())) {
            showMsg('账号应为12位数字');
            $("#x_zhanghao").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        } else {
            $("#x_zhanghao").closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
        }
        if (!(/^[0-9A-Z\-]+$/.test($.trim($('#x_zjjgdm').val()))) && $.trim($('#x_zjjgdm').val())) {
            showMsg('组织机构代码应为大写字母、-或数字');
            $("#x_zjjgdm").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        } else {
            $("#x_zjjgdm").closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
        }
        if (rmoney($('#tranMoney').val()).toString().length > 15) {

            showMsg('金额长度包含小数点不能超过15位！');
            $('#tranMoney').closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            return;
        }
        ImagingOperaTions.ACCT_NO = $.trim($('#x_zhanghao').val());//帐卡号
        ImagingOperaTions.currency = $.trim($('#currency').val());//币种
        ImagingOperaTions.tranMoney = $.trim($('#tranMoney').val());//金额
        //ImagingOperaTions.tranMoney = $.trim($('#tranMoney').val());//金额
        ImagingOperaTions.AGENT_DOC_TYPE = '';//经办人证件类型
        ImagingOperaTions.AGENT_DOC_NO = '';//经办人证件号码
        ImagingOperaTions.AGENT_NAME = '';//经办人姓名
        ImagingOperaTions.PRODUCT_NO = '';//产品编号
        ImagingOperaTions.PRODUCT_NAME = '';//产品名称
        ImagingOperaTions.CREDIT_CODE = $.trim($('#x_shtydm').val());//统一社会信用代码
        ImagingOperaTions.ORG_CODE = $.trim($('#x_zjjgdm').val());//组织机构代码
        ImagingOperaTions.LICENSE = $.trim($('#x_yyzzhqtpwh').val());//营业执照或其他批文号
        ImagingOperaTions.COMPNY_NAME = $.trim($('#x_dwmc').val());//公司名称
        ImagingOperaTions.REMARK = $.trim($('#x_beizhu').val());//备注
        ImagingOperaTions.inputIsDisabled = $('#x_dwmc').attr('disabled') ? true : false;//反显是否禁用

        if (commonJson.offlineOnline == 'offline') {//脱机影音编号
            ImagingOperaTions.T_adminNo = $("#offline-show .input-test .input-test-con").val();
            ImagingOperaTions.OFF_IMAGE_NO = $.trim('T' + commonJson.adminCount + ImagingOperaTions.T_adminNo);
            if (!(/^\d{3}$/.test(ImagingOperaTions.T_adminNo))) {
                showMsg('脱机影音编号中序列号应为3位数字！');
                $('#offline-show .fm-item').addClass('fm-item-error'); //错误字段点亮
                return;
            }
        }

        $.mobile.changePage('ImagingOperations-confirmation.html');
    })

});
/*个人开户确认信息页面*/
$(document).on("pageshow", '#ImagingOperations-personConfirmation', function () {
    $('#customerType').text(clientTypeImaging[ImagingOperaTions.CLIENT_TYPE]); //客户类型
    $('#cerType').text(certTypeImaging[ImagingOperaTions.DOCUMENT_TYPE]); //证件类型
    $('#businessType').text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]); //业务类型

    $('#clientName').text(ImagingOperaTions.CLIENT_NAME); //姓名
    $('#documentId').text(ImagingOperaTions.DOCUMENT_ID); //证件号码
    $('#clientCard').text(ImagingOperaTions.ACCT_NO); //帐卡号
    $('#moneyType').text(currencyTypeImaging[ImagingOperaTions.currency]); //币种
    $('#money').text(ImagingOperaTions.tranMoney); //金额
    $('#img_beizhu').text(ImagingOperaTions.REMARK);//备注
    if (citigoldJson.msgSureCache == true && citigoldJson.videoSrc != '') {
        $('.video-box').append('<video id="video-content" src="' + citigoldJson.videoSrc + '" width="100%" height="189px" autoplay="autoplay" controls="controls"></video>');
        $('.video-box .photo').hide();
        $('.kh-buy-cxps').show();
    }
    citigoldIsCanclickNexttwo(citigoldJson.msgSureCache); //是否可以点击提交和获取验证码


    $('#ImagingOperations-customerCon-edit').on('click', function () {

        if ($('.video-box video').length) {
            citigoldJson.msgSureCache = true;
            citigoldJson.videoSrc = $('.video-box video').attr('src');
        } else {
            citigoldJson.videoSrc = '';
        }
        if (ImagingOperaTions.BUSSINESS_TYPE == 'Y004') {
            $.mobile.changePage('ImagingOperations-personMessageIn.html', {
                reverse: true
            })
        } else if (ImagingOperaTions.BUSSINESS_TYPE = 'Y008') {
            $.mobile.changePage('ImagingOperations-personQitaMessageIn.html', {
                reverse: true
            })
        }
        ;
    });
    //初始化签名方法
    signature.init({
        div: $('#qianMDT'), //签名容器
        finishBtn: $("#qianOK"), //完成签名按钮
        clearBtn: $("#clear-botton"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function (data) { //签名完成回调函数
            // citigoldJson.qmStr = data;
            citigoldJson.qmStr = '';
            citigoldJson.qmStr = data.replace('data:image/png;base64,', '');
            Meap.transFormImage('sign' + myTime.UnixToDate(myTime.CurTime()).replace(/[-\s:]/g, '') + myTime.getCurMilliseconds() + commonJson.udId.replace(/-/g, ''), citigoldJson.qmStr, 'picSty', function (msg) {
                creditJson.signHref = msg;
            }, function (err) {
                creditJson.signHref = '';
            })
            if (citigoldJson.qmStr == '' || citigoldJson.qmStr == undefined) {
                showTags({
                    'title': '提示',
                    'content': '签名异常，请重新签写！',
                    'ok': {
                        'title': '',
                        fun: function () {
                        }
                    }
                });
                return;
            }
            if ($('#ic_agree').is(":hidden")) {
                $('#ic_disagree').hide().siblings('#ic_agree').show();
                citigoldJson.isCanClickNEXT.isSign = true;
                $('.qianM_shadow').show();
            } else {
                $('#ic_disagree').show().siblings('#ic_agree').hide();

                citigoldJson.isCanClickNEXT.isSign = false;
                $('.qianM_shadow').hide();
            }
            if (citigoldJson.isCanClickNEXT.isVideo && citigoldJson.isCanClickNEXT.isSign) {
                $('.previous').addClass('btn_next');
            } else {
                $('.previous').removeClass('btn_next');
            }
        }
    });

    $('.footter .previous').on('click', function () {
        if (!$(this).hasClass('btn_next')) {
            showMsg('未拍摄视频或签名完成未勾选，无法提交交易！')
            return;
        }
        creditJson.storage.picFileAllARR = [];
        creditJson.storage.picFileAllARR.push(creditJson.storage.picFileARR, citigoldJson.videoFileARR);
        creditJson.storage.picFileAllARR = Array.prototype.concat.apply([], creditJson.storage.picFileAllARR);
        creditJson.storage.picFileAllARR.push(creditJson.signHref);
        if (commonJson.offlineOnline == 'offline') { //脱机状态
            //脱机模式存储个人信息
            var fileArray=creditJson.storage.picFileARR.join("&&");
            fileArray=fileArray+"&&"+citigoldJson.videoFileARR+"&&"+creditJson.signHref;
        	fileArray = fileArray.split('&&');
        	//需要首先判断所有文件附件是否都存在，且大小是否都不为0K
        	checkZipCompression(fileArray,function(msg){
        		            //脱机模式存储个人信息
            imagingCacheNoNetCustermerInfo();
            $.mobile.changePage('ImagingOperations-carryOut.html');
        	},function(err){

        		showMsg('影像资料保存异常，请重新录入');
        	});

            return;
        }
        getPlatGlobalSeq(ImagingOperaTions, function () {
            hideLoader();
            imagingZipCompression();
        });

    });
});
/*个人代理开户确认信息页面*/
$(document).on("pageshow", '#ImagingOperations-personAgencyKaihuConfirmation', function () {
    $('#customerType').text(clientTypeImaging[ImagingOperaTions.CLIENT_TYPE]); //客户类型
    $('#cerType').text(certTypeImaging[ImagingOperaTions.AGENT_DOC_TYPE]); //经办人证件类型
    $('#businessType').text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]); //业务类型
    $('#clientName').text(ImagingOperaTions.AGENT_NAME); //经办人姓名
    $('#documentId').text(ImagingOperaTions.AGENT_DOC_NO); //经办人证件号码

    $("#depositorType").text(certTypeImaging[ImagingOperaTions.DOCUMENT_TYPE]); //证件类型
    $("#depositorName").text(ImagingOperaTions.CLIENT_NAME); //姓名
    $("#depositorId").text(ImagingOperaTions.DOCUMENT_ID); //证件号码

    $('#clientCard').text(ImagingOperaTions.ACCT_NO); //帐卡号
    $('#moneyType').text(''); //币种
    $('#money').text(''); //金额
    $('#img_beizhu').text(ImagingOperaTions.REMARK);//备注
    if (citigoldJson.msgSureCache == true && citigoldJson.videoSrc != '') {
        $('.video-box').append('<video id="video-content" src="' + citigoldJson.videoSrc + '" width="100%" height="189px" autoplay="autoplay" controls="controls"></video>');
        $('.video-box .photo').hide();
        $('.kh-buy-cxps').show();
    }
    citigoldIsCanclickNexttwo(citigoldJson.msgSureCache); //是否可以点击提交和获取验证码


    $('#ImagingOperations-customerCon-edit').on('click', function () {
        if ($('.video-box video').length) {
            citigoldJson.msgSureCache = true;

            citigoldJson.videoSrc = $('.video-box video').attr('src');
        } else {
            citigoldJson.videoSrc = '';
        }
        $.mobile.changePage('ImagingOperations-personAgencyKaihuMessageIn.html', {
            reverse: true
        });
    });
    //初始化签名方法
    signature.init({
        div: $('#qianMDT'), //签名容器
        finishBtn: $("#qianOK"), //完成签名按钮
        clearBtn: $("#clear-botton"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function (data) { //签名完成回调函数
            // citigoldJson.qmStr = data;
            citigoldJson.qmStr = '';
            citigoldJson.qmStr = data.replace('data:image/png;base64,', '');
            Meap.transFormImage('sign' + myTime.UnixToDate(myTime.CurTime()).replace(/[-\s:]/g, '') + myTime.getCurMilliseconds() + commonJson.udId.replace(/-/g, ''), citigoldJson.qmStr, 'picSty', function (msg) {
                creditJson.signHref = msg;
            }, function (err) {
                creditJson.signHref = '';
            })
            if (citigoldJson.qmStr == '' || citigoldJson.qmStr == undefined) {
                showTags({
                    'title': '提示',
                    'content': '签名异常，请重新签写！',
                    'ok': {
                        'title': '',
                        fun: function () {
                        }
                    }
                });
                return;
            }
            if ($('#ic_agree').is(":hidden")) {
                $('#ic_disagree').hide().siblings('#ic_agree').show();
                citigoldJson.isCanClickNEXT.isSign = true;
                $('.qianM_shadow').show();
            } else {
                $('#ic_disagree').show().siblings('#ic_agree').hide();

                citigoldJson.isCanClickNEXT.isSign = false;
                $('.qianM_shadow').hide();
            }
            if (citigoldJson.isCanClickNEXT.isVideo && citigoldJson.isCanClickNEXT.isSign) {
                $('.previous').addClass('btn_next');
            } else {
                $('.previous').removeClass('btn_next');
            }
        }
    });

    $('.footter .previous').on('click', function () {
        if (!$(this).hasClass('btn_next')) {
            showMsg('未拍摄视频或签名完成未勾选，无法提交交易！')
            return;
        }
        creditJson.storage.picFileAllARR = [];
        creditJson.storage.picFileAllARR.push(creditJson.storage.picFileARR, citigoldJson.videoFileARR);
        creditJson.storage.picFileAllARR = Array.prototype.concat.apply([], creditJson.storage.picFileAllARR);
        creditJson.storage.picFileAllARR.push(creditJson.signHref);
        if (commonJson.offlineOnline == 'offline') { //脱机状态
            //脱机模式存储个人信息
            var fileArray=creditJson.storage.picFileARR.join("&&");
            fileArray=fileArray+"&&"+citigoldJson.videoFileARR+"&&"+creditJson.signHref;
        	fileArray = fileArray.split('&&');
        	//需要首先判断所有文件附件是否都存在，且大小是否都不为0K
        	checkZipCompression(fileArray,function(msg){
        		            //脱机模式存储个人信息
            imagingCacheNoNetCustermerInfo();
            $.mobile.changePage('ImagingOperations-carryOut.html');
        	},function(err){

        		showMsg('影像资料保存异常，请重新录入');
        	});

            return;
        }
        getPlatGlobalSeq(ImagingOperaTions, function () {
            hideLoader();
            imagingZipCompression();
        });

    });
});
/*个人购买理财确认信息页面*/
$(document).on("pageshow", '#ImagingOperations-personBuyLicaiConfirmation', function () {
    $('#customerType').text(clientTypeImaging[ImagingOperaTions.CLIENT_TYPE]); //客户类型
    $('#cerType').text(certTypeImaging[ImagingOperaTions.DOCUMENT_TYPE]); //证件类型
    $('#businessType').text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]); //业务类型

    $('#productNo').text(ImagingOperaTions.PRODUCT_NO);//产品编号
    $('#productName').text(ImagingOperaTions.PRODUCT_NAME);//产品名称
    $('#clientName').text(ImagingOperaTions.CLIENT_NAME); //姓名
    $('#documentId').text(ImagingOperaTions.DOCUMENT_ID); //证件号码
    $('#clientCard').text(ImagingOperaTions.ACCT_NO); //帐卡号
    $('#moneyType').text(currencyTypeImaging[ImagingOperaTions.currency]); //币种
    $('#money').text(ImagingOperaTions.tranMoney); //金额
    $('#img_beizhu').text(ImagingOperaTions.REMARK);//备注

    if (citigoldJson.msgSureCache == true && citigoldJson.videoSrc != '') {
        $('.video-box').append('<video id="video-content" src="' + citigoldJson.videoSrc + '" width="100%" height="189px" autoplay="autoplay" controls="controls"></video>');
        $('.video-box .photo').hide();
        $('.kh-buy-cxps').show();
        $('.previous').addClass('btn_next');
    }
    citigoldIsCanclickNexttwo(citigoldJson.msgSureCache); //是否可以点击提交和获取验证码
    citigoldJson.isCanClickNEXT.isSign = true;

    $('#ImagingOperations-customerCon-edit').on('click', function () {
        if ($('.video-box video').length) {
            citigoldJson.msgSureCache = true;

            citigoldJson.videoSrc = $('.video-box video').attr('src');
        } else {
            citigoldJson.videoSrc = '';
        }
        $.mobile.changePage('ImagingOperations-personBuyLicaiMessageIn.html', {
            reverse: true
        });
    });


    $('.footter .previous').on('click', function () {
        if (!$(this).hasClass('btn_next')) return;
        creditJson.storage.picFileAllARR = [];
        creditJson.storage.picFileAllARR.push(creditJson.storage.picFileARR, citigoldJson.videoFileARR);
        creditJson.storage.picFileAllARR = Array.prototype.concat.apply([], creditJson.storage.picFileAllARR);
        if (commonJson.offlineOnline == 'offline') { //脱机状态
            //脱机模式存储个人信息
            var fileArray=creditJson.storage.picFileARR.join("&&");
            fileArray=fileArray+"&&"+citigoldJson.videoFileARR;
        	fileArray = fileArray.split('&&');
        	//需要首先判断所有文件附件是否都存在，且大小是否都不为0K
        	checkZipCompression(fileArray,function(msg){
        		            //脱机模式存储个人信息
            imagingCacheNoNetCustermerInfo();
            $.mobile.changePage('ImagingOperations-carryOut.html');
        	},function(err){
        		showMsg('影像资料保存异常，请重新录入');
        	});

            return;
        }
        getPlatGlobalSeq(ImagingOperaTions, function () {
            hideLoader();
            imagingZipCompression();
        });

    });
});
/*个人购买保险确认信息页面*/
$(document).on("pageshow", '#ImagingOperations-personBuyBaoxianConfirmation', function () {
    $('#customerType').text(clientTypeImaging[ImagingOperaTions.CLIENT_TYPE]); //客户类型
    $('#cerType').text(certTypeImaging[ImagingOperaTions.DOCUMENT_TYPE]); //证件类型
    $('#businessType').text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]); //业务类型

    //$('#productNo').text(ImagingOperaTions.PRODUCT_NO);//产品编号
    $('#productName').text(ImagingOperaTions.PRODUCT_NAME);//产品名称
    $('#clientName').text(ImagingOperaTions.CLIENT_NAME); //姓名
    $('#documentId').text(ImagingOperaTions.DOCUMENT_ID); //证件号码
    //$('#clientCard').text(ImagingOperaTions.ACCT_NO); //帐卡号
    //$('#moneyType').text(ImagingOperaTions.currency); //币种
    $('#money').text(ImagingOperaTions.tranMoney); //金额
    $('#img_beizhu').text(ImagingOperaTions.REMARK);//备注

    if (citigoldJson.msgSureCache == true && citigoldJson.videoSrc != '') {
        $('.video-box').append('<video id="video-content" src="' + citigoldJson.videoSrc + '" width="100%" height="189px" autoplay="autoplay" controls="controls"></video>');
        $('.video-box .photo').hide();
        $('.kh-buy-cxps').show();
        $('.previous').addClass('btn_next');
    }
    citigoldIsCanclickNexttwo(citigoldJson.msgSureCache); //是否可以点击提交和获取验证码
    citigoldJson.isCanClickNEXT.isSign = true;

    $('#ImagingOperations-customerCon-edit').on('click', function () {
        if ($('.video-box video').length) {
            citigoldJson.msgSureCache = true;
            citigoldJson.videoSrc = $('.video-box video').attr('src');
        } else {
            citigoldJson.videoSrc = '';
        }
        $.mobile.changePage('ImagingOperations-personBuyBaoxianMessageIn.html', {
            reverse: true
        });
    });

    $('.footter .previous').on('click', function () {
        if (!$(this).hasClass('btn_next')) return;
        creditJson.storage.picFileAllARR = [];
        creditJson.storage.picFileAllARR.push(creditJson.storage.picFileARR, citigoldJson.videoFileARR);
        creditJson.storage.picFileAllARR = Array.prototype.concat.apply([], creditJson.storage.picFileAllARR);
        if (commonJson.offlineOnline == 'offline') { //脱机状态
            //脱机模式存储个人信息
            var fileArray=creditJson.storage.picFileARR.join("&&");
            fileArray=fileArray+"&&"+citigoldJson.videoFileARR;
        	fileArray = fileArray.split('&&');
        	//需要首先判断所有文件附件是否都存在，且大小是否都不为0K
        	checkZipCompression(fileArray,function(msg){
        		            //脱机模式存储个人信息
            imagingCacheNoNetCustermerInfo();
            $.mobile.changePage('ImagingOperations-carryOut.html');
        	},function(err){

        		showMsg('影像资料保存异常，请重新录入');
        	});

            return;
        }
        getPlatGlobalSeq(ImagingOperaTions, function () {
            hideLoader();
            imagingZipCompression();
        });

    });
});
/*个人代买理财确认信息页面*/
$(document).on("pageshow", '#ImagingOperations-personAgencyLicaiConfirmation', function () {
    $('#customerType').text(clientTypeImaging[ImagingOperaTions.CLIENT_TYPE]); //客户类型
    $('#cerType').text(certTypeImaging[ImagingOperaTions.AGENT_DOC_TYPE]); //经办人证件类型
    $('#businessType').text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]); //业务类型
    $('#clientName').text(ImagingOperaTions.AGENT_NAME); //经办人姓名
    $('#documentId').text(ImagingOperaTions.AGENT_DOC_NO); //经办人证件号码

    $("#depositorType").text(certTypeImaging[ImagingOperaTions.DOCUMENT_TYPE]); //证件类型
    $("#depositorName").text(ImagingOperaTions.CLIENT_NAME); //姓名
    $("#depositorId").text(ImagingOperaTions.DOCUMENT_ID); //证件号码

    $('#productNo').text(ImagingOperaTions.PRODUCT_NO);//产品编号
    $('#productName').text(ImagingOperaTions.PRODUCT_NAME);//产品名称
    $('#clientCard').text(ImagingOperaTions.ACCT_NO); //帐卡号
    $('#currency').text(currencyTypeImaging[ImagingOperaTions.currency]); //币种
    $('#tranMoney').text(ImagingOperaTions.tranMoney); //金额
    $('#img_beizhu').text(ImagingOperaTions.REMARK);//备注

    if (citigoldJson.msgSureCache == true && citigoldJson.videoSrc != '') {
        $('.video-box').append('<video id="video-content" src="' + citigoldJson.videoSrc + '" width="100%" height="189px" autoplay="autoplay" controls="controls"></video>');
        $('.video-box .photo').hide();
        $('.kh-buy-cxps').show();
        $('.previous').addClass('btn_next');

    }
    citigoldIsCanclickNexttwo(citigoldJson.msgSureCache); //是否可以点击提交和获取验证码
    citigoldJson.isCanClickNEXT.isSign = true;

    $('#ImagingOperations-customerCon-edit').on('click', function () {

        if ($('.video-box video').length) {
            citigoldJson.msgSureCache = true;
            citigoldJson.videoSrc = $('.video-box video').attr('src');
        } else {
            citigoldJson.videoSrc = '';
        }
        $.mobile.changePage('ImagingOperations-personAgencyLicaiMessageIn.html', {
            reverse: true
        });
    });

    $('.footter .previous').on('click', function () {
        if (!$(this).hasClass('btn_next')) return;
        creditJson.storage.picFileAllARR = [];
        creditJson.storage.picFileAllARR.push(creditJson.storage.picFileARR, citigoldJson.videoFileARR);
        creditJson.storage.picFileAllARR = Array.prototype.concat.apply([], creditJson.storage.picFileAllARR);
        if (commonJson.offlineOnline == 'offline') { //脱机状态
            //脱机模式存储个人信息
            var fileArray=creditJson.storage.picFileARR.join("&&");
            fileArray=fileArray+"&&"+citigoldJson.videoFileARR;
        	fileArray = fileArray.split('&&');
        	//需要首先判断所有文件附件是否都存在，且大小是否都不为0K
        	checkZipCompression(fileArray,function(msg){
        		            //脱机模式存储个人信息
            imagingCacheNoNetCustermerInfo();
            $.mobile.changePage('ImagingOperations-carryOut.html');
        	},function(err){

        		showMsg('影像资料保存异常，请重新录入');
        	});

            return;
        }
        getPlatGlobalSeq(ImagingOperaTions, function () {
            hideLoader();
            imagingZipCompression();
        });

    });
});
/*非个人开户确认信息页面*/
$(document).on("pageshow", '#ImagingOperations-confirmation', function () {
    $("#customerType").text(clientTypeImaging[ImagingOperaTions.CLIENT_TYPE]);//客户类型
    $("#businessType").text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]);//业务类型
    $("#clientCard").text(ImagingOperaTions.ACCT_NO);//账号
    $("#compnyName").text(ImagingOperaTions.COMPNY_NAME);//单位名称
    $("#creditCode").text(ImagingOperaTions.CREDIT_CODE);//统一社会信用代码
    $("#cerType").text(certTypeImaging[ImagingOperaTions.DOCUMENT_TYPE]);//法定代表人证件类型
    $("#orgCode").text(ImagingOperaTions.ORG_CODE);//组织机构代码
    $("#documentId").text(ImagingOperaTions.DOCUMENT_ID);//法定代表人证件号码
    $("#license").text(ImagingOperaTions.LICENSE);//营业执照或其他批文号
    $("#depositorName").text(ImagingOperaTions.CLIENT_NAME);//法定代表人姓名
    $("#currency").text(currencyTypeImaging[ImagingOperaTions.currency]);//币种
    $("#tranMoney").text(ImagingOperaTions.tranMoney);//金额
    $("#basic_beiZ").text(ImagingOperaTions.REMARK);//备注


    if (citigoldJson.msgSureCache == true && citigoldJson.videoSrc != '') {
        $('.video-box').append('<video id="video-content" src="' + citigoldJson.videoSrc + '" width="100%" height="189px" autoplay="autoplay" controls="controls"></video>');
        $('.video-box .photo').hide();
        $('.video-box .photo').hide();
        $('.kh-buy-cxps').show();
    }
    citigoldIsCanclickNexttwo(citigoldJson.msgSureCache); //是否可以点击提交
    $('#citi-edit').on('click', function () {
        if ($('.video-box video').length) {
            citigoldJson.msgSureCache = true;
            citigoldJson.videoSrc = $('.video-box video').attr('src');
        } else {
            citigoldJson.videoSrc = '';
        }
        if (ImagingOperaTions.BUSSINESS_TYPE == 'Y001') {//非个人开户
            $.mobile.changePage('ImagingOperations-messageIn.html', {
                reverse: true
            });
        } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y003') {//非个人其他
            $.mobile.changePage('ImagingOperations-qitaMessageIn.html', {
                reverse: true
            });
        }

    });
    //初始化签名方法
    signature.init({
        div: $('#qianMDT'), //签名容器
        finishBtn: $("#qianOK"), //完成签名按钮
        clearBtn: $("#clear-botton"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function (data) { //签名完成回调函数
            // citigoldJson.qmStr = data;
            citigoldJson.qmStr = '';
            citigoldJson.qmStr = data.replace('data:image/png;base64,', '');
            Meap.transFormImage('sign' + myTime.UnixToDate(myTime.CurTime()).replace(/[-\s:]/g, '') + myTime.getCurMilliseconds() + commonJson.udId.replace(/-/g, ''), citigoldJson.qmStr, 'picSty', function (msg) {
                creditJson.signHref = msg;
            }, function (err) {
                creditJson.signHref = '';
            })
            if (citigoldJson.qmStr == '' || citigoldJson.qmStr == undefined) {
                showTags({
                    'title': '提示',
                    'content': '签名异常，请重新签写！',
                    'ok': {
                        'title': '',
                        fun: function () {
                        }
                    }
                });
                return;
            }
            if ($('#ic_agree').is(":hidden")) {
                $('#ic_disagree').hide().siblings('#ic_agree').show();
                citigoldJson.isCanClickNEXT.isSign = true;
                $('.qianM_shadow').show();
            } else {
                $('#ic_disagree').show().siblings('#ic_agree').hide();

                citigoldJson.isCanClickNEXT.isSign = false;
                $('.qianM_shadow').hide();
            }
            if (citigoldJson.isCanClickNEXT.isVideo && citigoldJson.isCanClickNEXT.isSign) {
                $('.previous').addClass('btn_next');
            } else {
                $('.previous').removeClass('btn_next');
            }
        }
    });

    $('.footter .previous').on('click', function () {//点击提交按钮
        if (!$(this).hasClass('btn_next')) {
            showMsg('未拍摄视频或签名完成未勾选，无法提交交易！')
            return;
        }

        creditJson.storage.picFileAllARR = [];
        creditJson.storage.picFileAllARR.push(creditJson.storage.picFileARR, citigoldJson.videoFileARR);
        creditJson.storage.picFileAllARR = Array.prototype.concat.apply([], creditJson.storage.picFileAllARR);
        creditJson.storage.picFileAllARR.push(creditJson.signHref);
        if (commonJson.offlineOnline == 'offline') { //脱机状态
            //脱机模式存储个人信息
            var fileArray=creditJson.storage.picFileARR.join("&&");
            fileArray=fileArray+"&&"+citigoldJson.videoFileARR+"&&"+creditJson.signHref;
        	fileArray = fileArray.split('&&');
        	//需要首先判断所有文件附件是否都存在，且大小是否都不为0K
        	checkZipCompression(fileArray,function(msg){
        		            //脱机模式存储个人信息
            imagingCacheNoNetCustermerInfo();
            $.mobile.changePage('ImagingOperations-carryOut.html');
        	},function(err){

        		showMsg('影像资料保存异常，请重新录入');
        	});

            return;
        }
        getPlatGlobalSeq(ImagingOperaTions, function () {//获取流水号
            hideLoader();
            imagingZipCompression();
        });

    })

});

/*业务完成*/
$(document).on("pageshow", '#ImagingOperations-carryOut', function () {
    $("#imagingNo").text(ImagingOperaTions.imageNo ? ImagingOperaTions.imageNo : ImagingOperaTions.OFF_IMAGE_NO);
    $("#bussinessType").text(bussinessTypeImaging[ImagingOperaTions.BUSSINESS_TYPE]);
    $("#clientName").text(ImagingOperaTions.CLIENT_TYPE == 'N' ? ImagingOperaTions.COMPNY_NAME : ImagingOperaTions.CLIENT_NAME);
    $('#ImagingOperations-carryOut-next').on('click', function () {
        $.mobile.changePage('../main.html', {reverse: true});
    })
});
/*其他证件页面*/
$(document).on("pageshow", '#ImagingOperations-QitaZhengjiann', function () {
    function ocrIdCardFun() {
        ocrIdCard('', function (msg) {
            var msg = msg.split('+');
            $("#QitaZhengjiann_name").val($.trim(msg[0]));
            $("#QitaZhengjiann_reCardNo").val($.trim(msg[1]));
        }, function (err) {

        })

    }

    $("#ImagingOperations-QitaZhengjiann .OCRID_scan").on('click', function () {

        if ($("#QitaZhengjiann_Leixing").val() == 0) {
            ocrIdCardFun();
        } else {
            showTags({
                'title': '提示',
                'content': "OCR暂时只支持身份证",
                'ok': {}
            });
            return;
        }

    });
    $("#ImagingOperations_qita_pre").on("click", function () {
        $.mobile.changePage('yewuxuanze-one.html');
    });
    $("#ImagingOperations_qita_next").on("click", function () {
        var num = 0; //纪录为空或者格式不正确的个数
        $('#ImagingOperations-QitaZhengjiann input[type="text"]').each(function (index, el) {
            if ($.trim($(this).val()) == '') {
                num++;
                $(this).closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            } else {
                $(this).closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
            }
        });
        if (num > 0) {
            showMsg('必填项不能为空');
            return;
        }
        //if (!$("#QitaZhengjiann_name").val()) {
        //    showMsg("姓名不能为空");
        //    return;
        //} else if (!$("#QitaZhengjiann_reCardNo").val()) {
        //    showMsg("证件号码不能为空");
        //    return;
        //}
        if (!fmReg.qitaCerNo.test($.trim($("#QitaZhengjiann_reCardNo").val()))) {
            $("#QitaZhengjiann_reCardNo").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            showMsg(fmRegMsg.qitaCerNo);
            return;
        }
        ImagingOperaTions.picName = $("#QitaZhengjiann_Leixing option:selected").attr('picName');
        if (ImagingOperaTions.BUSSINESS_TYPE == 'Y005' || ImagingOperaTions.BUSSINESS_TYPE == 'Y009') {
            ImagingOperaTions.AGENT_DOC_TYPE = $.trim($("#QitaZhengjiann_Leixing").val());//经办人证件类型
            ImagingOperaTions.AGENT_DOC_NO = $.trim($("#QitaZhengjiann_reCardNo").val());//经办人证件号码
            ImagingOperaTions.AGENT_NAME = $.trim($("#QitaZhengjiann_name").val());//经办人姓名
        } else {
            ImagingOperaTions.DOCUMENT_TYPE = $.trim($("#QitaZhengjiann_Leixing").val());
            ImagingOperaTions.CLIENT_NAME = $.trim($("#QitaZhengjiann_name").val());
            ImagingOperaTions.DOCUMENT_ID = $.trim($("#QitaZhengjiann_reCardNo").val());
        }
        if ($("#QitaZhengjiann_Leixing").val() == '0' && commonJson.offlineOnline != 'offline') {
            creditJson.isPrev.QTZJcanJump = true;
            function convertImgToBase64(url, callback, outputFormat) {
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
                    // Clean up
                    canvas = null;
                };
                img.src = url;
            }

            convertImgToBase64('../../images/03wushenfenzheng.png', function (base64Img) {
                ImagingOperaTions.base64Img = base64Img;
            })
            showLoader('联网核查中...');
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": ImagingOperaTions.moduleId,//模块编号
                    "tranId.s": ImagingOperaTions.tranId,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    "DOCUMENT_TYPE.s": "0",//证件类型
                    "DOCUMENT_ID.s": ImagingOperaTions.DOCUMENT_ID ? ImagingOperaTions.DOCUMENT_ID : ImagingOperaTions.AGENT_DOC_NO,//身份证号码
                    "CLIENT_NAME.s": ImagingOperaTions.CLIENT_NAME ? ImagingOperaTions.CLIENT_NAME : ImagingOperaTions.AGENT_NAME,//被核对人姓名
                    "BUSSINESSCODE.s": "01",//业务总类
                    "BRANCH_ID.s": commonJson.orgId//机构号
                }]
            };
            //身份证联网核查
            icitizenCertificateIdenifyFun(sendJson, function (msg) {
                $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
                $('.sh_loading_box_shadow').remove();
                imagingItizenCertificateIdenifySucc(msg);
            }, function (err) {
                $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
                $('.sh_loading_box_shadow').remove();
                funFail(err);
            });
            $(".lianwanghecha-chongxin").on("click", function () {//重新联网核查
                $(".lianwanghecha-yichang").hide();
                $('.sh_loading_box_shadow').remove();
                $('.header .head-left,.header .head-right').addClass('btn-cannt-click');
                showLoader('联网核查中...');
                var sendJson = {
                    "b": [{
                        "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                        "workAddress.s": commonJson.workAddress,//工作地址
                        "orgId.s": commonJson.orgId,//机构号
                        "moduleId.s": ImagingOperaTions.moduleId,//模块编号
                        "tranId.s": ImagingOperaTions.tranId1,//交易编号
                        "operatorNo.s": commonJson.adminCount,//操作员
                        "deviceNo.s": commonJson.udId,//设备编号
                        "DOCUMENT_TYPE.s": "0",//证件类型
                        "DOCUMENT_ID.s": ImagingOperaTions.DOCUMENT_ID,//身份证号码
                        "CLIENT_NAME.s": ImagingOperaTions.CLIENT_NAME,//被核对人姓名
                        "BUSSINESSCODE.s": "01",//业务总类
                        "BRANCH_ID.s": commonJson.orgId//机构号
                    }]
                };
                //身份证联网核查
                icitizenCertificateIdenifyFun(sendJson, function (msg) {
                    $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
                    $('.sh_loading_box_shadow').remove();
                    imagingItizenCertificateIdenifySucc(msg);
                }, function (err) {
                    $('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
                    $('.sh_loading_box_shadow').remove();
                    funFail(err);
                })

            });
            $(".lianwanghecha-jixu").on("click", function () {//继续业务办理
                $(".lianwanghecha-yichang").hide();
                $.mobile.changePage('ImagingOperations-customerP.html');
            });
            $(".lianwanghecha-tuichu").on("click", function () {//退出
                $.mobile.changePage('yewuxuanze-one.html', {transition: "slide"});
                $(".lianwanghecha-yichang").hide();
            });
        } else if ($("#QitaZhengjiann_Leixing").val() == '0' && commonJson.offlineOnline == 'offline') {
            $.mobile.changePage('ImagingOperations-customerP.html', {reverse: true});
        } else {
            ImagingOperaTions.qitaCanBack = true;
            $.mobile.changePage('ImagingOperations-customerPp.html', {reverse: true});
        }
    });

});
/*其他证件影像采集*/
var imagingImageAcquisitionT = {
    imgSrc: '', //记录照片路径,
    curParentObj: '', //记录要删除的对象
    delImg: function (curParentObj, imgSrc) { //删除照片
        creditJson.isPrev.LLDBisFromPrev = false;
        deletePhoto([imgSrc], function (msg) {
            curParentObj.find('.camera-pic').remove();
            curParentObj.find('.camera').show();
            curParentObj.find('.rephoto').html('必拍');
            $('.bigpic-review-box').animate({
                    opacity: '0'
                },
                200,
                function () {
                    $('.bigpic-review-box').hide()
                });
            if (curParentObj.find('.cameraMul').length > 0) { //如果是其他证明
                curParentObj.closest('.img_box').remove();
            }
            //监测下一步是否可点击
            var ind = 0;
            for (var i = 0; i < 3; i++) {
                if ($('#ImagingOperations-customerPp .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 3) {
                        $('#ImagingOperations-customerPp-next').addClass('btn_next');
                    } else {
                        $('#ImagingOperations-customerPp-next').removeClass('btn_next');
                    }
                }
                ;
            }
        }, function (err) {

        })
    },
    getFace: function (curParentObj) {
        faceDistinguish('trans', function (msg) {
            creditJson.isPrev.LLDBisFromPrev = false;
            imagingImageAcquisitionT.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');

            //监测下一步是否可点击
            var ind = 0;
            for (var i = 0; i < 3; i++) {
                if ($('#ImagingOperations-customerPp .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 3) {
                        $('#ImagingOperations-customerPp-next').addClass('btn_next');
                    } else {
                        $('#ImagingOperations-customerPp-next').removeClass('btn_next');
                    }
                }
                ;
            }
        }, function (err) {
            showMsg(err);
        })
    },
    getImg: function (curParentObj) { //拍照
        if ($('#ImagingOperations-customerPp .cameraMul').length == 18) {
            $('#ImagingOperations-customerPp .cameraMul').eq(17).parents(".img_box").remove();
            showTags({
                'title': '提示',
                'content': "拍摄照片已到最大限度[最大限度为20张]",
                'ok': {}
            });
            return;

        }
        Meap.media('camera', curParentObj.attr('picname'), function (msg) {
            creditJson.isPrev.LLDBisFromPrev = false;
            imagingImageAcquisitionT.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.find('.camera-pic').remove();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');
            var ele = $('.img_box:last').find('.rephoto').text();
            if (curParentObj.find('.cameraMul').length > 0 && ele != '选拍，可多张拍摄') { //如果是其他证明

                var htmltext = "";

                htmltext += '<div class="img_box" style="position: relative;">' +
                '<div class="customer customer_six" picName="qitazhengming">' +
                '<div class="rephoto">选拍，可多张拍摄</div>' +
                '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/>' +
                '</div>' +
                '<div class="img_notes">其他</div>';
                $('#ImagingOperations-customerPp .img_content').append(htmltext).trigger("create");

            } else {

            }
            //监测下一步是否可点击
            var ind = 0;
            for (var i = 0; i < 3; i++) {
                if ($('#ImagingOperations-customerPp .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 3) {
                        $('#ImagingOperations-customerPp-next').addClass('btn_next');
                    } else {
                        $('#ImagingOperations-customerPp-next').removeClass('btn_next');
                    }
                }
            }
        }, function (err) {
            showMsg(err);
        })
    },
    reGetImg: function (curParentObj, imgSrc) { //重拍
        if (curParentObj.parent().hasClass('get-face')) {
            faceDistinguish('trans', function (returnGetMsg) {
                creditJson.isPrev.LLDBisFromPrev = false;
                deletePhoto([imgSrc], function (returnDelMsg) {
                    imagingImageAcquisitionT.imgSrc = returnGetMsg;
                    curParentObj.find('.camera-pic').attr('src', returnGetMsg);
                    $('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
                }, function (err) {

                })
            }, function (err) {
                showMsg('重拍失败');
            })
        } else {
            Meap.media('camera', curParentObj.attr('picname'), function (returnGetMsg) {
                creditJson.isPrev.LLDBisFromPrev = false;
                imgSrc = curParentObj.find('.camera-pic').attr('src');
                deletePhoto([imgSrc], function (returnDelMsg) {
                    imagingImageAcquisitionT.imgSrc = returnGetMsg;
                    curParentObj.find('.camera-pic').attr('src', returnGetMsg);
                    $('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
                }, function (err) {
                })
            }, function (err) {
                showMsg('重拍失败');
            })
        }

    },
    reviewImg: function (imgSrc) { //拍照预览
        $('.bigpic-review').html('<img src=' + imgSrc + ' height="100%">');
        $('.bigpic-review-box').show().animate({
            opacity: '1'
        }, 200);
    },
    reviewImgClose: function () { //关闭拍照预览
        $('.bigpic-review-box').animate({
            opacity: '0'
        }, 200, function () {
            $('.bigpic-review-box').hide()
        });
    }
};
$(document).on("pageshow", '#ImagingOperations-customerPp', function () {
    $("#frontPic").attr('picName', ImagingOperaTions.picName + 'Pic')
    $("#backPic").attr('picName', ImagingOperaTions.picName + 'Pic')
    if (creditJson.isPrev.YXCJisFromPrev) { //从下一页返回继续办理跳转此页面
        $('.img_content .camera-pic').remove();
        var img_boxLength = creditJson.storage.picFileARR.length;
        $.each(creditJson.storage.picFileARR, function (index, el) {
            if (index < 3 && el) {
                el = MT_path + el.split("/")[el.split("/").length - 1];
                $('.img_box:eq(' + index + ') .customer').find('.camera-pic').remove();
                $('.img_box:eq(' + index + ') .customer').append('<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">');
                $('.img_box:eq(' + index + ') .rephoto').text('重拍');
                $('.img_box:eq(' + index + ') .camera').hide();
            } else {
                if (!el) return true;
                el = MT_path + el.split("/")[el.split("/").length - 1];
                var activeEn = creditJson.storage.picFileMsgType[index - 3];
                $('<div class="img_box" style="position: relative;">' +
                '<div class="customer customer_six" picname="' + activeEn + '">' +
                '<div class="rephoto">重拍</div>' +
                '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/ style ="display:none">' +
                '<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">' +
                '</div>' + '<div class="img_notes">其他</div>').insertBefore('.img_box:last');

            }
        })
        //监测下一步是否可点击
        var ind = 0;
        for (var i = 0; i < 3; i++) {
            if ($('#ImagingOperations-customerPp .customer:eq(' + i + ')').find("img").length == 2) {
                ind++;
                if (ind >= 3) {
                    $('#ImagingOperations-customerPp-next').addClass('btn_next');
                } else {
                    $('#ImagingOperations-customerPp-next').removeClass('btn_next');
                }
            }
        }
    }
    //预览大图 点击关闭
    $('.bigpic-review-close').click(function (event) {
        imagingImageAcquisitionT.reviewImgClose();
    });
    //预览大图 删除图片
    $('.bigpic-review-del').click(function (event) {
        imagingImageAcquisitionT.delImg(imagingImageAcquisitionT.curParentObj, imagingImageAcquisitionT.imgSrc);
    });
    //预览大图 重新拍照
    $('.bigpic-review-rephone').click(function (event) {
        imagingImageAcquisitionT.reGetImg(imagingImageAcquisitionT.curParentObj, imagingImageAcquisitionT.imgSrc);
    });
    $('#ImagingOperations-customerPp .conter-con').on('click', '.customer', function (ev) {
        imagingImageAcquisitionT.curParentObj = $(this);
        imagingImageAcquisitionT.imgSrc = $(this).find('.camera-pic').attr('src');
        var oTarget = ev.target;
        if ($(this).find('.rephoto').html() == '重拍') { //重拍
            if ($(oTarget).hasClass('rephoto')) {
                imagingImageAcquisitionT.reGetImg(imagingImageAcquisitionT.curParentObj, imagingImageAcquisition.imgSrc);
            }
            if ($(oTarget).hasClass('camera-pic')) { //预览大图
                imagingImageAcquisitionT.imgSrc = $(oTarget).attr('src');
                imagingImageAcquisitionT.reviewImg($(oTarget).attr('src'));
            }
            return;
        }
        //拍照
        if (imagingImageAcquisitionT.curParentObj.parent().hasClass('get-face')) {
            imagingImageAcquisitionT.getFace(imagingImageAcquisitionT.curParentObj);
        } else {
            imagingImageAcquisitionT.getImg(imagingImageAcquisitionT.curParentObj);
        }

    });
    //点击上一步，跳转页面
    $('#ImagingOperations-customerPp-pre').on('click', function () {
        imagingCacheYXCJ("ImagingOperations-customerPp");
        $.mobile.changePage('ImagingOperations-readingID.html', {
            reverse: true
        });
    });
    //点击下一步
    $('#ImagingOperations-customerPp-next').on('click', function () {
        if (!$(this).hasClass('btn_next')) return;
        imagingCacheYXCJ("ImagingOperations-customerPp");

        if (ImagingOperaTions.BUSSINESS_TYPE == 'Y001') {//非个人开户
            $.mobile.changePage('ImagingOperations-messageIn.html');
        } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y003') {//非个人其他
            $.mobile.changePage('ImagingOperations-qitaMessageIn.html');
        } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y004') {//个人开户
            $.mobile.changePage('ImagingOperations-personMessageIn.html');
        } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y005') {//代理开户
            $.mobile.changePage('ImagingOperations-personAgencyKaihuMessageIn.html');
        } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y006') {//购买理财(个人)
            $.mobile.changePage('ImagingOperations-personBuyLicaiMessageIn.html');
        } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y007') {//购买保险(个人)
            $.mobile.changePage('ImagingOperations-personBuyBaoxianMessageIn.html');
        } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y009') {//代买理财(个人)
            $.mobile.changePage('ImagingOperations-personAgencyLicaiMessageIn.html');
        } else if (ImagingOperaTions.BUSSINESS_TYPE == 'Y008') {//其他(个人)
            $.mobile.changePage('ImagingOperations-personQitaMessageIn.html');
        }
    });
});
//打包影像
function imagingCacheYXCJ(id) {
    creditJson.storage.picFileARR = []; //要打包的影像路径
    //creditJson.storage.picFileInfoARR = [{
    //    "b": []
    //}]; //每个图片的名称和类型
    creditJson.storage.picFileMsgType = []; //其他图片对象的证明类型
    creditJson.storage.custFacePic = $('#' + id + ' .img_box:eq(0) .camera-pic:eq(0)').attr('src'); //客户面部照片
    creditJson.storage.frontIDCardPic = $('#' + id + ' .img_box:eq(1) .camera-pic:eq(0)').attr('src'); //身份证正面
    creditJson.storage.backIDCardPic = $('#' + id + ' .img_box:eq(2) .camera-pic:eq(0)').attr('src'); //身份证反面
    creditJson.storage.picFileARR.push(creditJson.storage.custFacePic, creditJson.storage.frontIDCardPic, creditJson.storage.backIDCardPic);
    var len = $('#' + id + ' .img_box').length;
    if (len - 3 > 0) {
        for (var i = 3; i < len; i++) {
            if ($('#' + id + ' .img_box:eq(' + i + ') .camera-pic').length > 0) {
                creditJson.storage.picFileARR.push($('#' + id + ' .img_box:eq(' + i + ') .camera-pic:eq(0)').attr('src'));

                creditJson.storage.picFileMsgType.push($('#' + id + ' .img_box:eq(' + i + ') .camera-pic:eq(0)').closest('.customer').attr('picname'));
            }
        }
    }
    //$.each(creditJson.storage.picFileARR, function (index, el) {
    //    if (!el) return true;
    //    var elIndex = el.lastIndexOf('\/') + 1;
    //    creditJson.storage.picFileInfoARR[0].b.push({
    //        FILE_NAME: el.substring(elIndex),
    //        FILE_TYPE: 'F0000'
    //    });
    //});
}
//判断是否联网状态 wifi环境
function onlineCheck(url) {
    if (commonJson.offlineOnline == 'online') {
        Meap.isNetConnect(function (msg) {
            if (msg == '01') {
                $.mobile.changePage(url);
            } else if (msg == '02') {
                showTags({
                    'title': '提示',
                    'content': '当前非WIFI网络，会消耗较多流量！是否继续办理？',
                    'ok': {
                        'title': '放弃',
                        'fun': function () {

                        }
                    },
                    'cancel': {
                        'title': '继续',
                        'fun': function () {
                            $.mobile.changePage(url);
                        }
                    }
                });
            }

        }, function (err) {
            funFail(err);
        })

    } else if (commonJson.offlineOnline == 'offline') {
        showTags({
            'title': '提示',
            'content': '脱机模式，是否继续办理？',
            'ok': {
                'title': '放弃',
                'fun': function () {

                }
            },
            'cancel': {
                'title': '继续',
                'fun': function () {
                    $.mobile.changePage(url);
                }
            }
        });
    }
}
//脱机状态 提交缓存脱机个人信息
function imagingCacheNoNetCustermerInfo() {
    if (creditJson.storage.image) {
        creditJson.storage.picFileAllARR.push(creditJson.storage.image);
    }

    var sendDataJson = {
        "databaseName": "myDatabase",
        "tableName": "nonetcustomer_info",
        "data": [{
            "BUSSINESSSTATUS": "脱机已受理",//业务状态
            "SUBMITTIME": myTime.CurTime(),//提交时间
            "deviceNo": commonJson.udId, //设备编号
            "moduleId": ImagingOperaTions.moduleId, //模块编号
            "tranId": ImagingOperaTions.tranId, //交易编号
            "orgId": commonJson.orgId, //机构号
            "operatorNo": commonJson.adminCount, //操作员
            "offlineOnline": "offline", //脱机/联机
            "ipadWorkAddress": commonJson.workAddress, //工作地址
            "BUSINESSTYPE": "视频拍摄", //业务类型
            "REMARK2": ImagingOperaTions.BUSSINESS_TYPE, //业务类型
            "REMARK3": ImagingOperaTions.PRODUCT_NO, //产品编号
            "REMARK4": ImagingOperaTions.PRODUCT_NAME, //产品名称

            "CERTTYPE": ImagingOperaTions.DOCUMENT_TYPE, //证件类型／法人
            "CERTNUM": ImagingOperaTions.DOCUMENT_ID, //证件号码／法人
            "MASCARDNAME": ImagingOperaTions.CLIENT_NAME, //姓名／法人
            "ACCT_NO": ImagingOperaTions.ACCT_NO, //帐卡号
            "CUSCARDAPPLY": ImagingOperaTions.tranMoney, //金额
            "DOC_TYPE": ImagingOperaTions.AGENT_DOC_TYPE, //经办人证件类型
            "CLIEMT_NO": ImagingOperaTions.AGENT_DOC_NO, //经办人证件号码
            "LEGAL_REP": ImagingOperaTions.AGENT_NAME, //经办人姓名

            "CLIENT_TYPE": ImagingOperaTions.CLIENT_TYPE, //客户类型
            "currency": ImagingOperaTions.currency, //币种

            "CREDIT_CODE": ImagingOperaTions.CREDIT_CODE, //统一社会信用代码
            "ORG_CODE": ImagingOperaTions.ORG_CODE, //组织机构代码
            "LICENSE": ImagingOperaTions.LICENSE, //营业执照或其他批文号
            "REMARK1": ImagingOperaTions.REMARK, //备注

            "UNITNAME": ImagingOperaTions.COMPNY_NAME, //公司名称

            "picFileARR": creditJson.storage.picFileAllARR.join("&&"), //要打包的所有路径
            "OFF_IMAGE_NO": ImagingOperaTions.OFF_IMAGE_NO, //脱机影音编号
            "BUSI_TYPE": '05' //区别nonetcustomer_info表中的类型  02是信用卡  05是运营影像
        }]
    };
    insertTableData(sendDataJson, function (msg) {
    }, function (err) {
        showMsg('存储脱机个人信息失败' + msg);
    });
}






