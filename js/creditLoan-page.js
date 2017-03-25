/**
 * Created by LiChenglin on 2016/6/23.
 */
/**
 * 申请信用贷款
 */
/*
 * isProRequest:false, //是否远程请求产品参数 $CL.applicationObj.proCODE = "";
 * //卡产品代码 $CL.applicationObj.proType = ""; //营销产品
 * 
 * 
 */
/* 信用贷款产品界面 */
$(document).on("pageshow",'#creditLoan-product',function(){
	if (!commonJson.losUserId) {//creditLoanUserId 取值待定？？？？？登录成功回调时候赋值
        showTags({
            'title': '提示',
            'content': '信用贷款用户ID不存在,无权办理信用贷款业务,请到后端管理台配置！',
            'ok': {
                fun: function () {
                    $.mobile.changePage('../main.html');
                }
            }
        });
        return;
    }
	$CL.dat.initData("creditLoan-product");
	$CL.dat.initData("creditLoan-reading");
	// 判断时间:true就查询本地数据库,false就查询后台
	var todayIs = appTime.appCurDate('');
	if (todayIs == localStorage.creditLoanProductTime) { // 是否当天发的请求
		// 不发送请求
		$CL.isProRequest = false;
	} else {
		localStorage.creditLoanProductTime = todayIs;
		$CL.isProRequest = true;
	}
	if($CL.isSimulate){
		if (!$CL.isProRequest) {
			executeSqlString($CL.dat.getSql("creditLoan-product",null,null), 'exe', function (msg) {
		        if (msg != '') {
		        	$CL.svc.queryLocalProductSucc(msg);
		        } else {
		        	funDataFail(err);
		        }
		    }, function (err) {
		        funDataFail(err);
		    });
		} else {
			$CL.svc.queryRemoteProduct($CL.dat.getReqJson("creditLoan-product",null));// 调用service-creditLoan.js中的方法
		}
	}else{
		getCurrentLocationCoordinateFun(function() {
			showLoader("产品列表查询中...");
			if (!$CL.isProRequest) {
				executeSqlString($CL.dat.getSql("creditLoan-product",null,null), 'exe', function (msg) {
			        if (msg != '') {
			        	$CL.svc.queryLocalProductSucc(msg);
			        } else {
			        	$CL.svc.queryRemoteProduct($CL.dat.getReqJson("creditLoan-product",null));
			        }
			    }, function (err) {
			        funDataFail(err);
			    });
			} else {
				$CL.svc.queryRemoteProduct($CL.dat.getReqJson("creditLoan-product",null));// 调用service-creditLoan.js中的方法
			}
		});
	}
});
/* 读取身份证 */
$(document).on("pageshow", '#creditLoan-reading', function(){
	$CL.dat.initData("creditLoan-reading");
	// 调用刷身份证方法
	$(".footter .previous").on('click', function() {
		if($CL.isSimulate2){
			custermerInfo = {}; //初始化个人信息
			custermerInfo = {
					"nation": '汉', //民族
					"cerNO":'503028198001014943', //身份证号
					//"cerNO": "230304198810064212",  //身份证号
					"address": '广东省深圳市罗湖区深南东路3038号', //地址
					"name": '叶启明', //姓名
					//"name": "于明伟", //姓名
					"cerExpdDt": '2012.06.09-2025.12.13', //到期日期
					"birthday": '1980-10-08', //出生日期
					"sex": '男', //性别
					"issAuthority": '深圳市罗湖区公安局', //签发机关
					"image": '' //身份证头像图片
			}
			creditJson.isReadCardSucc=true;
			$.mobile.changePage('creditLoan-read.html');
		}else{
			creditReadCard(function() {
				$.mobile.changePage('creditLoan-read.html');
			}, function(err) {
				$.mobile.changePage('creditLoan-read.html');
			});
		}
	});
	// 点击影像复用按钮
	$("#creditLoan-reading .conter-con .picRe").on('click', function() {
		$.mobile.changePage('creditLoan-video.html');
	});
});

/* 读取配偶身份证 */
$(document).on("pageshow", '#creditLoan-peiReading', function(){
	// 点击放弃按钮
	$("#creditLoan-peiReading .footter .previous:eq(0)").on('click', function() {
		$.mobile.changePage('creditLoan-cusInfo.html');
	});
	// 调用刷身份证方法
	$CL.peiIcInfo = {};
	$("#creditLoan-peiReading .footter .previous:eq(1)").on('click', function() {
		if($CL.isSimulate2){
			$CL.peiIcInfo = {}; //初始化个人信息
			$CL.peiIcInfo = {
					"nation": '汉', //民族
					"cerNO": '610322200712070037', //身份证号
					//"cerNO": "230304198810064212",  //身份证号
					"address": '广东省深圳市罗湖区深南东路3038号', //地址
					"name": '李昱纬', //姓名
					//"name": "于明伟", //姓名
					"cerExpdDt": '2012.06.09-2023.06.09', //到期日期
					"birthday": '2007-12-07', //出生日期
					"sex": '男', //性别
					"issAuthority": '深圳市罗湖区公安局', //签发机关
					"image": '' //身份证头像图片
			};
			$CL.peiIcInfo.isReadCardSucc=true;
			$CL.peiIcInfo.isPeiRead = true;
			$.mobile.changePage('creditLoan-peiRead.html');
		}else{
			$CL.svc.readPeiICCard(function() {
				$.mobile.changePage('creditLoan-peiRead.html');
			}, function(err) {
				$.mobile.changePage('creditLoan-peiRead.html');
			});
		}
	});
});

/* 影像复用 */
$(document).on("pageshow", '#creditLoan-video', function() {
	// 从数据库中查询可复用的个人信息
	queryAllcacheCustermerInfo();
	// 点击取消
	$('#creditLoan-video .previous-con').on('click', function() {
		$.mobile.changePage('creditLoan-reading.html', {
			reverse : true
		});
	});
	// 点击影像复用
	$('#btn_next').on('click', function() {
		if (!($(this).hasClass('btn_next')))
			return;
		commonJson.isCustermerInfoMultiplex = true; // 使用影像复用功能
		$.mobile.changePage('creditLoan-read.html');
	})
});

/* 身份证联网核查 */
$(document).on("pageshow", '#creditLoan-read', function() {
	lianwanghechaData.dianzixinyongkaDX = "9";
	// 显示信息
	if (creditJson.isReadCardSucc || commonJson.isCustermerInfoMultiplex) { // 读卡成功
		creditReadCardSucc($CL.dat.getReqJson("creditLoan-read@lwhc",null));
	} else {
		creditReadCardFail();
	}
	// 点击上一步重新读取
	$("#creditLoan-read .footter .previous:eq(0)").on('click', function() {
		$.mobile.changePage('./creditLoan-reading.html', {
			reverse : true
		});
	});
	// 点击下一步 联网核查
	$("#creditLoan-read .footter .previous:eq(1)").on('click', function() {
		if (!$(this).hasClass('btn_next')) {
			return;
		}
		if (commonJson.isCustermerInfoMultiplex) {
			lianwanghechaData.CheckResult = '00';
		}
		$CL.applicationObj.lianPic = custermerInfo.checkPhoto;//联网核查返回的照片
		$.mobile.changePage('creditLoan-testLimit.html');
	});
	
	var $hechaYichang = $(".lianwanghecha-yichang");

	$(".lianwanghecha-chongxin").on("click", function() {// 重新联网核查
		$hechaYichang.hide();
		creditReadCardSucc($CL.dat.getReqJson("creditLoan-read@lwhc",null));

	});
	$(".lianwanghecha-jixu").on("click", function() {// 继续业务办理
		$hechaYichang.hide();
		$CL.svc.queryCoreClientInfo();
	});
	$(".lianwanghecha-tuichu").on("click", function() {// 退出
		$.mobile.changePage('creditLoan-reading.html', {
			transition : "slide"
		});
		$hechaYichang.hide();
	});
});

