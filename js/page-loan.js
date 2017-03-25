/**
 * Created by lei on 1/8/16.
 */

/**
 * 人行征信系统
 */

/*个人征信读取身份证*/
function readCard(content, succCallback, errCallback) {
    showTags({
        'title': '提示',
        'content': content,
        'ok': {
            fun: function () {
                creditReadCard(succCallback, errCallback);
            }
        }
    });
}

$(document).on("pageshow", '#credit-search', function () {
    //初始化条件
    loan.isCreditCusInfoInput = true;
    loan.isBankCusInfoInput = true;
    loan.isCreditCusNo = false;
    loan.isCreditCusName = false;
    loan.isCreditAgree = false;
    loan.isCreditSign = false;
    loan.creditData = '';
    if(commonJson.losUserId == '' && commonJson.cipUserId == ''){
        showTags({
            'title': '提示',
            'content': 'LOS和征信用户不能同时为空，请联系支行管理员修改设置！',
            'ok': {
                fun: function () {
                    $.mobile.changePage('../main.html');
                }
            }
        });
        return;
    }
    showLoader('客户信息查询中...');
    var aboutJson = {      //发送请求的参数
        "b": [{
            "deviceNo.s": commonJson.udId, //设备编号
            "moduleId.s": loan.moduleId, //模块编号
            "tranId.s": loan.tranId1, //交易编号
            "orgId.s": commonJson.orgId,//机构号
            "operatorNo.s": commonJson.adminCount,//操作员
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "inquiryDateMin.s": dateYYYYMMDD(dateGetYMD(1)[0]),    //申请日期开始
            "inquiryDateMax.s": dateYYYYMMDD(dateGetYMD(1)[0]),      //申请日期结束
            "name.s": '', //姓名
            "certNum.s": '',  //证件号码
            "status.s": '',   //状态
            "page.s": '1' ,    //页码
            "username.s":commonJson.adminCount,
            'creditType.s': '',	//征信类型
	        'supplementInd.s': '' //是否允许补查
        }]
    };
    loan.ctbussinessDetailPg = 1;
    loan.ctbussinessDetail = aboutJson;
    //findCreditReportInquiryConF(aboutJson);
    findCreditReportInquiryFun(aboutJson, function (msg) {
        findCreditReportInquirySucc(msg);
    }, function (err) {
        funFail(err);
    });

    /*点击 click 删除征信*/
    $('.loan .footter div:first').on('click', function () {
        if (!$(this).hasClass('back-1')) {
            return;
        }
        showTags({
            'title': '提示',
            'content': '确认删除?',
            'cancel': {
                'title': '确认',
                fun: function () {
                    showLoader('客户信息删除中...');
                    var removeJson = {      //发送请求的参数
                        "b": [{
                            "deviceNo.s": commonJson.udId, //设备编号
                            "moduleId.s": loan.moduleId, //模块编号
                            "tranId.s": loan.tranId1, //交易编号
                            "orgId.s": commonJson.orgId,//机构号
                            "operatorNo.s": commonJson.adminCount,//操作员
                            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                            "workAddress.s": commonJson.workAddress,//工作地址
                            "seqNum.s": loan.creditInfo.seqNum,  //流水号
                            "userId.s": commonJson.adminCount   //工号
                        }]
                    };
                    delCreditReportInquiryFun(removeJson, function (msg) {
                        delCreditReportInquirySucc(msg);
                    }, function (err) {
                        funFail(err);
                    });
                }
            },
            'ok': {
                'title': '放弃',
                'fun': function () {
                }
            }
        });
    });

    /*点击click 查询详情*/
    $('.loan .footter div:last').on('click', function () {
        if (!$(this).hasClass('btn_next')) {
            return;
        }
        if (loan.lcStatus == '1' || loan.lcStatus == '3') {  //成功
        	openCreditReportFile(loan, 'F0005');
        } else if (loan.lcStatus == '-2') { //失败
            showTags({
                'title': '失败原因',
                'content': loan.creditErrRea,
                'ok': {}
            });
            //$.mobile.changePage('./credit-err.html', {
            //    transition: "slide"
            //});
        }
    });

    //按名字搜索----点击搜索图片
    $("#credit-search .seach_icon").on("click", function () {
        var cusName = $('#credit-search .head-seach-input').val();
        if (cusName == "" || !fmReg.cnName.test(cusName)) {
            showMsg(fmRegMsg.cnName);
            return;
        }
        showLoader('客户信息查询中...');
        var aboutJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId1, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "inquiryDateMin.s": dateYYYYMMDD(dateGetYMD(1)[0]),    //申请日期开始
                "inquiryDateMax.s": dateYYYYMMDD(dateGetYMD(1)[0]),      //申请日期结束
                "name.s": cusName, //姓名
                "certNum.s": '',  //证件号码
                "status.s": '',   //状态
                'page.s': '1',    //页码
                "username.s":commonJson.adminCount,
                'creditType.s': '',	//征信类型
	            'supplementInd.s': '' //是否允许补查
            }]
        };
        loan.ctbussinessDetailPg = 1;
        loan.ctbussinessDetail = aboutJson;
        findCreditReportInquiryFun(aboutJson, function (msg) {
            findCreditReportInquirySucc(msg);
        }, function (err) {
            funFail(err);
        });
    });
    //按名字搜索----点击键盘回车按钮
    $("#credit-search .head-seach-input:eq(0)").on("keydown", function (eve) {
        var cusName = $(this).val();
        if (cusName == "" || !fmReg.cnName.test(cusName)) {
            showMsg(fmRegMsg.cnName);
            return;
        }
        var keyCode = eve.keyCode;
        if (keyCode == '13') {
            showLoader('客户信息查询中...');
            var aboutJson = {      //发送请求的参数
                "b": [{
                    "deviceNo.s": commonJson.udId, //设备编号
                    "moduleId.s": loan.moduleId, //模块编号
                    "tranId.s": loan.tranId1, //交易编号
                    "orgId.s": commonJson.orgId,//机构号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "inquiryDateMin.s": dateYYYYMMDD(dateGetYMD(1)[0]),    //申请日期开始
                    "inquiryDateMax.s": dateYYYYMMDD(dateGetYMD(1)[0]),      //申请日期结束
                    "name.s": cusName, //姓名
                    "certNum.s": '',  //证件号码
                    "status.s": '',   //状态
                    'page.s': '1',     //页码
                    "username.s":commonJson.adminCount,
	                'creditType.s': '',	//征信类型
	                'supplementInd.s': '' //是否允许补查
                }]
            };
            loan.ctbussinessDetailPg = 1;
            loan.ctbussinessDetail = aboutJson;
            findCreditReportInquiryFun(aboutJson, function (msg) {
                findCreditReportInquirySucc(msg);
            }, function (err) {
                funFail(err);
            });
        }
    });
    //点击搜索
    $("#credit-search #searchBtn").on("click", function () {
        $("#credit-search #seach-day input[type='date']:first").val(dateGetYMD(30)[1]);
        $("#credit-search #seach-day input[type='date']:last").val(dateGetYMD(30)[0]);
        $("#seach-day-con").show();
    });
    //点击新查询
    $("#credit-search #newQueryBtn").on("click", function () {
        $.mobile.changePage('./credit-newSearch.html', {
            transition: "slide"
        });
    });
    //点击搜索中的放弃按钮
    $("#credit-search .fangqi-seach:first").on('click', function () {
        $("#seach-day-con").hide();
    });
    //点击搜索中得查询按钮
    $("#credit-search .fangqi-seach:last").on('click', function () {
        //查询时间
        var sT = $("#credit-search #seach-day input[type='date']:first").val();
        var eT = $("#credit-search #seach-day input[type='date']:last").val();
        if (!sT || !eT) {
            showMsg('查询时间不能为空!');
            return;
        }
        if (myTime.DateToUnix(sT) > myTime.DateToUnix(eT)) {
            showMsg('起始日期不能大于终止日期!');
            return;
        }
        if ((myTime.DateToUnix(eT) - myTime.DateToUnix(sT)) > 2592000) {
            showMsg('起止日期不可超过30天!');
            return;
        }
        //客户姓名
        var cusName = $("#credit-search #seach-day input.input-test-con:eq(0)").val();
        //客户证件号码
        var cusNo = $("#credit-search #seach-day input.input-test-con:eq(1)").val();
        if (cusName != "" && !fmReg.cnName.test(cusName)) {
            showMsg(fmRegMsg.cnName);
            return;
        }
        if (cusNo != "" && !fmReg.cerNo.test(cusNo)) {
            showMsg('请输入正确的证件号码!');
            return;
        }
        $("#seach-day-con").hide();
        showLoader('客户信息查询中...');
        var aboutJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId1, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "inquiryDateMin.s": dateYYYYMMDD(sT),    //申请日期开始
                "inquiryDateMax.s": dateYYYYMMDD(eT),      //申请日期结束
                "name.s": cusName, //姓名
                "certNum.s": cusNo,  //证件号码
                "status.s": $('#searchStatusSelect').val(),   //状态
                'page.s': '1',    //页码
                "username.s": '',
                'creditType.s': $('#creditTypeSelect').val(), //征信类型
                'supplementInd.s': $('#supplementIndSelect').val() //是否允许补查
            }]
        };
        loan.ctbussinessDetailPg = 1;
        loan.ctbussinessDetail = aboutJson;
        findCreditReportInquiryFun(aboutJson, function (msg) {
            findCreditReportInquirySucc(msg);
        }, function (err) {
            funFail(err);
        });
    });
    //点击补充查询
    $('#credit-search #supplementBtn').click(function(){
    	if($(this).hasClass('btn-unclick')){
            return;
        }
    	custermerInfo.name = loan.creditInfo.name;
    	custermerInfo.cerNO = loan.creditInfo.certNum;
    	$.mobile.changePage('./credit-newSearchConfirm.html');
    });
});
$(document).on("pageshow", '#credit-newSearch', function () {
    loan.isCreditCusInfoInput = false;
    loan.isCreditAgree = false; //个人征信新查询协议
    loan.isCreditSign = false;    //个人征信新查询签名
    loan.creditInfo.accredit = ''; //授权书文件路径
    loan.creditInfo.signature = ''; //签名文件路径

    //点击读取身份证
    $("#credit-newSearch .queryCardList:first").on('click', function () {
        $('.input-test-con:first').val('');
        $('.input-test-con:last').val('');
        $('#lc-agree-next').removeClass('btn_next');
        loan.isCreditCusInfoInput = false;
        creditReadCard(function () {
            hideLoader();
            $('.input-test-con:first').val(custermerInfo.cerNO);
            $('.input-test-con:last').val(custermerInfo.name);
            loan.isCreditCusInfoInput = true;
            if (loan.isCreditCusInfoInput && loan.isCreditAgree && loan.isCreditSign) {
                $('#lc-agree-next').addClass('btn_next');
            } else {
                $('#lc-agree-next').removeClass('btn_next');
            }
        }, function () {
            loan.isCreditCusInfoInput = false;
            $('#lc-agree-next').removeClass('btn_next');
            hideLoader();
        });
    });

    //协议
    var agreeBtn = document.getElementById('lc-agree-btn');
    agreeBtn.onclick = function () {
        var dis = $('#lc-agree-btn #ic-disagree').css('display');
        if (dis != 'none') {
            $('#ic-disagree').css('display', 'none');
            $('#ic-agree').css('display', 'inline-block');
            loan.isCreditAgree = true;
        }
        else {
            $('#ic-agree').css('display', 'none');
            $('#ic-disagree').css('display', 'inline-block');
            loan.isCreditAgree = false;
        }
        if (loan.isCreditCusInfoInput && loan.isCreditAgree && loan.isCreditSign) {
            $('#lc-agree-next').addClass('btn_next');
        } else {
            $('#lc-agree-next').removeClass('btn_next');
        }
    };
    //点击查询按钮
    $('#lc-agree-next').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        $.mobile.changePage('./credit-newSearchConfirm.html');
    });
    //点击放弃按钮
    $('#lc-agree-pre').on('click', function () {
        $.mobile.changePage('./credit-search.html', {reverse: true});
    });
    //初始化方法
    signature.init({
        div: $('#qianM'), //签名容器
        finishBtn: $("#qianOK"), //完成签名按钮
        clearBtn: $("#clear-botton"), //清除签名按钮
        lineColor: '#000000', //线条颜色
        lineWidth: 3, //线条粗细
        finish: function (data) { //签名完成回调函数
            if ($('#ic_disqian').is(':hidden')) {
                $('#ic_qian').hide();
                $('#ic_disqian').show();
                $("#dz-sign-over").remove();
                loan.isCreditSign = false;
                $('#lc-agree-next').removeClass('btn_next');
            } else {
                $('#ic_disqian').hide();
                $('#ic_qian').show();
                $('#credit-newSearch .video-qian .qian-box').css('position', 'relative');
                $('#credit-newSearch .video-qian .qian-box').append('<div id="dz-sign-over" style="position:absolute; top:0; right:0;left:0;bottom:0"></div>');
                loan.isCreditSign = true;
                if (loan.isCreditCusInfoInput && loan.isCreditAgree && loan.isCreditSign) {
                    $('#lc-agree-next').addClass('btn_next');
                } else {
                    $('#lc-agree-next').removeClass('btn_next');
                }
                //if (loan.isCreditCusInfoInput) {
                //    if (loan.isCreditCusNo && loan.isCreditCusName && loan.isCreditAgree && loan.isCreditSign) {
                //        $('#lc-agree-next').addClass('btn_next');
                //    } else {
                //        $('#lc-agree-next').removeClass('btn_next');
                //    }
                //} else {
                //    if (loan.isCreditAgree && loan.isCreditSign) {
                //        $('#lc-agree-next').addClass('btn_next');
                //    } else {
                //        $('#lc-agree-next').removeClass('btn_next');
                //    }
                //}
                loan.creditData = data.replace('data:image/png;base64,', '')
            }
        }
    });
});

//初始化行政区划代码选项
function initAreaCode(){
	if(window.localStorage.areaCode){
		var areaCode = JSON.parse(window.localStorage.areaCode);
		$.each(areaCode, function(index, data) {
			var sdics = data.sdic[1].sdics;
			data = data.sdic[0];
			$('#province').append($('<option>').val(data.enName).html(data.cnName).data('sdics', sdics));
		});
		$('#province').on('change', function(){
			$('#city').empty();
			$.each($(this).children(':selected').data('sdics'), function(index, data) {
				data = data.sdic[0];
				$('#city').append($('<option>').val(data.enName).html(data.cnName));
			});
			$('#city').selectmenu("refresh", true);
		});
	} else {
		getAreaCode();
	}
}

$(document).on("pageshow", '#credit-newSearchConfirm', function () {
	if(commonJson.cipUserId){
		$('#noticeInd').attr('checked', false);
		$('#noticeContext').hide();
		initAreaCode();
	} else {
		getNoticeCreditUser();
	}
	$('#custName').val(custermerInfo.name);
    $('#cardNum').val(custermerInfo.cerNO);
    for(var year = myTime.curDate().getFullYear(); year > myTime.curDate().getFullYear() - 11; year--){
    	$('#startTime').append($('<option>').val(year).html(year));
    }
    $('input:radio').change(function(){
    	$('input[name^="subReport"]:disabled').prop('disabled', false);
    	$('input[name^="subReport"]:checked, #allSelect').prop('checked', false);
    	if($(this).val() == '90014'){
    		$('#11000, #20203, #10801, #90006').prop('checked', true).prop('disabled', true);
    	}
    	$('input[name^="subReport"]').change();
    });
    $('#allSelect').change(function(){
    	if($(this).is(':checked')){
    		$('input[name^="subReport"]:not(:checked)').prop('checked', true);
    	} else {
    		$('input[name^="subReport"]:checked:not(:disabled)').prop('checked', false);
    	}
    	$('input[name^="subReport"]').change();
    });
    $('#credit-newSearchConfirm').on('change', 'input[name^="subReport"][name!="subReport"]', function(){
    	if($(this).is(':checked')){
    		$(this).parent().nextAll('div.input-rows').not('#graduatedSchoolDiv').show();
    		if(this.id == '11104'){
    			$('#graduatedTime').change();
    		}
    	} else {
    		$(this).parent().nextAll('div.input-rows').hide();
    	}
    });
    $('#creditStretchBtn').click(function(){
    	$(this).toggleClass('stretch-bottom').toggleClass('stretch-top');
    	$('#pyCreditTitle').toggleClass('search-title-2');
    	$('#pyCreditBox').slideToggle('fast');
    });
    $('#pySearchInd').change(function(){
    	if($(this).is(':checked')){
    		$('#creditStretchBtn').removeClass('stretch-bottom').addClass('stretch-top');
	    	$('#pyCreditTitle').addClass('search-title-2');
	    	$('#pyCreditBox').slideDown('fast');
    	} else {
    		$('#creditStretchBtn').addClass('stretch-bottom').removeClass('stretch-top');
	    	$('#pyCreditTitle').removeClass('search-title-2');
	    	$('#pyCreditBox').slideUp('fast');
    	}
    });
    $('#noticeStretchBtn').click(function(){
    	$(this).toggleClass('stretch-bottom').toggleClass('stretch-top');
    	$('#noticeTitle').toggleClass('search-title-2');
    	$('#noticeBox').slideToggle('fast');
    });
    $('#noticeInd').change(function(){
    	if($(this).is(':checked')){
    		$('#noticeStretchBtn').removeClass('stretch-bottom').addClass('stretch-top');
	    	$('#noticeTitle').addClass('search-title-2');
	    	$('#noticeBox').slideDown('fast');
    	} else {
    		$('#noticeStretchBtn').addClass('stretch-bottom').removeClass('stretch-top');
	    	$('#noticeTitle').removeClass('search-title-2');
	    	$('#noticeBox').slideUp('fast');
    	}
    });
    $('#graduatedTime').change(function(){
    	if(this.value != '' && this.value != '2003'){
    		$('#graduatedCertCodeDiv').show();
    		$('#graduatedSchoolDiv').show();
    	} else {
			$('#graduatedCertCodeDiv').hide();
			$('#graduatedSchoolDiv').hide();
			$('#graduatedCertCode').val('');
            $('#graduatedSchool').val('');
    	}
    });
    var subReportType = '';
    var noticeUser = '';
    $('#searchBtn').click(function(){
    	if(!$('#rhSearchInd').is(':checked') && !$('#pySearchInd').is(':checked')){
    		showTags({
				'title': '提示',
				'content': "请勾选征信查询类型！",
				'ok': {}
			});
    		return;
    	}
    	if($('#pySearchInd').is(':checked')){
	    	if($('input[name="reportType"]:checked').length != 1){
	    		showTags({
					'title': '提示',
					'content': "请选择鹏元征信报告类型！",
					'ok': {}
				});
	    		return;
	    	}
//	    	if($('input[name^="subReport"]:checked').length < 1){
//	    		showTags({
//					'title': '提示',
//					'content': "请选择鹏元征信子报告类型！",
//					'ok': {}
//				});
//	    		return;
//	    	}
	    	if($('#11104').is(':checked')){
	    		if($('#graduatedTime').val() == ''){
	    			showTags({
						'title': '提示',
						'content': "请选择毕业时间！",
						'ok': {}
					});
		    		return;
		    	}
	    		if($('#graduatedCertCodeDiv').is(':visible') && $('#graduatedCertCode').val() == ''){
	    			showTags({
						'title': '提示',
						'content': "请输入毕业毕业证编号！",
						'ok': {}
					});
		    		return;
	    		}
	    	}
	    	if($('#11109').is(':checked')){
	    		if($('#startTime').val() == ''){
	    			showTags({
						'title': '提示',
						'content': "请选择入学年份！",
						'ok': {}
					});
		    		return;
		    	}
	    		if($('#institutions').val() == ''){
	    			showTags({
						'title': '提示',
						'content': "请输入所在院校！",
						'ok': {}
					});
		    		return;
		    	}
	    		if($('#academicLevel').val() == ''){
	    			showTags({
						'title': '提示',
						'content': "请选择学历层级！",
						'ok': {}
					});
		    		return;
		    	}
	    	}
	    	if($('#13400').is(':checked')){
	    		if($('#province').val() == '' || $('#city').val() == ''){
	    			showTags({
						'title': '提示',
						'content': "请选择个人职业资格信息！",
						'ok': {}
					});
		    		return;
		    	}
	    	}
	    	subReportType = '';
	    	$.each($('input[name="subReport"]:checked'), function() {
	    		subReportType += (subReportType == ''? '' : ',') + this.id;
	    	});
	    	$.each($('input[name^="subReport"][name!="subReport"][name!="subReport5"]:checked'), function() {
	    		subReportType += (subReportType == ''? '' : '|') + this.id;
	    	});
	    	$.each($('input[name="subReport5"]:checked'), function(i, d) {
	    		if(i == 0 && subReportType != ''){
	    			subReportType += '|' + this.id;;
	    		} else {
	    			subReportType += (subReportType == ''? '' : ',') + this.id;
	    		}
	    	});
	    	if(subReportType != '' && $('#90008').is(':checked')){
	    		subReportType = '|' + subReportType;
	    	}
    	}
    	if($('#noticeInd:visible').is(':checked')){
    		noticeUser = $('#noticeUser').val();
    		if(noticeUser == ''){
    			showTags({
					'title': '提示',
					'content': "征信查询人员不可为空！",
					'ok': {}
				});
    			return;
    		}
    	}
    	showConfirmBox();
    });
    function showConfirmBox(){
    	$('.conter-auto').css('overflow-y', 'hidden');
    	$('#creditConfirmBox div[id$=C]').hide();
    	$('#creditConfirmBox div[id$=S]').hide();
    	if($('#pySearchInd').is(':checked')){
    		$('#pyConfirmContext').show();
    		$('#reportTypeC').show().children('textarea').val($('input:radio:checked').parent().text());
    		if($('input[name^="subReport"]:checked').length > 0){
    			$('#subReportTypeC').show();
    		}
    	} else {
    		$('#pyConfirmContext').hide();
    	}
    	$.each($('.newSearch input:checked'), function(index, ele) {
    		$('#' + ele.id + 'C').show();
    	});
    	$.each($('.newSearch input:text:visible'), function(index, ele) {
    		$('#' + ele.id + 'S').show().children('textarea').val(ele.value);
    	});
    	$.each($('.newSearch select:visible'), function(index, ele) {
    		$('#' + ele.id + 'S').show().children('textarea').val(ele.options[ele.options.selectedIndex].innerHTML);
    	});
    	if(!$('#noticeInd').is(':checked')){
    		$('#noticeUserS').hide();
    	}
    	$('#creditConfirmBox').show();
    }
    $('#confirmCloseBtn').click(function(){
    	$('.conter-auto').css('overflow-y', 'auto');
    	$('#creditConfirmBox').hide();
    });
    $('#confirmOkBtn').click(function(){
    	$('#confirmCloseBtn').click();
    	creditReportQuery({      //发送请求的参数
            "b": [{
                'deviceNo.s': commonJson.udId, //设备编号
                'moduleId.s': loan.moduleId, //模块编号
                'tranId.s': loan.tranId1, //交易编号
                'orgId.s': commonJson.orgId,//机构号
                'operatorNo.s': commonJson.adminCount,//操作员
                'offlineOnline.s': commonJson.offlineOnline,//脱机/联机
                'workAddress.s': commonJson.workAddress,//工作地址
                'userName.s': commonJson.TLRNAME, //操作员姓名
                'mobilePhone.s': commonJson.TLRCELLPHONE, //操作员电话
                'ACCT_NAME.s': custermerInfo.name, //姓名
                'CERT_TYP.s': '0', //证件类型
                'CERT_NO.s': custermerInfo.cerNO, //证件号码
                'RTRN_RSN.s': $('#queryReasonSelect').val(), //查询原因
                'AU_EMPLOY_ID.s': commonJson.cipUserId, //征信用户
                'BK_BRCH_NO.s': commonJson.superOrgId, //登录机构
                'FEE_TYP.s': $('#queryTypeSelect').val(), //查询方式
                'FAV_VALID.s': ($('#queryTypeSelect').val() == '2'? '' : '30'), //本地征信数据有效期
                'ACCT_LTD.s': $('input[name="reportType"]:checked').val(), //报告类型
                'carNumber.s': $('#carNumber').val(), //车牌号码
                'graduatedTime.s': $('#graduatedTime').val(), //毕业年份
                'graduatedCode.s': $('#graduatedCertCode').val(), //毕业证编号
                'graduatedSchool.s': $('#graduatedSchool').val(), //毕业院校
                'institutions.s': $('#institutions').val(), //所在院校
                'startTime.s': $('#startTime').val(), //入学年份
                'academicLevel.s': $('#academicLevel').val(), //学历层次
                'areaCode.s': $('#city').val(), //城市
                'subReportType.s': subReportType, //子报告类型
                'DISTIBUTE_FLAG.s': '', //分发标识
                'REF_ID.s': '', //引用id
                'RETURNSTYLE.s': 'xml;html;pdfsingle', //返回内容格式
                'rhSearchInd.s': ($('#rhSearchInd').is(':checked')? '1' : '0'), //是否查询人行征信
                'pySearchInd.s': ($('#pySearchInd').is(':checked')? '1' : '0'), //是否查询鹏元征信
                'accredit.s': loan.creditInfo.accredit, //授权书文件路径
                'signPath.s': loan.creditInfo.signature, //签名文件路径
                'signature.s': loan.creditData, //签名base64数据
                'noticeUser.s': commonJson.losUserId, //录入用户
                'noticePhone.s': $('#noticeUser').val() //短信通知征信查询人员电话
            }]
        });
    });
});
$(document).on("pageshow", '#loan-err', function () {
    var textHtml;
    if (loan.isCreaditorBank) {  //个人征信
        textHtml = '<a href="../main.html" class="head-all head-left" data-direction="reverse">首页</a>' +
            '人行征信系统' +
            '<a href="./credit-search.html" class="head-all head-right" data-direction="reverse">退出</a>';
        $('#loan-err .header').html(textHtml);
    } else {
        textHtml = '<a href="../main.html" class="head-all head-left" data-direction="reverse">首页</a>' +
            '银行对账单' +
            '<a href="./bank-bill.html" class="head-all head-right" data-direction="reverse">退出</a>';
        $('#loan-err .header').html(textHtml);
    }
    $('#loan-err .err-reason div:last').html(loan.creditErrRea);
});
$(document).on("pageshow", '#credit-file', function () {
    var textHtml;
    if (loan.isCreaditorBank) {  //个人征信
        textHtml = '<a href="../main.html" class="head-all head-left" data-direction="reverse">首页</a>' +
            '人行征信系统' +
            '<a href="./credit-search.html" class="head-all head-right" data-direction="reverse">退出</a>';
        $('#credit-file .header').html(textHtml);
    } else {
        textHtml = '<a href="../main.html" class="head-all head-left" data-direction="reverse">首页</a>' +
            '银行对账单' +
            '<a href="./bank-bill.html" class="head-all head-right" data-direction="reverse">退出</a>';
        $('#credit-file .header').html(textHtml);
    }
    showLoader('文件获取中...');
    var oFrm = document.getElementById('ifrm');
    oFrm.src = loan.creditReferPath;
    oFrm.onload = oFrm.onreadystatechange = function () {
        if (this.readyState && this.readyState != 'complete') return;
        else {
            hideLoader();
        }
    };
});
/**
 * 银行对账单
 */
