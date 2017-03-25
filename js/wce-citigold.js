//基金理财产品信息查询 成功回调
function IFinancialProductsServiceSucc(msg) {
	citigoldSortData.BianLiangPanDuan = '2';
	//alert(msg)
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	var textHtml = '';
	if (responseCode[0].results == '00') {
		$.each(responseCode, function(index, el) {
			if (index == 0) return true;
			// EnableTrans='"+el.queryFinancialProductsVO[0].EnableTrans+"' CurrType='"+el.queryFinancialProductsVO[0].CurrType+"'
			textHtml += "<li class='box-rows' returnJsonStr='" + JSON.stringify(el.queryFinancialProductsVO[0]) + "'>" +
				"<div>" + el.queryFinancialProductsVO[0].PrdName + "</div>" +
				"<div>" + el.queryFinancialProductsVO[0].PrdCode + "</div>" +
				"<div>" + PrdAttr[el.queryFinancialProductsVO[0].PrdAttr] + "</div>" +
				"<div>" + fmoney(el.queryFinancialProductsVO[0].m_nav, 4) + "</div>" +
				"<div>" + el.queryFinancialProductsVO[0].PriceDate.split(' ')[0] + "</div>" +
				"<div>" + fmoney(el.queryFinancialProductsVO[0].ReturnInception, 4) + "</div>" +
				"<div>" + downSideRisk[el.queryFinancialProductsVO[0].Y1_DRQuartileRank] + "</div>" +
				"<div>" + riskLevelStar[el.queryFinancialProductsVO[0].StarRatingOverall] + "</div>" +
				"</li>";
		});
		$('.box-content').html(textHtml);
	} else {
		if (responseCode[0].results == '08') {
			hideLoader();
			showLoader('加载中...');
			var sendJson = {
				"b": [{
					"orgId.s": commonJson.orgId,
					"moduleId.s": citigoldJson.moduleID, //模块编号
					"tranId.s": citigoldJson.tranId, //交易编号
					"operatorNo.s": commonJson.adminCount, //操作员
					"deviceNo.s": commonJson.udId, //设备编号
					"offlineOnline.s": 'online', //脱机/联机
					"TACode.s": "", //TA代码
					"PrdCode.s": goldInsJson.codePro, //产品代码
					"PrdType.s": "0", //产品类别为空则表示不区分 0-基金 1-国内理财 2-境外理财产品
					"pageNum.s": "" //查询页码
				}]
			};
			IFinancialProductsServiceFun(sendJson, function(msg) {
				IFinancialProductsServiceSucc(msg)
			}, function(err) {
				funFail(err);
			})
		} else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
}
//基金理财主推产品信息查询 成功回调
function IFinancialProductsServiceZtSucc(msg) {
	//alert(msg);
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	var textHtml = '';
	if (responseCode[0].results == '00') {
		$.each(responseCode, function(index, el) {
			if (index == 0) return true;
			if (index % 3 == 1) {
				textHtml += "<div class='swiper-slide'>" +
					"<ul class='featured-hot-ul'>" +
					"<li returnJsonStr='" + JSON.stringify(el.queryFinancialProductsVO[0]) + "'>" +
					"<div class='featured-hot-border1'>" +
					"<div class='featured-hot-border2'>" +
					"<span class='featured-hot-top featured-hot-top1'>" + PrdAttr[el.queryFinancialProductsVO[0].PrdAttr] + "</span>" +
					"<p class='featured-hot-mc'>" + el.queryFinancialProductsVO[0].PrdName + "</p>" +
					"<p class='featured-hot-sz'>" + el.queryFinancialProductsVO[0].PrdCode + "</p>" +
					"</div>" +
					"</div>" +
					"<div class='goumai-dingtou'>" +
					"<a href='#' isGMorDT='GM' class='goumai'>购买</a>" +
					"<a href='#' isGMorDT='DT' class='dingtou'>定投</a>" +
					"</div>" +
					"</li>";
			} else if (index % 3 == 0) {
				textHtml += "<li returnJsonStr='" + JSON.stringify(el.queryFinancialProductsVO[0]) + "'>" +
					"<div class='featured-hot-border1'>" +
					"<div class='featured-hot-border2'>" +
					"<span class='featured-hot-top featured-hot-top1'>" + PrdAttr[el.queryFinancialProductsVO[0].PrdAttr] + "</span>" +
					"<p class='featured-hot-mc'>" + el.queryFinancialProductsVO[0].PrdName + "</p>" +
					"<p class='featured-hot-sz'>" + el.queryFinancialProductsVO[0].PrdCode + "</p>" +
					"</div>" +
					"</div>" +
					"<div class='goumai-dingtou'>" +
					"<a href='#' isGMorDT='GM' class='goumai'>购买</a>" +
					"<a href='#' isGMorDT='DT' class='dingtou'>定投</a>" +
					"</div>" +
					"</li></ul></div>";
			} else {
				textHtml += "<li returnJsonStr='" + JSON.stringify(el.queryFinancialProductsVO[0]) + "'>" +
					"<div class='featured-hot-border1'>" +
					"<div class='featured-hot-border2'>" +
					"<span class='featured-hot-top featured-hot-top1'>" + PrdAttr[el.queryFinancialProductsVO[0].PrdAttr] + "</span>" +
					"<p class='featured-hot-mc'>" + el.queryFinancialProductsVO[0].PrdName + "</p>" +
					"<p class='featured-hot-sz'>" + el.queryFinancialProductsVO[0].PrdCode + "</p>" +
					"</div>" +
					"</div>" +
					"<div class='goumai-dingtou'>" +
					"<a href='#' isGMorDT='GM' class='goumai'>购买</a>" +
					"<a href='#' isGMorDT='DT' class='dingtou'>定投</a>" +
					"</div>" +
					"</li>";
			}
		});
		if (responseCode.length % 3 != 0) {
			textHtml += "</ul></div>";
		}
		$("#citigold-fundSupermarketsOne .swiper-wrapper").html(textHtml).trigger('create');
		//alert($("#citigold-fundSupermarketsOne .swiper-wrapper .swiper-slide").length);
		//初始化滑动界面
		var mySwiper = new Swiper('#citigold-fundSupermarketsOne .swiper-container', {
			direction: 'horizontal',
			speed: 200,
			//            height:heightRight,
			loop: true,
			// 如果需要分页器
			pagination: '#citigold-fundSupermarketsOne .swiper-pagination'
		});

		$("#citigold-fundSupermarketsOne .swiper-wrapper li").on('taphold', function() {
			var rText = JSON.parse($(this).attr('returnJsonStr')).proRemark1;
			$(".product_img_msg").remove();
			$(this).find('.featured-hot-border1').css('position', 'relative');
			$(this).find('.featured-hot-border1').append('<div class="product_img_msg" style="position:absolute; top:0; left:0; width:193.5px; height:193.5px; background-color:rgba(0,0,0,.4); color:rgb(255,255,255); font-size:15px; text-align:left; border-radius:0px; border:1px dashed #fff; overflow:scroll;">' + rText.replace(/\n/g, "<br/>") + '</div>');

		})
		$("#citigold-fundSupermarketsOne").on('click', function(ev) {
			var oTarget = ev.target;
			if ($(oTarget).closest('.featured-hot-border1').length || $(oTarget).closest('.product_img_msg').length) {

			} else {
				$(".product_img_msg").remove();
			}
		})
		$("#citigold-fundSupermarketsOne .swiper-wrapper").on('click', '.goumai', function() {
			citigoldJson.jjProInfo = JSON.parse($(this).parents('li').attr('returnJsonStr'));
			citigoldJson.jjProInfo.ReferenceRate = '以基金公司公告为准';
			if (commonJson.fundCmanagerId == "") {
				showTags({
					'title': '提示',
					'content': '没有基金客户经理号，无法办理该业务!',
					'ok': {}
				});
				return;
			}
			if (citigoldJson.jjProInfo.EnableTrans.substring(0, 1) == '1') { //购买
				citigoldJson.isGMorDT = $(this).attr('isGMorDT');
				$.mobile.changePage('citigold-fundSupermarketsFives.html');
			} else {
				showMsg('该基金无法购买！');
			}
		})
		$("#citigold-fundSupermarketsOne .swiper-wrapper").on('click', '.dingtou', function() {
			citigoldJson.jjProInfo = JSON.parse($(this).parents('li').attr('returnJsonStr'));
			citigoldJson.jjProInfo.ReferenceRate = '以基金公司公告为准';
			if (commonJson.fundCmanagerId == "") {
				showTags({
					'title': '提示',
					'content': '没有基金客户经理号，无法办理该业务!',
					'ok': {}
				});
				return;
			}
			if (citigoldJson.jjProInfo.EnableTrans.substring(1, 2) == '1') { //定投
				citigoldJson.isGMorDT = $(this).attr('isGMorDT');
				$.mobile.changePage('citigold-fundSupermarketsFour.html');
			} else {
				showMsg('该基金无法定投！');
			}
		})

	} else {
		if (responseCode[0].results == '08') { //08超时密码输入成功之后走
			showLoader('加载中...');
			var sendJson = {
				"b": [{
					"orgId.s": commonJson.orgId,
					"moduleId.s": citigoldJson.moduleID, //模块编号
					"tranId.s": citigoldJson.tranId, //交易编号
					"operatorNo.s": commonJson.adminCount, //操作员
					"deviceNo.s": commonJson.udId, //设备编号
					"offlineOnline.s": 'online', //脱机/联机
					"TACode.s": "", //TA代码
					"PrdCode.s": "", //产品代码
					"PrdType.s": "0", //产品类别为空则表示不区分 0-基金 1-国内理财 2-境外理财产品
					"pageNum.s": "", //查询页码
					"FundType.s": "1" //0默认  1主推
				}]
			};
			IFinancialProductsServiceFun(sendJson, function(msg) {
				IFinancialProductsServiceZtSucc(msg)
			}, function(err) {
				funFail(err);
			})
		} else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
}

/*客户信息组合查询及有效凭证数量校验 查核心 成功回调*/
function icustomerInfoServiceCitigoldSucc(msg) {
	//alert(msg);
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == "00") {
		if ($.trim(responseCode[1].customerInfoVO[0].CLIENT_NO) == '') {
			showTags({
				'title': '提示',
				'content': '核心无此客户信息',
				'ok': {
					fun: function() {
						$.mobile.changePage('citigold-fundSupermarketsOne.html', {
							reverse: true
						});
					}
				}
			});
			return;
		}
		if ($.trim(responseCode[1].customerInfoVO[0].CH_CLIENT_NAME) != $.trim(custermerInfo.name)) {
			showTags({
				'title': '提示',
				'content': '身份证姓名与核心姓名不一致,无法办理',
				'ok': {
					fun: function() {
						$.mobile.changePage('citigold-fundSupermarketsOne.html', {
							reverse: true
						});
					}
				}
			});
			return;
		}
		citigoldJson.ClientNo = responseCode[1].customerInfoVO[0].CLIENT_NO; //客户号
		//alert(citigoldJson.ClientNo);
		showLoader('客户签约信息查询中...');
		//查询客户签约信息
		var sendJson = {
			"b": [{
				"orgId.s": commonJson.orgId, //操作员的机构号
				"moduleId.s": creditJson.moduleID, //模块编号
				"tranId.s": creditJson.tranId, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"AccType.s": "2", //客户标识类型
				"DOCUMENT_ID.s": custermerInfo.cerNO, //客户标识--证件号
				"IdType.s": "0", //证件类型--身份证
				"ClientType.s": "1" //客户类型 N组织 P个人
			}]
		};
		ICustomerInformationInquiryServiceFun(sendJson, function(msg) {
			ICustomerInformationInquiryServiceSucc(msg);
		}, function(err) {
			funFail(err);
		})
		citigoldJson.CLIENT_NO = responseCode[1].customerInfoVO[0].CLIENT_NO; //客户号
		citigoldJson.isCoreHas = creditJson.CLIENT_NO != "" ? true : false; //判断客户号是否为空

	} else {
		if (responseCode[0].results == "08") {
			hideLoader();
			//          showTags({
			//                  'title' : '提示',
			//                  'content' :responseCode[0].message,
			//                  'ok' : {}
			//              });
			icustomerInfoServiceCitigoldSucc(msg);
		}
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {
				fun: function() {
					$.mobile.changePage('citigold-fundSupermarketsOne.html', {
						reverse: true
					});
				}
			}
		});
	}
	//21  存折过多 不能开卡
	//01  异常 查询核心异常
	//12  客户号大于1 不能开卡
	//00  ok
}
//客户签约信息查询 成功回调
function ICustomerInformationInquiryServiceSucc(msg) {
	//alert(msg+'客户签约信息');
	//hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	//responseCode[0].results='01';
	//responseCode[0].message='无此客户信息';
	if (responseCode[0].results == '00') {
		//初始化信息
		citigoldJson.CurrFPRiskLevel = '';
		/*     {
    "b": [{
        "results.s": "00",
        "message.s": "接口服务处理成功!"
    }, {
        "customerInformationInquiryVO": [{
            "ContactIdType.s": "",
            "ManagerName.s": "电子银行",
            "Vocation.s": "",
            "RiskBegDate.s": "0",
            "Status.s": "0",
            "Birthday.s": "0",
            "IdCodeDate.s": "0",
            "SendModeName.s": "不寄送",
            "Email.s": "",
            "Tel.s": "",
            "SendMode.s": "",
            "Mobile.s": "",
            "PostCode.s": "530773",
            "ActorName.s": "",
            "ActorIdCode.s": "",
            "BankName.s": "深圳农村商业银行",
            "ReprName.s": "",
            "ContactIdCode.s": "",
            "Address.s": "深圳农商银行",
            "SendFreq.s": "",
            "message.s": "",
            "results.s": "",
            "ClientManager.s": "0000",
            "Fax.s": "",
            "ClientGroup.s": "0",
            "Area.s": "",
            "InstType.s": "",
            "ReprIdType.s": "",
            "ActorIdType.s": "",
            "IdCode.s": "421022198708154878",
            "ShortName.s": "",
            "RiskLevel.s": "2",
            "RiskDate.s": "20150829",
            "Sex.s": "0",
            "IdType.s": "0",
            "ReprIdCode.s": "",
            "RiskName.s": "稳健型",
            "ContactName.s": "",
            "OpenDate.s": "20140829",
            "ClientName.s": "王超",
            "Reserve1.s": "",
            "ClientNo.s": "0701657997"
        }]
    }]
}*/
		//var curTime=myTime.CurTime();//当前时间戳
		citigoldJson.curTime = myTime.CurTime(); //当前时间戳
		//alert('产品等级'+responseCode[1].customerInformationInquiryVO[0].RiskLevel);
		//alert('签约状态'+responseCode[1].customerInformationInquiryVO[0].Status);
		citigoldJson.ClientManager = responseCode[1].customerInformationInquiryVO[0].ClientManager; //客户经理
		citigoldJson.tel = responseCode[1].customerInformationInquiryVO[0].Mobile; //手机号码
		//citigoldJson.ClientNo=responseCode[1].customerInformationInquiryVO[0].ClientNo;//客户号  
		citigoldJson.signStatus = responseCode[1].customerInformationInquiryVO[0].Status; //客户签约状态
		var RiskDate = responseCode[1].customerInformationInquiryVO[0].RiskDate; //风险有效期截止日
		citigoldJson.RiskDate = responseCode[1].customerInformationInquiryVO[0].RiskDate; //风险有效期截止日
		if (citigoldJson.RiskDate != '') {
			citigoldJson.RiskDate = myTime.DateToUnix(citigoldJson.RiskDate.substring(0, 4) + '-' + citigoldJson.RiskDate.substring(4, 6) + '-' + citigoldJson.RiskDate.substring(6, 8) + ' 23:59:59');
		}
		citigoldJson.FPRiskLevel = responseCode[1].customerInformationInquiryVO[0].RiskLevel; //风险评级
		//citigoldJson.FPRiskLevel = 0;
		//citigoldJson.signStatus = '1';
		if (citigoldJson.signStatus == '0' && $.trim(citigoldJson.tel).length != 11) {
			hideLoader();
			showTags({
				'title': '提示',
				'content': '客户预留手机号码有误！',
				'ok': {
					fun: function() {
						$.mobile.changePage('citigold-fundSupermarketsOne.html', {
							reverse: true
						});
					}
				}
			});
		} else {
			if (citigoldJson.signStatus == '0') { //已签约
				querySignBankAccCitigold();
			} else {
				queryAllBankAccCitigold();
			}
		}
		/*if(citigoldJson.signStatus == '0'){//已签约
		        querySignBankAccCitigold();
		    }else{
		        queryAllBankAccCitigold();
		    } */
		//isRiskOrSignFun();
	} else {
		if (responseCode[0].results == '08') {
			hideLoader();
		}
		//hideLoader();
		if (responseCode[0].message.indexOf('无此客户信息') > -1) {
			/*if(citigoldJson.CurrFPRiskLevel){//做过问卷调查
			    $.mobile.changePage('citigold-diaocawenjuan.html');
			}else{
			    $.mobile.changePage('citigold-diaocawenjuan.html');
			}*/
			citigoldJson.FPRiskLevel = '0' //未评价
			citigoldJson.curTime = myTime.CurTime(); //当前时间
			citigoldJson.RiskDate = 0; //风险评价时间
			citigoldJson.signStatus = '1' //未签约
			if (citigoldJson.signStatus == '0') { //已签约
				querySignBankAccCitigold();
			} else {
				queryAllBankAccCitigold();
			}
			//return;
		} else {
			hideLoader();
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {
					fun: function() {
						$.mobile.changePage('citigold-fundSupermarketsOne.html', {
							reverse: true
						});
					}
				}
			});
		}

	}

}