/* 测算额度显示界面 */
$(document).on("pageshow", '#creditLoan-testLimit', function() {
	$CL.isScoreValue = "0";
	if($CL.isSimulate2){
		$CL.income = '23000.9';
		$CL.marriage='02-已婚无子女';
		$CL.loanLimit="8000000";
		$CL.huji = '01';
		$CL.oiSrc = '03-经营';//家庭其他收入来源
		$CL.oiAmt = '56789.9';//家庭其他月收入
		$CL.isScoreValue = "1";
		$.mobile.changePage('./creditLoan-cusPicture.html', {
			reverse : true
		});
	}
	$('#header-pfk-con').html($CL.proName+'评分卡');
	$CL.svc.queryScoreCardItem();
	// 点击测算额度
	$("#test_limit_btn").on('click', function() {
		if (!$(this).hasClass('btn_next')) {
			return;
		}
		var num = 0;
		$('#creditLoan-testLimit .basic_rows_name_div2 input[type="text"]:not(:disabled)').each(
			function(index, el) {
				if ($.trim($(this).val()) == ''){
					num++;
					var id = $(this).attr('id');
					$('#'+id+'_div1').css('background-color','#fae5e8');
				}else{
					var id = $(this).attr('id');
					$('#'+id+'_div1').css('background-color','#f0f0f0');
				}
		});
		$('#creditLoan-testLimit select:not(:disabled)').each(
				function(index, el) {
					var id = $(this).attr('id');
					var value = $(this).val();
					if (!$(this).val()){
						num++;
						$('#'+id+'_div1').css('background-color','#fae5e8');
						$(this).css('border-color','#fae5e8');
					}else{
						$('#'+id+'_div1').css('background-color','#f0f0f0');
						$(this).css('border-color','#000000');
					}
		});
		if(num > 0){
			showMsg('必填项指标不能为空！');
			return;
		}
		creditLoanScoreObj = [];
		$('#creditLoan-testLimit .basic_rows_name_div2 input[type="text"]').each(
			function(index, el) {
				var scoreObj = {
						CATE_NAME: '',
						ITEM_VALUE: ''
				};
				var id = $(this).attr('id');
				var datatype = $(this).attr('data-type');
				var value = $.trim($(this).val());
				if(datatype == 'amt' && value){
					if(value.indexOf(',') != -1){
						var strs = value.split(',');
						var newvalue = '';
						for(var i=0;i<strs.length;i++){
							newvalue += strs[i];
						}
						value = newvalue;
					}
				}
				if(id == 'the_average_monthly_payroll_income'){//月收入
					$CL.income = value;
				}
				if(id == 'household_register'){//户籍
					$CL.huji=value;
				}
				if(id == 'marriage'){//婚姻状况
					$CL.marriage=value;
				}
				if(id == 'other_income'){//其他月收入
					$CL.oiAmt=value;
				}
				if(id == 'other_sources_of_income'){//家庭其他收入来源
					$CL.oiSrc=value;
				}
				scoreObj.ITEM_VALUE = value;
				scoreObj.CATE_NAME = id.trim();
				creditLoanScoreObj.push(scoreObj);
		});
		$('#creditLoan-testLimit select').each(
				function(index, el) {
					var scoreObj = {
							CATE_NAME: '',
							ITEM_VALUE: ''
					};
					var id = $(this).attr('id');
					var value = $(this).val();
					if(!value){
						value = $('#'+id+' option:selected').val();
					}
					if(id == 'the_average_monthly_payroll_income'){//月收入
						$CL.income = value;
					}
					if(id == 'household_register'){//户籍
						$CL.huji=value;
					}
					if(id == 'marriage'){//婚姻状况
						$CL.marriage=value;
					}
					if(id == 'other_income'){//其他月收入
						$CL.oiAmt=value;
					}
					if(id == 'other_sources_of_income'){//家庭其他收入来源
						$CL.oiSrc=value;
					}
					scoreObj.CATE_NAME = id.trim();
					scoreObj.ITEM_VALUE = value;
					creditLoanScoreObj.push(scoreObj);
		});
		$CL.SCORE_CARD_PATH = '';
		$CL.svc.createAndCalculateScoreCard(creditLoanScoreObj);
	});
	//重新测算
	$("#creditLoan-testLimit .chongxincesuan").on('click', function() {
		$("#creditLoan-testLimit .result-display").hide();
	});
	// 点击继续申请
	$("#creditLoan-testLimit .jixuanshenqing").on('click', function() {
		if($CL.oiSrc && $CL.oiAmt){
			$CL.isScoreValue = "1";
		}
		$.mobile.changePage('./creditLoan-cusPicture.html', {
			reverse : true
		});
	});
});

/* 配偶身份证显示界面 */
$(document).on("pageshow", '#creditLoan-peiRead', function() {
	// 显示信息
	if ($CL.peiIcInfo.isReadCardSucc) { // 读卡成功
		 	$('.pic_suc').html('身份证读取成功!');
		    $(".ziduan-value:eq(0)").text($CL.peiIcInfo.name);
		    $(".ziduan-value:eq(1)").text($CL.peiIcInfo.sex);
		    $(".ziduan-value:eq(2)").text($CL.peiIcInfo.nation);
		    $(".ziduan-value:eq(3)").text($CL.peiIcInfo.birthday.split("-")[0]);
		    $(".ziduan-value:eq(4)").text($CL.peiIcInfo.birthday.split("-")[1]);
		    $(".ziduan-value:eq(5)").text($CL.peiIcInfo.birthday.split("-")[2]);
		    $(".ziduan-value:eq(6)").text($CL.peiIcInfo.address);
		    $(".ziduan-value:eq(7)").text($CL.peiIcInfo.cerNO);
		    $(".ziduan-value:eq(8)").text($CL.peiIcInfo.issAuthority);
		    $(".ziduan-value:eq(9)").text($CL.peiIcInfo.cerExpdDt);
		    $('.sfz-img').attr('src', $CL.peiIcInfo.image);
	} else {
		$(".loading_box").html('');
	    $(".ziduan-value:eq(0)").text('');
	    $(".ziduan-value:eq(1)").text('');
	    $(".ziduan-value:eq(2)").text('');
	    $(".ziduan-value:eq(3)").text('');
	    $(".ziduan-value:eq(4)").text('');
	    $(".ziduan-value:eq(5)").text('');
	    $(".ziduan-value:eq(6)").text('');
	    $(".ziduan-value:eq(7)").text('');
	    $(".ziduan-value:eq(8)").text('');
	    $(".ziduan-value:eq(9)").text('');
	    $('.sfz-img').attr('src', '../../images/head-photo.png');
	    $('.pic_suc').html(creditJson.isReadCardMsg);
	}
	// 点击上一步重新读取
	$("#creditLoan-peiRead .footter .previous:eq(0)").on('click', function() {
		$.mobile.changePage('./creditLoan-peiReading.html', {
			reverse : true
		});
	});
	// 点击使用证件
	$("#creditLoan-peiRead .footter .previous:eq(1)").on('click', function() {
		if (!$(this).hasClass('btn_next')) {
			return;
		}
		$.mobile.changePage('./creditLoan-cusInfo.html', {
			reverse : true
		});
	});
});

/*影像采集*/
$(document).on("pageshow", '#creditLoan-cusPicture', function () {
	if ($CL.isPicturePage || workbenchJson.isTemp) {
		if (workbenchJson.isTemp) {
			
            $CL.dat.SaveToObj("creditLoan-cusPicture",workbenchJson.temp);
            workbenchJson.temp = {};
        }
	}
	var message = "";
	executeSqlString($CL.dat.getSql("creditLoan-cusPicture@queryPic",null,null), 'exe', function (msg) {
        if (msg != '') {
        	message = msg;
        	$CL.svc.queryPictureSucc(msg);
        } else {
        	funDataFail(err);
        	return;
        }
    }, function (err) {
        funDataFail(err);
        return;
    });
});

/* 人脸对比 -----主申请人 */
$(document)
		.on(
				"pageshow",
				'#creditLoan-personFace',
				function() {
					$("#creditLoan-personFace .camera:eq(0)").attr('src',
							$CL.applicationObj.cusFacePic);
					$("#creditLoan-personFace .camera:eq(1)").attr('src',
							custermerInfo.image);
					$("#creditLoan-personFace .camera:eq(2)").attr('src',
							$CL.applicationObj.cusFacePic);
					$("#creditLoan-personFace .camera:eq(3)")
							.attr(
									'src',
									'data:image/png;base64,'
											+ $CL.applicationObj.lianPic);
					// 点击继续
					$('#creditLoan-personFace .previous:last')
							.on(
									'click',
									function() {
										if ($(this).hasClass('btn_next')) {
											var faceRecogn = '';
											if ($(
													"#creditLoan-personFace .face-result:eq(0)")
													.text() == '通过'
													&& $(
															"#creditLoan-personFace .face-result:eq(1)")
															.text() == '通过') {
												faceRecogn = '1'; // 自动通过
											} else {
												faceRecogn = '5'; // 手动通过
											}
											$CL.faceRecogn = faceRecogn;
											creditJson.isPrev.LLDBisFromPrev = true;
											$.mobile
													.changePage('creditLoan-cusInfo.html');
										}
									});
					// 点击F放弃
					$('#creditLoan-personFace .previous:first').on(
							'click',
							function() {
								$CL.faceRecogn = '6'; // 手动不通过
								creditJson.isPrev.LLDBisFromPrev = false;
								$.mobile.changePage(
										'creditLoan-cusPicture.html', {
											reverse : true
										});
							});
					//人脸对比
					$CL.svc.faceCompare($CL.applicationObj.mPicFileARR[0], custermerInfo, $CL);
				});

