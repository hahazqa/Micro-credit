//初始化积分刷卡/身份证信息界面信息
$(document).on('pagebeforeshow', '#jifen-readingID, #jifen-readID', function(){
	var id = $(this).attr("id");
	if(jifenJson.tranId == '62'){
		$('#' + id).addClass('gift');
		$('#' + id + ' #headTitle').html('积分兑换');
		$('#' + id + ' #gift_process').show();
		jifenJson.getPhoneInd = '1';
	} else if(jifenJson.tranId == '63'){
		$('#' + id).addClass('order');
		$('#' + id + ' #headTitle').html('积分订单管理');
		$('#' + id + ' #photoRbtn').css("visibility", "hidden");
		$('#' + id + ' #order_process').show();
		jifenJson.getPhoneInd = '0';
	}
});

//积分刷卡界面
$(document).on('pageshow', '#jifen-readingID', function () {
	getCurrentLocationCoordinateFun();
	lianwanghechaData.dianzixinyongkaDX="4";
    //以上内容删除
    jifenJson.isPhoto=false;           	//影像采集界面缓存
    jifenJson.isTelCheck=false;     	//影像对比
    // jifenJson.isUploadFile=false;		//文件上传
    jifenJson.cardList = undefined;			//初始化凭证列表
    commonJson.isCustermerInfoMultiplex = false; //初始化影像复用 没有复用
    creditJson.isCancelReadCard = false; //初始化'是取消执行读取身份证方法' 默认false 打开页面就执行不取消
    //调用刷身份证方法
    $(".footter .previous").on('click', function () {
        creditReadCard(function () {
            $.mobile.changePage('jifen-readID.html');
        }, function (err) {
            $.mobile.changePage('jifen-readID.html');
        });
    })
    //点击影像复用按钮
    $("#jifen-readingID .conter-con .picRe").on('click', function () {
        $.mobile.changePage('jifen-video.html');
    });

    //点击首页
    $("#jifen-readingID .head-left").on('click', function () {
        $.mobile.changePage('../main.html');
    })
    //点击退出
    $("#jifen-readingID .head-right").on('click', function () {
        $.mobile.changePage('../main.html');
    })
});

//积分联网核查  显示身份证信息 页面
$(document).on("pageshow", '#jifen-readID', function () {
    if (creditJson.isReadCardSucc || commonJson.isCustermerInfoMultiplex) { //读卡成功
    	lianwanghechaData.dianzixinyongkaDX="4";
        creditReadCardSucc({
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": jifenJson.moduleId, //模块编号
                "tranId.s": jifenJson.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "DOCUMENT_TYPE.s": "0", //证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号码
                "CLIENT_NAME.s": custermerInfo.name, //被核对人姓名
                "BUSSINESSCODE.s": "01", //业务总类
                "BRANCH_ID.s": commonJson.orgId//机构号
            }]
        });
    } else {
        creditReadCardFail();
    }
    //点击下一步按钮
    $('#jf-read-next').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        showLoader('客户信息查询中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": jifenJson.moduleId, //模块编号 4
                "tranId.s": jifenJson.tranId, //交易编号   2
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
                "CARD_CATEGORY.s": "2",	//2检查是否有客户号和有效凭证存在
                "getPhoneInd.s": jifenJson.getPhoneInd	//是否获取手机号标识
            }]
        };
        //核心联查
        icustomerInfoServiceFun(sendJson, function (msg) {
            jifenCustomerInfoSucc(sendJson, msg);
        }, function (err) {
            funFail(err);
        });
    });
    
    //点击上一步，跳转页面
    $('#jf-read-pre').on('click', function () {
    	 if (!($(this).hasClass('back-1'))) return;
        $.mobile.changePage('./jifen-readingID.html', {
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
                "moduleId.s": jifenJson.moduleId, //模块编号
                "tranId.s": jifenJson.tranId, //交易编号
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
                "moduleId.s": jifenJson.moduleId, //模块编号 4
                "tranId.s": jifenJson.tranId, //交易编号   2
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
                "CARD_CATEGORY.s": "2",	//2检查是否有客户号和有效凭证存在
                "getPhoneInd.s": jifenJson.getPhoneInd	//是否获取手机号标识
            }]
        };
        //获取客户信息
        icustomerInfoServiceFun(sendJson, function (msg) {
            jifenCustomerInfoSucc(sendJson, msg);
        }, function (err) {
            funFail(err);
        });
 		//lianwanghechaFun();
 	});
 	$(".lianwanghecha-tuichu").on("click",function(){//退出
 		$.mobile.changePage('jifen-readingID.html', { transition: "slide" });
 		$(".lianwanghecha-yichang").hide();
 	});
});

//积分影像复用界面
$(document).on("pageshow", '#jifen-video', function () {
    //从数据库中查询可复用的个人信息
    queryAllcacheCustermerInfo();
    //点击取消
    $('#jifen-video .previous-con').on('click', function () {
        $.mobile.changePage('jifen-readingID.html', {reverse: true});
    });
    //点击影像复用
    $('#btn_next').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        commonJson.isCustermerInfoMultiplex = true; //使用影像复用功能
        $.mobile.changePage('jifen-readID.html');
    })
});

