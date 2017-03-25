//小贷查询--小贷客户信息管理交易
function SmallLoanCusfindApplicationFunSuss(pageNum, timeStart, timeEnd, name, cerId, state) {
	showLoader("贷款办理进度查询中...");
	var suoJson = { //发送请求的参数
		"b": [{
			"deviceNo.s": commonJson.udId, //设备编号
			"moduleId.s": smallLoanCusManJson.moduleId, //模块编号
			"tranId.s": smallLoanCusManJson.tranId, //交易编号
			"orgId.s": commonJson.orgId, //机构号commonJson.orgId
			"operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"NAME.s": name || '', //姓名
			"UNIFIED_ID.s": cerId || '', //证件号
			"UNIFIED_TYPE.s": '0', //证件类型
			"pageNum.s": pageNum + '', //查询页码
			"pageSize.s": '7', //每页显示的记录数
			"START_DATE.s": timeStart || '', //申请日期开始
			"END_DATE.s": timeEnd || '', //申请日期结束
			"APPLICATION_STATUS.s": state || smallLoanCusManJson.state, //办理进度
			"businessType.s": smallLoanCusManJson.businessType, //查询类型
			"OWNER.s": commonJson.tinyLoanUserId //所属管理员标识符
		}]
	};
	findApplicationFun(suoJson, function(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		var textHtml = '';
		if(responseCode[0].results == "00") { // 接口处理成功
			if(responseCode.length <= 1) {
				textHtml += '<li style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</li>';
				$(".page-number-con").show();
			} else {
				smallLoanCusManJson.responseCode = responseCode[1].tinyLoanApplicationVO;
				smallLoanCusapplicationObjon = [];
				$.each(responseCode, function(i, d) {
					var DATA = d.tinyLoanApplicationVO;
					if(DATA) {
						//拿数据  DATA[0].DISAGREE_REASON
						textHtml += '<li class="box-rows">' +
							'<div>' + DATA[0].NAME + '</div>' +
							'<div class="id-card">' + DATA[0].UNIFIED_ID + '</div>' +
							'<div>' + DATA[0].APPLICATION_TIME + '</div>' +
							'<div>' + DATA[0].LOAN_PRODUCT + '</div>' +
							'<div>' + DATA[0].LOAN_AMOUNT + '</div>' +
							'<div atty = "' + DATA[0].APPLICATION_STATUS + '">' + smallLoanStatusObj[DATA[0].APPLICATION_STATUS] + '</div>' +
							'<div><div class="detail-botton" filepath = "' + DATA[0].appliform + '" channel = "' + DATA[0].CANALIZATION + '">详情</div></div>' +
							'</li>';
						smallLoanCusapplicationObjon.push(DATA);
					}
				});
			};
			$('#queryProcess-con').html(textHtml);
			$(".page-number-con").show();
			$('.previous').eq(1).removeClass('btn_next');
			//分页
			$(".page-number-con").createPage({
				pageCount: Math.ceil(responseCode[0]['totalNum.i'] / 7),
				current: pageNum,
				backFn: function(p) {
					SmallLoanCusfindApplicationFunSuss(p, timeStart, timeEnd, name, cerId, state);
				}
			});
			$('.box-content .box-rows .detail-botton').on('click', function() {
					//				alert('执行点击事件');
					if($.trim($(this).attr('channel')) == 'MA') {//判断进件渠道是否为移动平台
						var filepath = $(this).attr('filepath');
						if(filepath) {
							getFileAndShow(filepath, 'F00007');
						} else {
							showTags({
								'title': '提示',
								'content': '申请书路径为空，请联系技术人员！',
								'ok': {}
							});
						}
					}else{
						showTags({
								'title': '提示',
								'content': '该进件非移动平台渠道，暂不支持查看申请详情！',
								'ok': {}
							});
					}

				})
				//添加事件
			$("#queryProcess-con .box-rows").on('tap', function(ev) {
				var oTarget = ev.target;
				_this = $(oTarget).closest('.box-rows');
				$(_this).addClass('list-bgcolor').siblings().removeClass('list-bgcolor');
				var canmodify = ['1', '2', '5', '6', '9']
				var status = $($(_this).children("div")[5]).attr("atty");
				//				$('.previous').addClass('btn_next');
				//				alert($.inArray(status,canmodify));
				if($.inArray(status, canmodify) != '-1') {
					$('.previous').eq(1).addClass('btn_next');
				} else {
					$('.previous').eq(1).removeClass('btn_next');
				}
			});

		} else if(responseCode[0].results == "03") {
			$('.box-content').html('<li style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</li>');
			$(".page-number-con").hide();
		} else if(responseCode[0].results == "08") {
			SmallLoanCusfindApplicationFunSuss(pageNum, timeStart, timeEnd, name, cerId, state);
		} else if(responseCode[0].results == "09") {
			showTags({
				'title': '提示',
				'content': '查询信息超时！是否继续？',
				'ok': {
					'title': '放弃',
					'fun': function() {
						$.mobile.changePage('smallLoanCusManage-index.html', {
							reverse: true
						});
					}
				},
				'cancel': {
					title: '继续',
					fun: function() {
						SmallLoanCusfindApplicationFunSuss(pageNum, timeStart, timeEnd, name, cerId, state);
					}
				}
			});

		} else {
			$(".page-number-con").hide();
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

//检查用户是否重复签名
function smllLoanCheckCustomerSucc() {
	showLoader('判断客户是否重复补签...');
	var sendJson = {
		"b": [{
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"moduleId.s": smallLoanCusManJson.moduleId, //模块编号 4
			"tranId.s": smallLoanCusManJson.tranId, //交易编号   2
			"operatorNo.s": commonJson.adminCount, //操作员  admin
			"deviceNo.s": commonJson.udId, //设备编号       ""
			"orgId.s": commonJson.orgId,
			"customerType.s": smallLoanCusManJson.role, //客户角色，1-借款人，2-共借人 3-担保人
			"APPLICATION_NO.s": smallLoanCusManJson.applicationno, //申请编号
			"certId.s": custermerInfo.cerNO //身份证号码
		}]
	};

	smllLoanCheckCustomerFun(sendJson, function(msg) {
		var responseBody = responseBodySuccFormat(msg);
		if(responseBody[0].results == '00') {
			smallloanCusIcustomerInfoServiceFun(); //查询核心和平台客户信息
		} else if(responseBody[0].results == '01') {
			showTags({
				'title': '提示',
				'content': responseBody[0].message,
				'ok': {
					fun: function() {
						$.mobile.changePage('smallLoanCusManage-readingID.html', {
							reverse: true
						});
					}
				}
			});
		} else if(responseBody[0].results == '08') {
			smllLoanCheckCustomerSucc();
		} else if(responseBody[0].results == '09') {
			showTags({
				'title': '提示',
				'content': '系统超时！是否继续？',
				'ok': {
					'title': '放弃', //非必输  默认值：确认
					fun: function() {
						$.mobile.changePage('smallLoanCusManage-index.html', {
							reverse: true
						});
					}
				},
				'cancel': {
					'title': '继续', //非必输  默认值：取消
					'fun': function() { //非必输  如果输入则执行此函数
						smllLoanCheckCustomerSucc();
					}
				}
			});
		} else {
			showTags({
				'title': '提示',
				'content': responseBody[0].message,
				'ok': {
					fun: function() {
						$.mobile.changePage('smallLoanCusManage-index.html', {
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
//小贷信息管理交易客户信息查询-查询核心和meap平台
function smallloanCusIcustomerInfoServiceFun() {
	showLoader('客户信息查询中...');
	var sendJson = {
		"b": [{
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"moduleId.s": smallLoanCusManJson.moduleId, //模块编号 4
			"tranId.s": smallLoanCusManJson.tranId, //交易编号   2
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
			"REVERSE_FLAG.s": "D" //证件号内部检查标志 默认D
		}]
	};
	//核心联查
	icustomerInfoServiceFun(sendJson, function(msg) {
		var responseBody = responseBodySuccFormat(msg);
		if(responseBody[0].results == "00") {
			if($.trim(responseBody[1].customerInfoVO[0].CH_CLIENT_NAME) != '' && $.trim(responseBody[1].customerInfoVO[0].CH_CLIENT_NAME) != custermerInfo.name) {
				showTags({
					'title': '提示',
					'content': '核心系统已登记户名不一致！',
					'ok': {
						fun: function() {
							$.mobile.changePage('smallLoanCusManage-index.html', {
								reverse: true
							});
						}
					}
				});
				return;
			}
			smallLoanCusManJson.CLIENT_NO = responseBody[1].customerInfoVO[0].CLIENT_NO; //获取客户号

			$.mobile.changePage('smallLoanCusManage-cusPictures.html');
			//			$.mobile.changePage('smallLoan-cusPicture.html');
			// $.mobile.changePage('smallLoan-testLimit.html');
		} else if(responseBody[0].results == "08") {
			smallloanCusIcustomerInfoServiceFun();
		} else if(responseBody[0].results == "12") {
			showTags({
				'title': '提示',
				'content': '核心系统客户信息异常！',
				'ok': {
					fun: function() {
						$.mobile.changePage('smallLoanCusManage-index.html', {
							reverse: true
						});
					}
				}
			});
		} else if(responseBody[0].results == "09") {

			showTags({
				'title': '提示',
				'content': '查询核心超时！是否继续？',
				'ok': {
					'title': '放弃', //非必输  默认值：确认
					fun: function() {
						$.mobile.changePage('smallLoanCusManage-index.html', {
							reverse: true
						});
					}
				},
				'cancel': {
					'title': '继续', //非必输  默认值：取消
					'fun': function() { //非必输  如果输入则执行此函数
						smallloanCusIcustomerInfoServiceFun();
					}
				}
			});
		} else {
			showTags({
				'title': '提示',
				'content': responseBody[0].message,
				'ok': {
					fun: function() {
						$.mobile.changePage('smallLoanCusManage-index.html', {
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

//照片拍摄完成后查询核心和平台客户信息反显
function IQueryCustomerInformationServiceSmallLoanCusSucc() {
	showLoader("客户信息查询中...");
	var sendJson = {
		"b": [{
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"orgId.s": commonJson.orgId, //机构号
			"moduleId.s": smallLoanCusManJson.moduleId, //模块编号
			"tranId.s": smallLoanCusManJson.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员
			"deviceNo.s": commonJson.udId, //设备编号
			"IDTYPE.s": "0", //证件类型
			"IDNO.s": custermerInfo.cerNO, //证件号
			'CLIENT_TYPE.s': 'P',
			'CLIENT_NO.s': smallLoanCusManJson.CLIENT_NO
		}]
	};
	IEstablishCustomerInformationServicetWOFFun(sendJson, function(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		if(responseCode[0].results == '00') {
			smallLoanCusManJson.mobile = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[1].contactInfo[0].CONTACT_ID); //手机号码
			smallLoanCusManJson.zipcode = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].POSTAL_CODE); //邮编
			smallLoanCusManJson.addrHome = $.trim(responseCode[1].clientDescVO[0].EMPLOYER_ADD); //经营地址
			smallLoanCusManJson.addrDetail = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[1].contactInfo[0].ADDRESS2); //居住地址
			smallLoanCusManJson.occup = $.trim(responseCode[1].clientDescVO[0].OCCUPATION_CODE); //职业
			['001', '003', '004', '005', '006', '007', '024', '025'].indexOf(smallLoanCusManJson.occup) == -1 && (smallLoanCusManJson.occup = '025');
			smallLoanCusManJson.income = $.trim(responseCode[1].clientDescVO[0].ANNUALEARNING) / 12; //年收入
			//smallLoan.marriage = $.trim(responseCode[1].clientDescVO[0].MARITAL_STATUS);//婚姻状况
			smallLoanCusManJson.companyName = $.trim(responseCode[1].clientDescVO[0].EMPLOYER_NAME); //单位全称
			//smallLoan.occup = $.trim(responseCode[1].clientDescVO[0].POST);//职位
			if(smallLoanCusManJson.CLIENT_NO) {
				smallLoanCusManJson.issPlace = true; //签发地区是否存在 false-不存在 true-存在
				//smallLoan.addrHome = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].ADDRESS2);//经营地址
				$("#smallLoanCus-addrName").attr('disabled', 'disabled').closest('.fm-item').css('display', 'none'); //地区名称
				$("#smallLoanCus-addr").attr('disabled', 'disabled').closest('.fm-item').css('display', 'none'); //签发地区名称
				$("#smallLoanCus-zipcode").attr('disabled', 'disabled').closest('.fm-item').css('display', 'none'); //
			}

			findLenderInfoSmallLoanCusFunSuss();
		} else if(responseCode[0].results == '03') {
			findLenderInfoSmallLoanCusFunSuss();
		} else if(responseCode[0].results == '08') {
			IQueryCustomerInformationServiceSmallLoanCusSucc();
		} else if(responseCode[0].results == '09') {
			showTags({
				'title': '提示', //非必输  默认值：提示
				'content': '查询信息超时！是否继续？', //必输
				'ok': {
					'title': '放弃', //非必输  默认值：取消
					'fun': function() { //非必输  如果输入则执行此函数
						$.mobile.changePage('smallLoanCusManage-indext.html', {
							reverse: true
						});
					}

				},
				'cancel': {
					'title': '继续', //非必输  默认值：确认
					'fun': function() { //非必输  如果输入则执行此函数
						IQueryCustomerInformationServiceSmallLoanCusSucc();
					}
				}

			})

		} else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {
					'fun': function() {
						$.mobile.changePage('smallLoanCusManage-index.html', {
							reverse: true
						});
					}
				}
			});
		}
	}, function(err) {
		hideLoader();
		err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(err);
		var responseCode = responseObj.b[0].error[0];
		showTags({
			'title': '提示', //非必输  默认值：提示
			'content': '查询信息超时！是否继续？', //必输
			'ok': {
				'title': '放弃', //非必输  默认值：取消
				'fun': function() { //非必输  如果输入则执行此函数
					$.mobile.changePage('smallLoanCusManage-index.html', {
						reverse: true
					});
				}

			},
			'cancel': {
				'title': '继续', //非必输  默认值：确认
				'fun': function() { //非必输  如果输入则执行此函数
					IQueryCustomerInformationServiceSmallLoanCusSucc();
				}
			}

		})
	});
}

//查询小贷系统客户信息，如果有值就覆盖缓存中的值
function findLenderInfoSmallLoanCusFunSuss() {
	showLoader('客户信息查询中...');
	var sendJson = {
		"b": [{
			"deviceNo.s": commonJson.udId, //设备编号
			"moduleId.s": smallLoanCusManJson.moduleId, //模块编号
			"tranId.s": smallLoanCusManJson.tranId, //交易编号
			"orgId.s": commonJson.orgId, //机构号
			"operatorNo.s": commonJson.adminCount, //操作员
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"UNIFIED_TYPE.s": '0', //证件类型
			"UNIFIED_ID.s": custermerInfo.cerNO, //证件号码
			"TYPE.s": smallLoanCusManJson.applyTo, //
			"OWNER.s": commonJson.tinyLoanUserId //
				//"UNIFIED_TYPE.s": '0', //证件类型
				//"UNIFIED_ID.s": '440307198605094337', //证件号码
				//"TYPE.s": '3', //
				//"OWNER.s": '287' //
		}]
	};
	findLenderInfoSmallLoanFun(sendJson, function(msg) {
		var responseBody = responseBodySuccFormat(msg);
		if(responseBody[0].results == "00") {
			smallLoanCusManJson.customerId = $.trim(responseBody[1].tinyLoanCustomerVO[0].CUSTOMER_ID); //客户ID
			smallLoanCusManJson.spouseId = $.trim(responseBody[1].tinyLoanCustomerVO[0].SPOUSE_ID); //配偶ID
			smallLoanCusManJson.branchId = $.trim(responseBody[1].tinyLoanCustomerVO[0].BRANCH_ID); //

			responseBody[1].tinyLoanCustomerVO[0].MOBILE_PHONE && (smallLoanCusManJson.mobile = $.trim(responseBody[1].tinyLoanCustomerVO[0].MOBILE_PHONE)); //手机号码
			responseBody[1].tinyLoanCustomerVO[0].MARRIAGE && (smallLoanCusManJson.marriage = $.trim(responseBody[1].tinyLoanCustomerVO[0].MARRIAGE)); //婚姻状况
			responseBody[1].tinyLoanCustomerVO[0].CRARRER && (smallLoanCusManJson.occup = $.trim(responseBody[1].tinyLoanCustomerVO[0].CRARRER)); //职业
			responseBody[1].tinyLoanCustomerVO[0].JOB_INFO && (smallLoanCusManJson.ZhiWu = $.trim(responseBody[1].tinyLoanCustomerVO[0].JOB_INFO)); //职务
			responseBody[1].tinyLoanCustomerVO[0].WORK_UNITS && (smallLoanCusManJson.companyName = $.trim(responseBody[1].tinyLoanCustomerVO[0].WORK_UNITS)); //工作单位
			responseBody[1].tinyLoanCustomerVO[0].OTHER_ADDRESS && (smallLoanCusManJson.addrDetail = $.trim(responseBody[1].tinyLoanCustomerVO[0].OTHER_ADDRESS)); //居住地址详细地址
			responseBody[1].tinyLoanCustomerVO[0].COMPANY_ADDRESS && (smallLoanCusManJson.addrHome = $.trim(responseBody[1].tinyLoanCustomerVO[0].COMPANY_ADDRESS)); //经营地址详细地址
			//responseBody[1].tinyLoanCustomerVO[0].ORG_ADDRESS && (smallLoan.zipcode = $.trim(responseBody[1].tinyLoanCustomerVO[0].ORG_ADDRESS));//邮编
			responseBody[1].tinyLoanCustomerVO[0].MONTH_EARNING && (smallLoanCusManJson.income = $.trim(responseBody[1].tinyLoanCustomerVO[0].MONTH_EARNING)); //月收入
			responseBody[1].tinyLoanCustomerVO[0].FAMILY_MONTH_EARNING && (smallLoanCusManJson.familyIncome = $.trim(responseBody[1].tinyLoanCustomerVO[0].FAMILY_MONTH_EARNING)); //家庭月收入
			responseBody[1].tinyLoanCustomerVO[0].SPOUSE_MOBILE_PHONE && (smallLoanCusManJson.peiPhone = $.trim(responseBody[1].tinyLoanCustomerVO[0].SPOUSE_MOBILE_PHONE)); //配偶手机号码
			responseBody[1].tinyLoanCustomerVO[0].SPOUSE_UNIFIED_ID && (smallLoanCusManJson.peiCerNo = $.trim(responseBody[1].tinyLoanCustomerVO[0].SPOUSE_UNIFIED_ID)); //配偶证件号码
			responseBody[1].tinyLoanCustomerVO[0].SPOUSE_NAME && (smallLoanCusManJson.peiName = $.trim(responseBody[1].tinyLoanCustomerVO[0].SPOUSE_NAME)); //配偶姓名
			responseBody[1].tinyLoanCustomerVO[0].SPOUSE_ORG && (smallLoanCusManJson.peiCompany = $.trim(responseBody[1].tinyLoanCustomerVO[0].SPOUSE_ORG)); //配偶工作单位

			//			responseBody[1].tinyLoanCustomerVO[0].OWNER && (smallLoanCusManJson.manageowner = $.trim(responseBody[1].tinyLoanCustomerVO[0].OWNER));//小贷系统管户经理
			smallLoanCusManJson.updateInfo = '1';
			showSmallLoanCusMessage(); //在客户信息录入界面反显客户信息

		} else if(responseBody[0].results == "08") {
			findLenderInfoSmallLoanCusFunSuss();
		} else if(responseBody[0].results == "09") {
			showTags({
				'title': '提示', //非必输  默认值：提示
				'content': '查询信息超时！是否继续？', //必输
				'ok': {
					'title': '放弃', //非必输  默认值：取消
					'fun': function() { //非必输  如果输入则执行此函数
						$.mobile.changePage('smallLoanCusManage-index.html', {
							reverse: true
						});
					}

				},
				'cancel': {
					'title': '继续', //非必输  默认值：确认
					'fun': function() { //非必输  如果输入则执行此函数
						findLenderInfoSmallLoanCusFunSuss();
					}
				}

			})
		} else if(responseBody[0].results == "03") {
			//IEstablishCustomerInformationServiceSmallLoanSucc();
			showSmallLoanCusMessage();
		} else if(responseBody[0].results == "57") { //后台返回该用户的管户经理与当前小贷客户经理号不一致，此处需要做特殊判断
			if(smallLoanCusManJson.role == "1") { //当角色为普通客户时，弹出信息，报错退出
				showTags({
					'title': '提示',
					'content': responseBody[0].message,
					'ok': {
						'fun': function() {
							$.mobile.changePage('smallLoanCusManage-index.html', {
								reverse: true
							});
						}
					}
				});
			} else {
				smallLoanCusManJson.updateInfo = '0';
				showTags({
					'title': '提示',
					'content': '交易可继续，但客户经理[' + commonJson.tinyLoanUserId + ']无法为其他客户经理名下客户' + custermerInfo.name + '更新客户信息',
					'ok': {
						'fun': function() {
							showSmallLoanCusMessage();
						}
					}
				});

			}
		} else {
			showTags({
				'title': '提示',
				'content': responseBody[0].message,
				'ok': {
					'fun': function() {
						$.mobile.changePage('smallLoanCusManage-index.html', {
							reverse: true
						});
					}
				}
			});
		}
	}, function(err) {
		hideLoader();
		err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(err);
		var responseCode = responseObj.b[0].error[0];
		showTags({
			'title': '提示', //非必输  默认值：提示
			'content': '查询信息超时！是否继续？', //必输
			'ok': {
				'title': '放弃', //非必输  默认值：取消
				'fun': function() { //非必输  如果输入则执行此函数
					$.mobile.changePage('smallLoanCusManage-index.html', {
						reverse: true
					});
				}

			},
			'cancel': {
				'title': '继续', //非必输  默认值：确认
				'fun': function() { //非必输  如果输入则执行此函数
					findLenderInfoSmallLoanCusFunSuss();
				}
			}

		})
	})
}

//虚拟卡签发地区查询
function sloancusIfrp005ServicePSucc(city) {
	var sendJson = {
		"b": [{
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"orgId.s": commonJson.orgId, //机构号
			"moduleId.s": smallLoanCusManJson.moduleId, //模块编号
			"tranId.s": smallLoanCusManJson.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员
			"deviceNo.s": commonJson.udId, //设备编号
			"DOCUMENT_TYPE.s": "0", //证件类型
			"CITY.s": city,
			"CLIENT_NAME.s": custermerInfo.name,
			"DOCUMENT_ID.s": custermerInfo.cerNO
		}]
	};
	ifrp005ServicePFun(sendJson, function(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		var textHtml = "";
		if(responseCode[0].results == "00") {
			$.each(responseCode, function(index, val) {
				if(index == 0) return;
				textHtml += '<option value="' + val.frp005[0].fvval + '">' + val.frp005[0].fvdsc1 + '</option>'
			});
			$("#smallLoanCus-addr").html('<option value=""></option>' + textHtml);
		} else if(responseCode[0].results == "08") {
			sloancusIfrp005ServicePSucc(city);
		} else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}, function(err) {
		funFail(err);
	});

}

//人行征信搜索成功回调-小贷客户信息管理
function smallLoanCusFindCreditReportInquirySucc(msg) {
	hideLoader();
	var responseBody = responseBodySuccFormat(msg);
	if(responseBody[0].results == '00') { //借口处理成功
		var textHtml = '';
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
				// $(".searchCredit a:last").addClass('btn_next');
			} else {
				$(this).find('.dzdImg').css('display', 'none');
				$(this).closest('li').attr('sel', 'false');
				// $(".searchCredit a:last").removeClass('btn_next');
			}
		});
	} else if(responseBody[0].results == '08') { //
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
	} else {
		showTags({
			'title': '提示',
			'content': responseBody[0].message,
			'ok': {}
		});
	}
}

//对账单成功回调
function smallLoanCusFindStatementMainSucc(msg) {
	var responseBody = responseBodySuccFormat(msg);
	if(responseBody[0].results == '00') { //借口处理成功
		var textHtml = '';
		$.each(responseBody, function(index, val) {
			if(index == 0) {
				return;
			}
			var fileName = val.bkStatementInquiry[0].bkstFile.split('/');
			fileName = fileName[fileName.length - 1];
			textHtml += '<li inquiryDate="' + val.bkStatementInquiry[0].inquiryDate + '" lcseqNum="' + val.bkStatementInquiry[0].seqNum + '" lcStatus="' + val.bkStatementInquiry[0].status + '" creditReferPath="' + val.bkStatementInquiry[0].bkstFile + '" remark="' + val.bkStatementInquiry[0].remark + '">' +
				'<div style="width: 12%">' + val.bkStatementInquiry[0].name + '</div>' +
				'<div style="width: 15%">' + val.bkStatementInquiry[0].inquiryDate.split(' ')[0] + '</div>' +
				'<div style="width: 20%;">' + val.bkStatementInquiry[0].account + '</div>' +
				'<div style="width: 43%"><u>' + fileName + '</u></div>' +
				'<div style="width: 10%" ><img class="dzdImg" src="../../images/ic_sqwc.png" alt=""></div>' +
				'</li>';
		});
		$(".searchBank ul").empty();
		$(".searchBank ul").html(textHtml);
		$(".searchBank").show();
		/*点击 click list*/
		$(".searchBank ul>li div:last-child").on("click", function() {
			var diaPlay = $(this).find('.dzdImg').css('display');
			if(diaPlay == 'none') {
				$(this).find('.dzdImg').css('display', 'block');
				$(this).closest('li').attr('sel', 'true');
				// $(".searchBank a:last").addClass('btn_next');

			} else {
				$(this).closest('li').attr('sel', 'false');
				$(this).find('.dzdImg').css('display', 'none');
				// if ($('.searchBank ul>li[sel=true]').length < 1) {
				//     $(".searchBank a:last").removeClass('btn_next');
				// }
			}
		});

	} else if(responseBody[0].results == '08') { //
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
	} else {
		showTags({
			'title': '提示',
			'content': responseBody[0].message,
			'ok': {}
		});
	}
}

function getFileAndShow(filepath, nametype) { //  传文件路径从后台获取文件并打开
	showLoader('文件查询中...');
	var _fileName = filepath.split('/');
	var fileName = nametype + _fileName[_fileName.length - 1];
	var sendJson = {
		"b": [{
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"orgId.s": commonJson.orgId, //机构号
			"moduleId.s": smallLoanCusManJson.moduleId, //creditJson.moduleID, //模块编号
			"tranId.s": smallLoanCusManJson.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
			"deviceNo.s": commonJson.udId, //设备编号
			"offOnline.s": commonJson.offlineOnline, //脱机/联机
			"filePath.s": filepath //附件路径
		}]
	};

	getFileDataFun(sendJson, function(msg) {
		var responseBody = responseBodySuccFormat(msg);
		if(responseBody[0].results == "00") {
			var fileStr = responseBody[1].hashMap[0].fileData;
			transFormBase64Tofile(fileName, fileStr, function(path) { //返回路径
				scanTheFiles(path, function(msg) {}, function(err) {
					showTags({
						'title': '提示',
						'content': '文件打开失败！',
						'ok': {}
					});
				});
			}, function(err) {
				showTags({
					'title': '提示',
					'content': '下载文件失败',
					'ok': {}
				});
			});
		} else if(responseBody[0].results == "08") {
			getFileAndShow(filepath, nametype);
		} else {
			showTags({
				'title': '提示',
				'content': responseBody[0].message,
				'ok': {}
			});
		}
	}, function(err) {
		funFail(err);
	})
}

//验证短信验证码成功回调方法
function sloanCusCkeckImessageAuthentionServiceYFun() {
	getPlatGlobalSeq(smallLoanCusManJson, smallLoanCusManageZipCompression);
}

function smallLoanCusManageZipCompression() {

	showLoader('影像压缩中。。。。');
	smallLoanCusManJson.phoneTime = myTime.CurTime();
	smallLoanCusManJson.signTime = smallLoanCusManJson.phoneTime + 1;
	//影像上传文件打包压缩插件--->客户资料
	Meap.zipCompression(smallLoanCusManJson.platGlobalSeq, smallLoanCusManJson.applicationObj.mPicFileARR, function(msg) {
		//影像上传 业务参数
		var appBus = {
			'busiGloablaSeq': smallLoanCusManJson.platGlobalSeq, //业务编号
			'attchType': '4', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
			'OPER_TYPE': 'ADD',
			'CUSTOMER_ID': '', //客户ID
			"OWNER": commonJson.tinyLoanUserId, //所属管理员标识符
			'FILE_LIST': '',
			'deviceNo': commonJson.udId, //设备编号
			'moduleId': smallLoanCusManJson.moduleId, //模块编号
			'tranId': smallLoanCusManJson.tranId, //交易编号
			'orgId': commonJson.orgId, //机构编号
			'operatorNo': commonJson.adminCount, //操作员
			'custName': custermerInfo.name, //客户名称
			'custCredType': '0', //客户证件类型
			'custCredNo': custermerInfo.cerNO, //客户证件号
			'offlineOnline': commonJson.offlineOnline, //脱机/联机
			'workAddress': commonJson.workAddress //工作地址
				//'FILE_ADD': creditJson.storage.picFileInfoARR[0].b, //每个图片的名称和类型
		};
		var appBusJson = JSON.stringify(appBus);
		var sendDataJson = {
			'databaseName': 'myDatabase',
			'tableName': 'up_download_info',
			'data': [{
				'fileToken': smallLoanCusManJson.phoneTime, //文件唯一ID(可以为时间挫
				'pos': '0', //文件的断点信息(初始为0)
				'filePath': msg, //文件路径
				'appPath': 'tl001', //自定义文件路径
				'appBuss': appBusJson, //业务参数
				'downloadToken': '', //文件的下载ID(初始为空)
				'leng': '1', //文件的长度(初始为1)
				'isNotice': 'yes', //是否调用后台(一直是yes)
				"fileType": '0',
				'REMARK1': '01'
			}]
		};
		insertTableData(sendDataJson, function(msg) {
			//将要上传的签名插入到ios断点上传的数据库中
			//签名上传 业务参数
			var signname = 'sign';
			if(smallLoanCusManJson.role != '1') {
				signname += smallLoanCusType[smallLoanCusManJson.role];
			}
			Meap.transFormImage(smallLoanCusManJson.platGlobalSeq + signname, smallLoanCusManJson.signHref, 'picSty', function(msg) {
				var appBussSign = {
					'busiGloablaSeq': smallLoanCusManJson.platGlobalSeq, //业务编号
					'attchType': '1', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
					'deviceNo': commonJson.deviceNo, //设备编号
					'moduleId': smallLoanCusManJson.moduleId, //模块编号
					'tranId': smallLoanCusManJson.tranId, //交易编号
					'orgId': commonJson.orgId, //机构编号
					'operatorNo': commonJson.adminCount, //操作员
					'custName': custermerInfo.name, //客户名称
					'custCredType': '0', //客户证件类型
					'custCredNo': custermerInfo.cerNO, //客户证件号
					'offlineOnline': commonJson.offlineOnline, //脱机/联机
					'workAddress': commonJson.workAddress //工作地址
				};
				appBussSign = JSON.stringify(appBussSign);
				var sendDataJson = {
					"databaseName": "myDatabase",
					"tableName": "up_download_info",
					"data": [{
						"fileToken": smallLoanCusManJson.signTime, //文件唯一ID(可以为时间挫
						"pos": "0", //文件的断点信息(初始为0)
						"filePath": msg, //文件路径
						"appPath": "tl002", //自定义文件路径
						"appBuss": appBussSign, //业务参数
						"downloadToken": "", //文件的下载ID(初始为空)
						"leng": "1", //文件的长度(初始为1)
						"isNotice": "yes", //是否调用后台(一直是yes)
						"fileType": "1",
						'REMARK1': '01'
					}]
				};
				insertTableData(sendDataJson, function(msg) {
					hideLoader();
					smallLoanCusManageFun();
				}, function(err) {
					hideLoader();
					showTags({
						'title': '提示',
						'content': '数据库读写失败，请联系技术人员！',
						'ok': {}
					});
				});
			}, function(err) {
				hideLoader();
				showTags({
					'title': '提示',
					'content': '图片转换失败！',
					'ok': {}
				});
			});
		}, function(err) {
			hideLoader();
			showTags({
				'title': '提示',
				'content': '数据库读写失败，请联系技术人员！',
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

}

//小贷客户信息管理提交
function smallLoanCusManageFun() {

	showLoader('用户信息提交中...');
	//后台取数规则变更，文件列表不再从appBuss里获取，而是从提交接口取  2016-7-13
	var appliform = [];
	if(smallLoanCusManJson.zhengxinArr.length > 0) {
		appliform = appliform.concat(smallLoanCusManJson.zhengxinArr);
	}
	if(smallLoanCusManJson.fillListArr.length > 0) {
		appliform = appliform.concat(smallLoanCusManJson.fillListArr);
	}
	appliform = JSON.stringify(appliform);
	var signforimage = '';
	if(smallLoanCusManJson.role == '1') { //普通客户时不在报文中上送
		signforimage = '';
	} else {
		signforimage = smallLoanCusManJson.signHref;
	}
	var sendJson = {
		"b": [{
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"GENDER.s": smallLoanSexJson[custermerInfo.sex], //XINGBIE
			'OTHER_ADDRESS.s': smallLoanCusManJson.s_city ? (smallLoanCusManJson.s_city + smallLoanCusManJson.s_county + smallLoanCusManJson.addrDetail) : smallLoanCusManJson.addrDetail, //居住地址
			'COMPANY_ADDRESS.s': smallLoanCusManJson.day_b ? (smallLoanCusManJson.day_b + smallLoanCusManJson.day_c + smallLoanCusManJson.addrHome) : smallLoanCusManJson.addrHome, //经营地址
			'JOB_INFO.s': smallLoanCusManJson.ZhiWu, //职务
			'ORG_ADDRESS.s': smallLoanCusManJson.zipcode, //单位邮编
			'SPOUSE_ID.s': smallLoanCusManJson.spouseId, //配偶id
			"workAddress.s": commonJson.workAddress, //工作地址
			"ADDRESS2.s": custermerInfo.address, //身份证上地址
			"orgId.s": commonJson.orgId, //机构号
			"moduleId.s": smallLoanCusManJson.moduleId, //模块编号
			"tranId.s": smallLoanCusManJson.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员
			"deviceNo.s": commonJson.udId, //设备编号
			"ACCT_EXEC.s": commonJson.ifsCManagerId, //核心客户经理号
			"UNIFIED_TYPE.s": '0', //证件类型
			"UNIFIED_ID.s": custermerInfo.cerNO, //证件号码
			"UNIFIED_EFFECTIVE_DATE.s": custermerInfo.cerExpdDt.split('-')[1].replace(/\./g, '/'), //证件到期日
			'CUSTOMER_ID.s': smallLoanCusManJson.customerId, //客户ID
			"OWNER.s": commonJson.tinyLoanUserId, //所属管理员标识符
			'CLIENT_NO.s': smallLoanCusManJson.CLIENT_NO, //核心客户号
			'username.s': commonJson.TLRNAME,
			'NAME.s': custermerInfo.name,
			'MONTH_EARNING.s': smallLoanCusManJson.income + '', //月收入
			'BRANCH_ID.s': smallLoanCusManJson.branchId || commonJson.orgId,
			//			'LOAN_AMOUNT.s': smallLoanCusManJson.loanMoney,
			//			'LOAN_TERM.s': smallLoan.loanTime + '',
			//			'fixedAmount.s': smallLoan.fixedAmount,
			//			'fixedTerms.s': smallLoan.fixedTerms,
			//			'prodSummary.s': smallLoan.proName,
			//			'LOAN_PURPOSE.s': smallLoan.loanUse,
			'TYPE.s': smallLoanCusManJson.applyTo, //客户类型
			'ISS_CITY.s': smallLoanCusManJson.addrCode,
			'ISS_PLACE.s': smallLoanCusManJson.addr,
			'ISS_DATE.s': custermerInfo.cerExpdDt.split('-')[0].replace(/\./g, '/'), //证件到期日,
			'ISS_AUTHORITY.s': custermerInfo.issAuthority,
			//			'PRODUCT_ID.s': smallLoanCusManJson.prodCode,
			//			'PAYMENT_METHOD.s': smallLoanCusManJson.paymentMethod,
			'MOBILE_PHONE.s': smallLoanCusManJson.mobile, //手机号码
			'signature.s': signforimage, //smallLoanCusManJson.signHref 签名
			'WORK_UNITS.s': smallLoanCusManJson.companyName, //工作单位
			'MARRIAGE.s': smallLoanCusManJson.marriage, //婚姻状况
			'CRARRER.s': smallLoanCusManJson.occup, //职业
			"SPOUSE_NAME.s": smallLoanCusManJson.peiName, //配偶姓名
			"SPOUSE_ORG.s": smallLoanCusManJson.peiCompany, //配偶工作单位
			"SPOUSE_UNIFIED_ID.s": smallLoanCusManJson.peiCerNo, //配偶证件号码
			"SPOUSE_MOBILE_PHONE.s": smallLoanCusManJson.peiPhone, //配偶手机号码
			"faceRecogn.s": smallLoanCusManJson.faceRecogn, //人脸识别
			"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
			"platGlobalSeq.s": smallLoanCusManJson.platGlobalSeq,
			"FILE_COUNT.s": '3', //文件上传数量
			"longitude.s": commonJson.longitude, //
			"latitude.s": commonJson.latitude, //
			"updateInfo.s": smallLoanCusManJson.updateInfo, //是否可修改客户信息
			"customerType.s": smallLoanCusManJson.role, //客户角色，1-普通客户，2-共借人，3-担保人
			"APPLICATION_NO.s": smallLoanCusManJson.applicationno,
			"prodSummary.s": smallLoanCusManJson.proName, //贷款产品
			"FILE_LIST.s": appliform //文件列表
		}]
	};
	console.log(sendJson);
	tinyLoanCusManage(sendJson, function(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		if(responseCode[0].results == "00") {
			showLoader('用户信息提交中...');
			smallLoanCusManJson.appliform = [];
			smallLoanCusManJson.zhengxinArr.length > 0 && (smallLoanCusManJson.appliform = smallLoanCusManJson.appliform.concat(smallLoanCusManJson.zhengxinArr));
			smallLoanCusManJson.fillListArr.length > 0 && (smallLoanCusManJson.appliform = smallLoanCusManJson.appliform.concat(smallLoanCusManJson.fillListArr));
			//			smallLoanCusManJson.appliform.push(responseCode[1].tinyLoanApplicationVO[0].appliform);
			//			smallLoanCusManJson.appliform.push(responseCode[1].tinyLoanApplicationVO[0].scoreCardPdf);
			//			smallLoanCusManJson.customerId = responseCode[1].tinyLoanApplicationVO[0].CUSTOMER_ID;
			var appBus = {
				'busiGloablaSeq': smallLoanCusManJson.platGlobalSeq, //业务编号
				'attchType': '4', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
				'OPER_TYPE': 'ADD',
				'CUSTOMER_ID': smallLoanCusManJson.customerId, //客户ID
				//				'APPLY_NO': smallLoanCusManJson, //申请编号
				"OWNER": commonJson.tinyLoanUserId, //所属管理员标识符
				'FILE_LIST': smallLoanCusManJson.appliform,
				'deviceNo': commonJson.udId, //设备编号
				'moduleId': smallLoanCusManJson.moduleId, //模块编号
				'tranId': smallLoanCusManJson.tranId, //交易编号
				'orgId': commonJson.orgId, //机构编号
				'operatorNo': commonJson.adminCount, //操作员
				'custName': custermerInfo.name, //客户名称
				'custCredType': '0', //客户证件类型
				'custCredNo': custermerInfo.cerNO, //客户证件号
				'offlineOnline': commonJson.offlineOnline, //脱机/联机
				'workAddress': commonJson.workAddress //工作地址
					//'FILE_ADD': creditJson.storage.picFileInfoARR[0].b, //每个图片的名称和类型
			};
			var appBusJson = JSON.stringify(appBus);
			var sql = "UPDATE up_download_info SET appBuss = '" + appBusJson + "' WHERE fileToken = '" + smallLoanCusManJson.phoneTime + "'";
			executeSqlString(sql, 'exe', function() {
				hideLoader();
				changeUploadStatus('02', smallLoanCusManJson.phoneTime, smallLoanCusManJson.signTime);
				//缓存个人信息
				if((!commonJson.isCustermerInfoMultiplex || commonJson.isCustermerInfoMultiplex == 0) && (lianwanghechaData.CheckResult == '00' || lianwanghechaData.CheckResult == '02')) {
					cacheCustermerInfo({
						"databaseName": "myDatabase",
						"tableName": "customer_info",
						"data": [{
							"ADMINCOUNT": commonJson.adminCount, //登陆账号
							"SUBMITTIME": myTime.CurTime(), //提交时间
							"BUSINESSTYPE": "小贷客户信息管理", //业务类型
							"NATION": custermerInfo.nation, //民族
							"CERTNUM": custermerInfo.cerNO, //身份证号码
							"ADDRESS": custermerInfo.address, //地址
							"MASCARDNAME": custermerInfo.name, //姓名
							"CERTVALIDDATE": custermerInfo.cerExpdDt, //有效日期
							"BIRTH": custermerInfo.birthday, //出生日期
							"SEX": custermerInfo.sex, //性别
							"ISSAUTHORITY": custermerInfo.issAuthority, //签发机关
							"IMAGE": custermerInfo.image, //身份证头像图片
							"CUSTANDCUSTOWNERPIC": smallLoanCusManJson.applicationObj.mPicFileARR[1], //与客户合影照片
							"FRONTIDCARDPIC": smallLoanCusManJson.applicationObj.mPicFileARR[2], //身份证正面
							"BACKIDCARDPIC": smallLoanCusManJson.applicationObj.mPicFileARR[3], //身份证反面
							"checkPhoto": smallLoanCusManJson.mInfo.lianPic //联网核查图片
						}]
					});
				}
				$.mobile.changePage('smallLoanCusManage-complete.html');
			}, function(err) {
				hideLoader();
				showTags({
					'title': '提示',
					'content': '更新数据库失败，请联系技术人员！',
					'ok': {}
				});
			});
		} else if(responseCode[0].results == "08") {
			smallLoanCusManageFun();
		} else if(responseCode[0].results == "09") {
			hideLoader();
			showTags({
				'title': '提示',
				'content': '业务处理超时！',
				'ok': {
					'title': '继续处理',
					'fun': function() {
						smallLoanCusManageFun();
					}
				}
			});
		} else {
			changeUploadStatus('03', smallLoanCusManJson.phoneTime, smallLoanCusManJson.signTime);
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}, function(err) {
		funFaillilvANDwh(err, smallLoanCusManageFun);
	})

}