/*
 2016-4-28
 */

//社保待遇－刷身份证 页面(socialSecurity_readingID.html)
$(document).on('pageshow', '#socialSecurity-readingID', function () {
    //初始化数据
    commonInitY();
    getCurrentLocationCoordinateFun();

    //点击读取身份证按钮
    $('.footter .previous').on('click',function(){
        //调用身份证读取通用方法
        commonReadIDCardY(function(msg){
            //读卡成功 对象值statusY.isReadCardSucc = true;
            $.mobile.changePage('socialSecurity_readID.html')
        },function(err){
            //读卡失败成功 对象值statusY.isReadCardSucc = false;
            $.mobile.changePage('socialSecurity_readID.html')
        })
    })

    //点击影像复用
    $("#socialSecurity-readingID .conter-con .picRe").on('click', function () {
        $.mobile.changePage('socialSecurity_customerInfo.html');
    })

})

//影像复用界面(socialSecurity_customerInfo.html)
$(document).on("pageshow", '#socialSecurity-video', function () {
    //alert(convenienceContract.whichPage);
    //从数据库中查询可复用的个人信息
    queryAllcacheCustermerInfo();

    $('#socialSecurity-video-prev').on('tap', function () {
        $.mobile.changePage('socialSecurity_readingID.html', {
            reverse: true
        });
    });

    $('#socialSecurity-video-next').on('tap', function () {
        if (!($(this).hasClass('btn_next'))) return;
        commonJson.isCustermerInfoMultiplex = true; //确定影像复用
        socialSecurity.custAndCustOwnerPic = custermerInfo.custAndCustOwnerPic; //与客户合影照片
        socialSecurity.frontIDCardPic = custermerInfo.frontIDCardPic; //身份证正面
        socialSecurity.backIDCardPic = custermerInfo.backIDCardPic; //身份证反面
        $.mobile.changePage('socialSecurity_readID.html');
    });
});