function isRiskOrSignFun() {
	if (citigoldJson.FPRiskLevel == '0') { //未评级
		//alert('没有风评');
		$.mobile.changePage('citigold-diaocawenjuan.html');
	} else {
		//alert(citigoldJson.RiskDate+'<<<<<<'+citigoldJson.curTime)
		if ((citigoldJson.RiskDate - citigoldJson.curTime) < 0) { //评级过期
			//alert('风评过期');
			$.mobile.changePage('citigold-diaocawenjuan.html');
		} else { //未到期 风险评估等级是否小于产品风险等级jjProInfo
			if (citigoldJson.FPRiskLevel - citigoldJson.jjProInfo.RiskLevel < 0) {
				//alert('低于风评等级');
				$.mobile.changePage('citigold-riskAssessment.html'); //客户风评等级低于产品要求等级---询问客户
			} else {
				//alert('风评pass');
				isSignCitigoldFun(); //是否签约判断
			}

		}
	}
}
//客户签约 成功回调
function IClientSignServiceSucc(msg) {
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '00') {
		citigoldJson.isSubSign = true;
		citigoldJson.signStatus = '0'; //已签约
		// $.mobile.changePage('citigold-InformationInput.html'); //信息录入--影像采集   
		if (citigoldJson.CurrFPRiskLevel != '') { //需要修改风险评估
			isIChangeRiskLevelCitigoldFun();
		} else {
			IFinancialProductsServiceBuyDtFun();
		}
	} else if (responseCode[0].results == '09') {
		hideLoader();
		changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
		showTags({
			'title': '提示',
			'content': '业务处理超时!' + responseCode[0].message,
			'ok': {
				title: '查看客户当日基金委托情况',
				fun: function() {
					$.mobile.changePage('citigold-fundSupermarketsError.html');
				}
			}
		});
	} else {
		hideLoader();
		changeUploadStatus("03", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
		showTags({
			'title': '提示',
			'content': '基金签约失败，' + responseCode[0].message + ',风险评估失败，基金购买（定投）失败',
			'ok': {
				fun: function() {
					$.mobile.changePage('citigold-fundSupermarketsOne.html', {
						reverse: true
					});
				}
			}
		});
	}
}
//查询客户所有银行账号 成功回调
function INetBankProductServiceSucc(msg) {
	//alert(msg+'所有卡号');
	//hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '00') {
		//var textHtml='';
		citigoldJson.AllBankAcc = [];
		$.each(responseCode, function(index, el) {
				if (index == '0') return true;
				//textHtml+='<option>'+el.docLicenceVO[0].ISSUE_ACCT_NO+'</option>';
				citigoldJson.AllBankAcc.push(el.docLicenceVO[0].ISSUE_ACCT_NO); //签约的所有账号
			})
			//$('#citi-card').html(textHtml).selectmenu('refresh'); 
			//核心有客户信息
		showLoader("客户信息查询中...");
		var sendJson = {
			"b": [{
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"orgId.s": commonJson.orgId, //机构号
				"moduleId.s": citigoldJson.moduleID, //模块名
				"tranId.s": citigoldJson.tranId, //交易名
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"CLIENT_NO.s": citigoldJson.ClientNo, //客户号citigoldJson.ClientNo
				"AGENT_FLAG.s": "", //法人代表
				"CLIENT_TYPE.s": "P" //N单位 P个人
			}]
		};
		IEstablishCustomerInformationServiceFFun(sendJson, function(msg) {
				IEstablishCustomerInformationServiceCitSucc(msg);
			}, function(err) {
				funFail(err);
			})
			//isRiskOrSignFun();
	} else {
		if (responseCode[0].results == '08') {
			hideLoader();
		}
		hideLoader();
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}
//客户签约银行卡号 成功回调
function IClientSignBankAccountServiceSucc(msg) {
	//alert(msg+'11');
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	citigoldJson.BankAcc = '';
	if (responseCode[0].results == '00') {
		$.each(responseCode[1].clientSignBankAccountVO, function(index, el) {
			if (el.Status == '0') {
				citigoldJson.BankAcc = el.BankAcc; //已经签约账号
				//$.mobile.changePage('citigold-InformationInput.html'); //信息录入--影像采集
				//$('#citigold-dt-kh').html(citigoldJson.BankAcc);
				isRiskOrSignFun();
				return true;
			}
		})

	} else {
		if (responseCode[0].results == '08') {
			hideLoader();
		}
		/*if(responseCode[0].message=='无此客户信息'){
		    $.mobile.changePage('citigold-businessContract.html'); //签约页面
		    return;
		}*/
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}
//客户icbs核心信息查询
function IEstablishCustomerInformationServiceCitSucc(msg) {
	//alert(msg+'icbs核心');
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '00') {
		//客户号查询客户信息成功  返显信息 PHR  PHM
		//性别、手机号码、固定电话、电子邮箱、通讯地址、邮编
		citigoldJson.sign = {
			"SEX": $.trim(responseCode[1].clientDescVO[0].SEX), //性别
			"TRAN_EMAIL": $.trim(responseCode[1].clientDescVO[0].CUEMAL), //邮箱
			"CONTACT_ID": $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[1].contactInfo[0].CONTACT_ID), //手机号码
			"ADDRESS2": $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].ADDRESS2), //通讯地址
			"CITY_TEL": $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CITY_TEL), //固定电话区号
			"CONTACT_ID_GD": $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CONTACT_ID), //固定电话
			"POSTAL_CODE": $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].POSTAL_CODE), //邮编
		}
		if (citigoldJson.sign.CONTACT_ID.length != 11) {
			showTags({
				'title': '提示',
				'content': '客户预留手机号码有误！',
				'ok': {
					fun: function() {
						$.mobile.changePage('citigold-fundSupermarketsOne.html', {
							reverse: true
						});
					}
				}
			});
			return;
		}
		//debitEnter.xTel=$.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[1].contactInfo[0].CONTACT_ID); //手机号码
		//debitEnter.xPCode=$.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].POSTAL_CODE); //邮编
		//debitEnter.xPlaceDet=$.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].ADDRESS2); //通讯地址
		//debitEnter.xOccup=$.trim(responseCode[1].clientDescVO[0].OCCUPATION_CODE); //职业
		//debitEnter.issPlace=$.trim(responseCode[1].clientDescVO[1].DOCUMENT_INFO[0].documentInfo[0].ISS_PLACE);//签发地区
		//debitEnter.distCode=$.trim(responseCode[1].clientDescVO[1].DOCUMENT_INFO[0].documentInfo[0].DIST_CODE);//签发地区代码
		isRiskOrSignFun();
	} else {
		if (responseCode[0].results == '08') {
			hideLoader();
		}
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}
//基金修改风险等级 成功回调
function IChangeRiskLevelServiceSucc(msg) {
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '00') {
		citigoldJson.isfengping = true;
		citigoldJson.FPRiskLevel = citigoldJson.CurrFPRiskLevel;
		IFinancialProductsServiceBuyDtFun();
	} else if (responseCode[0].results == '09') {
		hideLoader();
		changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
		showTags({
			'title': '提示',
			'content': '业务处理超时!' + responseCode[0].message,
			'ok': {
				title: '查看客户当日基金委托情况',
				fun: function() {
					$.mobile.changePage('citigold-fundSupermarketsError.html');
				}
			}
		});
	} else {
		hideLoader();
		var failMsg = '';
		if (citigoldJson.isSubSign == true) {
			citigoldJson.pdfUrl = responseCode[0].pdfUrl; //padUrl
			// citigoldVideoUpload();
			changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
			failMsg = '基金签约成功，风险评估失败，' + responseCode[0].message + '，基金购买（定投）失败';
			showTags({
				'title': '提示',
				'content': failMsg,
				'ok': {
					fun: function() {
						$.mobile.changePage('citigold-carryOut.html');
					}
				}
			});
		} else {
			changeUploadStatus("03", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
			failMsg = '风险评估失败，' + responseCode[0].message + '，基金购买（定投）失败';
			showTags({
				'title': '提示',
				'content': failMsg,
				'ok': {
					fun: function() {
						$.mobile.changePage('citigold-fundSupermarketsOne.html', {
							reverse: true
						});
					}
				}
			});
		}
	}
}
//验证码是否有效  成功回调
function imessageAuthentionServiceYFunCitigoldSucc(msg) {
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '00') {
		getPlatGlobalSeq(citigoldJson, function(){
			citigoldJson.isSubSign = false;
			citigoldJson.isfengping = false;
			if (citigoldJson.signStatus == '0') { //已签约
				citigoldVideoUpload(function(){
					if (citigoldJson.CurrFPRiskLevel != '') { //需要修改风险评估
						isIChangeRiskLevelCitigoldFun();
					} else {	//alert('直接购买或者定投')
						IFinancialProductsServiceBuyDtFun();
					}
				});
			} else { //未签约
				showLoader('签约卡机构查询中...');
				var sendJson = {
					"b": [{
						"orgId.s": commonJson.orgId, //操作员的机构号
						"moduleId.s": citigoldJson.moduleID, //模块编号
						"tranId.s": citigoldJson.tranId, //交易编号
						"operatorNo.s": commonJson.adminCount, //操作员
						"deviceNo.s": commonJson.udId, //设备编号
						"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
						"workAddress.s": commonJson.workAddress, //工作地址
						"BASE_ACCT_NO.s": citigoldJson.citiCard, //银行账号
						"platGlobalSeq.s": citigoldJson.platGlobalSeq
					}]
				};
				//citigoldJson.BankAcc=$('#citi-card').val();
				ichannelQueryServiceFun(sendJson, function(msg) {
					ichannelQueryServiceSucc(msg);
				}, function(err) {
					//funFail(err);
					hideLoader();
					err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
					var responseObj = JSON.parse(err);
					var responseCode = responseObj.b[0].error[0];
					if ($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
						responseCode.message = '当前网络不可用,请检测网络!';
					}
					showTags({
						'content': responseCode.message, //必输  
						'ok': {
							fun: function() {
								$.mobile.changePage('citigold-fundSupermarketsOne.html', {
									reverse: true
								});
							}
						}
	
					})
				})
			}
		});
	} else {
		showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
	}
}
//基金影像上传
//callback - 插入数据库完成后触发的回调方法
function citigoldVideoUpload(callback) {
	showLoader("影像压缩中...");
	// 事件发布执行回调方法前，取订事件，避免重复发布
	var ussbCallback = function(){
        topicUtil.unsubscribe("citigold/citigoldInsertTableSucc");
        hideLoader();
        callback();
    };
	topicUtil.subscribe("citigold/citigoldInsertTableSucc", ussbCallback);
	//影像上传文件打包压缩插件
	var compressCount = 0;  //压缩成功次数,为3时完成压缩
	var phoneTime = myTime.CurTime();
	var signTime = phoneTime + 1;
	var videoTime = phoneTime + 2;
	citigoldJson.phoneTime = phoneTime;
	citigoldJson.signTime = signTime;
	citigoldJson.videoTime = videoTime;
	//alert(citigoldJson.picFileARR.length)
	Meap.zipCompression(citigoldJson.platGlobalSeq + 'image', citigoldJson.picFileARR, function(msg) {
		//将要上传的影像插入到ios断点上传的数据库中
		//影像上传 业务参数
		var appBus = {
			'busiGloablaSeq': citigoldJson.platGlobalSeq, //业务编号
			'attchType': '2', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
			'deviceNo': commonJson.udId, //设备编号
			'moduleId': citigoldJson.moduleID, //模块编号
			'tranId': citigoldJson.tranId, //交易编号
			'orgId': commonJson.orgId, //机构编号
			'operatorNo': commonJson.adminCount, //操作员
			'custName': custermerInfo.name, //客户名称
			'custCredType': '0', //客户证件类型
			'custCredNo': custermerInfo.cerNO, //客户证件号
			'offlineOnline': commonJson.offlineOnline, //脱机/联机
			'workAddress': commonJson.workAddress, //工作地址
			'OPER_TYPE': 'ADD',
			'TRADE_TYPE': '00001' //
		};
		appBus = JSON.stringify(appBus);
		var sendDataJson = {
			"databaseName": "myDatabase",
			"tableName": "up_download_info",
			"data": [{
				"fileToken": phoneTime, //文件唯一ID(可以为时间挫
				"pos": "0", //文件的断点信息(初始为0)
				"filePath": msg, //文件路径
				"appPath": "f002", //自定义文件路径
				"appBuss": appBus, //业务参数
				"downloadToken": "", //文件的下载ID(初始为空)
				"leng": "1", //文件的长度(初始为1)
				"isNotice": "yes", //是否调用后台(一直是yes)
				"fileType": '0',
				"REMARK1": "01" //上传状态01-默认
			}]
		};
		insertTableData(sendDataJson, function(msg) {
			if(++compressCount == 3){
				topicUtil.publish("citigold/citigoldInsertTableSucc");
			}
		}, function(err) {
	        hideLoader();
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
			'content': '压缩影像失败',
			'ok': {}
		});
	})
	//签名base64转路径
	Meap.transFormImage(citigoldJson.platGlobalSeq + 'sign', citigoldJson.qmStr, 'picSty', function(msg) {
		//将要上传的签名插入到ios断点上传的数据库中
		//签名上传 业务参数
		var appBus = {
			'busiGloablaSeq': citigoldJson.platGlobalSeq, //业务编号
			'attchType': '1', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
			'deviceNo': commonJson.udId, //设备编号
			'moduleId': citigoldJson.moduleID, //模块编号
			'tranId': citigoldJson.tranId, //交易编号
			'orgId': commonJson.orgId, //机构编号
			'operatorNo': commonJson.adminCount, //操作员
			'custName': custermerInfo.name, //客户名称
			'custCredType': '0', //客户证件类型
			'custCredNo': custermerInfo.cerNO, //客户证件号
			'offlineOnline': commonJson.offlineOnline, //脱机/联机
			'workAddress': commonJson.workAddress //工作地址
		};
		appBus = JSON.stringify(appBus);
		var sendDataJson = {
			'databaseName': 'myDatabase',
			'tableName': 'up_download_info',
			'data': [{
				'fileToken': signTime, //文件唯一ID(可以为时间挫
				'pos': '0', //文件的断点信息(初始为0)
				'filePath': msg, //文件路径
				'appPath': 'f001', //自定义文件路径
				'appBuss': appBus, //业务参数
				'downloadToken': '', //文件的下载ID(初始为空)
				'leng': '1', //文件的长度(初始为1)
				'isNotice': 'yes', //是否调用后台(一直是yes)
				'fileType': '1',
				"REMARK1": "01" //上传状态01-默认
			}]
		};
		insertTableData(sendDataJson, function(msg) {
			if(++compressCount == 3){
				topicUtil.publish("citigold/citigoldInsertTableSucc");
			}
		}, function(err) {
			hideLoader();
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
			'content': '签名转换失败',
			'ok': {}
		});
	})
	//video上传文件打包压缩插件
	Meap.zipCompression(citigoldJson.platGlobalSeq + 'video', citigoldJson.videoFileARR, function(msg) {
		//影像上传 业务参数
		var appBus = {
			'busiGloablaSeq': citigoldJson.platGlobalSeq, //业务编号
			'attchType': '2', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
			'deviceNo': commonJson.udId, //设备编号
			'moduleId': citigoldJson.moduleID, //模块编号
			'tranId': citigoldJson.tranId, //交易编号
			'orgId': commonJson.orgId, //机构编号
			'operatorNo': commonJson.adminCount, //操作员
			'custName': custermerInfo.name, //客户名称
			'custCredType': '0', //客户证件类型
			'custCredNo': custermerInfo.cerNO, //客户证件号
			'offlineOnline': commonJson.offlineOnline, //脱机/联机
			'workAddress': commonJson.workAddress //工作地址
		};
		appBus = JSON.stringify(appBus);
		var sendDataJson = {
			"databaseName": "myDatabase",
			"tableName": "up_download_info",
			"data": [{
				"fileToken": videoTime, //文件唯一ID(可以为时间挫
				"pos": "0", //文件的断点信息(初始为0)
				"filePath": msg, //文件路径
				"appPath": "f002", //自定义文件路径
				"appBuss": appBus, //业务参数
				"downloadToken": "", //文件的下载ID(初始为空)
				"leng": "1", //文件的长度(初始为1)
				"isNotice": "yes", //是否调用后台(一直是yes)
				"fileType": '2',
				"REMARK1": "01" //上传状态01-默认
			}]
		};
		insertTableData(sendDataJson, function(msg) {
			if(++compressCount == 3){
				topicUtil.publish("citigold/citigoldInsertTableSucc");
			}
		}, function(err) {
			hideLoader();
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
			'content': '录像压缩失败',
			'ok': {}
		});
	})
}
//基金影像上传//THE REQUEST TIMED OUT的情况下
function citigoldVideoUploadOut() {
	//影像上传文件打包压缩插件
	var phoneTime = myTime.CurTime();
	var signTime = phoneTime + 1;
	var videoTime = phoneTime + 2;
	//alert(citigoldJson.picFileARR.length)
	expectionZipCompression(citigoldJson.platGlobalSeq + 'image', citigoldJson.picFileARR, function(msg) {
			//将要上传的影像插入到ios断点上传的数据库中
			//影像上传 业务参数
			var appBus = {
				'busiGloablaSeq': citigoldJson.platGlobalSeq, //业务编号
				'attchType': '2', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
				'deviceNo': commonJson.udId, //设备编号
				'moduleId': citigoldJson.moduleID, //模块编号
				'tranId': citigoldJson.tranId, //交易编号
				'orgId': commonJson.orgId, //机构编号
				'operatorNo': commonJson.adminCount, //操作员
				'custName': custermerInfo.name, //客户名称
				'custCredType': '0', //客户证件类型
				'custCredNo': custermerInfo.cerNO, //客户证件号
				'offlineOnline': commonJson.offlineOnline, //脱机/联机
				'workAddress': commonJson.workAddress, //工作地址
				'OPER_TYPE': 'ADD',
				'TRADE_TYPE': '00001' //
			};
			appBus = JSON.stringify(appBus);
			var sendDataJson = {
				"databaseName": "myDatabase",
				"tableName": "up_download_info",
				"data": [{
					"fileToken": phoneTime, //文件唯一ID(可以为时间挫
					"pos": "0", //文件的断点信息(初始为0)
					"filePath": msg, //文件路径
					"appPath": "f002", //自定义文件路径
					"appBuss": appBus, //业务参数
					"downloadToken": "", //文件的下载ID(初始为空)
					"leng": "1", //文件的长度(初始为1)
					"isNotice": "yes", //是否调用后台(一直是yes)
					"fileType": "0"
				}]
			};
			insertTableData(sendDataJson, function(msg) {}, function(err) {
				showTags({
					'title': '提示',
					'content': '插入数据库失败',
					'ok': {}
				});
			});
		}, function(err) {

		})
		//签名base64转路径
		Meap.transFormImage(citigoldJson.platGlobalSeq + 'sign', citigoldJson.qmStr, 'picSty', function(msg) {
			//将要上传的签名插入到ios断点上传的数据库中
			//签名上传 业务参数
			var appBus = {
				'busiGloablaSeq': citigoldJson.platGlobalSeq, //业务编号
				'attchType': '1', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
				'deviceNo': commonJson.udId, //设备编号
				'moduleId': citigoldJson.moduleID, //模块编号
				'tranId': citigoldJson.tranId, //交易编号
				'orgId': commonJson.orgId, //机构编号
				'operatorNo': commonJson.adminCount, //操作员
				'custName': custermerInfo.name, //客户名称
				'custCredType': '0', //客户证件类型
				'custCredNo': custermerInfo.cerNO, //客户证件号
				'offlineOnline': commonJson.offlineOnline, //脱机/联机
				'workAddress': commonJson.workAddress //工作地址
			};
			appBus = JSON.stringify(appBus);
			var sendDataJson = {
				'databaseName': 'myDatabase',
				'tableName': 'up_download_info',
				'data': [{
					'fileToken': signTime, //文件唯一ID(可以为时间挫
					'pos': '0', //文件的断点信息(初始为0)
					'filePath': msg, //文件路径
					'appPath': 'f001', //自定义文件路径
					'appBuss': appBus, //业务参数
					'downloadToken': '', //文件的下载ID(初始为空)
					'leng': '1', //文件的长度(初始为1)
					'isNotice': 'yes', //是否调用后台(一直是yes)
					'fileType': '1'
				}]
			};
			insertTableData(sendDataJson, function(msg) {}, function(err) {
				showTags({
					'title': '提示',
					'content': '插入数据库失败',
					'ok': {}
				});
			});
		}, function(err) {
			hideLoader();
			showTags({
				'title': '提示',
				'content': '签名转换失败',
				'ok': {}
			});
		});
		//video上传文件打包压缩插件
	expectionZipCompression(citigoldJson.platGlobalSeq + 'video', citigoldJson.videoFileARR, function(msg) {
		//影像上传 业务参数
		var appBus = {
			'busiGloablaSeq': citigoldJson.platGlobalSeq, //业务编号
			'attchType': '2', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
			'deviceNo': commonJson.udId, //设备编号
			'moduleId': citigoldJson.moduleID, //模块编号
			'tranId': citigoldJson.tranId, //交易编号
			'orgId': commonJson.orgId, //机构编号
			'operatorNo': commonJson.adminCount, //操作员
			'custName': custermerInfo.name, //客户名称
			'custCredType': '0', //客户证件类型
			'custCredNo': custermerInfo.cerNO, //客户证件号
			'offlineOnline': commonJson.offlineOnline, //脱机/联机
			'workAddress': commonJson.workAddress //工作地址
		};
		appBus = JSON.stringify(appBus);
		var sendDataJson = {
			"databaseName": "myDatabase",
			"tableName": "up_download_info",
			"data": [{
				"fileToken": videoTime, //文件唯一ID(可以为时间挫
				"pos": "0", //文件的断点信息(初始为0)
				"filePath": msg, //文件路径
				"appPath": "f002", //自定义文件路径
				"appBuss": appBus, //业务参数
				"downloadToken": "", //文件的下载ID(初始为空)
				"leng": "1", //文件的长度(初始为1)
				"isNotice": "yes", //是否调用后台(一直是yes)
				'fileType': '2'
			}]
		};
		insertTableData(sendDataJson, function(msg) {}, function(err) {
			showTags({
				'title': '提示',
				'content': '插入数据库失败',
				'ok': {}
			});
		});
	}, function(err) {

	})
	$.mobile.changePage('citigold-fundSupermarketsError.html');
}
//基金产品购买 成功回调
function IFinancialProductsServiceBuySucc(msg) {
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	//responseCode[0].results = "09";
	if (responseCode[0].results == '00'||responseCode[0].results == '13') {
	//citigoldJson.platGlobalSeq = responseCode[1].buyFinancialProductsVO[0].platGlobalSeq; //流水号
		citigoldJson.pdfUrl = responseCode[0].pdfUrl; //padUrl
		if(lianwanghechaData.CheckResult=="09"){
				
        }else{
		//存储个人信息--影像复用使用
		//cacheCustermerInfo('基金');
			cacheCustermerInfo({
				"databaseName": "myDatabase",
				"tableName": "customer_info",
				"data": [{
					"ADMINCOUNT": commonJson.adminCount, //登陆账号
					"SUBMITTIME": myTime.CurTime(), //提交时间
					"BUSINESSTYPE": "基金", //业务类型
					"NATION": custermerInfo.nation, //民族
					"CERTNUM": custermerInfo.cerNO, //身份证号码
					"ADDRESS": custermerInfo.address, //地址
					"MASCARDNAME": custermerInfo.name, //姓名
					"CERTVALIDDATE": custermerInfo.cerExpdDt, //有效日期
					"BIRTH": custermerInfo.birthday, //出生日期
					"SEX": custermerInfo.sex, //性别
					"ISSAUTHORITY": custermerInfo.issAuthority, //签发机关
					"IMAGE": custermerInfo.image, //身份证头像图片
					"CUSTANDCUSTOWNERPIC": custermerInfo.custAndCustOwnerPic, //与客户合影照片
					"FRONTIDCARDPIC": custermerInfo.frontIDCardPic, //身份证正面
					"BACKIDCARDPIC": custermerInfo.backIDCardPic, //身份证反面
					"checkPhoto": citigoldJson.checkPhoto //联网核查图片
				}]
			});
		}
		// citigoldVideoUpload();
		changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
		if(responseCode[0].results == '13'){//业务处理成功后台报错弹窗
			showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {
                        fun: function() {
                            $.mobile.changePage('citigold-carryOut.html');
                        }
                    }
            });
		}else{
			$.mobile.changePage('citigold-carryOut.html');
		}
	} else if (responseCode[0].results == '09') {
//		citigoldJson.platGlobalSeq = responseCode[1].buyFinancialProductsVO[0].platGlobalSeq; //流水号
		citigoldJson.pdfUrl = responseCode[0].pdfUrl; //padUrl
		//存储个人信息--影像复用使用
		//cacheCustermerInfo('基金');
		//      cacheCustermerInfo({
		//          "databaseName": "myDatabase",
		//          "tableName": "customer_info",
		//          "data": [{
		//              "ADMINCOUNT": commonJson.adminCount,//登陆账号
		//              "SUBMITTIME": myTime.CurTime(),//提交时间
		//              "BUSINESSTYPE": "基金",//业务类型
		//              "NATION": custermerInfo.nation,//民族
		//              "CERTNUM": custermerInfo.cerNO,//身份证号码
		//              "ADDRESS": custermerInfo.address,//地址
		//              "MASCARDNAME": custermerInfo.name,//姓名
		//              "CERTVALIDDATE": custermerInfo.cerExpdDt,//有效日期
		//              "BIRTH": custermerInfo.birthday,//出生日期
		//              "SEX": custermerInfo.sex,//性别
		//              "ISSAUTHORITY": custermerInfo.issAuthority,//签发机关
		//              "IMAGE": custermerInfo.image,//身份证头像图片
		//              "CUSTANDCUSTOWNERPIC": custermerInfo.custAndCustOwnerPic,//与客户合影照片
		//              "FRONTIDCARDPIC": custermerInfo.frontIDCardPic,//身份证正面
		//              "BACKIDCARDPIC": custermerInfo.backIDCardPic,//身份证反面
		//              "checkPhoto": citigoldJson.checkPhoto //联网核查图片
		//          }]
		//      });
		// citigoldVideoUpload();
		changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
		showTags({
			'title': '提示',
			'content': '业务处理超时!' + responseCode[0].message,
			'ok': {
				title: '查看客户当日基金委托情况',
				fun: function() {
					$.mobile.changePage('citigold-fundSupermarketsError.html');
				}
			}
		});
	} else if (responseCode[0].results == '08') {
		//TODO
		hideLoader();
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	} else {
		var failMsg = '';
		if (citigoldJson.isSubSign == true) {
			citigoldJson.pdfUrl = responseCode[0].pdfUrl; //padUrl
			// citigoldVideoUpload();
			changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
			failMsg = '基金签约成功，风险评估成功，基金购买（定投）失败，' + responseCode[0].message;
			showTags({
				'title': '提示',
				'content': failMsg,
				'ok': {
					fun: function() {
						$.mobile.changePage('citigold-carryOut.html');
					}
				}
			});
		} else {
			if (citigoldJson.isfengping == true) {
				citigoldJson.pdfUrl = responseCode[0].pdfUrl; //padUrl
				// citigoldVideoUpload();
				changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
				failMsg = '风险评估成功，基金购买（定投）失败，' + responseCode[0].message;
				showTags({
					'title': '提示',
					'content': failMsg,
					'ok': {
						fun: function() {
							if (responseCode[0].results == '01') {
								$.mobile.changePage('citigold-fundSupermarketsOne.html', {
									reverse: true
								});
							} else {
								$.mobile.changePage('citigold-carryOut.html', {
									reverse: true
								});
							}
						}
					}
				});
			} else {
				changeUploadStatus("03", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
				failMsg = '基金购买（定投）失败，' + responseCode[0].message;
				showTags({
					'title': '提示',
					'content': failMsg,
					'ok': {
						fun: function() {
							$.mobile.changePage('citigold-fundSupermarketsOne.html', {
								reverse: true
							});
						}
					}
				});
			}
		}

	}
}

