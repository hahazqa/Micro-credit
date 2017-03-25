/**
 * Created by chen on 2016/5/16.
 */
/**
 * 申请贷款
 **/
/*产品查询*/
function getsmallLoanProductListSucc(responseBody) {
	var textHtml = '';
	$.each(responseBody, function(index, el) {
		var imgUrl = base64decode(el.PRO_ATTACH);
		textHtml += '<div class="product_box">' +
			'<img src="data:image/png;base64,' + imgUrl + '" proREMARK1="' + el.proRemark1 + '" class="product_img">' +
			'<div class="product_content">' +
			'<div class="product_register" fixedTerms="' + el.REMARK1 + '" proName="' + el.PRONAME + '" scoreCardNo="' + el.REMARK6 + '" needAssess="' + el.REMARK7 +'" businessType="' + el.REMARK8 + '" prodCODE="' + el.PRODCODE + '" fixedAmount="' + el.REMARK3 + '" minAmount="' + el.REMARK4 + '" minTerms="' + el.REMARK5 + '">立即申请</div>' +
			'<p class="product_title">' + el.PRONAME + '</p>' +
			'<div class="product_Intro">' + el.pro_description.replace(/\n/g, "<br/>") + '</div>' +
			'</div>' +
			'</div>'
	});

	$('#smallLoan-product .conter-auto').html(textHtml);
	$('#smallLoan-product .product_register').on('click', function() {
		smallLoan.prodCode = $(this).attr("prodCode"); //业务品种
		smallLoan.proName = $(this).attr("proName"); //业务品种
		smallLoan.fixedAmount = $(this).attr("fixedAmount"); //最大额度
		smallLoan.fixedTerms = $(this).attr("fixedTerms"); //最大期限
		smallLoan.minAmount = $(this).attr("minAmount"); //最小额度
		smallLoan.minTerms = $(this).attr("minTerms"); //最小期限
		smallLoan.SCORE_CARD_NO = '';
		smallLoan.SCORE_CARD_NO = $(this).attr('scoreCardNo'); //对应的评分卡编号
		smallLoan.needAssess = $(this).attr('needAssess'); //是否需要评分
		smallLoan.businessType = $(this).attr('businessType');//
		smallLoan.applyTo = $('#s_type').val(); //适用对象
		//		smallLoan.SCORE_CARD_ID = '';
		//		smallLoan.smallLoanScorePdfObjon = [];
		if(smallLoan.needAssess == "1") {
			smallLoan.IsNeedScore = true;
		} else {
			smallLoan.IsNeedScore = false;
		}
		$.mobile.changePage('smallLoan-readingID.html');

	});

	$("#smallLoan-product").on('tap', function(ev) {
		var oTarget = ev.target;
		if($(oTarget).closest('.product_img').length || $(oTarget).closest('.product_img_msg').length) {

		} else {
			$(".product_img_msg").remove();
		}
	});
	//营销话术
	$('#smallLoan-product .product_img').on('taphold', function() {
		productTapHold($(this));
	});
}

//产品查询
function getsmallLoanProductListArr(responseBody, num) {
	smallLoan.productListArr = [];
	$.each(responseBody, function(index, el) {

		if(el.REMARK2.indexOf(num) >= 0) {
			smallLoan.productListArr.push(el);
		}
	});

	if(smallLoan.productListArr.length > 0) {
		getsmallLoanProductListSucc(smallLoan.productListArr);
	} else {
		$('#smallLoan-product .conter-auto').html('');
		showTags({
			'title': '提示',
			'content': '暂时没有此类客户的贷款产品！',
			'ok': {
				fun: function() {}
			}
		});
	}

}
/*贷款产品查询*/
function getsmallLoanProductListConF(bodyJson) {
	findTinyLoanList(bodyJson, function(msg) {
		hideLoader();
		var responseBody = responseBodySuccFormat(msg);
		if(responseBody[0].results == '00') {
			showLoader("产品列表查询中...");
			deleteTableData({
				"databaseName": "myDatabase", //数据库名
				"tableName": "productdisplay_info", //表名
				"conditions": [{
					"PRO_TYPE": '小微贷款'
				}]
			}, function(msg) {
				//再插入数据库
				var dataNum = 1;
				smallLoanProductInfoServiceInsert(responseBody, dataNum);
			}, function(err) {});
		} else if(responseBody[0].results == '08') {
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
		} else {
			showTags({
				'title': '提示',
				'content': responseBody[0].message,
				'ok': {
					fun: function() {}
				}
			});
		}
	}, function(err) {
		funFail(err);
	});
}