//社保待遇模块 刷身份证成功 身份证联网核查 查核心（socialSecurity_readID.html）
$(document).on("pageshow", '#socialSecurity-readID', function () {
    //进入界面进行联网核查
    if(commonJson.isCustermerInfoMultiplex){
        //如果是影响复用直接复用
        $(".loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
        $('.footter .previous:eq(1)').addClass('btn_next');
        $('.footter .previous:eq(0)').addClass('btn_next');
        $('.footter .previous:eq(0)').addClass('back-1');
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
    } else{
        //如果不是影像复用组需要联网核查
        //第一个对象是联网核查 核查异常重新核查传入的变量参数
        //第二个对象是联网核查 核查异常继续办理业务传入的变量参数(即下一步联网核查方法需要的参数)
        //第三个对象是联网核查 核查异常继续办理业务传入的变量参数 用于保存客户号CLIENT_NO(即下一步联网核查方法需要的参数)
        //第四个为扩展方法 如果有有效客户信息 查询有无有效账卡号
        commonIcitizenCertificateIdenifyY({
            //联网核查需要传入的数据
            nextUrl : 'socialSecurity_customerPicture.html',

            prevUrl : 'socialSecurity_readingID.html'

        },{
            sendJson : {
                "CARD_CATEGORY" : '2',								//查询卡类型
                "getPhoneInd" : '1'									//是否获取手机号标识
            },

            nextUrl : 'socialSecurity_customerPicture.html',

            prevUrl : 'socialSecurity_readingID.html'

        },socialSecurity,function(){
            commonGetDocLicenceListBankFunY({
                sendJson : {
                    "isSBICCard": '1'                      //查询卡类型(社保卡)
                },

                nextUrl : 'socialSecurity_customerPicture.html',

                prevUrl : 'socialSecurity_readingID.html'

            },socialSecurity)
        })
    }

    //点击重新获取身份证
    $('.footter .previous:eq(0)').on('click',function(){
        $.mobile.changePage('socialSecurity_readingID.html',{
            reverse:true
        })
    })

    //点击下一步进入下一页
    $('.footter .previous:eq(1)').on('click',function(){
        if(! $('.footter .previous:eq(1)').hasClass('btn_next')) return;

        //查询客户核心方法需要的参数
        //查询客户核心方法需要的参数 用于保存客户号CLIENT_NO
        //扩展方法查询有无有效账卡号 传入的第二个参数添加属性accountArr 保存所有符合的账号
        commonIcustomerInfoServiceCharacteristicProductY({

            sendJson : {
                "CARD_CATEGORY" : '2',								//查询卡类型
				"getPhoneInd" : '1'									//是否获取手机号标识
            },

            nextUrl : 'socialSecurity_customerPicture.html',

            prevUrl : 'socialSecurity_readingID.html'

        },socialSecurity,function(){
            commonGetDocLicenceListBankFunY({

                sendJson : {
                    "isSBICCard": '1'                     //查询卡类型(社保卡)
                },

                nextUrl : 'socialSecurity_customerPicture.html',

                prevUrl : 'socialSecurity_readingID.html'

            },socialSecurity)
        });
    })
})

//社保待遇-影像采集(socialSecurity_customerPicture.html)
$(document).on('pageshow', '#socialSecurity-customerP', function () {

    //判断是否有影像复用
    if(commonJson.isCustermerInfoMultiplex && !statusY.savePic){
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

            //身份证正面base64转路径
            Meap.transFormImage(getYMDHMSM('frontIDCardPic') + commonJson.udId, FRONTIDCARDPICBase64, 'picSty', function (msg2) {
                $('.img_box:eq(1) .customer').append('<img src="' + msg2 + '" width="100%" height="115px" class="camera-pic">');
            }, function (err) {
                showMsg('身份证正面base64转路径失败');
            })
            //身份证反面base64转路径
            Meap.transFormImage(getYMDHMSM('backIDCardPic') + commonJson.udId, BACKIDCARDPICBase64, 'picSty', function (msg3) {
                $('.img_box:eq(2) .customer').append('<img src="' + msg3 + '" width="100%" height="115px" class="camera-pic">');

            }, function (err) {
                showMsg('身份证反面base64转路径失败');
            })
            $('.img_box:eq(1) .rephoto,.img_box:eq(3) .rephoto,.img_box:eq(4) .rephoto').text('重拍');
            $('.img_box:eq(1) .camera,.img_box:eq(3) .camera,.img_box:eq(4) .camera').hide();
            $('.img_box:eq(2) .rephoto,.img_box:eq(3) .rephoto,.img_box:eq(4) .rephoto').text('重拍');
            $('.img_box:eq(2) .camera,.img_box:eq(3) .camera,.img_box:eq(4) .camera').hide();
        },function(err){

        })
    } else if(statusY.savePic){
        $.each(socialSecurity.picFileARR, function (index, el) {
            if(socialSecurity.picFileARR[index] == '') return;
            el = MT_path + el.split("/")[el.split("/").length - 1];
            $('.img_box:eq(' + index + ') .customer').find('.camera-pic').remove()
            $('.img_box:eq(' + index + ') .customer').append('<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">');
            $('.img_box:eq(' + index + ') .rephoto').text('重拍');
            $('.img_box:eq(' + index + ') .camera').hide();
        })
        //监测下一步是否可点击
        var ind = 0;
        for (var i = 0; i < 3; i++) {
            if ($('.customer:eq(' + i + ')').find("img").length == 2) {
                ind++;
                if (ind >= 3) {
                    $('.footter .previous:eq(1)').addClass('btn_next');
                } else {
                    $('.footter .previous:eq(1)').removeClass('btn_next');
                }
            };
        }
    }

    //预览大图 点击关闭
    $('.bigpic-review-close').click(function (event) {
        commonImageAcquisition.reviewImgClose();
    });

    //预览大图 删除图片
    $('.bigpic-review-del').click(function (event) {
        //alert(commonImageAcquisition.imgSrc);
        commonImageAcquisition.delImg(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc,3);
    });

    //预览大图 重新拍照
    //reGetImg方法传入的最后一个参数对象保存 isCompress属性 判断是否需要重新对比
    $('.bigpic-review-rephone').click(function (event) {
        //alert(commonImageAcquisition.imgSrc);
        commonImageAcquisition.reGetImg(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc, socialSecurity);
    });

    //点击拍照
    //reGetImg方法传入的最后一个参数对象保存 isCompress属性 值为false 判断是否需要重新对比
    $('.customerP .conter-con').on('click', '.customer', function (ev) {
        commonImageAcquisition.curParentObj = $(this);
        commonImageAcquisition.imgSrc = $(this).find('.camera-pic').attr('src');
        var oTarget = ev.target;
        if ($(this).find('.rephoto').html() == '重拍') { //重拍
            if ($(oTarget).hasClass('rephoto')) {
                commonImageAcquisition.reGetImg(commonImageAcquisition.curParentObj, commonImageAcquisition.imgSrc, socialSecurity);
            }
            if ($(oTarget).hasClass('camera-pic')) { //预览大图
                commonImageAcquisition.imgSrc = $(oTarget).attr('src');
                commonImageAcquisition.reviewImg($(oTarget).attr('src'));
            }
            return;
        }
        //拍照
        if (commonImageAcquisition.curParentObj.parent().hasClass('get-face')) {
            commonImageAcquisition.getFace(commonImageAcquisition.curParentObj,3,socialSecurity);
        } else {
            commonImageAcquisition.getImg(commonImageAcquisition.curParentObj,3);
        }
    });

    //点击下一步
    $('.footter .previous:eq(1)').on('click',function(){
        if(! $('.footter .previous:eq(1)').hasClass('btn_next')) return;

        //图片路径缓存 可供最后打包上传
        commonCacheYXCJY(socialSecurity,{
            '0' : 'custFacePic' ,
            '1' : 'frontIDCardPic',
            '2' : 'backIDCardPic',
            'len' : 3
        });
        if(socialSecurity.isCompress){
            $.mobile.changePage('socialSecurity_customerSign.html')
        }else{
            $.mobile.changePage('socialSecurity_comparePicture.html')
        }


    })

    //点击上一步
    $('.footter .previous:eq(0)').on('click',function(){

        //图片路径缓存 可供最后打包上传
        commonCacheYXCJY(socialSecurity,{
            '0' : 'custFacePic' ,
            '1' : 'frontIDCardPic',
            '2' : 'backIDCardPic',
            'len' : 3
        });

        $.mobile.changePage('socialSecurity_readingID.html',{
            reverse:true
        })
    })
});

