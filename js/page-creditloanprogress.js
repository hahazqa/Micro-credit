//信用贷款进度查询界面
$(document).on('pageshow', '#creditloan-queryProgress', function() {

	if(commonJson.losUserId == '') {
		showTags({
			'title': '提示',
			'content': '没有LOS用户号,无法办理贷款业务!',
			'ok': {
				fun: function() {
					$.mobile.changePage('../main.html');
				}
			}
		});
		return;
	}
	//初始化起止日期，当前时间和当前时间减去10天
	$("#jieshuDate").val(appTime.appCurDate('-'));
	$("#kaishiDate").val(appTime.appPreDate('-', 1000 * 60 * 60 * 24 * 10));

	//	showLoader('信用贷款进度查询中...');

	//点击搜索按钮事件
	$('#creditloan-queryProgress .seach-botton').on('click', function() {
		$('#kehuname').val('');
		$('#zhengjiannumber').val('');
		$('#moneystart').val('');
		$('#moneyend').val('');
		$('#monthstart').val('');
		$('#monthend').val('');
		$('#creditloan-queryProgress .search-day-con').show();
	});

	//点击搜索框的放弃按钮
	$('.fangqi-seach').eq(0).on('click', function() {
		$('.search-day-con').hide();
	});

	creditloanapplicationObj.numIndex = '';
	creditloanapplicationObj.responseCode = '';

	var timeStart, timeEnd;

	var timeEnd = appTime.appCurDate(''); //当前时间
	var timeStart = appTime.appPreDate('', 1000 * 60 * 60 * 24 * 10);

	CreditloanProcessQueryFun(1, timeStart, timeEnd);

	//点击按姓名搜索的图片
	$('#img_sousuo').on('click', function() {
		creditloanapplicationObj.numIndex = '';
		creditloanapplicationObj.responseCode = '';

		var cusName = $('#daikuan_name_sousuo').val();
		if(cusName == "" || !fmReg.cnName.test(cusName)) {
			showMsg(fmRegMsg.cnName);
			return;
		}
		CreditloanProcessQueryFun(1, timeStart, timeEnd, '', '', $.trim(cusName));

	});

	//按姓名搜索--点击键盘的确定键
	$('#daikuan_name_sousuo').on('keydown', function(eve) {
		creditloanapplicationObj.numIndex = '';
		creditloanapplicationObj.responseCode = '';

		var keyCode = eve.keyCode;
		if(keyCode == '13') {
			var cusName = $(this).val();
			if(cusName == "" || !fmReg.cnName.test(cusName)) {
				showMsg(fmRegMsg.cnName);
				return;
			}
			CreditloanProcessQueryFun(1, timeStart, timeEnd, '', '', $.trim(cusName));
		}

	});

	//点击搜索框内的搜索按钮事件
	$('.fangqi-seach').eq(1).on('click', function() {

		creditloanapplicationObj.numIndex = '';
		creditloanapplicationObj.responseCode = '';

		var sT = $("#kaishiDate").val(); //获取开始时间
		var eT = $("#jieshuDate").val(); //获取结束时间
		var sMoney = $('#moneystart').val(); //获取查询起点金额
		var eMoney = $('#moneyend').val(); //获取查询结束金额
		var sMonth = $('#monthstart').val(); //获取查询起始期限-月
		var eMonth = $('#monthend').val(); //获取查询结束期限-月

		//		console.log("起始时间：" + sT);
		//		console.log("终止时间：" + eT);
		//		console.log("起点金额：" + sMoney);
		//		console.log("终止金额：" + eMoney);
		//		console.log("起始月份：" + sMonth);
		//		console.log("终止月份：" + eMonth);
		//		console.log("格式化后起始时间" + myTime.DateToUnix(sT));

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

		//金额规则校验
		if(sMoney == "" && eMoney != "") {
			showMsg('请输入起点金额');
			return;
		}

		if(sMoney != "" && eMoney == "") {
			showMsg('请输入终止金额');
			return;
		}

		if(parseFloat(sMoney) > parseFloat(eMoney)) {
			showMsg('起点金额应小于终止金额');
			return;
		}

		//起始查询金额格式验证
		if(sMoney == '' || sMoney == null) {

		} else {
			if(!(fmReg.loanNum.test(sMoney))) {
				showMsg('请输入正确格式的金额,保留两位小数！');
				$("#moneystart").val('');
				return false;
			}
		}

		//终止查询金额格式验证
		if(eMoney == '' || eMoney == null) {

		} else {
			if(!(fmReg.loanNum.test(eMoney))) {
				showMsg('请输入正确格式的金额,保留两位小数！');
				$("#moneyend").val('');
				return false;
			}
		}

		//期限规则校验
		if(sMonth == "" && eMonth != "") {
			showMsg('请输入起始期限！');
			return;
		}

		if(sMonth != "" && eMonth == "") {
			showMsg('请输入终止期限！');
			return;
		}

		if(parseInt(sMonth) > parseInt(eMonth)) {
			showMsg('起始期限应小于终止期限！');
		}

		if(sMonth == '' || sMonth == null) {

		} else {
			if(!(fmReg.numSZ.test(sMonth))) {
				showMsg('起始月份应为整数！');
				$("#monthstart").val('');
				return false;
			}
		}

		if(eMonth == '' || eMonth == null) {

		} else {
			if(!(fmReg.numSZ.test(eMonth))) {
				showMsg('终止月份应为整数！');
				$("#monthend").val('');
				return false;
			}
		}
		//获取客户名字
		var cusName = $('#kehuname').val();
		//获取客户证件号
		//		var cusNo = $('#zhengjiannumber').val();

		if($("#zhengjiannumber").val() == '') {

		} else {
			//验证身份证
			if(!(fmReg.cerNo.test($('.input-test-con').eq(1).val()))) {
				showMsg('您输入的证件号码有误，请重新输入！');
				$("#zhengjiannumber").val('');
				return false;
			}
		}

		//		if(cusNo != "" && !fmReg.cerNo.test(cusNo)) {
		//			showMsg(fmRegMsg.cerNo);
		//			return;
		//		}
		$('.search-day-con').hide();
		CreditloanProcessQueryFun(1, dateYYYYMMDD(sT), dateYYYYMMDD(eT), sMonth, eMonth, $.trim(cusName), $.trim($("#zhengjiannumber").val()), $("#banlijindu").val(), sMoney, eMoney);

	});

	$('#daikuan_bucongziliao').on('click', function() {
		if(!($('#daikuan_bucongziliao').hasClass('btn_next'))) return;
		if($('.queryProcess-con').find('.list-bgcolor')) {
			creditloanapplicationObj.numIndex = ($('#queryProcess-con').find('.list-bgcolor').index());
		}
		$.mobile.changePage('creditloan-addData.html');
	});
});

