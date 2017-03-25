/*处理响应体--格式化*/
//function responseBodySuccFormat(msg) {
//  hideLoader();
//  msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//  var responseObj = JSON.parse(msg);
//  var responseCode = responseObj.b;
//  return responseCode;
//}
/**查询补件资料菜单*/
function queryCreditloanAddDataMenuIdFun(busiInfo) {

	showLoader('资料菜单查询中...');
	var sendJson = { //查询可补件菜单
		"b": [{
			"deviceNo.s": commonJson.udId, //设备编号
			"moduleId.s": '80', //模块编号
			"tranId.s": creditloanapplicationObj.transId, //loan.tranId, //交易编号
			"orgId.s": commonJson.orgId, //机构号
			"operatorNo.s": commonJson.adminCount, //操作员
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"PROD_CODE.s": busiInfo.MARKETPRODUCT, //产品编号LOS返回   busiInfo.//未给出
			"PROD_TYPE.s": busiInfo.BUSINESSTYPE, //营销产品 LOS返回  busiInfo.MARKETPRODUCT//未给出
			"MENU_ID.s": creditloanapplicationObj.menuId //菜单编号
		}]
	};
	CreditloanAddDataQueryMenuIdFun(sendJson, function(msg) {
		hideLoader();
		var responseBody = responseBodySuccFormat(msg);
		var textHtml = '<option value= "-1" selected="selected">请选择拍照的内容</option>';

		if(responseBody[0].results == '00') {
			if(responseBody.length < 2) {
				$("#ziliaoleixing").empty();
				alert("查询信用贷款产品可补件资料清单为空，请联系管理员！");
			} else {
				var num = 1;
				$.each(responseBody, function(index, val) {
					if(index == 0) {
						return;
					}
					textHtml += '<option value = "' + num +
						'" picName = "' + val.creditloanAddMaterialVO[0].PICNAME +
						'" fileType = "' + val.creditloanAddMaterialVO[0].FILETYPE +
						'">' + val.creditloanAddMaterialVO[0].NAME +
						'</option>';
					num = num + 1;
				});
				$("#ziliaoleixing").html(textHtml).trigger('create');
				//				$("#ziliaoleixing option:eq(0)").attr("selected", true);
			}

			var imgSwiper = new Swiper('.img-swiper-container', {
				pagination: '.swiper-pagination',
				observer: true
					//pagination : '#swiper-pagination1',
			});

			var imgWrapperCon = $('#swiper-wrapper-con');
			var opvObj = $('#ziliaoleixing');
			//清理图片缓存
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

			//计算图片数量
			function imgNumber() {
				//计算图片数量
				var opVObj = $('#ziliaoleixing option:selected');
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

			//点击拍摄按钮进行拍照
			$('#creditloan-addData .additional-materials-paishe').on('click', function() {

				//获取拍摄的option文本和value
				var opVObj = $('#ziliaoleixing option:selected');
				var opV = opVObj.val();

				if(opV == '-1') {
					showTags({
						'title': '提示',
						'content': '请选择拍照内容！',
						'ok': {}
					});
					return false;
				}

				Meap.media('camera', $('#ziliaoleixing option:selected').attr('picName'), function(msg) {

					creditloanapplicationObj.isPicture = true;
					if(!($('#submitBtn').hasClass('btn_next'))) {
						$('#submitBtn').addClass('btn_next');
					}

					var _id = 'img_' + new Date().getTime();
					//根据资料类型不同，传入到不同的包中
					if($('#ziliaoleixing option:selected').attr('fileType') == '00005') { //客户资料
						var imgObj = {};
						imgObj.fileRoute = msg;
						imgObj.fileId = _id;
						imgObj.fileType = '00005';
						creditloanapplicationObj.custFileArr.push(imgObj);
						console.log(creditloanapplicationObj.custFileArr);
					} else { //受理审批资料
						var imgObj = {};
						imgObj.fileRoute = msg;
						imgObj.fileId = _id;
						imgObj.fileType = '00006';
						creditloanapplicationObj.approveFileArr.push(imgObj);
						console.log(creditloanapplicationObj.approveFileArr);

					}

					imgWrapperCon.prepend('<div class="swiper-slide" fileid="' + _id + '"><img src="../../images/ic_delete.png" class="lajitong_icon"/><img src="' + msg + '" width="100%" height="100%"  class="camera-pic"></div>');

					imgNumber();

					TempCache.cache('img_' + opV, imgWrapperCon.html());
					setTimeout(function() {
						imgSwiper.slideTo(0, 0, false)
					}, 200)
					$('#ziliaoleixing').selectmenu('refresh');
				}, function(err) {
					showMsg(err);
				});

			});

			imgWrapperCon.delegate('.lajitong_icon', 'click', function() {
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
							if($('#ziliaoleixing option:selected').attr('fileType') == "00005") {
								if(typeof creditloanapplicationObj.custFileArr === 'object') {
									$.each(creditloanapplicationObj.custFileArr, function(i, d) {
										if(d && d.fileId && d.fileId == _fileid) {
											creditloanapplicationObj.custFileArr.splice(i, 1);
										}
									})
								}
							} else {
								if(typeof creditloanapplicationObj.approveFileArr === 'object') {
									$.each(creditloanapplicationObj.approveFileArr, function(i, d) {
										if(d && d.fileId && d.fileId == _fileid) {
											creditloanapplicationObj.approveFileArr.splice(i, 1);
										}
									})
								}
							}
							var arrLength = creditloanapplicationObj.custFileArr.length + creditloanapplicationObj.approveFileArr.length + creditloanapplicationObj.zhengxinArr.length + creditloanapplicationObj.fillListArr.length;
							if(arrLength > 0) {
								$('#submitBtn').addClass('btn_next');
							} else {
								$('#submitBtn').removeClass('btn_next');
							}
							if(_slide.length) _slide.remove();

							var opV = $('#ziliaoleixing option:selected').val();
							TempCache.cache('img_' + opV, imgWrapperCon.html());
							imgNumber();
							$("#ziliaoleixing").selectmenu('refresh');
						}
					}
				});
				return false;
			})

		} else if(responseBody[0].results == '09') {
			showTags({
				'title': '提示',
				'content': '系统超时，' + responseBody[0].message + '，是否继续？',
				'cancel': {
					'title': '继续',
					fun: function() {
						queryCreditloanAddDataMenuIdFun(busiInfo);
					}
				},
				'ok': {
					'title': '放弃',
					'fun': function() {
						$.mobile.changePage('./creditloan-QueryProgress.html', {
							reverse: true
						});
					}
				}
			});

		} else if(responseBody[0].results == '08') {
			queryCreditloanAddDataMenuIdFun(busiInfo);
		} else {
			showTags({
				'title': '提示',
				'content': responseBody[0].message,
				'ok': {
					fun: function() {
						$.mobile.changePage('creditloan-QueryProgress.html', {
							reverse: true
						});
					}
				}
			});
		}

	}, function(err) {
		funFail(err);
	});

}