//插入表格
function smallLoanProductInfoServiceInsert(sendDataJsonItem, dataNum) {
	var sendDataJson = {
		"databaseName": "myDatabase",
		"tableName": "productdisplay_info",
		"data": [{
			"pro_description": sendDataJsonItem[dataNum].tinyLoanPrdtVO[0].description,
			"PRO_ATTACH": sendDataJsonItem[dataNum].tinyLoanPrdtVO[0].attach,
			"PRO_TYPE": '小微贷款',
			"proRemark1": sendDataJsonItem[dataNum].tinyLoanPrdtVO[0].remark,
			"PRODCODE": sendDataJsonItem[dataNum].tinyLoanPrdtVO[0].prodCode,
			"PRONAME": sendDataJsonItem[dataNum].tinyLoanPrdtVO[0].prodSummary,
			"REMARK1": sendDataJsonItem[dataNum].tinyLoanPrdtVO[0].fixedTerms, //
			"REMARK2": sendDataJsonItem[dataNum].tinyLoanPrdtVO[0].applyTo, //
			"REMARK3": sendDataJsonItem[dataNum].tinyLoanPrdtVO[0].fixedAmount, //
			"REMARK4": sendDataJsonItem[dataNum].tinyLoanPrdtVO[0].minAmount, //
			"REMARK5": sendDataJsonItem[dataNum].tinyLoanPrdtVO[0].minTerms, //
			"REMARK6": sendDataJsonItem[dataNum].tinyLoanPrdtVO[0].scoreCardNo.replace(/[\']/g, "''"),//新增，表示评分卡id
			"REMARK7": sendDataJsonItem[dataNum].tinyLoanPrdtVO[0].needAssess, //新增，表示是否需要评分，1-是 0-否
			"REMARK8": sendDataJsonItem[dataNum].tinyLoanPrdtVO[0].businessType //新增，区分产品类型，1-不需要共借人/担保人 2-需要
		}]
	};
	insertTableData(sendDataJson, function(msg) {
		dataNum++;
		if(dataNum != sendDataJsonItem.length) {
			smallLoanProductInfoServiceInsert(sendDataJsonItem, dataNum);
		} else {
			localStorage.spacetimeSmallLoan = smallLoan.todayIs;
			smallLoanProductListEexTab(2);
		}
	}, function(err) {
		funFail(err);
	});
}
//sql语句查询表格
function smallLoanProductListEexTab(num) {
	showLoader("产品列表查询中...");
	var sql = "SELECT * FROM productdisplay_info WHERE PRO_TYPE = '小微贷款'";
	executeSqlString(sql, 'exe', function(msg) {
		if(msg != '') {
			hideLoader();
			getsmallLoanProductListArr(msg, num);
		} else {
			smallLoan.isProRequest = true;
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
	}, function(err) {
		funDataFail(err);
	});
}
//客户信息查询
function sloanIcustomerInfoServiceFun() {
	showLoader('客户信息查询中...');
	var sendJson = {
		"b": [{
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"moduleId.s": smallLoan.moduleId, //模块编号 4
			"tranId.s": smallLoan.tranId, //交易编号   2
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
							$.mobile.changePage('smallLoan-product.html', {
								reverse: true
							});
						}
					}
				});
				return;
			}
			smallLoan.CLIENT_NO = responseBody[1].customerInfoVO[0].CLIENT_NO; //获取客户号
			if(smallLoan.IsNeedScore == true) { //将评分卡规则嵌入到流程中
				$.mobile.changePage('smallloan-scorecard.html');
			} else {
				$.mobile.changePage('smallLoan-cusPicture.html');
			}
			//			$.mobile.changePage('smallLoan-cusPicture.html');
			// $.mobile.changePage('smallLoan-testLimit.html');
		} else if(responseBody[0].results == "08") {
			sloanIcustomerInfoServiceFun();
		} else if(responseBody[0].results == "12") {
			showTags({
				'title': '提示',
				'content': '核心系统客户信息异常！',
				'ok': {
					fun: function() {
						$.mobile.changePage('smallLoan-product.html', {
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
						$.mobile.changePage('smallLoan-product.html', {
							reverse: true
						});
					}
				},
				'cancel': {
					'title': '继续', //非必输  默认值：取消
					'fun': function() { //非必输  如果输入则执行此函数
						sloanIcustomerInfoServiceFun();
					}
				}
			});
		} else {
			showTags({
				'title': '提示',
				'content': responseBody[0].message,
				'ok': {
					fun: function() {
						$.mobile.changePage('smallLoan-product.html', {
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
//客户信息查询
function cacheSmallLoanMessage() {

	$("#smallLoan-mobile").val(telNum(smallLoan.mobile)); //手机号码
	$("#smallLoan-zipcode").val(smallLoan.zipcode); //邮编
	if(smallLoan.addrHome) {
		$("#day_b").val("").selectmenu('refresh');
		$("#day_c").val("").selectmenu('refresh').attr('disabled', 'disabled');
		$("#smallLoan-addr-home").val(smallLoan.addrHome); //经营地址详细地址
	}
	if(smallLoan.addrDetail) {
		$("#s_city").val("").selectmenu('refresh');
		$("#s_county").val("").selectmenu('refresh').attr('disabled', 'disabled');
		$("#smallLoan-addr-detail").val(smallLoan.addrDetail); //居住地址详细地址
	}
	$("#smallLoan-marriage").val(smallLoan.marriage).selectmenu('refresh'); //婚姻状况
	$("#smallLoan-occup").val(smallLoan.occup).selectmenu('refresh'); //职位
	$("#smallLoan-com-name").val(smallLoan.companyName); //工作单位
	$("#ZhiWu").val(smallLoan.ZhiWu).selectmenu('refresh'); //职务
	$("#smallLoan-income").val(fmoney(smallLoan.income)); //月收入
	$("#smallLoan-f-income").val(fmoney(smallLoan.familyIncome)); //家庭月收入
	if(smallLoan.spouseId) {
		$("#smallLoan-peiName").val(smallLoan.peiName).attr('disabled', 'disabled'); //配偶姓名
		$("#smallLoan-peiPhone").val(telNum(smallLoan.peiPhone)).attr('disabled', 'disabled'); //配偶手机号码
		$("#smallLoan-peiCerNo").val(smallLoan.peiCerNo).attr('disabled', 'disabled'); //配偶证件号码
		$("#smallLoan-peiCompany").val(smallLoan.peiCompany).attr('disabled', 'disabled'); //配偶工作单位
		showTags({
			'title': '提示',
			'content': '配偶信息已存在，无法修改，但业务可正常办理，请及时更新小贷系统相关信息！',
			'ok': {}
		});
	}
}
//维护客户信息查询成功==学习平台
function IEstablishCustomerInformationServiceSmallLoanSucc() {
	showLoader("客户信息查询中...");
	var sendJson = {
		"b": [{
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"orgId.s": commonJson.orgId, //机构号
			"moduleId.s": smallLoan.moduleId, //模块编号
			"tranId.s": smallLoan.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员
			"deviceNo.s": commonJson.udId, //设备编号
			"IDTYPE.s": "0", //证件类型
			"IDNO.s": custermerInfo.cerNO, //证件号
			'CLIENT_TYPE.s': 'P',
			'CLIENT_NO.s': smallLoan.CLIENT_NO
		}]
	};
	IEstablishCustomerInformationServicetWOFFun(sendJson, function(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		if(responseCode[0].results == '00') {
			smallLoan.mobile = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[1].contactInfo[0].CONTACT_ID); //手机号码
			smallLoan.zipcode = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].POSTAL_CODE); //邮编
			smallLoan.addrHome = $.trim(responseCode[1].clientDescVO[0].EMPLOYER_ADD); //经营地址
			smallLoan.addrDetail = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[1].contactInfo[0].ADDRESS2); //居住地址
			smallLoan.occup = $.trim(responseCode[1].clientDescVO[0].OCCUPATION_CODE); //职业
			['001', '003', '004', '005', '006', '007', '024', '025'].indexOf(smallLoan.occup) == -1 && (smallLoan.occup = '025');
			smallLoan.income = $.trim(responseCode[1].clientDescVO[0].ANNUALEARNING) / 12; //年收入
			//smallLoan.marriage = $.trim(responseCode[1].clientDescVO[0].MARITAL_STATUS);//婚姻状况
			smallLoan.companyName = $.trim(responseCode[1].clientDescVO[0].EMPLOYER_NAME); //单位全称
			//smallLoan.occup = $.trim(responseCode[1].clientDescVO[0].POST);//职位
			if(smallLoan.CLIENT_NO) {
				smallLoan.issPlace = true;
				//smallLoan.addrHome = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].ADDRESS2);//经营地址
				$("#smallLoan-addrName").attr('disabled', 'disabled').closest('.fm-item').css('display', 'none'); //地区名称
				$("#smallLoan-addr").attr('disabled', 'disabled').closest('.fm-item').css('display', 'none'); //签发地区名称
				$("#smallLoan-zipcode").attr('disabled', 'disabled').closest('.fm-item').css('display', 'none'); //
			}

			findLenderInfoSmallLoanFunSuss();
		} else if(responseCode[0].results == '03') {
			findLenderInfoSmallLoanFunSuss();
		} else if(responseCode[0].results == '08') {
			IEstablishCustomerInformationServiceSmallLoanSucc();
		} else if(responseCode[0].results == '09') {
			showTags({
				'title': '提示', //非必输  默认值：提示
				'content': '查询信息超时！是否继续？', //必输
				'ok': {
					'title': '放弃', //非必输  默认值：取消
					'fun': function() { //非必输  如果输入则执行此函数
						$.mobile.changePage('smallLoan-product.html', {
							reverse: true
						});
					}

				},
				'cancel': {
					'title': '继续', //非必输  默认值：确认
					'fun': function() { //非必输  如果输入则执行此函数
						IEstablishCustomerInformationServiceSmallLoanSucc();
					}
				}

			})

		} else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {
					'fun': function() {
						$.mobile.changePage('smallLoan-product.html', {
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
					$.mobile.changePage('smallLoan-product.html', {
						reverse: true
					});
				}

			},
			'cancel': {
				'title': '继续', //非必输  默认值：确认
				'fun': function() { //非必输  如果输入则执行此函数
					IEstablishCustomerInformationServiceSmallLoanSucc();
				}
			}

		})
	});
}

//查询小贷系统
function findLenderInfoSmallLoanFunSuss() {
	showLoader('客户信息查询中...');
	var sendJson = {
		"b": [{
			"deviceNo.s": commonJson.udId, //设备编号
			"moduleId.s": smallLoan.moduleId, //模块编号
			"tranId.s": smallLoan.tranId, //交易编号
			"orgId.s": commonJson.orgId, //机构号
			"operatorNo.s": commonJson.adminCount, //操作员
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"UNIFIED_TYPE.s": '0', //证件类型
			"UNIFIED_ID.s": custermerInfo.cerNO, //证件号码
			"TYPE.s": smallLoan.applyTo, //
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
			smallLoan.customerId = $.trim(responseBody[1].tinyLoanCustomerVO[0].CUSTOMER_ID); //客户ID
			smallLoan.spouseId = $.trim(responseBody[1].tinyLoanCustomerVO[0].SPOUSE_ID); //客户ID
			smallLoan.branchId = $.trim(responseBody[1].tinyLoanCustomerVO[0].BRANCH_ID); //

			responseBody[1].tinyLoanCustomerVO[0].MOBILE_PHONE && (smallLoan.mobile = $.trim(responseBody[1].tinyLoanCustomerVO[0].MOBILE_PHONE)); //手机号码
			responseBody[1].tinyLoanCustomerVO[0].MARRIAGE && (smallLoan.marriage = $.trim(responseBody[1].tinyLoanCustomerVO[0].MARRIAGE)); //婚姻状况
			responseBody[1].tinyLoanCustomerVO[0].CRARRER && (smallLoan.occup = $.trim(responseBody[1].tinyLoanCustomerVO[0].CRARRER)); //职业
			responseBody[1].tinyLoanCustomerVO[0].JOB_INFO && (smallLoan.ZhiWu = $.trim(responseBody[1].tinyLoanCustomerVO[0].JOB_INFO)); //职务
			responseBody[1].tinyLoanCustomerVO[0].WORK_UNITS && (smallLoan.companyName = $.trim(responseBody[1].tinyLoanCustomerVO[0].WORK_UNITS)); //工作单位
			responseBody[1].tinyLoanCustomerVO[0].OTHER_ADDRESS && (smallLoan.addrDetail = $.trim(responseBody[1].tinyLoanCustomerVO[0].OTHER_ADDRESS)); //居住地址详细地址
			responseBody[1].tinyLoanCustomerVO[0].COMPANY_ADDRESS && (smallLoan.addrHome = $.trim(responseBody[1].tinyLoanCustomerVO[0].COMPANY_ADDRESS)); //经营地址详细地址
			//responseBody[1].tinyLoanCustomerVO[0].ORG_ADDRESS && (smallLoan.zipcode = $.trim(responseBody[1].tinyLoanCustomerVO[0].ORG_ADDRESS));//邮编
			responseBody[1].tinyLoanCustomerVO[0].MONTH_EARNING && (smallLoan.income = $.trim(responseBody[1].tinyLoanCustomerVO[0].MONTH_EARNING)); //月收入
			responseBody[1].tinyLoanCustomerVO[0].FAMILY_MONTH_EARNING && (smallLoan.familyIncome = $.trim(responseBody[1].tinyLoanCustomerVO[0].FAMILY_MONTH_EARNING)); //家庭月收入
			responseBody[1].tinyLoanCustomerVO[0].SPOUSE_MOBILE_PHONE && (smallLoan.peiPhone = $.trim(responseBody[1].tinyLoanCustomerVO[0].SPOUSE_MOBILE_PHONE)); //配偶手机号码
			responseBody[1].tinyLoanCustomerVO[0].SPOUSE_UNIFIED_ID && (smallLoan.peiCerNo = $.trim(responseBody[1].tinyLoanCustomerVO[0].SPOUSE_UNIFIED_ID)); //配偶证件号码
			responseBody[1].tinyLoanCustomerVO[0].SPOUSE_NAME && (smallLoan.peiName = $.trim(responseBody[1].tinyLoanCustomerVO[0].SPOUSE_NAME)); //配偶姓名
			responseBody[1].tinyLoanCustomerVO[0].SPOUSE_ORG && (smallLoan.peiCompany = $.trim(responseBody[1].tinyLoanCustomerVO[0].SPOUSE_ORG)); //配偶工作单位

			cacheSmallLoanMessage();

		} else if(responseBody[0].results == "08") {
			findLenderInfoSmallLoanFunSuss();
		} else if(responseBody[0].results == "09") {
			showTags({
				'title': '提示', //非必输  默认值：提示
				'content': '查询信息超时！是否继续？', //必输
				'ok': {
					'title': '放弃', //非必输  默认值：取消
					'fun': function() { //非必输  如果输入则执行此函数
						$.mobile.changePage('smallLoan-product.html', {
							reverse: true
						});
					}

				},
				'cancel': {
					'title': '继续', //非必输  默认值：确认
					'fun': function() { //非必输  如果输入则执行此函数
						findLenderInfoSmallLoanFunSuss();
					}
				}

			})
		} else if(responseBody[0].results == "03") {
			//IEstablishCustomerInformationServiceSmallLoanSucc();
			cacheSmallLoanMessage();
		} else {
			showTags({
				'title': '提示',
				'content': responseBody[0].message,
				'ok': {
					'fun': function() {
						$.mobile.changePage('smallLoan-product.html', {
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
					$.mobile.changePage('smallLoan-product.html', {
						reverse: true
					});
				}

			},
			'cancel': {
				'title': '继续', //非必输  默认值：确认
				'fun': function() { //非必输  如果输入则执行此函数
					findLenderInfoSmallLoanFunSuss();
				}
			}

		})
	})
}

//对账单成功回调
function smallLoanFindStatementMainSucc(msg) {
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
		var inquiryDate = dateGetYMD(30);//查询30天的对账单文件
		var sendJson = {
			"b": [{
				"deviceNo.s": commonJson.udId, //设备编号
				"moduleId.s": smallLoan.moduleId, //模块编号
				"tranId.s": smallLoan.tranId, //交易编号
				"orgId.s": commonJson.orgId, //机构号
				"operatorNo.s": commonJson.adminCount, //操作员
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"inquiryDateMin.s": dateYYYYMMDD(inquiryDate[1]),  //查询日期时间
				"inquiryDateMax.s": dateYYYYMMDD(inquiryDate[0]),   //查询日期时间
				"name.s": custermerInfo.name, //姓名
				"certNum.s": custermerInfo.cerNO, //证件号码
				"account.s": '', //账号
				"status.s": '1', //状态
				"page.s": '' //页码
			}]
		};
		findStatementConF(sendJson, smallLoanFindStatementMainSucc);
	} else {
		showTags({
			'title': '提示',
			'content': responseBody[0].message,
			'ok': {}
		});
	}
}

//人行征信搜索成功回调
function smallLoanFindCreditReportInquirySucc(msg) {
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
            $.each(data.creditReferPath.split(';'), function(index, path){
            	var fileName = path.split('/');
            	creditFile += fileName[fileName.length - 1] + ',';
            });
            var li = $('<li>').data('creditInfo', data);
            li.append($('<div>').css('width', '20%').html(data.inquiryDate.split(' ')[0]));
            li.append($('<div>').css('width', '20%').html(creditTypeJson[data.creditType]));
            li.append($('<div>').css({'width': '50%', 'overflow-x': 'auto'}).append($('<u>').html(creditFile.substr(0, creditFile.length - 1))));
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
                'creditType.s': '',	//征信类型
	            'supplementInd.s': '' //是否允许补查
			}]
		};
		findCreditReportInquiryFun(sendJson, function(msg) {
			smallLoanFindCreditReportInquirySucc(msg);
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

//虚拟卡签发地区查询
function sloanIfrp005ServicePSucc(city) {
	var sendJson = {
		"b": [{
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"orgId.s": commonJson.orgId, //机构号
			"moduleId.s": smallLoan.moduleId, //模块编号
			"tranId.s": smallLoan.tranId, //交易编号
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
			$("#smallLoan-addr").html('<option value=""></option>' + textHtml);
		} else if(responseCode[0].results == "08") {
			sloanIfrp005ServicePSucc(city);
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

function sloanCkeckImessageAuthentionServiceYFun() {
	getPlatGlobalSeq(smallLoan, smallLoanZipCompression);
}
//小贷提交
function tinyLoanApplingFunSuss() {
	showLoader('用户信息提交中...');
	//后台取数规则变更，文件列表不再从appBuss里获取，而是从提交接口取  2016-7-13
	var appliform = [];
	if(smallLoan.zhengxinArr.length > 0) {
		appliform = appliform.concat(smallLoan.zhengxinArr);
	}
	if(smallLoan.fillListArr.length > 0) {
		appliform = appliform.concat(smallLoan.fillListArr);
	}
	appliform = JSON.stringify(appliform);
	var sendJson = {
		"b": [{
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"GENDER.s": smallLoanSexJson[custermerInfo.sex], //XINGBIE
			'OTHER_ADDRESS.s': smallLoan.s_city ? (smallLoan.s_city + smallLoan.s_county + smallLoan.addrDetail) : smallLoan.addrDetail, //居住地址
			'COMPANY_ADDRESS.s': smallLoan.day_b ? (smallLoan.day_b + smallLoan.day_c + smallLoan.addrHome) : smallLoan.addrHome, //经营地址
			'JOB_INFO.s': smallLoan.ZhiWu, //职务
			'ORG_ADDRESS.s': smallLoan.zipcode, //单位邮编
			'SPOUSE_ID.s': smallLoan.spouseId, //配偶id
			"workAddress.s": commonJson.workAddress, //工作地址
			"ADDRESS2.s": custermerInfo.address, //身份证上地址
			"orgId.s": commonJson.orgId, //机构号
			"moduleId.s": smallLoan.moduleId, //模块编号
			"tranId.s": smallLoan.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员
			"deviceNo.s": commonJson.udId, //设备编号
			"ACCT_EXEC.s": commonJson.ifsCManagerId, //核心客户经理号
			"UNIFIED_TYPE.s": '0', //证件类型
			"UNIFIED_ID.s": custermerInfo.cerNO, //证件号码
			"UNIFIED_EFFECTIVE_DATE.s": custermerInfo.cerExpdDt.split('-')[1].replace(/\./g, '/'), //证件到期日
			'CUSTOMER_ID.s': smallLoan.customerId, //客户ID
			"OWNER.s": commonJson.tinyLoanUserId, //所属管理员标识符
			'CLIENT_NO.s': smallLoan.CLIENT_NO,
			'username.s': commonJson.TLRNAME,
			'NAME.s': custermerInfo.name,
			'MONTH_EARNING.s': smallLoan.income + '', //月收入
			'BRANCH_ID.s': smallLoan.branchId || commonJson.orgId,
			'LOAN_AMOUNT.s': smallLoan.loanMoney,
			'LOAN_TERM.s': smallLoan.loanTime + '',
			'fixedAmount.s': smallLoan.fixedAmount,
			'fixedTerms.s': smallLoan.fixedTerms,
			'prodSummary.s': smallLoan.proName,
			'LOAN_PURPOSE.s': smallLoan.loanUse,
			'TYPE.s': smallLoan.applyTo,
			'ISS_CITY.s': smallLoan.addrCode,
			'ISS_PLACE.s': smallLoan.addr,
			'ISS_DATE.s': custermerInfo.cerExpdDt.split('-')[0].replace(/\./g, '/'), //证件到期日,
			'ISS_AUTHORITY.s': custermerInfo.issAuthority,
			'PRODUCT_ID.s': smallLoan.prodCode,
			'PAYMENT_METHOD.s': smallLoan.paymentMethod,
			'MOBILE_PHONE.s': smallLoan.mobile, //手机号码
			'signature.s': smallLoan.signHref,
			'WORK_UNITS.s': smallLoan.companyName, //工作单位
			//'MAILING_ADDRESS.s': ,//通讯地址邮编
			'MARRIAGE.s': smallLoan.marriage, //婚姻状况
			'FAMILY_MONTH_EARNING.s': smallLoan.familyIncome + '', //家庭月收入
			'CRARRER.s': smallLoan.occup, //职业
			"SPOUSE_NAME.s": smallLoan.peiName, //配偶姓名
			"SPOUSE_ORG.s": smallLoan.peiCompany, //配偶工作单位
			"SPOUSE_UNIFIED_ID.s": smallLoan.peiCerNo, //配偶证件号码
			"SPOUSE_MOBILE_PHONE.s": smallLoan.peiPhone, //配偶手机号码
			"faceRecogn.s": smallLoan.faceRecogn, //人脸识别
			"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
			"platGlobalSeq.s": smallLoan.platGlobalSeq,
			"FILE_COUNT.s": '2', //文件上传数量
			"longitude.s": commonJson.longitude, //
			"latitude.s": commonJson.latitude, //
			"isAgreeSign.s": smallLoan.ismateagree,//配偶是否同意签字
			"isHasBondsman.s": smallLoan.canofferguarantee,//是否能提供担保人
			"operatingPeriod.s": smallLoan.unitopentime,//单位经营时间
			"houseStatus.s": smallLoan.houseproperty,//房产情况
			"businessType.s": smallLoan.businessType,//流程类型
			"age.s": calculateage(custermerInfo.cerNO),//年龄
			"SCORE_CARD_ID.s": smallLoan.SCORE_CARD_ID, //
			"SCORE_CARD_DATA.s": JSON.stringify(smallLoan.smallLoanScorePdfObjon), //生成pdf需要上传的参数
			"FILE_LIST.s": appliform //文件列表
		}]
	};
	console.log(sendJson);
	tinyLoanApplingFun(sendJson, function(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		if(responseCode[0].results == "00") {
			showLoader('用户信息提交中...');
			smallLoan.appliform = [];
			smallLoan.zhengxinArr.length > 0 && (smallLoan.appliform = smallLoan.appliform.concat(smallLoan.zhengxinArr));
			smallLoan.fillListArr.length > 0 && (smallLoan.appliform = smallLoan.appliform.concat(smallLoan.fillListArr));
			smallLoan.appliform.push(responseCode[1].tinyLoanApplicationVO[0].appliform);
			smallLoan.appliform.push(responseCode[1].tinyLoanApplicationVO[0].scoreCardPdf);
			console.log(smallLoan.appliform);
			smallLoan.customerId = responseCode[1].tinyLoanApplicationVO[0].CUSTOMER_ID;
			var appBus = {
				'busiGloablaSeq': smallLoan.platGlobalSeq, //业务编号
				'attchType': '4', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
				'OPER_TYPE': 'ADD',
				'CUSTOMER_ID': smallLoan.customerId, //客户ID
				'APPLY_NO': responseCode[1].tinyLoanApplicationVO[0].APPLICATION_ID, //申请编号
				"OWNER": commonJson.tinyLoanUserId, //所属管理员标识符
				'FILE_LIST': smallLoan.appliform,
				'deviceNo': commonJson.udId, //设备编号
				'moduleId': smallLoan.moduleId, //模块编号
				'tranId': smallLoan.tranId, //交易编号
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
			var sql = "UPDATE up_download_info SET appBuss = '" + appBusJson + "' WHERE fileToken = '" + smallLoan.phoneTime + "'";
			executeSqlString(sql, 'exe', function() {
				hideLoader();
				changeUploadStatus('02', smallLoan.phoneTime, smallLoan.signTime);
				//缓存个人信息
				if((!commonJson.isCustermerInfoMultiplex || commonJson.isCustermerInfoMultiplex == 0) && (lianwanghechaData.CheckResult == '00' || lianwanghechaData.CheckResult == '02')) {
					cacheCustermerInfo({
						"databaseName": "myDatabase",
						"tableName": "customer_info",
						"data": [{
							"ADMINCOUNT": commonJson.adminCount, //登陆账号
							"SUBMITTIME": myTime.CurTime(), //提交时间
							"BUSINESSTYPE": "申请小微贷款", //业务类型
							"NATION": custermerInfo.nation, //民族
							"CERTNUM": custermerInfo.cerNO, //身份证号码
							"ADDRESS": custermerInfo.address, //地址
							"MASCARDNAME": custermerInfo.name, //姓名
							"CERTVALIDDATE": custermerInfo.cerExpdDt, //有效日期
							"BIRTH": custermerInfo.birthday, //出生日期
							"SEX": custermerInfo.sex, //性别
							"ISSAUTHORITY": custermerInfo.issAuthority, //签发机关
							"IMAGE": custermerInfo.image, //身份证头像图片
							"CUSTANDCUSTOWNERPIC": smallLoan.applicationObj.mPicFileARR[1], //与客户合影照片
							"FRONTIDCARDPIC": smallLoan.applicationObj.mPicFileARR[2], //身份证正面
							"BACKIDCARDPIC": smallLoan.applicationObj.mPicFileARR[3], //身份证反面
							"checkPhoto": smallLoan.mInfo.lianPic //联网核查图片
						}]
					});
				}
				$.mobile.changePage('smallLoan-complete.html');
			}, function(err) {
				hideLoader();
				showTags({
					'title': '提示',
					'content': '更新数据库失败，请联系技术人员！',
					'ok': {}
				});
			});
		} else if(responseCode[0].results == "08") {
			tinyLoanApplingFunSuss();
		} else if(responseCode[0].results == "09") {
			hideLoader();
			showTags({
				'title': '提示',
				'content': '业务处理超时！',
				'ok': {
					'title': '继续处理',
					'fun': function() {
						tinyLoanApplingFunSuss();
					}
				}
			});
		} else {
			changeUploadStatus('03', smallLoan.phoneTime, smallLoan.signTime);
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}, function(err) {
		funFaillilvANDwh(err, tinyLoanApplingFunSuss);
	})
}

//小贷提交后 影像上传
function smallLoanZipCompression() {
	showLoader('影像压缩中。。。。');
	smallLoan.phoneTime = myTime.CurTime();
	smallLoan.signTime = smallLoan.phoneTime + 1;
	//影像上传文件打包压缩插件--->客户资料
	Meap.zipCompression(smallLoan.platGlobalSeq, smallLoan.applicationObj.mPicFileARR, function(msg) {
		//影像上传 业务参数
		var appBus = {
			'busiGloablaSeq': smallLoan.platGlobalSeq, //业务编号
			'attchType': '4', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
			'OPER_TYPE': 'ADD',
			'CUSTOMER_ID': '', //客户ID
			"OWNER": commonJson.tinyLoanUserId, //所属管理员标识符
			'FILE_LIST': '',
			'deviceNo': commonJson.udId, //设备编号
			'moduleId': smallLoan.moduleId, //模块编号
			'tranId': smallLoan.tranId, //交易编号
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
				'fileToken': smallLoan.phoneTime, //文件唯一ID(可以为时间挫
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
			Meap.transFormImage(smallLoan.platGlobalSeq + 'sign', smallLoan.signHref, 'picSty', function(msg) {
				var appBussSign = {
					'busiGloablaSeq': smallLoan.platGlobalSeq, //业务编号
					'attchType': '1', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
					'deviceNo': commonJson.deviceNo, //设备编号
					'moduleId': smallLoan.moduleId, //模块编号
					'tranId': smallLoan.tranId, //交易编号
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
						"fileToken": smallLoan.signTime, //文件唯一ID(可以为时间挫
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
					tinyLoanApplingFunSuss();
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
//小贷查询
function findApplicationFunSuss(pageNum, timeStart, timeEnd, name, cerId, state) {
	showLoader("贷款办理进度查询中...");
	var suoJson = { //发送请求的参数
		"b": [{
			"deviceNo.s": commonJson.udId, //设备编号
			"moduleId.s": smallLoan.moduleId, //模块编号
			"tranId.s": smallLoan.tranId, //交易编号
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
			"APPLICATION_STATUS.s": state || '', //       //办理进度
			"OWNER.s": commonJson.tinyLoanUserId //所属管理员标识符
		}]
	};
	console.log(suoJson);
	findApplicationFun(suoJson, function(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		var textHtml = '<div class="queryProcess-title com-title"><div>姓名</div><div>证件号码</div><div>申请时间</div><div>贷款产品</div><div>贷款金额</div><div>办理进度</div><div>拒绝原因</div></div>';
		if(responseCode[0].results == "00") { // 接口处理成功
			if(responseCode.length <= 1) {
				textHtml += '<li style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</li>';
				$(".page-number-con").show();
			} else {
				daikuanapplicationObj.responseCode = responseCode[1].tinyLoanApplicationVO;
				daikuanapplicationObjon = [];
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
							'<div>' + smallLoanStatusObj[DATA[0].APPLICATION_STATUS] + '</div>' +
							'<div>' + DATA[0].REJECT_REASON + '</div>' +
							'</li>';
						daikuanapplicationObjon.push(DATA);
					}
				});
			};
			$('#queryProcess-con').html(textHtml);
			$(".page-number-con").show();
			$('#daikuan_bucongziliao').removeClass('btn_next');
			//分页
			$(".page-number-con").createPage({
				pageCount: Math.ceil(responseCode[0]['totalNum.i'] / 7),
				current: pageNum,
				backFn: function(p) {
					findApplicationFunSuss(p, timeStart, timeEnd, name);
				}
			});
			//添加事件
			$(".queryProcess-con .box-rows").on('tap', function(ev) {
				var oTarget = ev.target;
				_this = $(oTarget).closest('.box-rows');
				$(_this).addClass('list-bgcolor').siblings().removeClass('list-bgcolor');
				$('#daikuan_bucongziliao').addClass('btn_next');
			});

		} else if(responseCode[0].results == "03") {
			$('.box-content').html('<li style="line-height:40px;margin-top:30px;text-align:center;">未查询到业务数据</li>');
			$(".page-number-con").hide();
		} else if(responseCode[0].results == "08") {
			findApplicationFunSuss(pageNum, timeStart, timeEnd, name);
		} else if(responseCode[0].results == "09") {
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
						findApplicationFunSuss(pageNum, timeStart, timeEnd, name);
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

/**小微贷款获取评分卡*/
function queryScoreCardItemsFun() { //20160829修改成功回调方法为函数方法，为了自己定义失败回调函数
	showLoader('评分卡查询中...');
	var sendJson = {
		"b": [{
			"deviceNo.s": commonJson.udId, //设备编号
			"moduleId.s": smallLoan.moduleId, //模块编号
			"tranId.s": smallLoan.tranId, //交易编号
			"orgId.s": commonJson.orgId, //机构号
			"operatorNo.s": commonJson.adminCount, //操作员
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"USERID.s": commonJson.losUserId, //LOS用户
			"SCORE_CARD_ID.s": smallLoan.SCORE_CARD_ID || '', //小贷评分卡记录ID
			"CUSTNAME.s": custermerInfo.name, //身份证上姓名
			"CERTTYPE.s": '0',
			"CERTID.s": custermerInfo.cerNO, //身份证号码
			"SCORE_CARD_NO.s": smallLoan.SCORE_CARD_NO //小微贷产品对应评分表编号
		}]
	};

	queryScoreItemFun(sendJson, function(msg) {
		var responseBody = responseBodySuccFormat(msg);
		//		var singleHtml = '';
		//		var fillblankHtml = '';
		var messageHtml = '';
		var textHtml = '';
		console.log(responseBody);

		$('.confirm_ul').empty();

		if(responseBody[0].results == '00') {
			if(responseBody.length < 2) {
				showTags({
					'title': '提示',
					'content': '未查询到相关产品的评分卡，请联系管理人员',
					'ok': {}
				});
			} else {
				
				var  scoreItemsBody = responseBody[1].hashMap[1].scoreItems;
				smallLoan.SCORE_CARD_ID=responseBody[1].hashMap[0].SCORE_CARD_ID;
				$.each(scoreItemsBody, function(index, val) {
					var type = val.scoreItemVO[0].DISPLAY_TYPE; //判断是否是需要取下拉列表 1-是，0,2-否
					var isScoreItem = val.scoreItemVO[0].IS_SCORE_ITEM; //判断是否是评分项0-结果项，需反显 1-评分项，需要填写 2-非评分项  需要填写，但评分时不上送
					var isNum = val.scoreItemVO[0].IS_AMT; //表示该项的值是否是数值，0-否，1-是，需要控制输入

					var itemValue = val.scoreItemVO[0].ITEM_VALUE; //需要反填的值

					if(isScoreItem == '0') { //结果项，反显
						if(val.scoreItemVO[0].CATE_NAME == 'maxline'){//20160926修改为只取一项结果项
							if(isNum == '1') {
							messageHtml += '<li>' +
								'<div class="xianshi-class"><span class = "resultInpt numOnly" id = "' +
								val.scoreItemVO[0].CATE_NAME + '"' +
								'data-no = "' + val.scoreItemVO[0].ORDER_NO + '"' +
								'data-isnum = "' + isNum + '"' +
								'data-model = "' + val.scoreItemVO[0].HEAD_NAME + '"' +
								'data-description = "' + val.scoreItemVO[0].CATE_DESCRIPTION + '"' +
								'data-type = "' + isScoreItem + '"' +
								'></span>元</div>' +
								'</li>';

						} else {
							messageHtml += '<li>' +
								'<div class="seach-day-header">' + val.scoreItemVO[0].CATE_DESCRIPTION + '&nbsp;:</div><div class="xianshi-class"><span class = "resultInpt" id = "' +
								val.scoreItemVO[0].CATE_NAME + '"' +
								'data-no = "' + val.scoreItemVO[0].ORDER_NO + '"' +
								'data-isnum = "' + isNum + '"' +
								'data-model = "' + val.scoreItemVO[0].HEAD_NAME + '"' +
								'data-description = "' + val.scoreItemVO[0].CATE_DESCRIPTION + '"' +
								'data-type = "' + isScoreItem + '"' +
								'></span></div>' +
								'</li>';
						}
						}
						
					} else { //非结果项 统一的开头
						textHtml += '<li><div class="basic_rows_name_div1"><div>' + val.scoreItemVO[0].CATE_DESCRIPTION + '</div></div>';
						if(itemValue != null && itemValue != '') { //有征信查询的值返回的显示在第二栏内
							if(type == '1'){
								textHtml += '<div class="basic_rows_name_div2"> <span class="basic_rows_2">' + choiceformat(itemValue) + '</span></div>';
							}else{
								if(isNum == '1'){
									textHtml += '<div class="basic_rows_name_div2"> <span class="basic_rows_2">' + transmoney(itemValue) + '</span></div>';
								}else{
									textHtml += '<div class="basic_rows_name_div2"> <span class="basic_rows_2">' + itemValue + '</span></div>';
								}
								
							}
							
						} else {
							textHtml += '<div class="basic_rows_name_div2"> <span class="basic_rows_2"></span></div>';
						}
						if(isScoreItem == '1') { //评分项
							if(type == '1') { //需要获取下拉框的值
								textHtml += '<div class="basic_rows_name_div2"> <div class="additional-materials-input">' +
									'<select id = "' + val.scoreItemVO[0].CATE_NAME + '" class="drop-down optionIpt" ' +
									'data-no = "' + val.scoreItemVO[0].ORDER_NO + '" ' +
									'data-isnum = "' + isNum + '" ' +
									'data-model = "' + val.scoreItemVO[0].HEAD_NAME + '" ' +
									'data-description = "' + val.scoreItemVO[0].CATE_DESCRIPTION + '" ' +
									'data-type = "' + isScoreItem + '" >';
								if(itemValue != '' && itemValue != null) { //给选项加上一个空值的，有征信的值返回的不选中，没有征信值返回的选中
									textHtml += '<option value =""></option>';
								} else {
									textHtml += '<option value ="" selected></option>';
								}
								var options = val.scoreItemVO[1].CATECODE[0].CODEMAP;
								$.each(options, function(num, element) {
									if(itemValue == element.optionVO[0].value) {
										textHtml += '<option value = "' + element.optionVO[0].value + '"' + 'selected ' +
											'data-value = "' + element.optionVO[0].name + '">' +
											element.optionVO[0].name + '</option>';
									} else {
										textHtml += '<option value = "' + element.optionVO[0].value + '"' +
											'data-value = "' + element.optionVO[0].name + '">' +
											element.optionVO[0].name + '</option>';
									}
								});
								textHtml += '</select></div></div></li>'
							} else { //不需要下拉列表值的填空题
								if(itemValue != '' && itemValue != null) { //有征信的值返回需要反显的
									if(isNum == '1') { //是数值型的值
										textHtml += '<div class="basic_rows_name_div2"> <div class="basic_rows_name_div2-se">' +
											'<input type="text" class="basic_rows_name_div2-sel textInput numOnly" data-role="none" reg="mobile"' +
											'value = "' + transmoney(itemValue) + '" name = "' + val.scoreItemVO[0].CATE_NAME + '"' +
											'data-no = "' + val.scoreItemVO[0].ORDER_NO + '"' +
											'data-isnum = "' + isNum + '"' +
											'data-model = "' + val.scoreItemVO[0].HEAD_NAME + '"' +
											'data-description = "' + val.scoreItemVO[0].CATE_DESCRIPTION + '"' +
											'data-type = "' + isScoreItem + '"' +
											'/></div></div></li>';
									} else {
										textHtml += '<div class="basic_rows_name_div2"> <div class="basic_rows_name_div2-se">' +
											'<input type="text" class="basic_rows_name_div2-sel textInput" data-role="none" reg="mobile"' +
											'value = "' + itemValue + '" name = "' + val.scoreItemVO[0].CATE_NAME + '"' +
											'data-no = "' + val.scoreItemVO[0].ORDER_NO + '"' +
											'data-isnum = "' + isNum + '"' +
											'data-model = "' + val.scoreItemVO[0].HEAD_NAME + '"' +
											'data-description = "' + val.scoreItemVO[0].CATE_DESCRIPTION + '"' +
											'data-type = "' + isScoreItem + '"' +
											'/></div></div></li>';
									}

								} else { //无征信返回的值，不需要反显的
									if(isNum == '1') { //是数值型的值
										textHtml += '<div class="basic_rows_name_div2"> <div class="basic_rows_name_div2-se">' +
											'<input type="text" class="basic_rows_name_div2-sel textInput numOnly" data-role="none" reg="mobile"' +
											'name = "' + val.scoreItemVO[0].CATE_NAME + '"' +
											'data-no = "' + val.scoreItemVO[0].ORDER_NO + '"' +
											'data-isnum = "' + isNum + '"' +
											'data-model = "' + val.scoreItemVO[0].HEAD_NAME + '"' +
											'data-description = "' + val.scoreItemVO[0].CATE_DESCRIPTION + '"' +
											'data-type = "' + isScoreItem + '"' +
											'/></div></div></li>';
									} else {
										textHtml += '<div class="basic_rows_name_div2"> <div class="basic_rows_name_div2-se">' +
											'<input type="text" class="basic_rows_name_div2-sel textInput" data-role="none" reg="mobile"' +
											'name = "' + val.scoreItemVO[0].CATE_NAME + '"' +
											'data-no = "' + val.scoreItemVO[0].ORDER_NO + '"' +
											'data-isnum = "' + isNum + '"' +
											'data-model = "' + val.scoreItemVO[0].HEAD_NAME + '"' +
											'data-description = "' + val.scoreItemVO[0].CATE_DESCRIPTION + '"' +
											'data-type = "' + isScoreItem + '"' +
											'/></div></div></li>';
									}

								}
							}
						} else { //非评分项
							if(type == '1') { //需要获取下拉框的值
								textHtml += '<div class="basic_rows_name_div2"> <div class="additional-materials-input">' +
									'<select id = "' + val.scoreItemVO[0].CATE_NAME + '" class="drop-down optionIpt noScore" ' +
									'data-no = "' + val.scoreItemVO[0].ORDER_NO + '" ' +
									'data-isnum = "' + isNum + '" ' +
									'data-model = "' + val.scoreItemVO[0].HEAD_NAME + '" ' +
									'data-description = "' + val.scoreItemVO[0].CATE_DESCRIPTION + '" ' +
									'data-type = "' + isScoreItem + '" >';
								if(itemValue != '' && itemValue != null) { //给选项加上一个空值的，有征信的值返回的不选中，没有征信值返回的选中
									textHtml += '<option value =""></option>';
								} else {
									textHtml += '<option value ="" selected></option>';
								}
								var options = val.scoreItemVO[1].CATECODE[0].CODEMAP;
								$.each(options, function(num, element) {
									if(itemValue == element.optionVO[0].value) {
										textHtml += '<option value = "' + element.optionVO[0].value + '"' + 'selected ' +
											'data-value = "' + element.optionVO[0].name + '">' +
											element.optionVO[0].name + '</option>';
									} else {
										textHtml += '<option value = "' + element.optionVO[0].value + '"' +
											//													'class = "noScore optionIpt"' +
											'data-value = "' + element.optionVO[0].name + '">' +
											element.optionVO[0].name + '</option>';
									}
								});
								textHtml += '</select></div></div></li>'
							} else { //不需要下拉列表值的填空题
								if(itemValue != '' && itemValue != null) { //有征信的值返回需要反显的
									if(isNum == '1') { //是数值型的值
										textHtml += '<div class="basic_rows_name_div2"> <div class="basic_rows_name_div2-se">' +
											'<input type="text" class="basic_rows_name_div2-sel textInput numOnly noScore" data-role="none" reg="mobile"' +
											'value = "' + transmoney(itemValue) + '" name = "' + val.scoreItemVO[0].CATE_NAME + '"' +
											'data-no = "' + val.scoreItemVO[0].ORDER_NO + '"' +
											'data-isnum = "' + isNum + '"' +
											'data-model = "' + val.scoreItemVO[0].HEAD_NAME + '"' +
											'data-description = "' + val.scoreItemVO[0].CATE_DESCRIPTION + '"' +
											'data-type = "' + isScoreItem + '"' +
											'/></div></div></li>';
									} else {
										textHtml += '<div class="basic_rows_name_div2"> <div class="basic_rows_name_div2-se">' +
											'<input type="text" class="basic_rows_name_div2-sel textInput noScore" data-role="none" reg="mobile"' +
											'value = "' + itemValue + '" name = "' + val.scoreItemVO[0].CATE_NAME + '"' +
											'data-no = "' + val.scoreItemVO[0].ORDER_NO + '"' +
											'data-isnum = "' + isNum + '"' +
											'data-model = "' + val.scoreItemVO[0].HEAD_NAME + '"' +
											'data-description = "' + val.scoreItemVO[0].CATE_DESCRIPTION + '"' +
											'data-type = "' + isScoreItem + '"' +
											'/></div></div></li>';
									}

								} else { //无征信返回的值，不需要反显的
									if(isNum == '1') { //是数值型的值
										textHtml += '<div class="basic_rows_name_div2"> <div class="basic_rows_name_div2-se">' +
											'<input type="text" class="basic_rows_name_div2-sel textInput numOnly noScore" data-role="none" reg="mobile"' +
											'name = "' + val.scoreItemVO[0].CATE_NAME + '"' +
											'data-no = "' + val.scoreItemVO[0].ORDER_NO + '"' +
											'data-isnum = "' + isNum + '"' +
											'data-model = "' + val.scoreItemVO[0].HEAD_NAME + '"' +
											'data-description = "' + val.scoreItemVO[0].CATE_DESCRIPTION + '"' +
											'data-type = "' + isScoreItem + '"' +
											'/></div></div></li>';
									} else {
										textHtml += '<div class="basic_rows_name_div2"> <div class="basic_rows_name_div2-se">' +
											'<input type="text" class="basic_rows_name_div2-sel textInput noScore" data-role="none" reg="mobile"' +
											'name = "' + val.scoreItemVO[0].CATE_NAME + '"' +
											'data-no = "' + val.scoreItemVO[0].ORDER_NO + '"' +
											'data-isnum = "' + isNum + '"' +
											'data-model = "' + val.scoreItemVO[0].HEAD_NAME + '"' +
											'data-description = "' + val.scoreItemVO[0].CATE_DESCRIPTION + '"' +
											'data-type = "' + isScoreItem + '"' +
											'/></div></div></li>';
									}

								}
							}
						}

					}
				});
				messageHtml += '<li>' +
					'<div class="fangqi-seach" style="float: left;">重新评分</div>' +
					'<div class="fangqi-seach" style="float: right;">继续</div>' +
					'</li>';

				console.log(textHtml);
				//							console.log(fillblankHtml);
				//							console.log(messageHtml);
				$('.confirm_ul').html(textHtml).trigger('create');
				//				$('#smallloansigle-choice').html(singleHtml);
				//				$('#smallloanfillblank').html(fillblankHtml);
				$('#resultlist').html(messageHtml);
				$('#smallLoan-scorecard .previous').addClass('btn_next');


			}

			//数值型的输入框显示js控制
			$('#smallLoan-scorecard .textInput.numOnly').on('tap', this, function() {
				var _val = $(this).val();
				$(this).val(rmoney(_val));
			});

			$('#smallLoan-scorecard .textInput.numOnly').on('blur', this, function() {
				var _val = $(this).val().replace(/[^0-9\.\-]/ig, "");
				$(this).val(transmoney(_val));
			});

		} else if(responseBody[0].results == '09') {

			showTags({
				'title': '提示',
				'content': '系统超时，' + responseBody[0].message + '，是否继续？',
				'cancel': {
					'title': '继续',
					fun: function() {
						queryScoreCardItemsFun();
					}
				},
				'ok': {
					'title': '放弃',
					'fun': function() {
						$.mobile.changePage('./smallLoan-product.html', {
							reverse: true
						});
					}
				}
			});

		} else if(responseBody[0].results == '08') {
			queryScoreCardItemsFun();
		} else {
			showTags({
				'title': '提示',
				'content': responseBody[0].message,
				'ok': {
					'title': '确定',
					'fun': function() {
						$.mobile.changePage('./smallLoan-product.html', {
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
		if($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
			Meap.isNetConnect(function(msg) {
				if(msg == '01' || msg == '02') {
					responseCode.message = '未接收到后台响应!';
				} else if(msg == '03') {
					responseCode.message = '当前网络不可用,请检测网络是否畅通!是否继续？';
				}

				showTags({
					'title': '提示',
					'content': responseCode.message,
					'cancel': {
						'title': '继续',
						'fun': function() {
							queryScoreCardItemsFun();
						}
					},
					'ok': {
						'title': '放弃',
						'fun': function() {
							$.mobile.changePage('smallLoan-product.html', {
								reverse: true
							});
						}
					}
				});
			}, function(err) {
				responseCode.message = '当前网络不可用,请检测网络是否畅通!是否继续？';
				showTags({
					'title': '提示',
					'content': responseCode.message,
					'cancel': {
						'title': '继续',
						'fun': function() {
							queryScoreCardItemsFun();
						}
					},
					'ok': {
						'title': '放弃',
						'fun': function() {
							$.mobile.changePage('smallLoan-product.html', {
								reverse: true
							});
						}
					}
				});
			})
		}
		if($.trim(responseCode.message).toUpperCase() == 'THE REQUEST TIMED OUT') { //全部改成大写即可捕获
			responseCode.message = '系统超时,是否继续？';
			showTags({
				'title': '提示',
				'content': responseCode.message,
				'cancel': {
					'title': '继续',
					'fun': function() {
						queryScoreCardItemsFun();
					}
				},
				'ok': {
					'title': '放弃',
					'fun': function() {
						$.mobile.changePage('smallLoan-product.html', {
							reverse: true
						});
					}
				}
			});
		} else if($.trim(responseCode.message).toUpperCase() == 'ERR_REQUEST_ABORTED') { //全部改成大写即可捕获
			responseCode.message = '接口服务处理异常,请重试!';
			showTags({
				'content': responseCode.message, //必输
				'ok': {}

			})
		}
	});

}

/**小微贷款提交评分获取结果*/
function createAndCalculateScoreCardSucc(msg) {
	var responseBody = responseBodySuccFormat(msg);
	//	console.log(responseBody);
	if(responseBody[0].results == '00') {
		if(responseBody.length < 2) {
			alert("返回的结果有误，请联系管理人员");
		} else {
//			var resultid = responseBody[1].hashMap[0].SCORE_CARD_ID;
//			if(resultid != null) {
//				smallLoan.SCORE_CARD_ID = resultid;
//			}
			
			$('#smallloan-scorecard-uname').text(custermerInfo.name);
			var cerNO = custermerInfo.cerNO;
			if(cerNO.charAt(16) % 2 == 0){
				$('#smallloan-scorecard-usex').text('女士');
			}else{
				$('#smallloan-scorecard-usex').text('先生');
			}

			var elements = responseBody[1].hashMap[1].RESULT;
			$.each(elements, function(index, val) {
				var id = val.scoreItemValueVO[0].CATE_NAME;
				var value = val.scoreItemValueVO[0].ITEM_VALUE;
				if($('#' + id + '').hasClass('numOnly')) {
					value = transmoney(value); //格式化显示金额类型变量
				}
				$('#' + id + '').text(value);
			});
			$('#smallLoan-scorecard .search-day-con').show();
			$('#resultlist').show();

			//点击搜索框的放弃按钮
			$('.fangqi-seach').eq(0).off('click').on('click', function() {
				$('.search-day-con').hide();
			});

			//点击弹出框中的继续按钮
			$('.fangqi-seach').eq(1).off('click').on('click', function() {
//				console.log('继续按钮点击');
//				console.log(smallLoan.smallLoanScorePdfObjon);
				//获取所有输入框的内容
				$('#smallLoan-scorecard .textInput').each(function(index, ele) {
					var smallLoanScorePdfObj = {
						CATE_DESCRIPTION: '',
						ITEM_VALUE: '',
						IS_SCORE_ITEM: '',
						HEAD_NAME: '',
						ORDER_NO: '',
						IS_AMT: ''
					};

					var value = $(ele).val();
					//					if($(this).hasClass('numOnly')){
					//						value = rmoney(value);
					//					}

					smallLoanScorePdfObj.IS_AMT = $(ele).attr('data-isnum');
					smallLoanScorePdfObj.CATE_DESCRIPTION = $(ele).attr('data-description');
					smallLoanScorePdfObj.ITEM_VALUE = value;
					smallLoanScorePdfObj.IS_SCORE_ITEM = $(ele).attr('data-type');
					smallLoanScorePdfObj.HEAD_NAME = $(ele).attr('data-model');
					smallLoanScorePdfObj.ORDER_NO = $(ele).attr('data-no');

					smallLoan.smallLoanScorePdfObjon.push(smallLoanScorePdfObj);

				});
				//获取所有单选的内容
				$('#smallLoan-scorecard select.optionIpt').each(function(index, ele) {
					var smallLoanScorePdfObj = {
						CATE_DESCRIPTION: '',
						ITEM_VALUE: '',
						IS_SCORE_ITEM: '',
						HEAD_NAME: '',
						ORDER_NO: '',
						IS_AMT: ''
					};

					var id = $(ele).attr('id');
					var value = $('#' + id).find("option:selected").text();
					smallLoanScorePdfObj.CATE_DESCRIPTION = $(ele).attr('data-description');
					smallLoanScorePdfObj.ITEM_VALUE = value;
					//					smallLoanScorePdfObj.ITEM_VALUE = $(ele).attr('data-value');
					//					smallLoanScorePdfObj.ITEM_VALUE = choiceformat($(ele).attr('data-value'));
					smallLoanScorePdfObj.IS_SCORE_ITEM = $(ele).attr('data-type');
					smallLoanScorePdfObj.HEAD_NAME = $(ele).attr('data-model');
					smallLoanScorePdfObj.ORDER_NO = $(ele).attr('data-no');
					smallLoanScorePdfObj.IS_AMT = $(ele).attr('data-isnum');

					smallLoan.smallLoanScorePdfObjon.push(smallLoanScorePdfObj);
				});

				$('#smallLoan-scorecard .resultInpt').each(function(index, ele) {
					var smallLoanScorePdfObj = {
						CATE_DESCRIPTION: '',
						ITEM_VALUE: '',
						IS_SCORE_ITEM: '',
						HEAD_NAME: '',
						ORDER_NO: '',
						IS_AMT: ''
					};

					var value = $(ele).text();
					//					if($(ele).hasClass('numOnly')){
					//						value = rmoney(value);
					//					}//现在后台不需要重新转化成数字形式的值

					smallLoanScorePdfObj.CATE_DESCRIPTION = $(ele).attr('data-description');
					smallLoanScorePdfObj.ITEM_VALUE = value;
					smallLoanScorePdfObj.IS_SCORE_ITEM = $(ele).attr('data-type');
					smallLoanScorePdfObj.HEAD_NAME = $(ele).attr('data-model');
					smallLoanScorePdfObj.ORDER_NO = $(ele).attr('data-no');
					smallLoanScorePdfObj.IS_AMT = $(ele).attr('data-isnum');

					smallLoan.smallLoanScorePdfObjon.push(smallLoanScorePdfObj);
				});

				//				console.log(JSON.stringify(smallLoan.smallLoanScorePdfObjon));
				//				sloanIcustomerInfoServiceFun();
//				console.log(smallLoan.smallLoanScorePdfObjon);
				$.mobile.changePage('smallLoan-cusPicture.html');
			});
		}
	} else if(responseBody[0].results == '09') {
		showTags({
			'title': '提示',
			'content': responseBody[0].message,
			'ok': {}
		});

	} else if(responseBody[0].results == '08') {
		showLoader('提交评分中...');
		var createJson = { //发送请求的参数
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
				"CERTTYPE.s": '0', //证件类型
				"CERTID.s": custermerInfo.cerNO, //身份证号码
				"SCORE_CARD_NO.s": smallLoan.SCORE_CARD_NO, //小微贷评分卡类型
				"IN_MAP.s": JSON.stringify(smallLoanScoreObjon) //选择的答案
			}]
		};
		createAndCalculateScoreCardFun(createJson, function(msg) {
			createAndCalculateScoreCardSucc(msg);
		}, function(err) {
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