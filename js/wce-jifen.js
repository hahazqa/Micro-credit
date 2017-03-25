/*积分客户信息查询 成功回调*/
function jifenCustomerInfoSucc(sendJson, msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == "00") {
        if ($.trim(responseCode[1].customerInfoVO[0].CH_CLIENT_NAME) != '' && $.trim(responseCode[1].customerInfoVO[0].CH_CLIENT_NAME) != custermerInfo.name) {
            showTags({
                'title': '提示',
                'content': '身份证姓名与核心姓名不一致,无法办理',
                'ok': {
                    fun: function () {
                        $.mobile.changePage('jifen-readingID.html', {
                            reverse: true
                        });
                    }
                }
            });
            return;
        }
        jifenJson.CLIENT_NO = responseCode[1].customerInfoVO[0].CLIENT_NO; //获取客户号
        jifenJson.isCoreHas = jifenJson.CLIENT_NO != "" ? true : false; //判断客户号是否为空
        jifenJson.mobilePhone = responseCode[0].mobilePhoto; //获取客户手机号
        if(jifenJson.tranId == '62' && (jifenJson.mobilePhone == undefined 
        	|| jifenJson.mobilePhone == null || $.trim(jifenJson.mobilePhone) == '')){
        	showTags({
                'title': '提示',
                'content': '客户信息无手机号码，无法办理该业务！',
                'ok': {
                    fun: function () {
                        $.mobile.changePage('jifen-readingID.html', {
                            reverse: true
                        });
                    }
                }
            });
            return;
        }
        if(jifenJson.tranId == '62'){
        	$.mobile.changePage('jifen-giftList.html');
        } else {
        	$.mobile.changePage('jifen-orderList.html');
        }
    } else if (responseCode[0].results == "08") {
        //核心联查
        icustomerInfoServiceFun(sendJson, function (msg) {
            jifenCustomerInfoSucc(sendJson, msg);
        }, function (err) {
            funFail(err);
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun: function () {
                    $.mobile.changePage('jifen-readingID.html', {reverse: true});
                }
            }
        });
    }
}

//获取订单列表
function getOrderList(page){
	showLoader('订单查询中...');
	var sendJson = {
        "b": [{
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "deviceNo.s": commonJson.udId, //设备编号
            "moduleId.s": jifenJson.moduleId, //模块编号
            "tranId.s": jifenJson.tranId, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "orgId.s": commonJson.orgId,
            "CON_NO.s": jifenJson.CLIENT_NO, //客户号
            "CLIENT_NAME.s": custermerInfo.name, //客户姓名
            "DOCUMENT_TYPE.s": "0", //证件类型
            "DOCUMENT_ID.s": custermerInfo.cerNO, //证件号
            "ACCT_NO.s": "",	//帐卡号
            "CLIENT_KIND.s": "0",
            "IF_ZIQU.s": "1",	//领取方式
            "page.s": page + ''	//页数
        }]
    };
    //获取订单列表
    getClientOrderListFun(sendJson, function (msg) {
        hideLoader();
	    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	    var responseObj = JSON.parse(msg);
	    var responseCode = responseObj.b;
	    if (responseCode[0].results == "00") {
	    	$("#orderList").empty();
	    	$('.footter .btn_next').removeClass('btn_next');
	    	//展示订单列表
	        $.each(responseCode[1].orderInquiryVO[1].mo, function (index, data) {
	        	var liObj = $('<li>').attr('class', 'box-rows');
	        	var NEED_POINT = data.orderInfo[0].NEED_POINT;
	        	if(NEED_POINT != undefined && NEED_POINT != null && NEED_POINT != ''){
	        		data.orderInfo[0].NEED_POINT = parseInt(NEED_POINT);
	        	}
	        	liObj.attr('data', JSON.stringify(data.orderInfo[0]));
	        	liObj.append($('<div>').html(dateToYMDhms(data.orderInfo[0].ORDER_TIME)));
	        	liObj.append($('<div>').html(data.orderInfo[0].ORD_CODE));
	        	liObj.append($('<div>').html(data.orderInfo[0].CARD_CODE));
	        	liObj.append($('<div>').html(data.orderInfo[0].GF_NAME));
	        	liObj.append($('<div>').html(data.orderInfo[0].GF_NUMBER));
	        	liObj.append($('<div>').html(data.orderInfo[0].NEED_POINT));
	        	liObj.append($('<div>').html(orderStatus[data.orderInfo[0].ORD_STATE]));
	        	$("#orderList").append(liObj);
	        });
	        page = parseInt(page);
	        if(page == 1){
	        	$('#pre_btn').removeClass('page-number-bgcolor');
	    		$('#next_btn').addClass('page-number-bgcolor');
	        } else {
	        	$('#pre_btn').addClass('page-number-bgcolor');
	    		$('#next_btn').addClass('page-number-bgcolor');
	        }
	        if(responseCode[1].orderInquiryVO[1].mo.length != 7){
	        	$('#next_btn').removeClass('page-number-bgcolor');
	        }
	        $('#page').html(page);
	    } else if (responseCode[0].results == "08") {
		    //获取订单列表
		    getOrderList(page);
	    } else if (responseCode[0].results == "03") {
	    	if($('#orderList').html() == ''){
				$("#jifen-orderList .page-number-con").hide();
				$("#orderList").html('<li style="text-align:center">' + responseCode[0].message + '</li>');
	    	} else {
	    		$('#next_btn').removeClass('page-number-bgcolor');
	    		showTags({
			        'title': '提示',
			        'content': '已为最后一页！',
			        'ok': {
			            fun: function () {}
			        }
			    });
	    	}
		} else {
	        showTags({
	            'title': '提示',
	            'content': responseCode[0].message,
	            'ok': {
	                fun: function () {
	                    $.mobile.changePage('jifen-readingID.html', {reverse: true});
	                }
	            }
	        });
	    }
    }, function (err) {
    	hideLoader();
    	showTags({
            'title': '提示',
            'content': '系统超时，是否继续？',
            'ok': {
            	'title': '放弃',
                'fun': function() {
                	$.mobile.changePage('jifen-readingID.html', {reverse: true});
                }
            }, 'cancel': {
				'title': '继续',
				'fun': function() {
					getOrderList(page);
				}
			}
        });
    });
}

