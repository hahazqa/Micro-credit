//暂存业务列表 成功回调
function workbenchTempListSucc(msg,query) {
	    $("#gongzuotai-zcywjxbl .page-number-con").empty();
		var textHtml = '';
		if (msg == "") {
			workbenchJson.creditNum = 0;
			queryLoanapplyTable(textHtml,query);
		} else {
			msg.reverse();
			var nT = myTime.CurTime();
			$.each(msg, function(index, val) {
				if (nT - val.SUBMITTIME < 864000) {
					textHtml += "<li class='box-rows' data='" + JSON.stringify(val) + "' offlineOnline='" + val.offlineOnline + "' ind='" + Math.ceil(++index / 7) + "' style='display:none'>" +
						"<div style='width: 18%;'>" + val.BUSINESSTYPE + "</div>" +
						"<div style='width: 18%;'>" + val.MASCARDNAME + "</div>" +
						"<div style='width: 18%;'>" + val.CERTNUM + "</div>" +
						"<div style='width: 18%;'>" + myTime.UnixToDate(val.SUBMITTIME) + "</div>" +
						"<div style='width: 28%;'>" + val.YWXS + "</div>" +
						"</li>";
				} else {
					deleteTableData({
						"databaseName": "myDatabase",
						"tableName": "temporary_info",
						"conditions": [{
							"SUBMITTIME": val.SUBMITTIME
						}]
					}, function(msg) {}, function(err) {})
				}
				workbenchJson.creditNum = index;
			});
			queryLoanapplyTable(textHtml, query);
		}


		//$('#gongzuotai-zcywjxbl .previous').removeClass('btn_next');
		////初始化分页第一页
		//var pageNum = $("#gongzuotai-zcywjxbl .box-rows").length;
		//$("#gongzuotai-zcywjxbl .box-rows").hide();
		//$("#gongzuotai-zcywjxbl .box-rows[ind='1']").show();
		//$("#gongzuotai-zcywjxbl .page-number-con").empty();
		////分页
		//$("#gongzuotai-zcywjxbl .page-number-con").createPage({
		//	pageCount: (Math.ceil(pageNum / 7)),
		//	current: 1,
		//	backFn: function(p) {
		//		$("#gongzuotai-zcywjxbl .box-rows").hide();
		//		$("#gongzuotai-zcywjxbl .box-rows[ind=" + p + "]").show();
		//	}
		//});
	}
//脱机已受理 信用卡脱机 提交

function offlineGoOnCreditSubmit(offlineSendJson, curIndex, msgJSON, handleState) {
	var isShenH = '04'; //户籍所在地
	if (offlineSendJson.DOMICILE.indexOf('广东') >= 0) {
		if (offlineSendJson.DOMICILE.indexOf('深圳') >= 0) {
			isShenH = '01';
		} else {
			isShenH = '02';
		}
	} else if (offlineSendJson.DOMICILE.indexOf('广西') >= 0) {
		isShenH = '03';
	} else {
		isShenH = '04';
	}
	if (offlineSendJson.lAddData == '-5') {
		var lAddData = '-2';
	} else {
		lAddData = '';
	}
	showLoader('提交中...');
	var sendJson = {
		"b": [{
			"offlineOnline.s": offlineSendJson.offlineOnline, //脱机/联机
			"orgId.s": commonJson.orgId, //隶属机构
			"moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
			"tranId.s": workbenchJson.tranId2,//creditJson.tranId, //交易编号
			"operatorNo.s": offlineSendJson.operatorNo, //操作员
			"TLRNAME.s": offlineSendJson.TLRNAME, //操作员姓名
			"SPRNUM.s": offlineSendJson.SPRNUM, //信用卡用户 推广人编号
			"TLRCELLPHONE.s": offlineSendJson.TLRCELLPHONE, //操作员手机号码
			"deviceNo.s": offlineSendJson.deviceNo, //设备编号
			"MASCARDNAME.s": offlineSendJson.MASCARDNAME, //身份证姓名
			"SEX.s": offlineSendJson.SEX, //性别
			"CERTTYPE.s": '1', //证件类型
			"CERTNUM.s": offlineSendJson.CERTNUM, //证件号码
			"CERTVALIDDATE.s": offlineSendJson.CERTVALIDDATE, //有效期截止日
			"BIRTH.s": offlineSendJson.BIRTH, //出生日期
			"BRAFULLNAME.s": offlineSendJson.BRAFULLNAME, //拼音姓名
			"EDUCATION.s": offlineSendJson.EDUCATION, //教育程度
			"MOBILENUM.s": offlineSendJson.MOBILENUM, //手机号码
			"HOUSTYPE.s": offlineSendJson.HOUSTYPE, //住宅类型
			"OTHERADD.s": offlineSendJson.OTHERADD, //其他地址
			"HOUSZIPCODE.s": offlineSendJson.HOUSZIPCODE, //邮编
			"EMAILADD.s": offlineSendJson.EMAILADD, //E-mail
			"DOMICILE.s": isShenH, //户籍所在地
			"DOMICILE_ADD.s": offlineSendJson.DOMICILE, //户籍所在地
			"HOUSREGADD.s": offlineSendJson.HOUSREGADD, //户籍地址
			//"RECEMPNUM.s": offlineSendJson.RECEMPNUM, //推荐人员工号
			//2016.3.17新增字段
			"RECMOBILENUM.s": offlineSendJson.RECMOBILENUM, //推荐人手机号
			"RECEMPNUM.s": offlineSendJson.RECEMPNUM, //推荐人工号
			"MARSTATU.s": offlineSendJson.MASRTATU, //婚姻状况
			"OFFICE.s": offlineSendJson.OFFICE, //职位／岗位
			"UNITWORKEXP.s": offlineSendJson.UNITWORKEXP, //在现单位工作年限
			"INTOSOURCE.s": offlineSendJson.INTOSOURCE, //进件来源
			"CUSCARDAPPLY.s": offlineSendJson.CUSCARDAPPLY, //申请额度
			//2016.3.17新增字段
			"UNITNAME.s": offlineSendJson.UNITNAME, //单位全称
			"UNITPROPERTY.s": offlineSendJson.UNITPROPERTY, //单位性质
			"UNITPHONEAREANUM.s": offlineSendJson.UNITPHONEAREANUM, //单位固话区号
			"UNITPHONENUM.s": offlineSendJson.UNITPHONENUM, //单位固话号码
			"INDCATEGORY.s": offlineSendJson.INDCATEGORY, //行业类别
			"ANNINCOME.s": offlineSendJson.ANNINCOME, //年收入
			"URGNAME.s": offlineSendJson.URGNAME, //紧急联系人姓名
			"URGMOBILENUM.s": offlineSendJson.URGMOBILENUM, //紧急联系人手机
			"CARDSENDADDTYPE.s": "O", //卡片递送地址 与通讯地址一致 O custermerInfo.cCardAddr
			"ISAUTOPURCHASE.s": offlineSendJson.ISAUTOPURCHASE, //是否开通自动还款itigold
			"AUTODEBITACCOUNT.s": offlineSendJson.AUTODEBITACCOUNT, //账号/卡号
			"REPAYMETHOD.s": offlineSendJson.REPAYMETHOD, //自动还款方式
			"CARDFEETYPE.s": offlineSendJson.CARDFEETYPE, //年费类型
			"APPCARDTYPE.s": offlineSendJson.APPCARDTYPE, //卡产品代码
			"HOUSADD.s": offlineSendJson.HOUSADD, //家庭地址 核心地址接口 TYPE==h
			"HOUSPHONEAREANUM.s": offlineSendJson.HOUSPHONEAREANUM, //住宅电话区号 空
			"HOUSPHONENUM.s": offlineSendJson.HOUSPHONENUM, //住宅电话 空
			"UNITADD.s": offlineSendJson.UNITADD, //单位地址 TYPE==c
			"UNITZIPCODE.s": offlineSendJson.UNITZIPCODE, //单位邮编
			"IMMRELATION.s": offlineSendJson.IMMRELATION, //直系亲属关系 与持卡人关系 SEQ=1
			"IMMNAME.s": offlineSendJson.IMMNAME, //直系亲属姓名
			"IMMMOBILENUM.s": offlineSendJson.IMMMOBILENUM, //直系亲属手机
			"IMMPHONEAREANUM.s": offlineSendJson.IMMPHONEAREANUM, //直系亲属区号
			"IMMPHONENUM.s": offlineSendJson.IMMPHONENUM, //直系亲属电话
			"URGRELATION.s": offlineSendJson.URGRELATION, //紧急联系人关系 RELATIONSHIP
			"URGPHONEAREANUM.s": offlineSendJson.URGPHONEAREANUM, //紧急联系人区号
			"URGPHONENUM.s": offlineSendJson.URGPHONENUM, //紧急联系人电话
			"BILLDATE.s": offlineSendJson.REMARK2, //账单日
			"BUSSINESSCODE.s": "01", //联网核查--业务总类
			"TRANS_SCENE.s": "0002", //交易场景 电子卡0006
			"COMPARE_TYPE.s": "2", //    比对类型1-客户经理比对，2-客户比对
			"WS_TYPE.s": "2", // 终端类型1-PC，2-IOS，3-Android
			"VERSION.s": "v1.1.4", //当前控件版本
			"TRANS_CHANNEL.s": "301", //   渠道301
			"CRYPT_TYPE.s": "0", //   图像是否经过加密0-未加密，1-加密方式一，2加密方式二
			"BUSI_TYPE.s": "02", //  信用卡02
			"CLIENT_TYPE.s": "P", //客户类型 N组织 P个人
			"CARD.s": "", //卡号
			"ACCT_NO.s": "", //账号
			"CLIEMT_NO.s": "", //客户号
			"DOC_TYPE.s": "0", //证件类型
			"CLIENT_SHORT.s": "", //简称
			"BIRTH_DATE.s": "", //出生日
			"CELL_PHONE.s": "", //手机
			"PHONE.s": "", //住宅电话
			"LEGAL_REP.s": "", //法人代表
			"REVERSE_FLAG.s": "D", //证件号内部检查标志 默认D
			"CARD_CATEGORY.s": "", //信用卡查核心标识
			"handleState.s": handleState,
			'platGlobalSeq.s': creditJson.platGlobalSeq, //业务编号
			"localeTimestamp.s": "" + xinyonfkaJsonone.shijianChuo,
			"state.s": lAddData,
			"longitude.s": commonJson.longitude,//
			"latitude.s": commonJson.latitude//
		}]
	};
	//信息录入文字信息上传
	IHandleOfflineBussServiceFun(sendJson, function (msg) {
		xinyonfkaJson.shijianChuo = '2';
		IHandleOfflineBussServiceSucc(msg, offlineSendJson, curIndex, msgJSON);
	}, function (err) {
		xinyonfkaJson.shijianChuo = '1';
		funFaillilvANDwh(err, offlineGoOnCreditSubmit, [offlineSendJson, curIndex, msgJSON]);
	})
}
//脱机视频拍摄获取平台流水号后处理
function tuojiSaveOperateVideoFun(offlineSendJson, curIndex, msgJSON) {
	showLoader('提交中...');
	var sendJson = {
		"b": [{
			"deviceNo.s": offlineSendJson.deviceNo, //设备编号
			"moduleId.s": offlineSendJson.moduleId, //模块编号
			"tranId.s": offlineSendJson.tranId, //交易编号
			"orgId.s": commonJson.orgId,// offlineSendJson.orgId, //机构号
			"operatorNo.s": offlineSendJson.operatorNo, //操作员
			"offlineOnline.s": offlineSendJson.offlineOnline, //脱机/联机
			"workAddress.s": offlineSendJson.ipadWorkAddress, //工作地址
			"BUSSINESS_TYPE.s": offlineSendJson.REMARK2, //业务类型
			"CLIENT_TYPE.s": offlineSendJson.CLIENT_TYPE, //客户类型
			"DOCUMENT_TYPE.s": offlineSendJson.CERTTYPE, //证件类型／法人
			"DOCUMENT_ID.s": offlineSendJson.CERTNUM, //证件号码／法人
			"CLIENT_NAME.s": offlineSendJson.MASCARDNAME, //姓名／法人
			"ACCT_NO.s": offlineSendJson.ACCT_NO, //帐卡号
			"currency.s": offlineSendJson.currency, //币种
			"tranMoney.s": offlineSendJson.CUSCARDAPPLY.replace(/[^0-9\.]/ig, ""), //金额
			"AGENT_DOC_TYPE.s": offlineSendJson.DOC_TYPE, //经办人证件类型
			"AGENT_DOC_NO.s": offlineSendJson.CLIEMT_NO, //经办人证件号码
			"AGENT_NAME.s": offlineSendJson.LEGAL_REP, //经办人姓名
			"CREDIT_CODE.s": offlineSendJson.CREDIT_CODE, //统一社会信用代码
			"ORG_CODE.s": offlineSendJson.ORG_CODE, //组织机构代码
			"LICENSE.s": offlineSendJson.LICENSE, //营业执照或其他批文号
			"COMPNY_NAME.s": offlineSendJson.UNITNAME, //公司名称
			"REMARK.s": offlineSendJson.REMARK1, //备注
			"OFF_IMAGE_NO.s": offlineSendJson.OFF_IMAGE_NO,//脱机编号
			'platGlobalSeq.s': ImagingOperaTions.platGlobalSeq, //业务编号
			'FUND_NO.s': offlineSendJson.REMARK3,//产品编号
			'FUND_NAME.s': offlineSendJson.REMARK4,//产品名称
			'FILE_COUNT.s': '1',//业务上传的文件数量  暂时为1  有需要就修改
			"BussinessCode.s": "01", //联网核查--业务总类
			'busiStatus.s': ImagingOperaTions.busiStatus,
			'busiCategory.s': offlineSendJson.REMARK2,
			"longitude.s": commonJson.longitude,//
			"latitude.s": commonJson.latitude//
		}]
	};
	saveOperateVideoFun(sendJson, function (msg) {
		xinyonfkaJson.shijianChuo = '2';
		IHandleOfflineBussServiceSucc(msg, offlineSendJson, curIndex, msgJSON);
	}, function (err) {
		funFaillilvANDwh(err, tuojiSaveOperateVideoFun, [offlineSendJson, curIndex, msgJSON]);
	})
}
	//脱机已受理 信息录入 成功回调