function queryOriginalMaterialSucc(msg) {
	console.log(msg);
	var responseBody = responseBodySuccFormat(msg);
	var textHtml = '';

	if(responseBody[0].results == '00') {
		if(responseBody.length < 2) {
			$("#originalqingdan").empty();
			alert("查询信用贷款产品可补件资料清单为空，请联系管理员！");
		} else {
			$.each(responseBody, function(index, val) {
				if(index == 0) {
					return;
				}
				console.log("vo coming");
				console.log(val.creditloanAddMaterialVO[0]);
				textHtml += '<li>' + pictureTypeObj[val.creditloanAddMaterialVO[0].PICNAME] +
					'<div class="qingdanliebiao_tupian qingdanliebiao_gou"></div></li>';
			});
			$('#originalqingdan').html(textHtml);
		}
	} else {
		showTags({
			'title': '提示',
			'content': responseBody[0].message,
			'ok': {
				//				fun: function() {
				//					$.mobile.changePage('creditloan-QueryProgress.html', {
				//						reverse: true
				//					});
				//				}
			}
		});
	}
}

function creditLoanFindCreditReportInquirySucc(msg) {
	hideLoader();
	var responseBody = responseBodySuccFormat(msg);
	if(responseBody[0].results == '00') { //接口处理成功
		$(".searchCredit ul").empty();
		$.each(responseBody, function(index, val) {
			if(index == 0) {
				return;
			}
			var data = val.creditInquiry[0];
			data.expList = val.creditInquiry[1].expList;
			var creditFile = "";
			$.each(data.creditReferPath.split(';'), function(index, path) {
				var fileName = path.split('/');
				creditFile += fileName[fileName.length - 1] + ',';
			});
			var li = $('<li>').data('creditInfo', data);
			li.append($('<div>').css('width', '20%').html(data.inquiryDate.split(' ')[0]));
			li.append($('<div>').css('width', '20%').html(creditTypeJson[data.creditType]));
			li.append($('<div>').css({
				'width': '50%',
				'overflow-x': 'auto'
			}).append($('<u>').html(creditFile.substr(0, creditFile.length - 1))));
			li.append($('<div>').css('width', '10%').append($('<img>').addClass('dzdImg').attr('src', '../../images/ic_sqwc.png')));
			$(".searchCredit ul").append(li);
		});
		$(".searchCredit").show();
		/*点击 click list*/
		$(".searchCredit ul>li div:last-child").on("click", function() {
			var diaPlay = $(this).find('.dzdImg').css('display');
			if(diaPlay == 'none') {
				$(this).find('.dzdImg').css('display', 'block');
				$(this).closest('li').attr('sel', 'true');
				//              var bro = $(this).closest('li').siblings();
				//              bro.find('.dzdImg').css('display', 'none');
				//              bro.attr('sel', 'false');
			} else {
				$(this).find('.dzdImg').css('display', 'none');
				$(this).closest('li').attr('sel', 'false');
			}
		});
	} else if(responseBody[0].results == '08') { //
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
				"name.s": loan.mInfo.name, //姓名
				"certNum.s": loan.mInfo.cerNO, //证件号码
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
	} else {
		showTags({
			'title': '提示',
			'content': responseBody[0].message,
			'ok': {}
		});
	}
}