//基金产品定投 成功回调
function IRegularQuotaOpenServiceDtSucc(msg) {
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '00'||responseCode[0].results == '13') {
//		citigoldJson.platGlobalSeq = responseCode[1].regularQuotaOpenVO[0].GLOBAL_SEQ; //流水号
		citigoldJson.pdfUrl = responseCode[0].pdfUrl; //padUrl
		if(lianwanghechaData.CheckResult=="09"){
				
        }else{
        //存储个人信息
	        cacheCustermerInfo({
				"databaseName": "myDatabase",
				"tableName": "customer_info",
				"data": [{
					"ADMINCOUNT": commonJson.adminCount, //登陆账号
					"SUBMITTIME": myTime.CurTime(), //提交时间
					"BUSINESSTYPE": "基金", //业务类型
					"NATION": custermerInfo.nation, //民族
					"CERTNUM": custermerInfo.cerNO, //身份证号码
					"ADDRESS": custermerInfo.address, //地址
					"MASCARDNAME": custermerInfo.name, //姓名
					"CERTVALIDDATE": custermerInfo.cerExpdDt, //有效日期
					"BIRTH": custermerInfo.birthday, //出生日期
					"SEX": custermerInfo.sex, //性别
					"ISSAUTHORITY": custermerInfo.issAuthority, //签发机关
					"IMAGE": custermerInfo.image, //身份证头像图片
					"CUSTANDCUSTOWNERPIC": custermerInfo.custAndCustOwnerPic, //与客户合影照片
					"FRONTIDCARDPIC": custermerInfo.frontIDCardPic, //身份证正面
					"BACKIDCARDPIC": custermerInfo.backIDCardPic, //身份证反面
					"checkPhoto": citigoldJson.checkPhoto //联网核查图片
				}]
			});
    	}
		// citigoldVideoUpload();
		changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
		if(responseCode[0].results == '13'){//业务处理成功后台报错弹窗
			showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {
                        fun: function() {
                            $.mobile.changePage('citigold-carryOut.html');
                        }
                    }
            });
		}else{
			$.mobile.changePage('citigold-carryOut.html');
		}
	} else if (responseCode[0].results == '09') {
//		citigoldJson.platGlobalSeq = responseCode[1].regularQuotaOpenVO[0].GLOBAL_SEQ; //流水号
		citigoldJson.pdfUrl = responseCode[0].pdfUrl; //padUrl
		// citigoldVideoUpload();
		changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
		showTags({
			'title': '提示',
			'content': '业务处理超时!' + responseCode[0].message,
			'ok': {
				title: '查看客户当日基金委托情况',
				fun: function() {
					$.mobile.changePage('citigold-fundSupermarketsError.html');
				}
			}
		});
	} else if (responseCode[0].results == '08') {
		//TODO
		hideLoader();
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	} else {
		var failMsg = '';
		if (citigoldJson.isSubSign == true) {
			citigoldJson.pdfUrl = responseCode[0].pdfUrl; //padUrl
			// citigoldVideoUpload();
			changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
			failMsg = '基金签约成功，风险评估成功，基金购买（定投）失败，' + responseCode[0].message;
			showTags({
				'title': '提示',
				'content': failMsg,
				'ok': {
					fun: function() {
						$.mobile.changePage('citigold-carryOut.html');
					}
				}
			});
		} else {
			if (citigoldJson.isfengping == true) {
				citigoldJson.pdfUrl = responseCode[0].pdfUrl; //padUrl
				// citigoldVideoUpload();
				changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
				failMsg = '风险评估成功，基金购买（定投）失败，' + responseCode[0].message;
				showTags({
					'title': '提示',
					'content': failMsg,
					'ok': {
						fun: function() {
							if (responseCode[0].results == '01') {
								$.mobile.changePage('citigold-fundSupermarketsOne.html', {
									reverse: true
								});
							} else {
								$.mobile.changePage('citigold-carryOut.html', {
									reverse: true
								});
							}
						}
					}
				});
			} else {
				changeUploadStatus("03", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
				failMsg = '基金购买（定投）失败，' + responseCode[0].message;
				showTags({
					'title': '提示',
					'content': failMsg,
					'ok': {
						fun: function() {
							$.mobile.changePage('citigold-fundSupermarketsOne.html', {
								reverse: true
							});
						}
					}
				});
			}
		}
	}
}