/*提交订单操作*/
function orderOperateSubmitFun(){
	showLoader('信息提交中...');
	var sendJson = {
		"b": [{
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"orgId.s": commonJson.orgId, //机构号
			"moduleId.s": jifenJson.moduleId, //模块编号
			"tranId.s": jifenJson.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员
			"deviceNo.s": commonJson.udId, //设备编号
			"CLIENT_NAME.s": custermerInfo.name, //客户名称
			"DOCUMENT_TYPE.s": "0", //证件类型
			"DOCUMENT_ID.s": custermerInfo.cerNO, //证件号码
			"ORD_CODE.s": orderInfo.ORD_CODE, //订单编号
			"OPERATE_TYPE.s": orderInfo.OPERATE, //操作类型 1-确认收货 2-取消订单 3-礼品退货
			"REASON.s": (orderInfo.OPERATE == '2'?orderInfo.REASON : ''), //取消订单原因
			"ORD_STATE.s": orderInfo.ORD_STATE, //订单状态
			"FILE_COUNT.s": '1',//文件上传数量
			"BussinessCode.s": '01', //身份证联网核查业务编号
			"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
			"platGlobalSeq.s": jifenJson.platGlobalSeq, //副流水号
			"longitude.s": commonJson.longitude, //经度
			"latitude.s": commonJson.latitude //纬度
		}]
	};
	orderOperateFun(sendJson, function(msg){
		hideLoader();
	    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	    var responseObj = JSON.parse(msg);
	    var responseCode = responseObj.b;
	    if(responseCode[0].results == '00'){
	    	// if(!jifenJson.isUploadFile){
	     //        jifenJson.isUploadFile = true;
	    	// 	saveAndUploadSignFileInfo(jifenJson, '1', 'J001');
	    	// }
	    	changeUploadStatus("02", jifenJson.orderSignTime);
	    	$.mobile.changePage('jifen-orderComplete.html');
	    } else if(responseCode[0].results == '08'){
	    	hideLoader();
    		orderOperateSubmitFun();
	    } else if (responseCode[0].results == "09") {
	    	// if(!jifenJson.isUploadFile){
      //   		jifenJson.isUploadFile = true;
      //   		saveAndUploadSignFileInfo(jifenJson, '1', 'J001');
      //   	}
      		changeUploadStatus("02", jifenJson.orderSignTime);
        	showTags({
	            'title': '提示',
	            'content': '业务处理超时！',
	            'ok': {
	                'title': '继续处理',
	                fun: function () {
	                	hideLoader();
	                	$.mobile.changePage('jifen-orderList.html');
	                }
	            }
	        });
        } else {
        	changeUploadStatus("03", jifenJson.orderSignTime);
	        showTags({
	            'title': '提示',
	            'content': responseCode[0].message,
	            'ok': {
	                fun: function () {
	                    $.mobile.changePage('../main.html');
	                }
	            }
	        });
	    }
	}, function(err) {
		hideLoader();
        $('#jifen-orderConfirm #order_submit').removeClass('btn_next');
      //   if(!jifenJson.isUploadFile){
    		// jifenJson.isUploadFile = true;
      //   	saveAndUploadSignFileInfo(jifenJson, '1', 'J001');
      //   }
      	changeUploadStatus("02", jifenJson.orderSignTime);
        showTags({
            'title': '提示',
            'content': '业务处理超时！',
            'ok': {
                'title': '继续处理',
                fun: function () {
                    $.mobile.changePage('jifen-orderList.html');
                }
            }
        });
	});
}

//订单提交-签名图像压缩插库
function rewardSignUpload(){
	showLoader("影像压缩中...");
    var orderSignTime = myTime.CurTime();
    jifenJson.orderSignTime = orderSignTime;
    //签名base64转路径
    Meap.transFormImage(jifenJson.platGlobalSeq + 'sign', jifenJson.data, 'picSty', function (msg) {
        //将要上传的签名插入到ios断点上传的数据库中
        //签名上传 业务参数
        var appBus = {
            'busiGloablaSeq': jifenJson.platGlobalSeq,//业务编号
            'attchType': '1',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': commonJson.udId,//设备编号
            'moduleId': jifenJson.moduleId,//模块编号
            'tranId': jifenJson.tranId,//交易编号
            'orgId': commonJson.orgId,//机构编号
            'operatorNo': commonJson.adminCount,//操作员
            'custName': custermerInfo.name,//客户名称
            'custCredType': '0',//客户证件类型
            'custCredNo': custermerInfo.cerNO,//客户证件号
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress//工作地址
        };
        appBus = JSON.stringify(appBus);
        var sendDataJson = {
            'databaseName': 'myDatabase',
            'tableName': 'up_download_info',
            'data': [{
                'fileToken': orderSignTime,//文件唯一ID(可以为时间挫
                'pos': '0',//文件的断点信息(初始为0)
                'filePath': msg,//文件路径
                'appPath': 'J001',//自定义文件路径
                'appBuss': appBus,//业务参数
                'downloadToken': '',//文件的下载ID(初始为空)
                'leng': '1',//文件的长度(初始为1)
                'isNotice': 'yes', //是否调用后台(一直是yes)
                "fileType":"1",
                "REMARK1": "01" //上传状态01-默认
            }]
        };
        insertTableData(sendDataJson, function (msg) {
        	hideLoader();
            orderOperateSubmitFun();
        }, function (err) {
        	hideLoader();
            showTags({
                'title': '提示',
                'content': '数据库读写失败，请联系技术人员',
                'ok': {}
            });
        });
    }, function (err) {
    	hideLoader();
        showTags({
            'title': '提示',
            'content': '签名转换失败',
            'ok': {}
        });
    });
}

