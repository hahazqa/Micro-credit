//小贷客户信息管理角色选择页面
$(document).on('pageshow', '#smallLoanCusManage-index', function() {
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

	smallLoanCusinitVariable(); //初始化变量
	getCurrentLocationCoordinateFun(); //获取经纬度信息

	smallLoanCusManJson.applyTo = '2'; //默认是个人用户

	$('#corporateperson').on('click', function() { //共借人
		smallLoanCusManJson.role = '2';
		$.mobile.changePage('smallLoanCusManage-progress.html');
	});

	$('#guaranteeperson').on('click', function() { //担保人
		smallLoanCusManJson.role = '3';
		$.mobile.changePage('smallLoanCusManage-progress.html');
	});

	$('#normalcustomer').on('click', function() { //普通客户
		smallLoanCusManJson.role = '1';
		//		$.mobile.changePage('smallLoanCusManage-readingID.html');
		$("#smallLoanCusManage-index .search-day-con").show();
	});

	$('#smallLoanCusManage-index .fangqi-seach').eq(0).on('click', function() {
		$('#smallLoanCusManage-index .search-day-con').hide();
	});

	$("#smallLoanCusManage-index .fangqi-seach").eq(1).on('click', function() {
		smallLoanCusManJson.applyTo = $("#customerType").val();
		$('#smallLoanCusManage-index .search-day-con').hide();
		$.mobile.changePage('smallLoanCusManage-readingID.html');
	});
});

//交易选择界面
$(document).on('pageshow', '#smallLoanCusManage-progress', function() {
	//初始化清空数据
	$('#kehuname').val('');
	$('#zhengjiannumber').val('');
	$("#jieshuDate").val(appTime.appCurDate('-'));
	$("#kaishiDate").val(appTime.appPreDate('-', 1000 * 60 * 60 * 24 * 30));

	//点击搜索按钮
	$(".previous").eq(0).on('click', function() {
		$("#smallLoanCusManage-progress .search-day-con").show();

	})

	//点击搜索框内的放弃按钮
	$('.fangqi-seach').eq(0).on('click', function() {
		$('.search-day-con').hide();
	});

	smallLoanCusManJson.index = '';
	smallLoanCusManJson.responseCode = '';

	timeEnd = appTime.appCurDate('/'); //当前时间
	timeStart = appTime.appPreDate('/', 1000 * 60 * 60 * 24 * 30);

	SmallLoanCusfindApplicationFunSuss(1, timeStart, timeEnd);

	//点击搜索框内的搜索按钮
	$('.fangqi-seach').eq(1).on('click', function() {
		smallLoanCusManJson.index = '';
		smallLoanCusManJson.responseCode = '';

		var sT = $('#kaishiDate').val();
		var eT = $('#jieshuDate').val();

		//日期规则校验
		if(!sT || !eT) {
			showMsg('起始时间和终止时间不能为空');
			return;
		}

		if(myTime.DateToUnix(sT) > myTime.DateToUnix(eT)) {
			showMsg('起始日期不能大于终止日期!');
			return;
		}
		if((myTime.DateToUnix(eT) - myTime.DateToUnix(sT)) > 2592000) {
			showMsg('起止日期不可超过30天!');
			return;
		}

		var cusName = $('#kehuname').val();

		if($('#zhengjiannumber').val() == '') {

		} else {
			//验证身份证
			if(!(fmReg.cerNo.test($('.input-test-con').eq(1).val()))) {
				showMsg('您输入的证件号码有误，请重新输入！');
				$("#zhengjiannumber").val('');
				return false;
			}
		}

		$('#smallLoanCusManage-progress .search-day-con').hide();
		SmallLoanCusfindApplicationFunSuss(1, sT.replace(/-/g, '/'), eT.replace(/-/g, '/'), $.trim(cusName), $.trim($('#zhengjiannumber').val()), smallLoanCusManJson.state);
		//		SmallLoanCusfindApplicationFunSuss(1, sT.replace(/-/g, '/'), eT.replace(/-/g, '/'), $.trim(cusName), $.trim($('#zhengjiannumber').val()), $.trim($("#banlijindu").val()));
	});

	//	$('.box-content .box-rows .detail-botton').on('click', function (){
	//		var filepath = $(this).attr('filepath');
	//		if(filepath){
	//			getFileAndShow (filepath,'F00007');
	//		}else{
	//			showTags({
	//	            'title': '提示',
	//	            'content': '申请书路径为空，请联系技术人员！',
	//	            'ok': {}
	//	        });
	//		}
	//		
	//	})

	$("#smallLoanCusManage-progress .previous").eq(1).on('click', function() {
		if(!($('#smallLoanCusManage-progress .previous:eq(1)').hasClass('btn_next'))) return;
		if($.trim($(".list-bgcolor .detail-botton").attr('channel')) == 'MA') {
			if($('.queryProcess-con').find('.list-bgcolor')) {
				smallLoanCusManJson.index = ($('#queryProcess-con').find('.list-bgcolor').index());
				smallLoanCusManJson.originapplyform = (smallLoanCusapplicationObjon[smallLoanCusManJson.index])[0].appliform; //获取原申请书路径
				smallLoanCusManJson.applicationno = (smallLoanCusapplicationObjon[smallLoanCusManJson.index])[0].APPLICATION_NO; //获取原申请编号
				smallLoanCusManJson.proName = (smallLoanCusapplicationObjon[smallLoanCusManJson.index])[0].LOAN_PRODUCT; //贷款产品-业务参数
			}
			$.mobile.changePage('smallLoanCusManage-readingID.html');
		} else {
			showTags({
				'title': '提示',
				'content': '该进件非移动平台渠道，暂不支持跨渠道补签！',
				'ok': {}
			});
		}

	})
});

