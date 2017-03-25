/**
 * Created by ASUS on 2016/5/16.
 */
/**
 * 申请小微贷款
 **/

/*贷款产品界面*/
$(document).on("pageshow", '#smallLoan-product', function() {
	if(commonJson.tinyLoanUserId == '') {
		showTags({
			'title': '提示',
			'content': '小贷用户ID不存在,无权办理小微贷款业务,请到后端管理台配置！',
			'ok': {
				fun: function() {
					$.mobile.changePage('../main.html');
				}
			}
		});
		return;
	}
	//获取经纬度
	getCurrentLocationCoordinateFun(function() {
		//判断时间:true就查询本地数据库,false就查询后台
		smallLoan.todayIs = appTime.appCurDate('');
		if(smallLoan.todayIs == localStorage.spacetimeSmallLoan) { //是否当天发的请求 不发送请求
			smallLoan.isProRequest = false;
		} else {
			smallLoan.isProRequest = true;
		}
		if(!smallLoan.isProRequest) {
			smallLoanProductListEexTab(2);
		} else {
			showLoader("产品列表查询中...");
			var sendJson = {
				"b": [{
					"deviceNo.s": commonJson.udId, //设备编号
					"moduleId.s": smallLoan.moduleId, //模块编号
					"tranId.s": smallLoan.tranId, //交易编号
					"orgId.s": commonJson.orgId, //机构号
					"operatorNo.s": commonJson.adminCount, //操作员
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress //工作地址
				}]
			};
			getsmallLoanProductListConF(sendJson);
		}
		$('#s_type').on('change', function() {
			smallLoanProductListEexTab($(this).val());
		})
	});
});
/*读取身份证*/
$(document).on("pageshow", '#smallLoan-readingID', function() {

	if(smallLoan.IsNeedScore == false) {
		$('.circle-con').empty();
		$('.navigation-steps').removeClass('sevenCurrent');
		$('.navigation-steps').addClass('sixCurrent');
		$('#smallLoan-readingID #border-over').css('cssText', 'width:26% !important;');
		var textHtml = '';
		textHtml += '<li><div class="circle">1</div><p>产品选择</p></li>' +
			'<li><div class="circle">2</div><p>读取身份证</p></li>' +
			'<li class="color-cc"><div class="circle1">3</div><p>影像采集</p></li>' +
			'<li class="color-cc"><div class="circle1">4</div><p>信息录入</p></li>' +
			'<li class="color-cc"><div class="circle1">5</div><p>确认签名</p></li>' +
			'<li class="color-cc"><div class="circle1">6</div><p>完成</p></li>';
		$('.circle-con').html(textHtml);
	}

	initVariable();
	//调用刷身份证方法
	$(".footter .previous").on('click', function() {
		creditReadCard(function() {
			$.mobile.changePage('smallLoan-readID.html');
		}, function(err) {
			$.mobile.changePage('smallLoan-readID.html');
		});
	});

	//点击影像复用按钮
	$("#smallLoan-readingID .conter-con .picRe").on('click', function() {
		$.mobile.changePage('smallLoan-video.html');
	});
});
/*身份证联网核查*/
$(document).on("pageshow", '#smallLoan-readID', function() {
	if(smallLoan.IsNeedScore == false) {
		$('.circle-con').empty();
		$('.navigation-steps').removeClass('sevenCurrent');
		$('.navigation-steps').addClass('sixCurrent');
		$('#smallLoan-readID #border-over').css('cssText', 'width:26% !important;');
		var textHtml = '';
		textHtml += '<li><div class="circle">1</div><p>产品选择</p></li>' +
			'<li><div class="circle">2</div><p>读取身份证</p></li>' +
			'<li class="color-cc"><div class="circle1">3</div><p>影像采集</p></li>' +
			'<li class="color-cc"><div class="circle1">4</div><p>信息录入</p></li>' +
			'<li class="color-cc"><div class="circle1">5</div><p>确认签名</p></li>' +
			'<li class="color-cc"><div class="circle1">6</div><p>完成</p></li>';
		$('.circle-con').html(textHtml);
	}
	lianwanghechaData.dianzixinyongkaDX = "5";
	//显示信息
	if(creditJson.isReadCardSucc || commonJson.isCustermerInfoMultiplex) { //读卡成功
		creditReadCardSucc({
			"b": [{
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"moduleId.s": loan.moduleId, //模块编号
				"tranId.s": smallLoan.tranId, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"orgId.s": commonJson.orgId,
				"DOCUMENT_TYPE.s": "0", //证件类型
				"DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号码
				"CLIENT_NAME.s": custermerInfo.name, //被核对人姓名 "NAME12223964",//
				"BUSSINESSCODE.s": "02", //业务总类
				"BRANCH_ID.s": commonJson.orgId //机构号
			}]
		});
	} else {
		creditReadCardFail();
	}
	//点击上一步重新读取
	$("#smallLoan-readID .footter .previous:eq(0)").on('click', function() {
		if(!($(this).hasClass('btn_next'))) return;
		$.mobile.changePage('./smallLoan-readingID.html', {
			reverse: true
		});
	});
	//点击下一步 联网核查
	$("#smallLoan-readID .footter .previous:eq(1)").on('click', function() {
		if(!$(this).hasClass('btn_next')) {
			return;
		}
		if(commonJson.isCustermerInfoMultiplex) {
			lianwanghechaData.CheckResult = '00';
		}
		smallLoan.mInfo.lianPic = custermerInfo.checkPhoto;

		sloanIcustomerInfoServiceFun();
	});

	$(".lianwanghecha-chongxin").on("click", function() { //重新联网核查
		$(".lianwanghecha-yichang").hide();
		creditReadCardSucc({
			"b": [{
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"moduleId.s": smallLoan.moduleId, //模块编号
				"tranId.s": smallLoan.tranId, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"orgId.s": commonJson.orgId,
				"DOCUMENT_TYPE.s": "0", //证件类型
				"DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号码
				"CLIENT_NAME.s": custermerInfo.name, //被核对人姓名 "NAME12223964",//
				"BUSSINESSCODE.s": "02", //业务总类
				"BRANCH_ID.s": commonJson.orgId //机构号
			}]
		});

	});
	$(".lianwanghecha-jixu").on("click", function() { //继续业务办理
		$(".lianwanghecha-yichang").hide();
		smallLoan.mInfo.lianPic = custermerInfo.checkPhoto;
		sloanIcustomerInfoServiceFun();
		//$.mobile.changePage('smallLoan-cusPicture.html', {transition: "slide"});

	});
	$(".lianwanghecha-tuichu").on("click", function() { //退出
		$.mobile.changePage('smallLoan-readingID.html', {
			reverse: true
		});
		$(".lianwanghecha-yichang").hide();
	});
});
/*影像复用*/
$(document).on("pageshow", '#smallLoan-video', function() {
	if(smallLoan.IsNeedScore == false) {
		$('.circle-con').empty();
		$('.navigation-steps').removeClass('sevenCurrent');
		$('.navigation-steps').addClass('sixCurrent');
		$('#smallLoan-video #border-over').css('cssText', 'width:26% !important;');
		var textHtml = '';
		textHtml += '<li><div class="circle">1</div><p>产品选择</p></li>' +
			'<li><div class="circle">2</div><p>读取身份证</p></li>' +
			'<li class="color-cc"><div class="circle1">3</div><p>影像采集</p></li>' +
			'<li class="color-cc"><div class="circle1">4</div><p>信息录入</p></li>' +
			'<li class="color-cc"><div class="circle1">5</div><p>确认签名</p></li>' +
			'<li class="color-cc"><div class="circle1">6</div><p>完成</p></li>';
		$('.circle-con').html(textHtml);
	}
	//从数据库中查询可复用的个人信息
	queryAllcacheCustermerInfo();
	//点击取消
	$('#smallLoan-video .previous-con').on('click', function() {
		$.mobile.changePage('smallLoan-readingID.html', {
			reverse: true
		});
	});
	//点击影像复用
	$('#btn_next').on('click', function() {
		if(!($(this).hasClass('btn_next'))) return;
		commonJson.isCustermerInfoMultiplex = true; //使用影像复用功能
		$.mobile.changePage('smallLoan-readID.html');
	})
});

/* 测算额度显示界面 */
// $(document).on("pageshow", '#smallLoan-testLimit', function() {
//     // 点击测算额度
//     $("#smallLoan-testLimit .previous").on('click', function() {
//         $("#smallLoan-testLimit-uname").text(custermerInfo.name);
//         if(custermerInfo.sex == '男'){
//             $("#smallLoan-testLimit-usex").text('先生');
//         }else{
//             $("#smallLoan-testLimit-usex").text('女士');
//         }
//         $("#smallLoan-testLimit-ulimit").text(fmoney(8000000)+'元');
//         $("#smallLoan-testLimit .result-display").show();
//     });
//     //重新测算
//     $("#smallLoan-testLimit .chongxincesuan").on('click', function() {
//         $("#smallLoan-testLimit .result-display").hide();
//     });
//     // 点击继续申请
//     $("#smallLoan-testLimit .jixuanshenqing").on('click', function() {
//         $.mobile.changePage('smallLoan-cusPicture.html');
//     });
// });