var orderInfo = {};
//进入积分订单管理页面
$(document).on("pageshow", '#jifen-orderList', function () {
	orderInfo = {};
	getOrderList('1');
	//上一页
	$('#pre_btn').click(function(){
		if(!$(this).hasClass('page-number-bgcolor')){
			return;
		}
		getOrderList(parseInt($('#page').html()) - 1);
	});
	//下一页
	$('#next_btn').click(function(){
		if(!$(this).hasClass('page-number-bgcolor')){
			return;
		}
		getOrderList(parseInt($('#page').html()) + 1);
	});
	//为列表每行增加点击事件
	$('#orderList').on('click', '.box-rows', function(){
		$('#orderList .click').removeClass('click');
		$(this).addClass('click');
		$('.footter .btn_next').removeClass('btn_next');
		var data = JSON.parse($(this).attr('data'));
		if(data.ORD_STATE == '0'){
			$('#chancel_btn').addClass('btn_next');
			$('#confirm_btn').addClass('btn_next');
		} else if(data.ORD_STATE == '2'){
//			$('#chancel_btn').addClass('btn_next');
			$('#confirm_btn').addClass('btn_next');
		} else if(data.ORD_STATE == '3'){
			$('#return_btn').addClass('btn_next');
		}
	});
	//礼品退货按钮
	$('#return_btn').click(function(){
		if(!$(this).hasClass('btn_next')){
			return;
		}
		orderInfo = JSON.parse($('#orderList .click').attr('data'));
		orderInfo.OPERATE = '3';
		$.mobile.changePage('jifen-orderConfirm.html');
	});
	//取消订单按钮
	$('#chancel_btn').click(function(){
		if(!$(this).hasClass('btn_next')){
			return;
		}
		var data = JSON.parse($('#orderList .click').attr('data'));
//		if(commonJson.loginTime.substr(0, 11) != dateToYMDhms(JSON.parse($('#orderList .click').attr('data')).ORDER_TIME)){
//			showMsg('仅可取消当日订单！');
//			return;
//		}
		$('#channel_reason_box ul li.select').removeClass('select');
		$('#channel_reason_box #continue_btn').removeClass('btn_next');
		//弹出取消原因选择框
		$('#channel_reason_box').show();
	});
	//确认收货按钮
	$('#confirm_btn').click(function(){
		if(!$(this).hasClass('btn_next')){
			return;
		}
		orderInfo = JSON.parse($('#orderList .click').attr('data'));
		orderInfo.OPERATE = '1';
		$.mobile.changePage('jifen-orderConfirm.html');
	});
	//关闭取消原因选择框
	$('#close_btn').click(function(){
		$('#channel_reason_box').hide();
	});
	//确认取消订单按钮
	$('#continue_btn').click(function(){
		if (!$(this).hasClass('btn_next')) return;
		orderInfo = JSON.parse($('#orderList .click').attr('data'));
		orderInfo.OPERATE = '2';
		orderInfo.REASON = $('#channel_reason_box ul li.select font').html();
		$.mobile.changePage('jifen-orderConfirm.html');
	});
	//取消原因选择事件
	$('#channel_reason_box ul li').click(function(){
		$('#channel_reason_box ul li.select').removeClass('select');
		$(this).addClass('select');
		$('#channel_reason_box #continue_btn').addClass('btn_next');
	});
});

//初始化订单操作确认提交页面信息
$(document).on('pagebeforeshow', '#jifen-orderConfirm', function(){
	for(var key in orderInfo){
		$('#jifen-orderConfirm #' + key).html(orderInfo[key]);
	}
	if(orderInfo.OPERATE == '2'){
		$('#jifen-orderConfirm #REASON').parent().show();
	}
	$('#jifen-orderConfirm #CREATE_DATE').html(dateToYMDhms(orderInfo['ORDER_TIME']));
	$('#jifen-orderConfirm #OPERATE').html(orderOperate[orderInfo.OPERATE]);
	$('#jifen-orderConfirm #CLIENT_NAME').html(custermerInfo.name);
});

