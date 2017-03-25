/**
 * 丁宗花
 */
//基金超市（citigold-fundSupermarketsOne.html）
$(document).on("pageshow", '#citigold-fundSupermarketsOne', function() {
	getCurrentLocationCoordinateFun();              //缓存经纬度(校验联网)
	//commonJson.fundCmanagerId ="0000";
	citigoldSortData.BianLiangPanDuan = '2';
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
		//减少滑动页的方法（将swiper-slide的class值去掉，然后将其display：none）

	$("#citigold-fundSupermarketsOne .head-seach-input").on('keydown', function(e) {
		var keyCode = e.keyCode;
		if (keyCode == '13') {
			var reg = /^\d{0,6}$/;
			if (!(reg.test($('.head-seach-input').val()))) {
				showMsg('请输入正确的基金代码!');
				return;
			}
			goldInsJson.codePro = $('.head-seach-input').val();
			$.mobile.changePage('citigold-fundSupermarketsThree.html');
		}
	})

	//弹窗
	$("#jijinshuaixuan-btn").on("click", function() {
		$("#shuaixuan-tanchuang").show();
		$("#shuaixuan-tanchuang").on("click", function() {
		    var evt = event.srcElement ? event.srcElement : event.target;
		    if (evt.id == 'shuaixuan-tanchuang') {
		        $('#shuaixuan-tanchuang').hide();
		    } else {
		        $('#shuaixuan-tanchuang').show();
		    }
		});
		getTaInformationMingcheng();

	});
	
	var CenXingPingJiZhi = $("#CenXingPingJiZhi");
	var CXFengxianXiShuZhi = $("#CXFengxianXiShuZhi");
	var TZHuiBaoLueZhi = $("#TZHuiBaoLueZhi");
	var TZHuiBaoLuePHZhi = $("#TZHuiBaoLuePHZhi");
	
	CenXingPingJiZhi.selectmenu('disable');
	CXFengxianXiShuZhi.selectmenu('disable');
	TZHuiBaoLueZhi.selectmenu('disable');
	TZHuiBaoLuePHZhi.selectmenu('disable');
	
	
	$("#CenXingPingJi").change(function(){
		if($(this).val() != ''){
			CenXingPingJiZhi.selectmenu('refresh', true);
			CenXingPingJiZhi.selectmenu('enable');
		}else{
			CenXingPingJiZhi.val('1').selectmenu('refresh');
			CenXingPingJiZhi.selectmenu('disable');
		}
	});
	$("#CXFengxianXiShu").on("change",function(){
		if($(this).val() != ''){
			CXFengxianXiShuZhi.selectmenu('refresh', true);
			CXFengxianXiShuZhi.selectmenu('enable');
		}else{
			CXFengxianXiShuZhi.val('L').selectmenu('refresh');
			CXFengxianXiShuZhi.selectmenu('disable');
		}
	});
	$("#TZHuiBaoLue").on("change",function(){
		if($(this).val() != ''){
			TZHuiBaoLueZhi.selectmenu('refresh', true);
			TZHuiBaoLueZhi.selectmenu('enable');
		}else{
			TZHuiBaoLueZhi.val('1').selectmenu('refresh');
			TZHuiBaoLueZhi.selectmenu('disable');
		}
	});
	$("#TZHuiBaoLuePH").on("change",function(){
		if($(this).val() != ''){
			TZHuiBaoLuePHZhi.selectmenu('refresh', true);
			TZHuiBaoLuePHZhi.selectmenu('enable');
		}else{
			TZHuiBaoLuePHZhi.val('5').selectmenu('refresh');
			TZHuiBaoLuePHZhi.selectmenu('disable');
		}
	});
	
	//点击筛选
	$("#ShaiXuan").on("click",function(){
//		var reg = /^\d{0,6}$/;
//		if (!(reg.test($('#input-test-con').val()))) {
//			showMsg('请输入正确的基金代码!');
//			return;
//		}
		citigoldSortData.BianLiangPanDuan='1';
		citigoldSortData.CompanyName = $("#CompanyName").val();
		citigoldSortData.CitigoldType = $("#CitigoldType").val();
		citigoldSortData.citigoldJingZhi = $("#citigoldJingZhi").val();
		citigoldSortData.inputTestCon = $("#inputTestCon").val();
		citigoldSortData.CenXingPingJi = $("#CenXingPingJi").val();
		citigoldSortData.CenXingPingJiZhi = $("#CenXingPingJiZhi").val();
		citigoldSortData.CXFengxianXiShu = $("#CXFengxianXiShu").val();
		citigoldSortData.CXFengxianXiShuZhi = $("#CXFengxianXiShuZhi").val();
		citigoldSortData.TZHuiBaoLue = $("#TZHuiBaoLue").val();
		citigoldSortData.TZHuiBaoLueZhi = $("#TZHuiBaoLueZhi").val();
		citigoldSortData.TZHuiBaoLuePH = $("#TZHuiBaoLuePH").val();
		citigoldSortData.TZHuiBaoLuePHZhi = $("#TZHuiBaoLuePHZhi").val();
		
		if($("#CenXingPingJi").val()!='' && $("#CenXingPingJiZhi").val()==''){
			showShaixuan("辰星评级值不能为空。");
			return;
		}
		
		if($("#CXFengxianXiShu").val()!='' && $("#CXFengxianXiShuZhi").val()==''){
			showShaixuan("辰星风险系数值不能为空。");
			return;
		}
		
		if($("#TZHuiBaoLue").val()!='' && $("#TZHuiBaoLueZhi").val()==''){
			showShaixuan("投资回报率值不能为空。");
			return;
		}
		
		if($("#TZHuiBaoLuePH").val()!='' && $("#TZHuiBaoLuePHZhi").val()==''){
			showShaixuan("投资回报率排行值不能为空。");
			return;
		}
		
		
		
		$.mobile.changePage('citigold-fundSupermarketsThree.html');
	});
	//基金搜索代码
	$('#citigold-fundSupermarketsOne .head-seach .seach_icon').on('click', function() {
		var reg = /^\d{0,6}$/;
		if (!(reg.test($('.head-seach-input').val()))) {
			showMsg('请输入正确的基金代码!');
			return;
		}
		goldInsJson.codePro = $('.head-seach-input').val();
		$.mobile.changePage('citigold-fundSupermarketsThree.html');
	})


});

function showShaixuan(msg){
	showTags({
				'title': '提示',
				'content': msg,
				'ok': {}
			});
}

//基金超市（citigold-fundSupermarketsTwo.html）
$(document).on("pageshow",'#citigold-fundSupermarketsTwo',function(){
	getTaInformationMingcheng();
	var citigoldName = $("#citigoldName");
	citigoldName.selectmenu('disable');
	$("#CompanyName").on("change",function(){
		citigoldBiJiao(function(msg){
			citigoldName.selectmenu('refresh', true);
			citigoldName.selectmenu('enable');
		});
		//$("#citigoldName").html("<option value='' selected='selected'>不限</option>");
	});
	$("#JiaRuBiJiao").on("click",function(){//点击加入比较
		if(citigoldName.val()==''){
			showShaixuan("请选择基金。");
			return;
		}
		JiaruBijiao();
	});
	$(".expand-collapse-title").on("click",function(){
		if($(this).siblings(".zhankai-neirong").css("display")=="none"){
			$(this).siblings(".zhankai-neirong").show();
			$(this).children(".expand-collapse-zhankai").hide();
			$(this).children(".expand-collapse-shouqi").show();
		}else{
			$(this).siblings(".zhankai-neirong").hide();
			$(this).children(".expand-collapse-zhankai").show();
			$(this).children(".expand-collapse-shouqi").hide();
		}
	});
});
//基金查询结果页面（citigold-fundSupermarketsThree.html）
$(document).on("pageshow", '#citigold-fundSupermarketsThree', function() {
	showLoader('加载中...');
	if(citigoldSortData.BianLiangPanDuan ==='1'){
		var sendJson = {
		"b": [{
			"orgId.s": commonJson.orgId,
			"moduleId.s": citigoldJson.moduleID, //模块编号
			"tranId.s": citigoldJson.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员
			"deviceNo.s": commonJson.udId, //设备编号
			"offlineOnline.s": 'online', //脱机/联机
			"TACode.s": citigoldSortData.CompanyName, //TA代码
			"PrdCode.s": citigoldSortData.inputTestCon, //产品代码
			"PrdType.s": "0", //产品类别为空则表示不区分 0-基金 1-国内理财 2-境外理财产品
			"pageNum.s": "", //查询页码
			//以下是2015.12.25号增加
			"PrdName.s": "", //产品名称
			"PageSize.s": "", //每页显示的记录数
			"FundType.s": "", //产品类型
			"PrdAttr.s": citigoldSortData.CitigoldType, //产品属性，即类型
			"Nav.s": citigoldSortData.citigoldJingZhi, //单位净值
			"StarRating.s": citigoldSortData.CenXingPingJi, //辰星评级
			"StarRatingLevel.s": citigoldSortData.CenXingPingJiZhi, //辰星评级值
			"DRQuartileRank.s": citigoldSortData.CXFengxianXiShu, //辰星风险系数
			"DRQuartileRankLevel.s": citigoldSortData.CXFengxianXiShuZhi, //辰星风险系数值
			"Return.s": citigoldSortData.TZHuiBaoLue, //投资回报率
			"ReturnValue.s": citigoldSortData.TZHuiBaoLueZhi, //投资回报率值
			"ReturnRank.s": citigoldSortData.TZHuiBaoLuePH, //投资回报率排行
			"ReturnRankValue.s": citigoldSortData.TZHuiBaoLuePHZhi, //投资回报率排行值
			
		}]
	};
	IFinancialProductsServiceFun(sendJson, function(msg) {
			IFinancialProductsServiceSucc(msg)
		}, function(err) {
			funFail(err);
		})
	}else{
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
			"pageNum.s": "", //查询页码
			//以下是2015.12.25号增加
//			"PrdName.s": "", //产品名称
//			"PageSize.s": "", //每页显示的记录数
//			"FundType.s": "", //产品类型
//			"PrdAttr.s": "", //产品属性，即类型
//			"Nav.s": "", //单位净值
//			"StarRating.s": "", //辰星评级
//			"StarRatingLevel.s": "", //辰星评级值
//			"DRQuartileRank.s": "", //辰星风险系数
//			"DRQuartileRankLevel.s": "", //辰星风险系数值
//			"Return.s": "", //投资回报率
//			"ReturnValue.s": "", //投资回报率值
//			"ReturnRank.s": "", //投资回报率排行
//			"ReturnRankValue.s": "", //投资回报率排行值
			
		}]
	};
	IFinancialProductsServiceFun(sendJson, function(msg) {
			IFinancialProductsServiceSucc(msg)
		}, function(err) {
			funFail(err);
		})
	}
	
		//为每一条数据添加class=‘click'
	$(".box-content").on('click', '.box-rows', function() {
		citigoldJson.jjProInfo = JSON.parse($(this).attr('returnJsonStr'));
		citigoldJson.jjProInfo.ReferenceRate = '以基金公司公告为准';
		if (commonJson.fundCmanagerId == "") {
			showTags({
				'title': '提示',
				'content': '没有基金客户经理号，无法办理该业务!',
				'ok': {}
			});
			return;
		}
		if ($(this).hasClass('click')) {
			$('.box-rows').removeClass('click');
			$('.footter .previous').removeClass('btn_next');
		} else {
			/*var _oDate = new Date();
			var _h = _oDate.getHours() > 9 ? _oDate.getHours() : "0"+_oDate.getHours();
			var _m = _oDate.getMinutes() > 9 ? _oDate.getMinutes() : "0"+_oDate.getMinutes();
			var _s = _oDate.getSeconds() > 9 ? _oDate.getSeconds() : "0"+_oDate.getSeconds();
			var oDate = String(_h)+String(_m)+String(_s);
			if((oDate > citigoldJson.jjProInfo.OpenTime) && (oDate < citigoldJson.jjProInfo.CloseTime)){*/
			$(this).addClass('click').siblings().removeClass('click');
			$('#buy_next').addClass('btn_next');
			if (citigoldJson.jjProInfo.EnableTrans.substring(0, 1) == '1') { //购买
				$('.footter .previous:eq(1)').addClass('btn_next').attr('_href', 'citigold-fundSupermarketsFives.html');
			} else {
				$('.footter .previous:eq(1)').removeClass('btn_next').attr('_href', '');
			}
			if (citigoldJson.jjProInfo.EnableTrans.substring(1, 2) == '1') { //定投
				$('.footter .previous:eq(0)').addClass('btn_next').attr('_href', 'citigold-fundSupermarketsFour.html');
			} else {
				$('.footter .previous:eq(0)').removeClass('btn_next').attr('_href', '');
			}
			/*}else{
			    showMsg('本产品已过闭市时间，无法购买！');
			}*/


			// alert($(this).attr('IpoEndDate'));
		}
	});
	$('.previous').click(function() {
		if (!$(this).hasClass('btn_next')) return;
		citigoldJson.isGMorDT = $(this).attr('isGMorDT');
		$.mobile.changePage($(this).attr('_href'));
	});
});

//基金购买 页面
$(document).on('pageshow', '#citigold-fundSupermarketsFives', function() {
		$('.confirm-ul').html('<li class="basic-li">' +
			'<div class="li-first-div">' +
			'<span class="basic-name">基金名称：</span>' +
			'<span id="basic-name">' + citigoldJson.jjProInfo.PrdName + '</span>' +
			'</div>' +
			'<div class="li-second-div">' +
			'<span class="basic-sex">基金代码：</span>' +
			'<span id="basic-sex">' + citigoldJson.jjProInfo.PrdCode + '</span>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="li-first-div">' +
			'<span class="basic_zhengType">基金类型：</span>' +
			'<span id="basic_zhengType">' + PrdAttr[citigoldJson.jjProInfo.PrdAttr] + '</span>' +
			'</div>' +
			'<div class="li-second-div">' +
			'<span class="basic_guoJ">风险等级：</span>' +
			'<span id="basic_guoJ">' + riskLevel[citigoldJson.jjProInfo.RiskLevel] + '</span>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="li-first-div">' +
			'<span class="basic_zhengJH">单位净值：</span>' +
			'<span id="basic_zhengJH">' + fmoney(citigoldJson.jjProInfo.NAV, 4) + '元</span>' +
			'</div>' +
			'<div class="li-second-div">' +
			'<span class="basic_addressZ">净值日期：</span>' +
			'<span id="basic_addressZ">' + citigoldJson.jjProInfo.NavDate + '</span>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="li-first-div">' +
			'<span class="basic_zhengJY">首次购买起点：</span>' +
			'<span id="basic_zhengJY">' + fmoney(citigoldJson.jjProInfo.PfirstAmt) + '元</span>' +
			'</div>' +
			'<div class="li-second-div">' +
			'<span class="basic_qianF">最小购买单位：</span>' +
			'<span id="basic_qianF">' + fmoney(citigoldJson.jjProInfo.SubUnit) + '元</span>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="li-first-div">' +
			'<span class="basic_zhengJY">追加购买下限：</span>' +
			'<span id="basic_zhengJY">' + fmoney(citigoldJson.jjProInfo.PappAmt) + '元</span>' +
			'</div>' +
			'<div class="li-second-div">' +
			'<span class="basic_qianF">参考费率：</span>' +
			'<span id="basic_qianF">' + citigoldJson.jjProInfo.ReferenceRate + '</span>' +
			'</div>' +
			'</li>');
	})
	//基金定投 页面