$(document).on("pageshow", '#bank-bill', function () {
    loan.xTel = '';
    showLoader('客户信息查询中...');
    var searchJson = {      //发送请求的参数
        "b": [{
            "deviceNo.s": commonJson.udId, //设备编号
            "moduleId.s": loan.moduleId, //模块编号
            "tranId.s": loan.tranId2, //交易编号
            "orgId.s": commonJson.orgId,//机构号
            "operatorNo.s": commonJson.adminCount,//操作员
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "inquiryDateMin.s": dateYYYYMMDD(dateGetYMD(1)[0]),  //查询日期时间
            "inquiryDateMax.s": dateYYYYMMDD(dateGetYMD(1)[0]),   //查询日期时间
            "name.s": '',//姓名
            "certNum.s": '',//证件号码
            "account.s": '',//账号
            "status.s": '',//状态
            "page.s": '1'//页码
        }]
    };
    loan.ctbussinessDetailPg = 1;
    loan.ctbussinessDetail = searchJson;
    findStatementFun(searchJson, function (msg) {
        findStatementSucc(msg);
    }, function (err) {
        funFail(err);
    });
    //按名字搜索----点击搜索图片
    $("#bank-bill .seach_icon").on("click", function () {
        var cusName = $('#bank-bill .head-seach-input').val();
        if (cusName == "" || !fmReg.cnName.test(cusName)) {
            showMsg(fmRegMsg.cnName);
            return;
        }
        showLoader('客户信息查询中...');
        var searchJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId2, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "inquiryDateMin.s": dateYYYYMMDD(dateGetYMD(1)[0]),  //查询日期时间
                "inquiryDateMax.s": dateYYYYMMDD(dateGetYMD(1)[0]),   //查询日期时间
                "name.s": cusName,//姓名
                "certNum.s": '',//证件号码
                "account.s": '',//账号
                "status.s": '',//状态
                "page.s": '1'//页码
            }]
        };
        loan.ctbussinessDetailPg = 1;
        loan.ctbussinessDetail = searchJson;
        findStatementFun(searchJson, function (msg) {
            findStatementSucc(msg);
        }, function (err) {
            funFail(err);
        });
    });
    //按名字搜索----点击键盘回车
    $("#bank-bill .head-seach-input").on("keydown", function (eve) {
        var keyCode = eve.keyCode;
        if (keyCode == '13') {
            var cusName = $('#bank-bill .head-seach-input').val();
            if (cusName == "" || !fmReg.cnName.test(cusName)) {
                showMsg(fmRegMsg.cnName);
                return;
            }
            showLoader('客户信息查询中...');
            var searchJson = {      //发送请求的参数
                "b": [{
                    "deviceNo.s": commonJson.udId, //设备编号
                    "moduleId.s": loan.moduleId, //模块编号
                    "tranId.s": loan.tranId2, //交易编号
                    "orgId.s": commonJson.orgId,//机构号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "inquiryDateMin.s": dateYYYYMMDD(dateGetYMD(1)[0]),  //查询日期时间
                    "inquiryDateMax.s": dateYYYYMMDD(dateGetYMD(1)[0]),   //查询日期时间
                    "name.s": cusName,//姓名
                    "certNum.s": '',//证件号码
                    "account.s": '',//账号
                    "status.s": '',//状态
                    "page.s": '1'//页码
                }]
            };
            loan.ctbussinessDetailPg = 1;
            loan.ctbussinessDetail = searchJson;
            findStatementFun(searchJson, function (msg) {
                findStatementSucc(msg);
            }, function (err) {
                funFail(err);
            });
        }

    });
    /*点击 click 删除对账单*/
    $('.loan .footter div:first').on('click', function () {
        if (!$(this).hasClass('back-1')) {
            return;
        }
        showTags({
            'title': '提示',
            'content': '确认删除?',
            'cancel': {
                'title': '确认',
                fun: function () {
                    showLoader('客户信息删除中...');
                    var removeJson = {      //发送请求的参数
                        "b": [{
                            "deviceNo.s": commonJson.udId, //设备编号
                            "moduleId.s": loan.moduleId, //模块编号
                            "tranId.s": loan.tranId2, //交易编号
                            "orgId.s": commonJson.orgId,//机构号
                            "operatorNo.s": commonJson.adminCount,//操作员
                            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                            "workAddress.s": commonJson.workAddress,//工作地址
                            "seqNum.s": $('#bank-bill .list-bgcolor').attr('lcseqNum'),//流水号
                            "userId.s": commonJson.adminCount//工号
                        }]
                    };
                    delStatementFun(removeJson, function (msg) {
                        delStatementSucc(msg);
                    }, function (err) {
                        funFail(err);
                    });
                }
            },
            'ok': {
                'title': '放弃',
                'fun': function () {
                }
            }
        });
        //showLoader('客户信息删除中...');
        //var removeJson = {      //发送请求的参数
        //    "b": [{
        //        "deviceNo.s": commonJson.udId, //设备编号
        //        "moduleId.s": loan.moduleId, //模块编号
        //        "tranId.s": '100',//loan.tranId, //交易编号
        //        "orgId.s": commonJson.orgId,//机构号
        //        "operatorNo.s": commonJson.adminCount,//操作员
        //        "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
        //        "workAddress.s": commonJson.workAddress,//工作地址
        //        "seqNum.s": $('#bank-bill .list-bgcolor').attr('lcseqNum'),//流水号
        //        "userId.s": commonJson.adminCount//工号
        //    }]
        //};
        //delStatementFun(removeJson, function (msg) {
        //    delStatementSucc(msg);
        //}, function (err) {
        //    funFail(err);
        //});

    });
    /*点击 click 查询详情*/
    $('.loan .footter div:last').on('click', function () {
        if (!$(this).hasClass('btn_next')) {
            return;
        }
        if (loan.lcStatus == '1') {  //成功
            getFileDataAndOpen(loan, 'F0010');
        } else if (loan.lcStatus == '-2') { //失败
            showTags({
                'title': '失败原因',
                'content': loan.creditErrRea,
                'ok': {}
            });
            //$.mobile.changePage('./credit-err.html', {
            //    transition: "slide"
            //});
        }
    });
    //点击搜索
    $("#bank-bill .seach-botton:first").on("click", function () {
        $("#bank-bill #seach-day input[type='date']:first").val(dateGetYMD(30)[1]);
        $("#bank-bill #seach-day input[type='date']:last").val(dateGetYMD(30)[0]);
        $("#seach-day-con").show();
    });
    //点击新查询
    $("#bank-bill .seach-botton:last").on("click", function () {
        $.mobile.changePage('./bank-newbill.html', {
            transition: "slide"
        });
    });
    //点击搜索中的放弃按钮
    $("#bank-bill .fangqi-seach:first").on('click', function () {
        $("#seach-day-con").hide();
    });
    //点击搜索中的查询按钮
    $("#bank-bill .fangqi-seach:last").on('click', function () {
        //查询时间
        var sT = $("#bank-bill #seach-day input[type='date']:first").val();
        var eT = $("#bank-bill #seach-day input[type='date']:last").val();
        if (!sT || !eT) {
            showMsg('查询时间不能为空!');
            return;
        }
        if (myTime.DateToUnix(sT) > myTime.DateToUnix(eT)) {
            showMsg('查询起始日期不能大于终止日期!');
            return;
        }
        if ((myTime.DateToUnix(eT) - myTime.DateToUnix(sT)) > 2592000) {
            showMsg('起止日期不可超过30天!');
            return;
        }
        //客户姓名
        var cusName = $("#bank-bill #seach-day input.input-test-con:eq(0)").val();
        //客户证件号码
        var cusNo = $("#bank-bill #seach-day input.input-test-con:eq(1)").val();
        if (cusName != "" && !fmReg.cnName.test(cusName)) {
            showMsg(fmRegMsg.cnName);
            return;
        }
        if (cusNo != "" && !fmReg.cerNo.test(cusNo)) {
            showMsg('请输入正确的证件号码!');
            return;
        }
        //客户姓名
        var account = $("#bank-bill #seach-day input.input-test-con:eq(2)").val();
        if (account != "" && !/^\d*$/.test(account)) {
            showMsg('请输入正确格式的收款卡号!');
            return false;
        }
        if (!/^\d{0,36}$/.test(account)) {
            showMsg('收款卡号长度不能大于36个字节!');
            return false;
        }
        $("#seach-day-con").hide();
        showLoader('客户信息查询中...');
        var searchJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId2, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "inquiryDateMin.s": dateYYYYMMDD(sT),  //查询日期时间
                "inquiryDateMax.s": dateYYYYMMDD(eT),   //查询日期时间
                "name.s": cusName,//姓名
                "certNum.s": cusNo,//证件号码
                "account.s": account,//账号
                "status.s": $('#bank-bill #seach-day .drop-down option:selected').val(),//状态
                "page.s": '1'//页码
            }]
        };
        loan.ctbussinessDetailPg = 1;
        loan.ctbussinessDetail = searchJson;
        findStatementFun(searchJson, function (msg) {
            findStatementSucc(msg);
        }, function (err) {
            funFail(err);
        });

    });
});
$(document).on("pageshow", '#bank-newBill', function () {
    loan.USER_NO = '';
    $('.header a:first').on('click', function () {
        if(loan.BTime){
            clearInterval(loan.BTime);
        }
        loan.getBankYZM = true;
        $.mobile.changePage('../main.html', {
            reverse: true
        });
    });
    $('.header a:last').on('click', function () {
        if(loan.BTime){
            clearInterval(loan.BTime);
        }
        loan.getBankYZM = true;
        $.mobile.changePage('./bank-bill.html', {
            reverse: true
        });
    });
    $("#bank-newBill input[type='date']:first").val(dateGetYMD(186)[1]);
    $("#bank-newBill input[type='date']:last").val(dateGetYMD(186)[0]);
    //点击切换按钮
    //$('#bank-newBill .two-col-option>div').on('click', function () {
    //    var optionIndex = $('.two-col-option>div').index($(this));
    //    if (optionIndex == '0') {
    //        loan.isBankCusInfoInput = true;
    //        $(this).addClass("option-select-left").siblings("div").removeClass("option-select-right");
    //        $('.input-test-con').removeAttr('disabled').val('');
    //        $('#lb-next').removeClass('btn_next');
    //        $('#c-com-property').removeAttr('disabled');
    //    } else {
    //        $(this).addClass("option-select-right").siblings("div").removeClass("option-select-left");
    //        $('.input-test-con').attr('disabled', 'disabled');
    //        $('#c-com-property').attr('disabled', 'disabled');
    //        readCard('点击确定,开始读取身份证!', function (msg) {
    //            hideLoader();
    //            $('.input-test-con:first').val(custermerInfo.cerNO);
    //            $('.input-test-con:last').val(custermerInfo.name);
    //            loan.isBankCusInfoInput = false;
    //        }, function (err) {
    //            loan.isBankCusInfoInput = true;
    //            $('#bank-newBill .two-col-option>div:eq(0)').addClass("option-select-left").siblings("div").removeClass("option-select-right");
    //            $('.input-test-con').removeAttr('disabled').val('');
    //            $('#lb-next').removeClass('btn_next');
    //            $('#c-com-property').removeAttr('disabled');
    //        });
    //    }
    //});
    //点击读取身份证
    $("#bank-newBill .queryCardList:first").on('click', function () {
        $('#bank-newBill input.input-test-con:eq(0)').val('');  //证件号码
        $('#bank-newBill input.input-test-con:eq(1)').val('');  //姓名
        $("#bank-newBill .queryCardList:last").removeClass('queryActive');
        $('#cardAccount').html('<option></option>').selectmenu('refresh', true);
        creditReadCard(function () {
            hideLoader();
            $('#bank-newBill input.input-test-con:eq(0)').val(custermerInfo.cerNO);  //证件号码
            $('#bank-newBill input.input-test-con:eq(1)').val(custermerInfo.name);  //姓名
            //  $('#cardAccount').html('<option></option>');
            $("#bank-newBill .queryCardList:last").addClass('queryActive');
        }, function () {
            hideLoader();
        });
    });

    //获取信息
    $("#bank-newBill .queryCardList:last").on('click', function () {
        if (!$(this).hasClass('queryActive')) {
            return
        }
        //var inputIndex = $('#bank-newBil input.input-test-con').index($(this));
        var cusNo = $('#bank-newBill input.input-test-con:eq(0)').val();
        var cusName = $('#bank-newBill input.input-test-con:eq(1)').val();
        //if (cusNo == "") {
        //    showMsg(fmRegMsg.cerNo);
        //    loan.isBankCusNo = false;
        //    return;
        //} else {
        //    loan.isBankCusNo = true;
        //}
        //if (cusName == "") {
        //    showMsg(fmRegMsg.cnName);
        //    loan.isBankCusName = false;
        //    return;
        //} else {
        //    loan.isBankCusName = true;
        //}
        showLoader("客户信息查询中...");
        var queryJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId2, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "CLIENT_TYPE.s": "P",//客户类型 N组织 P个人
                "CARD.s": "",//卡号
                "ACCT_NO.s": "",//账号
                "CLIEMT_NO.s": "",//客户号
                "DOC_TYPE.s": $('#c-com-property option:selected').val(),//证件类型
                "DOC_ID.s": $('#bank-newBill .input-test-con:eq(0)').val(),//证件号
                "CLIENT_SHORT.s": "",//简称
                "BIRTH_DATE.s": "",//出生日
                "CELL_PHONE.s": "",//手机
                "PHONE.s": "",//住宅电话
                "LEGAL_REP.s": "",//法人代表
                "REVERSE_FLAG.s": "D",//证件号内部检查标志 默认D
                "CARD_CATEGORY.s": '',//虚拟卡查核心标识 1
                "CHECK_BLACK.s":'false'//是否校验黑名单
            }]
        };
        icustomerInfoServiceFun(queryJson, function (msg) {
            icustomerInfoServiceBankSucc(msg);
        }, function (err) {
            funFail(err);
        });
        $("#getMsg").text('获取验证码');
        $('.duanX_con input#inp').val('');
        $("#lb-auth-time").text('80');
        loan.getBankYZM = true;
        $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
        clearInterval(loan.BTime);
        loan.BUSER_NO = '';
    });
    //获取短信验证码
    loan.BTime = null;
    $("#lb-auth-time").text('80');
    $('#bank-newBill #getMsg').on('click', function () {
        if (loan.xTel == '') {
            showMsg('请先点击获取卡账号列表!');
            return;
        }
        if (loan.getBankYZM == false) {
            $('#getMsg').removeClass('disMsg');
            return;
        }
        $('#inp').val('');
        loan.getBankYZM = false;
        $('#getMsg').removeClass('disMsg').addClass('disgua-btn');
        if (loan.BTime) {
            clearInterval(loan.BTime);
        }
        $("#lb-auth-time").text('80');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId2, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": loan.xTel, //手机号码'018232053662',//
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s": '' //人脸识别
            }]
        };
        showLoader('获取中...');
        imessageAuthentionServiceFun(sendJson, function (msg) {
            imessageAuthentionServiceBankSucc(msg, sendJson);
        }, function (err) {
            hideLoader();
            loan.getBankYZM = true;
            $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
            funFail(err);
        });
    });
    //点击查询按钮
    $('#lb-next').on('click', function () {
        var yzm = $('#bank-newBill #inp').val();
        if ($('#cardAccount option:selected').val() == '') {
            showMsg('请选择卡账号!');
            return;
        }
        var sT = $("#bank-newBill input[type='date']:first").val();
        var eT = $("#bank-newBill input[type='date']:last").val();
        if (!sT || !eT) {
            showMsg('起止日期不能为空!');
            return;
        }
        if(myTime.DateToUnix(eT) > myTime.DateToUnix(commonJson.loginTime.substr(0,10))){
            showMsg('终止日期不能大于当前日期');
            $("#bank-newBill input[type='date']:last").val(commonJson.loginTime.substr(0,10));
            return;
        }
        if (myTime.DateToUnix(sT) > myTime.DateToUnix(eT)) {
            showMsg('起始日期不能大于终止日期!');
            return;
        }
        if (loan.BUSER_NO == '') {
            showMsg('请点击获取短信验证码!');
            return;
        }
        if (!(fmReg.pwD6.test(yzm))) {
            showMsg('请输入正确格式的短信验证码！');
            return;
        }
        showLoader('短信验证码验证中...');
        if (loan.BTime) {
            clearInterval(loan.BTime);
        }
        $("#getMsg").text('重新获取');
        $("#lb-auth-time").text('0');
        loan.getBankYZM = true;
        $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
        //请求借口查询
        var checkJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId2, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "SUSER_ID.s": commonJson.orgId + commonJson.adminCount,//机构号+柜员号
                "USER_NO.s": loan.BUSER_NO, //用户唯一标识
                "EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
                "MSG_INFO.s": $('#bank-newBill #inp').val(), //动态口令debitEnter.MSG_INFO
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": loan.xTel, //手机号码 '018232053662',//
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s": '' //人脸识别
            }]
        };
        imessageAuthentionServiceYFun(checkJson, function (msg) {
            loan.BUSER_NO = "";
            imessageAuthentionServiceYBankNewSucc(msg);
        }, function (err) {
            loan.BUSER_NO = "";
            funFail(err);
        });
    });
});

/**
 * 进度查询
 */
