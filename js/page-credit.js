/**
 * 丁宗花－信用卡模块－2015-8-12
 * ssj－信用卡模块修改－2015-8-14
 */
//信用卡模块卡产品选择页面（credit-product.html）
$(document).on("pageshow", '#credit-product', function () {
    lianwanghechaData.dianzixinyongkaDX = "2";
    creditJson.storage = {}; //初始化存储字段
    creditJson.storage.offlineOnline = commonJson.offlineOnline; //联机/脱机  
    creditJson.storage.deviceNo = commonJson.udId; //设备编号
    creditJson.storage.moduleId = creditJson.moduleID //模块编号
    creditJson.storage.tranId = creditJson.tranId; //交易编号
    creditJson.storage.operatorNo = commonJson.adminCount; //登陆账号
    creditJson.storage.orgId = commonJson.orgId; //隶属机构
    creditJson.storage.TLRNAME = commonJson.TLRNAME; //操作员姓名
    creditJson.storage.SPRNUM = commonJson.SPRNUM; //信用卡用户 推广人编号
    creditJson.storage.TLRCELLPHONE = commonJson.TLRCELLPHONE; //操作员手机号码
    creditJson.storage.ipadWorkAddress = commonJson.workAddress; //工作地址
    creditJson.storage.faceRecogn = ''; //人脸识别状态
    creditJson.storage.dwORhj = '';
    creditJson.storage.resource = '';//消息来源    2 信用卡    1核心    0 meap
    //脱机模式 从本地数据库卡产品表里查询
    var isReRequest = true;
    if (creditJson.storage.offlineOnline != 'offline') { //非脱机状态
        getCurrentLocationCoordinateFun();              //缓存经纬度(校验联网)
        var myDate = myTime.curDate();
        var y = myDate.getFullYear();
        var m = (myDate.getMonth() + 1) > 9 ? (myDate.getMonth() + 1) : '0' + (myDate.getMonth() + 1);
        var d = myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate();
        var todayIs = y + '' + m + '' + d;
        if (todayIs == localStorage.spacetime) { //是否当天发的请求 不发送请求
            isReRequest = false;
        } else {
            localStorage.spacetime = todayIs;
            isReRequest = true;
        }
    }
    showLoader("加载中...");
    if (creditJson.storage.offlineOnline == 'offline' || !isReRequest) {
        queryTableDataByConditions({
            "databaseName": "myDatabase", //数据库名
            "tableName": "creditcard_type" //表名
        }, function (msg) {
            icardProductServiceDataSucc(msg);
        }, function (err) {
            funDataFail(err);
        });
        return;
    }
    var sendJson = {
        "b": [{
            //"offlineOnline":creditJson.storage.offlineOnline,//脱机/联机
            "orgId.s": creditJson.storage.orgId,
            "moduleId.s": creditJson.storage.moduleId, //模块编号
            "tranId.s": creditJson.storage.tranId, //交易编号
            "operatorNo.s": creditJson.storage.operatorNo, //操作员
            "deviceNo.s": creditJson.storage.deviceNo, //设备编号
            "CARDCLASS.s": "", //卡等级
            "CARDBRAND.s": "", //卡品牌
            "CARDTYPE.s": "", //卡类型
            "ISDUALCURR.s": "", //是否双币卡
            "DESC.s": "" //描述
        }]
    };
    icardProductServiceFun(sendJson, function (msg) {
        icardProductServiceSucc(msg);
    }, function (err) {
        queryTableDataByConditions({
            "databaseName": "myDatabase", //数据库名
            "tableName": "creditcard_type" //表名
        }, function (msg) {
            if (msg == '') {
                localStorage.spacetime = 1;
            }
        }, function (err) {
            funDataFail(err);
        });
        funFail(err);
    })
});


//信用卡－刷身份证 页面
$(document).on('pageshow', '#credit-readingID', function () {
    creditJson.isPrev = {};
    debitEnter.querySuss = false;
    // creditJson.isPrev.XXLRisFromPrev=false;//初始化信息录入上一页
    // creditJson.isPrev.YXCJisFromPrev=false;//初始化影像采集上一页
    //刷身份证
    $(".footter .previous").on('click', function () {
        creditReadCard(function () {
            $.mobile.changePage('credit-readID.html');
        }, function (err) {
            $.mobile.changePage('credit-readID.html');

        });
    })
    commonJson.isCustermerInfoMultiplex = false; //初始化影像复用 没有复用
    //点击影像复用
    $("#credit-readingID .conter-con .picRe").on('click', function () {
        $.mobile.changePage('credit-video.html');
    })
    //点击首页
    $("#credit-readingID .head-left").on('click', function () {
        $.mobile.changePage('../main.html');
    })
    //点击退出
    $("#credit-readingID .head-right").on('click', function () {
        $.mobile.changePage('credit-product.html');
    })
})
//影像复用页面（credit-video.html）
$(document).on("pageshow", '#credit-video', function () {
    //从数据库中查询可复用的个人信息
    queryAllcacheCustermerInfo();
    $('.previous-con').on('tap', function () {
        $.mobile.changePage('credit-readingID.html', {
            reverse: true
        });
    });
    $('#btn_next').on('tap', function () {
        if (!($(this).hasClass('btn_next'))) return;
        commonJson.isCustermerInfoMultiplex = true; //确定影像复用
        creditJson.storage.custAndCustOwnerPic = custermerInfo.custAndCustOwnerPic; //与客户合影照片
        creditJson.storage.frontIDCardPic = custermerInfo.frontIDCardPic; //身份证正面
        creditJson.storage.backIDCardPic = custermerInfo.backIDCardPic; //身份证反面
        $.mobile.changePage('credit-readID.html');
    });
});

//信用卡模块 刷身份证成功 身份证联网核查（credit-readID.html）
$(document).on("pageshow", '#credit-readID', function () {
    //点击下一步,跳转页面()
    $('#credit-readID-next').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;

        if (creditJson.isPrev.LLHCisFromPrev) {
            custermerInfo.name = creditJson.storage.MASCARDNAME;
            custermerInfo.sex = creditJson.storage.SEX;
            custermerInfo.nation = creditJson.storage.NATION;
            custermerInfo.birthday = creditJson.storage.BIRTH;
            custermerInfo.address = creditJson.storage.ADDRESS;
            custermerInfo.cerNO = creditJson.storage.CERTNUM;
            custermerInfo.issAuthority = creditJson.storage.ISSAUTHORITY;
            custermerInfo.cerExpdDt = creditJson.storage.CERTVALIDDATE;
            custermerInfo.image = creditJson.storage.image;
            custermerInfo.checkPhoto = creditJson.storage.checkPhoto;

        } else {
            creditJson.storage.MASCARDNAME = custermerInfo.name;
            creditJson.storage.SEX = custermerInfo.sex;
            creditJson.storage.NATION = custermerInfo.nation;
            creditJson.storage.BIRTH = custermerInfo.birthday;
            creditJson.storage.ADDRESS = custermerInfo.address;
            creditJson.storage.CERTNUM = custermerInfo.cerNO;
            creditJson.storage.ISSAUTHORITY = custermerInfo.issAuthority;
            creditJson.storage.CERTVALIDDATE = custermerInfo.cerExpdDt;
            creditJson.storage.image = custermerInfo.image;
            creditJson.storage.checkPhoto = custermerInfo.checkPhoto;
        }

        creditJson.storage.CLIENT_NO = ''; //客户号初始化 
        if (creditJson.storage.offlineOnline == 'offline' || creditJson.isPrev.LLHCisFromPrev) { //脱机模式
            $.mobile.changePage('credit-agreement.html');
            return;
        }
        icustomerInfoServiceCreditREADIDNEXTFun();
    });
    //重新读取
    $('.footter .previous:eq(0)').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        $.mobile.changePage('credit-readingID.html', {
            reverse: true
        });
    });
    if (creditJson.isPrev.LLHCisFromPrev) {
        $('.pic_suc').html('身份证读取成功!');
        $('.sh_loading_box_shadow').remove();
        $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
        $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
        $('.footter .previous:eq(1)').addClass('btn_next');
        $(".ziduan-value:eq(0)").text(custermerInfo.name);
        $(".ziduan-value:eq(1)").text(custermerInfo.sex);
        $(".ziduan-value:eq(2)").text(custermerInfo.nation);
        $(".ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
        $(".ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
        $(".ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
        $(".ziduan-value:eq(6)").text(custermerInfo.address);
        $(".ziduan-value:eq(7)").text(custermerInfo.cerNO);
        $(".ziduan-value:eq(8)").text(custermerInfo.issAuthority);
        $(".ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
        $('.sfz-img').attr('src', custermerInfo.image);
        return;
    }
    if (creditJson.isReadCardSucc || commonJson.isCustermerInfoMultiplex) { //读卡成功
        lianwanghechaData.dianzixinyongkaDX = "2";
        creditReadCardSucc({
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "orgId.s": commonJson.orgId,
                "moduleId.s": creditJson.storage.moduleId, //模块编号
                "tranId.s": creditJson.storage.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "DOCUMENT_TYPE.s": "0", //证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号码
                "CLIENT_NAME.s": custermerInfo.name, //被核对人姓名
                "BUSSINESSCODE.s": "01", //业务总类
                "BRANCH_ID.s": commonJson.orgId //机构号
            }]
        });
    } else {
        creditReadCardFail();
    }
    $(".lianwanghecha-chongxin").on("click", function () {//重新联网核查
        showLoader('信息查询中...');
        lianwanghechaData.dianzixinyongkaDX = "2";
        $(".lianwanghecha-yichang").hide();
        creditReadCardSucc({
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "orgId.s": commonJson.orgId,
                "moduleId.s": creditJson.storage.moduleId, //模块编号
                "tranId.s": creditJson.storage.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "DOCUMENT_TYPE.s": "0", //证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号码
                "CLIENT_NAME.s": custermerInfo.name, //被核对人姓名
                "BUSSINESSCODE.s": "01", //业务总类
                "BRANCH_ID.s": commonJson.orgId //机构号
            }]
        });
    });
    $(".lianwanghecha-jixu").on("click", function () {//继续业务办理
        $(".lianwanghecha-yichang").hide();

        if (creditJson.isPrev.LLHCisFromPrev) {
            custermerInfo.name = creditJson.storage.MASCARDNAME;
            custermerInfo.sex = creditJson.storage.SEX;
            custermerInfo.nation = creditJson.storage.NATION;
            custermerInfo.birthday = creditJson.storage.BIRTH;
            custermerInfo.address = creditJson.storage.ADDRESS;
            custermerInfo.cerNO = creditJson.storage.CERTNUM;
            custermerInfo.issAuthority = creditJson.storage.ISSAUTHORITY;
            custermerInfo.cerExpdDt = creditJson.storage.CERTVALIDDATE;
            custermerInfo.image = creditJson.storage.image;
            custermerInfo.checkPhoto = creditJson.storage.checkPhoto;

        } else {
            creditJson.storage.MASCARDNAME = custermerInfo.name;
            creditJson.storage.SEX = custermerInfo.sex;
            creditJson.storage.NATION = custermerInfo.nation;
            creditJson.storage.BIRTH = custermerInfo.birthday;
            creditJson.storage.ADDRESS = custermerInfo.address;
            creditJson.storage.CERTNUM = custermerInfo.cerNO;
            creditJson.storage.ISSAUTHORITY = custermerInfo.issAuthority;
            creditJson.storage.CERTVALIDDATE = custermerInfo.cerExpdDt;
            creditJson.storage.image = custermerInfo.image;
            creditJson.storage.checkPhoto = custermerInfo.checkPhoto;
        }

        creditJson.storage.CLIENT_NO = ''; //客户号初始化 
        if (creditJson.storage.offlineOnline == 'offline' || creditJson.isPrev.LLHCisFromPrev) { //脱机模式
            $.mobile.changePage('credit-agreement.html');
            return;
        }
        icustomerInfoServiceCreditREADIDNEXTFun();
    });
    $(".lianwanghecha-tuichu").on("click", function () {//退出
        $.mobile.changePage('credit-product.html', {transition: "slide"});
        $(".lianwanghecha-yichang").hide();
    });
});