$(document).on('pageshow', '#citigold-fundSupermarketsFour', function() {
		$('.confirm-ul').html('<li class="basic-li">' +
			'<div class="li-first-div">' +
			'<span class="basic-name">基金名称：</span>' +
			'<span id="basic-name">' + citigoldJson.jjProInfo.PrdName + '</span>' +
			'</div>' +
			'<div class="li-second-div">' +
			'<span class="basic-sex">基金代码：</span>' +
			'<span id="basic-sex">' + citigoldJson.jjProInfo.PrdCode + '</span>' +
			'</div>' +
			'</li>' +
			'<li>' +
			'<div class="li-first-div">' +
			'<span class="basic_zhengType">币种：</span>' +
			'<span id="basic_zhengType">' + currType[citigoldJson.jjProInfo.CurrType] + '</span>' +
			'</div>' +
			'<div class="li-second-div">' +
			'<span class="basic_guoJ">定投下限：</span>' +
			'<span id="basic_guoJ">' + fmoney(citigoldJson.jjProInfo.PMinInvestAmt) + '元</span>' +
			'</div>' +
			'</li>');
	})
	//刷身份证 页面
$(document).on('pageshow', '#citigold-readIDOne', function() {
		citigoldJson.riskCache = false;
		citigoldJson.signCache = false;
		citigoldJson.imageCache = false;
		citigoldJson.GMCache = false;
		citigoldJson.DTCache = false;
		citigoldJson.msgSureCache = false;
		commonJson.isCustermerInfoMultiplex = false; //初始化影像复用 没有复用
		//调用刷身份证方法
		creditJson.isCancelReadCard = false; //初始化'是取消执行读取身份证方法' 默认false打开页面就执行
		/*creditReadCard(function() {
		    $.mobile.changePage('citigold-readIDTwo.html');
		}, function(err) {
		    $.mobile.changePage('citigold-readIDTwo.html');

		});*/
		$(".footter .previous").on('click', function() {
				creditReadCard(function() {
					$.mobile.changePage('citigold-readIDTwo.html');
				}, function(err) {
					$.mobile.changePage('citigold-readIDTwo.html');

				});
			})
			//点击影像复用
		$("#citigold-readIDOne .conter-con .picRe").on('click', function() {
				creditJson.isCancelReadCard = true;
				$.mobile.changePage('citigold-video.html');
			})
			//点击首页
		$("#citigold-readIDOne .head-left").on('click', function() {
				creditJson.isCancelReadCard = true;
				$.mobile.changePage('../main.html', {
					reverse: true
				});
			})
			//点击退出
		$("#citigold-readIDOne .head-right").on('tap', function() {
			creditJson.isCancelReadCard = true;
			$.mobile.changePage('citigold-fundSupermarketsOne.html', {
				reverse: true
			});
		})
	})
	//影像复用页面
$(document).on("pageshow", '#citigold-video', function() {
	//从数据库中查询可复用的个人信息
	queryAllcacheCustermerInfo();
	$('.previous-con').on('click', function() {
		$.mobile.changePage('citigold-readIDOne.html', {
			reverse: true
		});
	});
	$('#btn_next').on('click', function() {
		if (!($(this).hasClass('btn_next'))) return;
		commonJson.isCustermerInfoMultiplex = true; //确定影像复用
		$.mobile.changePage('citigold-readIDTwo.html');
	});
});