//图像对比(socialSecurity_comparePicture.html)
$(document).on("pageshow", "#socialSecurity-compareP", function () {
    //隐藏客服经理远程核实框
    $("#managerList").hide();
    showLoader("影像对比中...");

    transFormBase64(socialSecurity.custFacePic, function (msg) {
        socialSecurity.faceBase64 = msg;
        transFormBase64(custermerInfo.image, function (msg1) {
            socialSecurity.imageBase64 = msg1;
            $(".personFace .camera:eq(0)").attr('src', socialSecurity.custFacePic);
            $(".personFace .camera:eq(1)").attr('src', custermerInfo.image);
            $(".personFace .camera:eq(2)").attr('src', socialSecurity.custFacePic);

            if (lianwanghechaData.CheckResult == '09' || lianwanghechaData.CheckResult == '02') {
                $(".personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + custermerInfo.checkPhoto);
            } else {
                $(".personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + custermerInfo.checkPhoto);
            }

            //图像转换成功
            //传入方法的最后一个参数保存  isTelCheck属性    值true 远程符合成功
            //传入方法的最后一个参数保存  faceRecogn属性    值保存人脸识别状态
            //传入方法的最后一个参数保存  platGlobalSeq属性 值保存客户流水号
            //传入方法的最后一个参数保存  cardResult属性    值保存联网核查结果
            //传入方法的最后一个参数保存  chipResult属性    值保存芯片结果
            commonifacelRecognitionSeFunY({
                'nextUrl' : 'socialSecurity_customerSign',
                'prevUrl' : 'socialSecurity_customerPicture'
            }, socialSecurity);

        }, function (err) {
            alert('影像转换失败！')
        })
    }, function (err) {
        alert('影像转换失败！')
    })

})

//确认信息页面(socialSecrurity_customerSign.html)
$(document).on("pageshow", "#socialSecurity-customerConfirm", function () {
	customerInfoY.USER_NO = '';
    // showLoader('获取客户信息...')
    socialSecurity.YHKH = socialSecurity.accountArr[0].docLicenceVO[0].ISSUE_ACCT_NO
    $("#socialSecurity-customerConfirm .SBICcard").html(socialSecurity.YHKH);
    $("#socialSecurity-customerConfirm .ZJLX").html(socialSecurity.ZJLX);
    $("#socialSecurity-customerConfirm .XM").html(custermerInfo.name);
    $("#socialSecurity-customerConfirm .ZJHM").html(custermerInfo.cerNO);

    //获取客户手机号
//  IEstablishCustomerInformationServiceFFun({
//      "b": [{
//          "CLIENT_TYPE.s": 'P', //客户类型
//          "CLIENT_NO.s": socialSecurity.CLIENT_NO, //客户号
//          //'CLIENT_NO.s':'0701621012',
//          "AGENT_FLAG.s": '1', //法人代表
//          "deviceNo.s": commonJson.udId, //设备编号
//          "orgId.s": commonJson.orgId,//机构号
//          "moduleId.s": socialSecurity.moduleId, //模块编号
//          "tranId.s": socialSecurity.tranId, //交易编号
//          "operatorNo.s": commonJson.adminCount,//操作员
//          "workAddress.s": commonJson.workAddress,//工作地址
//          "offlineOnline.s": commonJson.offlineOnline //脱机/联机
//      }]
//  },function(msg){
//      socialSecurityIEstablishCustomerInformationServiceSucc(msg)
//  }, function(err){
//      funFail(err)
//  });

    //点击获取验证码

    $('#getMsg').on('click', function () {
        if ($(this).hasClass('cannt-click')) {
            return;
        } else {
            $('#inp').val("");
            $(this).addClass('cannt-click');
        }
        if (socialSecurity.codeTime) {
            clearInterval(socialSecurity.codeTime);
        }
        //$('#inp').removeAttr('disabled').val(parseInt(Math.random()*(9999-1000)+1000));
        $('.codetime').html('请在<span style="color:red;">80秒</span>内输入验证码');
        $('.codetime').show();
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
                "MOBILE_NO.s": customerInfoY.MOBILEPHONE, //手机号码debitEnter.tel
                "REMARK_INFO.s": "1111111111111111111111111111111111111113",//备注
                "faceRecogn.s": socialSecurity.faceRecogn //人脸识别状态
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
            // $('.codetime').html('请在<span style="color:red;">80秒</span>内输入验证码');
            // $('#inp').removeAttr('disabled').val('');
        });
    });

    //输入验证码
    // $('#inp').bind("propertychange input", function () {
    //     if ($.trim($(this).val()) != '') {
    //         statusY.hasYZM = true;
    //         if (statusY.hasYZM == true && statusY.hasQM == true ) { //获取验证码和签名完成 下一步可点击
    //             $('.footter .previous').addClass('btn_next');
    //         }
    //     } else {
    //         statusY.hasYZM = false;
    //         $('.footter .previous').removeClass('btn_next');
    //     }
    // })

    //初始化签名方法
    signature.init({
        div: $('#qianM'), //签名容器
        finishBtn: $("#qianOK"), //完成签名按钮
        clearBtn: $("#clear-botton"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function (data) { //签名完成回调函数
            //将签名的str转成路径
            socialSecurity.data = data.replace('data:image/png;base64,', '');
            if ($('#qianOK #ic_agree').css('display') == 'none') {
                $('.qianM_shadow').show();
                $('#qianOK #ic_disagree').hide();
                $('#qianOK #ic_agree').show();
                $('#qianOK').attr('qmImg', data.replace('data:image/png;base64,', ''));
                $("#clear-botton").css("color", "#CCCCCC");
                statusY.hasQM = true;
            } else {
                statusY.hasQM = false;
                $('.qianM_shadow').hide();
                $('#qianOK #ic_disagree').show();
                $('#qianOK #ic_agree').hide();
                $("#clear-botton").css("color", "#0F45A7");
            }
        }
    });

    //点击下一步，判断验证码是否有效 是否可以提交
    $('.footter .previous').on('tap', function (event) {
        // if ($('#qianOK #ic_agree').css('display') === 'none') {
        //     showMsg('请确认签名!');
        //     return;
        // }
        if (customerInfoY.USER_NO === '' || !(statusY.hasYZM)) {
            showMsg('请点击获取短信验证码!');
            return;
        }
        customerInfoY.MSG_INFO = $.trim($('#inp').val());
        if (!(fmReg.zipCode.test(customerInfoY.MSG_INFO))) {
            showMsg('请输入正确格式的验证码');
            return;
        }
        if(!(statusY.hasQM)){
            showMsg('请确认签名!');
            return;
        }
        if (socialSecurity.codeTime) {
            clearInterval(socialSecurity.codeTime);
            $('#getMsg').removeClass('cannt-click').text('重新获取');
            $('.codetime').html('请在<span style="color:red;">0秒</span>内输入验证码');
        }
        showLoader('短信验证码验证中...');
        //验证验证码是否有效
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
                "MOBILE_NO.s": customerInfoY.MOBILEPHONE, //手机号码debitEnter.tel
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s": socialSecurity.faceRecogn //人脸识别状态
            }]
        };
        imessageAuthentionServiceYFun(sendJson, function (msg) {
            imessageAuthentionServiceYFunSocialSecuritySucc(msg);
        }, function (err) {
            customerInfoY.USER_NO = "";
            funFail(err);
        })
    })
})

//完成页(socialSecrurity_complete.html)
$(document).on("pageshow", '#socialSecurity-complete', function () {
    //完成，返回首页
    transformStringToImage(customerInfoY.pdfUrl,function(msg){
        //alert(msg);
        $('#socialSecurity-complete .card_mode').attr('src',msg);
    },function(err){
        alert(err+'生成二维码失败');
    })
    $("#socialSecurity-complete .SBICcard").html(socialSecurity.YHKH);
    $("#socialSecurity-complete .ZJLX").html(socialSecurity.ZJLX);
    $("#socialSecurity-complete .XM").html(custermerInfo.name);
    $("#socialSecurity-complete .ZJHM").html(custermerInfo.cerNO);

    $('.footter .previous').on('tap', function () {
        $.mobile.changePage('../main.html', {transition: "slide"});
    });
});