/*获取积分明细 成功回调*/
function getIntegralDetailSucc(sendJson, msg){
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == "00") {
    	var vo = responseCode[1].integralDetailInquiryVO;
    	var myPoint = parseInt(vo[0].mo[0].integralInfo[0].POINT);
    	$('#clientName').html(custermerInfo.name);
    	$('#integralTotal').html(myPoint);
    	$('#maturityIntegral').html(parseInt(responseCode[0].maturityIntegral));
    	$('#detailWindow #detailIntegral').html(myPoint);
    	$('#giftSearchBox #maxPointInput').val(myPoint);
    	searchJson.maxPoint = myPoint + '';
    	if(vo[1].mo1[0] != undefined && vo[1].mo1[0].integralInfo != undefined){
	    	$.each(vo[1].mo1, function (index, data) {
	    		if(data.integralInfo == undefined){
	    			return;
	    		} else {
	    			data = data.integralInfo[0];
	    		}
	    		var ul = $('<ul>');
	    		ul.append($('<li>').html(index + 1));
	    		ul.append($('<li>').html(data.ACTIVE_DATE));
	    		ul.append($('<li>').html(parseInt(data.POINT)));
				$('#detailWindow #detailList').append(ul);
	    	});
    	}
    	jifenJson.POINT = myPoint;
    	getGiftList(responseCode);
    } else if (responseCode[0].results == "08") {
	    //获取积分明细
	    getIntegralDetailFun(sendJson, function (msg) {
	        getIntegralDetailSucc(sendJson, msg);
	    }, function (err) {
	        funFail(err);
	    });
    } else {
    	hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun: function () {
                    $.mobile.changePage('jifen-readingID.html', {reverse: true});
                }
            }
        });
    }
}