$(document).on("pageshow", '#queryProcess', function () {
    if(commonJson.losUserId ==''){
        showTags({
            'title': '提示',
            'content': '没有LOS用户号,无法办理贷款业务!',
            'ok': {
                fun: function () {
                    $.mobile.changePage('../main.html');
                }
            }
        });
        return;
    }
    $("#kehuname").val('');
    $("#zhengjiannumber").val('');
    $("#loupanname").val('');

    $("#jieshuDate").val(appTime.appCurDate('-'));
    $("#kaishiDate").val(appTime.appPreDate('-', 1000 * 60 * 60 * 24 * 10));
    $(".seach-botton").on("click", function () {   //搜索按钮
        $("#kehuname").val('');
        $("#zhengjiannumber").val('');
        $("#loupanname").val('');
        $("#seach-day-con").show();
    });
    $(".fangqi-seach").eq(0).on("click", function () { //点击隐藏现搜索框
        $("#seach-day-con").hide();
//      $("#zhengjiannumber").val('');
//      $("#loupanname").val('');
    });
    daikuanapplicationObj.numIndex = '';
    daikuanapplicationObj.responseCode = '';
    showLoader("贷款申请进度查询中...");
    var dataEnd = appTime.appCurDate('');     //当前时间
    var dataStart = appTime.appPreDate('', 1000 * 60 * 60 * 24 * 10);
    var aboutJson = {      //发送请求的参数
        "b": [{
            "deviceNo.s": commonJson.udId, //设备编号
            "moduleId.s": loan.moduleId, //模块编号
            "tranId.s": loan.tranId3, //交易编号
            "orgId.s": commonJson.orgId,//机构号commonJson.orgId
            "operatorNo.s": commonJson.adminCount,//操作员commonJson.adminCount
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "pageNum.s": '1',//查询页码
            "pageSize.s": '7',//每页显示的记录数
            "CUSTOMER_NAME.s": '',      //姓名
            "DOCUMENT_ID.s": '',       //证件号
            "BEGIN_DATE.s": dataStart,    //申请日期开始
            "END_DATE.s": dataEnd,      //申请日期结束
            "BUILDING_NAME.s": '',      //楼盘名称
            "APPLY_STATUS.s": '',//       //办理进度
            "ACCT_EXEC1.s": commonJson.losUserId,       // 客户经理
            "QUERY_TYPE.s": '1'//查看类型
        }]
    };
    daikuanapplicationObj.pageIndex = 1;
    daikuanapplicationObj.bussinessDetail = aboutJson;
    ProcessQueryFun(aboutJson, function (msg) {
        ProcessQueryFunSucc(msg);
    }, function (err) {
        hideLoader();
        funFail(err);
    });
    //点击按照姓名查询
    $("#daikuan_img_sousuo").on("click", function () {
            daikuanapplicationObj.numIndex = '';
        daikuanapplicationObj.responseCode = '';
        showLoader("贷款申请进度按名字搜索中...");
        var naMeJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId3, //交易编号
                "orgId.s": commonJson.orgId,//机构号commonJson.orgId
                "operatorNo.s": commonJson.adminCount,//操作员commonJson.adminCount
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "pageNum.s": '1',//查询页码
                "pageSize.s": '7',//每页显示的记录数
                "CUSTOMER_NAME.s": $("#daikuan_name_sousuo").val(),      //姓名
                "DOCUMENT_ID.s": '',       //证件号
                "BEGIN_DATE.s": '',//dataStart,    //申请日期开始
                "END_DATE.s": '',//dataEnd,      //申请日期结束
                "BUILDING_NAME.s": '',      //楼盘名称
                "APPLY_STATUS.s": '',//       //办理进度
                "ACCT_EXEC1.s": commonJson.losUserId,       // 客户经理
                "QUERY_TYPE.s": '1'//查看类型
            }]
        };
        $("#daikuan_name_sousuo").val('');
        daikuanapplicationObj.pageIndex = 1;
        daikuanapplicationObj.bussinessDetail = naMeJson;
        ProcessQueryFun(naMeJson, function (msg) {
            ProcessQueryFunSucc(msg);
        }, function (err) {
            hideLoader();
            funFail(err);
        })
    });
    //按名字搜索----点击键盘回车按钮
    $("#daikuan_name_sousuo").on("keydown", function (eve) {
            daikuanapplicationObj.numIndex = '';
        daikuanapplicationObj.responseCode = '';
        var cusName = $(this).val();
        if (cusName == "" || !fmReg.cnName.test(cusName)) {
            showMsg(fmRegMsg.cnName);
            return;
        }
        var keyCode = eve.keyCode;
        if (keyCode == '13') {
                
        showLoader("贷款申请进度按名字搜索中...");
        var naMeJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId3, //交易编号
                "orgId.s": commonJson.orgId,//机构号commonJson.orgId
                "operatorNo.s": commonJson.adminCount,//操作员commonJson.adminCount
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "pageNum.s": '1',//查询页码
                "pageSize.s": '7',//每页显示的记录数
                "CUSTOMER_NAME.s": $("#daikuan_name_sousuo").val(),      //姓名
                "DOCUMENT_ID.s": '',       //证件号
                "BEGIN_DATE.s": '',//dataStart,    //申请日期开始
                "END_DATE.s": '',//dataEnd,      //申请日期结束
                "BUILDING_NAME.s": '',      //楼盘名称
                "APPLY_STATUS.s": '',//       //办理进度
                "ACCT_EXEC1.s": commonJson.losUserId,       // 客户经理
                "QUERY_TYPE.s": '1'//查看类型
            }]
        };
        $("#daikuan_name_sousuo").val('');
        daikuanapplicationObj.pageIndex = 1;
        daikuanapplicationObj.bussinessDetail = naMeJson;
        ProcessQueryFun(naMeJson, function (msg) {
            ProcessQueryFunSucc(msg);
        }, function (err) {
            hideLoader();
            funFail(err);
        })
        }
    });

    //点击搜素按钮按条件搜索
    $('#queryProcess .fangqi-seach').eq(1).on('click', function () {
        //获取要查询的时间
        if ($('#kaishiDate').val() == '' || $('#jieshuDate').val() == '') {
            showTags({
                'title': '提示',
                'content': '申请日期不能为空！',
                'ok': {}
            });
            return;
        }
        daikuanapplicationObj.numIndex = '';
        daikuanapplicationObj.responseCode = '';
        var timeStart = $('#kaishiDate').val().replace(/-/g, '');
        var timeCompareE = $('#jieshuDate').val().split('-');
        var timeEnd = $('#jieshuDate').val().replace(/-/g, '');
        var timeCompareS = appTime.suiDate(timeCompareE[0], timeCompareE[1], timeCompareE[2], '', 1000 * 60 * 60 * 24 * 30);
        if (timeStart < timeCompareS) {
            showTags({
                'title': '提示',
                'content': '起止日期不可超过30天！',
                'ok': {}
            });
            return;
        }
        //验证时间
        if (timeEnd < timeStart) {
            showTags({
                'title': '提示',
                'content': '起始日期不能大于终止日期！',
                'ok': {}
            });
            return;
        }
        var suoJson;
        var suoJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId3, //交易编号
                "orgId.s": commonJson.orgId,//机构号commonJson.orgId
                "operatorNo.s": commonJson.adminCount,//操作员commonJson.adminCount
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "pageNum.s": '1',//查询页码
                "pageSize.s": '7',//每页显示的记录数
                "CUSTOMER_NAME.s": $("#kehuname").val(),      //姓名
                "DOCUMENT_ID.s": $("#zhengjiannumber").val(),       //证件号
                "BEGIN_DATE.s": timeStart,    //申请日期开始
                "END_DATE.s": timeEnd,      //申请日期结束
                "BUILDING_NAME.s": $("#loupanname").val(),      //楼盘名称
                "APPLY_STATUS.s": $("#banlijindu").val(),//       //办理进度
                "ACCT_EXEC1.s": commonJson.losUserId,       // 客户经理
                "QUERY_TYPE.s": '1'//查看类型
            }]
        };
        if ($("#zhengjiannumber").val() == '') {

        } else {
            //验证身份证
            if (!(fmReg.cerNo.test($('.input-test-con').eq(1).val()))) {
                showMsg('您输入的证件号码有误，请重新输入！');
                return false;
            }
        }
        daikuanapplicationObj.pageIndex = 1;
        daikuanapplicationObj.bussinessDetail = suoJson;
        $("#seach-day-con").hide();
        showLoader("贷款办理进度查询中...");
        ProcessQueryFun(suoJson, function (msg) {
            ProcessQueryFunSucc(msg);
        }, function (err) {
            hideLoader();
            funFail(err);
        })
    });

    //点击补充资料按钮
    $("#daikuan_bucongziliao").on("click", function () {
        if (!($('#daikuan_bucongziliao').hasClass('btn_next')))return;
        if ($('#queryProcess .queryProcess-con').find('.list-bgcolor')) {
            daikuanapplicationObj.numIndex = ($('#queryProcess-con').find('.list-bgcolor').index()) - 1;
        }
        $.mobile.changePage('addData.html');
    });

});


$(document).on("pageshow", '#addData', function () {
    $("#bendiwenjian_con").removeClass("bendiwenjian_class");
    var busiInfo = (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0];
    daikuanapplicationObj.custFileArr = [];
    daikuanapplicationObj.videoable = '';
    daikuanapplicationObj.picFileARR = [];
    daikuanapplicationObj.imageObj = {};
    daikuanapplicationObj.approveFileArr = [];
    daikuanapplicationObj.apppicFileARR = [];
    daikuanapplicationObj.zhengxinArr = [];
    daikuanapplicationObj.fillListArr = [];
    var APPLY_NO = busiInfo.APPLY_NO;
    $('.additional-materials-left li').eq(2).find('span').text(busiInfo.CUSTOMER_NAME);  //申请人
    $('.additional-materials-left li').eq(4).find('span').text(busiInfo.DOCUMENT_ID);     //身份证
    var CREATEDATE = (busiInfo.APPLY_TIME.substring(0, 4)) + '年' + (busiInfo.APPLY_TIME.substring(4, 6)) + '月' + (busiInfo.APPLY_TIME.substring(6, 8)) + '日';
    $('.additional-materials-left li').eq(5).find('span').text(CREATEDATE);              //申请 日期
    $('.additional-materials-left li').eq(6).find('span').text(busiInfo.BUILDING_NAME);     //楼盘名称
    $('.additional-materials-left li').eq(7).find('.disReson').text(busiInfo.BUILDING_ADDR);     //楼盘地址
    var imgSwiper = new Swiper('.img-swiper-container', {
        pagination: '.swiper-pagination',
        observer: true
        //pagination : '#swiper-pagination1',
    });
    var imgWrapperCon = $('#swiper-wrapper-con');
    var opvObj = $('#c-edu');
    //初始化清空图片缓存
    opvObj.find('option').each(function (i, d) {
        var _opv = $(d).attr('value');
        TempCache.removeCache('img_' + _opv);
    });
    opvObj.on('change', function () {
        var opV = $(this).val();
        var htmlTemp = TempCache.getCache('img_' + opV);
        if (htmlTemp && htmlTemp != undefined) {
            imgWrapperCon.html(htmlTemp);
            setTimeout(function () {
                imgSwiper.slideTo(0, 0, false)
            }, 200)
        } else {
            //当前选项没有图片时清空
            imgWrapperCon.html('');
        }
    })
    function imgNumber() {
        //计算图片数量
        var opVObj = $('#c-edu option:selected');
        var imgNum = imgWrapperCon.children('.swiper-slide').length;
        var _num = opVObj.find('.img-num');
        if (!_num.length) {
            _num = $('<span class="img-num"></span>');
            opVObj.append(_num);
        }
        if (imgNum == 0) {
            _num.remove();
        } else {
            _num.show().html('(' + imgNum + ')');
        }
    }

    //本地银行对账单
    //$('#c-edu').on('change', function () {
    //    if ($('#c-edu option:selected').attr('value') == '13') {
    //        if ($('#bendiwenjian_con').hasClass('bendiwenjian_class')) {
    //            $(".bendiwenJian").show();
    //            $(".bendiwenjian_con").hide();
    //        } else {
    //            $(".bendiwenjian_con").show();
    //        }
    //        ;
    //    } else {
    //        $(".bendiwenjian_con").hide();
    //        $(".bendiwenJian").hide();
    //    }
    //});
//  var FILE_LIST = [];
//  $(".BDwenjian").on("click", function () {//点击添加银行对账单
//      queryTableDataByConditions({
//          "databaseName": "myDatabase", //数据库名
//          "tableName": "loandownload_info", //表名
//          "conditions": {
//              'fileType': '002',//银行对账单本地文件类型002 \U6731\U96f7
//              'name': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].CUSTOMER_NAME,//"朱雷",////(daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].CUSTOMER_NAME,//客户姓名
//              'cerType': '0',//证件类型
//              'cerNO': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].DOCUMENT_ID //'131082199111194115'//(daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].DOCUMENT_ID,//证件号码
//          }
//      }, function (msg) {
////          var imgObj = new Array();
//          var _id = 'img_' + new Date().getTime();
//          if (msg != '') {
//              showTags({
//                  'title': '提示',
//                  'content': '银行对账单添加成功',
//                  'ok': {
//                      fun: function () {
//                          $.each(msg, function (index, ele) {
////                              imgObj.push(ele.filePath);
////                              daikuanapplicationObj.approveFileArr.push(ele.filePath);
////                              FILE_LIST = {};
////                                  FILE_LIST.fileRoute = ele.netFilePath;
////                              FILE_LIST.fileType = '00006';
////                              FILE_LIST.fileId = _id;
//                              FILE_LIST.push(ele.netFilePath);
//                          });
//                          $("#bendiwenjian_con").addClass("bendiwenjian_class");
//                          $(".bendiwenjian_con").hide();
//                          $(".bendiwenJian").show();
//                      }
//                  }
//              });
//
//              if (!($('submitBtn').hasClass('btn_next'))) {
//                  $('submitBtn').addClass('btn_next');
//              }
//          } else {
//              showTags({
//                  'title': '提示',
//                  'content': '银行对账单本地文件为空',
//                  'ok': {}
//              });
//          }
//      }, function (err) {
//          funDataFail(err);
//      });
//  });

    //点击拍照
    $('#addData .additional-materials-paishe').on('click', function () {//点击拍照

        //获取拍摄的option的文本和value
        var opVObj = $('#c-edu option:selected');
        var opV = opVObj.val();


        Meap.media('camera', $('#c-edu option:selected').attr('picName'), function (msg) {
                
            daikuanapplicationObj.isPicture = true;
            if (!($('#submitBtn').hasClass('btn_next'))) {
                $('#submitBtn').addClass('btn_next');
            }

            var _id = 'img_' + new Date().getTime();
            if ($('#c-edu option:selected').attr('fileType') == "00005") {  //判断图片传入数组-->包不同  客户资料包
                var imgObj = {};
                imgObj.fileRoute = msg;
                imgObj.fileType = '00005';
                imgObj.fileId = _id;
                daikuanapplicationObj.custFileArr.push(imgObj);
            } else { // 受理审批资料
                var imgObj = {};
                imgObj.fileRoute = msg;
                imgObj.fileType = '00006';
                imgObj.fileId = _id;
                daikuanapplicationObj.approveFileArr.push(imgObj);
            }
       
            //daikuanapplicationObj.imageObj[$('#c-edu option:selected').attr('picName')] = msg;
            imgWrapperCon.prepend('<div class="swiper-slide" fileid="' + _id + '"><img src="../../images/ic_delete.png" class="lajitong_icon"/><img src="' + msg + '" width="100%" height="100%"  class="camera-pic"></div>');
            //$('#swiper-wrapper-con').html('<div class="swiper-slide"><img src="' + msg + '" width="100%" height="100%"  class="camera-pic"></div>');
            imgNumber();
            TempCache.cache('img_' + opV, imgWrapperCon.html());
            setTimeout(function () {
                imgSwiper.slideTo(0, 0, false)
            }, 200)
        $("#c-edu").selectmenu('refresh');
        }, function (err) {
            showMsg(err);
        });

//      var _picName = $('#c-edu option:selected').attr('picName');
//  Meap.media('camera', _picName, function (msg) {
//              daikuanapplicationObj.isPicture = true;
//              if (!($('.footter a').hasClass('btn_next'))) {
//                  $('.footter a').addClass('btn_next');
//              }
//              var imgArr = daikuanapplicationObj.imageObj[_picName];
//              
//              if(imgArr && typeof imgArr == 'object'){
//                  imgArr.push(msg);
//              }else{
//                  imgArr = new Array();
//                  imgArr.push(msg);
//                  daikuanapplicationObj.imageObj[_picName] = imgArr;
//              }
//              //daikuanapplicationObj.imageObj[_picName] = msg;
//              imgWrapperCon.prepend('<div class="swiper-slide"><img src="../../images/ic_delete.png" class="lajitong_icon"/><img src="' + msg + '" width="100%" height="100%"  class="camera-pic"></div>');
//              //$('#swiper-wrapper-con').html('<div class="swiper-slide"><img src="' + msg + '" width="100%" height="100%"  class="camera-pic"></div>');
//              imgNumber();
//              TempCache.cache('img_'+opV,imgWrapperCon.html());
//        setTimeout(function() {
//              imgSwiper.slideTo(0,0,false)
//          }, 200)
//         
//          }, function (err) {
//              showMsg('拍照失败');
//          });


    });
    //删除图片
    imgWrapperCon.delegate(".lajitong_icon", "click", function () {
        var _this = $(this);
        showTags({
            'title': '提示',
            'content': '你确定要删除该图片吗？',
            'ok': {
                    'title': '取消', //非必输  默认值：确定
                            'fun': function() {
                                
                            }
            },
            'cancel': {
                    'title': '确定', //非必输  默认值：取消
                    'fun': function() {
                    var _slide = _this.parents('.swiper-slide');
                    var _fileid = _slide.attr('fileid');
                    if ($('#c-edu option:selected').attr('fileType') == "00005") {
                        if (typeof daikuanapplicationObj.custFileArr === 'object') {
                            $.each(daikuanapplicationObj.custFileArr, function (i, d) {
                                if (d && d.fileId && d.fileId == _fileid) {
                                    daikuanapplicationObj.custFileArr.splice(i, 1);
                                }
                            })
                        }
                    } else {
                        if (typeof daikuanapplicationObj.approveFileArr === 'object') {
                            $.each(daikuanapplicationObj.approveFileArr, function (i, d) {
                                if (d && d.fileId && d.fileId == _fileid) {
                                    daikuanapplicationObj.approveFileArr.splice(i, 1);
                                }
                            })
                        }
                    }
                    var arrLength = daikuanapplicationObj.custFileArr.length + daikuanapplicationObj.approveFileArr.length + daikuanapplicationObj.zhengxinArr.length + daikuanapplicationObj.fillListArr.length;
                    if(arrLength > 0){
                        $('#submitBtn').addClass('btn_next');
                    }else{
                        $('#submitBtn').removeClass('btn_next');
                    }
                    if (_slide.length) _slide.remove();

                    var opV = $('#c-edu option:selected').val();
                    TempCache.cache('img_' + opV, imgWrapperCon.html());
                    imgNumber();
                    $("#c-edu").selectmenu('refresh');
                }
            }
        });
        return false;
    })

    //点击征信报告按钮
    $('.zxbgBtn').on('click', function(){
        showLoader("征信报告查询中...");
        var inquiryDate = dateGetYMD(30);//查询30天内的征信文件
        var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "inquiryDateMin.s": dateYYYYMMDD(inquiryDate[1]),    //申请日期开始
                "inquiryDateMax.s": dateYYYYMMDD(inquiryDate[0]),      //申请日期结束
                "name.s": busiInfo.CUSTOMER_NAME, //姓名
                "certNum.s": busiInfo.DOCUMENT_ID,  //证件号码
                "status.s": '1,3',   //状态(成功和不需查询征信报告)
                "page.s": '' ,    //页码
                "username.s":'',
                'creditType.s': '',	//征信类型
	            'supplementInd.s': '' //是否允许补查
            }]
        };
        findCreditReportInquiryFun(sendJson, function (msg) {
            loanFindCreditReportInquirySucc(msg);
        }, function (err) {
            hideLoader();
            funFail(err);
        });
    });
    //点击选择征信文件页面  放弃按钮
    $('.searchCredit a:first').on('click', function () {
        $(".searchCredit").hide();
    });
    //点击选择征信文件页面  确认按钮
    $('.searchCredit a:last').on('click', function () {
        if (!$(this).hasClass('btn_next')) {
            return;
        }
        daikuanapplicationObj.zhengxinArr = [];
        $('.searchCredit ul>li[sel=true]').each(function (index, ele) {
        	var creditInfo = $(ele).data('creditInfo');
        	if(creditInfo.creditReferPath) {
				$.each(creditInfo.creditReferPath.split(';'), function(index, path) {
					daikuanapplicationObj.zhengxinArr.push(path);
				});
			}
            daikuanapplicationObj.zhengxinArr.push(creditInfo.accredit);//征信授权书
        });
        var arrLength = daikuanapplicationObj.custFileArr.length + daikuanapplicationObj.approveFileArr.length + daikuanapplicationObj.zhengxinArr.length + daikuanapplicationObj.fillListArr.length;
        if(arrLength > 0){
            $('#submitBtn').addClass('btn_next');
        }else{
            $('#submitBtn').removeClass('btn_next');
        }
        $(".searchCredit").hide();
    });
    //点击查看征信报告
    $('.searchCredit ul').delegate('u', 'tap', function () {
    	loan.creditInfo = $(this).closest('li').data('creditInfo');
        loan.creditReferPath = loan.creditInfo.creditReferPath;
        openCreditReportFile(loan, 'F0005');
    });
    //点击对账单按钮
    $('.dzdBtn').on('click', function(){
        showLoader("对账单查询中...");
        var inquiryDate = dateGetYMD(30);//查询30天内的对账单文件
        var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "inquiryDateMin.s": dateYYYYMMDD(inquiryDate[1]),  //查询日期时间
                "inquiryDateMax.s": dateYYYYMMDD(inquiryDate[0]),   //查询日期时间
                "name.s": busiInfo.CUSTOMER_NAME,//姓名
                "certNum.s": busiInfo.DOCUMENT_ID,//证件号码
                "account.s": '',//账号
                "status.s": '1',//状态
                "page.s": ''//页码
            }]
        };
        findStatementConF(sendJson, findStatementAddDataSucc);
    });
    //点击选择对账单页面  放弃按钮
    $('.searchBank a:first').on('click', function () {
        $(".searchBank").hide();
    });
    //点击选择对账单页面  确认按钮
    $('.searchBank a:last').on('click', function () {
        if (!$(this).hasClass('btn_next')) {
            return;
        }
        daikuanapplicationObj.fillListArr = [];
        $('.searchBank ul>li[sel=true]').each(function (index, val) {
            daikuanapplicationObj.fillListArr.push($(val).attr('creditReferPath'));
        });
        var arrLength = daikuanapplicationObj.custFileArr.length + daikuanapplicationObj.approveFileArr.length + daikuanapplicationObj.zhengxinArr.length + daikuanapplicationObj.fillListArr.length;
        if(arrLength > 0){
            $('#submitBtn').addClass('btn_next');
        }else{
            $('#submitBtn').removeClass('btn_next');
        }
        $(".searchBank").hide();
    });
    $('.searchBank ul').delegate('u', 'tap', function () {
        loan.creditReferPath = $(this).closest('li').attr('creditReferPath');
        getFileDataAndOpen(loan, 'F0010');
    });

    //点击提交完成按钮
    $('#submitBtn').on('click', function () {//点击提交完成按钮 
        var bczlwjsl5 = '';
        var bczlwjsl6 = '';
        if (!($('#submitBtn').hasClass('btn_next')))return;
        showLoader("贷款补充资料提交中...");
        daikuanapplicationObj.picFileInfoARR = [{
            "b": []
        }];
        daikuanapplicationObj.picFileARR = [];   //提交优化 ---->防止重复提交导致文件重复--->lei.
        daikuanapplicationObj.apppicFileARR = [];//提交优化 ---->防止重复提交导致文件重复--->lei.
        if (daikuanapplicationObj.isPicture == true) {   //存在图片

            for (x in daikuanapplicationObj.custFileArr) { //00005    客户资料包
                daikuanapplicationObj.picFileARR.push(daikuanapplicationObj.custFileArr[x].fileRoute);
            }
            for (x in daikuanapplicationObj.approveFileArr) {//00006  受理审批资料包
                daikuanapplicationObj.apppicFileARR.push(daikuanapplicationObj.approveFileArr[x].fileRoute);
            }
        }
//      alert(bczlwjsl5 + bczlwjsl6);
        if(daikuanapplicationObj.picFileARR.length>0 || daikuanapplicationObj.zhengxinArr.length>0){
            bczlwjsl5 = 1;
        }else{
            bczlwjsl5 = 0;
        }
        if(daikuanapplicationObj.apppicFileARR.length>0 || daikuanapplicationObj.fillListArr.length>0){
            bczlwjsl6 = 1;
        }else{
            bczlwjsl6 = 0;
        }
        var fileCount = bczlwjsl5 + bczlwjsl6;
        showLoader('流水编号查询中');
        var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId3, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "CLIENT_NAME.s": (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].CUSTOMER_NAME,//客户姓名
                "DOCUMENT_TYPE.s": '0',//证件类型
                "resend.s":'1',//补充资料
                "fileCount.s": ''+fileCount,//补充资料文件的数量
                "APPLY_NO.s": (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].APPLY_NO,//业务申请编号
                "CUSTOMER_NO.s": (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].CUSTOMER_NO,//客户流水号
                "DOCUMENT_ID.s": (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].DOCUMENT_ID//证件号码
            }]
        };

        getPlatGlobalSeqFun(sendJson, function (msg) {
            getPlatGlobalSeqZLSCSucc(msg);
        }, function (err) {
            funFail(err);
        });
        function getPlatGlobalSeqZLSCSucc(msg) {
            var responseBody = responseBodySuccFormat(msg);
            if (responseBody[0].results == '00') {
                applicationObj.plSeq = responseBody[0].platGlobalSeq;//获取平台流水
                if (applicationObj.plSeq != '') {
                    var phoneTime = myTime.CurTime();
                    if(daikuanapplicationObj.picFileARR.length>0 || daikuanapplicationObj.zhengxinArr.length > 0){
                        MT_zipCompression('loanType', applicationObj.plSeq + 'CustInfo', daikuanapplicationObj.picFileARR, function (msg1) {
                            //将要上传的影像插入到ios断点上传的数据库中
                            //影像上传 业务参数
                            var appBus = {
                                'busiGloablaSeq': applicationObj.plSeq,//业务编号
                                'TRADE_TYPE': '00005',//客户资料
                                'APPLY_NO': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].APPLY_NO,//业务申请编号
                                'CUSTOMER_NO': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].CUSTOMER_NO,//客户流水号
                                'attchType': '0',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                                'deviceNo': commonJson.udId,//设备编号
                                'moduleId': loan.moduleId,//模块编号
                                'tranId': loan.tranId3,//loan.tranId,//交易编号
                                'orgId': commonJson.orgId,//机构编号
                                'operatorNo': commonJson.adminCount,//操作员
                                'custName': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].CUSTOMER_NAME,//客户名称
                                'custCredType': '0',//客户证件类型
                                'custCredNo': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].DOCUMENT_ID,//客户证件号
                                'offlineOnline': commonJson.offlineOnline,//脱机/联机
                                'workAddress': commonJson.workAddress,//工作地址
                                'userId': commonJson.losUserId,  //los用户
                                'OPER_TYPE': 'MOD',//操作类型 add-->表示新增  mod-->表示修改
                                'FILE_LIST': daikuanapplicationObj.zhengxinArr//征信文件
                            };
                            transFormImageAndInsertTableData(appBus, phoneTime, 'l002', msg1,'3');
                        }, function(err) {
							hideLoader();
							showTags({
								'title': '提示',
								'content': '压缩影像失败！',
								'ok': {}
							});
						});
                    }
                    if(daikuanapplicationObj.apppicFileARR.length>0 || daikuanapplicationObj.fillListArr.length > 0){
                        MT_zipCompression('loanType', applicationObj.plSeq + 'Apply', daikuanapplicationObj.apppicFileARR, function (msg2) {
                            //将要上传的影像插入到ios断点上传的数据库中
                            //影像上传 业务参数
                            var appBus = {
                                'busiGloablaSeq': applicationObj.plSeq,//业务编号
                                'TRADE_TYPE': '00006',//客户资料
                                'APPLY_NO': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].APPLY_NO,//业务申请编号
                                'CUSTOMER_NO': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].CUSTOMER_NO,//客户流水号
                                'attchType': '0',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
                                'deviceNo': commonJson.udId,//设备编号
                                'moduleId': loan.moduleId,//模块编号
                                'tranId': loan.tranId3,//loan.tranId,//交易编号
                                'orgId': commonJson.orgId,//机构编号
                                'operatorNo': commonJson.adminCount,//操作员
                                'custName': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].CUSTOMER_NAME,//客户名称
                                'custCredType': '0',//客户证件类型
                                'custCredNo': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].DOCUMENT_ID,//客户证件号
                                'offlineOnline': commonJson.offlineOnline,//脱机/联机
                                'workAddress': commonJson.workAddress,//工作地址
                                'userId': commonJson.losUserId,  //los用户
                                'OPER_TYPE': 'MOD',//操作类型 add-->表示新增  mod-->表示修改
                                'FILE_LIST': daikuanapplicationObj.fillListArr//对账单
                            };
                            transFormImageAndInsertTableData(appBus, phoneTime + 1, 'l002', msg2,'4');
                        }, function(err) {
							hideLoader();
							showTags({
								'title': '提示',
								'content': '压缩影像失败！',
								'ok': {}
							});
						});
                    }

                    showTags({
                        'title': '提示',
                        'content': '业务已受理',
                        'ok': {
                            fun: function () {
                                $.mobile.changePage('queryProcess.html');
                            }
                        }
                    });
                } else {
                    showTags({
                        'title': '提示',
                        'content': '流水号为空，请重新提交获取',
                        'ok': {}
                    });
                }
            } else if (responseBody[0].results == '08'){
                
            } else {
                showTags({
                    'title': '提示',
                    'content': responseBody[0].message,
                    'ok': {}
                });
            }
        };

        //影像上传文件打包压缩插件