//信用卡模块阅读协议页面（credit-agreement.html）
$(document).on("pageshow", '#credit-agreement', function () {
    //从数据库查询产品代码为creditJson.storage.PRODUCTCD的协议
    queryTableDataByConditions({
        "databaseName": "myDatabase", //数据库名
        "tableName": "creditcard_type", //表名
        "conditions": {
            "PRODUCTCD": creditJson.storage.PRODUCTCD
        }
    }, function (msg) {
        var PROTOCOL = msg[0].PROTOCOL.replace(/;;;a;&nbsp;a;;;/g, "'");
        $('.agree-content').html(PROTOCOL);
    }, function (err) {
        showMsg('查询数据库失败' + msg);
    });
    if (creditJson.isPrev.YDXYisFromPrev) {
        $('#ic-disagree').css('display', 'none');
        $('#ic-agree').css('display', 'inline-block');
        $('#credit-agreement-next').addClass('btn_next');
    } else {
        $('#ic-agree').css('display', 'none');
        $('#ic-disagree').css('display', 'inline-block');
        $('#credit-agreement-next').removeClass('btn_next');
    }
   // $('.agree-content').html(creditJson.storage.PRODUCTCD);
    //同意协议勾选
    $('#xk-agree-btn').on("click", function () {
        var dis = $('#ic-disagree').css('display');
        //console.log(dis);
        if (dis != 'none') {
            $('#ic-disagree').css('display', 'none');
            $('#ic-agree').css('display', 'inline-block');
            $('#credit-agreement-next').addClass('btn_next');
        } else {
            $('#ic-agree').css('display', 'none');
            $('#ic-disagree').css('display', 'inline-block');
            $('#credit-agreement-next').removeClass('btn_next');
        }
    });
    //点击下一步，跳转页面
    $('#credit-agreement-next').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        creditJson.isPrev.YDXYisFromPrev = true
        $.mobile.changePage('credit-customerP.html', {
            transition: "slide"
        });
        //$.mobile.changePage('credit-card.html', { transition: "slide" });
    });
    //点击上一步，跳转页面
    $('#credit-agreement-back').on('click', function () {
        //重置身份证及影像复用信息
//      custermerInfo.name = creditJson.storage.MASCARDNAME;
//      custermerInfo.sex = creditJson.storage.SEX;
//      custermerInfo.nation = creditJson.storage.NATION;
//      custermerInfo.birthday = creditJson.storage.BIRTH;
//      custermerInfo.address = creditJson.storage.ADDRESS;
//      custermerInfo.cerNO = creditJson.storage.CERTNUM;
//      custermerInfo.issAuthority = creditJson.storage.ISSAUTHORITY;
//      custermerInfo.cerExpdDt = creditJson.storage.CERTVALIDDATE;
//      custermerInfo.image = creditJson.storage.image;
//      custermerInfo.checkPhoto = creditJson.storage.checkPhoto;
//      creditJson.isPrev.LLHCisFromPrev = true;
//      if ($('#ic-disagree').css('display') != 'none') { //同意
//          creditJson.isPrev.YDXYisFromPrev = false; //阅读协议未勾选同意
//      } else {
//          creditJson.isPrev.YDXYisFromPrev = true; //阅读协议勾选同意
//      }
        $.mobile.changePage('credit-readingID.html', {
            reverse: true
        });
    });
});
var creditImageAcquisition = {
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
            for (var i = 0; i < 5; i++) {
                if ($('#credit-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 5) {
                        $('#credit-customerP-next').addClass('btn_next');
                    } else {
                        $('#credit-customerP-next').removeClass('btn_next');
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
            creditImageAcquisition.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');
            /*
             if (curParentObj.find('.cameraMul').length > 0) { //如果是其他证明
             var htmltext = "";
             htmltext += '<div class="img_box">' +
             '<div class="customer customer_five">' +
             '<div class="rephoto">选拍，可多张拍摄</div>' +
             '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/>' +
             '</div>' +
             '<div class="img_notes qitazhengming">其他证明</div>' +
             '</div>';
             $('#credit-customerP .img_content').append(htmltext);

             }*/
            //监测下一步是否可点击
            var ind = 0;
            for (var i = 0; i < 5; i++) {
                if ($('#credit-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 5) {
                        $('#credit-customerP-next').addClass('btn_next');
                    } else {
                        $('#credit-customerP-next').removeClass('btn_next');
                    }
                }
                ;
            }
        }, function (err) {
            showMsg(err);
        })
    },
    getImg: function (curParentObj) { //拍照
        if ($('#credit-customerP .cameraMul').length == 16) {
            $('#credit-customerP .cameraMul').eq(15).parents(".img_box").remove();
            showTags({
                'title': '提示',
                'content': "拍摄照片已到最大限度[最大限度为20张]",
                'ok': {}
            });
            return;

        }
        Meap.media('camera', curParentObj.attr('picname'), function (msg) {
            creditJson.isPrev.LLDBisFromPrev = false;
            creditImageAcquisition.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.find('.camera-pic').remove();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');
            var ele = $('.img_box:last').find('.rephoto').text();
            if (curParentObj.find('.cameraMul').length > 0 && ele != '选拍，可多张拍摄') { //如果是其他证明

                var htmltext = "";
                /* htmltext += '<div class="img_box">' +
                 '<div class="customer customer_five">' +
                 '<div class="rephoto">选拍，可多张拍摄</div>' +
                 '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/>' +
                 '</div>' +
                 '<div class="img_notes qitazhengming">其他证明</div>' +
                 '</div>';*/
                htmltext += '<div class="img_box" style="position: relative;">' +
                '<div class="customer customer_six" picName="qitazhengming">' +
                '<div class="rephoto">选拍，可多张拍摄</div>' +
                '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/>' +
                '</div>' +
                '<div class="img_notes qitazhengming" othername="qitazhengming">其他证明</div>' +
                '<div class="qita-tanchuang-cbg"></div>' +
                '<img src="../../images/crow_icon_win.png" class="crow_icon_win" />' +
                '<div class="qita-tanchuang-con">' +
                '<div class="queren-quxiao">' +
                '<div class="quxiao-ok quxiao-click">取消</div>' +
                '<div class="quxiao-ok queding-click">确定</div>' +
                '</div>' +
                '<ul class="qita-tanchuang-ul">' +
                '<li othername="fangchanzhengming">房产证明</li>' +
                '<li othername="gongzuozhengming">工作证明</li>' +
                '<li othername="xuelizhengming">学历证明</li>' +
                '<li othername="cunkuanzhengming">存款证明</li>' +
                '<li othername="shebaozhengming">社保证明</li>' +
                '<li othername="qitaxinyongka">他行信用卡</li>' +
                '<li othername="cheliangzhengming">车辆证明</li>' +
                '<li othername="qitazhengming" class="qita-tanchuang-li">其他证明</li>' +
                '</ul>' +
                '</div>' +
                '</div>';
                $('#credit-customerP .img_content').append(htmltext).trigger("create");

            } else {

            }
            //监测下一步是否可点击
            var ind = 0;
            for (var i = 0; i < 5; i++) {
                if ($('#credit-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 5) {
                        $('#credit-customerP-next').addClass('btn_next');
                    } else {
                        $('#credit-customerP-next').removeClass('btn_next');
                    }
                }
                ;
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
                    creditImageAcquisition.imgSrc = returnGetMsg;
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
                    creditImageAcquisition.imgSrc = returnGetMsg;
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
}
//信用卡模块影像采集页面（credit-customerP.html）
$(document).on('pageshow', '#credit-customerP', function () {
    //点击其他证明
    $('#credit-customerP .conter-con').on('click', '.qitazhengming', function (ev) {
        if ($('.qita-tanchuang-con').css('display') == 'none') {
            creditImageAcquisition.curParentObj = $(this).siblings('.customer');
            $(this).siblings('.qita-tanchuang-con').show();
            $(this).siblings('.crow_icon_win').show();
            $(this).siblings('.qita-tanchuang-cbg').show();
            var othername = $(this).attr('othername');
            $(this).siblings('.qita-tanchuang-con').find('li').removeClass('qita-tanchuang-li');
            $(this).siblings('.qita-tanchuang-con').find('li[othername=' + othername + ']').addClass('qita-tanchuang-li');
        }

    });
    $('#credit-customerP .conter-con').on('click', '.qita-tanchuang-ul>li', function (ev) {
        $(this).addClass('qita-tanchuang-li').siblings('li').removeClass('qita-tanchuang-li');
    });
    $('#credit-customerP .conter-con').on('click', '.quxiao-click', function (ev) { //点击取消关闭下拉框
        $('.qita-tanchuang-con').hide();
        $('.qita-tanchuang-cbg').hide();
        $('.crow_icon_win').hide();
    });

    $('#credit-customerP .conter-con').on('click', '.queding-click', function (ev) { //点击确认选择
        $('.qita-tanchuang-con').hide();
        $('.qita-tanchuang-cbg').hide();
        $('.crow_icon_win').hide();
        var textHtml = $(this).closest('.qita-tanchuang-con').find('li.qita-tanchuang-li').html();
        var othername = $(this).closest('.qita-tanchuang-con').find('li.qita-tanchuang-li').attr('othername');
        $(this).closest('.qita-tanchuang-con').siblings('.qitazhengming').html(textHtml).attr('othername', othername);
        if (creditImageAcquisition.curParentObj.attr('picname') != othername) {
            creditImageAcquisition.curParentObj.attr('picname', othername);
            if (creditImageAcquisition.curParentObj.find('.camera-pic').length > 0) {
                creditImageAcquisition.imgSrc = creditImageAcquisition.curParentObj.find('.camera-pic').attr('src');
                deletePhoto([creditImageAcquisition.imgSrc], function (msg) {
                    creditImageAcquisition.curParentObj.find('.camera-pic').remove();
                    creditImageAcquisition.curParentObj.find('.camera').show();
                    creditImageAcquisition.curParentObj.find('.rephoto').html('必拍');
                    //监测下一步是否可点击
                    var ind = 0;
                    for (var i = 0; i < 5; i++) {
                        if ($('#credit-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                            ind++;
                            if (ind >= 5) {
                                $('#credit-customerP-next').addClass('btn_next');
                            } else {
                                $('#credit-customerP-next').removeClass('btn_next');
                            }
                        }
                        ;
                    }
                }, function (err) {

                })
            }


            //creditImageAcquisition.reGetImg(creditImageAcquisition.curParentObj, creditImageAcquisition.imgSrc);
        }
    });
    if (creditJson.isPrev.YXCJisFromPrev || workbenchJson.isTemp) { //从下一页返回或者暂存继续办理跳转此页面
        if (workbenchJson.isTemp) {
            if (workbenchJson.temp.TEMPFROM == 'credit-customerP.html') {
                creditJson.storage = workbenchJson.temp;
                creditJson.storage.picFileARR = creditJson.storage.picFileARR.split("&&"); //要打包的影像路径
                creditJson.storage.picFileMsgType = creditJson.storage.picFileMsgType.split("&&"); //其他图片对象的证明类型
                creditJson.storage.picFileInfoARR = JSON.parse(creditJson.storage.picFileInfoARR); //每个图片的名称和类型
                creditJson.isPrev.XXLRisFromPrev = false;
                creditJson.isPrev.LLDBisFromPrev = false;
                commonJson.longitude = creditJson.storage.REMARK;//工作轨迹的经度
                commonJson.latitude = creditJson.storage.REMARK2;//工作轨迹的纬度
            }
        }
        workbenchJson.isTemp = false;
        $('.img_content .camera-pic').remove();
        var img_boxLength = creditJson.storage.picFileARR.length;
        $.each(creditJson.storage.picFileARR, function (index, el) {
            if (index < 5 && el) {
                el = MT_path + el.split("/")[el.split("/").length - 1];
                $('.img_box:eq(' + index + ') .customer').find('.camera-pic').remove()
                $('.img_box:eq(' + index + ') .customer').append('<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">');
                $('.img_box:eq(' + index + ') .rephoto').text('重拍');
                $('.img_box:eq(' + index + ') .camera').hide();
            } else {
                if (!el) return true;
                el = MT_path + el.split("/")[el.split("/").length - 1];
                var activeEn = creditJson.storage.picFileMsgType[index - 5];
                $('<div class="img_box" style="position: relative;">' +
                '<div class="customer customer_six" picname="' + activeEn + '">' +
                '<div class="rephoto">重拍</div>' +
                '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/ style ="display:none">' +
                '<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">' +
                '</div>' +
                '<div class="img_notes qitazhengming" othername="qitazhengming">其他证明</div>' +
                '<div class="qita-tanchuang-cbg"></div>' +
                '<img src="../../images/crow_icon_win.png" class="crow_icon_win" />' +
                '<div class="qita-tanchuang-con">' +
                '<div class="queren-quxiao">' +
                '<div class="quxiao-ok quxiao-click">取消</div>' +
                '<div class="quxiao-ok queding-click">确定</div>' +
                '</div>' +
                '<ul class="qita-tanchuang-ul">' +
                '<li othername="fangchanzhengming">房产证明</li>' +
                '<li othername="gongzuozhengming">工作证明</li>' +
                '<li othername="xuelizhengming">学历证明</li>' +
                '<li othername="cunkuanzhengming">存款证明</li>' +
                '<li othername="shebaozhengming">社保证明</li>' +
                '<li othername="qitaxinyongka">他行信用卡</li>' +
                '<li othername="cheliangzhengming">车辆证明</li>' +
                '<li othername="qitazhengming">其他证明</li>' +
                '</ul>' +
                '</div>' +
                '</div>').insertBefore('.img_box:last');

                var activeName = $('.img_box:last').find('li[othername="' + activeEn + '"]').text();
                $('.img_box:last').prev().find('.img_notes').attr('othername', activeEn).text(activeName);

            }
        })
        //监测下一步是否可点击
        var ind = 0;
        for (var i = 0; i < 5; i++) {
            if ($('#credit-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                ind++;
                if (ind >= 5) {
                    $('#credit-customerP-next').addClass('btn_next');
                } else {
                    $('#credit-customerP-next').removeClass('btn_next');
                }
            }
            ;
        }
    } else if (commonJson.isCustermerInfoMultiplex) {
        queryTableDataByConditions({
            "databaseName": "myDatabase",
            "tableName": "customer_info",
            "conditions": {
                "SUBMITTIME": "between " + commonJson.submitTime + " and " + commonJson.submitTime
            }
        }, function (msg) {
            var CUSTANDCUSTOWNERPICBase64 = msg[0].CUSTANDCUSTOWNERPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');
            var FRONTIDCARDPICBase64 = msg[0].FRONTIDCARDPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');
            var BACKIDCARDPICBase64 = msg[0].BACKIDCARDPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');

            //与客户合影base64转路径
			if(CUSTANDCUSTOWNERPICBase64 != '<null>'){
				Meap.transFormImage(getYMDHMSM('custAndCustOwnerPic') + creditJson.storage.deviceNo, CUSTANDCUSTOWNERPICBase64, 'picSty', function (msg1) {
		            $('.img_box:eq(1) .customer').append('<img src="' + msg1 + '" width="100%" height="115px" class="camera-pic">');
		       		$('.img_box:eq(1) .rephoto').text('重拍');
		       		$('.img_box:eq(1) .camera').hide();
				}, function (err) {
		            showMsg('与客户合影base64转路径失败');
		        })
			}
            
            //身份证正面base64转路径
            Meap.transFormImage(getYMDHMSM('frontIDCardPic') + creditJson.storage.deviceNo, FRONTIDCARDPICBase64, 'picSty', function (msg2) {
                $('.img_box:eq(3) .customer').append('<img src="' + msg2 + '" width="100%" height="115px" class="camera-pic">');
            }, function (err) {
                showMsg('身份证正面base64转路径失败');
            })
            //身份证反面base64转路径
            Meap.transFormImage(getYMDHMSM('backIDCardPic') + creditJson.storage.deviceNo, BACKIDCARDPICBase64, 'picSty', function (msg3) {
                $('.img_box:eq(4) .customer').append('<img src="' + msg3 + '" width="100%" height="115px" class="camera-pic">');

            }, function (err) {
                showMsg('身份证反面base64转路径失败');
            })
            $('.img_box:eq(3) .rephoto,.img_box:eq(4) .rephoto').text('重拍');
            $('.img_box:eq(3) .camera,.img_box:eq(4) .camera').hide();
        }, function (err) {

        })
    }
    //预览大图 点击关闭
    $('.bigpic-review-close').click(function (event) {
        creditImageAcquisition.reviewImgClose();
    });
    //预览大图 删除图片
    $('.bigpic-review-del').click(function (event) {
        creditImageAcquisition.delImg(creditImageAcquisition.curParentObj, creditImageAcquisition.imgSrc);
    });
    //预览大图 重新拍照
    $('.bigpic-review-rephone').click(function (event) {
        creditImageAcquisition.reGetImg(creditImageAcquisition.curParentObj, creditImageAcquisition.imgSrc);
    });
    $('#credit-customerP .conter-con').on('click', '.customer', function (ev) {
        creditImageAcquisition.curParentObj = $(this);
        creditImageAcquisition.imgSrc = $(this).find('.camera-pic').attr('src');
        var oTarget = ev.target;
        if ($(this).find('.rephoto').html() == '重拍') { //重拍
            if ($(oTarget).hasClass('rephoto')) {
                creditImageAcquisition.reGetImg(creditImageAcquisition.curParentObj, creditImageAcquisition.imgSrc);
            }
            if ($(oTarget).hasClass('camera-pic')) { //预览大图
                creditImageAcquisition.imgSrc = $(oTarget).attr('src');
                creditImageAcquisition.reviewImg($(oTarget).attr('src'));
            }
            return;
        }
        //拍照
        if (creditImageAcquisition.curParentObj.parent().hasClass('get-face')) {
            creditImageAcquisition.getFace(creditImageAcquisition.curParentObj);
        } else {
            creditImageAcquisition.getImg(creditImageAcquisition.curParentObj);
        }

    })
    //点击上一步，跳转页面
    $('#credit-customerP-pre').on('click', function () {
        creditJson.isPrev.YDXYisFromPrev = true;
        creditJson.isPrev.YXCJisFromPrev = true;
        cacheYXCJ(); //缓存的影像字段
        $.mobile.changePage('credit-agreement.html', {
            reverse: true
        });
    });
    //点击下一步
    $('#credit-customerP-next').on('click', function () {
        if (!$(this).hasClass('btn_next')) return;
        creditJson.storage.picFileARR = []; //要打包的影像路径
        creditJson.storage.picFileInfoARR = [{
            "b": []
        }];
        ; //每个图片的名称和类型
        creditJson.storage.picFileMsgType = []; //其他图片对象的证明类型
        creditJson.storage.custFacePic = $('#credit-customerP .img_box:eq(0) .camera-pic:eq(0)').attr('src'); //客户面部照片
        creditJson.storage.custAndCustOwnerPic = $('#credit-customerP .img_box:eq(1) .camera-pic:eq(0)').attr('src'); //与客户合影照片
        creditJson.storage.custAuthPic = $('#credit-customerP .img_box:eq(2) .camera-pic:eq(0)').attr('src'); //抄录内容照片
        creditJson.storage.frontIDCardPic = $('#credit-customerP .img_box:eq(3) .camera-pic:eq(0)').attr('src'); //身份证正面
        creditJson.storage.backIDCardPic = $('#credit-customerP .img_box:eq(4) .camera-pic:eq(0)').attr('src'); //身份证反面
        creditJson.storage.picFileARR.push(creditJson.storage.custFacePic, creditJson.storage.custAndCustOwnerPic, creditJson.storage.custAuthPic, creditJson.storage.frontIDCardPic, creditJson.storage.backIDCardPic);
        var len = $('#credit-customerP .img_box').length;
        if (len - 5 > 0) {
            for (var i = 5; i < len; i++) {
                if ($('#credit-customerP .img_box:eq(' + i + ') .camera-pic').length > 0) {
                    creditJson.storage.picFileARR.push($('#credit-customerP .img_box:eq(' + i + ') .camera-pic:eq(0)').attr('src'));
                    creditJson.storage.picFileMsgType.push($('#credit-customerP .img_box:eq(' + i + ') .camera-pic:eq(0)').closest('.customer').attr('picname'));
                }
            }
        }
        $.each(creditJson.storage.picFileARR, function (index, el) {
            if (!el) return true;
            var elIndex = el.lastIndexOf('\/') + 1;
            creditJson.storage.picFileInfoARR[0].b.push({
                FILE_NAME: el.substring(elIndex),
                FILE_TYPE: 'F0000'
            });
        });
        workbenchJson.temp.TEMPFROM = ''; //暂存来源初始化
        // creditJson.picFileInfoARR=[{FILE_NAME:'',FILE_TYPE:''}];
        //if (creditJson.storage.offlineOnline == 'offline' || creditJson.isPrev.LLDBisFromPrev) {
        //    $.mobile.changePage('credit-card.html');
        //} else {
        //    $.mobile.changePage('credit-personFace.html');
        //}
        //named by lei to 是否需要补充资料补充资料
        showTags({
            'title': '提示',
            'content': '请确认客户申请资料是否需要提交后补充?',
            'ok': {
                'title': '需要',
                fun: function () {
                    creditJson.storage.lAddData = '-5';  //标识 客户申请资料补充
                    if (creditJson.storage.offlineOnline == 'offline' || creditJson.isPrev.LLDBisFromPrev) {
                        $.mobile.changePage('credit-card.html');
                    } else {
                        $.mobile.changePage('credit-personFace.html');
                    }
                }
            },
            'cancel': {
                'title': '不需要',
                fun: function () {
                    creditJson.storage.lAddData = '';//标识 客户申请资料补充
                    if (creditJson.storage.offlineOnline == 'offline' || creditJson.isPrev.LLDBisFromPrev) {
                        $.mobile.changePage('credit-card.html');
                    } else {
                        $.mobile.changePage('credit-personFace.html');
                    }
                }
            }
        });
    });
    //点击暂存
    $('.customerP-zancun').on('click', function () {
        $(this).css('display','none');
        creditJson.isPrev = {};
        cacheYXCJ(); //缓存的影像字段
        creditZanCunCustermerInfoYX('信用卡');
        $.mobile.changePage('../main.html', {
            reverse: true
        });
        /* Act on the event */
    });

});
//人脸对比(credit-personFace.html)
$(document).on("pageshow", "#credit-personFace", function () {
    creditJson.isPrev.LLDBisFromPrev = false; //如果点击了继续或者从信息录入页面返回 则下次不用进入两两对比页面 否则都是要进入两两对比
    $("#credit-personFace .camera:eq(0)").attr('src', creditJson.storage.custFacePic);
    $("#credit-personFace .camera:eq(1)").attr('src', MT_path + creditJson.storage.image.split("/")[creditJson.storage.image.split("/").length - 1]);
    $("#credit-personFace .camera:eq(2)").attr('src', creditJson.storage.custFacePic);
    if (lianwanghechaData.CheckResult == '09' || lianwanghechaData.CheckResult == '02') {
        $("#credit-personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + creditJson.storage.checkPhoto);
    } else {
        $("#credit-personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + creditJson.storage.checkPhoto);
    }
    //点击继续
    $('#credit-personFace .previous:last').on('click', function () {
        if ($(this).hasClass('btn_next')) {
            if ($("#credit-personFace .face-result:eq(0)").text() == '通过' && $("#credit-personFace .face-result:eq(1)").text() == '通过') {
                creditJson.storage.faceRecogn = '1'; //自动通过
            } else if ($("#credit-personFace .face-result:eq(0)").text() == '不通过' && $("#credit-personFace .face-result:eq(1)").text() == '不通过') {
                creditJson.storage.faceRecogn = '2' //自动不通过
            } else {
                creditJson.storage.faceRecogn = '5'; //手动通过
            }
            creditJson.isPrev.LLDBisFromPrev = true;
            $.mobile.changePage('credit-card.html');
        }
    });
    //点击F放弃
    $('#credit-personFace .previous:first').on('click', function () {
        creditJson.storage.faceRecogn = '6'; //手动不通过
        creditJson.isPrev.YXCJisFromPrev = true;
        creditJson.isPrev.LLDBisFromPrev = false;
        $.mobile.changePage('credit-customerP.html', {
            reverse: true
        });
    });
    showLoader("影像对比中...");
    transFormBase64(creditJson.storage.custFacePic, function (msg) { //面部图片转base64
        creditJson.storage.custFacePicBase64 = msg;
        transFormBase64(creditJson.storage.image, function (msg1) { //身份证图片转base64
            creditJson.storage.imageBase64 = msg1;

            var sendJson = {
                "b": [{
                    "offlineOnline.s": creditJson.storage.offlineOnline, //脱机/联机
                    "workAddress.s": creditJson.storage.ipadWorkAddress, //工作地址
                    "orgId.s": creditJson.storage.orgId, //机构号
                    "moduleId.s": creditJson.storage.moduleId, //模块编号
                    "tranId.s": creditJson.storage.tranId, //交易编号
                    "operatorNo.s": creditJson.storage.operatorNo, //操作员
                    "deviceNo.s": creditJson.storage.deviceNo, //设备编号
                    "OPERATOR_NO.s": creditJson.storage.operatorNo, //业务经办人工号
                    "TRANS_SCENE.s": "0002", //交易场景 电子卡0006
                    "COMPARE_TYPE.s": "2", //    比对类型1-客户经理比对，2-客户比对
                    "WS_TYPE.s": "2", // 终端类型1-PC，2-IOS，3-Android
                    "WSNO.s": creditJson.storage.deviceNo, //    终端号
                    "VERSION.s": "v1.1.4", //当前控件版本
                    "TRANS_CHANNEL.s": "301", //   渠道301
                    "ID_CARD.s": creditJson.storage.CERTNUM, // 身份证号码
                    "IMG_BASE.s": creditJson.storage.custFacePicBase64, //      现场照片
                    "CRYPT_TYPE.s": "0", //   图像是否经过加密0-未加密，1-加密方式一，2加密方式二
                    "ID_IMG_BASE.s": creditJson.storage.checkPhoto, //联网核查照片
                    "CARD_IMG_BASE.s": creditJson.storage.imageBase64, //  芯片照片
                    "BUSI_TYPE.s": "02" //  信用卡02

                }]
            };
            ifacelRecognitionSeFun(sendJson, function (msg) {
                IFacelRecognitionServiceCreditSucc(msg);
            }, function (err) {
                $("#credit-personFace .center-header").text('人脸识别失败！');
                $("#credit-personFace .face-result:eq(0)").addClass('no-pass').text('未通过');
                $("#credit-personFace .face-result:eq(1)").addClass('no-pass').text('未通过');
                $('#credit-personFace .previous:last').addClass('btn_next');
                funFail(err);
            })

        }, function (err) {
            alert('影像转换失败！')
        })
    }, function (err) {
        alert('影像转换失败！')
    })

    //影像两两对比
//      setTimeout(function() {

//      }, 200)


})
//信用卡信息录入页面(credit-card.html)
var creditSessionInvalid = false;
$(document).on("pageshow", "#card-f-o", function () {
    creditSessionInvalid = false;
    //初始化select二级三级联动
    _init_area();
    _init_area_();
    $('#day_b').change(function () {
        if ($(this).val() == '深圳市') {
            $('#day_a,#day_b').attr('disabled', 'disabled');
            $('#ic_agree').show().siblings('#ic_disagree').hide();
        } else {
            $('#day_a,#day_b').removeAttr('disabled');
            $('#ic_agree').hide().siblings('#ic_disagree').show();
        }
    })
    $(".agree_btn_boxtwo").on("click", function () {
        if ($("#none_yihun").css("display") == 'none') {
            $("#none_weihun").hide().siblings("#none_yihun").show();
        } else {
            $("#none_yihun").hide().siblings("#none_weihun").show();
        }
    });
    if (creditJson.isPrev.XXLRisFromPrev || workbenchJson.isTemp) {
        if (workbenchJson.temp.TEMPFROM == 'credit-card.html') {
            creditJson.isPrev.LLDBisFromPrev = false;
            creditJson.storage = workbenchJson.temp; //业务线索--卡产品代码PRODUCTCD
            creditJson.storage.resource=workbenchJson.temp.REMARK5;
            workbenchJson.temp = {};
            creditJson.storage.picFileARR = creditJson.storage.picFileARR.split("&&"); //要打包的影像路径
            creditJson.storage.picFileMsgType = creditJson.storage.picFileMsgType.split("&&"); //其他图片对象的证明类型
            creditJson.storage.picFileInfoARR = JSON.parse(creditJson.storage.picFileInfoARR); //每个图片的名称和类型
            commonJson.longitude = creditJson.storage.REMARK;//工作轨迹的经度
            commonJson.latitude = creditJson.storage.REMARK2;//工作轨迹的纬度
        }
        workbenchJson.isTemp = false;
        $('#c-name').text(creditJson.storage.MASCARDNAME); //姓名
        $('#c-sex').text(creditJson.storage.SEX); //性别
        $('#c-en-xing').val(creditJson.storage.BRAFULLNAMEX); //拼音姓
        $('#c-en-ming').val(creditJson.storage.BRAFULLNAMEM); //拼音名
        $('#c-cerNO').text(creditJson.storage.CERTNUM); //证件号码
        $('#c-cerExpdDt').text(creditJson.storage.CERTVALIDDATE); //有效期截止日
        $('#c-birthday').html(creditJson.storage.BIRTH); //出生日期
        $('#c-edu').val(creditJson.storage.EDUCATION).selectmenu('refresh'); //教育程度
        $('#c-room-style').val(creditJson.storage.HOUSTYPE).selectmenu('refresh'); //住宅类型
        $('#c-mobile').val(telNum(creditJson.storage.MOBILENUM)); //手机号码
        $('#c-zipcode').val(creditJson.storage.UNITZIPCODE); //邮编

        // $('#s_province').val(creditJson.storage.UNITADDSF).selectmenu('refresh'); //通讯地址省
        // $('#s_city').val(creditJson.storage.UNITADDCS).selectmenu('refresh'); //通讯地址城市

        if (creditJson.storage.UNITADDSF) {
        	$("#s_province-button span").html(creditJson.storage.UNITADDSF);
            $("#s_province").val(creditJson.storage.UNITADDSF).selectmenu('refresh');
            change(1, 0);
            $("#s_city-button span").html(creditJson.storage.UNITADDCS);
            $("#s_city").val(creditJson.storage.UNITADDCS).selectmenu('refresh');
        } else {
			$('#s_province-button span').html('省份');
            $('#s_province').val('省份').selectmenu('refresh');
            change(1, 0);
            $('#s_city-button span').html('城市');
            $('#s_city').val('城市').selectmenu('refresh');
        }

        $('#c-addr-detail').val(creditJson.storage.UNITADDXX); //通讯地址详细
        $('#c-email').val(creditJson.storage.EMAILADD); //邮箱


        $("#day_a-button span").html(creditJson.storage.DOMICILESF);
        $("#day_a").val(creditJson.storage.DOMICILESF);
        change(1, 1);
        $("#day_b-button span").html(creditJson.storage.DOMICILECS);
        $("#day_b").val(creditJson.storage.DOMICILECS);

        if (creditJson.storage.DOMICILESF == '广东省' && creditJson.storage.DOMICILECS == '深圳市') {
            $('#day_a,#day_b').attr('disabled', 'disabled');
            $('#ic_agree').show().siblings('#ic_disagree').hide();
        } else {
            $('#day_a,#day_b').removeAttr('disabled');
            $('#ic_agree').hide().siblings('#ic_disagree').show();
        }

        // $('#day_a').val(creditJson.storage.DOMICILESF).selectmenu('refresh'); //户籍所在地省份
        // $('#day_b').val(creditJson.storage.DOMICILECS).selectmenu('refresh'); //户籍所在地城市
        $('#c-housregaddr').html(creditJson.storage.ADDRESS); //户籍地址
//      $('#c-reference').val(creditJson.storage.RECEMPNUM); //推荐人
        $('#c-com-name').val(creditJson.storage.UNITNAME); //单位全称
        $('#c-com-property').val(creditJson.storage.UNITPROPERTY).selectmenu('refresh'); //单位性质
        $('#c-com-tel1').val(creditJson.storage.UNITPHONENUMQH); //单位固话-区号
        $('#c-com-tel2').val(creditJson.storage.UNITPHONENUMHM); //单位固话-电话
        $('#c-ndustry').val(creditJson.storage.INDCATEGORY).selectmenu('refresh'); //行业类别
        $('#c-income').val(fmoney(creditJson.storage.ANNINCOME, 2).split('.')[0]); //年收入fmoney(creditJson.storage.ANNINCOME, 2)
        $('#c-contact-name').val(creditJson.storage.URGNAME); //紧急联系人姓名
        $('#c-contact-mobile').val(telNum(creditJson.storage.URGMOBILENUM)); //紧急联系人手机
        var kpsendADD = ''; //卡片寄送地址
        if (creditJson.storage.UNITADDSF == '' || creditJson.storage.UNITADDSF == '省份') {
            kpsendADD += '';
        }
        if (creditJson.storage.UNITADDCS == '' || creditJson.storage.UNITADDCS == '城市') {
            kpsendADD += '';
        }
        $('#c-card-addr').val(kpsendADD + creditJson.storage.UNITADDXX); //卡片寄送地址(取通讯地址)
        $('#c-card-annualfee').val(creditJson.storage.CARDFEETYPE).selectmenu('refresh'); //年费类型
        $('#c-card-repay').val(creditJson.storage.ISAUTOPURCHASE).selectmenu('refresh'); //自动还款功能
        $('#c-card-repaystyle').val(creditJson.storage.REPAYMETHOD).selectmenu('refresh'); //自动还款方式
        $('#c-card-card').html(creditJson.storage.AUTODEBITACCOUNTHTML).selectmenu('refresh'); //自动还款卡账号
        $('#c-card-card').val(creditJson.storage.AUTODEBITACCOUNT).selectmenu('refresh'); //自动还款卡账号
        //2016.3.18新增
        $('#ZhiWeiGangWei').val(creditJson.storage.OFFICE).selectmenu('refresh');//职位／岗位
        $('#ZXDWGZNX').val(creditJson.storage.UNITWORKEXP);//在线单位工作年限
        $('#JinJianLaiYuan').val(creditJson.storage.INTOSOURCE).selectmenu('refresh'); //进件来源
        $('#ShenQingEDu').val(creditJson.storage.CUSCARDAPPLY); //申请额度
        /**已婚／未婚**/
        if (creditJson.storage.MASRTATU == '1') {//婚姻状况未婚
            $("#none_yihun").hide().siblings("#none_weihun").show();
        } else {//婚姻状况已婚
            $("#none_weihun").hide().siblings("#none_yihun").show();
        }
        /**
         * 推荐人
         */
        if (creditJson.storage.RECMOBILENUM != '') {
            $('#c-reference').val(creditJson.storage.RECMOBILENUM);//推荐人手机号
        } else {
            $('#c-reference').val(creditJson.storage.RECEMPNUM);//推荐人员工工号
        }
//  		if(creditJson.storage.RECEMPNUM != ''){
//  			$('#c-reference').val(creditJson.storage.RECEMPNUM);//推荐人员工工号
//  		}else{
//  			$('#c-reference').val(creditJson.storage.RECMOBILENUM);//推荐人手机号
//  		}

        //自动还款功能 方式 卡号 是否显示
        if (creditJson.storage.ISAUTOPURCHASE == '1') {
            $('.y-c-card-repay').show();
        } else {
            $('.y-c-card-repay').hide();
        }
        // 自动还款功能 方式 卡号是否可点击
        if (creditJson.storage.ISAUTOPURCHASEISDISABLED == 'istrue') { //只有还款功能不可点击
            $('#c-card-repay').attr('disabled', 'disabled').selectmenu('refresh');

        } else if (creditJson.storage.ISAUTOPURCHASEISDISABLED == 'istrueAll') { //都不能点击
            $('#c-card-repay').attr('disabled', 'disabled').selectmenu('refresh');
            $('#c-card-repaystyle,#c-card-card').attr('disabled', 'disabled')

        } else { //可点击
            $('#c-card-repay').removeAttr('disabled').selectmenu('refresh');
        }
        if(creditJson.storage.REMARK4 != undefined && creditJson.storage.REMARK4 != ''){
        	creditJson.storage.BILLDATE = creditJson.storage.REMARK4;
        	creditJson.storage.REMARK4 = '';
        }
        
        if(creditJson.storage.resource!= undefined &&creditJson.storage.resource!= '')
        debitEnter.querySuss = true;
        if(creditJson.storage.resource=='2')//信用卡系统查询后有记录的
        {
        	//消息来源渠道是信用卡系统的时候，不需要展示“账单日”
        	$('#billDateDiv').remove();
        }
        else
        {
        	if(creditJson.storage.BILLDATE != undefined && creditJson.storage.BILLDATE != ''){
        	$('#billDate').val(creditJson.storage.BILLDATE).selectmenu('refresh');
        }
        }
        
    } else {
        $('#c-card-repay').val('0').attr('disabled', 'disabled').selectmenu('refresh');
        creditJson.storage.ISAUTOPURCHASEISDISABLED = 'istrue';
        $("#s_province-button span").html('广东省');
        $("#s_province").val('广东省').selectmenu('refresh');
        change(1, 0);
        $("#s_city-button span").html('深圳市');
        $("#s_city").val('深圳市').selectmenu('refresh');
        creditJson.storage.OTHERADD = ''; //其他地址
        creditJson.storage.HOUSADD = ''; //家庭地址 核心地址接口 TYPE==h
        creditJson.storage.HOUSZIPCODE = ''; //家庭地址邮编
        creditJson.storage.HOUSPHONEAREANUM = ''; //住宅电话区号 空
        creditJson.storage.HOUSPHONENUM = ''; //住宅电话 空
        creditJson.storage.UNITADD = ''; //单位地址 TYPE==c
        creditJson.storage.UNITZIPCODE = ''; //单位邮编
        creditJson.storage.IMMRELATION = ''; //直系亲属关系 与持卡人关系 SEQ=1
        creditJson.storage.IMMNAME = ''; //直系亲属姓名
        creditJson.storage.IMMMOBILENUM = ''; //直系亲属手机
        creditJson.storage.IMMPHONEAREANUM = ''; //直系亲属区号
        creditJson.storage.IMMPHONENUM = ''; //直系亲属电话
        creditJson.storage.URGRELATION = ''; //紧急联系人关系RELATIONSHIP
        creditJson.storage.URGPHONEAREANUM = ''; //紧急联系人区号
        creditJson.storage.URGPHONENUM = ''; //紧急联系人电话
        //2016.3.18新增
        creditJson.storage.UNITWORKEX = '';//在线单位工作年限
        creditJson.storage.CUSCARDAPPLY = ''; //申请额度
        creditJson.storage.BILLDATE = ''; //账单日
        if (creditJson.storage.offlineOnline == 'online') {
            //核心有客户信息 则返显客户信息
            showLoader('信用卡核心信息查询中...');
//          var sendJson = {
//              "b": [{
//                  "IDTYPE.s": "0", //证件类型
//                  "IDNO.s": '350203199011250078', //证件号
//                  "CLIENT_TYPE.s": 'P', //客户类型
//                  "CLIENT_NO.s": '0700358223', //客户号
//                  "AGENT_FLAG.s": '', //法人代表
//                  "deviceNo.s": creditJson.storage.deviceNo, //设备编号
//                  "orgId.s": creditJson.storage.orgId,//机构号
//                  "moduleId.s": creditJson.storage.moduleId, //模块编号
//                  "tranId.s": creditJson.storage.tranId, //交易编号
//                  "operatorNo.s": creditJson.storage.operatorNo //操作员
//              }]
//          };
            var sendJson = {
                "b": [{
                    "IDTYPE.s": "0", //证件类型
                    "IDNO.s": creditJson.storage.CERTNUM, //证件号
                    "CLIENT_TYPE.s": 'P', //客户类型
                    "CLIENT_NO.s": creditJson.storage.CLIENT_NO, //客户号
                    "AGENT_FLAG.s": '', //法人代表
                    "deviceNo.s": creditJson.storage.deviceNo, //设备编号
                    "orgId.s": creditJson.storage.orgId,//机构号
                    "moduleId.s": creditJson.storage.moduleId, //模块编号
                    "tranId.s": creditJson.storage.tranId, //交易编号
                    "operatorNo.s": creditJson.storage.operatorNo //操作员
                }]
            };
            queryCustomerInfoFun(sendJson, function (msg) {
                creditICcCtInfoServiceSucc(msg);
            }, function (err) {
                funFail(err);
            })

        }
    }
    $('#c-mobile').on('blur', function () {
        $('#c-mobile').val(telNum($('#c-mobile').val()));
    });
    $('#c-mobile').on('tap', function () {
        $('#c-mobile').val(removeSpace($('#c-mobile').val()));
    });
    $('#c-contact-mobile').on('blur', function () {
        $('#c-contact-mobile').val(telNum($('#c-contact-mobile').val()));
    });
    $('#c-contact-mobile').on('tap', function () {
        $('#c-contact-mobile').val(removeSpace($('#c-contact-mobile').val()));
    });
    $('#c-name').html(creditJson.storage.MASCARDNAME); //姓名
    $('#c-cerNO').html(creditJson.storage.CERTNUM); //证件号码
    $('#c-sex').html(creditJson.storage.SEX); //性别 /M男 F女/
    $('#c-cerExpdDt').html(creditJson.storage.CERTVALIDDATE); //证件有效期 格式／yyyymmdd／
    $('#c-birthday').html(creditJson.storage.BIRTH); //出生日期
    $('#c-housregaddr').html(creditJson.storage.ADDRESS); //户籍地址
    
    $('#c-income').on('blur', this, function () {
    	var _val = $(this).val().replace(/[^0-9\.\-]/ig, "");
    	$(this).val(_val);
    });


    //当改变“省份”时，清空详细地址 BY SAVEN 2015.10.19 22:26:00
    $("#s_province").change(function () {
        $("#c-addr-detail").val("");
        creditJson.storage.dwORhj = '';
        debitEnter.querySuss=false;
    });
    //当改变“城市”时，清空详细地址 BY SAVEN 2015.10.19 22:26:00
    $("#s_city").change(function () {
        $("#c-addr-detail").val("");
        creditJson.storage.dwORhj = '';
        debitEnter.querySuss=false;
    });
    //户籍返显到详细地址  BY SAVEN 2015.10.19 22:26:00
    $("#hujifangxian").click(function () {
        //$('#s_province option:selected').text("省份").selectmenu("refresh", true);
        //document.getElementById("s_province").options[0].text="省份";
        //document.getElementById("s_city").options[0].text="城市";
        //$('#s_city option:selected').text("城市").selectmenu("refresh", true);
        $("#c-addr-detail").val($("#c-housregaddr").html());
        creditJson.storage.dwORhj = 'hj';
        $("#s_province-button span").html("省份");
        $("#s_province").val("省份").selectmenu('refresh');
        change(1, 0);
        $("#s_city-button span").html("城市");
        $("#s_city").val("城市").selectmenu('refresh');
    });
    //定位返显到详细地址  BY SAVEN 2015.10.19 22:26:00
    $("#shishidingwei").click(function () {
        Meap.getCurrentLocationAddress("", function (msg) {
            msg = JSON.parse(msg);
            $("#c-addr-detail").val(msg.FormattedAddressLines[0]);
            creditJson.storage.dwORhj = 'dw';

            $("#s_province-button span").html("省份");
            $("#s_province").val("省份").selectmenu('refresh');
            change(1, 0);
            $("#s_city-button span").html("城市");
            $("#s_city").val("城市").selectmenu('refresh');
        }, function (err) {
            //creditJson.storage.dwORhj='';
            showMsg(err);
        });
    });

    //左侧菜单切换
    $(".navigation>li").on("click", function () {
        if ($(this).hasClass('info-enter-error-tabs')) {
            $(this).removeClass('info-enter-error-tabs');
        }
        if ($(this).index() == 3) { //点击主卡信息 设置本卡片寄送地址
            var sendAddr = '';
            if ($('#s_province').val() !== '省份') {
                sendAddr += $('#s_province').val();
            }
            if ($('#s_city').val() !== '城市') {
                sendAddr += $('#s_city').val();
            }
            /*
             if ($('#s_county').val() !== '市、县级市') {
             sendAddr += $('#s_county').val();
             }*/
            $('#c-card-addr').val(sendAddr + $('#c-addr-detail').val());
        }
        var navigation = $('.navigation li').index($(this));
        $(this).addClass("change-bg").siblings("li").removeClass("change-bg");
        $('.information-input ul').eq(navigation).show().siblings('ul').hide();
    });
    // 01深户 02广东非深户  03广西 04其他
    $('.agree_btn_box').click(function (event) {
        if ($('#ic_agree').css('display') == 'none') {
            $('#day_a,#day_b').attr('disabled', 'disabled');
            $('#ic_agree').show().siblings('#ic_disagree').hide();
            $("#day_a-button span").html("广东省");
            $("#day_a").val("广东省")
            change(1, 1);
            $("#day_b-button span").html("深圳市");
            $("#day_b").val("深圳市")
        } else {
            $('#day_a,#day_b').removeAttr('disabled');
            $('#ic_agree').hide().siblings('#ic_disagree').show();
        }
    });
    /* if (creditJson.storage.offlineOnline == 'offline') {
     $('#c-card-repay').val('0').attr('disabled', 'disabled').selectmenu('refresh');
     $('.y-c-card-repay').hide();
     }*/

    //是否自动还款
    $('#c-card-repay').change(function (event) {
        if (creditJson.storage.offlineOnline == 'offline') {
            return;
        }
        if ($(this).val() == '1') {
            $('.y-c-card-repay').show();
            $('#c-card-repaystyle').val('').selectmenu('refresh');
        } else {
            $('.y-c-card-repay').hide();
            $('#c-card-repaystyle').val('').selectmenu('refresh');
            $('#c-card-repaystyle,#c-card-card').closest('.fm-item').removeClass('fm-item-error')
        }
    });
    //点击上一步，跳转页面
    $('#credit-messageIn-back').on('tap', function () {
        creditJson.isPrev.XXLRisFromPrev = true;
        creditJson.isPrev.YXCJisFromPrev = true;
        creditJson.isPrev.LLDBisFromPrev = true;
        if (creditSessionInvalid) { //session 失效
            creditJson.isPrev.XXLRisFromPrev = false;
        }
        cacheXXLR(); //缓存信息录入字段
        $.mobile.changePage('credit-customerP.html', {
            reverse: true
        });
    });
    // 点击下一步
    $('#credit-messageIn-next').on('tap', function () {
        if ($("#s_province").val() == '省份' || $("#s_city").val() == '城市') {
//      	alert(1);
//      	alert($("#c-addr-detail").val());
//      	alert(checkAs400ChineseLength($("#c-addr-detail").val()));
            if (checkAs400ChineseLength($("#c-addr-detail").val()) >= 60) {
                showTags({
                    'title': '提示',
                    'content': "详细地址长度不能超过29位。",
                    'ok': {}
                });
                return;
            }
            if ($("#c-addr-detail").val().length >= 30) {
                showTags({
                    'title': '提示',
                    'content': "详细地址长度不能超过29位。",
                    'ok': {}
                });
                return;
            }
        } else {

                if (checkAs400ChineseLength($("#s_province").val() + $("#s_city").val() + $("#c-addr-detail").val()) >= 60) {
                    showTags({
                        'title': '提示',
                        'content': "详细地址长度不能超过29位。",
                        'ok': {}
                    });
                    return;
                }
                if ($("#c-addr-detail").val().length + $("#s_province").val().length + $("#s_city").val().length >= 30) {
                    showTags({
                        'title': '提示',
                        'content': "详细地址长度不能超过29位。",
                        'ok': {}
                    });
                    return;
                }


        }
        
        //使用核心ebcdic码校验规则来校验单位名称长度不能超过40字节
        var unitfullname = $('#c-com-name').val();
        if(unitfullname != ''){
        	if(checkAs400ChineseLength(unitfullname) > 40){
        		showTags({
        			'title':'提示',
        			'content':"单位名称长度不能超过20位。",
        			'ok':{}
        		});
        		return;
        	}
        }


//			if ($("#c-mobile").val().length!=11) {
//			showTags({
//				'title': '提示',
//				'content': "手机号码必须为11位。",
//				'ok': {}
//			});
//			return;
//		}
//			if ($("#c-reference").val().length!='' &&  $ ("#c-reference").val().length!='11') {
//			showTags({
//				'title': '提示',
//				'content': "推荐人只能输入数字，并且只能是6位或者11位。",
//				'ok': {}
//			});
//			return;
//		}
        var cReference = $("#c-reference").val();
        if (cReference != '') {
            if (isNaN(cReference)) {
                showTags({
                    'title': '提示',
                    'content': "推荐人只能输入数字，并且只能是6位。",
                    'ok': {}
                });
                return;
            } else {
                if (cReference.length == 6) {

                } else {
                    showTags({
                        'title': '提示',
                        'content': "推荐人只能输入数字，并且只能是6位。",
                        'ok': {}
                    });
                    return;
                }
            }

        }

        //if(!($(this).hasClass('btn_next'))) return;
        //是否为空验证
        var num = 0; //纪录为空或者格式不正确的个数
        $('#card-f-o input[type="text"]:not(:disabled)').each(function (index, el) {
            if ($(this).attr('id') == 'c-reference') {
                return true; //推荐人不是必填
            }
            if ($('#c-card-repay').val() == '0' && $(this).attr('id') == 'c-card-card') {
                return true; //如果自动还款功能为否，则还款卡号／账号不是必填
            }

            var eqIndex = $(this).closest('.info-enter-item').index();

            if ($.trim($(this).val()) == '') {
                num++;
                $(this).closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
                $(this).closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
                if (!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
                    $('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
                }
            } else {
                if (($(this).attr('id') == 'c-com-tel2' && $('#c-com-tel1').val() == '') || ($(this).attr('id') == 'c-en-ming' && $('#c-en-xing').val() == '')) {
                    num++;
                    var eqIndex = $(this).closest('.info-enter-item').index();
                    $(this).closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
                    $(this).closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
                    if (!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
                        $('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
                    }

                } else {
                    $(this).closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
                    if ($(this).closest('.info-enter-item').find('.fm-item-error').length == 0) { //如果父级区域没有错误字段
                        $('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
                    }
                    ;
                }
            }
        })
        $('#card-f-o select').each(function (index, el) {
            if(debitEnter.querySuss && (debitEnter.querySuss != '0') && (this.id == "s_province" || this.id == "s_city" )) return;
            if (($('#c-card-repay').val() == '0' && $(this).attr('id') == 'c-card-repaystyle') || ($('#c-card-repay').val() == '0' && $(this).attr('id') == 'c-card-card')) {
                $(this).closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
                if ($(this).closest('.info-enter-item').find('.fm-item-error').length == 0) { //如果父级区域没有错误字段
                    $('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
                }
                ;
                return true; //如果自动还款功能为否，则自动还款方式不是必填
            }
            if ((creditJson.storage.dwORhj && $(this).attr('id') == 's_province') || (creditJson.storage.dwORhj && $(this).attr('id') == 's_city')) {
                $(this).closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
                if ($(this).closest('.info-enter-item').find('.fm-item-error').length == 0) { //如果父级区域没有错误字段
                    $('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
                }
                ;
                return true;
            }
            if ($(this).val() == '省份' || $(this).val() == '城市' || $(this).val() == '市、县级市' || $(this).val() == '') {
                num++;
                var eqIndex = $(this).closest('.info-enter-item').index();
                $(this).closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
                $(this).closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
                if (!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
                    $('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
                }
            } else {
                $(this).closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
                if ($(this).closest('.info-enter-item').find('.fm-item-error').length == 0) { //如果父级区域没有错误字段
                    $('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
                }
                ;
            }
        })
        if (num > 0) {
            showMsg('必填项不能为空');
            return;
        }
        //格式验证
        $('#card-f-o input[type="text"][reg]:not(:disabled)').each(function (index, el) {
            var reg = $(this).attr('reg');
            var eqIndex = $(this).closest('.info-enter-item').index();
            if (!(fmReg[reg].test($.trim($(this).val().replace(/\s+/g, ''))))) {
                $(this).closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
                $(this).closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
                if (!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
                    $('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
                }
            } else {

                $(this).closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
                if ($(this).closest('.info-enter-item').find('.fm-item-error').length == 0) { //如果父级区域没有错误字段
                    $('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
                }
                ;
                if ($(this).attr('id') == 'c-income') {
                    if ($.trim($(this).val()) > 99999 || $.trim($(this).val()) == 0 ) { //收入大于99999万    
                        $(this).closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
                        $(this).closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
                        if (!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
                            $('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
                        }
                    }

                }

                if ($(this).attr('id') == 'c-en-ming') {
                    if (!(fmReg[$('#c-en-xing').attr('reg')].test($.trim($('#c-en-xing').val())))) {
                        $('#c-en-xing').closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
                        $('#c-en-xing').closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
                        if (!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
                            $('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
                        }
                    }
                    if (($.trim($('#c-en-xing').val()) + $.trim($('#c-en-ming').val())).length > 19) {
                        $('#c-en-xing').closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
                        $('#c-en-xing').closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
                        if (!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
                            $('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
                        }
                    }
                }
                if ($(this).attr('id') == 'c-com-tel2') {
                    if (!(fmReg[$('#c-com-tel1').attr('reg')].test($.trim($('#c-com-tel1').val())))) {
                        $('#c-com-tel1').closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
                        $('#c-com-tel1').closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
                        if (!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
                            $('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
                        }
                    }
                }
            }
        })
        if (/\s+/.test($('#c-contact-name').val())) {
            num++;
            showMsg('请输入正确格式的联系人姓名!');
            return false;
        }
        if (/\s+/.test($('#c-com-name').val())) {
            num++;
            showMsg('请输入正确格式的单位名称!');
            return false;
        }
        if ($('#c-reference').val() != '' && /\s+/.test($('#c-reference').val())) {
            num++;
            showMsg('请输入正确格式的推荐人!');
            return false;
        }
        $('input[type="text"][reg]').each(function (index, el) {
            var reg = $(this).attr('reg');
            if (!(fmReg[reg].test($(this).val()))) {
                if ($(this).attr('id') == 'c-mobile' || $(this).attr('id') == 'c-contact-mobile') {
                    if (fmReg[reg].test(removeSpace($(this).val()))) {
                        return true;
                    }
                }
                num++;
                showMsg(fmRegMsg[reg]);
                return false;
            } else {
                if (($.trim($('#c-en-xing').val()) + $.trim($('#c-en-ming').val())).length > 19) {
                    num++;
                    showMsg('拼音姓名长度不能超过19');
                    return false;
                }
                if ($(this).attr('id') == 'c-income') {
//              	var isZZShu = /^[1-9]*[1-9][0-9]*$/;
                    if ($.trim($(this).val()) == 0) {
                        num++;
                        showMsg('年收入必须大于0');
                        return false;
                    } else if ($.trim($(this).val()) > 99999) {
                        num++;
                        showMsg('年收入超限！');
                        return false;

                    }
                }
            }
        })
        if (num > 0) {
            return;
        }
        cacheXXLR(); //暂存信息录入字段
        workbenchJson.temp.TEMPFROM = ''; //暂存来源初始化
        $.mobile.changePage('credit-customerConfirm.html');
    });
    //暂存
    $('.zancun').on('click', function () {
        $(this).css('display','none');
        creditJson.isPrev = {};
        cacheXXLR(); //暂存信息录入字段
        creditZanCunCustermerInfo('信用卡');
        $.mobile.changePage('../main.html', {
            reverse: true
        });
        /* Act on the event */
    });
});
//信用卡模块确认信息页面（credit-customerConfirm.html）
$(document).on("pageshow", '#credit-customerConfirm', function () {
	creditJson.USER_NO = '';
    creditJson.storage.platGlobalSeq = undefined;
    creditJson.hasYZM = creditJson.hasQM = creditJson.hasYDXY = false;
    if (creditJson.storage.offlineOnline == 'offline') { //脱机状态
        $('.duanX_con').hide();
        creditJson.hasYZM = true;
    }
    //点击打开pdf文件
    $('.credit-sure-xy span').on('click', function () {
        Meap.scanOfficeFile('www/images/深圳农村商业银行信用卡(个人卡)领用合约.doc', function (msg) {
        }, function (err) {
        })
    })
    //点击修改返回录入信息页面
    $('#credit-customerConfirm .reWrite').on('click', function () {
        creditJson.isPrev.XXLRisFromPrev = true;
        if (creditJson.codeTime) {
            clearInterval(creditJson.codeTime);
        }
        $.mobile.changePage('credit-card.html', {
            reverse: true
        });
    })
    // $(".ic_down").on("click", function () { //点击签名显示隐藏
    //     if ($(".qianM_box").css('height') == '0px') {
    //         $(".qianM_box").css("height", "215px");
    //         $(".qianM_box").css("overflow", "visible");
    //         $(".qianM_box").css({
    //             "border-left": "solid 1px #CCCCCC",
    //             "border-right": "solid 1px #CCCCCC",
    //             "border-bottom": "solid 1px #CCCCCC"
    //         });
    //         $(".dianjiqianming-con").hide();
    //         $("#clear-botton").show();
    //         $(".conter-auto").scrollTop(850);
    //         $(this).attr("src", "../../images/ic_up.png");
    //         $(".querenqianming-click").removeClass("querenqianming-con");
    //     } else {
    //         $(".qianM_box").css("height", "0");
    //         $(this).attr("src", "../../images/ic_down.png");
    //         $(".dianjiqianming-con").show();
    //         $(".qianM_box").css("overflow", "hidden");
    //         $(".qianM_box").css("border", "0");
    //         $("#clear-botton").hide();
    //         $(".querenqianming-click").addClass("querenqianming-con");
    //     }
    // });

    if (creditJson.storage.offlineOnline == 'offline') { //脱机状态
        creditJson.hasYZM = true;
    }

    $('.credit-sure-xy .readxy').on('click', function () {
        if ($('.readxy #ic_agree').css('display') == 'none') {
            $('.readxy #ic_disagree').hide();
            $('.readxy #ic_agree').show();
            creditJson.hasYDXY = true;
        } else {
            creditJson.hasYDXY = false;
            $('.readxy #ic_disagree').show();
            $('.readxy #ic_agree').hide();
        }

    })
    //点击获取验证码
    $('#getMsg').on('click', function () {
        $('#inp').val('');
        if ($(this).hasClass('cannt-click')) {
            return;
        } else {
            $(this).addClass('cannt-click');
        }
        if (creditJson.codeTime) {
            clearInterval(creditJson.codeTime);
        }
        //$('#inp').removeAttr('disabled').val(parseInt(Math.random()*(9999-1000)+1000));
        $('.codetime').show();
        $('.codetime').html('请在<span style="color:red;">80秒</span>内输入验证码');
        //获取验证码
        var sendJson = {
            "b": [{
                //"offlineOnline.s":creditJson.storage.offlineOnline,//脱机/联机
                "orgId.s": creditJson.storage.orgId,
                "moduleId.s": creditJson.storage.moduleId, //模块编号
                "tranId.s": creditJson.storage.tranId, //交易编号
                "operatorNo.s": creditJson.storage.operatorNo, //操作员
                "deviceNo.s": creditJson.storage.deviceNo, //设备编号
                "SUSER_ID.s": creditJson.storage.orgId + creditJson.storage.operatorNo, //机构号+柜员号
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": creditJson.storage.MOBILENUM, //手机号码debitEnter.tel
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s": creditJson.storage.faceRecogn //人脸识别状态
            }]
        };
        showLoader('获取中...');
        imessageAuthentionServiceFun(sendJson, function (msg) {
            imessageAuthentionServiceCreditSucc(msg);
        }, function (err) {
            hideLoader();
            funFail(err);
            $('#getMsg').removeClass('cannt-click').text('重新获取');
            if (creditJson.codeTime) {
                clearInterval(creditJson.codeTime);
            }
            creditJson.hasYZM = false;
            $('#inp').removeAttr('disabled').val('');
        });
    });
    if (creditJson.storage.ISAUTOPURCHASE == '0') { //如果自动还款功能为否，则不显示自动还款方式、还款卡号／账号
        $('.is-auto-pay').hide();
    }
    //基本信息
    $('#basic_name').html(creditJson.storage.MASCARDNAME); //姓名
    $('#basic_sex').html(creditJson.storage.SEX); //性别
    $('#basic_pinX').html(creditJson.storage.BRAFULLNAMEX + ' ' + creditJson.storage.BRAFULLNAMEM); //拼音
    $('#basic_birth').html(creditJson.storage.BIRTH); //出生日期
    $('#basic_zhengJY').html(creditJson.storage.CERTVALIDDATE); //证件有效期
    $('#basic_zhengJH').html(creditJson.storage.CERTNUM); //证件号码
    $('#basic_houseType').html(roomStyleJson[creditJson.storage.HOUSTYPE]); //住宅类型
    $('#basic_teach').html(eduJson[creditJson.storage.EDUCATION]); //教育程度
    $('#basic_phoneN').html(removeSpace(creditJson.storage.MOBILENUM)); //手机号码
    $('#basic_youB').html(creditJson.storage.UNITZIPCODE); //邮编
    $('#basic_domicile').html(creditJson.storage.DOMICILESF + creditJson.storage.DOMICILECS); //户籍所在地
    $('#basic_addressH').html(creditJson.storage.ADDRESS); //户籍地址
    $('#basic_mailbox').html(creditJson.storage.EMAILADD); //邮箱
    
    creditJson.storage.UNITADD = '';
    if (creditJson.storage.UNITADDSF != '' && creditJson.storage.UNITADDSF != '省份') {
        creditJson.storage.UNITADD += creditJson.storage.UNITADDSF;
    }
    if (creditJson.storage.UNITADDCS != '' && creditJson.storage.UNITADDCS != '城市') {
        creditJson.storage.UNITADD += creditJson.storage.UNITADDCS;
    }
    creditJson.storage.UNITADD += creditJson.storage.UNITADDXX;
    $('#basic_addressZN').html(creditJson.storage.UNITADD); //通讯地址
    
    if (creditJson.storage.RECMOBILENUM != '') {
        $('#basic_reference').html(creditJson.storage.RECMOBILENUM); //推荐人手机号
    }
    if (creditJson.storage.RECEMPNUM != '') {
        $('#basic_reference').html(creditJson.storage.RECEMPNUM); //推荐人工号
    }
    //职业信息
    $('#work_danW').html(creditJson.storage.UNITNAME); //单位全称
    $('#work_danWType').html(compropertyJson[creditJson.storage.UNITPROPERTY]); //单位性质
    $('#work_danWPoneN').html(creditJson.storage.UNITPHONENUMQH + '-' + creditJson.storage.UNITPHONENUMHM); //单位固话
    $('#work_marriage').html(ndustryJson[creditJson.storage.INDCATEGORY]); //行业类型
    $('#work_incomeN').html(creditJson.storage.ANNINCOME + '万元'); //年收入
    //联系人信息
    $('#family_emergentName').html(creditJson.storage.URGNAME); //紧急联系人姓名
    $('#family_emergentNum').html(removeSpace(creditJson.storage.URGMOBILENUM)); //紧急联系人手机telNum(creditJson.storage.URGMOBILENUM)); //紧急联系人手机
    //主卡信息
    $('#masterID_nflx').html(cardAnnualfeeJson[creditJson.storage.CARDFEETYPE]); //年费类型
    $('#masterID_zdhk').html(isAutoPurchaseJson[creditJson.storage.ISAUTOPURCHASE]); //自动还款功能
    $('#masterID_hkfs').html(cardRepaystyleJson[creditJson.storage.REPAYMETHOD]); //自动还款方式
    $('#masterID_hkzh').html(creditJson.storage.AUTODEBITACCOUNT); //还款卡号／账号
    $('#masterID_cardAddress').html(creditJson.storage.UNITADD); //卡片寄送地址
    if(creditJson.storage.BILLDATE == undefined || creditJson.storage.BILLDATE == ''){
    	$('#masterID_rows_billDate').remove();
    } else {
    	$('#masterID_billDate').html(creditJson.storage.BILLDATE + '日'); //对账单
    }
    //2016.3.17新增字段
    $('#yunyinZK').html(chunyinJson[creditJson.storage.MASRTATU]); //婚姻状况
    $('#zhiweigw').html(zhigangJson[creditJson.storage.OFFICE]); //职位／岗位
    $('#zxdwgznianxian').html(creditJson.storage.UNITWORKEXP); //在现单位工作年限
    $('#jinjianly').html(jinjianlaiyuanJson[creditJson.storage.INTOSOURCE]); //进件来源
    $('#shenqinged').html(creditJson.storage.CUSCARDAPPLY); //申请额度

    //点击上一步，跳转页面
    $('#credit-customerConfirm-back').on('tap', function () {
        creditJson.isPrev.XXLRisFromPrev = true;
        if (creditSessionInvalid) { //session 失效
            creditJson.isPrev.XXLRisFromPrev = false;
        }
        $.mobile.changePage('credit-card.html', {
            transition: "slide"
        });
    });
    //初始化签名方法
    signature.init({
        div: $('#qianM'), //签名容器
        finishBtn: $("#qianOK"), //完成签名按钮
        clearBtn: $("#clear-botton"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function (data) { //签名完成回调函数
            //将签名的str转成路径
            creditJson.signHref = data.replace('data:image/png;base64,', '');
//          Meap.transFormImage(creditJson.storage.operatorNo + myTime.CurTime(), custermerInfo.data, 'picSty', function(msg) {
//              creditJson.signHref = msg;
//          }, function(err) {
//              creditJson.signHref = '';
//          })
            if ($('#qianOK #ic_agree').css('display') == 'none') {
                $('.qianM_shadow').show();
                $('#qianOK #ic_disagree').hide();
                $('#qianOK #ic_agree').show();
                $("#clear-botton").css("color", "#CCCCCC");
                creditJson.hasQM = true;
            } else {
                creditJson.hasQM = false;
                $('.qianM_shadow').hide();
                $('#qianOK #ic_disagree').show();
                $('#qianOK #ic_agree').hide();
                $("#clear-botton").css("color", "#0F45A7");
            }
        }
    });
    //点击下一步，判断验证码是否有效 是否可以提交
    $('.footter .previous').on('click', function (event) {
        // if (!$(this).hasClass('btn_next2')) return;

        if (creditJson.USER_NO == '' && !creditJson.hasYZM) {
            showMsg('请点击获取短信验证码!');
            return;
        }
        if (!creditJson.hasQM) {
            showMsg('请确认签名!');
            return;
        }
        if (!creditJson.hasYDXY) {
            showMsg('请阅读并确认协议!');
            return;
        }
        if (creditJson.storage.offlineOnline == 'offline') { //脱机状态
        	var fileArray=creditJson.storage.picFileARR.join("&&");
        	
        	fileArray = fileArray.split('&&');
        	//需要首先判断所有文件附件是否都存在，且大小是否都不为0K
        	checkZipCompression(fileArray,function(msg){
        		            //脱机模式存储个人信息
                cacheNoNetCustermerInfo('申请信用卡');
                $.mobile.changePage('credit-complete.html');
            
        	},function(err){
        		alert(err);
        		showMsg('部分影像资料保存异常，请重新录入');
        	});
        	return;

        }
        //验证验证码是否有效
        creditJson.MSG_INFO = $.trim($('#inp').val());
        if (!(fmReg.zipCode.test(creditJson.MSG_INFO))) {
            showMsg('请输入正确格式的验证码');
            return;
        }
        showLoader('短信验证码验证中...');
        if (creditJson.codeTime) {
            clearInterval(creditJson.codeTime);
            creditJson.hasYZM = false;
            $('#getMsg').removeClass('cannt-click').text('重新获取');
            $('.codetime').html('请在<span style="color:red;">0秒</span>内输入验证码');
        }
        var sendJson = {
            "b": [{
                //"offlineOnline.s":creditJson.storage.offlineOnline,//脱机/联机
                "orgId.s": creditJson.storage.orgId,
                "moduleId.s": creditJson.storage.moduleId, //模块编号
                "tranId.s": creditJson.storage.tranId, //交易编号
                "operatorNo.s": creditJson.storage.operatorNo, //操作员
                "deviceNo.s": creditJson.storage.deviceNo, //设备编号
                "SUSER_ID.s": creditJson.storage.orgId + creditJson.storage.operatorNo, //机构号+柜员号
                "USER_NO.s": creditJson.USER_NO, //用户唯一标识
                "EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
                "MSG_INFO.s": creditJson.MSG_INFO, //动态口令
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": creditJson.storage.MOBILENUM, //手机号码debitEnter.tel
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s": creditJson.storage.faceRecogn //人脸识别状态
            }]
        };
        imessageAuthentionServiceYFun(sendJson, function (msg) {
            imessageAuthentionServiceYFunCreditsSucc(msg);
        }, function (err) {
            creditJson.USER_NO = "";
            funFail(err);
        });

    });
});
//信用卡模块申请完成页面（credit-complete.html）
$(document).on("pageshow", '#credit-complete', function () {
    //完成，返回首页
    $('#btn_next').on('tap', function () {
        if (creditJson.storage.lAddData == '-5') {
            showTags({
                'title': '提示',
                'content': '请尽快使用"信用卡---查询进度"功能补充资料!',
                'ok': {
                    fun: function () {
                        $.mobile.changePage('../main.html', {
                            transition: "slide"
                        });
                    }
                }
            });
        } else {
            $.mobile.changePage('../main.html', {transition: "slide"});
        }
    });
});

function creditReadCard(succFun, failFun) {
    showLoader('身份证读取中...');
    creditJson.isReadCardSucc = false; //默认未读卡即是读卡失败
    Meap.readCard('', function (msg) {
    	try{
	        hideLoader();
	        creditJson.isReadCardSucc = true;
	        custermerInfo = {}; //初始化个人信息
	        msg = JSON.parse(msg);
	        custermerInfo = {
	            "nation": $.trim(msg.nation), //民族
	            "cerNO": $.trim(msg.cardNO), //身份证号
	            //"cerNO": "230304198810064212",  //身份证号
	            "address": $.trim(msg.address), //地址
	            "name": $.trim(msg.name), //姓名
	            //"name": "于明伟", //姓名
	            "cerExpdDt": $.trim(msg.cerExpdDt), //到期日期
	            "birthday": $.trim(msg.birthday), //出生日期
	            "sex": $.trim(msg.sex), //性别
	            "issAuthority": $.trim(msg.issAuthority), //签发机关
	            "image": $.trim(msg.image) //身份证头像图片
	        }
	        creditJson.storage.checkPhoto = custermerInfo.checkPhoto = ''; //联网核查返回照片
	        if (idCardIsExpired(custermerInfo.cerExpdDt)) { //判断身份证是否过期
	            showTags({
	                'title': '提示',
	                'content': '您的身份证已过期!',
	                'ok': {}
	            });
	            return;
	        }
	        succFun && succFun(msg);
		} catch(e){
	        creditJson.isReadCardSucc = false;
	        creditJson.isReadCardMsg = err;
	        failFun && failFun(err);
		}
    }, function (err) {
        hideLoader();
        creditJson.isReadCardSucc = false;
        creditJson.isReadCardMsg = err;
        failFun && failFun(err);
    })
}

function creditReadCardSucc(sendJson) {
    $('.pic_suc').html('身份证读取成功!');
    $('.footter .previous:eq(0)').removeClass('btn_next');
    $('.footter .previous:eq(0)').removeClass('back-1');
    $(".loading_box").html('<img class="img_loading" src="../../images/ic_load.gif" alt=""/><div class="read_loading">信息审核中…</div>');
    $('.sh_loading_box_shadow').remove();
    $('.header .head-left,.header .head-right,.footter .previous:eq(0)').addClass('btn-cannt-click');
    $('.ui-page').append('<div class="sh_loading_box_shadow" style="position:absolute;right:0;top:0;left:0;bottom:0;z-index:24;background-color: rgba(0,0,0,.0);"></div>');
    $('.ui-page').append('<div class="loading_box_shadow">');
    $(".ziduan-value:eq(0)").text(custermerInfo.name);
    $(".ziduan-value:eq(1)").text(custermerInfo.sex);
    $(".ziduan-value:eq(2)").text(custermerInfo.nation);
    $(".ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
    $(".ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
    $(".ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
    $(".ziduan-value:eq(6)").text(custermerInfo.address);
    $(".ziduan-value:eq(7)").text(custermerInfo.cerNO);
    $(".ziduan-value:eq(8)").text(custermerInfo.issAuthority);
    $(".ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
    $('.sfz-img').attr('src', custermerInfo.image);
    if (creditJson.storage.offlineOnline == 'offline') { //脱机模式
        $('.footter .previous:eq(0)').addClass('btn_next');
        $('.footter .previous:eq(0)').addClass('back-1');
        $('.sh_loading_box_shadow').remove();
        $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
        $(".loading_box").html('');
        $('.footter .previous:eq(1)').addClass('btn_next');
    } else { //联机模式 进行联网核查
        if (commonJson.isCustermerInfoMultiplex) { //是否点击影像采集页面进入联网核查页面 如果是则不做联网核查，但是在点击下一步查核心
            $('.footter .previous:eq(0)').addClass('btn_next');
            $('.footter .previous:eq(0)').addClass('back-1');
            $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
            $('.sh_loading_box_shadow').remove();
            $(".loading_box").html('');
            $('.footter  .previous:eq(1)').addClass('btn_next');
            if(lianwanghechaData.dianzixinyongkaDX == "9"){
            	$CL.svc.queryCoreClientInfo();
            }
        } else {
            //$('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
            //$('.sh_loading_box_shadow').remove();
            //身份证联网核查
            icitizenCertificateIdenifyFun(sendJson, function (msg) {
                icitizenCertificateIdenifySucc(sendJson, msg);
                $('.sh_loading_box_shadow').remove();
            }, function (err) {
                $('.footter .previous:eq(0)').addClass('btn_next');
                $('.footter .previous:eq(0)').addClass('back-1');
                funFail(err);
                $('.sh_loading_box_shadow').remove();
                $('.header .head-left,.header .head-right,.footter .previous:eq(0)').removeClass('btn-cannt-click');
                $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">联网核查失败！</div>');
            })

        }

    }
}

function creditReadCardFail() {
    $(".loading_box").html('');
    $(".ziduan-value:eq(0)").text('');
    $(".ziduan-value:eq(1)").text('');
    $(".ziduan-value:eq(2)").text('');
    $(".ziduan-value:eq(3)").text('');
    $(".ziduan-value:eq(4)").text('');
    $(".ziduan-value:eq(5)").text('');
    $(".ziduan-value:eq(6)").text('');
    $(".ziduan-value:eq(7)").text('');
    $(".ziduan-value:eq(8)").text('');
    $(".ziduan-value:eq(9)").text('');
    $('.sfz-img').attr('src', '../../images/head-photo.png');
    $('.pic_suc').html(creditJson.isReadCardMsg);

}

//查询核心客户信息--联网核查下一步判断核心客户号
function icustomerInfoServiceCreditREADIDNEXTFun() {
    showLoader('核心信息查询中...');
    var sendJson = {
        "b": [{
            "orgId.s": creditJson.storage.orgId,
            "moduleId.s": creditJson.storage.moduleId, //模块编号
            "tranId.s": creditJson.storage.tranId, //交易编号
            "operatorNo.s": creditJson.storage.operatorNo, //操作员
            "deviceNo.s": creditJson.storage.deviceNo, //设备编号
            "CLIENT_TYPE.s": "P", //客户类型 N组织 P个人
            "CARD.s": "", //卡号
            "ACCT_NO.s": "", //账号
            "CLIEMT_NO.s": "", //客户号
            "DOC_TYPE.s": "0", //证件类型
            "DOC_ID.s": custermerInfo.cerNO, //证件号
            "CLIENT_SHORT.s": "", //简称
            "BIRTH_DATE.s": "", //出生日
            "CELL_PHONE.s": "", //手机
            "PHONE.s": "", //住宅电话
            "LEGAL_REP.s": "", //法人代表
            "REVERSE_FLAG.s": "D", //证件号内部检查标志 默认D
            "CARD_CATEGORY.s": "" //信用卡查核心标识
        }]
    };
    icustomerInfoServiceFun(sendJson, function (msg) {
        hideLoader();
        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
        var responseObj = JSON.parse(msg);
        var responseCode = responseObj.b;
        if (responseCode[0].results == "00") {
            if ($.trim(responseCode[1].customerInfoVO[0].CH_CLIENT_NAME) != '' && $.trim(responseCode[1].customerInfoVO[0].CH_CLIENT_NAME) != custermerInfo.name) {
                showTags({
                    'title': '提示',
                    'content': '身份证姓名与核心姓名不一致,无法办理',
                    'ok': {
                        fun: function () {
                            $.mobile.changePage('credit-product.html', {
                                reverse: true
                            });
                        }
                    }
                });
                return;
            }
            creditJson.storage.CLIENT_NO = responseCode[1].customerInfoVO[0].CLIENT_NO; //获取客户号
            // creditJson.isCoreHas = creditJson.CLIENT_NO != "" ? true : false; //判断客户号是否为空
            $.mobile.changePage('credit-agreement.html');
        } else if (responseCode[0].results == "08") {
            hideLoader();
        } else if (responseCode[0].results == "12") { //客户号大于1 不能办理此业务
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {
                    fun: function () {
                        $.mobile.changePage('credit-readingID.html', {
                            reverse: true
                        });
                    }
                }
            });

        } else {
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {
                    fun: function () {
                        $.mobile.changePage('credit-product.html', {
                            reverse: true
                        });
                    }
                }
            });
        }

    }, function (err) {
        funFail(err);
    })
}

//查询核心客户信息--信息录入反显数据
//function IEstablishCustomerInformationServiceCreditFun() {
//  //核心有客户信息
//  showLoader("核心信息查询中...");
//  var sendJson = {
//      "b": [{
//          "orgId.s": creditJson.storage.orgId,
//          "CLIENT_NO.s": creditJson.storage.CLIENT_NO, //客户号debitEnter.CLIENT_NO   0700358223
//           "moduleId.s": creditJson.storage.moduleId, //模块编号
//          "AGENT_FLAG.s": "", //法人代表
//          "CLIENT_TYPE.s": "P", //N单位 P个人
//          "operatorNo.s": creditJson.storage.operatorNo //操作员
//      }]
//  };
//  IEstablishCustomerInformationServiceFFun(sendJson, function(msg) {
//      IEstablishCustomerInformationServiceFCreditSucc(msg);
//  }, function(err) {
//      funFail(err);
//  })
//}
//缓存影像
function cacheYXCJ() {
    creditJson.storage.picFileARR = []; //要打包的影像路径
    creditJson.storage.picFileInfoARR = [{
        "b": []
    }]; //每个图片的名称和类型
    creditJson.storage.picFileMsgType = []; //其他图片对象的证明类型
    if ($('#credit-customerP .img_box:eq(0) .camera-pic').length > 0) {
        creditJson.storage.custFacePic = $('#credit-customerP .img_box:eq(0) .camera-pic:eq(0)').attr('src'); //客户面部照片
    } else {
        creditJson.storage.custFacePic = '';
    }
    if ($('#credit-customerP .img_box:eq(1) .camera-pic').length > 0) {
        creditJson.storage.custAndCustOwnerPic = $('#credit-customerP .img_box:eq(1) .camera-pic:eq(0)').attr('src'); //与客户合影照片
    } else {
        creditJson.storage.custAndCustOwnerPic = '';
    }
    if ($('#credit-customerP .img_box:eq(2) .camera-pic').length > 0) {
        creditJson.storage.custAuthPic = $('#credit-customerP .img_box:eq(2) .camera-pic:eq(0)').attr('src'); //抄录内容照片
    } else {
        creditJson.storage.custAuthPic = '';
    }
    if ($('#credit-customerP .img_box:eq(3) .camera-pic').length > 0) {
        creditJson.storage.frontIDCardPic = $('#credit-customerP .img_box:eq(3) .camera-pic:eq(0)').attr('src'); //身份证正面
    } else {
        creditJson.storage.frontIDCardPic = '';
    }
    if ($('#credit-customerP .img_box:eq(4) .camera-pic').length > 0) {
        creditJson.storage.backIDCardPic = $('#credit-customerP .img_box:eq(4) .camera-pic:eq(0)').attr('src'); //身份证反面
    } else {
        creditJson.storage.backIDCardPic = '';
    }
    creditJson.storage.picFileARR.push(creditJson.storage.custFacePic, creditJson.storage.custAndCustOwnerPic, creditJson.storage.custAuthPic, creditJson.storage.frontIDCardPic, creditJson.storage.backIDCardPic);
    var len = $('#credit-customerP .img_box').length;
    if (len - 5 > 0) {
        for (var i = 5; i < len; i++) {
            if ($('#credit-customerP .img_box:eq(' + i + ') .camera-pic').length > 0) {
                creditJson.storage.picFileARR.push($('#credit-customerP .img_box:eq(' + i + ') .camera-pic:eq(0)').attr('src'));
                creditJson.storage.picFileMsgType.push($('#credit-customerP .img_box:eq(' + i + ') .camera-pic:eq(0)').closest('.customer').attr('picname'));
            }
        }
    }
    $.each(creditJson.storage.picFileARR, function (index, el) {
        if (!el) return true;
        var elIndex = el.lastIndexOf('\/') + 1;
        creditJson.storage.picFileInfoARR[0].b.push({
            FILE_NAME: el.substring(elIndex),
            FILE_TYPE: 'F0000'
        });
    })
}

//缓存信息录入
function cacheXXLR() {
    creditJson.storage.BRAFULLNAMEX = $.trim($('#c-en-xing').val()); //拼音姓
    creditJson.storage.BRAFULLNAMEM = $.trim($('#c-en-ming').val()); //拼音名
    creditJson.storage.EDUCATION = $.trim($('#c-edu').val()); //教育程度
    creditJson.storage.HOUSTYPE = $.trim($('#c-room-style').val()); //住宅类型
    creditJson.storage.MOBILENUM = removeSpace($.trim($('#c-mobile').val())); //手机号码   
    creditJson.storage.UNITZIPCODE = $.trim($('#c-zipcode').val()); //邮编
    creditJson.storage.UNITADDSF = $('#s_province').val(); //通讯地址省份
    creditJson.storage.UNITADDCS = $('#s_city').val(); //通讯地址城市
    creditJson.storage.UNITADDXX = $.trim($('#c-addr-detail').val()); //通讯地址详细
    creditJson.storage.EMAILADD = $.trim($('#c-email').val()); //E-mail
    creditJson.storage.DOMICILESF = $('#day_a').val(); //户籍所在地省份
    creditJson.storage.DOMICILECS = $('#day_b').val(); //户籍所在地城市

    if ($('#c-reference').val().length == 6) {
        creditJson.storage.RECMOBILENUM = ''; //推荐人手机号
        creditJson.storage.RECEMPNUM = $.trim($('#c-reference').val()); //推荐人员工工号
    }
    if ($('#c-reference').val().length == '') {
        creditJson.storage.RECMOBILENUM = ''; //推荐人手机号
        creditJson.storage.RECEMPNUM = ''; //推荐人员工工号
    }
    if ($('#c-reference').val().length == 11) {
        creditJson.storage.RECMOBILENUM = $.trim($('#c-reference').val()); //推荐人手机号
        creditJson.storage.RECEMPNUM = ''; //推荐人员工工号
    }
    creditJson.storage.UNITNAME = $.trim($('#c-com-name').val()); //单位全称
    creditJson.storage.UNITPROPERTY = $('#c-com-property').val(); //单位性质
    creditJson.storage.UNITPHONENUMQH = $.trim($('#c-com-tel1').val()); //电话号码-区号
    creditJson.storage.UNITPHONENUMHM = $.trim($('#c-com-tel2').val()); //电话号码-号码
    creditJson.storage.INDCATEGORY = $('#c-ndustry').val(); //行业类别
    creditJson.storage.ANNINCOME = $('#c-income').val(); //年收入
    creditJson.storage.URGNAME = $.trim($('#c-contact-name').val()); //紧急联系人姓名
    creditJson.storage.URGMOBILENUM = removeSpace($.trim($('#c-contact-mobile').val())); //紧急联系人手机
    creditJson.storage.CARDSENDADDTYPE = $.trim($('#c-card-addr').val()); //卡片递送地址
    creditJson.storage.CARDFEETYPE = $('#c-card-annualfee').val(); //年费类型
    if($('#billDateDiv').length > 0){
    	creditJson.storage.BILLDATE = $('#billDate').val(); //账单日
    }

    //2016.3.17信用卡新增字段
    if ($("#none_yihun").css("display") == 'none') {
        creditJson.storage.MASRTATU = '1'; //婚姻状况未婚
    } else {
        creditJson.storage.MASRTATU = '2'; //婚姻状况已婚
    }
    creditJson.storage.OFFICE = $('#ZhiWeiGangWei').val(); //职位／岗位
    creditJson.storage.UNITWORKEXP = $('#ZXDWGZNX').val(); //在线单位工作年限
    creditJson.storage.INTOSOURCE = $('#JinJianLaiYuan').val(); //进件来源
    creditJson.storage.CUSCARDAPPLY = $('#ShenQingEDu').val(); //申请额度
    //alert($('#c-card-repay').attr('disabled'));
    if ($('#c-card-repay').attr('disabled')) { //自动还款功能是否含有disabled属性
        creditJson.storage.ISAUTOPURCHASEISDISABLED = 'istrue';
        if ($('#c-card-repaystyle').attr('disabled')) { //如果还款方式还有disabled属性
            creditJson.storage.ISAUTOPURCHASEISDISABLED = 'istrueAll';
        }
    } else {
        creditJson.storage.ISAUTOPURCHASEISDISABLED = 'isfalse';
    }

    creditJson.storage.ISAUTOPURCHASE = $('#c-card-repay').val(); //是否开通自动还款是否可修改
    creditJson.storage.AUTODEBITACCOUNT = $.trim($('#c-card-card').val()); //账号/卡号
    creditJson.storage.AUTODEBITACCOUNTHTML = $('#c-card-card').html(); //账号/卡号HTML
    creditJson.storage.REPAYMETHOD = $('#c-card-repaystyle').val(); //自动还款方式

}