//获取礼品列表
function getGiftList(body){
	var arrayObj = new Array();
	var giftList = {};
	var i = 0;
	$.each(body, function(index, data) {
		if(data.giftVO == undefined && data.giftListVO == undefined){
			return;
		}
		if(data.giftVO != undefined){
			data = data.giftVO[0];
		} else {
			data = data.giftListVO[0];
		}
		i++;
		arrayObj.push(data.GF_ID);
		giftList[data.GF_ID] = data;
		if(index + 1 == body.length){
			if(i < 10){
				hasMore = false;
			} else {
				hasMore = true;
			}
			var sql = "select * from gift_info where GF_ID in (" + arrayObj.join(',') + ")";
			executeSqlString(sql, 'exe', function(list){
				if(list != ''){
					for(var j = 0; j < list.length; j++){
						giftList[list[j].GF_ID].GF_SHOWIND = list[j].GF_SHOWIND;
						giftList[list[j].GF_ID].GF_IMAGE = list[j].GF_IMAGE;
						giftList[list[j].GF_ID].GF_DESC = list[j].GF_DESC;
						giftList[list[j].GF_ID].GF_DETAIL = list[j].GF_DETAIL;
					}
					for(var j = 0; j < arrayObj.length; j++){
						if(giftList[arrayObj[j]].GF_SHOWIND != undefined && giftList[arrayObj[j]].GF_SHOWIND != ''){
							arrayObj.splice(j, 1);
							j--;
						}
					}
				}
				if(arrayObj != ''){
					var sendJson = {
				        "b": [{
				            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
				            "workAddress.s": commonJson.workAddress,//工作地址
				            "moduleId.s": jifenJson.moduleId, //模块编号 4
				            "tranId.s": jifenJson.tranId, //交易编号   2
				            "operatorNo.s": commonJson.adminCount, //操作员  admin
				            "deviceNo.s": commonJson.udId, //设备编号       ""
				            "orgId.s": commonJson.orgId,
				            "CLIENT_NAME.s": custermerInfo.name, //客户姓名
				            "DOCUMENT_TYPE.s": "0", //证件类型
				            "DOCUMENT_ID.s": custermerInfo.cerNO, //证件号
				            "code.s": arrayObj.join(',')
				        }]
				    };
					getGiftExpListFun(sendJson, function(msg){
						msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
					    var responseObj = JSON.parse(msg);
					    var responseCode = responseObj.b;
					    if (responseCode[0].results == "00") {
					    	$.each(responseCode, function(index, exp){
					    		if(exp.giftExpVO == undefined){
									return;
								} else {
									exp = exp.giftExpVO[0];
								}
					    		for(var key in exp){
					    			giftList[exp.GF_ID][key] = exp[key];
					    		}
					    		insertTableData({
									"databaseName": "myDatabase",
									"tableName": "gift_info",
									"data": [{
										"GF_ID": exp.GF_ID,
										"GF_SHOWIND": exp.GF_SHOWIND,
										"GF_IMAGE": exp.GF_IMAGE,
										"GF_DESC": exp.GF_DESC.replace(/'/g, "&#39;"),
										"GF_DETAIL": exp.GF_DETAIL.replace(/'/g, "&#39;"),
										"UPDATE_TIME": exp.UPDATE_TIME
									}]
								});
					    	});
					    	showGiftList(giftList);
					    } else if (responseCode[0].results == "03") {
					    	showGiftList(giftList);
					    } else if (responseCode[0].results == "08") {
						    getGiftList(body);
						    return;
					    } else {
					    	hideLoader();
					        showTags({
					            'title': '提示',
					            'content': responseCode[0].message,
					            'ok': {
					                fun: function () {
					                    $.mobile.changePage('jifen-readingID.html', {reverse: true});
					                }
					            }
					        });
					    }
					}, function (err) {
				        funFail(err);
				    });
				} else {
					showGiftList(giftList);
				}
			}, function(err) {
				hideLoader();
				funDataFail(err);
			});
		}
	});
	if(i == 0){
		hideLoader();
		$('#loadMore span').html('[MA0003]没有查到符合条件的数据！').css({
			'background-image': '', 
			'padding-left': '15px',
			'margin-left': '-100px'
		});
	    $('#loadMore').show();
	}
}

//礼品列表展示
function showGiftList(giftList){
	hideLoader();
	$.each(giftList, function(index, data){
		data.NEED_POINT1 = parseInt(data.NEED_POINT1);
		var div = $('<div>').addClass('swiper-slide gift_box');
		div.append($('<img>').addClass('gift_img').attr('src', 'data:image/png;base64,' + data.GF_IMAGE));
		div.append($('<div>').addClass('gift_border')
	    	.append($('<div>').addClass('gift_content').attr('data', JSON.stringify(data))
	    	.append($('<div>').addClass('gift_need_point').append($('<span>').html(data.NEED_POINT1)).append('积分'))
			.append($('<div>').attr('name', 'exchangeBtn').addClass(jifenJson.POINT < data.NEED_POINT1 ? 'gift_unexchange' : 'gift_register').html('兑换'))
			.append($('<div>').attr('name', 'detailBtn').addClass('gift_register').html('详情'))
			.append($('<p>').addClass('gift_title').html(data.GF_NAME))
			.append($('<textarea>').attr('readonly', true).addClass('gift_Info').addClass('swiper-no-swiping').html(data.GF_DESC))));
		$('#giftList #loadMore').before(div);
	});
	$('#giftList textarea').css('height', '80px');
	if(giftListSwiper == undefined){
		giftListSwiper = new Swiper('#giftList', {
	        paginationClickable: true,
	        slidesPerView: 3,
	        direction: 'vertical',
	    	onTouchMove: function(swiper){
	    		if($('#giftList .gift_box').length < 3){
	    			return;
	    		}
	    		if(hasMore){
		        	var sl = ($('#giftList .gift_box').length - 2) * -169 + 50;
					if(swiper.translate < sl && giftListSwiper.isEnd){
						$('#loadMore span').html('释放立即刷新').css({
							'background-image': "url('../../images/dropDown2.png')", 
							'padding-left': '15px',
							'margin-left': '0px'
						});
		        	} else {
		        		$('#loadMore span').html('下拉可以刷新').css({
		        			'background-image': "url('../../images/dropDown1.png')",
		        			'padding-left': '15px',
		        			'margin-left': '0px'
		        		});
		        	}
		        	$('#loadMore').show();
	    		} else {
	    			$('#loadMore span').html('已无更多数据加载！').css({
	    				'background-image': '', 
	    				'padding-left': '0px',
	    				'margin-left': '0px'
	    			});
	    			$('#loadMore').show();
	    		}
	        },
	        onTouchEnd: function(swiper){
	        	if(!hasMore){
	        		return;
	        	}
	        	var sl = ($('#giftList .gift_box').length - 2) * -169 + 50;
				if(swiper.translate < sl && giftListSwiper.isEnd){
					getMoreGiftList();
			    }
	    	}
	    });
	} else {
		giftListSwiper.update();
	}
}

//加载更多礼品
function getMoreGiftList(){
	showLoader('加载更多礼品信息中..');
	var sendJson = {
        "b": [{
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "moduleId.s": jifenJson.moduleId, //模块编号 4
            "tranId.s": jifenJson.tranId, //交易编号   2
            "operatorNo.s": commonJson.adminCount, //操作员  admin
            "deviceNo.s": commonJson.udId, //设备编号       ""
            "orgId.s": commonJson.orgId,
            "CLIENT_NAME.s": custermerInfo.name, //客户姓名
            "DOCUMENT_TYPE.s": "0", //证件类型
            "DOCUMENT_ID.s": custermerInfo.cerNO, //证件号
			"END_MONTH.s": "",
            "superOrgId.s": commonJson.superOrgId, //上级机构号
            'minPoint.s': searchJson.minPoint, //最小积分
            'maxPoint.s': searchJson.maxPoint, //最大积分
            'order.s': searchJson.order, //排序方式
            "page.s": ++page + ""
        }]
    };
	getGiftListFun(sendJson, function(msg){
		$('#loadMore').hide();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	    var responseObj = JSON.parse(msg);
	    var responseCode = responseObj.b;
	    if (responseCode[0].results == "00") {
	    	getGiftList(responseCode);
	    } else if (responseCode[0].results == "08") {
	    	page--;
	    	getMoreGiftList();
	    } else if (responseCode[0].results == "03") {
	    	hideLoader();
	    	hasMore = false;
	    } else {
	    	hideLoader();
	        showTags({
	            'title': '提示',
	            'content': responseCode[0].message,
	            'ok': {
	                fun: function () {
	                    $.mobile.changePage('jifen-readingID.html', {reverse: true});
	                }
	            }
	        });
	    }
	}, function (err) {
		page--;
        funFail(err);
    });
}

/*积分人面对比 成功回调*/
function IFacelRecognitionServiceJifenSucc(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '0') {
        $('#jifen-personFace .previous:last').addClass('btn_next');
        jifenJson.platGlobalSeqP = responseCode[0].platGlobalSeq; //流水号
        jifenJson.cardResult = responseCode[1].photoCompareVO[0].CARD_RESULT; //联网核查结果
        jifenJson.chipResult = responseCode[1].photoCompareVO[0].CHIP_RESULT; //芯片结果
        if (responseCode[1].photoCompareVO[0].CHIP_RESULT == "0") { //芯片通过
            $("#jifen-personFace .face-result:eq(0)").text('通过');
        } else {
            $("#jifen-personFace .face-result:eq(0)").addClass('no-pass').text('未通过');
        }
        if (responseCode[1].photoCompareVO[0].CARD_RESULT == "0") { //联网核查通过
            $("#jifen-personFace .face-result:eq(1)").text('通过');
        } else {
            $("#jifen-personFace .face-result:eq(1)").addClass('no-pass').text('未通过');
        }
        if (responseCode[1].photoCompareVO[0].CHIP_RESULT == "0" && responseCode[1].photoCompareVO[0].CARD_RESULT == "0") {
            jifenJson.isTelCheck = true; //远程复核成功
            jifenJson.faceRecogn = '1'; //自动通过
            $("#jifen-personFace .center-header").text('人脸识别通过！');
            $("#jifen-managerList").hide();
        } else {
            jifenJson.faceRecogn = '2'; //自动不通过
            $("#jifen-personFace .center-header").text('人脸识别未通过！');
            $('#jifen-personFace .previous:last').text('远程复核');
        }
    } else if (responseCode[0].results == '08') {
        //影像两两对比
        hideLoader();
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
    } else {
        jifenJson.faceRecogn = '2'; //自动不通过
        $("#jifen-personFace .face-result").addClass('no-pass').text('未通过');
        $("#jifen-personFace .center-header").text('人脸识别未通过！');
        $('#jifen-personFace .previous:last').addClass('btn_next');
        $('#jifen-personFace .previous:last').text('远程复核');
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}

/*远程复核获取客户经理列表*/
function ISysUserServiceManListJifenSucc(msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
        var textHtml = '<option></option>';
        //onlineFlag
        $.each(responseCode[1].TsReviewerVOs, function (index, data) {
            //if(index == 0) return;
            if (data.sysUserVO[0].onlineFlag != "1") return;
            textHtml += '<option realName="' + data.sysUserVO[0].realName + '" cellPhone="' + data.sysUserVO[0].cellPhone + '" value="' + data.sysUserVO[0].userId + '">' + data.sysUserVO[0].userId + data.sysUserVO[0].realName + '</option>';
        });
        $('#jifen-managerList select').html(textHtml).selectmenu('refresh');
    } else if (responseCode[0].results == '08') {
        $('#jifen-managerList select').html('<option></option>').selectmenu('refresh');
    }
    else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
        $('#jifen-managerList select').html('<option></option>').selectmenu('refresh');
    }
}