//      Meap.zipCompression('loans', daikuanapplicationObj.picFileARR, function (msg) {
//          //将要上传的影像插入到ios断点上传的数据库中
//          //影像上传 业务参数
//          var appBussPhone = {
//              'busiGloablaSeq': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].APPLY_NO, //业务编号
//              'attchType': '0', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
//              'deviceNo': commonJson.udId, //设备编号
//              'moduleId': loan.moduleId, //模块编号
//              'tranId': loan.tranId,//loan.tranId, //交易编号
//              'orgId': commonJson.orgId, //机构编号
//              'operatorNo': commonJson.adminCount, //操作员
//              'custName': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].CUSTOMER_NAME, //客户名称
//              'custCredType': '0', //客户证件类型
//              'custCredNo': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].DOCUMENT_ID, //客户证件号
//              'offlineOnline': commonJson.offlineOnline, //脱机/联机
//              'workAddress': commonJson.workAddress, //工作地址
//              //'FILE_ADD': daikuanapplicationObj.picFileInfoARR[0].b, //每个图片的名称和类型
//              'FILE_LIST':'',//ding 2016-3-22银行对账单
//              'OPER_TYPE': 'MOD',
//              'APPLY_NO': APPLY_NO,//申请编号
//              'CUSTOMER_NO': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].CUSTOMER_NO,//客户流水号
//              'TRADE_TYPE': '00005',//交易类型
//              'userId': commonJson.losUserId,//orgIdToUserId[commonJson.orgId], //柜员号
//              'branchId': commonJson.orgId//commonJson.orgId //机构号
//          };
//          appBussPhone = JSON.stringify(appBussPhone);
//          var sendDataJson = {
//              "databaseName": "myDatabase",
//              "tableName": "up_download_info",
//              "data": [{
//                  "fileToken": phoneTime, //文件唯一ID(可以为时间挫
//                  "pos": "0", //文件的断点信息(初始为0)
//                  "filePath": msg, //文件路径
//                  "appPath": "l002", //自定义文件路径
//                  "appBuss": appBussPhone, //业务参数
//                  "downloadToken": "", //文件的下载ID(初始为空)
//                  "leng": "1", //文件的长度(初始为1)
//                  "isNotice": "yes", //是否调用后台(一直是yes)
//                  "fileType":"0"
//              }]
//          };
//          insertTableData(sendDataJson, function (msg) {
//              hideLoader();
//              $.mobile.changePage('queryProcess.html');
////              showTags({
////                  'title': '提示',
////                  'content': '业务已受理',
////                  'ok': {
////                      fun: function () {
////                          $.mobile.changePage('queryProcess.html');
////                      }
////                  }
////              });
//          }, function (err) {
//              hideLoader();
//              showTags({
//                  'title': '提示',
//                  'content': '影像插入失败！',
//                  'ok': {}
//              });
//          });
//      }, function (err) {
//          hideLoader();
//          showTags({
//              'title': '提示',
//              'content': '影像压缩失败！',
//              'ok': {}
//          });
//      });
//      var phoneTime = myTime.CurTime();
//      //影像上传文件打包压缩插件==>审批
//      Meap.zipCompression('loans', daikuanapplicationObj.apppicFileARR, function (msg) {
//          //将要上传的影像插入到ios断点上传的数据库中
//          //影像上传 业务参数
//          var appBussPhone = {
//              'busiGloablaSeq': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].APPLY_NO, //业务编号
//              'attchType': '0', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
//              'deviceNo': commonJson.udId, //设备编号
//              'moduleId': loan.moduleId, //模块编号
//              'tranId': loan.tranId,//loan.tranId, //交易编号
//              'orgId': commonJson.orgId, //机构编号
//              'operatorNo': commonJson.adminCount, //操作员
//              'custName': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].CUSTOMER_NAME, //客户名称
//              'custCredType': '0', //客户证件类型
//              'custCredNo': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].DOCUMENT_ID, //客户证件号
//              'offlineOnline': commonJson.offlineOnline, //脱机/联机
//              'workAddress': commonJson.workAddress, //工作地址
//              'FILE_LIST':FILE_LIST,//ding 2016-3-22银行对账单
//              //'FILE_ADD': daikuanapplicationObj.picFileInfoARR[0].b, //每个图片的名称和类型
//              'OPER_TYPE': 'MOD',
//              'APPLY_NO': APPLY_NO,//申请编号
//              'CUSTOMER_NO': (daikuanapplicationObjon[daikuanapplicationObj.numIndex])[0].CUSTOMER_NO,//客户流水号
//              'TRADE_TYPE': '00006',//交易类型
//              'userId': '9107',//orgIdToUserId[commonJson.orgId], //柜员号
//              'branchId': '00862'//commonJson.orgId //机构号
//          };
//          appBussPhone = JSON.stringify(appBussPhone);
//          var sendDataJson = {
//              "databaseName": "myDatabase",
//              "tableName": "up_download_info",
//              "data": [{
//                  "fileToken": phoneTime+1, //文件唯一ID(可以为时间挫
//                  "pos": "0", //文件的断点信息(初始为0)
//                  "filePath": msg, //文件路径
//                  "appPath": "l002", //自定义文件路径
//                  "appBuss": appBussPhone, //业务参数
//                  "downloadToken": "", //文件的下载ID(初始为空)
//                  "leng": "1", //文件的长度(初始为1)
//                  "isNotice": "yes", //是否调用后台(一直是yes)
//                  "fileType":"0"
//              }]
//          };
//          insertTableData(sendDataJson, function (msg) {
//              hideLoader();
//              $.mobile.changePage('queryProcess.html');
////              showTags({
////                  'title': '提示',
////                  'content': '业务已受理',
////                  'ok': {
////                      fun: function () {
////                          $.mobile.changePage('queryProcess.html');
////                      }
////                  }
////              });
//          }, function (err) {
//              hideLoader();
//              showTags({
//                  'title': '提示',
//                  'content': '影像插入失败！',
//                  'ok': {}
//              });
//          });
//      }, function (err) {
//          hideLoader();
//          showTags({
//              'title': '提示',
//              'content': '影像压缩失败！',
//              'ok': {}
//          });
//      })


    });


});

/**
 * 贷款申请
 **/