//信用贷款补充资料界面
$(document).on('pageshow', '#creditloan-addData', function() {
	var busiInfo = (creditloanapplicationObjon[creditloanapplicationObj.numIndex])[0];

	queryCreditloanAddDataMenuIdFun(busiInfo);

	$('.information-show li').eq(2).find('span').text(busiInfo.CUSTOMER_NAME); //申请人
	$('.information-show li').eq(3).find('span').text(busiInfo.DOCUMENT_ID); //证件号码
	$('.information-show li').eq(4).find('span').text(busiInfo.APPLY_TIME); //申请时间
	$('.information-show li').eq(5).find('span').text(transmoney(busiInfo.BUSINESSSUM)); //申请金额

	creditloanapplicationObj.zhengxinArr = [];
	creditloanapplicationObj.apppicFileARR = [];
	creditloanapplicationObj.custFileArr = [];
	creditloanapplicationObj.videoable = '';
	creditloanapplicationObj.picFileARR = [];
	creditloanapplicationObj.imageObj = {};
	creditloanapplicationObj.approveFileArr = [];
	creditloanapplicationObj.fillListArr = [];
	var APPLY_NO = busiInfo.APPLY_NO;

	//	var imgSwiper = new Swiper('.img-swiper-container', {
	//		pagination: '.swiper-pagination',
	//		observer: true
	//			//pagination : '#swiper-pagination1',
	//	});
	//
	//	var imgWrapperCon = $('#swiper-wrapper-con');
	//	var opvObj = $('#ziliaoleixing');
	//		//清理图片缓存
	//		opvObj.find('option').each(function(i, d) {
	//			var _opv = $(d).attr('value');
	//			TempCache.removeCache('img_' + _opv);
	//		});
	//	
	//		opvObj.on('change', function() {
	//			var opV = $(this).val();
	//			var htmlTemp = TempCache.getCache('img_' + opV);
	//			if(htmlTemp && htmlTemp != undefined) {
	//				imgWrapperCon.html(htmlTemp);
	//				setTimeout(function() {
	//					imgSwiper.slideTo(0, 0, false)
	//				}, 200)
	//			} else {
	//				//当前选项没有图片时清空
	//				imgWrapperCon.html('');
	//			}
	//		})
	//
	//	//计算图片数量
	//	function imgNumber() {
	//		//计算图片数量
	//		var opVObj = $('#ziliaoleixing option:selected');
	//		var imgNum = imgWrapperCon.children('.swiper-slide').length;
	//		var _num = opVObj.find('.img-num');
	//		if(!_num.length) {
	//			_num = $('<span class="img-num"></span>');
	//			opVObj.append(_num);
	//		}
	//		if(imgNum == 0) {
	//			_num.remove();
	//		} else {
	//			_num.show().html('(' + imgNum + ')');
	//		}
	//	}
	//
	//	//点击拍摄按钮进行拍照
	//	$('#creditloan-addData .additional-materials-paishe').on('click', function() {
	//
	//		//获取拍摄的option文本和value
	//		var opVObj = $('#ziliaoleixing option:selected');
	//		var opV = opVObj.val();
	//
	//		Meap.media('camera', $('#ziliaoleixing option:selected').attr('picName'), function(msg) {
	//
	//			creditloanapplicationObj.isPicture = true;
	//			if(!($('#submitBtn').hasClass('btn_next'))) {
	//				$('#submitBtn').addClass('btn_next');
	//			}
	//
	//			var _id = 'img_' + new Date().getTime();
	//			//根据资料类型不同，传入到不同的包中
	//			if($('#ziliaoleixing option:selected').attr('fileType') == '00005') { //客户资料
	//				var imgObj = {};
	//				imgObj.fileRoute = msg;
	//				imgObj.fileId = _id;
	//				imgObj.fileType = '00005';
	//				creditloanapplicationObj.custFileArr.push(imgObj);
	//				console.log(creditloanapplicationObj.custFileArr);
	//			} else { //受理审批资料
	//				var imgObj = {};
	//				imgObj.fileRoute = msg;
	//				imgObj.fileId = _id;
	//				imgObj.fileType = '00006';
	//				creditloanapplicationObj.approveFileArr.push(imgObj);
	//				console.log(creditloanapplicationObj.approveFileArr);
	//
	//			}
	//
	//			imgWrapperCon.prepend('<div class="swiper-slide" fileid="' + _id + '"><img src="../../images/ic_delete.png" class="lajitong_icon"/><img src="' + msg + '" width="100%" height="100%"  class="camera-pic"></div>');
	//
	//			imgNumber();
	//
	//			TempCache.cache('img_' + opV, imgWrapperCon.html());
	//			setTimeout(function() {
	//				imgSwiper.slideTo(0, 0, false)
	//			}, 200)
	//			$('#ziliaoleixing').selectmenu('refresh');
	//		}, function(err) {
	//			showMsg(err);
	//		});
	//
	//	});
	//
	//	imgWrapperCon.delegate('.lajitong_icon', 'click', function() {
	//		var _this = $(this);
	//		showTags({
	//			'title': '提示',
	//			'content': '你确定要删除该图片吗？',
	//			'ok': {
	//				'title': '取消', //非必输  默认值：确定
	//				'fun': function() {
	//
	//				}
	//			},
	//			'cancel': {
	//                  'title': '确定', //非必输  默认值：取消
	//                  'fun': function() {
	//                  var _slide = _this.parents('.swiper-slide');
	//                  var _fileid = _slide.attr('fileid');
	//                  if ($('#ziliaoleixing option:selected').attr('fileType') == "00005") {
	//                      if (typeof creditloanapplicationObj.custFileArr === 'object') {
	//                          $.each(creditloanapplicationObj.custFileArr, function (i, d) {
	//                              if (d && d.fileId && d.fileId == _fileid) {
	//                                  creditloanapplicationObj.custFileArr.splice(i, 1);
	//                              }
	//                          })
	//                      }
	//                  } else {
	//                      if (typeof creditloanapplicationObj.approveFileArr === 'object') {
	//                          $.each(creditloanapplicationObj.approveFileArr, function (i, d) {
	//                              if (d && d.fileId && d.fileId == _fileid) {
	//                                  creditloanapplicationObj.approveFileArr.splice(i, 1);
	//                              }
	//                          })
	//                      }
	//                  }
	//                  var arrLength = creditloanapplicationObj.custFileArr.length + creditloanapplicationObj.approveFileArr.length + creditloanapplicationObj.zhengxinArr.length + creditloanapplicationObj.fillListArr.length;
	//                  if(arrLength > 0){
	//                      $('#submitBtn').addClass('btn_next');
	//                  }else{
	//                      $('#submitBtn').removeClass('btn_next');
	//                  }
	//                  if (_slide.length) _slide.remove();
	//
	//                  var opV = $('#ziliaoleixing option:selected').val();
	//                  TempCache.cache('img_' + opV, imgWrapperCon.html());
	//                  imgNumber();
	//                  $("#ziliaoleixing").selectmenu('refresh');
	//              }
	//          }
	//		});
	//		return false;
	//	})

	$('.zxbgBtn').on('click', function() {
		showLoader("征信报告查询中...");
		var inquiryDate = dateGetYMD(30); //查询30天的征信文件
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
				"name.s": busiInfo.CUSTOMER_NAME, //姓名 
				"certNum.s": busiInfo.DOCUMENT_ID, //证件号码 
				"status.s": '1,3', //状态(成功和不需查询征信报告)
				"page.s": '', //页码
				"username.s": '',
				'creditType.s': '', //征信类型
				'supplementInd.s': '' //是否允许补查
			}]
		};
		findCreditReportInquiryFun(sendJson, function(msg) {
			creditLoanFindCreditReportInquirySucc(msg);
		}, function(err) {
			hideLoader();
			funFail(err);
		});
	});
	//点击选择征信文件页面  放弃按钮
	$('.searchCredit a:first').on('click', function() {
		$('.searchCredit').hide();
	});
	//点击选择征信文件页面  确认按钮
	$('.searchCredit a:last').on('click', function() {
		if(!$(this).hasClass('btn_next')) {
			return;
		}
		creditloanapplicationObj.zhengxinArr = [];
		$('.searchCredit ul>li[sel=true]').each(function(index, ele) {
			var creditInfo = $(ele).data('creditInfo');
			if(creditInfo.creditReferPath) {
				$.each(creditInfo.creditReferPath.split(';'), function(index, path) {
					creditloanapplicationObj.zhengxinArr.push(path);
				});
				//				console.log(creditloanapplicationObj.zhengxinArr);
			}
			creditloanapplicationObj.zhengxinArr.push(creditInfo.accredit); //征信授权书
		});
		var arrLength = creditloanapplicationObj.custFileArr.length + creditloanapplicationObj.approveFileArr.length + creditloanapplicationObj.zhengxinArr.length + creditloanapplicationObj.fillListArr.length;
		if(arrLength > 0) {
			$('#submitBtn').addClass('btn_next');
		} else {
			$('#submitBtn').removeClass('btn_next');
		}
		$(".searchCredit").hide();
	});

	//点击查看征信报告
	$('.searchCredit ul').delegate('u', 'tap', function() {
		loan.creditInfo = $(this).closest('li').data('creditInfo');
		loan.creditReferPath = loan.creditInfo.creditReferPath;
		openCreditReportFile(loan, 'F0005');
	});
	//	$("#ziliaoqingdan").on('click', function() {
	//		$(".submitted-successfully").show();
	//		showLoader("原交易资料清单查询中");
	//		var queryJson = { //查询原交易上送资料清单
	//			"b": [{
	//				"deviceNo.s": commonJson.udId, //设备编号
	//				"moduleId.s": '80', //模块编号
	//				"tranId.s": '100', //loan.tranId, //交易编号
	//				"orgId.s": commonJson.orgId, //机构号
	//				"operatorNo.s": commonJson.adminCount, //操作员
	//				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
	//				"workAddress.s": commonJson.workAddress, //工作地址
	//				"cus_no.s": 'K2016041400000001', //客户流水号，LOS返
	//				"apply_no.s": 'BA2016061200000001' //贷款申请编号，LOS返
	//			}]
	//		};
	//		queryOriginalMaterials(queryJson, function(msg) {
	//			console.log(queryJson);
	//			queryOriginalMaterialSucc(msg);
	//		}, function(err) {
	//			funFail(err);
	//		});
	//	})

	//	$(".head-all head-right").on('click',function(){
	//		$(".submitted-successfully").hide();
	//	})
	//点击对账单按钮
	$('.dzdBtn').on('click', function() {
		showLoader("对账单查询中...");
		var inquiryDate = dateGetYMD(30); //查询30天内的对账单文件
		var sendJson = {
			"b": [{
				"deviceNo.s": commonJson.udId, //设备编号
				"moduleId.s": smallLoan.moduleId, //模块编号
				"tranId.s": smallLoan.tranId, //交易编号
				"orgId.s": commonJson.orgId, //机构号
				"operatorNo.s": commonJson.adminCount, //操作员
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"inquiryDateMin.s": dateYYYYMMDD(inquiryDate[1]), //dateYYYYMMDD(dateGetYMD(10)[1]),  //查询日期时间
				"inquiryDateMax.s": dateYYYYMMDD(inquiryDate[0]), //dateYYYYMMDD(dateGetYMD(10)[0]),   //查询日期时间
				"name.s": busiInfo.CUSTOMER_NAME, //姓名
				"certNum.s": busiInfo.DOCUMENT_ID, //证件号码
				"account.s": '', //账号
				"status.s": '1', //状态
				"page.s": '' //页码
			}]
		};
		//		console.log(sendJson);
		findStatementConF(sendJson, findStatementAddDataSucc);
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
		creditloanapplicationObj.fillListArr = [];
		$('.searchBank ul>li[sel=true]').each(function(index, val) {
			creditloanapplicationObj.fillListArr.push($(val).attr('creditReferPath'));
		});
		console.log(creditloanapplicationObj.fillListArr);
		var arrLength = creditloanapplicationObj.custFileArr.length + creditloanapplicationObj.approveFileArr.length + creditloanapplicationObj.zhengxinArr.length + creditloanapplicationObj.fillListArr.length;
		if(arrLength > 0) {
			$('#submitBtn').addClass('btn_next');
		} else {
			$('#submitBtn').removeClass('btn_next');
		}
		$(".searchBank").hide();
	});
	$('.searchBank ul').delegate('u', 'tap', function() {
		showLoader('文件查询中...');
		loan.creditReferPath = $(this).closest('li').attr('creditReferPath');
		getFileDataAndOpen(loan, 'F0010');
	});

	//点击提交按钮
	$('#submitBtn').on('click', function() { //点击提交完成按钮 
		var bczlwjsl5 = '';
		var bczlwjsl6 = '';
		if(!($('#submitBtn').hasClass('btn_next'))) return;
		showLoader("贷款补充资料提交中...");
		creditloanapplicationObj.picFileInfoARR = [{
			"b": []
		}];
		creditloanapplicationObj.picFileARR = []; //提交优化 ---->防止重复提交导致文件重复
		creditloanapplicationObj.apppicFileARR = []; //提交优化 ---->防止重复提交导致文件重复
		if(creditloanapplicationObj.isPicture == true) { //存在图片

			for(x in creditloanapplicationObj.custFileArr) { //00005    客户资料包
				creditloanapplicationObj.picFileARR.push(creditloanapplicationObj.custFileArr[x].fileRoute);
			}
			for(x in creditloanapplicationObj.approveFileArr) { //00006  受理审批资料包
				creditloanapplicationObj.apppicFileARR.push(creditloanapplicationObj.approveFileArr[x].fileRoute);
			}
		}
		//		console.log(creditloanapplicationObj.picFileARR);
		//		console.log(creditloanapplicationObj.apppicFileARR);
		//      alert(bczlwjsl5 + bczlwjsl6);
		if(creditloanapplicationObj.picFileARR.length > 0 || creditloanapplicationObj.zhengxinArr.length > 0) {
			bczlwjsl5 = 1;
		} else {
			bczlwjsl5 = 0;
		}
		if(creditloanapplicationObj.apppicFileARR.length > 0 || creditloanapplicationObj.fillListArr.length > 0) {
			bczlwjsl6 = 1;
		} else {
			bczlwjsl6 = 0;
		}
		var fileCount = bczlwjsl5 + bczlwjsl6;
		showLoader('流水编号查询中');
		var sendJson = {
			"b": [{
				"deviceNo.s": commonJson.udId, //设备编号
				"moduleId.s": loan.moduleId, //模块编号
				"tranId.s": loan.tranId3, //交易编号
				"orgId.s": commonJson.orgId, //机构号
				"operatorNo.s": commonJson.adminCount, //操作员
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"CLIENT_NAME.s": (creditloanapplicationObjon[creditloanapplicationObj.numIndex])[0].CUSTOMER_NAME, //客户姓名
				"DOCUMENT_TYPE.s": '0', //证件类型
				"resend.s": '1', //补充资料
				"fileCount.s": '' + fileCount, //补充资料文件的数量
				"APPLY_NO.s": (creditloanapplicationObjon[creditloanapplicationObj.numIndex])[0].APPLY_NO, //业务申请编号
				"CUSTOMER_NO.s": (creditloanapplicationObjon[creditloanapplicationObj.numIndex])[0].CUSTOMER_NO, //客户流水号
				"DOCUMENT_ID.s": (creditloanapplicationObjon[creditloanapplicationObj.numIndex])[0].DOCUMENT_ID //证件号码
			}]
		};

		getPlatGlobalSeqFun(sendJson, function(msg) {
			getPlatGlobalSeqZLSCSucc(msg);
		}, function(err) {
			funFail(err);
		});

		function getPlatGlobalSeqZLSCSucc(msg) {
			var responseBody = responseBodySuccFormat(msg);
			if(responseBody[0].results == '00') {
				applicationObj.plSeq = responseBody[0].platGlobalSeq; //获取平台流水
				if(applicationObj.plSeq != '') {
					var phoneTime = myTime.CurTime();
					if(creditloanapplicationObj.picFileARR.length > 0 || creditloanapplicationObj.zhengxinArr.length > 0) {
						MT_zipCompression('loanType', applicationObj.plSeq + 'CustInfo', creditloanapplicationObj.picFileARR, function(msg1) {
							//将要上传的影像插入到ios断点上传的数据库中
							//影像上传 业务参数
							var appBus = {
								'busiGloablaSeq': applicationObj.plSeq, //业务编号
								'TRADE_TYPE': '00005', //客户资料
								'APPLY_NO': (creditloanapplicationObjon[creditloanapplicationObj.numIndex])[0].APPLY_NO, //业务申请编号
								'CUSTOMER_NO': (creditloanapplicationObjon[creditloanapplicationObj.numIndex])[0].CUSTOMER_NO, //客户流水号
								'attchType': '0', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
								'deviceNo': commonJson.udId, //设备编号
								'moduleId': loan.moduleId, //模块编号
								'tranId': creditloanapplicationObj.transId, //信用贷款补充资料交易编号
								'orgId': commonJson.orgId, //机构编号
								'operatorNo': commonJson.adminCount, //操作员
								'custName': (creditloanapplicationObjon[creditloanapplicationObj.numIndex])[0].CUSTOMER_NAME, //客户名称
								'custCredType': '0', //客户证件类型
								'custCredNo': (creditloanapplicationObjon[creditloanapplicationObj.numIndex])[0].DOCUMENT_ID, //客户证件号
								'offlineOnline': commonJson.offlineOnline, //脱机/联机
								'workAddress': commonJson.workAddress, //工作地址
								'userId': commonJson.losUserId, //los用户
								'OPER_TYPE': 'MOD', //操作类型 add-->表示新增  mod-->表示修改
								'FILE_LIST': creditloanapplicationObj.zhengxinArr //征信文件
							};
							transFormImageAndInsertTableData(appBus, phoneTime, 'cl001', msg1, '3');
						}, function(err) {
							hideLoader();
							showTags({
								'title': '提示',
								'content': '压缩影像失败！',
								'ok': {}
							});
						});
					}
					if(creditloanapplicationObj.apppicFileARR.length > 0 || creditloanapplicationObj.fillListArr.length > 0) {
						MT_zipCompression('loanType', applicationObj.plSeq + 'Apply', creditloanapplicationObj.apppicFileARR, function(msg2) {
							//将要上传的影像插入到ios断点上传的数据库中
							//影像上传 业务参数
							var appBus = {
								'busiGloablaSeq': applicationObj.plSeq, //业务编号
								'TRADE_TYPE': '00006', //客户资料
								'APPLY_NO': (creditloanapplicationObjon[creditloanapplicationObj.numIndex])[0].APPLY_NO, //业务申请编号
								'CUSTOMER_NO': (creditloanapplicationObjon[creditloanapplicationObj.numIndex])[0].CUSTOMER_NO, //客户流水号
								'attchType': '0', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
								'deviceNo': commonJson.udId, //设备编号
								'moduleId': loan.moduleId, //模块编号
								'tranId': creditloanapplicationObj.transId, //信用贷款补充资料交易编号
								'orgId': commonJson.orgId, //机构编号
								'operatorNo': commonJson.adminCount, //操作员
								'custName': (creditloanapplicationObjon[creditloanapplicationObj.numIndex])[0].CUSTOMER_NAME, //客户名称
								'custCredType': '0', //客户证件类型
								'custCredNo': (creditloanapplicationObjon[creditloanapplicationObj.numIndex])[0].DOCUMENT_ID, //客户证件号
								'offlineOnline': commonJson.offlineOnline, //脱机/联机
								'workAddress': commonJson.workAddress, //工作地址
								'userId': commonJson.losUserId, //los用户
								'OPER_TYPE': 'MOD', //操作类型 add-->表示新增  mod-->表示修改
								'FILE_LIST': creditloanapplicationObj.fillListArr //对账单
							};
							transFormImageAndInsertTableData(appBus, phoneTime + 1, 'cl001', msg2, '4');
						}, function(err) {
							hideLoader();
							showTags({
								'title': '提示',
								'content': '压缩影像失败！',
								'ok': {}
							});
						});
					}
					//					var imgWrapperCon = $('#swiper-wrapper-con');
					//					var opvObj = $('#ziliaoleixing');
					//					//清理图片缓存
					//					opvObj.find('option').each(function(i, d) {
					//						var _opv = $(d).attr('value');
					//						TempCache.removeCache('img_' + _opv);
					//					});
					showTags({
						'title': '提示',
						'content': '业务已受理',
						'ok': {
							fun: function() {
								$.mobile.changePage('creditloan-QueryProgress.html');
							}
						}
					});

				} else {
					showTags({
						'title': '提示',
						'content': '流水号为空，请重新提交获取',
						'ok': {}
					});
				}

			} else if(responseBody[0].results == '08') {

			} else {
				showTags({
					'title': '提示',
					'content': responseBody[0].message,
					'ok': {}
				});
			}
		};

	});

});