/*积分远程复核请求  成功回调*/
function iissuesServiceJifenSucc(msg) {
    //hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00' || responseCode[0].results == '66') {
        jifenJson.tsReviewId = responseCode[0].tsReviewId;
        $(".ui-loader").append('<div id="loaderCancel" style="width:300px; height:40px; line-height:40px; text-align:center; border:1px solid #FFFFFF; position:absolute; bottom:220px; left:50%; margin-left:-150px;color: #FFFFFF;">放弃<span id="time-daojishi"></span></div>');
        var timeout = new Timeout('loaderCancel', 15);
        timeout.blocking('time-daojishi');//spanid:延迟过程中显示ID
        localStorage.intervalID = timeout.getIntervalID();
        $("#loaderCancel").off('click').on('click', function () {
            jifenJson.telCheck = false;
            hideLoader();
            var badSendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "orgId.s": commonJson.orgId,//机构号
                    "moduleId.s": jifenJson.moduleId,//模块编号
                    "tranId.s": jifenJson.tranId,//交易编号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "deviceNo.s": commonJson.udId,//设备编号
                    "tsReviewId.s": jifenJson.tsReviewId
                }]
            };
            iphotoServiceStopFun(badSendJson, function (msg) {

            }, function (err) {

            });
            setTimeout(function () {
                hideLoader();
            }, 3500)
        });
        var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId,//设备编号
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "orgId.s": commonJson.orgId,//机构号
                "moduleId.s": jifenJson.moduleId,//模块编号
                "tranId.s": jifenJson.tranId,//交易编号
                "operatorNo.s": commonJson.adminCount,//操作员
                "tsReviewId.s": jifenJson.tsReviewId,
                "userIds.s": $('#jifen-managerList select').val()  //用户ID
            }]
        };
        getTsRevieweleSignFun(sendJson, function (msg) {
            getTsReviewJifenSucc(msg);
        }, function (err) {
            funFail(err);
        })
    } else {
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}

/*远程复核查询  成功回调*/
function getTsReviewJifenSucc(msg) {
    //hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (jifenJson.telCheck == false) return;
    if (responseCode[0].results == '00') {
        if (responseCode[0].status == '5') {
            hideLoader();
            showTags({
                'title': '提示',
                'content': '远程复核通过！',
                'ok': {
                    fun: function () {
                        jifenJson.isTelCheck = true; //远程复核成功
                        jifenJson.faceRecogn = '3';
                        $.mobile.changePage('jifen-giftExchange.html');
                        lianwanghechaData.ReviewUserId = $('#jifen-managerList select').val();
                    }
                }
            });
            clearInterval(localStorage.intervalID);
        } else if (responseCode[0].status == '2' || responseCode[0].status == '3') {
            setTimeout(function () {
                var sendJson = {
                    "b": [{
                        "deviceNo.s": commonJson.udId,//设备编号
                        "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                        "workAddress.s": commonJson.workAddress,//工作地址
                        "orgId.s": commonJson.orgId,//机构号
                        "moduleId.s": jifenJson.moduleId,//模块编号
                        "tranId.s": jifenJson.tranId,//交易编号
                        "operatorNo.s": commonJson.adminCount,//操作员
                        "tsReviewId.s": jifenJson.tsReviewId,
                        "userIds.s": $('#jifen-managerList select').val()  //用户ID
                    }]
                };
                getTsRevieweleSignFun(sendJson, function (msg) {
                    getTsReviewJifenSucc(msg);
                }, function (err) {
                    funFail(err);
                });
            }, 5000);

        } else {
            hideLoader();
            jifenJson.faceRecogn = '4'; //远程复核不通过
            showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {}
            });
            clearInterval(localStorage.intervalID);
        }
    }
    else {
        hideLoader();
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {}
        });
    }
}