/*贷款产品界面*/
$(document).on("pageshow", '#loan-product', function () {
    loan.BTime = null;
    loan.getBankYZM = true;
    loan.applicationObj = {};
    loan.isInputChange = false;
    loan.isMaster = true;
    loan.mInfo.isTrue = false;
    loan.mInfo.MGCompareFace = false;
    loan.gInfo.isTrue = false;
    loan.gInfo.MGCompareFace = false;
    loan.MorG = 'm';
    loan.inputLogo = false;
    lianwanghechaData.dianzixinyongkaDX = "3";
    loan.isLoanMaster = true;
    loan.buildArr = [];
    loan.accountArr = [];
    loan.dzd = [];
    loan.isPicturePage = false;
    loan.ispeiPicturePage = false;
    loan.faceSQBS = false;
    loan.faceSQBM = false;

    //判断时间:true就查询本地数据库,false就查询后台
    var todayIs = appTime.appCurDate('');
    if (todayIs == localStorage.loanProductTime) {     //是否当天发的请求 不发送请求
        loan.isProRequest = false;
    } else {
        localStorage.loanProductTime = todayIs;
        loan.isProRequest = true;
    }
    getCurrentLocationCoordinateFun(function () {
        showLoader("产品列表查询中...");
        if (!loan.isProRequest) {
            queryTableDataByConditions({
                "databaseName": "myDatabase", //数据库名
                "tableName": "loanproductlist_info" //表名
            }, function (msg) {
                loanproductlistInfoServiceDataSucc(msg);
            }, function (err) {
                funDataFail(err);
            });
        } else {
            var sendJson = {
                "b": [{
                    "deviceNo.s": commonJson.udId, //设备编号
                    "moduleId.s": loan.moduleId, //模块编号
                    "tranId.s": loan.tranId, //交易编号
                    "orgId.s": commonJson.orgId,//机构号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress//工作地址
                }]
            };
            getLoanProductListConF(sendJson);
        }
    });
});
/*读取身份证*/
$(document).on("pageshow", '#loan-reading', function () {
    loan.isRead = false;
    loan.ispeiPicturePage = false;
    custermerInfo = {};
    //点击关闭按钮
    $('.footter .previous:first').on('click', function () { //返回主流程 主申请人拍照界面
        showTags({
            'title': '提示',
            'content': '无需采集配偶影像资料?',
            'cancel': {
                'title': '确认',
                fun: function () {
                    loan.isPicturePage = true;
                    loan.isLoanMaster = true;
                    $.mobile.changePage('loan-cusPicture.html');
                }
            },
            'ok': {
                'title': '放弃',
                'fun': function () {
                }
            }
        });
    });
    //调用刷身份证方法
    $(".footter .previous:last").on('click', function () {
        creditReadCard(function () {
            $.mobile.changePage('loan-read.html');
        }, function (err) {
            $.mobile.changePage('loan-read.html');
        });
    });
    $('#loan-reading .header a:first').on('click', function () {  //首页
        if(loan.isLoanMaster){
            $.mobile.changePage('../main.html', {reverse: true});
        }else{
            showTags({
                'title': '提示',
                'content': '确认返回首页？',
                'ok': {
                    'title': '放弃',
                    'fun': function () {

                    }
                },
                'cancel': {
                    'title': '确认',
                    'fun': function () {
                        $.mobile.changePage('../main.html', {
                            reverse: true
                        });
                    }
                }
            })
        }
    });
    $('#loan-reading .header a:last').on('click', function () {
        if(loan.isLoanMaster){
            $.mobile.changePage('loan-product.html', {reverse: true});
        }else{
            showTags({
                'title': '提示',
                'content': '确认退出交易？',
                'ok': {
                    'title': '放弃',
                    'fun': function () {

                    }
                },
                'cancel': {
                    'title': '确认',
                    'fun': function () {
                        $.mobile.changePage('loan-product.html', {
                            reverse: true
                        });
                    }
                }
            })
        }

    });
    //判断是 主申请人流程 还是 配偶流程
    if (!loan.isLoanMaster) {  //当前界面是配偶申请
        $('.peiRead').removeClass('isPei');
        $('.picRe').hide();
        $('.previous:last').removeClass('isPeiBtn');
        $('.previous:first').removeClass('isPei');
        loan.isPicturePage = true;
        loan.fdzd = [];
        loan.gInfo = {
            isTrue: false,
            cFileStr: [],//征信文件
            MGCompareFace: false
        };
    } else {
        loan.dzd = [];
        loan.fdzd = [];
        loan.mInfo = {
            isTrue: false,
            cFileStr: [],//征信文件
            MGCompareFace: false
        };
        loan.gInfo = {
            isTrue: false,
            cFileStr: [],//征信文件
            MGCompareFace: false
        };
        loan.inputLogo = false;
        loan.isPicturePage = false;
    }
    commonJson.isCustermerInfoMultiplex = false; //确定影像复用
    //点击影像复用按钮
    $("#loan-reading .conter-con .picRe").on('click', function () {
        loan.isLoanMaster = true;
        loan.applicationObj.custAndCustOwnerPic = custermerInfo.custAndCustOwnerPic; //与客户合影照片
        loan.applicationObj.frontIDCardPic = custermerInfo.frontIDCardPic; //身份证正面
        loan.applicationObj.backIDCardPic = custermerInfo.backIDCardPic; //身份证反面
        $.mobile.changePage('loan-video.html');
    });
});
/*身份证联网核查*/
$(document).on("pageshow", '#loan-read', function () {
    lianwanghechaData.dianzixinyongkaDX = "3";
    //显示信息
    if (creditJson.isReadCardSucc || commonJson.isCustermerInfoMultiplex) { //读卡成功
        creditReadCardSucc({
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "DOCUMENT_TYPE.s": "0", //证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号码
                "CLIENT_NAME.s": custermerInfo.name, //被核对人姓名 "NAME12223964",//
                "BUSSINESSCODE.s": "02", //业务总类
                "BRANCH_ID.s": commonJson.orgId//机构号
            }]
        });
    } else {
        creditReadCardFail();
    }
    //点击上一步重新读取
    $("#loan-read .footter .previous:eq(0)").on('click', function () {
        $.mobile.changePage('./loan-reading.html', {
            reverse: true
        });
    });
    //点击下一步 联网核查
    $("#loan-read .footter .previous:eq(1)").on('click', function () {
        if (!$(this).hasClass('btn_next')) {
            return;
        }
        loan.applicationObj.lianPic = custermerInfo.checkPhoto;
        if(!loan.isLoanMaster){
            mgInfo(loan.gInfo);
            if(loan.mInfo.isTrue && loan.gInfo.isTrue){  //主 配 都存在的情况下  判断性别状况
                if(loan.mInfo.sex == loan.gInfo.sex){
                    showTags({
                        'title': '提示',
                        'content': '主申请人与配偶信息相同!',
                        'ok': {
                            fun: function () {
                                $.mobile.changePage('loan-reading.html', {
                                    reverse: true
                                });
                            }
                        }
                    });
                    return;
                }
            }
            $.mobile.changePage('loan-peiPicture.html', {reverse: true});
        }else{
            showLoader('客户信息查询中...');
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "moduleId.s": loan.moduleId, //模块编号 4
                    "tranId.s": loan.tranId, //交易编号   2
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
            icustomerInfoServiceFun(sendJson, function (msg) {
                customerInfoServiceLoanSucc(msg);
            }, function (err) {
                funFail(err);
            });
        }

    });

    $(".lianwanghecha-chongxin").on("click", function () {//重新联网核查
        $(".lianwanghecha-yichang").hide();
        creditReadCardSucc({
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "DOCUMENT_TYPE.s": "0", //证件类型
                "DOCUMENT_ID.s": custermerInfo.cerNO, //身份证号码
                "CLIENT_NAME.s": custermerInfo.name, //被核对人姓名 "NAME12223964",//
                "BUSSINESSCODE.s": "02", //业务总类
                "BRANCH_ID.s": commonJson.orgId//机构号
            }]
        });

    });
    $(".lianwanghecha-jixu").on("click", function () {//继续业务办理
        $(".lianwanghecha-yichang").hide();
        if(!loan.isLoanMaster) {
            mgInfo(loan.gInfo);
            if (loan.mInfo.isTrue && loan.gInfo.isTrue) {  //主 配 都存在的情况下  判断性别状况
                if (loan.mInfo.sex == loan.gInfo.sex) {
                    showTags({
                        'title': '提示',
                        'content': '主申请人与配偶信息相同!',
                        'ok': {
                            fun: function () {
                                $.mobile.changePage('loan-reading.html', {
                                    reverse: true
                                });
                            }
                        }
                    });
                    return;
                }
            }
            $.mobile.changePage('loan-peiPicture.html', {reverse: true});
        }else{
            showLoader('客户信息查询中...');
            var sendJson = {
                "b": [{
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "moduleId.s": loan.moduleId, //模块编号 4
                    "tranId.s": loan.tranId, //交易编号   2
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
                    //"CARD_CATEGORY.s":""//虚拟卡查核心标识 1
                }]
            };
            //核心联查
            icustomerInfoServiceFun(sendJson, function (msg) {
                customerInfoServiceLoanSucc(msg);
            }, function (err) {
                funFail(err);
            });
        }
    });
    $(".lianwanghecha-tuichu").on("click", function () {//退出
        $.mobile.changePage('loan-reading.html', {transition: "slide"});
        $(".lianwanghecha-yichang").hide();
    });

    //点击首页
    $('#loan-read .header a:first').on('click', function () {  //首页
        if(loan.isLoanMaster){
            $.mobile.changePage('../main.html', {reverse: true});
        }else{
            showTags({
                'title': '提示',
                'content': '确认返回首页？',
                'ok': {
                    'title': '放弃',
                    'fun': function () {

                    }
                },
                'cancel': {
                    'title': '确认',
                    'fun': function () {
                        $.mobile.changePage('../main.html', {
                            reverse: true
                        });
                    }
                }
            })
        }
    });
    //点击退出
    $('#loan-read .header a:last').on('click', function () {
        if(loan.isLoanMaster){
            $.mobile.changePage('loan-product.html', {reverse: true});
        }else{
            showTags({
                'title': '提示',
                'content': '确认退出交易？',
                'ok': {
                    'title': '放弃',
                    'fun': function () {

                    }
                },
                'cancel': {
                    'title': '确认',
                    'fun': function () {
                        $.mobile.changePage('loan-product.html', {
                            reverse: true
                        });
                    }
                }
            })
        }
    });
});
/*影像复用*/
$(document).on("pageshow", '#loan-video', function () {
    //从数据库中查询可复用的个人信息
    queryAllcacheCustermerInfo();
    //点击取消
    $('#loan-video .previous-con').on('click', function () {
        $.mobile.changePage('loan-reading.html', {reverse: true});
    });
    //点击影像复用
    $('#btn_next').on('click', function () {
        if (!($(this).hasClass('btn_next'))) return;
        commonJson.isCustermerInfoMultiplex = true; //使用影像复用功能
        $.mobile.changePage('loan-read.html');
    })
});
var loanImageAcquisition = {
    imgSrc: '', //记录照片路径,
    curParentObj: '', //记录要删除的对象
    delImg: function (curParentObj, imgSrc) { //删除照片
        //creditJson.isPrev.LLDBisFromPrev = false;
        deletePhoto([imgSrc], function (msg) {
            curParentObj.find('.camera-pic').remove();
            curParentObj.find('.camera').show();
            curParentObj.find('.rephoto').html('必拍');
            $('.bigpic-review-box').animate({
                    opacity: '0'
                },
                200,
                function () {
                    $('.bigpic-review-box').hide()
                });
            if (curParentObj.find('.cameraMul').length > 0) { //如果是其他证明
                curParentObj.closest('.img_box').remove();
            }
            //监测下一步是否可点击
            var ind = 0;
            for (var i = 0; i < 4; i++) {
                if ($('.customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if(loan.isLoanMaster){
                        if (ind >= 4) {
                            $('#loan-cusPicture #btn_next').addClass('btn_next');
                        } else {
                            $('#loan-cusPicture #btn_next').removeClass('btn_next');
                        }
                    }else{
                        if (ind >= 4) {
                            $('#loan-peiPicture #btn_next').addClass('btn_next');
                        } else {
                            $('#loan-peiPicture #btn_next').removeClass('btn_next');
                        }
                    }
                }
            }
        }, function (err) {

        })
    },
    getFace: function (curParentObj) {
        faceDistinguish('trans', function (msg) {
            loanImageAcquisition.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');
            //监测下一步是否可点击
            var ind = 0;
            for (var i = 0; i < 4; i++) {
                if ($('.customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if(loan.isLoanMaster){
                        if (ind >= 4) {
                            $('#loan-cusPicture #btn_next').addClass('btn_next');
                        } else {
                            $('#loan-cusPicture #btn_next').removeClass('btn_next');
                        }
                    }else{
                        if (ind >= 4) {
                            $('#loan-peiPicture #btn_next').addClass('btn_next');
                        } else {
                            $('#loan-peiPicture #btn_next').removeClass('btn_next');
                        }
                    }
                }
            }
        }, function (err) {
            showMsg(err);
        })
    },
    getImg: function (curParentObj) { //拍照
        Meap.media('camera', curParentObj.attr('picname'), function (msg) {
            //creditJson.isPrev.LLDBisFromPrev = false;
            loanImageAcquisition.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.find('.camera-pic').remove();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');
            var ele = $('.img_box:last').find('.rephoto').text();
            if (curParentObj.find('.cameraMul').length > 0 && ele != '选拍，可多张拍摄') { //如果是其他证明
                if(loan.isLoanMaster){
                    var htmlText = "";
                    htmlText += '<div class="img_box" style="position: relative;">' +
                        '<div class="customer customer_six" picname="qitazhengming">' +
                        '<div class="rephoto">选拍，可多张拍摄</div>' +
                        '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/>' +
                        '</div>' +
                        '<div class="img_notes qitazhengming" othername="qitazhengming">其他证明</div>' +
                        '<div class="qita-tanchuang-cbg"></div>' +
                        '<img src="../../images/crow_icon_win.png" class="crow_icon_win" />' +
                        '<div class="qita-tanchuang-con">' +
                        '<div class="queren-quxiao">' +
                        '<div class="quxiao-ok quxiao-click">取消</div>' +
                        '<div class="quxiao-ok queding-click">确定</div>' +
                        '</div>' +
                        '<ul class="qita-tanchuang-ul">' +
                        '<li othername="hukoubuPic">户口簿</li>' +
                        '<li othername="marryzhengming">婚姻证明</li>' +
                        '<li othername="canbaozhengming">参保证明</li>' +
                        '<li othername="shouruzhengmingM">工作收入证明</li>' +
                        '<li othername="zichanzhengmingM">资产证明</li>' +
                        '<li othername="bankstatements">银行对账单</li>' +
                        '<li othername="pingzhengPic">存折/卡复印件</li>' +
                        '<li othername="qitazhengming" class="qita-tanchuang-li">其他证明</li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';
                    $('.img_content').append(htmlText).trigger("create");
                }else{
                    var htmlText = "";
                    htmlText += '<div class="img_box" style="position: relative;">' +
                        '<div class="customer customer_six" picname="qitazhengming">' +
                        '<div class="rephoto">选拍，可多张拍摄</div>' +
                        '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/>' +
                        '</div>' +
                        '<div class="img_notes qitazhengming" othername="qitazhengming">其他证明</div>' +
                        '<div class="qita-tanchuang-cbg"></div>' +
                        '<img src="../../images/crow_icon_win.png" class="crow_icon_win" />' +
                        '<div class="qita-tanchuang-con">' +
                        '<div class="queren-quxiao">' +
                        '<div class="quxiao-ok quxiao-click">取消</div>' +
                        '<div class="quxiao-ok queding-click">确定</div>' +
                        '</div>' +
                        '<ul class="qita-tanchuang-ul">' +
                        '<li othername="hukoubuPic">户口簿</li>' +
                        '<li othername="marryzhengming">婚姻证明</li>' +
                        '<li othername="canbaozhengming">参保证明</li>' +
                        '<li othername="shouruzhengmingP">工作收入证明</li>' +
                        '<li othername="zichanzhengmingP">资产证明</li>' +
                        '<li othername="bankstatements">银行对账单</li>' +
                        '<li othername="pingzhengPic">存折/卡复印件</li>' +
                        '<li othername="qitazhengming" class="qita-tanchuang-li">其他证明</li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>';
                    $('.img_content').append(htmlText).trigger("create");
                }
            } else {

            }
            //监测下一步是否可点击
            var ind = 0;
            for (var i = 0; i < 4; i++) {
                if ($('.customer:eq(' + i + ')').find("img").length == 2) {
                    ind++;
                    if(loan.isLoanMaster){
                        if (ind >= 4) {
                            $('#loan-cusPicture #btn_next').addClass('btn_next');
                        } else {
                            $('#loan-cusPicture #btn_next').removeClass('btn_next');
                        }
                    }else{
                        if (ind >= 4) {
                            $('#loan-peiPicture #btn_next').addClass('btn_next');
                        } else {
                            $('#loan-peiPicture #btn_next').removeClass('btn_next');
                        }
                    }
                }
            }
        }, function (err) {
            showMsg(err);
        })
    },
    reGetImg: function (curParentObj, imgSrc) { //重拍
        if (curParentObj.parent().hasClass('get-face')) {
            faceDistinguish('trans', function (returnGetMsg) {
                if (loan.isLoanMaster) {
                    if (loan.mInfo.isTrue) {//存在主申请人信息
                        loan.mInfo.MGCompareFace = false;
                    }
                } else {
                    if (loan.gInfo.isTrue) {
                        loan.gInfo.MGCompareFace = false;
                    }
                }
                deletePhoto([imgSrc], function (returnDelMsg) {
                    loanImageAcquisition.imgSrc = returnGetMsg;
                    curParentObj.find('.camera-pic').attr('src', returnGetMsg);
                    $('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
                }, function (err) {

                })
            }, function (err) {
                showMsg('重拍失败');
            })
        } else {
            Meap.media('camera', curParentObj.attr('picname'), function (returnGetMsg) {
                //creditJson.isPrev.LLDBisFromPrev = false;
                imgSrc = curParentObj.find('.camera-pic').attr('src');
                deletePhoto([imgSrc], function (returnDelMsg) {
                    loanImageAcquisition.imgSrc = returnGetMsg;
                    curParentObj.find('.camera-pic').attr('src', returnGetMsg);
                    $('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
                }, function (err) {
                })
            }, function (err) {
                showMsg('重拍失败');
            })
        }

    },
    reviewImg: function (imgSrc) { //拍照预览
        $('.bigpic-review').html('<img src=' + imgSrc + ' height="100%">');
        $('.bigpic-review-box').show().animate({
            opacity: '1'
        }, 200);
    },
    reviewImgClose: function () { //关闭拍照预览
        $('.bigpic-review-box').animate({
            opacity: '0'
        }, 200, function () {
            $('.bigpic-review-box').hide()
        });
    }
};
/*影像采集-----主申请人*/
$(document).on("pageshow", '#loan-cusPicture', function () {
    if (loan.isPicturePage || workbenchJson.isTemp) {  //反显
        if (workbenchJson.isTemp) {
            loan.mInfo = {
                isTrue: false,
                cFileStr: [],//征信文件
                MGCompareFace: false
            };
            loan.gInfo = {
                isTrue: false,
                cFileStr: [],//征信文件
                MGCompareFace: false
            };
            tempORpreToPic(workbenchJson.temp);
            workbenchJson.temp = {};
        }
        workbenchJson.isTemp = false;
        $('.img_content .camera-pic').remove();
        var imgArr = [];
        var imgTypeArr = [];
        imgArr = loan.applicationObj.mPicFileARR;
        imgTypeArr = loan.applicationObj.mPicFileMsgType;
        $.each(imgArr, function (index, el) {
            if (index < 4 && el) {
                $('.img_box:eq(' + index + ') .customer').find('.camera-pic').remove();
                $('.img_box:eq(' + index + ') .customer').append('<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">');
                $('.img_box:eq(' + index + ') .rephoto').text('重拍');
                $('.img_box:eq(' + index + ') .camera').hide();
            } else {
                if (!el) return true;
                var activeEn = imgTypeArr[index - 4];
                $('<div class="img_box" style="position: relative;">' +
                    '<div class="customer customer_six" picName="' + activeEn + '">' +
                    '<div class="rephoto">重拍</div>' +
                    '<img class="camera cameraMul" src="../../images/ic_camera.png" alt="" style ="display:none"/>' +
                    '<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">' +
                    '</div>' +
                    '<div class="img_notes qitazhengming" othername="qitazhengming">其他证明</div>' +
                    '<div class="qita-tanchuang-cbg"></div>' +
                    '<img src="../../images/crow_icon_win.png" class="crow_icon_win" />' +
                    '<div class="qita-tanchuang-con">' +
                    '<div class="queren-quxiao">' +
                    '<div class="quxiao-ok quxiao-click">取消</div>' +
                    '<div class="quxiao-ok queding-click">确定</div>' +
                    '</div>' +
                    '<ul class="qita-tanchuang-ul">' +
                    '<li othername="hukoubuPic">户口簿</li>' +
                    '<li othername="marryzhengming">婚姻证明</li>' +
                    '<li othername="canbaozhengming">参保证明</li>' +
                    '<li othername="shouruzhengmingM">工作收入证明</li>' +
                    '<li othername="zichanzhengmingM">资产证明</li>' +
                    '<li othername="bankstatements">银行对账单</li>' +
                    '<li othername="pingzhengPic">存折/卡复印件</li>' +
                    '<li othername="qitazhengming">其他证明</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>').insertBefore('.img_box:last');
                var activeName = $('.img_box:last').find('li[othername="' + activeEn + '"]').text();
                $('.img_box:last').prev().find('.img_notes').attr('othername', activeEn).text(activeName);

            }
        });
        //监测下一步是否可点击
        var ind = 0;
        for (var i = 0; i < 4; i++) {
            if ($('#loan-cusPicture .customer:eq(' + i + ')').find("img").length == 2) {
                ind++;
                if (ind >= 4) {
                    $('#loan-cusPicture #btn_next').addClass('btn_next');
                } else {
                    $('#loan-cusPicture #btn_next').removeClass('btn_next');
                }
            }
        }
    } else if (commonJson.isCustermerInfoMultiplex) {  //影像复用
        $('.customer_four').attr('picname', 'F0001' + $('.customer_four').attr('picname'));
        $('.customer_five').attr('picname', 'F0001' + $('.customer_five').attr('picname'));
        queryTableDataByConditions({
            "databaseName": "myDatabase",
            "tableName": "customer_info",
            "conditions": {
                "SUBMITTIME": "between " + commonJson.submitTime + " and " + commonJson.submitTime
            }
        }, function (msg) {
            var CUSTANDCUSTOWNERPICBase64 = msg[0].CUSTANDCUSTOWNERPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');
            var FRONTIDCARDPICBase64 = msg[0].FRONTIDCARDPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');
            var BACKIDCARDPICBase64 = msg[0].BACKIDCARDPIC.replace(/\\/g, "").replace('data:image/png;base64,', '');

            //与客户合影base64转路径
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
            $('.img_box:eq(2) .rephoto,.img_box:eq(3) .rephoto').text('重拍');
            $('.img_box:eq(2) .camera,.img_box:eq(3) .camera').hide();
        }, function (err) {

        })
    }
    //点击其他证明
    $('#loan-cusPicture .conter-con').on('click', '.qitazhengming', function (ev) {
        if ($('.qita-tanchuang-con').css('display') == 'none') {
            loanImageAcquisition.curParentObj = $(this).siblings('.customer');
            $('.qita-tanchuang-ul').show().css('marginTop', '0');
            $(this).siblings('.qita-tanchuang-con').show();
            $(this).siblings('.crow_icon_win').show();
            $(this).siblings('.qita-tanchuang-cbg').show();
            var othername = $(this).attr('othername');
            $(this).siblings('.qita-tanchuang-con').find('li').removeClass('qita-tanchuang-li');
            $(this).siblings('.qita-tanchuang-con').find('li[othername=' + othername + ']').addClass('qita-tanchuang-li');
        }

    });
    $('#loan-cusPicture .conter-con').on('click', '.qita-tanchuang-ul>li', function (ev) {
        $(this).addClass('qita-tanchuang-li').siblings('li').removeClass('qita-tanchuang-li');
    });
    $('#loan-cusPicture .conter-con').on('click', '.quxiao-click', function (ev) { //点击取消关闭下拉框
        $('.qita-tanchuang-con').hide();
        $('.qita-tanchuang-cbg').hide();
        $('.crow_icon_win').hide();
    });
    $('#loan-cusPicture .conter-con').on('click', '.queding-click', function (ev) { //点击确认选择
        $('.qita-tanchuang-con').hide();
        $('.qita-tanchuang-cbg').hide();
        $('.crow_icon_win').hide();
        var textHtml = $(this).closest('.qita-tanchuang-con').find('li.qita-tanchuang-li').html();
        var othername = $(this).closest('.qita-tanchuang-con').find('li.qita-tanchuang-li').attr('othername');
        $(this).closest('.qita-tanchuang-con').siblings('.qitazhengming').html(textHtml).attr('othername', othername);
        if (loanImageAcquisition.curParentObj.attr('picname') != othername) {
            loanImageAcquisition.curParentObj.attr('picname', othername);
            if (loanImageAcquisition.curParentObj.find('.camera-pic').length > 0) {
                loanImageAcquisition.imgSrc = loanImageAcquisition.curParentObj.find('.camera-pic').attr('src');
                deletePhoto([loanImageAcquisition.imgSrc], function (msg) {
                    loanImageAcquisition.curParentObj.find('.camera-pic').remove();
                    loanImageAcquisition.curParentObj.find('.camera').show();
                    loanImageAcquisition.curParentObj.find('.rephoto').html('选拍，可多张拍摄');
                    //监测下一步是否可点击
                    var ind = 0;
                    for (var i = 0; i < 4; i++) {
                        if ($('#loan-cusPicture .customer:eq(' + i + ')').find("img").length == 2) {
                            ind++;
                            if (ind >= 4) {
                                $('#loan-cusPicture #btn_next').addClass('btn_next');
                            } else {
                                $('#loan-cusPicture #btn_next').removeClass('btn_next');
                            }
                        }
                    }
                }, function (err) {

                })
            }
        }
    });
    $('#loan-cusPicture .conter-con').on('click', '.customer', function (ev) {
        loanImageAcquisition.curParentObj = $(this);
        loanImageAcquisition.imgSrc = $(this).find('.camera-pic').attr('src');
        var oTarget = ev.target;
        if ($(this).find('.rephoto').html() == '重拍') { //重拍
            if ($(oTarget).hasClass('rephoto')) {
                loanImageAcquisition.reGetImg(loanImageAcquisition.curParentObj, loanImageAcquisition.imgSrc);
            }
            if ($(oTarget).hasClass('camera-pic')) { //预览大图
                loanImageAcquisition.imgSrc = $(oTarget).attr('src');
                loanImageAcquisition.reviewImg($(oTarget).attr('src'));
            }
            return;
        }
        //拍照
        if (loanImageAcquisition.curParentObj.parent().hasClass('get-face')) {
            loanImageAcquisition.getFace(loanImageAcquisition.curParentObj);
        } else {
            loanImageAcquisition.getImg(loanImageAcquisition.curParentObj);
        }

    });
    //预览大图 点击关闭
    $('.bigpic-review-close').click(function (event) {
        loanImageAcquisition.reviewImgClose();
    });
    //预览大图 删除图片
    $('.bigpic-review-del').click(function (event) {
        loanImageAcquisition.delImg(loanImageAcquisition.curParentObj, loanImageAcquisition.imgSrc);
    });
    //预览大图 重新拍照
    $('.bigpic-review-rephone').click(function (event) {
        loanImageAcquisition.reGetImg(loanImageAcquisition.curParentObj, loanImageAcquisition.imgSrc);
    });
    //点击采集配偶照片
    $('#loan-cusPicture .customerP-peiou').on('click', function () {
        loan.isPicturePage = true;
        loan.isLoanMaster = false; //配偶界面
        loan.applicationObj.custFacePic = $('#loan-cusPicture .img_box:eq(0) .camera-pic:eq(0)').attr('src'); //客户面部照片
        loan.applicationObj.custAndCustOwnerPic = $('#loan-cusPicture .img_box:eq(1) .camera-pic:eq(0)').attr('src'); //与客户合影照片
        loan.applicationObj.frontIDCardPic = $('#loan-cusPicture .img_box:eq(2) .camera-pic:eq(0)').attr('src'); //身份证正面
        loan.applicationObj.backIDCardPic = $('#loan-cusPicture .img_box:eq(3) .camera-pic:eq(0)').attr('src'); //身份证反面
        loan.applicationObj.mPicFileARR = []; //要打包的影像路径
        loan.applicationObj.mPicFileInfoARR = [{
            "b": []
        }]; //每个图片的名称和类型
        loan.applicationObj.mPicFileMsgType = []; //其他图片对象的证明类型
        loan.applicationObj.mPicFileARR.push(loan.applicationObj.custFacePic, loan.applicationObj.custAndCustOwnerPic, loan.applicationObj.frontIDCardPic, loan.applicationObj.backIDCardPic);
        var len = $('#loan-cusPicture .img_box').length;
        if (len - 4 > 0) {
            for (var i = 4; i < len; i++) {
                if ($('#loan-cusPicture .img_box:eq(' + i + ') .camera-pic').length > 0) {
                    loan.applicationObj.mPicFileARR.push($('#loan-cusPicture .img_box:eq(' + i + ') .camera-pic:eq(0)').attr('src'));
                    loan.applicationObj.mPicFileMsgType.push($('#loan-cusPicture .img_box:eq(' + i + ') .camera-pic:eq(0)').closest('.customer').attr('picname'));
                }
            }
        }
        $.each(loan.applicationObj.mPicFileARR, function (index, el) {
            if (!el) return true;
            var elIndex = el.lastIndexOf('\/') + 1;
            loan.applicationObj.mPicFileInfoARR[0].b.push({
                FILE_NAME: el.substring(elIndex),
                FILE_TYPE: 'F0000'
            });
        });
        if (loan.gInfo.isTrue) {
            $.mobile.changePage('./loan-peiPicture.html', {transition: "slide"});
        } else {
            $.mobile.changePage('./loan-reading.html', {transition: "slide"});
        }
    });
    //点击暂存
    $('#loan-cusPicture .customerP-zancun').on('click', function () {
        $(this).css('display','none');
        loan.applicationObj.mPicFileARR = []; //要打包的影像路径
        loan.applicationObj.mPicFileInfoARR = [{
            "b": []
        }]; //每个图片的名称和类型
        loan.applicationObj.mPicFileMsgType = []; //其他图片对象的证明类型
        cachePictureLoan(loan.applicationObj.mPicFileARR,loan.applicationObj.mPicFileInfoARR,loan.applicationObj.mPicFileMsgType,'#loan-cusPicture')
        loanZanCunPictureInfo('loan-cusPicture.html');
        $.mobile.changePage('../main.html', {reverse: true});
    });
    //点击上一步，跳转页面
//  $('.previous-con').on('click', function () {
//      $.mobile.changePage('./loan-reading.html', {reverse: true});
//  });//20160830删除上一步
    //点击下一步
    $('#btn_next').on('click', function () {
        if (!$(this).hasClass('btn_next')) return;
        loan.isPicturePage = true;
        loan.applicationObj.custFacePic = $('#loan-cusPicture .img_box:eq(0) .camera-pic:eq(0)').attr('src'); //客户面部照片
        loan.applicationObj.custAndCustOwnerPic = $('#loan-cusPicture .img_box:eq(1) .camera-pic:eq(0)').attr('src'); //与客户合影照片
        loan.applicationObj.frontIDCardPic = $('#loan-cusPicture .img_box:eq(2) .camera-pic:eq(0)').attr('src'); //身份证正面
        loan.applicationObj.backIDCardPic = $('#loan-cusPicture .img_box:eq(3) .camera-pic:eq(0)').attr('src'); //身份证反面
        loan.applicationObj.mPicFileARR = []; //要打包的影像路径
        loan.applicationObj.mPicFileInfoARR = [{
            "b": []
        }]; //每个图片的名称和类型
        loan.applicationObj.mPicFileMsgType = []; //其他图片对象的证明类型
        loan.applicationObj.mPicFileARR.push(loan.applicationObj.custFacePic, loan.applicationObj.custAndCustOwnerPic, loan.applicationObj.frontIDCardPic, loan.applicationObj.backIDCardPic);
        var len = $('#loan-cusPicture .img_box').length;
        if (len - 4 > 0) {
            for (var i = 4; i < len; i++) {
                if ($('#loan-cusPicture .img_box:eq(' + i + ') .camera-pic').length > 0) {
                    loan.applicationObj.mPicFileARR.push($('#loan-cusPicture .img_box:eq(' + i + ') .camera-pic:eq(0)').attr('src'));
                    loan.applicationObj.mPicFileMsgType.push($('#loan-cusPicture .img_box:eq(' + i + ') .camera-pic:eq(0)').closest('.customer').attr('picname'));
                }
            }
        }
        $.each(loan.applicationObj.mPicFileARR, function (index, el) {
            if (!el) return true;
            var elIndex = el.lastIndexOf('\/') + 1;
            loan.applicationObj.mPicFileInfoARR[0].b.push({
                FILE_NAME: el.substring(elIndex),
                FILE_TYPE: 'F0000'
            });
        });
        if (loan.mInfo.MGCompareFace == false) {  //不存在配偶信息 且主申请人没有进行人脸对比
            loan.MorG = 'm';
            $.mobile.changePage('./loan-personFace.html', {transition: "slide"});
        } else { //主申请人完成了联网核查
            $.mobile.changePage('./loan-cusInfo.html', {transition: "slide"});
        }
    })
});

/*影像采集-----配偶*/
$(document).on("pageshow", '#loan-peiPicture', function () {
    if (loan.ispeiPicturePage || workbenchJson.isTemp) {  //反显
        if (workbenchJson.isTemp) {
            loan.mInfo = {
                isTrue: false,
                cFileStr: [],//征信文件
                MGCompareFace: false
            };
            loan.gInfo = {
                isTrue: false,
                cFileStr: [],//征信文件
                MGCompareFace: false
            };
            tempORpreToPic(workbenchJson.temp);
            workbenchJson.temp = {};
        }
        workbenchJson.isTemp = false;
        $('.img_content .camera-pic').remove();
        var imgArr = [];
        var imgTypeArr = [];
        imgArr = loan.applicationObj.gPicFileARR;
        imgTypeArr = loan.applicationObj.gPicFileMsgType;
        $.each(imgArr, function (index, el) {
            if (index < 4 && el) {
                $('.img_box:eq(' + index + ') .customer').find('.camera-pic').remove();
                $('.img_box:eq(' + index + ') .customer').append('<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">');
                $('.img_box:eq(' + index + ') .rephoto').text('重拍');
                $('.img_box:eq(' + index + ') .camera').hide();
            } else {
                if (!el) return true;
                var activeEn = imgTypeArr[index - 4];
                $('<div class="img_box" style="position: relative;">' +
                    '<div class="customer customer_six" picName="' + activeEn + '">' +
                    '<div class="rephoto">重拍</div>' +
                    '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/ style ="display:none">' +
                    '<img src="' + el.replace(/\\/g, "") + '" width="100%" height="115px" class="camera-pic">' +
                    '</div>' +
                    '<div class="img_notes qitazhengming" othername="qitazhengming">其他证明</div>' +
                    '<div class="qita-tanchuang-cbg"></div>' +
                    '<img src="../../images/crow_icon_win.png" class="crow_icon_win" />' +
                    '<div class="qita-tanchuang-con">' +
                    '<div class="queren-quxiao">' +
                    '<div class="quxiao-ok quxiao-click">取消</div>' +
                    '<div class="quxiao-ok queding-click">确定</div>' +
                    '</div>' +
                    '<ul class="qita-tanchuang-ul">' +
                    '<li othername="hukoubuPic">户口簿</li>' +
                    '<li othername="marryzhengming">婚姻证明</li>' +
                    '<li othername="canbaozhengming">参保证明</li>' +
                    '<li othername="shouruzhengmingP">工作收入证明</li>' +
                    '<li othername="zichanzhengmingP">资产证明</li>' +
                    '<li othername="bankstatements">银行对账单</li>' +
                    '<li othername="pingzhengPic">存折/卡复印件</li>' +
                    '<li othername="qitazhengming">其他证明</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>').insertBefore('.img_box:last');
                var activeName = $('.img_box:last').find('li[othername="' + activeEn + '"]').text();
                $('.img_box:last').prev().find('.img_notes').attr('othername', activeEn).text(activeName);

            }
        });
        //监测下一步是否可点击
        var ind = 0;
        for (var i = 0; i < 4; i++) {
            if ($('#loan-peiPicture .customer:eq(' + i + ')').find("img").length == 2) {
                ind++;
                if (ind >= 4) {
                    $('#loan-peiPicture #btn_next').addClass('btn_next');
                } else {
                    $('#loan-peiPicture #btn_next').removeClass('btn_next');
                }
            }
        }
    }
    //点击其他证明
    $('#loan-peiPicture .conter-con').on('click', '.qitazhengming', function (ev) {
        if ($('.qita-tanchuang-con').css('display') == 'none') {
            loanImageAcquisition.curParentObj = $(this).siblings('.customer');
            $('.qita-tanchuang-ul').show().css('marginTop', '0');
            $(this).siblings('.qita-tanchuang-con').show();
            $(this).siblings('.crow_icon_win').show();
            $(this).siblings('.qita-tanchuang-cbg').show();
            var othername = $(this).attr('othername');
            $(this).siblings('.qita-tanchuang-con').find('li').removeClass('qita-tanchuang-li');
            $(this).siblings('.qita-tanchuang-con').find('li[othername=' + othername + ']').addClass('qita-tanchuang-li');
        }

    });
    $('#loan-peiPicture .conter-con').on('click', '.qita-tanchuang-ul>li', function (ev) {
        $(this).addClass('qita-tanchuang-li').siblings('li').removeClass('qita-tanchuang-li');
    });
    $('#loan-peiPicture .conter-con').on('click', '.quxiao-click', function (ev) { //点击取消关闭下拉框
        $('.qita-tanchuang-con').hide();
        $('.qita-tanchuang-cbg').hide();
        $('.crow_icon_win').hide();
    });
    $('#loan-peiPicture .conter-con').on('click', '.queding-click', function (ev) { //点击确认选择
        $('.qita-tanchuang-con').hide();
        $('.qita-tanchuang-cbg').hide();
        $('.crow_icon_win').hide();
        var textHtml = $(this).closest('.qita-tanchuang-con').find('li.qita-tanchuang-li').html();
        var othername = $(this).closest('.qita-tanchuang-con').find('li.qita-tanchuang-li').attr('othername');
        $(this).closest('.qita-tanchuang-con').siblings('.qitazhengming').html(textHtml).attr('othername', othername);
        if (loanImageAcquisition.curParentObj.attr('picname') != othername) {
            loanImageAcquisition.curParentObj.attr('picname', othername);
            if (loanImageAcquisition.curParentObj.find('.camera-pic').length > 0) {
                loanImageAcquisition.imgSrc = loanImageAcquisition.curParentObj.find('.camera-pic').attr('src');
                deletePhoto([loanImageAcquisition.imgSrc], function (msg) {
                    loanImageAcquisition.curParentObj.find('.camera-pic').remove();
                    loanImageAcquisition.curParentObj.find('.camera').show();
                    loanImageAcquisition.curParentObj.find('.rephoto').html('选拍，可多张拍摄');
                    //监测下一步是否可点击
                    var ind = 0;
                    for (var i = 0; i < 4; i++) {
                        if ($('#loan-peiPicture .customer:eq(' + i + ')').find("img").length == 2) {
                            ind++;
                            if (ind >= 4) {
                                $('#loan-peiPicture #btn_next').addClass('btn_next');
                            } else {
                                $('#loan-peiPicture #btn_next').removeClass('btn_next');
                            }
                        }
                    }
                }, function (err) {

                })
            }


            //creditImageAcquisition.reGetImg(creditImageAcquisition.curParentObj, creditImageAcquisition.imgSrc);
        }
    });
    $('#loan-peiPicture .conter-con').on('click', '.customer', function (ev) {
        loanImageAcquisition.curParentObj = $(this);
        loanImageAcquisition.imgSrc = $(this).find('.camera-pic').attr('src');
        var oTarget = ev.target;
        if ($(this).find('.rephoto').html() == '重拍') { //重拍
            if ($(oTarget).hasClass('rephoto')) {
                loanImageAcquisition.reGetImg(loanImageAcquisition.curParentObj, loanImageAcquisition.imgSrc);
            }
            if ($(oTarget).hasClass('camera-pic')) { //预览大图
                loanImageAcquisition.imgSrc = $(oTarget).attr('src');
                loanImageAcquisition.reviewImg($(oTarget).attr('src'));
            }
            return;
        }
        //拍照
        if (loanImageAcquisition.curParentObj.parent().hasClass('get-face')) {
            loanImageAcquisition.getFace(loanImageAcquisition.curParentObj);
        } else {
            loanImageAcquisition.getImg(loanImageAcquisition.curParentObj);
        }

    });
    //预览大图 点击关闭
    $('.bigpic-review-close').click(function (event) {
        loanImageAcquisition.reviewImgClose();
    });
    //预览大图 删除图片
    $('.bigpic-review-del').click(function (event) {
        loanImageAcquisition.delImg(loanImageAcquisition.curParentObj, loanImageAcquisition.imgSrc);
    });
    //预览大图 重新拍照
    $('.bigpic-review-rephone').click(function (event) {
        loanImageAcquisition.reGetImg(loanImageAcquisition.curParentObj, loanImageAcquisition.imgSrc);
    });
    //点击上一步，跳转页面
    $('.previous-con').on('click', function () {
        loan.ispeiPicturePage = false;
        $.mobile.changePage('./loan-reading.html', {
            reverse: true
        });
    });
    //点击暂存
    $('#loan-peiPicture .customerP-zancun').on('click', function () {
        $(this).css('display','none');
        loan.applicationObj.gPicFileARR = []; //要打包的影像路径
        loan.applicationObj.gPicFileInfoARR = [{
            "b": []
        }]; //每个图片的名称和类型
        loan.applicationObj.gPicFileMsgType = []; //其他图片对象的证明类型
        cachePictureLoan(loan.applicationObj.gPicFileARR,loan.applicationObj.gPicFileInfoARR,loan.applicationObj.gPicFileMsgType,'#loan-peiPicture');
        loanZanCunPictureInfo('loan-peiPicture.html');
        $.mobile.changePage('../main.html', {reverse: true});
    });
    //点击下一步
    $('#btn_next').on('click', function () {
        if (!$(this).hasClass('btn_next')) return;
        loan.ispeiPicturePage = true;
        loan.applicationObj.custFacePic = $('#loan-peiPicture .img_box:eq(0) .camera-pic:eq(0)').attr('src'); //客户面部照片
        loan.applicationObj.custAndCustOwnerPic = $('#loan-peiPicture .img_box:eq(1) .camera-pic:eq(0)').attr('src'); //与客户合影照片
        loan.applicationObj.frontIDCardPic = $('#loan-peiPicture .img_box:eq(2) .camera-pic:eq(0)').attr('src'); //身份证正面
        loan.applicationObj.backIDCardPic = $('#loan-peiPicture .img_box:eq(3) .camera-pic:eq(0)').attr('src'); //身份证反面
        loan.applicationObj.gPicFileARR = []; //要打包的影像路径
        loan.applicationObj.gPicFileInfoARR = [{
            "b": []
        }]; //每个图片的名称和类型
        loan.applicationObj.gPicFileMsgType = []; //其他图片对象的证明类型
        loan.applicationObj.gPicFileARR.push(loan.applicationObj.custFacePic, loan.applicationObj.custAndCustOwnerPic, loan.applicationObj.frontIDCardPic, loan.applicationObj.backIDCardPic);
        var len = $('#loan-peiPicture .img_box').length;
        if (len - 4 > 0) {
            for (var i = 4; i < len; i++) {
                if ($('#loan-peiPicture .img_box:eq(' + i + ') .camera-pic').length > 0) {
                    loan.applicationObj.gPicFileARR.push($('#loan-peiPicture .img_box:eq(' + i + ') .camera-pic:eq(0)').attr('src'));
                    loan.applicationObj.gPicFileMsgType.push($('#loan-peiPicture .img_box:eq(' + i + ') .camera-pic:eq(0)').closest('.customer').attr('picname'));
                }
            }
        }
        $.each(loan.applicationObj.gPicFileARR, function (index, el) {
            if (!el) return true;
            var elIndex = el.lastIndexOf('\/') + 1;
            loan.applicationObj.gPicFileInfoARR[0].b.push({
                FILE_NAME: el.substring(elIndex),
                FILE_TYPE: 'F0000'
            });
        });
        if (loan.gInfo.MGCompareFace == false) {  //说明 存在配偶信息 && 配偶没有进行人脸对比 && 主申请人没有进行人脸对比
            loan.MorG = 'g';
            $.mobile.changePage('./loan-peiFace.html', {transition: "slide"});
        } else {
            loan.isLoanMaster = true;
            $.mobile.changePage('./loan-cusPicture.html', {transition: "slide"});
        }
    })
});
/*人脸对比 -----主申请人*/
$(document).on("pageshow", '#loan-personFace', function () {
    $("#loan-personFace .camera:eq(0)").attr('src', loan.applicationObj.mPicFileARR[0]);
    $("#loan-personFace .camera:eq(1)").attr('src', loan.mInfo.image);
    $("#loan-personFace .camera:eq(2)").attr('src', loan.applicationObj.mPicFileARR[0]);
    $("#loan-personFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + loan.mInfo.lianPic);
    //点击继续
    $('#loan-personFace .previous:last').on('click', function () {
        if ($(this).hasClass('btn_next')) {
            var faceRecogn = '';
            if ($("#loan-personFace .face-result:eq(0)").text() == '通过' && $("#loan-personFace .face-result:eq(1)").text() == '通过') {
                faceRecogn = '1'; //自动通过
            } else {
                faceRecogn = '5'; //手动通过
            }
            loan.isLoanMaster = true;
            loan.mInfo.faceRecogn = faceRecogn;
            loan.mInfo.MGCompareFace = true;
            $.mobile.changePage('loan-cusInfo.html');
        }
    });
    //点击F放弃
    $('#loan-personFace .previous:first').on('click', function () {
        loan.mInfo.MGCompareFace = false;
        loan.isLoanMaster = true;
        loan.mInfo.faceRecogn = '6'; //手动不通过
        $.mobile.changePage('loan-cusPicture.html', {reverse: true});
    });
    if (loan.mInfo.MGCompareFace == false) {

        ifacelRecognitionSeMGFun(loan.applicationObj.mPicFileARR[0],loan.mInfo,loan);
    }
});
/*人脸对比 -----配偶*/
$(document).on("pageshow", '#loan-peiFace', function () {
    $("#loan-peiFace .camera:eq(0)").attr('src', loan.applicationObj.gPicFileARR[0]);
    $("#loan-peiFace .camera:eq(1)").attr('src', loan.gInfo.image);
    $("#loan-peiFace .camera:eq(2)").attr('src', loan.applicationObj.gPicFileARR[0]);
    $("#loan-peiFace .camera:eq(3)").attr('src', 'data:image/png;base64,' + loan.gInfo.lianPic);
    //点击继续
    $('#loan-peiFace .previous:last').on('click', function () {
        if ($(this).hasClass('btn_next')) {
            var faceRecogn = '';
            if ($("#loan-peiFace .face-result:eq(0)").text() == '通过' && $("#loan-peiFace .face-result:eq(1)").text() == '通过') {
                faceRecogn = '1'; //自动通过
            }else {
                faceRecogn = '5'; //手动通过
            }
            loan.isLoanMaster = true;
            loan.gInfo.faceRecogn = faceRecogn;
            loan.gInfo.MGCompareFace = true;
            $.mobile.changePage('loan-cusPicture.html');
        }
    });
    //点击F放弃
    $('#loan-peiFace .previous:first').on('click', function () {
        loan.gInfo.MGCompareFace = false;
        loan.isLoanMaster = false;
        loan.gInfo.faceRecogn = '6'; //手动不通过
        $.mobile.changePage('loan-peiPicture.html', {reverse: true});
    });
    if (loan.gInfo.MGCompareFace == false) {
        ifacelRecognitionSeMGFun(loan.applicationObj.gPicFileARR[0],loan.gInfo,loan);
    }
});

/*选择卡账号*/
//$(document).on("pageshow", '#loan-cardAccount', function () {
//    //点击上一步，跳转页面
//    $('.previous-con').on('click', function () {
//        $.mobile.changePage('./loan-cusPicture.html', {
//            reverse: true
//        });
//    });
//    //点击下一步
//    $('#btn_next').on('click', function () {
//        if (!$(this).hasClass('btn_next')) return;
//        $.mobile.changePage('./loan-cusInfo.html', {
//            reverse: true
//        });
//    });
//});

/*贷款信息录入界面*/
$(document).on("pageshow", '#loan-cusInfo', function () {
    loan.buildAdd = '';
    _init_area(); //三级联动
    if (loan.inputLogo || workbenchJson.isTemp) {
        //显示信息  还原数据
        if (workbenchJson.isTemp) {
            loan.mInfo = {
                isTrue: false,
                cFileStr: [],//征信文件
                MGCompareFace: false
            };
            loan.gInfo = {
                isTrue: false,
                cFileStr: [],//征信文件
                MGCompareFace: false
            };
            loan.dzd = [];
            loan.fdzd = [];
            tempORpreToObject(workbenchJson.temp);
        }
        loan.isPicturePage = true;
        loan.ispeiPicturePage = true;
        workbenchJson.isTemp = false;
        buildingAndaccountSelect(loan.buildArr, loan.accountArr);
        objcontentToPage();
    } else {
        loan.inputLogo = true;
        showLoader("客户信息查询中...");
        //=======================================================
        var bodyJSon = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "IDTYPE.s": '0',//证件类型
                "IDNO.s": loan.mInfo.cerNO,//证件号码
                "CLIENT_TYPE.s": "P", //N单位 P个人
                "CLIENT_NO.s": loan.mCLIENT_NO, //客户号
                "AGENT_FLAG.s": "" //法人代表
            }]
        };
        queryLoanCustomerInfoConF(bodyJSon);
    }
    // document.getElementById('dwellYear').valueAsDate = new Date();   //何时来本地初始化为当天时间
    if (false == loan.gInfo.isTrue) {         //说明 配偶信息存在
        $('#loan-cusInfo .navigation li:eq(1)').addClass('grayColor');
    } else {
        $('.info-enter-item:eq(1) span:eq(0)').html(loan.gInfo.name); //主  姓名
        $('.info-enter-item:eq(1) span:eq(1)').html(loan.gInfo.sex); //主  性别
        $('.info-enter-item:eq(1) span:eq(2)').html('身份证'); //主  证件类型
        $('.info-enter-item:eq(1) span:eq(3)').html(loan.gInfo.cerNO); //主  证件号码
        // $('.input-test:eq(20) option:selected').val('1').selectmenu('refresh');
    }
    $('.information-result:eq(0) span').html(loan.mInfo.name); //主  姓名
    $('.information-result:eq(1) span').html(loan.mInfo.sex); //主  性别
    $('.information-result:eq(2) span').html('身份证'); //主  证件类型
    $('.information-result:eq(3) span').html(loan.mInfo.cerNO); //主  证件号码

    //左侧菜单切换
    $(".navigation>li").on("click", function () {
        if ($(this).index() == 1) {  //点击主卡申请人配偶信息栏
            $('#loan-cusInfo .zhengxin').hide();
            if ($(this).hasClass('grayColor')) {
                //$('#loan-cusInfo .dzd').hide();
                return;
            } else {
                $('#loan-cusInfo .dzd').show();
            }
        } else if ($(this).index() == 2) {
            $('#loan-cusInfo .dzd').hide();
            $('#loan-cusInfo .zhengxin').hide();
        } else if ($(this).index() == 0) {
            $('#loan-cusInfo .dzd').show();
            $('#loan-cusInfo .zhengxin').show();
        }
        var navigation = $('.navigation li').index($(this));
        $(this).addClass("change-bg").siblings("li").removeClass("change-bg");
        $('.information-input ul').eq(navigation).addClass('showOrHide').siblings('ul').removeClass('showOrHide');
    });
    //点击打开选择征信报告
    $('#loan-cusInfo .zhengxin').on('click', function () {
        showLoader("征信报告查询中...");
        var inquiryDate = dateGetYMD(30);//查询30天的征信文件
        var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "inquiryDateMin.s": dateYYYYMMDD(inquiryDate[1]),    //申请日期开始
                "inquiryDateMax.s": dateYYYYMMDD(inquiryDate[0]),      //申请日期结束
                "name.s": loan.mInfo.name, //姓名
                "certNum.s": loan.mInfo.cerNO,  //证件号码
                "status.s": '1,3',   //状态(成功和不需查询征信报告)
                "page.s": '' ,    //页码
                "username.s":'',
                'creditType.s': '',	//征信类型
	            'supplementInd.s': '' //是否允许补查
            }]
        };
        findCreditReportInquiryFun(sendJson, function (msg) {
            loanFindCreditReportInquirySucc(msg);
        }, function (err) {
            hideLoader();
            funFail(err);
        });
    });
    //点击选择征信报告页面  放弃按钮
    $('.searchCredit a:first').on('click', function () {
        $("#loan-cusInfo .searchCredit").hide();
    });
    //点击选择征信报告页面  确认按钮
    $('.searchCredit a:last').on('click', function () {
        loan.mInfo.cFileStr = [];
        $('.searchCredit ul>li[sel=true]').each(function (index, ele) {
            loan.mInfo.cFileStr.push($(ele).data('creditInfo'));
        });
        $("#loan-cusInfo .searchCredit").hide();
    });
    //点击查看征信报告链接
    $('.searchCredit ul').on('tap', 'u', function () {
        loan.creditInfo = $(this).closest('li').data('creditInfo');
        loan.creditReferPath = loan.creditInfo.creditReferPath;
        openCreditReportFile(loan, 'F0005');
    });
    //点击打开选择对账单
    $('#loan-cusInfo .dzd').on('click', function () {
        var indexNum = $(".navigation>li").index($(".navigation>li.change-bg"));
        showLoader("对账单查询中...");
        var inquiryDate = dateGetYMD(30);//查询30天的对账单文件
        var sendJson = {
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "inquiryDateMin.s": dateYYYYMMDD(inquiryDate[1]),  //查询日期时间
                "inquiryDateMax.s": dateYYYYMMDD(inquiryDate[0]),   //查询日期时间
                "name.s": loan.mInfo.name,//姓名
                "certNum.s": loan.mInfo.cerNO,//证件号码
                "account.s": '',//账号
                "status.s": '1',//状态
                "page.s": ''//页码
            }]
        };
        if (loan.gInfo.isTrue && indexNum == 1) {
            sendJson.b[0]['name.s'] = loan.gInfo.name;
            sendJson.b[0]['certNum.s'] = loan.gInfo.cerNO;
            // loan.fdzd = [];
        }else{
            // loan.dzd = [];
        }
        findStatementConF(sendJson, findStatementMainSucc);
    });
    //点击选择对账单页面  放弃按钮
    $('.searchBank a:first').on('click', function () {
        $("#loan-cusInfo .searchBank").hide();
    });
    //点击选择对账单页面  确认按钮
    $('.searchBank a:last').on('click', function () {
        var indexNum = $(".navigation>li").index($(".navigation>li.change-bg"));
        if (loan.gInfo.isTrue && indexNum == 1) {
            loan.fdzd = [];
        } else {
            loan.dzd = [];
        }
        $('.searchBank ul>li').each(function (index, ele) {
            if (loan.gInfo.isTrue && indexNum == 1) {
                if ($(this).attr('sel') == 'true') {
                    loan.fdzd.push($(this).attr('creditReferPath'));
                }
            } else {
                if ($(this).attr('sel') == 'true') {
                    loan.dzd.push($(this).attr('creditReferPath'));
                }
            }
        });
        $("#loan-cusInfo .searchBank").hide();
    });
    //点击查看对账单链接
    $('.searchBank ul').on('tap', 'u', function () {
        loan.creditReferPath = $(this).closest('li').attr('creditReferPath');
        getFileDataAndOpen(loan, 'F0010');
    });
    //点击资料清单
    $('#loan-cusInfo .zq').bind('click', function () {
        var maritalStatus = $('#maritalStatus').val();  //婚姻状况
        $('#loan-cusInfo .search-weihu .wei-con').html(findDataListFun(maritalStatus, '0'));
        $("#loan-cusInfo .search-weihu").show();
    });
    //点击关闭资料清单
    $("#loan-cusInfo .search-weihu a").on('click', function () {
        $("#loan-cusInfo .search-weihu").hide();
    });
    //点击项目维护
    $('#loan-cusInfo .weiHu').on('click', function () {
        showLoader("楼盘查询中...");
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号 4
                "tranId.s": loan.tranId, //交易编号   2
                "operatorNo.s": commonJson.adminCount, //操作员  admin
                "deviceNo.s": commonJson.udId, //设备编号       ""
                "orgId.s": commonJson.orgId,
                "summary.s": ''//楼盘名称 模糊查询
            }]
        };
        findBuildingInfoConF(sendJson, findBuildingInfoSucc);
    });
    //点击关闭项目维护
    $('#loan-cusInfo .searchHu a:eq(0)').on('click', function () {
        $('.input-test-con:eq(14)').val('');
        $("#loan-cusInfo .searchHu").hide();
    });
    //点击进入LOS系统
    $('#loan-cusInfo .searchHu a:eq(1)').on('click', function () {
        $("#loan-cusInfo .searchHu").hide();
        showLoader('系统数据同步中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号 4
                "tranId.s": loan.tranId, //交易编号   2
                "operatorNo.s": commonJson.adminCount, //操作员  admin
                "deviceNo.s": commonJson.udId, //设备编号       ""
                "orgId.s": commonJson.orgId,
                "summary.s": ''//楼盘名称 模糊查询
            }]
        };
        seekBuildingInfoConF(sendJson);
    });
    //点击从LOS系统 关闭
    $('#loan-cusInfo .searchLos a').on('click', function () {
        $("#loan-cusInfo .searchLos").hide();
        $("#loan-cusInfo .searchHu").show();
    });
    //点击Los系统 搜索按钮
    $('#loan-cusInfo .searchLos .seach-botton:eq(0)').on('click', function () {
        var summary = '';
        if ($('.head-seach-input').val() != '') {
            summary = $('.head-seach-input').val();
        }
        showLoader('系统数据同步中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号 4
                "tranId.s": loan.tranId, //交易编号   2
                "operatorNo.s": commonJson.adminCount, //操作员  admin
                "deviceNo.s": commonJson.udId, //设备编号       ""
                "orgId.s": commonJson.orgId,
                "summary.s": summary//楼盘名称 模糊查询
            }]
        };
        seekBuildingInfoConF(sendJson);
    });
    //点击添加楼盘按钮
    $('#loan-cusInfo .searchHu a:eq(2)').on('click', function () {
        $('#seach-day-con .input-test-con:eq(0)').val('');
        $("#loan-cusInfo .searchHu").hide();
        $("#seach-day-con").show();
        $("#s_province-button span").html('广东省');
        $("#s_province").val('广东省').selectmenu('refresh');
        change(1, 0);
        $("#s_city-button span").html('深圳市');
        $("#s_city").val('深圳市').selectmenu('refresh');
        change(2, 0);
        $('#seach-day-con .input-test-con:eq(1)').val('');
        $('#seach-day-con .input-test-con:eq(2)').val('');
    });
    //点击项目维护 删除
    $('#loan-cusInfo .searchHu a:eq(3)').on('click', function () {
        if (!$('#loan-cusInfo .searchHu ul>li').hasClass('list-bgcolor')) {
            return;
        }
        //$("#loan-cusInfo .searchHu").hide();
        showTags({
            'title': '提示',
            'content': '确认删除?',
            'ok': {
                'title': '放弃',
                'fun': function () {
                }
            },
            'cancel': {
                'title': '确认',
                'fun': function () {
                    showLoader("楼盘信息删除中...");
                    var sendJson = {
                        "b": [{
                            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                            "workAddress.s": commonJson.workAddress,//工作地址
                            "moduleId.s": loan.moduleId, //模块编号 4
                            "tranId.s": loan.tranId, //交易编号   2
                            "operatorNo.s": commonJson.adminCount, //操作员  admin
                            "deviceNo.s": commonJson.udId, //设备编号       ""
                            "orgId.s": commonJson.orgId,
                            "id.s": $('#loan-cusInfo .searchHu ul>li.list-bgcolor').attr('buildingId')//序号
                        }]
                    };
                    deleteBuildingInfoConF(sendJson);
                }
            }
        });
    });
    //点击项目维护 使用
    $('#loan-cusInfo .searchHu a:eq(4)').on('click', function () {
        if (!$('#loan-cusInfo .searchHu ul>li').hasClass('list-bgcolor')) {
            return;
        }
        $('.info-enter-item:eq(2)').find('input:eq(0)').val($('.searchHu li.list-bgcolor').attr('address'));
        $('#buildingInfoId').val($('.searchHu li.list-bgcolor').attr('buildingId')).selectmenu('refresh');
        $("#loan-cusInfo .searchHu").hide();
    });
    //点击添加楼盘 添加按钮
    $('#loan-cusInfo #seach-day-con .fangqi-seach:eq(1)').on('click', function () {
        //校验字段的输入
        loan.buildPro = $('#seach-day-con .input-test-con:eq(0)').val();
        loan.buildAdd = '';
        if (loan.buildPro == '') {
            showMsg('请填写楼盘名称！');
            return;
        }
        var s_province ='',
            s_city ='',
            s_county = '';
        if($('#s_province option:selected').html() != '省份'){
            s_province = $('#s_province option:selected').val();
        }
        if($('#s_city option:selected').html() != '城市'){
            s_city = $('#s_city option:selected').val();
        }
        if($('#s_county option:selected').html() != '区/县级市'){
            s_county = $('#s_county option:selected').val()
        }
        if(s_province =='广东省' && s_city =='深圳市'){
            loan.buildAdd = s_county;
        }else{
            loan.buildAdd = s_province + s_city + s_county;
        }
        if ($('#seach-day-con .input-test-con:eq(1)').val() == '') {
            showMsg('请填写房屋详细地址！');
            return;
        }
        loan.developer = $('#seach-day-con .input-test-con:eq(2)').val();
        if (loan.developer == '') {
            showMsg('请填写楼盘的开发商！');
            return;
        }
        loan.buildAdd += $('#seach-day-con .input-test-con:eq(1)').val();
        $("#seach-day-con").hide();
        showLoader('楼盘项目添加中...');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "summary.s": loan.buildPro, //楼盘项目
                "address.s": loan.buildAdd,// 地址
                "developers.s": loan.developer,//开发商
                "relativeAgreement.s": ''//第三方额度号
            }]
        };
        insertBuildingInfoConF(sendJson);
    });
    //点击添加楼盘 放弃
    $('#loan-cusInfo #seach-day-con .fangqi-seach:eq(0)').on('click', function () {
        $("#seach-day-con").hide();
        $("#loan-cusInfo .searchHu").show();
        $('#seach-day-con .input-test-con:eq(0)').val('');
        $('#seach-day-con .input-test-con:eq(1)').val('');
        $('#seach-day-con .input-test-con:eq(2)').val('');
    });
    //点击 同现住址
    $('.tzh').on('click', function () {
        if(loan.resource == '3' && loan.organCode !='' && commonJson.superOrgId != loan.organCode){
           return ;
        }
        var textCon = $('.input-test-con:eq(6)').val();
        $('.input-test-con:eq(7)').val(textCon);
    });
    //点击上一步，跳转页面
    $('#loan-cusInfo>div.footter .back-1').on('click', function () {
        //loan.inputLogo = true;
        getInputSelectValue();
        buildingInputValue();
        loan.isLoanMaster = true;
        $.mobile.changePage('./loan-cusPicture.html', {reverse: true});
    });
    //点击回显房屋地址
    $('#buildingInfoId').change(function () {
        var addr = $('#buildingInfoId option:selected').attr('address');
        $('.credit-card-show .input-test-con:eq(0)').val(addr);
    });
    // 房屋总价 面积 ----->房屋单价
    $('.area-money').bind('blur', function () {
        var _valA = $('.area-money').eq(0).val().replace(/[^0-9\.]/ig, "");
        var _valB = $('.area-money').eq(1).val().replace(/[^0-9\.]/ig, "");
        if($(this).hasClass('totalMoney')){         //房屋总价
            $('.area-money').eq(0).val(fmoney(_valA));
        }else{          //建筑面积
            if(_valB == '' || Number(_valB) == 0){
                $('.area-money').eq(1).val('');
            }else{
                $('.area-money').eq(1).val(Number(_valB).toFixed(2));
            }
        }
        var amount = rmoney($('.area-money').eq(0).val());
        var area = rmoney($('.area-money').eq(1).val());
        if (amount != '' && area != '') {
            var money = fmoney(division(amount, area));
            $('.unitMoney').val(money);
        } else {
            $('.unitMoney').val('');
        }
        var moneyS = rmoney($('.moneyAS').eq(1).val());
        if (moneyS != '') {
            var moneyJ =  ((Number(rmoney($('.totalMoney').val()))*100) - (Number(moneyS)*100))/100;
            if(moneyJ <0){
                $('.moneyJ').val('');
            }else{
                $('.moneyJ').val(fmoney(moneyJ));
            }
        } else {
            $('.moneyJ').val('');
        }
    });
    // 房屋单价
    $('.unitMoney').bind('blur', function () {
        var _val = $('.unitMoney').val().replace(/[^0-9\.]/ig, "");
        $('.unitMoney').val(fmoney(_val));
    });
    //借款金额
    $('.moneyAS').bind('blur', function () {
        var _valA = $('.totalMoney').val().replace(/[^0-9\.]/ig, "");
        var _valB = $('.moneyAS').eq(1).val().replace(/[^0-9\.]/ig, "");
        $('.totalMoney').val(fmoney(_valA));
        $('.moneyAS').eq(1).val(fmoney(_valB));
        var totalMoney = rmoney($('.totalMoney').val());
        var moneyS = rmoney($('.moneyAS').eq(1).val());
        if (totalMoney != '' && moneyS != '') {
            var money = Number(totalMoney) - Number(moneyS);
            if(money <0){
                $('.moneyJ').val('');
            }else{
                $('.moneyJ').val(fmoney(money));
            }
        } else {
            $('.moneyJ').val('');
        }
    });
    $('.moneyFocus').on('tap', function () {
        $(this).focus();
        var _val = $(this).val();
        $(this).val(rmoney(_val));
    });
    $('.moneyBlur').on('blur', function () {
        var mnum = $('.moneyBlur').index($(this));
        if($(this).val().indexOf('-') != -1){
            $(this).val('')
        }else{
            var _val = $(this).val().replace(/[^0-9\.]/ig, "");
            if(mnum == '1' && Number(_val) == 0){
                $(this).val('0.00');
                return;
            }
            $(this).val(fmoney(_val));
        }
    });
    //点击暂存
    $('#loan-cusInfo .zancun').on('click', function () {
        $(this).css('display','none');
        loanZanCunCustermerInfo();
        $.mobile.changePage('../main.html', {reverse: true});
    });
    //点击下一步
    $('#btn_next').on('click', function () {
        if (!$(this).hasClass('btn_next')) return;
        //是否为空验证
        var num = 0; //纪录为空或者格式不正确的个数
        $('#loan-cusInfo .conter-con input[type="text"]').each(function (index, el) {
            if (!loan.gInfo.isTrue && $(this).closest('#spouse').length == 1) {
                return;
            }
            //if(loan.resource ==3){
                if (index == '2' || index == '3') {
                    return true;
                }
            //}else{
            //    if (index == '2' || index == '3') {
            //        return true;
            //    }
            //}

            var eqIndex = $(this).closest('.info-enter-item').index();
            if ($.trim($(this).val()) == '') {
                num++;
                $(this).closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
                $(this).closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
                if (!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
                    $('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
                }
                return true;
            } else {
                $(this).closest('.info-enter-item').removeClass('info-enter-error-bd'); //错误字段点亮 父级区域
                $(this).closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
                if ($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg')) {
                    $('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
                }
            }
        });
        if($('#dwellYear').val() ==''){
            num++;
            $('#dwellYear').closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
            $('#dwellYear').closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
            if (!($('.navigation li:eq(0)').hasClass('change-bg'))) {
                $('.navigation li:eq(0)').addClass('info-enter-error-tabs'); //tabs错误区域点亮
            }
        }else{
            $('#dwellYear').closest('.info-enter-item').removeClass('info-enter-error-bd'); //错误字段点亮 父级区域
            $('#dwellYear').closest('.fm-item').removeClass('fm-item-error'); //错误字段点亮
            if ($('.navigation li:eq(0)').hasClass('change-bg')) {
                $('.navigation li:eq(0)').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
            }
        }
        $('#loan-cusInfo .conter-con select').each(function (index, el) {
            if (!loan.gInfo.isTrue && $(this).closest('#spouse').length == 1) {
                return;
            }
            if ($(this).attr('id') == 'occupation' && $(this).val() == 'xxx') {
                num++;
                var eqIndex = $(this).closest('.info-enter-item').index();
                $(this).closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
                if ($(this).closest('.info-enter-item').find('.fm-item-error').length == 0) { //如果父级区域没有错误字段
                    $('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
                }
                return true;
            }
            if ($(this).val() == '省份' || $(this).val() == '城市' || $(this).val() == '市、县级市' || $(this).val() == '') {
                num++;
                var eqIndex = $(this).closest('.info-enter-item').index();
                $(this).closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
                $(this).closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
                if (!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
                    $('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
                }
                return true;
            } else {
                $(this).closest('.fm-item').removeClass('fm-item-error');
                if ($(this).closest('.info-enter-item').find('.fm-item-error').length == 0) {
                    $('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs');
                }
            }
        });
        if (num > 0) {
            showMsg('必填项不能为空');
            return;
        }
        //格式验证
        $('#loan-cusInfo .conter-con input[type="text"][reg]:not(:disabled)').each(function (index, el) {
            if (!loan.gInfo.isTrue && $(this).closest('#spouse').length == 1) {
                return;
            }
            if(loan.resource == '3'){
                if ((index == '0' && $(this).val() == '') || (index == '1' && $(this).val() == '')) {
                    return true;
                }
            }else{
                if ((index == '1' && $(this).val() == '') || (index == '2' && $(this).val() == '')) {
                    return true;
                }
            }

            var reg = $(this).attr('reg');
            var eqIndex = $(this).closest('.info-enter-item').index();
            if ($(this).hasClass('moneyBlur') || $(this).hasClass('moneyFocus')) {
                if (!(fmReg[reg].test($.trim(rmoney($(this).val().replace(/\s+/g, '')))))) {
                    num++;
                    $(this).closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
                    $(this).closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
                    if (!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
                        $('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
                    }
                } else {
                    $(this).closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
                    if ($(this).closest('.info-enter-item').find('.fm-item-error').length == 0) { //如果父级区域没有错误字段
                        $('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
                    }
                }
                return;
            }
            if (!(fmReg[reg].test($.trim($(this).val().replace(/\s+/g, ''))))) {
                num++;
                $(this).closest('.info-enter-item').addClass('info-enter-error-bd'); //错误字段点亮 父级区域
                $(this).closest('.fm-item').addClass('fm-item-error'); //错误字段点亮
                if (!($('.navigation li:eq(' + eqIndex + ')').hasClass('change-bg'))) {
                    $('.navigation li:eq(' + eqIndex + ')').addClass('info-enter-error-tabs'); //tabs错误区域点亮
                }
            } else {
                $(this).closest('.fm-item').removeClass('fm-item-error'); //错误字段取消点亮
                if ($(this).closest('.info-enter-item').find('.fm-item-error').length == 0) { //如果父级区域没有错误字段
                    $('.navigation li:eq(' + eqIndex + ')').removeClass('info-enter-error-tabs'); //tabs错误区域点亮
                }
            }
        });
        if (num > 0) {
            return;
        }
        buildingInputValue();
        getInputSelectValue();
        //checkInputValue();
        //if (loan.isInputChange) {  //字段有变化
        //    showLoader('更新客户信息中...');
        //    var sendJson = {
        //        "b": [{
        //            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
        //            "workAddress.s": commonJson.workAddress,//工作地址
        //            "moduleId.s": loan.moduleId, //模块编号
        //            "tranId.s": '100', //交易编号
        //            "operatorNo.s": commonJson.adminCount, //操作员
        //            "deviceNo.s": commonJson.udId, //设备编号
        //            "orgId.s": commonJson.orgId,
        //            "clientNo.s": loan.mCLIENT_NO,//客户号
        //            "certType.s": 'Ind01',//证件类型
        //            "certNum.s": loan.mInfo.cerNO,//证件号码
        //            "name.s": loan.mInfo.name,//姓名
        //            "country.s": loan.mInfo.country,//国籍
        //            "nativePlace.s": loan.mInfo.address,//户籍地址
        //            "sex.s": loanSexJson[loan.mInfo.sex],//性别
        //            "birthday.s": loan.mInfo.birthday.replace(/-/g, '/'),//出生日期
        //            "eduExp.s": loan.mInfo.eduExp,//最高学历
        //            "dwellingAddr.s": loan.mInfo.dwellingAddr,//居民地址
        //            "dwellingZip.s": loan.mInfo.dwellingZip,//居住地址邮编
        //            "corporation.s": loan.mInfo.corporation,//单位名称
        //            "creditCategory.s": loan.mInfo.creditCategory,//授信客户分类
        //            "clStencil.s": loan.mInfo.clStencil,//信用等级评估模板名称
        //            "maritalStatus.s": loan.mInfo.maritalStatus,//婚姻状况
        //            "degree.s": loanDegree[loan.mInfo.degree],//最高学位
        //            "dwellingStatus.s": loan.mInfo.dwellingStatus,//居住状况
        //            "dwellYear.s": loan.mInfo.dwellYear.substr(0, 4),//现地址居住开始年份
        //            "industry.s": loan.mInfo.industry,//单位所属行业
        //            "occupation.s": loan.mInfo.occupation,//职业
        //            "headship.s": loan.mInfo.headship,//职务
        //            "position.s": loan.mInfo.position,//职称
        //            "income.s": ''+loan.mInfo.income,//工资收入
        //            "remark.s": loan.mInfo.remark,//房产证号码
        //            "consortName.s": loan.gInfo.name,//配偶姓名
        //            "consortCertType.s": 'Ind01',//配偶证件类型
        //            "consortCertId.s": loan.gInfo.cerNO,//配偶证件号码
        //            "consortSex.s": loanSexJson[loan.gInfo.sex],//配偶性别
        //            "consortHeadship.s": loan.mInfo.consortHeadship,//配偶职务
        //            "consortCellphone.s": loan.mInfo.consortCellphone,//配偶手机号码
        //            "consortIncome.s": ''+loan.mInfo.consortIncome,//配偶月均稳定收入
        //            "minorChildren.s": loan.mInfo.minorChildren,//未成年子女
        //            "support.s": ''+loan.mInfo.support,//供养人数
        //            "debtBalance.s": ''+loan.mInfo.debtBalance,//现有负债余额
        //            "houses.s": loan.mInfo.houses,//现有住房数
        //            "mailingAddr.s": loan.mInfo.mailingAddr,//通讯地址
        //            "homeTel.s": loan.mInfo.homeTel,//家庭电话
        //            "workTel.s": loan.mInfo.workTel,//工作电话
        //            "cellphone.s": loan.mInfo.cellphone//手机号码
        //        }]
        //    };
        //    if (!loan.gInfo.isTrue) {
        //        sendJson.b[0]['consortCertType.s'] = '';
        //    }
        //    updateLenderInfoConF(sendJson);
        //} else {
        //    $.mobile.changePage('./loan-cusConfirm.html', {transition: "slide"});
        //}
        loan.faceSQBM = false;
        loan.faceSQBS = false;
        $.mobile.changePage('./loan-cusConfirm.html', {transition: "slide"});
    });
});

/*贷款信息确认界面*/
$(document).on('pageshow', '#loan-cusConfirm', function () {
    loan.BUSER_NO = '';
    confirmPageAddData();
    if (loan.applicationObj.proCODE == '401002010') {  //一手楼商铺
        $('.faceTalkRecord').css('display', 'none');
    }
    //点击修改按钮
    $('.candidate .msg-header .reWrite').on('click', function () {
        clearInterval(loan.BTime);
        loan.getBankYZM = true;
        loan.inputLogo = true;
        loan.faceSQBM = true;
        loan.faceSQBS = true;
        $.mobile.changePage('./loan-cusInfo.html', {reverse: true});
    });
    $('#loan-cusConfirm .header a:first').on('click', function () {  //首页
        clearInterval(loan.BTime);
        loan.getBankYZM = true;
        loan.inputLogo = false;
        loan.faceSQBM = true;
        loan.faceSQBS = true;
        dzhShouye();
    });
    $('#loan-cusConfirm .header a:last').on('click', function () {   //退出
        clearInterval(loan.BTime);
        loan.getBankYZM = true;
        loan.inputLogo = false;
        loan.faceSQBM = true;
        loan.faceSQBS = true;
        dzhFanhui('loan-product.html')
    });
    //签名栏 收缩
    // $(".ic_down").on("click", function () {//点击签名显示隐藏
    //     if ($(this).closest('.qian-box').css('height') == '44px') {
    //         $(this).closest('.qian-box').css('height', "260px");
    //         $(this).closest('.qian-box').find('.qian-content').css("overflow", "visible");
    //         $(this).closest('.qian-box').find('.qian-content').css({
    //             "border-left": "solid 1px #CCCCCC",
    //             "border-right": "solid 1px #CCCCCC",
    //             "border-bottom": "solid 1px #CCCCCC"
    //         });
    //         if($('#ic_mdisqian').is(':hidden')){
    //             $("#mclear-botton").hide();
    //         }else{
    //             $("#mclear-botton").show();
    //         }
    //         $(this).closest('.qian-box').find(".dianjiqianming-con").hide();
    //         //$(this).closest('.qian-box').find("#mclear-botton").show();
    //         $(this).attr("src", "../../images/ic_up.png");
    //         $(".qian-box:eq(0) .querenqianming-click").removeClass("querenqianming-con");
    //         $(".ic_down_two").closest('.qian-box').css('height', "44px");
    //         $(".ic_down_two").attr("src", "../../images/ic_down.png");
    //         $(".ic_down_two").closest('.qian-box').find(".dianjiqianming-con").show();
    //         $(".ic_down_two").closest('.qian-box').find('.qian-content').css("overflow", "hidden");
    //         $(".ic_down_two").closest('.qian-box').find('.qian-content').css("border", "0");
    //         $("#sclear-botton").hide();
    //         $(".qian-box:eq(1) .querenqianming-click").addClass("querenqianming-con");
    //         if(loan.faceSQBM && loan.mInfo.signaData !=''){
    //             $('#loan-cusConfirm .qian-box:eq(0)').css('position', 'relative');
    //             $('#loan-cusConfirm .qian-box:eq(0)').append('<div id="loanm-sign-over" style="position:absolute; top:44px; right:0;left:0;bottom:0;opacity: 1"><img style="width: 100%;height: 100%;" src="'+'data:image/png;base64,'+loan.mInfo.signaData+'"/></div>');
    //         }
    //     } else {
    //         $(this).closest('.qian-box').css('height', "44px");
    //         $(this).attr("src", "../../images/ic_down.png");
    //         $(this).closest('.qian-box').find(".dianjiqianming-con").show();
    //         $(this).closest('.qian-box').find('.qian-content').css("overflow", "hidden");
    //         $(this).closest('.qian-box').find('.qian-content').css("border", "0");
    //         //$(this).closest('.qian-box').find("#mclear-botton").hide();
    //         $("#mclear-botton").hide();
    //         $(".qian-box:eq(0) .querenqianming-click").addClass("querenqianming-con");
    //     }
    // });
    // $(".ic_down_two").on("click", function () {//点击签名显示隐藏
    //     if ($(this).closest('.qian-box').css('height') == '44px') {
    //         $(this).closest('.qian-box').css('height', "260px");
    //         $(this).closest('.qian-box').find('.qian-content').css("overflow", "visible");
    //         $(this).closest('.qian-box').find('.qian-content').css({
    //             "border-left": "solid 1px #CCCCCC",
    //             "border-right": "solid 1px #CCCCCC",
    //             "border-bottom": "solid 1px #CCCCCC"
    //         });
    //         if ($('#ic_sdisqian').is(':hidden')) {
    //             $("#sclear-botton").hide();
    //         }else{
    //             $("#sclear-botton").show();
    //         }
    //         $(this).closest('.qian-box').find(".dianjiqianming-con").hide();
    //         $(this).attr("src", "../../images/ic_up.png");
    //         $(".qian-box:eq(1) .querenqianming-click").removeClass("querenqianming-con");
    //         $(".ic_down").closest('.qian-box').css('height', "44px");
    //         $(".ic_down").attr("src", "../../images/ic_down.png");
    //         $(".ic_down").closest('.qian-box').find(".dianjiqianming-con").show();
    //         $(".ic_down").closest('.qian-box').find('.qian-content').css("overflow", "hidden");
    //         $(".ic_down").closest('.qian-box').find('.qian-content').css("border", "0");
    //         $("#mclear-botton").hide();
    //         $(".qian-box:eq(0) .querenqianming-click").addClass("querenqianming-con");
    //         if(loan.faceSQBS && loan.gInfo.signaData){
    //             $('#loan-cusConfirm .qian-box:eq(1)').css('position', 'relative');
    //             $('#loan-cusConfirm .qian-box:eq(1)').append('<div id="loans-sign-over" style="position:absolute; top:44px; right:0;left:0;bottom:0;opacity: 1"><img style="width: 100%;height: 100%;" src="'+'data:image/png;base64,'+loan.gInfo.signaData+'"/></div>');
    //             loan.faceSQBS = false;
    //         }
    //     } else {
    //         $(this).closest('.qian-box').css('height', "44px");
    //         $(this).attr("src", "../../images/ic_down.png");
    //         $(this).closest('.qian-box').find(".dianjiqianming-con").show();
    //         $(this).closest('.qian-box').find('.qian-content').css("overflow", "hidden");
    //         $(this).closest('.qian-box').find('.qian-content').css("border", "0");
    //         $("#sclear-botton").hide();
    //         $(".qian-box:eq(1) .querenqianming-click").addClass("querenqianming-con");
    //     }
    // });
    if(loan.faceSQBM && loan.mInfo.signaData !=''){
        $('#loan-cusConfirm .qian-box:eq(0)').css('position', 'relative');
        $('#loan-cusConfirm .qian-box:eq(0)').append('<div id="loanm-sign-over" style="position:absolute; top:44px; right:0;left:0;bottom:0;opacity: 1"><img style="width: 100%;height: 100%;" src="'+'data:image/png;base64,'+loan.mInfo.signaData+'"/></div>');
    }
    if(loan.faceSQBS && loan.gInfo.signaData){
        $('#loan-cusConfirm .qian-box:eq(1)').css('position', 'relative');
        $('#loan-cusConfirm .qian-box:eq(1)').append('<div id="loans-sign-over" style="position:absolute; top:44px; right:0;left:0;bottom:0;opacity: 1"><img style="width: 100%;height: 100%;" src="'+'data:image/png;base64,'+loan.gInfo.signaData+'"/></div>');
        loan.faceSQBS = false;
    }

    //点击查看征信文件
    $('.msg-con:eq(3)').find('span>div').on('click', this, function () {
        if (!$(this).hasClass('zlqd')) {
            return;
        }
        loan.creditInfo = $(this).closest('li').data('creditInfo');
        loan.creditReferPath = loan.creditInfo.creditReferPath;
        openCreditReportFile(loan, 'F0005');
    });
    //点击查看银行对账单
    $('.msg-con:eq(4)').find('span>div').on('click', this, function () {
        if (!$(this).hasClass('zlqd')) {
            return;
        }
        loan.creditReferPath = $(this).closest('li').attr('filePath');
        getFileDataAndOpen(loan, 'F0010');
    });

    //获取短信验证码
    loan.BTime = null;
    loan.getBankYZM = true;
    $("#lb-auth-time").text('80');
    $('#getMsg').on('click', function () {
        if (loan.getBankYZM == false) {
            $('#getMsg').removeClass('disMsg');
            return;
        }
        loan.getBankYZM = false;
        $('#getMsg').removeClass('disMsg').addClass('disgua-btn');
        if (loan.BTime) {
            clearInterval(loan.BTime);
        }
        $('.duanX_con input#inp').val('');
        $("#lb-auth-time").text('80');
        var sendJson = {
            "b": [{
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "operatorNo.s": commonJson.adminCount, //操作员
                "deviceNo.s": commonJson.udId, //设备编号
                "orgId.s": commonJson.orgId,
                "SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": loan.mInfo.cellphone, //手机号码'018232053662',//
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s": loan.mInfo.faceRecogn //人脸识别
            }]
        };
        imessageAuthentionServiceConF(sendJson);
    });
    //点击获取贷款申请表
    $('.msg-con:eq(5)').find('span:first').on('click', function () {
        if (!$(this).hasClass('aTags')) {
            return;
        }
        clearInterval(loan.BTime);
        loan.getBankYZM = true;
        loan.inputLogo = true;
        $.mobile.changePage('./loan-sqb.html', {reverse: true});
    });
    //$('.msg-con:last').find('span:first').on('click', function () {
    //    if (!$(this).hasClass('aTags')) {
    //        return;
    //    }
    //    var sendJson = {
    //        "b": [{
    //            "deviceNo.s": commonJson.udId, //设备编号
    //            "moduleId.s": loan.moduleId, //模块编号
    //            "tranId.s": '100',//loan.tranId, //交易编号
    //            "orgId.s": commonJson.orgId,//机构号
    //            "operatorNo.s": commonJson.adminCount,//操作员
    //            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
    //            "workAddress.s": commonJson.workAddress,//工作地址
    //            "certType.s": 'Ind01',
    //            "certNum.s": loan.mInfo.cerNO,//证件号码
    //            "isCoborrower.s": loan.mInfo.isCoborrower,//配偶是否共借人 0否 1 是
    //            "buildingStatus.s": loan.applicationObj.buildingStau,//房屋状态 1 预售 2 现货 3二手楼
    //            "buildingUsage.s": loan.applicationObj.buildingPurpose,//房屋用途 1 自住  0 非自住
    //            "coveredArea.s": loan.applicationObj.buildingSea,//建筑面积
    //            "unitPrice.s": loan.applicationObj.buildingDan,//单价
    //            "totalPrice.s": loan.applicationObj.buildingZong,//房屋总价
    //            "initialPayment.s": loan.applicationObj.buildingFMoney,//首付款金额
    //            "loanAmounts.s": loan.applicationObj.buildingFuMoney,//借款金额
    //            "loanTerm.s": loan.applicationObj.buildingFuTime,//借款期限  按月送
    //            "repaymentMode.s": loan.applicationObj.buildingType,//还款方式
    //            "autoReimbursementAcct.s": loan.applicationObj.accout,//还款账号
    //            "signature.s": loan.mInfo.signaData,//签名文件
    //            "conSign.s": '',
    //            "localeTimestamp.s": loan.applicationObj.uploadTime,//本地上传时间
    //            "manager.s": commonJson.TLRNAME //操作员姓名
    //        }]
    //    };
    //    showLoader('贷款申请表查询中...');
    //    if (loan.gInfo.isTrue) {
    //        sendJson.b[0]['conSign.s'] = loan.gInfo.signaData;
    //    }
    //    lendingInfoConF(sendJson);
    //});
    //点击获取面谈笔录
    $('.faceTalkRecord span').on('click', function () {
        if (!$(this).hasClass('aTags')) {
            return;
        }
        clearInterval(loan.BTime);
        loan.getBankYZM = true;
        loan.inputLogo = true;
        $.mobile.changePage('./loan-faceTalk.html', {reverse: true});
    });
    //$('.faceTalkRecord span').on('click', function () {
    //    if (!$(this).hasClass('aTags')) {
    //        return;
    //    }
    //    var sendJson = {
    //        "b": [{
    //            "deviceNo.s": commonJson.udId, //设备编号
    //            "moduleId.s": loan.moduleId, //模块编号
    //            "tranId.s": '100',//loan.tranId, //交易编号
    //            "orgId.s": commonJson.orgId,//机构号
    //            "operatorNo.s": commonJson.adminCount,//操作员
    //            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
    //            "workAddress.s": commonJson.workAddress,//工作地址
    //            "certType.s": 'Ind01',
    //            "certNum.s": loan.mInfo.cerNO,//证件号码
    //            "borrower.s": loan.mInfo.name, //借款人
    //            "coborrower.s": '',//配偶
    //            "buildingUsage.s": loan.applicationObj.buildingPurpose,//房屋用途 1 自住  0 非自住
    //            "address.s": loan.applicationObj.buildingAddress,//房屋地址
    //            "houseArea.s": loan.applicationObj.hadHouseArea,//现房屋总面积
    //            "houses.s": loan.mInfo.houses,//现房屋数量
    //            "mortgages.s": loan.applicationObj.shopHouseNum,//贷款购买住房数
    //            "mortgagesArea.s": loan.applicationObj.shopHouseArea,//贷款购买住房面积
    //            "maritalStatus.s": loan.mInfo.maritalStatus,//婚姻状况
    //            "manager.s": commonJson.TLRNAME,//操作员姓名
    //            "signature.s": loan.mInfo.signaData,//签名文件
    //            "localeTimestamp.s": loan.applicationObj.uploadTime//本地上传时间
    //        }]
    //    };
    //    showLoader('面谈笔录查询中...');
    //    if (loan.gInfo.isTrue) {  //存在共同借款人
    //        sendJson.b[0]['coborrower.s'] = loan.gInfo.name;
    //    }
    //    investigativeRecordConF(sendJson);
    //});
    //提交
    $('#btn_next').on('click', function () {
        if (!$(this).hasClass('btn_next')) {
            return;
        }
        if (loan.mInfo.isSignaData == false ||loan.mInfo.isSignaData ==undefined ||loan.mInfo.isSignaData =='') {
            showMsg('主申请人未签名！');
            return;
        }
        if(loan.mInfo.maritalStatus == '20' || loan.mInfo.maritalStatus == '21' || loan.mInfo.maritalStatus == '40' || loan.mInfo.maritalStatus == '23'){
            if (loan.gInfo.isSignaData == false ||loan.gInfo.isSignaData ==undefined||loan.gInfo.isSignaData =='') {
                showMsg('共同申请人(配偶)未签名！');
                return;
            }
        }
        if (loan.BUSER_NO == '') {
            showMsg('请点击获取短信验证码!');
            return;
        }
        var yzm = $('#loan-cusConfirm #inp').val();
        if (!(fmReg.pwD6.test(yzm))) {
            showMsg('请输入正确格式的短信验证码！');
            return;
        }
        showLoader('短信验证码验证中...');
        $("#getMsg").text('重新获取');
        $("#lb-auth-time").text('0');
        loan.getBankYZM = true;
        $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
        if(loan.BTime){
            clearInterval(loan.BTime);
        }
        var checkJson = {      //发送请求的参数
            "b": [{
                "deviceNo.s": commonJson.udId, //设备编号
                "moduleId.s": loan.moduleId, //模块编号
                "tranId.s": loan.tranId, //交易编号
                "orgId.s": commonJson.orgId,//机构号
                "operatorNo.s": commonJson.adminCount,//操作员
                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                "workAddress.s": commonJson.workAddress,//工作地址
                "SUSER_ID.s": commonJson.orgId + commonJson.adminCount,//机构号+柜员号
                "USER_NO.s": loan.BUSER_NO, //用户唯一标识
                "EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
                "MSG_INFO.s": $('#loan-cusConfirm #inp').val(), //动态口令
                "Flags.s": "BBBB", //标记位
                "MOBILE_NO.s": '', //手机号码 '018232053662',//
                "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
                "faceRecogn.s": loan.mInfo.faceRecogn //人脸识别
            }]
        };
        imessageAuthentionServiceYConF(checkJson);
    })
});

/*贷款信息完成界面*/
$(document).on('pageshow', '#loan-complete', function () {
    $('.name_cn').html(loan.mInfo.name);  //申请人姓名
    $('.zheng_num').html(loan.mInfo.cerNO); //证件号码
    $('.kehu_num').html(loan.applicationObj.buildingAddress);//房屋地址
    $('.kaihu_time').html('人民币&nbsp;'+fmoney(loan.applicationObj.buildingFuMoney)+'元'); //贷款金额
    $('#btn_next').on('click', function () {
        clearInterval(loan.BTime);
        $.mobile.changePage('./loan-product.html', {reverse: true});
    })
});
/*贷款申请表*/
$(document).on('pageshow', '#loan-sqb', function () {
    loan.faceSQBM = true;
    loan.faceSQBS = true;
    $('.msg-con').eq(0).find('.rows_value').eq(0).html(loan.mInfo.name);  //姓名
    if (loan.mInfo.address.indexOf('深圳') != -1) {
        $('.msg-con').eq(0).find('.rows_value').eq(1).html('深圳');
    } else {
        $('.msg-con').eq(0).find('.rows_value').eq(1).html('非深圳');
    }

    $('.msg-con').eq(0).find('.rows_value').eq(2).html(MarIcbsToLosCHN[loan.mInfo.maritalStatus]);  //婚姻
    $('.msg-con').eq(0).find('.rows_value').eq(3).html('居民身份证');
    $('.msg-con').eq(0).find('.rows_value').eq(4).html(loan.mInfo.cerNO);  //证件号嘛
    $('.msg-con').eq(0).find('.rows_value').eq(5).html(loan.mInfo.dwellingAddr);  //现住址
    $('.msg-con').eq(0).find('.rows_value').eq(6).html('' + loan.mInfo.dwellYear.substr(0, 4) + '年');   //来深时间
    $('.msg-con').eq(0).find('.rows_value').eq(7).html(dwellingStatus[loan.mInfo.dwellingStatus]);  //现住房性质
    $('.msg-con').eq(0).find('.rows_value').eq(8).html(loan.mInfo.houses +'套'); //现有住房数
    $('.msg-con').eq(0).find('.rows_value').eq(9).html(loan.mInfo.mailingAddr); //通讯地址
    $('.msg-con').eq(0).find('.rows_value').eq(10).html(loan.mInfo.dwellingZip);  //邮政编码
    $('.msg-con').eq(0).find('.rows_value').eq(11).html(loan.mInfo.cellphone);  //手机号码
    $('.msg-con').eq(0).find('.rows_value').eq(12).html(loan.mInfo.workTel);  //办公电话
    $('.msg-con').eq(0).find('.rows_value').eq(13).html(loan.mInfo.homeTel);    //家庭电话
    $('.msg-con').eq(0).find('.rows_value').eq(14).html(maxXL[loan.mInfo.eduExp]);  //最高学历
    $('.msg-con').eq(0).find('.rows_value').eq(15).html(minorChildren[loan.mInfo.minorChildren]);  //未成年子女
    $('.msg-con').eq(0).find('.rows_value').eq(16).html(loan.mInfo.corporation);  //工作单位
    $('.msg-con').eq(0).find('.rows_value').eq(17).html(headship[loan.mInfo.headship]);  //工作职位
    $('.msg-con').eq(0).find('.rows_value').eq(18).html(fmoney(loan.mInfo.income));
    if(Number(loan.mInfo.debtBalance) == '0' ||loan.mInfo.debtBalance ==''){
        $('.msg-con').eq(0).find('.rows_value').eq(19).html('0.00');
    }else{
        $('.msg-con').eq(0).find('.rows_value').eq(19).html(fmoney(loan.mInfo.debtBalance));
    }
    $('.msg-con').eq(0).find('.rows_value').eq(20).html(loan.mInfo.support);

    //配偶
    if (loan.gInfo.isTrue) {
        $('.msg-con').eq(1).find('.rows_value').eq(0).html(loan.gInfo.name);  //姓名
        $('.msg-con').eq(1).find('.rows_value').eq(1).html(loan.gInfo.sex);  //性别
        $('.msg-con').eq(1).find('.rows_value').eq(2).html(loan.gInfo.cerNO.substr(6, 4) + '年' + loan.gInfo.cerNO.substr(10, 2) + '月' + loan.gInfo.cerNO.substr(12, 2) + '日');  //出生日期
        $('.msg-con').eq(1).find('.rows_value').eq(3).html('居民身份证');  //证件名称
        $('.msg-con').eq(1).find('.rows_value').eq(4).html(loan.gInfo.cerNO);   //证件号码
        $('.msg-con').eq(1).find('.rows_value').eq(5).html('' + loan.mInfo.peiHeadship + ',' + headship[loan.mInfo.consortHeadship]);  //工作单位及职务
        $('.msg-con').eq(1).find('.rows_value').eq(6).html(loan.mInfo.consortCellphone); //手机号码
        $('.msg-con').eq(1).find('.rows_value').eq(7).html(fmoney(loan.mInfo.consortIncome)); //月均稳定收入
        $('.msg-con').eq(1).find('.rows_value').eq(8).html('否'); //是否共同申请人
    }

    //房屋情况及借款申请
    $('.msg-con').eq(3).find('.rows_value').eq(0).html(horseType[loan.applicationObj.buildingStau]);  //房屋状态
    $('.msg-con').eq(3).find('.rows_value').eq(1).html(Loanhorse[loan.applicationObj.buildingPurpose]);  //房屋用途
    $('.msg-con').eq(3).find('.rows_value').eq(2).html(loan.applicationObj.buildingAddress);  //购房地址
    $('.msg-con').eq(3).find('.rows_value').eq(3).html(fmoneySQB(loan.applicationObj.buildingSea));  //建筑面积
    $('.msg-con').eq(3).find('.rows_value').eq(4).html(fmoney(loan.applicationObj.buildingDan));   //单价
    $('.msg-con').eq(3).find('.rows_value').eq(5).html(fmoney(loan.applicationObj.buildingZong));  //楼宇总价
    $('.msg-con').eq(3).find('.rows_value').eq(6).html(fmoney(loan.applicationObj.buildingFMoney)); //首付金额
    $('.msg-con').eq(3).find('.rows_value').eq(7).html(fmoney(loan.applicationObj.buildingFuMoney)); //借款金额
    $('.msg-con').eq(3).find('.rows_value').eq(8).html(loan.applicationObj.buildingFuTime); //借款期限
    $('.msg-con').eq(3).find('.rows_value').eq(9).html(buildingType[loan.applicationObj.buildingType]); //还款方式
    $('.msg-con').eq(3).find('.rows_value').eq(10).html(loan.applicationObj.accout); //还款账号

    //申请人及配偶签名
    //if()
    $('.agreement').eq(0).find('.qmImg').eq(0).html('<img style="width: 30%;height: auto;" src="' + 'data:image/png;base64,' + loan.mInfo.signaData + '"/>');
    if(loan.mInfo.maritalStatus == '20' || loan.mInfo.maritalStatus == '21' || loan.mInfo.maritalStatus == '40' || loan.mInfo.maritalStatus == '23'){
        $('.agreement').eq(0).find('.qmImg').eq(1).html('<img style="width: 30%;height: auto;" src="' + 'data:image/png;base64,' + loan.gInfo.signaData + '"/>');
    }

    //经办客户经理声明
    $('.agreement').eq(1).find('.manager>span').html(commonJson.adminCount + '&nbsp;&nbsp;' + commonJson.TLRNAME);

    //日期
    var time = myTime.curDate();
    var myY = time.getFullYear();  //年
    var myM = time.getMonth() < 9 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;   //月
    var myD = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();      //日
    var timeOp = myY + '年' + myM + '月' + myD + '日';
    $('.qmTime:eq(0)').html(timeOp);
    $('.qmTime:eq(1)').html(timeOp);
});

/*面谈笔录*/
$(document).on('pageshow', '#loan-faceTalk', function () {
    loan.faceSQBM = true;
    loan.faceSQBS = true;
    $('.jkp_line').eq(0).html(loan.mInfo.name);  //借款抵押人1
    if (loan.gInfo.isTrue) {
        $('.jkp_line').eq(1).html(loan.gInfo.name);  //借款抵押人2
    }
    $('.jkp_line').eq(3).html(loan.applicationObj.buildingAddr);  //面谈地点
    //日期
    var time = myTime.curDate();
    var myY = time.getFullYear();  //年
    var myM = time.getMonth() < 9 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;   //月
    var myD = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();      //日
    var timeOp = myY + '年' + myM + '月' + myD + '日';
    $('.jkp_line').eq(2).html(timeOp);  //面谈日期
    $('.msg_content p>span').eq(0).html('商品住房');  //商品住房  其他
    //if (loan.applicationObj.buildingPurpose == '1') {
        $('.msg_content p>span').eq(1).html(horseTo[loan.applicationObj.buildingPurpose]);  //自住 □改善型自住 □出租 □投资  □其他
    //} else {
    //    $('.msg_content p>span').eq(1).html('其他');  //自住 □改善型自住 □出租 □投资  □其他
    //}
    $('.msg_content p>span').eq(2).html(MarIcbsToLosCHN[loan.mInfo.maritalStatus]);  // □未婚    □已婚    □离异
    $('.msg_content p>span').eq(3).html(loan.applicationObj.shopHouseNum);  //申请银行贷款的商品住房 套
    $('.msg_content p>span').eq(4).html(loan.applicationObj.shopHouseArea);//申请银行贷款的商品住房 面积
    $('.msg_content p>span').eq(5).html(loan.mInfo.houses);//目前家庭实际拥有商品住房 套
    $('.msg_content p>span').eq(6).html(loan.applicationObj.hadHouseArea);//目前家庭实际拥有商品住房 面积
    $('.msg_content p>span').eq(7).html('真实'); //还款能力证明  真实 不真实
    $('.msg_content p>span').eq(8).html('借款申请人家庭自有资金还款');//还款资金来源  □借款申请人家庭自有资金还款    □他人代为还款
    $('.msg_content p>span').eq(9).html('同意');  //贷款银行办理抵押登记手续  □同意   □不同意
    $('.msg_content p>span').eq(10).html('已了解'); //了解如未依借款合同约定按时足额归还贷款本息  □已了解   □不了解
    $('.msg_content p>span').eq(11).html('同意'); //□同意  □不同意
    $('.msg_content p>span').eq(12).html('确认');
    $('.msg_content p>span').eq(13).html('无');


    //申请人及配偶签名
    $('.firmsg .qmImg').find('span').eq(0).html('<img style="width: 30%;height: auto;" src="' + 'data:image/png;base64,' + loan.mInfo.signaData + '"/>');
    if(loan.mInfo.maritalStatus == '20' || loan.mInfo.maritalStatus == '21' || loan.mInfo.maritalStatus == '40' || loan.mInfo.maritalStatus == '23'){
        $('.firmsg .qmImg').find('span').eq(1).html('<img style="width: 30%;height: auto;" src="' + 'data:image/png;base64,' + loan.gInfo.signaData + '"/>');
    }
    //经办客户经理声明
    $('.firmsg .qm').find('span').html(commonJson.adminCount + '&nbsp;&nbsp;' + commonJson.TLRNAME);
});