//银行账号开卡机构 成功回调
function ichannelQueryServiceSucc(msg) {
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '00') {
		//上传影像成功后发起客户签约
		citigoldVideoUpload(function(){
			//alert(responseCode[1].channelQueryVO[0].SUB_OPEN_BRANCH);
			showLoader('签约信息提交中...');
			var sendJson = {
				"b": [{
					"orgId.s": commonJson.orgId, //操作员的机构号
					"moduleId.s": citigoldJson.moduleID, //模块编号
					"tranId.s": citigoldJson.tranId, //交易编号
					"operatorNo.s": commonJson.adminCount, //操作员
					"deviceNo.s": commonJson.udId, //设备编号
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"ClientType.s": "1", //客户类型
					"BankAcc.s": citigoldJson.citiCard, //银行账号
					"OpenBranch.s": responseCode[1].channelQueryVO[0].SUB_OPEN_BRANCH, //开卡机构
					"ClientNo.s": citigoldJson.ClientNo, //客户编号
					"ClientName.s": custermerInfo.name, //客户名称
					"IdType.s": "0", //证件类型
					"IdCode.s": custermerInfo.cerNO, //证件号码
					"Address.s": citigoldJson.citiAddr, //通讯地址
					"PostCode.s": citigoldJson.PostCode, //邮政编码
					"ClientManager.s": commonJson.fundCmanagerId, //客户经理代码
					"Sex.s": citigoldJson.citiSex, //性别
					"Email.s": citigoldJson.eMail, //e-mail
					"Mobile.s": citigoldJson.tel, //手机
					"SendMode.s": citigoldJson.sendstyle, //对账单形式
					"Tel.s": citigoldJson.CITY_TEL + citigoldJson.CONTACT_ID_GD, //固定电话
					"RiskLevel.s": citigoldJson.CurrFPRiskLevel, //风险等级
					"faceRecogn.s": citigoldJson.faceRecogn, //人脸识别
					//20160618添加
					"Currency.s": citigoldJson.jjProInfo.CurrType,	//币种
					"tranMoney.s": "",	//交易金币
					"Recommender.s": "",	//推荐人
					"fundInvePurposes.s": "", //基金定投用途
					"platGlobalSeq.s": citigoldJson.platGlobalSeq,
					"longitude.s": commonJson.longitude,//客户经理轨迹定位
	            	"latitude.s": commonJson.latitude//客户经理轨迹定位
				}]
			};
			if (citigoldJson.isGMorDT == 'GM') { //基金购买
				sendJson.b[0]["Recommender.s"] = citigoldJson.jjProInfo.referee;
				sendJson.b[0]["tranMoney.s"] = citigoldJson.jjProInfo.buyNum + "";
			} else {	//基金定投
				sendJson.b[0]["Recommender.s"] = citigoldJson.jjProInfo.dttjr;
				sendJson.b[0]["fundInvePurposes.s"] = citigoldJson.jjProInfo.dtyt;
				sendJson.b[0]["tranMoney.s"] = citigoldJson.jjProInfo.Amt + "";
			}
			//citigoldJson.BankAcc=$('#citi-card').val();
			IClientSignServiceFun(sendJson, function(msg) {
				IClientSignServiceSucc(msg);
			}, function(err) {
				//funFail(err);
				hideLoader();
				// changeUploadStatus("03", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
				// err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
				// var responseObj = JSON.parse(err);
				// var responseCode = responseObj.b[0].error[0];
				// if ($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
				// 	responseCode.message = '当前网络不可用,请检测网络!';
				// }
				// showTags({
				// 	'content': '基金签约失败，' + responseCode.message + ',风险评估失败，基金购买（定投）失败', //必输  
				// 	'ok': {
				// 		fun: function() {
				// 			$.mobile.changePage('citigold-fundSupermarketsOne.html', {
				// 				reverse: true
				// 			});
				// 		}
				// 	}
				// });
				changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
				showTags({
					'title': '提示',
					'content': '业务处理超时!',
					'ok': {
						title: '查看客户当日基金委托情况',
						fun: function() {
							$.mobile.changePage('citigold-fundSupermarketsError.html');
						}
					}
				});
			})
		});
	} else {
		hideLoader();
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {
				fun: function() {
					$.mobile.changePage('citigold-fundSupermarketsOne.html', {
						reverse: true
					});
				}
			}
		});
	}
}

