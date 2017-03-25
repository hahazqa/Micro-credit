$(document).on("pageshow", "#after-login", function() {

	showLoader('加载中...');
	eleSignJson.userSign = '';
	xinyonfkaJson.shijianChuo='2';
	citigoldSortData.BianLiangPanDuan='2';
	commonJson.deviceNo = commonJson.udId;

	function tuojirenyewuSL() { //脱机人脸数量
		//		showLoader('加载中...');
		if(usrStatistic.isSucess == '00'){
			commonJson.tuojiPtLtNum = 0;
			if(usrStatistic.offlineCount != '-1'){
				commonJson.tuojiPtLtNum = parseInt(usrStatistic.offlineCount);
			}else{
				commonJson.tuojiPtLtNum = 0;
			}
			checkUpdateOurBankAndProduct();
		}else if(usrStatistic.isSucess == '99'){
			tuojizancun();
		}else{
			commonJson.tuojiPtLtNum = 0;
		}
		reInitSwiper();
//		var tuojirenyewuSLJson = {
//			"b": [{
//				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
//				"deviceNo.s": commonJson.deviceNo, //设备编号
//				"orgId.s": commonJson.orgId,
//				"moduleId.s": workbenchJson.moduleID, //模块编号
//				"tranId.s": workbenchJson.tranId2, //交易编号
//				"operatorNo.s": commonJson.adminCount, //操作员
//				"workAddress.s": commonJson.workAddress, //工作地址
//				"masCardName.s": "", //客户姓名
//				"certNum.s": "", //证件号
//				"bussType.s": "", //业务类型
//				"stime.s": "", //办理开始时间
//				"etime.s": "", //办理结束时间
//				"handleState.s": "", //业务处理状态
//				"pageSize.s": "",
//				"pageNo.s": ""
//			}]
//		};
//		ptQueryOfflineBussFun(tuojirenyewuSLJson, function(msg) { //脱机人脸数量
//			//			hideLoader();
//			var msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//			var responseObj = JSON.parse(msg);
//			var responseCodeTuo = responseObj.b;
//			//                  var tuojiPtLtNum = 0;
//			if (responseCodeTuo[0].results == "00") {
//				commonJson.tuojiPtLtNum = 0;
//				responseCodeTuo.shift();
//				$.each(responseCodeTuo, function(index, val) {
//					var returnState = val.queryCardOfflineBuffModel[0].HANDLESTATE;
//					if (returnState != '06') return true;
//					//                          tuojiPtLtNum++;
//					commonJson.tuojiPtLtNum++
//				});
//			} else {
//				if (responseCodeTuo[0].results == '03') {
//					commonJson.tuojiPtLtNum = 0;
//				} else if (responseCode[0].results == "08") {
//					hideLoader();
//				} else {
//					showTags({
//						'title': '提示',
//						'content': responseCodeTuo[0].message,
//						'ok': {}
//					});
//				}
//			}
//			checkUpdateOurBankAndProduct();
//		}, function(err) {
//			funFail(err);
//			tuojizancun();
//		});
//		reInitSwiper();
	}

	$(".afterlogin-name").html("");
//	$("#after-head-shuz").html(commonJson.noticeCount);
	if (commonJson.mySex == '1') { //判断头像状态  '1'为男
		$('#after-login .ic_touxiang').attr('src', '../images/iman.png');
	} else {
		$('#after-login .ic_touxiang').attr('src', '../images/iwoman.png');
	};
	
	//检查更新我们的银行和产品展业
	function checkUpdateOurBankAndProduct(){
		if(commonJson.offlineOnline != 'offline') {
			if(window.localStorage.syncDate == undefined || window.localStorage.syncDate != commonJson.loginTime.substr(0,10)){
				window.localStorage.areaCode = '';
				queryTableDataByConditions({
					"databaseName": "myDatabase", //数据库名
			        "tableName": "picture_info", //表名
			        "sqlOrderColm": "UPDATETIME",
			        "sqlOrderType": "DESC LIMIT 1"
				}, function(data){
					if(data != ''){
						var requestJson = { //发送请求的参数
							"b": [{
								"deviceNo.s": commonJson.deviceNo, //设备编号commonJsons.udId
								"moduleId.s": '', //模块名
								"tranId.s": '', //交易名
								"orgId.s": commonJson.orgId, //机构号commonJson.orgId
								"operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
								"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
								"workAddress.s": commonJson.workAddress, //工作地址
								"updatTime.s": data[0].UPDATETIME //同步时间
							}]
						};
						getNeedUpdateTypeFun(requestJson, function(msg) {
							msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
							var responseObj = JSON.parse(msg);
							var responseCode = responseObj.b;
							if(responseCode[0].results == "00"){
								var type = responseCode[0].type;
								if(type != undefined && type != null && type != '') {
									var sql = "delete from picture_info where PICTYPE in ('" + type.replace(/,/g,"','") + "')";
									executeSqlString(sql, 'update', null, function(err){
										funDataFail(err);
									});
								}
							}
							checkUpdateGift();
						}, function(err){
							funFail(err);
						});
	                    var sql = "select BIGPATH from picture_info where PICTYPE = 'O02'";
	                    executeSqlString(sql, 'exe', function(data){
	                        var array = new Array(data.length);
	                        for(var i = 0; i < data.length; i++){
	                            array[i] = data[i].BIGPATH.substr(data[i].BIGPATH.lastIndexOf('/') + 1);
	                        }
	                        checkFileIfDel(array);
	                    }, function(err){
	                        funDataFail(err);
	                    });
					} else {
						checkUpdateGift();
					}
					window.localStorage.syncDate = commonJson.loginTime.substr(0,10);
				}, function(err){
			        funDataFail(err);
			        tongzhigonggao();
				});
			} else {
				tongzhigonggao();
			}
		}
	}
	
	//检查更新积分礼品信息
	function checkUpdateGift(){
		queryTableDataByConditions({
			"databaseName": "myDatabase", //数据库名
	        "tableName": "gift_info", //表名
	        "sqlOrderColm": "UPDATE_TIME",
	        "sqlOrderType": "DESC LIMIT 1"
		}, function(data){
			if(data != ''){
				var requestJson = { //发送请求的参数
					"b": [{
						"deviceNo.s": commonJson.deviceNo, //设备编号commonJsons.udId
						"moduleId.s": '', //模块名
						"tranId.s": '', //交易名
						"orgId.s": commonJson.orgId, //机构号commonJson.orgId
						"operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
						"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
						"workAddress.s": commonJson.workAddress, //工作地址
						"UPDATE_TIME.s": data[0].UPDATE_TIME //同步时间
					}]
				};
				getNeedUpdateGiftFun(requestJson, function(msg) {
					msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
					var responseObj = JSON.parse(msg);
					var responseCode = responseObj.b;
					if(responseCode[0].results == "00"){
						var giftId = responseCode[0].giftId;
						if(giftId != undefined && giftId != null && giftId != '') {
							var sql = "delete from gift_info where GF_ID in ('" + giftId.replace(/,/g,"','") + "')";
							executeSqlString(sql, 'update', null, function(err){
								funDataFail(err);
							});
						}
					}
					tongzhigonggao();
				}, function(err){
					funFail(err);
				});
			} else {
				tongzhigonggao();
			}
		}, function(err){
	        funDataFail(err);
	        tongzhigonggao();
		});
	}
	
	//获取通知公告
	function tongzhigonggao(){
		if(usrStatistic.isSucess == '00'){
			if(usrStatistic.noticeCount == '-1'){
				$("#after-head-shuz").html('0');
			}else{
				$("#after-head-shuz").html(usrStatistic.noticeCount);
			}
		}else if(usrStatistic.isSucess == '99'){
			tuojizancun();
		}else{
			
		}
		var jobCalendar = new JobCalendar();
		jobCalendar.showCalendar();
		tuojizancun();
		
//		var noticeJson = {
//            "b": [{
//                "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
//                "workAddress.s": commonJson.workAddress, //工作地址
//                "moduleId.s": workbenchJson.moduleID,//creditJson.moduleID, //模块编号
//                "tranId.s": workbenchJson.tranId11,//creditJson.tranId, //交易编号
//                "orgId.s": commonJson.orgId, //机构号
//                "operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
//                "deviceNo.s": commonJson.udId, //设备编号
//                "offOnline.s": commonJson.offlineOnline, //脱机/联机
//                "page.s": "1" //页数
//            }]
//        };
//        inoticeServiceFun(noticeJson, function(msg) {
//            msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//			var responseObj = JSON.parse(msg);
//			var responseCode = responseObj.b;
//			if (responseCode[0].results == "00") {
//				$("#after-head-shuz").html(responseCode[0]['noticeCount.i']);
//			} else if (responseCode[0].results == "03") {
//				$("#after-head-shuz").html('0');
//			}else if (responseCode[0].results == "08") {
//				hideLoader();
//			} else {
//				showTags({
//					'title': '提示',
//					'content': responseCode[0].message,
//					'ok': {}
//				});
//			}
//			var jobCalendar = new JobCalendar();
//			jobCalendar.showCalendar();
//			tuojizancun();
//        },	 function(err) {
//            funFail(err);
//            tuojizancun();
//        });
	}

	function tuojizancun() {
		//脱机数据个数i
		//	setTimeout(function() {
		//		alert(commonJson.tuojiPtLtNum);
		queryTableDataByConditions({
			"databaseName": "myDatabase", //数据库名
			"tableName": "nonetcustomer_info", //表名
			"conditions": {
				"operatorNo": commonJson.adminCount,
				"SUBMITTIME": "between " + (myTime.CurTime() - 86400 * 10) + " and " + myTime.CurTime()  //十天内时间
			}
		}, function(msg) {
			if (msg == '') {
				$("#tuojiyewu-shuliang").html(commonJson.tuojiPtLtNum);
			} else {
				//			var tuojiShuliang=msg.length;

				$("#tuojiyewu-shuliang").html(msg.length + commonJson.tuojiPtLtNum);

			}
			//暂存数据查询
			queryTableDataByConditions({
				"databaseName": "myDatabase", //数据库名
				"tableName": "temporary_info", //表名
				"conditions": {
					"operatorNo": commonJson.adminCount
				}
			}, function(msg) {
				if (msg == "") {
					var num = 0;
					//$("#zancunyewu-shuliang").html("0");
				} else {
					//			var zancunYeWu=msg.length;
					var num = msg.length;
					//$("#zancunyewu-shuliang").html(msg.length);
				}
				queryTableDataByConditions({
					"databaseName": "myDatabase", //数据库名
					"tableName": "loanapply_info", //表名
					"conditions": {
						"operatorNo": commonJson.adminCount
					}
				}, function (loanMsg) {
					if(loanMsg == ''){
						$("#zancunyewu-shuliang").html(num);
					}else{
						$("#zancunyewu-shuliang").html(num + loanMsg.length);
					}
				}, function (err) {
					funDataFail(err);
				});
			}, function(err) {
				//alert(err)
				funDataFail(err);
			});
		}, function(err) {
			funDataFail(err);
		});
		//	}, 300);
		
		setTimeout(function(){
			var Totall = 0;
			$(".after-head-shuzi").each(function(i, d) {
				Totall += parseInt($(this).html());
			});
			$("#shuliang-zongshu").html(Totall);
		}, 1000);
	};


//	$("#shuliang-zongshu").html("");
//	setInterval(function() {
//		//				$("#shuliang-zongshu").html(shuLiangZongShu);
//		//				var shuLiangZongShu = $(".after-head-shuzi").eq(0).val() + $(".after-head-shuzi").eq(1).val() + $(".after-head-shuzi").eq(2).val();
//		//				var shuLiangZongShu = $(".after-head-shuzi").eq(0).val() + $(".after-head-shuzi").eq(1).val() + $(".after-head-shuzi").eq(2).val() + $(".after-head-shuzi").eq(3).val() + $(".after-head-shuzi").eq(4).val();
//		var Totall = 0;
//		$(".after-head-shuzi").each(function(i, d) {
//			var _val = parseInt($(this).html());
//			Totall += _val;
//		});
//		$("#shuliang-zongshu").html(Totall);
//	}, 1000);

	//功能菜单处理
	function menuProcess(dataJson) {
		try {
			var returnAllMenuArray = eval("([" + dataJson + "])");
			var supeMenuId = "";
			var menuId = "";
			var menuName = "";
			var hrefUrl = "";
			var imgUrl = "";
			for (var i in returnAllMenuArray) {
				supeMenuId = returnAllMenuArray[i].pid;
				menuId = returnAllMenuArray[i].id;
				menuName = returnAllMenuArray[i].name;
				if (supeMenuId == "" || supeMenuId === undefined) { //左边菜单加载
					if (Number(menuId) == 19) { //信用卡
						$("ul[class='left-navigation-top']").append(' <a class="left-navigation-li" name="left-navigation-li" id="' + menuId + '"><img src="../images/ic_xinyongka.png" class="left-navigation-li-img left-icon-show" /><img src="../images/ic_xinyongka2.png" class="left-navigation-li-img2" /><span class="left-navigation-content">' + menuName + '</span> </a>');
					} else if (Number(menuId) == 22) { //信通数字卡
						$("ul[class='left-navigation-top']").append(' <a class="left-navigation-li" name="left-navigation-li" id="' + menuId + '" ><img src="../images/ic_xintongka.png" class="left-navigation-li-img left-icon-show" /><img src="../images/ic_xintongka2.png" class="left-navigation-li-img2" /><span class="left-navigation-content">' + menuName + '</span> </a>');
					} else if (Number(menuId) == 24) { //电子渠道
						$("ul[class='left-navigation-top']").append(' <a class="left-navigation-li" name="left-navigation-li"  id="' + menuId + '"><img src="../images/ic_dianziqianyue.png" class="left-navigation-li-img left-icon-show" /><img src="../images/ic_dianziqianyue2.png" class="left-navigation-li-img2" /><span class="left-navigation-content">' + menuName + '</span> </a>');
					} else if (Number(menuId) == 26) { //贵宾理财
						$("ul[class='left-navigation-top']").append(' <a class="left-navigation-li" name="left-navigation-li"  id="' + menuId + '"><img src="../images/ic_licai.png" class="left-navigation-li-img left-icon-show" /><img src="../images/ic_licai2.png" class="left-navigation-li-img2" /><span class="left-navigation-content">' + menuName + '</span> </a>');
					} else if (Number(menuId) == 64) { //便民签约
						$("ul[class='left-navigation-top']").append(' <a class="left-navigation-li" name="left-navigation-li"  id="' + menuId + '"><img src="../images/ic-bm2-ing.png" class="left-navigation-li-img left-icon-show" /><img src="../images/ic-bm-ing.png" class="left-navigation-li-img2" /><span class="left-navigation-content">' + menuName + '</span></a>');
					} else if (Number(menuId) == 31) { //我的工作台
						$("ul[class='left-navigation-top']").append(' <a class="left-navigation-li" name="left-navigation-li"  id="' + menuId + '"><img src="../images/ic_gongzuotai.png" class="left-navigation-li-img left-icon-show" /><img src="../images/ic_gongzuotai2.png" class="left-navigation-li-img2" /><span class="left-navigation-content">' + menuName + '</span></a>');
					} else if (Number(menuId) == 46) { //移动CRM
						$("ul[class='left-navigation-top']").append(' <a class="left-navigation-li" name="left-navigation-li"  id="' + menuId + '"><img src="../images/ic_crm.png" class="left-navigation-li-img left-icon-show" /><img src="../images/ic_crm2.png" class="left-navigation-li-img2" /><span class="left-navigation-content">' + menuName + '</span> </a>');
					} else if (Number(menuId) == 68) { //特惠商户
						$("ul[class='left-navigation-top']").append(' <a class="left-navigation-li" name="left-navigation-li"  id="' + menuId + '"><img src="../images/ic-sh2-ing.png" class="left-navigation-li-img left-icon-show" /><img src="../images/ic-sh-ing.png" class="left-navigation-li-img2" /><span class="left-navigation-content">' + menuName + '</span> </a>');
					} else if (Number(menuId) == 52) { //贷款
						$("ul[class='left-navigation-top']").append(' <a class="left-navigation-li" name="left-navigation-li"  id="' + menuId + '"><img src="../images/ic_daikuanyewu.png" class="left-navigation-li-img left-icon-show" /><img src="../images/ic_daikuanyewu2.png" class="left-navigation-li-img2" /><span class="left-navigation-content">' + menuName + '</span> </a>');
					} else if (Number(menuId) == 58) { //运营影像
						$("ul[class='left-navigation-top']").append(' <a class="left-navigation-li" name="left-navigation-li"  id="' + menuId + '"><img src="../images/ps_videoOne.png" class="left-navigation-li-img left-icon-show" /><img src="../images/ps_videoTwo.png" class="left-navigation-li-img2" /><span class="left-navigation-content">' + menuName + '</span> </a>');
					} else if (Number(menuId) == 61) { //积分
						$("ul[class='left-navigation-top']").append(' <a class="left-navigation-li" name="left-navigation-li"  id="' + menuId + '"><img src="../images/ic_jifenyewu1.png" class="left-navigation-li-img left-icon-show" /><img src="../images/ic_jifenyewu2.png" class="left-navigation-li-img2" /><span class="left-navigation-content">' + menuName + '</span> </a>');
					}
				}

				//右边功能加载
				if (supeMenuId != "" && Number(supeMenuId) == 19) { //信用卡
					if (Number(menuId) == 20) { //申请信用卡
						hrefUrl = "xinyongka/credit-product.html";
						imgUrl = "../images/ic_xinyongka_1.png";
					} else if (Number(menuId) == 21) { //进度查询&补充资料
						hrefUrl = "xinyongka/credit-jinduchaxun.html";
						imgUrl = "../images/ic_xinyongka_2.png";
					}
					var html = ' <a name="moduleID_tranId" href="' + hrefUrl + '" data-direction="reverse"><img src="' + imgUrl + '" class="wodegongzuotai-imgg"/><div class="wodegongzuotai-title">' + menuName + '</div></a>';
					$("div[name='xinyongka_0']").append(html);
				} else if (supeMenuId != "" && Number(supeMenuId) == 22) { //信通数字卡
					if(Number(menuId) == 23){//信通数字卡开卡
						hrefUrl = "xinka/xinka-product.html";
					imgUrl = "../images/ic_xintongshuzika.png";
					}else
					if(Number(menuId) == 83){//信通数字卡卡号查询
						hrefUrl = "xinka/xinka-cardNoQuery.html";
					imgUrl = "../images/ic_chaxunjindu.png";
					}
					
					var html = ' <a name="moduleID_tranId" href="' + hrefUrl + '" data-direction="reverse"><img src="' + imgUrl + '" class="wodegongzuotai-imgg"/><div class="wodegongzuotai-title">' + menuName + '</div></a>';
					$("div[name='xintongshuxika_0']").append(html);
				} else if (supeMenuId != "" && Number(supeMenuId) == 24) { //电子渠道
					hrefUrl = "dianzi/dianzi-readingID.html";
					imgUrl = "../images/icon_dianziqianyue.png";
					var html = ' <a name="moduleID_tranId" href="' + hrefUrl + '" data-direction="reverse"><img src="' + imgUrl + '" class="wodegongzuotai-imgg"/><div class="wodegongzuotai-title">' + menuName + '</div></a>';
					$("div[name='dianziqudao_0']").append(html);
				} else if (supeMenuId != "" && Number(supeMenuId) == 68) { //特惠商户
					hrefUrl = "preferential/pfn-merchantMap.html";
					imgUrl = "../images/ic-dz-ing.png";
					var html = ' <a name="moduleID_tranId" href="' + hrefUrl + '" data-direction="reverse"><img src="' + imgUrl + '" class="wodegongzuotai-imgg"/><div class="wodegongzuotai-title">' + menuName + '</div></a>';
					$("div[name='preferential_0']").append(html);
				} else if (supeMenuId != "" && Number(supeMenuId) == 26) { //贵宾理财
					if (Number(menuId) == 27) { //理财
						hrefUrl = "Finance/Finance-reading.html";
						imgUrl = "../images/ic_licai_1.png";
					} else if (Number(menuId) == 28) { //基金
						hrefUrl = "citigold/citigold-fundSupermarketsOne.html";
						imgUrl = "../images/ic_licai_2.png";

					} else if (Number(menuId) == 29) { //贵金属
						hrefUrl = "citigold/citigold-fundSupermarketsOne.html";
						imgUrl = "../images/ic_licai_3.png";

					} else if (Number(menuId) == 30) { //保险
						hrefUrl = "citigold/citigold-fundSupermarketsOne.html";
						imgUrl = "../images/ic_licai_4.png";

					}
					var html = ' <a name="moduleID_tranId" href="' + hrefUrl + '" data-direction="reverse"><img src="' + imgUrl + '" class="wodegongzuotai-imgg"/><div class="wodegongzuotai-title">' + menuName + '</div></a>';
					$("div[name='guibinlicai_0']").append(html);
				} else if (supeMenuId != "" && Number(supeMenuId) == 52) { //贷款
					if (Number(menuId) == 53) { //人行征信查询
						hrefUrl = "../page/loan/credit-search.html";
						imgUrl = "../images/ic_chaxunzhengxinxitong.png";
					} else if (Number(menuId) == 54) { //银行对账单
						hrefUrl = "../page/loan/bank-bill.html";
						imgUrl = "../images/ic_yinhangduizhangdan.png";
					} else if (Number(menuId) == 56) { //申请贷款
						hrefUrl = "../page/loan/loan-product.html";
						imgUrl = "../images/ic_shenqingdaikuan.png";
					} else if (Number(menuId) == 57) { //进度查询补充资料
						hrefUrl = "loan/queryProcess.html";
						imgUrl = "../images/ic_chaxunjindu.png";
					} else if (Number(menuId) == 71) { //申请小微贷款
						hrefUrl = "../page/loan/smallLoan-product.html";
						imgUrl = "../images/ic-xwdk-ing.png";
					} else if (Number(menuId) == 78) { //小微贷款进度查询
						hrefUrl = "../page/loan/smallLoan-queryProcess.html";
						imgUrl = "../images/ic_chaxunjindu.png";
					} else if (Number(menuId) == 72) { //贷款面签
						hrefUrl = "../page/faceSign/faceSign-reading.html";
						imgUrl = "../images/ic-mq-ing.png";
					} else if(Number(menuId) == 80){ //贷款定价计算
						hrefUrl = "../page/mobile/rpm-home.html";
						imgUrl = "../images/ic-tkd-ing.png";
					}else if(Number(menuId) == 81){//信用贷款
						hrefUrl = "../page/loan/creditLoan-product.html";
						imgUrl = "../images/ic-sydk-ing.png";
					}else if(Number(menuId) == 82){//信用贷款进度查询
						hrefUrl = "../page/loan/creditloan-QueryProgress.html";
						imgUrl = "../images/ic_chaxunjindu.png";
					}else if(Number(menuId) == 84){//小贷客户信息管理
						hrefUrl = "../page/loan/smallLoanCusManage-index.html";
						imgUrl = "../images/ic_crm_1.png";
					}
					var html = ' <a name="moduleID_tranId" href="' + hrefUrl + '" data-direction="reverse"><img src="' + imgUrl + '" class="wodegongzuotai-imgg"/><div class="wodegongzuotai-title">' + menuName + '</div></a>';
					$("div[name='daikuanyewu_0']").append(html);
				}else if (supeMenuId != "" && Number(supeMenuId) == 58) { //运营影像
					if (Number(menuId) == 59) { //拍摄
						hrefUrl = "javascript:onlineCheck('../page/ImagingOperations/yewuxuanze-one.html');";
						imgUrl = "../images/ps_paishe1.png";
					}
					var html = ' <a name="moduleID_tranId" href=' + hrefUrl + ' data-direction="reverse"><img src="' + imgUrl + '" class="wodegongzuotai-imgg"/><div class="wodegongzuotai-title">' + menuName + '</div></a>';
					$("div[name='yunyingyingxiang_0']").append(html);
				}else if (supeMenuId != "" && Number(supeMenuId) == 64) { //便民签约
					if (Number(menuId) == 65) { //社保待遇
						hrefUrl = "ConvenienceContract/socialSecurity_readingID.html";
						imgUrl = "../images/ic-sbdy-ing.png";
					} else if(Number(menuId) == 66){ //特色产品
						hrefUrl = "ConvenienceContract/characteristicProductA.html";
						imgUrl = "../images/ic-ts-ing.png";
					}
					var html = ' <a name="moduleID_tranId" href=' + hrefUrl + ' data-direction="reverse"><img src="' + imgUrl + '" class="wodegongzuotai-imgg"/><div class="wodegongzuotai-title">' + menuName + '</div></a>';
					$("div[name='ConvenienceContract_0']").append(html);
				}else if (supeMenuId != "" && Number(supeMenuId) == 31) { //我的工作台
					if (Number(menuId) == 32) { //暂存业务
						hrefUrl = "gongzuotai/gongzuotai-zcywjxbl.html";
						imgUrl = "../images/icon_home_eight_one.png";
					} else if (Number(menuId) == 33) { //脱机业务
						hrefUrl = "gongzuotai/gongzuotai-tuojibanli.html";
						imgUrl = "../images/icon_home_eight_two.png";
					} else if (Number(menuId) == 34) { //办理情况
						hrefUrl = "gongzuotai/gongzuotai-ywblqkcx.html";
						imgUrl = "../images/icon_home_eight_three.png";
					} else if (menuName.indexOf('复核应答') > -1) { //复核应答
						hrefUrl = "#";
						imgUrl = "../images/icon_home_eight_five.png";
					} else if (Number(menuId) == 43) { //业绩
						hrefUrl = "gongzuotai/gongzuotai-myResults.html";
						imgUrl = "../images/icon_home_eight_four.png";
					} else if (Number(menuId) == 44) { //工作证
						hrefUrl = "gongzuotai/gongzuotai-myWorkPermit.html";
						imgUrl = "../images/icon_home_eight_six.png";
					} else if (Number(menuId) == 41) { //提醒
						hrefUrl = "gongzuotai/gongzuotai-jobAlertsOne.html";
						imgUrl = "../images/icon_home_eight_seven.png";
					} else if (Number(menuId) == 42) { //通知
						hrefUrl = "gongzuotai/gongzuotai-announcement.html";
						imgUrl = "../images/icon_home_eight_eight.png";
					} else if (Number(menuId) == 35) { //续传
						hrefUrl = "gongzuotai/gongzuotai-xuchuanyingxiangziliao.html";
						imgUrl = "../images/icon_home_eight_nine.png";
					} else if (Number(menuId) == 36) { //更新
						hrefUrl = "#";
						imgUrl = "../images/icon_home_eight_ten.png";
					} else if (Number(menuId) == 37) { //利率
						hrefUrl = "gongzuotai/gongzuotai-lilvandwaihui.html";
						imgUrl = "../images/icon_home_eight_eleven.png";
					} else if (Number(menuId) == 38) { //工具
						//hrefUrl = "#";
						imgUrl = "../images/icon_home_eight_twelve.png";
						hrefUrl = "javascript:useCalculator('',function(msg) {},function(err){});";
					} else if (Number(menuId) == 39) { //常见
						hrefUrl = "#";
						imgUrl = "../images/icon_home_eight_thirteen.png";
					} else if (Number(menuId) == 40) { //用户
						hrefUrl = "about/about-cusManual.html";
						imgUrl = "../images/icon_home_eight_fourteen.png";
					} else if (menuName.indexOf('异常') > -1) { //异常
						hrefUrl = "#";
						imgUrl = "../images/icon_home_eight_fifteen.png";
					} else if (Number(menuId) == 45) { //人脸识别
						hrefUrl = "javascript:showShaixuan('系统维护中。');"
//						hrefUrl = "gongzuotai/gongzuotai-renLianShiBie.html";
						imgUrl = "../images/icon_home_eight_sixteen.png";
					}else if (Number(menuId) == 74) { //工作日志
						hrefUrl = "gongzuotai/gongzuotai-dailyLog.html";
						imgUrl = "../images/ic-rz-ing.png";
					} else if (Number(menuId)==73){//工作轨迹
						hrefUrl = "gongzuotai/gongzuotai-gongzuoguiji.html";
						imgUrl = "../images/ic-gz-ing.png";
					}
					var html = ' <a name="moduleID_tranId" href="' + hrefUrl + '" data-direction="reverse"><img src="' + imgUrl + '" class="wodegongzuotai-imgg" /><div class="wodegongzuotai-title">' + menuName + '</div></a>';
					$("div[name='wodegongzuotai_0']").append(html);
				} else if (supeMenuId != "" && Number(supeMenuId) == 46) {
					if (Number(menuId) == 47) { //我的客户
						hrefUrl = "mobile/mobile.html";
						imgUrl = "../images/ic_crm_1.png";
					} else if (Number(menuId) == 48) { //创建潜在客户
						hrefUrl = "mobile/mobile.html?methodFlag=crm_l&flag=moblieCustSave";
						imgUrl = "../images/ic_crm_2.png";
					} else if (Number(menuId) == 49) { //CRM提醒
						hrefUrl = "mobile/mobile.html?methodFlag=crm_i";
						imgUrl = "../images/ic_crm_3.png";
					} else if (Number(menuId) == 50) { //客户服务
						hrefUrl = "mobile/mobile.html?userCode=mobile&moveType=move-c&module=custView&methodFlag=crm_N&flag=queryCustServer";
						imgUrl = "../images/ic_crm_4.png";
					} else if (Number(menuId) == 9999999) { //营销活动
						continue;
						hrefUrl = "mobile/mobile.html?type=5";
						imgUrl = "../images/ic_crm_5.png";
					}
					var html = ' <a name="moduleID_tranId" href="' + hrefUrl + '" data-direction="reverse"><img src="' + imgUrl + '" class="wodegongzuotai-imgg"/><div class="wodegongzuotai-title">' + menuName + '</div></a>';
					$("div[name='yidongCRM_0']").append(html);
				} else if (supeMenuId != "" && Number(supeMenuId) == 61) {
					var aObj = $('<a>').attr('name', 'moduleID_tranId');
					aObj.attr('data-direction', 'reverse');
					aObj.attr('name', 'moduleID_tranId');
					aObj.attr('onclick', 'javascript:jifenJson.tranId="' + menuId +'"');
					if (Number(menuId) == 62) { //积分兑换
						hrefUrl = "jifen/jifen-readingID.html";
						imgUrl = "../images/ic_jifenyewu_1.png";
					} else if (Number(menuId) == 63) { //订单管理
						hrefUrl = "jifen/jifen-readingID.html";
						imgUrl = "../images/ic_jifenyewu_2.png";
					}
					aObj.attr('href', hrefUrl);
					aObj.append('<img src="' + imgUrl + '" class="wodegongzuotai-imgg"/><div class="wodegongzuotai-title">' + menuName + '</div>');
					$("div[name='jifen_0']").append(aObj);
				}
				hrefUrl = null;
				imgUrl = null;
			} //for end
			//返回功能相应的菜单
			var moduleID = Number(BackAttr.moduleID);
			if (moduleID != -1) {
				yejichaxunStar();
				$("#" + moduleID + "_0").show().siblings(".right-content-qiehuan").hide();
				$(".left-navigation-li").removeClass("left-navigation-bgcolor");
				$("#" + moduleID).addClass("left-navigation-bgcolor").siblings("a").removeClass("left-navigation-bgcolor");
				$(".left-navigation-li-img").addClass("left-icon-show");
				$(".left-navigation-li-img2").removeClass("left-icon-show");
				$("#" + moduleID).children(".left-navigation-li-img2").addClass("left-icon-show");
			}

			$("a[name='left-navigation-li']").on("tap", function() { //左边导航点击右边内容变化
				BackAttr.moduleID = this.id;
				$("#" + this.id + "_0").show().siblings(".right-content-qiehuan").hide();
				$(".after-head-xialaall").hide();
				$(".left-navigation-li").removeClass("left-navigation-bgcolor");
				$(this).addClass("left-navigation-bgcolor").siblings("a").removeClass("left-navigation-bgcolor");
				$(".left-navigation-li-img").addClass("left-icon-show");
				$(".left-navigation-li-img2").removeClass("left-icon-show");
				$(this).children(".left-navigation-li-img2").addClass("left-icon-show");
			});

			$("a[name='moduleID_tranId']").unbind().on("tap", function() { //右边菜单点击获取模块编号
				var amjLen = returnAllMenuArray.length;
				var menuNameDiv = $(this).children("div").children(".wodegongzuotai-title").text();
				for (var j = 0; j < amjLen; j++) {
					supeMenuId = returnAllMenuArray[j].pid;
					menuId = returnAllMenuArray[j].id;
					menuName = returnAllMenuArray[j].name;
					if (supeMenuId != "" && menuName != "" && menuNameDiv != "" && menuName.trim() == menuNameDiv.trim()) {
						CrmJson.moduleID = supeMenuId;
						CrmJson.tranId = menuId;
						break;
					}
				}
			});
		} catch (e) {
			showTags({
				'title': '提示',
				'content': '权限菜单返回异常。',
				'ok': {}
			});
		} //try end
		Menu.init = true;
	}

	var sendJson = {
		"b": [{
			"deviceNo.s": commonJson.udId, //设备编号
			"orgId.s": commonJson.orgId, //机构号
			"operatorNo.s": commonJson.adminCount, //操作员
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": "", //工作地址
			"roleId.s": commonJson.roleId //角色编号

		}]
	};

	$(".afterlogin-name").html(commonJson.TLRNAME);

	//
	if (commonJson.offlineOnline == 'offline') { //脱机情况下
		$("ul[class='left-navigation-top']").append('<a class="left-navigation-li tuoji-xinyongkaguanli" data-direction="reverse"><img src="../images/ic_xinyongka.png" class="left-navigation-li-img left-icon-show" /><img src="../images/ic_xinyongka2.png" class="left-navigation-li-img2" /><span class="left-navigation-content">信用卡</span></a>');
		$("ul[class='left-navigation-top']").append('<a class="left-navigation-li tuoji-yunyingyingxiang"><img src="../images/ps_videoOne.png" class="left-navigation-li-img left-icon-show" /><img src="../images/ps_videoTwo.png" class="left-navigation-li-img2" /><span class="left-navigation-content">视频拍摄</span></a>');

		$(".left-navigation-bottom").hide();
		$("ul[class='left-navigation-top']").append('<a class="left-navigation-li tuoji-wodegongzuotai"><img src="../images/ic_gongzuotai.png" class="left-navigation-li-img left-icon-show" /><img src="../images/ic_gongzuotai2.png" class="left-navigation-li-img2" /><span class="left-navigation-content">我的工作台</span></a>');
		$(".after-head-number").html("0");
		$(".after-head-shuzi").html("0");
		$(".afterlogin-name").html(commonJson.adminCount);
		$("#xiugaimima-con").remove();
		$(".tuoji-xinyongkaguanli").unbind().on("tap", function() { //信用卡
			$("div[name='xinyongka_0']").html('<div class="gongzuotai-hengxianSan1"></div><div class="gongzuotai-hengxianSan2"></div><div class="gongzuotai-shuxian1"></div><div class="gongzuotai-shuxian2"></div><div class="gongzuotai-shuxian3"></div>');
			$(".left-navigation-li").removeClass("left-navigation-bgcolor");
			$(this).addClass("left-navigation-bgcolor");
			$("#19_0").show().siblings(".right-content-qiehuan").hide();
			$("div[name='xinyongka_0']").append('<a name="moduleID_tranId" href="xinyongka/credit-product.html" data-direction="reverse"><img src="../images/ic_xinyongka_1.png" class="wodegongzuotai-imgg"/><div class="wodegongzuotai-title">申请</div></a>');
			$(".left-navigation-li-img").addClass("left-icon-show");
			$(".left-navigation-li-img2").removeClass("left-icon-show");
			$(this).children(".left-navigation-li-img2").addClass("left-icon-show");

		});
		$(".tuoji-wodegongzuotai").unbind().on("tap", function() {
			$("div[name='wodegongzuotai_0']").html('<div class="gongzuotai-hengxian1"></div><div class="gongzuotai-hengxian2"></div><div class="gongzuotai-hengxian3"></div><div class="gongzuotai-shuxian1"></div><div class="gongzuotai-shuxian2"></div><div class="gongzuotai-shuxian3"></div>');
			$(".left-navigation-li").removeClass("left-navigation-bgcolor");
			$(this).addClass("left-navigation-bgcolor");
			$("#31_0").show().siblings(".right-content-qiehuan").hide();
			$("div[name='wodegongzuotai_0']").append('<a href="gongzuotai/gongzuotai-zcywjxbl.html" data-direction="reverse"><img src="../images/icon_home_eight_one.png" class="wodegongzuotai-imgg" /><div class="wodegongzuotai-title">暂存业务</div></a>');
			//<a href="javascript:useCalculator("",function(msg) {},function(err){})" data-direction="reverse"><img src="../images/icon_home_eight_twelven.png" class="wodegongzuotai-imgg"/><div class="wodegongzuotai-title">实用工具</div></a>
			//<a href="#" data-direction="reverse"><img src="../images/icon_home_eight_thirteen.png" class="wodegongzuotai-imgg" /><div class="wodegongzuotai-title">常见业务问题</div></a><a href="#" data-direction="reverse"><img src="../images/icon_home_eight_fourteen.png" class="wodegongzuotai-imgg" /><div class="wodegongzuotai-title">用户手册</div></a>
			$(".left-navigation-li-img").addClass("left-icon-show");
			$(".left-navigation-li-img2").removeClass("left-icon-show");
			$(this).children(".left-navigation-li-img2").addClass("left-icon-show");

		});
		$(".tuoji-yunyingyingxiang").unbind().on("tap", function() {
			$("div[name='yunyingyingxiang_0']").html('<div class="gongzuotai-hengxianSan1"></div><div class="gongzuotai-hengxianSan2"></div><div class="gongzuotai-shuxian1"></div><div class="gongzuotai-shuxian2"></div><div class="gongzuotai-shuxian3"></div>');
			$(".left-navigation-li").removeClass("left-navigation-bgcolor");
			$(this).addClass("left-navigation-bgcolor");
			$("#58_0").show().siblings(".right-content-qiehuan").hide();
			var hrefUrl='javascript:onlineCheck("ImagingOperations/yewuxuanze-one.html")';
			$("div[name='yunyingyingxiang_0']").append('<a href='+hrefUrl+' data-direction="reverse"><img src="../images/ps_paishe1.png" class="wodegongzuotai-imgg" /><div class="wodegongzuotai-title">拍摄</div></a>');
			//<a href="javascript:useCalculator("",function(msg) {},function(err){})" data-direction="reverse"><img src="../images/icon_home_eight_twelven.png" class="wodegongzuotai-imgg"/><div class="wodegongzuotai-title">实用工具</div></a>
			//<a href="#" data-direction="reverse"><img src="../images/icon_home_eight_thirteen.png" class="wodegongzuotai-imgg" /><div class="wodegongzuotai-title">常见业务问题</div></a><a href="#" data-direction="reverse"><img src="../images/icon_home_eight_fourteen.png" class="wodegongzuotai-imgg" /><div class="wodegongzuotai-title">用户手册</div></a>
			$(".left-navigation-li-img").addClass("left-icon-show");
			$(".left-navigation-li-img2").removeClass("left-icon-show");
			$(this).children(".left-navigation-li-img2").addClass("left-icon-show");

		});
		hideLoader();
	} else { //联机情况下
		//		$("#after-head-shuz").html(commonJson.noticeCount);
		//		var shuLiangZongShu = $(".after-head-shuzi").eq(0).val() + $(".after-head-shuzi").eq(1).val() + $(".after-head-shuzi").eq(2).val() + $(".after-head-shuzi").eq(3).val() + $(".after-head-shuzi").eq(4).val();
		//		$("#shuliang-zongshu").html(shuLiangZongShu);
		//		var Totall = 0;
		//		$(".after-head-shuzi").each(function(i, d) {
		//			var _val = parseInt($(this).html());
		//			Totall += _val;
		//		});
		//		$("#shuliang-zongshu").html(Totall);
		if (!Menu.init) {
			showLoader('数据初始化中...');
			var goon = false;
			ipermissionServiceFun(sendJson, function(msg) { //用户获取权限菜单信息
				if (!Menu.init) {
					var obj = jQuery.parseJSON(msg);
					var bArray = obj.b;
					var bArrayLen = bArray.length;
					var returnAllMenuJSON = ''; //全部菜单数据，数据模型：{'pid':'18','id':'19','name':'申请信用卡'}
					var menuNameS = "";
					var supeMenuIdS = "";
					var menuIdS = "";
					for (var i = 1; i < bArrayLen; i++) {
						permissionVOArray = bArray[i].permissionVO[0];
						menuNameS = permissionVOArray["menuName.s"];
						supeMenuIdS = permissionVOArray["supeMenuId.s"];
						menuIdS = permissionVOArray["menuId.s"];
						if (returnAllMenuJSON != "") {
							returnAllMenuJSON = returnAllMenuJSON + ",";
						}
						if (supeMenuIdS == menuIdS) supeMenuIdS = "";
						returnAllMenuJSON = returnAllMenuJSON + '{"pid":"' + supeMenuIdS + '","id":"' + menuIdS + '","name":"' + menuNameS + '"}';

						permissionVOArray = null;
					}
					Menu.data = returnAllMenuJSON;
					yejichaxunStar();
				} //Menu.init - end
				menuProcess(Menu.data);
				//hideLoader();

				//				tongZhiGongGao();
			}, function(err) {
				hideLoader();
				funFail(err);
			});
		} else {
			menuProcess(Menu.data);
		}
	};
	//	var myDate = new Date();//获取时间
	//	var nianYueRiGongZuo = myDate.getFullYear() + "-" + ((myDate.getMonth()+1)>9?(myDate.getMonth()+1):"0"+(myDate.getMonth()+1)) + "-" + (myDate.getDate()>9?myDate.getDate():"0"+myDate.getDate());//年月日

	//	function tongZhiGongGao(){//通知公告
	//			var JobAlertsJson = {
	//			"b": [{
	//				"deviceNo.s": commonJson.udId, //设备编号
	//				"moduleId.s": '6',//设备编号
	//				"tranId.s": '1',//交易名
	//				"orgId.s": commonJson.orgId,//机构号
	//				"operatorNo.s": commonJson.adminCount,//操作员
	//				"offlineOnline.s": commonJson.offlineOnline,//脱机/联机
	//				"workAddress.s": commonJson.workAddress,//工作地址
	//				"searchDate.s": nianYueRiGongZuo,//查询日期
	//				"searchContent.s": '',//搜索内容
	//				"isLoginNow.s": false//是否是登陆时查询
	//	
	//			}]
	//		};
	//		IJobAlertsServiceFun(JobAlertsJson,function(msg){
	//			tongzhogongGao(msg);
	//			alert(msg);
	//		},function(err){
	//			hideLoader();
	//			funFail(err);
	//		});
	//	};
	//	function tongzhogongGao(msg){//通知公告获取
	//		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	//		var responseObj = JSON.parse(msg);
	//		var responseCode = responseObj.b;
	//		if (responseCode[0].results == "00") {
	//			
	//		}else{
	//			hideLoader();
	//			showTags({
	//				'title': '提示',
	//				'content': responseCode[0].message,
	//				'ok': {}
	//			});
	//		};
	//	};
	function sendIproduct(_id) { //产品展业
		$("#chanpinzhanye_0").html('');
		loginAttr.proType = _id;
		showLoader('数据初始化中...');
		queryTableDataByConditions({
	        "databaseName": "myDatabase", //数据库名
	        "tableName": "picture_info", //表名
	        "conditions": {
	        	"PICTYPE": "P" + _id
	        }
	    }, function(data) {
	        if(data != ''){
	        	for(var i = 0; i < data.length; i++){
	        		showProductInfo({
	        			"proId" : data[i].NUMBER,
	        			"proType" : data[i].PICTYPE.substr(1),
	        			"proName" : data[i].PICTITLE,
	        			"proReferral" : data[i].PICCONTENT,
	        			"proPicture" : data[i].BIGPATH,
	        			"protepPicture" : data[i].BIGPIC
	        		}, i);
	        	}
	        	hideLoader();
	        } else {
				var aboutJson = { //发送请求的参数
					"b": [{
						"deviceNo.s": commonJson.deviceNo, //设备编号commonJsons.udId
						"moduleId.s": '', //模块名
						"tranId.s": '', //交易名
						"orgId.s": commonJson.orgId, //机构号commonJson.orgId
						"operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
						"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
						"workAddress.s": commonJson.workAddress, //工作地址
						"proType.s": _id || loginAttr.proType //产品类型
		
					}]
				};
				//var picWord = new PicWord('C', _id || loginAttr.proType);
				//if (!picWord.pushData('C', _id || loginAttr.proType)) {
				if (commonJson.offlineOnline == 'offline') { //脱机情况下
		
				} else { //联机情况下
					$("#chanpinzhanye_0").html('');
					iproductServiceFun(aboutJson, function(msg) {
						chanpinzanye(msg);
						//	picWord.cache('C', _id || loginAttr.proType, msg);
					}, function(err) {
						funFail(err);
					});
				}
			}
	   	}, function(err){
	   		funDataFail(err);
	   	});
		//}
	}

	function chanpinzanye(msg) {
		//$(".navigation-con li").removeClass("navigation-bgcolor");
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		if (responseCode[0].results == "00") {
			var j = 1;
			//var _roPicture;
			var proId;
			for (j = 1; j < responseCode.length; j++) {
				var _productVOArray = responseCode[j].productVO;
				$.each(_productVOArray, function(i, d) {
					showProductInfo(d);
					insertTableData({
						"databaseName": "myDatabase",
				        "tableName": "picture_info",
				        "data": [{
				            "NUMBER": d.proId,
				            "PICTYPE": "P" + d.proType,
				            "PICTITLE": d.proName,
				            "PICCONTENT": d.proReferral,
				            "SMALLPIC": '',
				            "BIGPIC": d.protepPicture,
				            "SMALLPATH": '',
				            "BIGPATH": d.proPicture,
				            "QRCODE": '',
				            "UPDATETIME": d.updateTime,
				            "ISUPDATE": '0'
				        }]
					});
					//					Meap.transFormImage(d.proId+'b', _roPicture, 'picSty', function(msg) {
					//						$("a[name='after_a_" + d.proId + "']").attr("data-image", msg);
					//						$("a[name='after_a_" + d.proId + "']>img").attr("src", msg);
					//					}, function(err) {});

				});
			}

			//$("#chanpinzhanye_0").html(html);
			//			$("#"+loginAttr.proType).addClass("navigation-bgcolor");//.siblings("li").removeClass("navigation-bgcolor");

		} else if (responseCode[0].results == "08") {
			$("#chanpinzhanye_0").html('');
			loginAttr.proType = _id;
			var aboutJson = { //发送请求的参数
				"b": [{
					"deviceNo.s": commonJson.deviceNo, //设备编号commonJson.udId
					"moduleId.s": '', //模块名
					"tranId.s": '', //交易名
					"orgId.s": commonJson.orgId, //机构号commonJson.orgId
					"operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"proType.s": _id || loginAttr.proType //产品类型

				}]
			};
			//var picWord = new PicWord('C', _id || loginAttr.proType);
			//if (!picWord.pushData('C', _id || loginAttr.proType)) {
			showLoader('数据初始化中...');
			iproductServiceFun(aboutJson, function(msg) {
				chanpinzanye(msg);
				//	picWord.cache('C', _id || loginAttr.proType, msg);
			}, function(err) {
				hideLoader();
				funFail(err);
			});
		} else {
			hideLoader();
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
	
	function showProductInfo(d){
		_roPicture = d.protepPicture;
		_roPicture = _roPicture.replace(/\\/g, "").replace('data:image/png;base64,', '');
		$("#chanpinzhanye_0").append('<a name="after_a_' + d.proId + '" data-type="' + d.proType + '" data-picindex="" data-proId="' + d.proId + '"  href="javascript:;" class="chanpinzhanshi-click" data-proname="' + d.proName + '" data-image="' + d.protepPicture + '"><div class="dispaly-cpzynone">' + d.proReferral + '</div><img src="data:image/png;base64,' + _roPicture + '" class="womendeyinhang-img" /><div class="womendeyinhang-title">' + d.proName + '</div></a>');

	}

	//	function chanpinzhanyeImg(msgImg) { //图片信息
	//		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	//		var responseObj = JSON.parse(msg);
	//		var responseCode = responseObj.b;
	//		if (responseCode[0].results == "00") {
	//			var pic = responseCode[1].productPictureVO[0];
	//
	//			var CUSTANDCUSTOWNERPICBase64 = pic.proPicture.replace(/\\/g, "").replace('data:image/png;base64,', '');
	//			Meap.transFormImage(pic.proId, CUSTANDCUSTOWNERPICBase64, 'picSty', function(msg) {
	//				//				alert(msg);
	//				$("a[name='after_a_" + pic.proId + "']").attr("data-image", msg);
	//				$("a[name='after_a_" + pic.proId + "']>img").attr("src", msg);
	//				//alert(msg);
	//				//$("#chanpinzhanye_0").append('<img src="'+ msg +'" class="womendeyinhang-img" />');
	//				//$("#chanpinzhanye_0").append('<a href="javascript:;" class="chanpinzhanshi-click" data-proname="'+d.proName+'" data-proReferral="'+d.proReferral+'" data-image="'+msg+'"><img src="'+ msg +'" class="womendeyinhang-img" /><div class="womendeyinhang-title">'+d.proName+'</div></a>');
	//			}, function(err) {
	//				showTags({
	//					'title': '提示',
	//					'content': '图片转换失败',
	//					'ok': {}
	//				});
	//			});
	//		} else {
	//			hideLoader();
	//			showTags({
	//				'title': '提示',
	//				'content': responseCode[0].message,
	//				'ok': {}
	//			});
	//		};
	//	}




	var swiperdatu = null;
	var swiperdatu = new Swiper('.swiper-container-zhuye', { //主页banner大图切换
		pagination: '.swiper-pagination-zhuye',
		paginationClickable: true,
		spaceBetween: 30,
		observer: true
	});

	var swiperyewu = null;
	var swiperyewu = new Swiper('.container-login-after', { //主页业务详情上下滑动
		pagination: '.pagination-login-after',
		paginationClickable: '.pagination-login-after',
		nextButton: '.ic_after-jiantoutop',
		prevButton: '.ic_after-jiantoubottom',
		spaceBetween: 30,
		paginationClickable: true,
		direction: 'vertical',
		observer: true
	});

	//重新计算首页轮播天数量
	function reInitSwiper() {
		setTimeout(function() {
			swiperdatu.update();
			swiperyewu.update();
		}, 100)
	}
	//主页工作提醒点击翻转页面
	//	var content = $('#flip-container');
	//	$('.button-fanzhuan').on("tap", function() {
	//		if (content.hasClass('hover')) {
	//			content.removeClass('hover');
	//		} else {
	//			content.addClass('hover');
	//			$(".beimian-djfh").on("tap", function() {
	//				content.removeClass('hover');
	//			});
	//		}
	//	})



	$(".yewujob-navigation-con li").unbind().on("tap", function() { //业务详情选中状态
		$(".yewujob-navigation-con li").removeClass("yewujob-navigation-bgcolor");
		$(this).addClass("yewujob-navigation-bgcolor");

	});

	$('#indicatorContainer').radialIndicator({ //圆形指示器方法
		showPercentage: false,
		radius: 97, //圆环半径
		barColor: "#0098e5", //字头颜色
		fontFamily: "helvetica neue",
		fontWeight: "100",
		barWidth: 5,
		barBgColor: "#fcfcfc",
	});
	var radialObj = $('#indicatorContainer').data('radialIndicator');
	var curProgress = radialObj.value();
	radialObj.value(0); //中间和圆环变化的值




	//	$(".after-head-name").on("tap",function(){//头部下拉
	//				$(".after-head-xialaall").toggle(); 
	//			});
	$(".after-head-name").unbind("click").on("click", function() { //头部下拉
		BackAttr.moduleID = '30'; //我的工作台
		if ($(".after-head-xialaall").css('display') == 'none') {
			$("#qsrysmm-value").html('');
			$(".after-head-xialaall").show();
			$(".after-head-xialaall").attr("eq", "1");
			//			if (commonJson.offlineOnline == 'online') { //联机情况下
			//				tuojirenyewuSL();
			//			}
		} else {
			$("#qsrysmm-value").html('');
			$("#xmm-value").html('');
			$("#qrxmm-value").html('');
			$(".lcmmsrbyz-tishi").hide();
			$(".after-head-xialaall").hide();
			$(".after-head-xialaall").attr("eq", "0");
		}
	});

	//	$(document).mousedown(
	//		function(event) {
	//			console.log(event.target.id)
	//			if (event.target.id == "after-head-name" || event.target.id == "sign-out" || event.target.id == "x1" || event.target.id == "x2" || event.target.id == "x3" || event.target.id == "x4" || event.target.id == "x5" || event.target.id == "x6") {} else {
	//				if ($(".after-head-xialaall").attr("eq") == "1") {
	//					$(".after-head-xialaall").hide();
	//					$(".after-head-xialaall").attr("eq", "0");
	//				}
	//			}
	//		}
	//
	//
	//	);

	$("a[name='left-navigation-li-1']").unbind().on("tap", function() { //左边导航点击右边内容变化
		BackAttr.moduleID = this.id;
		$("#" + this.id + "_0").show().siblings(".right-content-qiehuan").hide();
		$(".left-navigation-li").removeClass("left-navigation-bgcolor");
		$(".after-head-xialaall").hide();
		$(".navigation-common>li").eq(0).addClass("navigation-after-bgcolor").siblings("li").removeClass("navigation-after-bgcolor");
		$(".chanpinzhanye-con>li").eq(0).addClass("navigation-after-bgcolor").siblings("li").removeClass("navigation-after-bgcolor");
		$(this).addClass("left-navigation-bgcolor").siblings("a").removeClass("left-navigation-bgcolor");
		$(".left-navigation-li-img").addClass("left-icon-show");
		$(".left-navigation-li-img2").removeClass("left-icon-show");
		$(this).children(".left-navigation-li-img2").addClass("left-icon-show");
		reInitSwiper();
		//重新计算首页轮播天数量


		if (this.id == "10") {

			WoMenDeYinHangStay("01");
		} else if (this.id == "11") {

			sendIproduct("01");
		}
	});

	function WoMenDeYinHangStay(_idd) {
		showLoader('数据初始化中...');
		$("#womendeyinhang_0").html('');
		womendeyinhang.markType = _idd;
		queryTableDataByConditions({
	        "databaseName": "myDatabase", //数据库名
	        "tableName": "picture_info", //表名
	        "conditions": {
	        	"PICTYPE": "O" + _idd
	        }
	    }, function(data) {
	        if(data != ''){
	        	for(var i = 0; i < data.length; i++){
	        		showOurBankInfo({
	        			"markId" : data[i].NUMBER,
	        			"markType" : data[i].PICTYPE.substr(1),
	        			"activityName" : data[i].PICTITLE,
	        			"markReferral" : data[i].PICCONTENT,
	        			"markPicture" : data[i].BIGPATH,
	        			"marktepPicture" : data[i].BIGPIC,
	        			"QrcodeChar" : data[i].QRCODE
	        		}, i);
	        	}
	        	hideLoader();
	        } else {
				var yinhangJson = { //我们的银行发送请求的参数
					"b": [{
						"deviceNo.s": commonJson.udId, //设备编号commonJson.udId
						"moduleId.s": '', //模块名
						"tranId.s": '', //交易名
						"orgId.s": commonJson.orgId, //机构号commonJson.orgId
						"operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
						"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
						"workAddress.s": commonJson.workAddress, //工作地址
						"markType.s": _idd || womendeyinhang.markType //01-银行介绍／02品牌宣传／03客户活动／04关注我们
		
					}]
				};
				//var picWord = new PicWord('W', _idd || womendeyinhang.markType);
				//if (!picWord.pushData('W', _idd || womendeyinhang.markType)) {
				IOurBankServiceListFun(yinhangJson, function(msg) { //我们的银行
					womendeyinHang(msg);
					//picWord.cache('W', _idd || womendeyinhang.markType, msg);
				}, function(err) {
					funFail(err);
				});
				//}
	        }
	    }, function(err) {
	    	hideLoader();
	        funDataFail(err);
	    });
	};

	function womendeyinHang(msg) { //我们的银行
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		if (responseCode[0].results == "00") {

			var j = 1;
			//			var _roPicture;
			//			var proId;
			for (j = 1; j < responseCode.length; j++) {
				var _ourBankVO = responseCode[j].ourBankVO;
				$.each(_ourBankVO, function(i, k) {
					showOurBankInfo(k);
					insertTableData({
						"databaseName": "myDatabase",
				        "tableName": "picture_info",
				        "data": [{
				            "NUMBER": k.markId,
				            "PICTYPE": "O" + k.markType,
				            "PICTITLE": k.activityName,
				            "PICCONTENT": k.markReferral,
				            "SMALLPIC": '',
				            "BIGPIC": k.marktepPicture,
				            "SMALLPATH": '',
				            "BIGPATH": k.markPicture,
				            "QRCODE": k.QrcodeChar,
				            "UPDATETIME": k.updateTime,
				            "ISUPDATE": '0'
				        }]
					});
				});
			}
			hideLoader();
			//$("#chanpinzhanye_0").html(html);
			//			$("#"+loginAttr.proType).addClass("navigation-bgcolor");//.siblings("li").removeClass("navigation-bgcolor");

		}else {
			if (responseCode[0].results == "08") {
			womendeyinhang.markType = _idd;
			var yinhangJson = { //我们的银行发送请求的参数
				"b": [{
					"deviceNo.s": commonJson.udId, //设备编号commonJson.udId
					"moduleId.s": '', //模块名
					"tranId.s": '', //交易名
					"orgId.s": commonJson.orgId, //机构号commonJson.orgId
					"operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"markType.s": _idd || womendeyinhang.markType //01-银行介绍／02品牌宣传／03客户活动／04关注我们

				}]
			};
			showLoader('数据初始化中...');
			$("#womendeyinhang_0").html('');
			IOurBankServiceListFun(yinhangJson, function(msg) { //我们的银行
				womendeyinHang(msg);
				//picWord.cache('W', _idd || womendeyinhang.markType, msg);
			}, function(err) {
				funFail(err);
			});
		}else{
			hideLoader();
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
		};
	};
	
	function showOurBankInfo(k){
		_roPicture = k.marktepPicture;
		_roPicture = _roPicture.replace(/\\/g, "").replace('data:image/png;base64,', '');
		if (k.markType == '04') { //当什么等于04时,转换二维码
			var pictitle = (k.markReferral == '' || k.markReferral == null) ? '二维码' : k.markReferral;
			transformStringToImage(k.QrcodeChar, function(msg) {
				$("#womendeyinhang_0").append('<a name="after_a_' + k.markId + '" data-type="' + k.markType + '" data-picindex="" data-markId="' + k.markId + '"  href="javascript:;" class="womendeyinhang-click erweima-changecolor" data-proname="' + k.activityName + '" data-image="' + msg + '"><div class="proreferral" style="display:none">' + k.markReferral + '</div><img src="' + msg + '" class="womendeyinhang-img" /><div class="markReferral-title">' + pictitle + '</div></a>');
			}, function(err) {
				alert(err + '生成二维码失败')
			});
		} else {
			//					proId = d.proId;
			var pictitle = (k.activityName == '' || k.activityName == null) ? '品牌宣传' : k.activityName;
			var aObj = $('<a>').attr('id', 'after_a_' + k.markId);
			aObj.attr('name', 'after_a_' + k.markId);
			aObj.attr('data-type', k.markType);
			aObj.attr('file-token', (k.fileToken != null && k.fileToken != "" && k.fileToken != undefined) ? k.fileToken : "");
			aObj.attr('data-picindex', '');
			aObj.attr('data-markId', k.markId);
			aObj.attr('href', 'javascript:;');
			aObj.attr('data-proname', k.activityName);
			aObj.attr('data-image', k.marktepPicture);
			aObj.append($('<div>').addClass('proreferral').html(k.markReferral).hide());
			aObj.append($('<img>').attr('src', 'data:image/png;base64,' + _roPicture).addClass('womendeyinhang-img'));
			
			if(k.markType != undefined && k.markType != null && k.markType == '02'){ //视频
				downLoadFile('', '', k.markId, '5', function(msg){
					if(msg == 'false'){
						aObj.click(function(){
							showTags({
								'title': '确认',
								'content': '未找到该视频，是否开始下载？',
								'ok': {
									'title': '下载', //非必输  默认值：确认
									'fun': function(){ //非必输  如果输入则执行此函数
										dowanloadVideo(k.markPicture, k.markId);
										aObj.unbind().click(function(){
											dowanloadVideo(k.markPicture, k.markId);
										});
									}
								},
								'cancel': {}
							});
						});
					} else if(msg.lastIndexOf('/') > 0 && k.markPicture.substr(k.markPicture.lastIndexOf('/') + 1) != msg.substr(msg.lastIndexOf('/') + 1)){
						aObj.click(function(){
							showTags({
								'title': '确认',
								'content': '有新视频需要更新，是否开始下载？',
								'ok': {
									'title': '下载', //非必输  默认值：确认
									'fun': function(){ //非必输  如果输入则执行此函数
										dowanloadVideo(k.markPicture, k.markId);
										aObj.unbind().click(function(){
											dowanloadVideo(k.markPicture, k.markId);
										});
									}
								},
								'cancel': {
									'fun': function(){ //非必输  如果输入则执行此函数
										aObj.unbind().attr('data-video', msg).addClass('womendeyinhang-click').click();
									}
								}
							});
						});
					} else {
						aObj.attr('data-video', msg).addClass('womendeyinhang-click');
					}
					aObj.append($('<div>').attr('id', 'after_div_' + k.markId).addClass('womendeyinhang-title').html(pictitle));
					$("#womendeyinhang_0").append(aObj);
				}, function(err){
					alertMessage(err);
				});
			} else {
				aObj.addClass('womendeyinhang-click');
				aObj.append($('<div>').addClass('womendeyinhang-title').html(pictitle));
				$("#womendeyinhang_0").append(aObj);
			}
			
			//						Meap.transFormImage(k.markId+'a', _roPicture, 'picSty', function(msg) {
			//							$("a[name='after_a_" + k.markId + "']").attr("data-image", msg);
			//							$("a[name='after_a_" + k.markId + "']>img").attr("src", msg);
			//						}, function(err) {});
		}
	}
	
	$(".navigation-womendeyinhang>li").on("tap", function() { //我们的银行头部导航点击特效
		//		showLoader('数据初始化中...');
		var _idd = $(this).attr('deta-id');
		if (womendeyinhang.markType != _idd) {
			WoMenDeYinHangStay(_idd);
		}
		$(this).addClass("navigation-after-bgcolor").siblings("li").removeClass("navigation-after-bgcolor");
	});
	var swiperTwoOneWindow = new Swiper('.containerafter', { //弹窗左右划屏
		pagination: '.pagination-after',
		paginationClickable: true,
		spaceBetween: 30,
		noSwiping: false
			//					});
	});
	$("#womendeyinhang_0").on('tap', '.womendeyinhang-click', function() { //我们的银行弹窗	
		var __this = $(this);
		var proName = __this.attr('data-proname'); //标题
		var proReferral = __this.find('.proreferral').html(); //描述
		var proIdZhi = __this.attr('data-markId');
		var picIndex = __this.attr('data-picindex');
		var proType = __this.attr('data-type');
		var fileToken = __this.attr('file-token');
		var proImg = __this.attr('data-image');
		$('.tc-image').removeClass("img-guanzhuwomen");
		if (proType == '02' || (fileToken != undefined && fileToken != '')) { //视频处理
			$('.tc-image').hide();
			$('#srcb_vedio').remove();
//			var pathName = window.document.location.pathname;
//			var projectName = pathName.substring(0, pathName.indexOf('www') + 4);
			$("#shipingchuli").append('<video id="srcb_vedio" src="' + __this.attr('data-video') + '"  width="100%" height="100%" controls="controls"></video>');
			$('.tc-biaoti').html(proName);
			$('.tc-content').html(proReferral);
			$(".chanpinzhanye-womendeyinhang").show();
		} else if (proType == '04') { //二维码处理

			$('.tc-image').show();
			$('.tc-image').addClass("img-guanzhuwomen");
			$('#srcb_vedio').remove();
			////			var pathName = window.document.location.pathname;
			////			var projectName = pathName.substring(0, pathName.indexOf('www') + 4);
			////			$("#shipingchuli").append('<video id="srcb_vedio" src="' + projectName + 'images/SRCB_01.mp4" width="100%" height="100%" controls="controls"></video>');
			$('.tc-biaoti').html(proName);
			var proPicture = __this.attr('data-image');
			$('.tc-image').attr('src', proPicture);
			$('.tc-content').html(proReferral);
			//			$(".chanpinzhanye-womendeyinhang").show();
			//			var swiperTwoOne = new Swiper('.containerafter', { //弹窗左右划屏
			//				pagination: '.pagination-after',
			//				paginationClickable: true,
			//				spaceBetween: 30,
			//				noSwiping: false
			//			});
			//			swiperTwoOne.update();
		} else { //非视频处理
			//					if(__this.attr('dete-markType')=='04'){
			//						var proPicture = __this.attr('data-image'); //图片
			//					};
			var sendJson = { //发送请求的参数
				"b": [{
					"deviceNo.s": commonJson.udId, //设备编号commonJson.udId
					"moduleId.s": '', //模块名
					"tranId.s": '', //交易名
					"orgId.s": commonJson.orgId, //机构号commonJson.orgId
					"operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"markId.s": proIdZhi //01-银行介绍／02品牌宣传／03客户活动／04关注我们

				}]
			};
			//var picWord = new PicWord('W', proType);
			//if (!picWord.showBigPic(picIndex, proName, proReferral)) {
			showLoader('数据初始化中...');


//			getMarkPictureFun(sendJson, function(msg) {
//				womendeyinhangImg(msg);
//				//picWord.cache('W', proType, msg);
//			}, function(err) {
//				hideLoader();
//				funFail(err);
//			});
			//}
//			function womendeyinhangImg(msg) { //大图
//				msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//				var responseObj = JSON.parse(msg);
//				var responseCode = responseObj.b;
//				var picimg = responseCode[1].markPictureVO[0];
				var CUSTANDCUSTOWNERPICBase64 = proImg.replace(/\\/g, "").replace('data:image/png;base64,', '');
				//				Meap.transFormImage(picimg.markId + '1', CUSTANDCUSTOWNERPICBase64, 'picSty', function(msg) {
				hideLoader();
				proPicture = "data:image/png;base64," + CUSTANDCUSTOWNERPICBase64; //图片
				$('.tc-biaoti').html(proName);
				$('.tc-image').show();
				$('#srcb_vedio').remove();
				$('.tc-image').attr('src', proPicture);
				$('.tc-content').html(proReferral);
				$(".chanpinzhanye-womendeyinhang").show();
				if (swiperTwoOneWindow) {
					swiperTwoOneWindow.update();
					swiperTwoOneWindow.slideTo(0, 0, false);
				}

//			}
		} //非视屏处理结束
		if (swiperTwoOneWindow) {
			swiperTwoOneWindow.update();
			swiperTwoOneWindow.slideTo(0, 0, false);
		}
		$(".ic_close").click(function() { //关闭产品展业弹窗
			$(".chanpinzhanye-womendeyinhang").hide();
			$('#srcb_vedio').remove();
		});
	});
	$(".chanpinzhanye-con>li").on("tap", function() { //产品展业头部导航点击变换
		//		showLoader('数据初始化中...');
		var _id = $(this).attr('data-id');
		if (loginAttr.proType != _id) {
			sendIproduct(_id);
		}

		$(this).addClass("navigation-after-bgcolor").siblings("li").removeClass("navigation-after-bgcolor");

	});
	$("#chanpinzhanye_0").on('tap', '.chanpinzhanshi-click', function() { //产品展业弹窗
			var __this = $(this);
			var proName = __this.attr('data-proname'); //标题
			//			var proPicture = __this.attr('data-image'); //图片
			var proReferral = __this.children(".dispaly-cpzynone").html(); //描述
			var proIdZhi = __this.attr('data-proId');
			var picIndex = __this.attr('data-picindex');
			var proType = __this.attr('data-type');
			$('.tc-image').removeClass("img-guanzhuwomen");
//			var ImgJson = { //发送请求的参数
//				"b": [{
//					"deviceNo.s": '', //设备编号commonJson.udId
//					"moduleId.s": '', //模块名
//					"tranId.s": '', //交易名
//					"orgId.s": '', //机构号commonJson.orgId
//					"operatorNo.s": '', //操作员commonJson.adminCount
//					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
//					"workAddress.s": "", //工作地址
//					"proId.s": proIdZhi //
//
//				}]
//			};
			//var picWord = new PicWord('C', proType);
			//if (!picWord.showBigPic(picIndex, proName, proReferral)) {
			showLoader('数据初始化中...');
//			IProductServiceImgFun(ImgJson, function(msg) {
//				chanpinzhanyeImg(msg);
//				//picWord.cache('C', proType, msg);
//			}, function(err) {
//				if ($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
//					hideLoader();
//					responseCode.message = '当前网络不可用,请检测网络!';
//				}
//				if ($.trim(responseCode.message).toUpperCase() == 'THE REQUEST TIMED OUT') {
//					hideLoader();
//					responseCode.message = '系统超时,请重新操作!';
//				}
//				hideLoader();
//				funFail(err);
//			});
			//}

//			function chanpinzhanyeImg(msg) { //大图
//				msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//				var responseObj = JSON.parse(msg);
//				var responseCode = responseObj.b;
//				var picimg = responseCode[1].productPictureVO[0];
				var CUSTANDCUSTOWNERPICBase64 = __this.attr('data-image').replace(/\\/g, "").replace('data:image/png;base64,', '');
				//				Meap.transFormImage(picimg.proId + '1', CUSTANDCUSTOWNERPICBase64, 'picSty', function(msg) {
				hideLoader();
				proPicture = "data:image/png;base64," + CUSTANDCUSTOWNERPICBase64; //图片
				$('.tc-biaoti').html(proName);
				$('.tc-image').attr('src', proPicture);
				$('.tc-content').html(proReferral);
				$(".chanpinzhanye-womendeyinhang").show();

				//var swiperTwoOne = new Swiper('.containerafter', { //弹窗左右划屏
				//	pagination: '.pagination-after',
				//	paginationClickable: true,
				//	spaceBetween: 30,
				//	noSwiping: false
				//});

				//				});
//				if (swiperTwoOneWindow) {
//					swiperTwoOneWindow.update();
//					swiperTwoOneWindow.slideTo(0, 0, false);
//				}
//			}

			if (swiperTwoOneWindow) {
				swiperTwoOneWindow.update();
				swiperTwoOneWindow.slideTo(0, 0, false);
			}
			$(".ic_close").click(function() { //关闭产品展业弹窗
				$(".chanpinzhanye-womendeyinhang").hide();
			});
		})
		//

	$("#sign-out").on("click", function() {
		if (commonJson.offlineOnline == 'offline') { //脱机情况下退出登录
			$.mobile.changePage('../index.html');
			$("#login-name").val("");
			$("#login-password").val("");
			$(".input-renlianshibie").val("");

			hideLoader();
		} else { //联机情况下退出登录
			queryTableDataByConditions({
				"databaseName": "myDatabase", //数据库名
				"tableName": "up_download_info" //表名
			}, function(msg) {
				if(msg.length>0){
					hideLoader();
					showTags({
						'title': '提示',
						'content': '影像资料上传未完成,请完成后登出!',
						'ok': {
						}
					});
					return;
				}else{
					loginOutFun(loginoutSucc);

				}
			}, function(err) {
				showMsg('查询数据库失败' + err);
			});

		}



		//hideLoader();
	});


	//下面链接是头部下拉控制
	$(".tuojiyewu-head-xiala").on("click", function() { //脱机业务办理
		$.mobile.changePage('gongzuotai/gongzuotai-tuojibanli.html', {
			transition: "slide"
		});
	});
	$(".tuojiyewu-head-zancunyewu").on("click", function() { //暂存
		$.mobile.changePage('gongzuotai/gongzuotai-zcywjxbl.html', {
			transition: "slide"
		});
	});
	$(".tuojiyewu-head-tongzhigonggao").on("click", function() { //通知公告
		$.mobile.changePage('gongzuotai/gongzuotai-announcement.html', {
			transition: "slide"
		});
	});
	$("#xiugaimima-con").on("click", function() { //修改密码
		$("#qsrysmm-value").val('');
		$("#xmm-value").val('');
		$("#qrxmm-value").val('');
		$(".lcmmsrbyz-tishi").hide();
		$(".after-head-xialaall").hide();
		$(".xiugaimima-mima").show();
	});
	$("#submitted-successfully-btn").on("click", function() { //取消修改密码
		$(".xiugaimima-mima").hide();
	});
	$("#qrxmm-value").on("click", function() {
		$(".lcmmsrbyz-tishi").hide();
	});
	$("#xiugaimima-ok").on("click", function() { //确认修改密码
		var pwnName = document.getElementById("qsrysmm-value").value;
		var pwnPassword = document.getElementById("xmm-value").value;
		var pwnxinPassword = document.getElementById("qrxmm-value").value;
		if (pwnName == "") {
			showTags({
				'title': '提示',
				'content': "原密码不能为空。",
				'ok': {}
			});
			return;
		}
		if (pwnPassword == "") {
			showTags({
				'title': '提示',
				'content': "密码不能为空。",
				'ok': {}
			});
			return;
		}
		var re = new RegExp("(?=.*[0-9])(?=.*[a-zA-Z])(?=[a-zA-Z0-9]+$).{6,10}$");
		if (!(re.test(pwnPassword))) {
			showTags({
				'title': '提示',
				'content': "密码需6-10位包含字母和数字。",
				'ok': {}
			});
			return;
		}
		if (pwnxinPassword == "") {
			showTags({
				'title': '提示',
				'content': "确认密码不能为空。",
				'ok': {}
			});
			return;
		}
		if (pwnName == pwnPassword) {
			showTags({
				'title': '提示',
				'content': "新密码不可与原密码相同。",
				'ok': {}
			});
			return;
		}
		if (pwnPassword !== pwnxinPassword) {
			$(".lcmmsrbyz-tishi").show();
			return;
		}
		var sendJson = {
			"b": [{
				"deviceNo.s": commonJson.udId, //设备编号
				"workAddress.s": commonJson.workAddress, //地址
				"userId.s": commonJson.adminCount, //用户名
				"password.s": pwnPassword, //用户新密码
				"oldPwd.s": pwnName, //用户旧密码
				"lastLoginIp.s": '' //最后登陆IP
			}]
		};
		showLoader('修改密码...');

		changePwd(sendJson, function(msg) { //修改密码
			hideLoader();
			changePwnOk(msg);
		}, function(err) {
			hideLoader();
			funFail(err);
		});

	});

	function changePwnOk(msg) {
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		if (responseCode[0].results == "00") {
			$(".xiugaimima-mima").hide();
			showTags({
				'title': '提示',
				'content': "密码修改成功！",
				'ok': {
					fun: function() {
						$(".xiugaimima-mima").hide();
//						$.mobile.changePage('../index.html');
					}
				}
			});
		}
		else {
			if (responseCode[0].results == "08") {
			hideLoader();
		} else{
			if (responseCode[0].results == '01'){
				$("#qsrysmm-value").val("");
			}
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
		};
	}

	$(".yewujob-navigation-con li").unbind().on("click", function() { //业务详情选中状态
		$(".yewujob-navigation-con li").removeClass("yewujob-navigation-bgcolor");
		$(this).addClass("yewujob-navigation-bgcolor");
		var radialObj = $('#indicatorContainer').data('radialIndicator');
		var curProgress = radialObj.value();
		var yeIndex = $(".yewujob-navigation-con li").index($(this));
		// if (yeIndex == '2' || yeIndex == '3' || yeIndex == '4') {
		// 	radialObj.option('maxValue', 1000000);
		// 	var count = $(this).find('.yewujob-navigation-number').attr('bussAmount');
		// 	$('#indicatorContainer .banlishuliang-con').html('办理金额');
		// 	if (count == undefined) {
		// 		radialObj.value(0, 1);
		// 	} else {
		// 		radialObj.value(count, 1); //中间和圆环变化的值
		// 	}
		// } else {
			radialObj.option('maxValue', 100);
			var count = $(this).find('.yewujob-navigation-number').html();
			$('#indicatorContainer .banlishuliang-con').html('办理数量');
			if (count == undefined) {
				radialObj.value(0, 0);
			} else {
				radialObj.value(count, 0); //中间和圆环变化的值
			}
		//}

	});

	function yejichaxunStar() {
		//首页本月业绩查询
		var queryDate = myTime.curDate();
		var queryTime;
		var queryY = queryDate.getFullYear(); //年
		var queryM = queryDate.getMonth() < 9 ? '0' + (queryDate.getMonth() + 1) : queryDate.getMonth() + 1; //月
		queryTime = '' + queryY + queryM;
		var yearmonth = queryY + "-" + queryM;
		//		alert(queryTime);
		hideLoader();
		showLoader('加载中...');
		var queryJson = {
			"b": [{
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"orgId.s": commonJson.orgId, //机构号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"bussDateType.s": '1', //时间段类型1、3、6、12 月 季度 半年 年
				"bussPeriod.s": queryTime, //时间段201509
				
				//脱机数量
				"moduleId.s": workbenchJson.moduleID, //模块编号
				"tranId.s": workbenchJson.tranId2, //交易编号
				"masCardName.s": "", //客户姓名
				"certNum.s": "", //证件号
				"bussType.s": "", //业务类型
				"stime.s": "", //办理开始时间
				"etime.s": "", //办理结束时间
				"handleState.s": "", //业务处理状态
				"pageSize.s": "",
				"pageNo.s": "",
				
				//通知公告
				"page.s": "1",//页数
				//交易提醒
				"searchDate.s": yearmonth, //查询日期
				"searchContent.s": '', //搜索内容
				"isLoginNow.s": 'false' //是否是登陆时查询
				
			}]
		};

		ISysUserServiceStatisticsFun(queryJson, function(msg) {
			hideLoader();
			usrStatistic.offlineCount = '';
			usrStatistic.isSucess = '';
			usrStatistic.noticeCount = '';
			usrStatistic.alertAry = [];
			iBussinessMetricsServiceLoginSucc(msg);
			goon = true;
		}, function(err) {
			hideLoader();
			usrStatistic.isSucess = '99';
			funFail(err);
		})
	}





	/*首页本月业绩查询  成功回调*/
	function iBussinessMetricsServiceLoginSucc(msg) {
		//G20151119
//		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		//$("#gongzuotai-myResults .myResults-name-zhi").text('');
		//$("#gongzuotai-myResults .myResults-paiming").text('');
		if (responseCode[0].results == "00") { //
			usrStatistic.isSucess = '00';
			var offlineCount = responseCode[0]['offlineCount.i'];
			if(offlineCount){
				usrStatistic.offlineCount = offlineCount;
			}else{
				usrStatistic.offlineCount = '-1';
			}
			var noticeCount = responseCode[0]['noticeCount.i'];
			if(noticeCount){
				usrStatistic.noticeCount = noticeCount;
			}else{
				usrStatistic.noticeCount = '-1';
			}
			$.each(responseCode, function(index, val) {
				if (index == 0) return;
				if(val.jobAlerts != undefined && val.jobAlerts != null){
					var jobAlert = val.jobAlerts[0];
					if(jobAlert != undefined && val.jobAlerts != null){
						usrStatistic.alertAry.push({
							'date': jobAlert.REMIND_DATE,
							'time': jobAlert.START_TIME + ' - ' + jobAlert.END_TIME,
							'event': jobAlert.REMIND_CONTENT
						});
					}
				}
				if(val.bussiMetric == undefined || val.jobAlerts == null){
					return;
				}
				switch (val.bussiMetric[0].bussType) {
					case "01":
						{ //电子卡
							$("#after-login .yewujob-navigation-number:eq(1)").text(val.bussiMetric[0].bussTimesCount);
							break;
						}
					case "02":
						{ //信用卡
							$("#after-login .yewujob-navigation-number:eq(0)").text(val.bussiMetric[0].bussTimesCount);
							var radialObj = $('#indicatorContainer').data('radialIndicator');
							var curProgress = radialObj.value();
							radialObj.value(val.bussiMetric[0].bussTimesCount, 0); //中间和圆环变化的值
							break;
						}
					case "03":
						{ //申请贷款
							$("#after-login .yewujob-navigation-number:eq(2)").text(val.bussiMetric[0].bussTimesCount).attr('bussAmount', val.bussiMetric[0].bussAmount);
							break;
						}
					case "27":
						{ //购买理财
							$("#after-login .yewujob-navigation-number:eq(3)").text(val.bussiMetric[0].bussTimesCount).attr('bussAmount', val.bussiMetric[0].bussAmount);
							break;
						}
					case "2":
						{ //购买基金
							$("#after-login .yewujob-navigation-number:eq(4)").text(val.bussiMetric[0].bussTimesCount).attr('bussAmount', val.bussiMetric[0].bussAmount);
							break;
						}
					case "10":
						{ //电子渠道
							$("#after-login .yewujob-navigation-number:eq(5)").text(val.bussiMetric[0].bussTimesCount);
							break;
						}
					case "58":
					{ //视频拍摄
						$("#after-login .yewujob-navigation-number:eq(6)").text(val.bussiMetric[0].bussTimesCount);
						break;
					}
					case "62":
					{ //积分兑换
						$("#after-login .yewujob-navigation-number:eq(7)").text(val.bussiMetric[0].bussTimesCount);
						break;
					}
					case "63":
					{ //积分订单
						$("#after-login .yewujob-navigation-number:eq(8)").text(val.bussiMetric[0].bussTimesCount);
						break;
					}
					case "68":
					{ //特惠商户
						$("#after-login .yewujob-navigation-number:eq(9)").text(val.bussiMetric[0].bussTimesCount);
						break;
					}
					case "65":
					{ //社保待遇
						$("#after-login .yewujob-navigation-number:eq(10)").text(val.bussiMetric[0].bussTimesCount);
						break;
					}
					case "66":
					{ //特色产品
						$("#after-login .yewujob-navigation-number:eq(11)").text(val.bussiMetric[0].bussTimesCount);
						break;
					}
					case "71":
					{ //小微贷款
						$("#after-login .yewujob-navigation-number:eq(12)").text(val.bussiMetric[0].bussTimesCount);
						break;
					}
					case "72":
					{ //面签
						$("#after-login .yewujob-navigation-number:eq(13)").text(val.bussiMetric[0].bussTimesCount);
						break;
					}
					case "53":
					{ //征信查询
						$("#after-login .yewujob-navigation-number:eq(14)").text(val.bussiMetric[0].bussTimesCount);
						break;
					}
					case "81":
					{ //信用贷款
						$("#after-login .yewujob-navigation-number:eq(15)").text(val.bussiMetric[0].bussTimesCount);
						break;
					}
				}
			});
			tuojirenyewuSL();
		} else if (responseCode[0].results == "08") {
			usrStatistic.isSucess = '08';
			yejichaxunStar();
		} else {
			usrStatistic.isSucess = '01';
			tuojirenyewuSL();
		}

		//		var jobCalendar = new JobCalendar();
		//		jobCalendar.showCalendar();
		//		tuojirenyewuSL();
	}



});

function loginOutFun(successBackFun) {
	showLoader('退出登陆中...');
	var bodyJson = {
		"b": [{
			"deviceNo.s": commonJson.udId, //设备编号
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": "",
			"userId.s": commonJson.adminCount

		}]
	};
	loginOut(bodyJson, function(msg) { //退出登录
		loginoutSucc(msg);
	}, function(err) {
		hideLoader();
		showTags({
			'title': '提示',
			'content': '签退超时,是否继续?',
			'ok': {
				title:'强制退出',
				fun:function () {
					Menu.init = false;
					$.mobile.changePage('../index.html');
				}
			},
			'cancel':{
				title:'继续',
				fun:function () {
					// setTimeout(function () {
						loginOutFun(successBackFun);
					// },300);
					
				}
			}
		});


	});
}

function loginoutSucc(msg) { //联机情况退出登录
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	BackAttr.moduleID = '-1';
	if (responseCode[0].results == "00") {
		hideLoader();
		Menu.init = false;
		$.mobile.changePage('../index.html');
	}else if(responseCode[0].results == "08"){
		hideLoader();
	} else{
		hideLoader();
		showTags({
			'title': '提示',
			'content': '签退超时,是否继续?',
			'ok': {
				title:'强制退出',
				fun:function () {
					Menu.init = false;
					$.mobile.changePage('../index.html');
				}
			},
			'cancel':{
				title:'继续',
				fun:function () {
					// setTimeout(function () {
					loginOutFun(loginoutSucc);
					// },300);

				}
			}
		});

	}
}