/*积分 获取短信验证码 成功回调*/
function imessageAuthentionServiceJifenSucc(sendJson, msg) {
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
        jifenJson.MSG_INFO = responseCode[1].messageAuthentionVO[0].MSG_INFO; //获取短信验证码
        jifenJson.USER_NO = responseCode[1].messageAuthentionVO[0].USER_NO; //获取用户唯一标识
        var _ind = 80;
        jifenJson.codeTime = setInterval(function () {
            _ind--;
            $("#jifen-auth-time").text(_ind);
            if (_ind == 0) {
                jifenJson.getYZM = true;
                jifenJson.USER_NO = "";
                $("#getMsg").text('重新获取');
                $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
                clearInterval(jifenJson.codeTime);
            }
        }, 1000);
    } else if (responseCode[0].results == '08') {
    	showLoader('获取中...');
        imessageAuthentionServiceFun(sendJson, function (msg) {
            imessageAuthentionServiceJifenSucc(sendJson, msg);
        }, function (err) {
        	hideLoader();
            jifenJson.getYZM = true;
            $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
            funFail(err);
        });
    } else {
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
            	fun: function(){
            		jifenJson.getYZM = true;
        			$('#getMsg').addClass('disMsg').removeClass('disgua-btn');
            	}
            }
        });
    }
}

/*积分 验证短信验证码 成功回调*/
function jifenImessageAuthentionServiceYSucc(sendJson, msg) {
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if (responseCode[0].results == '00') {
    	jifenJson.USER_NO = "";
        if (jifenJson.platGlobalSeq != undefined && jifenJson.platGlobalSeq != null && jifenJson.platGlobalSeq != '') {
            hideLoader();
            rewardImgUpload(function(){
            	submitExchangeGiftInfo();
            });
        } else {
            getPlatGlobalSeq(jifenJson, function () {
            	rewardImgUpload(function(){
                	submitExchangeGiftInfo();
            	});
            });
        }
    } else if (responseCode[0].results == '08') {
        hideLoader();
        showLoader("短信验证码验证中...");
        imessageAuthentionServiceYFun(sendJson, function (msg) {
            jifenImessageAuthentionServiceYSucc(sendJson, msg);
        }, function (err) {
        	jifenJson.USER_NO = "";
            funFail(err);
        });
    } else {
        hideLoader();
    	jifenJson.USER_NO = "";
        showTags({
            'title': '提示',
            'content': responseCode[0].message,
            'ok': {
                fun: function () {
                    $('#jifen-giftConfirm #inp').val('');
                }
            }
        });
    }
}

/*提交兑换礼品信息*/
function submitExchangeGiftInfo(){
	showLoader('礼品兑换中...');
	var sendJson = {
        "b": [{
        	"faceRecogn.s": jifenJson.faceRecogn, //人脸识别
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
            "PHONE_NO.s": jifenJson.mobilePhone, //手机号
            "LOCAL_GF_ID.s": giftInfo.GF_ID, //礼品编号
            "GIFT_NAME.s": giftInfo.GF_NAME, //礼品名称	
            "PURSE_PROCESS_TYPE.s": "1", //账户类型
            "ACCT_NO.s": giftInfo.ACCT_NO, //账卡号
            "CON_NO.s": jifenJson.CLIENT_NO, //客户号
            "GF_NUMBER.s": giftInfo.EXCHANGE_NUM, //兑换数量
            "NEED_POINT.s": giftInfo.NEED_POINT, //消费积分
            "OVER_POINT.s": giftInfo.OVER_POINT, //剩余积分
            "RECEIVE_ORG.s": giftInfo.RECEIVE_ORG, //领取支行
            "OPERATE_TYPE.s": giftInfo.OPERATE_TYPE, //操作类型 1-现场领取 2-预约领取
			"fileData.s": jifenJson.data, //签名文件base64数据
			"FILE_COUNT.s": '2',//文件上传数量
            "BussinessCode.s": '01', //身份证联网核查业务编号
			"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
			"ReviewUserId.s": lianwanghechaData.ReviewUserId, //远程复核用户ID
            "platGlobalSeq.s": jifenJson.platGlobalSeq, //副流水号
            "longitude.s": commonJson.longitude, //经度
			"latitude.s": commonJson.latitude //纬度
        }]
    };
    exchangeGiftFun(sendJson, function(msg){
    	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	    var responseObj = JSON.parse(msg);
	    var responseCode = responseObj.b;
	    if (responseCode[0].results == '00' || responseCode[0].results == '13') {
	    	jifenJson.qrCode = responseCode[0].pdfUrl;
	    	giftInfo.ORDER_ID = responseCode[0].ORD_CODE;
	    	if(lianwanghechaData.CheckResult != "09"){
	            saveCustermerAndPhotoIno('积分兑换');
	        }
	  //   	if(!jifenJson.isUploadFile){
   //      		jifenJson.isUploadFile = true;
		 //    	saveAndUploadSignFileInfo(jifenJson, '1', 'J001');
			// 	saveAndUploadPhotoFileInfo(jifenJson, '2', 'J002'); 
			// }
			changeUploadStatus("02", jifenJson.phoneTime, jifenJson.signTime);
	      	if (responseCode[0].results == '13') {//业务处理成功后台报错弹窗
	            hideLoader();
	            showTags({
	                'title': '提示',
	                'content': responseCode[0].message,
	                'ok': {
	                    fun: function () {
	                        $.mobile.changePage('./jifen-giftComplete.html');
	                    }
	                }
	            });
	        } else {
	            hideLoader();
	            $.mobile.changePage('./jifen-giftComplete.html');
	        }
	    } else if (responseCode[0].results == '08') {
	    	hideLoader();
	        submitExchangeGiftInfo();
	    } else if (responseCode[0].results == "09") {
	        hideLoader();
	        showTags({
	            'title': '提示',
	            'content': '业务处理超时！',
	            'ok': {
	                'title': '继续处理',
	                fun: function () {
				    	submitExchangeGiftInfo();
	                }
	            }
	        });
	    } else {
	    	hideLoader();
	    	changeUploadStatus("03", jifenJson.phoneTime, jifenJson.signTime);
	        showTags({
	            'title': '提示',
	            'content': responseCode[0].message,
	            'ok': {
	                fun: function () {
	                	if(responseCode[0].message.indexOf('[9003]') >= 0){
	                		$('#gift_submit').removeClass('btn_next');
	                		return;
	                	}
	                	$.mobile.changePage('jifen-readingID.html', {
							reverse: true
						});
	                }
	            }
	        });
	    }
    }, function(err){
    	hideLoader();
    	$('#jifen-giftConfirm #gift_submit').removeClass('btn_next');
    	showTags({
			'title': '提示',
			'content': '业务处理超时！',
			'ok': {
				title: '继续处理',
				fun: function() {
			    	submitExchangeGiftInfo();
				}
			}
		});
    });
}