function IHandleOfflineBussServiceSucc(msg, offlineSendJson, curIndex, msgJSON) {
	xinyonfkaJson.shijianChuo = '2';
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	var textHtml = '';
	if (responseCode[0].results == '00') {
        deleteTableData({	//提交成功后将表格里数据删除
            "databaseName": "myDatabase",
            "tableName": "nonetcustomer_info",
            "conditions": [{
                "SUBMITTIME": offlineSendJson.SUBMITTIME //提交时间
            }]
        }, function (msg) {
        }, function (err) {
            funDataFail(err);
        });
		ImagingOperaTions.imageNo = responseCode[0].imageNo;
		xinyonfkaJson.shijianChuo = '2';
		if (curIndex == 'detail') {
			$(".footter .previous").removeClass('btn_next');
			if (offlineSendJson.BUSI_TYPE == '02') {
				changeUploadStatus('02', creditJson.phoneTime, creditJson.signTime);
			} else if (offlineSendJson.BUSI_TYPE == '05') {
				var appBussPhone = {
					'busiGloablaSeq': ImagingOperaTions.platGlobalSeq, //业务编号
					'attchType': '0', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
					'deviceNo': offlineSendJson.deviceNo, //设备编号
					'moduleId': offlineSendJson.moduleId, //模块编号
					'tranId': offlineSendJson.tranId, //交易编号
					'orgId': commonJson.orgId, //机构编号
					'operatorNo': offlineSendJson.operatorNo, //操作员
					'custName': offlineSendJson.MASCARDNAME, //客户名称
					'custCredType': offlineSendJson.CERTTYPE, //客户证件类型
					'custCredNo': offlineSendJson.CERTNUM, //客户证件号
					'offlineOnline': offlineSendJson.offlineOnline, //脱机/联机
					'workAddress': offlineSendJson.ipadWorkAddress, //工作地址
					'IMG_NO': ImagingOperaTions.imageNo,//影音编号
					//'FILE_ADD': creditJson.storage.picFileInfoARR[0].b, //每个图片的名称和类型
					'OPER_TYPE': 'ADD',
					'userId': '9107', //orgIdToUserId[creditJson.storage.orgId], //柜员号
					'branchId': '00862' //creditJson.storage.orgId //机构号
				};
				appBussPhone = JSON.stringify(appBussPhone);
				var sql = "UPDATE up_download_info SET appBuss = '" + appBussPhone + "' WHERE fileToken = '" + ImagingOperaTions.phoneTime + "'";
				executeSqlString(sql, 'exe', function () {
					changeUploadStatus('02', ImagingOperaTions.phoneTime);
				}, function (err) {
					funDataFail(err);
				});

			}
			queryTableDataByConditions({
				"databaseName": "myDatabase", //数据库名
				"tableName": "nonetcustomer_info", //表名
				"conditions": tuojiConditions
			}, function (msg) {
				workbenchOfflineListSucc(msg);
			}, function (err) {
				funDataFail(err);
			});
			$.mobile.changePage('gongzuotai-tuojibanli.html', {
				reverse: true
			});
		} else if (curIndex == 'stop') {
			if (offlineSendJson.BUSI_TYPE == '02') {
				changeUploadStatus('03', creditJson.phoneTime, creditJson.signTime);
			} else if (offlineSendJson.BUSI_TYPE == '05') {
				changeUploadStatus('03', ImagingOperaTions.phoneTime);
			}
			$(".footter .previous").removeClass('btn_next');
			$.mobile.changePage('gongzuotai-tuojibanli.html', {
				reverse: true
			});
			queryTableDataByConditions({
				"databaseName": "myDatabase", //数据库名
				"tableName": "nonetcustomer_info", //表名
				"conditions": tuojiConditions
			}, function (msg) {
				workbenchOfflineListSucc(msg);
			}, function (err) {
				funDataFail(err);
			});

		} else {
			$("#gongzuotai-tuojibanli .box-content:eq(0)").find("li:eq(" + curIndex + ")").remove(); //删除页面数据
			if (offlineSendJson.BUSI_TYPE == '02') {
				changeUploadStatus('02', creditJson.phoneTime, creditJson.signTime);
				$("#gongzuotai-tuojibanli .box-content:eq(0)").find(".click").removeClass('click');
				$('#gongzuotai-tuojibanli .footter:eq(0) .back-zhongzhi').removeClass('btn_next');
				$("#gongzuotai-tuojibanli .footter:eq(0) .tuojiyishouli-xq").hide();
				$("#gongzuotai-tuojibanli .footter:eq(0) .next-btn").html('全部继续');
                queryTableDataByConditions({
                    "databaseName": "myDatabase", //数据库名
                    "tableName": "nonetcustomer_info", //表名
                    "conditions": tuojiConditions
                }, function (msg) {
                    if ((msgJSON.curCacheAllContinue || msgJSON.curCacheAllContinue == '0') && (msgJSON.curCacheAllContinue < $('#gongzuotai-tuojibanli .box-content:eq(0) li').length)) { //全部提交
                    	//全部提交时循环提交第一条业务
                        workbenchOfflineListSucc(msg);
                        showLoader('提交中...');
                        offlineGoOnSubmit({
                            "curCacheAllContinue": msgJSON.curCacheAllContinue
                        });
                    } else {
                        $('.footter:eq(0) .previous:eq(1)').removeClass('btn_next');
                        workbenchOfflineListSucc(msg);
                    }
                }, function (err) {
                    funDataFail(err);
                });

			} else if (offlineSendJson.BUSI_TYPE == '05') {
				var appBussPhone = {
					'busiGloablaSeq': ImagingOperaTions.platGlobalSeq, //业务编号
					'attchType': '0', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
					'deviceNo': offlineSendJson.deviceNo, //设备编号
					'moduleId': offlineSendJson.moduleId, //模块编号
					'tranId': offlineSendJson.tranId, //交易编号
					'orgId': commonJson.orgId, //机构编号
					'operatorNo': offlineSendJson.operatorNo, //操作员
					'custName': offlineSendJson.MASCARDNAME, //客户名称
					'custCredType': offlineSendJson.CERTTYPE, //客户证件类型
					'custCredNo': offlineSendJson.CERTNUM, //客户证件号
					'offlineOnline': offlineSendJson.offlineOnline, //脱机/联机
					'workAddress': offlineSendJson.ipadWorkAddress, //工作地址
					'IMG_NO': ImagingOperaTions.imageNo,//影音编号
					//'FILE_ADD': creditJson.storage.picFileInfoARR[0].b, //每个图片的名称和类型
					'OPER_TYPE': 'ADD',
					'userId': '9107', //orgIdToUserId[creditJson.storage.orgId], //柜员号
					'branchId': '00862' //creditJson.storage.orgId //机构号
				};
				appBussPhone = JSON.stringify(appBussPhone);
				var sql = "UPDATE up_download_info SET appBuss = '" + appBussPhone + "' WHERE fileToken = '" + ImagingOperaTions.phoneTime + "'";
				executeSqlString(sql, 'exe', function () {
					changeUploadStatus('02', ImagingOperaTions.phoneTime);
					$("#gongzuotai-tuojibanli .box-content:eq(0)").find(".click").removeClass('click');
					$('#gongzuotai-tuojibanli .footter:eq(0) .back-zhongzhi').removeClass('btn_next');
					$("#gongzuotai-tuojibanli .footter:eq(0) .tuojiyishouli-xq").hide();
					$("#gongzuotai-tuojibanli .footter:eq(0) .next-btn").html('全部继续');
                    queryTableDataByConditions({
                        "databaseName": "myDatabase", //数据库名
                        "tableName": "nonetcustomer_info", //表名
                        "conditions": tuojiConditions
                    }, function (msg) {
                        if ((msgJSON.curCacheAllContinue || msgJSON.curCacheAllContinue == '0') && (msgJSON.curCacheAllContinue < $('#gongzuotai-tuojibanli .box-content:eq(0) li').length)) { //全部提交
                            workbenchOfflineListSucc(msg);
                            showLoader('提交中...');
                            offlineGoOnSubmit({
                                "curCacheAllContinue": msgJSON.curCacheAllContinue
                            });
                        } else {
                            $('.footter:eq(0) .previous:eq(1)').removeClass('btn_next');
                            workbenchOfflineListSucc(msg);
                        }
                    }, function (err) {
                        funDataFail(err);
                    });
				}, function (err) {
					funDataFail(err);
				});
			}
		}
	} else if (responseCode[0].results == "08") {
		hideLoader();
		if (offlineSendJson.BUSI_TYPE == '02') {
			offlineGoOnCreditSubmit(offlineSendJson, curIndex, msgJSON);
		} else if (offlineSendJson.BUSI_TYPE == '05') {
			tuojiSaveOperateVideoFun(offlineSendJson, curIndex, msgJSON);
		}
	} else if (responseCode[0].results == '01') {
		if (offlineSendJson.BUSI_TYPE == '02') {
			changeUploadStatus('03', creditJson.phoneTime, creditJson.signTime);
		} else if (offlineSendJson.BUSI_TYPE == '05') {
			changeUploadStatus('03', ImagingOperaTions.phoneTime);
		}
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	} else {
		hideLoader();
		showTags({
			'title': '提示',
			'content': '业务处理超时！',
			'ok': {
				'title': '继续处理',
				'fun': function () {
					if (offlineSendJson.BUSI_TYPE == '02') {
						offlineGoOnCreditSubmit(offlineSendJson, curIndex, msgJSON);
					} else if (offlineSendJson.BUSI_TYPE == '05') {
						tuojiSaveOperateVideoFun(offlineSendJson, curIndex, msgJSON);
					}
				}
			}
		});
	}
}