//身份证读取页面
$(document).on('pageshow', '#smallLoanCusManage-readingID', function() {

	//调用刷身份证方法
	$(".footter .previous").on('click', function() {
		creditReadCard(function() {
			$.mobile.changePage('smallLoanCusManage-readID.html');
		}, function(err) {
			$.mobile.changePage('smallLoanCusManage-readID.html');
		});
	});

	//点击影像复用按钮
	$("#smallLoanCusManage-readingID .conter-con .picRe").on('click', function() {
		$.mobile.changePage('smallLoanCusManage-video.html');
	});
});

//影像复用选取
$(document).on('pageshow', '#smallLoanCusManage-video', function() {
	queryAllcacheCustermerInfo();
	//点击取消
	$('#smallLoanCusManage-video .previous-con').on('click', function() {
		$.mobile.changePage('smallLoanCusManage-readingID.html', {
			reverse: true
		});
	});
	//点击影像复用
	$('#smallLoanCusManage-video #btn_next').on('click', function() {
		if(!($(this).hasClass('btn_next'))) return;
		commonJson.isCustermerInfoMultiplex = true; //使用影像复用功能
		$.mobile.changePage('smallLoanCusManage-readingID.html');
	})
});

//身份证读取成功界面
$(document).on('pageshow', '#smallLoanCusManage-readID', function() {
	lianwanghechaData.dianzixinyongkaDX = "5";
	//显示信息
	if(creditJson.isReadCardSucc || commonJson.isCustermerInfoMultiplex) { //读卡成功
		creditReadCardSucc({
			"b": [{
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"moduleId.s": loan.moduleId, //模块编号
				"tranId.s": smallLoanCusManJson.tranId, //交易编号
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
	if(smallLoanCusManJson.role != '1' && custermerInfo.cerNO == (smallLoanCusapplicationObjon[smallLoanCusManJson.index])[0].UNIFIED_ID) {
		showTags({
			'title': '提示',
			'content': custermerInfo.name + '是该笔交易的主申请人，无需进行补签签名操作！,请放入其他身份证!',
			'ok': {
				fun: function() {
					$.mobile.changePage('smallLoanCusManage-readingID.html', {
						reverse: true
					});
				}
			}
		});
	}
	//点击上一步重新读取
	$("#smallLoanCusManage-readID .footter .previous:eq(0)").on('click', function() {
		if(!($(this).hasClass('btn_next'))) return;
		$.mobile.changePage('./smallLoanCusManage-readingID.html', {
			reverse: true
		});
	});
	//点击下一步 联网核查
	$("#smallLoanCusManage-readID .footter .previous:eq(1)").on('click', function() {
		if(!$(this).hasClass('btn_next')) {
			return;
		}
		if(commonJson.isCustermerInfoMultiplex) {
			lianwanghechaData.CheckResult = '00';
		}
		smallLoanCusManJson.mInfo.lianPic = custermerInfo.checkPhoto;

		if(smallLoanCusManJson.role == '2' || smallLoanCusManJson.role == '3') {
			smllLoanCheckCustomerSucc();
		} else {
			smallloanCusIcustomerInfoServiceFun();
		}

	});

	$(".lianwanghecha-chongxin").on("click", function() { //重新联网核查
		$(".lianwanghecha-yichang").hide();
		creditReadCardSucc({
			"b": [{
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"moduleId.s": smallLoanCusManJson.moduleId, //模块编号
				"tranId.s": smallLoanCusManJson.tranId, //交易编号
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
		smallLoanCusManJson.mInfo.lianPic = custermerInfo.checkPhoto;
		smallloanCusIcustomerInfoServiceFun();
		//$.mobile.changePage('smallLoan-cusPicture.html', {transition: "slide"});

	});
	$(".lianwanghecha-tuichu").on("click", function() { //退出
		$.mobile.changePage('smallLoanCusManage-readingID.html', {
			reverse: true
		});
		$(".lianwanghecha-yichang").hide();
	});
})

//影像采集用参数
var smallLoanCusImageAcquisition = {
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
						$('#smallLoanCusManage-cusPictures #btn_next').addClass('btn_next');
					} else {
						$('#smallLoanCusManage-cusPictures #btn_next').removeClass('btn_next');
					}

				}
			}
		}, function(err) {

		})
	},
	getFace: function(curParentObj) {
		faceDistinguish('trans', function(msg) {
			smallLoanCusImageAcquisition.imgSrc = msg;
			curParentObj.find('.camera').hide();
			curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
			curParentObj.find('.rephoto').text('重拍');
			//监测下一步是否可点击
			var ind = 0;
			for(var i = 0; i < 4; i++) {
				if($('.customer:eq(' + i + ')').find("img").length == 2) {
					ind++;

					if(ind >= 4) {
						$('#smallLoanCusManage-cusPictures #btn_next').addClass('btn_next');
					} else {
						$('#smallLoanCusManage-cusPictures #btn_next').removeClass('btn_next');
					}
				}

			}
		}, function(err) {
			showMsg(err);
		})
	},
	getImg: function(curParentObj) { //拍照
		if($('#smallLoanCusManage-cusPictures .cameraMul').length == 18) {
			$('#smallLoanCusManage-cusPictures .cameraMul').eq(17).parents(".img_box").remove();
			showTags({
				'title': '提示',
				'content': "拍摄照片已到最大限度[最大限度为20张]",
				'ok': {}
			});
			return;

		}
		Meap.media('camera', curParentObj.attr('picname'), function(msg) {
			creditJson.isPrev.LLDBisFromPrev = false;
			smallLoanCusImageAcquisition.imgSrc = msg;
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
					'<div class="img_notes">其他</div>' +
					'</div>';
				$('.img_content').append(htmlText).trigger("create");

			}
			//监测下一步是否可点击
			var ind = 0;
			for(var i = 0; i < 4; i++) {
				if($('.customer:eq(' + i + ')').find("img").length == 2) {
					ind++;
					if(ind >= 4) {
						$('#smallLoanCusManage-cusPictures #btn_next').addClass('btn_next');
					} else {
						$('#smallLoanCusManage-cusPictures #btn_next').removeClass('btn_next');
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
				//				creditJson.isPrev.LLDBisFromPrev = false;
				deletePhoto([imgSrc], function(returnDelMsg) {
					smallLoanCusImageAcquisition.imgSrc = returnGetMsg;
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
					smallLoanCusImageAcquisition.imgSrc = returnGetMsg;
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

//拍摄影像资料页面
$(document).on('pageshow', '#smallLoanCusManage-cusPictures', function() {
	if(smallLoanCusManJson.isPicturePage || workbenchJson.isTemp) { //反显
		if(workbenchJson.isTemp) {
			smallLoanCusTempORpreToPic(workbenchJson.temp); //暂存回到拍摄界面 待修改
			workbenchJson.temp = {};
		}
		workbenchJson.isTemp = false;
		$('.img_content .camera-pic').remove();
		var imgArr = [];
		var imgTypeArr = [];
		imgArr = smallLoanCusManJson.applicationObj.mPicFileARR;
		imgTypeArr = smallLoanCusManJson.applicationObj.mPicFileMsgType;
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
					'<div class="img_notes">其他</div>' +
					'</div>').insertBefore('.img_box:last');

			}
		});
		//监测下一步是否可点击
		var ind = 0;
		for(var i = 0; i < 4; i++) {
			if($('#smallLoanCusManage-cusPictures .customer:eq(' + i + ')').find("img").length == 2) {
				ind++;
				if(ind >= 4) {
					$('#smallLoanCusManage-cusPictures #btn_next').addClass('btn_next');
				} else {
					$('#smallLoanCusManage-cusPictures #btn_next').removeClass('btn_next');
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

	$('#smallLoanCusManage-cusPictures .conter-con').on('click', '.customer', function(ev) {
		smallLoanCusImageAcquisition.curParentObj = $(this);
		smallLoanCusImageAcquisition.imgSrc = $(this).find('.camera-pic').attr('src');
		var oTarget = ev.target;
		if($(this).find('.rephoto').html() == '重拍') { //重拍
			if($(oTarget).hasClass('rephoto')) {
				smallLoanCusImageAcquisition.reGetImg(smallLoanCusImageAcquisition.curParentObj, smallLoanCusImageAcquisition.imgSrc);
			}
			if($(oTarget).hasClass('camera-pic')) { //预览大图
				smallLoanCusImageAcquisition.imgSrc = $(oTarget).attr('src');
				smallLoanCusImageAcquisition.reviewImg($(oTarget).attr('src'));
			}
			return;
		}
		//拍照
		if(smallLoanCusImageAcquisition.curParentObj.parent().hasClass('get-face')) {
			smallLoanCusImageAcquisition.getFace(smallLoanCusImageAcquisition.curParentObj);
		} else {
			smallLoanCusImageAcquisition.getImg(smallLoanCusImageAcquisition.curParentObj);
		}

	});
	//预览大图 点击关闭
	$('.bigpic-review-close').click(function(event) {
		smallLoanCusImageAcquisition.reviewImgClose();
	});
	//预览大图 删除图片
	$('.bigpic-review-del').click(function(event) {
		smallLoanCusImageAcquisition.delImg(smallLoanCusImageAcquisition.curParentObj, smallLoanCusImageAcquisition.imgSrc);
	});
	//预览大图 重新拍照
	$('.bigpic-review-rephone').click(function(event) {
		smallLoanCusImageAcquisition.reGetImg(smallLoanCusImageAcquisition.curParentObj, smallLoanCusImageAcquisition.imgSrc);
	});
	//点击暂存
	$('#smallLoanCusManage-cusPictures .customerP-zancun').on('click', function() {
		$(this).css('display', 'none');
		smallLoanCusManJson.applicationObj.mPicFileARR = []; //要打包的影像路径
		smallLoanCusManJson.applicationObj.mPicFileInfoARR = [{
			"b": []
		}]; //每个图片的名称和类型
		smallLoanCusManJson.applicationObj.mPicFileMsgType = []; //其他图片对象的证明类型
		cachePictureLoan(smallLoanCusManJson.applicationObj.mPicFileARR, smallLoanCusManJson.applicationObj.mPicFileInfoARR, smallLoanCusManJson.applicationObj.mPicFileMsgType, '#smallLoanCusManage-cusPictures')
		smallLoanCusZanCunPictureInfo('smallLoanCusManage-cusPictures.html');
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
			smallLoanCusManJson.isPicturePage = true;
			smallLoanCusManJson.applicationObj.custFacePic = $('#smallLoanCusManage-cusPictures .img_box:eq(0) .camera-pic:eq(0)').attr('src'); //客户面部照片
			smallLoanCusManJson.applicationObj.custAndCustOwnerPic = $('#smallLoanCusManage-cusPictures .img_box:eq(1) .camera-pic:eq(0)').attr('src'); //与客户合影照片
			smallLoanCusManJson.applicationObj.frontIDCardPic = $('#smallLoanCusManage-cusPictures .img_box:eq(2) .camera-pic:eq(0)').attr('src'); //身份证正面
			smallLoanCusManJson.applicationObj.backIDCardPic = $('#smallLoanCusManage-cusPictures .img_box:eq(3) .camera-pic:eq(0)').attr('src'); //身份证反面
			smallLoanCusManJson.applicationObj.mPicFileARR = []; //要打包的影像路径
			smallLoanCusManJson.applicationObj.mPicFileInfoARR = [{
				"b": []
			}]; //每个图片的名称和类型
			smallLoanCusManJson.applicationObj.mPicFileMsgType = []; //其他图片对象的证明类型
			smallLoanCusManJson.applicationObj.mPicFileARR.push(smallLoanCusManJson.applicationObj.custFacePic, smallLoanCusManJson.applicationObj.custAndCustOwnerPic, smallLoanCusManJson.applicationObj.frontIDCardPic, smallLoanCusManJson.applicationObj.backIDCardPic);
			var len = $('#smallLoanCusManage-cusPictures .img_box').length;
			if(len - 4 > 0) {
				for(var i = 4; i < len; i++) {
					if($('#smallLoanCusManage-cusPictures .img_box:eq(' + i + ') .camera-pic').length > 0) {
						smallLoanCusManJson.applicationObj.mPicFileARR.push($('#smallLoanCusManage-cusPictures .img_box:eq(' + i + ') .camera-pic:eq(0)').attr('src'));
						smallLoanCusManJson.applicationObj.mPicFileMsgType.push($('#smallLoanCusManage-cusPictures .img_box:eq(' + i + ') .camera-pic:eq(0)').closest('.customer').attr('picname'));
					}
				}
			}
			$.each(smallLoanCusManJson.applicationObj.mPicFileARR, function(index, el) {
				if(!el) return true;
				var elIndex = el.lastIndexOf('\/') + 1;
				smallLoanCusManJson.applicationObj.mPicFileInfoARR[0].b.push({
					FILE_NAME: el.substring(elIndex),
					FILE_TYPE: 'F0000'
				});
			});
			$.mobile.changePage('./smallLoanCusManage-personFace.html', {
				transition: "slide"
			});
		} else {
			$.mobile.changePage('./smallLoanCusManage-personFace.html', {
				transition: "slide"
			});
		}
	})
});

//人脸对比
$(document).on('pageshow', '#smallLoanCusManage-personFace', function() {
	$("#smallLoanCusManage-personFace .camera:eq(0)").attr('src', smallLoanCusManJson.applicationObj.mPicFileARR[0]);
	$("#smallLoanCusManage-personFace .camera:eq(1)").attr('src', custermerInfo.image);
	$("#smallLoanCusManage-personFace .camera:eq(2)").attr('src', smallLoanCusManJson.applicationObj.mPicFileARR[0]);
	if(lianwanghechaData.CheckResult == '09' || lianwanghechaData.CheckResult == '02') {
		$("#smallLoanCusManage-personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + custermerInfo.checkPhoto);
	} else {
		$("#smallLoanCusManage-personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + smallLoanCusManJson.mInfo.lianPic);
	}
	//点击继续
	$('#smallLoanCusManage-personFace .previous:last').on('click', function() {

		if($(this).hasClass('btn_next')) {
			var faceRecogn = '';
			if($("#smallLoanCusManage-personFace .face-result:eq(0)").text() == '通过' && $("#smallLoanCusManage-personFace .face-result:eq(1)").text() == '通过') {
				faceRecogn = '1'; //自动通过
			} else {
				faceRecogn = '5'; //手动通过
			}
			smallLoanCusManJson.faceRecogn = faceRecogn;
			creditJson.isPrev.LLDBisFromPrev = true;
			$.mobile.changePage('smallLoanCusManage-messageinput.html');
		}
	});
	//点击放弃
	$('#smallLoanCusManage-personFace .previous:first').on('click', function() {
		creditJson.isPrev.LLDBisFromPrev = false;
		smallLoanCusManJson.faceRecogn = '6'; //手动不通过
		$.mobile.changePage('smallLoanCusManage-cusPictures.html', {
			reverse: true
		});
	});

	ifacelRecognitionSeMGFun(smallLoanCusManJson.applicationObj.mPicFileARR[0], custermerInfo, smallLoanCusManJson);
});

//客户信息录入界面
$(document).on('pageshow', '#smallLoanCusManage-messageinput', function() {
	//暂存后或者点击上一页回到该界面
	if(smallLoanCusManJson.messageCache || workbenchJson.isTemp) {
		if(workbenchJson.isTemp) {
			smallLoanCusTempORpreToObject(workbenchJson.temp);
		}
		workbenchJson.isTemp = false;
		if(smallLoanCusManJson.issPlace && smallLoanCusManJson.issPlace != 0) {
			$("#smallLoanCus-addrName").attr('disabled', 'disabled').closest('.fm-item').css('display', 'none'); //地区名称
			$("#smallLoanCus-addr").attr('disabled', 'disabled').closest('.fm-item').css('display', 'none'); //签发地区名称
			$("#smallLoanCus-zipcode").attr('disabled', 'disabled').closest('.fm-item').css('display', 'none'); //签发地区名称

		} else {
			$("#smallLoanCus-addrName").val(smallLoanCusManJson.addrName); //地区名称
			$("#smallLoanCus-addr").html(smallLoanCusManJson.addrAll).val(smallLoanCusManJson.addrCode).selectmenu('refresh'); //签发地区名称
			$("#smallLoanCus-zipcode").val(smallLoanCusManJson.zipcode); //邮编
		}

		$("#smallLoanCus-mobile").val(telNum(smallLoanCusManJson.mobile)); //手机号码
		//$("#smallLoan-zipcode").val(smallLoan.zipcode);//邮编
		if(!smallLoanCusManJson.day_b) {
			$("#day_b").val("").selectmenu('refresh');
			$("#day_c").val("").selectmenu('refresh').attr('disabled', 'disabled');
			$("#smallLoanCus-addr-home").val(smallLoanCusManJson.addrHome); //经营地址详细地址
		} else {
			$("#day_b").val(smallLoanCusManJson.day_b).selectmenu('refresh'); //经营地址省份
			$("#day_c").val(smallLoanCusManJson.day_c).selectmenu('refresh'); //经营地址市
			$("#smallLoanCus-addr-home").val(smallLoanCusManJson.addrHome); //经营地址详细地址
		}
		if(!smallLoanCusManJson.s_city) {
			$("#s_city").val("").selectmenu('refresh');
			$("#s_county").val("").selectmenu('refresh').attr('disabled', 'disabled');
			$("#smallLoanCus-addr-detail").val(smallLoanCusManJson.addrDetail); //居住地址详细地址
		} else {
			$("#s_county").val(smallLoanCusManJson.s_county).selectmenu('refresh'); //居住地址省份
			$("#s_city").val(smallLoanCusManJson.s_city).selectmenu('refresh'); //居住地址市
			$("#smallLoanCus-addr-detail").val(smallLoanCusManJson.addrDetail); //居住地址详细地址
		}

		$('#smallLoanCus-name').text(custermerInfo.name);
		$('#smallLoanCus-sex').text(custermerInfo.sex);
		$('#smallLoanCus-cerTime').text(custermerInfo.cerExpdDt.split('-')[1]);
		$('#smallLoanCus-cerNo').text(custermerInfo.cerNO);
		$("#smallLoanCus-marriage").val(smallLoanCusManJson.marriage).selectmenu('refresh'); //婚姻状况
		$("#smallLoanCus-occup").val(smallLoanCusManJson.occup).selectmenu('refresh'); //职位
		$("#smallLoanCus-com-name").val(smallLoanCusManJson.companyName); //工作单位
		$("#ZhiWu").val(smallLoanCusManJson.ZhiWu).selectmenu('refresh'); //职务
		$("#smallLoanCus-income").val(fmoney(smallLoanCusManJson.income, 2)); //月收入
		$("#smallLoanCus-f-income").val(fmoney(smallLoanCusManJson.familyIncome, 2)); //家庭月收入
		//		if(smallLoan.spouseId && smallLoan.spouseId != 0) {
		//			$("#smallLoan-peiName").val(smallLoan.peiName).attr('disabled', 'disabled'); //配偶姓名
		//			$("#smallLoan-peiPhone").val(telNum(smallLoan.peiPhone)).attr('disabled', 'disabled'); //配偶手机号码
		//			$("#smallLoan-peiCerNo").val(smallLoan.peiCerNo).attr('disabled', 'disabled'); //配偶证件号码
		//			$("#smallLoan-peiCompany").val(smallLoan.peiCompany).attr('disabled', 'disabled'); //配偶工作单位
		//		} else {
		//			$("#smallLoan-peiName").val(smallLoan.peiName); //配偶姓名
		//			$("#smallLoan-peiPhone").val(telNum(smallLoan.peiPhone)); //配偶手机号码
		//			$("#smallLoan-peiCerNo").val(smallLoan.peiCerNo); //配偶证件号码
		//			$("#smallLoan-peiCompany").val(smallLoan.peiCompany); //配偶工作单位
		//		}

		//		$("#smallLoan-loanMoney").val(fmoney(smallLoan.loanMoney)); //贷款金额
		//		$("#smallLoan-loanTime").val(smallLoan.loanTime); //贷款期限
		//		$("#paymentMethod").val(smallLoan.paymentMethod); //还款方式
		//		$("#smallLoan-loanUse").val(smallLoan.loanUse); //贷款用途
	} else { //非暂存或上一步回到此页面
		$('#smallLoanCus-name').text(custermerInfo.name);
		$('#smallLoanCus-sex').text(custermerInfo.sex);
		$('#smallLoanCus-cerTime').text(custermerInfo.cerExpdDt.split('-')[1]);
		$('#smallLoanCus-cerNo').text(custermerInfo.cerNO);
		IQueryCustomerInformationServiceSmallLoanCusSucc();
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
	$('#smallLoanCus-mobile').on('blur', function() {
		$('#smallLoanCus-mobile').val(telNum($('#smallLoanCus-mobile').val()));
	});
	$('#smallLoanCus-mobile').on('tap', function() {
		$('#smallLoanCus-mobile').val(removeSpace($('#smallLoanCus-mobile').val()));
	});
	//	$('#smallLoanCus-peiPhone').on('blur', function() {
	//		$('#smallLoanCus-peiPhone').val(telNum($('#smallLoanCus-peiPhone').val()));
	//	});
	//	$('#smallLoan-peiPhone').on('tap', function() {
	//		$('#smallLoan-peiPhone').val(removeSpace($('#smallLoan-peiPhone').val()));
	//	});
	$('#smallLoanCus-income').on('tap', function() {
		var _val = $(this).val();
		$(this).val(rmoney(_val));
	})
	$('#smallLoanCus-income').on('blur', function() {
		var _val = $(this).val().replace(/[^0-9\.]/ig, "");
		if(_val.toString().length > 10) {
			showMsg('金额长度包含小数点不能超过10位！');
			$(this).val('');
			return;
		}
		$(this).val(fmoney(_val));
	})
	$('#smallLoanCus-f-income').on('tap', function() {
		var _val = $(this).val();
		$(this).val(rmoney(_val))
	})
	$('#smallLoanCus-f-income').on('blur', function() {
			var _val = $(this).val().replace(/[^0-9\.]/ig, "");
			if(_val.toString().length > 10) {
				showMsg('金额长度包含小数点不能超过10位！');
				$(this).val('');
				return;
			}
			$(this).val(fmoney(_val));
		})
		//	$('#smallLoanCus-loanMoney').on('tap', function() {
		//		var _val = $(this).val();
		//		$(this).val(rmoney(_val));
		//	})
		//	$('#smallLoanCus-loanMoney').on('blur', function() {
		//		var _val = $(this).val().replace(/[^0-9\.]/g, "");
		//		if(!_val) {
		//			$(this).val('');
		//			return;
		//		}
		//		if(!/^\d+000$/.test(_val)) {
		//			showMsg('贷款额度应为千整位！');
		//			$(this).val('');
		//			return;
		//		}
		//		if(parseInt(smallLoan.fixedAmount) < _val || _val < parseInt(smallLoan.minAmount)) {
		//			showMsg('贷款额度应在' + smallLoan.minAmount + '~' + smallLoan.fixedAmount + '元之间！');
		//			$(this).val('');
		//			return;
		//		}
		//		$(this).val(fmoney(_val))
		//	})
		//	$("#smallLoan-loanTime").on('blur', function() {
		//		var _val = $(this).val().replace(/\D/g, "");
		//		if(!_val) {
		//			$(this).val('');
		//			return;
		//		}
		//		if(parseInt(smallLoan.fixedTerms) < _val || _val < parseInt(smallLoan.minTerms)) {
		//			showMsg('贷款期限应在' + smallLoan.minTerms + '~' + smallLoan.fixedTerms + '月之间！');
		//			$(this).val('');
		//			return;
		//		}
		//		$(this).val(_val);
		//	})
	$("#smallLoanCus-addr-detail").on('blur', function() {
		if(!$(this).val()) {
			var s_county = $.trim($("#s_county").val()) || '福田区'; //居住地址区
			$("#s_city").html('<option value="深圳市">深圳市</option>').val('深圳市').selectmenu('refresh');
			$("#s_county").html(' <option value="福田区">福田区</option><option value="罗湖区">罗湖区</option><option value="南山区">南山区</option><option value="宝安区">宝安区</option><option value="龙岗区">龙岗区</option><option value="盐田区">盐田区</option><option value="龙华新区">龙华新区</option><option value="光明新区">光明新区</option><option value="大鹏新区">大鹏新区</option><option value="坪山新区">坪山新区</option>').val(s_county).selectmenu('refresh').removeAttr('disabled');
		}
	})
	$("#smallLoanCus-addr-home").on('blur', function() {
			if(!$(this).val()) {
				var day_c = $.trim($("#day_c").val()) || '福田区'; //居住地址区
				$("#day_b").html('<option value="深圳市">深圳市</option>').val('深圳市').selectmenu('refresh');
				$("#day_c").html(' <option value="福田区">福田区</option><option value="罗湖区">罗湖区</option><option value="南山区">南山区</option><option value="宝安区">宝安区</option><option value="龙岗区">龙岗区</option><option value="盐田区">盐田区</option><option value="龙华新区">龙华新区</option><option value="光明新区">光明新区</option><option value="大鹏新区">大鹏新区</option><option value="坪山新区">坪山新区</option>').val(day_c).selectmenu('refresh').removeAttr('disabled');
			}
		})
		//户籍返显到详细地址
	$("#hujifangxian1").click(function() {
		$("#smallLoanCus-addr-detail").val(custermerInfo.address);
		$("#s_city").val("").selectmenu('refresh').attr('disabled', 'disabled');
		$("#s_county").val("").selectmenu('refresh').attr('disabled', 'disabled');
	});
	//定位返显到详细地址
	$("#shishidingwei1").click(function() {
		Meap.getCurrentLocationAddress("", function(msg) {
			msg = JSON.parse(msg);
			$("#smallLoanCus-addr-detail").val(msg.FormattedAddressLines[0]);
			$("#s_city").val("").selectmenu('refresh').attr('disabled', 'disabled');
			$("#s_county").val("").selectmenu('refresh').attr('disabled', 'disabled');
		}, function(err) {
			showMsg(err);
		});
	});
	//失去焦点 发请求匹配签发地区
	$("#smallLoanCus-addrName").on('blur', function() {
			$("#smallLoanCus-addr").val('').html('').selectmenu('refresh');
			var city = $(this).val();
			if(city == "") return;
			sloancusIfrp005ServicePSucc(city);
		})
		//户籍返显到详细地址
	$("#hujifangxian").click(function() {
		$("#smallLoanCus-addr-home").val(custermerInfo.address);
		$("#day_b").val("").selectmenu('refresh').attr('disabled', 'disabled');
		$("#day_c").val("").selectmenu('refresh').attr('disabled', 'disabled');
	});
	//定位返显到详细地址
	$("#shishidingwei").click(function() {
		Meap.getCurrentLocationAddress("", function(msg) {
			msg = JSON.parse(msg);
			$("#smallLoanCus-addr-home").val(msg.FormattedAddressLines[0]);
			$("#day_b").val("").selectmenu('refresh').attr('disabled', 'disabled');
			$("#day_c").val("").selectmenu('refresh').attr('disabled', 'disabled');
		}, function(err) {
			showMsg(err);
		});
	});

	//点击暂存
	$('#smallLoanCusManage-messageinput .zancun').on('click', function() {
		$(this).css('display', 'none');
		casheSmallLoanCusMessage();
		smallLoanCusZanCunCustermerInfo();
		$.mobile.changePage('../main.html', {
			reverse: true
		});
	});
	//点击上一步，跳转页面
	$('.previous-con').on('click', function() {
		smallLoanCusManJson.messageCache = true; //信息缓存
		casheSmallLoanCusMessage();
		$.mobile.changePage('smallLoanCusManage-cusPictures.html', {
			reverse: true
		});
	});
	//点击下一步
	$('#ms_btn_next').on('click', function() {
		//if (!$(this).hasClass('btn_next')) return;
		////是否为空验证
		var num = 0; //纪录为空或者格式不正确的个数
		$('#smallLoanCusManage-messageinput .conter-con input[type="text"]:not(:disabled)').each(function(index, el) {
			//配偶的不必填
			//			if(/^smallLoan-pei/.test($(this).attr('id')) && (!$('#smallLoan-marriage option:selected[value *=2]').length)) {
			//				return true;
			//			}

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
		$('#smallLoanCusManage-messageinput select:not(:disabled)').each(function(index, el) {
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
		$('#smallLoanCusManage-messageinput .conter-con input[type="text"][reg]:not(:disabled)').each(function(index, el) {

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

		if(rmoney($("#smallLoanCus-income").val()) > rmoney($("#smallLoanCus-f-income").val())) {
			var eqIndex = $("#smallLoanCus-income").closest('.info-enter-item').index();
			$("#smallLoanCus-income").closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
			$("#smallLoanCus-income").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
			$("#smallLoanCus-f-income").closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
			$("#smallLoanCus-f-income").closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
			if(!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
				$('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
			}
			showMsg('月收入不能大于家庭月收入！');
			return;
		} else {
			var eqIndex = $("#smallLoanCus-income").closest('.info-enter-item').index();
			$("#smallLoanCus-income").closest('.info-enter-item').removeClass('info-enter-error-bd'); //错误字段点亮 父级区域
			$("#smallLoanCus-income").closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
			$("#smallLoanCus-f-income").closest('.info-enter-item').removeClass('info-enter-error-bd'); //错误字段点亮 父级区域
			$("#smallLoanCus-f-income").closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
			if($('.navigation li:eq(' + eqIndex + ')').find('.fm-item-error').length == 0) {
				$('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
			}
		}
		if(!$("#day_b").val()) {
			if(checkAs400ChineseLength($("#smallLoanCus-addr-home").val()) >= 60) {
				showTags({
					'title': '提示',
					'content': "经营地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}
			if($("#smallLoanCus-addr-home").val().length >= 30) {
				showTags({
					'title': '提示',
					'content': "经营地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}
		} else {

			if(checkAs400ChineseLength($("#day_b").val() + $("#day_c").val() + $("#smallLoanCus-addr-home").val()) >= 60) {
				showTags({
					'title': '提示',
					'content': "经营地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}
			if($("#smallLoanCus-addr-home").val().length + $("#day_b").val().length + $("#day_c").val().length >= 30) {
				showTags({
					'title': '提示',
					'content': "经营地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}

		}
		if(!$("#s_city").val()) {
			if(checkAs400ChineseLength($("#smallLoanCus-addr-detail").val()) >= 60) {
				showTags({
					'title': '提示',
					'content': "居住地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}
			if($("#smallLoanCus-addr-detail").val().length >= 30) {
				showTags({
					'title': '提示',
					'content': "居住地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}
		} else {

			if(checkAs400ChineseLength($("#s_city").val() + $("#s_county").val() + $("#smallLoanCus-addr-detail").val()) >= 60) {
				showTags({
					'title': '提示',
					'content': "居住地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}
			if($("#smallLoanCus-addr-detail").val().length + $("#s_city").val().length + $("#s_county").val().length >= 30) {
				showTags({
					'title': '提示',
					'content': "居住地址长度不能超过29位。",
					'ok': {}
				});
				return;
			}

		}
		smallLoanCusManJson.messageCache = true; //信息缓存
		casheSmallLoanCusMessage();

		$.mobile.changePage('smallLoanCusManage-cusconfirm.html', {
			transition: "slide"
		});
	});

});

//客户信息确认界面
$(document).on('pageshow', '#smallLoanCusManage-cusconfirm', function() {
	if(smallLoanCusManJson.role == '1') { //当选择的用户是普通用户时不显示申请表
		$("#applicationform").hide();
	}

	smallLoanCusManJson.platGlobalSeq = undefined;
	smallLoanCusManJson.hasYZM = smallLoanCusManJson.hasQM = false;

	$("#smallLoanCus-proName").text(smallLoanCusManJson.proName);
	$("#applicationform").attr('applyformpath', smallLoanCusManJson.originapplyform); //将这笔申请的申请书路径赋值到属性applyformpath
	$('#smallLoanCus-name').text(custermerInfo.name);
	$('#smallLoanCus-cerNo').text(custermerInfo.cerNO);
	$("#smallLoanCus-mobile").text(smallLoanCusManJson.mobile); //手机号码
	$("#smallLoanCus-addr-home").text(smallLoanCusManJson.day_b ? (smallLoanCusManJson.day_b + smallLoanCusManJson.day_c + smallLoanCusManJson.addrHome) : smallLoanCusManJson.addrHome); //经营地址详细地址
	$("#smallLoanCus-addr-detail").text(smallLoanCusManJson.s_city ? (smallLoanCusManJson.s_city + smallLoanCusManJson.s_county + smallLoanCusManJson.addrDetail) : smallLoanCusManJson.addrDetail); //居住地址详细地址
	$("#smallLoanCus-marriage").text(smallLoanMarriage[smallLoanCusManJson.marriage]); //婚姻状况
	$("#smallLoanCus-com-name").text(smallLoanCusManJson.companyName); //工作单位
	$("#ZhiWu").text(smallLoanHeadShip[smallLoanCusManJson.ZhiWu]); //职务
	$("#smallLoanCus-income").text(fmoney(smallLoanCusManJson.income)); //月收入
	$('#smallLoanCus-f-income').text(fmoney(smallLoanCusManJson.familyIncome)); //家庭月收入

	//点击修改按钮
	$('#smallLoanCusManage-cusconfirm .basic_header .reWrite').on('click', function() {
		if(smallLoanCusManJson.codeTime) {
			clearInterval(smallLoanCusManJson.codeTime);
		}
		smallLoanCusManJson.signHref = '';
		$.mobile.changePage('./smallLoanCusManage-messageinput.html', {
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
			smallLoanCusManJson.signHref = data.replace('data:image/png;base64,', '');
			if($('#qianOK #ic_agree').css('display') == 'none') {
				$('.qianM_shadow').show();
				$('#qianOK #ic_disagree').hide();
				$('#qianOK #ic_agree').show();
				$('#qianOK').attr('qmImg', data.replace('data:image/png;base64,', ''));
				$("#clear-botton").css("color", "#CCCCCC");
				smallLoanCusManJson.hasQM = true;
			} else {
				smallLoanCusManJson.hasQM = false;
				$('.qianM_shadow').hide();
				$('#qianOK #ic_disagree').show();
				$('#qianOK #ic_agree').hide();
				$("#clear-botton").css("color", "#0F45A7");
			}
		}
	});

	if(smallLoanCusManJson.signature && smallLoanCusManJson.signHref) {
		smallLoanCusManJson.signature = false;
		$('.ic_down').trigger('click');
		$('#qianOK #ic_agree').show();
		$('#qianOK #ic_disagree').hide();
		$('.qianM_shadow').show();
		$("#clear-botton").css("color", "#CCCCCC");
		smallLoanCusManJson.hasQM = true;
		var img = new Image();
		img.src = 'data:image/png;base64,' + smallLoanCusManJson.signHref;
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
		if(smallLoanCusManJson.codeTime) {
			clearInterval(smallLoanCusManJson.codeTime);
		}
		$('#inp').val('');
		$('.codetime').html('请在<span style="color:red;">80秒</span>内输入验证码');
		$('.codetime').show();
		//获取验证码
		getImessageAuthentionServiceFun(smallLoanCusManJson, smallLoanCusManJson.codeTime, function() {
			smallLoanCusManJson.hasYZM = true;
			var num = 80; //设置验证码有效定时器
			smallLoanCusManJson.codeTime = setInterval(function() {
				num--;
				$('.codetime').html('请在<span style="color:red;">' + num + '秒</span>内输入验证码');
				if(num <= 0) {
					clearInterval(smallLoanCusManJson.codeTime);
					$('#getMsg').removeClass('cannt-click').text('重新获取');
					$('.codetime').html('请在<span style="color:red;">0秒</span>内输入验证码');
					smallLoanCusManJson.hasYZM = false;
					$('#inp').removeAttr('disabled').val('');
					smallLoanCusManJson.USER_NO = "";
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
			smallLoanCusFindCreditReportInquirySucc(msg);
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
		smallLoanCusManJson.zhengxinArr = [];
		$('.searchCredit ul>li[sel=true]').each(function(index, ele) {
			var creditInfo = $(ele).data('creditInfo');
			if(creditInfo.creditReferPath) {
				$.each(creditInfo.creditReferPath.split(';'), function(index, path) {
					smallLoanCusManJson.zhengxinArr.push(path);
				});
			}
			smallLoanCusManJson.zhengxinArr.push(creditInfo.accredit); //征信授权书
		});
		$(".searchCredit").hide();
	});

	//点击查看征信报告
	$('.searchCredit ul').delegate('u', 'tap', function() {
		smallLoanCusManJson.creditInfo = $(this).closest('li').data('creditInfo');
		smallLoanCusManJson.creditReferPath = smallLoanCusManJson.creditInfo.creditReferPath;
		openCreditReportFile(smallLoanCusManJson, 'F0005');
	});

	//点击查看银行对账单
	$('.linkClick a:eq(1)').on('click', function() {
		showLoader("对账单查询中...");
		var inquiryDate = dateGetYMD(30); //查询30天的对账单文件
		var sendJson = {
			"b": [{
				"deviceNo.s": commonJson.udId, //设备编号
				"moduleId.s": smallLoanCusManJson.moduleId, //模块编号
				"tranId.s": smallLoanCusManJson.tranId, //交易编号
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
		findStatementConF(sendJson, smallLoanCusFindStatementMainSucc);
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
		smallLoanCusManJson.fillListArr = [];
		$('.searchBank ul>li[sel=true]').each(function(index, val) {
			smallLoanCusManJson.fillListArr.push($(val).attr('creditReferPath'));
		});
		$(".searchBank").hide();
	});
	//点击查看对账单文件
	$('.searchBank ul').delegate('u', 'tap', function() {
		smallLoanCusManJson.creditReferPath = $(this).closest('li').attr('creditReferPath');
		getFileDataAndOpen(smallLoanCusManJson, 'F0010');
	});

	//点击申请表预览
	$('.linkClick a:eq(2)').on('click', function() {
		smallLoanCusManJson.signature = true;
		getFileAndShow(smallLoanCusManJson.originapplyform, 'F00007');
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
		if(smallLoanCusManJson.USER_NO === '' || !(smallLoanCusManJson.hasYZM)) {
			showMsg('请点击获取短信验证码!');
			return;
		}
		smallLoanCusManJson.msgInfo = $('#smallLoanCusManage-cusconfirm #inp').val();
		if(!(fmReg.pwD6.test(smallLoanCusManJson.msgInfo))) {
			showMsg('请输入正确格式的短信验证码!');
			return;
		}
		if(!(smallLoanCusManJson.hasQM)) {
			showMsg('请确认签名!');
			return;
		}
		if(smallLoanCusManJson.codeTime) {
			clearInterval(smallLoanCusManJson.codeTime);
			smallLoanCusManJson.hasYZM = false;
			$('#getMsg').removeClass('cannt-click').text('重新获取');
			$('.codetime').html('请在<span style="color:red;">0秒</span>内输入验证码');
			$('#inp').removeAttr('disabled').val('');
		}
		showLoader('短信验证码验证中...');
		ckeckImessageAuthentionServiceYFun(smallLoanCusManJson, sloanCusCkeckImessageAuthentionServiceYFun);
	});
});

//小贷客户信息管理提交完成界面
$(document).on('pageshow', '#smallLoanCusManage-complete', function() {

	$('.name_cn').text(custermerInfo.name); //申请人姓名
	$('.zheng_num').text(custermerInfo.cerNO); //证件号码
	$('.cus_type').text(smallLoanCustomerType[smallLoanCusManJson.applyTo]);
	$('.phone_num').text(smallLoanCusManJson.mobile); //手机号码

	$('#cm_btn_next').on('click', function() {
		$.mobile.changePage('../main.html', {
			reverse: true
		});
	})
});