//信用贷款进度查询
function CreditloanProcessQueryFun(pageNum, timeStart, timeEnd, sMonth, eMonth, name, certId, state, sMoney, eMoney) {
	showLoader("信用贷款进度查询中...");
	var suoJson = { //发送请求的参数
		"b": [{
			"deviceNo.s": commonJson.udId, //设备编号
			"moduleId.s": loan.moduleId, //模块编号
			"tranId.s": creditloanapplicationObj.transId, //交易编号
			"orgId.s": commonJson.orgId, //机构号commonJson.orgId
			"operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"pageNum.s": pageNum + '', //查询页码
			"pageSize.s": '7', //每页显示的记录数
			"CUSTOMER_NAME.s": name || '', //姓名
			"DOCUMENT_ID.s": certId || '', //证件号
			"BEGIN_DATE.s": timeStart || '', //申请日期开始
			"END_DATE.s": timeEnd || '', //申请日期结束
			"BEGIN_AMT.s": sMoney, //申请起始金额
			"END_AMT.s": eMoney, //申请终止金额
			"BEGIN_TERM.s": sMonth, //申请起始期限
			"END_TERM.s": eMonth, //申请终止期限
			"APPLY_STATUS.s": state || '', //       //办理进度
			"ACCT_EXEC1.s": commonJson.losUserId, // 客户经理
			"QUERY_TYPE.s": '2' //查看类型
		}]
	};
	//	console.log(suoJson);
	ProcessQueryFun(suoJson, function(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;

		console.log(responseCode);
		var textHtml = '';
		if(responseCode[0].results == '00') {
			if(responseCode.length <= 1) {
				textHtml += '<li style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</li>';
				$('.page-number-con').show();
			} else {
				creditloanapplicationObj.responseCode = responseCode[1].processQueryInfoVO;
				creditloanapplicationObjon = [];

				$.each(responseCode, function(ind, ele) {
					var DATA = ele.processQueryInfoVO;
					if(DATA) {
						textHtml += '<li class="box-rows">' +
							'<div>' + DATA[0].CUSTOMER_NAME + '</div>' +
							'<div class="id-card">' + DATA[0].DOCUMENT_ID + '</div>' +
							'<div>' + DATA[0].APPLY_TIME + '</div>' +
							'<div>' + transmoney(DATA[0].BUSINESSSUM) + '</div>' + //申请金额
							'<div>' + DATA[0].TERMMONTH + '月</div>' + //申请期限
							'<div>' + daikuanpcardStatusObj[DATA[0].APPLY_STATUS] + '</div>' +
							'<div>' + DATA[0].DISAGREE_REASON + '</div>' +
							'</li>';

						creditloanapplicationObjon.push(DATA);
					}
				});
			}
			$('#creditloan-queryProgress #queryProcess-con').html(textHtml);

			$('#creditloan-queryProgress .page-number-con').show();

			//分页
			$(".page-number-con").createPage({
				pageCount: Math.ceil(responseCode[0]['totalNum.i'] / 7),
				current: pageNum,
				backFn: function(p) {
					CreditloanProcessQueryFun(p, timeStart, timeEnd, sMonth, eMonth, name, certId, state, sMoney, eMoney);
				}
			});

			//添加轻触加上选中的显示效果事件
			$('#queryProcess-con .box-rows').on('tap', function(ev) {
				var oTarget = ev.target;
				_this = $(oTarget).closest('.box-rows');
				$(_this).addClass('list-bgcolor').siblings().removeClass('list-bgcolor');
				$('#daikuan_bucongziliao').addClass('btn_next');
			});

		} else if(responseCode[0].results == '03') {
			$('.box-content').html('<li style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</li>');
			$('.page-number-con').hide();
		} else if(responseCode[0].results == '08') {
			CreditloanProcessQueryFun(pageNum, timeStart, timeEnd, sMonth, eMonth, name, certId, state, sMoney, eMoney);
		} else if(responseCode[0].results == '09') {
			showTags({
				'title': '提示',
				'content': '查询信息超时！是否继续？',
				'ok': {
					'title': '放弃',
					'fun': function() {
						$.mobile.changePage('../main.html', {
							reverse: true
						});
					}
				},
				'cancel': {
					title: '继续',
					fun: function() {
						CreditloanProcessQueryFun(pageNum, timeStart, timeEnd, sMonth, eMonth, name, certId, state, sMoney, eMoney);
					}
				}
			});
		} else {
			$('.page-number-con').hide();
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}

	}, function(err) {
		funFail(err);
	})

}