//基金身份证联网核查成功回调
function idebitItizenCertificateIdenifyCitSucc(msg) {
	//alert(msg+'succ');
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == "00") {
		hideLoader();
		lianwanghechaData.CheckResult = responseCode[0].results;
		if (responseCode[1].citizenCertificateIdentifyVO[0].CHECKRESULT == "00") { //联网核查成功
			//$("#xinka-readID .img_box").append(textHtml);
			$("#citigold-readIDTwo .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
			citigoldJson.checkPhoto = base64decode(responseCode[1].citizenCertificateIdentifyVO[0].PHOTO); //联网核查返回照片
			//debitEnter.checkPhoto = responseCode[1].citizenCertificateIdentifyVO[0].PHOTO;
			// $("#xinka-readID .loading_box").html('');
			// $("#xinka-readID .pic_suc").text('身份证读取成功!');
			$('#dz-read-next').addClass('btn_next');
		} else {
			hideLoader();
			$("#citigold-readIDTwo .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
			//$.mobile.changePage('xinka-product.html',{reverse:true});
		}
	}else if(responseCode[0].results == "09"){
		hideLoader();
		$(".lianwanghecha-yichang").show();
		    $("#citigold-readIDTwo .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查异常！</div>');
			function convertImgToBase64(url, callback, outputFormat){ 
			var canvas = document.createElement('CANVAS'); 
			var ctx = canvas.getContext('2d'); 
			var img = new Image; 
			img.crossOrigin = 'Anonymous'; 
			img.onload = function(){ 
			canvas.height = img.height; 
			canvas.width = img.width; 
			ctx.drawImage(img,0,0); 
			var dataURL = canvas.toDataURL(outputFormat || 'image/png'); 
			callback.call(this, dataURL); 
			// Clean up 
			canvas = null; 
			}; 
			img.src = url; 
			} 
	
			convertImgToBase64('../../images/09chaoshiyichang.png', function(base64Img){ 
//				convertImgToBase64(base64Img, function(base64Img1){ 
					var tayh = base64Img.replace('data:image/png;base64,', '');
					citigoldJson.checkPhoto = base64Img.replace('data:image/png;base64,', '');  //联网核查返回照片
//				});
				});
			lianwanghechaData.CheckResult = responseCode[0].results;
			//debitEnter.checkPhoto = responseCode[1].citizenCertificateIdentifyVO[0].PHOTO;
			// $("#xinka-readID .loading_box").html('');
			// $("#xinka-readID .pic_suc").text('身份证读取成功!');
			$('#dz-read-next').removeClass('btn_next');
		
	}else if(responseCode[0].results == "02"){
		hideLoader();
		lianwanghechaData.CheckResult = responseCode[0].results;
		$("#citigold-readIDTwo .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
			function convertImgToBase64(url, callback, outputFormat){ 
			var canvas = document.createElement('CANVAS'); 
			var ctx = canvas.getContext('2d'); 
			var img = new Image; 
			img.crossOrigin = 'Anonymous'; 
			img.onload = function(){ 
			canvas.height = img.height; 
			canvas.width = img.width; 
			ctx.drawImage(img,0,0);
				var dataURL = canvas.toDataURL(outputFormat || 'image/png'); 
			callback.call(this, dataURL); 
			// Clean up 
			canvas = null; 
			}; 
			img.src = url; 
			} 
	
			convertImgToBase64('../../images/02yichang.png', function(base64Img){ 
//				convertImgToBase64(base64Img, function(base64Img1){ 
					var tayh = base64Img.replace('data:image/png;base64,', '');
					citigoldJson.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
//				});
				});
			//debitEnter.checkPhoto = responseCode[1].citizenCertificateIdentifyVO[0].PHOTO;
			// $("#xinka-readID .loading_box").html('');
			// $("#xinka-readID .pic_suc").text('身份证读取成功!');
			$('#xk-read-next').addClass('btn_next');
			showTags({
   		'title':'提示',
   		'content':'公民身份号码与姓名一致，但不存在照片，是否继续办理业务？',
   		'ok':{
   			'title':'放弃',
   			'fun':function(){
   				hideLoader();
   				$.mobile.changePage('citigold-fundSupermarketsOne.html', { transition: "slide" });
   			}
   		},
   		'cancel':{
   			'title':'继续',
   			'fun':function(){
	            showLoader('客户信息查询中...');
	            //继续业务办理
		 		$(".lianwanghecha-yichang").hide();
		 		
				if (citigoldJson.riskCache || citigoldJson.signCache || citigoldJson.imageCache) {
					isRiskOrSignFun();
				} else {
					showLoader('客户信息查询中...');
					var sendJson = {
						"b": [{
							"orgId.s": commonJson.orgId,
							"moduleId.s": citigoldJson.moduleID, //模块编号
							"tranId.s": citigoldJson.tranId, //交易编号
							"operatorNo.s": commonJson.adminCount, //操作员
							"deviceNo.s": commonJson.udId, //设备编号
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
					icustomerInfoServiceFun(sendJson, function(msg) {
						icustomerInfoServiceCitigoldSucc(msg);
					}, function(err) {
						funFail(err);
					})
				}
   			}
   		}
   	});
		
	} else if(responseCode[0].results == '08') {
		$("#citigold-readIDTwo .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
		hideLoader();
	}else{
		hideLoader();
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
		$("#citigold-readIDTwo .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
	}
}

/*影像两两对比成功回调*/
function IFacelRecognitionServiceJJSucc(msg) {
	//alert(msg);
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '0') {
		$('#citigold-personFace .previous:last').addClass('btn_next');
		citigoldJson.platGlobalSeq = responseCode[0].platGlobalSeq; //流水号
		citigoldJson.cardResult = responseCode[1].photoCompareVO[0].CARD_RESULT; //联网核查结果
		citigoldJson.chipResult = responseCode[1].photoCompareVO[0].CHIP_RESULT; //芯片结果
		if (responseCode[1].photoCompareVO[0].CHIP_RESULT == "0") { //芯片通过
			$("#citigold-personFace .face-result:eq(0)").text('通过');
		} else {
			$("#citigold-personFace .face-result:eq(0)").addClass('no-pass').text('未通过');
		}
		if (responseCode[1].photoCompareVO[0].CARD_RESULT == "0") { //联网核查通过
			$("#citigold-personFace .face-result:eq(1)").text('通过');
		} else {
			$("#citigold-personFace .face-result:eq(1)").addClass('no-pass').text('未通过');
		}
		if (responseCode[1].photoCompareVO[0].CHIP_RESULT == "0" && responseCode[1].photoCompareVO[0].CARD_RESULT == "0") {
			//	hideLoader();
			citigoldJson.isTelCheck = true; //远程复核成功
			citigoldJson.faceRecogn = '1'; //自动通过
			$("#citigold-personFace .center-header").text('人脸识别通过！');
			$("#citigold-managerList").hide();
		} else {
			//	hideLoader();
			citigoldJson.faceRecogn = '2'; //自动不通过
			$("#citigold-personFace .center-header").text('人脸识别未通过！');
			$('#citigold-personFace .previous:last').text('远程复核');
			//debitEnter.isTelCheck = true;         
		}


	} else if(responseCode[0].results == '08') {
			hideLoader();
	}else{
		//	hideLoader();
		//$("#citigold-personFace .center-header").text('人脸识别失败！');
		citigoldJson.faceRecogn = '2'; //自动不通过
		$("#citigold-personFace .face-result").addClass('no-pass').text('未通过');
		$("#citigold-personFace .center-header").text('人脸识别未通过！');
		$('#citigold-personFace .previous:last').addClass('btn_next');
		$('#citigold-personFace .previous:last').text('远程复核');
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}
/*远程复核获取客户经理列表*/
function ISysUserServiceManListJJSucc(msg) {
	//alert(msg);
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '00') {
		//	hideLoader();
		var textHtml = '<option></option>';
		//onlineFlag
		$.each(responseCode[1].TsReviewerVOs, function(index, el) {
			//if(index == 0) return;
			if (el.sysUserVO[0].onlineFlag != "1") return;
			textHtml += '<option realName="' + el.sysUserVO[0].realName + '" cellPhone="' + el.sysUserVO[0].cellPhone + '" value="' + el.sysUserVO[0].userId + '">' + el.sysUserVO[0].userId + el.sysUserVO[0].realName + '</option>';
		});
		$('#citigold-managerList select').html(textHtml).selectmenu('refresh');
	} else {
		if (responseCode[0].results == '08') {
			hideLoader();
		}
		//	hideLoader();
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
		$('#citigold-managerList select').html('<option></option>').selectmenu('refresh');
	}

}

/*远程复核成功回调*/
function iissuesServiceJJSucc(msg) {
	//alert(msg);
	//hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '00' || responseCode[0].results == '66') {
		//	hideLoader();
		/*if(responseCode[0].status == '5'){
		    showTags({
		            'title' : '提示',
		            'content' :'远程复核通过！',
		            'ok' : {fun:function(){
		                citigoldJson.isTelCheck = true; //远程复核成功
		                //$.mobile.changePage('xinka-messageIn.html');
		                if (citigoldJson.isGMorDT == 'GM') {
		                    $.mobile.changePage('citigold-InformationInputOne.html'); //基金购买交易
		                } else {
		                    $.mobile.changePage('citigold-InformationInputTwo.html'); //基金定投交易
		                }
		            }}
		        }); 
		}else{
		    showTags({
		            'title' : '提示',
		            'content' : responseCode[0].message,
		            'ok' : {}
		        }); 
		}*/
		citigoldJson.tsReviewId = responseCode[0].tsReviewId;
		$(".ui-loader").append('<div id="loaderCancel" style="width:300px; height:40px; line-height:40px; text-align:center; border:1px solid #FFFFFF; position:absolute; bottom:220px; left:50%; margin-left:-150px;color: #FFFFFF;">放弃<span id="time-daojishi"></span></div>');
		//var timeout = null;
		var timeout = new Timeout('loaderCancel', 15);
		timeout.blocking('time-daojishi'); //spanid:延迟过程中显示ID
		localStorage.intervalID = timeout.getIntervalID();
		$("#loaderCancel").off('click').on('click', function() {
			hideLoader();
			citigoldJson.telCheck = false;
			var sendJson = {
				"b": [{
					"deviceNo.s": commonJson.udId, //设备编号
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"orgId.s": commonJson.orgId, //机构号
					"moduleId.s": citigoldJson.moduleID, //模块编号
					"tranId.s": citigoldJson.tranId, //交易编号
					"operatorNo.s": commonJson.adminCount, //操作员
					"tsReviewId.s": citigoldJson.tsReviewId
				}]
			};
			showLoader("放弃远程复核...");
			iphotoServiceStopFun(sendJson, function(msg) {
				hideLoader();
			}, function(err) {
				hideLoader();
			});
			setTimeout(function() {
				hideLoader();
			}, 3500)
		})
		var sendJson = {
			"b": [{
				"deviceNo.s": commonJson.udId, //设备编号
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"orgId.s": commonJson.orgId, //机构号
				"moduleId.s": citigoldJson.moduleID, //模块编号
				"tranId.s": citigoldJson.tranId, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"tsReviewId.s": citigoldJson.tsReviewId,
				"userIds.s": $('#citigold-managerList select').val() //用户ID
			}]
		};
		getTsRevieweleSignFun(sendJson, function(msg) {
			//hideLoader();
			getTsRevieweleJJSucc(msg);
		}, function(err) {
			hideLoader();
			funFail(err);
		})

	} else {
		if (responseCode[0].results == '08') {
			hideLoader();
		}
		hideLoader();
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}

/*远程复核查询  成功回调*/
function getTsRevieweleJJSucc(msg) {

	//alert(msg);
	//hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (citigoldJson.telCheck == false) return;
	if (responseCode[0].results == '00') {
		if (responseCode[0].status == '5') {
			hideLoader();
			showTags({
				'title': '提示',
				'content': '远程复核通过！',
				'ok': {
					fun: function() {
						citigoldJson.isTelCheck = true; //远程复核成功
						citigoldJson.faceRecogn = '3'; //远程复核通过
						//$.mobile.changePage('xinka-messageIn.html');
                        		if (citigoldJson.isGMorDT == 'GM') {
							$.mobile.changePage('citigold-InformationInputOne.html'); //基金购买交易
						} else {
							$.mobile.changePage('citigold-InformationInputTwo.html'); //基金定投交易
						}
						lianwanghechaData.ReviewUserId = $('#citigold-managerList select').val();
					}
				}
			});
			clearInterval(localStorage.intervalID);
		} else if (responseCode[0].status == '2' || responseCode[0].status == '3') {
			//      	hideLoader();
			setTimeout(function() {
				var sendJson = {
					"b": [{
						"deviceNo.s": commonJson.udId, //设备编号
						"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
						"workAddress.s": commonJson.workAddress, //工作地址
						"orgId.s": commonJson.orgId, //机构号
						"moduleId.s": citigoldJson.moduleID, //模块编号
						"tranId.s": citigoldJson.tranId, //交易编号
						"operatorNo.s": commonJson.adminCount, //操作员
						"tsReviewId.s": citigoldJson.tsReviewId,
						"userIds.s": $('#citigold-managerList select').val() //用户ID
					}]
				};
				getTsRevieweleSignFun(sendJson, function(msg) {
					//hideLoader();
					getTsRevieweleJJSucc(msg);
				}, function(err) {
					hideLoader();
					funFail(err);
				});
			}, 5000);
		} else {
			citigoldJson.faceRecogn = '4'; //远程复核不通过
			hideLoader();
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
			clearInterval(localStorage.intervalID);
		}
		//      setTimeout(function(){
		//      			hideLoader();
		//      },8000)
	} else {
		if (responseCode[0].results == '08') {
			hideLoader();
		} else {
			hideLoader();
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
}
//客户当前委托查询
function icustomerCurrentEntrustServiceSucc(msg) {
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	var textHtml = '';
	if (responseCode[0].results == '00') {
		$.each(responseCode, function(index, el) {
			if (index == 0) return true;
			// EnableTrans='"+el.queryFinancialProductsVO[0].EnableTrans+"' CurrType='"+el.queryFinancialProductsVO[0].CurrType+"'
			textHtml += "<li>" +
				"<div>" + el.customerCurrentEntrustVO[0].PrdCode + "</div>" +
				"<div>" + el.customerCurrentEntrustVO[0].PrdName + "</div>" +
				"<div>" + el.customerCurrentEntrustVO[0].TransName + "</div>" + //
				"<div>" + currType[el.customerCurrentEntrustVO[0].CurrType] + "</div>" +
				"<div>" + el.customerCurrentEntrustVO[0].Vol + "份</div>" +
				"<div>" + fmoney(el.customerCurrentEntrustVO[0].Amt) + "</div>" +
				"<div>" + dateToShowType(el.customerCurrentEntrustVO[0].TransDate) + "</div>" +
				"<div>" + timeToShowType(el.customerCurrentEntrustVO[0].TransTime) + "</div>" +
				"<div>" + el.customerCurrentEntrustVO[0].StatusName + "</div>" + //
				"<div>" + el.customerCurrentEntrustVO[0].Summary + "</div>" + //    
				"</li>";
		});
		$('#citigold-fundSupermarketsError .box-content').html(textHtml);
	} else if (responseCode[0].results == '08') {
		showLoader("客户信息查询中...");
		var sendJson = {
			"b": [{
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"orgId.s": commonJson.orgId, //机构号
				"moduleId.s": citigoldJson.moduleID, //模块编号
				"tranId.s": citigoldJson.tranId, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"AccType.s": "2", //客户标识类型
				"DOCUMENT_ID.s": custermerInfo.cerNO, //客户标识
				"IdType.s": "0", //证件类型
				"OrderFlag.s": "1" //时间逆序
			}]
		};
		icustomerCurrentEntrustServiceFun(sendJson, function(msg) {
			icustomerCurrentEntrustServiceSucc(msg);
		}, function(err) {
			icustomerCurrentEntrustServiceFail();
		});
	} else if (responseCode[0].results == '09') {
		icustomerCurrentEntrustServiceFail();
	} else {
		hideLoader();
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}

//客户当前委托查询失败回调
function icustomerCurrentEntrustServiceFail(){
	hideLoader();
	showTags({
        'title': '提示',
        'content': '系统超时，是否继续？',
        'ok': {
        	'title': '放弃',
            'fun': function() {
            	$.mobile.changePage('citigold-fundSupermarketsOne.html', {reverse: true});
            }
        },
        'cancel': {
			'title': '继续',
			'fun': function() {
				showLoader("客户信息查询中...");
				var sendJson = {
					"b": [{
						"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
						"workAddress.s": commonJson.workAddress, //工作地址
						"orgId.s": commonJson.orgId, //机构号
						"moduleId.s": citigoldJson.moduleID, //模块编号
						"tranId.s": citigoldJson.tranId, //交易编号
						"operatorNo.s": commonJson.adminCount, //操作员
						"deviceNo.s": commonJson.udId, //设备编号
						"AccType.s": "2", //客户标识类型
						"DOCUMENT_ID.s": custermerInfo.cerNO, //客户标识
						"IdType.s": "0", //证件类型
						"OrderFlag.s": "1" //时间逆序
					}]
				};
				icustomerCurrentEntrustServiceFun(sendJson, function(msg) {
					icustomerCurrentEntrustServiceSucc(msg);
				}, function(err) {
					icustomerCurrentEntrustServiceFail();
				});
			}
		}
    });
}

/*基金产品说明书 基本信息成功回调 named by lei.*/
function getProductInstructionSucc(msg) {
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '00') {
		goldInsJson.prodInstrInfoVO = responseCode[1].prodInstrInfoVO[0];
		//基本信息界面
		$('#basic-info .result-val:eq(0)').html(goldInsJson.prodInstrInfoVO.PrdName); //产品名称
		$('#basic-info .result-val:eq(1)').html(goldInsJson.prodInstrInfoVO.PrdCode); //产品编号
		$('#basic-info .result-val:eq(2)').html(PrdAttr[goldInsJson.prodInstrInfoVO.PrdAttr]); //产品属性
		$('#basic-info .result-val:eq(3)').html(goldInsJson.prodInstrInfoVO.InceptionDate.split(' ')[0]); //成立日期
		$('#basic-info .result-val:eq(4)').html(goldInsJson.prodInstrInfoVO.CustodianNameLocal); //基金托管人
		$('#basic-info .result-val:eq(5)').html(goldInsJson.prodInstrInfoVO.FundCompanyNameLocal); //基金管理公司
		$('#basic-info .result-val:eq(6)').html(goldInsJson.prodInstrInfoVO.ManagementFee); //管理费
		$('#basic-info .result-val:eq(7)').html(goldInsJson.prodInstrInfoVO.CustodialFee); //托管费
		$('#basic-info .result-val:eq(8)').html(goldInsJson.prodInstrInfoVO.MinInvestment); //最低申购额
		$('#basic-info .result-val:eq(9)').html(goldInsJson.prodInstrInfoVO.AdditionalPurchase); //最低追加额
		$('#basic-info .result-val:eq(10)').html(goldInsJson.prodInstrInfoVO.FrontLoadFee); //申购费率（前端）
		$('#basic-info .result-val:eq(11)').html(goldInsJson.prodInstrInfoVO.DeferLoadFee); //申购费率（后端）
		$('#basic-info .result-val:eq(12)').html(goldInsJson.prodInstrInfoVO.RedemptionFeeFee); //赎回费率
		$('#basic-info .result-val:eq(13)').html(goldInsJson.prodInstrInfoVO.DistributionFee); //销售服务费
		//净值回报
		$('#worthTwo .result-val:eq(0)').html(goldInsJson.prodInstrInfoVO.NavDate.split(' ')[0]); //日期
		$('#worthTwo .result-val:eq(1)').html(goldInsJson.prodInstrInfoVO.NAV); //单位资产净值
		$('#worthTwo .result-val:eq(2)').html(goldInsJson.prodInstrInfoVO.AccumulatedNAV); //累计资产净值
		$('#worthTwo .result-val:eq(3)').html(goldInsJson.prodInstrInfoVO.Return3Month); //回报率-近三个月
		$('#worthTwo .result-val:eq(4)').html(goldInsJson.prodInstrInfoVO.ReturnYTD); //回报率-今年以来
		$('#worthTwo .result-val:eq(5)').html(goldInsJson.prodInstrInfoVO.Return3Year); //回报率-近三年以来
		$('#worthTwo .result-val:eq(6)').html(goldInsJson.prodInstrInfoVO.ReturnInception); //回报率-成立以来
		//晨星评级
		$('#manual-garde .result-val:eq(0)').html(goldInsJson.prodInstrInfoVO.PrdName);
		$('#manual-garde .result-val:eq(1)').html(goldInsJson.prodInstrInfoVO.PrdCode);
		$('#manual-garde .star-box:eq(0)').html(starFun(goldInsJson.prodInstrInfoVO.StarRatingY1));
		$('#manual-garde .star-box:eq(1)').html(starFun(goldInsJson.prodInstrInfoVO.StarRatingY2));
		$('#manual-garde .star-box:eq(2)').html(starFun(goldInsJson.prodInstrInfoVO.StarRatingY3));
		$('#manual-garde .star-box:eq(3)').html(starFun(goldInsJson.prodInstrInfoVO.StarRatingY5));
		$('#manual-garde .star-box:eq(4)').html(starFun(goldInsJson.prodInstrInfoVO.StarRatingOverall));
		//晨星风险系数
		$('#manual-ratio .result-val:eq(0)').html(goldInsJson.prodInstrInfoVO.PrdName);
		$('#manual-ratio .result-val:eq(1)').html(goldInsJson.prodInstrInfoVO.PrdCode);
		if (goldInsJson.prodInstrInfoVO.Y1_DownsideRisk == '') {
			$('#manual-ratio .rationTable-body .rationTable-rows:eq(0)').find('div').eq(1).html('暂无');
		} else {
			$('#manual-ratio .rationTable-body .rationTable-rows:eq(0)').find('div').eq(1).html(goldInsJson.prodInstrInfoVO.Y1_DownsideRisk);
		}
		$('#manual-ratio .rationTable-body .rationTable-rows:eq(0)').find('div').eq(2).html(downSideRisk[goldInsJson.prodInstrInfoVO.Y1_DRQuartileRank]);
		if (goldInsJson.prodInstrInfoVO.Y2_DownsideRisk == '') {
			$('#manual-ratio .rationTable-body .rationTable-rows:eq(1)').find('div').eq(1).html('暂无');
		} else {
			$('#manual-ratio .rationTable-body .rationTable-rows:eq(1)').find('div').eq(1).html(goldInsJson.prodInstrInfoVO.Y2_DownsideRisk);
		}
		$('#manual-ratio .rationTable-body .rationTable-rows:eq(1)').find('div').eq(2).html(downSideRisk[goldInsJson.prodInstrInfoVO.Y2_DRQuartileRank]);
		$('#manual-ratio .rationTable-body .rationTable-rows:eq(0)').find('div').eq(2).html(downSideRisk[goldInsJson.prodInstrInfoVO.Y1_DRQuartileRank]);
		if (goldInsJson.prodInstrInfoVO.Y3_DownsideRisk == '') {
			$('#manual-ratio .rationTable-body .rationTable-rows:eq(2)').find('div').eq(1).html('暂无');
		} else {
			$('#manual-ratio .rationTable-body .rationTable-rows:eq(2)').find('div').eq(1).html(goldInsJson.prodInstrInfoVO.Y3_DownsideRisk);
		}
		$('#manual-ratio .rationTable-body .rationTable-rows:eq(2)').find('div').eq(2).html(downSideRisk[goldInsJson.prodInstrInfoVO.Y3_DRQuartileRank]);
		if (goldInsJson.prodInstrInfoVO.Y5_DownsideRisk == '') {
			$('#manual-ratio .rationTable-body .rationTable-rows:eq(3)').find('div').eq(1).html('暂无');
		} else {
			$('#manual-ratio .rationTable-body .rationTable-rows:eq(3)').find('div').eq(1).html(goldInsJson.prodInstrInfoVO.Y5_DownsideRisk);
		}
		$('#manual-ratio .rationTable-body .rationTable-rows:eq(3)').find('div').eq(2).html(downSideRisk[goldInsJson.prodInstrInfoVO.Y5_DRQuartileRank]);
	} else {
		if (responseCode[0].results == '08') {
			hideLoader();
		}
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}
/*基金产品说明书 历史净值查询成功回调 named by lei.*/
function getProductNavHistorySucc(msg) {
	hideLoader();
	var textHtml = '';
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	$("#manual-one .worthBody").html('');
	if (responseCode[0].results == "00") {
		if (responseCode.length > 1) {
			var nav = '';
			var AccumulatedNAV = '';
			$.each(responseCode, function(index, element) {
				if (index == 0) {
					return;
				}
				if (element.productNavHistoryVO[0].NAV == '') {
					nav = '暂无';
				} else {
					nav = element.productNavHistoryVO[0].NAV;
				}
				if (element.productNavHistoryVO[0].AccumulatedNAV == '') {
					AccumulatedNAV = '暂无';
				} else {
					AccumulatedNAV = element.productNavHistoryVO[0].AccumulatedNAV;
				}
				textHtml += '<li class="worthTable-rows">' +
					'<div>' + element.productNavHistoryVO[0].PriceDate.split(' ')[0] + '</div>' +
					'<div>' + nav + '</div>' +
					'<div>' + AccumulatedNAV + '</div>' +
					'</li>';
			});
			$("#manual-one .worthBody").empty();
			$("#manual-one .worthBody").html(textHtml);
			//分页
			$("#manual-one .page-number-con").createPage({
				pageCount: Math.ceil(responseCode[0]['totalNum.i'] / 7),
				current: goldInsJson.InsPg,
				backFn: function(p) {
					showLoader('加载中...');
					goldInsJson.searchJ.b[0]["pageNum.s"] = String(p);
					goldInsJson.InsPg = p;
					getProductNavHistoryFun(goldInsJson.searchJ, function(msg) {
						getProductNavHistorySucc(msg);
					}, function(err) {
						funFail(err);
					})
				}
			});
		} else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	} else {
		if (responseCode[0].results == '08') {
			hideLoader();
		}
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}

function starFun(num) {
	var starHtml = '';
	if (num < 1) {
		starHtml = ' 暂无';
	} else {
		for (var i = 0; i < num; i++) {
			starHtml += '<img src="../../images/star_icon.png" alt=""/>'
		}
	}
	return starHtml;
}

/*基金产品说明书 净值走势成功回调 named by lei.*/
function getFundProdNavTrendSucc(msg) {
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == "00") {
		var dataTime = [];
		var canvasDate = [];
		var yearDate = [];
		$.each(responseCode, function(index, ele) {
			if (index == 0) return;
			dataTime.unshift(ele.fundProdTrendVO[0].Pricedate.split(' ')[0]);
			canvasDate.unshift(ele.fundProdTrendVO[0].Nav);
			yearDate.unshift(ele.fundProdTrendVO[0].Accumulatednav);
		});
		var option = {
			title: {
				text: '',
				padding: 7,
				textStyle: {
					fontSize: 20,
					fontWeight: 'bolder',
					color: '#ccc'
				},
				x: 'center'
			},
			color: ['#4a9bca', '#9BCA63', '#60C0DD'],
			tooltip: {
				trigger: 'axis',
				formatter: function(params) {
					if (canvasDate[params[0].dataIndex] == '') {
						return "日期：" + dataTime[params[0].dataIndex] + "<br/>单位净值：暂无";
					} else {
						return "日期：" + dataTime[params[0].dataIndex] + "<br/>单位净值：" + canvasDate[params[0].dataIndex];
					}
				}
			},
			legend: {
				data: [],
				x: 'right',
				padding: 12,
				textStyle: {
					fontSize: 15
				}
			},
			yAxis: [{
				name: '(单位净值)',
				type: 'value',
				scale: true,
				axisLabel: {
					textStyle: {
						color: '#4a9bca'
					}
				},
				axisLine: {
					show: true
				},
				splitLine: {
					lineStyle: {
						color: '#f6f6f6'
					}
				},
				splitArea: {
					show: false,
					areaStyle: {
						color: ['#494c57', '#323643']
					}
				}
			}],
			xAxis: [{
				name: '(日期)',
				type: 'category',
				data: dataTime,
				axisLabel: {
					textStyle: {
						color: '#ccc'
					}
				},
				axisLine: {
					show: false
				},
				splitLine: {
					show: true,
					lineStyle: {
						color: '#f6f6f6'
					}
				}

			}],
			grid: {
				borderWidth: 1,
				borderColor: '#f6f6f6'
			},
			series: [{
				name: '净值',
				type: 'line',
				smooth: true,
				data: canvasDate
			}]
		};
		//option.series[0].data=canvasDate;
		// 为echarts对象加载数据
		goldInsJson.myChart.setOption(option);
	} else {
		if (responseCode[0].results == '08') {
			hideLoader();
		}
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}

//查询TA代码及基金公司名称
function getTaInformationMingcheng() {//基金比较
	showLoader('加载中...');
	var sendJson = {
		"b": [{
			"deviceNo.s": commonJson.orgId, //设备编号
			"moduleId.s": citigoldJson.moduleID, //模块名
			"tranId.s": citigoldJson.tranId, //交易名
			"orgId.s": citigoldJson.tranId, //机构号
			"operatorNo.s": commonJson.adminCount, //操作员
			"offlineOnline.s": 'online', //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"TACode.s": "" //TA代码
		}]
	};
	getTaInformationFun(sendJson, function(msg) {
		getTaInformationFunSucc(msg);
	}, function(err) {
		funFail(err);
	});
}

function getTaInformationFunSucc(msg) {//基金比较
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == "00") {
		var CompanyName = $('#CompanyName');
		var biaoshi = $("#jijinshuaixuan-btn").attr("biaoshi");
		if(biaoshi==undefined){
			CompanyName.html("<option value='' selected='selected'>请选择</option>");
		}else{
			CompanyName.html("<option value='' selected='selected'>不限</option>");
		}
		$.each(responseCode, function(i, d) {
			var Data = d.taInformationInquiryVO;
			if (Data && Data.length) {
				var s = '<option value="' + Data[0].TACode + '">' + Data[0].TAName + '</option>';
				CompanyName.append(s);
			}

		});
	} else {
		if (responseCode[0].results == "08") {
			getTaInformationMingcheng();
		} else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
}

function citigoldBiJiao(fuc) {
	showLoader('加载中...');
	var sendJson = {
		"b": [{
			"orgId.s": commonJson.orgId,
			"moduleId.s": citigoldJson.moduleID, //模块编号
			"tranId.s": citigoldJson.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员
			"deviceNo.s": commonJson.udId, //设备编号
			"offlineOnline.s": 'online', //脱机/联机
			"TACode.s": $("#CompanyName").val(), //TA代码
			"PrdCode.s": "", //产品代码
			"PrdType.s": "0", //产品类别为空则表示不区分 0-基金 1-国内理财 2-境外理财产品
			"pageNum.s": "", //查询页码
			"FundType.s": "" //0默认  1主推
		}]
	};
	IFinancialProductsServiceFun(sendJson, function(msg) {
		citigoldBiJiaoZhi(msg);
		if (typeof fuc === 'function')
			fuc(msg)
	}, function(err) {
		funFail(err);
	})
}

function citigoldBiJiaoZhi(msg) {
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == "00") {
		var CompanyName = $('#citigoldName');
		CompanyName.html("<option value='' selected='selected'>请选择</option>");
		$.each(responseCode, function(i, d) {
			var Data = d.queryFinancialProductsVO;
			if (Data && Data.length) {
				var s = '<option value="' + Data[0].PrdCode + '" CurrType = "' + Data[0].CurrType + '">' + Data[0].PrdName + '</option>';
				CompanyName.append(s);
			}

		});
	} else {
		if (responseCode[0].results == "08") {
			citigoldBiJiao();
		} else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
}

function JiaruBijiao() {
	showLoader('加载中...');
	var sendJson = {
		"b": [{
			"orgId.s": commonJson.orgId,
			"moduleId.s": citigoldJson.moduleID, //模块编号
			"tranId.s": citigoldJson.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员
			"deviceNo.s": commonJson.udId, //设备编号
			"offlineOnline.s": 'online', //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"PrdCode.s": $("#citigoldName").val() //产品代码
		}]
	};
	compareFinancialProductFun(sendJson, function(msg) {
		JiaruBijiaoZhi(msg);
	}, function(err) {
		funFail(err);
	})
};

function JiaruBijiaoZhi(msg) {//加入比较
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == "00") {
		var data = responseCode[1].financialPrdCompareVO[0];
		var data1 = responseCode[1].financialPrdCompareVO[1];
		if(data){
			var CitigoldCheckList = $('#citigoldCheckList');
			var LI = CitigoldCheckList.find('li[prdcode="'+ data.PrdCode +'"]');
			var LILEN = CitigoldCheckList.children('li').length;
			if(!LI.length && LILEN < 4){
				randerDom();
			}else if(LILEN == 4){
				showTags({
				'title': '提示',
				'content': '最多仅可添加四个产品比较！',
				'ok': {}
				});
			};
			//绑定清空事件
			$('#clearCheckListBtn').unbind().on('tap',function(){
				CitigoldCheckList.html('');
				$('.zhankai-neirong li span').not('span.title').remove();
				return false;
			})
			//生成html结构
			function randerDom(){
				var checkList = '<li prdcode = "'+ data.PrdCode +'"><div class="contrast-fund">'+ data.PrdName +"</div><div class='contrast-fund-bottom' returnJsonStr='" + JSON.stringify(data) + "'>\
	        	    	    		<a class='contrast-fund-buy BiJiaoGouMai' isGMorDT='GM'>购买</a>\
	        	    	    		<a class='contrast-fund-dingtou BiJiaoDingTou' isGMorDT='DT'>定投</a></div></li>";
	        	    	    		CitigoldCheckList.append(checkList);
	        	    	    		//获取数据
	        	    	    		function getData(val){
	        	    	    			if(val && val.length){
	        	    	    				var span = '<span>{{value}}</span>';
		        	    	    			var data = span.replace(/{{value}}/g,val);
		        	    	    			return data;
	        	    	    			}
	        	    	    			return '<span>暂无</span>';
	        	    	    		}
	        	    	    		//参数产品
	        	    	    		var canshuChanpin = $('.canshu-chanpin li');
	        	    	    		//基金代码
	        	    	    		canshuChanpin.eq(0).append(getData(data.PrdCode));
	        	    	    		//成立日期
	        	    	    		canshuChanpin.eq(1).append(getData(data.InceptionDate.split(' ')[0]));
	        	    	    		//基金类型
	        	    	    		canshuChanpin.eq(2).append(getData(PrdAttr[data.PrdAttr]));
	        	    	    		//最低申购额
	        	    	    		canshuChanpin.eq(3).append(getData(data.MinInvestment));
	        	    	    		//基金托管人
	        	    	    		canshuChanpin.eq(4).append(getData(data.CustodianNameLocal));
	        	    	    		//基金管理公司
	        	    	    		canshuChanpin.eq(5).append(getData(data.FundCompanyNameLocal));
	        	    	    		//单位净值
	        	    	    		canshuChanpin.eq(6).append(getData(fmoney(data.m_nav,4)));
	        	    	    		//累计净值
	        	    	    		canshuChanpin.eq(7).append(getData(fmoney(data.AccumulatedNAV,4)));
	        	    	    		
	        	    	    		//投资组合
	        	    	    		var canshuChanpin = $('.touzizuhe li');
	        	    	    		if(data1.AssetAllocation == ''){
	        	    	    			 canshuChanpin.eq(2).append(getData('暂无'));
	        	    	    			 canshuChanpin.eq(1).append(getData('暂无'));
	        	    	    			 canshuChanpin.eq(0).append(getData('暂无'));
	        	    	    		}else{
	        	    	    			$.each(data1.AssetAllocation,function(i,d){
						var result = d.assetAllocationVO[0];
						if(result.Type == 3){
						   //现金
						  // d[0].TBreakdownValue    这样拿到数据
						  var num = Math.mul(Number(result.TBreakdownValue), 100);
						  canshuChanpin.eq(2).append(getData(String(num)));
						}else if(result.Type == 2){
							//债券占比
							//var num = Number(result.TBreakdownValue) * 100;
							var num = Math.mul(Number(result.TBreakdownValue), 100);
							
							canshuChanpin.eq(1).append(getData(String(num)));
						}else if(result.Type == 1){
							var num = Math.mul(Number(result.TBreakdownValue), 100);
							  //股票占比
							  canshuChanpin.eq(0).append(getData(String(num)));
						}else{
						//其他占比
						}
						})
	        	    	    		}
						
	        	    	    		//辰星组合
	        	    	    		var canshuChanpin = $('.chenxingzuhe li');
	        	    	    		//一周回报率排名
	        	    	    		canshuChanpin.eq(0).append(getData(data.Return1WeekRank));
	        	    	    		//一月回报率排名
	        	    	    		canshuChanpin.eq(1).append(getData(data.Return1MonthRank));
	        	    	    		//三月回报率排名
	        	    	    		canshuChanpin.eq(2).append(getData(data.Return3MonthRank));
	        	    	    		//半年回报率排名
	        	    	    		canshuChanpin.eq(3).append(getData(data.Return6MonthRank));
	        	    	    		//一年回报率排名
	        	    	    		canshuChanpin.eq(4).append(getData(data.Return1YearRank));
	        	    	    		//两年回报率排名
	        	    	    		canshuChanpin.eq(5).append(getData(data.Return2YearRank));
	        	    	    		//今年回报率排名
	        	    	    		canshuChanpin.eq(6).append(getData(data.ReturnYTDRank));
	        	    	    		//成立以来回报率
	        	    	    		canshuChanpin.eq(7).append(getData(fmoney(data.ReturnInception,5).toString().replace(',', '')));
	        	    	    		//一周回报率
	        	    	    		canshuChanpin.eq(8).append(getData(fmoney(data.Return1Week,5).toString().replace(',', '')));
	        	    	    		//一月回报率
	        	    	    		canshuChanpin.eq(9).append(getData(fmoney(data.Return1Month,5).toString().replace(',', '')));
	        	    	    		//三月回报率
	        	    	    		canshuChanpin.eq(10).append(getData(fmoney(data.Return3Month,5).toString().replace(',', '')));
	        	    	    		//半年回报率
	        	    	    		canshuChanpin.eq(11).append(getData(fmoney(data.Return6Month,5).toString().replace(',', '')));
	        	    	    		//一年回报率
	        	    	    		canshuChanpin.eq(12).append(getData(fmoney(data.Return1Year,5).toString().replace(',', '')));
	        	    	    		//两年回报率
	        	    	    		canshuChanpin.eq(13).append(getData(fmoney(data.Return2Year,5).toString().replace(',', '')));
	        	    	    		//今年回报率
	        	    	    		canshuChanpin.eq(14).append(getData(fmoney(data.ReturnYTD,5).toString().replace(',', '')));
	        	    	    		
	        	    	    		//辰星评估
	        	    	    		var canshuChanpin = $('.chenxingpinGGu li');
	        	    	    		//两年评级
	        	    	    		canshuChanpin.eq(0).append(getData(riskLevelStar[data.StarRatingY2]));
	        	    	    		//三年评级
	        	    	    		canshuChanpin.eq(1).append(getData(riskLevelStar[data.StarRatingY3]));
	        	    	    		//两年以来风险系数
	        	    	    		canshuChanpin.eq(2).append(getData(fmoney(data.Y2_DownsideRisk,5)));
	        	    	    		//夏普比率两年评价
	        	    	    		canshuChanpin.eq(3).append(getData(downSideRisk[data.Y2_SRQuartileRank]));
	        	    	    		//两年以来风险系统评价
	        	    	    		canshuChanpin.eq(4).append(getData(downSideRisk[data.Y2_DRQuartileRank]));
			}
			
			
		}
		
		
		
	        $("#citigold-fundSupermarketsTwo .contrast-fund-con").on('click', '.BiJiaoGouMai', function() {//比较购买
	        	
			citigoldJson.jjProInfo = JSON.parse($(this).parents('div').attr('returnJsonStr'));
			citigoldJson.jjProInfo.ReferenceRate = '以基金公司公告为准';
			citigoldJson.jjProInfo.CurrType = $("#citigoldName option:selected").attr('CurrType');
			if (commonJson.fundCmanagerId == "") {
				showTags({
					'title': '提示',
					'content': '没有基金客户经理号，无法办理该业务!',
					'ok': {}
				});
				return;
			}
			if (citigoldJson.jjProInfo.EnableTrans.substring(0, 1) == '1') { //购买
				citigoldJson.isGMorDT = $(this).attr('isGMorDT');
				$.mobile.changePage('citigold-fundSupermarketsFives.html');
			} else {
				showMsg('该基金无法购买！');
			}
		})
		$("#citigold-fundSupermarketsTwo .contrast-fund-con").on('click', '.BiJiaoDingTou', function() {//比较定投
			citigoldJson.jjProInfo = JSON.parse($(this).parents('div').attr('returnJsonStr'));
			citigoldJson.jjProInfo.ReferenceRate = '以基金公司公告为准';
			citigoldJson.jjProInfo.CurrType = $("#citigoldName option:selected").attr('CurrType');
			if (commonJson.fundCmanagerId == "") {
				showTags({
					'title': '提示',
					'content': '没有基金客户经理号，无法办理该业务!',
					'ok': {}
				});
				return;
			}
			if (citigoldJson.jjProInfo.EnableTrans.substring(1, 2) == '1') { //定投
				citigoldJson.isGMorDT = $(this).attr('isGMorDT');
				$.mobile.changePage('citigold-fundSupermarketsFour.html');
			} else {
				showMsg('该基金无法定投！');
			}
		})	    	    		

	} else {
		if (responseCode[0].results == "08") {
			JiaruBijiao();
		} else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
}

//获取验证码回调处理
function getVerificationCodeCitigoldSucc(msg, sendJson){
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	// console.log(responseCode);
	if (responseCode[0].results == '00') { //成功回调
		citigoldJson.isCanClickNEXT.isVerificationCode = true;
		$('#inp').removeAttr('disabled'); //.val(responseCode[1].messageAuthentionVO[0].MSG_INFO);
		commonJson.USER_NO = responseCode[1].messageAuthentionVO[0].USER_NO //用户唯一标识
		//commonJson.MSG_INFO = responseCode[1].messageAuthentionVO[0].MSG_INFO //动态口令
		var num = 80; //设置验证码有效定时器
		citigoldJson.codeTime = setInterval(function() {
			num--;
			$('.codetime').html('请在<span style="color:red;">' + num + '秒</span>内输入验证码');
			if (num == 0) {
				if(citigoldJson.codeTime){
					clearInterval(citigoldJson.codeTime);
				}
				$('#getMsg').removeClass('cannt-click').text('重新获取');
				$('.codetime').html('请在<span style="color:red;">0秒</span>内输入验证码');
				$('#inp').removeAttr('disabled').val('');
				commonJson.USER_NO = "";
				citigoldJson.isCanClickNEXT.isVerificationCode = false;
			}
		}, 1000)
	}else if(responseCode[0].results == '08'){
		showLoader('获取中...')
		imessageAuthentionServiceFun(sendJson, function(msg) {
			getVerificationCodeCitigoldSucc(msg, sendJson);
		}, function(err) { //失败回调
			hideLoader();
			citigoldJson.isCanClickNEXT.isVerificationCode = false;
			$('#getMsg').removeClass('cannt-click');
			funFail(err);
		});
	}else{
		citigoldJson.isCanClickNEXT.isVerificationCode = false;
		$('#getMsg').removeClass('cannt-click');
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}