//脱机已受理 本地数据库 成功回调

function workbenchOfflineListSucc(msg) {

		var textHtml = '';
		var tuojiCurNum = 0;
		if (msg == "") {
			if (tuojiSearchBtn == 'tabs') {
				$('.tuoji-pingtaidai-con li:eq(0) span').text('(0)');
			}
			$("#gongzuotai-tuojibanli .footter:eq(0) .previous:last").removeClass('btn_next');
			textHtml = '<li style="text-align:center">没有查到符合条件的数据</li>';
		} else {
			$("#gongzuotai-tuojibanli .footter:eq(0) .previous:last").addClass('btn_next');
			msg.reverse();
			// msg.push(msg[0],msg[0],msg[0],msg[0],msg[0],msg[0],msg[0],msg[0],msg[0],msg[0],msg[0],msg[0]);

			var nT = myTime.CurTime();
			var dis = '';
			$.each(msg, function(index, val) {
				if (nT - val.SUBMITTIME < 864000) {
					tuojiCurNum++;
					textHtml += "<li class='box-rows' data='" + JSON.stringify(val) + "' ind='" + Math.ceil(++index / 7) + "' style='display:none'>" +
						"<div>" + val.BUSINESSTYPE + "</div>" +
						"<div>" + val.MASCARDNAME + "</div>" +
						"<div>" + val.CERTNUM + "</div>" +
						"<div>" + myTime.UnixToDate(val.SUBMITTIME) + "</div>" +
						// "<div class='tuojibanli-value'>客户经理终止办理</div>" +
						"<div class='tuojibanli-value'>" + val.BUSSINESSSTATUS + "</div>" +
						"</li>";
				} else {
					deleteTableData({
						"databaseName": "myDatabase",
						"tableName": "nonetcustomer_info",
						"conditions": [{
							"SUBMITTIME": val.SUBMITTIME
						}]
					}, function(msg) {}, function(err) {})
				}

			});
			if (tuojiSearchBtn == 'tabs') {
				$('.tuoji-pingtaidai-con li:eq(0) span').text('(' + tuojiCurNum + ')');
			}
		}
		$("#gongzuotai-tuojibanli .box-content:eq(0)").html(textHtml == "" ? '<li style="text-align:center">没有查到符合条件的数据</li>' : textHtml);
		//查询后初始化底部按钮
		$('#gongzuotai-tuojibanli .footter:eq(0) .back-zhongzhi').removeClass('btn_next');
		$("#gongzuotai-tuojibanli .footter:eq(0) .tuojiyishouli-xq").hide();
		if ($("#gongzuotai-tuojibanli .box-content:eq(0)").find('.tuojibanli-value:contains(脱机已受理)').length > 0) { //有可以继续办理的业务
			$("#gongzuotai-tuojibanli .footter:eq(0) .previous:eq(1)").html('全部继续').addClass('btn_next');
		} else {
			$("#gongzuotai-tuojibanli .footter:eq(0) .previous:eq(1)").html('全部继续').removeClass('btn_next');
		}
		//初始化分页第一页
		var pageNum = $("#gongzuotai-tuojibanli .box-content:eq(0) .box-rows").length;
		$("#gongzuotai-tuojibanli .box-content:eq(0) .box-rows").hide();
		$("#gongzuotai-tuojibanli .box-content:eq(0) .box-rows[ind='1']").show();
		$("#gongzuotai-tuojibanli .conter-auto:eq(0) .page-number-con").empty();
		//分页
		$("#gongzuotai-tuojibanli .conter-auto:eq(0) .page-number-con").createPage({
			pageCount: (Math.ceil(pageNum / 7)),
			current: 1,
			backFn: function(p) {
				$("#gongzuotai-tuojibanli .box-content:eq(0) .box-rows").hide();
				$("#gongzuotai-tuojibanli .box-content:eq(0) .box-rows[ind=" + p + "]").show();
			}
		});
	}
	//脱机业务继续办理 平台查询 成功回调