/*积分获取有效凭证成功回调*/
function getDocLicenceListJifenSucc(sendJson, msg){
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseBody = responseObj.b;
    if (responseBody[0].results == '00') {
    	jifenJson.cardList = new Array();
    	$.each(responseBody, function (index, val) {
            if (index == 0) return;
            if (val.docLicenceVO[0].ISSUE_ACCT_NO != '') {
                $('#ACCT_NO').append($('<option>').html(val.docLicenceVO[0].ISSUE_ACCT_NO));
            	jifenJson.cardList.push(val.docLicenceVO[0].ISSUE_ACCT_NO);
            }
        });
        $('#ACCT_NO').selectmenu("refresh", true);
    } else if (responseBody[0].results == '08') {
	    showLoader('账卡号查询中..');
	    getDocLicenceListBankFun(sendJson, function (msg) {
	        getDocLicenceListJifenSucc(sendJson, msg);
	    }, function (err) {
	    	$('#next_btn').removeClass('btn_next');
	        funFail(err);
	    });
    } else {
        showTags({
            'title': '提示',
            'content': responseBody[0].message,
            'ok': {
            	fun: function () {
//                  $.mobile.changePage('jifen-readingID.html', {reverse: true});
					$('#next_btn').removeClass('btn_next');
                }
            }
        });
    }
}

//筛选礼品信息查询
function searchGiftList(){
	showLoader('礼品信息查询中..');
	var sendJson = {
        "b": [{
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "moduleId.s": jifenJson.moduleId, //模块编号 4
            "tranId.s": jifenJson.tranId, //交易编号   2
            "operatorNo.s": commonJson.adminCount, //操作员  admin
            "deviceNo.s": commonJson.udId, //设备编号       ""
            "orgId.s": commonJson.orgId,
            "CLIENT_NAME.s": custermerInfo.name, //客户姓名
            "DOCUMENT_TYPE.s": "0", //证件类型
            "DOCUMENT_ID.s": custermerInfo.cerNO, //证件号
			"END_MONTH.s": "",
            "superOrgId.s": commonJson.superOrgId, //上级机构号
            'minPoint.s': searchJson.minPoint, //最小积分
            'maxPoint.s': searchJson.maxPoint, //最大积分
            'order.s': searchJson.order, //排序方式
            "page.s": page + ""
        }]
    };
	getGiftListFun(sendJson, function(msg){
		$('#loadMore').hide();
		$('#giftList .swiper-slide').remove();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	    var responseObj = JSON.parse(msg);
	    var responseCode = responseObj.b;
	    if (responseCode[0].results == "00") {
	    	getGiftList(responseCode);
	    	if(giftListSwiper){
				giftListSwiper.update();
				giftListSwiper.slideTo(0, 0, false);
			}
	    } else if (responseCode[0].results == "08") {
	    	hideLoader();
		    searchGiftList();
	    } else if (responseCode[0].results == "03") {
	    	hideLoader();
	    	$('#loadMore span').html(responseCode[0].message).css({
				'background-image': '', 
				'padding-left': '15px',
				'margin-left': '-100px'
			});
		    $('#loadMore').show();
	    } else {
	    	hideLoader();
	        showTags({
	            'title': '提示',
	            'content': responseCode[0].message,
	            'ok': {
	                fun: function () {
	                    $.mobile.changePage('jifen-readingID.html', {reverse: true});
	                }
	            }
	        });
	    }
	}, function (err) {
        funFail(err);
    });
}

