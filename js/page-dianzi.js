/**
 * Created by Administrator on 2015/8/18.
 * named by Lei.
 */


//电子渠道刷卡界面
$(document).on('pageshow', '#dianzi-readingID', function () {
    getCurrentLocationCoordinateFun();              //缓存经纬度(校验联网)
	lianwanghechaData.dianzixinyongkaDX="1";
    //以上内容删除
    eleSignJson.isOpen = false;          //开通情况缓存
    eleSignJson.isAgree = false;         //协议界面缓存
    eleSignJson.isPhoto=false;           //影像采集界面缓存
    eleSignJson.isModify = false;     //修改按钮缓存
    eleSignJson.isTelCheck=false;     //影像对比
    eleSignJson.telBankSet = false;
    commonJson.isCustermerInfoMultiplex = false; //初始化影像复用 没有复用
    creditJson.isCancelReadCard = false; //初始化'是取消执行读取身份证方法' 默认false 打开页面就执行不取消
    creditJson.storage.offlineOnline = commonJson.offlineOnline; //联机/脱机
    //调用刷身份证方法
    $(".footter .previous").on('click', function () {
        creditReadCard(function () {
            $.mobile.changePage('dianzi-readID.html');
        }, function (err) {
            $.mobile.changePage('dianzi-readID.html');

        });
    })
    //点击影像复用按钮
    $("#dianzi-readingID .conter-con .picRe").on('click', function () {
        $.mobile.changePage('dianzi-video.html');
    });

    //下一步
    //$("#dianzi-readingID #btn_next").on('tap',function(){
    //    if(!($(this).hasClass('btn_next'))) return;
    //    $.mobile.changePage('dianzi-readID.html');
    //})
    //点击首页
    $("#dianzi-readingID .head-left").on('click', function () {
        $.mobile.changePage('../main.html');
    })
    //点击退出
    $("#dianzi-readingID .head-right").on('click', function () {
        $.mobile.changePage('../main.html');
    })
});

//电子渠道联网核查  显示身份证信息 页面
$(document).on("pageshow", '#dianzi-readID', function () {
    if (creditJson.isReadCardSucc || commonJson.isCustermerInfoMultiplex) { //读卡成功
    	lianwanghechaData.dianzixinyongkaDX="1";
        creditReadCardSucc({
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": eleSignJson.moduleId, //模块编号
                "tranId.s": eleSignJson.tranId1, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "DOCUMENT_TYPE.s": "0", //证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号码
                "CLIENT_NAME.s": custermerInfo.name, //被核对人姓名 "NAME12223964",//
                "BUSSINESSCODE.s": "01", //业务总类
                "BRANCH_ID.s": commonJson.orgId//机构号
            }]
        });
    } else {
        creditReadCardFail();
    }
    //显示身份证信息
    //if (creditJson.isReadCardSucc) { //读卡成功
    //    $("#dianzi-readID .ziduan-value:eq(0)").text(custermerInfo.name);
    //    $("#dianzi-readID .ziduan-value:eq(1)").text(custermerInfo.sex);
    //    $("#dianzi-readID .ziduan-value:eq(2)").text(custermerInfo.nation);
    //    $("#dianzi-readID .ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
    //    $("#dianzi-readID .ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
    //    $("#dianzi-readID .ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
    //    $("#dianzi-readID .ziduan-value:eq(6)").text(custermerInfo.address);
    //    $("#dianzi-readID .ziduan-value:eq(7)").text(custermerInfo.cerNO);
    //    $("#dianzi-readID .ziduan-value:eq(8)").text(custermerInfo.issAuthority);
    //    $("#dianzi-readID .ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
    //    $('#dianzi-readID .sfz-img').attr('src', custermerInfo.image);
    //    if (commonJson.isCustermerInfoMultiplex) {
    //        $("#dianzi-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">联网核查成功！</div>');
    //        $('#dz-read-next').addClass('btn_next');
    //    } else {
    //        var sendJson = {
    //            "b": [{
    //                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
    //                "workAddress.s": commonJson.workAddress,//工作地址
    //                "moduleId.s": eleSignJson.moduleId, //模块编号
    //                "tranId.s": eleSignJson.tranId1, //交易编号
    //                "operatorNo.s": commonJson.adminCount, //操作员
    //                "deviceNo.s": commonJson.udId, //设备编号
    //                "orgId.s": commonJson.orgId,
    //                "DOCUMENT_TYPE.s": "0", //证件类型
    //                "DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号码
    //                "CLIENT_NAME.s": custermerInfo.name, //被核对人姓名 "NAME12223964",//
    //                "BUSSINESSCODE.s": "01", //业务总类
    //                "BRANCH_ID.s": commonJson.orgId//机构号
    //            }]
    //        };
    //        //身份证联网核查
    //        icitizenCertificateIdenifyFun(sendJson, function (msg) {
    //            eleItizenCertificateIdenifySucc(msg);
    //        }, function (err) {
    //            $("#dianzi-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">联网核查失败！</div>');
    //            funFail(err);
    //        });
    //    }
    //} else {
    //    if (commonJson.isCustermerInfoMultiplex) {
    //        $("#dianzi-readID .ziduan-value:eq(0)").text(custermerInfo.name);
    //        $("#dianzi-readID .ziduan-value:eq(1)").text(custermerInfo.sex);
    //        $("#dianzi-readID .ziduan-value:eq(2)").text(custermerInfo.nation);
    //        $("#dianzi-readID .ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
    //        $("#dianzi-readID .ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
    //        $("#dianzi-readID .ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
    //        $("#dianzi-readID .ziduan-value:eq(6)").text(custermerInfo.address);
    //        $("#dianzi-readID .ziduan-value:eq(7)").text(custermerInfo.cerNO);
    //        $("#dianzi-readID .ziduan-value:eq(8)").text(custermerInfo.issAuthority);
    //        $("#dianzi-readID .ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
    //        $('#dianzi-readID .sfz-img').attr('src', custermerInfo.image);
    //        $("#dianzi-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">联网核查成功！</div>');
    //        //$("#xinka-readID .loading_box").html('');
    //        $('#dz-read-next').addClass('btn_next');
    //    } else {
    //        $("#dianzi-readID .pic_suc").text('身份证读取失败!');
    //        $("#dianzi-readID .loading_box").html('');
    //    }
    //}
    //点击下一步按钮
    $('#dz-read-next').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        showLoader('客户信息查询中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": eleSignJson.moduleId, //模块编号 4
                "tranId.s": eleSignJson.tranId1, //交易编号   2
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
                "REVERSE_FLAG.s": "D", //证件号内部检查标志 默认D
                "CARD_CATEGORY.s": "2"	//2检查是否有客户号和有效凭证存在
            }]
        };
        //核心联查
        icustomerInfoServiceFun(sendJson, function (msg) {
            eleCustomerInfoServiceEleSignSucc(msg);
        }, function (err) {
            funFail(err);
        });
    });
    //点击上一步，跳转页面
    $('#dz-read-pre').on('click', function () {
    	 if (!($(this).hasClass('back-1'))) return;
        $.mobile.changePage('./dianzi-readingID.html', {
            reverse: true
        });
    });
    
    $(".lianwanghecha-chongxin").on("click",function(){//重新联网核查
    	showLoader('信息查询中...');
 		$(".lianwanghecha-yichang").hide();
            creditReadCardSucc({
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": eleSignJson.moduleId, //模块编号
                "tranId.s": eleSignJson.tranId1, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "DOCUMENT_TYPE.s": "0", //证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号码
                "CLIENT_NAME.s": custermerInfo.name, //被核对人姓名 "NAME12223964",//
                "BUSSINESSCODE.s": "01", //业务总类
                "BRANCH_ID.s": commonJson.orgId//机构号
            }]
        });            
        
 	});
 	$(".lianwanghecha-jixu").on("click",function(){//继续业务办理
 		$(".lianwanghecha-yichang").hide();
		
        showLoader('客户信息查询中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": eleSignJson.moduleId, //模块编号 4
                "tranId.s": eleSignJson.tranId1, //交易编号   2
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
                "REVERSE_FLAG.s": "D", //证件号内部检查标志 默认D
                "CARD_CATEGORY.s": "2"	//2检查是否有客户号和有效凭证存在
            }]
        };
        //核心联查
        icustomerInfoServiceFun(sendJson, function (msg) {
            eleCustomerInfoServiceEleSignSucc(msg);
        }, function (err) {
            funFail(err);
        });
 		//lianwanghechaFun();
 	});
 	$(".lianwanghecha-tuichu").on("click",function(){//退出
 		$.mobile.changePage('dianzi-readingID.html', { transition: "slide" });
 		$(".lianwanghecha-yichang").hide();
 	});
    
    
    
    
    
    
    
});

//dianzi-agreement页面
$(document).on("pageshow", '#dianzi-agreement', function () {
    eleSignJson.isOpen = true;     //开通情况页面
    //添加协议内容
    //$("#dianzi-agreement .agree-content").html('客户须知');            //html(eleSignJson.proProtocol);
    if (eleSignJson.isAgree) {
        $('#ic-disagree').css('display', 'none');
        $('#ic-agree').css('display', 'inline-block');
        $('#dz-agree-next').addClass('btn_next');
    }
    //同意协议勾选
    var agreeBtn = document.getElementById('dz-agree-btn');
    agreeBtn.onclick = function () {
        var dis = $('#ic-disagree').css('display');
        //console.log(dis);
        if (dis != 'none') {
            $('#ic-disagree').css('display', 'none');
            $('#ic-agree').css('display', 'inline-block');
            $('#dz-agree-next').addClass('btn_next');
            eleSignJson.isAgree = true;
        } else {
            $('#ic-agree').css('display', 'none');
            $('#ic-disagree').css('display', 'inline-block');
            $('#dz-agree-next').removeClass('btn_next');
            eleSignJson.isAgree = false;
        }

    };
    //协议导航切换
    $(".jibenxinxi-ke>div").on("click",function(){
        var jibenxinxiThis=$(".jibenxinxi-ke>div").index($(this));
        $(this).addClass("jibenxinxi-bgcolor").siblings("div").removeClass("jibenxinxi-bgcolor");
        $(".agree-notice>strong").eq(jibenxinxiThis).addClass("strShow").siblings("strong").removeClass("strShow");
        $(".agree-content>div").eq(jibenxinxiThis).addClass("agree-conBar").siblings("div").removeClass("agree-conBar");
    });
    //点击下一步，跳转页面
    $('#dz-agree-next').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        $.mobile.changePage('dianzi-customerP.html', {
            transition: "slide"
        });
    });
    //点击上一步，跳转页面
    $('#dz-agree-pre').on('click', function () {
        $.mobile.changePage('./dianzi-kaiTong.html', {
            reverse: true
        });
    });
});

