/**
 * 丁宗花－移动CRM模块－2015-8-20
 */

//mobile-all页面  named by lei.
$(document).on("pageshow", '#mobile-all', function() {
	if (commonJson.crmUserId == '') {
		showTags({
			'title': '提示',
			'content': 'CRM客户号为空，不能进入！',
			'ok': {
				fun: function() {
					$.mobile.changePage('../main.html', {
						reverse: true
					});
				}
			}
		});
	} else {
		var search = window.location.search;
		var crmUrl = "";
		CRMAddress('', function(msg) {
			crmUrl = msg + "crm/login.do";
			//alert(crmUrl);
			$('#mobile-all').append("<iframe name='crmFrame' width='100%' height='100%'></iframe>"

				+ "<form id='crmForm' action='" + crmUrl + "' target='crmFrame' method='post'>" + "		<input type='hidden' name='ownerId' value='UR" + commonJson.crmUserId + "'/>" + "		<input type='hidden' name='userId' value='" + commonJson.adminCount + "'/>" + "</form>"
			);
			if (search != null && search != undefined && search != '') {
				var param = search.substr(1).split('&');
				for (var i = 0; i < param.length; i++) {
					var params = param[i].split('=');
					$("#crmForm").append("<input type='hidden' name='" + params[0] + "' value='" + params[1] + "'>");
				}
			}
			$("#crmForm").submit();
//			$("#crmForm").remove();

		})
	}
});
//mobile-one页面
$(document).on("pageshow", '#mobile-one', function() {
	//为每一条数据添加class=‘click'
	$(".box-rows").bind("click", this, function() {
		console.log(this.className);
		if ($(this).hasClass('click')) {
			$(this).removeClass('click');
			$('#foot-mobile').removeClass('btn_next');
		} else {
			//遍历每一条数据恢复初始状态
			$('.box-rows').each(function() {
				//console.log(this);
				if ($(this).hasClass('click')) {
					$(this).removeClass('click');
					$('#foot-mobile').removeClass('btn_next');
				}
			});
			$(this).addClass('click');
			$('#foot-mobile').addClass('btn_next');
		}

	});
});


//mobile-two页面
$(document).on("pageshow", '#mobile-two', function() {
	//点击内容显示隐藏
	$('#wq').on('change', function() {
		var wq = $('#wq').val();
		if (wq == "读卡器读取身份证号码") {
			//$(".mobile-two-choose ul")
			$(".mobile-two-choose ul").eq(0).show().siblings("ul").hide();
		} else if (wq == "手工输入证件号码") {
			$(".mobile-two-choose ul").eq(1).show().siblings("ul").hide();
		} else if (wq == "账号查询") {
			$(".mobile-two-choose ul").eq(2).show().siblings("ul").hide();
		} else if (wq == "姓名&手机号码查询") {
			$(".mobile-two-choose ul").eq(3).show().siblings("ul").hide();
		}
	});


});