//获取人气礼品列表
function getPopularityGiftList(){
	showLoader('人气礼品查询中..');
	var sendJson = {
        "b": [{
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "moduleId.s": jifenJson.moduleId, //模块编号 4
            "tranId.s": jifenJson.tranId, //交易编号   2
            "operatorNo.s": commonJson.adminCount, //操作员  admin
            "deviceNo.s": commonJson.udId, //设备编号       ""
            "orgId.s": commonJson.orgId,
            "CLIENT_NAME.s": custermerInfo.name, //客户姓名
            "DOCUMENT_TYPE.s": "0", //证件类型
            "DOCUMENT_ID.s": custermerInfo.cerNO, //证件号
            "CON_NO.s": jifenJson.CLIENT_NO,	//客户号
			"PURSE_PROCESS_TYPE.s": "1",
            "GIFT_TYPE.s": "1",
            "CLIENT_KIND.s": "0",
            "page.s": page + ""
        }]
    };
	getPopularityGiftFun(sendJson, function(msg){
		$('#loadMore').hide();
		$('#giftList .swiper-slide').remove();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	    var responseObj = JSON.parse(msg);
	    var responseCode = responseObj.b;
	    if (responseCode[0].results == "00") {
	    	getGiftList(responseCode);
	    	if(giftListSwiper){
				giftListSwiper.update();
				giftListSwiper.slideTo(0, 0, false);
			}
	    } else if (responseCode[0].results == "08") {
	    	hideLoader();
		    getPopularityGiftList();
	    } else if (responseCode[0].results == "03") {
	    	hideLoader();
	    	$('#loadMore span').html(responseCode[0].message).css({
				'background-image': '', 
				'padding-left': '15px',
				'margin-left': '-100px'
			});
		    $('#loadMore').show();
	    } else {
	    	hideLoader();
	        showTags({
	            'title': '提示',
	            'content': responseCode[0].message,
	            'ok': {
	                fun: function () {
	                    $.mobile.changePage('jifen-readingID.html', {reverse: true});
	                }
	            }
	        });
	    }
	}, function (err) {
        funFail(err);
    });
}

//兑换礼品-影像签名压缩入库
//callback - 插入数据库完成后触发的回调方法
function rewardImgUpload(callback){
	showLoader("影像压缩中...");
	// 事件发布执行回调方法前，取订事件，避免重复发布
    var ussbCallback = function(){
        topicUtil.unsubscribe("jifen/rewardImgUpload");
        hideLoader();
        callback();
    };
    topicUtil.subscribe("jifen/rewardImgUpload", ussbCallback);
    var compressCount = 0;  //压缩成功次数,为2时完成压缩
    var phoneTime = myTime.CurTime();
    var signTime = phoneTime + 1;
    jifenJson.phoneTime = phoneTime;
    jifenJson.signTime = signTime;
    //保存并上传影像文件信息
    Meap.zipCompression(jifenJson.platGlobalSeq + 'image', jifenJson.picFileARR, function (msg) {
        //将要上传的影像插入到ios断点上传的数据库中
        //影像上传 业务参数
        var appBus = {
            'busiGloablaSeq': jifenJson.platGlobalSeq,//业务编号
            'attchType': '2',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': commonJson.udId,//设备编号
            'moduleId': jifenJson.moduleId,//模块编号
            'tranId': jifenJson.tranId,//交易编号
            'orgId': commonJson.orgId,//机构编号
            'operatorNo': commonJson.adminCount,//操作员
            'custName': custermerInfo.name,//客户名称
            'custCredType': '0',//客户证件类型
            'custCredNo': custermerInfo.cerNO,//客户证件号
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress//工作地址
        };
        appBus = JSON.stringify(appBus);
        var sendDataJson = {
            "databaseName": "myDatabase",
            "tableName": "up_download_info",
            "data": [{
                "fileToken": phoneTime,//文件唯一ID(可以为时间挫
                "pos": "0",//文件的断点信息(初始为0)
                "filePath": msg,//文件路径
                "appPath": 'J002',//自定义文件路径
                "appBuss": appBus,//业务参数
                "downloadToken": "",//文件的下载ID(初始为空)
                "leng": "1",//文件的长度(初始为1)
                "isNotice": "yes", //是否调用后台(一直是yes)
                "fileType": "0",
                "REMARK1": "01" //上传状态01-默认
            }]
        };
        insertTableData(sendDataJson, function (msg) {
        	if(++compressCount == 2){
                topicUtil.publish("jifen/rewardImgUpload");
            }
        }, function (err) {
        	hideLoader();
            showTags({
                'title': '提示',
                'content': '数据库读写失败，请联系技术人员',
                'ok': {}
            });
        });
    }, function (err) {
    	hideLoader();
		showTags({
            'title': '提示',
            'content': '影像压缩失败',
            'ok': {}
        });
    });	
    //签名base64转路径
    Meap.transFormImage(jifenJson.platGlobalSeq + 'sign', jifenJson.data, 'picSty', function (msg) {
        //将要上传的签名插入到ios断点上传的数据库中
        //签名上传 业务参数
        var appBus = {
            'busiGloablaSeq': jifenJson.platGlobalSeq,//业务编号
            'attchType': '1',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': commonJson.udId,//设备编号
            'moduleId': jifenJson.moduleId,//模块编号
            'tranId': jifenJson.tranId,//交易编号
            'orgId': commonJson.orgId,//机构编号
            'operatorNo': commonJson.adminCount,//操作员
            'custName': custermerInfo.name,//客户名称
            'custCredType': '0',//客户证件类型
            'custCredNo': custermerInfo.cerNO,//客户证件号
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress//工作地址
        };
        appBus = JSON.stringify(appBus);
        var sendDataJson = {
            'databaseName': 'myDatabase',
            'tableName': 'up_download_info',
            'data': [{
                'fileToken': signTime,//文件唯一ID(可以为时间挫
                'pos': '0',//文件的断点信息(初始为0)
                'filePath': msg,//文件路径
                'appPath': 'J001',//自定义文件路径
                'appBuss': appBus,//业务参数
                'downloadToken': '',//文件的下载ID(初始为空)
                'leng': '1',//文件的长度(初始为1)
                'isNotice': 'yes', //是否调用后台(一直是yes)
                "fileType":"1",
                "REMARK1": "01" //上传状态01-默认
            }]
        };
        insertTableData(sendDataJson, function (msg) {
        	if(++compressCount == 2){
                topicUtil.publish("jifen/rewardImgUpload");
            }
        }, function (err) {
        	hideLoader();
            showTags({
                'title': '提示',
                'content': '数据库读写失败，请联系技术人员',
                'ok': {}
            });
        });
    }, function (err) {
    	hideLoader();
        showTags({
            'title': '提示',
            'content': '签名转换失败',
            'ok': {}
        });
    });
}