//进入订单操作确认提交页面
$(document).on('pageshow', '#jifen-orderConfirm', function(){
	jifenJson.platGlobalSeq = undefined;
	// jifenJson.isUploadFile=false;
	//修改按钮
	$('#orderEdit').click(function(){
		$.mobile.changePage('jifen-orderList.html', {
            reverse: true
        });
	});
	signature.init({
        div: $('#qianM'), //签名容器
        finishBtn: $("#qianOK"), //完成签名按钮
        clearBtn: $("#clear-botton"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function(data) { //签名完成回调函数
            if($('#ic_disagree').is(':hidden')){
                $('#ic_agree').hide(); 
                $('#ic_disagree').show();
                $("#jifen-sign-over").remove();
            }else{
                $('#ic_disagree').hide();
                $('#ic_agree').show(); 
                $('#jifen-orderConfirm .video-qian .qian-box').css('position','relative');
                $('#jifen-orderConfirm .video-qian .qian-box').append('<div id="jifen-sign-over" style="position:absolute; top:0; right:0;left:0;bottom:0"></div>');
                jifenJson.data = data.replace('data:image/png;base64,','')
            }        
        }
    });
    //提交订单操作
	$('#order_submit').click(function(){
		if (!$(this).hasClass('btn_next')) return;
		if($('#ic_agree').is(':hidden')){
            showMsg('请确认签名！');
            return;
        }
		getPlatGlobalSeq(jifenJson, function(){
            // orderOperateSubmitFun();
            rewardSignUpload();
		});
	});
});

//初始化订单操作完成界面信息
$(document).on('pagebeforeshow', '#jifen-orderComplete', function(){
	for(var key in orderInfo){
		$('#jifen-orderComplete #' + key).html(orderInfo[key]);
	}
	$('#jifen-orderComplete #completeTitle').html(jifenCompleteTitle["order" + orderInfo.OPERATE]);
	$('#jifen-orderComplete #CLIENT_NAME').html(custermerInfo.name);
	$('#jifen-orderComplete #btn_next').click(function(){
		$.mobile.changePage('../main.html');
	});
});

var giftInfo, giftListSwiper, page, hasMore, searchJson;
//礼品列表界面
$(document).on('pageshow', '#jifen-giftList', function(){
	hasMore = true;
	giftInfo = {};
	giftListSwiper = undefined;
	page = 1;
	searchJson = {
		'minPoint': '',
		'maxPoint': '',
		'order': 'DESC'
	};
	showLoader('礼品列表查询中...');
	var sendJson = {
        "b": [{
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "moduleId.s": jifenJson.moduleId, //模块编号 4
            "tranId.s": jifenJson.tranId, //交易编号   2
            "operatorNo.s": commonJson.adminCount, //操作员  admin
            "deviceNo.s": commonJson.udId, //设备编号     
            "orgId.s": commonJson.orgId,
            "CLIENT_NAME.s": custermerInfo.name, //客户姓名
            "DOCUMENT_TYPE.s": "0", //证件类型
            "DOCUMENT_ID.s": custermerInfo.cerNO, //证件号
            "CON_NO.s": jifenJson.CLIENT_NO,	//客户号
            "END_MONTH.s": "",
            "superOrgId.s": commonJson.superOrgId, //上级机构号
            'minPoint.s': searchJson.minPoint, //最小积分
            'maxPoint.s': searchJson.maxPoint, //最大积分
            'order.s': searchJson.order, //排序方式
            "page.s": page + ""
        }]
    };
    
    //获取积分明细
    getIntegralDetailFun(sendJson, function (msg) {
        getIntegralDetailSucc(sendJson, msg);
    }, function (err) {
        funFail(err);
    });
    
	var swiperWindow = new Swiper('#giftInfoSwiper', { //弹窗左右划屏
		pagination: '.swiper-pagination',
		paginationClickable: true,
		spaceBetween: 30,
		noSwiping: false
	});
	
	//礼品兑换按钮
	$('#jifen-giftList').on('click', 'div[name="exchangeBtn"]', function(){
		if($(this).hasClass('gift_unexchange')) return;
		giftInfo = JSON.parse($(this).parent().attr('data'));
		$.mobile.changePage('./jifen-customerP.html');
	});
	
	//礼品详情按钮
	$('#jifen-giftList').on('click', 'div[name="detailBtn"]', function(){
		giftInfo = JSON.parse($(this).parent().attr('data'));
		$('#giftInfoImage').attr('src', 'data:image/png;base64,' + giftInfo.GF_IMAGE);
		$('#giftInfoTitle').html(giftInfo.GF_NAME);
		$('#giftInfoContent').html('');
		$('#giftInfoContent').html(giftInfo.GF_DETAIL);
		$('#giftInfoWindow').show();
		if(swiperWindow){
			swiperWindow.update();
			swiperWindow.slideTo(0, 0, false);
		}
	});
	
	//查看积分明细按钮
	$('#jifen-giftList #detailBtn').click(function(){
		$('#giftList').addClass('swiper-no-swiping');
		$('#detailWindow').show();
	});
	
	//积分明细弹出框关闭按钮
	$('#detailWindow #detail_close_btn').click(function(){
		$('#giftList').removeClass('swiper-no-swiping');
		$('#detailWindow').hide();
	});
	
	//礼品详情弹出框关闭按钮
	$('#windowCloseBtn').click(function(){
		$('#giftInfoWindow').hide();
	});
	
	//人气礼品按钮
	$('#popularityGiftBtn').click(function(){
		page = 1;
		getPopularityGiftList();
	});
	
	//进行筛选礼品按钮
	$('#openSeachBoxBtn').click(function(){
		$('#giftList').addClass('swiper-no-swiping');
		$('#giftSearchBox').show();
	});
	
	//筛选礼品弹出框关闭按钮
	$('#closeSearchBtn').click(function(){
		$('#giftList').removeClass('swiper-no-swiping');
		$('#giftSearchBox').hide();
	});
	
	//筛选礼品弹出框筛选按钮
	$('#giftSearchBtn').click(function(){
		var minPoint = $('#minPointInput').val();
		if(minPoint != '' && minPoint != '0' && !fmReg.numSZ.test(minPoint)){
			showMsg('最小兑换积分必须为空或正整数!');
			return;
		}
		var maxPoint = $('#maxPointInput').val();
		if(maxPoint != '' && maxPoint != '0' && !fmReg.numSZ.test(maxPoint)){
			showMsg('最大兑换积分必须为空或正整数!');
			return;
		}
		if(parseInt(minPoint) > parseInt(maxPoint)){
			showMsg('最小兑换积分不能大于最大兑换积分!');
			return;
		}
		$('#giftSearchBox').hide();
		$('#giftList').removeClass('swiper-no-swiping');
		searchJson.minPoint = $('#minPointInput').val();
		searchJson.maxPoint = $('#maxPointInput').val();
		searchJson.order = $('#orderSelect').val();
		page = 1;
		searchGiftList();
	});
});

//jifen-customerP页面  拍照方法
var jifenImageAcquisition = {
    imgSrc: '', //记录照片路径,
    curParentObj: '', //记录要删除的对象
    delImg: function (curParentObj, imgSrc) { //删除照片
        deletePhoto([imgSrc], function (msg) {
            curParentObj.find('.camera-pic').remove();
            curParentObj.find('.camera').show();
            curParentObj.find('.rephoto').html('必拍');
            $('.bigpic-review-box').animate({
                opacity: '0'
           	}, 200, function () {
                $('.bigpic-review-box').hide();
           	});
           	if (curParentObj.find('.cameraMul').length > 0) { //如果是其他证明
                curParentObj.closest('.img_box').remove();
            }
            //监测下一步是否可点击
            $('#jf_customerP_next').removeClass('btn_next');
            var ind = 0;
            for (var i = 0; i < 3; i++) {
                if ($('#jifen-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 3) {
                        $('#jf_customerP_next').addClass('btn_next');
                    }
                }
            }
        }, function (err) {
        })

    },
    getImg: function (curParentObj) { //拍照
    	if ($('#jifen-customerP .cameraMul').length == 18) {
            $('#jifen-customerP .cameraMul').eq(17).parents(".img_box").remove();
            showTags({
                'title': '提示',
                'content': "拍摄照片已到最大限度[最大限度为20张]",
                'ok': {}
            });
            return;
        }
        Meap.media('camera', curParentObj.attr('picName'), function (msg) {
            jifenImageAcquisition.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.find('.camera-pic').remove();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');
            var ele = $('.img_box:last').find('.rephoto').text();
            if (curParentObj.find('.cameraMul').length > 0 && ele != '选拍，可多张拍摄') { //如果是其他证明
                var htmltext = '<div class="img_box" style="position: relative;">' +
                '<div class="customer customer_six" picName="qitazhengming">' +
                '<div class="rephoto">选拍，可多张拍摄</div>' +
                '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/>' +
                '</div>' +
                '<div class="img_notes">其他</div>';
                $('#jifen-customerP .img_content').append(htmltext).trigger("create");
            }
            //监测下一步是否可点击
            var ind = 0;
            for (var i = 0; i < 3; i++) {
                if ($('#jifen-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 3) {
                        $('#jf_customerP_next').addClass('btn_next');
                    }
                }
            }
        }, function (err) {
            showMsg(err);
        })
    },
    getFace: function (curParentObj) {
        faceDistinguish('trans', function (msg) {
            jifenImageAcquisition.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');
            $('#jf_customerP_next').removeClass('btn_next');
            var ind = 0;
            for (var i = 0; i < 3; i++) {
                if ($('#jifen-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if (ind >= 3) {
                        $('#jf_customerP_next').addClass('btn_next');
                    }
                }
            }
            jifenJson.isTelCheck = false;
        }, function (err) {
            showMsg(err);
        })
    },
    reGetImg: function (curParentObj, imgSrc) { //重拍
        if (curParentObj.parent().hasClass('get-face')) {
            faceDistinguish('trans', function (returnGetMsg) {
                deletePhoto([imgSrc], function (returnDelMsg) {
                    jifenImageAcquisition.imgSrc = returnGetMsg;
                    curParentObj.find('.camera-pic').attr('src', returnGetMsg);
                    $('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
                    jifenJson.isTelCheck = false;
                }, function (err) {

                })
            }, function (err) {
                showMsg('重拍失败');
            })
        } else {
            Meap.media('camera', curParentObj.attr('picName'), function (returnGetMsg) {
                imgSrc = curParentObj.find('.camera-pic').attr('src');
                deletePhoto([imgSrc], function (returnDelMsg) {
                    jifenImageAcquisition.imgSrc = returnGetMsg;
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
//积分影像采集页面
$(document).on("pageshow", '#jifen-customerP', function () {
    if (jifenJson.isPhoto) {
        $.each(jifenJson.picFileARR, function (index, el) {
            if (index < 3 && el) {
                el = MT_path + el.split("/")[el.split("/").length - 1];
                $('.img_box:eq(' + index + ') .customer').find('.camera-pic').remove();
                $('.img_box:eq(' + index + ') .customer').append('<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">');
                $('.img_box:eq(' + index + ') .rephoto').text('重拍');
                $('.img_box:eq(' + index + ') .camera').hide();
            } else {
                if (!el) return true;
                el = MT_path + el.split("/")[el.split("/").length - 1];
                $('<div class="img_box" style="position: relative;">' +
                '<div class="customer customer_six">' +
                '<div class="rephoto">重拍</div>' +
                '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/ style ="display:none">' +
                '<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">' +
                '</div>' + '<div class="img_notes">其他</div>').insertBefore('.img_box:last');

            }
        });
        var ind = 0;
        for (var i = 0; i < 3; i++) {
            if ($('#jifen-customerP .customer:eq(' + i + ')').find("img").length == 2) {
                ind++;
                if (ind >= 3) {
                    $('#jf_customerP_next').addClass('btn_next');
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
    jifenJson.isPhoto=true;

    //预览大图 点击关闭
    $('.bigpic-review-close').click(function (event) {
        jifenImageAcquisition.reviewImgClose();
    });
    //预览大图 删除图片
    $('.bigpic-review-del').click(function (event) {
        jifenImageAcquisition.delImg(jifenImageAcquisition.curParentObj, jifenImageAcquisition.imgSrc);
    });
    //预览大图 重新拍照
    $('.bigpic-review-rephone').click(function (event) {
        jifenImageAcquisition.reGetImg(jifenImageAcquisition.curParentObj, jifenImageAcquisition.imgSrc);
    });
    $('#jifen-customerP .conter-con').on('click', '.customer', function (ev) {
        jifenImageAcquisition.curParentObj = $(this);
        var oTarget = ev.target;
        if ($(this).find('.rephoto').html() == '重拍') { //重拍
            if ($(oTarget).hasClass('rephoto')) {
                jifenImageAcquisition.reGetImg(jifenImageAcquisition.curParentObj, jifenImageAcquisition.imgSrc);
            }
            if ($(oTarget).hasClass('camera-pic')) { //预览大图
                jifenImageAcquisition.imgSrc = $(oTarget).attr('src');
                jifenImageAcquisition.reviewImg($(oTarget).attr('src'));
            }
            return;
        }
        //拍照
        if (jifenImageAcquisition.curParentObj.parent().hasClass('get-face')) {
            jifenImageAcquisition.getFace(jifenImageAcquisition.curParentObj);
        } else {
            jifenImageAcquisition.getImg(jifenImageAcquisition.curParentObj);
        }
    });
    //点击上一步，跳转页面
    $('#jf_customerP_pre').on('click', function () {
    	//缓存积分影像资料
        jifenJson.picFileARR = [];//要打包的影像路径
        jifenJson.custFacePic = $('.img_box:eq(0) .customer img:eq(1)').attr('src');
        jifenJson.frontIDCardPic = $('.img_box:eq(1) .customer img:eq(1)').attr('src');
        jifenJson.backIDCardPic = $('.img_box:eq(2) .customer img:eq(1)').attr('src');
        jifenJson.picFileARR.push(jifenJson.custFacePic, jifenJson.frontIDCardPic, jifenJson.backIDCardPic);
        var len = $('#jifen-customerP .img_box').length;
        if (len - 3 > 0) {
            for (var i = 3; i < len; i++) {
                if ($('#jifen-customerP .img_box:eq(' + i + ') .camera-pic').length > 0) {
                    jifenJson.picFileARR.push($('#jifen-customerP .img_box:eq(' + i + ') .camera-pic:eq(0)').attr('src'));
                }
            }
        }
        $.mobile.changePage('./jifen-giftList.html', {
            reverse: true
        });
    });
    $('#jf_customerP_next').on('click', function () {
        if (!$(this).hasClass('btn_next')) return;
        //缓存积分影像资料
        jifenJson.picFileARR = [];//要打包的影像路径
        jifenJson.custFacePic = $('#jifen-customerP .camera-pic:eq(0)').attr('src');
        jifenJson.frontIDCardPic = $('#jifen-customerP .camera-pic:eq(1)').attr('src');
        jifenJson.backIDCardPic = $('#jifen-customerP .camera-pic:eq(2)').attr('src');
        custermerInfo.frontIDCardPic = $('#jifen-customerP .camera-pic:eq(1)').attr('src'); //身份证正面
        custermerInfo.backIDCardPic = $('#jifen-customerP .camera-pic:eq(2)').attr('src'); //身份证反面
        jifenJson.picFileARR.push(jifenJson.custFacePic, jifenJson.frontIDCardPic, jifenJson.backIDCardPic);
        var len = $('#jifen-customerP .img_box').length;
        if (len - 3 > 0) {
            for (var i = 3; i < len; i++) {
                if ($('#jifen-customerP .img_box:eq(' + i + ') .camera-pic').length > 0) {
                    jifenJson.picFileARR.push($('#jifen-customerP .img_box:eq(' + i + ') .camera-pic:eq(0)').attr('src'));
                }
            }
        }
        if(jifenJson.isTelCheck){
            $.mobile.changePage('./jifen-giftExchange.html', {transition: "slide"});
        }else{
            $.mobile.changePage('./jifen-personFace.html', {transition: "slide"});
        }
    });
});

//积分   人脸识别不通过
$(document).on("pageshow", '#jifen-personFace', function () {
	jifenJson.lianPic = custermerInfo.checkPhoto;
    showLoader("影像对比中...");
    transFormBase64(jifenJson.custFacePic, function (msg) {
        jifenJson.faceBase64 = msg;
        transFormBase64(custermerInfo.image, function (msg1) {
            jifenJson.imageBase64 = msg1;
            //显示四张图片
            $("#jifen-personFace .camera:eq(0)").attr('src', jifenJson.custFacePic);   //面部照片
            $("#jifen-personFace .camera:eq(1)").attr('src', custermerInfo.image);      //身份证照片
            $("#jifen-personFace .camera:eq(2)").attr('src', jifenJson.custFacePic);   //面部照片
    		$("#jifen-personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + jifenJson.lianPic);  //联网核查照片

            //影像两两对比
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": jifenJson.moduleId,//模块编号
                    "tranId.s": jifenJson.tranId,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    "OPERATOR_NO.s": commonJson.adminCount, //业务经办人工号
                    "TRANS_SCENE.s": "0010",  //交易场景
                    "COMPARE_TYPE.s": "2",  //    比对类型1-客户经理比对，2-客户比对
                    "WS_TYPE.s": "2",  // 终端类型1-PC，2-IOS，3-Android
                    "WSNO.s": commonJson.udId,  //    终端号
                    "VERSION.s": "v1.1.4",  //当前控件版本
                    "TRANS_CHANNEL.s": "301",  //   渠道301
                    "ID_CARD.s": custermerInfo.cerNO,  // 身份证号码
                    "IMG_BASE.s": jifenJson.faceBase64,  //      现场照片
                    "CRYPT_TYPE.s": "0",  //   图像是否经过加密0-未加密，1-加密方式一，2加密方式二
                    "ID_IMG_BASE.s": jifenJson.lianPic,  //联网核查照片
                    "CARD_IMG_BASE.s": jifenJson.imageBase64,  //  芯片照片
                    "BUSI_TYPE.s": "62"  //  积分兑换“62”
                }]
            };
            ifacelRecognitionSeFun(sendJson, function (msg) {
                IFacelRecognitionServiceJifenSucc(msg);
            }, function (err) {
                jifenJson.faceRecogn = '2'; //自动不通过
                $("#jifen-personFace .face-result").addClass('no-pass').text('未通过');
                $("#jifen-personFace .center-header").text('人脸识别未通过！');
                $('#jifen-personFace .previous:last').addClass('btn_next');
                $('#jifen-personFace .previous:last').text('远程复核');
                funFail(err);
            })
        }, function (err) {
            alert('影像转换失败！')
        });
    }, function (err) {
        alert('影像转换失败！')
    });

    //点击查询在线客户经理
    $('#jifen-managerList a').on('click', function () {
        showLoader("获取远程复核客户经理...");
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "orgId.s": commonJson.orgId,//机构号
                "moduleId.s": jifenJson.moduleId,//模块编号
                "tranId.s": jifenJson.tranId,//交易编号
                "operatorNo.s": commonJson.adminCount,//操作员
                "deviceNo.s": commonJson.udId//设备编号
            }]
        };
        ISysUserServiceManListFun(sendJson, function (msg) {
            ISysUserServiceManListJifenSucc(msg);
        }, function (err) {
            funFail(err);
        })
    })
    //点击继续
    $('#jifen-personFace .previous:last').on('click', function () {
        if(!($(this).hasClass('btn_next'))) return;
        if ($(this).text() == '继续') {
            $.mobile.changePage('jifen-giftExchange.html', {reverse: true});
        } else {
            if ($('#jifen-managerList select').val() == '') {
                showMsg('请选择一个客户经理');
                return;
            }
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": jifenJson.moduleId,//模块编号
                    "tranId.s": jifenJson.tranId,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    "platGlobalSeq.s":jifenJson.platGlobalSeqP, //流水号
                    "topic.s": "N/A", //主题N/A
                    "code.s": "101", //指令101
                    "paramUrl.s": "abc", //参数地址
                    "days.s": "0", //有效天数
                    "appKey.s": "com.nqsky.bank.service", //appKey  com.nqsky.bank.service
                    "context.s": "您有一条远程复核业务需要办理",//推送内容
                    "userIds.s": $('#jifen-managerList select').val(),//用户ID
                    "busiType.s": "62",  //积分兑换“62”
                    "cardResult.s":jifenJson.cardResult,//联网核查对比
                    "chipResult.s":jifenJson.chipResult//芯片对比
                }]
            };
            showLoader("正在等待"+$('#jifen-managerList option:selected').attr('realName')+"[手机:"+$('#jifen-managerList option:selected').attr('cellPhone')+"]复核...");
            jifenJson.telCheck = true;
            iissuesServiceFun(sendJson, function (msg) {
                iissuesServiceJifenSucc(msg);
            }, function (err) {
                funFail(err);
            })
        }

    });
    //放弃按钮
    $('#jifen-personFace .previous:first').on('click', function () {
        $.mobile.changePage('jifen-customerP.html', {reverse: true});
    });
});

//积分礼品兑换信息界面
$(document).on("pageshow", '#jifen-giftExchange', function () {
	if(jifenJson.cardList == undefined){
		showLoader('账卡号查询中..');
		var sendJson = {      //发送请求的参数
	        "b": [{
	            "deviceNo.s": commonJson.udId, //设备编号
	            "moduleId.s": jifenJson.moduleId, //模块编号
	            "tranId.s": jifenJson.tranId, //交易编号
	            "orgId.s": commonJson.orgId,//机构号
	            "operatorNo.s": commonJson.adminCount,//操作员
	            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
	            "workAddress.s": commonJson.workAddress,//工作地址
	            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
	            "CLIENT_NAME.s": custermerInfo.name, //客户姓名
	            "DOCUMENT_TYPE.s": "0", //证件类型
	            "DOCUMENT_ID.s": custermerInfo.cerNO, //证件号
	            "CLIENT_NO.s": jifenJson.CLIENT_NO //客户类型 N组织 P个人
	        }]
	    };
	    getDocLicenceListBankFun(sendJson, function (msg) {
	        getDocLicenceListJifenSucc(sendJson, msg);
	    }, function (err) {
	    	$('#next_btn').removeClass('btn_next');
	        funFail(err);
	    });
	}
	for(var key in giftInfo){
		$('#' + key).html(giftInfo[key]);
	}
	if(giftInfo.EXCHANGE_NUM != undefined){
		$('#EXCHANGE_NUM').val(giftInfo.EXCHANGE_NUM);
	}
	$('#jifen-giftExchange #NEED_POINT1').append('/个');
	$('#RECEIVE_MODE').append($('<option>').attr('value', '1').html('现场领取'))
		.append($('<option>').attr('value', '2').html('预约兑换'));
	if(giftInfo.OPERATE_TYPE != undefined && giftInfo.OPERATE_TYPE != ''){
		$('#RECEIVE_MODE').val(giftInfo.OPERATE_TYPE);
	}
	$('#RECEIVE_MODE').selectmenu("refresh", true);
	$('#RECEIVE_ORG').append($('<option>').html(commonJson.superOrgName)).selectmenu("refresh", true);
	$('#EXCHANGE_NUM').change(function(){
		var exNum = $(this).val();
		if(!fmReg.numSZ.test(exNum)){
			showMsg('兑换数量必须为大于0的数字');
			$(this).val('1');
			$('#EXCHANGE_NUM').change();
			return;
		}
		$('#NEED_POINT').html(giftInfo.NEED_POINT1 * exNum);
		$('#OVER_POINT').html(jifenJson.POINT - giftInfo.NEED_POINT1 * exNum);
		if(parseFloat($('#OVER_POINT').html()) < 0){
			showMsg('有效积分不足，不可兑换！');
			$(this).val('1');
			$('#EXCHANGE_NUM').change();
			return;
		}
	});
	$('#EXCHANGE_NUM').change();
	$('#RECEIVE_MODE').change(function(){
		if($(this).val() == '2'){
			$('#orgList').show();
		} else {
			$('#orgList').hide();
		}
	});
	$('#pre_btn').click(function(){
		giftInfo.EXCHANGE_NUM = $('#EXCHANGE_NUM').val();
		giftInfo.NEED_POINT = $('#NEED_POINT').html();
		giftInfo.OVER_POINT = $('#OVER_POINT').html();
		giftInfo.ACCT_NO = $('#ACCT_NO').val();
		giftInfo.OPERATE_TYPE = $('#RECEIVE_MODE').val();
		giftInfo.RECEIVE_MODE = $('#RECEIVE_MODE option:selected').html();
		giftInfo.RECEIVE_ORG = $('#RECEIVE_ORG option:selected').html();
		$.mobile.changePage('./jifen-customerP.html',{ reverse: true });
	});
	$('#next_btn').click(function(){
		if(!($(this).hasClass('btn_next'))) return;
		if(parseFloat($('#OVER_POINT').html()) < 0){
			showMsg('有效积分不足，不可兑换！');
			return;
		}
		if($('#ACCT_NO').val() == null || $('#ACCT_NO').val() == ''){
			showMsg('账卡号不能为空，请选择账卡号！');
			return;
		}
		giftInfo.EXCHANGE_NUM = $('#EXCHANGE_NUM').val();
		giftInfo.NEED_POINT = $('#NEED_POINT').html();
		giftInfo.OVER_POINT = $('#OVER_POINT').html();
		giftInfo.ACCT_NO = $('#ACCT_NO').val();
		giftInfo.OPERATE_TYPE = $('#RECEIVE_MODE').val();
		giftInfo.RECEIVE_MODE = $('#RECEIVE_MODE option:selected').html();
		giftInfo.RECEIVE_ORG = $('#RECEIVE_ORG option:selected').html();
		$.mobile.changePage('jifen-giftConfirm.html');
	});
	if(jifenJson.cardList != undefined){
		$('#jifen-giftExchange #ACCT_NO').selectmenu("refresh", true);
		$.each(jifenJson.cardList, function (index, val) {
			$('#jifen-giftExchange #ACCT_NO').append($('<option>').attr('value', val).html(val));
		});
		if(giftInfo.ACCT_NO != undefined && giftInfo.ACCT_NO != ''){
			$('#jifen-giftExchange #ACCT_NO').val(giftInfo.ACCT_NO);
		}
		$('#jifen-giftExchange #ACCT_NO').selectmenu("refresh", true);
	}
	if(giftInfo.OPERATE_TYPE == '2'){
		$('#orgList').show();
	} else {
		$('#orgList').hide();
	}
});

//积分礼品兑换信息确认界面
$(document).on("pageshow", '#jifen-giftConfirm', function () {
	jifenJson.USER_NO = '';
	custermerInfo.custAndCustOwnerPic = '';
	jifenJson.platGlobalSeq = undefined;
	// jifenJson.isUploadFile=false;
	for(var key in giftInfo){
		$('#jifen-giftConfirm #' + key).html(giftInfo[key]);
	}
	if(giftInfo.OPERATE_TYPE == '2'){
		$('#RECEIVE_ORG').parent().show();
	}
	$('#jifen-giftConfirm #EXCHANGE_NUM').append('个');
	$('#jifen-giftConfirm #CLIENT_NAME').html(custermerInfo.name);
	//修改按钮
	$('#giftEdit').click(function(){
		jifenJson.USER_NO = '';
		if(jifenJson.codeTime){
			clearInterval(jifenJson.codeTime);
		}
		$.mobile.changePage('jifen-giftExchange.html', {
            reverse: true
        });
	});
	signature.init({
        div: $('#qianM'), //签名容器
        finishBtn: $("#qianOK"), //完成签名按钮
        clearBtn: $("#clear-botton"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function(data) { //签名完成回调函数
            if($('#ic_disagree').is(':hidden')){
                $('#ic_agree').hide(); 
                $('#ic_disagree').show();
                $("#jifen-sign-over").remove();
            }else{
                $('#ic_disagree').hide();
                $('#ic_agree').show(); 
                $('#jifen-giftConfirm .video-qian .qian-box').css('position','relative');
                $('#jifen-giftConfirm .video-qian .qian-box').append('<div id="jifen-sign-over" style="position:absolute; top:0; right:0;left:0;bottom:0"></div>');
                jifenJson.data = data.replace('data:image/png;base64,','')
            }        
        }
    });
    jifenJson.getYZM = true;
    $("#jifen-auth-time").text('80');
    //获取短信验证码
    $('#jifen-giftConfirm #getMsg').on('click', function () {
        $('#jifen-giftConfirm #inp').eq(0).val('');
        if (jifenJson.getYZM == false) {
            $('#getMsg').removeClass('disMsg');
            return;
        }
        jifenJson.getYZM = false;   //是否可以点击获取验证码按钮
        $('#getMsg').removeClass('disMsg').addClass('disgua-btn');
        if (jifenJson.codeTime) {
            clearInterval(jifenJson.codeTime);
        }
        $("#jifen-auth-time").text('80');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": jifenJson.moduleId, //模块编号
                "tranId.s": jifenJson.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "CLIENT_NAME.s": custermerInfo.name, //客户姓名
	            "DOCUMENT_TYPE.s": "0", //证件类型
	            "DOCUMENT_ID.s": custermerInfo.cerNO, //证件号
                "SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": jifenJson.mobilePhone, //手机号码
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s" : jifenJson.faceRecogn //人脸识别
            }]
        };
        showLoader('获取中...');
        imessageAuthentionServiceFun(sendJson, function (msg) {
            imessageAuthentionServiceJifenSucc(sendJson, msg);
        }, function (err) {
            hideLoader();
            jifenJson.getYZM = true;
            $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
            funFail(err);
        });
    });
    //提交订单操作
	$('#gift_submit').click(function(){
		// if (!($(this).hasClass('btn_next'))) return;
		// if (timeInd == '0') {
  //           showTags({
  //               'title': '提示',
  //               'content': '动态口令已超时！',
  //               'ok': {
  //                   fun: function () {
  //                       $('#jifen-giftConfirm #inp').val('');
  //                       $("#jifen-auth-time").text('80');
  //                   }
  //               }
  //           });
  //           return;
  //       }
		if($('#ic_agree').is(':hidden')){
            showMsg('请确认签名！');
            return;
        }
		if(jifenJson.USER_NO==''){
            showMsg('请点击获取短信验证码!');
            return;
        }
		if ($('#jifen-giftConfirm #inp').val() == "") {
            showMsg('请输入正确格式的短信验证码！');
            return;
        }
        if(!(fmReg.pwD6.test($('#jifen-giftConfirm #inp').eq(0).val()))){
            showMsg('请输入正确格式的短信验证码！');
            return;
        }
        if(jifenJson.codeTime){
            clearInterval(jifenJson.codeTime);
        }
        jifenJson.getYZM = true;
        $("#jifen-auth-time").text('0');
        $("#getMsg").text('重新获取');
        $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
        showLoader("短信验证码验证中...");
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": jifenJson.moduleId, //模块编号
                "tranId.s": jifenJson.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "CLIENT_NAME.s": custermerInfo.name, //客户姓名
	            "DOCUMENT_TYPE.s": "0", //证件类型
	            "DOCUMENT_ID.s": custermerInfo.cerNO, //证件号
                "SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
                "USER_NO.s": jifenJson.USER_NO, //用户唯一标识
                "EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
                "MSG_INFO.s": $('#jifen-giftConfirm #inp').val(), //动态口令
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": jifenJson.mobilePhone, //
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s" : jifenJson.faceRecogn //人脸识别
            }]
        };
        imessageAuthentionServiceYFun(sendJson, function (msg) {
	        jifenImessageAuthentionServiceYSucc(sendJson, msg);
        }, function (err) {
            jifenJson.USER_NO = "";
            funFail(err);
        });
	});
});

//积分礼品兑换成功界面
$(document).on("pageshow", '#jifen-giftComplete', function () {
	for(var key in giftInfo){
		$('#jifen-giftComplete #' + key).html(giftInfo[key]);
	}
	if(giftInfo.OPERATE_TYPE == '2'){
		$('#RECEIVE_ORG').parent().show();
	}
	$('#jifen-giftComplete #completeTitle').html(jifenCompleteTitle["gift" + giftInfo.OPERATE_TYPE]);
	$('#jifen-giftComplete #CLIENT_NAME').html(custermerInfo.name);
	if (jifenJson.qrCode == '' || jifenJson.qrCode == undefined) {
        $('#backImage').hide();
        showTags({
            'title': '提示',
            'content': '生成二维码失败!',
            'ok': {}
        });
    } else {
        transformStringToImage(jifenJson.qrCode, function (msg) {
            $('#backImage').attr('src', msg);
        }, function (err) {
            showMsg(err + '生成二维码失败');
        });
    }
	$('#finish_btn').click(function(){
		$.mobile.changePage('../main.html', {transition: "slide"});
	});
});