//mobile-three页面
$(document).on("pageshow", '#mobile-three', function() {
	//点击重新查询，跳转页面
	$('#requeried-three').on('tap', function() {
		$.mobile.changePage('mobile-two.html', {
			reverse: true
		});
	});
});
//刷身份证
//Meap.readCard('', function(msg) {
//	alert(msg);
//}, function(err) {
//	alert(err);
//});
var information = {
	mobFur_index: ''
};
//mobile-four页面
$(document).on("pageshow", '#mobile-four', function() {
	//左边导航
	$("#mobile-four .navigation>li").on("click", function() {
		var navigation = $('.navigation>li').index($(this));
		console.log(navigation);
		$(this).addClass("change-bg").siblings("li").removeClass("change-bg");
		$('.information-input .info-enter-item').eq(navigation).show().siblings('.information-input .info-enter-item').hide();
	});
	//左边导航
	$(".nav-info>li").on("click", function() {
		information.mobFur_index = $('.nav-info>li').index($(this));
		$.mobile.changePage('mobile-five.html', {
			reverse: true
		});
	});
	//业务办理弹窗
	//$(".business-process").bind("click", function() {
	//	$(".business-process-tc").show();
	//	$(".business-process-tc").bind("click", function() {
	//		$(".business-process-tc").hide();
	//	});
	//});
	//电话号码修改
	//$(".number-modify-click").bind("click", function() {
	//	$(".number-modification-bcxg").show().siblings(".number-modification-xiugai").hide();
	//});

	//资产分布图
	$(function() {
		// 基于准备好的dom，初始化echarts图表
		var myChart = echarts.init(document.getElementById('canvasDiv-pie'));

		var option = {
			//title:{
			//    text:'金融资产分布图',
			//    x:'center',
			//},
			color: [
				'#4A90e2', '#F5A623', '#50E3C2'
			],
			series: [{
				name: '访问来源',
				type: 'pie',
				radius: '100%',
				center: ['35%', '50%'],
				data: [{
					value: 22,
					name: '基金'
				}, {
					value: 48,
					name: '理财'

				}, {
					value: 30,
					name: '存款'
				}],
				itemStyle: {
					normal: {
						label: {
							position: 'inner',
							formatter: function(a) {
								return a.value + '%';
							},
							textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
								color: '#ffffff',
								fontSize: 50,
								fontWeight: 100,
								fontFamily: "helvetica neue"
							}
						},
						labelLine: {
							show: false
						}
					}
				}
			}]
		};


		// 为echarts对象加载数据
		myChart.setOption(option);

		function canvasDivLineInit() {
			if (!canvasDivLine) {
				var canvasDivLine = echarts.init(document.getElementById('my-canvas-two'));
				var dataT = ['普通会员', '白金会员', '黄金会员', '钻石会员', '超级会员'];
				optionL = {
					title: {
						text: '最近12个月等级变化趋势图',
						x: 'center'
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
					}],
					yAxis: [{
						type: 'value',
						//max:4,
						//axisLine : {onZero: false},
						axisLabel: {
							formatter: function(value) {
								if (value > '4') {
									return dataT[4];
								} else if (value > '0' && value <= '4') {
									return dataT[value];
								} else {
									return;
								}
							}
						},
						boundaryGap: false
					}],
					series: [{
						data: [1, 2, 1, 3, 1, 2, 3, 4, 1, 2, 3, 4],
						type: 'line',
						smooth: false,
						itemStyle: {
							normal: {
								lineStyle: {
									color: '#0F45A7',
									shadowColor: '#0F45A7'
								}
							}
						}

					}]
				};
				canvasDivLine.setOption(optionL);
			}

		}
		$(".fenbutu-zichan>li").on("click", function() {
			var zichanfenbutuThis = $(".fenbutu-zichan>li").index($(this));
			$(this).addClass("bgcolorLi").siblings("li").removeClass("bgcolorLi");
			$(".zichanfenbutu-shuliang").eq(zichanfenbutuThis).addClass("basic-information-change").siblings(".zichanfenbutu-shuliang").removeClass("basic-information-change");
			//	$(".zichanfenbutu-shuliang").eq(zichanfenbutuThis).addClass("basic-information-change").siblings(".zichanfenbutu-shuliang").removeClass("basic-information-change");
			canvasDivLineInit();
		});
	});
	//	$(".zhichanfenbut").unbind().on("click",function(){
	//		$(this).addClass("bgcolorLi").siblings("li").removeClass("bgcolorLi");
	//		$(".zichanfenbutu-shuliang-one").show();
	//		$(".zichanfenbutu-shuliang-two").hide();
	//	});
	//	$(".dengjibianhuaqushitu").unbind().on("click",function(){
	//		$(this).addClass("bgcolorLi").siblings("li").removeClass("bgcolorLi");
	//		$(".zichanfenbutu-shuliang-one").hide();
	//		$(".zichanfenbutu-shuliang-two").show();
	//	});




	$(".jibenxinxi-ke>div").on("click", function() { //基本信息导航切换
		var jibenxinxiThis = $(".jibenxinxi-ke>div").index($(this));
		$(this).addClass("jibenxinxi-bgcolor").siblings("div").removeClass("jibenxinxi-bgcolor");
		$(".basic-information").eq(jibenxinxiThis).addClass("basic-information-change").siblings(".basic-information").removeClass("basic-information-change");
	});
	$(".hor-box-rows>div , .hor-kuang").unbind().on("tap", function() { //喜好多选打勾
		if ($(this).find(".hor-img").css("display") == 'none') {
			$(this).find(".hor-img").show();
		} else {
			$(this).find(".hor-img").hide();
		};

	});

	$(".xiugai-xiugai").on("click", function() { //点击其他补充信息中的修改按钮
		$(".quxiao-baocun-con").show();
		$(this).hide();
		$(".jibenxinxi-conn .mobile-input-crm").addClass("mobile-input-bgcrm");
		$("#mobile-four .jibenxinxi-conn>div").addClass("bgcolorChangebg");
		$(".jibenxinxi-conn .mobile-input-crm").removeAttr("readonly");
	});
	$(".quxiao-quxiao").on("click", function() { //点击取消按钮
		$(".quxiao-baocun-con").hide();
		$(".xiugai-xiugai").show();
		$(".jibenxinxi-conn .mobile-input-crm").removeClass("mobile-input-bgcrm");
		$("#mobile-four .jibenxinxi-conn>div").removeClass("bgcolorChangebg");
		$(".jibenxinxi-conn .mobile-input-crm").attr("readonly", "readonly");

	});


	//录入客户意见
	$(".customer-opinions").bind("click", function() {
		$(".opinions-demand-text").show().siblings(".info-enter-item").hide();
	});
});
//mobile-five页面
$(document).on("pageshow", '#mobile-five', function() {
	$('#mobile-five .navigation>li').eq(information.mobFur_index).addClass("change-bg");
	$('.information-input .info-enter-item').eq(information.mobFur_index).show().siblings('.information-input .info-enter-item').hide();
	//左边导航
	$(".navigation>li").on("click", function() {
		var navigation = $('.navigation>li').index($(this));
		console.log(navigation);
		$(this).addClass("change-bg").siblings("li").removeClass("change-bg");
		$('.information-input .info-enter-item').eq(navigation).show().siblings('.information-input .info-enter-item').hide();
	});
	//保存
	$('#mobile-five .btn-save').on('tap', function() {
		//$('#mobile-five .info-que').css('display','block');
		//$('#mobile-five .info-xiu').css('display','none');
	});
	//重置
	$('#mobile-five .btn-re').on('tap', function() {
		//$('#mobile-five .info-que').css('display','none');
		//$('#mobile-five .info-xiu').css('display','block');
	});
	//业务办理弹窗
	//$(".business-process").bind("click", function() {
	//	$(".business-process-tc").show();
	//	$(".business-process-tc").bind("click", function() {
	//		$(".business-process-tc").hide();
	//	});
	//});
});
//CRNM提醒
$(document).on("pageshow", '#mobile-CRMRemindOne', function() {
	$(".RemindOne-con>li").on("tap", function() { //点击变色
		var _index = $(".RemindOne-con>li").index($(this));
		$(this).addClass("RemindOne-change").siblings("li").removeClass("RemindOne-change");
		$(".conter-auto>ul").eq(_index).show().siblings("ul").hide();
	});
	$(".tixing-con>li").on("tap", function() {
		$(this).addClass("tixing-zoushitu-bgcolor").siblings("li").removeClass("tixing-zoushitu-bgcolor");
		$(".foot-mobile").addClass("btn_next");
	});
});
//CRNM提醒Two
$(document).on("pageshow", '#mobile-CRMRemindTwo', function() {
	$(".RemindOne-con>li").on("tap", function() { //点击变色
		var _index = $(".RemindOne-con>li").index($(this));
		$(this).addClass("RemindOne-change").siblings("li").removeClass("RemindOne-change");
		$(".conter-auto>ul").eq(_index).show().siblings("ul").hide();
	});
	$(".tixing-con>li").on("tap", function() {
		$(this).addClass("tixing-zoushitu-bgcolor").siblings("li").removeClass("tixing-zoushitu-bgcolor");
		$(".foot-mobile").addClass("btn_next");
	});
});
//CRNM提醒Three
$(document).on("pageshow", '#mobile-CRMRemindThree', function() {
	$(".RemindOne-con>li").on("tap", function() { //点击变色
		var _index = $(".RemindOne-con>li").index($(this));
		$(this).addClass("RemindOne-change").siblings("li").removeClass("RemindOne-change");
		$(".conter-auto>ul").eq(_index).show().siblings("ul").hide();
	});
	$(".tixing-con>li").on("tap", function() {
		$(this).addClass("tixing-zoushitu-bgcolor").siblings("li").removeClass("tixing-zoushitu-bgcolor");
		$(".foot-mobile").addClass("btn_next");
	});
});
//CRNM提醒Four
$(document).on("pageshow", '#mobile-CRMRemindFour', function() {
	$(".RemindOne-con>li").on("tap", function() { //点击变色
		var _index = $(".RemindOne-con>li").index($(this));
		$(this).addClass("RemindOne-change").siblings("li").removeClass("RemindOne-change");
		$(".conter-auto>ul").eq(_index).show().siblings("ul").hide();
	});
	$(".tixing-con>li").on("tap", function() {
		$(this).addClass("tixing-zoushitu-bgcolor").siblings("li").removeClass("tixing-zoushitu-bgcolor");
		$(".foot-mobile").addClass("btn_next");
	});
});
//CRNM提醒Five
$(document).on("pageshow", '#mobile-CRMRemindFive', function() {
	$(".RemindOne-con>li").on("tap", function() { //点击变色
		var _index = $(".RemindOne-con>li").index($(this));
		$(this).addClass("RemindOne-change").siblings("li").removeClass("RemindOne-change");
		$(".conter-auto>ul").eq(_index).show().siblings("ul").hide();
	});
	$(".tixing-con>li").on("tap", function() {
		$(this).addClass("tixing-zoushitu-bgcolor").siblings("li").removeClass("tixing-zoushitu-bgcolor");
		$(".foot-mobile").addClass("btn_next");
	});
});
//CRNM提醒Five
$(document).on("pageshow", '#mobile-CRMRemindSix', function() {
	$(".RemindOne-con>li").on("tap", function() { //点击变色
		var _index = $(".RemindOne-con>li").index($(this));
		$(this).addClass("RemindOne-change").siblings("li").removeClass("RemindOne-change");
		$(".conter-auto>ul").eq(_index).show().siblings("ul").hide();
	});
	$(".tixing-con>li").on("tap", function() {
		$(this).addClass("tixing-zoushitu-bgcolor").siblings("li").removeClass("tixing-zoushitu-bgcolor");
		$(".foot-mobile").addClass("btn_next");
	});
});
//CRNM提醒Five
$(document).on("pageshow", '#mobile-CRMRemindSeven', function() {
	$(".RemindOne-con>li").on("tap", function() { //点击变色
		var _index = $(".RemindOne-con>li").index($(this));
		$(this).addClass("RemindOne-change").siblings("li").removeClass("RemindOne-change");
		$(".conter-auto>ul").eq(_index).show().siblings("ul").hide();
	});
	$(".tixing-con>li").on("tap", function() {
		$(this).addClass("tixing-zoushitu-bgcolor").siblings("li").removeClass("tixing-zoushitu-bgcolor");
		$(".foot-mobile").addClass("btn_next");
	});
});
//CRM提醒Eight
$(document).on("pageshow", '#mobile-CRMRemindEight', function() {
	$(".hor-box-rows>div , .hor-kuang").unbind().on("tap", function() {
		if ($(this).find(".hor-img").css("display") == 'none') {
			$(this).find(".hor-img").show();
		} else {
			$(this).find(".hor-img").hide();
		};

	});
});
//创建潜在客户
$(document).on("pageshow", '#mobile-potentialCustomers', function() {
	$(".hor-box-rows>div , .hor-kuang").unbind().on("tap", function() {
		if ($(this).find(".hor-img").css("display") == 'none') {
			$(this).find(".hor-img").show();
		} else {
			$(this).find(".hor-img").hide();
		};

	});
});
//CRNM提醒Ten
$(document).on("pageshow", '#mobile-CRMRemindTen', function() {
	$(".RemindOne-con>li").on("tap", function() { //点击变色
		var _index = $(".RemindOne-con>li").index($(this));
		$(this).addClass("RemindOne-change").siblings("li").removeClass("RemindOne-change");
		$(".conter-auto>ul").eq(_index).show().siblings("ul").hide();
	});
	$(".tixing-con>li").on("tap", function() {
		$(this).addClass("tixing-zoushitu-bgcolor").siblings("li").removeClass("tixing-zoushitu-bgcolor");
		$(".foot-mobile").addClass("btn_next");
	});
});
//CRNM提醒Eleven
$(document).on("pageshow", '#mobile-CRMRemindEleven', function() {
	$(".RemindOne-con>li").on("tap", function() { //点击变色
		var _index = $(".RemindOne-con>li").index($(this));
		$(this).addClass("RemindOne-change").siblings("li").removeClass("RemindOne-change");
		$(".conter-auto>ul").eq(_index).show().siblings("ul").hide();
	});
	$(".tixing-con>li").on("tap", function() {
		$(this).addClass("tixing-zoushitu-bgcolor").siblings("li").removeClass("tixing-zoushitu-bgcolor");
		$(".foot-mobile").addClass("btn_next");
	});
});
//CRNM提醒Eleven
$(document).on("pageshow", '#mobile-CRMRemindTwelve', function() {
	$(".RemindOne-con>li").on("tap", function() { //点击变色
		var _index = $(".RemindOne-con>li").index($(this));
		$(this).addClass("RemindOne-change").siblings("li").removeClass("RemindOne-change");
		$(".conter-auto>ul").eq(_index).show().siblings("ul").hide();
	});
	$(".tixing-con>li").on("tap", function() {
		$(this).addClass("tixing-zoushitu-bgcolor").siblings("li").removeClass("tixing-zoushitu-bgcolor");
		$(".foot-mobile").addClass("btn_next");
	});
});