//dianzi-customerP页面  拍照方法
var eleSignImageAcquisition = {
    imgSrc: '', //记录照片路径,
    curParentObj: '', //记录要删除的对象
    delImg: function (curParentObj, imgSrc) { //删除照片
        deletePhoto([imgSrc], function (msg) {
            curParentObj.find('.camera-pic').remove();
            curParentObj.find('.camera').show();
            curParentObj.find('.rephoto').html('必拍');
            //curParentObj.find('.rephoto').removeClass('recolor');
            $('.bigpic-review-box').animate({
                    opacity: '0'
                },
                200,
                function () {
                    $('.bigpic-review-box').hide();
                });
            //监测下一步是否可点击
            $('#dz_customerP_next').removeClass('btn_next');
            var ind = 0;
            for (var i = 0; i < 4; i++) {
                if ($('#dianzi-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 4) {
                        $('#dz_customerP_next').addClass('btn_next');
                    }
                }
            }
        }, function (err) {
        })

    },
    getImg: function (curParentObj) { //拍照
        Meap.media('camera', curParentObj.attr('picName'), function (msg) {
            eleSignImageAcquisition.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.find('.camera-pic').remove();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');
            //curParentObj.find('.rephoto').addClass('recolor');
            //监测下一步是否可点击
            var ind = 0;
            for (var i = 0; i < 4; i++) {
                if ($('#dianzi-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 4) {
                        $('#dz_customerP_next').addClass('btn_next');
                    }
                }
            }
        }, function (err) {
            showMsg(err);
        })
    },
    getFace: function (curParentObj) {
        faceDistinguish('trans', function (msg) {
            eleSignImageAcquisition.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');
            $('#dz_customerP_next').removeClass('btn_next');
            var ind = 0;
            for (var i = 0; i < 4; i++) {
                if ($('#dianzi-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 4) {
                        $('#dz_customerP_next').addClass('btn_next');
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
                deletePhoto([imgSrc], function (returnDelMsg) {
                    eleSignImageAcquisition.imgSrc = returnGetMsg;
                    curParentObj.find('.camera-pic').attr('src', returnGetMsg);
                    $('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
                    eleSignJson.isTelCheck = false;
                }, function (err) {

                })
            }, function (err) {
                showMsg('重拍失败');
            })
        } else {
            Meap.media('camera', curParentObj.attr('picName'), function (returnGetMsg) {
                imgSrc = curParentObj.find('.camera-pic').attr('src');
                deletePhoto([imgSrc], function (returnDelMsg) {
                    eleSignImageAcquisition.imgSrc = returnGetMsg;
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
//dianzi-customerP页面
$(document).on("pageshow", '#dianzi-customerP', function () {
    if (eleSignJson.isAgree&&eleSignJson.isPhoto) {
        if (eleSignJson.custFacePic != undefined) {
            $('.img_box:eq(0) .rephoto').text('重拍');
            $('.img_box:eq(0) .camera').hide();
            $('.img_box:eq(0) .customer').append('<img src="' + eleSignJson.custFacePic + '" width="100%" height="115px"  class="camera-pic">');
        }
        if (eleSignJson.custAndCustOwnerPic != undefined) {
            $('.img_box:eq(1) .rephoto').text('重拍');
            $('.img_box:eq(1) .camera').hide();
            $('.img_box:eq(1) .customer').append('<img src="' + eleSignJson.custAndCustOwnerPic + '" width="100%" height="115px"  class="camera-pic">');
        }
        if (eleSignJson.frontIDCardPic != undefined) {
            $('.img_box:eq(2) .rephoto').text('重拍');
            $('.img_box:eq(2) .camera').hide();
            $('.img_box:eq(2) .customer').append('<img src="' + eleSignJson.frontIDCardPic + '" width="100%" height="115px"  class="camera-pic">');
        }
        if (eleSignJson.backIDCardPic != undefined) {
            $('.img_box:eq(3) .rephoto').text('重拍');
            $('.img_box:eq(3) .camera').hide();
            $('.img_box:eq(3) .customer').append('<img src="' + eleSignJson.backIDCardPic + '" width="100%" height="115px"  class="camera-pic">');
        }
        var ind = 0;
        for (var i = 0; i < 4; i++) {
            if ($('#dianzi-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                ind++;
                if (ind >= 4) {
                    $('#dz_customerP_next').addClass('btn_next');
                }
            }
        }
    }else{
        if (commonJson.isCustermerInfoMultiplex) { //如果影像复用 影像进行返显
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
                Meap.transFormImage(getYMDHMSM('frontIDCardPic') + commonJson.udId, FRONTIDCARDPICBase64, 'picSty', function (msg2) {
                    $('.img_box:eq(2) .customer').append('<img src="' + msg2 + '" width="100%" height="115px" class="camera-pic">');
                }, function (err) {
                    showMsg('身份证正面base64转路径失败');
                });
                //身份证反面base64转路径
                Meap.transFormImage(getYMDHMSM('backIDCardPic') + commonJson.udId, BACKIDCARDPICBase64, 'picSty', function (msg3) {
                    $('.img_box:eq(3) .customer').append('<img src="' + msg3 + '" width="100%" height="115px" class="camera-pic">');

                }, function (err) {
                    showMsg('身份证反面base64转路径失败');
                });
                $('.img_box:eq(2) .rephoto,.img_box:eq(3) .rephoto').text('重拍');
                $('.img_box:eq(2) .camera,.img_box:eq(3) .camera').hide();
            }, function (err) {
            })
        }
    }
    eleSignJson.isPhoto=true;

    //虚拟卡影像采集
    /*$('#xinka-customerP .conter-con').on('tap',function(ev){
     var oTarget = ev.target;
     var _this = $(oTarget);
     if($(oTarget).closest('.camera').length){
     Meap.media('camera','',function(msg){
     _this.hide();
     _this.parent().append('<img src="'+msg+'" width="100%" height="115px" link="'+msg+'" class="camera-pic">');
     _this.siblings('.rephoto').text('重拍');
     var ind = 0;
     for(var i = 0; i < 4; i++){
     if($('#xinka-customerP .customer:eq('+i+')').find("img").length == 2){
     ind++;
     if (ind >= 4){
     $('#xk_customerP_next').addClass('btn_next');
     }
     };
     }
     },function(err){
     alert(err+"err");
     })
     };

     if($(oTarget).closest('.rephoto').length && $(oTarget).closest('.rephoto').text()=='重拍'){
     Meap.media('camera','',function(msg){
     _this.siblings('img:last').attr({
     "src" : msg,
     "link" : msg
     })
     },function(err){
     alert(err+"err");
     })
     };
     if($(oTarget).closest('.camera-pic').length){
     //alert("点击影像");
     }
     });*/
    //预览大图 点击关闭
    $('.bigpic-review-close').click(function (event) {
        eleSignImageAcquisition.reviewImgClose();
    });
    //预览大图 删除图片
    $('.bigpic-review-del').click(function (event) {
        eleSignImageAcquisition.delImg(eleSignImageAcquisition.curParentObj, eleSignImageAcquisition.imgSrc);
    });
    //预览大图 重新拍照
    $('.bigpic-review-rephone').click(function (event) {
        eleSignImageAcquisition.reGetImg(eleSignImageAcquisition.curParentObj, eleSignImageAcquisition.imgSrc);
    });
    $('#dianzi-customerP .conter-con').on('click', '.customer', function (ev) {
        eleSignImageAcquisition.curParentObj = $(this);
        var oTarget = ev.target;
        if ($(this).find('.rephoto').html() == '重拍') { //重拍
            if ($(oTarget).hasClass('rephoto')) {
                eleSignImageAcquisition.reGetImg(eleSignImageAcquisition.curParentObj, eleSignImageAcquisition.imgSrc);
            }
            if ($(oTarget).hasClass('camera-pic')) { //预览大图
                eleSignImageAcquisition.imgSrc = $(oTarget).attr('src');
                eleSignImageAcquisition.reviewImg($(oTarget).attr('src'));
            }
            return;
        }
        //拍照
        if (eleSignImageAcquisition.curParentObj.parent().hasClass('get-face')) {
            eleSignImageAcquisition.getFace(eleSignImageAcquisition.curParentObj);
        } else {
            eleSignImageAcquisition.getImg(eleSignImageAcquisition.curParentObj);
        }
    });
    //点击上一步，跳转页面
    $('#dz_customerP_pre').on('click', function () {
        eleSignJson.custFacePic = $('.img_box:eq(0) .customer img:eq(1)').attr('src');
        eleSignJson.custAndCustOwnerPic = $('.img_box:eq(1) .customer img:eq(1)').attr('src');
        eleSignJson.frontIDCardPic = $('.img_box:eq(2) .customer img:eq(1)').attr('src');
        eleSignJson.backIDCardPic = $('.img_box:eq(3) .customer img:eq(1)').attr('src');
        $.mobile.changePage('./dianzi-agreement.html', {
            reverse: true
        });
    });
    $('#dz_customerP_next').on('click', function () {
        if (!$(this).hasClass('btn_next')) return;
        //缓存虚拟卡影像资料
        eleSignJson.picFileARR = [];//要打包的影像路径
        eleSignJson.custFacePic = $('#dianzi-customerP .camera-pic:eq(0)').attr('src');
        eleSignJson.custAndCustOwnerPic = $('#dianzi-customerP .camera-pic:eq(1)').attr('src');
        eleSignJson.frontIDCardPic = $('#dianzi-customerP .camera-pic:eq(2)').attr('src');
        eleSignJson.backIDCardPic = $('#dianzi-customerP .camera-pic:eq(3)').attr('src');
        custermerInfo.custAndCustOwnerPic = $('#dianzi-customerP .camera-pic:eq(1)').attr('src'); //与客户合影照片
        custermerInfo.frontIDCardPic = $('#dianzi-customerP .camera-pic:eq(2)').attr('src'); //身份证正面
        custermerInfo.backIDCardPic = $('#dianzi-customerP .camera-pic:eq(3)').attr('src'); //身份证反面
        eleSignJson.picFileARR.push(eleSignJson.custFacePic, eleSignJson.custAndCustOwnerPic, eleSignJson.frontIDCardPic, eleSignJson.backIDCardPic);
        if(eleSignJson.isTelCheck ){
            $.mobile.changePage('./dianzi-customerConfirm.html', {transition: "slide"});
        }else{
            $.mobile.changePage('./personFace.html', {transition: "slide"});
        }


        //面部照片base64
        //var facePicStr = $('#dianzi-customerP .camera-pic:eq(0)').attr('src');
        //
        //var sendJson={
        //    "b":[{
        //        "deviceNo.s":commonJson.udId, //设备编号
        //        "moduleId.s":eleSignJson.moduleId,//模块名
        //        "tranId.s":eleSignJson.tranId1,//交易名
        //        "orgId.s":commonJson.orgId,//机构号
        //        "operatorNo.s":commonJson.adminCount,//操作员
        //        "OPERATOR_NO.s":commonJson.adminCount,//业务经办人工号
        //        "TRANS_SEQ_NO.s":'',//交易流水号
        //        "TRANS_DATE.s":'',//交易日期
        //        "TRANS_TIME.s":'',//交易时间
        //        "TRANS_SCENE.s":"0001",//交易场景
        //        "COMPARE_TYPE.s":"2",//对比类型
        //        "WS_TYPE.s":"2",//终端类型
        //        "WSNO.s":commonJson.udId,//终端号
        //        "VERSION.s":"v1.1.4",//当前控件版本
        //        "TRANS_CHANWEL.s":"301",//渠道
        //        "TRANS_DEP_NO.s":"",//所属一级支行
        //        "TRANS_SUB_NO.s":"",//所属二级支行
        //        "ID_CARD.s":custermerInfo.cerNO,//身份证号码
        //        "IMG_BASE.s":'',//现场照片
        //        "CRYPT_TYPE.s":"0",//图像是否经过加密
        //        "ID_IMG_BASE.s":"",//联网核查照片
        //        "CARD_IMG_BASE.s":""//芯片照片
        //    }]
        //}
        //
        //ifacelRecognitionSeFun(sendJson,function(msg){//用户人脸识别
        //    alert('成功！');
        //},function(err){
        //    funFail(err);
        //});
    });
});

var netBankOpenInd = false;
//电子签约   信息确认页面
$(document).on("pageshow", '#dianzi-customerConfirm', function () {
	eleSignJson.USER_NO = '';
	eleSignJson.platGlobalSeq = undefined;

	netBankOpenInd = false;
    //显示信息
    if (eleSignJson.NETBANK_STATE == 'N') { //网上银行
        $('.msg-l .work-left').eq(1).find('.que-l-box').css('display', 'block');
        $('.msg-l .work-left').eq(1).find('.text-toggle').text('已开通');
        $('#netBank-out').text(eleSignJson.SEC_TRANSFER_LIMIT);
        $('#netBank-in').text(eleSignJson.SEC_EPAY_LIMIT);
        netBankOpenInd = true;
    } else if (eleSignJson.NETBANK_STATE == 'W' && eleSignJson.NETBANK_STATE_W == 'N') {
        $('.msg-l .work-left').eq(1).find('.que-l-box').css('display', 'block');
        $('.msg-l .work-left').eq(1).find('.text-toggle').text('已开通');
        $('#netBank-out').text(eleSignJson.SEC_TRANSFER_LIMIT);
        $('#netBank-in').text(eleSignJson.SEC_EPAY_LIMIT);
        netBankOpenInd = true;
    } else if (eleSignJson.NETBANK_STATE == '' && eleSignJson.NETBANK_STATE_N == 'N' || eleSignJson.NETBANK_STATE_N == 'U' || eleSignJson.NETBANK_STATE_N == 'L') {
        $('.msg-l .work-left').eq(1).find('.que-l-box').css('display', 'block');
        $('.msg-l .work-left').eq(1).find('.text-toggle').text('已开通');
        $('#netBank-out').text(eleSignJson.SEC_TRANSFER_LIMIT);
        $('#netBank-in').text(eleSignJson.SEC_EPAY_LIMIT);
        netBankOpenInd = true;
    } else {
        $('.msg-l .work-left').eq(1).find('.que-l-box').css('display', 'none');
        $('.msg-l .work-left').eq(1).find('.text-toggle').text('已关闭');
        netBankOpenInd = false;
    }
    if (eleSignJson.WAP_FLAG == "N") { //手机银行
        $('.msg-l .work-left').eq(2).find('.que-l-box').css('display', 'block');
        $('.msg-l .work-left').eq(2).find('.text-toggle').text('已开通');
        $('.moBank-out').text(eleSignJson.SEC_WAPTRANSFER_LIMIT);
    } else {
        $('.msg-l .work-left').eq(2).find('.que-l-box').css('display', 'none');
        $('.msg-l .work-left').eq(2).find('.text-toggle').text('已关闭');
    }
    //挂靠账户
    $('#dianzi-customerConfirm #counter').text(eleSignJson.guBox.length);
    if (eleSignJson.guBox.length > 0) {
        var txtHtml = '';
        $.each(eleSignJson.guBox, function () {
            txtHtml += '  <div class="que-l-box"><span>' + this + '</span></div>'
        });
        $('#dianzi-customerConfirm #guaK').append(txtHtml);
        $('#dianzi-customerConfirm #guaK .que-l-box').css('display', 'block');
    }
    //银信通
    var weiArr = eleSignJson.NOTE_OPEN.split('');
    if (eleSignJson.yin_ACCT_NO == '') {
        $('.yin-zhangH').text(eleSignJson.yin_ACCT_NO_y); //卡账号
    } else {
        $('.yin-zhangH').text(eleSignJson.yin_ACCT_NO); //卡账号
    }
    if (weiArr[0] == '1') { //资金转出通知
        $('.msg-r .work-right').eq(2).find('.que-r-box').css('display', 'block');
        $('.yinM-out-toggle').text('已开通');
        $('.yin-out').text(eleSignJson.FROM_INCEPT_AMT);
    } else {
        $('.msg-r .work-right').eq(2).find('.que-r-box').css('display', 'none');
        $('.yinM-out-toggle').text('已关闭');
    }
    if (weiArr[1] == '1') { //资金转入通知
        $('.msg-r .work-right').eq(3).find('.que-r-box').css('display', 'block');
        $('.yinM-in-toggle').text('已开通');
        $('.yin-in').text(eleSignJson.TO_INCEPT_AMT);
    } else {
        $('.msg-r .work-right').eq(3).find('.que-r-box').css('display', 'none');
        $('.yinM-in-toggle').text('已关闭');
    }
    if (weiArr[3] == '1') { //资金到期通知
        $('.yinM-end-toggle').text('已开通');
    } else {
        $('.yinM-end-toggle').text('已关闭');
    }
    if (weiArr[5] == '1') { //金融信息通知
        $('.yinM-msg-toggle').text('已开通');
    } else {
        $('.yinM-msg-toggle').text('已关闭');
    }
    //若设置电话银行密码则不需要短信验证
	if(eleSignJson.telBankSet == true && netBankOpenInd == true){
		$('#msgVerification').hide();
	} else {
	    //点击获取验证码
	    eleSignJson.getYZM = true; //是否可以点击获取验证码按钮
	    $("#dianzi-auth-time").text('80');
	    $('#dianzi-customerConfirm #getMsg').on('click', function () {
            $('#dianzi-customerConfirm #inp').val('');
	        if (eleSignJson.getYZM == false) {
	            $('#getMsg').removeClass('disMsg');
	            return;
	        }
	        eleSignJson.getYZM = false;
	        $('#getMsg').removeClass('disMsg').addClass('disgua-btn');
	        if (eleSignJson.codeTime) {
	            clearInterval(eleSignJson.codeTime);
	        }
	        $("#dianzi-auth-time").text('80');
	        var sendJson = {
	            "b": [{
	                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
	                "workAddress.s": commonJson.workAddress,//工作地址
	                "moduleId.s": eleSignJson.moduleId, //模块编号
	                "tranId.s": eleSignJson.tranId1, //交易编号
	                "operatorNo.s": commonJson.adminCount, //操作员
	                "deviceNo.s": commonJson.udId, //设备编号
	                "orgId.s": commonJson.orgId,
	                "SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
	                "Flags.s": "BBBB", //标记位
	                "MOBILE_NO.s": eleSignJson.PHONE_NO, //手机号码'018232053662',//
	                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
	                "faceRecogn.s" : eleSignJson.faceRecogn //人脸识别
	            }]
	        };
            showLoader('获取中...');
	        imessageAuthentionServiceFun(sendJson, function (msg) {
	            imessageAuthentionServiceEleSignSucc(msg);
	        }, function (err) {
                hideLoader();
	            eleSignJson.getYZM = true;
	            $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
	            funFail(err);
	        });
	    });
	}
    //页面跳转
    $('#dz-customerCon-sub').on('click', function () {
        // if (!$(this).hasClass('btn_next')) return;
        if ($('#ic-agree').is(':hidden')) {
            showMsg('请阅读并确认协议!');
            return;
        }
        if ($('#ic_agree').is(':hidden')) {
            showMsg('请确认签名!');
            return;
        }
        if(eleSignJson.telBankSet == true && netBankOpenInd == true){
        	if (eleSignJson.platGlobalSeq != undefined && eleSignJson.platGlobalSeq != null && eleSignJson.platGlobalSeq != '') {
                eleImsgAuthUpload(function(){
    	            submitElectronicSignInfo();
                });
	        } else {
	            getPlatGlobalSeq(eleSignJson, function () {
                    eleImsgAuthUpload(function(){
	                   submitElectronicSignInfo();
                    });
	            });
	        }
        } else {
        	if(eleSignJson.USER_NO == ''){
                showMsg('请点击获取短信验证码!');
                return;
            }
	        if ($('#dianzi-customerConfirm #inp').val() == "") {
	            showMsg('请填写验证码！');
	            return;
	        }
	        if(!(fmReg.pwD6.test($('#dianzi-customerConfirm #inp').eq(0).val()))){
	            showMsg('请输入正确格式的短信验证码！');
	            return;
	        }
	        showLoader("短信验证码验证中...");
            if (eleSignJson.codeTime) {
                clearInterval(eleSignJson.codeTime);
            }
            $("#getMsg").text('重新获取');
            $("#dianzi-auth-time").text('0');
            $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
            eleSignJson.getYZM = true;
	        var sendJson = {
	            "b": [{
	                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
	                "workAddress.s": commonJson.workAddress,//工作地址
	                "moduleId.s": eleSignJson.moduleId, //模块编号
	                "tranId.s": eleSignJson.tranId1, //交易编号
	                "operatorNo.s": commonJson.adminCount, //操作员
	                "deviceNo.s": commonJson.udId, //设备编号
	                "orgId.s": commonJson.orgId,
	                "SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
	                "USER_NO.s": eleSignJson.USER_NO, //用户唯一标识
	                "EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
	                "MSG_INFO.s": $('#dianzi-customerConfirm #inp').val(), //动态口令debitEnter.MSG_INFO
	                "Flags.s": "BBBB", //标记位
	                "MOBILE_NO.s": eleSignJson.PHONE_NO, //手机号码 '018232053662',//
	                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
	                "faceRecogn.s" : eleSignJson.faceRecogn //人脸识别
	
	            }]
	        };
	        imessageAuthentionServiceYFun(sendJson, function (msg) {
	            eleImessageAuthentionServiceYSucc(msg);
	        }, function (err) {
                eleSignJson.USER_NO = "";
	            funFail(err);
	        });
	    }
    });

    //点击打开pdf文件
    $('.dianzi-sure-xy span:eq(0)').on('click', function () {
        Meap.scanOfficeFile('www/images/个人电子银行业务服务协议.docx', function (msg) {
        }, function (err) {
        })
    });
    $('.dianzi-sure-xy span:eq(1)').on('click', function () {
        Meap.scanOfficeFile('www/images/个人银信通使用须知.doc', function (msg) {
        }, function (err) {
        })
    });
    $('.dianzi-sure-xy .sure-img').on('click', function () {
        var dis = $('.sure-img').find('#ic-disagree').css('display');
        if (dis != 'none') {
            $('#ic-disagree').css('display', 'none');
            $('#ic-agree').css('display', 'inline-block');
        } else {
            $('#ic-agree').css('display', 'none');
            $('#ic-disagree').css('display', 'inline-block');
        }
    });


//初始化方法
    signature.init({
        div: $('#qianM'), //签名容器
        finishBtn: $("#qianOK"), //完成签名按钮
        clearBtn: $("#clear-botton"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function (data) { //签名完成回调函数
            //eleSignJson.data = data;
            //$('#ic_disagree').hide();
            //$('#ic_agree').show();
            if ($('#ic_disagree').is(':hidden')) {
                $('#ic_agree').hide();
                $('#ic_disagree').show();
                $("#dz-sign-over").remove();
            } else {
                $('#ic_disagree').hide();
                $('#ic_agree').show();
                $('#dianzi-customerConfirm .video-qian .qian-box').css('position', 'relative');
                $('#dianzi-customerConfirm .video-qian .qian-box').append('<div id="dz-sign-over" style="position:absolute; top:0; right:0;left:0;bottom:0"></div>');
                eleSignJson.data = data.replace('data:image/png;base64,', '')
            }
        }

    });
    //点击修改按钮
    $('#dianzi-customerConfirm .reWrite').on('click', function () {
        eleSignJson.isModify = true;
        eleSignJson.getYZM = true;
        $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
        if (eleSignJson.codeTime) {
            clearInterval(eleSignJson.codeTime);
        }
        $.mobile.changePage('dianzi-kaiTong.html', {reverse: true});
    })
});

//电子签约    影像复用界面
$(document).on("pageshow", '#dianzi-video', function () {
    //从数据库中查询可复用的个人信息
    queryAllcacheCustermerInfo();
    //为每一条数据添加class=‘click'
    //$("#dianzi-video .box-rows").bind("click", this, function () {
    //    if ($(this).hasClass('click')) {
    //        $(this).removeClass('click');
    //        $('#dianzi-video #btn_next').removeClass('btn_next');
    //    } else {
    //        //遍历每一条数据恢复初始状态
    //        $('#dianzi-video .box-rows').each(function () {
    //            if ($(this).hasClass('click')) {
    //                $(this).removeClass('click');
    //                $('#dianzi-video #btn_next').addClass('btn_next');
    //            }
    //        });
    //        $(this).addClass('click');
    //        $('#dianzi-video-btn').addClass('btn_next');
    //    }
    //
    //});
    //点击取消
    $('#dianzi-video .previous-con').on('click', function () {
        $.mobile.changePage('dianzi-readingID.html', {reverse: true});
    });
    //点击影像复用
    $('#btn_next').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        commonJson.isCustermerInfoMultiplex = true; //使用影像复用功能
        $.mobile.changePage('dianzi-readID.html');
    })
});

//电子签约   开通情况界面
$(document).on("pageshow", '#dianzi-kaiTong', function () {
    if(eleSignJson.userSign){ //异常处理界面 添加用户名字段
        var userHtml='<div class="user">' +
            '<span>网银用户名&nbsp;:&nbsp;&nbsp;</span>' +
            '<span class="userName"></span>' +
            '</div>';
        $('#dianzi-kaiTong .conter-auto').prepend(userHtml);
    }
    //查询交易密码制空
    zhangArr = [0];
    zhangArr[4] = '';
    $('.bank-mm .mm-value').eq(0).text('');
    $('.bank-mm .mm-value').eq(1).text('');
    if (eleSignJson.isModify || eleSignJson.isOpen) {   //返显
        if(eleSignJson.userSign){  //异常处理
            $('#dianzi-kaiTong .userName').html(eleSignJson.CLIENT_NAME);
        }
        if (eleSignJson.NETBANK_STATE == 'N') { /*N--正常  C--销户  L--锁定  U--待激活  W--未开通*/
            $('#netBank .kai').text('已开通');
            $('#switch-one').val('on').slider("refresh");
            if ($('.netBank .netBank-content').hasClass('no-kai')) {
                $('.netBank .netBank-content').removeClass('no-kai');
                $('.netBank .netBank-content input').removeClass('no-kai');
            }
            $('.netBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_TRANSFER_LIMIT).removeAttr('disabled');    //实际限额
            $('.netBank .netBank-content .wangyin:eq(1) .xe').val(eleSignJson.SEC_EPAY_LIMIT).removeAttr('disabled');
        } else if (eleSignJson.NETBANK_STATE == '') {
            if (eleSignJson.NETBANK_STATE_N == 'N') {
                $('#netBank .kai').text('已开通');
                $('#switch-one').val('on').slider("refresh");
                if ($('.netBank .netBank-content').hasClass('no-kai')) {
                    $('.netBank .netBank-content').removeClass('no-kai');
                    $('.netBank .netBank-content input').removeClass('no-kai');
                }
                $('.netBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_TRANSFER_LIMIT).removeAttr('disabled');    //实际限额
                $('.netBank .netBank-content .wangyin:eq(1) .xe').val(eleSignJson.SEC_EPAY_LIMIT).removeAttr('disabled');
            } else if (eleSignJson.NETBANK_STATE_N == 'L' || eleSignJson.NETBANK_STATE_N == 'U') {
                showTags({                //接口服务失败
                    'title': '提示',
                    'content': '网银状态非正常，不可操作网银相关交易！',
                    'ok': {
                        fun: function () {
                        }
                    }
                });
                $('#netBank .kai').text('已开通');
                $('#switch-one').val('on').attr('disabled', 'disabled').slider("refresh");
                if (!$('.netBank .netBank-content').hasClass('no-kai')) {
                    $('.netBank .netBank-content').addClass('no-kai');
                    $('.netBank .netBank-content input').addClass('no-kai').attr('disabled', 'disabled');
                }
                $('.netBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_TRANSFER_LIMIT).addClass('disabled');    //实际限额
                $('.netBank .netBank-content .wangyin:eq(1) .xe').val(eleSignJson.SEC_EPAY_LIMIT).addClass('disabled');
            } else {
                $('#netBank .kai').text('已关闭').addClass('off');
                $("#switch-one").val('off').slider("refresh");
                if (!$('.netBank .netBank-content').hasClass('no-kai')) {
                    $('.netBank .netBank-content').addClass('no-kai');
                    $('.netBank .netBank-content input').addClass('no-kai').attr('disabled', 'disabled');
                }
                $('.netBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_TRANSFER_DFLIMIT);    //最大限额
                $('.netBank .netBank-content .wangyin:eq(1) .xe').val(eleSignJson.SEC_EPAY_DFLIMIT);    //最大限额
            }
        } else if (eleSignJson.NETBANK_STATE == 'L' || eleSignJson.NETBANK_STATE == 'U') {
            showTags({                //接口服务失败
                'title': '提示',
                'content': '网银状态非正常，不可操作网银相关交易！',
                'ok': {
                    fun: function () {
                    }
                }
            });
            $('#netBank .kai').text('已开通');
            $('#switch-one').val('on').attr('disabled', 'disabled').slider("refresh");
            if (!$('.netBank .netBank-content').hasClass('no-kai')) {
                $('.netBank .netBank-content').addClass('no-kai');
                $('.netBank .netBank-content input').addClass('no-kai').attr('disabled', 'disabled');
            }
            $('.netBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_TRANSFER_LIMIT).addClass('disabled');    //实际限额
            $('.netBank .netBank-content .wangyin:eq(1) .xe').val(eleSignJson.SEC_EPAY_LIMIT).addClass('disabled');
        } else if (eleSignJson.NETBANK_STATE_N == 'W' && eleSignJson.NETBANK_STATE_W == 'N') {
            $('#netBank .kai').text('已开通');
            $('#switch-one').val('on').slider("refresh");
            if ($('.netBank .netBank-content').hasClass('no-kai')) {
                $('.netBank .netBank-content').removeClass('no-kai');
                $('.netBank .netBank-content input').removeClass('no-kai');
            }
            $('.netBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_TRANSFER_LIMIT).removeAttr('disabled');    //实际限额
            $('.netBank .netBank-content .wangyin:eq(1) .xe').val(eleSignJson.SEC_EPAY_LIMIT).removeAttr('disabled');
        }
        else {
            $('#netBank .kai').text('已关闭').addClass('off');
            $("#switch-one").val('off').slider("refresh");
            if (!$('.netBank .netBank-content').hasClass('no-kai')) {
                $('.netBank .netBank-content').addClass('no-kai');
                $('.netBank .netBank-content input').addClass('no-kai').attr('disabled', 'disabled');
            }
            $('.netBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_TRANSFER_DFLIMIT);    //最大限额
            $('.netBank .netBank-content .wangyin:eq(1) .xe').val(eleSignJson.SEC_EPAY_DFLIMIT);    //最大限额
        }
        //判断手机银行开通情况
        if (eleSignJson.NETBANK_STATE == 'L' || eleSignJson.NETBANK_STATE == 'U') {
            if (eleSignJson.WAP_FLAG == 'N') { /*N--正常    W--未开通*/
                $('#mobBank .kai').text('已开通');
                $('#switch-two').val('on').attr('disabled', 'disabled').slider("refresh");
                if (!$('.mobBank .netBank-content').hasClass('no-kai')) {
                    $('.mobBank .netBank-content').addClass('no-kai');
                    $('.mobBank .netBank-content .xe').addClass('no-kai').attr('disabled', 'disabled');
                }
                $('.mobBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_WAPTRANSFER_LIMIT).attr('disabled');     //实际限额
            } else {
                $('#switch-two').val('off').attr('disabled', 'disabled').slider("refresh");
                if (!$('.mobBank .netBank-content').hasClass('no-kai')) {
                    $('.mobBank .netBank-content').addClass('no-kai');
                    $('.mobBank .netBank-content .xe').addClass('no-kai').attr('disabled', 'disabled');
                }
                $('#mobBank .kai').text('已关闭').addClass('off');
                $('.mobBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_WAPTRANSFER_DFLIMIT).addClass('no-kai').attr('disabled', 'disabled');    //最大限额
            }
        } else {
            if (eleSignJson.WAP_FLAG == 'N') { /*N--正常    W--未开通*/
                $('#mobBank .kai').text('已开通');
                $('#switch-two').val('on').slider("refresh");
                if ($('.mobBank .netBank-content').hasClass('no-kai')) {
                    $('.mobBank .netBank-content').removeClass('no-kai');
                    $('.mobBank .netBank-content .xe').removeClass('no-kai').removeAttr('disabled');
                }
                $('.mobBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_WAPTRANSFER_LIMIT).removeAttr('disabled');     //实际限额
            } else {
                $('#switch-two').val('off').slider("refresh");
                if (!$('.mobBank .netBank-content').hasClass('no-kai')) {
                    $('.mobBank .netBank-content').addClass('no-kai');
                    $('.mobBank .netBank-content .xe').addClass('no-kai').attr('disabled', 'disabled');
                }
                $('#mobBank .kai').text('已关闭').addClass('off');
                $('.mobBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_WAPTRANSFER_DFLIMIT).addClass('no-kai').attr('disabled', 'disabled');    //最大限额
            }
        }
        //挂靠账户
        var textHtml = '';
        var txtHtml = '';
        var signAccountInfoVOs = eleSignJson.signAccountInfoVOs;  //挂靠账户
        var docLicenceNO = eleSignJson.docLicenceNO;              //未挂靠账户
        if (signAccountInfoVOs.length > 0) {   //说明已挂靠账户不为空
            if (signAccountInfoVOs.length == 1) {
                if (!$('.yesgua-btn').hasClass('disgua-btn')) {
                    $('.yesgua-btn').addClass('disgua-btn');
                }
            } else {
                if ($('.yesgua-btn').hasClass('disgua-btn')) {
                    $('.yesgua-btn').removeClass('disgua-btn');
                }
            }
            $.each(signAccountInfoVOs, function (index, ele) {
                if (ele.signAccountInfoVO[0].VOUCHER_TYPE == '' || ele.signAccountInfoVO[0].VOUCHER_TYPE == undefined) {
                    ele.signAccountInfoVO[0].VOUCHER_TYPE = '008';
                }
                textHtml += ' <div class="kai-list" voucher="' + ele.signAccountInfoVO[0].VOUCHER_TYPE + '">' + ele.signAccountInfoVO[0].ACCT_NO + '</div>';
            });
            $.each(docLicenceNO, function (index, ele) {
                if (ele.docLicenceVO[0].DOC_TYPE == '' || ele.docLicenceVO[0].DOC_TYPE == undefined) {
                    ele.docLicenceVO[0].DOC_TYPE = '008';
                }
                textHtml += ' <div class="kai-list no-list" voucher="' + ele.docLicenceVO[0].DOC_TYPE + '">' + ele.docLicenceVO[0].ISSUE_ACCT_NO + '</div>';
            });
            $('.guaKao .guaK .gua-box').html(textHtml);
        } else {
            if (!$('.yesgua-btn').hasClass('disgua-btn')) {
                $('.yesgua-btn').addClass('disgua-btn');
            }
            $.each(docLicenceNO, function (index, ele) {
                if (ele.docLicenceVO[0].DOC_TYPE == '' || ele.docLicenceVO[0].DOC_TYPE == undefined) {
                    ele.docLicenceVO[0].DOC_TYPE = '008';
                }
                textHtml += ' <div class="kai-list no-list" voucher="' + ele.docLicenceVO[0].DOC_TYPE + '">' + ele.docLicenceVO[0].ISSUE_ACCT_NO + '</div>';
            });
            $('.guaKao .guaK .gua-box').html(textHtml);
        }
        if (docLicenceNO.length > 0) {      //未挂靠账户不为空
            $.each(docLicenceNO, function (index, ele) {
                if (ele.docLicenceVO[0].DOC_TYPE == '' || ele.docLicenceVO[0].DOC_TYPE == undefined) {
                    ele.docLicenceVO[0].DOC_TYPE = '008';
                }
                txtHtml += ' <div class="kai-list " voucher="' + ele.docLicenceVO[0].DOC_TYPE + '">' + ele.docLicenceVO[0].ISSUE_ACCT_NO + '</div>';
            });
            $.each(signAccountInfoVOs, function (index, ele) {
                if (ele.signAccountInfoVO[0].VOUCHER_TYPE == '' || ele.signAccountInfoVO[0].VOUCHER_TYPE == undefined) {
                    ele.signAccountInfoVO[0].VOUCHER_TYPE = '008';
                }
                txtHtml += ' <div class="kai-list no-list" voucher="' + ele.signAccountInfoVO[0].VOUCHER_TYPE + '">' + ele.signAccountInfoVO[0].ACCT_NO + '</div>';
            });
            $('.guaKao .no-guaK .no-gua-box').html(txtHtml);
        } else {
            if (!$('.nogua-btn').hasClass('disgua-btn')) {
                $('.nogua-btn').addClass('disgua-btn');
            }
            $.each(signAccountInfoVOs, function (index, ele) {
                if (ele.signAccountInfoVO[0].VOUCHER_TYPE == '' || ele.signAccountInfoVO[0].VOUCHER_TYPE == undefined) {
                    ele.signAccountInfoVO[0].VOUCHER_TYPE = '008';
                }
                txtHtml += ' <div class="kai-list no-list" voucher="' + ele.signAccountInfoVO[0].VOUCHER_TYPE + '">' + ele.signAccountInfoVO[0].ACCT_NO + '</div>';
            });
            $('.guaKao .no-guaK .no-gua-box').html(txtHtml);
        }
        //判断加挂或是解挂问题
        if (eleSignJson.zhangACCT != '' && eleSignJson.zhangACCT != undefined) {  //common.js 文件的选中
            zhangArr[0] = eleSignJson.zhangSign;
            zhangArr[2] = eleSignJson.zhangACCT;
            zhangArr[3] = eleSignJson.zhangType;
            zhangArr[4] = eleSignJson.zhangOperate;
            zhangArr[5] = eleSignJson.oldZhangACCT;
        }
        if (eleSignJson.zhangOperate == 'A') {  //加挂
            $('.no-gua-box .kai-list').each(function () {
                if ($(this).text() == eleSignJson.zhangACCT) {
                    $(this).addClass('no-list');
                }
            });
            $('.gua-box .kai-list').each(function () {
                if ($(this).text() == eleSignJson.zhangACCT) {
                    $(this).removeClass('no-list');
                    if (zhangArr[0] == '1') {
                        if (zhangArr[5] == undefined) {
                            $(this).removeClass('orange');
                        } else {
                            $(this).addClass('orange');
                        }
                    } else {
                        $(this).addClass('orange');
                    }
                }
            });
            if (zhangArr[0] == 1) {
                if (zhangArr[5] == undefined) {
                    $('.nogua-btn').removeClass('disgua-btn');
                    $('.yesgua-btn').removeClass('disgua-btn');
                } else {
                    $('.nogua-btn').addClass('disgua-btn');
                    $('.yesgua-btn').removeClass('disgua-btn');
                }
            } else {
                $('.nogua-btn').addClass('disgua-btn');
                $('.yesgua-btn').removeClass('disgua-btn');
            }
            if (zhangArr[0] == 1) {//跳回去
                if (zhangArr.length == '6' && zhangArr[5] != undefined) {
                    zhangArr.pop();
                    eleSignJson.fan = true;
                } else {
                    zhangArr[5] = zhangArr[2];
                    //zhangArr[2]='';
                    eleSignJson.fan = false;
                }

            } else {
                zhangArr[5] = zhangArr[2];
            }
            if (eleSignJson.zhangACCT == '' || eleSignJson.zhangACCT == undefined) {
                if ($('.gua-box .kai-list:not(.no-list)').length < 2) {  //挂靠账号少于2个不可解挂
                    $('.yesgua-btn').addClass('disgua-btn');
                }
                if ($('.no-gua-box .kai-list:not(.no-list)').length < 1) {
                    $('.nogua-btn').addClass('disgua-btn');
                }
            } else {
                zhangArr[0] = eleSignJson.zhangSign;
                zhangArr[2] = eleSignJson.zhangACCT;
                zhangArr[3] = eleSignJson.zhangType;
                zhangArr[4] = eleSignJson.zhangOperate;
                zhangArr[5] = eleSignJson.oldZhangACCT;
                //if(zhangArr.length == '6' && zhangArr[5] != undefined){
                //
                //}
                //$('.nogua-btn').addClass('disgua-btn');
                //$('.yesgua-btn').removeClass('disgua-btn');
            }
        } else if (eleSignJson.zhangOperate == 'D') {
            $('.gua-box .kai-list').each(function () {
                if ($(this).text() == eleSignJson.zhangACCT) {
                    $(this).addClass('no-list');
                }
            });
            $('.no-gua-box .kai-list').each(function () {
                if ($(this).text() == eleSignJson.zhangACCT) {
                    $(this).removeClass('no-list');
                    if (zhangArr[0] == '1') {
                        if (zhangArr[5] == undefined) {
                            $(this).removeClass('orange');
                        } else {
                            $(this).addClass('orange');
                        }
                    } else {
                        $(this).addClass('orange');
                    }
                }
            });
            if (zhangArr[0] == 1) {
                if (zhangArr[5] == undefined) {
                    $('.yesgua-btn').removeClass('disgua-btn');
                    $('.nogua-btn').removeClass('disgua-btn');
                } else {
                    $('.yesgua-btn').addClass('disgua-btn');
                    $('.nogua-btn').removeClass('disgua-btn');
                }
            } else {
                $('.yesgua-btn').addClass('disgua-btn');
                $('.nogua-btn').removeClass('disgua-btn');
            }
            if (zhangArr[0] == 1) {//跳回去
                if (zhangArr.length == '6' && zhangArr[5] != undefined) {
                    zhangArr.pop();
                    eleSignJson.fan = true;
                } else {
                    zhangArr[5] = zhangArr[2];
                    //zhangArr[2]='';
                    eleSignJson.fan = false;
                }
            } else {
                zhangArr[5] = zhangArr[2];
            }

            if (eleSignJson.zhangACCT == '' || eleSignJson.zhangACCT == undefined) {
                if ($('.gua-box .kai-list:not(.no-list)').length < 2) {  //挂靠账号少于2个不可解挂
                    $('.yesgua-btn').addClass('disgua-btn');
                }
                if ($('.no-gua-box .kai-list:not(.no-list)').length < 1) {
                    $('.nogua-btn').addClass('disgua-btn');
                }
            } else {
                zhangArr[0] = eleSignJson.zhangSign;
                zhangArr[2] = eleSignJson.zhangACCT;
                zhangArr[3] = eleSignJson.zhangType;
                zhangArr[4] = eleSignJson.zhangOperate;
                zhangArr[5] = eleSignJson.oldZhangACCT;
                //$('.yesgua-btn').addClass('disgua-btn');
                //$('.nogua-btn').removeClass('disgua-btn');
            }
        }
        if (eleSignJson.NETBANK_STATE_N == 'L' || eleSignJson.NETBANK_STATE_N == 'U') {
            if (!$('.nogua-btn').hasClass('disgua-btn')) {
                $('.nogua-btn').addClass('disgua-btn');
            }
            if (!$('.yesgua-btn').hasClass('disgua-btn')) {
                $('.yesgua-btn').addClass('disgua-btn');
            }
        }
        //交易密码和查询密码
        //eleSignJson.PAITYPE = '';
        //$('.bank-mm .mm-value').eq(0).text('已设置').addClass('mm-blue');
        //$('.bank-mm .mm-value').eq(1).text('已设置').addClass('mm-blue');
        if (eleSignJson.PAITYPE == 'BC') {
            if (eleSignJson.B == '' && eleSignJson.C == '') {
                eleSignJson.mimaF = true;
                $('.bank-mm .mm-value').eq(0).text('未设置').addClass('mm-gray');
                $('.bank-mm .mm-value').eq(1).text('未设置').addClass('mm-gray');
            } else if (eleSignJson.B == '' && eleSignJson.C != '') {
                eleSignJson.mimaF = true;
                $('.bank-mm .mm-value').eq(0).text('未设置').addClass('mm-gray');
                $('.bank-mm .mm-value').eq(1).text('已设置').addClass('mm-blue');
            } else if (eleSignJson.B != '' && eleSignJson.C == '') {
                eleSignJson.mimaF = true;
                $('.bank-mm .mm-value').eq(0).text('已设置').addClass('mm-blue');
                $('.bank-mm .mm-value').eq(1).text('未设置').addClass('mm-gray');
            } else {
                $('.bank-mm .mm-value').eq(0).text('已设置').addClass('mm-blue');
                $('.bank-mm .mm-value').eq(1).text('已设置').addClass('mm-blue');
            }

        } else if (eleSignJson.PAITYPE == 'B') {
            if (eleSignJson.B == '') {
                eleSignJson.mimaF = true;
                $('.bank-mm .mm-value').eq(0).text('未设置').addClass('mm-gray');
                $('.bank-mm .mm-value').eq(1).text('已设置').addClass('mm-blue');
            } else {
                $('.bank-mm .mm-value').eq(0).text('已设置').addClass('mm-blue');
                $('.bank-mm .mm-value').eq(1).text('已设置').addClass('mm-blue');
            }
        } else if (eleSignJson.PAITYPE == 'C') {
            if (eleSignJson.C == '') {
                eleSignJson.mimaF = true;
                $('.bank-mm .mm-value').eq(0).text('已设置').addClass('mm-blue');
                $('.bank-mm .mm-value').eq(1).text('未设置').addClass('mm-gray');
            } else {
                $('.bank-mm .mm-value').eq(0).text('已设置').addClass('mm-blue');
                $('.bank-mm .mm-value').eq(1).text('已设置').addClass('mm-blue');
            }
        } else {
            $('.bank-mm .mm-value').eq(0).text('已设置').addClass('mm-blue');
            $('.bank-mm .mm-value').eq(1).text('已设置').addClass('mm-blue');
        }
        //银信通
        var noteOpenArr = eleSignJson.NOTE_OPEN.split("");
        if (noteOpenArr[0] == '1') {   //资金转出通知
            $('#switch-three').parents('.bank-box-con').find('.kai').text('已开通');
            $('#switch-three').parents('.bank-box-con').find('.yimport-content').removeClass('no-kai');
            $('#yexport-wxxe').val(eleSignJson.FROM_INCEPT_AMT).removeAttr('disabled').removeClass('no-kai');
            $('#switch-three').val('on').slider("refresh");
        } else {
            $('#switch-three').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#yexport-wxxe').val('300.00').attr('disabled', 'disabled').addClass('no-kai');
            $('#switch-three').parents('.bank-box-con').find('.yimport-content').addClass('no-kai');
            $('#switch-three').val('off').slider("refresh");

        }
        if (noteOpenArr[1] == '1') {   //资金转入通知
            $('#switch-four').parents('.bank-box-con').find('.kai').text('已开通');
            $('#switch-four').parents('.bank-box-con').find('.yimport-content').removeClass('no-kai');
            $('#yimport-wxxe').val(eleSignJson.TO_INCEPT_AMT).removeAttr('disabled').removeClass('no-kai');
            $('#switch-four').val('on').slider("refresh");
        } else {
            $('#switch-four').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#switch-four').parents('.bank-box-con').find('.yimport-content').addClass('no-kai');
            $('#yimport-wxxe').val('300.00').attr('disabled', 'disabled').addClass('no-kai');
            $('#switch-four').val('off').slider("refresh");
        }
        if (noteOpenArr[3] == '1') {   //资金到期通知
            $('#switch-five').parents('.bank-box-con').find('.kai').text('已开通');
            $('#switch-five').val('on').slider("refresh");
        } else {
            $('#switch-five').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#switch-five').val('off').slider("refresh");
        }
        if (noteOpenArr[5] == '1') {   //金融信息通知
            $('#switch-six').parents('.bank-box-con').find('.kai').text('已开通');
            $('#switch-six').val('on').slider("refresh");
        } else {
            $('#switch-six').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
            $('#switch-six').val('off').slider("refresh");
        }
        //判断银信通开通情况
        var allHtml = '';
        var docLicenceVOs = eleSignJson.docLicenceVOs;
        $.each(docLicenceVOs, function (index, ele) {
            if (ele.docLicenceVO[0].DOC_TYPE == '' || ele.docLicenceVO[0].DOC_TYPE == undefined) {
                ele.docLicenceVO[0].DOC_TYPE = '008';
            }
            allHtml += '<option  value="' + ele.docLicenceVO[0].DOC_TYPE + '">' + ele.docLicenceVO[0].ISSUE_ACCT_NO + '</option>'
        });
        $('#ples-kzh').html(allHtml).selectmenu("refresh", true);
        $('#ples-kzh').val(eleSignJson.yinZhang).selectmenu('refresh');
        $('#ples-kzh-button span').text(eleSignJson.yinZhang);
        if (eleSignJson.openStatus == '0') {  //开通
            $('#ples-kzh-button').find('span').css('color', 'orange');
        } else if (eleSignJson.openStatus == '1') {  //欠费
            $('#ples-kzh-button').find('span').css('color', 'red');
        }
        //下一步点亮
        $('#xk-agree-next').addClass('btn_next');
    } else {
        eleSignJson.B = '';
        eleSignJson.C = '';
        eleSignJson.fan = false;
        eleSignJson.mimaF = false;
        eleSignJson.zhangSign = 0;
        eleSignJson.zhangACCT = '';
        eleSignJson.zhangType = '';
        eleSignJson.zhangOperate = '';
        eleSignJson.oldZhangACCT = undefined;
        showLoader("信息加载中...");
        var bodyJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": eleSignJson.moduleId, //模块编号
                "tranId.s": eleSignJson.tranId1, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "orgId.s": commonJson.orgId,
                "CLIENT_NO.s": eleSignJson.CLIENT_NO, //客户号
                "CLIENT_NAME.s": custermerInfo.name, //客户姓名
                "DOCUMENT_TYPE.s": "0", //证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO //证件号"452229198609065425"
            }]
        };
        //获取开通情况(调取接口)
        eleGetSignedInfoFun(bodyJson, function (msg) {
            eleGetSignedInfoSucc(msg);
        }, function (err) {
            funFail(err);
            //$.mobile.changePage('dianzi-readingID.html', {reverse: true});
        });
    }

    //打开、关闭下拉列表
    $('.selected').bind('click', this, function () {
        //console.log(this.id);
        var idName = this.id;
        switch (idName) {
            case 'netBank':
            {
                $('.netBank').toggle(0, function () {
                    var dis = $('.netBank').css('display');
                    //console.log(dis);
                    if (dis !== 'none') {
                        $('#netBank img').attr('src', '../../images/ic_shapeCopy.png');
                        $('#netBank').addClass('selecting');
                    } else {
                        $('#netBank img').attr('src', '../../images/ic_shape.png');
                        $('#netBank').removeClass('selecting');
                    }
                });
                break;
            }
            case 'mobBank':
            {
                $('.mobBank').toggle(0, function () {
                    var dis = $('.mobBank').css('display');
                    //console.log(dis);
                    if (dis !== 'none') {
                        $('#mobBank img').attr('src', '../../images/ic_shapeCopy.png');
                        $('#mobBank').addClass('selecting');
                    } else {
                        $('#mobBank img').attr('src', '../../images/ic_shape.png');
                        $('#mobBank').removeClass('selecting');
                    }
                });
                break;
            }
            case 'guaKao':
            {
                $('.guaKao').toggle(0, function () {
                    var dis = $('.guaKao').css('display');
                    //console.log(dis);
                    $('#guaKao .kai').css('display', 'none');
                    if (dis !== 'none') {
                        $('#guaKao img').attr('src', '../../images/ic_shapeCopy.png');
                        $('#guaKao').addClass('selecting');
                    } else {
                        $('#guaKao img').attr('src', '../../images/ic_shape.png');
                        $('#guaKao').removeClass('selecting');
                    }
                });
                break;
            }
            case 'yexport':
            {
                $('.yexport').toggle(0, function () {
                    var dis = $('.yexport').css('display');
                    //console.log(dis);
                    if (dis !== 'none') {
                        $('#yexport img').attr('src', '../../images/ic_shapeCopy.png');
                        $('#yexport').addClass('selecting');
                    } else {
                        $('#yexport img').attr('src', '../../images/ic_shape.png');
                        $('#yexport').removeClass('selecting');
                    }
                });
                break;
            }
            case 'yimport':
            {
                $('.yimport').toggle(0, function () {
                    var dis = $('.yimport').css('display');
                    //console.log(dis);
                    if (dis !== 'none') {
                        $('#yimport img').attr('src', '../../images/ic_shapeCopy.png');
                        $('#yimport').addClass('selecting');
                    } else {
                        $('#yimport img').attr('src', '../../images/ic_shape.png');
                        $('#yimport').removeClass('selecting');
                    }
                });
                break;
            }
            case 'yexpire':
            {
                $('.yexpire').toggle(0, function () {
                    var dis = $('.yexpire').css('display');
                    //console.log(dis);
                    if (dis !== 'none') {
                        $('#yexpire img').attr('src', '../../images/ic_shapeCopy.png');
                        $('#yexpire').addClass('selecting');
                    } else {
                        $('#yexpire img').attr('src', '../../images/ic_shape.png');
                        $('#yexpire').removeClass('selecting');
                    }
                });
                break;
            }
            case 'ymessage':
            {
                $('.ymessage').toggle(0, function () {
                    var dis = $('.ymessage').css('display');
                    //console.log(dis);
                    if (dis !== 'none') {
                        $('#ymessage img').attr('src', '../../images/ic_shapeCopy.png');
                        $('#ymessage').addClass('selecting');
                    } else {
                        $('#ymessage img').attr('src', '../../images/ic_shape.png');
                        $('#ymessage').removeClass('selecting');
                    }
                });
                break;
            }
        }
    });

    //$('#dianzi-kaiTong input').bind('focus', this, function () {
    //    $(this).val('');
    //});
    $('#dianzi-kaiTong input').on('tap', this,function(){
        var _val = $(this).val();
        $(this).val(rmoney(_val));
        //$(this).val('');
    });
    $('#dianzi-kaiTong input').on('blur', this,function(){
        var _val = $(this).val().replace(/[^0-9\.]/ig, "");
        $(this).val(fmoneyEle(_val));
    });
    //滑动开关
    $('.switches').bind('change', this, function () {
        var indexNum = $(".switches").index(this);
        var s_net = eleSignJson.NETBANK_STATE_N;
        var s_wap = eleSignJson.WAP_FLAGT;
        var wangSign = '';
        if (indexNum == '0') {
            wangSign = s_net;
        } else if (indexNum == '1') {
            wangSign = s_wap;
        }
        var switchText = $(this).val();
        if (switchText == 'off') {
            if (wangSign == 'N' || wangSign == 'L' || wangSign == 'U') {
                $(this).val('on').slider("refresh");
                showTags({
                    'title': '提示',
                    'content': '本交易不允许关闭操作！',
                    'ok': {}
                });
                return;
            }
        }
        if (switchText == 'on') {
            if ($(this).attr('id') == 'switch-two') {
                if ($('#switch-one').val() == 'off') {
                    $('#switch-two').val('off').slider('refresh');
                    showTags({ //接口服务失败
                        'title': '提示',
                        'content': '请先开通网上银行',
                        'ok': {
                            fun: function () {
                            }
                        }
                    });
                    return;
                }
            }
            if ($(this).parents('.bank-box-con').find('.kai').hasClass('off')) {
                $(this).parents('.bank-box-con').find('.kai').removeClass('off');
            }
            $(this).parents('.bank-box-con').find('.xe').removeAttr('disabled');
            $(this).parents('.bank-box-con').find('.kai').text('已开通');
            if ($(this).parents('.bank-box-con').find('.netBank-content').hasClass('no-kai')) {
                $(this).parents('.bank-box-con').find('.netBank-content').removeClass('no-kai');
            }
            $(this).parents('.bank-box-con').find('.xe').removeClass('no-kai').slider('refresh');
        } else {
            if ($(".switches").index(this) == '0') {
                eleSignJson.mimaF = false;
                if(eleSignJson.PAITYPE=='BC'){
                    eleSignJson.B = '';
                    eleSignJson.C = '';
                    $('.bank-mm .mm-value').eq(0).text('未设置').addClass('mm-gray');
                    $('.bank-mm .mm-value').eq(1).text('未设置').addClass('mm-gray');
                }else if(eleSignJson.PAITYPE=='B'){
                    eleSignJson.B = '';
                    //$('.bank-mm .mm-value').eq(0).text('未设置').addClass('mm-gray');
                    $('.bank-mm .mm-value').eq(1).text('未设置').addClass('mm-gray');
                }else if(eleSignJson.PAITYPE=='C'){
                    eleSignJson.C = '';
                    //$('.bank-mm .mm-value').eq(0).text('未设置').addClass('mm-gray');
                    $('.bank-mm .mm-value').eq(1).text('未设置').addClass('mm-gray');
                }
                //$('.bank-mm .mm-value').eq(0).text('未设置').addClass('mm-gray');
                //$('.bank-mm .mm-value').eq(1).text('未设置').addClass('mm-gray');
                if (!$('#switch-one').parents('.bank-box-con').find('.kai').hasClass('off')) {
                    $('#switch-one').parents('.bank-box-con').find('.kai').addClass('off');
                }
                $('#switch-one').parents('.bank-box-con').find('.kai').text('已关闭');
                if (!$('#switch-one').parents('.bank-box-con').find('.netBank-content').hasClass('no-kai')) {
                    $('#switch-one').parents('.bank-box-con').find('.netBank-content').addClass('no-kai');
                    $('#switch-one').parents('.bank-box-con').find('.xe').attr('disabled', 'disabled').addClass('no-kai');
                    //$('#switch-one').parents('.bank-box-con').find('.xe').addClass('no-kai').slider('refresh');
                }
                if (!$('#switch-two').parents('.bank-box-con').find('.kai').hasClass('off')) {
                    $('#switch-two').parents('.bank-box-con').find('.kai').addClass('off');
                }
                $('#switch-two').parents('.bank-box-con').find('.kai').text('已关闭');
                if (!$('#switch-two').parents('.bank-box-con').find('.netBank-content').hasClass('no-kai')) {
                    $('#switch-two').parents('.bank-box-con').find('.netBank-content').addClass('no-kai');
                    $('#switch-two').parents('.bank-box-con').find('.xe').attr('disabled', 'disabled');
                    $('#switch-two').parents('.bank-box-con').find('.xe').addClass('no-kai');

                }
                $('#switch-two').val('off').slider('refresh');
            } else {
                if (!$(this).parents('.bank-box-con').find('.kai').hasClass('off')) {
                    $(this).parents('.bank-box-con').find('.kai').addClass('off');
                }
                $(this).parents('.bank-box-con').find('.kai').text('已关闭');
                if (!$(this).parents('.bank-box-con').find('.netBank-content').hasClass('no-kai')) {
                    $(this).parents('.bank-box-con').find('.netBank-content').addClass('no-kai');
                    $(this).parents('.bank-box-con').find('.xe').attr('disabled', 'disabled');
                    $(this).parents('.bank-box-con').find('.xe').addClass('no-kai').slider('refresh');

                }
            }
        }
    });
    //点击添加挂靠账户按钮
    $('.nogua-btn').on('click', function () {
        if ($('.nogua-btn').hasClass('disgua-btn')) {  //判断页面的已挂靠账户状态是否存在
            return;
        } else {
            showSelTip({
                'title': '请选择需要添加的账号',
                'content': '.no-gua-box',
                'cancel': {},
                'jiaJ': 'A',
                'ok': {
                    fun: function () {
                        $('.no-gua-box .kai-list').each(function () {
                            if ($(this).text() == zhangArr[2]) {
                                $(this).addClass('no-list');
                            }

                        });
                        $('.gua-box .kai-list').each(function () {
                            if ($(this).text() == zhangArr[2]) {
                                $(this).removeClass('no-list');
                                if (zhangArr[0] == 1) {
                                    if (zhangArr[5] != undefined) {
                                        $(this).removeClass('orange');
                                    } else {
                                        $(this).addClass('orange');
                                    }
                                } else {
                                    $(this).addClass('orange');
                                }
                            }
                        });
                        if (zhangArr[0] == 1) {
                            if (zhangArr[5] != undefined) {
                                $('.nogua-btn').removeClass('disgua-btn');
                                $('.yesgua-btn').removeClass('disgua-btn');
                            } else {
                                $('.nogua-btn').addClass('disgua-btn');
                                $('.yesgua-btn').removeClass('disgua-btn');
                            }
                        } else {
                            $('.nogua-btn').addClass('disgua-btn');
                            $('.yesgua-btn').removeClass('disgua-btn');
                        }

                        if (zhangArr[0] == 1) {//跳回去
                            eleSignJson.zhangSign = zhangArr[0];
                            zhangArr[0] = 0;
                            if (zhangArr.length == '6' && zhangArr[5] != undefined) {

                                zhangArr.pop();
                                eleSignJson.oldZhangACCT = zhangArr[5];
                            } else {
                                zhangArr[5] = zhangArr[2];
                                eleSignJson.oldZhangACCT = zhangArr[2];
                            }
                        } else {
                            eleSignJson.zhangSign = zhangArr[0];
                            zhangArr[5] = zhangArr[2];
                            eleSignJson.oldZhangACCT = zhangArr[2];
                        }
                        //if($('.no-gua-box .kai-list:not(.no-list)').length<2){
                        //    $('.nogua-btn').addClass('disgua-btn');
                        //}

                        eleSignJson.zhangACCT = zhangArr[2];
                        eleSignJson.zhangType = zhangArr[3];
                        eleSignJson.zhangOperate = zhangArr[4];
                        hideSelTip();
                    }
                }
            });

        }
    });
    //点击解除挂靠账户按钮
    $('.yesgua-btn').on('click', function () {
        if ($('.yesgua-btn').hasClass('disgua-btn')) {  //判断页面的已挂靠账户状态是否存在
            return;
        } else {
            showSelTip({
                'title': '请选择需要解除的账号',
                'content': '.gua-box',
                'cancel': {},
                'jiaJ': 'D',
                'ok': {
                    fun: function () {
                        $('.gua-box .kai-list').each(function () {
                            if ($(this).text() == zhangArr[2]) {
                                $(this).addClass('no-list');
                            }
                        });
                        $('.no-gua-box .kai-list').each(function () {
                            if ($(this).text() == zhangArr[2]) {
                                $(this).removeClass('no-list');
                                if (zhangArr[0] == 1) {
                                    if (zhangArr[5] != undefined) {
                                        $(this).removeClass('orange');
                                    } else {
                                        $(this).addClass('orange');
                                    }
                                } else {
                                    $(this).addClass('orange');
                                }
                            }
                        });
                        if (zhangArr[0] == 1) {
                            if (zhangArr[5] != undefined) {
                                $('.yesgua-btn').removeClass('disgua-btn');
                                $('.nogua-btn').removeClass('disgua-btn');
                            } else {
                                $('.yesgua-btn').addClass('disgua-btn');
                                $('.nogua-btn').removeClass('disgua-btn');
                            }
                        } else {
                            $('.yesgua-btn').addClass('disgua-btn');
                            $('.nogua-btn').removeClass('disgua-btn');
                        }
                        if (zhangArr[0] == 1) {//跳回去
                            eleSignJson.zhangSign = zhangArr[0];
                            zhangArr[0] = 0;
                            if (zhangArr.length == '6' && zhangArr[5] != undefined) {

                                zhangArr.pop();
                                eleSignJson.oldZhangACCT = zhangArr[5];

                            } else {
                                zhangArr[5] = zhangArr[2];
                                eleSignJson.oldZhangACCT = zhangArr[2];
                            }
                        } else {
                            eleSignJson.zhangSign = zhangArr[0];
                            zhangArr[5] = zhangArr[2];
                            eleSignJson.oldZhangACCT = zhangArr[2];
                        }
                        if ($('.gua-box .kai-list:not(.no-list)').length < 2) {
                            $('.yesgua-btn').addClass('disgua-btn');
                        }
                        eleSignJson.zhangACCT = zhangArr[2];
                        eleSignJson.zhangType = zhangArr[3];
                        eleSignJson.zhangOperate = zhangArr[4];
                        hideSelTip();
                    }
                }
            });
        }

    });
    //银信通滑动开关

    $('.switches-yin').bind('change', this, function () {
        var index_num = $(".switches-yin").index(this);
        var note_arr = eleSignJson.NOTE_OPENT.split('');
        var note_num = '';
        if (index_num == '2') {
            note_num = note_arr[3];
        } else if (index_num == '3') {
            note_num = note_arr[5];
        } else {
            note_num = note_arr[index_num];
        }
        var switchText = $(this).val();
        if (note_num == '1' && switchText == 'off') {
            $(this).val('on').slider("refresh");
            showTags({
                'title': '提示',
                'content': '本交易不允许关闭操作！',
                'ok': {}
            });
            return;
        }
        if (switchText == 'on') {
            if ($(this).parents('.bank-box-con').find('.kai').hasClass('off')) {
                $(this).parents('.bank-box-con').find('.kai').removeClass('off');
            }
            $(this).parents('.bank-box-con').find('.xe').removeAttr('disabled');
            $(this).parents('.bank-box-con').find('.kai').text('已开通');
            if ($(this).parents('.bank-box-con').find('.yimport-content').hasClass('no-kai')) {
                $(this).parents('.bank-box-con').find('.yimport-content').removeClass('no-kai');
            }
            $(this).parents('.bank-box-con').find('.xe').removeClass('no-kai').slider('refresh');
        } else {
            if (!$(this).parents('.bank-box-con').find('.kai').hasClass('off')) {
                $(this).parents('.bank-box-con').find('.kai').addClass('off');
            }
            $(this).parents('.bank-box-con').find('.xe').attr('disabled', 'disabled');
            $(this).parents('.bank-box-con').find('.kai').text('已关闭');
            if (!$(this).parents('.bank-box-con').find('.yimport-content').hasClass('no-kai')) {
                $(this).parents('.bank-box-con').find('.yimport-content').addClass('no-kai');

                $(this).parents('.bank-box-con').find('.xe').addClass('no-kai').slider('refresh');

            }
        }
    });
    eleSignJson.GUA_ACCT_NO = '';
    eleSignJson.GUA_ACCT_NOX = '';
    //$('#removeGua .gua-btn').bind('click', this, function() {
    //    if( $(this).hasClass('disgua-btn')){
    //        return;
    //    }
    //    var text = '';
    //    if ($('#removeGua .gua-rows').hasClass('li')) {
    //        eleSignJson.GUA_ACCT_NO = '';
    //        eleSignJson.GUA_ACCT_NOX='';
    //        eleSignJson.GUA_VOUCHER_TYPE = '';
    //        eleSignJson.OPERATE_TYPE = '';
    //        text = $(this).parents('#removeGua').find('.li').text();
    //        $('#removeGua .li').addClass('no-list');
    //        $('#addGua .pop-gua .gua-rows').each(function() {
    //            if ($(this).text() == text) {
    //                $(this).removeClass('no-list');
    //                $(this).find('img').css('display', 'none');
    //            }
    //        });
    //        $('#removeGua .gua-rows').removeClass('li');
    //        $('#addGua .lin span').removeClass('spanLin');
    //        $('#addGua .gua-rows').removeClass('lin');
    //    } else {
    //        text = $(this).parents('#removeGua').find('.spanLin').text();
    //        eleSignJson.GUA_ACCT_NO = text;
    //        eleSignJson.GUA_ACCT_NOX=text;
    //        eleSignJson.GUA_VOUCHER_TYPE = $(this).parents('#removeGua').find('.spanLin').attr('voucher');
    //        //alert(eleSignJson.GUA_VOUCHER_TYPE);
    //        eleSignJson.OPERATE_TYPE = 'D';
    //        $(this).parents('#removeGua').find('.li').addClass('no-list');
    //        $('#addGua .pop-gua .gua-rows').each(function() {
    //            if ($(this).text() == text) {
    //                $(this).removeClass('no-list').addClass('li'); //显现挂靠弹出窗的
    //            }
    //        });
    //        $('.yesgua-btn').addClass('disgua-btn');
    //    }
    //    $('.gua-box .kai-list').each(function() { //挂靠的隐藏
    //        if ($(this).text() == text) {
    //            $(this).addClass('no-list');
    //        }
    //    });
    //    $('.no-gua-box .kai-list').each(function() { //未挂靠的显现
    //        if ($(this).text() == text) {
    //            $(this).removeClass('no-list');
    //        }
    //    });
    //    if ($('.guaK .kai-list').length - $('.guaK .no-list').length < 2) {
    //        if (!$('.yesgua-btn').hasClass('disgua-btn'))
    //            $('.yesgua-btn').addClass('disgua-btn');
    //    }
    //    if ($('.nogua-btn').hasClass('disgua-btn')) {
    //        $('.nogua-btn').removeClass('disgua-btn');
    //    }
    //    $('#removeGua').popup('close');
    //});
    //$('#addGua .gua-btn').bind('click', this, function() {
    //    if( $(this).hasClass('disgua-btn')){
    //        return;
    //    }
    //    var text = '';
    //    if ($('#addGua .gua-rows').hasClass('li')) {
    //        eleSignJson.GUA_ACCT_NO = '';
    //        eleSignJson.GUA_ACCT_NOX='';
    //        eleSignJson.GUA_VOUCHER_TYPE = '';
    //        eleSignJson.OPERATE_TYPE = '';
    //        text = $(this).parents('#addGua').find('.li').text();
    //        $('#addGua .li').addClass('no-list');
    //        $('#removeGua .pop-gua .gua-rows').each(function() {
    //            if ($(this).text() == text) {
    //                $(this).removeClass('no-list');
    //                $(this).find('img').css('display', 'none');
    //            }
    //        });
    //        $('#addGua .gua-rows').removeClass('li');
    //        $('#removeGua .lin span').removeClass('spanLin');
    //        $('#removeGua .gua-rows').removeClass('lin');
    //    } else {
    //        text = $(this).parents('#addGua').find('.spanLin').text();
    //        eleSignJson.GUA_ACCT_NO = text;
    //        eleSignJson.GUA_ACCT_NOX=text;
    //        eleSignJson.GUA_VOUCHER_TYPE = $(this).parents('#addGua').find('.spanLin').attr('voucher');
    //        eleSignJson.OPERATE_TYPE = 'A';
    //        $(this).parents('#addGua').find('.lin').addClass('no-list'); //隐藏未挂靠弹出框的
    //        $('#removeGua .pop-gua .gua-rows').each(function() {
    //            if ($(this).text() == text) {
    //                $(this).removeClass('no-list').addClass('li'); //显现挂靠弹出窗的
    //            }
    //        });
    //        $('.nogua-btn').addClass('disgua-btn');
    //    }
    //    $('.no-gua-box .kai-list').each(function() { //隐藏下面未挂靠盒子
    //        if ($(this).text() == text) {
    //            $(this).addClass('no-list');
    //        }
    //    });
    //    $('.gua-box .kai-list').each(function() { //显现挂靠盒子
    //        if ($(this).text() == text) {
    //            $(this).removeClass('no-list');
    //        }
    //    });
    //    //未挂靠的
    //    if ($('.no-guaK .kai-list').length - $('.no-guaK .no-list').length < 2) {
    //        if (!$('.nogua-btn').hasClass('disgua-btn'))
    //            $('.nogua-btn').addClass('disgua-btn');
    //    }
    //    if ($('.yesgua-btn').hasClass('disgua-btn')) {
    //        $('.yesgua-btn').removeClass('disgua-btn');
    //    }
    //    $('#addGua').popup('close');
    //});
//银信通  账号改变 请求
    $('#ples-kzh').change(function () {
        showLoader("加载中...");
        var yinJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": eleSignJson.moduleId, //模块编号
                "tranId.s": eleSignJson.tranId1, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "orgId.s": commonJson.orgId,
                "ACCT_NO.s": $('#ples-kzh option:selected').text(), //账号、卡号
                "OPTION.s": "1", //操作条件
                "CCY.s": '' //币种
                //"ACCT_TYPE.s": $('#ples-kzh').val() //账户类型
            }]
        };
        eleGetQueryMassageInquiryFun(yinJson, function (msg) {
            eleGetQueryMassageInquirySucc(msg);
        }, function (err) {
            //hideLoader();
            $('#ples-kzh').val(eleSignJson.yinZhang).selectmenu('refresh');
            $('#ples-kzh-button span').text(eleSignJson.yinZhang);
            var noteArr = eleSignJson.NOTE_OPEN.split("");
            if (eleSignJson.openStatus == '0') {  //开通
                $('#ples-kzh-button').find('span').css('color', 'orange');
            } else if (eleSignJson.openStatus == '1') {  //欠费
                $('#ples-kzh-button').find('span').css('color', 'red');
            }
            if (noteArr[0] == '1') {   //资金转出通知
                if ($('#switch-three').parents('.bank-box-con').find('.kai').hasClass('off')) {
                    $('#switch-three').parents('.bank-box-con').find('.kai').removeClass('off');
                }
                $('#switch-three').parents('.bank-box-con').find('.kai').text('已开通');
                $('#yexport-wxxe').val(eleSignJson.queryMassagePersonalInquiryVO[0].START_OUT_AMT).removeAttr('disabled').removeClass('no-kai');
                eleSignJson.FROM_INCEPT_AMT = eleSignJson.queryMassagePersonalInquiryVO[0].START_OUT_AMT;
                $('#switch-three').parents('.bank-box-con').find('.yimport-content').removeClass('no-kai');
                $('#switch-three').val('on').slider("refresh");
            } else {
                $('#switch-three').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
                $('#yexport-wxxe').val('300.00').attr('disabled', 'disabled').addClass('no-kai');
                $('#switch-three').parents('.bank-box-con').find('.yimport-content').addClass('no-kai');
                $('#switch-three').val('off').slider("refresh");
            }
            if (noteArr[1] == '1') {   //资金转入通知
                if ($('#switch-four').parents('.bank-box-con').find('.kai').hasClass('off')) {
                    $('#switch-four').parents('.bank-box-con').find('.kai').removeClass('off');
                }
                $('#switch-four').parents('.bank-box-con').find('.kai').text('已开通');
                $('#switch-four').parents('.bank-box-con').find('.yimport-content').removeClass('no-kai');
                $('#yimport-wxxe').val(eleSignJson.queryMassagePersonalInquiryVO[0].START_IN_AMT).removeAttr('disabled').removeClass('no-kai');
                eleSignJson.TO_INCEPT_AMT = eleSignJson.queryMassagePersonalInquiryVO[0].START_IN_AMT;
                $('#switch-four').val('on').slider("refresh");
            } else {
                $('#switch-four').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
                $('#switch-four').parents('.bank-box-con').find('.yimport-content').addClass('no-kai');
                $('#yimport-wxxe').val('300.00').attr('disabled', 'disabled').addClass('no-kai');
                $('#switch-four').val('off').slider("refresh");

            }
            if (noteArr[3] == '1') {   //资金到期通知
                if ($('#switch-five').parents('.bank-box-con').find('.kai').hasClass('off')) {
                    $('#switch-five').parents('.bank-box-con').find('.kai').removeClass('off');
                }
                $('#switch-five').parents('.bank-box-con').find('.kai').text('已开通');
                $('#switch-five').val('on').slider("refresh");
            } else {
                $('#switch-five').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
                $('#switch-five').val('off').slider("refresh");
            }
            if (noteArr[5] == '1') {   //金融信息通知
                if ($('#switch-six').parents('.bank-box-con').find('.kai').hasClass('off')) {
                    $('#switch-six').parents('.bank-box-con').find('.kai').removeClass('off');
                }
                $('#switch-six').parents('.bank-box-con').find('.kai').text('已开通');
                $('#switch-six').val('on').slider("refresh");
            } else {
                $('#switch-six').parents('.bank-box-con').find('.kai').text('已关闭').addClass('off');
                $('#switch-six').val('off').slider("refresh");
            }
            funFail(err);
        });

    });


    //点击上一步
    $('#xk-agree-pre').on('click', function () {
        $.mobile.changePage('./dianzi-readingID.html', {reverse: true});
    });
    //点击下一步
    $('#xk-agree-next').on('click', function () {
        if (!$('#xk-agree-next').hasClass('btn_next')) {
            return;
        }
        var cout = $('.guaK .kai-list').length - $('.guaK .no-list').length;
        if (cout < 1) {
            if ($('#switch-one').val() == 'on') {
                showTags({ //接口服务失败
                    'title': '提示',
                    'content': '请先进行账户挂靠',
                    'ok': {
                        fun: function () {
                        }
                    }
                });

                return;
            }
        }
        eleSignJson.wangYin = '0';      //网银有没有更改 0没有  1更改了
        eleSignJson.mobile = '0';       //手机银行有没有更改 0没有  1更改了
        eleSignJson.yinXinTong = '0';   //银信通有没有更改 0没有  1更改了
        eleSignJson.guaKao = '0';       //挂靠有没有更改 0没有  1更改了
        eleSignJson.mima = '0';         //手机银行密码有没有更改 0没有  1更改了

        //挂靠(默认账户)
        if (eleSignJson.signAccountInfoVOs.length > 0) {
            if (eleSignJson.signAccountInfoVOs[0].signAccountInfoVO[0].VOUCHER_TYPE == '' || eleSignJson.signAccountInfoVOs[0].signAccountInfoVO[0].VOUCHER_TYPE == undefined) {
                eleSignJson.signAccountInfoVOs[0].signAccountInfoVO[0].VOUCHER_TYPE = '008';
            }
            eleSignJson.mo_VOUCHER_TYPE = eleSignJson.signAccountInfoVOs[0].signAccountInfoVO[0].VOUCHER_TYPE;
            eleSignJson.mo_ACCT_NO = eleSignJson.signAccountInfoVOs[0].signAccountInfoVO[0].ACCT_NO;
        } else {
            eleSignJson.mo_VOUCHER_TYPE = eleSignJson.zhangType;
            eleSignJson.mo_ACCT_NO = eleSignJson.zhangACCT;
        }
        //已挂靠账户
        var guBox = [];
        $('.guaKao .guaK .gua-box .kai-list').each(function () {
            if (!$(this).hasClass('no-list')) {
                guBox.push($(this).text());
            }
        });
        eleSignJson.guBox = guBox;
        //判断挂靠和开通网银状态
        if ($('#switch-one').val() != 'on') {
            if (eleSignJson.NETBANK_STATE_N != 'L' && eleSignJson.NETBANK_STATE_N != 'U') {
                if ($('.gua-box .kai-list:not(.no-list)').length > 0) {
                    showTags({ //接口服务失败
                        'title': '提示',
                        'content': '对不起，不可以只挂靠不开通网银！',
                        'ok': {
                            fun: function () {
                            }
                        }
                    });
                    return;
                }
            }
        }
        //网上银行  xin e
        if ($('#switch-one').val() == 'on') {
            if (eleSignJson.PAITYPE != '') {
                eleSignJson.mima = '1';
            }
            if (eleSignJson.NETBANK_STATE_N == 'W' || eleSignJson.NETBANK_STATE_N == 'C') {
                eleSignJson.wangYin = '1';
            }
            if (Number(eleSignJson.SEC_TRANSFER_LIMITT.replace(/,/g,'')) != Number($('.xe').eq(0).val().replace(/,/g,''))) {
                eleSignJson.wangYin = '1';
            }
            if (Number(eleSignJson.SEC_EPAY_LIMITT.replace(/,/g,'')) != Number($('.xe').eq(1).val().replace(/,/g,''))) {
                eleSignJson.wangYin = '1';
            }
            if(eleSignJson.PAITYPE=='BC'){
                if(eleSignJson.B==''||eleSignJson.C==''){
                    eleSignJson.mimaF = true;
                }else{
                    eleSignJson.mimaF = false;
                }
            }else if(eleSignJson.PAITYPE=='B'){
                if(eleSignJson.B==''){
                    eleSignJson.mimaF = true;
                }else{
                    eleSignJson.mimaF = false;
                }
            }else if(eleSignJson.PAITYPE=='C'){
                if(eleSignJson.C==''){
                    eleSignJson.mimaF = true;
                }else{
                    eleSignJson.mimaF = false;
                }
            }

        } else {
            if (eleSignJson.NETBANK_STATE_N == 'N' || eleSignJson.NETBANK_STATE_N == 'L' || eleSignJson.NETBANK_STATE_N == 'U') {
                eleSignJson.wangYin = '1';
            }
        }
        if (eleSignJson.NETBANK_STATE == 'W' || eleSignJson.NETBANK_STATE == 'C') {
            if ($('#switch-one').val() == 'on') {
                eleSignJson.NETBANK_STATE = 'W';
                eleSignJson.NETBANK_STATE_W = 'N';
                //if(eleSignJson.telBankSet==true){
                //eleSignJson.mo_VOUCHER_TYPE = ;
                //eleSignJson.mo_ACCT_NO = ;
                zhangArr[2] = '';
                zhangArr[3] = '';
                zhangArr[4] = '';
                //}

            } else {
                eleSignJson.NETBANK_STATE = '';
                zhangArr[2] = '';
                zhangArr[3] = '';
            }
        } else if (eleSignJson.NETBANK_STATE == 'L') {
            if ($('#switch-one').val() == 'on') {
                eleSignJson.NETBANK_STATE = 'N';
                eleSignJson.suo_OPERATE_TYPE = 'U';
            }
        } else if (eleSignJson.NETBANK_STATE == 'N') {
            if ($('#switch-one').val() == 'off') {
                eleSignJson.suo_OPERATE_TYPE = 'L';
                eleSignJson.NETBANK_STATE = 'L';
            } else {
                eleSignJson.suo_OPERATE_TYPE = 'N';
                eleSignJson.NETBANK_STATE = 'N';
            }
        } else if (eleSignJson.NETBANK_STATE == '') {
            if ($('#switch-one').val() == 'on') {
                if (eleSignJson.NETBANK_STATE_N == 'N') {
                    eleSignJson.NETBANK_STATE = 'N';
                } else {
                    eleSignJson.NETBANK_STATE = 'W';  //  可能需要清空zhangArr[2]、zhangArr[3]
                    zhangArr[2] = '';
                    zhangArr[3] = '';
                    zhangArr[4] = '';
                }
                eleSignJson.NETBANK_STATE_W = 'N';

            } else {
                eleSignJson.NETBANK_STATE = '';
                //if (eleSignJson.telBankSet == true) {
                zhangArr[2] = '';
                zhangArr[3] = '';
                zhangArr[4] = '';
                //}
            }
        }
        //手机银行
        if ($('#switch-two').val() == 'on') {
            if (eleSignJson.WAP_FLAG != 'N') {
                eleSignJson.mobile = '1';
                if (eleSignJson.NETBANK_STATE != 'W')
                    eleSignJson.NETBANK_STATE = 'N';
            }
            if (Number(eleSignJson.SEC_WAPTRANSFER_LIMITT.replace(/,/g,'')) != Number($('.xe').eq(2).val().replace(/,/g,''))) {
                eleSignJson.mobile = '1';
            }
            eleSignJson.WAP_FLAG = 'N';
        } else {
            //if (eleSignJson.WAP_FLAG == 'N') {
            //    eleSignJson.mobile = '1';
            //}
            eleSignJson.WAP_FLAG = 'W';
            eleSignJson.mobile = '0';
        }
        if (eleSignJson.SEC_STATE == 'W') {
            eleSignJson.SEC_OPRT = '1';
        } else {
            eleSignJson.SEC_OPRT = '2';
        }
        if ($('#switch-one').val() == 'off') {
            eleSignJson.SEC_EPAY_LIMIT = '0.00';
            eleSignJson.SEC_TRANSFER_LIMIT = '0.00';
        }
        if ($('#switch-two').val() == 'off') {
            eleSignJson.SEC_WAPTRANSFER_LIMIT = '0.00';
        }
        if (eleSignJson.wangYin == '0' && eleSignJson.mobile == '0') {
            eleSignJson.NETBANK_STATE = '';
        } else {
            if (eleSignJson.NETBANK_STATE_N == 'L' || eleSignJson.NETBANK_STATE_N == 'U') {
                showTags({
                    'title': '提示',
                    'content': '网银状态非正常，不可操作网银相关交易！',
                    'ok': {}
                });
                $('#netBank .kai').text('已开通');
                $('#switch-one').val('on').slider("refresh");
                if ($('.netBank .netBank-content').hasClass('no-kai')) {
                    $('.netBank .netBank-content').removeClass('no-kai');
                    $('.netBank .netBank-content input').removeClass('no-kai');
                }
                $('.netBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_TRANSFER_LIMITT).removeAttr('disabled');    //实际限额
                $('.netBank .netBank-content .wangyin:eq(1) .xe').val(eleSignJson.SEC_EPAY_LIMITT).removeAttr('disabled');
                if ((eleSignJson.WAP_FLAGT == 'N')) {
                    $('#mobBank .kai').text('已开通');
                    $('#switch-two').val('on').slider("refresh");
                    if ($('.mobBank .netBank-content').hasClass('no-kai')) {
                        $('.mobBank .netBank-content').removeClass('no-kai');
                        $('.mobBank .netBank-content .xe').removeClass('no-kai');
                    }
                    $('.mobBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_WAPTRANSFER_LIMITT).removeAttr('disabled');     //实际限额
                } else {
                    $('#switch-two').val('off').slider("refresh");
                    if (!$('.mobBank .netBank-content').hasClass('no-kai')) {
                        $('.mobBank .netBank-content').addClass('no-kai');
                        $('.mobBank .netBank-content .xe').addClass('no-kai').attr('disabled', 'disabled');
                    }
                    $('#mobBank .kai').text('已关闭').addClass('off');
                    $('.mobBank .netBank-content .wangyin:eq(0) .xe').val(eleSignJson.SEC_WAPTRANSFER_DFLIMIT).addClass('no-kai').attr('disabled', 'disabled');    //最大限额
                }
                return;
            }
        }

        //银信通
        eleSignJson.yin_ACCT_NO = $('#ples-kzh option:selected').text() || $('#ples-kzh-button span').text();
        var yin_PB_type = null;
        $('#ples-kzh option').each(function () {
            if ($(this).text() == $('#ples-kzh-button span').text()) {
                yin_PB_type = $(this).val();
            }
        });
        eleSignJson.yin_PB_TYPE = $('#ples-kzh').val() || yin_PB_type;
        var noteArr = eleSignJson.NOTE_OPENT.split('');
        if ($('#switch-three').val() == 'on') {
            if (noteArr[0] != '1') {
                eleSignJson.yinXinTong = '1';
            }
            if ((eleSignJson.FROM_INCEPT_AMTT==undefined)||(Number($('#yexport-wxxe').val().replace(/,/g,'')) != Number(eleSignJson.FROM_INCEPT_AMTT.replace(/,/g,'')))) {
                eleSignJson.yinXinTong = '1';
            }
            noteArr[0] = 1;
        } else {
            if (noteArr[0] == '1') {
                eleSignJson.yinXinTong = '1';
            }
            noteArr[0] = 0;
        }
        if ($('#switch-four').val() == 'on') {
            if (noteArr[1] != '1') {
                eleSignJson.yinXinTong = '1';
            }
            if ((eleSignJson.TO_INCEPT_AMTT==undefined)||(Number($('#yimport-wxxe').val().replace(/,/g,'')) != Number(eleSignJson.TO_INCEPT_AMTT.replace(/,/g,'')))) {
                eleSignJson.yinXinTong = '1';
            }
            noteArr[1] = 1;
        } else {
            if (noteArr[1] == '1') {
                eleSignJson.yinXinTong = '1';
            }
            noteArr[1] = 0;
        }
        if ($('#switch-five').val() == 'on') {
            if (noteArr[3] != '1') {
                eleSignJson.yinXinTong = '1';
            }
            noteArr[3] = 1;
        } else {
            if (noteArr[3] == '1') {
                eleSignJson.yinXinTong = '1';
            }
            noteArr[3] = 0;
        }
        if ($('#switch-six').val() == 'on') {
            if (noteArr[5] != '1') {
                eleSignJson.yinXinTong = '1';
            }
            noteArr[5] = 1;
        } else {
            if (noteArr[5] == '1') {
                eleSignJson.yinXinTong = '1';
            }
            noteArr[5] = 0;
        }
        if (eleSignJson.yinXinTong == '0') {
            eleSignJson.yin_ACCT_NO = '';
            eleSignJson.yin_ACCT_NO_y = $('#ples-kzh option:selected').text() || $('#ples-kzh-button span').text();
        }
        eleSignJson.NOTE_OPEN = noteArr.join('');
        eleSignJson.FROM_INCEPT_AMT = fmoneyEle($('#yexport-wxxe').val(),2);
        eleSignJson.TO_INCEPT_AMT = fmoneyEle($('#yimport-wxxe').val(),2);
        if ($('#switch-one').val() == 'on') {
            //网银限额判定
            if (!(fmReg.money.test($('.xe').eq(0).val()))) {
                showMsg('网上银行对外转账限额格式错误，请重新输入！');
                return false;
            }
            if (!(fmReg.money.test($('.xe').eq(1).val()))) {
                showMsg('网上银行网银支付限额格式错误，请重新输入！');
                return false;
            }
            if (Number($('.xe').eq(0).val().replace(/,/g,'')) > Number(eleSignJson.SEC_TRANSFER_DFLIMIT.replace(/,/g,''))) {
                showTags({ //接口服务失败
                    'title': '提示',
                    'content': '网上银行对外转账限额不能大于银行级限额',
                    'ok': {
                        fun: function () {
                        }
                    }
                });
                return;
            }
            if (eleSignJson.NETBANK_STATE_N == 'N' || eleSignJson.NETBANK_STATE_N == 'L' || eleSignJson.NETBANK_STATE_N == 'U') {
                if (Number($('.xe').eq(0).val().replace(/,/g,'')) > Number(eleSignJson.SEC_TRANSFER_LIMITT.replace(/,/g,'')) && eleSignJson.SEC_TRANSFER_LIMITT != '') {
                    showTags({ //接口服务失败
                        'title': '提示',
                        'content': '网上银行对外转账限额不能大于客户自定义限额',
                        'ok': {
                            fun: function () {
                            }
                        }
                    });
                    return false;
                }
                if (Number($('.xe').eq(1).val().replace(/,/g,'')) > Number(eleSignJson.SEC_EPAY_DFLIMIT.replace(/,/g,''))) {
                    showTags({ //接口服务失败
                        'title': '提示',
                        'content': '网上银行网银支付限额不能大于银行级限额!',
                        'ok': {
                            fun: function () {
                            }
                        }
                    });
                    return;
                }
                if (Number($('.xe').eq(1).val().replace(/,/g,'')) > Number(eleSignJson.SEC_EPAY_LIMITT.replace(/,/g,'')) && eleSignJson.SEC_EPAY_LIMITT != '') {
                    showTags({ //接口服务失败
                        'title': '提示',
                        'content': '网上银行网银支付限额不能大于客户自定义限额!',
                        'ok': {
                            fun: function () {
                            }
                        }
                    });
                    return;
                }
            } else if (eleSignJson.NETBANK_STATE_N == 'W' || eleSignJson.NETBANK_STATE_N == 'C') {
                if (Number($('.xe').eq(0).val().replace(/,/g,'')) > Number(eleSignJson.SEC_TRANSFER_LIMITT.replace(/,/g,'')) && eleSignJson.SEC_TRANSFER_LIMITT != '0.00' && eleSignJson.SEC_TRANSFER_LIMITT != '') {
                    showTags({ //接口服务失败
                        'title': '提示',
                        'content': '网上银行对外转账限额不能大于客户自定义限额',
                        'ok': {
                            fun: function () {
                            }
                        }
                    });
                    return false;
                }
                if (Number($('.xe').eq(1).val().replace(/,/g,'')) > Number(eleSignJson.SEC_EPAY_DFLIMIT.replace(/,/g,''))) {
                    showTags({ //接口服务失败
                        'title': '提示',
                        'content': '网上银行网银支付限额不能大于银行级限额!',
                        'ok': {
                            fun: function () {
                            }
                        }
                    });
                    return;
                }
                if (Number($('.xe').eq(1).val().replace(/,/g,'')) > Number(eleSignJson.SEC_EPAY_LIMITT.replace(/,/g,'')) && eleSignJson.SEC_EPAY_LIMITT != '0.00' && eleSignJson.SEC_EPAY_LIMITT != '') {
                    showTags({ //接口服务失败
                        'title': '提示',
                        'content': '网上银行网银支付限额不能大于客户自定义限额!',
                        'ok': {
                            fun: function () {
                            }
                        }
                    });
                    return;
                }
            }
            eleSignJson.SEC_EPAY_LIMIT = fmoneyEle($('.xe').eq(1).val(),2);
            eleSignJson.SEC_TRANSFER_LIMIT = fmoneyEle($('.xe').eq(0).val(),2);
            //手机银行
            if ($('#switch-two').val() == 'on') {
                if (!(fmReg.money.test($('.xe').eq(2).val()))) {
                    showMsg('手机银行对外转账限额格式错误，请重新输入！');
                    return false;
                }
                if (Number($('.xe').eq(2).val().replace(/,/g,'')) > Number(eleSignJson.SEC_WAPTRANSFER_DFLIMIT.replace(/,/g,''))) {
                    showTags({ //接口服务失败
                        'title': '提示',
                        'content': '手机银行对外转账限额不能大于银行级限额！',
                        'ok': {
                            fun: function () {
                            }
                        }
                    });
                    return;
                }
                if (eleSignJson.WAP_FLAGT == 'N') {
                    if (Number($('.xe').eq(2).val().replace(/,/g,'')) > Number(eleSignJson.SEC_WAPTRANSFER_LIMITT.replace(/,/g,'')) && eleSignJson.SEC_WAPTRANSFER_LIMITT != '') {
                        showTags({ //接口服务失败
                            'title': '提示',
                            'content': '手机银行对外转账限额不能大于客户自定义限额！',
                            'ok': {
                                fun: function () {
                                }
                            }
                        });
                        return;
                    }
                } else {
                    if (Number($('.xe').eq(2).val().replace(/,/g,'')) > Number(eleSignJson.SEC_WAPTRANSFER_LIMITT.replace(/,/g,'')) && eleSignJson.SEC_WAPTRANSFER_LIMITT != '0.00' && eleSignJson.SEC_WAPTRANSFER_LIMITT != '') {
                        showTags({ //接口服务失败
                            'title': '提示',
                            'content': '手机银行对外转账限额不能大于客户自定义限额！',
                            'ok': {
                                fun: function () {
                                }
                            }
                        });
                        return;
                    }
                }

                eleSignJson.SEC_WAPTRANSFER_LIMIT = fmoneyEle($('.xe').eq(2).val(),2);
            }
        }
        //银信通限额判定
        if ($('#switch-three').val() == 'on') {
            if (!(fmReg.money.test($('.xe').eq(3).val()))) {
                showMsg('银信通资金转出起点金额格式错误，请重新输入！');
                return false;
            }
            if(!(fmReg.eleNum.test($('.xe').eq(3).val().replace(/,/g,'')))){
                showMsg('银信通资金转出起点金额格式错误，请重新输入！');
                return false;
            }
            if (Number($('.xe').eq(3).val().replace(/,/g,'')) < 0) {
                showTags({ //接口服务失败
                    'title': '提示',
                    'content': '银信通资金转出起点金额不能小于0元！',
                    'ok': {
                        fun: function () {
                        }
                    }
                });
                return;
            }
        } else {
            eleSignJson.FROM_INCEPT_AMT = '';
        }
        if ($('#switch-four').val() == 'on') {
            if (!(fmReg.money.test($('.xe').eq(4).val()))) {
                showMsg('银信通资金转入起点金额格式错误，请重新输入！');
                return false;
            }
            if(!(fmReg.eleNum.test($('.xe').eq(4).val().replace(/,/g,'')))){
                showMsg('银信通资金转出起点金额格式错误，请重新输入！');
                return false;
            }
            if (Number($('.xe').eq(4).val().replace(/,/g,'')) < 0) {
                showTags({ //接口服务失败
                    'title': '提示',
                    'content': '银信通资金转入起点金额不能小于0元！',
                    'ok': {
                        fun: function () {
                        }
                    }
                });
                return;
            }
        } else {
            eleSignJson.TO_INCEPT_AMT = '';
        }
        //说明银信通莫有更改
        if (zhangArr[5] == '' || zhangArr[5] == undefined) {
            eleSignJson.guaKao = '0';
            zhangArr[2] = '';
            zhangArr[3] = '';
            zhangArr[4] = '';
        } else {
            eleSignJson.guaKao = '1';
        }
        if (eleSignJson.yinXinTong == '0' && eleSignJson.guaKao == '0' && eleSignJson.mima == '0' && eleSignJson.wangYin == '0' && eleSignJson.mobile == '0') {
            showTags({ //接口服务失败
                'title': '提示',
                'content': '页面没有任何操作，不可进行下一步！',
                'ok': {
                    fun: function () {
                    }
                }
            });
            return;
        }
        //发起电话银行
        if (eleSignJson.mima == '1') {
            if (eleSignJson.isModify || eleSignJson.isOpen) {
                if (eleSignJson.mimaF) {
                    showLoader('客户密码设置中...');
                    eleSignJson.telBankSet = true;
                    $(".ui-loader").append('<div id="loaderCancel" style="width:300px; height:40px; line-height:40px; text-align:center; border:1px solid #FFFFFF; position:absolute; bottom:220px; left:50%; margin-left:-150px;color: #FFFFFF;">放弃</div>');
                    $("#loaderCancel").off('click').on('click', function () {
                        eleSignJson.telBankSet = false;
                        hideLoader();
                    });
                    var sendJson = {
                        "b": [{
                            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                            "workAddress.s": commonJson.workAddress,//工作地址
                            "moduleId.s": eleSignJson.moduleId, //模块编号
                            "tranId.s": eleSignJson.tranId1, //交易编号
                            "operatorNo.s": commonJson.adminCount, //操作员
                            "deviceNo.s": commonJson.udId, //设备编号
                            "orgId.s": commonJson.orgId,
                            "PAITYPE.s": eleSignJson.PAITYPE,//密码类型
                            "DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号
                            //"ACCT_NO.s": eleSignJson.mo_ACCT_NO, //卡账号
                            "CLIENT_ID.s": eleSignJson.CLIENT_NO, //客户号
                            "PHONE_NUMBER.s": eleSignJson.PHONE_NO,//电话号码eleSignJson.PHONE_NO
                            "BUSI_TYPE.s": '02'
                        }]
                    };
                    IAskTelPhPwdServiceFun(sendJson, function (msg) {
                        IAskTelPhPwdServiceEleSignSucc(msg);
                    }, function (err) {
						eleSignJson.telBankSet = false;                    	
                        hideLoader();
                        funFail(err);
                    });
                } else {
                    $.mobile.changePage('./dianzi-agreement.html', {
                        transition: "slide"
                    });
                }
            } else {
                showLoader('客户密码设置中...');
                eleSignJson.telBankSet = true;
                $(".ui-loader").append('<div id="loaderCancel" style="width:300px; height:40px; line-height:40px; text-align:center; border:1px solid #FFFFFF; position:absolute; bottom:220px; left:50%; margin-left:-150px;color: #FFFFFF;">放弃</div>');
                $("#loaderCancel").off('click').on('click', function () {
                    eleSignJson.telBankSet = false;
                    hideLoader();
                });
                var sendJson = {
                    "b": [{
                        "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                        "workAddress.s": commonJson.workAddress,//工作地址
                        "moduleId.s": eleSignJson.moduleId, //模块编号
                        "tranId.s": eleSignJson.tranId1, //交易编号
                        "operatorNo.s": commonJson.adminCount, //操作员
                        "deviceNo.s": commonJson.udId, //设备编号
                        "orgId.s": commonJson.orgId,
                        "PAITYPE.s": eleSignJson.PAITYPE,//密码类型
                        "DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号
                        //"ACCT_NO.s": eleSignJson.mo_ACCT_NO, //卡账号
                        "CLIENT_ID.s": eleSignJson.CLIENT_NO, //客户号
                        "PHONE_NUMBER.s": eleSignJson.PHONE_NO,//电话号码eleSignJson.PHONE_NO
                        "BUSI_TYPE.s": '02'
                    }]
                };
                IAskTelPhPwdServiceFun(sendJson, function (msg) {
                    IAskTelPhPwdServiceEleSignSucc(msg);
                }, function (err) {
                	eleSignJson.telBankSet = false;
                    hideLoader();
                    funFail(err);
                });
            }
        }
        else {
            $.mobile.changePage('./dianzi-agreement.html', {
                transition: "slide"
            });
        }
    });

});

//电子签约   提交完成界面
$(document).on("pageshow", '#dianzi-complete', function () {
    if (eleSignJson.qrCode == '' || eleSignJson.qrCode == undefined) {
        $('#dianzi-complete img').attr('display', 'hidden');
        showTags({
            'title': '提示',
            'content': '生成二维码失败!',
            'ok': {}
        });
    } else {
        transformStringToImage(eleSignJson.qrCode, function (msg) {
            $('#dianzi-complete img').attr('src', msg);
        }, function (err) {
            alert(err + '生成二维码失败')
        });
    }
    if(eleSignJson.qrCodeMsg!=''){
        showTags({
            'title': '提示',
            'content': eleSignJson.qrCodeMsg,
            'ok': {}
        });
    }
    //完成，返回首页
    $('#btn_next').on('click', function () {
        eleSignJson.userSign=false;
        $.mobile.changePage('../main.html', {transition: "slide"});
    });
});

//电子签约   人脸识别不通过
$(document).on("pageshow", '#personFace', function () {
    showLoader("影像对比中...");
    transFormBase64(eleSignJson.custFacePic, function (msg) {
        eleSignJson.faceBase64 = msg;
        transFormBase64(custermerInfo.image, function (msg1) {
            eleSignJson.imageBase64 = msg1;
            //显示四张图片
            $("#personFace .camera:eq(0)").attr('src', eleSignJson.custFacePic);   //面部照片
            $("#personFace .camera:eq(1)").attr('src', custermerInfo.image);      //身份证照片
            $("#personFace .camera:eq(2)").attr('src', eleSignJson.custFacePic);   //面部照片
            if(commonJson.isCustermerInfoMultiplex){
                eleSignJson.lianPic = custermerInfo.checkPhoto;
            }
            if(lianwanghechaData.CheckResult=='09' || lianwanghechaData.CheckResult=='02'){
        		$("#personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + eleSignJson.lianPic);  //联网核查照片
        }else{
        		$("#personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + eleSignJson.lianPic);  //联网核查照片
        }

            //影像两两对比
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": eleSignJson.moduleId,//模块编号
                    "tranId.s": eleSignJson.tranId1,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    "OPERATOR_NO.s": commonJson.adminCount, //业务经办人工号
                    "TRANS_SCENE.s": "0007",  //交易场景
                    "COMPARE_TYPE.s": "2",  //    比对类型1-客户经理比对，2-客户比对
                    "WS_TYPE.s": "2",  // 终端类型1-PC，2-IOS，3-Android
                    "WSNO.s": commonJson.udId,  //    终端号
                    "VERSION.s": "v1.1.4",  //当前控件版本
                    "TRANS_CHANNEL.s": "301",  //   渠道301
                    "ID_CARD.s": custermerInfo.cerNO,  // 身份证号码
                    "IMG_BASE.s": eleSignJson.faceBase64,  //      现场照片
                    "CRYPT_TYPE.s": "0",  //   图像是否经过加密0-未加密，1-加密方式一，2加密方式二
                    "ID_IMG_BASE.s": eleSignJson.lianPic,  //联网核查照片
                    "CARD_IMG_BASE.s": eleSignJson.imageBase64,  //  芯片照片
                    "BUSI_TYPE.s": "10"  //  电子渠道“10”

                }]
            };
            ifacelRecognitionSeFun(sendJson, function (msg) {
                IFacelRecognitionServiceeleSignSucc(msg);
            }, function (err) {
                eleSignJson.faceRecogn = '2'; //自动不通过
                $("#personFace .face-result").addClass('no-pass').text('未通过');
                $("#personFace .center-header").text('人脸识别未通过！');
                $('#personFace .previous:last').addClass('btn_next');
                $('#personFace .previous:last').text('远程复核');
                funFail(err);
            })
        }, function (err) {
            alert('影像转换失败！')
        });
    }, function (err) {
        alert('影像转换失败！')
    });

    //点击查询在线客户经理
    $('#dianzi-managerList a').on('click', function () {
        showLoader("获取远程复核客户经理...");
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                /*"orgId.s":commonJson.orgId,//机构号
                 "moduleID.s":debitEnter.moduleID,//模块编号
                 "tranId.s":debitEnter.tranId1,//交易编号*/
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId//设备编号
            }]
        };
        ISysUserServiceManListFun(sendJson, function (msg) {
            ISysUserServiceManListeleSignSucc(msg);
        }, function (err) {
            funFail(err);
        })
    })
    //点击继续
    $('#personFace .previous:last').on('click', function () {
        if(!($(this).hasClass('btn_next'))) return;
        if ($(this).text() == '继续') {
            $.mobile.changePage('dianzi-customerConfirm.html', {reverse: true});
        } else {
            if ($('#dianzi-managerList select').val() == '') {
                showMsg('请选择一个客户经理');
                return;
            }
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": eleSignJson.moduleId,//模块编号
                    "tranId.s": eleSignJson.tranId1,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    "platGlobalSeq.s":eleSignJson.platGlobalSeqP, //流水号
                    "topic.s": "N/A", //主题N/A
                    "code.s": "101", //指令101
                    "paramUrl.s": "abc", //参数地址
                    "days.s": "0", //有效天数
                    "appKey.s": "com.nqsky.bank.service", //appKey  com.nqsky.bank.service
                    "context.s": "您有一条远程复核业务需要办理",//推送内容
                    "userIds.s": $('#dianzi-managerList select').val(),//用户ID  $('#xinka-managerList select').val()
                    "busiType.s":"10", //电子签约10
                    "cardResult.s":eleSignJson.cardResult,//联网核查对比
                    "chipResult.s":eleSignJson.chipResult//芯片对比
                }]
            };
            showLoader("正在等待"+$('#dianzi-managerList option:selected').attr('realName')+"[手机:"+$('#dianzi-managerList option:selected').attr('cellPhone')+"]复核...");
            eleSignJson.telCheck = true;
            iissuesServiceFun(sendJson, function (msg) {
                iissuesServiceeleSignSucc(msg);
            }, function (err) {
                funFail(err);
            })
        }

    });
    //点击F放弃
    $('#personFace .previous:first').on('click', function () {
        $.mobile.changePage('dianzi-customerP.html', {reverse: true});
    });
});