function ptQueryOfflineBussSucc(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		var textHtml = '';
		var ltNum = 0;
		if (responseCode[0].results == "00") {
			responseCode.shift();
			$.each(responseCode, function(index, val) {
				var returnState = val.queryCardOfflineBuffModel[0].HANDLESTATE;
				if (returnState != '00' && returnState != '02' && returnState != '05' && returnState != '06' && returnState != '07' && returnState != '10' && returnState != '12') return true;
				ltNum++;
				if (tuojiSearchBtn == 'tabs') {
					$('.tuoji-pingtaidai-con li:eq(1) span').text('(' + (ltNum) + ')');
				}
				//  if (index == '0') return true;
				textHtml += "<li class='box-rows' tuojiPtListData='" + JSON.stringify(val.queryCardOfflineBuffModel[0]) + "' PLATGLOBALSEQ='" + val.queryCardOfflineBuffModel[0].PLATGLOBALSEQ + "'  ind='" + Math.ceil(++index / 7) + "' style='display:none'>" +
					"<div>" + offlineBUSINESSTYPEJson[val.queryCardOfflineBuffModel[0].BUSINESSTYPE] + "</div>" +
					"<div>" + val.queryCardOfflineBuffModel[0].MASCARDNAME + "</div>" +
					"<div>" + val.queryCardOfflineBuffModel[0].CERTNUM + "</div>" +
					"<div>" + val.queryCardOfflineBuffModel[0].CREATEDATE + "</div>" +
					// "<div class='tuojibanli-value'>客户经理终止办理</div>" +
					"<div class='tuojibanli-value'>" + offlineHANDLESTATEJson[val.queryCardOfflineBuffModel[0].HANDLESTATE] + "</div>" +
					"</li>";
			})
			$("#gongzuotai-tuojibanli .box-content:eq(1)").html(textHtml);
			//初始化分页第一页
			var pageNum = $("#gongzuotai-tuojibanli .box-content:eq(1) .box-rows").length;
			$("#gongzuotai-tuojibanli .box-content:eq(1) .box-rows").hide();
			$("#gongzuotai-tuojibanli .box-content:eq(1) .box-rows[ind='1']").show();
			$("#gongzuotai-tuojibanli .conter-auto:eq(1) .page-number-con").html('');
			//分页
			$("#gongzuotai-tuojibanli .conter-auto:eq(1) .page-number-con").createPage({
				pageCount: (Math.ceil(pageNum / 7)),
				current: 1,
				backFn: function(p) {
					$("#gongzuotai-tuojibanli .box-content:eq(1) .box-rows").hide();
					$("#gongzuotai-tuojibanli .box-content:eq(1) .box-rows[ind=" + p + "]").show();
				}
			});
		}else if (responseCode[0].results == "08") {
			showLoader('加载中...');
                tuojiPtConditions = {
                    "b": [{
                        "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
                        "deviceNo.s": commonJson.deviceNo, //设备编号
                        "orgId.s": commonJson.orgId,
                        "moduleId.s": creditJson.moduleID, //模块编号
                        "tranId.s": creditJson.tranId, //交易编号
                        "operatorNo.s": commonJson.adminCount, //操作员
                        "workAddress.s": commonJson.workAddress, //工作地址
                        "masCardName.s": "", //客户姓名
                        "certNum.s": "", //证件号
                        "bussType.s": "", //业务类型
                        "stime.s": "", //办理开始时间
                        "etime.s": "", //办理结束时间
                        "handleState.s": "", //业务处理状态
                        "pageSize.s": "",
                        "pageNo.s": ""
                    }]
                };
                ptQueryOfflineBussFun(tuojiPtConditions, function(msg) {
                    ptQueryOfflineBussSucc(msg);
                }, function(err) {
                    funFail(err);
                })
		}
		else {
			if (responseCode[0].results == '03') {
				if (tuojiSearchBtn == 'tabs') {
					$('.tuoji-pingtaidai-con li:eq(1) span').text('(0)');
				}
				$("#gongzuotai-tuojibanli .box-content:eq(1)").html(' <li style="text-align:center">没有查到符合条件的数据</li>');
			} else {
				showTags({
					'title': '提示',
					'content': responseCode[0].message,
					'ok': {}
				});
			}
			//初始化分页第一页
			var pageNum = $("#gongzuotai-tuojibanli .box-content:eq(1) .box-rows").length;
			$("#gongzuotai-tuojibanli .box-content:eq(1) .box-rows").hide();
			$("#gongzuotai-tuojibanli .box-content:eq(1) .box-rows[ind='1']").show();
			$("#gongzuotai-tuojibanli .conter-auto:eq(1) .page-number-con").html('');
			//分页
			$("#gongzuotai-tuojibanli .conter-auto:eq(1) .page-number-con").createPage({
				pageCount: (Math.ceil(pageNum / 7)),
				current: 1,
				backFn: function(p) {
					$("#gongzuotai-tuojibanli .box-content:eq(1) .box-rows").hide();
					$("#gongzuotai-tuojibanli .box-content:eq(1) .box-rows[ind=" + p + "]").show();
				}
			});
		}
	}
	//脱机业务继续办理 平台详情 成功回调