//身份证联网核查
$(document).on("pageshow", '#citigold-readIDTwo', function() {
	if (creditJson.isReadCardSucc) { //读卡成功
		$("#citigold-readIDTwo .ziduan-value:eq(0)").text(custermerInfo.name);
		$("#citigold-readIDTwo .ziduan-value:eq(1)").text(custermerInfo.sex);
		$("#citigold-readIDTwo .ziduan-value:eq(2)").text(custermerInfo.nation);
		$("#citigold-readIDTwo .ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
		$("#citigold-readIDTwo .ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
		$("#citigold-readIDTwo .ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
		$("#citigold-readIDTwo .ziduan-value:eq(6)").text(custermerInfo.address);
		$("#citigold-readIDTwo .ziduan-value:eq(7)").text(custermerInfo.cerNO);
		$("#citigold-readIDTwo .ziduan-value:eq(8)").text(custermerInfo.issAuthority);
		$("#citigold-readIDTwo .ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
		$('#citigold-readIDTwo .sfz-img').attr('src', custermerInfo.image);
		if (commonJson.isCustermerInfoMultiplex || citigoldJson.riskCache || citigoldJson.signCache || citigoldJson.imageCache) { //如果是影像复用不需要进行联网核查
			$("#citigold-readIDTwo .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
			//$("#xinka-readID .loading_box").html(''); 
			$('#dz-read-next').addClass('btn_next');
		} else {
			$('.footter .previous:eq(0)').removeClass('btn_next');
			$('.sh_loading_box_shadow').remove();
			$('.header .head-left,.header .head-right').addClass('btn-cannt-click');
			$('.ui-page').append('<div class="sh_loading_box_shadow" style="position:absolute;right:0;top:0;left:0;bottom:0;z-index:24;background-color: rgba(0,0,0,.0);"></div>');
			var sendJson = {
				"b": [{
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"orgId.s": commonJson.orgId, //机构号
					"moduleId.s": citigoldJson.moduleID, //模块编号
					"tranId.s": citigoldJson.tranId, //交易编号
					"operatorNo.s": commonJson.adminCount, //操作员
					"deviceNo.s": commonJson.udId, //设备编号
					"DOCUMENT_TYPE.s": "0", //证件类型
					"DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号码
					"CLIENT_NAME.s": custermerInfo.name, //被核对人姓名
					"BUSSINESSCODE.s": "01", //业务总类
					"BRANCH_ID.s": commonJson.orgId //机构号
				}]
			};
			//身份证联网核查
			icitizenCertificateIdenifyFun(sendJson, function(msg) {
				$('.footter .previous:eq(0)').addClass('btn_next');
				$('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
				$('.sh_loading_box_shadow').remove();
				idebitItizenCertificateIdenifyCitSucc(msg);
			}, function(err) {
				$('.footter .previous:eq(0)').addClass('btn_next');
				$('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
				$('.sh_loading_box_shadow').remove();
				$("#citigold-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
				funFail(err);
			})
		}
	} else {
		if (commonJson.isCustermerInfoMultiplex) {
			$("#citigold-readIDTwo .ziduan-value:eq(0)").text(custermerInfo.name);
			$("#citigold-readIDTwo .ziduan-value:eq(1)").text(custermerInfo.sex);
			$("#citigold-readIDTwo .ziduan-value:eq(2)").text(custermerInfo.nation);
			$("#citigold-readIDTwo .ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
			$("#citigold-readIDTwo .ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
			$("#citigold-readIDTwo .ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
			$("#citigold-readIDTwo .ziduan-value:eq(6)").text(custermerInfo.address);
			$("#citigold-readIDTwo .ziduan-value:eq(7)").text(custermerInfo.cerNO);
			$("#citigold-readIDTwo .ziduan-value:eq(8)").text(custermerInfo.issAuthority);
			$("#citigold-readIDTwo .ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
			$('#citigold-readIDTwo .sfz-img').attr('src', custermerInfo.image);
			$("#citigold-readIDTwo .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
			//$("#xinka-readID .loading_box").html(''); 
			$('#dz-read-next').addClass('btn_next');
		} else {
			$("#citigold-readIDTwo .pic_suc").text('身份证读取失败!')
			$("#citigold-readIDTwo .loading_box").html('');
		}
	}



	/*if(citigoldJson.riskCache || citigoldJson.signCache || citigoldJson.imageCache){
	    $("#citigold-readIDTwo .ziduan-value:eq(0)").text(custermerInfo.name);
	    $("#citigold-readIDTwo .ziduan-value:eq(1)").text(custermerInfo.sex);
	    $("#citigold-readIDTwo .ziduan-value:eq(2)").text(custermerInfo.nation);
	    $("#citigold-readIDTwo .ziduan-value:eq(3)").text(custermerInfo.birthday.split("-")[0]);
	    $("#citigold-readIDTwo .ziduan-value:eq(4)").text(custermerInfo.birthday.split("-")[1]);
	    $("#citigold-readIDTwo .ziduan-value:eq(5)").text(custermerInfo.birthday.split("-")[2]);
	    $("#citigold-readIDTwo .ziduan-value:eq(6)").text(custermerInfo.address);
	    $("#citigold-readIDTwo .ziduan-value:eq(7)").text(custermerInfo.cerNO);
	    $("#citigold-readIDTwo .ziduan-value:eq(8)").text(custermerInfo.issAuthority);
	    $("#citigold-readIDTwo .ziduan-value:eq(9)").text(custermerInfo.cerExpdDt);
	    $('#citigold-readIDTwo .sfz-img').attr('src',custermerInfo.image);
	    $("#citigold-readIDTwo .loading_box").html('<div class="read_loading" style="margin-top:40px;">联网核查成功！</div>');
	        //$("#xinka-readID .loading_box").html(''); 
	        $('#dz-read-next').addClass('btn_next');
	}else{
	    if(creditJson.isReadCardSucc||commonJson.isCustermerInfoMultiplex) { //读卡成功
	        creditReadCardSucc();
	    } else {
	        creditReadCardFail();
	    }        
	}*/
	//点击下一步,跳转页面()
	$('.footter .previous:eq(1)').off().on('click', function() {
		if (citigoldJson.riskCache || citigoldJson.signCache || citigoldJson.imageCache) {
			isRiskOrSignFun();
		} else {
			if (!($(this).hasClass('btn_next'))) return;
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
	});
	//重新读取
	$('.footter .previous:eq(0)').on('tap', function() {
		if (!($(this).hasClass('btn_next'))) return;
		$.mobile.changePage('citigold-readIDOne.html', {
			reverse: true
		});
	});
	
	$(".lianwanghecha-chongxin").on("click",function(){//重新联网核查
			showLoader('信息查询中...');
 		$(".lianwanghecha-yichang").hide();
 		 
            
            $(".loading_box").html('<img class="img_loading" src="../../images/ic_load.gif" alt=""/><div class="read_loading">信息审核中…</div>');
			$('.footter .previous:eq(0)').removeClass('btn_next');
			$('.sh_loading_box_shadow').remove();
			$('.header .head-left,.header .head-right').addClass('btn-cannt-click');
			$('.ui-page').append('<div class="sh_loading_box_shadow" style="position:absolute;right:0;top:0;left:0;bottom:0;z-index:24;background-color: rgba(0,0,0,.0);"></div>');
			var sendJson = {
				"b": [{
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"orgId.s": commonJson.orgId, //机构号
					"moduleId.s": citigoldJson.moduleID, //模块编号
					"tranId.s": citigoldJson.tranId, //交易编号
					"operatorNo.s": commonJson.adminCount, //操作员
					"deviceNo.s": commonJson.udId, //设备编号
					"DOCUMENT_TYPE.s": "0", //证件类型
					"DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号码
					"CLIENT_NAME.s": custermerInfo.name, //被核对人姓名
					"BUSSINESSCODE.s": "01", //业务总类
					"BRANCH_ID.s": commonJson.orgId //机构号
				}]
			};
			//身份证联网核查
			icitizenCertificateIdenifyFun(sendJson, function(msg) {
				$('.footter .previous:eq(0)').addClass('btn_next');
				$('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
				$('.sh_loading_box_shadow').remove();
				idebitItizenCertificateIdenifyCitSucc(msg);
			}, function(err) {
				$('.footter .previous:eq(0)').addClass('btn_next');
				$('.header .head-left,.header .head-right').removeClass('btn-cannt-click');
				$('.sh_loading_box_shadow').remove();
				$("#citigold-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
				funFail(err);
			})
        
 	});
 	$(".lianwanghecha-jixu").on("click",function(){//继续业务办理
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
	
    
    
 		//lianwanghechaFun();
 	});
 	$(".lianwanghecha-tuichu").on("click",function(){//退出
 		$.mobile.changePage('citigold-readIDOne.html', { transition: "slide" });
 		$(".lianwanghecha-yichang").hide();
 	});
	
	
});
//风险评估-调查问卷（citigold-diaocawenjuan.html）
$(document).on("pageshow", '#citigold-diaocawenjuan', function() {
	citigoldJson.riskCache = true;
	var questionScore = 0;
	$(".diaocawenjuan-ul-con>li").on("click", function() {
		if ($(this).children(".diaocawenjuan-yes").css("display") == "none") {
			$(this).parent().attr({
				'isSelected': true,
				'scale': $(this).attr('scale')
			});
			if ($('[isSelected]').length == $('.diaocawenjuan-ul-con').length + $('.diaocawenjuan-ul').length) {
				$('.footter .previous:eq(0)').addClass('btn_next');
			}
			$(this).children(".diaocawenjuan-yes").show().siblings(".diaocawenjuan-no").hide();
			$(this).siblings().children(".diaocawenjuan-no").show();
			$(this).siblings().children(".diaocawenjuan-yes").hide();
		}
	});
	$(".diaocawenjuan-ul>li>span").on("click", function() {
		$(this).closest('.diaocawenjuan-ul').attr({
			'isSelected': true,
			'scale': $(this).parent().attr('scale')
		});
		if ($('[isSelected]').length == $('.diaocawenjuan-ul-con').length + $('.diaocawenjuan-ul').length) {
			$('.footter .previous:eq(0)').addClass('btn_next');
		}
		$(this).addClass("diaocawenjuan-duigou").parent().siblings().children().removeClass('diaocawenjuan-duigou');
	});
	//上一步
	/*$('.footter .previous:eq(0)').on('click', function() {
	       // $.mobile.changePage('citigold-readIDOne.html'); //刷身份证页面
	        $.mobile.changePage('citigold-readIDTwo.html',{reverse:true}); //刷身份证成功
	})*/
	//下一步
	$('.footter .previous:eq(0)').on('click', function() {
		if (!$(this).hasClass('btn_next')) return;
		var totalScale = 0;
		$.each($('.diaocawenjuan-ul'), function(index, el) {
			totalScale += parseInt($(this).attr('scale'));
		});
		$.each($('.diaocawenjuan-ul-con'), function(index, el) {
			totalScale += parseInt($(this).attr('scale'));
		});
		//通过试卷调查获取的风险评估等级citigoldJson.CurrFPRiskLevelvar 
		if (totalScale < 101 && totalScale > 80) { //5
			citigoldJson.CurrFPRiskLevel = '5';
			riskLevelOne.CurrFPRiskLevel = '5';
		} else if (totalScale < 81 && totalScale > 60) { //4
			citigoldJson.CurrFPRiskLevel = '4';
			riskLevelOne.CurrFPRiskLevel = '4';
		} else if (totalScale < 61 && totalScale > 35) { //3
			citigoldJson.CurrFPRiskLevel = '3';
			riskLevelOne.CurrFPRiskLevel = '3';

		} else if (totalScale < 36 && totalScale > 15) { //2
			citigoldJson.CurrFPRiskLevel = '2';
			riskLevelOne.CurrFPRiskLevel = '2';

		} else { //1
			citigoldJson.CurrFPRiskLevel = '1';
			riskLevelOne.CurrFPRiskLevel = '1';
		}

		//取下一年
		var date = myTime.curDate();
		var strYear = date.getFullYear() + 1;
		var strDay = date.getDate();
		var strMonth = date.getMonth() + 1;
		if (strMonth < 10) {
			strMonth = "0" + strMonth;
		}
		if (strDay < 10) {
			strDay = "0" + strDay;
		}
		if (strMonth == "02" && strDay == "29") {
			strDay = "28";
		}
		var datastr = strYear + "年" + strMonth + "月" + strDay + '日';
		$('.submitted-succ-cont').html('<div class="submitted-successfully-neirong">客户风险承受能力评级为:<span>' + riskLevelOne[citigoldJson.CurrFPRiskLevel] /*[citigoldJson.jjProInfo.RiskLevel]*/ + '</span></div><div class="submitted-successfully-neirong">有效期至<span>' + datastr + '</span></div>');

		$(".submitted-successfully-con").css("margin-top", ($(window).height() - 163) / 2);
		$(".submitted-successfully-zz").show();
		citigoldJson.FPRiskLevel = citigoldJson.CurrFPRiskLevel; //风评等级暂时修改为 后台返回等级
		riskLevelOne.CurrFPRiskLevel = citigoldJson.FPRiskLevel;
	})

	//重新风险评级
	$("#citigold-diaocawenjuan .submitted-successfully-btn:eq(0)").on("click", function() {
		$(".submitted-successfully-zz").hide();
	});
	//继续办理页面
	$("#citigold-diaocawenjuan .submitted-successfully-btn:eq(1)").on("click", function() {
		$(".submitted-successfully-zz").hide();
		//alert(citigoldJson.CurrFPRiskLevel); citigoldJson.FPRiskLevel
		if (citigoldJson.CurrFPRiskLevel - citigoldJson.jjProInfo.RiskLevel < 0) {
			$.mobile.changePage('citigold-riskAssessment.html'); //客户风评等级低于产品要求等级---询问客户
		} else {
			//成功进入是否签约逻辑判断
			isSignCitigoldFun();
		}
	});
});
//询问页面 citigold-riskAssessment
$(document).on("pageshow", '#citigold-riskAssessment', function() {
	$('.khfxdj-cpfxdj:eq(0)').next().text(riskLevelOne[citigoldJson.FPRiskLevel]);
	$('.khfxdj-cpfxdj:eq(1)').next().text(riskLevel[citigoldJson.jjProInfo.RiskLevel]);
	$('.footter .previous:eq(0)').on('click', function() {
		$.mobile.changePage('citigold-fundSupermarketsOne.html');
	})
	$('#citigold-riskAssessment .djckxq-con').on('click', function() {
			if (citigoldJson.riskCache == true) { //   citigoldJson.FPRiskLevel == "0"
				//取下一年
				var date = myTime.curDate();
				var strYear = date.getFullYear() + 1;
				var strDay = date.getDate();
				var strMonth = date.getMonth() + 1;
				if (strMonth < 10) {
					strMonth = "0" + strMonth;
				}
				if (strDay < 10) {
					strDay = "0" + strDay;
				}
				if (strMonth == "02" && strDay == "29") {
					strDay = "28";
				}
				var datastr = strYear + "年" + strMonth + "月" + strDay + '日';
			} else {
				var _datastr = myTime.UnixToDate(citigoldJson.RiskDate).split(' ')[0];
				var datastr = _datastr.split('-')[0] + '年' + _datastr.split('-')[1] + '月' + _datastr.split('-')[2] + '日';
			}

			$('.submitted-succ-cont').html('<div class="submitted-successfully-neirong">客户风险承受能力评级为:<span>' + riskLevelOne[citigoldJson.FPRiskLevel] + '</span></div><div class="submitted-successfully-neirong">有效期至<span>' + datastr + '</span></div>');

			$(".submitted-successfully-con").css("margin-top", ($(window).height() - 163) / 2);
			$(".submitted-successfully-zz").show();
		})
		//确认弹窗
	$("#citigold-riskAssessment .submitted-successfully-btn").on("click", function() {
		$(".submitted-successfully-zz").hide();
	});
	$('.footter .previous:eq(1)').on('click', function() {
		//进入是否签约逻辑判断
		isSignCitigoldFun();
	})
});
//检测input是否为空
function citigoldBusinessContractCheckInput(hasEmpty, isRead) {
	hasEmpty = 0;
	$('.previous-ul input').each(function(index, el) {
		if ($(this).parent().siblings().find('.required-stars').is(':hidden')) return true;
		if ($.trim($(this).val()) == '') {
			hasEmpty++;
		}
	})
	if (hasEmpty == '0' && isRead) {
		$('.footter .previous:eq(1)').addClass('btn_next');
	} else {

		$('.footter .previous:eq(1)').removeClass('btn_next');
	}
}
//业务签约 citigold-businessContract
$(document).on("pageshow", '#citigold-businessContract', function() {

	//queryAllBankAccCitigold();//查询客户名下所有卡账号
	var textHtml = '';
	$.each(citigoldJson.AllBankAcc, function(index, el) { //返显客户名下所有卡账号
		textHtml += '<option value="' + el + '">' + el + '</option>';
	})
	$('#citi-card').html(textHtml).selectmenu('refresh');

	if (citigoldJson.signCache) {
		$('#citi-sex').val(citigoldJson.citiSex).attr('disabled', true).selectmenu('refresh'); //性别
		$('#citi-mobile').val(citigoldJson.tel).attr('disabled', true); //手机号码
		$('#citi-city-tel').val(citigoldJson.CITY_TEL || '0755'); //区号
		$('#citi-tel-num').val(citigoldJson.CONTACT_ID_GD); //电话
		$('#citi-email').val(citigoldJson.eMail); //email
		$('#citi-addr').val(citigoldJson.citiAddr); //通讯地址
		$('#citi-zipCode').val(citigoldJson.PostCode); //邮编
		$('#citi-sendstyle').val(citigoldJson.sendstyle).selectmenu('refresh'); //对账单形式
		$('#citi-card').val(citigoldJson.citiCard).selectmenu('refresh'); //待签约银行账号
	} else {
		//返显icbs核心信息
		$('#citi-sex').val(citigoldJson.sign.SEX == 'M' ? '1' : '0').attr('disabled', true).selectmenu('refresh'); //性别
		$('#citi-mobile').val(citigoldJson.sign.CONTACT_ID).attr('disabled', true); //手机号码
		$('#citi-city-tel').val(citigoldJson.sign.CITY_TEL || '0755'); //区号
		$('#citi-tel-num').val(citigoldJson.sign.CONTACT_ID_GD); //电话
		$('#citi-email').val(citigoldJson.sign.TRAN_EMAIL); //email
		$('#citi-addr').val(citigoldJson.sign.ADDRESS2); //通讯地址
		$('#citi-zipCode').val(citigoldJson.sign.POSTAL_CODE); //邮编
	}
	citigoldJson.signCache = true;
	var isRead = false; //是否阅读协议 false为未读
	var hasEmpty = 0; //记录为空的input个数
	$('#citi-sendstyle').on('change', function(event) {
		if ($(this).val() == '00100000') {
			$('.citi-email-cell .required-stars').show();
		} else {
			$('.citi-email-cell .required-stars').hide();
		}
		citigoldBusinessContractCheckInput(hasEmpty, isRead)
	});
	//检测input是否为空 检测下一步是否可点击
	$('.previous-ul input').on('input propertychange', function() {
			citigoldBusinessContractCheckInput(hasEmpty, isRead);
		})
		//是否同意阅读协议
	$('.agree-btn-box').on('click', function() {
		if ($('#ic-disagree').is(':hidden')) {
			$('#ic-disagree').show().siblings('#ic-agree').hide();
			isRead = false;
		} else {
			$('#ic-disagree').hide().siblings('#ic-agree').show();
			isRead = true;
		}
		citigoldBusinessContractCheckInput(hasEmpty, isRead);
	})
	$('.footter .previous:eq(0)').on('click', function() {
		//$.mobile.changePage('citigold-fundSupermarketsOne.html');
		/*if(citigoldJson.FPRiskLevel=='0' || (citigoldJson.RiskDate-citigoldJson.curTime)<0){
		    $.mobile.changePage('citigold-diaocawenjuan.html',{reverse:true}); //调查问卷
		}else{
		    $.mobile.changePage('citigold-readIDTwo.html',{reverse:true}); //刷身份证成功
		}*/
		$.mobile.changePage('citigold-readIDOne.html', {
			reverse: true
		}); //刷身份证成功
	})
	$('.footter .previous:eq(1)').on('click', function() {
		var num = 0; //格式错误个数
		if (!$(this).hasClass('btn_next')) return;
		$('.previous-ul input[reg]').each(function(index, el) {
			var reg = $(this).attr('reg');
			if (reg == 'email' && $.trim($(this).val()) == '') {
				$(this).closest('li').removeClass('fm-item-error'); //移除错误区域点亮
				return true;
			}
			var eqIndex = $(this).closest('li').index();
			if (!fmReg[reg].test($.trim($(this).val()))) {
				$(this).closest('li').addClass('fm-item-error'); //错误区域点亮
			} else {
				$(this).closest('li').removeClass('fm-item-error'); //移除错误区域点亮
			}
		})
		$('.previous-ul input[reg]').each(function(index, el) {
			var reg = $(this).attr('reg');
			if (reg == 'email' && $.trim($(this).val()) == '') return true;
			if (!(fmReg[reg].test($.trim($(this).val())))) {
				num++;
				showMsg(fmRegMsg[reg]);
				return false;
			}
		})
		if (num > 0) {
			return;
		}
		if ($('#citi-addr').val().replace(/[^\x00-\xff]/g, '__').length < 8) {
			showMsg('通讯地址不能小于4个汉字!');
			return false;
		}
		citigoldJson.BankAcc = citigoldJson.citiCard = $('#citi-card').val(); //待签约银行账号
		citigoldJson.citiAddr = $.trim($('#citi-addr').val()); //待签约通讯地址
		citigoldJson.citiSex = $('#citi-sex').val(); //待签约性别
		citigoldJson.PostCode = $.trim($("#citi-zipCode").val()); //邮政编码
		citigoldJson.eMail = $.trim($('#citi-email').val()); //email
		citigoldJson.tel = $.trim($('#citi-mobile').val()); //电话号码
		citigoldJson.sendstyle = $('#citi-sendstyle').val(); //对账单形式
		citigoldJson.CITY_TEL = $('#citi-city-tel').val(); //区号
		citigoldJson.CONTACT_ID_GD = $('#citi-tel-num').val(); //固话
		$.mobile.changePage('citigold-InformationInput.html'); //信息录入--影像采集  
		/*showLoader('签约信息提交中...');
		var sendJson={
		        "b" : [{
		            "orgId.s":commonJson.orgId,//操作员的机构号
		            "moduleID.s":citigoldJson.moduleID,//模块编号
		            "tranId.s":citigoldJson.tranId,//交易编号
		            "operatorNo.s":commonJson.adminCount,//操作员
		            "deviceNo.s":commonJson.udId,//设备编号
		            "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
		            "workAddress.s":commonJson.workAddress,//工作地址
		            "ClientType.s" :"1",//客户类型
		            "BankAcc.s" :$('#citi-card').val(),//银行账号
		            "OpenBranch.s" :"深圳农商银行",//开卡机构
		            "ClientNo.s" :citigoldJson.ClientNo,//客户编号
		            "ClientName.s" :custermerInfo.name,//客户名称
		            "IdType.s" :"0",//证件类型
		            "IdCode.s" :custermerInfo.cerNO,//证件号码
		            "Address.s" :$.trim($('#citi-addr').val()),//通讯地址
		            "ClientManager.s" :citigoldJson.ClientManager,//客户经理代码
		            "Sex.s" :$('#citi-sex').val(),//性别
		            "RiskLevel.s" :citigoldJson.CurrFPRiskLevel//风险等级
		        }]
		    };
		citigoldJson.BankAcc=$('#citi-card').val();
		IClientSignServiceFun(sendJson,function(msg){
		    IClientSignServiceSucc(msg);
		},function(err){
		    funFail(err);
		})*/
		/* if(){//需要修改风险评估

		 }else{//不需要则跳转到影像采集页面
		     $.mobile.changePage('citigold-InformationInputOne.html');
		 }*/

	})
});
//影像采集 拍照 删除照片 预览等方法
var citigoldImageAcquisition = {
		imgSrc: '', //记录照片路径,
		curParentObj: '', //记录要删除的对象
		delImg: function(curParentObj, imgSrc) { //删除照片
			curParentObj.find('.camera-pic').remove();
			curParentObj.find('.camera').show();
			curParentObj.find('.rephoto').html('必拍');
			$('.bigpic-review-box').animate({
					opacity: '0'
				},
				200,
				function() {
					$('.bigpic-review-box').hide()
				});
			$('.img_content-next').removeClass('btn_next');
			//监测下一步是否可点击
			var ind = 0;
			for (var i = 0; i < 4; i++) {
				if ($('.img_content .customer:eq(' + i + ')').find("img").length == 2) {
					ind++;
					if (ind == 4) {
						$('.img_content-next').addClass('btn_next');
					} else {
						$('.img_content-next').removeClass('btn_next');
					}
				};
			}
			deletePhoto([imgSrc], function(msg) {

			}, function(err) {

			})
		},
		getFace: function(curParentObj) {
			faceDistinguish('trans', function(msg) {
				citigoldJson.isTelCheck = false;
				citigoldImageAcquisition.imgSrc = msg;
				curParentObj.find('.camera').hide();
				curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
				curParentObj.find('.rephoto').text('重拍');
				//监测下一步是否可点击
				var ind = 0;
				for (var i = 0; i < 4; i++) {
					if ($('.img_content .customer:eq(' + i + ')').find("img").length == 2) {
						ind++;
						if (ind == 4) {
							$('.img_content-next').addClass('btn_next');
						} else {
							$('.img_content-next').removeClass('btn_next');
						}
					};
				}
			}, function(err) {
				showMsg(err);
			})
		},
		getImg: function(curParentObj) { //拍照
			Meap.media('camera', curParentObj.attr('picname'), function(msg) {
				citigoldImageAcquisition.imgSrc = msg;
				curParentObj.find('.camera').hide();
				curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
				curParentObj.find('.rephoto').text('重拍');
				//监测下一步是否可点击
				var ind = 0;
				for (var i = 0; i < 4; i++) {
					if ($('.img_content .customer:eq(' + i + ')').find("img").length == 2) {
						ind++;
						if (ind == 4) {
							$('.img_content-next').addClass('btn_next');
						} else {
							$('.img_content-next').removeClass('btn_next');
						}
					};
				}
			}, function(err) {
				showMsg(err);
			})
		},
		reGetImg: function(curParentObj, imgSrc) { //重拍
			if (curParentObj.parent().hasClass('get-face')) {
				faceDistinguish('trans', function(returnGetMsg) {
					/*if(curParentObj.find('.camera-pic[isMultip]')){//如果是影像复用的图片
					    citigoldImageAcquisition.imgSrc = returnGetMsg;
					    curParentObj.find('.camera-pic').attr('src', returnGetMsg);
					    $('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
					}else{*/
					citigoldImageAcquisition.imgSrc = returnGetMsg;
					curParentObj.find('.camera-pic').attr('src', returnGetMsg);
					$('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
					citigoldJson.isTelCheck = false;
					deletePhoto([imgSrc], function(returnDelMsg) {

						}, function(err) {

						})
						//}

				}, function(err) {
					showMsg('重拍失败');
				})
			} else {
				Meap.media('camera', curParentObj.attr('picname'), function(returnGetMsg) {
					/*if(curParentObj.find('.camera-pic[isMultip]')){//如果是影像复用的图片
					      citigoldImageAcquisition.imgSrc = returnGetMsg;
					      curParentObj.find('.camera-pic').attr('src', returnGetMsg);
					      $('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
					  }else{*/
					citigoldImageAcquisition.imgSrc = returnGetMsg;
					curParentObj.find('.camera-pic').attr('src', returnGetMsg);
					$('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
					deletePhoto([imgSrc], function(returnDelMsg) {

						}, function(err) {

						})
						//}
				}, function(err) {
					showMsg('重拍失败');
				})
			}

		},
		reviewImg: function(imgSrc) { //拍照预览
			$('.bigpic-review').html('<img src=' + imgSrc + ' height="100%">');
			$('.bigpic-review-box').show().animate({
				opacity: '1'
			}, 200);
		},
		reviewImgClose: function() { //关闭拍照预览
			$('.bigpic-review-box').animate({
				opacity: '0'
			}, 200, function() {
				$('.bigpic-review-box').hide()
			});
		}
	}
	//信息录入 影像采集（citigold-InformationInput.html）
$(document).on("pageshow", '#citigold-InformationInput', function() {
	if (citigoldJson.imageCache) {
		if (citigoldJson.custFacePic != undefined) {
			$('.img_box:eq(0) .rephoto').text('重拍');
			$('.img_box:eq(0) .camera').hide();
			$('.img_box:eq(0) .customer').append('<img src="' + citigoldJson.custFacePic + '" width="100%" height="115px" class="camera-pic">');
		}
		if (citigoldJson.custAndCustOwnerPic != undefined) {
			$('.img_box:eq(1) .rephoto').text('重拍');
			$('.img_box:eq(1) .camera').hide();
			$('.img_box:eq(1) .customer').append('<img src="' + citigoldJson.custAndCustOwnerPic + '" width="100%" height="115px" class="camera-pic">');
		}
		if (citigoldJson.frontIDCardPic != undefined) {
			$('.img_box:eq(2) .rephoto').text('重拍');
			$('.img_box:eq(2) .camera').hide();
			$('.img_box:eq(2) .customer').append('<img src="' + citigoldJson.frontIDCardPic + '" width="100%" height="115px" class="camera-pic">');
		}
		if (citigoldJson.backIDCardPic != undefined) {
			$('.img_box:eq(3) .rephoto').text('重拍');
			$('.img_box:eq(3) .camera').hide();
			$('.img_box:eq(3) .customer').append('<img src="' + citigoldJson.backIDCardPic + '" width="100%" height="115px" class="camera-pic">');
		}
		var ind = 0;
		for (var i = 0; i < 4; i++) {
			if ($('#citigold-InformationInput .customer:eq(' + i + ')').find("img").length == 2) {
				ind++;
				if (ind >= 4) {
					$('.img_content-next').addClass('btn_next');
				}
			};
		}
	} else {
		if (commonJson.isCustermerInfoMultiplex) {
			queryTableDataByConditions({
				"databaseName": "myDatabase",
				"tableName": "customer_info",
				"conditions": {
					"SUBMITTIME": "between " + commonJson.submitTime + " and " + commonJson.submitTime
				}
			}, function(msg) {
				var CUSTANDCUSTOWNERPICBase64 = msg[0].CUSTANDCUSTOWNERPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');
				var FRONTIDCARDPICBase64 = msg[0].FRONTIDCARDPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');
				var BACKIDCARDPICBase64 = msg[0].BACKIDCARDPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');
				//与客户合影base64转路径
				//var picTime=myTime.CurTime();
				if(CUSTANDCUSTOWNERPICBase64 != '<null>'){
					Meap.transFormImage(getYMDHMSM('custAndCustOwnerPic') + creditJson.storage.deviceNo, CUSTANDCUSTOWNERPICBase64, 'picSty', function (msg1) {
			            $('.img_box:eq(1) .customer').append('<img src="' + msg1 + '" width="100%" height="115px" class="camera-pic">');
			       		$('.img_box:eq(1) .rephoto').text('重拍');
			       		$('.img_box:eq(1) .camera').hide();
					}, function (err) {
			            showMsg('与客户合影base64转路径失败');
			        })
				}
					//身份证正面base64转路径
				Meap.transFormImage(getYMDHMSM('frontIDCardPic') + commonJson.udId, FRONTIDCARDPICBase64, 'picSty', function(msg2) {
						$('.img_box:eq(2) .customer').append('<img src="' + msg2 + '" width="100%" height="115px" class="camera-pic">');
					}, function(err) {
						showMsg('身份证正面base64转路径失败');
					})
					//身份证反面base64转路径
				Meap.transFormImage(getYMDHMSM('backIDCardPic') + commonJson.udId, BACKIDCARDPICBase64, 'picSty', function(msg3) {
					$('.img_box:eq(3) .customer').append('<img src="' + msg3 + '" width="100%" height="115px" class="camera-pic">');

				}, function(err) {
					showMsg('身份证反面base64转路径失败');
				})
				$('.img_box:eq(2) .rephoto,.img_box:eq(3) .rephoto').text('重拍');
				$('.img_box:eq(2) .camera,.img_box:eq(3) .camera').hide();
				/*$('.img_box:eq(1) .customer').append('<img src="'+msg[0].CUSTANDCUSTOWNERPIC.replace(/\\/g,"")+'" width="100%" height="115px" link="'+msg+'" class="camera-pic" isMultip="true">');
				$('.img_box:eq(1) .rephoto,.img_box:eq(3) .rephoto,.img_box:eq(4) .rephoto').text('重拍');
				$('.img_box:eq(1) .camera,.img_box:eq(3) .camera,.img_box:eq(4) .camera').hide();

				$('.img_box:eq(3) .customer').append('<img src="'+msg[0].FRONTIDCARDPIC.replace(/\\/g,"")+'" width="100%" height="115px" link="'+msg+'" class="camera-pic" isMultip="true">');

				$('.img_box:eq(4) .customer').append('<img src="'+msg[0].BACKIDCARDPIC.replace(/\\/g,"")+'" width="100%" height="115px" link="'+msg+'" class="camera-pic" isMultip="true">');*/
			}, function(err) {

			})

		}
	}
	citigoldJson.imageCache = true;
	//预览大图 点击关闭
	$('.bigpic-review-close').click(function(event) {
		citigoldImageAcquisition.reviewImgClose();
	});
	//预览大图 删除图片
	$('.bigpic-review-del').click(function(event) {
		citigoldImageAcquisition.delImg(citigoldImageAcquisition.curParentObj, citigoldImageAcquisition.imgSrc);
	});
	//预览大图 重新拍照
	$('.bigpic-review-rephone').click(function(event) {
		citigoldImageAcquisition.reGetImg(citigoldImageAcquisition.curParentObj, citigoldImageAcquisition.imgSrc);
	});
	$('.conter-con').on('click', '.customer', function(ev) {
			citigoldImageAcquisition.curParentObj = $(this);
			var oTarget = ev.target;
			if ($(this).find('.rephoto').html() == '重拍') { //重拍
				if ($(oTarget).hasClass('rephoto')) {
					//citigoldImageAcquisition.reGetImg(citigoldImageAcquisition.curParentObj, citigoldImageAcquisition.imgSrc);
					citigoldImageAcquisition.reGetImg(citigoldImageAcquisition.curParentObj, $(this).find('.camera-pic').attr('src'));
				}
				if ($(oTarget).hasClass('camera-pic')) { //预览大图
					citigoldImageAcquisition.imgSrc = $(oTarget).attr('src');
					citigoldImageAcquisition.reviewImg($(oTarget).attr('src'));
				}
				return;
			}
			//拍照
			if (citigoldImageAcquisition.curParentObj.parent().hasClass('get-face')) {
				citigoldImageAcquisition.getFace(citigoldImageAcquisition.curParentObj);
			} else {
				citigoldImageAcquisition.getImg(citigoldImageAcquisition.curParentObj);
			}

		})
		//点击上一步，跳转页面
	$('.previous-con').on('click', function() {
		/*$.mobile.changePage(citigoldJson.reversePage, {
		    reverse: true
		});*/
		/*citigoldJson.imageInfo = { //存储影像上传的参数 NSMeapImageUpload
		    "custFacePic": $('.img_content .camera-pic:eq(0)').attr('src'), //客户面部照片
		    "custAndCustOwnerPic": $('.img_content .camera-pic:eq(1)').attr('src'), //与客户合影照片
		    "frontIDCardPic": $('.img_content .camera-pic:eq(2)').attr('src'), //身份证正面
		    "backIDCardPic": $('.img_content .camera-pic:eq(3)').attr('src') //身份证反面
		};*/

		citigoldJson.custFacePic = $('.img_content .img_box:eq(0) .camera-pic').attr('src');
		citigoldJson.custAndCustOwnerPic = $('.img_content .img_box:eq(1) .camera-pic').attr('src');
		citigoldJson.frontIDCardPic = $('.img_content .img_box:eq(2) .camera-pic').attr('src');
		citigoldJson.backIDCardPic = $('.img_content .img_box:eq(3) .camera-pic').attr('src');

		//alert(JSON.stringify(citigoldJson.imageInfo));
		if (citigoldJson.signStatus != '0') { //未签约
			$.mobile.changePage('citigold-businessContract.html', {
				reverse: true
			}); //签约页面
		} else if (citigoldJson.FPRiskLevel == '0' || (citigoldJson.RiskDate - citigoldJson.curTime) < 0) { //需要风评
			$.mobile.changePage('citigold-diaocawenjuan.html', {
				reverse: true
			}); //调查问卷
		} else {
			$.mobile.changePage('citigold-readIDOne.html', {
				reverse: true
			}); //刷身份证成功
		}
	});
	//点击下一步
	$('.img_content-next').on('click', function() {
		if (!$(this).hasClass('btn_next')) return;
		citigoldJson.picFileARR = []; //要打包的影像路径

		custermerInfo.custAndCustOwnerPic = $('.img_content .camera-pic:eq(1)').attr('src'); //与客户合影照片
		custermerInfo.frontIDCardPic = $('.img_content .camera-pic:eq(2)').attr('src'); //身份证正面
		custermerInfo.backIDCardPic = $('.img_content .camera-pic:eq(3)').attr('src'); //身份证反面
		/*citigoldJson.imageInfo = { //存储影像上传的参数 NSMeapImageUpload
		    "custFacePic": $('.img_content .camera-pic:eq(0)').attr('src'), //客户面部照片
		    "custAndCustOwnerPic": $('.img_content .camera-pic:eq(1)').attr('src'), //与客户合影照片
		    "frontIDCardPic": $('.img_content .camera-pic:eq(2)').attr('src'), //身份证正面
		    "backIDCardPic": $('.img_content .camera-pic:eq(3)').attr('src') //身份证反面
		};*/
		citigoldJson.custFacePic = $('.img_content .camera-pic:eq(0)').attr('src');
		citigoldJson.custAndCustOwnerPic = $('.img_content .camera-pic:eq(1)').attr('src');
		citigoldJson.frontIDCardPic = $('.img_content .camera-pic:eq(2)').attr('src');
		citigoldJson.backIDCardPic = $('.img_content .camera-pic:eq(3)').attr('src');

		citigoldJson.picFileARR.push(citigoldJson.custFacePic, citigoldJson.custAndCustOwnerPic, citigoldJson.frontIDCardPic, citigoldJson.backIDCardPic); //要打包的影像路径
		if (citigoldJson.isTelCheck) {
			if (citigoldJson.isGMorDT == 'GM') {
				$.mobile.changePage('citigold-InformationInputOne.html'); //基金购买交易
			} else {
				$.mobile.changePage('citigold-InformationInputTwo.html'); //基金定投交易
			}
		} else {
			$.mobile.changePage('citigold-personFace.html');
		}
	});
});
//基金购买交易信息录入 citigold-InformationInputOne
$(document).on("pageshow", '#citigold-InformationInputOne', function() {
	/*if(citigoldJson.signStatus=='0'){//已经签约 查询签约卡账号
	    querySignBankAccCitigold();
	}else{
	    $('#citigold-dt-kh').html(citigoldJson.BankAcc);
	}*/
	$('#citigold-dt-kh').html(citigoldJson.BankAcc);
	$('.previous-ul .input-last-zhi:eq(0)').text(citigoldJson.jjProInfo.PrdName); //基金名称
	$('.previous-ul .input-last-zhi:eq(1)').text(citigoldJson.jjProInfo.PrdCode); //基金代码
	$('.previous-ul .input-last-zhi:eq(2)').text(fmoney(citigoldJson.jjProInfo.NAV, 4) + '元'); //单位净值
	$('.previous-ul .input-last-zhi:eq(3)').text(citigoldJson.jjProInfo.NavDate); //净值日期
	$('.previous-ul .input-last-zhi:eq(4)').text(fmoney(citigoldJson.jjProInfo.PfirstAmt) + '元'); //首次购买起点
	$('.previous-ul .input-last-zhi:eq(5)').text(fmoney(citigoldJson.jjProInfo.SubUnit) + '元'); //最小购买单位
	$('.previous-ul .input-last-zhi:eq(6)').text(fmoney(citigoldJson.jjProInfo.PappAmt) + '元'); //追加购买下限
	$('.previous-ul .input-last-zhi:eq(7)').text(citigoldJson.jjProInfo.ReferenceRate); //参考费率
	$('.previous-ul .input-last-zhi:eq(8)').text(citigoldJson.BankAcc); //参考费率
	$('.previous-ul .input-last-zhi:eq(9)').text(currType[citigoldJson.jjProInfo.CurrType]); //币种
	if (citigoldJson.GMCache) {
		$('.previous-ul .input-test-yuan').val(fmoney(citigoldJson.jjProInfo.buyNum));
		$('.input-test-con:eq(1)').val(citigoldJson.jjProInfo.referee);
		if ($('.previous-ul .input-test-yuan').val() != '') {
			$('.footter .previous:eq(1)').addClass('btn_next');
		}
	}
	citigoldJson.GMCache = true;
	$('.previous-ul .input-test-yuan').on('tap', function() {
		var _val = $(this).val();
		$(this).val(rmoney(_val))
	})
	$('.previous-ul .input-test-yuan').on('blur', function() {
			var _val = $(this).val().replace(/[^0-9\.]/ig, "");
			$(this).val(fmoney(_val))
		})
		//点击上一步
	$('.footter .previous:eq(0)').on('click', function() {
			citigoldJson.jjProInfo.buyNum = rmoney($.trim($('.previous-ul .input-test-yuan').val())); //购买金额
			citigoldJson.jjProInfo.referee = $.trim($('.input-test-con:eq(1)').val()); //推荐人
			$.mobile.changePage('citigold-InformationInput.html', {
				reverse: true
			});
		})
		//点击下一步
	$('.input-test-yuan').on('input propertychange', function() {
		var _val = $(this).val().replace(/[^\d.]/g, "");
		$(this).val(_val);
	})
	$('.footter .previous:eq(1)').on('click', function() {
			if (!$(this).hasClass('btn_next')) return;
			citigoldJson.jjProInfo.buyNum = rmoney($.trim($('.previous-ul .input-test-yuan').val())); //购买金额
			citigoldJson.jjProInfo.referee = $.trim($('.input-test-con:eq(1)').val()); //推荐人
			var reg = $('.previous-ul .input-test-yuan').attr('reg');
			if (!(fmReg[reg].test(citigoldJson.jjProInfo.buyNum))) {
				$('.previous-ul .input-test-yuan').closest('.change-colorf-li').addClass('fm-item-error'); //错误字段点亮
				showMsg(fmRegMsg[reg]);
				return;
			}
			//购买金额是最小购买单位的整数倍 并且大于等于首次购买起点
			if (citigoldJson.jjProInfo.buyNum > 0 && citigoldJson.jjProInfo.buyNum % citigoldJson.jjProInfo.SubUnit != 0) {
				$('.previous-ul .input-test-yuan').closest('.change-colorf-li').addClass('fm-item-error'); //错误字段点亮
				showMsg('购买金额必须是最小购买单位的整数倍');
			} else {
				$('.previous-ul .input-test-yuan').closest('.change-colorf-li').removeClass('fm-item-error');
				$.mobile.changePage('citigold-confirmationSignatureTwo.html');
			}
		})
		//检测购买金额 输入框
	$('.previous-ul .input-test-yuan').on('input propertychange', function() {
		if ($.trim($(this).val()) == '') return;
		$('.footter .previous:eq(1)').addClass('btn_next');

	})
});
//基金购买和定投确认页面 提交按钮是否可以点击
function citigoldIsCanclickNext(isVideo) {
	citigoldJson.isCanClickNEXT = {
		isSure: false,
		isRead: false,
		isVideo: isVideo == true ? true : false,
		isSign: false,
		isVerificationCode: false
	}
	//是否阅读协议
	$('.agree-btn-box img').on('click', function() {
		if ($('#ic-agree').is(":hidden")) {
			$('#ic-disagree').hide().siblings('#ic-agree').show();
			citigoldJson.isCanClickNEXT.isRead = true;
		} else {
			$('#ic-disagree').show().siblings('#ic-agree').hide();
			citigoldJson.isCanClickNEXT.isRead = false;
		}
	})
	//是否确认风险等级
	$('input[name="radiobutton"]').change(function() {
		if ($(this).index() == 1) {
			citigoldJson.isCanClickNEXT.isSure = false;
		} else {
			citigoldJson.isCanClickNEXT.isSure = true;
		}
	})
	//视频是否ok
	$('.photo,.kh-buy-cxps').on('click', function() {
		var _this = $(this);
		Meap.media('video', myTime.CurTime() + '', function(msg) {
			citigoldJson.isCanClickNEXT.isVideo = true;
			citigoldJson.videoFileARR = [];
			citigoldJson.videoFileARR.push(msg);
			if (_this.hasClass('kh-buy-cxps')) { //重新拍摄
				deletePhoto([$('#video-content').attr('src')], function(delsuc) {
					$('#video-content').attr('src', msg);
				}, function() {});
				return;
			}
			$('.video-box').append('<video id="video-content" src="' + msg + '" width="100%" height="189px" autoplay="autoplay" controls="controls"></video>')
			$('.video-box .photo').hide();
			$('.kh-buy-cxps').show();
		}, function(err) {

		})
	})
	//签名是否ok
	//$('#qianOK').unbind().on('click', function() {
	//    if ($('#ic_agree').is(":hidden")) {
	//        $('#ic_disagree').hide().siblings('#ic_agree').show();
	//        citigoldJson.isCanClickNEXT.isSign = true;
	//        $('.qianM_shadow').show();
	//    } else {
	//        $('#ic_disagree').show().siblings('#ic_agree').hide();
	//
	//        citigoldJson.isCanClickNEXT.isSign = false;
	//        $('.qianM_shadow').hide();
	//    }
	//    if (citigoldJson.isCanClickNEXT.isSure && citigoldJson.isCanClickNEXT.isRead && citigoldJson.isCanClickNEXT.isVideo && citigoldJson.isCanClickNEXT.isSign && citigoldJson.isCanClickNEXT.isVerificationCode) {
	//        $('.previous').addClass('btn_next');
	//    } else {
	//        $('.previous').removeClass('btn_next');
	//    }
	//})
	//是否获取验证码 点击获取验证码
	$('#getMsg').on('click', function() {
		if ($('#getMsg').hasClass('cannt-click')) {
			return;
		} else {
			$('#getMsg').addClass('cannt-click');
		}
		$('#inp').val('');
		if (citigoldJson.codeTime) {
			clearInterval(citigoldJson.codeTime);
		}
		$('.codetime').html('请在<span style="color:red;">80秒</span>内输入验证码');
		$('.codetime').show();
		showLoader('获取中...')
		var sendJson = {
			"b": [{
				"orgId.s": commonJson.orgId,
				"moduleId.s": citigoldJson.moduleID, //模块编号
				"tranId.s": citigoldJson.tranId, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
				"Flags.s": "BBBB", //标记位
				"MOBILE_NO.s": citigoldJson.tel, //手机号码debitEnter.tel
				"REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
				"faceRecogn.s": citigoldJson.faceRecogn //人脸识别
			}]
		};
		imessageAuthentionServiceFun(sendJson, function(msg) {
			getVerificationCodeCitigoldSucc(msg, sendJson);
		}, function(err) { //失败回调
			hideLoader();
			citigoldJson.isCanClickNEXT.isVerificationCode = false;
			$('#getMsg').removeClass('cannt-click');
			funFail(err);
		});
	});
}

//基金购买确认信息 citigold-confirmationSignatureTwo
$(document).on("pageshow", '#citigold-confirmationSignatureTwo', function() {
	commonJson.USER_NO = '';
	citigoldJson.platGlobalSeq = undefined;
	//isIChangeRiskLevelCitigoldFun();//是否修改风险评估
	if (citigoldJson.msgSureCache == true && citigoldJson.videoSrc != '') {
		$('.video-box').append('<video id="video-content" src="' + citigoldJson.videoSrc + '" width="100%" height="189px" autoplay="autoplay" controls="controls"></video>')
		$('.video-box .photo').hide();
		$('.kh-buy-cxps').show();
	}
	citigoldIsCanclickNext(citigoldJson.msgSureCache); //是否可以点击提交和获取验证码
	$(".jijin-kesm:eq(0)").on('click', function() {
		if ($('.video-box video').length) {
			citigoldJson.msgSureCache = true;
			citigoldJson.videoSrc = $('.video-box video').attr('src');
		} else {
			citigoldJson.videoSrc = '';
		}
		//Meap.scanOfficeFile('www/images/基金产品说明书.doc', function(msg) {}, function(err) {});
		$.mobile.changePage('about-cusManual.html');
	})
	$(".jijin-kesm:eq(1)").on('click', function() {
		Meap.scanOfficeFile('www/images/基金客户声明与须知.doc', function(msg) {}, function(err) {});
	})
	$('.customer-risk-pj:eq(0)').html(riskLevelOne[citigoldJson.FPRiskLevel]);
	$('.confirm-ul').html('<li class="basic-li">' +
		'<div class="li-first-div">' +
		'<span class="basic-name">基金名称：</span>' +
		'<span>' + citigoldJson.jjProInfo.PrdName + '</span>' +
		'</div>' +
		'<div class="li-second-div">' +
		'<span class="basic-sex">基金代码：</span>' +
		'<span>' + citigoldJson.jjProInfo.PrdCode + '</span>' +
		'</div>' +
		'</li>' +
		'<li>' +
		'<div class="li-first-div">' +
		'<span class="basic_zhengType">单位净值：</span>' +
		'<span>' + fmoney(citigoldJson.jjProInfo.NAV, 4) + '元</span>' +
		'</div>' +
		'<div class="li-second-div">' +
		'<span class="basic_guoJ">净值日期：</span>' +
		'<span>' + citigoldJson.jjProInfo.NavDate + '</span>' +
		'</div>' +
		'</li>' +
		'<li>' +
		'<div class="li-first-div">' +
		'<span class="basic_zhengType">首次购买起点：</span>' +
		'<span>' + fmoney(citigoldJson.jjProInfo.PfirstAmt) + '元</span>' +
		'</div>' +
		'<div class="li-second-div">' +
		'<span class="basic_guoJ">最小购买单位：</span>' +
		'<span>' + fmoney(citigoldJson.jjProInfo.SubUnit) + '元</span>' +
		'</div>' +
		'</li>' +
		'<li>' +
		'<div class="li-first-div">' +
		'<span class="basic_zhengType">追加购买下限：</span>' +
		'<span>' + fmoney(citigoldJson.jjProInfo.PappAmt) + '元</span>' +
		'</div>' +
		'<div class="li-second-div">' +
		'<span class="basic_guoJ">参考费率：</span>' +
		'<span>' + citigoldJson.jjProInfo.ReferenceRate + '</span>' +
		'</div>' +
		'</li>' +
		'<li>' +
		'<div class="li-first-div">' +
		'<span class="basic_zhengType">账/卡号：</span>' +
		'<span>' + citigoldJson.BankAcc + '</span>' +
		'</div>' +
		'<div class="li-second-div">' +
		'<span class="basic_guoJ">币种：</span>' +
		'<span>' + currType[citigoldJson.jjProInfo.CurrType] + '</span>' +
		'</div>' +
		'</li>' +
		'<li>' +
		'<div class="li-first-div">' +
		'<span class="basic_zhengType">购买金额：</span>' +
		'<span>' + fmoney(citigoldJson.jjProInfo.buyNum) + '元</span>' +
		'</div>' +
		'<div class="li-second-div">' +
		'<span class="basic_guoJ">推荐人：</span>' +
		'<span>' + citigoldJson.jjProInfo.referee + '</span>' +
		'</div>' +
		'</li>');
	$('#citi-edit').on('click', function() {
			if ($('.video-box video').length) {
				citigoldJson.msgSureCache = true;
				citigoldJson.videoSrc = $('.video-box video').attr('src');
			} else {
				citigoldJson.videoSrc = '';
			}
			$.mobile.changePage('citigold-InformationInputOne.html', {
				reverse: true
			});
		})
		//初始化签名方法
	signature.init({
		div: $('#qianMGM'), //签名容器
		finishBtn: $("#qianOK"), //完成签名按钮
		clearBtn: $("#clear-botton"), //清除签名按钮
		lineColor: '#000000', //线条颜色
		lineWidth: 3, //线条粗细
		finish: function(data) { //签名完成回调函数
			citigoldJson.qmStr = '';
			citigoldJson.qmStr = data.replace('data:image/png;base64,', '');
			if (citigoldJson.qmStr == '' || citigoldJson.qmStr == undefined) {
				showTags({
					'title': '提示',
					'content': '签名异常，请重新签写！',
					'ok': {
						'title': '',
						fun: function() {}
					}
				});
				return;
			}
			if ($('#ic_agree').is(":hidden")) {
				$('#ic_disagree').hide().siblings('#ic_agree').show();
				citigoldJson.isCanClickNEXT.isSign = true;
				$('.qianM_shadow').show();
			} else {
				$('#ic_disagree').show().siblings('#ic_agree').hide();
				citigoldJson.isCanClickNEXT.isSign = false;
				$('.qianM_shadow').hide();
			}
			// if (citigoldJson.isCanClickNEXT.isSure && citigoldJson.isCanClickNEXT.isRead && citigoldJson.isCanClickNEXT.isVideo && citigoldJson.isCanClickNEXT.isSign && citigoldJson.isCanClickNEXT.isVerificationCode) {
			// 	$('.previous').addClass('btn_next');
			// } else {
			// 	$('.previous').removeClass('btn_next');
			// }
		}
	});
	$('.footter .previous').on('click', function() {
		// if (!$(this).hasClass('btn_next')) return;
		if(!(citigoldJson.isCanClickNEXT.isSure)){
            showMsg('请确认风险等级!');
            return;
        }
        if(!(citigoldJson.isCanClickNEXT.isRead)){
            showMsg('请阅读并确认协议!');
            return;
        }
        if(!(citigoldJson.isCanClickNEXT.isVideo)){
            showMsg('请拍摄视频!');
            return;
        }
		if(!(citigoldJson.isCanClickNEXT.isSign)){
            showMsg('请确认签名!');
            return;
        }
		if(commonJson.USER_NO == '' || !(citigoldJson.isCanClickNEXT.isVerificationCode)){
            showMsg('请点击获取短信验证码!');
            return;
        }
		if (!(fmReg.pwD6.test($('#inp').val()))) {
			showMsg('请输入正确格式的验证码');
			return;
		}
		showLoader('短信验证码验证中...');
		if (citigoldJson.codeTime) {
			clearInterval(citigoldJson.codeTime);
		}
		$('#getMsg').removeClass('cannt-click').text('重新获取');
		$('.codetime').html('请在<span style="color:red;">0</span>秒内输入验证码');
		//$('.codetime').html('请重新获取验证码');
		$('#inp').removeAttr('disabled');
		//验证验证码是否有效
		var sendJson = {
			"b": [{
				"orgId.s": commonJson.orgId,
				"moduleId.s": citigoldJson.moduleID, //模块编号
				"tranId.s": citigoldJson.tranId, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
				"USER_NO.s": commonJson.USER_NO, //用户唯一标识
				"EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
				"MSG_INFO.s": $('#inp').val(), //动态口令
				"Flags.s": "BBBB", //标记位
				"MOBILE_NO.s": citigoldJson.tel, //手机号码debitEnter.tel
				"REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
				"faceRecogn.s": citigoldJson.faceRecogn //人脸识别
			}]
		};
		imessageAuthentionServiceYFun(sendJson, function(msg) {
			commonJson.USER_NO = "";
			imessageAuthentionServiceYFunCitigoldSucc(msg);
		}, function(err) {
			commonJson.USER_NO = "";
			funFail(err);
		});
	});
	//基金购买确认信息的“修改”功能：返回上一个页面可修改信息 BY SAVEN 2015.10.20 11:29:00
	$("span[name='_modify']").on("click", function() {
		$.mobile.changePage('citigold-InformationInputOne.html');
	});
})

//定投 信息录入 
$(document).on("pageshow", '#citigold-InformationInputTwo', function() {
	$('#citigold-dt-name').html(citigoldJson.jjProInfo.PrdName); //基金名称
	$('#citigold-dt-code').html(citigoldJson.jjProInfo.PrdCode); //基金代码
	$('#citigold-dt-bz').html(currType[citigoldJson.jjProInfo.CurrType]); //币种
	$('#citigold-dt-dtxx').html(fmoney(citigoldJson.jjProInfo.PMinInvestAmt) + '元'); //定投下限
	$('#citigold-dt-kh').html(citigoldJson.BankAcc); //扣款卡账号
	//点击基金定投确认页面的“修改”按钮返回到该页面后数据回显  BY SAVEN 2015.10.20 12:07:00
	/*if(TempCache.getCache("temp_flag_modify")){
	    $('#citigold-dt-zq').val(citigoldJson.jjProInfo.Period);//定投周期
	    $('#citigold-dt-tzr').val(citigoldJson.jjProInfo.InvestDay);//定投日
	    $('#citigold-dt-qmtj').val(citigoldJson.jjProInfo.OverFlag);//期满条件
	    $('#citigold-dt-qmrq').val(citigoldJson.jjProInfo.EndDate);//期满日期 
	    $('#citigold-dt-qmrq').val(citigoldJson.jjProInfo.InvestTimes);//到期投资次数  期满成功投资次数
	    $('#citigold-dt-je').val(citigoldJson.jjProInfo.Amt);//每期投资金额
	    $('#citigold-dt-yt').val(citigoldJson.jjProInfo.dtyt);//定投用途
	    $('#citigold-dt-tjr').val(citigoldJson.jjProInfo.dttjr);//推荐人
	    //清除临时缓存
	    TempCache.removeCache("temp_flag_modify");
	}*/
	$('#citigold-dt-zq').on('change', function() {
		switch ($(this).val()) {
			case '0': //月
				var textHtml = '';
				for (var i = 1; i < 29; i++) {
					textHtml += '<option>' + i + '</option>';
				}
				$('#citigold-dt-tzr').html(textHtml).selectmenu('refresh');
				$('.day-touzi').show();
				break;
			case '1': //周
				$('#citigold-dt-tzr').html('<option value="1">周一</option><option value="2">周二</option><option value="3">周三</option><option value="4">周四</option><option value="5">周五</option>').selectmenu('refresh');
				$('.day-touzi').hide();
				break;
			case '2': //日
				$('#citigold-dt-tzr').html('<option value="1">每交易日</option>').selectmenu('refresh');
				$('.day-touzi').hide();
				break;
		}
	})
	$('#citigold-dt-zq').change();
	$('#citigold-dt-qmtj').on('change', function() {
		switch ($(this).val()) {
			case '1': //到期日
				$('#citigold-dt-qmrq-wrap .result-left').html('<span class="required-stars">*</span>期满日期');
				$('#citigold-dt-qmrq-wrap input').attr('type', 'date').removeAttr('reg').val('');
				$('#citigold-dt-qmrq-wrap .day-botton-img').show();
				break;
			case '0': //总投资次数
				$('#citigold-dt-qmrq-wrap .result-left').html('<span class="required-stars">*</span>到期投资次数');
				$('#citigold-dt-qmrq-wrap input').attr({
					type: 'text',
					reg: 'numSZ'
				}).val('');
				$('#citigold-dt-qmrq-wrap .day-botton-img').hide();
				break;
			case '2': //成功次数
				$('#citigold-dt-qmrq-wrap .result-left').html('<span class="required-stars">*</span>期满成功投资次数');
				$('#citigold-dt-qmrq-wrap input').attr({
					type: 'text',
					reg: 'numSZ'
				}).val('');
				$('#citigold-dt-qmrq-wrap .day-botton-img').hide();
				break;
		}
	})
	if (citigoldJson.DTCache) {
		$('#citigold-dt-zq').val(citigoldJson.jjProInfo.Period).selectmenu('refresh'); //定投周期
		$('#citigold-dt-zq').change();
		$('#citigold-dt-tzr').val(citigoldJson.jjProInfo.InvestDay).selectmenu('refresh'); //定投日
		$('#citigold-dt-qmtj').val(citigoldJson.jjProInfo.OverFlag).selectmenu('refresh'); //期满条件
		$('#citigold-dt-qmtj').change();
		//citigoldJson.jjProInfo.EndDate='';
		//citigoldJson.jjProInfo.InvestTimes='';
		if ($('#citigold-dt-qmtj').val() == '1') {
			$('#citigold-dt-qmrq').val(citigoldJson.jjProInfo.EndDate); //期满日期 
		} else {
			$('#citigold-dt-qmrq').val(citigoldJson.jjProInfo.InvestTimes); //到期投资次数  期满成功投资次数
		}

		$('#citigold-dt-je').val(fmoney(citigoldJson.jjProInfo.Amt)); //每期投资金额
		$('#citigold-dt-yt').val(citigoldJson.jjProInfo.dtyt); //定投用途
		$('#citigold-dt-tjr').val(citigoldJson.jjProInfo.dttjr); //推荐人
	}

	citigoldJson.DTCache = true;
	$('#citigold-dt-je').on('input propertychange', function() {
		var _val = $(this).val().replace(/[^\d.]/g, "");
		$(this).val(_val);
	})
	$('#citigold-dt-je').on('tap', function() {
		var _val = $(this).val();
		$(this).val(rmoney(_val));
	})
	$('#citigold-dt-je').on('blur', function() {
		var _val = $(this).val().replace(/[^0-9\.]/ig, "");
		$(this).val(fmoney(_val));
	})
	$('.footter .previous:first').on('click', function() {
		citigoldJson.jjProInfo.Period = $.trim($('#citigold-dt-zq').val()); //定投周期
		citigoldJson.jjProInfo.InvestDay = $.trim($('#citigold-dt-tzr').val()); //定投日
		citigoldJson.jjProInfo.OverFlag = $.trim($('#citigold-dt-qmtj').val()); //期满条件
		citigoldJson.jjProInfo.EndDate = '';
		citigoldJson.jjProInfo.InvestTimes = '';
		if ($('#citigold-dt-qmtj').val() == '1') {
			citigoldJson.jjProInfo.EndDate = $.trim($('#citigold-dt-qmrq').val()); //期满日期 
		} else {
			citigoldJson.jjProInfo.InvestTimes = $.trim($('#citigold-dt-qmrq').val()); //到期投资次数  期满成功投资次数
		}
		citigoldJson.jjProInfo.Amt = rmoney($.trim($('#citigold-dt-je').val())); //每期投资金额
		citigoldJson.jjProInfo.dtyt = $.trim($('#citigold-dt-yt').val()); //定投用途
		citigoldJson.jjProInfo.dttjr = $.trim($('#citigold-dt-tjr').val()); //推荐人
		$.mobile.changePage('citigold-InformationInput.html', {
			reverse: true
		});
	})
	$('.footter .previous:last').on('click', function() {
		citigoldJson.jjProInfo.Amt = rmoney($.trim($('#citigold-dt-je').val())); //每期投资金额
		var num = 0;
		$.each($('input[isRequired=true]'), function(index, el) {
			if ($.trim($(this).val()) == '') {
				num++
				$(this).closest('li').addClass('fm-item-error'); //错误字段点亮
			} else {
				$(this).closest('li').removeClass('fm-item-error');
			}
		})
		if (num > 0) {
			showMsg('必填项不能为空');
			return;
		}
		//格式验证

		$('input[type="text"][reg]').each(function(index, el) {
			var reg = $(this).attr('reg');
			if ($(this).attr('id') == 'citigold-dt-qmrq') { //次数
				if (!(fmReg[reg].test($.trim($(this).val())))) {
					$(this).closest('li').addClass('fm-item-error'); //错误字段点亮
					return false;
				}

				if ($.trim($(this).val()) <= 0 || $.trim($(this).val()) >= 1000) {
					$(this).closest('li').addClass('fm-item-error'); //错误字段点亮
				} else {
					$(this).closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
				}
			}
			if ($(this).attr('id') == 'citigold-dt-je') { //投资金额
				if (!(fmReg[reg].test(citigoldJson.jjProInfo.Amt))) {
					$(this).closest('li').addClass('fm-item-error'); //错误字段点亮
					return false;
				}
				if (citigoldJson.jjProInfo.Amt < parseInt(citigoldJson.jjProInfo.PMinInvestAmt)) { //必须是最小购买单位的整数倍，且每期投资金额>=定投下限
					$(this).closest('li').addClass('fm-item-error'); //错误字段点亮
				} else {
					$(this).closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
				}
			}
		})
		$('input[type="text"][reg]').each(function(index, el) {
			var reg = $(this).attr('reg');
			if ($(this).attr('id') == 'citigold-dt-qmrq') { //次数
				if (!(fmReg[reg].test($.trim($(this).val())))) {
					num++;
					showMsg(fmRegMsg[reg]);
					return false;
				}
				if ($.trim($(this).val()) <= 0 || $.trim($(this).val()) >= 1000) {
					num++;
					showMsg('到期投资次数或期满成功投资次数必须大于0小于1000');
					return false;
				}
			}
			if ($(this).attr('id') == 'citigold-dt-je') { //投资金额
				if (!(fmReg[reg].test(citigoldJson.jjProInfo.Amt))) {
					num++;
					showMsg(fmRegMsg[reg]);
					return false;
				}
				if (citigoldJson.jjProInfo.Amt < parseInt(citigoldJson.jjProInfo.PMinInvestAmt)) { //必须是最小购买单位的整数倍，且每期投资金额>=定投下限
					num++;
					showMsg('每期投资金额不能小于定投下限');
					return false;
				}
			}
		})
		if (num > 0) {
			return;
		}
		if ($('#citigold-dt-qmrq[type="date"]').length && $('#citigold-dt-qmrq[type="date"]').val().replace(/\-/g, "") <= dateGetYMD(0)[0].replace(/\-/g, "")) {
			$('#citigold-dt-qmrq[type="date"]').closest('li').addClass('fm-item-error'); //错误字段点亮
			showMsg('期满日期需大于当前日期');
			return false;
		} else {
			$('#citigold-dt-qmrq[type="date"]').closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
		}
		citigoldJson.jjProInfo.Period = $.trim($('#citigold-dt-zq').val()); //定投周期
		citigoldJson.jjProInfo.InvestDay = $.trim($('#citigold-dt-tzr').val()); //定投日
		citigoldJson.jjProInfo.InvestDayVal = $('#citigold-dt-tzr').find('option:selected').text(); //定投日value
		citigoldJson.jjProInfo.OverFlag = $.trim($('#citigold-dt-qmtj').val()); //期满条件
		citigoldJson.jjProInfo.EndDate = '';
		citigoldJson.jjProInfo.InvestTimes = '';
		if ($('#citigold-dt-qmtj').val() == '1') {
			citigoldJson.jjProInfo.EndDate = $.trim($('#citigold-dt-qmrq').val()); //期满日期 
		} else {
			citigoldJson.jjProInfo.InvestTimes = $.trim($('#citigold-dt-qmrq').val()); //到期投资次数  期满成功投资次数
		}

		citigoldJson.jjProInfo.dtyt = $.trim($('#citigold-dt-yt').val()); //定投用途
		citigoldJson.jjProInfo.dttjr = $.trim($('#citigold-dt-tjr').val()); //推荐人
		$.mobile.changePage('citigold-confirmationSignature.html');
	})
});


//定投确认（citigold-confirmationSignature.html）
$(document).on("pageshow", '#citigold-confirmationSignature', function() {
	commonJson.USER_NO = '';
	citigoldJson.platGlobalSeq = undefined;
	//isIChangeRiskLevelCitigoldFun();//是否修改风险评估
	if (citigoldJson.msgSureCache == true && citigoldJson.videoSrc != '') {
		$('.video-box').append('<video id="video-content" src="' + citigoldJson.videoSrc + '" width="100%" height="189px" autoplay="autoplay" controls="controls"></video>');
		$('.video-box .photo').hide();
		$('.kh-buy-cxps').show();
	}
	citigoldIsCanclickNext(citigoldJson.msgSureCache); //是否可以点击提交和获取验证码
	$(".jijin-kesm:eq(0)").on('click', function() {
		if ($('.video-box video').length) {
			citigoldJson.msgSureCache = true;
			citigoldJson.videoSrc = $('.video-box video').attr('src');
		} else {
			citigoldJson.videoSrc = '';
		}
		//Meap.scanOfficeFile('www/images/基金产品说明书.doc', function(msg) {}, function(err) {});
		$.mobile.changePage('about-cusManual.html');
	})
	$(".jijin-kesm:eq(1)").on('click', function() {
		Meap.scanOfficeFile('www/images/基金客户声明与须知.doc', function(msg) {}, function(err) {});
	})
	$('.customer-risk-pj:eq(0)').html(riskLevelOne[citigoldJson.FPRiskLevel]); //CurrFPRiskLevel//FPRiskLevel
	var qmtjStr = '';
	switch (citigoldJson.jjProInfo.OverFlag) {
		case '0': //总投资次数
			qmtjStr = '<div class="li-first-div">' +
				'<span class="basic_zhengType">期满条件：</span>' +
				'<span>' + jjOverFlag[citigoldJson.jjProInfo.OverFlag] + '</span>' +
				'</div>' +
				'<div class="li-second-div">' +
				'<span class="basic_guoJ">到期投资次数：</span>' +
				'<span>' + citigoldJson.jjProInfo.InvestTimes + '</span>' +
				'</div>';
			break;
		case '1': //到期日
			qmtjStr = '<div class="li-first-div">' +
				'<span class="basic_zhengType">期满条件：</span>' +
				'<span>' + jjOverFlag[citigoldJson.jjProInfo.OverFlag] + '</span>' +
				'</div>' +
				'<div class="li-second-div">' +
				'<span class="basic_guoJ">期满日期：</span>' +
				'<span>' + citigoldJson.jjProInfo.EndDate + '</span>' +
				'</div>';
			break;
		case '2': //成功次数
			qmtjStr = '<div class="li-first-div">' +
				'<span class="basic_zhengType">期满条件：</span>' +
				'<span>' + jjOverFlag[citigoldJson.jjProInfo.OverFlag] + '</span>' +
				'</div>' +
				'<div class="li-second-div">' +
				'<span class="basic_guoJ">期满成功投资次数：</span>' +
				'<span>' + citigoldJson.jjProInfo.InvestTimes + '</span>' +
				'</div>';
			break;

	}
	$('.confirm-ul').html('<li class="basic-li">' +
		'<div class="li-first-div">' +
		'<span class="basic-name">基金名称：</span>' +
		'<span>' + citigoldJson.jjProInfo.PrdName + '</span>' +
		'</div>' +
		'<div class="li-second-div">' +
		'<span class="basic-sex">基金代码：</span>' +
		'<span>' + citigoldJson.jjProInfo.PrdCode + '</span>' +
		'</div>' +
		'</li>' +
		'<li>' +
		'<div class="li-first-div">' +
		'<span class="basic_zhengType">币种：</span>' +
		'<span>' + currType[citigoldJson.jjProInfo.CurrType] + '</span>' +
		'</div>' +
		'<div class="li-second-div">' +
		'<span class="basic_guoJ">定投下限：</span>' +
		'<span>' + fmoney(citigoldJson.jjProInfo.PMinInvestAmt) + '元</span>' +
		'</div>' +
		'</li>' +
		'<li>' +
		'<div class="li-first-div">' +
		'<span class="basic_zhengType">投资周期：</span>' +
		'<span>' + jjPeriod[citigoldJson.jjProInfo.Period] + '</span>' +
		'</div>' +
		'<div class="li-second-div">' +
		'<span class="basic_guoJ">投资日：</span>' +
		'<span>' + citigoldJson.jjProInfo.InvestDayVal + '</span>' +
		'</div>' +
		'</li>' +
		'<li>' + qmtjStr +
		'</li>' +
		'<li>' +
		'<div class="li-first-div">' +
		'<span class="basic_zhengType">定投用途：</span>' +
		'<span>' + citigoldJson.jjProInfo.dtyt + '</span>' +
		'</div>' +
		'<div class="li-second-div">' +
		'<span class="basic_guoJ">扣款卡账号：</span>' +
		'<span>' + citigoldJson.BankAcc + '</span>' +
		'</div>' +
		'</li>' +
		'<li>' +
		'<div class="li-first-div">' +
		'<span class="basic_zhengType">每期投资金额：</span>' +
		'<span>' + fmoney(citigoldJson.jjProInfo.Amt) + '元</span>' +
		'</div>' +
		'<div class="li-second-div">' +
		'<span class="basic_guoJ">推荐人：</span>' +
		'<span>' + citigoldJson.jjProInfo.dttjr + '</span>' +
		'</div>' +
		'</li>');
	$('#citi-edit').on('click', function() {
		if ($('.video-box video').length) {
			citigoldJson.msgSureCache = true;
			citigoldJson.videoSrc = $('.video-box video').attr('src');
		} else {
			citigoldJson.videoSrc = '';
		}
		$.mobile.changePage('citigold-InformationInputTwo.html', {
			reverse: true
		});
	});
	//初始化签名方法
	signature.init({
		div: $('#qianMDT'), //签名容器
		finishBtn: $("#qianOK"), //完成签名按钮
		clearBtn: $("#clear-botton"), //清除签名按钮
		lineColor: '#000000', //线条颜色
		lineWidth: 3, //线条粗细
		finish: function(data) { //签名完成回调函数
			// citigoldJson.qmStr = data;
			citigoldJson.qmStr = '';
			citigoldJson.qmStr = data.replace('data:image/png;base64,', '');
			if (citigoldJson.qmStr == '' || citigoldJson.qmStr == undefined) {
				showTags({
					'title': '提示',
					'content': '签名异常，请重新签写！',
					'ok': {
						'title': '',
						fun: function() {}
					}
				});
				return;
			}
			if ($('#ic_agree').is(":hidden")) {
				$('#ic_disagree').hide().siblings('#ic_agree').show();
				citigoldJson.isCanClickNEXT.isSign = true;
				$('.qianM_shadow').show();
			} else {
				$('#ic_disagree').show().siblings('#ic_agree').hide();
				citigoldJson.isCanClickNEXT.isSign = false;
				$('.qianM_shadow').hide();
			}
			// if (citigoldJson.isCanClickNEXT.isSure && citigoldJson.isCanClickNEXT.isRead && citigoldJson.isCanClickNEXT.isVideo && citigoldJson.isCanClickNEXT.isSign && citigoldJson.isCanClickNEXT.isVerificationCode) {
			// 	$('.previous').addClass('btn_next');
			// } else {
			// 	$('.previous').removeClass('btn_next');
			// }
		}
	});

	$('.footter .previous').on('click', function() {
		// if (!$(this).hasClass('btn_next')) return;
		if(!(citigoldJson.isCanClickNEXT.isSure)){
            showMsg('请确认风险等级!');
            return;
        }
        if(!(citigoldJson.isCanClickNEXT.isRead)){
            showMsg('请阅读并确认协议!');
            return;
        }
        if(!(citigoldJson.isCanClickNEXT.isVideo)){
            showMsg('请拍摄视频!');
            return;
        }
		if(!(citigoldJson.isCanClickNEXT.isSign)){
            showMsg('请确认签名!');
            return;
        }
		if(commonJson.USER_NO == '' || !(citigoldJson.isCanClickNEXT.isVerificationCode)){
            showMsg('请点击获取短信验证码!');
            return;
        }
		if (!(fmReg.pwD6.test($('#inp').val()))) {
			showMsg('请输入正确的短信验证码');
			return;
		}
		showLoader('短信验证码验证中...');
		if (citigoldJson.codeTime) {
			clearInterval(citigoldJson.codeTime);
		}
		$('#getMsg').removeClass('cannt-click').text('重新获取');
		$('.codetime').html('请在<span style="color:red;">0秒</span>内输入验证码');
		//$('.codetime').html('请重新获取验证码');
		$('#inp').removeAttr('disabled');
		//验证验证码是否有效
		var sendJson = {
			"b": [{
				"orgId.s": commonJson.orgId,
				"moduleId.s": citigoldJson.moduleID, //模块编号
				"tranId.s": citigoldJson.tranId, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
				"USER_NO.s": commonJson.USER_NO, //用户唯一标识
				"EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
				"MSG_INFO.s": $('#inp').val(), //动态口令
				"Flags.s": "BBBB", //标记位
				"MOBILE_NO.s": citigoldJson.tel, //手机号码debitEnter.tel
				"REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
				"faceRecogn.s": citigoldJson.faceRecogn //人脸识别
			}]
		};
		imessageAuthentionServiceYFun(sendJson, function(msg) {
			commonJson.USER_NO = "";
			imessageAuthentionServiceYFunCitigoldSucc(msg);
		}, function(err) {
			commonJson.USER_NO = "";
			funFail(err);
		});
	});
	//基金定投确认信息的“修改”功能：返回上一个页面可修改信息 BY SAVEN 2015.10.20 11:29:00
	$("span[name='_modify']").on("click", function() {
		//临时缓存
		TempCache.cache("temp_flag_modify", true);
		$.mobile.changePage('citigold-InformationInputTwo.html');
	});
});
//购买、定投完成页面
$(document).on('pageshow', '#citigold-carryOut', function() {
		citigoldJson.qmStr = '';
		$("#citigold-carryOut .previous").on('click', function() {
			$.mobile.changePage('citigold-fundSupermarketsOne.html', {
				reverse: true
			});
		})
		var showResMeg = '基金业务办理成功！';
		/*        citigoldJson.isSubSign 
		citigoldJson.isfengping
		        if(citigoldJson.isSubSign == true && citigoldJson.isfengping == false){
		            showResMeg = '基金签约成功，风险评估失败！';
		        }*/

		$('#citigold-carryOut .box_head').text(showResMeg);
		if (citigoldJson.pdfUrl != undefined) {
			transformStringToImage(citigoldJson.pdfUrl, function(msg) {
				$('#citigold-carryOut .compl_box img').attr('src', msg);
			}, function(err) {
				alert(err + '生成二维码失败');
			})
		}
	})
	//查询客户名下的所有账号
function queryAllBankAccCitigold() {
	showLoader('卡账号查询中...');
	//查询卡账号
	var sendJson = {
		"b": [{

			/*"CLIENT_NO.s": "0701657997", //客户号
			"CLIENT_NAME.s": "张三", //客户名称*/
			"CLIENT_NO.s": citigoldJson.CLIENT_NO, //客户号
			"CLIENT_NAME.s": custermerInfo.name, //客户名称
			"DOCUMENT_TYPE.s": "0", //证件类型
			"DOCUMENT_ID.s": custermerInfo.cerNO, //证件号
			"deviceNo.s": commonJson.adminCount, //设备编号
			"moduleId.s": citigoldJson.moduleID, //模块名
			"tranId.s": citigoldJson.tranId, //交易名
			"orgId.s": commonJson.orgId, //机构号
			"operatorNo.s": commonJson.adminCount, //操作员
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress //工作地址
		}]
	};
	INetBankProductServiceFun(sendJson, function(msg) {
		INetBankProductServiceSucc(msg);
	}, function(err) {
		funFail(err);
	})
}
//查询签约银行卡号
function querySignBankAccCitigold() {
	showLoader('签约银行卡号查询中...');
	var sendJson = {
		"b": [{
			"orgId.s": commonJson.orgId, //操作员的机构号
			"moduleId.s": citigoldJson.moduleID, //模块编号
			"tranId.s": citigoldJson.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员
			"deviceNo.s": commonJson.udId, //设备编号
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"AccType.s": "2", //客户标识类型
			"DOCUMENT_ID.s": custermerInfo.cerNO, //客户标识
			"IdType.s": "0"
		}]
	};
	IClientSignBankAccountServiceFun(sendJson, function(msg) {
		IClientSignBankAccountServiceSucc(msg);
	}, function(err) {
		funFail(err);
	})
}

//是否签约逻辑判断
function isSignCitigoldFun() {
	if (citigoldJson.signStatus == '0') { //已签约
		//alert('已签约');
		$.mobile.changePage('citigold-InformationInput.html'); //影像采集页面
	} else { //未签约
		//alert('未签约');
		$.mobile.changePage('citigold-businessContract.html'); //签约页面
	}
}
//是否做风险评估修改
function isIChangeRiskLevelCitigoldFun() {
	showLoader('风险等级提交中...');
	var contStatus = '';
	var Address = '';
	var Email = '';
	var Mobile = '';
	var SendMode = '';
	var Tel = '';
	if (citigoldJson.isSubSign == true) {
		contStatus = "0";
		Address = citigoldJson.citiAddr; //通讯地址
		Email = citigoldJson.eMail; //e-mail
		Mobile = citigoldJson.tel; //手机
		SendMode = citigoldJson.sendstyle; //对账单形式
		Tel = citigoldJson.CITY_TEL + citigoldJson.CONTACT_ID_GD; //固定电话
	} else {
		contStatus = "1";
	}
	var sendJson = {
		"b": [{
			"orgId.s": commonJson.orgId, //操作员所属机构号
			"moduleId.s": citigoldJson.moduleID, //模块编号
			"tranId.s": citigoldJson.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员
			"deviceNo.s": commonJson.udId, //设备编号
			"offlineOnline.s": 'online', //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"ClientType.s": "P", //客户类型 N组织 P个人
			"BankAcc.s": citigoldJson.BankAcc, //银行账号
			"RiskLevel.s": citigoldJson.CurrFPRiskLevel, //风险等级
			"RiskMonths.s": "12",
			"IdType.s": "0", //证件类型
			"ContractStatus.s": contStatus,
			"faceRecogn.s": citigoldJson.faceRecogn, //人脸识别
			//20160618添加
			"Currency.s": citigoldJson.jjProInfo.CurrType,	//币种
			"tranMoney.s": "",	//交易金币
			"CLIENT_NAME.s": custermerInfo.name, 	//客户姓名
			"DOCUMENT_ID.s": custermerInfo.cerNO,	//证件号
			"Recommender.s": "",	//推荐人
			"fundInvePurposes.s": "", //基金定投用途
			"Mobile.s": Mobile,	//手机
			"SendMode.s": SendMode,	//对账单形式
			"Tel.s": Tel,	//固定电话
			"Email.s": Email,	//e-mail
			"Address.s": Address,	//通讯地址
			"fileData.s": citigoldJson.qmStr,	//签名
			"platGlobalSeq.s": citigoldJson.platGlobalSeq,
			"longitude.s": commonJson.longitude,//客户经理轨迹定位
            "latitude.s": commonJson.latitude//客户经理轨迹定位
		}]
	}
	if (citigoldJson.isGMorDT == 'GM') { //基金购买
		sendJson.b[0]["Recommender.s"] = citigoldJson.jjProInfo.referee;
		sendJson.b[0]["tranMoney.s"] = citigoldJson.jjProInfo.buyNum + "";
	} else {	//基金定投
		sendJson.b[0]["Recommender.s"] = citigoldJson.jjProInfo.dttjr;
		sendJson.b[0]["fundInvePurposes.s"] = citigoldJson.jjProInfo.dtyt;
		sendJson.b[0]["tranMoney.s"] = citigoldJson.jjProInfo.Amt + "";
	}
	IChangeRiskLevelServiceFun(sendJson, function(msg) {
		IChangeRiskLevelServiceSucc(msg);
	}, function(err) {
		//funFail(err);
		hideLoader();
		// err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		// var responseObj = JSON.parse(err);
		// var responseCode = responseObj.b[0].error[0];
		// if ($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
		// 	responseCode.message = '当前网络不可用,请检测网络!';
		// }
		// var failMsg = '';
		// if (citigoldJson.isSubSign == true) {
		// 	// citigoldVideoUpload();
		// 	changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
		// 	failMsg = '基金签约成功，风险评估失败，' + responseCode.message + '，基金购买（定投）失败';
		// } else {
		// 	changeUploadStatus("03", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
		// 	failMsg = '风险评估失败，' + responseCode.message + '，基金购买（定投）失败';
		// }
		// showTags({
		// 	'content': failMsg, //必输  
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
}

//购买/定投基金
function IFinancialProductsServiceBuyDtFun() {
	if (citigoldJson.isGMorDT == 'GM') { //基金购买
		//基金购买 信息录入提交
		showLoader('信息提交中...');
		if (citigoldJson.codeTime) {
			clearInterval(citigoldJson.codeTime);
		}
		var contStatus = '';
		var Address = '';
		var Email = '';
		var Mobile = '';
		var SendMode = '';
		var Tel = '';
		if (citigoldJson.isSubSign == true) {
			contStatus = "0";
			Address = citigoldJson.citiAddr; //通讯地址
			Email = citigoldJson.eMail; //e-mail
			Mobile = citigoldJson.tel; //手机
			SendMode = citigoldJson.sendstyle; //对账单形式
			Tel = citigoldJson.CITY_TEL + citigoldJson.CONTACT_ID_GD; //固定电话
		} else {
			contStatus = "1";
		}
		var sendJson = {
			"b": [{
				"orgId.s": commonJson.orgId, //操作员所属机构号
				"moduleId.s": citigoldJson.moduleID, //模块编号
				"tranId.s": citigoldJson.tranId, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"offlineOnline.s": 'online', //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"CLIENT_NAME.s": custermerInfo.name, //客户姓名
				"ClientName.s": custermerInfo.name, //客户姓名
				"DOCUMENT_ID.s": custermerInfo.cerNO, //证件号
				"custCredType.s": "0", //证件类型
				"ClientManager.s": commonJson.fundCmanagerId, //客户号
				"currency.s": citigoldJson.jjProInfo.CurrType, //币种
				"BankAcc.s": citigoldJson.BankAcc, //银行账号
				"PrdCode.s": citigoldJson.jjProInfo.PrdCode, //产品代码
				"Amt.s": citigoldJson.jjProInfo.buyNum + "", //金额
				"Vol.s": "0", //份额
				"CONTACT_ID.s": citigoldJson.tel, //电话
				"recommender.s": citigoldJson.jjProInfo.referee, //推荐人
				"ContractStatus.s": contStatus,
				"fileData.s": citigoldJson.qmStr,
				"Address.s": Address, //通讯地址
				"Email.s": Email, //e-mail
				"Mobile.s": Mobile, //手机
				"SendMode.s": SendMode, //对账单形式
				"Tel.s": Tel, //固定电话
				"navUnit.s": citigoldJson.jjProInfo.NAV,
				"navDate.s": citigoldJson.jjProInfo.NavDate,
				"referenceRate.s": citigoldJson.jjProInfo.ReferenceRate,
				"faceRecogn.s": citigoldJson.faceRecogn, //人脸识别
				"localeTimestamp.s": '' + myTime.CurTime(), //app时间
				"BussinessCode.s": '01', //身份证联网核查业务编号
				"DOCUMENT_TYPE.s": '0', //证件类型
				"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
				"ReviewUserId.s": lianwanghechaData.ReviewUserId, //远程复核用户ID
				"platGlobalSeq.s": citigoldJson.platGlobalSeq,
				"longitude.s": commonJson.longitude,//客户经理轨迹定位
                "latitude.s": commonJson.latitude//客户经理轨迹定位
			}]
		};
		//信息录入文字信息上传 基金购买
		IFinancialProductsServiceBuyFun(sendJson, function(msg) {
			IFinancialProductsServiceBuySucc(msg);
		}, function(err) {
			//funFail(err);
			hideLoader();
			// err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
			// var responseObj = JSON.parse(err);
			// var responseCode = responseObj.b[0].error[0];
			// if ($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
			// 	responseCode.message = '当前网络不可用,请检测网络!';
			// }
			// //TODO:exception to pad
			// if ($.trim(responseCode.message).toUpperCase() == 'THE REQUEST TIMED OUT'||$.trim(responseCode.message).toUpperCase() == 'ERR_RESPONSE_TIMEOUT') { //全部改成大写即可捕获
			// 	//citigoldJson.platGlobalSeq=responseCode[1].buyFinancialProductsVO[0].platGlobalSeq;//流水号
			// 	// citigoldJson.pdfUrl = responseCode[0].pdfUrl;//padUrl
			// 	//存储个人信息--影像复用使用
			// 	//cacheCustermerInfo('基金');
			// 	responseCode.message = '系统超时,请重新操作!';
			// 	showTags({
			// 		'title': '提示',
			// 		'content': responseCode.message,
			// 		'ok': {
			// 			'title': '查看客户当日基金委托情况',
			// 			fun: function() {
			// 				// citigoldVideoUploadOut();
			// 				changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
			// 				$.mobile.changePage('citigold-fundSupermarketsError.html');
			// 			}
			// 		}
			// 	});
			// } else {
			// 	var failMsg = '';
			// 	if (citigoldJson.isSubSign == true) {
			// 		// citigoldVideoUpload();
			// 		changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
			// 		failMsg = '基金签约成功，风险评估成功，基金购买（定投）失败，' + responseCode.message;
			// 	} else {
			// 		if (citigoldJson.isfengping == true) {
			// 			// citigoldVideoUpload();
			// 			changeUploadStatus("02", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
			// 			failMsg = '风险评估成功，基金购买（定投）失败，' + responseCode.message;
			// 		} else {
			// 			changeUploadStatus("03", citigoldJson.phoneTime, citigoldJson.signTime, citigoldJson.videoTime);
			// 			failMsg = '基金购买（定投）失败，' + responseCode.message;
			// 		}
			// 	}
			// 	showTags({
			// 		'content': failMsg, //必输  
			// 		'ok': {
			// 			fun: function() {
			// 				$.mobile.changePage('citigold-fundSupermarketsOne.html', {
			// 					reverse: true
			// 				});
			// 			}
			// 		}
			// 	})
			// }
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

	} else {
		//基金定投 信息录入提交
		showLoader('信息提交中...');
		if (citigoldJson.codeTime) {
			clearInterval(citigoldJson.codeTime);
		}
		var contStatus = '';
		var Address = '';
		var Email = '';
		var Mobile = '';
		var SendMode = '';
		var Tel = '';
		if (citigoldJson.isSubSign == true) {
			contStatus = "0";
			Address = citigoldJson.citiAddr; //通讯地址
			Email = citigoldJson.eMail; //e-mail
			Mobile = citigoldJson.tel; //手机
			SendMode = citigoldJson.sendstyle; //对账单形式
			Tel = citigoldJson.CITY_TEL + citigoldJson.CONTACT_ID_GD; //固定电话
		} else {
			contStatus = "1";
		}
		var sendJson = {
			"b": [{
				"orgId.s": commonJson.orgId, //操作员所属机构号
				"moduleId.s": citigoldJson.moduleID, //模块编号
				"tranId.s": citigoldJson.tranId, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"offlineOnline.s": 'online', //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"CLIENT_NAME.s": custermerInfo.name, //客户姓名
				"ClientName.s": custermerInfo.name, //客户姓名
				"DOCUMENT_ID.s": custermerInfo.cerNO, //证件号
				"custCredType.s": "0", //证件类型
				"ClientManager.s": commonJson.fundCmanagerId, //客户号
				"currency.s": citigoldJson.jjProInfo.CurrType, //币种
				"BankAcc.s": citigoldJson.BankAcc, //银行账号
				"PrdCode.s": citigoldJson.jjProInfo.PrdCode, //产品代码
				"Amt.s": citigoldJson.jjProInfo.Amt + "", //金额
				"OverFlag.s": citigoldJson.jjProInfo.OverFlag, //终止模式
				"expirationConditions.s": citigoldJson.jjProInfo.OverFlag, //期满
				"Period.s": citigoldJson.jjProInfo.Period, //投资周期
				"EndDate.s": citigoldJson.jjProInfo.EndDate.replace(/-/g, ''), //结束日期
				"InvestTimes.s": citigoldJson.jjProInfo.InvestTimes, //投资期数
				"Span.s": "1", //投资间隔
				"InvestDay.s": citigoldJson.jjProInfo.InvestDay, //投资日
				"CONTACT_ID.s": citigoldJson.tel, //电话
				"recommender.s": citigoldJson.jjProInfo.dttjr, //推荐人
				"fundInvePurposes.s": citigoldJson.jjProInfo.dtyt, //定投用途
				"ContractStatus.s": contStatus,
				"fileData.s": citigoldJson.qmStr,
				"Address.s": Address, //通讯地址
				"Email.s": Email, //e-mail
				"Mobile.s": Mobile, //手机
				"SendMode.s": SendMode, //对账单形式
				"Tel.s": Tel, //固定电话
				"faceRecogn.s": citigoldJson.faceRecogn, //人脸识别
				"localeTimestamp.s": '' + myTime.CurTime(), //app时间
				"DOCUMENT_TYPE.s": '0', //证件类型
				"BussinessCode.s": '01', //身份证联网核查业务编号
				"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
				"ReviewUserId.s": lianwanghechaData.ReviewUserId, //远程复核用户ID
				"platGlobalSeq.s": citigoldJson.platGlobalSeq,
				"longitude.s": commonJson.longitude,//客户经理轨迹定位
                "latitude.s": commonJson.latitude//客户经理轨迹定位
			}]
		};
		//信息录入文字信息上传 基金定投
		IRegularQuotaOpenServiceDtFun(sendJson, function(msg) {
			IRegularQuotaOpenServiceDtSucc(msg);
		}, function(err) {
			//funFail(err);
			hideLoader();
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

	}
}

//基金影像对比
$(document).on('pageshow', '#citigold-personFace', function() {
	showLoader("影像对比中...");
	transFormBase64(citigoldJson.custFacePic, function(msg) {
		citigoldJson.faceBase64 = msg;
		transFormBase64(custermerInfo.image, function(msg1) {
			citigoldJson.imageBase64 = msg1;
			$("#citigold-personFace .camera:eq(0)").attr('src', citigoldJson.custFacePic);
			$("#citigold-personFace .camera:eq(1)").attr('src', custermerInfo.image);
			$("#citigold-personFace .camera:eq(2)").attr('src', citigoldJson.custFacePic);
			if (commonJson.isCustermerInfoMultiplex) {
				citigoldJson.checkPhoto = custermerInfo.checkPhoto;
			}
			if(lianwanghechaData.CheckResult=='09' || lianwanghechaData.CheckResult=='02'){
        		$("#citigold-personFace .camera:eq(3)").attr('src','data:image/png;base64,' + citigoldJson.checkPhoto);
        }else{
        		$("#citigold-personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + citigoldJson.checkPhoto);
        }
			//影像两两对比
			var sendJson = {
				"b": [{
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"orgId.s": commonJson.orgId, //机构号
					"moduleId.s": citigoldJson.moduleID, //模块编号
					"tranId.s": citigoldJson.tranId, //交易编号
					"operatorNo.s": commonJson.adminCount, //操作员
					"deviceNo.s": commonJson.udId, //设备编号
					"OPERATOR_NO.s": commonJson.adminCount, //业务经办人工号
					"TRANS_SCENE.s": "0005", //交易场景 基金0005
					"COMPARE_TYPE.s": "2", //    比对类型1-客户经理比对，2-客户比对
					"WS_TYPE.s": "2", // 终端类型1-PC，2-IOS，3-Android
					"WSNO.s": commonJson.udId, //    终端号
					"VERSION.s": "v1.1.4", //当前控件版本
					"TRANS_CHANNEL.s": "301", //   渠道301
					"ID_CARD.s": custermerInfo.cerNO, // 身份证号码
					"IMG_BASE.s": citigoldJson.faceBase64, //      现场照片
					"CRYPT_TYPE.s": "0", //   图像是否经过加密0-未加密，1-加密方式一，2加密方式二
					"ID_IMG_BASE.s": citigoldJson.checkPhoto, //联网核查照片
					"CARD_IMG_BASE.s": citigoldJson.imageBase64, //  芯片照片
					"BUSI_TYPE.s": "2" //  电子卡“01”

				}]
			};
			//alert(JSON.stringify(sendJson));
			ifacelRecognitionSeFun(sendJson, function(msg) {
				IFacelRecognitionServiceJJSucc(msg);
			}, function(err) {
				citigoldJson.faceRecogn = '2'; //自动不通过
				$("#citigold-personFace .face-result").addClass('no-pass').text('未通过');
				$("#citigold-personFace .center-header").text('人脸识别未通过！');
				$('#citigold-personFace .previous:last').addClass('btn_next');
				$('#citigold-personFace .previous:last').text('远程复核');
				funFail(err);
			})
		}, function(err) {
			hideLoader();
			alert('影像转换失败！')
		})
	}, function(err) {
		hideLoader();
		alert('影像转换失败！')
	})


	//点击查询在线客户经理
	$('#citigold-managerList a').on('click', function() {
			showLoader("获取远程复核客户经理...");
			var sendJson = {
				"b": [{
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					/*"orgId.s":commonJson.orgId,//机构号
					"moduleID.s":debitEnter.moduleID,//模块编号
					"tranId.s":debitEnter.tranId1,//交易编号*/
					"operatorNo.s": commonJson.adminCount, //操作员
					"deviceNo.s": commonJson.udId //设备编号
				}]
			};
			ISysUserServiceManListFun(sendJson, function(msg) {
				hideLoader();
				ISysUserServiceManListJJSucc(msg);
			}, function(err) {
				hideLoader();
				funFail(err);
			})
		})
		//点击继续 
	$('#citigold-personFace .previous:last').on('click', function() {
		if (!($(this).hasClass('btn_next'))) return;
		if ($(this).text() == '继续') {
			if (citigoldJson.isGMorDT == 'GM') {
				$.mobile.changePage('citigold-InformationInputOne.html'); //基金购买交易
			} else {
				$.mobile.changePage('citigold-InformationInputTwo.html'); //基金定投交易
			}
		} else {
			if ($('#citigold-managerList select').val() == '') {
				//hideLoader();
				showMsg('请选择一个客户经理');
				return;
			}
			var sendJson = {
				"b": [{
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"orgId.s": commonJson.orgId, //机构号
					"moduleId.s": citigoldJson.moduleID, //模块编号
					"tranId.s": citigoldJson.tranId, //交易编号
					"operatorNo.s": commonJson.adminCount, //操作员
					"deviceNo.s": commonJson.udId, //设备编号
					"platGlobalSeq.s": citigoldJson.platGlobalSeq, //流水号
					"topic.s": "N/A", //主题N/A
					"code.s": "101", //指令101
					"paramUrl.s": "abc", //参数地址
					"days.s": "0", //有效天数
					"appKey.s": "com.nqsky.bank.service", //appKey  com.nqsky.bank.service
					"context.s": "您有一条远程复核业务需要办理", //推送内容
					"userIds.s": $('#citigold-managerList select').val(), //用户ID  $('#xinka-managerList select').val()
					"busiType.s": "2", //电子卡01
					"cardResult.s": citigoldJson.cardResult, //联网核查对比
					"chipResult.s": citigoldJson.chipResult //芯片对比 
				}]
			};
			//alert(JSON.stringify(sendJson));
			showLoader("正在等待" + $('#citigold-managerList option:selected').attr('realName') + "[手机:" + $('#citigold-managerList option:selected').attr('cellPhone') + "]复核...");
			citigoldJson.telCheck = true;
			iissuesServiceFun(sendJson, function(msg) {
				//	hideLoader();
				iissuesServiceJJSucc(msg);
			}, function(err) {
				//	hideLoader();
				funFail(err);
			})
		}

	});
	//点击F放弃
	$('#citigold-personFace .previous:first').on('click', function() {
		$.mobile.changePage('citigold-InformationInput.html', {
			reverse: true
		});
	});
})

//基金异常处理
$(document).on('pageshow', '#citigold-fundSupermarketsError', function() {
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
	//alert(JSON.stringify(sendJson));
	icustomerCurrentEntrustServiceFun(sendJson, function(msg) {
		icustomerCurrentEntrustServiceSucc(msg);
	}, function(err) {
		// funFail(err);
		icustomerCurrentEntrustServiceFail();
	});
})

/*用户手册
 * named by lei.
 */
$(document).on("pageshow", "#manual-one", function() {
	//产品说明说基本信息
	showLoader("基本信息查询中...");
	var sendJson = {
		"b": [{
			"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
			"workAddress.s": commonJson.workAddress, //工作地址
			"orgId.s": commonJson.orgId, //机构号
			"moduleId.s": citigoldJson.moduleID, //模块编号
			"tranId.s": citigoldJson.tranId, //交易编号
			"operatorNo.s": commonJson.adminCount, //操作员
			"deviceNo.s": commonJson.udId, //设备编号
			"PrdCode.s": citigoldJson.jjProInfo.PrdCode //基金产品编码
		}]
	};
	getProductInstructionFun(sendJson, function(msg) {
		getProductInstructionSucc(msg);
	}, function(err) {
		funFail(err);
	});
	//左侧菜单切换
	$(".navigation>li").on("click", function() {
		var navigation = $('.navigation li').index($(this));
		$(this).addClass("change-bg").siblings("li").removeClass("change-bg");
		$('.information-input>ul').eq(navigation).show().siblings('ul').hide();
	});
	//净值回报导航栏
	$(".netWorth-header>div").on("click", function() {
		var navigation = $('.netWorth-header div').index($(this));
		$(this).addClass("click").siblings("div").removeClass("click");
		$('.netWorth-content .worth').eq(navigation).show().siblings('.worth').hide();
		if ($('.netWorth-header div:eq(0)').hasClass('click')) { //净值走势
			var jingZhiJson = {
				"b": [{
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"orgId.s": commonJson.orgId, //机构号
					"moduleId.s": citigoldJson.moduleID, //模块编号
					"tranId.s": citigoldJson.tranId, //交易编号
					"operatorNo.s": commonJson.adminCount, //操作员
					"deviceNo.s": commonJson.udId, //设备编号
					"PrdCode.s": citigoldJson.jjProInfo.PrdCode, //基金产品编码
					"pageNum.s": '1', //查询页码
					"pageSize.s": '', //每一页显示的记录数
					"startTime.s": '', //开始时间
					"endTime.s": '', //结束时间
					"PrdAttr.s": citigoldJson.jjProInfo.PrdAttr
				}]
			};
			showLoader('净值走势图加载中...');
			getFundProdNavTrendFun(jingZhiJson, function(msg) {
				getFundProdNavTrendSucc(msg);
			}, function(err) {
				funFail(err);
			});
		}
		if ($('.netWorth-header div:eq(2)').hasClass('click')) { //历史净值查询
			var searchJson = {
				"b": [{
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"orgId.s": commonJson.orgId, //机构号
					"moduleId.s": citigoldJson.moduleID, //模块编号
					"tranId.s": citigoldJson.tranId, //交易编号
					"operatorNo.s": commonJson.adminCount, //操作员
					"deviceNo.s": commonJson.udId, //设备编号
					"PrdCode.s": citigoldJson.jjProInfo.PrdCode, //基金产品编码
					"pageNum.s": '1', //查询页码
					"pageSize.s": '', //每一页显示的记录数
					"startTime.s": '', //开始时间
					"endTime.s": '' //结束时间
				}]
			};
			showLoader('数据加载中...');
			goldInsJson.InsPg = 1;
			goldInsJson.searchJ = searchJson;
			getProductNavHistoryFun(searchJson, function(msg) {
				getProductNavHistorySucc(msg);
			}, function(err) {
				funFail(err);
			});
		}
	});
	//搜索按钮
	$('.worthSearch').on('click', function() {
		//获取搜索时间
		var startTime = $('.worthQuery input:eq(0)').val();
		var endTime = $('.worthQuery input:eq(1)').val();
		if (startTime == '' || endTime == '') {
			showTags({
				'title': '提示',
				'content': '请输入查询时间！',
				'ok': {}
			});
			return;
		}
		if (endTime < startTime) {
			showTags({
				'title': '提示',
				'content': '对不起，搜索开始时间应不大于搜索结束时间！',
				'ok': {}
			});
			return;
		}
		var searchJson = {
			"b": [{
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"orgId.s": commonJson.orgId, //机构号
				"moduleId.s": citigoldJson.moduleID, //模块编号
				"tranId.s": citigoldJson.tranId, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"PrdCode.s": citigoldJson.jjProInfo.PrdCode, //基金产品编码
				"pageNum.s": '1', //查询页码
				"pageSize.s": '', //每一页显示的记录数
				"startTime.s": startTime, //开始时间
				"endTime.s": endTime //结束时间
			}]
		};
		showLoader('数据加载中...');
		goldInsJson.InsPg = 1;
		goldInsJson.searchJ = searchJson;
		getProductNavHistoryFun(searchJson, function(msg) {
			getProductNavHistorySucc(msg);
		}, function(err) {
			funFail(err);
		});
	});

	//返回按钮
	$('.manual .btn-next').on('click', function() {
		if (citigoldJson.isGMorDT == 'GM') {
			$.mobile.changePage('citigold-confirmationSignatureTwo.html', {
				transition: "slide"
			});
		} else {
			$.mobile.changePage('citigold-confirmationSignature.html', {
				transition: "slide"
			});
		}
	});
	goldInsJson.myChart = echarts.init(document.getElementById('worthCanvas'));

});