/* 信用贷款信息录入界面 */
$(document)
		.on(
				"pageshow",
				'#creditLoan-cusInfo',
				function() {
					//初始化下啦菜单域
					var zancunFlag = false;
					$CL.dat.initData('creditLoan-cusInfo');
					if ($CL.messageCache || workbenchJson.isTemp) {
//						alert("1qaz");
						if (workbenchJson.isTemp) {
							$CL.dat.SaveToObj("creditLoan-cusInfo@wb",workbenchJson.temp);
							zancunFlag = true;
						}
						workbenchJson.isTemp = false;
						// 缓存数据回填页面
						$CL.dat.fillDataToPage("creditLoan-cusInfo");
					} else {
						//此处查询los客户信息
						$('#creditLoan-name').text(custermerInfo.name);
						$('#creditLoan-sex').text(custermerInfo.sex);
						$('#creditLoan-cerTime').text(
								custermerInfo.cerExpdDt.split('-')[1]);
						$('#creditLoan-cerNo').text(custermerInfo.cerNO);
					}
					//从评分卡中获取月收入信息回填
					if($CL.oiSrc){
						if($CL.isScoreValue == '1'){
							$("#creditLoan-oiSrc").val($CL.oiSrc).attr('disabled','disabled').selectmenu('refresh');
						}else{
							$('#creditLoan-oiSrc').val($CL.oiSrc).removeAttr('disabled').selectmenu('refresh');
						}
					}else{
						$('#creditLoan-oiSrc').val('').selectmenu('refresh').removeAttr('disabled');
					}
					if($CL.oiAmt){
						if($CL.isScoreValue == '1'){
							$("#creditLoan-oiAmt").val($CL.page.creditLoanFmoney($CL.oiAmt)).attr('disabled','disabled');
						}else{
							$('#creditLoan-oiAmt').val($CL.page.creditLoanFmoney($CL.oiAmt));
						}
					}
					if((parseInt($CL.isLoanValue) & 2) == 2 && $CL.mobile){//之前从los查询而来需要只会
						$('#creditLoan-mobile').attr('disabled', 'disabled')
					}
					$('#creditLoan-income').val($CL.page.creditLoanFmoney($CL.income));
					$('#creditLoan-loanLimit').val($CL.page.creditLoanFmoney($CL.loanLimit));
					
					var peiIdType = $CL.peiCerType;
					var peiId = $CL.peiCerNo;
					var peiName = $CL.peiName;
					
					//从评分卡中获取家庭状况信息回填
					$('#creditLoan-marriage').val($CL.marriage).selectmenu('refresh');
					var _married = $('#creditLoan-marriage').val();
					if($CL.isLoanPeiValue != "1"){
						if(_married == __marriageListObj['YHY'] || _married == __marriageListObj['YHW']){
							$('#creditLoan-peiName_txt').html('<span class="required-stars">*</span>配偶姓名');
							$("#creditLoan-peiCerType_txt").html('<span class="required-stars">*</span>配偶证件类型');
							$('#creditLoan-peiPhone_txt').html('<span class="required-stars">*</span>配偶手机号码');
							$('#creditLoan-peiCerNo_txt').html('<span class="required-stars">*</span>配偶证件号码');
							$('#creditLoan-peiIncome_txt').html('<span class="required-stars">*</span>配偶月收入');
							$('#creditLoan-peiOffice_txt').html('<span class="required-stars">*</span>配偶职务');
							$CL.dat.cllistDisabled('creditLoan-peiOffice',false,$CL.peiOffice);
							$CL.dat.cllistDisabled('creditLoan-peiCerType',false,$CL.peiCerType);
//							$("#creditLoan-peiCerType").val('').prop('disabled',false).selectmenu('refresh');
//							$('#creditLoan-peiOffice').val('').prop('disabled',false).selectmenu('refresh');
							if(!$CL.peiOffice){
								$("#creditLoan-peiOffice").val('3').selectmenu('refresh');
							}
//							$('#creditLoan-peioushenfen').show();
							$CL.dat.yingcangAndXianshipeiOu(false);
						}else{
							$('#creditLoan-peiName_txt').html('配偶姓名');
							$("#creditLoan-peiCerType_txt").html('配偶证件类型');
							$('#creditLoan-peiPhone_txt').html('配偶手机号码');
							$('#creditLoan-peiCerNo_txt').html('配偶证件号码');
							$('#creditLoan-peiIncome_txt').html('配偶月收入');
							$('#creditLoan-peiOffice_txt').html('配偶职务');
							$('#creditLoan-peiName').attr('disabled','disabled');
							if(!$CL.peiCerType){
								$("#creditLoan-peiCerType").val('').attr('disabled','disabled').selectmenu('refresh');
							}else{
								$("#creditLoan-peiCerType").attr('disabled','disabled').selectmenu('refresh');
							}
							$('#creditLoan-peiPhone').attr('disabled','disabled');
							$('#creditLoan-peiCerNo').attr('disabled','disabled');
							$('#creditLoan-peiCompany').attr('disabled','disabled');
							$('#creditLoan-peiIncome').attr('disabled','disabled');
							if(!$CL.peiOffice){
								$('#creditLoan-peiOffice').val('').attr('disabled','disabled').selectmenu('refresh');
							}else{
								$('#creditLoan-peiOffice').attr('disabled','disabled').selectmenu('refresh');
							}
//							$('#creditLoan-peioushenfen').hide();
							$CL.dat.yingcangAndXianshipeiOu(true);
						}
					}
					if($CL.peiIcInfo.isPeiRead && $CL.peiIcInfo.isReadCardSucc){
						$CL.peiIcInfo.isPeiRead = false;
						$("#creditLoan-peiName").val($CL.peiIcInfo.name);// 配偶姓名
					    $("#creditLoan-peiCerNo").val($CL.peiIcInfo.cerNO);// 配偶证件号码
					    $("#creditLoan-peiCerType").val("0").selectmenu('refresh');// 配偶证件类型；身份证
					    //左侧菜单定位到家庭状况页
					    $('.navigation li:eq(3)').addClass("change-bg").siblings("li")
								.removeClass("change-bg");
						$('.information-input ul:eq(3)').addClass('credit-card-show').siblings(
										'ul').removeClass(
										'credit-card-show');
					}
					
					//配偶证件类型change事件
					$("#creditLoan-peiCerType").change(
							function(){
//								$('#creditLoan-peiName').val('');
								$('#creditLoan-peiCerNo').val('');
					});
					$("#creditLoan-peiCerNo").change(
							function(){
								var ty = $('#creditLoan-peiCerType').val();
								var id = $('#creditLoan-peiCerNo').val();
								if(ty == '0' && id){
									if(!$CL.page.checkID(id)){
										showMsg('配偶身份证号码请填写正确格式！');
//										$('#creditLoan-peiCerNo').val('');
									}
								}
					});
					$("#creditLoan-loanUse").change(
							function(){
								var usage = $('#creditLoan-loanUse').val();
								if(usage == '2'){
									$('#creditLoan-otherUse').attr('disabled',false);
									$('#creditLoan-otherUse_txt').html('<span class="required-stars">*</span>其他用途');
								}else{
									$('#creditLoan-otherUse_txt').html('其他用途');
									$('#creditLoan-otherUse').val('').attr('disabled',true);
								}
					});
					// 配偶身份证读取
					
					$("#creditLoan-wyType").change(
							function(){
								var wyType = $('#creditLoan-wyType').val();
								var wyType1 = $('#creditLoan-wyType1').val();
								if(wyType == __wyType['SFDZ'] || wyType == __wyType['YBDQ']){
									$('#creditLoan-wyNo').attr('disabled',false);
									$('#creditLoan-wyStatus_txt').html('<span class="required-stars">*</span>');
									$('#creditLoan-wyStatus').val(__wyDyStatus['WDY']).attr('disabled',false).selectmenu('refresh');
								}else{
									$('#creditLoan-wyNo').val('').attr('disabled',true);
									$('#creditLoan-wyStatus_txt').html('');
									$('#creditLoan-wyStatus').val('').attr('disabled',true).selectmenu('refresh');
								}
								if(wyType == __wyType['WWYE'] && wyType1){
									$('#creditLoan-wyType1').val('').selectmenu('refresh');
									$('#creditLoan-wyNo1').val('');
									$('#creditLoan-wyStatus1').val('').selectmenu('refresh');
									$('li[title=wuye1]').css("display", 'none');
								}
					});
					$("#creditLoan-wyType1").change(
							function(){
								var wyType = $('#creditLoan-wyType1').val();
								if(wyType == __wyType['SFDZ'] || wyType == __wyType['YBDQ']){
									$('#creditLoan-wyNo1').attr('disabled',false);
									$('#creditLoan-wyStatus1_txt').html('<span class="required-stars">*</span>');
									$('#creditLoan-wyStatus1').val(__wyDyStatus['WDY']).attr('disabled',false).selectmenu('refresh');
								}else{
									$('#creditLoan-wyNo1').val('').attr('disabled',true);
									$('#creditLoan-wyStatus1_txt').html('');
									$('#creditLoan-wyStatus1').val('').attr('disabled',true).selectmenu('refresh');
								}
					});
					// 增加物业信息
					$("#creditLoan-wuyeadd").click(
							function() {
								var wt = $('#creditLoan-wyType').val();
								if(wt == __wyType['WWYE']){
									showMsg('第一条物业信息为无物业时不能再增加物业信息！');
									return;
								}
								//var wuyeNmu = $('#creditLoan-wuyexinxi').children('li').size();
								if ($('#creditLoan-wuyexinxi').children('li[title=wuye1]').css('display')=='block') {
									showMsg("最多支持两条物业信息！");
									return;
								} else {
									$('#creditLoan-wyNo1').val('').attr('disabled',false);
									$('#creditLoan-wyStatus1_txt').html('');
									$('#creditLoan-wyStatus1').val('').attr('disabled',false).selectmenu('refresh');
									$('#creditLoan-wyType1').val('').selectmenu('refresh');
									$('li[title=wuye1]')
											.css("display", 'block');
									$('#creditLoan-wuyedelete').on(
											'click',
											function() {
												$('#creditLoan-wyType1').val('').selectmenu('refresh');
												$('#creditLoan-wyStatus1_txt').html('');
												$('#creditLoan-wyStatus1').val('').selectmenu('refresh');
												$('#creditLoan-wyNo1').val('');
												$('li[title=wuye1]').css(
														"display", 'none');
											});
								}
					});
					// 左侧菜单切换
					$(".navigation>li").on(
							"click",
							function() {
								if ($(this).hasClass('credit-card-show')) {
									return;
								}
								var navigation = $('.navigation li').index(
										$(this));
								$(this).addClass("change-bg").siblings("li")
										.removeClass("change-bg");
								$('.information-input ul').eq(navigation)
										.addClass('credit-card-show').siblings(
												'ul').removeClass(
												'credit-card-show');
							});
					$('#creditLoan-mobile').on(
							'blur',
							function() {
								$('#creditLoan-mobile').val(
										telNum($('#creditLoan-mobile').val()));
							});
					$('#creditLoan-mobile').on(
							'tap',
							function() {
								if($('#creditLoan-mobile').attr('disabled') == 'disabled'){
								}else{
									$('#creditLoan-mobile').val(
											removeSpace($('#creditLoan-mobile')
													.val()));
								}
							});
					$('#creditLoan-peiPhone')
							.on(
									'blur',
									function() {
										$('#creditLoan-peiPhone')
												.val(
														telNum($(
																'#creditLoan-peiPhone')
																.val()));
									});
					$('#creditLoan-peiPhone').on(
							'tap',
							function() {
								if($('#creditLoan-peiPhone').attr('disabled') == 'disabled'){
								}else{
									$('#creditLoan-peiPhone').val(
											removeSpace($('#creditLoan-peiPhone')
													.val()));
								}
							});
					$('#creditLoan-income').on('tap', function() {
//						alert($('#creditLoan-income').is(':disabled'));
						if($('#creditLoan-income').attr('disabled') == 'disabled'){
						}else{
							var _val = $(this).val();
							$(this).val(rmoney(_val))
						}
					})
					$('#creditLoan-income').on('blur', function() {
						var _val = $(this).val().replace(/[^0-9\.]/ig, "");
						$(this).val($CL.page.creditLoanFmoney(_val))
					})
					$('#creditLoan-peiIncome').on('tap', function() {
						if($('#creditLoan-peiIncome').attr('disabled') == 'disabled'){
						}else{
							var _val = $(this).val();
							$(this).val(rmoney(_val));
						}
					})
					$('#creditLoan-peiIncome').on('blur', function() {
						var _val = $(this).val().replace(/[^0-9\.]/ig, "");
						$(this).val($CL.page.creditLoanFmoney(_val))
					})
					$('#creditLoan-oiAmt').on('tap', function() {
						if($('#creditLoan-oiAmt').attr('disabled') == 'disabled'){
						}else{
							var _val = $(this).val();
							$(this).val(rmoney(_val))
						}
					})
					$('#creditLoan-oiAmt').on('blur', function() {
						var _val = $(this).val().replace(/[^0-9\.]/ig, "");
						$(this).val($CL.page.creditLoanFmoney(_val))
					})
					$('#creditLoan-loanLimit').on('tap', function() {
						if($('#creditLoan-loanLimit').attr('disabled') == 'disabled'){
						}else{
							var _val = $(this).val();
							$(this).val(rmoney(_val))
						}
					})
					$('#creditLoan-loanLimit').on('blur', function() {
						var _val = $(this).val().replace(/[^0-9\.]/ig, "");
						$(this).val($CL.page.creditLoanFmoney(_val))
					})
					$('#creditLoan-loanMoney').on('tap', function() {
						var _val = $(this).val();
						$(this).val(rmoney(_val));
					})
					$('#creditLoan-loanMoney').on('blur', function() {
						var _val = $(this).val().replace(/[^0-9\.]/g, "");
						if (!_val) {
							$(this).val('');
							return;
						}
						_val = parseInt(_val);
						if (!/^\d+000$/.test(_val)) {
							showMsg('贷款额度应为千整位！');
							$(this).val('');
							return;
						}
						$(this).val($CL.page.creditLoanFmoney(_val))
					})
					$("#creditLoan-addr-detail")
							.on(
									'blur',
									function() {
										if (!$(this).val()) {
											var s_county = $
													.trim($("#s_county").val())
													|| '福田区';// 居住地址区
											$("#s_city")
													.html(
															'<option value="深圳市">深圳市</option>')
													.val('深圳市').selectmenu(
															'refresh');
											$("#s_county")
													.html(
															' <option value="福田区">福田区</option><option value="罗湖区">罗湖区</option><option value="南山区">南山区</option><option value="宝安区">宝安区</option><option value="龙岗区">龙岗区</option><option value="盐田区">盐田区</option><option value="龙华新区">龙华新区</option><option value="光明新区">光明新区</option><option value="大鹏新区">大鹏新区</option><option value="坪山新区">坪山新区</option>')
													.val(s_county).selectmenu(
															'refresh')
													.removeAttr('disabled');
										}
									});
					// 户籍返显到详细地址
					$("#hujifangxian1").click(
							function() {
								$("#creditLoan-addr-detail").val(
										custermerInfo.address);
								$("#s_city").val("").selectmenu('refresh')
										.attr('disabled', 'disabled');
								$("#s_county").val("").selectmenu('refresh')
										.attr('disabled', 'disabled');
							});
					// 定位返显到详细地址
					$("#shishidingwei1").click(
									function() {
										Meap.getCurrentLocationAddress("",function(msg) {
															msg = JSON.parse(msg);
															$("#creditLoan-addr-detail").val(msg.FormattedAddressLines[0]);
															$("#s_city").val("").selectmenu('refresh').attr('disabled','disabled');
															$("#s_county").val("").selectmenu('refresh').attr('disabled','disabled');
														}, function(err) {
															showMsg(err);
														});
									});
					// 失去焦点 发请求匹配签发地区
//					$("#creditLoan-addrName").on(
//							'blur',
//							function() {
//								$("#creditLoan-addr").val('').html('')
//										.selectmenu('refresh');
//								var city = $(this).val();
//								if (city == "")
//									return;
//								$CL.svc.queryFrp005Succ("creditLoan-cusInfo@qfdq",city);
//							})
					// 点击暂存
					$CL.isZancunSucc = false;
					$('#creditLoan-cusInfo .zancun').on('click', function() {
						$CL.polwhcjg2 = '';
						$CL.polwhcFlag2 = '';
						if($CL.isZancunSucc){
							return;
						}
						$CL.dat.SaveToObj("creditLoan-cusInfo@page",null);
						if($CL.isZancunSucc){
							return;
						}
						$CL.isZancunSucc = true;
						$CL.svc.insertData("creditLoan-cusInfo",'creditLoan-cusInfo-zancun');//保存页面数据到数据库
//						$.mobile.changePage('creditLoan-product.html', {
//							reverse : true
//						});
					});
					// 点击上一步，跳转页面
					$('#btn_prev').on('click', function() {
						$CL.loanTime = $("#creditLoan-loanTime").val();
						$CL.messageCache = true;// 信息缓存
						$CL.dat.SaveToObj("creditLoan-cusInfo@page",null);
						$.mobile.changePage('./creditLoan-cusPicture.html', {
							reverse : true
						});
					});
					// 点击下一步
					$('#btn_next').on('click',function() {
										if (!$(this).hasClass('btn_next'))
											return;
										var isWuye1 = false;
										if ($('#creditLoan-wuyexinxi').children('li[title=wuye1]').css('display')=='block') {
											isWuye1 = true;
										}
										// //是否为空验证
										var num = 0; // 纪录为空或者格式不正确的个数
										$('#creditLoan-cusInfo .conter-con input[type="text"]:not(:disabled)').each(
														function(index, el) {
															// 配偶的不必填
															if (/^creditLoan-pei/.test($(this).attr('id'))
																	&& ($('#creditLoan-marriage').val() == '01-未婚或离异')) {
																return true;
															}
															if($(this).attr('id') == 'creditLoan-peiCompany'){
																return true;
															}
															if($(this).attr('id') == 'creditLoan-oiSrc'){
																return true;
															}
															if($(this).attr('id') == 'creditLoan-oiAmt'){
																return true;
															}
															if(!isWuye1){
																if($(this).attr('id') == 'creditLoan-wyNo1'){
																	return true;
																}
															}
															var eqIndex = $(this).closest('.info-enter-item').index();
															if ($.trim($(this).val()) == '') {
																num++;
																$(this).closest('.info-enter-item').addClass('info-enter-error-bd'); // 错误字段点亮
																// 父级区域
																$(this).closest('.fm-item').addClass('fm-item-error'); // 错误字段点亮
																if (!($('.navigation li:eq('+ eqIndex+ ')').hasClass('change-bg'))) {
																	$('.navigation li:eq('+ eqIndex + ')').addClass('info-enter-error-tabs'); // tabs错误区域点亮
																}
																return true;
															} else {
																$(this).closest('.info-enter-item').removeClass('info-enter-error-bd'); // 错误字段点亮
																// 父级区域
																$(this).closest('.fm-item').removeClass('fm-item-error'); // 错误字段点亮
																if ($(this).closest('.info-enter-item').find('.fm-item-error').length == 0) {
																	$('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); // tabs错误区域点亮
																}
															}
														});
										if($('#creditLoan-dwellYear').val() ==''){
								            num++;
								            $('#creditLoan-dwellYear').closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
								            $('#creditLoan-dwellYear').closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
								            if (!($('.navigation li:eq(0)').hasClass('change-bg'))) {
								                $('.navigation li:eq(0)').addClass('info-enter-error-tabs'); //tabs错误区域点亮
								            }
								        }else{
								            $('#creditLoan-dwellYear').closest('.info-enter-item').removeClass('info-enter-error-bd'); //错误字段点亮 父级区域
								            $('#creditLoan-dwellYear').closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
								            if ($('.navigation li:eq(0)').hasClass('change-bg')) {
								                $('.navigation li:eq(0)').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
								            }
								        }
										$('#creditLoan-cusInfo select:not(:disabled)').each(function(index, el) {
															if(!isWuye1){
																if($(this).attr('id') == 'creditLoan-wyType1' || $(this).attr('id') == 'creditLoan-wyStatus1'){
																	return true;
																}
															}
															if($(this).attr('id') == 'creditLoan-oiSrc'){
																return true;
															}
															var eqIndex = $(this).closest('.info-enter-item').index();
															if (!$(this).val()) {
																num++;
																$(this).closest('.info-enter-item').addClass('info-enter-error-bd'); // 错误字段点亮
																// 父级区域
																$(this).closest('.fm-item').addClass('fm-item-error'); // 错误字段点亮
																if (!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
																	$('.navigation li:eq('+ eqIndex + ')').addClass('info-enter-error-tabs'); // tabs错误区域点亮
																}
															} else {
																$(this).closest('.fm-item').removeClass('fm-item-error'); // 错误字段点亮
																if ($(this).closest('.info-enter-item').find('.fm-item-error').length == 0) { // 如果父级区域没有错误字段
																	$('.navigation li:eq('+ eqIndex + ')').removeClass('info-enter-error-tabs'); // tabs错误区域点亮
																}
															}
														});
										if (num > 0) {
											showMsg('必填项不能为空！');
											return;
										}
										// 格式验证
										$(
												'#creditLoan-cusInfo .conter-con input[type="text"][reg]:not(:disabled)')
												.each(
														function(index, el) {
															var reg = $(this)
																	.attr('reg');
															var eqIndex = $(
																	this)
																	.closest(
																			'.info-enter-item')
																	.index();

															if ($(this).val()
																	&& !(fmReg[reg]
																			.test($
																					.trim($(
																							this)
																							.val()
																							.replace(
																									/\s+/g,
																									''))))) {
																num++;
																$(this)
																		.closest(
																				'.info-enter-item')
																		.addClass(
																				'info-enter-error-bd'); // 错误字段点亮
																// 父级区域
																$(this)
																		.closest(
																				'.fm-item')
																		.addClass(
																				'fm-item-error'); // 错误字段点亮
																if (!($('.navigation li:eq('
																		+ eqIndex
																		+ ')')
																		.hasClass('change-bg'))) {
																	$(
																			'.navigation li:eq('
																					+ eqIndex
																					+ ')')
																			.addClass(
																					'info-enter-error-tabs'); // tabs错误区域点亮
																}
															} else {
																$(this)
																		.closest(
																				'.fm-item')
																		.removeClass(
																				'fm-item-error'); // 错误字段取消点亮
																if ($(this)
																		.closest(
																				'.info-enter-item')
																		.find(
																				'.fm-item-error').length == 0) { // 如果父级区域没有错误字段
																	$(
																			'.navigation li:eq('
																					+ eqIndex
																					+ ')')
																			.removeClass(
																					'info-enter-error-tabs'); // tabs错误区域点亮
																}
															}
														});
										if (num > 0) {
											showMsg('请填写正确格式！');
											return;
										}
										var ty = $('#creditLoan-peiCerType').val();
										var id = $('#creditLoan-peiCerNo').val();
										if(ty == '0' && id){
											if(!$CL.page.checkID(id)){
												showMsg('配偶身份证号码请填写正确格式！');
//												$('#creditLoan-peiCerNo').val('')
												return;
											}
										}
										$CL.houseArr = [];
										var wt = $('#creditLoan-wyType').val();
										if(wt){
											var obj = {};
											obj.house_certtype = $('#creditLoan-wyType').find("option:selected").text();
											obj.house_no = $('#creditLoan-wyNo').val();
											obj.house_status = $('#creditLoan-wyStatus').find("option:selected").text();
											$CL.houseArr.push(obj);
										}
										if ($('#creditLoan-wuyexinxi').children('li[title=wuye1]').css('display')=='block') {
											var wt1 = $('#creditLoan-wyType1').val();
											if(wt1){
												var obj1 = {};
												obj1.house_certtype = $('#creditLoan-wyType1').find("option:selected").text();
												obj1.house_no = $('#creditLoan-wyNo1').val();
												obj1.house_status = $('#creditLoan-wyStatus1').find("option:selected").text();
												$CL.houseArr.push(obj1);
											}
										}
										$CL.uploadTime = "" + myTime.CurTime();
										$CL.loanTime = $("#creditLoan-loanTime").val();
										$CL.incomeX=$CL.page.replaceWithNull('creditLoan-income');
										$CL.peiIncomeX=$CL.page.replaceWithNull('creditLoan-peiIncome');
										$CL.oiAmtX=$CL.page.replaceWithNull('creditLoan-oiAmt');
										$CL.loanMoneyX=$CL.page.replaceWithNull('creditLoan-loanMoney');
										
										if($CL.maxAmount){
											if(parseFloat($CL.loanMoneyX) > parseFloat($CL.maxAmount)){
												showMsg('申请金额超过产品配置的最高限额！');
												return;
											}
										} 
										if($CL.minAmount){
											if(parseFloat($CL.loanMoneyX) < parseFloat($CL.minAmount)){
												showMsg('申请金额不能小于产品配置的最低限额！');
												return;
											}
										}
										if($CL.maxTerms){
											if(parseInt($CL.loanTime) > parseInt($CL.maxTerms)){
												showMsg('申请期限超过产品配置的最高期限！');
												return;
											}
										}
										if($CL.minTerms){
											if(parseInt($CL.loanTime) < parseInt($CL.minTerms)){
												showMsg('申请期限不能小于产品配置的最低期限！');
												return;
											}
										}
										$CL.messageCache = true;// 信息缓存
										$CL.dat.SaveToObj("creditLoan-cusInfo@page",null);
										if($CL.peiCerType == '0' && $CL.isLoanPeiValue != '1'){
											if(peiIdType == $CL.peiCerType && peiId == $CL.peiCerNo && peiName == $CL.peiName && ($CL.polwhcjg2 == '00' || $CL.polwhcjg2 == '09' || $CL.polwhcjg2 == '02')){
												if($CL.polwhcFlag2 == "true"){
													$.mobile.changePage(
															'./creditLoan-cusConfirm.html',
															{
																transition : "slide"
															});
												}else{
													$CL.svc.checkPersonalID($CL.dat.getReqJson("creditLoan-read@polwhc",null));
												}
											}else{
												$CL.svc.checkPersonalID($CL.dat.getReqJson("creditLoan-read@polwhc",null));
											}
										}else{
											$.mobile.changePage(
													'./creditLoan-cusConfirm.html',
													{
														transition : "slide"
													});
										}
									});

					// 点击资料清单
					$('#creditLoan-cusInfo .zq').bind(
							'click',
							function() {
								var maritalStatus = $('#creditLoan-marriage')
										.val(); // 婚姻状况
								$('#creditLoan-cusInfo .search-weihu .wei-con')
										.html(
												$CL.dat.dataListing(
														maritalStatus, '0'));
								$("#creditLoan-cusInfo .search-weihu").show();
							});
					// 点击关闭资料清单
					$("#creditLoan-cusInfo .search-weihu a").on('click',
							function() {
								$("#creditLoan-cusInfo .search-weihu").hide();
							});

					// 点击打开选择对账单
					$('#creditLoan-cusInfo .dzd')
							.on(
									'click',
									function() {
//										var indexNum = $(".navigation>li")
//												.index(
//														$(".navigation>li.change-bg"));
										$CL.dzd = [];
										$CL.svc.queryFinBills("creditLoan-cusInfo@dzdcx");
									});
					// 点击选择对账单页面 放弃按钮
					$('.searchBank a:first').on('click', function() {
						$("#creditLoan-cusInfo .searchBank").hide();
					});
					// 点击选择对账单页面 确认按钮
					$('.searchBank a:last')
							.on('click', function() {
								if (!$(this).hasClass('btn_next')) {
									return;
								}
								$CL.fillListArr = [];
								$('.searchBank ul>li[sel=true]').each(function(index, val) {
									$CL.fillListArr.push($(val).attr('creditReferPath'));
								});
								$(".searchBank").hide();
							});
					$('.searchBank ul').delegate('u', 'tap', function() {
						var creditErrRea = $(this).closest('li').attr('remark'); //失败原因
						var lcStatus = $(this).closest('li').attr('lcStatus');
						if(lcStatus == '1') { //成功
							$CL.creditReferPath = $(this).closest('li').attr('creditreferpath');
							$CL.svc.getFileDataAndOpen($CL, 'F0010');
						} else if(lcStatus == '-2') { //失败
							showTags({
								'title': '失败原因',
								'content': creditErrRea,
								'ok': {}
							});
						}
					});
					// 点击查看征信文件
					$('#creditLoan-cusInfo .zhengxin').on('click', function() {
						var inquiryDate = dateGetYMD(30); //查询一年内的征信文件
						$CL.svc.creditLoanFindCreditReport($CL.dat.getReqJson('creditLoan-cusConfirm@creditReport',inquiryDate));
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
						$CL.zhengxinArr = [];
						 $('.searchCredit ul>li[sel=true]').each(function (index, ele) {
							$CL.zhengxinArr.push($(ele).data('creditInfo'));
				        });
						$(".searchCredit").hide();
					});
					//点击查看征信报告
					$('.searchCredit ul').delegate('u', 'tap', function() {
						$CL.creditInfo = $(this).closest('li').data('creditInfo');
				        $CL.creditReferPath = $CL.creditInfo.creditReferPath;
				        openCreditReportFile($CL, 'F0005');
					});
					if ($CL.messageCache || zancunFlag){
						zancunFlag = false;
						if((parseInt($CL.isLoanValue) & 4) == 4 || (parseInt($CL.isLoanValue) & 1) == 1){
							$CL.svc.queryUnionClientInfo();
						}
					}else{
						$CL.svc.queryUnionClientInfo();
					}
					
});

var codeTime = ''; // 定时器
/* 贷款信息确认界面 */
$(document)
		.on(
				'pageshow',
				'#creditLoan-cusConfirm',
				function() {
//					alert("cusConfirm");
					$CL.USER_NO = "";
					$CL.platGlobalSeq = undefined;
					$CL.hasYZM = $CL.hasQM = false;
					$CL.signHref = '';
					//生产评分卡
					if(!$CL.SCORE_CARD_PATH){
						$CL.svc.createScoreCardPdf();
					}else{
						//此处产生申请表
						$CL.svc.createApplyTablePdf();
					}
					// 回填页面数据
					$CL.dat.fillDataToPage("creditLoan-cusConfirm");
					$('#first-div').show();
					// 点击修改按钮
					$('#creditLoan-cusConfirm .basic_header .reWrite').on(
							'click',
							function() {
								if (codeTime) {
									clearInterval(codeTime);
								}
								$.mobile.changePage(
										'./creditLoan-cusInfo.html', {
											reverse : true
										});
							});
					
					$CL.BTime = null;
					$("#lb-auth-time").text('80');
					$('#first-div').show();
					// 获取短信验证码
					$('#getMsg')
							.on(
									'click',
									function() {
										$('#inp').val('');
//										if (!$CL.hasQM){
//											showMsg('请先完成签名！');
//											return;
//										}
										if ($(this).hasClass('cannt-click')) {
								            return;
								        } else {
								            $(this).addClass('cannt-click');
								        }
										$('.codetime').show();
								        $('.codetime').html('请在<span style="color:red;">80秒</span>内输入验证码');
								        if ($CL.BTime) {
								            clearInterval($CL.BTime);
								        }
								        $('.duanX_con input#inp').val('');
//								        $("#lb-auth-time").text('80');
//										// 获取验证码
								        $CL.USER_NO = "";
								        $CL.svc.imessageAuthentionServiceConF();
									});
					// 点击查看申请表
					$('.linkClick a:eq(0)').on('click', function() {
						$CL.svc.getScoreFileAndShow('s');
					});
					// 点击查看评分卡
					$('.linkClick a:eq(1)').on('click', function() {
						$CL.svc.getScoreFileAndShow('p');
					});
					$('.basic_con:eq(4) .list_row_4').on('click', function(){
						$CL.creditInfo = $(this).closest('li').data('creditInfo');
				        $CL.creditReferPath = $CL.creditInfo.creditReferPath;
				        openCreditReportFile($CL, 'F0005');
					});
					$('.basic_con:eq(5) .list_row_4').on('click', function(){
						$CL.creditReferPath = $(this).closest('li').attr('filePath');
						$CL.svc.getFileDataAndOpen($CL, 'F0010');
					});
					//初始化签名方法
				    signature.init({
				        div: $('#qianM'), //签名容器
				        finishBtn: $("#qianOK"), //完成签名按钮
				        clearBtn: $("#clear-botton"), //清除签名按钮
				        lineColor: '#000000', //线条颜色
				        lineWidth: 3, //线条粗细
				        finish: function (data) { //签名完成回调函数
				            //将签名的str转成路径
				            $CL.signHref = data.replace('data:image/png;base64,', '');
				            if ($('#qianOK #ic_agree').css('display') == 'none') {
				                $('.qianM_shadow').show();
				                $('#qianOK #ic_disagree').hide();
				                $('#qianOK #ic_agree').show();
				                $("#clear-botton").css("color", "#CCCCCC");
				                $CL.hasQM = true;
				            } else {
				            	$CL.hasQM = false;
				                $('.qianM_shadow').hide();
				                $('#qianOK #ic_disagree').show();
				                $('#qianOK #ic_agree').hide();
				                $("#clear-botton").css("color", "#0F45A7");
				            }
				        }
				    });
					$('#btn_next')
							.on(
									'click',
									function() {
										if (!$CL.hasQM) {
											showMsg('请确认签名!');
											return;
										}
										if ($CL.USER_NO == '' && !$CL.hasYZM) {
								            showMsg('请点击获取短信验证码!');
								            $('#creditLoan-cusConfirm #inp').val('');
								            return;
								        }
										if ($CL.USER_NO == '') {
								            showMsg('请点击获取短信验证码!');
								            $('#creditLoan-cusConfirm #inp').val('');
								            return;
								        }
										$CL.msgInfo = $(
												'#creditLoan-cusConfirm #inp')
												.val();
										if (!(fmReg.pwD6
												.test($CL.msgInfo))) {
											showMsg('请输入正确格式的短信验证码！');
											return;
										}
									    if($CL.BTime){
									       clearInterval($CL.BTime);
									       $('#getMsg').removeClass('cannt-click').text('重新获取');
								            $('.codetime').html('请在<span style="color:red;">0秒</span>内输入验证码');
									    }
										$CL.svc.creditLoanSubmitService();
									});
				});

/*信用贷款信息完成界面*/
$(document).on('pageshow', '#creditLoan-complete', function () {
    if ($CL.BTime) {
        clearInterval($CL.BTime);
    }
    $('.name_cn').text(custermerInfo.name);  //申请人姓名
    $('.zheng_num').text(custermerInfo.cerNO); //证件号码
    $('.phone_num').text($CL.mobile); //手机号码
    $('.loan_money').text($CL.page.creditLoanFmoney($CL.loanMoney)); //贷款金额
    $('.loan_time').text($CL.loanTime); //贷款期限
    $('.loan_method').text(_paymentMethod[$CL.paymentMethod]); //还款方式
    $('.loan_acct').text($CL.acctNo); //还款账号
    $('.loan_limit').text($CL.page.creditLoanFmoney($CL.loanLimit)); //授信额度
    $('#btn_next').on('click', function () {
        $.mobile.changePage('./creditLoan-product.html', {reverse: true});
    })
});
$CL.page={
		initPicturePage:function(){
			if ($CL.isPicturePage || workbenchJson.isTemp) {  //反显
		        workbenchJson.isTemp = false;
		        $('.img_content .camera-pic').remove();
		        var imgArr = [];
		        var imgTypeArr = [];
		        imgArr = $CL.applicationObj.mPicFileARR;
		        imgTypeArr = $CL.applicationObj.mPicFileMsgType;
		        var number = 0;
		        $.each(imgArr, function (index, el) {
		        	number++;
		            if (index < $CL.biPai && el) {
		                $('.img_box:eq(' + index + ') .customer').find('.camera-pic').remove();
		                $('.img_box:eq(' + index + ') .customer').append('<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">');
		                $('.img_box:eq(' + index + ') .rephoto').text('重拍');
		                $('.img_box:eq(' + index + ') .camera').hide();
		            } else {
		                if (!el) return true;
		                var activeEn = imgTypeArr[index - $CL.biPai];
		                var htmlText = '<div class="img_box" style="position: relative;">' +
		                '<div class="customer customer_six" picName="' + activeEn + '">' +
		                '<div class="rephoto">重拍</div>' +
		                '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/ style ="display:none">' +
		                '<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">' +
		                '</div>' +
		                '<div class="img_notes qitazhengming" othername="qitazhengming">其他</div>' +
		                '<div class="qita-tanchuang-cbg"></div>' +
		                '<img src="../../images/crow_icon_win.png" class="crow_icon_win" />' +
		                '<div class="qita-tanchuang-con">' +
		                '<div class="queren-quxiao">' +
		                '<div class="quxiao-ok quxiao-click">取消</div>' +
		                '<div class="quxiao-ok queding-click">确定</div>' +
		                '</div>' +
		                '<ul class="qita-tanchuang-ul">' ;
		                if($CL.qtPicName.length > 0){
							$($CL.qtPicName).each(function(index){
								htmlText += '<li othername="'+$CL.qtPicCode[index]+'">'+$CL.qtPicName[index]+'</li>'
							});
						}
		                htmlText += '' +
		                '</ul>' +
		                '</div>' +
		                '</div>';
		                $(htmlText).insertBefore('.img_box:last');
		                var activeName = $('.img_box:last').find('li[othername="' + activeEn + '"]').text();
		                $('.img_box:last').prev().find('.img_notes').attr('othername', activeEn).text(activeName);
		            }
		        });
		        //监测下一步是否可点击
		        var ind = 0;
		        for (var i = 0; i < $CL.biPai; i++) {
		            if ($('#creditLoan-cusPicture .customer:eq(' + i + ')').find("img").length == 2) {
		                ind++;
		                if (ind >= $CL.biPai) {
		                    $('#creditLoan-cusPicture #btn_next').addClass('btn_next');
		                } else {
		                    $('#creditLoan-cusPicture #btn_next').removeClass('btn_next');
		                }
		            }
		        }
		        $CL.page.validatePicCss();
		    } else if (commonJson.isCustermerInfoMultiplex) {  //影像复用,复用客户合影照，省份证正，反面照。
		        $('.customer_four').attr('picname', 'F0001' + $('.customer_four').attr('picname'));
		        $('.customer_five').attr('picname', 'F0001' + $('.customer_five').attr('picname'));

		        var CUSTANDCUSTOWNERPICBase64 = custermerInfo.custAndCustOwnerPic.replace(/\\/g, "").replace('data:image/png;base64,', '');
		        var FRONTIDCARDPICBase64 = custermerInfo.frontIDCardPic.replace(/\\/g, "").replace('data:image/png;base64,', '');
		        var BACKIDCARDPICBase64 = custermerInfo.backIDCardPic.replace(/\\/g, "").replace('data:image/png;base64,', '');

		        //与客户合影base64转路径
		        Meap.transFormImage(getYMDHMSM('custAndCustOwnerPic') + commonJson.udId, CUSTANDCUSTOWNERPICBase64, 'picSty', function (msg1) {
		            $('.img_box:eq(1) .customer').append('<img src="' + msg1 + '" width="100%" height="115px" class="camera-pic">');
		        }, function (err) {
		            showMsg('与客户合影base64转路径失败');
		        });
		        //身份证正面base64转路径
		        Meap.transFormImage(getYMDHMSM('frontIDCardMPic') + commonJson.udId, FRONTIDCARDPICBase64, 'picSty', function (msg2) {
		            $('.img_box:eq(2) .customer').append('<img src="' + msg2 + '" width="100%" height="115px" class="camera-pic">');
		        }, function (err) {
		            showMsg('身份证正面base64转路径失败');
		        });
		        //身份证反面base64转路径
		        Meap.transFormImage(getYMDHMSM('backIDCardMPic') + commonJson.udId, BACKIDCARDPICBase64, 'picSty', function (msg3) {
		            $('.img_box:eq(3) .customer').append('<img src="' + msg3 + '" width="100%" height="115px" class="camera-pic">');

		        }, function (err) {
		            showMsg('身份证反面base64转路径失败');
		        });
		        $('.img_box:eq(1) .rephoto,.img_box:eq(2) .rephoto,.img_box:eq(3) .rephoto').text('重拍');
		        $('.img_box:eq(1) .camera,.img_box:eq(2) .camera,.img_box:eq(3) .camera').hide();

		    }
		    //点击其他
		    $('#creditLoan-cusPicture .conter-con').on('click', '.qitazhengming', function (ev) {
		    	if ($('.qita-tanchuang-con').css('display') == 'none') {
		    		$CL.dat.imageAcq.curParentObj = $(this).siblings('.customer');
		    		$('.qita-tanchuang-ul').show().css('marginTop', '0');
		    		$(this).siblings('.qita-tanchuang-con').show();
		    		$(this).siblings('.crow_icon_win').show();
		    		$(this).siblings('.qita-tanchuang-cbg').show();
		    		var othername = $(this).attr('othername');
		    		$(this).siblings('.qita-tanchuang-con').find('li').removeClass('qita-tanchuang-li');
		    		$(this).siblings('.qita-tanchuang-con').find('li[othername=' + othername + ']').addClass('qita-tanchuang-li');
		    	}
		    });
		    $('#creditLoan-cusPicture .conter-con').on('click', '.qita-tanchuang-ul>li', function (ev) {
		        $(this).addClass('qita-tanchuang-li').siblings('li').removeClass('qita-tanchuang-li');
		    });
		    $('#creditLoan-cusPicture .conter-con').on('click', '.quxiao-click', function (ev) { //点击取消关闭下拉框
		        $('.qita-tanchuang-con').hide();
		        $('.qita-tanchuang-cbg').hide();
		        $('.crow_icon_win').hide();
		    });
		    $('#creditLoan-cusPicture .conter-con').on('click', '.queding-click', function (ev) { //点击确认选择
		        $('.qita-tanchuang-con').hide();
		        $('.qita-tanchuang-cbg').hide();
		        $('.crow_icon_win').hide();
		        var textHtml = $(this).closest('.qita-tanchuang-con').find('li.qita-tanchuang-li').html();
		        var othername = $(this).closest('.qita-tanchuang-con').find('li.qita-tanchuang-li').attr('othername');
		        $(this).closest('.qita-tanchuang-con').siblings('.qitazhengming').html(textHtml).attr('othername', othername);
		        if ($CL.dat.imageAcq.curParentObj.attr('picname') != othername) {
		            $CL.dat.imageAcq.curParentObj.attr('picname', othername);
		            if ($CL.dat.imageAcq.curParentObj.find('.camera-pic').length > 0) {
		                $CL.dat.imageAcq.imgSrc = $CL.dat.imageAcq.curParentObj.find('.camera-pic').attr('src');
		                deletePhoto([$CL.dat.imageAcq.imgSrc], function (msg) {
		                    $CL.dat.imageAcq.curParentObj.find('.camera-pic').remove();
		                    $CL.dat.imageAcq.curParentObj.find('.camera').show();
		                    $CL.dat.imageAcq.curParentObj.find('.rephoto').html('选拍，可多张拍摄');
		                    //监测下一步是否可点击
		                    var ind = 0;
		                    for (var i = 0; i < $CL.biPai; i++) {
		                        if ($('#creditLoan-cusPicture .customer:eq(' + i + ')').find("img").length == 2) {
		                            ind++;
		                            if (ind >= $CL.biPai) {
		                                $('#creditLoan-cusPicture #btn_next').addClass('btn_next');
		                            } else {
		                                $('#creditLoan-cusPicture #btn_next').removeClass('btn_next');
		                            }
		                        }
		                    }
		                }, function (err) {

		                })
		            }
		        }
		    });
		    $('#creditLoan-cusPicture .conter-con').on('click', '.customer', function (ev) {
		    	//alert("photo!");
		        $CL.dat.imageAcq.curParentObj = $(this);
		        //alert("$CL.dat.imageAcq.curParentObj=="+$CL.dat.imageAcq.curParentObj);
		        $CL.dat.imageAcq.imgSrc = $(this).find('.camera-pic').attr('src');
		        //alert("$CL.dat.imageAcq.imgSrc=="+$CL.dat.imageAcq.imgSrc);
		        var oTarget = ev.target;
		        if ($(this).find('.rephoto').html() == '重拍') { //重拍
		            if ($(oTarget).hasClass('rephoto')) {
		                $CL.dat.imageAcq.reGetImg($CL.dat.imageAcq.curParentObj, $CL.dat.imageAcq.imgSrc);
		            }
		            if ($(oTarget).hasClass('camera-pic')) { //预览大图
		                $CL.dat.imageAcq.imgSrc = $(oTarget).attr('src');
		                $CL.dat.imageAcq.reviewImg($(oTarget).attr('src'));
		            }
		            return;
		        }
		        //拍照
		        if ($CL.dat.imageAcq.curParentObj.parent().hasClass('get-face')) {
		        	//alert("get-face");
		            $CL.dat.imageAcq.getFace($CL.dat.imageAcq.curParentObj);
		        } else {
		        	//alert("not get-face");
		            $CL.dat.imageAcq.getImg($CL.dat.imageAcq.curParentObj);
		        }

		    });
		    //预览大图 点击关闭
		    $('.bigpic-review-close').click(function (event) {
		        $CL.dat.imageAcq.reviewImgClose();
		    });
		    //预览大图 删除图片
		    $('.bigpic-review-del').click(function (event) {
		        $CL.dat.imageAcq.delImg($CL.dat.imageAcq.curParentObj, $CL.dat.imageAcq.imgSrc);
		    });
		    //预览大图 重新拍照
		    $('.bigpic-review-rephone').click(function (event) {
		        $CL.dat.imageAcq.reGetImg($CL.dat.imageAcq.curParentObj, $CL.dat.imageAcq.imgSrc);
		    });
		    //点击暂存
		    $('#creditLoan-cusPicture .customerP-zancun').on('click', function () {
		    	$CL.polwhcjg2 = '';
				$CL.polwhcFlag2 = '';
		        $CL.applicationObj.mPicFileARR = []; //要打包的影像路径
		        $CL.applicationObj.mPicFileInfoARR = [{
		            "b": []
		        }]; //每个图片的名称和类型
		        $CL.applicationObj.mPicFileMsgType = []; //其他图片对象的证明类型
		        //数据保存入$CL.applicationObj中
		        $CL.dat.cachePictureCreditLoan($CL.applicationObj.mPicFileARR, $CL.applicationObj.mPicFileInfoARR, $CL.applicationObj.mPicFileMsgType, '#creditLoan-cusPicture')
		        $CL.svc.insertData('creditLoan-cusPicture');//保存影像信息到数据库
//		        $.mobile.changePage('creditLoan-product.html', {reverse: true});
		        dzhShouyeNo();
		    });
		    //点击上一步，跳转页面
//		    $('.previous-con').on('click', function () {
//		        $.mobile.changePage('./creditLoan-reading.html', {reverse: true});
//		    });
		    //点击下一步
		    $('#btn_next').on('click', function () {
		        if (!$(this).hasClass('btn_next')) return;

		        if (!creditJson.isPrev.LLDBisFromPrev) {  //后面返回已进行人脸对比
		            $CL.isPicturePage = true;
		            $CL.applicationObj.mPicFileARR = []; //要打包的影像路径
		            $CL.applicationObj.mPicFileInfoARR = [{
		                "b": []
		            }]; //每个图片的名称和类型
		            $CL.applicationObj.mPicFileMsgType = []; //其他图片对象的证明类型
			        $CL.dat.cachePictureCreditLoan($CL.applicationObj.mPicFileARR, $CL.applicationObj.mPicFileInfoARR, $CL.applicationObj.mPicFileMsgType, '#creditLoan-cusPicture');
		            $.mobile.changePage('./creditLoan-personFace.html', {transition: "slide"});
		        } else {
		            $.mobile.changePage('./creditLoan-cusInfo.html', {transition: "slide"});
		        }
		    })
		},
		validatePicCss:function(){
			var qitaObj = $('.img_box');
			$.each(qitaObj,function(index, el){
				if($('.img_box:eq('+index+')').find('.qita-tanchuang-con').length > 0){
					if(index < 3){
						$('.img_box:eq('+index+')').find('.qita-tanchuang-con').css('height','127px');
						$('.img_box:eq('+index+')').find('.qita-tanchuang-ul').css('height','70px');
					}else{
						$('.img_box:eq('+index+')').find('.qita-tanchuang-con').css('height','307px');
						$('.img_box:eq('+index+')').find('.qita-tanchuang-ul').css('height','257px');
					}
				}
			});
		},
		initLimitTestPage:function(msg){
			showLoader("页面加载中...");
			var responseBody = responseBodySuccFormat(msg);
			var textHtml = '';
			if (responseBody[0].results == '00') {
				$CL.marryList = {};
				$CL.pfkjgxObj = {};
				$CL.SCORE_CARD_ID = responseBody[1].hashMap[0].SCORE_CARD_ID;
				
				//alert("$CL.SCORE_CARD_ID=="+$CL.SCORE_CARD_ID);
				var scoreItemBody=responseBody[1].hashMap[1].scoreItems;
				$.each(scoreItemBody, function(index, el) {
					//alert("index="+index+"  el=="+JSON.stringify(el));
					var respVo = el.scoreItemVO[0];
					var isSel = respVo.DISPLAY_TYPE;
					var isScore = respVo.IS_SCORE_ITEM;
					var value = respVo.ITEM_VALUE;
					var isAmt = respVo.IS_AMT;
					var isModify = respVo.IS_MODIFIABLE;//0 NOT 1 YES
					var isTimes = respVo.IS_CNT;
					var valueTmp = '';
					if(!value){
						value = '';
						valueTmp = '';
					}else{
						if(isSel == '1'){
							var strs = value.split('-');
							if(strs.length > 1){
								valueTmp = strs[1];
							}else{
								valueTmp = value;
							}
						}else{
							valueTmp = value;
						}
					}
					if(isScore != '0'){
						if(isSel == '3'){//非显示项
							return true;
						}
						if(respVo.CATE_NAME == 'maxline'){
							return true;
						}
//						if(isModify == '0'){
//							value = _creditLoanTemp[respVo.CATE_NAME];
//						}
						if(isAmt == "1"){
							if(valueTmp){
								valueTmp = $CL.page.creditLoanFmoney(valueTmp);
							}
						}
						textHtml += '<li class="liclass">'
							+ '<div class="basic_rows_name_div1" id="'+respVo.CATE_NAME+'_div1">'
							+ '<div class="">'
							+ respVo.CATE_DESCRIPTION
							+ '</div>'
							+ '</div>'
							+ '<div class="basic_rows_name_div12">'
							+ '<span id="creditLoan-mobile" class="basic_rows_2" style="color:#999999;">'
							+ valueTmp
							+ '</span>'
							+ '</div>'
							+ '<div class="basic_rows_name_div2">';
						if(isModify == '0'){
							textHtml += '<div class="basic_rows_name_div2-se" style="background-color:#F0F0F0">';
						}else{
							textHtml += '<div class="basic_rows_name_div2-se">';
						}
							
						if(isSel == '1'){
							var optionsResp = el.scoreItemVO[1].CATECODE[0].CODEMAP;
							if(isModify == '0'){
								textHtml += '<select id="'+respVo.CATE_NAME+'" class="basic_rows_name_div2-sel" style="background-color:#F0F0F0" disabled>';
							}else{
								textHtml += '<select id="'+respVo.CATE_NAME+'" class="basic_rows_name_div2-sel">';
							}
							if(value == ''){
								textHtml += '<option value=""></option>'
							}
							for(var key in optionsResp) {
								var obj = optionsResp[key]
								var ovo = obj.optionVO;
								var y1 = ovo[0];
								var name1 = y1.name;
								var value1 = y1.value;
								if(value1 == value){
									textHtml += '<option value="'+value1+'" selected="selected">'+name1+'</option>'
								}else{
									textHtml += '<option value="'+value1+'">'+name1+'</option>'
								}
								if(respVo.CATE_NAME == 'marital_stste'){
									$CL.marryList[value] = name1;
								}
							}
							textHtml += '</select>';
						}else{
							var strFun = "";
							if(isTimes == '1'){
								strFun = "$CL.page.checkTimes('"+respVo.CATE_NAME+"')";
							}else if(isAmt == "1"){
								strFun = "$CL.page.limitBlur('"+respVo.CATE_NAME+"')";
								if(value){
									value = $CL.page.creditLoanFmoney(value);
								}
							}
							if(strFun){
								if(isModify == '0'){
									textHtml += '<input type="text" class="basic_rows_name_div2-sel" style="text-indent:20px;background-color:#F0F0F0" data-role="none" data-type="amt" value="'+value+'" id="'+respVo.CATE_NAME+'" onblur="'+strFun+'" disabled/>';
								}else{
									textHtml += '<input type="text" class="basic_rows_name_div2-sel" style="text-indent:20px" data-role="none" data-type="amt" value="'+value+'" id="'+respVo.CATE_NAME+'" onblur="'+strFun+'" />';
								}
							}else{
								if(isModify == '0'){
									textHtml += '<input type="text" class="basic_rows_name_div2-sel" style="text-indent:20px;background-color:#F0F0F0" data-role="none" value="'+value+'" id="'+respVo.CATE_NAME+'" disabled/>';
								}else{
									textHtml += '<input type="text" class="basic_rows_name_div2-sel" style="text-indent:20px" data-role="none" value="'+value+'" id="'+respVo.CATE_NAME+'" />';
								}
							}
						}
						textHtml += '</div></div></li>'
					}else{
						$CL.pfkjgxObj[respVo.CATE_NAME] = respVo.CATE_DESCRIPTION;
					}
				});
				$('#creditLoan-testLimit .confirm_ul').html(textHtml).trigger('create');
				$('#test_limit_btn').addClass('btn_next');
				hideLoader();
			} else if (responseBody[0].results == '08') {
				hideLoader();
				$CL.svc.queryScoreCardItem();
			} else if (responseBody[0].results == '09'){
				hideLoader();
				showTags({
					'title' : '提示', // 非必输 默认值：提示
					'content': '系统超时，' + responseBody[0].message + '，是否继续？',
					'ok' : {
						'title' : '放弃',// 非必输 默认值：取消
						'fun' : function() { // 非必输 如果输入则执行此函数
							dzhShouyeNo();
						}
					},
					'cancel' : {
						'title' : '继续',// 非必输 默认值：确认
						'fun' : function() { // 非必输 如果输入则执行此函数
							$CL.svc.queryScoreCardItem();
						}
					}
				});
			}else {
				hideLoader();
				showTags({
					'title' : '提示',
					'content' : responseBody[0].message,
					'ok' : {
						fun : function() {
						}
					}
				});
			}
		},
		testScoreSucc:function(msg,obj){
			var responseBody = responseBodySuccFormat(msg);
			if (responseBody[0].results == '00') {
				//$CL.SCORE_CARD_ID = responseBody[1].hashMap[0].SCORE_CARD_ID;
				var resultObj = responseBody[1].hashMap[1].RESULT;
				var htmlStr = "";
				$.each(resultObj, function(index, el) {
					var cate_name = el.scoreItemValueVO[0].CATE_NAME;
					if(cate_name == 'maxline'){//最终可授信额度
//						htmlStr += "<div class='result-value-up-left'><span style=\"padding-left:5%\">";
						var item_value = $CL.page.creditLoanFmoney(el.scoreItemValueVO[0].ITEM_VALUE);//格式化金额参数
//						var desc = '最大可授信额度';
						htmlStr = "<div class='result-value-up-right'><span style=\"color:#0F45A7\">"+item_value+"</span>元</div>";
						$CL.loanLimit = el.scoreItemValueVO[0].ITEM_VALUE;
					}
				});
				$('#creditLoan-testLimit .result-value-up').html(htmlStr);
				$("#creditLoan-testLimit-uname").text(custermerInfo.name);
				if(custermerInfo.sex == '男'){
					$("#creditLoan-testLimit-usex").text('先生');
				}else{
					$("#creditLoan-testLimit-usex").text('女士');
				}
				$("#creditLoan-testLimit .result-display").show();
				hideLoader();
			} else if (responseBody[0].results == '08') {
				hideLoader();
				$CL.svc.createAndCalculateScoreCard(obj);
			} else {
				hideLoader();
				showTags({
					'title' : '提示',
					'content' : responseBody[0].message,
					'ok' : {
						fun : function() {
						}
					}
				});
			}
		},
		saveSCPath:function(msg){
			var responseBody = responseBodySuccFormat(msg);
			if (responseBody[0].results == '00') {
				$CL.SCORE_CARD_PATH = responseBody[1].hashMap[0].socreCardPdf;
				$CL.svc.createApplyTablePdf();//异步情况下的修改
			} else if (responseBody[0].results == '08') {
				$CL.svc.createScoreCardPdf();
			} else {
				$CL.SCORE_CARD_PATH = '';
				$CL.svc.createApplyTablePdf();////异步情况下的修改
			}
		},
		limitBlur:function(id){
			var value = $('#'+id).val();
			if(value){
				var value = $CL.page.creditLoanFmoney(value);
				reg = /^[0-9,]+(.[0-9]{2})?$/g;
				if(reg.test(value)){
					$('#'+id).val(value);
				}else{
					$('#'+id).val('');
				}
				
			}else{
				$('#'+id).val('');
			}
		},
		checkTimes:function(id){
			var value = $('#'+id).val();
			if(value){
				reg = /^[0-9]+$/g;
				if(reg.test(value)){
					
				}else{
					$('#'+id).val('');
				}
			}
		},
		checkID:function(value){
			var reg = /(^[1-9]{1}\d{16}[X]$)|(^[1-9]{1}\d{17}$)/g;
			if(reg.test(value)){
				return true;
			}else{
				return false;
			}
		},
		creditLoanFmoney:function(s,n){
			if (!s) return '';
		    if (s == '.') return '';
		    n = n > 0 && n <= 20 ? n : 2;
		    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
		    var l = s.split(".")[0].split("").reverse(),
		        r = s.split(".")[1];
		    t = "";
		    for (i = 0; i < l.length; i++) {
		        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
		    }
		    var ret = t.split("").reverse().join("") + "." + r;
		    return ret;
		},
		findCreditReportSucc:function(msg){
			var responseBody = responseBodySuccFormat(msg);
			if(responseBody[0].results == '00') { //借口处理成功
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
		            li.append($('<div>').css({'width':'50%', 'overflow-x':'auto'}).append($('<u>').html(creditFile.substr(0, creditFile.length - 1))));
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
//						var bro = $(this).closest('li').siblings();
//						bro.find('.dzdImg').css('display', 'none');
//						bro.attr('sel', 'false');
						// $(".searchCredit a:last").addClass('btn_next');
					} else {
						$(this).closest('li').attr('sel', 'false');
						$(this).find('.dzdImg').css('display', 'none');
						// $(".searchCredit a:last").removeClass('btn_next');
					}
				});
			} else if(responseBody[0].results == '08') { //
				var inquiryDate = dateGetYMD(30); //查询一年内的征信文件
				$CL.svc.creditLoanFindCreditReport($CL.dat.getReqJson('creditLoan-cusConfirm@creditReport',inquiryDate));
			} else {
				showTags({
					'title': '提示',
					'content': responseBody[0].message,
					'ok': {}
				});
			}
			
		},
		replaceWithNull:function(id){
			var value = $('#'+id).val();
			var newvalue = '';
			if(value){
				if(value.indexOf(',') != -1){
					var strs = value.split(',');
					for(var i=0;i<strs.length;i++){
						newvalue += strs[i];
					}
				}else{
					newvalue = value;
				}
			}
			return newvalue;
		}
}