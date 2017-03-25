(function(){

//我们的银行四个页面(上下swiper)
var swiperTwoOne = null,
	swiperTwotwo = null,
	swiperTwothree = null,
	swiperTwofour = null;
//我们的银行的第一个上下swiper的(左右swiper)
var swiperTwoOneHorizontal = null,
	swiperTwoTwoHorizontal = null,
	swiperTwoThreeHorizontal = null,
	swiperTwoFourHorizontal = null;
/**
 *丁宗花-2015-9-24
 */
//首页登陆-(login.html)
$(document).on("pageshow", "#home-login", function() {
//		alert("pageshow");
//		alert("getCurrentVersion start");
	var i = setInterval(function() {
		getCurrentVersion('', function(vision) {
			clearInterval(i);
			$("#banbenhao").html(vision);
		}, function() {
			clearInterval(i);
		});
	}, 200);
//	alert("getCurrentVersion success");

	if (workbenchJson.sT != undefined) {
		workbenchJson.sT = undefined;
	}
	if (workbenchJson.eT != undefined) {
		workbenchJson.eT = undefined;
	}
	if (commonJson.loginTime != undefined) {
		commonJson.loginTime = undefined;
	}

	//setTimeout(function() {
	//	var picWord = new PicWord();
	//		picWord.padPushDataCache();
	//	}, 1000);

	$("#login-name").val("");
	$("#login-password").val("");
	$(".input-renlianshibie").val("");
	$(".wodeyinhang-zy").css('display', "none");
	$(".wodeyinhang-zy").css('display', "none")

	//	function tuojirenyewuSL(){
	//		showLoader('加载中...');
	//              var sendJson = {
	//                  "b": [{
	//                      "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
	//                      "deviceNo.s": commonJson.deviceNo, //设备编号
	//                      "orgId.s": commonJson.orgId,
	//                      "moduleId.s": creditJson.moduleID, //模块编号
	//                      "tranId.s": creditJson.tranId, //交易编号
	//                      "operatorNo.s": commonJson.adminCount, //操作员
	//                      "workAddress.s": commonJson.workAddress, //工作地址
	//                      "masCardName.s": "", //客户姓名
	//                      "certNum.s": "", //证件号
	//                      "bussType.s": "", //业务类型
	//                      "stime.s": "", //办理开始时间
	//                      "etime.s": "", //办理结束时间
	//                      "handleState.s": "", //业务处理状态
	//                      "pageSize.s": "",
	//                      "pageNo.s": ""
	//                  }]
	//              };
	//              ptQueryOfflineBussFun(sendJson, function(msg) {
	//                  hideLoader();
	//                  msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	//                  var responseObj = JSON.parse(msg);
	//                  var responseCode = responseObj.b;
	////                  var tuojiPtLtNum = 0;
	//                  if (responseCode[0].results == "00") {
	//                      responseCode.shift();
	//                      $.each(responseCode, function(index, val) {
	//                          var returnState = val.queryCardOfflineBuffModel[0].HANDLESTATE;
	//                          if (returnState != '06') return true;
	////                          tuojiPtLtNum++;
	//                          commonJson.tuojiPtLtNum++
	//                      })
	//                        
	//                     
	//                  } else {
	//                      if (responseCode[0].results == '03') {
	//                         commonJson.tuojiPtLtNum=0;
	//                      } else {
	//                          showTags({
	//                              'title': '提示',
	//                              'content': responseCode[0].message,
	//                              'ok': {}
	//                          });
	//                      }
	//                     
	//                  }
	//              }, function(err) {
	//                  funFail(err);
	//              })
	//	}

	$("#login-denglu").unbind().on("click", function() { //点击用户名&密码的登陆
		var loginName = document.getElementById("login-name").value;
		var loginPassword = document.getElementById("login-password").value;
		if (loginName == "") {
			showTags({
				'title': '提示',
				'content': "用户名不能为空。",
				'ok': {}
			});
			return;
		}
		if (loginPassword == "") {
			showTags({
				'title': '提示',
				'content': "密码不能为空。",
				'ok': {}
			});
			return;
		}
		//更新文件路径
		updateFilepath('', function(msg) {
			//alert(msg);
			MT_path = msg;

		})
		//获取设备唯一标识
		getUdid('', function(msg) {
			commonJson.udId = msg;
			//获取是否联网
			Meap.isNetConnect(function(msg) {
				var valName = document.getElementById("login-name").value;
				var textSameValue = valName.replace(/\s/g,"");
				if (msg == '03') {
					if ($('#login-password').val() == OFFLINEPWD) { //校验脱机登陆默认密码
						showTags({
							'title': '提示',
							'content': '网络异常,将切换到脱机模式办理业务,是否继续?<span style="color:red; font-size:20px;">请确认用户名:' + textSameValue + '</span>',
							'ok': {
								'title': '继续办理', //非必输  默认值：确认
								'fun': function() { //非必输  如果输入则执行此函数
									// var textSameValue = $.trim(document.getElementById("login-name").value);
									commonJson.adminCount = textSameValue; //
									commonJson.SPRNUM = '';
									commonJson.offlineOnline = 'offline';
									$.mobile.changePage('page/main.html', {
										reloadPage: true
									});
								}
							},
							'cancel': {
								'title': '终止办理', //非必输  默认值：取消
								'fun': function() { //非必输  如果输入则执行此函数
									hideTags(); //关闭提示信息
									$("#login-name").val("");
									$("#login-password").val("");
									$(".input-renlianshibie").val("");
								}

							}
						});
					} else {
						showTags({
							'title': '提示',
							'content': '密码错误!',
							'ok': {}
						});
					}
				} else {
					showLoader('登陆中...');
					Meap.getCurrentLocationAddress('', function(msg) {
						msg = JSON.parse(msg);
						commonJson.workAddress = msg.FormattedAddressLines[0];
						commonJson.workCountry = msg.Country;
						commonJson.workState = msg.State;
						commonJson.workCity = msg.City;
						commonJson.workSubLocality = msg.SubLocality;
						getCurrentVersion('', function(vision) {
							commonJson.offlineOnline = 'online';
							//点击事件代码
							var loginName = document.getElementById("login-name").value;
							var loginPassword = document.getElementById("login-password").value;
							var bodyJson = {
								"b": [{
									"deviceNo.s": commonJson.udId, //设备编号
									"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
									"workAddress.s": "",
									"userId.s": loginName,
									"userPwd.s": loginPassword,
									"lastLoginIP.s": "",
									"APP_VISION.s": vision
								}]
							};
							login(bodyJson, function(msg) {
								loginSucc(msg);
							}, function(err) {
								hideLoader();
								funFail(err);
							});
						}, function() {
							hideLoader();
							showTags({
								'title': '提示',
								'content': '获取版本失败！',
								'ok': {}
							});
						});
					}, function(err) {
						hideLoader();
						showTags({
							'title': '提示',
							'content': err,
							'ok': {}
						});
					});
				}
			}, function(err) {});

		}, function(err) {

		})
	});

	function loginSucc(msg) { //登录成功回调时候的提示信息
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		if (responseCode[0].results == "00") {
			var loginnoticeCount = responseCode[0]["noticeCount.i"];
			commonJson.noticeCount = loginnoticeCount;
			var loginJson = responseCode[1].sysUserVO[0];
			commonJson.adminCount = loginJson.userId; //
			commonJson.TLRNAME = loginJson.realName; //
			commonJson.orgId = loginJson.orgId; //二级机构
			commonJson.superOrgId = loginJson.superOrgId; //一级机构
			commonJson.superOrgName = loginJson.superOrgName;	//一级机构名称
			commonJson.TLRCELLPHONE = loginJson.cellPhone; //电话号码
			commonJson.SPRNUM = loginJson.creditUserId; //gonghao
			commonJson.roleId = loginJson.roleId; //
			commonJson.fundCmanagerId = loginJson.fundCmanagerId; //基金客户经理
			commonJson.mySex = loginJson.sex; //头像性别
			commonJson.ifsCManagerId = loginJson.ifsCManagerId; //客户经理
			commonJson.crmUserId = loginJson.crmUserId; //crm
			commonJson.idCardNo = loginJson.idCardNo; //身份证号码
			commonJson.losUserId = loginJson.losUserId; //Los用户
			commonJson.loginTime = loginJson.lastLoginTime; //登录时间
			commonJson.tinyLoanUserId = loginJson.tinyLoanUserId; //小贷系统
			//2016.05.10新增
			commonJson.orgName = loginJson.orgName;//机构名
			//2016.06.02新增
			commonJson.roleLevel = loginJson['roleLevel.i'];
			//2016.07.27
			commonJson.rpmUserId = loginJson.rpmUserId;		//rpm用户ID
			commonJson.cipUserId = loginJson.cipUserId;		//征信用户ID
			loginAttr.proType = '01';
			queryTableDataByConditions({
				"databaseName": "myDatabase", //数据库名
				"tableName": "up_download_info" //表名
			}, function(msg) {
				if(msg.length > 0){
					hideLoader();
					showTags({
						'title': '提示',
						'content': "当前还有<span style='color:red; font-size:20px;'>" + msg.length  + "</span>笔影像未上传",
						'ok': {
	//						title: '确定		',
	                      fun: function() {
	                          $.mobile.changePage('page/main.html');
	                      }
						}
					});
				}else{
					$.mobile.changePage('page/main.html');
				}
			}, function(err) {
				$.mobile.changePage('page/main.html');
			});
			//			if (loginJson.lastLoginTime == '') {
			//				$("#qsrysmm-valueone").val('');
			//				$("#xmm-valueone").val('');
			//				$("#qrxmm-valueone").val('');
			//				$(".lcmmsrbyz-tishi").hide();
			//				$(".after-head-xialaall").hide();
			//				$(".xiugaimima-mimalogin").show();
			//			} else {

			//				var aboutJson = {      //发送请求的参数
			//			        "b": [{
			//			            "deviceNo.s": commonJson.udId, //设备编号
			//			            "moduleId.s": workbenchJson.moduleID, //模块名
			//			            "tranId.s": workbenchJson.tranId2, //交易编号
			//			            "orgId.s": commonJson.orgId,//机构号commonJson.orgId
			//			            "operatorNo.s": commonJson.adminCount,//操作员commonJson.adminCount
			//			            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
			//			            "workAddress.s": commonJson.workAddress//工作地址
			//			        }]
			//			    };
			//			    queryNotUploadFileCountFun(aboutJson, function(msg) {
			//                  queryNotUploadFileCountSucc(msg);
			//              }, function(err) {
			//                  funFail(err);
			//              });
			//$.mobile.changePage('page/main.html');
			$("#login-name").val("");
			$("#login-password").val("");
			$(".input-renlianshibie").val("");
			//			hideLoader();
			//				tuojirenyewuSL();
			//			}
			//			hideLoader();

		} else {
			if (responseCode[0].results == '300') {
				hideLoader();
				$("#qsrysmm-valueone").val('');
				$("#xmm-valueone").val('');
				$("#qrxmm-valueone").val('');
				$(".lcmmsrbyz-tishi").hide();
				$(".after-head-xialaall").hide();
				$(".xiugaimima-mimalogin").show();
				$("#shoucidenglu-mimaguoqu").html("密码过期请修改密码");
			} else if (responseCode[0].results == '305') {
				hideLoader();
				$("#qsrysmm-valueone").val('');
				$("#xmm-valueone").val('');
				$("#qrxmm-valueone").val('');
				$(".lcmmsrbyz-tishi").hide();
				$(".after-head-xialaall").hide();
				$(".xiugaimima-mimalogin").show();
				$("#shoucidenglu-mimaguoqu").html("首次登录请修改密码");
			} else {
				hideLoader();
				if (responseCode[0].results == '306'){
					$("#login-password").val("");
				}
				showTags({
					'title': '提示',
					'content': responseCode[0].message,
					'ok': {}
				});
			}

		}

	}
//	function queryNotUploadFileCountSucc(msg){
//		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//			var responseObj = JSON.parse(msg);
//			var responseCode = responseObj.b;
//			if (responseCode[0].results == "00"|| responseCode[0].results == "03") {
//				hideLoader();
//	//			 alert(responseCode[0]['count.i']);
//				if(responseCode[0]['count.i'] != '0'){
//					showTags({
//						'title': '提示',
//						'content': "当前还有<span style='color:red; font-size:20px;'>" + responseCode[0]['count.i']  + "</span>笔影像未上传",
//						'ok': {
//	//						title: '确定		',
//	                      fun: function() {
//	                          $.mobile.changePage('page/main.html');
//	                      }
//						}
//					});
//				}else{
//					$.mobile.changePage('page/main.html');
//				}
//			}else{
//				hideLoader();
//					showTags({
//						'title': '提示',
//						'content': responseCode[0].message,
//						'ok': {
//	//						title: '确定		',
//	                      fun: function() {
//	                          $.mobile.changePage('page/main.html');
//	                      }
//						}
//					});
//			}
//	}

	$("#login-name").unbind().on("click", function() {
		$("#login-password").val("");
	});

	$('.input-renlianshibie').unbind().on('keyup', function() { //人脸识判断客户号有没有输入
		var _val = $(this).val();
		if (_val.length) {
			$('.name-login-caiji').addClass('login-caiji-bg');

		} else {
			$('.name-login-caiji').removeClass('login-caiji-bg');

		}
	})
	var isFirst = false;
	$(".name-login-caiji").unbind().on("click", function() { //人脸识别
		//		alert(isFirst);
		//	if(!isFirst){
		//		isFirst = true;
			//获取设备唯一标识
		getUdid('', function(msg) {
			commonJson.udId = msg;
		}, function(err) {

		});
		var textSameValue = $('.input-renlianshibie').val();
		//  	 alert(textSameValue);
		//		var myDate = new Date();获取时间
		//		var nianYueRi = myDate.getFullYear() + "" + myDate.getMonth() + "" + myDate.getDate();年月日
		//		var shiFenMiao = myDate.getHours() + "" + myDate.getMinutes() + "" + myDate.getSeconds();时分秒
		//		alert(shiFenMiao);
		if ($(".name-login-caiji").hasClass("login-caiji-bg")) {
			getUdid('', function(msg) {
				commonJson.udId = msg;
				//获取是否联网
				Meap.isNetConnect(function(msg) {
					if (msg == '03') {
						showTags({
							'title': '提示',
							'content': '网络异常，请使用密码登录',
							'ok': {}
						});
						//						showTags({
						//							'title': '提示',
						////							'content': '网络异常,将切换到脱机模式办理业务,是否继续?请确认工号:'+document.getElementById("input-gonghao").value,
						//							'content': '网络异常请切换到用户名登录',
						//							'ok': {
						//								'title': '终止办理' //非必输  默认值：确认
						//								//'fun': function() { //非必输  如果输入则执行此函数
						////									var textSameVaLue= $.trim(document.getElementById("input-gonghao").value);
						////									commonJson.SPRNUM = textSameVaLue; //
						////									commonJson.adminCount = ''; //
						////									$.mobile.changePage('page/main.html', {
						////										reloadPage: true
						////									});
						//									//hideTags(); //关闭提示信息
						//								}
						//							});//,
						//							//'cancel': {
						//	'title': '终止办理', //非必输  默认值：取消
						//	'fun': function() { //非必输  如果输入则执行此函数
						//		//hideTags(); //关闭提示信息
						//	}

						//	}
						//});
					} else {
						showLoader('登陆中...');
						Meap.getCurrentLocationAddress('', function(msg) {
							msg = JSON.parse(msg);
							commonJson.workAddress = msg.FormattedAddressLines[0];
							commonJson.workCountry = msg.Country;
							commonJson.workState = msg.State;
							commonJson.workCity = msg.City;
							commonJson.workSubLocality = msg.SubLocality;
							commonJson.offlineOnline = 'online';
							//点击事件代码
							faceDistinguish('', function(msg) {
								//creditImageAcquisition.imgSrc = msg;
								//				    		alert(creditImageAcquisition.imgSrc)
								var sendJson = {
									"b": [{
										"deviceNo.s": commonJson.udId, //设备编号
										"moduleId.s": "0", //模块名
										"tranId.s": "0", //交易名
										"orgId.s": "", //机构号
										"operatorNo.s": textSameValue, //操作员
										"OPERATOR_NO.s": textSameValue, //业务经办人工号
										"TRANS_SEQ_NO.s": "", //交易流水号
										"TRANS_DATE.s": "", //交易日期
										"TRANS_TIME.s": "", //交易时间
										"TRANS_SCENE.s": "0003", //交易场景
										"COMPARE_TYPE.s": "1", //对比类型
										"WS_TYPE.s": "2", //终端类型
										"WSNO.s": commonJson.udId, //终端号
										"VERSION.s": "v1.1.4", //当前控件版本
										"TRANS_CHANWEL.s": "301", //渠道
										"TRANS_DEP_NO.s": "", //所属一级支行
										"TRANS_SUB_NO.s": "", //所属二级支行
										"ID_CARD.s": "", //身份证号码
										"IMG_BASE.s": msg, //creditImageAcquisition.imgSrc, //现场照片
										"CRYPT_TYPE.s": "0", //图像是否经过加密
										"ID_IMG_BASE.s": "", //联网核查照片
										"CARD_IMG_BASE.s": "" //芯片照片
									}]
								};
								ifacelRecognitionSeFun(sendJson, function(msg) { //用户人脸识别
									renLianShiBie(msg);
								}, function(err) {
									hideLoader();
									funFail(err);
								});
							}, function(err) {
								hideLoader();
							});

						}, function(err) {
							hideLoader();
							showTags({
								'title': '提示',
								'content': err,
								'ok': {}
							});
						});

					}
				}, function(err) {});

			}, function(err) {

			})

		}
		//	}

	});

	function renLianShiBie(msg) { //	人脸识别登录成功回调时候的提示信息
		hideLoader();
		msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		var responseObj = JSON.parse(msg);
		var responseCode = responseObj.b;
		if (responseCode[0].results == "0") {
			var renlianBiDuiOne = responseCode[1].photoCompareVO[0];
			var renlianBiDui = responseCode[2].userVO[0];
			var loginnoticeCount = responseCode[0]["noticeCount.i"];
			commonJson.noticeCount = loginnoticeCount;
			if (renlianBiDuiOne.TMPL_RESULT == "0") {
				commonJson.mySex = renlianBiDui.sex; //头像性别
				commonJson.adminCount = renlianBiDui.userId; //
				commonJson.TLRNAME = renlianBiDui.realName; //
				commonJson.orgId = renlianBiDui.orgId; //二级机构
				commonJson.superOrgId = renlianBiDui.superOrgId; //一级机构
				commonJson.superOrgName = renlianBiDui.superOrgName;	//一级机构名称
				commonJson.TLRCELLPHONE = renlianBiDui.cellPhone; //电话号码
				commonJson.SPRNUM = renlianBiDui.creditUserId; //gonghao
				commonJson.roleId = renlianBiDui.roleId; //
				commonJson.fundCmanagerId = renlianBiDui.fundCmanagerId; //基金客户经理
				commonJson.ifsCManagerId = renlianBiDui.ifsCManagerId; //客户经理
				commonJson.crmUserId = renlianBiDui.crmUserId; //crm 
				commonJson.idCardNo = renlianBiDui.idCardNo; //身份证号码
				commonJson.losUserId = renlianBiDui.losUserId; //Los用户
				commonJson.loginTime = renlianBiDui.lastLoginTime; //登录时间
				//2015.05.10新增
				commonJson.orgName = renlian.orgName;//机构名称
				
				commonJson.tinyLoanUserId = renlianBiDui.tinyLoanUserId; //小贷系统
				//2016.06.02新增
				commonJson.roleLevel = renlianBiDui['roleLevel.i'];
				//2016.07.27
				commonJson.rpmUserId = renlianBiDui.rpmUserId;		//rpm用户ID
				commonJson.cipUserId = renlianBiDui.cipUserId;		//征信用户ID
				loginAttr.proType = '01';
				//			//						    	alert(renlianBiDui.TMPL_RESULT);
				hideLoader();
				$.mobile.changePage('page/main.html');
				$("#login-name").val("");
				$("#login-password").val("");
				$(".input-renlianshibie").val("");
				//				tuojirenyewuSL();
			} else {
				hideLoader();
				showTags({
					'title': '提示',
					'content': '人脸对比失败！',
					'ok': {}
				});
				//				alert("失败")
			};
		} else {
			//		
			hideLoader();
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		};

	};

	//第一屏登陆人脸识别切换
	$(".name-login").unbind().on("click", function() { //点击用户名登陆
		$(this).removeClass("login-renlian-cgone").siblings(".login-renlian").addClass("login-renlian-cg");
		$(".name-login-con .name-login-one").eq(0).show();
		$(".name-login-con .name-login-one").eq(1).hide();
	});
	$(".login-renlian").unbind().on("click", function() { //点击人脸识别
		showTags({
			'title': '提示',
			'content': '系统维护中',
			'ok': {}
		});
		//		$(this).removeClass("login-renlian-cg").siblings(".name-login").addClass("login-renlian-cgone");
		//		$(".name-login-con .name-login-one").eq(0).hide();
		//		$(".name-login-con .name-login-one").eq(1).show();
	});
	//第一屏返回列表
	$(".fanhuiliebiao-click").unbind().on("click", function() { //点击切换到返回列表页面
		$(".login-noe-left-contwo").show();
		$(".login-noe-left-con").hide();
		return false;
	});

	$(".fanhuiliebiao-li").unbind().on("click", function() { //我们的银行下拉
		var fanhuiliebiaoIndex = $(".fanhuiliebiao-li").index($(this));
		var clickFanhuiliebiao = $(".wodeyinhang-con").eq(fanhuiliebiaoIndex);
		if (clickFanhuiliebiao.css("display") == "none") {
			clickFanhuiliebiao.show().siblings(".wodeyinhang-con").hide();
			$(this).children(".arrow_icon").attr("src", "images/arrow_icontwo.png");
			$(this).siblings("li").children(".arrow_icon").attr("src", "images/arrow_icon.png");
			$(this).siblings("li").children(".arrow_icon").css({
				"width": "6px",
				"top": "17px"
			});
			$(this).children(".arrow_icon").css({
				"width": "11px",
				"top": "21px"
			});
		} else {
			clickFanhuiliebiao.hide().siblings(".wodeyinhang-con").hide();
			$(this).children(".arrow_icon").attr("src", "images/arrow_icon.png");
			$(".arrow_icon").css({
				"width": "6px",
				"top": "17px"
			});
		}
	});

	$(".denglu-click").unbind().on("click", function() { //点击返回列表页面的登陆
		$(".login-noe-left-contwo").hide();
		$(".login-noe-left-con").show();
		return false;
	});

	$(".wodeyinhang-zy>a").unbind().on("click", function() {
		loginAttr.proType = $(this).attr('data-id');
		$.mobile.changePage('page/about/about-showIndustry.html');
	});

	$(function(){
		//第一屏右边内容 左右划屏效果
		var swiperTwo = null;
		swiperTwo = new Swiper('.swiper-containertwo', {
			pagination: '.swiper-paginationtwo',
			paginationClickable: true,
			spaceBetween: 30,
			noSwiping: false,
		});

		//上下划屏效果
		var mainswiper = new Swiper('.swiper-containerone', {
			paginationClickable: true,
			direction: 'vertical',
			spaceBetween: 30,
			touchRatio: 0.2,
			onSlideChangeEnd: function() {
				if (mainswiper.activeIndex == 1) {
					var inited = false;			//是否已经初始化
					$('.login-two-neirongall .containerTwoWrapper').each(function(index, element){
						if($(element).hasClass('initOurBankInfo')){
							inited = true;
							return;
						}
					});
					if(!inited){	//未初始化则显示银行介绍
						WoMenDeYinHangStay('01');
						$(".login-two-foot>li").eq(0).addClass("login-two-foot-bg").siblings("li").removeClass("login-two-foot-bg");
						$('.login-two-neirongall').eq(0).show().siblings('.login-two-neirongall').hide();
					}
				}
			}
		});

		//点击登录回到第一个划屏页面的登录
		$(".please-login-con").unbind('click').on("click", function() {
			mainswiper.slideTo(0); //切换到第一个slide
			$("#login-name").val("");
			$("#login-password").val("");
			$(".input-renlianshibie").val("");
			$(".login-noe-left-contwo").hide();
			$(".login-noe-left-con").show();
			$('.login-rlsb-con li').eq(0).removeClass('login-renlian-cgone').siblings().addClass('login-renlian-cg');
			$(".name-login-con .name-login-one").eq(0).show();
			$(".name-login-con .name-login-one").eq(1).hide();
			// $(".login-two-foot>li").eq(0).addClass("login-two-foot-bg").siblings("li").removeClass("login-two-foot-bg");
			// $('.login-two-neirongall').eq(0).show().siblings('.login-two-neirongall').hide();
		});

		//我们的银行列表点击事件
		$('.wodeyinhang-yh a').on('click', function() {
			var _index = $(this).index();
			mainswiper.slideNext(false, 500);
			$(".login-two-foot>li").eq(_index).addClass("login-two-foot-bg").siblings("li").removeClass("login-two-foot-bg");
			var loginTwoNeirongall = $('.login-two-neirongall').eq(_index);
			if(!(loginTwoNeirongall.find('.swiper-wrapper').hasClass('initOurBankInfo'))){
				WoMenDeYinHangStay('0' + (_index + 1));
			}
			loginTwoNeirongall.show().siblings().hide();
			switch(_index){
				case 0 : swiperTwoOne.slideTo(0);swiperTwoOneHorizontal.slideTo(0);break;
				case 1 : swiperTwotwo.slideTo(0);swiperTwoTwoHorizontal.slideTo(0);break;
				case 2 : swiperTwothree.slideTo(0);swiperTwoThreeHorizontal.slideTo(0);break;
				case 3 : swiperTwofour.slideTo(0);swiperTwoFourHorizontal.slideTo(0);break;
				default : break;
			}
		});
	});

}).on('pageinit', "#home-login", function() {
//		alert("pageinit");

	$("#submitted-successfullyone-btn").on("click", function() { //取消修改密码
		$(".xiugaimima-mimalogin").hide();
	});
	$("#qrxmm-valueone").on("click", function() {
		$(".lcmmsrbyz-tishi").hide();
	});
	$("#xiugaimimaone-ok").on("click", function() { //确认修改密码
		var pwnName = document.getElementById("qsrysmm-valueone").value;
		var pwnPassword = document.getElementById("xmm-valueone").value;
		var pwnxinPassword = document.getElementById("qrxmm-valueone").value;
		var loginName = document.getElementById("login-name").value;
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
		var re = new RegExp("^(?=.*[0-9])(?=.*[a-zA-Z])(?=[a-zA-Z0-9]+$).{6,10}$");
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
				'content': "新密码不可与原密码相同",
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
				"userId.s": loginName, //用户名
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
			$(".xiugaimima-mimalogin").hide();
			showTags({
				'title': '提示',
				'content': "密码修改成功，是否直接登录?",
				'ok': {
					'title': '放弃', //非必输  默认值：取消
					'fun': function() { //非必输  如果输入则执行此函数
						$("#login-name").val("");
						$("#login-password").val("");
					}
				},
				'cancel': {
					'title': '继续', //非必输  默认值：取消
					'fun': function() { //非必输  如果输入则执行此函数
						$("#login-password").val($("#xmm-valueone").val());
						$("#login-denglu").click();
					}
				}
			});
		} else {
			if (responseCode[0].results == '01'){
				$("#qsrysmm-valueone").val("");
			}
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
		}
	}
	//		changePwd(sendJson, function(msg) { //用户人脸识别
	//			hideLoader();
	//			alert(msg);
	//		}, function(err) {
	//			hideLoader();
	//			funFail(err);
	//		});
	//	});
	$(function() {
		//第二屏第一个上下屏滑动
		swiperTwoOne = new Swiper('.containerTwoOne', {
			pagination: '.paginationTwoOne',
			direction: 'vertical',
			paginationClickable: true,
			spaceBetween: 30,
			noSwiping: true,
		});
		//第二屏第三个上下屏滑动
		swiperTwothree = new Swiper('.containerTwothree', {
			pagination: '.paginationTwothree',
			direction: 'vertical',
			paginationClickable: true,
			spaceBetween: 30,
			noSwiping: true
		});
		//第二屏第二个上下屏滑动
		swiperTwotwo = new Swiper('.containerTwotwo', {
			pagination: '.paginationTwotwo',
			direction: 'vertical',
			paginationClickable: true,
			spaceBetween: 30,
			noSwiping: true,
		});
		//		//第二屏第三个左右屏滑动
		//		var swiperTwothree = null;
		//		var swiperTwothree = new Swiper('.containerTwothree', {
		//			pagination: '.paginationTwothree',
		//			direction: 'vertical',
		//			paginationClickable: true,
		//			spaceBetween: 30,
		//			noSwiping: true,
		//		});
		//第二屏第三个左右屏滑动1
		//		var swiperTwothree1 = null;
		//		var swiperTwothree1 = new Swiper('.containerTwothree1', {
		//			pagination: '.paginationTwothree1',
		//			paginationClickable: true,
		//			spaceBetween: 30,
		//			noSwiping: false,
		//		});
		//		//第二屏第三个左右屏滑动2
		//		var swiperTwothree2 = null;
		//		var swiperTwothree2 = new Swiper('.containerTwothree2', {
		//			pagination: '.paginationTwothree2',
		//			paginationClickable: true,
		//			spaceBetween: 30,
		//			noSwiping: false,
		//		});
		//第二屏第四个上下屏滑动
		swiperTwofour = new Swiper('.containerTwofour', {
			pagination: '.paginationTwofour',
			direction: 'vertical',
			paginationClickable: true,
			spaceBetween: 30,
			noSwiping: true,
		});

		$("#shiyongGongJu").unbind().on("click", function() { //调用计算器

			useCalculator('', function(msg) {

			}, function(err) {

			});
		});

		//底部菜单切换
		$('.login-two-neirongall').eq(0).show().siblings().hide();
		$('.login-two-neirongall').css('opacity', 1);

		$(".login-two-foot>li").unbind().on("click", function() {
			var foot_bg = $('.login-two-foot li').index($(this));
			var loginTwoNeirongall = $('.login-two-neirongall').eq(foot_bg);
			if(!(loginTwoNeirongall.find('.swiper-wrapper').hasClass('initOurBankInfo'))){
				WoMenDeYinHangStay('0' + (foot_bg + 1));
			}
			loginTwoNeirongall.show().siblings('.login-two-neirongall').hide();
			$(this).addClass("login-two-foot-bg").siblings("li").removeClass("login-two-foot-bg");
			switch(foot_bg){
				case 0 : swiperTwoOne.slideTo(0);swiperTwoOneHorizontal.slideTo(0);break;
				case 1 : swiperTwotwo.slideTo(0);swiperTwoTwoHorizontal.slideTo(0);break;
				case 2 : swiperTwothree.slideTo(0);swiperTwoThreeHorizontal.slideTo(0);break;
				case 3 : swiperTwofour.slideTo(0);swiperTwoFourHorizontal.slideTo(0);break;
				default : break;
			}
		});		

	});
});

//我们的银行 初始化数据
function WoMenDeYinHangStay(_idd) {
	switch(_idd){
		case '01' : $('#containerTwoOne').html('');break;
		case '02' : $('#containerTwotwo').html('');break;
		case '03' : $('#containerTwothree').html('');break;
		case '04' : $('#containerTwofour').html('');break;
		default : break;
	}
	showLoader('数据初始化中...');
	$("#womendeyinhang_0").html('');
	queryTableDataByConditions({
		"databaseName": "myDatabase", //数据库名
		"tableName": "picture_info", //表名
		"conditions": {
			"PICTYPE": "O" + _idd
		}
	}, function(data) {
		if (data != '') {
			for (var i = 0; i < data.length; i++) {
				showOurBankInfo({
					"markId": data[i].NUMBER,
					"markType": data[i].PICTYPE.substr(1),
					"activityName": data[i].PICTITLE,
					"markReferral": data[i].PICCONTENT,
					"markPicture": data[i].BIGPATH,
					"marktepPicture": data[i].BIGPIC,
					"QrcodeChar": data[i].QRCODE
				}, i+1);
			}
			hideLoader();
		} else {
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
			IOurBankServiceListFun(yinhangJson, function(msg) { //我们的银行
				womendeyinHang(msg);
			}, function(err) {
				funFail(err);
			});
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
				showOurBankInfo(k, j);
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
	} else {
		hideLoader();
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	};
};

function showOurBankInfo(k, j) {
	var swiperTmp = null;
	_roPicture = k.marktepPicture;
	_roPicture = _roPicture.replace(/\\/g, "").replace('data:image/png;base64,', '');
	if (k.markType == '04') { //当什么等于04时,转换二维码，关注我们
		var pictitle = (k.markReferral == '' || k.markReferral == null) ? '二维码' : k.markReferral;
		transformStringToImage(k.QrcodeChar, function(msg) {
			var s = ['<div class="swiper-slide"><div class="swiper-container containerTwofour' + j + '">',
				'<div class="swiper-wrapper">',
				'<div class="swiper-slide">',
				'<div class="swiper-container-same">',
				'<div class="swiper-container-sameCon">',
				'<div class="overflow-con-TwoOne">',
				'<img id="img_' + k.markId + '" src="' + msg + '" /><div class="TwoOne-neirong xinjia-markReferral">' + k.markReferral + '</div>',
				'</div></div></div></div>',
				'<div class="swiper-slide swiper-no-swiping">',
				'<div class="swiper-container-same">',
				'<div class="swiper-container-sameCon">',
				'<div class="overflow-con-TwoOne">',
				'<div class="TwoOne-title">' + pictitle + '</div>',
				'<div class="TwoOne-neirong">' + k.markReferral + '</div></div></div></div></div></div>',
				'<div class="swiper-pagination paginationTwofour' + j + '"></div></div></div>'
			].join("");
			$('#containerTwofour').append(s);
			$('#containerTwofour').addClass('initOurBankInfo');//添加已初始化标识
		}, function(err) {
			alert(err + '生成二维码失败')
		});
		swiperTmp = new Swiper('.containerTwofour' + j, {
			pagination: '.paginationTwofour' + j,
			paginationClickable: true,
			spaceBetween: 30,
			noSwiping: false,
		});
		if(j == 1){
			swiperTwoFourHorizontal = swiperTmp;
		}
	} else if (k.markType == '03') { //客户活动
		var pictitle = (k.activityName == '' || k.activityName == null) ? '客户活动' : k.activityName;

		var s = ['<div class="swiper-slide"><div class="swiper-container containerTwothree' + j + '">',
			'<div class="swiper-wrapper">',
			'<div class="swiper-slide">',
			'<div class="swiper-container-same">',
			'<div class="swiper-container-sameCon">',
			'<div class="overflow-con-TwoOne">',
			'<img id="img_' + k.markId + '" src="data:image/png;base64,' + _roPicture + '" />',
			'</div></div></div></div>',
			'<div class="swiper-slide swiper-no-swiping">',
			'<div class="swiper-container-same">',
			'<div class="swiper-container-sameCon">',
			'<div class="overflow-con-TwoOne">',
			'<div class="TwoOne-title">' + pictitle + '</div>',
			'<div class="TwoOne-neirong">' + k.markReferral + '</div></div></div></div></div></div>',
			'<div class="swiper-pagination paginationTwothree' + j + '"></div></div></div>'
		].join("");
		$('#containerTwothree').append(s);
		$('#containerTwothree').addClass('initOurBankInfo');//添加已初始化标识
		//							Meap.transFormImage(k.markId+'c', _roPicture, 'picSty', function(msg) {
		//								$("#img_"+ k.markId).attr("src", msg);
		//							}, function(err) {});
		swiperTmp = new Swiper('.containerTwothree' + j, {
			pagination: '.paginationTwothree' + j,
			paginationClickable: true,
			spaceBetween: 30,
			noSwiping: false
		});
		if(j == 1){
			swiperTwoThreeHorizontal = swiperTmp;
		}
	} else if (k.markType == '02') { //品牌宣传
		var pictitle = (k.activityName == '' || k.activityName == null) ? '品牌宣传' : k.activityName;
		var s = ['<div class="swiper-slide"><div class="swiper-container containerTwotwo' + j + '">',
			'<div class="swiper-wrapper">',
			'<div class="swiper-slide">',
			'<div class="swiper-container-same">',
			'<div class="swiper-container-sameCon">',
			'<div class="overflow-con-TwoOne">',
			'<video id="vedio_' + k.markId + '" class="vedio_' + k.markId + '" poster="data:image/png;base64,' + _roPicture + '" width="100%" height="100%" controls="controls" style="display:none;"></video>',
			'<img id="img_' + k.markId + '" src="data:image/png;base64,' + _roPicture + '" style="display:none;"/>',
			'<div id="after_div_' + k.markId + '" class="download-title" style="display:none;"></div>',
			'</div></div></div></div>',
			'<div class="swiper-slide swiper-no-swiping">',
			'<div class="swiper-container-same">',
			'<div class="swiper-container-sameCon">',
			'<div class="overflow-con-TwoOne">',
			'<div class="TwoOne-title">' + pictitle + '</div>',
			'<div class="TwoOne-neirong">' + k.markReferral + '</div></div></div></div></div></div>',
			'<div class="swiper-pagination paginationTwotwo' + j + '"></div></div></div>'
		].join("");
		$('#containerTwotwo').append(s);
		$('#containerTwotwo').addClass('initOurBankInfo');//添加已初始化标识
		downLoadFile('', '', k.markId, '5', function(msg) {
			if (msg == 'false') {
				$('#img_' + k.markId).show();
				var divObj = $('#after_div_' + k.markId);
				divObj.html('未找到该视频，点击开始下载！').show();
				divObj.click(function() {
					dowanloadVideo(k.markPicture, k.markId);
					divObj.unbind().click(function() {
						dowanloadVideo(k.markPicture, k.markId);
					});
				});
			} else if (msg.lastIndexOf('/') > 0 && k.markPicture.substr(k.markPicture.lastIndexOf('/') + 1) != msg.substr(msg.lastIndexOf('/') + 1)) {
				$('#img_' + k.markId).show();
				var divObj = $('#after_div_' + k.markId);
				divObj.html('有新视频需要更新，点击选择是否下载！').show();
				divObj.click(function() {
					showTags({
						'title': '确认',
						'content': '有新视频需要更新，是否开始下载？',
						'ok': {
							'title': '下载', //非必输  默认值：确认
							'fun': function() { //非必输  如果输入则执行此函数
								dowanloadVideo(k.markPicture, k.markId);
								divObj.unbind().click(function() {
									dowanloadVideo(k.markPicture, k.markId);
								});
							}
						},
						'cancel': {
							'fun': function() { //非必输  如果输入则执行此函数
								$('#vedio_' + k.markId).attr('src', msg).show();
								divObj.hide();
								$('#img_' + k.markId).hide();
								document.getElementById('vedio_' + k.markId).play();
							}
						}
					});
				});
			} else {
				$('#vedio_' + k.markId).attr('src', msg).show();
			}
		}, function(err) {
			alertMessage(err);
		});
		//							Meap.transFormImage(k.markId+'c', _roPicture, 'picSty', function(msg) {
		//								$(".vedio_"+ k.markId).attr("poster", msg);
		//							}, function(err) {});
		swiperTmp = new Swiper('.containerTwotwo' + j, {
			pagination: '.paginationTwotwo' + j,
			paginationClickable: true,
			spaceBetween: 30,
			noSwiping: false
		});
		if(j == 1){
			swiperTwoTwoHorizontal = swiperTmp;
		}
	} else { //银行介绍
		var pictitle = (k.activityName == '' || k.activityName == null) ? '银行介绍' : k.activityName;

		var s = ['<div class="swiper-slide"><div class="swiper-container containerTwoOne' + j + '">',
			'<div class="swiper-wrapper">',
			'<div class="swiper-slide">',
			'<div class="swiper-container-same">',
			'<div class="swiper-container-sameCon">',
			'<div class="overflow-con-TwoOne">',
			'<img id="img_' + k.markId + '" src="data:image/png;base64,' + _roPicture + '" />',
			'</div></div></div></div>',
			'<div class="swiper-slide swiper-no-swiping">',
			'<div class="swiper-container-same">',
			'<div class="swiper-container-sameCon">',
			'<div class="overflow-con-TwoOne">',
			'<div class="TwoOne-title">' + pictitle + '</div>',
			'<div class="TwoOne-neirong">' + k.markReferral + '</div></div></div></div></div></div>',
			'<div class="swiper-pagination paginationTwoOne' + j + '"></div></div></div>'
		].join("");
		$('#containerTwoOne').append(s);
		$('#containerTwoOne').addClass('initOurBankInfo');//添加已初始化标识
		//							Meap.transFormImage(k.markId+'c', _roPicture, 'picSty', function(msg) {
		//								$("#img_"+ k.markId).attr("src", msg);
		//							}, function(err) {});
		swiperTmp = new Swiper('.containerTwoOne' + j, {
			pagination: '.paginationTwoOne' + j,
			paginationClickable: true,
			spaceBetween: 30,
			noSwiping: false,
		});
		if(j == 1){
			swiperTwoOneHorizontal = swiperTmp;
		}
	}
	setTimeout(function() {
		swiperTwoOne.update();
		swiperTwotwo.update();
		swiperTwothree.update();
		swiperTwofour.update();
	}, 800);
}

})();