//CRNM客户服务2016-1-25日－丁宗花
$(document).on("pageshow", '#mobile-CRMServiceOne', function() {
	$("#Conditional_Search").on("click", function() {
		$(".service_tanchuang").show();
	});
	$("#fangqi_service").on("click", function() {
		$(".service_tanchuang").hide();
	});
	$('.tixing-zoushitu-bg').delegate('li', 'click', function() {

		if ($(this).hasClass('img-mobile-wei')) {
			//当有有这个类名的时候
			$(this).addClass('img-mobile-click');
			$(this).removeClass('img-mobile-wei');

		} else if ($(this).hasClass('img-mobile-click')) {
			$(this).removeClass('img-mobile-click');
			$(this).addClass('img-mobile-wei');

		} else {
			//没有的时候 
		}
	});


});
//CRNM客户服务2016-3-9日－丁宗花
$(document).on("pageshow", '#mobile-CRMNewService', function() {
	$(".service_kehu_anniu").on("click", function() {
		$("#seach-day-content").show();
	});
	$(".head-right").on("click", function() {
		$("#seach-day-content").hide();
		$("#mobile-CRMNewService .title_biaoti").hide();
		$("#mobile-CRMNewService .tixing-zoushitu-bg").hide();
		$("#mobile-CRMNewService .xuanzhong_back").hide();
	});
	$(".chaxun_click").on("click", function() {
		$("#mobile-CRMNewService .title_biaoti").show();
		$("#mobile-CRMNewService .tixing-zoushitu-bg").show();
		$("#mobile-CRMNewService .xuanzhong_back").show();
	});
	$(".xuanzhong_back").on("click", function() {
		$("#seach-day-content").hide();
		$("#mobile-CRMNewService .title_biaoti").hide();
		$("#mobile-CRMNewService .tixing-zoushitu-bg").hide();
		$("#mobile-CRMNewService .xuanzhong_back").hide();
	});
	$(".hor-box-rows>div , .hor-kuang").unbind().on("tap", function() { //喜好多选打勾
		if ($(this).find(".hor-img").css("display") == 'none') {
			$(this).find(".hor-img").show();
		} else {
			$(this).find(".hor-img").hide();
		};

	});
	$(".hor-box-rowss>div , .hor-kuang").unbind().on("tap", function() { //单选选打勾
		if ($(this).find(".hor-img").css("display") == 'none') {
			$(".hor-box-rowss .hor-img").hide();
			$(this).find(".hor-img").show();
		} else {
			$(this).find(".hor-img").hide();
		};

	});
	$('.tixing-zoushitu-bg').delegate('li', 'click', function() {

		if ($(this).hasClass('img-mobile-wei')) {
			//当有有这个类名的时候
			$(this).addClass('img-mobile-click');
			$(this).removeClass('img-mobile-wei');

		} else if ($(this).hasClass('img-mobile-click')) {
			$(this).removeClass('img-mobile-click');
			$(this).addClass('img-mobile-wei');

		} else {
			//没有的时候 
		}
	});
	var aa=$(".btnaf").html();
var bb=$(".btnbf").html();
var cc=$(".service_title_time").html();
	var a=$(".sheen_a").val();
	var b=$(".sheen_b").val();
	var c=$(".time_sheen").val();
	$(".btnaf").html(a);
	$(".btnbf").html(b);
	$(".sheen_c").hide();
	$(".service_title_time").html(c).css("border","none");
	for (var i=0;i<$(".hor-img").length;i++) {
		if ($(".hor-img").eq(i).attr("val")==0) {
		}else{
			if ($(".hor-img").eq(i).css("display")=="inline") {
	$(".hor-img").eq(i).parent().hide();
}else{
	$(".hor-img").eq(i).parent().siblings().css("color","#ccc").siblings().hide();
}
		}
}
$(".sheen_btn_b").click(function(){
	cc=$(".service_title_time").html();
	var a=$(".sheen_a").val();
	var b=$(".sheen_b").val();
	var c=$(".time_sheen").val();
	$(".btnaf").html(a);
	$(".btnbf").html(b);
	$(".sheen_c").hide();
	$(".service_title_time").html(c).css("border","none");
	for (var i=0;i<$(".hor-img").length;i++) {
		if ($(".hor-img").eq(i).attr("val")==0) {
		}else{
			if ($(".hor-img").eq(i).css("display")=="inline") {
	$(".hor-img").eq(i).parent().hide();
}else{
	$(".hor-img").eq(i).parent().siblings().css("color","#ccc").siblings().hide();
}
		}
}
})

$(".sheen_btn_c").click(function(){
	$(".btnaf").html(aa);
	$(".btnbf").html(bb);
	$(".service_title_time").html(cc).css("border","");
	$(".sheen_c").show();
	$(".hor-kuang").css("display","inline-block").siblings().css("color","");
})

});