var smallLoanImageAcquisition = {
	imgSrc: '', //记录照片路径,
	curParentObj: '', //记录要删除的对象
	delImg: function(curParentObj, imgSrc) {
		deletePhoto([imgSrc], function(msg) {
			curParentObj.find('.camera-pic').remove();
			curParentObj.find('.camera').show();
			curParentObj.find('.rephoto').html('必拍');
			$('.bigpic-review-box').animate({
					opacity: '0'
				},
				200,
				function() {
					$('.bigpic-review-box').hide()
				});
			if(curParentObj.find('.cameraMul').length > 0) { //如果是其他
				curParentObj.closest('.img_box').remove();
			}
			//监测下一步是否可点击
			var ind = 0;
			for(var i = 0; i < 4; i++) {
				if($('.customer:eq(' + i + ')').find("img").length == 2) {
					ind++;

					if(ind >= 4) {
						$('#smallLoan-cusPicture #btn_next').addClass('btn_next');
					} else {
						$('#smallLoan-cusPicture #btn_next').removeClass('btn_next');
					}

				}
			}
		}, function(err) {

		})
	},
	getFace: function(curParentObj) {
		faceDistinguish('trans', function(msg) {
			smallLoanImageAcquisition.imgSrc = msg;
			curParentObj.find('.camera').hide();
			curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
			curParentObj.find('.rephoto').text('重拍');
			//监测下一步是否可点击
			var ind = 0;
			for(var i = 0; i < 4; i++) {
				if($('.customer:eq(' + i + ')').find("img").length == 2) {
					ind++;

					if(ind >= 4) {
						$('#smallLoan-cusPicture #btn_next').addClass('btn_next');
					} else {
						$('#smallLoan-cusPicture #btn_next').removeClass('btn_next');
					}
				}

			}
		}, function(err) {
			showMsg(err);
		})
	},
	getImg: function(curParentObj) { //拍照
		Meap.media('camera', curParentObj.attr('picname'), function(msg) {
			creditJson.isPrev.LLDBisFromPrev = false;
			smallLoanImageAcquisition.imgSrc = msg;
			curParentObj.find('.camera').hide();
			curParentObj.find('.camera-pic').remove();
			curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
			curParentObj.find('.rephoto').text('重拍');
			var ele = $('.img_box:last').find('.rephoto').text();
			if(curParentObj.find('.cameraMul').length > 0 && ele != '选拍，可多张拍摄') { //如果是其他

				var htmlText = "";
				htmlText += '<div class="img_box" style="position: relative;">' +
					'<div class="customer customer_six" picname="qitazhengming">' +
					'<div class="rephoto">选拍，可多张拍摄</div>' +
					'<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/>' +
					'</div>' +
					'<div class="img_notes qitazhengming" othername="qitazhengming">其他</div>' +
					'<div class="qita-tanchuang-cbg"></div>' +
					'<img src="../../images/crow_icon_win.png" class="crow_icon_win" />' +
					'<div class="qita-tanchuang-con">' +
					'<div class="queren-quxiao">' +
					'<div class="quxiao-ok quxiao-click">取消</div>' +
					'<div class="quxiao-ok queding-click">确定</div>' +
					'</div>' +
					'<ul class="qita-tanchuang-ul">' +
					'<li othername="peiFacePic">客户面部照片（配偶）</li>' +
					'<li othername="peiCustAndCustOwnerPic">与客户合影照片（配偶）</li>' +
					'<li othername="peiFrontIDCardMPic">身份证正面照片（配偶）</li>' +
					'<li othername="peiBackIDCardMPic">身份证背面照片（配偶）</li>' +
					'<li othername="peiCardPic">借记卡</li>' +
					'<li othername="qitazhengming" class="qita-tanchuang-li">其他</li>' +
					'</ul>' +
					'</div>' +
					'</div>';
				$('.img_content').append(htmlText).trigger("create");

			}
			//监测下一步是否可点击
			var ind = 0;
			for(var i = 0; i < 4; i++) {
				if($('.customer:eq(' + i + ')').find("img").length == 2) {
					ind++;
					if(ind >= 4) {
						$('#smallLoan-cusPicture #btn_next').addClass('btn_next');
					} else {
						$('#smallLoan-cusPicture #btn_next').removeClass('btn_next');
					}

				}
			}
		}, function(err) {
			showMsg(err);
		})
	},
	reGetImg: function(curParentObj, imgSrc) { //重拍
		if(curParentObj.parent().hasClass('get-face')) {
			faceDistinguish('trans', function(returnGetMsg) {
				deletePhoto([imgSrc], function(returnDelMsg) {
					smallLoanImageAcquisition.imgSrc = returnGetMsg;
					curParentObj.find('.camera-pic').attr('src', returnGetMsg);
					$('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
				}, function(err) {

				})
			}, function(err) {
				showMsg('重拍失败');
			})
		} else {
			Meap.media('camera', curParentObj.attr('picname'), function(returnGetMsg) {
				creditJson.isPrev.LLDBisFromPrev = false;
				imgSrc = curParentObj.find('.camera-pic').attr('src');
				deletePhoto([imgSrc], function(returnDelMsg) {
					smallLoanImageAcquisition.imgSrc = returnGetMsg;
					curParentObj.find('.camera-pic').attr('src', returnGetMsg);
					$('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
				}, function(err) {})
			}, function(err) {
				showMsg('重拍失败');
			})
		}

	},
	reviewImg: function(imgSrc) { //拍照预览
		$('.bigpic-review').html('<img src=' + imgSrc + ' height="100%">');
		$('.bigpic-review-box').show().animate({
			opacity: '1'
		}, 200);
	},
	reviewImgClose: function() { //关闭拍照预览
		$('.bigpic-review-box').animate({
			opacity: '0'
		}, 200, function() {
			$('.bigpic-review-box').hide()
		});
	}
};
/*影像采集*/
$(document).on("pageshow", '#smallLoan-cusPicture', function() {
	//需要评分的流程变动
	if(smallLoan.IsNeedScore == false) {
		$('.circle-con').empty();
		//		$('#smallLoan-cusPicture #progress').removeClass('sixCurrent');
		//		$('#smallLoan-cusPicture #progress').addClass('sevenCurrent');
		$('.navigation-steps').removeClass('sevenCurrent');
		$('.navigation-steps').addClass('sixCurrent');
		$('#smallLoan-cusPicture #border-over').css('cssText', 'width:43% !important;');
		var textHtml = '';
		textHtml += '<li><div class="circle">1</div><p>产品选择</p></li>' +
			'<li><div class="circle">2</div><p>读取身份证</p></li>' +
			'<li><div class="circle">3</div><p>影像采集</p></li>' +
			'<li class="color-cc"><div class="circle1">4</div><p>信息录入</p></li>' +
			'<li class="color-cc"><div class="circle1">5</div><p>确认签名</p></li>' +
			'<li class="color-cc"><div class="circle1">6</div><p>完成</p></li>';
		$('.circle-con').html(textHtml);
	}
	if(smallLoan.isPicturePage || workbenchJson.isTemp) { //反显
		if(workbenchJson.isTemp) {
			smallLoanTempORpreToPic(workbenchJson.temp);
			workbenchJson.temp = {};
		}
		workbenchJson.isTemp = false;
		$('.img_content .camera-pic').remove();
		var imgArr = [];
		var imgTypeArr = [];
		imgArr = smallLoan.applicationObj.mPicFileARR;
		imgTypeArr = smallLoan.applicationObj.mPicFileMsgType;
		$.each(imgArr, function(index, el) {
			if(index < 4 && el) {
				$('.img_box:eq(' + index + ') .customer').find('.camera-pic').remove();
				$('.img_box:eq(' + index + ') .customer').append('<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">');
				$('.img_box:eq(' + index + ') .rephoto').text('重拍');
				$('.img_box:eq(' + index + ') .camera').hide();
			} else {
				if(!el) return true;
				var activeEn = imgTypeArr[index - 4];
				$('<div class="img_box" style="position: relative;">' +
					'<div class="customer customer_six" picName="' + activeEn + '">' +
					'<div class="rephoto">重拍</div>' +
					'<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/ style ="display:none">' +
					'<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">' +
					'</div>' +
					'<div class="img_notes qitazhengming" othername="qitazhengming">其他</div>' +
					'<div class="qita-tanchuang-cbg"></div>' +
					'<img src="../../images/crow_icon_win.png" class="crow_icon_win" />' +
					'<div class="qita-tanchuang-con">' +
					'<div class="queren-quxiao">' +
					'<div class="quxiao-ok quxiao-click">取消</div>' +
					'<div class="quxiao-ok queding-click">确定</div>' +
					'</div>' +
					'<ul class="qita-tanchuang-ul">' +
					'<li othername="peiFacePic">客户面部照片（配偶）</li>' +
					'<li othername="peiCustAndCustOwnerPic">与客户合影照片（配偶）</li>' +
					'<li othername="peiFrontIDCardMPic">身份证正面照片（配偶）</li>' +
					'<li othername="peiBackIDCardMPic">身份证背面照片（配偶）</li>' +
					'<li othername="peiCardPic">借记卡</li>' +
					'<li othername="qitazhengming" class="qita-tanchuang-li">其他</li>' +
					'</ul>' +
					'</div>' +
					'</div>').insertBefore('.img_box:last');
				var activeName = $('.img_box:last').find('li[othername="' + activeEn + '"]').text();
				$('.img_box:last').prev().find('.img_notes').attr('othername', activeEn).text(activeName);

			}
		});
		//监测下一步是否可点击
		var ind = 0;
		for(var i = 0; i < 4; i++) {
			if($('#smallLoan-cusPicture .customer:eq(' + i + ')').find("img").length == 2) {
				ind++;
				if(ind >= 4) {
					$('#smallLoan-cusPicture #btn_next').addClass('btn_next');
				} else {
					$('#smallLoan-cusPicture #btn_next').removeClass('btn_next');
				}
			}
		}
	} else if(commonJson.isCustermerInfoMultiplex) { //影像复用
		//$('.customer_four').attr('picname', 'F0001' + $('.customer_four').attr('picname'));
		//$('.customer_five').attr('picname', 'F0001' + $('.customer_five').attr('picname'));

		var CUSTANDCUSTOWNERPICBase64 = custermerInfo.custAndCustOwnerPic.replace(/\\/g, "").replace('data:image/png;base64,', '');
		var FRONTIDCARDPICBase64 = custermerInfo.frontIDCardPic.replace(/\\/g, "").replace('data:image/png;base64,', '');
		var BACKIDCARDPICBase64 = custermerInfo.backIDCardPic.replace(/\\/g, "").replace('data:image/png;base64,', '');

		//与客户合影base64转路径
		Meap.transFormImage(getYMDHMSM('custAndCustOwnerPic') + commonJson.udId, CUSTANDCUSTOWNERPICBase64, 'picSty', function(msg1) {
			$('.img_box:eq(1) .customer').append('<img src="' + msg1 + '" width="100%" height="115px" class="camera-pic">');
		}, function(err) {
			showMsg('与客户合影base64转路径失败');
		});
		//身份证正面base64转路径
		Meap.transFormImage(getYMDHMSM('frontIDCardMPic') + commonJson.udId, FRONTIDCARDPICBase64, 'picSty', function(msg2) {
			$('.img_box:eq(2) .customer').append('<img src="' + msg2 + '" width="100%" height="115px" class="camera-pic">');
		}, function(err) {
			showMsg('身份证正面base64转路径失败');
		});
		//身份证反面base64转路径
		Meap.transFormImage(getYMDHMSM('backIDCardMPic') + commonJson.udId, BACKIDCARDPICBase64, 'picSty', function(msg3) {
			$('.img_box:eq(3) .customer').append('<img src="' + msg3 + '" width="100%" height="115px" class="camera-pic">');

		}, function(err) {
			showMsg('身份证反面base64转路径失败');
		});
		$('.img_box:eq(1) .rephoto,.img_box:eq(2) .rephoto,.img_box:eq(3) .rephoto').text('重拍');
		$('.img_box:eq(1) .camera,.img_box:eq(2) .camera,.img_box:eq(3) .camera').hide();

	}
	//点击其他
	$('#smallLoan-cusPicture .conter-con').on('click', '.qitazhengming', function(ev) {
		if($('.qita-tanchuang-con').css('display') == 'none') {
			smallLoanImageAcquisition.curParentObj = $(this).siblings('.customer');
			$('.qita-tanchuang-ul').show().css('marginTop', '0');
			$(this).siblings('.qita-tanchuang-con').show();
			$(this).siblings('.crow_icon_win').show();
			$(this).siblings('.qita-tanchuang-cbg').show();
			var othername = $(this).attr('othername');
			$(this).siblings('.qita-tanchuang-con').find('li').removeClass('qita-tanchuang-li');
			$(this).siblings('.qita-tanchuang-con').find('li[othername=' + othername + ']').addClass('qita-tanchuang-li');
		}

	});
	$('#smallLoan-cusPicture .conter-con').on('click', '.qita-tanchuang-ul>li', function(ev) {
		$(this).addClass('qita-tanchuang-li').siblings('li').removeClass('qita-tanchuang-li');
	});
	$('#smallLoan-cusPicture .conter-con').on('click', '.quxiao-click', function(ev) { //点击取消关闭下拉框
		$('.qita-tanchuang-con').hide();
		$('.qita-tanchuang-cbg').hide();
		$('.crow_icon_win').hide();
	});
	$('#smallLoan-cusPicture .conter-con').on('click', '.queding-click', function(ev) { //点击确认选择
		$('.qita-tanchuang-con').hide();
		$('.qita-tanchuang-cbg').hide();
		$('.crow_icon_win').hide();
		var textHtml = $(this).closest('.qita-tanchuang-con').find('li.qita-tanchuang-li').html();
		var othername = $(this).closest('.qita-tanchuang-con').find('li.qita-tanchuang-li').attr('othername');
		$(this).closest('.qita-tanchuang-con').siblings('.qitazhengming').html(textHtml).attr('othername', othername);
		if(smallLoanImageAcquisition.curParentObj.attr('picname') != othername) {
			smallLoanImageAcquisition.curParentObj.attr('picname', othername);
			if(smallLoanImageAcquisition.curParentObj.find('.camera-pic').length > 0) {
				smallLoanImageAcquisition.imgSrc = smallLoanImageAcquisition.curParentObj.find('.camera-pic').attr('src');
				deletePhoto([smallLoanImageAcquisition.imgSrc], function(msg) {
					smallLoanImageAcquisition.curParentObj.find('.camera-pic').remove();
					smallLoanImageAcquisition.curParentObj.find('.camera').show();
					smallLoanImageAcquisition.curParentObj.find('.rephoto').html('选拍，可多张拍摄');
					//监测下一步是否可点击
					var ind = 0;
					for(var i = 0; i < 4; i++) {
						if($('#smallLoan-cusPicture .customer:eq(' + i + ')').find("img").length == 2) {
							ind++;
							if(ind >= 4) {
								$('#smallLoan-cusPicture #btn_next').addClass('btn_next');
							} else {
								$('#smallLoan-cusPicture #btn_next').removeClass('btn_next');
							}
						}
					}
				}, function(err) {

				})
			}
		}
	});
	$('#smallLoan-cusPicture .conter-con').on('click', '.customer', function(ev) {
		smallLoanImageAcquisition.curParentObj = $(this);
		smallLoanImageAcquisition.imgSrc = $(this).find('.camera-pic').attr('src');
		var oTarget = ev.target;
		if($(this).find('.rephoto').html() == '重拍') { //重拍
			if($(oTarget).hasClass('rephoto')) {
				smallLoanImageAcquisition.reGetImg(smallLoanImageAcquisition.curParentObj, smallLoanImageAcquisition.imgSrc);
			}
			if($(oTarget).hasClass('camera-pic')) { //预览大图
				smallLoanImageAcquisition.imgSrc = $(oTarget).attr('src');
				smallLoanImageAcquisition.reviewImg($(oTarget).attr('src'));
			}
			return;
		}
		//拍照
		if(smallLoanImageAcquisition.curParentObj.parent().hasClass('get-face')) {
			smallLoanImageAcquisition.getFace(smallLoanImageAcquisition.curParentObj);
		} else {
			smallLoanImageAcquisition.getImg(smallLoanImageAcquisition.curParentObj);
		}

	});
	//预览大图 点击关闭
	$('.bigpic-review-close').click(function(event) {
		smallLoanImageAcquisition.reviewImgClose();
	});
	//预览大图 删除图片
	$('.bigpic-review-del').click(function(event) {
		smallLoanImageAcquisition.delImg(smallLoanImageAcquisition.curParentObj, smallLoanImageAcquisition.imgSrc);
	});
	//预览大图 重新拍照
	$('.bigpic-review-rephone').click(function(event) {
		smallLoanImageAcquisition.reGetImg(smallLoanImageAcquisition.curParentObj, smallLoanImageAcquisition.imgSrc);
	});
	//点击暂存
	$('#smallLoan-cusPicture .customerP-zancun').on('click', function() {
		$(this).css('display', 'none');
		smallLoan.applicationObj.mPicFileARR = []; //要打包的影像路径
		smallLoan.applicationObj.mPicFileInfoARR = [{
			"b": []
		}]; //每个图片的名称和类型
		smallLoan.applicationObj.mPicFileMsgType = []; //其他图片对象的证明类型
		cachePictureLoan(smallLoan.applicationObj.mPicFileARR, smallLoan.applicationObj.mPicFileInfoARR, smallLoan.applicationObj.mPicFileMsgType, '#smallLoan-cusPicture')
		smallLoanZanCunPictureInfo('smallLoan-cusPicture.html');
		$.mobile.changePage('../main.html', {
			reverse: true
		});
	});
	//点击上一步，跳转页面
	//	$('.previous-con').on('click', function() {
	//		$.mobile.changePage('./smallLoan-readingID.html', {
	//			reverse: true
	//		});
	//	});//20160830删除上一步操作
	//点击下一步
	$('#btn_next').on('click', function() {
		if(!$(this).hasClass('btn_next')) return;

		if(!creditJson.isPrev.LLDBisFromPrev) { //后面返回已进行人脸对比
			smallLoan.isPicturePage = true;
			smallLoan.applicationObj.custFacePic = $('#smallLoan-cusPicture .img_box:eq(0) .camera-pic:eq(0)').attr('src'); //客户面部照片
			smallLoan.applicationObj.custAndCustOwnerPic = $('#smallLoan-cusPicture .img_box:eq(1) .camera-pic:eq(0)').attr('src'); //与客户合影照片
			smallLoan.applicationObj.frontIDCardPic = $('#smallLoan-cusPicture .img_box:eq(2) .camera-pic:eq(0)').attr('src'); //身份证正面
			smallLoan.applicationObj.backIDCardPic = $('#smallLoan-cusPicture .img_box:eq(3) .camera-pic:eq(0)').attr('src'); //身份证反面
			smallLoan.applicationObj.mPicFileARR = []; //要打包的影像路径
			smallLoan.applicationObj.mPicFileInfoARR = [{
				"b": []
			}]; //每个图片的名称和类型
			smallLoan.applicationObj.mPicFileMsgType = []; //其他图片对象的证明类型
			smallLoan.applicationObj.mPicFileARR.push(smallLoan.applicationObj.custFacePic, smallLoan.applicationObj.custAndCustOwnerPic, smallLoan.applicationObj.frontIDCardPic, smallLoan.applicationObj.backIDCardPic);
			var len = $('#smallLoan-cusPicture .img_box').length;
			if(len - 4 > 0) {
				for(var i = 4; i < len; i++) {
					if($('#smallLoan-cusPicture .img_box:eq(' + i + ') .camera-pic').length > 0) {
						smallLoan.applicationObj.mPicFileARR.push($('#smallLoan-cusPicture .img_box:eq(' + i + ') .camera-pic:eq(0)').attr('src'));
						smallLoan.applicationObj.mPicFileMsgType.push($('#smallLoan-cusPicture .img_box:eq(' + i + ') .camera-pic:eq(0)').closest('.customer').attr('picname'));
					}
				}
			}
			$.each(smallLoan.applicationObj.mPicFileARR, function(index, el) {
				if(!el) return true;
				var elIndex = el.lastIndexOf('\/') + 1;
				smallLoan.applicationObj.mPicFileInfoARR[0].b.push({
					FILE_NAME: el.substring(elIndex),
					FILE_TYPE: 'F0000'
				});
			});
			$.mobile.changePage('./smallLoan-personFace.html', {
				transition: "slide"
			});
		} else {
			$.mobile.changePage('./smallLoan-messageIn.html', {
				transition: "slide"
			});
		}
	})
});
/*人脸对比*/
$(document).on("pageshow", '#smallLoan-personFace', function() {
	if(smallLoan.IsNeedScore == false) {
		$('.circle-con').empty();
		$('.navigation-steps').removeClass('sevenCurrent');
		$('.navigation-steps').addClass('sixCurrent');
		$('#smallLoan-personFace #border-over').css('cssText', 'width:43% !important;');
		var textHtml = '';
		textHtml += '<li><div class="circle">1</div><p>产品选择</p></li>' +
			'<li><div class="circle">2</div><p>读取身份证</p></li>' +
			'<li><div class="circle">3</div><p>影像采集</p></li>' +
			'<li class="color-cc"><div class="circle1">4</div><p>信息录入</p></li>' +
			'<li class="color-cc"><div class="circle1">5</div><p>确认签名</p></li>' +
			'<li class="color-cc"><div class="circle1">6</div><p>完成</p></li>';
		$('.circle-con').html(textHtml);
	}
	$("#smallLoan-personFace .camera:eq(0)").attr('src', smallLoan.applicationObj.mPicFileARR[0]);
	$("#smallLoan-personFace .camera:eq(1)").attr('src', custermerInfo.image);
	$("#smallLoan-personFace .camera:eq(2)").attr('src', smallLoan.applicationObj.mPicFileARR[0]);
	if(lianwanghechaData.CheckResult == '09' || lianwanghechaData.CheckResult == '02') {
		$("#smallLoan-personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + custermerInfo.checkPhoto);
	} else {
		$("#smallLoan-personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + smallLoan.mInfo.lianPic);
	}
	//点击继续
	$('#smallLoan-personFace .previous:last').on('click', function() {

		if($(this).hasClass('btn_next')) {
			var faceRecogn = '';
			if($("#smallLoan-personFace .face-result:eq(0)").text() == '通过' && $("#smallLoan-personFace .face-result:eq(1)").text() == '通过') {
				faceRecogn = '1'; //自动通过
			} else {
				faceRecogn = '5'; //手动通过
			}
			smallLoan.faceRecogn = faceRecogn;
			creditJson.isPrev.LLDBisFromPrev = true;
			$.mobile.changePage('smallLoan-messageIn.html');
		}
	});
	//点击F放弃
	$('#smallLoan-personFace .previous:first').on('click', function() {
		creditJson.isPrev.LLDBisFromPrev = false;
		smallLoan.faceRecogn = '6'; //手动不通过
		$.mobile.changePage('smallLoan-cusPicture.html', {
			reverse: true
		});
	});

	ifacelRecognitionSeMGFun(smallLoan.applicationObj.mPicFileARR[0], custermerInfo, smallLoan);

});
/*贷款信息录入界面*/
$(document).on("pageshow", '#smallLoan-messageIn', function() {
	if(smallLoan.IsNeedScore == false) {
		$('.circle-con').empty();
		$('.navigation-steps').removeClass('sevenCurrent');
		$('.navigation-steps').addClass('sixCurrent');
		$('#smallLoan-messageIn #border-over').css('cssText', 'width:59% !important;');
		var textHtml = '';
		textHtml += '<li><div class="circle">1</div><p>产品选择</p></li>' +
			'<li><div class="circle">2</div><p>读取身份证</p></li>' +
			'<li><div class="circle">3</div><p>影像采集</p></li>' +
			'<li><div class="circle">4</div><p>信息录入</p></li>' +
			'<li class="color-cc"><div class="circle1">5</div><p>确认签名</p></li>' +
			'<li class="color-cc"><div class="circle1">6</div><p>完成</p></li>';
		$('.circle-con').html(textHtml);
	}

	if(smallLoan.businessType == '2') {
		$(".newcolumn").show();
		//		$(".paymentmothod-div option:eq(1)").text("按月");
		//		console.log('按月');
		//		$(".paymentmothod-div option:eq(2)").text("按季");
		var textHtml = '<option value=""></option><option value="1">按月</option><option value="2">按季</option><option value="3">其他</option>';
		$("#paymentMethod").html(textHtml).trigger('create');
	} else {
		$("#smallLoan-unitopentime").attr('disabled', 'disabled'); //单位经营时间
		$("#smallLoan-houseproperty").attr('disabled', 'disabled'); //房产情况
		$("#ismateagree").attr('disabled', 'disabled'); //配偶是否同意签字
		$("#canofferguarantee").attr('disabled', 'disabled'); //能够提供担保人
	}

	if(smallLoan.messageCache || workbenchJson.isTemp) {
		if(workbenchJson.isTemp) {
			smallLoanTempORpreToObject(workbenchJson.temp);
		}
		workbenchJson.isTemp = false;
		if(smallLoan.issPlace && smallLoan.issPlace != 0) {
			$("#smallLoan-addrName").attr('disabled', 'disabled').closest('.fm-item').css('display', 'none'); //地区名称
			$("#smallLoan-addr").attr('disabled', 'disabled').closest('.fm-item').css('display', 'none'); //签发地区名称
			$("#smallLoan-zipcode").attr('disabled', 'disabled').closest('.fm-item').css('display', 'none'); //签发地区名称

		} else {
			$("#smallLoan-addrName").val(smallLoan.addrName); //地区名称
			$("#smallLoan-addr").html(smallLoan.addrAll).val(smallLoan.addrCode).selectmenu('refresh'); //签发地区名称
			$("#smallLoan-zipcode").val(smallLoan.zipcode); //邮编
		}

		$("#smallLoan-mobile").val(telNum(smallLoan.mobile)); //手机号码
		//$("#smallLoan-zipcode").val(smallLoan.zipcode);//邮编
		if(!smallLoan.day_b) {
			$("#day_b").val("").selectmenu('refresh');
			$("#day_c").val("").selectmenu('refresh').attr('disabled', 'disabled');
			$("#smallLoan-addr-home").val(smallLoan.addrHome); //经营地址详细地址
		} else {
			$("#day_b").val(smallLoan.day_b).selectmenu('refresh'); //经营地址省份
			$("#day_c").val(smallLoan.day_c).selectmenu('refresh'); //经营地址市
			$("#smallLoan-addr-home").val(smallLoan.addrHome); //经营地址详细地址
		}
		if(!smallLoan.s_city) {
			$("#s_city").val("").selectmenu('refresh');
			$("#s_county").val("").selectmenu('refresh').attr('disabled', 'disabled');
			$("#smallLoan-addr-detail").val(smallLoan.addrDetail); //居住地址详细地址
		} else {
			$("#s_county").val(smallLoan.s_county).selectmenu('refresh'); //居住地址省份
			$("#s_city").val(smallLoan.s_city).selectmenu('refresh'); //居住地址市
			$("#smallLoan-addr-detail").val(smallLoan.addrDetail); //居住地址详细地址
		}

		$('#smallLoan-name').text(custermerInfo.name);
		$('#smallLoan-sex').text(custermerInfo.sex);
		$('#smallLoan-cerTime').text(custermerInfo.cerExpdDt.split('-')[1]);
		$('#smallLoan-cerNo').text(custermerInfo.cerNO);
		$("#smallLoan-marriage").val(smallLoan.marriage).selectmenu('refresh'); //婚姻状况
		$("#smallLoan-occup").val(smallLoan.occup).selectmenu('refresh'); //职位
		$("#smallLoan-com-name").val(smallLoan.companyName); //工作单位
		$("#ZhiWu").val(smallLoan.ZhiWu).selectmenu('refresh'); //职务
		$("#smallLoan-income").val(fmoney(smallLoan.income, 2)); //月收入
		$("#smallLoan-f-income").val(fmoney(smallLoan.familyIncome, 2)); //家庭月收入
		if(smallLoan.spouseId && smallLoan.spouseId != 0) {
			$("#smallLoan-peiName").val(smallLoan.peiName).attr('disabled', 'disabled'); //配偶姓名
			$("#smallLoan-peiPhone").val(telNum(smallLoan.peiPhone)).attr('disabled', 'disabled'); //配偶手机号码
			$("#smallLoan-peiCerNo").val(smallLoan.peiCerNo).attr('disabled', 'disabled'); //配偶证件号码
			$("#smallLoan-peiCompany").val(smallLoan.peiCompany).attr('disabled', 'disabled'); //配偶工作单位
		} else {
			$("#smallLoan-peiName").val(smallLoan.peiName); //配偶姓名
			$("#smallLoan-peiPhone").val(telNum(smallLoan.peiPhone)); //配偶手机号码
			$("#smallLoan-peiCerNo").val(smallLoan.peiCerNo); //配偶证件号码
			$("#smallLoan-peiCompany").val(smallLoan.peiCompany); //配偶工作单位
		}

		$("#smallLoan-unitopentime").val(smallLoan.unitopentime); //单位经营时间
		$("#smallLoan-houseproperty").val(smallLoan.houseproperty).selectmenu('refresh'); //房产状况
		$("#ismateagree").val(smallLoan.ismateagree).selectmenu('refresh'); //配偶是否同意签字
		$("#canofferguarantee").val(smallLoan.canofferguarantee).selectmenu('refresh'); //是否可提供担保人
		$("#smallLoan-loanMoney").val(fmoney(smallLoan.loanMoney)); //贷款金额
		$("#smallLoan-loanTime").val(smallLoan.loanTime); //贷款期限
		$("#paymentMethod").val(smallLoan.paymentMethod).selectmenu('refresh'); //还款方式
		$("#smallLoan-loanUse").val(smallLoan.loanUse); //贷款用途
	} else {
		$('#smallLoan-name').text(custermerInfo.name);
		$('#smallLoan-sex').text(custermerInfo.sex);
		$('#smallLoan-cerTime').text(custermerInfo.cerExpdDt.split('-')[1]);
		$('#smallLoan-cerNo').text(custermerInfo.cerNO);
		IEstablishCustomerInformationServiceSmallLoanSucc();
	}

	//左侧菜单切换
	$(".navigation>li").on("click", function() {
		if($(this).hasClass('credit-card-show')) {
			return;
		}
		var navigation = $('.navigation li').index($(this));
		$(this).addClass("change-bg").siblings("li").removeClass("change-bg");
		$('.information-input ul').eq(navigation).addClass('credit-card-show').siblings('ul').removeClass('credit-card-show');
	});
	$('#smallLoan-mobile').on('blur', function() {
		$('#smallLoan-mobile').val(telNum($('#smallLoan-mobile').val()));
	});
	$('#smallLoan-mobile').on('tap', function() {
		$('#smallLoan-mobile').val(removeSpace($('#smallLoan-mobile').val()));
	});
	$('#smallLoan-peiPhone').on('blur', function() {
		$('#smallLoan-peiPhone').val(telNum($('#smallLoan-peiPhone').val()));
	});
	$('#smallLoan-peiPhone').on('tap', function() {
		$('#smallLoan-peiPhone').val(removeSpace($('#smallLoan-peiPhone').val()));
	});
	$('#smallLoan-income').on('tap', function() {
		var _val = $(this).val();
		$(this).val(rmoney(_val));
	})
	$('#smallLoan-income').on('blur', function() {
		var _val = $(this).val().replace(/[^0-9\.]/ig, "");
		if(_val.toString().length > 10) {
			showMsg('金额长度包含小数点不能超过10位！');
			$(this).val('');
			return;
		}
		$(this).val(fmoney(_val));
	})
	$('#smallLoan-f-income').on('tap', function() {
		var _val = $(this).val();
		$(this).val(rmoney(_val))
	})
	$('#smallLoan-f-income').on('blur', function() {
		var _val = $(this).val().replace(/[^0-9\.]/ig, "");
		if(_val.toString().length > 10) {
			showMsg('金额长度包含小数点不能超过10位！');
			$(this).val('');
			return;
		}
		$(this).val(fmoney(_val));
	})
	$('#smallLoan-loanMoney').on('tap', function() {
		var _val = $(this).val();
		$(this).val(rmoney(_val));
	})
	$('#smallLoan-loanMoney').on('blur', function() {
		var _val = $(this).val().replace(/[^0-9\.]/g, "");
		if(!_val) {
			$(this).val('');
			return;
		}
		if(!/^\d+000$/.test(_val)) {
			showMsg('贷款额度应为千整位！');
			$(this).val('');
			return;
		}
		if(parseInt(smallLoan.fixedAmount) < _val || _val < parseInt(smallLoan.minAmount)) {
			showMsg('贷款额度应在' + smallLoan.minAmount + '~' + smallLoan.fixedAmount + '元之间！');
			$(this).val('');
			return;
		}
		$(this).val(fmoney(_val))
	})
	$("#smallLoan-loanTime").on('blur', function() {
		var _val = $(this).val().replace(/\D/g, "");
		if(!_val) {
			$(this).val('');
			return;
		}
		if(parseInt(smallLoan.fixedTerms) < _val || _val < parseInt(smallLoan.minTerms)) {
			showMsg('贷款期限应在' + smallLoan.minTerms + '~' + smallLoan.fixedTerms + '月之间！');
			$(this).val('');
			return;
		}
		$(this).val(_val);
	})
	$("#smallLoan-addr-detail").on('blur', function() {
		if(!$(this).val()) {
			var s_county = $.trim($("#s_county").val()) || '福田区'; //居住地址区
			$("#s_city").html('<option value="深圳市">深圳市</option>').val('深圳市').selectmenu('refresh');
			$("#s_county").html(' <option value="福田区">福田区</option><option value="罗湖区">罗湖区</option><option value="南山区">南山区</option><option value="宝安区">宝安区</option><option value="龙岗区">龙岗区</option><option value="盐田区">盐田区</option><option value="龙华新区">龙华新区</option><option value="光明新区">光明新区</option><option value="大鹏新区">大鹏新区</option><option value="坪山新区">坪山新区</option>').val(s_county).selectmenu('refresh').removeAttr('disabled');
		}
	})
	$("#smallLoan-addr-home").on('blur', function() {
			if(!$(this).val()) {
				var day_c = $.trim($("#day_c").val()) || '福田区'; //居住地址区
				$("#day_b").html('<option value="深圳市">深圳市</option>').val('深圳市').selectmenu('refresh');
				$("#day_c").html(' <option value="福田区">福田区</option><option value="罗湖区">罗湖区</option><option value="南山区">南山区</option><option value="宝安区">宝安区</option><option value="龙岗区">龙岗区</option><option value="盐田区">盐田区</option><option value="龙华新区">龙华新区</option><option value="光明新区">光明新区</option><option value="大鹏新区">大鹏新区</option><option value="坪山新区">坪山新区</option>').val(day_c).selectmenu('refresh').removeAttr('disabled');
			}
		})
		//户籍返显到详细地址
	$("#hujifangxian1").click(function() {
		$("#smallLoan-addr-detail").val(custermerInfo.address);
		$("#s_city").val("").selectmenu('refresh').attr('disabled', 'disabled');
		$("#s_county").val("").selectmenu('refresh').attr('disabled', 'disabled');
	});
	//定位返显到详细地址
	$("#shishidingwei1").click(function() {
		Meap.getCurrentLocationAddress("", function(msg) {
			msg = JSON.parse(msg);
			$("#smallLoan-addr-detail").val(msg.FormattedAddressLines[0]);
			$("#s_city").val("").selectmenu('refresh').attr('disabled', 'disabled');
			$("#s_county").val("").selectmenu('refresh').attr('disabled', 'disabled');
		}, function(err) {
			showMsg(err);
		});
	});
	//失去焦点 发请求匹配签发地区
	$("#smallLoan-addrName").on('blur', function() {
			$("#smallLoan-addr").val('').html('').selectmenu('refresh');
			var city = $(this).val();
			if(city == "") return;
			sloanIfrp005ServicePSucc(city);
		})
		//户籍返显到详细地址
	$("#hujifangxian").click(function() {
		$("#smallLoan-addr-home").val(custermerInfo.address);
		$("#day_b").val("").selectmenu('refresh').attr('disabled', 'disabled');
		$("#day_c").val("").selectmenu('refresh').attr('disabled', 'disabled');
	});
	//定位返显到详细地址
	$("#shishidingwei").click(function() {
		Meap.getCurrentLocationAddress("", function(msg) {
			msg = JSON.parse(msg);
			$("#smallLoan-addr-home").val(msg.FormattedAddressLines[0]);
			$("#day_b").val("").selectmenu('refresh').attr('disabled', 'disabled');
			$("#day_c").val("").selectmenu('refresh').attr('disabled', 'disabled');
		}, function(err) {
			showMsg(err);
		});
	});

	//点击暂存
	$('#smallLoan-messageIn .zancun').on('click', function() {
		$(this).css('display', 'none');
		cacheSmallLoan();
		smallLoanZanCunCustermerInfo();
		$.mobile.changePage('../main.html', {
			reverse: true
		});
	});
	//点击上一步，跳转页面
	$('.previous-con').on('click', function() {
		smallLoan.messageCache = true; //信息缓存
		cacheSmallLoan();
		$.mobile.changePage('smallLoan-cusPicture.html', {
			reverse: true
		});
	});
	//点击下一步
	$('#ms_btn_next').on('click', function() {
		//if (!$(this).hasClass('btn_next')) return;
		////是否为空验证
		var num = 0; //纪录为空或者格式不正确的个数
		$('#smallLoan-messageIn .conter-con input[type="text"]:not(:disabled)').each(function(index, el) {
			//配偶的不必填
			if(/^smallLoan-pei/.test($(this).attr('id')) && (!$('#smallLoan-marriage option:selected[value *=2]').length)) {
				return true;
			}

			var eqIndex = $(this).closest('.info-enter-item').index();
			if($.trim($(this).val()) == '') {
				num++;
				$(this).closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
				$(this).closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
				if(!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
					$('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
				}
				return true;
			} else {
				$(this).closest('.info-enter-item').removeClass('info-enter-error-bd'); //错误字段点亮 父级区域
				$(this).closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
				if($(this).closest('.info-enter-item').find('.fm-item-error').length == 0) {
					$('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
				}
			}
		});
		$('#smallLoan-messageIn select:not(:disabled)').each(function(index, el) {
			var eqIndex = $(this).closest('.info-enter-item').index();
			if(!$(this).val()) {
				num++;
				$(this).closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
				$(this).closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
				if(!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
					$('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
				}
			} else {
				$(this).closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
				if($(this).closest('.info-enter-item').find('.fm-item-error').length == 0) { //如果父级区域没有错误字段
					$('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
				}
			}
		});
		if(num > 0) {
			showMsg('必填项不能为空！');
			return;
		}
		//格式验证
		$('#smallLoan-messageIn .conter-con input[type="text"][reg]:not(:disabled)').each(function(index, el) {

			var reg = $(this).attr('reg');
			var eqIndex = $(this).closest('.info-enter-item').index();

			if($(this).val() && !(fmReg[reg].test($.trim($(this).val().replace(/\s+/g, ''))))) {
				num++;
				$(this).closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
				$(this).closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
				if(!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
					$('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
				}
			} else {
				$(this).closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
				if($(this).closest('.info-enter-item').find('.fm-item-error').length == 0) { //如果父级区域没有错误字段
					$('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
				}
			}
		});
		if(num > 0) {
			showMsg('请填写正确格式！');
			return;
		}

		if(rmoney($("#smallLoan-income").val()) > rmoney($("#smallLoan-f-income").val())) {
			var eqIndex = $("#smallLoan-income").closest('.info-enter-item').index();
			$("#smallLoan-income").closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
			$("#smallLoan-income").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
			$("#smallLoan-f-income").closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
			$("#smallLoan-f-income").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
			if(!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
				$('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
			}
			showMsg('月收入不能大于家庭月收入！');
			return;
		} else {
			var eqIndex = $("#smallLoan-income").closest('.info-enter-item').index();
			$("#smallLoan-income").closest('.info-enter-item').removeClass('info-enter-error-bd'); //错误字段点亮 父级区域
			$("#smallLoan-income").closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
			$("#smallLoan-f-income").closest('.info-enter-item').removeClass('info-enter-error-bd'); //错误字段点亮 父级区域
			$("#smallLoan-f-income").closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
			if($('.navigation li:eq(' + eqIndex + ')').find('.fm-item-error').length == 0) {
				$('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
			}
		}
		if(!$("#day_b").val()) {
			if(checkAs400ChineseLength($("#smallLoan-addr-home").val()) >= 60) {
				showTags({
					'title': '提示',
					'content': "经营地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}
			if($("#smallLoan-addr-home").val().length >= 30) {
				showTags({
					'title': '提示',
					'content': "经营地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}
		} else {

			if(checkAs400ChineseLength($("#day_b").val() + $("#day_c").val() + $("#smallLoan-addr-home").val()) >= 60) {
				showTags({
					'title': '提示',
					'content': "经营地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}
			if($("#smallLoan-addr-home").val().length + $("#day_b").val().length + $("#day_c").val().length >= 30) {
				showTags({
					'title': '提示',
					'content': "经营地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}

		}
		if(!$("#s_city").val()) {
			if(checkAs400ChineseLength($("#smallLoan-addr-detail").val()) >= 60) {
				showTags({
					'title': '提示',
					'content': "居住地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}
			if($("#smallLoan-addr-detail").val().length >= 30) {
				showTags({
					'title': '提示',
					'content': "居住地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}
		} else {

			if(checkAs400ChineseLength($("#s_city").val() + $("#s_county").val() + $("#smallLoan-addr-detail").val()) >= 60) {
				showTags({
					'title': '提示',
					'content': "居住地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}
			if($("#smallLoan-addr-detail").val().length + $("#s_city").val().length + $("#s_county").val().length >= 30) {
				showTags({
					'title': '提示',
					'content': "居住地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}

		}
		smallLoan.messageCache = true; //信息缓存
		cacheSmallLoan();

		$.mobile.changePage('smallLoan-cusConfirm.html', {
			transition: "slide"
		});
	});
});

/*贷款信息确认界面*/
$(document).on('pageshow', '#smallLoan-cusConfirm', function() {
	//	console.log(smallLoan.SCORE_CARD_ID);
	//	console.log(smallLoan.smallLoanScorePdfObjon);
	if(smallLoan.IsNeedScore == false) {
		$('.circle-con').empty();
		$('.navigation-steps').removeClass('sevenCurrent');
		$('.navigation-steps').addClass('sixCurrent');
		$('#smallLoan-cusConfirm #border-over').css('cssText', 'width:76% !important;');
		var textHtml = '';
		textHtml += '<li><div class="circle">1</div><p>产品选择</p></li>' +
			'<li><div class="circle">2</div><p>读取身份证</p></li>' +
			'<li><div class="circle">3</div><p>影像采集</p></li>' +
			'<li><div class="circle">4</div><p>信息录入</p></li>' +
			'<li><div class="circle">5</div><p>确认签名</p></li>' +
			'<li class="color-cc"><div class="circle1">6</div><p>完成</p></li>';
		$('.circle-con').html(textHtml);
	}
	smallLoan.USER_NO = '';
	//	if(smallLoan.signature === false) { //申请表页面返回不请空
	//		smallLoan.fillListArr = [];
	//		smallLoan.zhengxinArr = [];
	//	}

	if(smallLoan.businessType == '2') { //存在共借人/担保人的流程显示以下字段
		$(".newcolumn").show();
		$("#smallLoan-unitopentime").text(smallLoan.unitopentime); //单位经营时间
		$("#smallLoan-houseproperty").text(smallLoanhoueproperty[smallLoan.houseproperty]); //房产情况
		$("#ismateagree").text(yesOrNoJson[smallLoan.ismateagree]); //配偶是否同意签字
		$("#canofferguarantee").text(yesOrNoJson[smallLoan.canofferguarantee]); //能够提供担保人
	}

	smallLoan.platGlobalSeq = undefined;
	smallLoan.hasYZM = smallLoan.hasQM = false;

	$('#smallLoan-name').text(custermerInfo.name);
	$('#smallLoan-cerNo').text(custermerInfo.cerNO);
	$("#smallLoan-mobile").text(smallLoan.mobile); //手机号码
	$("#smallLoan-addr-home").text(smallLoan.day_b ? (smallLoan.day_b + smallLoan.day_c + smallLoan.addrHome) : smallLoan.addrHome); //经营地址详细地址
	$("#smallLoan-addr-detail").text(smallLoan.s_city ? (smallLoan.s_city + smallLoan.s_county + smallLoan.addrDetail) : smallLoan.addrDetail); //居住地址详细地址
	$("#smallLoan-marriage").text(smallLoanMarriage[smallLoan.marriage]); //婚姻状况
	$("#smallLoan-com-name").text(smallLoan.companyName); //工作单位
	$("#ZhiWu").text(smallLoanHeadShip[smallLoan.ZhiWu]); //职务
	$("#smallLoan-income").text(fmoney(smallLoan.income)); //月收入
	$("#smallLoan-f-income").text(fmoney(smallLoan.familyIncome)); //家庭月收入
	$("#smallLoan-peiName").text(smallLoan.peiName); //配偶手机号码smallLoan.peiName
	$("#smallLoan-peiCerNo").text(smallLoan.peiCerNo); //配偶证件号码

	$("#smallLoan-loanMoney").text(fmoney(smallLoan.loanMoney)); //贷款金额
	$("#smallLoan-loanTime").text(smallLoan.loanTime); //贷款期限
	if(smallLoan.businessType == '2') {
		$("#paymentMethod").text(smallLoanPaymentMethodTwo[smallLoan.paymentMethod]); //还款方式
	} else {
		$("#paymentMethod").text(smallLoanPaymentMethod[smallLoan.paymentMethod]); //还款方式
	}

	$("#smallLoan-loanUse").text(smallLoan.loanUse); //贷款用途
	$('#smallLoan-proName').text(smallLoan.proName);
	//	$('#ismateagree').text(yesOrNoJson[smallLoan.ismateagree]);
	//	$("#canofferguarantee").text(yesOrNoJson[smallLoan.canofferguarantee]);
	//	$("#smallLoan-unitopentime").text(smallLoan.unitopentime);
	//	$("#smallLoan-houseproperty").text(smallLoanhoueproperty[smallLoan.houseproperty]);

	//点击修改按钮
	$('#smallLoan-cusConfirm .basic_header .reWrite').on('click', function() {
		if(smallLoan.codeTime) {
			clearInterval(smallLoan.codeTime);
		}
		smallLoan.signHref = '';
		$.mobile.changePage('./smallLoan-messageIn.html', {
			reverse: true
		});
	});

	//初始化签名方法
	signature.init({
		div: $('#qianM'), //签名容器
		finishBtn: $("#qianOK"), //完成签名按钮
		clearBtn: $("#clear-botton"), //清除签名按钮
		lineColor: '#000000', //线条颜色
		lineWidth: 3, //线条粗细
		finish: function(data) { //签名完成回调函数
			//将签名的str转成路径
			smallLoan.signHref = data.replace('data:image/png;base64,', '');
			if($('#qianOK #ic_agree').css('display') == 'none') {
				$('.qianM_shadow').show();
				$('#qianOK #ic_disagree').hide();
				$('#qianOK #ic_agree').show();
				$('#qianOK').attr('qmImg', data.replace('data:image/png;base64,', ''));
				$("#clear-botton").css("color", "#CCCCCC");
				smallLoan.hasQM = true;
			} else {
				smallLoan.hasQM = false;
				$('.qianM_shadow').hide();
				$('#qianOK #ic_disagree').show();
				$('#qianOK #ic_agree').hide();
				$("#clear-botton").css("color", "#0F45A7");
			}
		}
	});
	if(smallLoan.signature && smallLoan.signHref) {
		smallLoan.signature = false;
		$('.ic_down').trigger('click');
		$('#qianOK #ic_agree').show();
		$('#qianOK #ic_disagree').hide();
		$('.qianM_shadow').show();
		$("#clear-botton").css("color", "#CCCCCC");
		smallLoan.hasQM = true;
		var img = new Image();
		img.src = 'data:image/png;base64,' + smallLoan.signHref;
		img.onload = function() {
			signature.addPic(img);
		}
	}
	//获取短信验证码
	$('#getMsg').on('click', function() {
		if($(this).hasClass('cannt-click')) {
			return;
		} else {
			$(this).addClass('cannt-click');
		}
		if(smallLoan.codeTime) {
			clearInterval(smallLoan.codeTime);
		}
		$('#inp').val('');
		$('.codetime').html('请在<span style="color:red;">80秒</span>内输入验证码');
		$('.codetime').show();
		//获取验证码
		getImessageAuthentionServiceFun(smallLoan, smallLoan.codeTime, function() {
			smallLoan.hasYZM = true;
			var num = 80; //设置验证码有效定时器
			smallLoan.codeTime = setInterval(function() {
				num--;
				$('.codetime').html('请在<span style="color:red;">' + num + '秒</span>内输入验证码');
				if(num <= 0) {
					clearInterval(smallLoan.codeTime);
					$('#getMsg').removeClass('cannt-click').text('重新获取');
					$('.codetime').html('请在<span style="color:red;">0秒</span>内输入验证码');
					smallLoan.hasYZM = false;
					$('#inp').removeAttr('disabled').val('');
					smallLoan.USER_NO = "";
				}
			}, 1000);
		});
	});

	//点击查看征信文件
	$('.linkClick a:eq(0)').on('click', function() {
		showLoader("征信报告查询中...");
		var inquiryDate = dateGetYMD(30); //查询30天内的征信文件
		var sendJson = {
			"b": [{
				"deviceNo.s": commonJson.udId, //设备编号
				"moduleId.s": loan.moduleId, //模块编号
				"tranId.s": loan.tranId, //交易编号
				"orgId.s": commonJson.orgId, //机构号
				"operatorNo.s": commonJson.adminCount, //操作员
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"inquiryDateMin.s": dateYYYYMMDD(inquiryDate[1]), //申请日期开始
				"inquiryDateMax.s": dateYYYYMMDD(inquiryDate[0]), //申请日期结束
				"name.s": custermerInfo.name, //姓名
				"certNum.s": custermerInfo.cerNO, //证件号码
				"status.s": '1,3', //状态(成功和不需查询征信报告)
				"page.s": '', //页码
				"username.s": '',
				'creditType.s': '', //征信类型
				'supplementInd.s': '' //是否允许补查
			}]
		};
		findCreditReportInquiryFun(sendJson, function(msg) {
			smallLoanFindCreditReportInquirySucc(msg);
		}, function(err) {
			hideLoader();
			funFail(err);
		});
	});
	//点击选择征信文件页面  放弃按钮
	$('.searchCredit a:first').on('click', function() {
		$(".searchCredit").hide();
	});
	//点击选择征信文件页面  确认按钮
	$('.searchCredit a:last').on('click', function() {
		if(!$(this).hasClass('btn_next')) {
			return;
		}
		smallLoan.zhengxinArr = [];
		$('.searchCredit ul>li[sel=true]').each(function(index, ele) {
			var creditInfo = $(ele).data('creditInfo');
			if(creditInfo.creditReferPath) {
				$.each(creditInfo.creditReferPath.split(';'), function(index, path) {
					smallLoan.zhengxinArr.push(path);
				});
			}
			smallLoan.zhengxinArr.push(creditInfo.accredit); //征信授权书
		});
		$(".searchCredit").hide();
	});
	//点击查看征信报告
	$('.searchCredit ul').delegate('u', 'tap', function() {
		smallLoan.creditInfo = $(this).closest('li').data('creditInfo');
		smallLoan.creditReferPath = smallLoan.creditInfo.creditReferPath;
		openCreditReportFile(smallLoan, 'F0005');
	});
	//点击查看银行对账单
	$('.linkClick a:eq(1)').on('click', function() {
		showLoader("对账单查询中...");
		var inquiryDate = dateGetYMD(30); //查询30天的对账单文件
		var sendJson = {
			"b": [{
				"deviceNo.s": commonJson.udId, //设备编号
				"moduleId.s": smallLoan.moduleId, //模块编号
				"tranId.s": smallLoan.tranId, //交易编号
				"orgId.s": commonJson.orgId, //机构号
				"operatorNo.s": commonJson.adminCount, //操作员
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"inquiryDateMin.s": dateYYYYMMDD(inquiryDate[1]), //查询日期时间
				"inquiryDateMax.s": dateYYYYMMDD(inquiryDate[0]), //查询日期时间
				"name.s": custermerInfo.name, //姓名
				"certNum.s": custermerInfo.cerNO, //证件号码
				"account.s": '', //账号
				"status.s": '1', //状态
				"page.s": '' //页码
			}]
		};
		findStatementConF(sendJson, smallLoanFindStatementMainSucc);
	});
	//点击选择对账单页面  放弃按钮
	$('.searchBank a:first').on('click', function() {
		$(".searchBank").hide();
	});
	//点击选择对账单页面  确认按钮
	$('.searchBank a:last').on('click', function() {
		if(!$(this).hasClass('btn_next')) {
			return;
		}
		smallLoan.fillListArr = [];
		$('.searchBank ul>li[sel=true]').each(function(index, val) {
			smallLoan.fillListArr.push($(val).attr('creditReferPath'));
		});
		$(".searchBank").hide();
	});
	$('.searchBank ul').delegate('u', 'tap', function() {
		smallLoan.creditReferPath = $(this).closest('li').attr('creditReferPath');
		getFileDataAndOpen(smallLoan, 'F0010');
	});
	//点击。。。。
	$('.linkClick a:eq(2)').on('click', function() {
		smallLoan.signature = true;
		if(smallLoan.businessType == '1') {
			$.mobile.changePage('smallLoan-list.html');
		} else {
			$.mobile.changePage('smallLoan-list2.html');
		}

	});
	$('#closeSearchBank').on('click', function() {
		$(".searchBank").hide();
	});
	$('#closeZhengxinwenjian').on('click', function() {
		$(".zhengxinwenjian").hide();
	});
	$('#btn_next').on('click', function() {
		// if (!$(this).hasClass('btn_next')) {
		//     return;
		// }
		if(smallLoan.USER_NO === '' || !(smallLoan.hasYZM)) {
			showMsg('请点击获取短信验证码!');
			return;
		}
		smallLoan.msgInfo = $('#smallLoan-cusConfirm #inp').val();
		if(!(fmReg.pwD6.test(smallLoan.msgInfo))) {
			showMsg('请输入正确格式的短信验证码!');
			return;
		}
		if(!(smallLoan.hasQM)) {
			showMsg('请确认签名!');
			return;
		}
		if(smallLoan.codeTime) {
			clearInterval(smallLoan.codeTime);
			smallLoan.hasYZM = false;
			$('#getMsg').removeClass('cannt-click').text('重新获取');
			$('.codetime').html('请在<span style="color:red;">0秒</span>内输入验证码');
			$('#inp').removeAttr('disabled').val('');
		}
		showLoader('短信验证码验证中...');
		ckeckImessageAuthentionServiceYFun(smallLoan, sloanCkeckImessageAuthentionServiceYFun);
	});
});

/*贷款表-无共借人/担保人情形*/
$(document).on('pageshow', '#smallLoan-list', function() {
	$('.header a:first').on('click', function() {
		$.mobile.changePage('smallLoan-cusConfirm.html', {
			reverse: true
		});
	});
	$('#smallLoan-proName').text(smallLoan.proName);
	$('#smallLoan-name').text(custermerInfo.name);
	$('#smallLoan-cerNo').text(custermerInfo.cerNO);
	$("#smallLoan-mobile").text(smallLoan.mobile); //手机号码
	$("#smallLoan-addr-home").text(smallLoan.day_b ? (smallLoan.day_b + smallLoan.day_c + smallLoan.addrHome) : smallLoan.addrHome); //经营地址详细地址
	$("#smallLoan-addr-detail").text(smallLoan.s_city ? (smallLoan.s_city + smallLoan.s_county + smallLoan.addrDetail) : smallLoan.addrDetail); //居住地址详细地址
	if(smallLoan.marriage == '10' || smallLoan.marriage == '30') {
		$("#smallLoan-marriage").find('input[value=10]').attr('checked', 'true');; //婚姻状况
	} else if(smallLoan.marriage == '40') {
		$("#smallLoan-marriage").find('input[value=40]').attr('checked', 'true');; //婚姻状况
	} else {
		$("#smallLoan-marriage").find('input[value=20]').attr('checked', 'true');; //婚姻状况
	}

	$("#smallLoan-companyName").text(smallLoan.companyName); //工作单位
	$("#ZhiWu").text(smallLoanHeadShip[smallLoan.ZhiWu]); //职务
	$("#smallLoan-income").text(fmoney(smallLoan.income) + '元'); //月收入
	$("#smallLoan-f-income").text(fmoney(smallLoan.familyIncome) + '元'); //家庭月收入
	$("#smallLoan-peiName").text(smallLoan.peiName); //配偶手机号码smallLoan.peiName
	$("#smallLoan-peiCerNo").text(smallLoan.peiCerNo); //配偶证件号码
	$("#smallLoan-peiCompany").text(smallLoan.peiCompany); //配偶
	$("#smallLoan-peiPhone").text(smallLoan.peiPhone); //配偶

	$("#smallLoan-loanMoney").text(fmoney(smallLoan.loanMoney) + '元'); //贷款金额
	$("#smallLoan-loanTime").text(smallLoan.loanTime + '月'); //贷款期限
	$("#smallLoan-fixedAmount").text(smallLoan.fixedAmount / 10000); //最大贷款金额
	$("#smallLoan-fixedTerms").text(smallLoan.fixedTerms); //最大贷款期限
	$("#paymentMethod").find('input[value=' + smallLoan.paymentMethod + ']').attr('checked', 'true'); //还款方式
	$("#smallLoan-loanUse").text(smallLoan.loanUse); //贷款用途
	$("#admin").text(commonJson.adminCount); //jingli
	$("#adminName").text(commonJson.TLRNAME); //jingli
	$(".year").text(appTime.appCurDate('&').split('&')[0]); //年
	$(".month").text(appTime.appCurDate('&').split('&')[1]); //月
	$(".day").text(appTime.appCurDate('&').split('&')[2]); //日
	if(smallLoan.signHref) {
		var img = new Image();
		img.src = 'data:image/png;base64,' + smallLoan.signHref;
		img.style.maxWidth = '100%';
		$("#smallLoan-signImg").append(img);
	}

});

/*贷款申请表预览-有共借人/担保人情形*/
$(document).on('pageshow', '#smallLoan-list2', function() {
	$('.header a:first').on('click', function() {
		$.mobile.changePage('smallLoan-cusConfirm.html', {
			reverse: true
		});
	});
	$("#smallLoan-proName").text(smallLoan.proName); //贷款产品名
	$("#smallLoan-name").text(custermerInfo.name); //客户姓名
	$("#customerage").text(calculateage(custermerInfo.cerNO)); //客户年龄
	$("#smallLoan-mobile").text(smallLoan.mobile); //客户手机
	$("#smallLoan-companyName").text(smallLoan.companyName); //借款企业名称
	$("#smallLoan-unitopentime").text(smallLoan.unitopentime + '年'); //单位经营时间
	$("#smallLoan-addr-home").text(smallLoan.day_b ? (smallLoan.day_b + smallLoan.day_c + smallLoan.addrHome) : smallLoan.addrHome); //经营地址详细地址
	if(smallLoan.houseproperty) {
		$("#smallLoan-houseproperty").find('input[value=' + smallLoan.houseproperty + ']').attr('checked', 'true'); //房产类型
	}
	if(smallLoan.marriage == '10' || smallLoan.marriage == '30') {
		$("#smallLoan-marriage").find('input[value=10]').attr('checked', 'true');; //婚姻状况
	} else if(smallLoan.marriage == '40') {
		$("#smallLoan-marriage").find('input[value=40]').attr('checked', 'true');; //婚姻状况
	} else {
		$("#smallLoan-marriage").find('input[value=20]').attr('checked', 'true');; //婚姻状况
	}
	if(smallLoan.ismateagree) {
		$("#ismateagree").find('input[value=' + smallLoan.ismateagree + ']').attr('checked', 'true'); //配偶是否同意签字
	}
	$("#smallLoan-loanMoney").text(fmoney(smallLoan.loanMoney / 10000) + '万元'); //贷款金额
	$("#smallLoan-loanTime").text(smallLoan.loanTime + '月'); //贷款期限
	$("#smallLoan-loanUse").text(smallLoan.loanUse); //贷款用途
	if(smallLoan.paymentMethod) {
		$("#paymentMethod").find('input[value=' + smallLoan.paymentMethod + ']').attr('checked', 'true'); //还款方式
	}
	smallLoan.canofferguarantee && $("#canofferguarantee").find('input[value=' + smallLoan.canofferguarantee + ']').attr('checked', 'true'); //是否能提供担保人
	$(".year").text(appTime.appCurDate('&').split('&')[0]); //年
	$(".month").text(appTime.appCurDate('&').split('&')[1]); //月
	$(".day").text(appTime.appCurDate('&').split('&')[2]); //日

	$("#admin").text(commonJson.adminCount); //客户经理
	$("#adminName").text(commonJson.TLRNAME); //客户经理

	if(smallLoan.signHref) {
		var img = new Image();
		img.src = 'data:image/png;base64,' + smallLoan.signHref;
		img.style.maxWidth = '100%';
		$("#smallLoan-signImg").append(img);
	}
	$("#cerNo").text(custermerInfo.cerNO); //客户身份证
});

/*贷款信息完成界面*/
$(document).on('pageshow', '#smallLoan-complete', function() {
	if(smallLoan.IsNeedScore == false) {
		$('.circle-con').empty();
		$('.navigation-steps').removeClass('sevenCurrent');
		$('.navigation-steps').addClass('sixCurrent');
		$('#smallLoan-complete #border-over').css('cssText', 'width:85.2% !important;');
		var textHtml = '';
		textHtml += '<li><div class="circle">1</div><p>产品选择</p></li>' +
			'<li><div class="circle">2</div><p>读取身份证</p></li>' +
			'<li><div class="circle">3</div><p>影像采集</p></li>' +
			'<li><div class="circle">4</div><p>信息录入</p></li>' +
			'<li><div class="circle">5</div><p>确认签名</p></li>' +
			'<li><div class="circle">6</div><p>完成</p></li>';
		$('.circle-con').html(textHtml);
	}
	$('.name_cn').text(custermerInfo.name); //申请人姓名
	$('.zheng_num').text(custermerInfo.cerNO); //证件号码
	$('.phone_num').text(smallLoan.mobile); //手机号码
	$('.loan_money').text(fmoney(smallLoan.loanMoney)); //贷款金额
	$('.loan_time').text(smallLoan.loanTime); //贷款期限
	$('#cm_btn_next').on('click', function() {
		$.mobile.changePage('../main.html', {
			reverse: true
		});
	})
});

//初始化字段
function initVariable() {
	smallLoan.filePath = '';
	smallLoan.zhengxinArr = [];
	smallLoan.fillListArr = [];
	commonJson.longitude = ''; //经度
	commonJson.latitude = ''; //纬度
	smallLoan.issPlace = false; //签发地区初始为空
	smallLoan.isRead = false;
	smallLoan.messageCache = false; //信息录入缓存
	smallLoan.isPicturePage = false; //图片缓存
	creditJson.isPrev.LLDBisFromPrev = false; //如果点击了继续或者从信息录入页面返回 则下次不用进入两两对比页面 否则都是要进入两两对比
	custermerInfo = {};
	smallLoan.addrName = ''; //地区名称
	smallLoan.addr = ''; //签发地区名称
	smallLoan.mobile = ''; //手机号码
	smallLoan.zipcode = ''; //邮编
	smallLoan.day_b = ''; //经营地址市
	smallLoan.day_c = ''; //经营地址区
	smallLoan.addrHome = ''; //经营地址详细地址
	smallLoan.s_city = ''; //居住地址市
	smallLoan.s_county = ''; //居住地址区
	smallLoan.addrDetail = ''; //居住地址详细地址
	smallLoan.marriage = ''; //婚姻状况
	smallLoan.occup = ''; //职位
	smallLoan.companyName = ''; //工作单位
	smallLoan.ZhiWu = ''; //职务
	smallLoan.income = ''; //月收入
	smallLoan.familyIncome = ''; //家庭月收入
	smallLoan.peiPhone = ''; //配偶手机号码
	smallLoan.peiName = ''; //配偶姓名
	smallLoan.peiCerNo = ''; //配偶证件号码
	smallLoan.peiCompany = ''; //配偶工作单位
	smallLoan.loanMoney = ''; //贷款金额
	smallLoan.loanTime = ''; //贷款期限
	smallLoan.paymentMethod = ''; //还款方式
	smallLoan.loanUse = ''; //贷款用途
	workbenchJson.isTemp = false;
	smallLoan.customerId = ''; //客户ID
	smallLoan.spouseId = ''; //客户ID
	smallLoan.branchId = ''; //
	commonJson.isCustermerInfoMultiplex = false;
	smallLoan.signature = false;
	smallLoan.signHref = '';
	//新增评分卡字段的初始化
	smallLoan.SCORE_CARD_ID = '';
	smallLoan.smallLoanScorePdfObjon = [];
	//	smallLoan.businessType = '';//新增业务类型
	smallLoan.ismateagree = ''; //配偶是否同意签字
	smallLoan.canofferguarantee = ''; //能否提供担保人
	smallLoan.houseproperty = ''; //房产状况
	smallLoan.unitopentime = ''; //单位经营时间
}
//缓存或暂存
function cacheSmallLoan() {
	smallLoan.addrName = $.trim($("#smallLoan-addrName").val()); //地区名称
	smallLoan.addrAll = $.trim($("#smallLoan-addr").html()); //签发地区所有选项
	smallLoan.addrCode = $.trim($("#smallLoan-addr").val()); //签发地区名称
	smallLoan.addr = $.trim($("#smallLoan-addr option:selected").text()); //签发地区名称
	smallLoan.mobile = removeSpace($('#smallLoan-mobile').val()); //手机号码
	smallLoan.zipcode = $.trim($("#smallLoan-zipcode").val()); //邮编
	smallLoan.day_b = $.trim($("#day_b").val()); //经营地址市
	smallLoan.day_c = $.trim($("#day_c").val()); //经营地址区
	smallLoan.addrHome = $.trim($("#smallLoan-addr-home").val()); //经营地址详细地址
	smallLoan.s_city = $.trim($("#s_city").val()); //居住地址市
	smallLoan.s_county = $.trim($("#s_county").val()); //居住地址区
	smallLoan.addrDetail = $.trim($("#smallLoan-addr-detail").val()); //居住地址详细地址
	smallLoan.marriage = $.trim($("#smallLoan-marriage").val()); //婚姻状况
	smallLoan.occup = $.trim($("#smallLoan-occup").val()); //职位
	smallLoan.companyName = $.trim($("#smallLoan-com-name").val()); //工作单位
	smallLoan.ZhiWu = $.trim($("#ZhiWu").val()); //职务
	smallLoan.income = rmoney($("#smallLoan-income").val()); //月收入
	smallLoan.familyIncome = rmoney($("#smallLoan-f-income").val()); //家庭月收入
	smallLoan.peiName = $.trim($("#smallLoan-peiName").val()); //配偶姓名
	smallLoan.peiPhone = removeSpace($('#smallLoan-peiPhone').val()); //配偶手机号码
	smallLoan.peiCerNo = $.trim($("#smallLoan-peiCerNo").val()); //配偶证件号码
	smallLoan.peiCompany = $.trim($("#smallLoan-peiCompany").val()); //配偶工作单位
	smallLoan.loanMoney = $.trim(rmoney($("#smallLoan-loanMoney").val())); //贷款金额
	smallLoan.loanTime = $.trim($("#smallLoan-loanTime").val()); //贷款期限
	smallLoan.paymentMethod = $.trim($("#paymentMethod").val()); //还款方式
	smallLoan.loanUse = $.trim($("#smallLoan-loanUse").val()); //贷款用途
	smallLoan.ismateagree = $.trim($("#ismateagree").val()); //配偶是否同意签字
	smallLoan.canofferguarantee = $.trim($("#canofferguarantee").val()); //是否提供担保人
	smallLoan.unitopentime = $.trim($("#smallLoan-unitopentime").val()); //单位经营时间
	smallLoan.houseproperty = $.trim($("#smallLoan-houseproperty").val()); //房产情况
}
//图片界面点击暂存
function smallLoanZanCunPictureInfo(TEMPFROM) {
	var sendDataJson = {
		"databaseName": "myDatabase",
		"tableName": "loanapply_info",
		"data": [{
			'proCODE': smallLoan.prodCode, //产品代买
			'proType': smallLoan.applyTo,
			'mCLIENT_NO': smallLoan.CLIENT_NO, //客户号
			'BUSINESSTYPE': '申请小微贷款', //
			'TEMPFROM': TEMPFROM,
			'YWXS': smallLoan.proName, //业务线索
			'SUBMITTIME': myTime.CurTime(),
			'isPicturePage': smallLoan.isPicturePage,
			'mCheckResult': lianwanghechaData.CheckResult, //联网核查
			//基础的
			'mfaceRecogn': smallLoan.faceRecogn,
			'offlineOnline': commonJson.offlineOnline, //脱机/联机
			'workAddress': commonJson.workAddress, //工作地址
			'moduleId': smallLoan.moduleId, //模块编号
			'tranId': smallLoan.tranId, //交易编号
			'operatorNo': commonJson.adminCount, //操作员
			'deviceNo': commonJson.udId, //设备编号
			'orgId': commonJson.orgId,
			//主身份证信息
			'mNation': custermerInfo.nation, //
			'mcerNo': custermerInfo.cerNO,
			'maddress': custermerInfo.address,
			'mname': custermerInfo.name,
			'mcerExpdDt': custermerInfo.cerExpdDt,
			'mbirthday': custermerInfo.birthday,
			'msex': custermerInfo.sex,
			'missAuthority': custermerInfo.issAuthority,
			'mimage': custermerInfo.image,

			//主影像
			"mcustFacePic": smallLoan.applicationObj.mPicFileARR[0], //客户面部照片
			"mcustAndCustOwnerPic": smallLoan.applicationObj.mPicFileARR[1], //与客户合影照片
			"mfrontIDCardPic": smallLoan.applicationObj.mPicFileARR[2], //身份证正面
			"mbackIDCardPic": smallLoan.applicationObj.mPicFileARR[3], //身份证反面
			"mpicFileARR": smallLoan.applicationObj.mPicFileARR.join("&&"), //要打包的影像路径
			"mpicFileInfoARR": JSON.stringify(smallLoan.applicationObj.mPicFileInfoARR), //每个图片的名称和类型
			"mpicFileMsgType": smallLoan.applicationObj.mPicFileMsgType.join("&&"), //其他图片对象的证明类型
			"mcheckPhoto": smallLoan.mInfo.lianPic, //联网核查图片

			//评分卡新增参数
			'REMARK11': smallLoan.SCORE_CARD_ID, //评分卡编号
			'REMARK12': JSON.stringify(smallLoan.smallLoanScorePdfObjon), //评分卡上送pdf所需参数

			'REMARK13': commonJson.isCustermerInfoMultiplex, //
			'REMARK1': commonJson.longitude, //经度
			'REMARK2': commonJson.latitude, //纬度
			'REMARK3': smallLoan.fixedAmount, //最大额度
			'REMARK4': smallLoan.fixedTerms, //最大期限
			'REMARK14': smallLoan.minAmount, //最小额度
			'REMARK15': smallLoan.minTerms, //最小期限
			'REMARK20': smallLoan.businessType //交易类型

		}]
	};
	insertTableData(sendDataJson, function(msg) {
		initVariable();
	}, function(err) {
		showMsg('存储个人信息失败' + msg);
	});
}
//信息录入页面点击暂存
function smallLoanZanCunCustermerInfo() {
	var sendDataJson = {
		"databaseName": "myDatabase",
		"tableName": "loanapply_info",
		"data": [{
			//'organCode': '',
			//'modifiable': '',
			'proCODE': smallLoan.prodCode, //产品代买
			'proType': smallLoan.applyTo,
			//'isInputChange': '',  //字段变化
			'gisTrue': creditJson.isPrev.LLDBisFromPrev, //联网核查结果
			'mCLIENT_NO': smallLoan.CLIENT_NO, //客户号
			'BUSINESSTYPE': '申请小微贷款', //
			'TEMPFROM': 'smallLoan-messageIn.html',
			'YWXS': smallLoan.proName, //业务线索
			'SUBMITTIME': myTime.CurTime(),
			'mCheckResult': lianwanghechaData.CheckResult, //联网核查
			'isPicturePage': smallLoan.isPicturePage,
			//基础的
			'mfaceRecogn': smallLoan.faceRecogn,
			'offlineOnline': commonJson.offlineOnline, //脱机/联机
			'workAddress': commonJson.workAddress, //工作地址
			'moduleId': smallLoan.moduleId, //模块编号
			'tranId': smallLoan.tranId, //交易编号
			'operatorNo': commonJson.adminCount, //操作员
			'deviceNo': commonJson.udId, //设备编号
			'orgId': commonJson.orgId,
			//主身份证信息
			'mNation': custermerInfo.nation, //
			'mcerNo': custermerInfo.cerNO,
			'maddress': custermerInfo.address,
			'mname': custermerInfo.name,
			'mcerExpdDt': custermerInfo.cerExpdDt,
			'mbirthday': custermerInfo.birthday,
			'msex': custermerInfo.sex,
			'missAuthority': custermerInfo.issAuthority,
			'mimage': custermerInfo.image,

			//主影像
			"mcustFacePic": smallLoan.applicationObj.mPicFileARR[0], //客户面部照片
			"mcustAndCustOwnerPic": smallLoan.applicationObj.mPicFileARR[1], //与客户合影照片
			"mfrontIDCardPic": smallLoan.applicationObj.mPicFileARR[2], //身份证正面
			"mbackIDCardPic": smallLoan.applicationObj.mPicFileARR[3], //身份证反面
			"mpicFileARR": smallLoan.applicationObj.mPicFileARR.join("&&"), //要打包的影像路径
			"mpicFileInfoARR": JSON.stringify(smallLoan.applicationObj.mPicFileInfoARR), //每个图片的名称和类型
			"mpicFileMsgType": smallLoan.applicationObj.mPicFileMsgType.join("&&"), //其他图片对象的证明类型
			"mcheckPhoto": smallLoan.mInfo.lianPic, //联网核查图片

			//输入的字段
			'maritalStatus': smallLoan.marriage,

			'corporation': smallLoan.companyName,
			'headship': smallLoan.occup,

			'cellphone': smallLoan.mobile,
			'dwellingZip': smallLoan.zipcode,
			'dwellingAddr': smallLoan.addrHome, //经营地址
			'mailingAddr': smallLoan.addrDetail, //居住地址
			'REMARK16': smallLoan.day_b,
			'REMARK17': smallLoan.day_c,
			'REMARK18': smallLoan.s_city,
			'REMARK19': smallLoan.s_county,
			'income': smallLoan.income, //月收入

			'consortCellphone': smallLoan.peiPhone, //配偶电话
			'consortIncome': smallLoan.familyIncome, //家月收入
			'peiHeadship': smallLoan.peiCompany, //配偶工作单位

			'gcerNo': smallLoan.peiCerNo, //配偶证件号码
			'gname': smallLoan.peiName, //配偶名称

			'buildingFuMoney': smallLoan.loanMoney, //借款金额
			'buildingFuTime': smallLoan.loanTime, //借款期限
			'buildingType': smallLoan.paymentMethod, //还款方式
			'buildingExplain': smallLoan.loanUse, //还款计划说明

			'uploadTime': '', //本地上传时间
			//未显示在页面上的上传字段
			'country': '', //国籍

			'industry': smallLoan.ZhiWu, //职务

			//评分卡新增参数
			'REMARK11': smallLoan.SCORE_CARD_ID, //评分卡编号
			'REMARK12': JSON.stringify(smallLoan.smallLoanScorePdfObjon), //评分卡上送pdf所需参数

			'hadHouseArea': smallLoan.addrCode, //地区名称
			'buildingAddr': smallLoan.addrName, //签发地区
			'REMARK1': commonJson.longitude, //经度
			'REMARK2': commonJson.latitude, //纬度

			'REMARK13': commonJson.isCustermerInfoMultiplex, //
			'REMARK8': smallLoan.addrAll, //签发地区全部
			'REMARK9': smallLoan.issPlace, //签发地区判断用
			'REMARK10': smallLoan.branchId, //jigouhao
			//'REMARK5': smallLoan.canBuildCustomer,//是否新建小贷信息
			'REMARK6': smallLoan.customerId, //客户id
			'REMARK7': smallLoan.spouseId, //配偶id
			'REMARK3': smallLoan.fixedAmount, //最大额度
			'REMARK4': smallLoan.fixedTerms, //最大期限
			'REMARK14': smallLoan.minAmount, //最小额度
			'REMARK15': smallLoan.minTerms, //最小期限
			'REMARK20': smallLoan.businessType, //交易类型 1-无共借人/担保人 2-有
			'REMARK21': smallLoan.ismateagree, //配偶同意签字 0-否 1-是
			'REMARK22': smallLoan.canofferguarantee, //能否提供担保人 0-否 1是
			'REMARK23': smallLoan.unitopentime, //单位经营时间
			'REMARK24': smallLoan.houseproperty //房产情况
		}]
	};

	insertTableData(sendDataJson, function(msg) {
		initVariable();
	}, function(err) {
		showMsg('存储个人信息失败' + msg);
	});
}
//暂存回到拍摄页面
function smallLoanTempORpreToPic(obj) {
	initVariable();
	commonJson.longitude = obj.REMARK1; //经度
	commonJson.latitude = obj.REMARK2; //纬度
	smallLoan.fixedAmount = obj.REMARK3; //最大额度
	smallLoan.fixedTerms = obj.REMARK4; //最大期限
	smallLoan.minAmount = obj.REMARK14; //最小额度
	smallLoan.minTerms = obj.REMARK15; //最小期限
	custermerInfo.nation = obj.mNation; //
	custermerInfo.cerNO = obj.mcerNo;
	custermerInfo.address = obj.maddress;
	custermerInfo.name = obj.mname;
	custermerInfo.cerExpdDt = obj.mcerExpdDt;
	custermerInfo.birthday = obj.mbirthday;
	custermerInfo.sex = obj.msex;
	custermerInfo.issAuthority = obj.missAuthority;
	custermerInfo.image = MT_path + obj.mimage.substring(obj.mimage.lastIndexOf('\/') + 1);
	smallLoan.applicationObj.mPicFileARR = obj.mpicFileARR.split('&&'); //要打包的影像路径
	smallLoan.applicationObj.mPicFileInfoARR = JSON.parse(obj.mpicFileInfoARR);
	smallLoan.applicationObj.mPicFileMsgType = obj.mpicFileMsgType.split('&&');
	smallLoan.mInfo.lianPic = obj.mcheckPhoto;
	lianwanghechaData.CheckResult = obj.mCheckResult;
	smallLoan.faceRecogn = obj.mfaceRecogn;
	smallLoan.prodCode = obj.proCODE; //产品代买
	smallLoan.applyTo = obj.proType;
	smallLoan.proName = obj.YWXS;
	commonJson.isCustermerInfoMultiplex = obj.REMARK13; //
	smallLoan.CLIENT_NO = obj.mCLIENT_NO; //客户号
	smallLoan.SCORE_CARD_ID = obj.REMARK11;
	smallLoan.smallLoanScorePdfObjon = JSON.parse(obj.REMARK12);
	smallLoan.businessType = obj.REMARK20;

	for(var k = 0; k < smallLoan.applicationObj.mPicFileARR.length; k++) {
		if(smallLoan.applicationObj.mPicFileARR[k] != '') {
			var elIndex = smallLoan.applicationObj.mPicFileARR[k].lastIndexOf('\/') + 1;
			var fileName = smallLoan.applicationObj.mPicFileARR[k].substring(elIndex);
			smallLoan.applicationObj.mPicFileARR[k] = MT_path + fileName;
		} else {
			smallLoan.applicationObj.mPicFileARR[k] = '';
		}
	}
}
//暂存回到信息录入页面
function smallLoanTempORpreToObject(obj) {
	initVariable();
	commonJson.longitude = obj.REMARK1; //经度
	commonJson.latitude = obj.REMARK2; //纬度
	smallLoan.fixedAmount = obj.REMARK3; //最大额度
	smallLoan.fixedTerms = obj.REMARK4; //最大期限
	smallLoan.minAmount = obj.REMARK14; //最小额度
	smallLoan.minTerms = obj.REMARK15; //最小期限
	smallLoan.day_b = obj.REMARK16;
	smallLoan.day_c = obj.REMARK17;
	smallLoan.s_city = obj.REMARK18;
	smallLoan.s_county = obj.REMARK19;
	custermerInfo.nation = obj.mNation; //
	custermerInfo.cerNO = obj.mcerNo;
	custermerInfo.address = obj.maddress;
	custermerInfo.name = obj.mname;
	custermerInfo.cerExpdDt = obj.mcerExpdDt;
	custermerInfo.birthday = obj.mbirthday;
	custermerInfo.sex = obj.msex;
	custermerInfo.issAuthority = obj.missAuthority;
	custermerInfo.image = MT_path + obj.mimage.substring(obj.mimage.lastIndexOf('\/') + 1);
	smallLoan.applicationObj.mPicFileARR = obj.mpicFileARR.split('&&'); //要打包的影像路径
	smallLoan.applicationObj.mPicFileInfoARR = JSON.parse(obj.mpicFileInfoARR);
	smallLoan.applicationObj.mPicFileMsgType = obj.mpicFileMsgType.split('&&');
	smallLoan.mInfo.lianPic = obj.mcheckPhoto;
	lianwanghechaData.CheckResult = obj.mCheckResult;
	smallLoan.faceRecogn = obj.mfaceRecogn;
	creditJson.isPrev.LLDBisFromPrev = obj.gisTrue; //联网核查结果
	smallLoan.SCORE_CARD_ID = obj.REMARK11; //小贷评分卡ID
	smallLoan.smallLoanScorePdfObjon = JSON.parse(obj.REMARK12); //评分卡里面填写的参数

	for(var k = 0; k < smallLoan.applicationObj.mPicFileARR.length; k++) {
		if(smallLoan.applicationObj.mPicFileARR[k] != '') {
			var elIndex = smallLoan.applicationObj.mPicFileARR[k].lastIndexOf('\/') + 1;
			var fileName = smallLoan.applicationObj.mPicFileARR[k].substring(elIndex);
			smallLoan.applicationObj.mPicFileARR[k] = MT_path + fileName;
		} else {
			smallLoan.applicationObj.mPicFileARR[k] = '';
		}
	}
	smallLoan.marriage = obj.maritalStatus;
	smallLoan.CLIENT_NO = obj.mCLIENT_NO; //客户号
	smallLoan.companyName = obj.corporation;
	smallLoan.occup = obj.headship;

	smallLoan.mobile = obj.cellphone;
	smallLoan.zipcode = obj.dwellingZip;
	smallLoan.addrHome = obj.dwellingAddr;
	smallLoan.addrDetail = obj.mailingAddr;
	smallLoan.prodCode = obj.proCODE; //产品代买
	smallLoan.applyTo = obj.proType;
	smallLoan.income = obj.income; //月收入
	smallLoan.peiPhone = obj.consortCellphone;
	smallLoan.familyIncome = obj.consortIncome; //家月收入
	smallLoan.peiCompany = obj.peiHeadship; //配偶工作单位
	smallLoan.peiCerNo = obj.gcerNo; //证件号码
	smallLoan.peiName = obj.gname; //配偶名称
	smallLoan.loanMoney = obj.buildingFuMoney; //借款金额
	smallLoan.loanTime = obj.buildingFuTime; //借款期限
	smallLoan.paymentMethod = obj.buildingType; //还款方式
	smallLoan.loanUse = obj.buildingExplain; //还款计划说明
	//'country': '',//国籍
	smallLoan.ZhiWu = obj.industry; //职务
	smallLoan.addrCode = obj.hadHouseArea; //地区名称
	smallLoan.addrName = obj.buildingAddr; //签发地区
	smallLoan.addrAll = obj.REMARK8; //签发地区全部
	smallLoan.isPicturePage = obj.isPicturePage;
	smallLoan.issPlace = obj.REMARK9;
	//smallLoan.canBuildCustomer = obj.REMARK5;//是否新建小贷信息
	smallLoan.customerId = obj.REMARK6 || ''; //客户id
	smallLoan.spouseId = obj.REMARK7 || ''; //配偶id
	smallLoan.branchId = obj.REMARK10 || ''; //jigouhao
	smallLoan.proName = obj.YWXS;
	commonJson.isCustermerInfoMultiplex = obj.REMARK13; //
	smallLoan.businessType = obj.REMARK20;
	smallLoan.ismateagree = obj.REMARK21;
	smallLoan.canofferguarantee = obj.REMARK22;
	smallLoan.unitopentime = obj.REMARK23;
	smallLoan.houseproperty = obj.REMARK20;
}

//贷款资料补充页面
$(document).on('pageshow', '#smallLoan-queryProcess', function() {
	if(commonJson.tinyLoanUserId == '') {
		showTags({
			'title': '提示',
			'content': '小贷用户ID不存在,无权办理小微贷款业务,请到后端管理台配置！',
			'ok': {
				fun: function() {
					$.mobile.changePage('../main.html');
				}
			}
		});
		return;
	}
	$("#kehuname").val('');
	$("#zhengjiannumber").val('');
	$("#loupanname").val('');
	$("#jieshuDate").val(appTime.appCurDate('-'));
	$("#kaishiDate").val(appTime.appPreDate('-', 1000 * 60 * 60 * 24 * 10));

	$(".seach-botton").on("click", function() { //搜索按钮
		$("#jieshuDate").val(appTime.appCurDate('-'));
		$("#kaishiDate").val(appTime.appPreDate('-', 1000 * 60 * 60 * 24 * 10));
		$("#kehuname").val('');
		$("#zhengjiannumber").val('');
		$("#loupanname").val('');
		$("#seach-day-con").show();
		$('#daikuan_name_sousuo').val('');
		$('#banlijindu').val('').selectmenu('refresh');
	});
	$(".fangqi-seach").eq(0).on("click", function() { //点击隐藏现搜索框
		$("#seach-day-con").hide();
	});
	daikuanapplicationObj.numIndex = '';
	daikuanapplicationObj.responseCode = '';
	var pageNum, timeStart, timeEnd;

	timeEnd = appTime.appCurDate('/'); //当前时间
	timeStart = appTime.appPreDate('/', 1000 * 60 * 60 * 24 * 10);

	findApplicationFunSuss(1, timeStart, timeEnd);

	//点击按照姓名查询
	$("#daikuan_img_sousuo").on("click", function() {
		daikuanapplicationObj.numIndex = '';
		daikuanapplicationObj.responseCode = '';
		var cusName = $("#daikuan_name_sousuo").val();
		if(cusName == "" || !fmReg.cnName.test(cusName)) {
			showMsg(fmRegMsg.cnName);
			return;
		}
		findApplicationFunSuss(1, '', '', $.trim($('#daikuan_name_sousuo').val()));
	});
	//按名字搜索----点击键盘回车按钮
	$("#daikuan_name_sousuo").on("keydown", function(eve) {
		daikuanapplicationObj.numIndex = '';
		daikuanapplicationObj.responseCode = '';
		var keyCode = eve.keyCode;
		if(keyCode == '13') {
			var cusName = $(this).val();
			if(cusName == "" || !fmReg.cnName.test(cusName)) {
				showMsg(fmRegMsg.cnName);
				return;
			}
			findApplicationFunSuss(1, '', '', $.trim($('#daikuan_name_sousuo').val()));
		}
	});

	//点击搜素按钮按条件搜索
	$('#smallLoan-queryProcess .fangqi-seach').eq(1).on('click', function() {
		//获取要查询的时间
		if($('#kaishiDate').val() == '' || $('#jieshuDate').val() == '') {
			showTags({
				'title': '提示',
				'content': '申请日期不能为空！',
				'ok': {}
			});
			return;
		}
		daikuanapplicationObj.numIndex = '';
		daikuanapplicationObj.responseCode = '';
		timeStart = $('#kaishiDate').val().replace(/-/g, '/');
		var timeCompareE = $('#jieshuDate').val().split('-');
		timeEnd = $('#jieshuDate').val().replace(/-/g, '/');
		var timeCompareS = appTime.suiDate(timeCompareE[0], timeCompareE[1], timeCompareE[2], '', 1000 * 60 * 60 * 24 * 30);
		if(timeStart.replace(/\//g, '') < timeCompareS) {
			showTags({
				'title': '提示',
				'content': '起止日期不可超过30天！',
				'ok': {}
			});
			return;
		}
		//验证时间
		if(timeEnd.replace(/\//g, '') < timeStart.replace(/\//g, '')) {
			showTags({
				'title': '提示',
				'content': '起始日期不能大于终止日期！',
				'ok': {}
			});
			return;
		}
		if($("#zhengjiannumber").val() == '') {

		} else {
			//验证身份证
			if(!(fmReg.cerNo.test($('.input-test-con').eq(1).val()))) {
				showMsg('您输入的证件号码有误，请重新输入！');
				$("#zhengjiannumber").val('');
				return false;
			}
		}
		$("#seach-day-con").hide();
		findApplicationFunSuss(1, timeStart, timeEnd, $.trim($('#kehuname').val()), $.trim($("#zhengjiannumber").val()), $("#banlijindu").val());
	});

	//点击补充资料按钮
	$("#daikuan_bucongziliao").on("click", function() {
		if(!($(this).hasClass('btn_next'))) return;
		if($('.queryProcess-con').find('.list-bgcolor')) {
			daikuanapplicationObj.numIndex = ($('#queryProcess-con').find('.list-bgcolor').index()) - 1;
		}
		$.mobile.changePage('smallLoan-addData.html');
	});

});

$(document).on("pageshow", '#smallLoan-addData', function() {
	var busiInfo = (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0];
	$('.additional-materials-left li').eq(2).find('span').text(busiInfo.NAME); //申请人
	$('.additional-materials-left li').eq(3).find('span').text(busiInfo.UNIFIED_ID); //身份证
	//var CREATEDATE = ((daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].APPLICATION_TIME.split('-')[0]) + '年' + ((daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].APPLICATION_TIME.split('-')[1]) + '月' + ((daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].APPLICATION_TIME.split('-')[2]) + '日';
	$('.additional-materials-left li').eq(4).find('span').text(busiInfo.APPLICATION_TIME); //申请 日期
	$('.additional-materials-left li').eq(5).find('span').text(busiInfo.LOAN_AMOUNT);
	$("#bendiwenjian_con").removeClass("bendiwenjian_class");
	daikuanapplicationObj.custFileArr = [];
	daikuanapplicationObj.zhengxinArr = [];
	daikuanapplicationObj.fillListArr = [];
	var imgSwiper = new Swiper('.img-swiper-container', {
		pagination: '.swiper-pagination',
		observer: true
			//pagination : '#swiper-pagination1',
	});
	var imgWrapperCon = $('#swiper-wrapper-con');
	var opvObj = $('#c-edu');
	//初始化清空图片缓存
	opvObj.find('option').each(function(i, d) {
		var _opv = $(d).attr('value');
		TempCache.removeCache('img_' + _opv);
	});
	opvObj.on('change', function() {
		var opV = $(this).val();
		var htmlTemp = TempCache.getCache('img_' + opV);
		if(htmlTemp && htmlTemp != undefined) {
			imgWrapperCon.html(htmlTemp);
			setTimeout(function() {
				imgSwiper.slideTo(0, 0, false)
			}, 200)
		} else {
			//当前选项没有图片时清空
			imgWrapperCon.html('');
		}
	})

	function imgNumber() {
		//计算图片数量
		var opVObj = $('#c-edu option:selected');
		var imgNum = imgWrapperCon.children('.swiper-slide').length;
		var _num = opVObj.find('.img-num');
		if(!_num.length) {
			_num = $('<span class="img-num"></span>');
			opVObj.append(_num);
		}
		if(imgNum == 0) {
			_num.remove();
		} else {
			_num.show().html('(' + imgNum + ')');
		}
	}

	//点击拍照
	$('#smallLoan-addData .additional-materials-paishe').on('click', function() { //点击拍照
		//获取拍摄的option的文本和value
		var opVObj = $('#c-edu option:selected');
		var opV = opVObj.val();

		Meap.media('camera', $('#c-edu option:selected').attr('picName'), function(msg) {

			daikuanapplicationObj.isPicture = true;
			if(!($('#submitBtn').hasClass('btn_next'))) {
				$('#submitBtn').addClass('btn_next');
			}

			var _id = 'img_' + new Date().getTime();
			var imgObj = {};
			imgObj.fileRoute = msg;
			imgObj.fileId = _id;
			daikuanapplicationObj.custFileArr.push(imgObj);

			imgWrapperCon.prepend('<div class="swiper-slide" fileid="' + _id + '"><img src="../../images/ic_delete.png" class="lajitong_icon"/><img src="' + msg + '" width="100%" height="100%"  class="camera-pic"></div>');
			imgNumber();
			TempCache.cache('img_' + opV, imgWrapperCon.html());
			setTimeout(function() {
				imgSwiper.slideTo(0, 0, false)
			}, 200)
			$("#c-edu").selectmenu('refresh');
		}, function(err) {
			showMsg(err);
		});

	});
	//删除图片
	imgWrapperCon.delegate(".lajitong_icon", "click", function() {
		var _this = $(this);
		showTags({
			'title': '提示',
			'content': '你确定要删除该图片吗？',
			'ok': {
				'title': '取消', //非必输  默认值：确定
				'fun': function() {

				}
			},
			'cancel': {
				'title': '确定', //非必输  默认值：取消
				'fun': function() {
					var _slide = _this.parents('.swiper-slide');
					var _fileid = _slide.attr('fileid');

					if(typeof daikuanapplicationObj.custFileArr === 'object') {
						$.each(daikuanapplicationObj.custFileArr, function(i, d) {
							if(d && d.fileId && d.fileId == _fileid) {
								daikuanapplicationObj.custFileArr.splice(i, 1);
							}
						})
					}
					var arrLength = daikuanapplicationObj.custFileArr.length + daikuanapplicationObj.zhengxinArr.length + daikuanapplicationObj.fillListArr.length;
					if(arrLength == 0) {
						$('#submitBtn').removeClass('btn_next');
					}

					if(_slide.length) _slide.remove();

					var opV = $('#c-edu option:selected').val();
					TempCache.cache('img_' + opV, imgWrapperCon.html());
					imgNumber();
					$("#c-edu").selectmenu('refresh');
				}
			}
		});
		return false;
	})

	//点击征信报告按钮
	$('.zxbgBtn').on('click', function() {
		showLoader("征信报告查询中...");
		var inquiryDate = dateGetYMD(30); //查询30天内的征信文件
		var sendJson = {
			"b": [{
				"deviceNo.s": commonJson.udId, //设备编号
				"moduleId.s": loan.moduleId, //模块编号
				"tranId.s": loan.tranId1, //交易编号
				"orgId.s": commonJson.orgId, //机构号
				"operatorNo.s": commonJson.adminCount, //操作员
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"inquiryDateMin.s": dateYYYYMMDD(inquiryDate[1]), //申请日期开始
				"inquiryDateMax.s": dateYYYYMMDD(inquiryDate[0]), //申请日期结束
				"name.s": busiInfo.NAME, //姓名
				"certNum.s": busiInfo.UNIFIED_ID, //证件号码
				"status.s": '1,3', //状态(成功和不需查询征信报告)
				"page.s": '', //页码
				"username.s": '',
				'creditType.s': '', //征信类型
				'supplementInd.s': '' //是否允许补查
			}]
		};
		findCreditReportInquiryFun(sendJson, function(msg) {
			smallLoanFindCreditReportInquirySucc(msg);
		}, function(err) {
			hideLoader();
			funFail(err);
		});
	});
	//点击选择征信文件页面  放弃按钮
	$('.searchCredit a:first').on('click', function() {
		$(".searchCredit").hide();
	});
	//点击选择征信文件页面  确认按钮
	$('.searchCredit a:last').on('click', function() {
		if(!$(this).hasClass('btn_next')) {
			return;
		}
		daikuanapplicationObj.zhengxinArr = [];
		$('.searchCredit ul>li[sel=true]').each(function(index, ele) {
			var creditInfo = $(ele).data('creditInfo');
			if(creditInfo.creditReferPath) {
				$.each(creditInfo.creditReferPath.split(';'), function(index, path) {
					daikuanapplicationObj.zhengxinArr.push(path);
				});
			}
			daikuanapplicationObj.zhengxinArr.push(creditInfo.accredit); //征信授权书
		});
		var arrLength = daikuanapplicationObj.custFileArr.length + daikuanapplicationObj.zhengxinArr.length + daikuanapplicationObj.fillListArr.length;
		if(arrLength > 0) {
			$('#submitBtn').addClass('btn_next');
		} else {
			$('#submitBtn').removeClass('btn_next');
		}
		$(".searchCredit").hide();
	});
	//点击查看征信报告
	$('.searchCredit ul').delegate('u', 'tap', function() {
		smallLoan.creditInfo = $(this).closest('li').data('creditInfo');
		smallLoan.creditReferPath = smallLoan.creditInfo.creditReferPath;
		openCreditReportFile(smallLoan, 'F0005');
	});
	//点击对账单按钮
	$('.dzdBtn').on('click', function() {
		showLoader("对账单查询中...");
		var inquiryDate = dateGetYMD(30); //查询30天的对账单文件
		var sendJson = {
			"b": [{
				"deviceNo.s": commonJson.udId, //设备编号
				"moduleId.s": smallLoan.moduleId, //模块编号
				"tranId.s": smallLoan.tranId, //交易编号
				"orgId.s": commonJson.orgId, //机构号
				"operatorNo.s": commonJson.adminCount, //操作员
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"inquiryDateMin.s": dateYYYYMMDD(inquiryDate[1]), //查询日期时间
				"inquiryDateMax.s": dateYYYYMMDD(inquiryDate[0]), //查询日期时间
				"name.s": busiInfo.NAME, //姓名
				"certNum.s": busiInfo.UNIFIED_ID, //证件号码
				"account.s": '', //账号
				"status.s": '1', //状态
				"page.s": '' //页码
			}]
		};
		findStatementConF(sendJson, smallLoanFindStatementMainSucc);
	});
	//点击选择对账单页面  放弃按钮
	$('.searchBank a:first').on('click', function() {
		$(".searchBank").hide();
	});
	//点击选择对账单页面  确认按钮
	$('.searchBank a:last').on('click', function() {
		if(!$(this).hasClass('btn_next')) {
			return;
		}
		daikuanapplicationObj.fillListArr = [];
		$('.searchBank ul>li[sel=true]').each(function(index, val) {
			daikuanapplicationObj.fillListArr.push($(val).attr('creditReferPath'));
		});
		var arrLength = daikuanapplicationObj.custFileArr.length + daikuanapplicationObj.zhengxinArr.length + daikuanapplicationObj.fillListArr.length;
		if(arrLength > 0) {
			$('#submitBtn').addClass('btn_next');
		} else {
			$('#submitBtn').removeClass('btn_next');
		}
		$(".searchBank").hide();
	});
	$('.searchBank ul').delegate('u', 'tap', function() {
		smallLoan.creditReferPath = $(this).closest('li').attr('creditReferPath');
		getFileDataAndOpen(smallLoan, 'F0010');
	});

	//点击提交完成按钮
	$('#submitBtn').on('click', function() { //点击提交完成按钮
		if(!($('#submitBtn').hasClass('btn_next'))) return;
		smallLoan.picFileAllARR = [];
		for(x in daikuanapplicationObj.custFileArr) {
			smallLoan.picFileAllARR.push(daikuanapplicationObj.custFileArr[x].fileRoute);
		}
		showLoader('流水编号查询中');
		var sendJson = {
			"b": [{
				"deviceNo.s": commonJson.udId, //设备编号
				"moduleId.s": smallLoan.moduleId, //模块编号
				"tranId.s": smallLoan.tranId, //loan.tranId, //交易编号
				"orgId.s": commonJson.orgId, //机构号
				"operatorNo.s": commonJson.adminCount, //操作员
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"CLIENT_NAME.s": custermerInfo.name, //客户姓名
				"DOCUMENT_TYPE.s": '0', //证件类型
				"DOCUMENT_ID.s": custermerInfo.cerNO, //证件号码
				"resend.s": "1", //补充资料
				"fileCount.s": "1" //补充资料文件的数量
			}]
		}
		getPlatGlobalSeqFun(sendJson, function(msg) {
			supplySubmitSucc(msg)
		}, function(err) {
			funFail(err);
			//          supplySubmitFail(err);
		});
	});

	//获取流水号成功后补充资料
	function supplySubmitSucc(msg) {
		hideLoader();
		var responseBody = responseBodySuccFormat(msg);
		if(responseBody[0].results == '00') {
			smallLoan.platGlobalSeq = responseBody[0].platGlobalSeq; //获取平台流水
			var fileList = [];
			// fileList = daikuanapplicationObj.zhengxinArr.concat(daikuanapplicationObj.fillListArr);
			daikuanapplicationObj.zhengxinArr.length > 0 && (fileList = fileList.concat(daikuanapplicationObj.zhengxinArr));
			daikuanapplicationObj.fillListArr.length > 0 && (fileList = fileList.concat(daikuanapplicationObj.fillListArr));
			//影像上传文件打包压缩插件--->客户资料
			var phoneTime = myTime.CurTime();
			Meap.zipCompression(smallLoan.platGlobalSeq, smallLoan.picFileAllARR, function(msg) {
				//影像上传 业务参数
				var appBus = {
					'busiGloablaSeq': smallLoan.platGlobalSeq, //业务编号
					'attchType': '4', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
					'OPER_TYPE': 'MOD',
					'CUSTOMER_ID': busiInfo.CUSTOMER_ID, //客户ID
					'APPLY_NO': busiInfo.APPLICATION_ID, //申请编号
					"OWNER": commonJson.tinyLoanUserId, //所属管理员标识符
					'FILE_LIST': fileList,
					'deviceNo': commonJson.udId, //设备编号
					'moduleId': smallLoan.moduleId, //模块编号
					'tranId': smallLoan.tranId, //交易编号
					'orgId': commonJson.orgId, //机构编号
					'operatorNo': commonJson.adminCount, //操作员
					'custName': busiInfo.NAME, //客户名称
					'custCredType': '0', //客户证件类型
					'custCredNo': busiInfo.UNIFIED_ID, //客户证件号
					'offlineOnline': commonJson.offlineOnline, //脱机/联机
					'workAddress': commonJson.workAddress //工作地址
						//'FILE_ADD': creditJson.storage.picFileInfoARR[0].b, //每个图片的名称和类型
				};
				var appBusJson = JSON.stringify(appBus);
				var sendDataJson = {
					'databaseName': 'myDatabase',
					'tableName': 'up_download_info',
					'data': [{
						'fileToken': phoneTime, //文件唯一ID(可以为时间挫
						'pos': '0', //文件的断点信息(初始为0)
						'filePath': msg, //文件路径
						'appPath': 'tl001', //自定义文件路径
						'appBuss': appBusJson, //业务参数
						'downloadToken': '', //文件的下载ID(初始为空)
						'leng': '1', //文件的长度(初始为1)
						'isNotice': 'yes', //是否调用后台(一直是yes)
						"fileType": '0',
						'REMARK1': '02'
					}]
				};
				insertTableData(sendDataJson, function(msg) {
					showTags({
						'title': '提示',
						'content': '业务已受理',
						'ok': {
							fun: function() {
								$.mobile.changePage('smallLoan-queryProcess.html');
							}
						}
					});
				}, function(err) {
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
			//showTags({
			//    'title': '提示',
			//    'content': '业务已受理!',
			//    'ok': {
			//        'fun': function () { //非必输  如果输入则执行此函数
			//            $.mobile.changePage('smallLoan-queryProcess.html');
			//        }
			//    }
			//});
		} else if(responseBody[0].results == '08') {

		} else {
			showTags({
				'title': '提示',
				'content': responseBody[0].message,
				'ok': {}
			});
			//          showTags({
			//              'title': '提示',
			//              'content': '获取平台交易流水号超时!',
			//              'cancel': {
			//                  'title': '继续提交',
			//                  'fun': function () {
			//                      showLoader('流水编号查询中');
			//                      getPlatGlobalSeqFun(sendJson, function (msg) {
			//                          supplySubmitSucc(msg);
			//                      }, function(){
			//                          supplySubmitFail(err);
			//                      });
			//                  }
			//              },
			//              'ok': {
			//                  'title': '放弃提交',
			//                  'fun': function () {
			//                      $.mobile.changePage('smallLoan-queryProcess.html');
			//                  }
			//              }
			//          });
		}
	}

	//获取流水号失败处理
	function supplySubmitFail(err) {
		hideLoader();
		showTags({
			'title': '提示',
			'content': '获取平台交易流水号超时!',
			'ok': {
				'fun': function() {
					$.mobile.changePage('smallLoan-queryProcess.html');
				}
			}
		});
	}

});

/**小微贷评分卡界面*/
$(document).on("pageshow", '#smallLoan-scorecard', function() {
	$('#smallLoan-scorecard-proname').text(smallLoan.proName + "评分卡");
	queryScoreCardItemsFun();
	//	showLoader('评分卡查询中');
	//	var sendJson = {
	//		"b": [{
	//			"deviceNo.s": commonJson.udId, //设备编号
	//			"moduleId.s": smallLoan.moduleId, //模块编号
	//			"tranId.s": smallLoan.tranId, //交易编号
	//			"orgId.s": commonJson.orgId, //机构号
	//			"operatorNo.s": commonJson.adminCount, //操作员
	//			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
	//			"workAddress.s": commonJson.workAddress, //工作地址
	//			"SCORE_CARD_ID.s": smallLoan.SCORE_CARD_ID || '', //小贷评分卡记录ID
	//			"CUSTNAME.s": custermerInfo.name, //身份证上姓名
	//			"CERTTYPE.s": '0',
	//			"CERTID.s": custermerInfo.cerNO, //身份证号码
	//			"SCORE_CARD_NO.s": smallLoan.SCORE_CARD_NO//小微贷产品对应评分表编号
	//		}]
	//	};
	////	console.log(sendJson);
	//	queryScoreItemFun(sendJson, function(msg) {
	//		queryScoreItemFunSucc(msg);
	//	}, function(err) {
	//		funFail(err);
	//	});

	//	$('#smallLoan-scorecard').on('change', '.radioIpt', function() {
	//		console.log(123);
	//		var name = $(this).attr('name');
	//		var grp = $('input[name="' + name + '"]:selected');
	//		console.log(grp);
	//		if(grp.length <= 0) {
	//			smallLoan.finishSingle++;
	//		}
	//		console.log(smallLoan.finishSingle);
	//	});

	//提交评分点击事件，检测单选和填空是否完成
	$('#smallLoan-scorecard').off('click').on('click', '.previous', function() {
		if(!$(this).hasClass('btn_next')) {
			return;
		}
		var inputfinish = true;
		$('#smallLoan-scorecard .textInput').each(function(index, ele) {
			var message = $(ele).val();
			if(message == '' || message == null) {
				$(this).closest('.basic_rows_name_div2').siblings('.basic_rows_name_div1').addClass('fm-item-error');
				inputfinish = false;
			} else {
				$(this).closest('.basic_rows_name_div2').siblings('.basic_rows_name_div1').removeClass('fm-item-error');
			}
		});
		if(inputfinish == false) {
			showTags({
				'title': '提示',
				'content': '测评答案不可为空！',
				'ok': {}
			});
			return;
		}

		var siglefinish = true;
		$('#smallLoan-scorecard select.optionIpt').each(function(index, ele) {
			var id = $(ele).attr('id');
			//						console.log('123');
			//						console.log(id);
			var choice = $('#' + id).val();
			//			var choice = $('input:radio[name="' + name + '"]:checked').val();
			if(choice == null || choice == '') {
				siglefinish = false;
				$(this).closest('.basic_rows_name_div2').siblings('.basic_rows_name_div1').addClass('fm-item-error');
			} else {
				$(this).closest('.basic_rows_name_div2').siblings('.basic_rows_name_div1').removeClass('fm-item-error');
			}
		});
		if(siglefinish == false) {
			showTags({
				'title': '提示',
				'content': '测评答案不可为空！',
				'ok': {}
			});
			return;
		}
		//获取所有题目的答案
		smallLoanScoreObjon = [];
		$('#smallLoan-scorecard .textInput').each(function(index, ele) {
			//			console.log('获取填空在提交的时候');
			if($(this).hasClass('noScore')) {
				return;
			}
			//小微贷款评分上送对象
			var smallLoanScoreObj = {
				CATE_NAME: '',
				ITEM_VALUE: ''
			};

			var value = $(ele).val();
			var name = $(ele).attr('name');
			if($(this).hasClass('numOnly')) {
				value = rmoney(value);
			}

			smallLoanScoreObj.CATE_NAME = name.trim();
			smallLoanScoreObj.ITEM_VALUE = value;

			smallLoanScoreObjon.push(smallLoanScoreObj);

		});

		$('#smallLoan-scorecard select.optionIpt').each(function(index, ele) {
			//			console.log('获取单选在提交的时候');
			if($(this).hasClass('noScore')) {
				return;
			}
			//小微贷款评分上送对象
			var smallLoanScoreObj = {
				CATE_NAME: '',
				ITEM_VALUE: ''
			};
			//			var name = $(ele).attr('name');
			var id = $(ele).attr('id');
			var value = $('#' + id).val();
			//			var value = $('input:radio[name="' + name + '"]:checked').val();
			//			var value = $(ele).attr('data-value'); //要求上送选项值

			smallLoanScoreObj.CATE_NAME = id;
			smallLoanScoreObj.ITEM_VALUE = value;

			smallLoanScoreObjon.push(smallLoanScoreObj);

		});
		//小微贷款评分卡提交
		showLoader('提交评分中......');
		var sendJson = {
			"b": [{
				"deviceNo.s": commonJson.udId, //设备编号
				"moduleId.s": smallLoan.moduleId, //模块编号
				"tranId.s": smallLoan.tranId, //交易编号
				"orgId.s": commonJson.orgId, //机构号
				"operatorNo.s": commonJson.adminCount, //操作员
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"SCORE_CARD_ID.s": smallLoan.SCORE_CARD_ID || '', //小贷评分卡记录ID
				"CUSTNAME.s": custermerInfo.name, //身份证上姓名
				"CERTTYPE.s": '0',
				"CERTID.s": custermerInfo.cerNO, //身份证号码
				"SCORE_CARD_NO.s": smallLoan.SCORE_CARD_NO, //小微贷评分卡类型
				"IN_MAP.s": JSON.stringify(smallLoanScoreObjon) //选择的答案
			}]
		};
		//					console.log(JSON.stringify(smallLoanScoreObjon));
		createAndCalculateScoreCardFun(sendJson, function(msg) {
			createAndCalculateScoreCardSucc(msg);
			//			$('#smallLoan-scorecard .search-day-con').show();
			//			$('#resultlist').show();
		}, function(err) {
			funFail(err);
		});

	});
});