function ptQueryOfflineBussDetailSucc(msg) {
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	var textHtml = '';
	if (responseCode[0].results == "00") {
		if (tuoPtDataLastVal == '人脸识别失败') {
			$('#gongzuotai-creditCardPtDetails .footter .previous').addClass('btn_next');
		} else {
			$('#gongzuotai-creditCardPtDetails .footter .previous').removeClass('btn_next');
		}
		$(".basic_name").next().text(responseCode[1].cardClaimsVO[0].MASCARDNAME); //姓名
		$(".basic_sex").next().text(sexJsonToWZ[responseCode[1].cardClaimsVO[0].SEX]); //性别
		$(".basic_pinX").next().text(responseCode[1].cardClaimsVO[0].BRAFULLNAME); //拼音
		$(".basic_birth").next().text(responseCode[1].cardClaimsVO[0].BIRTH); //出生日期
		$(".basic_married").next().text(chunyinJson[responseCode[1].cardClaimsVO[0].MARSTATU]); //是否已婚

		$(".basic_zhengJH").next().text(responseCode[1].cardClaimsVO[0].CERTNUM); //身份证号码
		$(".basic_zhengJY").next().text(responseCode[1].cardClaimsVO[0].CERTVALIDDATE); //证件有效期
		$(".basic_phoneN").next().text(responseCode[1].cardClaimsVO[0].MOBILENUM); //手机号码
		$(".basic_youB").next().text(responseCode[1].cardClaimsVO[0].UNITZIPCODE); //邮编
		$(".basic_teach").next().text(eduJson[responseCode[1].cardClaimsVO[0].EDUCATION]); //教育程度
		$(".basic_houseType").next().text(roomStyleJson[responseCode[1].cardClaimsVO[0].HOUSTYPE]); //住宅类型
		$(".basic_addressH").next().text(responseCode[1].cardClaimsVO[0].DOMICILE_ADD); //户籍所在地
		$(".basic_addressZ").next().text(responseCode[1].cardClaimsVO[0].HOUSREGADD); //户籍地址
		$(".basic_mailbox").next().text(responseCode[1].cardClaimsVO[0].EMAILADD); //邮箱
		$(".basic_addressZN").next().text(responseCode[1].cardClaimsVO[0].UNITADD); //单位地址
		//职业信息
		$(".work_danW").next().text(responseCode[1].cardClaimsVO[0].UNITNAME); //单位全称
		$(".work_danWType").next().text(compropertyJson[responseCode[1].cardClaimsVO[0].UNITPROPERTY]); //单位性质
		$(".work_danWPoneN").next().text(responseCode[1].cardClaimsVO[0].UNITPHONEAREANUM + '-' + responseCode[1].cardClaimsVO[0].UNITPHONENUM); //单位固话
		$(".work_marriage").next().text(ndustryJson[responseCode[1].cardClaimsVO[0].INDCATEGORY]); //行业类型
		$(".work_allIncomeN").next().text(responseCode[1].cardClaimsVO[0].ANNINCOME + '万元'); //年收入
		$(".work_occupation").next().text(zhigangJson[responseCode[1].cardClaimsVO[0].OFFICE]); //岗位
		$('.work_workTimeN').next().text(responseCode[1].cardClaimsVO[0].UNITWORKEXP + '年'); //在现单位工作年限

		//联系人信息
		$(".family_emergentName").next().text(responseCode[1].cardClaimsVO[0].URGNAME); //紧急联系人姓名
		$(".family_emergentNum").next().text(responseCode[1].cardClaimsVO[0].URGMOBILENUM); //紧急联系人手机
		//主卡信息
		$(".masterID_lines").next().text(cardAnnualfeeJson[responseCode[1].cardClaimsVO[0].CARDFEETYPE]); //年费类型
		//$(".masterID_billType").next().text(isAutoPurchaseJson[responseCode[1].cardClaimsVO[0].ISAUTOPURCHASE]);
		if (responseCode[1].cardClaimsVO[0].ISAUTOPURCHASE == '1') {
			$(".masterID_billType").next().text('是'); //自动还款功能
			$('.cardDetail').append('<li class="masterID_content_rows">' +
				'<div class="masterID_rows_lines">' +
				'<span>自动还款方式：</span>' +
				'<span>' + cardAnnualfeeJson[responseCode[1].cardClaimsVO[0].REPAYMETHOD] + '</span>' +
				'</div>' +
				'<div class="masterID_rows_billType">' +
				'<span>还款卡号／账号：</span>' +
				'<span>' + responseCode[1].cardClaimsVO[0].AUTODEBITACCOUNT + '</span>' +
				'</div>' +
				'</li>');

		} else {
			$(".masterID_billType").next().text('否'); //自动还款功能
		}

		$(".masterID_cardAddress").next().text(responseCode[1].cardClaimsVO[0].UNITADD); //卡片寄送地址
		$(".masterID_billDate").next().text(responseCode[1].cardClaimsVO[0].BILLDAY + '日'); //账单日
		$(".basic_reference").next().text(responseCode[1].cardClaimsVO[0].RECEMPNUM); //推荐人
		$('.basic_jinjianly').next().text(jinjianlaiyuanJson[responseCode[1].cardClaimsVO[0].INTOSOURCE]); //进件来源
		$('.basic_shenqinged').next().text(responseCode[1].cardClaimsVO[0].CUSCARDAPPLY + '元'); //申请额度
	}else if (responseCode[0].results == "08") {
			hideLoader();
		}
	else {
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}

//脱机业务继续办理 人工授权页面 成功回调
function ptQueryOfflineBussLLDBSucc(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		if (responseCode[0].results == "00") {
			tuojiLLDBimgBase = base64decode(responseCode[1].cardClaimsVO[0].imgBase);
			tuojiLLDBcardImgBase = base64decode(responseCode[1].cardClaimsVO[0].cardImgBase);
			tuojiLLDBidImgBase = base64decode(responseCode[1].cardClaimsVO[0].idImgBase);
			$("#gongzuotai-tuojibanli-lldb .camera:eq(0)").attr('src', 'data:image/png;base64,' + tuojiLLDBimgBase);
			$("#gongzuotai-tuojibanli-lldb .camera:eq(1)").attr('src', 'data:image/png;base64,' + tuojiLLDBcardImgBase);
			$("#gongzuotai-tuojibanli-lldb .camera:eq(2)").attr('src', 'data:image/png;base64,' + tuojiLLDBimgBase);
			$("#gongzuotai-tuojibanli-lldb .camera:eq(3)").attr('src', 'data:image/png;base64,' + tuojiLLDBidImgBase);
			if (responseCode[1].cardClaimsVO[0].chipResult == '0') {
				$("#gongzuotai-tuojibanli-lldb .face-result:eq(0)").text('通过');
			} else {
				$("#gongzuotai-tuojibanli-lldb .face-result:eq(0)").addClass('no-pass').text('未通过');
			}
			if (responseCode[1].cardClaimsVO[0].cardResult == '0') {
				$("#gongzuotai-tuojibanli-lldb .face-result:eq(1)").text('通过');
			} else {
				$("#gongzuotai-tuojibanli-lldb .face-result:eq(1)").addClass('no-pass').text('未通过');
			}


		}else if (responseCode[0].results == "08") {
			hideLoader();
		}
		else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
	//脱机业务继续办理 状态修改 成功回调

function dealOfflineBussSucc(msg) {
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	var textHtml = '';
	if (responseCode[0].results == "00") {
		$('#gongzuotai-tuojibanli .footter:eq(1) .previous').removeClass('btn_next');
		$("#gongzuotai-tuojibanli .footter:eq(1) .tuojiyishouli-xq").hide();
		$("#gongzuotai-tuojibanli .box-content:eq(1)").find(".click .tuojibanli-value").text('客户经理终止办理');
		//      showTags({
		//          'title': '提示',
		//          'content': responseCode[0].message,
		//          'ok': {
		//              fun: function() {
		showLoader('加载中...')
		ptQueryOfflineBussFun(tuojiPtConditions, function(msg) {
				ptQueryOfflineBussSucc(msg);
			}, function(err) {
				funFail(err);
			})
			//              }
			//          }
			//      });
	}else if (responseCode[0].results == "08") {
			hideLoader();
		}
	else {
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}

function dealOfflineBussDetailSucc(msg) {
	xinyonfkaJson.shijianChuo='2';
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		var textHtml = '';
		if (responseCode[0].results == "00") {
			$('#gongzuotai-creditCardPtDetails .footter .previous').removeClass('btn_next');
			//showTags({
			//	'title': '提示',
			//	'content': responseCode[0].message,
			//	'ok': {
			//		fun: function() {
						$.mobile.changePage('gongzuotai-tuojibanli.html', {
							reverse: true
						});
					//}
				//}
		//	});
		}else if (responseCode[0].results == "08") {
			hideLoader();
		}
		else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
	//脱机业务继续办理 两两对比页面 状态修改 成功回调

function dealOfflineBussLLDBSucc(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		var textHtml = '';
		if (responseCode[0].results == "00") {
			$('#gongzuotai-tuojibanli-lldb .footter .previous').removeClass('btn_next');
//			showTags({
//				'title': '提示',
//				'content': responseCode[0].message,
//				'ok': {
//					fun: function() {
						$.mobile.changePage('gongzuotai-tuojibanli.html', {
							reverse: true
						});
//					}
//				}
//			});
		}
		else {
			if (responseCode[0].results == "08") {
			hideLoader();
		}else{
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
		}
	}
	//业务办理情况查询 成功回调

function ibussinessDetailServiceSucc(msg) {
		//alert(msg)
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		var textHtml = '';
		$("#gongzuotai-ywblqkcx .all-bishu-zhi").text('');
		$("#gongzuotai-ywblqkcx .all-bishu-zhi").next().text('');
		if ($('#gongzuotai-ywblqkcx .previous:last').hasClass('btn_next')) {
			$('#gongzuotai-ywblqkcx .previous:last').removeClass('btn_next');
		}
		if (responseCode[0].results == "00") {
			$("#gongzuotai-ywblqkcx .all-bishu-zhi").text(responseCode[0]['totalNum.i']);
			$("#gongzuotai-ywblqkcx .all-bishu-zhi").next().text(!responseCode[0].sumAmount ? "" : fmoney(responseCode[0].sumAmount) + '元');
			$.each(responseCode, function(index, val) {
				if (index == 0) return;
				textHtml += '<li class="box-rows" platSeq="'+val.bussinessDetail[0].PLAT_GLOBAL_SEQ+'" busiCategory="'+val.bussinessDetail[0].BUSI_CATEGORY+'"  bussinessType="'+val.bussinessDetail[0].BUSSINESS_TYPE+'" path="' + val.bussinessDetail[0].path + '">' +
					'<div>' + val.bussinessDetail[0].BUSSINESS_DATE.substr(0, 10) + '</div>' +
					'<div>' + bussinessType[val.bussinessDetail[0].BUSSINESS_TYPE] + '</div>' +
					'<div>' + dealStatus[val.bussinessDetail[0].STATUS] + '</div>' +
					'<div>' + faceRecogn[val.bussinessDetail[0].FACE_RECOGN] + '</div>' +
					'<div>' + fmoney(val.bussinessDetail[0].AMOUNT) + '</div>' +
					'<div>' + onOffline[val.bussinessDetail[0].OFF_ON_LINE] + '</div>' +
					'<div>' + val.bussinessDetail[0].CT_NAME + '</div>' +
					'<div>' + val.bussinessDetail[0].ID_CARD_NO + '</div>' +
					'</li>'
			});
			$("#gongzuotai-ywblqkcx .box-content").empty();
			$("#gongzuotai-ywblqkcx .box-content").html(textHtml);
			//分页
			$("#gongzuotai-ywblqkcx .page-number-con").createPage({
				pageCount: Math.ceil(responseCode[0]['totalNum.i'] / 7),
				current: workbenchJson.bussinessDetailPg,
				backFn: function(p) {
					showLoader('加载中...');
					workbenchJson.bussinessDetail.b[0]["page.s"] = String(p);
					workbenchJson.bussinessDetailPg = p;
					ibussinessDetailServiceFun(workbenchJson.bussinessDetail, function(msg) {
						ibussinessDetailServiceSucc(msg);
					}, function(err) {
						funFail(err);
					})
				}
			});
		}else if(responseCode[0].results == "08"){
			var gDataEnd = appTime.appCurDate('');     //当前时间
			var gDataStart = appTime.appPreDate('', 1000 * 60 * 60 * 24 * 30);
			var bussDateMin;
		    var bussDateMax;
		    if(workbenchJson.sT == undefined || workbenchJson.sT == null || workbenchJson.sT == ''){
				bussDateMin = getLastMonthYestdy(myTime.curDate());
			} else {
				bussDateMin = workbenchJson.sT;
			}
			if(workbenchJson.eT == undefined || workbenchJson.eT == null || workbenchJson.eT == ''){
				bussDateMax = dateGetYMD(10)[0];
			} else {
				bussDateMax = workbenchJson.eT;
			}
    		showLoader('加载中...');
		    var sendJson = {
		        "b": [{
		            "workAddress.s": commonJson.workAddress, //工作地址
		            "orgId.s": commonJson.orgId, //机构号
		            "operatorNo.s": commonJson.adminCount, //操作员
		            "deviceNo.s": commonJson.udId, //设备编号
		            "offOnLine.s": "", //脱机/联机
		            "bussDateMin.s":dateYYYYMMDD(bussDateMin), //起始时间
		            "bussDateMax.s":dateYYYYMMDD(bussDateMax), //截止时间
		            "bussType.s": "", //业务类型
		            "status.s": "", //处理状态
		            "faceRecogn.s": "", //人脸识别
		            "currency.s": "", //币种
		            "amountMin.s": "", //金额下线
		            "amountMax.s": "", //金额上限
		            "page.s": "1" //页码

		        }]
		    };
    		workbenchJson.bussinessDetailPg = 1;
    		workbenchJson.bussinessDetail = sendJson;
		    ibussinessDetailServiceFun(sendJson, function(msg) {
		        ibussinessDetailServiceSucc(msg);
		    }, function(err) {
		        funFail(err);
		    })
		} else if (responseCode[0].results == "03") {
			$("#gongzuotai-ywblqkcx .page-number-con").empty();
			$("#gongzuotai-ywblqkcx .box-content").html('<li style="text-align:center">没有查到符合条件数据！</li>')
		} else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
	//我的工作证 成功回调

function imyWorkPermitServiceSucc(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		if (responseCode[0].results == "00") {
			$("#gongzuotai-myWorkPermit .information-name:eq(0)").next().text(responseCode[1].myWorkPermitVO[0].REALNAME) //姓名
			$("#gongzuotai-myWorkPermit .information-name:eq(1)").next().text(responseCode[1].myWorkPermitVO[0].USERID) //工号
			$("#gongzuotai-myWorkPermit .information-name:eq(2)").next().text(responseCode[1].myWorkPermitVO[0].ORGID + responseCode[1].myWorkPermitVO[0].ORGNAME) //隶属支行
			$("#gongzuotai-myWorkPermit .information-name:eq(3)").next().text(responseCode[1].myWorkPermitVO[0].ADDRESS) //地址
			$("#gongzuotai-myWorkPermit .myWorkPermit-photoImg").attr('src', 'data:image/png;base64,' + base64decode(responseCode[1].myWorkPermitVO[0].PHOTO)); //照片
		}else if (responseCode[0].results == "08") {
			hideLoader();
			showLoader('加载中...');
	        var sendJson = {
	            "b": [{
	                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
	                "workAddress.s": commonJson.workAddress, //工作地址
	                "orgId.s": commonJson.orgId, //机构号
	                "operatorNo.s": commonJson.adminCount, //操作员
	                "deviceNo.s": commonJson.udId, //设备编号
	                "offOnline.s": commonJson.offlineOnline, //脱机/联机
	                "USERID.s": commonJson.adminCount //用户工号
	            }]
	        };
	        imyWorkPermitServiceFun(sendJson, function(msg) {
	            imyWorkPermitServiceSucc(msg);
	        }, function(err) {
	            funFail(err);
	        })
		}
		else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
	//我的业绩 成功回调

function ibussinessMetricsServiceSucc(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		$("#gongzuotai-myResults .myResults-name-zhi").text('');
		$("#gongzuotai-myResults .myResults-paiming").text('');
		if (responseCode[0].results == "00") {
			$.each(responseCode, function(index, val) {
				if (index == 0) return;
				switch (val.bussiMetric[0].bussType) {
					case "01": //电子卡
						$("#myRes-01 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						$("#myRes-01 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						break;
					case "02": //信用卡
						$("#myRes-02 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						$("#myRes-02 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						break;
					case "03": //申请贷款
						$("#myRes-03 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						$("#myRes-03 .myResults-name-zhi:eq(1)").text(val.bussiMetric[0].bussAmount + '万元');
						$("#myRes-03 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						break;
					case "27": //购买理财
						$("#myRes-27 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						$("#myRes-27 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						break;
					case "2": //购买基金
						$("#myRes-2 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						$("#myRes-2 .myResults-name-zhi:eq(1)").text(fmoney(val.bussiMetric[0].bussAmount) + '元');
						$("#myRes-2 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						break;
					case "0": //其他

						break;
					case "10": //电子渠道
						$("#myRes-10 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						$("#myRes-10 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						break;
					case "58":   //视频拍摄
						$("#myRes-58 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						$("#myRes-58 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						break;
					case "62":   //积分兑换
						$("#myRes-62 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						$("#myRes-62 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						break;
					case "63":   //积分订单管理
						$("#myRes-63 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						$("#myRes-63 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						break;
					case "65":   //社保待遇
						 $("#myRes-65 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						 $("#myRes-65 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						 break;
					case "66":   //特色产品
						 $("#myRes-66 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						 $("#myRes-66 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						 break;
					case "68":   //特惠商户
						 $("#myRes-68 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						 $("#myRes-68 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						 break;
					case "71":   //小微贷款申请
						$("#myRes-71 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						$("#myRes-71 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						break;
					case "72":   //面签
						$("#myRes-72 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						$("#myRes-72 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						break;
					case "53":   //征信查询
						$("#myRes-53 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						$("#myRes-53 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						break;
					case "81":   //征信查询
						$("#myRes-81 .myResults-name-zhi:eq(0)").text(val.bussiMetric[0].bussTimesCount);
						$("#myRes-81 .myResults-paiming").text(val.bussiMetric[0].bussRank);
						break;
				}
			});
		}else if (responseCode[0].results == "08") {
			hideLoader();
			$(".msg-con").show();
	        showLoader('查询中...');
	        var sendJson = {
	            "b": [{
	                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
	                "workAddress.s": commonJson.workAddress, //工作地址
	                "orgId.s": commonJson.orgId, //机构号
	                "operatorNo.s": commonJson.adminCount, //操作员
	                "deviceNo.s": commonJson.udId, //设备编号
	                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
	                "bussDateType.s": $("#myBussTimeType").val(), //时间段类型1、3、6、12 月 季度 半年 年
	                "bussPeriod.s": $("#myBussTimeDetail").val() //时间段201509
	            }]
	        };
	        IBussinessMetricsServiceFun(sendJson, function(msg) {
	            ibussinessMetricsServiceSucc(msg);
	        }, function(err) {
	            funFail(err);
	        });
		}
		else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
	//通知公告列表 成功回调

function inoticeServiceSucc(msg) {
		hideLoader();
		//alert(msg);
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		var textHtml = '';
		if (responseCode[0].results == "00") {
			commonJson.noticeCount = responseCode[0]['noticeCount.i'];
			$.each(responseCode, function(index, val) {
				if (index == 0) return;
				if (val.notice[0].STATUS == "0") {
					var status = "box-rows-color";
				} else {
					var status = "";
				}
				textHtml += '<a class="box-rows ' + status + '" noticeId="' + val.notice[0]["NOTICE_ID.l"] + '">' +
					'<div>' + val.notice[0].TITLE + '</div>' +
					'<div>' + val.notice[0].CREATE_ORG_ID + '</div>' +
					'<div>' + val.notice[0].CREATE_USER + '</div>' +
					'<div>' + val.notice[0].CREATE_TIME.split('.')[0] + '</div>' +
					'</a>';
			});
			$("#gongzuotai-announcement .box-content").empty();
			$("#gongzuotai-announcement .box-content").html(textHtml);
			//分页
			$("#gongzuotai-announcement .page-number-con").createPage({
				pageCount: Math.ceil(responseCode[0]['totalCount.i'] / 10),
				current: workbenchJson.inoticePg,
				backFn: function(p) {
					showLoader('加载中...');
					workbenchJson.inotice.b[0]["page.s"] = String(p);
					workbenchJson.inoticePg = p;
					inoticeServiceFun(workbenchJson.inotice, function(msg) {
						inoticeServiceSucc(msg);
					}, function(err) {
						funFail(err);
					})
				}
			});
		} else if (responseCode[0].results == "03") {
			$("#gongzuotai-announcement .page-number-con").empty();
			$("#gongzuotai-announcement .box-content").html('<div style="text-align:center">' + responseCode[0].message + '</div>');
		}else if (responseCode[0].results == "08") {
			hideLoader();
		}
		else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
	//通知公告详情 成功回调

function inoticeServiceDetailSucc(msg) {
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == "00") {
		commonJson.noticeCount = responseCode[0]['noticeCount.i'];
		$("#gongzuotai-announcementTwo .announcementTwo-zhi:eq(0)").text(responseCode[1].notice[0].TITLE); //标题
		$("#gongzuotai-announcementTwo .announcementTwo-zhi:eq(2)").text(responseCode[1].notice[0].CREATE_TIME.split('.')[0]); //发布时间
		$("#gongzuotai-announcementTwo .announcementTwo-zhi:eq(1)").text(responseCode[1].notice[0].CREATE_ORG_ID); //发布机构
		$("#gongzuotai-announcementTwo .announcementTwo-zhi:eq(3)").text(responseCode[1].notice[0].CREATE_USER); //发布人
		$("#gongzuotai-announcementTwo .announcementTwo-zhi:eq(4)").html(responseCode[1].notice[0].CONTENT); //内容
		var path = responseCode[1].notice[0].ATTACH_PATH;
		var _fileName = path.split('/');
		var fileName = _fileName[_fileName.length - 1];
		$('#anFuName').html(fileName).attr('path', path);
		if (fileName == '') {
			if ($('#gongzuotai-announcementTwo .announcementTwo-lijixiazai').hasClass('btn_next'))
				$('#gongzuotai-announcementTwo .announcementTwo-lijixiazai').removeClass('btn_next');
		} else {
			$('#gongzuotai-announcementTwo .announcementTwo-lijixiazai').addClass('btn_next');
		}
		//$("#noticeDetailFile").html(fileName).attr('path', path); //附件
		$('#gongzuotai-announcementTwo .announcementTwo-lijixiazai').on('click', function() { //点击下载
			if (!($('#gongzuotai-announcementTwo .announcementTwo-lijixiazai').hasClass('btn_next'))) return;
			showLoader('附件下载中...');
			var sendJson = {
				"b": [{
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"orgId.s": commonJson.orgId, //机构号
					"moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
					"tranId.s": workbenchJson.tranId11,//creditJson.tranId, //交易编号
					"operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
					"deviceNo.s": commonJson.udId, //设备编号
					"offOnline.s": commonJson.offlineOnline, //脱机/联机
					"filePath.s": $('#anFuName').attr('path') //附件路径
				}]
			};
			getFileDataFun(sendJson, function(msg) {
				getFileDataSucc(msg);
			}, function(err) {
				hideLoader();
				funFail(err);
			});
		})
	}else if (responseCode[0].results == "08") {
			hideLoader();
		}
	else {
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}

/*附件下载  成功回调*/
function getFileDataSucc(msg) {
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		if (responseCode[0].results == "00") { //
			var fileName = $('#anFuName').text();
			var fileStr = responseCode[1].hashMap[0].fileData;
			transFormBase64Tofile(fileName, fileStr, function(msg) { //返回路径
				var filePath = msg;
				scanTheFiles(filePath, function(msg) {}, function(err) {
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
			$("#ywbl-erweima").on('click', function() {
				$("#ywbl-erweima").hide();
			})
		}else if (responseCode[0].results == "08") {
			hideLoader();
		}
		else {
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
	//查询贷款利率列表 成功回调

function ILoanRateServiceSucc(msg) {
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	var textHtml = '';
	if (responseCode[0].results == "00") {
		workbenchJson.dkSucc = true;
		responseCode.shift();
		$.each(responseCode, function(index, el) {
			textHtml += '<li>' + RTPERDJson[el.loanRate[0].RTPERD] + '</li>' +
				'<li style="width:40%">&nbsp;</li>' +
				'<li>' + fmoney(el.loanRate[0].RTINRT,4) + '</li>';
		})
		$('.lilvandwaihui-tabs-contwrap-dk .lilvandwaihui-in-tabs-bd').html(textHtml);
	}else if(responseCode[0].results == "08"){
		hideLoader();
		lilvandwaihuiIExchangeQuotationServiceFun();
	}
	else {
		if (responseCode[0].results == "03") {
			workbenchJson.dkSucc = true;
			$('.lilvandwaihui-tabs-contwrap-dk .lilvandwaihui-in-tabs-bd').html('<li style="width:100%;line-height:60px;text-align:center;">' + responseCode[0].message + '</li>');
		}else {
			workbenchJson.dkSucc = false;
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
}

//查询存款利率列表 成功回调
function IMcRateServiceSucc(msg) {
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	var textHtml = '';
	var textRMB = '';
	if (responseCode[0].results == "00") {
		workbenchJson.ckSucc = true;
		//人民币

		textHtml = '<ul class="lilvandwaihui-in-tabs-bd scrollBox">';
		$.each(responseCode[1].hashMap[2]['01'], function(index, el) {
			if (el.mcRate[0].RTINKD == '00') { //活期
				textHtml += '<li>活期</li>' +
					'<li style="width:10%">&nbsp;</li>' +
					'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';
			} else if (el.mcRate[0].RTINKD == '01') {
				if (el.mcRate[0].RTPERD == 'M03') {
					textHtml += '<li>整存整取三个月</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'M06') {
					textHtml += '<li>整存整取六个月</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'Y01') {
					textHtml += '<li>整存整取一年</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'Y02') {
					textHtml += '<li>整存整取二年</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'Y03') {
					textHtml += '<li>整存整取三年</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'Y05') {
					textHtml += '<li>整存整取五年</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
			}else if(el.mcRate[0].RTINKD == '02'){
				if (el.mcRate[0].RTPERD == 'Y01') {
					textHtml += '<li>零存整取一年</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'Y03') {
					textHtml += '<li>零存整取三年</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'Y05') {
					textHtml += '<li>零存整取五年</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
			}else if(el.mcRate[0].RTINKD == '08'){
				if (el.mcRate[0].RTPERD == 'D01') {
					textHtml += '<li>通知存款一天</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'D07') {
					textHtml += '<li>通知存款七天</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
			}
		})
		textHtml += '</ul>';

		//港币
		textHtml += '<ul class="lilvandwaihui-in-tabs-bd" style="display:none;">';
		$.each(responseCode[1].hashMap[0]['13'], function(index, el) {
			if (el.mcRate[0].RTINKD == '00') { //活期
				textHtml += '<li>活期</li>' +
					'<li style="width:10%">&nbsp;</li>' +
					'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';
			} else if (el.mcRate[0].RTINKD == '01') {
				if (el.mcRate[0].RTPERD == 'M01') {
					textHtml += '<li>整存整取一个月</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'M03') {
					textHtml += '<li>整存整取三个月</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'M06') {
					textHtml += '<li>整存整取六个月</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'Y01') {
					textHtml += '<li>整存整取一年</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'Y02') {
					textHtml += '<li>整存整取二年</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}

			}
		})
		textHtml += '</ul>';
		//美元
		textHtml += '<ul class="lilvandwaihui-in-tabs-bd" style="display:none;">';
		$.each(responseCode[1].hashMap[1]['14'], function(index, el) {
			if (el.mcRate[0].RTINKD == '00') { //活期
				textHtml += '<li>活期</li>' +
					'<li style="width:10%">&nbsp;</li>' +
					'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';
			} else if (el.mcRate[0].RTINKD == '01') {
				if (el.mcRate[0].RTPERD == 'M01') {
					textHtml += '<li>整存整取一个月</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'M03') {
					textHtml += '<li>整存整取三个月</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'M06') {
					textHtml += '<li>整存整取六个月</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'Y01') {
					textHtml += '<li>整存整取一年</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}
				if (el.mcRate[0].RTPERD == 'Y02') {
					textHtml += '<li>整存整取二年</li>' +
						'<li style="width:10%">&nbsp;</li>' +
						'<li>' + fmoney(el.mcRate[0].RTINRT,4) + '%</li>';

				}

			}
		})
		textHtml += '</ul>';
		$('.lilvandwaihui-tabs-contwrap-ck .lilvandwaihui-in-tabs').append(textHtml);
	} else {
		if (responseCode[0].results == "03") {
			workbenchJson.ckSucc = true;
			$('.lilvandwaihui-tabs-contwrap-ck .lilvandwaihui-in-tabs').append('<p style="line-height:50px;text-align:center;">' + responseCode[0].message + '</p>');
		}else if(responseCode[0].results == "08"){
			hideLoader();
		} else {
			workbenchJson.ckSucc = false;
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
}

//外汇牌价 成功回调
function IExchangeQuotationServiceSucc(msg) {
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	var textHtml = '';
	if (responseCode[0].results == "00") { //
		workbenchJson.whSucc = true;
		textHtml = '<li><div>基数</div><div>现汇买入价</div><div>现汇卖出价</div><div>现钞买入价</div><div>现钞卖出价</div></li>';
		var num = 0;
		var textHtmlHKD='';
		var textHtmlUSD='';
		var textHtmlEUR='';
		$.each(responseCode, function(index, el) {
			if(index==0) return;
			if (el.exchangeQuotationVO[0].CCY == '344' ||el.exchangeQuotationVO[0].CCY == '840' ||el.exchangeQuotationVO[0].CCY == '978'){
				num++;
				if(el.exchangeQuotationVO[0].CCY == '344'){
					textHtmlHKD= '<li><div>' + 100 + '</div><div>' + fmoney(Number(el.exchangeQuotationVO[0].BUYREMIT_AMT)*100,3) + '</div><div>' + fmoney(Number(el.exchangeQuotationVO[0].SELLREMIT_AMT)*100,3) + '</div><div>' + fmoney(Number(el.exchangeQuotationVO[0].BUYOOF_AMT)*100,3) + '</div><div>' + fmoney(Number(el.exchangeQuotationVO[0].SELLOOF_AMT)*100,3) + '</div></li>';
				}
				if(el.exchangeQuotationVO[0].CCY == '840'){
					textHtmlUSD = '<li><div>' + 100 + '</div><div>' + fmoney(Number(el.exchangeQuotationVO[0].BUYREMIT_AMT)*100,3) + '</div><div>' + fmoney(Number(el.exchangeQuotationVO[0].SELLREMIT_AMT)*100,3) + '</div><div>' + fmoney(Number(el.exchangeQuotationVO[0].BUYOOF_AMT)*100,3) + '</div><div>' + fmoney(Number(el.exchangeQuotationVO[0].SELLOOF_AMT)*100,3) + '</div></li>';
				}
				if(el.exchangeQuotationVO[0].CCY == '978'){
					textHtmlEUR = '<li><div>' + 100 + '</div><div>' + fmoney(Number(el.exchangeQuotationVO[0].BUYREMIT_AMT)*100,3) + '</div><div>' + fmoney(Number(el.exchangeQuotationVO[0].SELLREMIT_AMT)*100,3) + '</div><div>' + fmoney(Number(el.exchangeQuotationVO[0].BUYOOF_AMT)*100,3) + '</div><div>' + fmoney(Number(el.exchangeQuotationVO[0].SELLOOF_AMT)*100,3) + '</div></li>';
				}
			}
		});
		textHtml+=textHtmlHKD+textHtmlUSD+textHtmlEUR;
		if (num > 0) {
			$('.lilvandwaihui-tabs-contwrap-wh .lilvandwaihui-in-tabs-bd').html(textHtml);
		} else {
			$('.lilvandwaihui-tabs-contwrap-wh .lilvandwaihui-in-tabs-bd').html('<li><div>基数</div><div>现汇买入价</div><div>现汇卖出价</div><div>现钞买入价</div><div>现钞卖出价</div></li><li><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div></li><li><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div></li><li><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div></li>');
		}

	} else {
		if (responseCode[0].results == "03") {
			workbenchJson.whSucc = true;
			$('.lilvandwaihui-tabs-contwrap-wh .lilvandwaihui-in-tabs-bd').html('<li><div>基数</div>><div>现汇买入价</div><div>现汇卖出价</div><div>现钞买入价</div><div>现钞卖出价</div></li><li><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div></li><li><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div></li><li><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div><div>&nbsp;</div></li>');
			return;
		}else if(responseCode[0].results == "08"){
			hideLoader();
			lilvandwaihuiIExchangeQuotationServiceFun();
			return;
		}
		workbenchJson.whSucc = false;
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}



function IFaceRecognitionServiceRegSucc(msg) {
	//alert(msg);
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == "00") {
		if (responseCode[1].faceRegisterVO[0].RETURN_CODE == "0") {
			showTags({
				'title': '提示',
				'content': '人脸识别登录注册成功',
				'ok': {
					fun: function() {
						$.mobile.changePage('../main.html', {
							reverse: true
						});
					}
				}
			});
		} else {
			showTags({
				'title': '提示',
				'content': responseCode[1].faceRegisterVO[0].RESULT_MSG,
				'ok': {}
			});
		}
	}else if (responseCode[0].results == "08") {
			hideLoader();
		}
	else {
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}

//业务办理明细
function findCreditCardDetailSucc(msg){
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == "00") {
		//基本信息
		$('.basis_con .confirm_ul span:eq(1)').html(responseCode[1].cardClaimsVO[0].MASCARDNAME);  //姓名
		$('.basis_con .confirm_ul span:eq(3)').html(sexJsonToWZ[responseCode[1].cardClaimsVO[0].SEX]);  //性别
		$('.basis_con .confirm_ul span:eq(5)').html(responseCode[1].cardClaimsVO[0].BRAFULLNAME);  //拼音
		$('.basis_con .confirm_ul span:eq(7)').html(responseCode[1].cardClaimsVO[0].CERTNUM);  //证件号码
		$('.basis_con .confirm_ul span:eq(9)').html(responseCode[1].cardClaimsVO[0].CERTVALIDDATE);  //有效期
		$('.basis_con .confirm_ul span:eq(11)').html(responseCode[1].cardClaimsVO[0].BIRTH);  //出生日期
		$('.basis_con .confirm_ul span:eq(13)').html(eduJson[responseCode[1].cardClaimsVO[0].EDUCATION]);  //教育程度
		$('.basis_con .confirm_ul span:eq(15)').html(roomStyleJson[responseCode[1].cardClaimsVO[0].HOUSTYPE]);  //住宅类型
		$('.basis_con .confirm_ul span:eq(17)').html(responseCode[1].cardClaimsVO[0].MOBILENUM);  //手机号码
		$('.basis_con .confirm_ul span:eq(19)').html(responseCode[1].cardClaimsVO[0].HOUSZIPCODE);  //邮编
		$('.basis_con .confirm_ul span:eq(21)').html(responseCode[1].cardClaimsVO[0].UNITADD);  //通讯地址
		$('.basis_con .confirm_ul span:eq(23)').html(creditMARSTATUJson[responseCode[1].cardClaimsVO[0].MARSTATU]);  //是否已婚
		$('.basis_con .confirm_ul span:eq(25)').html(responseCode[1].cardClaimsVO[0].EMAILADD);  //E-MAIL
		$('.basis_con .confirm_ul span:eq(27)').html(creditDOMICILEJson[responseCode[1].cardClaimsVO[0].DOMICILE]);  //户籍所在地
		$('.basis_con .confirm_ul span:eq(29)').html(responseCode[1].cardClaimsVO[0].HOUSREGADD);  //户籍地址
//		$('.basis_con .confirm_ul span:eq(31)').html(responseCode[1].cardClaimsVO[0].RECEMPNUM);  //推荐人
		if(responseCode[1].cardClaimsVO[0].RECMOBILENUM !=''){
    			$('.basis_con .confirm_ul span:eq(31)').html(responseCode[1].cardClaimsVO[0].RECMOBILENUM);//推荐人手机号
    		}else{
    			$('.basis_con .confirm_ul span:eq(31)').html(responseCode[1].cardClaimsVO[0].RECEMPNUM);//推荐人员工工号
    		}
		//职业信息
		$('.work_con .confirm_ul span:eq(1)').html(responseCode[1].cardClaimsVO[0].UNITNAME);  //单位全称
		$('.work_con .confirm_ul span:eq(3)').html(responseCode[1].cardClaimsVO[0].UNITPHONEAREANUM+'-'+responseCode[1].cardClaimsVO[0].UNITPHONENUM);  //单位固话
		$('.work_con .confirm_ul span:eq(5)').html(compropertyJson[responseCode[1].cardClaimsVO[0].UNITPROPERTY]);  //单位性质
		$('.work_con .confirm_ul span:eq(7)').html(ndustryJson[responseCode[1].cardClaimsVO[0].INDCATEGORY]);  //行业类别
		$('.work_con .confirm_ul span:eq(9)').html(creditOFFICEJson[responseCode[1].cardClaimsVO[0].OFFICE]);  //职务/岗位
		$('.work_con .confirm_ul span:eq(11)').html(responseCode[1].cardClaimsVO[0].UNITWORKEXP + '年');  //现单位工作年限
		$('.work_con .confirm_ul span:eq(13)').html(responseCode[1].cardClaimsVO[0].ANNINCOME +'万元');  //年收入
		//联系信息
		$('.family_con .confirm_ul span:eq(1)').html(responseCode[1].cardClaimsVO[0].URGNAME);  //紧急联系人姓名
		$('.family_con .confirm_ul span:eq(3)').html(responseCode[1].cardClaimsVO[0].URGMOBILENUM);  //紧急联系人手机
		//主卡信息
		if(responseCode[1].cardClaimsVO[0].CARDSENDADDTYPE == 'C'){
			$('.card_con .confirm_ul span:eq(1)').html(responseCode[1].cardClaimsVO[0].UNITADD);  //卡片寄送地址-->单位地址
		}else if(responseCode[1].cardClaimsVO[0].CARDSENDADDTYPE == 'H'){
			$('.card_con .confirm_ul span:eq(1)').html(responseCode[1].cardClaimsVO[0].HOUSADD);  //卡片寄送地址-->家庭地址
		}else if(responseCode[1].cardClaimsVO[0].CARDSENDADDTYPE == 'O'){
			$('.card_con .confirm_ul span:eq(1)').html(responseCode[1].cardClaimsVO[0].OTHERADD);  //卡片寄送地址-->其他地址
		}
		$('.card_con .confirm_ul span:eq(3)').html(cardAnnualfeeJson[responseCode[1].cardClaimsVO[0].CARDFEETYPE]);  //年费类型

		if(responseCode[1].cardClaimsVO[0].AUTODEBITACCOUNT !=''){
			$('.card_con .confirm_ul span:eq(5)').html('是');  //自动还款功能    //TODO:没有
			$('.card_con .confirm_ul span:eq(7)').html(responseCode[1].cardClaimsVO[0].AUTODEBITACCOUNT);  //账号/卡号
			$('.card_con .confirm_ul span:eq(9)').html(cardRepaystyleJson[responseCode[1].cardClaimsVO[0].REPAYMETHOD]);  //自动还款方式
		}else{
			$('.card_con .confirm_ul span:eq(5)').html('否');  //自动还款功能    //TODO:没有
			$('.card_con .confirm_ul li:eq(2)').css('display','none');
		}
		$('.card_con .confirm_ul span:eq(11)').html(creditINTOSOURCEJson[responseCode[1].cardClaimsVO[0].INTOSOURCE]);  //进件来源
		$('.card_con .confirm_ul span:eq(13)').html(responseCode[1].cardClaimsVO[0].CUSCARDAPPLY + '元');  //申请额度
		$('.card_con .confirm_ul span:eq(15)').html(responseCode[1].cardClaimsVO[0].BILLDAY + '日');  //账单日
	}else if(responseCode[0].results == "08"){

	}else{
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}


//工作轨迹  20160520
function showJobTrajectorySucc(msg,sDate,eDate,map){
	var beginDate = sDate.split('-')[0] +"."+ sDate.split('-')[1]+"."+ sDate.split('-')[2];
	var endDate = eDate.split('-')[0] +"."+ eDate.split('-')[1]+"."+ eDate.split('-')[2];
	hideLoader();
	msg = msg.replace(new RegExp("\\.[is]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == "00") {
		//右侧业务详情栏目
		var totalNum = responseCode[0].totalNum;
		var textHtml = "";
		textHtml += '<li class="date"><span class="sDate">'+ beginDate +"-"+ endDate +'</span></li>'
		textHtml += '<li><span>业务合计</span>:&nbsp;'+totalNum+'笔</li>'
		var responseBussSum = responseCode[1].workLocusVO[1].bussSum;
		//遍历
		$.each(responseBussSum,function(index,ele){
			ele = ele.workLocusSumVO[0];
			if(ele.bussType == "01"){
			textHtml += '<li><span>信通数字卡开立</span>:&nbsp;'+ele.bussCount+'笔</li>'
			}else if(ele.bussType == "02"){
				textHtml += '<li><span>申请信用卡</span>:&nbsp;'+ele.bussCount+'笔</li>'
			}else if(ele.bussType == "03"){
				textHtml += '<li><span>按揭贷款</span>:&nbsp;'+ele.bussCount+'笔</li>'
			}else if(ele.bussType == "2"){
				textHtml += '<li><span>购买/定投基金</span>:&nbsp;'+ele.bussCount+'笔</li>'
			}else if(ele.bussType == "10"){
				textHtml += '<li><span>电子渠道</span>:&nbsp;'+ele.bussCount+'笔</li>'
			}else if(ele.bussType == "27"){
				textHtml += '<li><span>理财风评</span>:&nbsp;'+ele.bussCount+'笔</li>'
			}else if(ele.bussType == "58"){
				textHtml += '<li><span>视频拍摄</span>:&nbsp;'+ele.bussCount+'笔</li>'
			}else if(ele.bussType == "62"){
				textHtml += '<li><span>积分兑换</span>:&nbsp;'+ele.bussCount+'笔</li>'
			}else if(ele.bussType == "63"){
				textHtml += '<li><span>积分订单管理</span>:&nbsp;'+ele.bussCount+'笔</li>'
			}else if(ele.bussType == "65"){
				textHtml += '<li><span>社保待遇</span>:&nbsp;'+ele.bussCount+'笔</li>'
			}else if(ele.bussType == "66"){
				textHtml += '<li><span>特色产品</span>:&nbsp;'+ele.bussCount+'笔</li>'
			}else if(ele.bussType == "68"){
				textHtml += '<li><span>特惠商户</span>:&nbsp;'+ele.bussCount+'笔</li>'
			}else if(ele.bussType == "71"){
				textHtml += '<li><span>小微贷款</span>:&nbsp;'+ele.bussCount+'笔</li>'
			}else if(ele.bussType == "72"){
				textHtml += '<li><span>面签</span>:&nbsp;'+ele.bussCount+'笔</li>'
			}
		});
		//展示
		$("#gongzuotai-jobTrajectory .detail_list ul").html(textHtml);

		//左侧地图坐标展示
		var responseBussDetail = responseCode[1].workLocusVO[0].bussDetail;
		map.clearOverlays();//清楚地图上所有的覆盖物
		//alert(responseBussDetail[1].bussinessDetail[0].CT_NAME);//陈栋梁
		//遍历
		$.each(responseBussDetail,function(index,ele){
			var longitude = ele.bussinessDetail[0].longitude;//经度
			var latitude = ele.bussinessDetail[0].latitude;//纬度
			if(longitude == "" || latitude == ""){
				return
			}
			var point = new BMap.Point(longitude,latitude);//坐标
			var myIcon = new BMap.Icon("../../images/ic-gjzb-ing.png", new BMap.Size(20, 32));
			var marker = new BMap.Marker(point,{icon:myIcon});//创建标注
			if(index < 20){//20笔内坐标依次显示
				var time = 500*index;
				setTimeout(function(){
					map.panTo(point);
					map.addOverlay(marker);
				},time);
			}else{
               setTimeout(function(){
                map.addOverlay(marker);
                          },10000);
			}
		});
	}else if(responseCode[0].results == "08"){
		//alert(1234);
		//08超时异常处理
		var bussDateMin = $("#gongzuotai-jobTrajectory input[type='date']:first").val();//开始日期
		var bussDateMax = $("#gongzuotai-jobTrajectory input[type='date']:last").val();//结束日期
		var bussType = $("#gongzuotai-jobTrajectory .checkBusiness select").val();//业务类型
		//alert(bussDateMin+bussDateMax+bussType);
		//查询传递参数
		var sendJson = {
			"b": [{
				"workAddress.s": commonJson.workAddress, //工作地址
				"orgId.s": commonJson.orgId, //机构号
				"moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
				"tranId.s": workbenchJson.tranId15,//creditJson.tranId, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"offOnLine.s": "", //脱机/联机
				"bussDateMin.s":dateYYYYMMDD(bussDateMin), //起始时间
				"bussDateMax.s":dateYYYYMMDD(bussDateMax), //截止时间
				"bussType.s": bussType //业务类型
			}]
		};
		showLoader("查询数据中,请等待...")
		//调用工作轨迹查询接口
		getJobTrajectoryQueryFun(sendJson,function(msg){
            $("#gongzuotai-jobTrajectory .seach-day-con").hide();
			showJobTrajectorySucc(msg,bussDateMin,bussDateMax,map);
		},function(err){
            $("#gongzuotai-jobTrajectory .seach-day-con").hide();
			funFail(err);
		});
	}else {
		showTags({
			"title": "提示",
			"content": responseCode[0].message,
			"ok": {}
		});
	}
}


