//虚拟卡列表成功回调
function idebitCardProductServiceSucc(msg, cache) {
	var _msg = msg;
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	var textHtml = '';
	if (responseObj.b[0].results == "00") {
		hideLoader();
		if (cache == undefined) {
			//alert('update');
			window.localStorage.setItem("debitCardList", _msg);
			var oDate = parseInt(myTime.CurTime() / 3600 / 24);
			window.localStorage.setItem("debitCardDate", oDate);
		}
		$.each(responseCode, function(index, el) {
			if (index == 0) return;
			textHtml += ' <div class="product_box">' +
				'<img src="data:image/png;base64,' + base64decode(el.debitCardProductVO[0].proAttach) + '" proRemark1="' + el.debitCardProductVO[0].proRemark1 + '" class="product_img"/>' +
				'<div class="product_content">' +
				'<div class="product_register" proCode="' + el.debitCardProductVO[0].proCode + '" cardType="' + el.debitCardProductVO[0].cardType + '" proProtocol="' + index + '">办&nbsp;&nbsp;&nbsp;理</div>' +
				'<p class="product_title">' + el.debitCardProductVO[0].cardName + '</p>' + //cardBrand
				'<div class="product_Intro">' + el.debitCardProductVO[0].proDesc.replace(/\n/g, "<br/>") + '</div>' +
				'</div>' +
				'</div>';
		});
		//proProtocol="'+el.debitCardProductVO[0].proProtocol+'"
		$('#xinka-product .conter-auto').html(textHtml);
		$('#xinka-product .product_register').on('click', function() {
			if (!commonJson.ifsCManagerId) {
				showTags({
					'title': '提示',
					'content': '没有客户经理号，无法开通信通数字卡业务!',
					'ok': {}
				});
			} else {
				debitEnter.proCode = $(this).attr("proCode");
				//debitEnter.proProtocol = $(this).attr("proProtocol");
				var _ind = $(this).attr('proProtocol');
				var msg = window.localStorage.getItem("debitCardList");
				msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
				var responseObj = JSON.parse(msg);
				var responseCode = responseObj.b;
				debitEnter.proProtocol = responseCode[_ind].debitCardProductVO[0].proProtocol;

				debitEnter.cardType = $(this).attr("cardType");
				//alert(debitEnter.proCode);
				$.mobile.changePage('xinka-readingID.html');
			}

		});
		$('#xinka-product .product_img').on('taphold', function() {
			productTapHold($(this));
		})
		$("#xinka-product").on('click', function(ev) {
			var oTarget = ev.target;
			if ($(oTarget).closest('.product_img').length || $(oTarget).closest('.product_img_msg').length) {

			} else {
				$(".product_img_msg").remove();
			}
		})
	}else if(responseObj.b[0].results == "08"){
		//GChange08
		hideLoader();
	        //虚拟卡列表
	        var sendJson={
	                    "b" : [{
	                        "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
	                        "workAddress.s":commonJson.workAddress,//工作地址
	                        "orgId.s":commonJson.orgId,//机构号
	                        "moduleId.s":debitEnter.moduleID,//模块编号
	                        "tranId.s":debitEnter.tranId1,//交易编号
	                        "operatorNo.s":commonJson.adminCount,//操作员
	                        "deviceNo.s":commonJson.udId//设备编号
	                    }]
	                };
	        idebitCardProductServiceFun(sendJson,function(msg){
	            idebitCardProductServiceSucc(msg);
	        },function(err){
	        	hideLoader();
	            funFail(err);
	        })
	    /*$('#xinka-product .product_register').click(function(event) {
	        $.mobile.changePage('xinka-readingID.html');
	    });*/

	}else {
		hideLoader();
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}

function productTapHold(obj) {
	//var h = obj.height()-2;
	//var w = obj.width()-2;
	//alert(h+',,,,,'+w);
	$(".product_img_msg").remove();
	obj.parent('.product_box').css('position', 'relative');
	obj.parent('.product_box').append('<div class="product_img_msg" style="position:absolute; top:0; left:0; width:305px; height:187px; background-color:rgba(0,0,0,.4); color:rgb(255,255,255); font-size:15px; border-radius:6px; border:1px dashed #fff; overflow:scroll;">' + obj.attr('proRemark1').replace(/\n/g, "<br/>") + '</div>');
}
//虚拟卡联网核查 成功回调 yu
function idebitItizenCertificateIdenifySucc(msg) {
	//alert(msg);
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == "00") {
		hideLoader();
		lianwanghechaData.CheckResult = responseCode[0].results;
		if (responseCode[1].citizenCertificateIdentifyVO[0].CHECKRESULT == "00") { //联网核查成功
			//$("#xinka-readID .img_box").append(textHtml);
			$("#xinka-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
			debitEnter.checkPhoto = base64decode(responseCode[1].citizenCertificateIdentifyVO[0].PHOTO); //联网核查返回照片
			//debitEnter.checkPhoto = responseCode[1].citizenCertificateIdentifyVO[0].PHOTO;
			// $("#xinka-readID .loading_box").html('');
			// $("#xinka-readID .pic_suc").text('身份证读取成功!');
			$('#xk-read-next').addClass('btn_next');
		} else {
			hideLoader();
			$("#xinka-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
			//$.mobile.changePage('xinka-product.html',{reverse:true});
		}
	}else if(responseCode[0].results == "08"){
		hideLoader();
	}else if(responseCode[0].results == "09"){
		hideLoader();
		$(".lianwanghecha-yichang").show();
		$("#xinka-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查异常！</div>');
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
					debitEnter.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
//				});
				});
			lianwanghechaData.CheckResult = responseCode[0].results;
			//debitEnter.checkPhoto = responseCode[1].citizenCertificateIdentifyVO[0].PHOTO;
			// $("#xinka-readID .loading_box").html('');
			// $("#xinka-readID .pic_suc").text('身份证读取成功!');
			$('#xk-read-next').removeClass('btn_next');

	}else if(responseCode[0].results == "02"){
		hideLoader();
		lianwanghechaData.CheckResult = responseCode[0].results;
		$("#xinka-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查成功！</div>');
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
					debitEnter.checkPhoto = base64Img.replace('data:image/png;base64,', ''); //联网核查返回照片
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
   				$.mobile.changePage('xinka-product.html', { transition: "slide" });
   			}
   		},
   		'cancel':{
   			'title':'继续',
   			'fun':function(){

        if(debitEnter.agreeCache){
            $.mobile.changePage('./xinka-agreement.html');
        }else{
            showLoader('客户信息查询中...');
            var sendJson={
                    "b" : [{
                      "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
                      "workAddress.s":commonJson.workAddress,//工作地址
                      "orgId.s":commonJson.orgId,//机构号
                      "moduleId.s":debitEnter.moduleID,//模块编号
                      "tranId.s":debitEnter.tranId1,//交易编号
                      "operatorNo.s":commonJson.adminCount,//操作员
                      "deviceNo.s":commonJson.udId,//设备编号
                      "CLIENT_TYPE.s" :"P",//客户类型 N组织 P个人
                      "CARD.s" :"",//卡号
                      "ACCT_NO.s":"" ,//账号
                      "CLIEMT_NO.s" :"",//客户号
                      "DOC_TYPE.s":"0" ,//证件类型
                      "DOC_ID.s":custermerInfo.cerNO,//证件号
                      "CLIENT_SHORT.s":"" ,//简称
                      "BIRTH_DATE.s":"" ,//出生日
                      "CELL_PHONE.s":"" ,//手机
                      "PHONE.s":"" ,//住宅电话
                      "LEGAL_REP.s":"" ,//法人代表
                      "REVERSE_FLAG.s":"D",//证件号内部检查标志 默认D
                      "CARD_CATEGORY.s":"1"//虚拟卡查核心标识 1
                    }]
                };
            icustomerInfoServiceFun(sendJson,function(msg){
                icustomerInfoServiceSucc(msg);
            },function(err){
                funFail(err);
            })
        }
   			}
   		}
   	});

	}else {
		hideLoader();
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
		$("#xinka-readID .loading_box").html('<div class="read_loading" style="margin-top:40px;">身份证联网核查失败！</div>');
	}
}
//查询数字卡成功回调
function getXinKaServiceSuccessFun(msg,sendJson){
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == "00") {
		var clientName =responseCode[1].docLicenceVO[0].CLIENT_NAME;
		var voucherStatus=responseCode[1].docLicenceVO[0].STATUS;
		var voucherNo=responseCode[1].docLicenceVO[0].VOUCHER_NO;
		var expiredDate= responseCode[1].docLicenceVO[0].EXPIRED_DATE;
		//$('#debitCardNo').text(voucherNo.substr(0,4)+"\t\t"+voucherNo.substr(4,4)+"\t\t"+voucherNo.substr(8,4)+"\t\t"+voucherNo.substr(12,4));
		
		$('#debitCardNo').html(voucherNo.substr(0,4)+"&nbsp;&nbsp;&nbsp;"+voucherNo.substr(4,4)+"&nbsp;&nbsp;&nbsp;"+voucherNo.substr(8,4)+"&nbsp;&nbsp;&nbsp;"+voucherNo.substr(12,4));
		$('#validDate').text(expiredDate.substr(4,2)+"/"+expiredDate.substr(2,2));//20200429
		$('#custName').val(clientName);
		$('#voucherStatus').val(voucherStatus).selectmenu('refresh');
	}else
	if (responseCode[0].results == "08") {
            hideLoader();
            showLoader("查询中...");
            getXinKaServiceFun(sendJson,function(msg){
        	getXinKaServiceSuccessFun(msg,sendJson);
        },function(err){
        $('#debitCardNo').text('');
		$('#validDate').text('');
		$('#custName').val('');
		$('#voucherStatus').val('').selectmenu('refresh');;
		funFail(err);
        });
        }
	else{
		hideLoader();
		 $('#debitCardNo').text('');
		$('#validDate').text('');
		$('#custName').val('');
		$('#voucherStatus').val('').selectmenu('refresh');;
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}
//身份证识别
    function ocrIdCardFun() {
        ocrIdCard2('', function (data) {

            //$("#custName").val($.trim(data.CifName));
            $('#debitCardNo').text('');
		$('#validDate').text('');
		$('#custName').val('');
		$('#voucherStatus').val('').selectmenu('refresh');;
            $("#doc_no").val($.trim(data.IdNo));
        }, function (err) {

        })

    }

//虚拟卡查询职业 成功回调
function ifrp005ServiceCSucc(msg) {
	//alert(msg);
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	var textHtml = "";
	if (responseCode[0].results == "00") {
		$.each(responseCode, function(index, val) {
			if (index == 0) return;
			textHtml += '<option value="' + val.frp005[0].fvval + '">' + val.frp005[0].fvdsc1 + '</option>'
		});
		$("#x-occup").html('<option value=""></option>' + textHtml);
		if (debitEnter.isCoreHas) {
			 	if(daikuanXINxi.resource == '0'){//不能修改
			 		$('#s_province,#s_city').attr('disabled', 'disabled');
					if (debitEnter.issPlace != '' && debitEnter.distCode != '') {
						$("#x-placeSelRes").html('<option selected value="' + debitEnter.distCode + '">' + debitEnter.issPlace + '</option>').selectmenu('refresh').attr('disabled', 'disabled');
						$("#x-placeSel").attr('disabled', 'disabled');
					} else {
						$("#x-placeSelRes").html('');
					}
					if(debitEnter.xTel !=''){
						$("#x-tel").val(telNum(debitEnter.xTel)).attr('disabled', 'disabled'); //手机号码
					}
					if(debitEnter.xPlaceDet !=''){
						$("#x-placeDet").val(debitEnter.xPlaceDet).attr('disabled', 'disabled'); //通讯地址
					}
					if(debitEnter.xPCode !=''){
						$("#x-pCode").val(debitEnter.xPCode).attr('disabled', 'disabled'); //邮编
					}
					if(debitEnter.xOccup !=''){
						$("#x-occup").val(debitEnter.xOccup).selectmenu('refresh').attr('disabled', 'disabled'); //职业
					}
			 	}else{
//			 		$('#s_province,#s_city').attr('disabled', 'disabled');
					if (debitEnter.issPlace != '' && debitEnter.distCode != '') {
						$("#x-placeSelRes").html('<option selected value="' + debitEnter.distCode + '">' + debitEnter.issPlace + '</option>').selectmenu('refresh').attr('disabled', 'disabled');
		//				$("#x-placeSel").attr('disabled', 'disabled');
					} else {
						$("#x-placeSelRes").html('');
					}
					if(debitEnter.xTel !=''){
						$("#x-tel").val(telNum(debitEnter.xTel)); //手机号码
					}
					if(debitEnter.xPlaceDet !=''){
						$("#x-placeDet").val(debitEnter.xPlaceDet); //通讯地址
					}
					if(debitEnter.xPCode !=''){
						$("#x-pCode").val(debitEnter.xPCode); //邮编
					}
					if(debitEnter.xOccup !=''){
						$("#x-occup").val(debitEnter.xOccup).selectmenu('refresh'); //职业
					}
			 	}
		} else {
			if(daikuanXINxi.resource == '0'){//不能修改
				$('#s_province,#s_city').attr('disabled', 'disabled');
			if (debitEnter.issPlace != '' && debitEnter.distCode != '') {
				$("#x-placeSelRes").html('<option selected value="' + debitEnter.distCode + '">' + debitEnter.issPlace + '</option>').selectmenu('refresh').attr('disabled', 'disabled');
				$("#x-placeSel").attr('disabled', 'disabled');
			} else {
				$("#x-placeSelRes").html('');
			}
			if(debitEnter.xTel !=''){
				$("#x-tel").val(telNum(debitEnter.xTel)).attr('disabled', 'disabled'); //手机号码
			}
			if(debitEnter.xPlaceDet !=''){
				$("#x-placeDet").val(debitEnter.xPlaceDet).attr('disabled', 'disabled'); //通讯地址
			}
			if(debitEnter.xPCode !=''){
				$("#x-pCode").val(debitEnter.xPCode).attr('disabled', 'disabled'); //邮编
			}
			if(debitEnter.xOccup !=''){
				$("#x-occup").val(debitEnter.xOccup).selectmenu('refresh').attr('disabled', 'disabled'); //职业
			}
//			$('#s_province').val('广东省').selectmenu('refresh'); //省份
//			$('#s_province').siblings('span').text('广东省');
//			change(1, 0);
//			$('#s_city').val('深圳市').selectmenu('refresh'); //地级市
//			$('#s_city').siblings('span').text('深圳市');
			}else{//可修改
			if (debitEnter.issPlace != '' && debitEnter.distCode != '') {
				$("#x-placeSelRes").html('<option selected value="' + debitEnter.distCode + '">' + debitEnter.issPlace + '</option>').selectmenu('refresh');
			} else {
				$("#x-placeSelRes").html('');
			}
			if(debitEnter.xTel !=''){
				$("#x-tel").val(telNum(debitEnter.xTel)); //手机号码
			}
			if(debitEnter.xPlaceDet !=''){
				$("#x-placeDet").val(debitEnter.xPlaceDet); //通讯地址
			}
			if(debitEnter.xPCode !=''){
				$("#x-pCode").val(debitEnter.xPCode); //邮编
			}
			if(debitEnter.xOccup !=''){
				$("#x-occup").val(debitEnter.xOccup).selectmenu('refresh'); //职业
			}
//			$('#s_province').val('广东省').selectmenu('refresh'); //省份
//			$('#s_province').siblings('span').text('广东省');
//			change(1, 0);
//			$('#s_city').val('深圳市').selectmenu('refresh'); //地级市
//			$('#s_city').siblings('span').text('深圳市');
			}
		}
	}else if(responseCode[0].results == "08"){
		hideLoader();
	} else {
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}

}
//虚拟卡签发地区查询
function ifrp005ServicePSucc(msg) {
	//alert(msg);
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	var textHtml = "";
	if (responseCode[0].results == "00") {
		$.each(responseCode, function(index, val) {
			if (index == 0) return;
			textHtml += '<option value="' + val.frp005[0].fvval + '">' + val.frp005[0].fvdsc1 + '</option>'
		});
		$("#x-placeSelRes").html('<option value=""></option>' + textHtml);
	}else if(responseCode[0].results == "08") {
		hideLoader();
		//GChange08
	        var sendJson={
	                "b" : [{
	                    "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
	                    "workAddress.s":commonJson.workAddress,//工作地址
	                    "orgId.s":commonJson.orgId,//机构号
	                    "moduleId.s":debitEnter.moduleID,//模块编号
	                    "tranId.s":debitEnter.tranId1,//交易编号
	                    "operatorNo.s":commonJson.adminCount,//操作员
	                    "deviceNo.s":commonJson.udId,//设备编号
	                    "DOCUMENT_TYPE.s":"0",//证件类型
	                    "CITY.s" : city,
	                    "CLIENT_NAME.s" : custermerInfo.name,
	                    "DOCUMENT_ID.s" : custermerInfo.cerNO
	                }]
	            };
	        ifrp005ServicePFun(sendJson,function(msg){
	            ifrp005ServicePSucc(msg);
	        },function(err){
	            funFail(err);
	        });
	}else {
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}
/*虚拟卡客户信息组合查询及有效凭证数量校验 查核心 成功回调*/
function icustomerInfoServiceSucc(msg) {
	//alert(msg);
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
//	daikuanXINxi.resource = responseCode[0].resource;

	if (responseCode[0].results == "00") {
		debitEnter.CLIENT_NO = responseCode[1].customerInfoVO[0].CLIENT_NO; //获取客户号
		debitEnter.isCoreHas = debitEnter.CLIENT_NO != "" ? true : false; //判断客户号是否为空
//		if (debitEnter.isCoreHas) { //如果核心有客户号 进行客户信息查询
			//核心有客户信息
			showLoader("客户信息查询中...");
//			var sendJson = {
//				"b": [{
//					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
//					"workAddress.s": commonJson.workAddress, //工作地址
//					"orgId.s": commonJson.orgId, //机构号
//					"moduleId.s": debitEnter.moduleID, //模块编号
//					"tranId.s": debitEnter.tranId1, //交易编号
//					"operatorNo.s": commonJson.adminCount, //操作员
//					"deviceNo.s": commonJson.udId, //设备编号
//					"CLIENT_NO.s": debitEnter.CLIENT_NO, //客户号debitEnter.CLIENT_NO   0700358223
//					"AGENT_FLAG.s": "", //法人代表
//					"CLIENT_TYPE.s": "P" //N单位 P个人
//				}]
//			};
		var sendJson = {
                "b": [{
                    "IDTYPE.s": "0", //证件类型
                    "IDNO.s": custermerInfo.cerNO,//证件号
                    "CLIENT_TYPE.s": 'P', //客户类型
                    "CLIENT_NO.s": debitEnter.CLIENT_NO, //客户号debitEnter.CLIENT_NO   0700358223
                    "AGENT_FLAG.s": '', //法人代表
                    "deviceNo.s": commonJson.udId, //设备编号
                    "orgId.s": commonJson.orgId, //机构号
                    "moduleId.s": debitEnter.moduleID, //模块编号
                    "tranId.s": debitEnter.tranId1, //交易编号
                    "operatorNo.s": commonJson.adminCount, //操作员
                }]
			            };
			IEstablishCustomerInformationServicetWOFFun(sendJson, function(msg) {
				IEstablishCustomerInformationServiceFSucc(msg);
			}, function(err) {
				funFail(err);
			});
			return;
//		} else {
//			hideLoader();
//			$.mobile.changePage('./xinka-agreement.html');
//		}

	} else if (responseCode[0].results == "08") {
		hideLoader();
		//GChange08
            var sendJson={
                    "b" : [{
                      "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
                      "workAddress.s":commonJson.workAddress,//工作地址
                      "orgId.s":commonJson.orgId,//机构号
                      "moduleId.s":debitEnter.moduleID,//模块编号
                      "tranId.s":debitEnter.tranId1,//交易编号
                      "operatorNo.s":commonJson.adminCount,//操作员
                      "deviceNo.s":commonJson.udId,//设备编号
                      "CLIENT_TYPE.s" :"P",//客户类型 N组织 P个人
                      "CARD.s" :"",//卡号
                      "ACCT_NO.s":"" ,//账号
                      "CLIEMT_NO.s" :"",//客户号
                      "DOC_TYPE.s":"0" ,//证件类型
                      "DOC_ID.s":custermerInfo.cerNO,//证件号
                      "CLIENT_SHORT.s":"" ,//简称
                      "BIRTH_DATE.s":"" ,//出生日
                      "CELL_PHONE.s":"" ,//手机
                      "PHONE.s":"" ,//住宅电话
                      "LEGAL_REP.s":"" ,//法人代表
                      "REVERSE_FLAG.s":"D",//证件号内部检查标志 默认D
                      "CARD_CATEGORY.s":"1"//虚拟卡查核心标识 1
                    }]
                };
            icustomerInfoServiceFun(sendJson,function(msg){
                icustomerInfoServiceSucc(msg);
            },function(err){
                funFail(err);
            })


//		hideLoader();
//		showTags({
//			'title': '提示',
//			'content': responseCode[0].message,
//			'ok': {}
//		});
	} else {
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {
				fun: function() {
					$.mobile.changePage('xinka-product.html', {
						reverse: true
					});
				}
			}
		});
	}

	hideLoader();
	//21  存折过多 不能开卡
	//01  异常 查询核心异常
	//12  客户号大于1 不能开卡
	//00  ok
}

/**异常处理（PAD请求异常和响应异常）*/
function pad_exception(err) {
	hideLoader();
	showTags({
		'title': '提示',
		'content': '业务处理超时!',
		'ok': {
			title: '继续处理',
			fun: function() {
				showLoader('用户信息提交中...');
				//提交数据
				if (debitEnter.isCoreHas) { //有客户号  维护客户信息
					var sendJson = {
						"b": [{
							"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
							"workAddress.s": commonJson.workAddress, //工作地址
							"orgId.s": commonJson.orgId, //机构号
							"moduleId.s": debitEnter.moduleID, //模块编号
							"tranId.s": debitEnter.tranId1, //交易编号
							"operatorNo.s": commonJson.adminCount, //操作员
							"deviceNo.s": commonJson.udId, //设备编号
							"CLIENT_NO.s": debitEnter.CLIENT_NO, //客户号
							"CLIENT_NAME.s": debitEnter.name, //客户中文名称
							//"SEX.s" : sexJson[debitEnter.sex], //性别
							"DOCUMENT_TYPE.s": "0", //证件类型
							"DOCUMENT_ID.s": debitEnter.cerNO, //证件号码
							"EXPIRY_DATE.s": debitEnter.cerExpDt.split('-')[1].replace(/\./g, ""), //证件到期日
							"ISS_CITY.s": debitEnter.placeSelResVal, //地区代码
							"ISS_PLACE.s": debitEnter.placeSelRes, //签发地区
							"CONTACT_ID.s": debitEnter.tel, //联系电话
							"ADDRESS.s": debitEnter.placeDet.replace(/\s/g, ""), //地址
							"POSTAL_CODE.s": debitEnter.pCode, //通讯地址邮编
							"OCCUPATION_CODE.s": debitEnter.occupVal, //职业
							"ACCT_NO.s": debitEnter.CardNo, //卡号
							"ACCT_EXEC.s": commonJson.ifsCManagerId, //客户经理01A
							"PASSWORD.s": debitEnter.A, //密码
							"CVVN_CODE.s": debitEnter.CVVNCODE,
							"CARD_TYPE.s": debitEnter.CARDTYPE,
							"recommender.s": debitEnter.recomm,
							"fileData.s": debitEnter.data,
							"PAYEE_ACCT.s": debitEnter.reCardNo,
							"faceRecogn.s": debitEnter.faceRecogn, //人脸识别
							"BussinessCode.s": '01', //身份证联网核查业务编号
							"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
							"ReviewUserId.s": lianwanghechaData.ReviewUserId, //远程复核用户ID
							"platGlobalSeq.s": debitEnter.platGlobalSeq
						}]
					};
					//alert(JSON.stringify(sendJson));
					iestablishCustomerInformationServiceWFun(sendJson, function(msg) {
						iestablishCustomerInformationServiceSucc(msg);
					}, function(err) {
						pad_exception(err);
						// funFail(err);
					});
				} else { //没有客户号  建立客户信息
					var sendJson = {
						"b": [{
							"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
							"workAddress.s": commonJson.workAddress, //工作地址
							"orgId.s": commonJson.orgId, //机构号
							"moduleId.s": debitEnter.moduleID, //模块编号
							"tranId.s": debitEnter.tranId1, //交易编号
							"operatorNo.s": commonJson.adminCount, //操作员
							"deviceNo.s": commonJson.udId, //设备编号
							"CLIENT_NAME.s": debitEnter.name, //客户中文名称
							"SEX.s": sexJson[debitEnter.sex], //性别
							"DOCUMENT_TYPE.s": "0", //证件类型
							"DOCUMENT_ID.s": debitEnter.cerNO, //证件号码
							"EXPIRY_DATE.s": debitEnter.cerExpDt.split('-')[1].replace(/\./g, ""), //证件到期日
							"ISS_CITY.s": debitEnter.placeSelResVal, //地区代码
							"ISS_PLACE.s": debitEnter.placeSelRes, //签发地区
							"CONTACT_ID.s": debitEnter.tel, //联系电话
							"ADDRESS2.s": custermerInfo.address, //户籍地址
							//"ADDRESS.s" : debitEnter.province+debitEnter.city+debitEnter.placeDet.replace(/\s/g,""), //地址
							"ADDRESS.s": debitEnter.subAddress.replace(/\s/g, ""), //地址
							"POSTAL_CODE.s": debitEnter.pCode, //通讯地址邮编
							"OCCUPATION_CODE.s": debitEnter.occupVal, //职业
							"ISS_DATE.s": debitEnter.cerExpDt.split('-')[0].replace(/\./g, ""), //签发日期
							"ISS_AUTHORITY.s": custermerInfo.issAuthority, //签发机构
							"BIRTH_DATE.s": custermerInfo.birthday.replace(/\-/g, ""), //出生日期
							"ACCT_NO.s": debitEnter.CardNo, //卡号
							"ACCT_EXEC.s": commonJson.ifsCManagerId, //客户经理01A
							"PASSWORD.s": debitEnter.A, //密码
							"CVVN_CODE.s": debitEnter.CVVNCODE,
							"CARD_TYPE.s": debitEnter.CARDTYPE,
							"recommender.s": debitEnter.recomm,
							"fileData.s": debitEnter.data,
							"PAYEE_ACCT.s": debitEnter.reCardNo,
							"faceRecogn.s": debitEnter.faceRecogn, //人脸识别
							"BussinessCode.s": '01', //身份证联网核查业务编号
							"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
							"ReviewUserId.s": lianwanghechaData.ReviewUserId, //远程复核用户ID
							"platGlobalSeq.s": debitEnter.platGlobalSeq
						}]
					};
					iestablishCustomerInformationServiceFun(sendJson, function(msg) {
						iestablishCustomerInformationServiceSucc(msg);
					}, function(err) {
						pad_exception(err);
						// funFail(err);
					});
				}
			}
		}
	});
}

//影像签名压缩入库
function digitalCardImgUpload(callback){
	showLoader("影像压缩中...");
	// 事件发布执行回调方法前，取订事件，避免重复发布
    var ussbCallback = function(){
        topicUtil.unsubscribe("xinka/digitalCardImgUpload");
        hideLoader();
        callback();
    };
	topicUtil.subscribe("xinka/digitalCardImgUpload", ussbCallback);
	var compressCount = 0;  //压缩成功次数,为2时完成压缩
	var mediaTime = myTime.CurTime(); //影像时间戳
	var signTime = mediaTime + 1; //签名时间戳
	debitEnter.mediaTime = mediaTime;
	debitEnter.signTime = signTime;
	//影像上传文件打包压缩插件
	Meap.zipCompression(debitEnter.platGlobalSeq + 'image' , debitEnter.picFileARR, function(msg) {
		//将要上传的影像插入到ios断点上传的数据库中
		//影像上传 业务参数
		var appBus = {
			'busiGloablaSeq': debitEnter.platGlobalSeq, //业务编号
			'attchType': '2', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
			'deviceNo': commonJson.udId, //设备编号
			'moduleId': debitEnter.moduleID, //模块编号
			'tranId': debitEnter.tranId1, //交易编号
			'orgId': commonJson.orgId, //机构编号
			'operatorNo': commonJson.adminCount, //操作员
			'custName': debitEnter.name, //客户名称
			'custCredType': '0', //客户证件类型
			'custCredNo': debitEnter.cerNO, //客户证件号
			'offlineOnline': commonJson.offlineOnline, //脱机/联机
			'workAddress': commonJson.workAddress //工作地址
		};
		appBus = JSON.stringify(appBus);
		var sendDataJson = {
			"databaseName": "myDatabase",
			"tableName": "up_download_info",
			"data": [{
				"fileToken": mediaTime, //文件唯一ID(可以为时间挫
				"pos": "0", //文件的断点信息(初始为0)
				"filePath": msg, //文件路径
				"appPath": "d002", //自定义文件路径
				"appBuss": appBus, //业务参数
				"downloadToken": "", //文件的下载ID(初始为空)
				"leng": "1", //文件的长度(初始为1)
				"isNotice": "yes" ,//是否调用后台(一直是yes)
				"fileType":"0",
				"REMARK1": "01" //上传状态01-默认
			}]
		};
		insertTableData(sendDataJson, function(msg) {
			if(++compressCount == 2){
                topicUtil.publish("xinka/digitalCardImgUpload");
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
	});
	//签名base64转路径
	Meap.transFormImage(debitEnter.platGlobalSeq + 'sign', debitEnter.data, 'picSty', function(msg) {
		//将要上传的签名插入到ios断点上传的数据库中
		//签名上传 业务参数
		var appBus = {
			"busiGloablaSeq": debitEnter.platGlobalSeq, //业务编号
			"attchType": "1", //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
			"deviceNo": commonJson.udId, //设备编号
			"moduleId": debitEnter.moduleID, //模块编号
			"tranId": debitEnter.tranId1, //交易编号
			"orgId": commonJson.orgId, //机构编号
			"operatorNo": commonJson.adminCount, //操作员
			"custName": custermerInfo.name, //客户名称
			"custCredType": "0", //客户证件类型
			"custCredNo": custermerInfo.cerNO, //客户证件号
			"offlineOnline": commonJson.offlineOnline, //脱机/联机
			"workAddress": commonJson.workAddress //工作地址
		};
		appBus = JSON.stringify(appBus);
		var sendDataJson = {
			"databaseName": "myDatabase",
			"tableName": "up_download_info",
			"data": [{
				"fileToken": signTime, //文件唯一ID(可以为时间挫
				"pos": "0", //文件的断点信息(初始为0)
				"filePath": msg, //文件路径
				"appPath": "d001", //自定义文件路径
				"appBuss": appBus, //业务参数
				"downloadToken": "", //文件的下载ID(初始为空)
				"leng": "1", //文件的长度(初始为1)
				"isNotice": "yes", //是否调用后台(一直是yes)
				"fileType":"1",
				"REMARK1": "01" //上传状态01-默认
			}]
		};
		insertTableData(sendDataJson, function(msg) {
			if(++compressCount == 2){
                topicUtil.publish("xinka/digitalCardImgUpload");
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
	});
}

/*虚拟卡建立客户信息*/
function iestablishCustomerInformationServiceSucc(msg) {
	//alert(msg+'建立客户信息');
	//alert('com.nqsky.service.debit_card.service.IEstablishCustomerInformationService');
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;

	if (responseCode[0].results == '00'||responseCode[0].results == '13') {
		//hideLoader();
//		debitEnter.platGlobalSeq = responseCode[0].platGlobalSeq; //流水号
		debitEnter.pdfUrl = responseCode[0].pdfUrl; //padUrl
		try {
			debitEnter.CLIENT_NO = responseCode[1].establishCustomerInformationVO[0].CLIENT_NO; //更新客户号
		} catch (err) {

		}
		if(lianwanghechaData.CheckResult=="09"){

        }else{
        //存储个人信息
		//cacheCustermerInfo('信通数字卡');
			cacheCustermerInfo({
				"databaseName": "myDatabase",
				"tableName": "customer_info",
				"data": [{
					"ADMINCOUNT": commonJson.adminCount, //登陆账号
					"SUBMITTIME": myTime.CurTime(), //提交时间
					"BUSINESSTYPE": "信通数字卡", //业务类型
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
					"checkPhoto": debitEnter.checkPhoto //联网核查图片
				}]
			});
    	}
		changeUploadStatus("02", debitEnter.mediaTime, debitEnter.signTime);
		if(responseCode[0].results == '13'){//业务处理成功后台报错弹窗
			hideLoader();
			showTags({
                'title': '提示',
                'content': responseCode[0].message,
                'ok': {
                    fun: function() {
                        $.mobile.changePage('xinka-complete.html');
                    }
                }
            });
		}else{
			hideLoader();
			$.mobile.changePage('xinka-complete.html');
		}
	} else if (responseCode[0].results == "08") {
		hideLoader();
		//提交数据
		if (debitEnter.isCoreHas) { //有客户号  维护客户信息
			showLoader("信息提交中...");
			var sendJson = {
				"b": [{
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"orgId.s": commonJson.orgId, //机构号
					"moduleId.s": debitEnter.moduleID, //模块编号
					"tranId.s": debitEnter.tranId1, //交易编号
					"operatorNo.s": commonJson.adminCount, //操作员
					"deviceNo.s": commonJson.udId, //设备编号
					"CLIENT_NO.s": debitEnter.CLIENT_NO, //客户号
					"CLIENT_NAME.s": debitEnter.name, //客户中文名称
					//"SEX.s" : sexJson[debitEnter.sex], //性别
					"DOCUMENT_TYPE.s": "0", //证件类型
					"DOCUMENT_ID.s": debitEnter.cerNO, //证件号码
					"EXPIRY_DATE.s": debitEnter.cerExpDt.split('-')[1].replace(/\./g, ""), //证件到期日
					"ISS_CITY.s": debitEnter.placeSelResVal, //地区代码
					"ISS_PLACE.s": debitEnter.placeSelRes, //签发地区
					"CONTACT_ID.s": debitEnter.tel, //联系电话
					"ADDRESS.s": debitEnter.placeDet.replace(/\s/g, ""), //地址
					"POSTAL_CODE.s": debitEnter.pCode, //通讯地址邮编
					"OCCUPATION_CODE.s": debitEnter.occupVal, //职业
					"ACCT_NO.s": debitEnter.CardNo, //卡号
					"ACCT_EXEC.s": commonJson.ifsCManagerId, //客户经理01A
					"PASSWORD.s": debitEnter.A, //密码
					"CVVN_CODE.s": debitEnter.CVVNCODE,
					"CARD_TYPE.s": debitEnter.CARDTYPE,
					"recommender.s": debitEnter.recomm,
					"fileData.s": debitEnter.data,
					"PAYEE_ACCT.s": debitEnter.reCardNo,
					"faceRecogn.s": debitEnter.faceRecogn, //人脸识别
					"BussinessCode.s": '01', //身份证联网核查业务编号
					"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
					"ReviewUserId.s": lianwanghechaData.ReviewUserId, //远程复核用户ID
					"platGlobalSeq.s": debitEnter.platGlobalSeq
				}]
			};
			//alert(JSON.stringify(sendJson));
			iestablishCustomerInformationServiceWFun(sendJson, function(msg) {
				iestablishCustomerInformationServiceSucc(msg);
			}, function(err) {
				pad_exception(err)
				// funFail(err);
			});
		} else { //没有客户号  建立客户信息
			showLoader("信息提交中...");
			var sendJson = {
				"b": [{
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"orgId.s": commonJson.orgId, //机构号
					"moduleId.s": debitEnter.moduleID, //模块编号
					"tranId.s": debitEnter.tranId1, //交易编号
					"operatorNo.s": commonJson.adminCount, //操作员
					"deviceNo.s": commonJson.udId, //设备编号
					"CLIENT_NAME.s": debitEnter.name, //客户中文名称
					"SEX.s": sexJson[debitEnter.sex], //性别
					"DOCUMENT_TYPE.s": "0", //证件类型
					"DOCUMENT_ID.s": debitEnter.cerNO, //证件号码
					"EXPIRY_DATE.s": debitEnter.cerExpDt.split('-')[1].replace(/\./g, ""), //证件到期日
					"ISS_CITY.s": debitEnter.placeSelResVal, //地区代码
					"ISS_PLACE.s": debitEnter.placeSelRes, //签发地区
					"CONTACT_ID.s": debitEnter.tel, //联系电话
					"ADDRESS2.s": custermerInfo.address, //户籍地址
					//"ADDRESS.s" : debitEnter.province+debitEnter.city+debitEnter.placeDet.replace(/\s/g,""), //地址
					"ADDRESS.s": debitEnter.subAddress.replace(/\s/g, ""), //地址
					"POSTAL_CODE.s": debitEnter.pCode, //通讯地址邮编
					"OCCUPATION_CODE.s": debitEnter.occupVal, //职业
					"ISS_DATE.s": debitEnter.cerExpDt.split('-')[0].replace(/\./g, ""), //签发日期
					"ISS_AUTHORITY.s": custermerInfo.issAuthority, //签发机构
					"BIRTH_DATE.s": custermerInfo.birthday.replace(/\-/g, ""), //出生日期
					"ACCT_NO.s": debitEnter.CardNo, //卡号
					"ACCT_EXEC.s": commonJson.ifsCManagerId, //客户经理01A
					"PASSWORD.s": debitEnter.A, //密码
					"CVVN_CODE.s": debitEnter.CVVNCODE,
					"CARD_TYPE.s": debitEnter.CARDTYPE,
					"recommender.s": debitEnter.recomm,
					"fileData.s": debitEnter.data,
					"PAYEE_ACCT.s": debitEnter.reCardNo,
					"faceRecogn.s": debitEnter.faceRecogn, //人脸识别
					"BussinessCode.s": '01', //身份证联网核查业务编号
					"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
					"ReviewUserId.s": lianwanghechaData.ReviewUserId, //远程复核用户ID
					"platGlobalSeq.s": debitEnter.platGlobalSeq
				}]
			};
			iestablishCustomerInformationServiceFun(sendJson, function(msg) {
				iestablishCustomerInformationServiceSucc(msg);
			}, function(err) {
				pad_exception(err)
				// funFail(err);
			});
		}
//		hideLoader();
//		showTags({
//			'title': '提示',
//			'content': responseCode[0].message,
//			'ok': {
//					
//			}
//		});
	} else if (responseCode[0].results == "09") {
		hideLoader();
		showTags({
			'title': '提示',
			'content': '业务处理超时!' + responseCode[0].message,
			'ok': {
				title: '继续处理',
				fun: function() {
					setTimeout(function(){
						showLoader('用户信息提交中...');
						// if(!(debitEnter.imgUploaded)){
						// 	changeUploadStatus("02", debitEnter.mediaTime, debitEnter.signTime);
						// }
						if (debitEnter.isCoreHas) { //有客户号  维护客户信息
							var sendJson = {
								"b": [{
									"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
									"workAddress.s": commonJson.workAddress, //工作地址
									"orgId.s": commonJson.orgId, //机构号
									"moduleId.s": debitEnter.moduleID, //模块编号
									"tranId.s": debitEnter.tranId1, //交易编号
									"operatorNo.s": commonJson.adminCount, //操作员
									"deviceNo.s": commonJson.udId, //设备编号
									"CLIENT_NO.s": debitEnter.CLIENT_NO, //客户号
									"CLIENT_NAME.s": debitEnter.name, //客户中文名称
									//"SEX.s" : sexJson[debitEnter.sex], //性别
									"DOCUMENT_TYPE.s": "0", //证件类型
									"DOCUMENT_ID.s": debitEnter.cerNO, //证件号码
									"EXPIRY_DATE.s": debitEnter.cerExpDt.split('-')[1].replace(/\./g, ""), //证件到期日
									"ISS_CITY.s": debitEnter.placeSelResVal, //地区代码
									"ISS_PLACE.s": debitEnter.placeSelRes, //签发地区
									"CONTACT_ID.s": debitEnter.tel, //联系电话
									"ADDRESS.s": debitEnter.placeDet.replace(/\s/g, ""), //地址
									"POSTAL_CODE.s": debitEnter.pCode, //通讯地址邮编
									"OCCUPATION_CODE.s": debitEnter.occupVal, //职业
									"ACCT_NO.s": debitEnter.CardNo, //卡号
									"ACCT_EXEC.s": commonJson.ifsCManagerId, //客户经理01A
									"PASSWORD.s": debitEnter.A, //密码
									"CVVN_CODE.s": debitEnter.CVVNCODE,
									"CARD_TYPE.s": debitEnter.CARDTYPE,
									"recommender.s": debitEnter.recomm,
									"fileData.s": debitEnter.data,
									"PAYEE_ACCT.s": debitEnter.reCardNo,
									"faceRecogn.s": debitEnter.faceRecogn, //人脸识别
									"BussinessCode.s": '01', //身份证联网核查业务编号
									"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
									"ReviewUserId.s": lianwanghechaData.ReviewUserId, //远程复核用户ID
									"platGlobalSeq.s": debitEnter.platGlobalSeq
								}]
							};
							//alert(JSON.stringify(sendJson));
							iestablishCustomerInformationServiceWFun(sendJson, function(msg) {
								iestablishCustomerInformationServiceSucc(msg);
							}, function(err) {
								pad_exception(err);
								// funFail(err);
							});
						} else { //没有客户号  建立客户信息
							var sendJson = {
								"b": [{
									"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
									"workAddress.s": commonJson.workAddress, //工作地址
									"orgId.s": commonJson.orgId, //机构号
									"moduleId.s": debitEnter.moduleID, //模块编号
									"tranId.s": debitEnter.tranId1, //交易编号
									"operatorNo.s": commonJson.adminCount, //操作员
									"deviceNo.s": commonJson.udId, //设备编号
									"CLIENT_NAME.s": debitEnter.name, //客户中文名称
									"SEX.s": sexJson[debitEnter.sex], //性别
									"DOCUMENT_TYPE.s": "0", //证件类型
									"DOCUMENT_ID.s": debitEnter.cerNO, //证件号码
									"EXPIRY_DATE.s": debitEnter.cerExpDt.split('-')[1].replace(/\./g, ""), //证件到期日
									"ISS_CITY.s": debitEnter.placeSelResVal, //地区代码
									"ISS_PLACE.s": debitEnter.placeSelRes, //签发地区
									"CONTACT_ID.s": debitEnter.tel, //联系电话
									"ADDRESS2.s": custermerInfo.address, //户籍地址
									//"ADDRESS.s" : debitEnter.province+debitEnter.city+debitEnter.placeDet.replace(/\s/g,""), //地址
									"ADDRESS.s": debitEnter.subAddress.replace(/\s/g, ""), //地址
									"POSTAL_CODE.s": debitEnter.pCode, //通讯地址邮编
									"OCCUPATION_CODE.s": debitEnter.occupVal, //职业
									"ISS_DATE.s": debitEnter.cerExpDt.split('-')[0].replace(/\./g, ""), //签发日期
									"ISS_AUTHORITY.s": custermerInfo.issAuthority, //签发机构
									"BIRTH_DATE.s": custermerInfo.birthday.replace(/\-/g, ""), //出生日期
									"ACCT_NO.s": debitEnter.CardNo, //卡号
									"ACCT_EXEC.s": commonJson.ifsCManagerId, //客户经理01A
									"PASSWORD.s": debitEnter.A, //密码
									"CVVN_CODE.s": debitEnter.CVVNCODE,
									"CARD_TYPE.s": debitEnter.CARDTYPE,
									"recommender.s": debitEnter.recomm,
									"fileData.s": debitEnter.data,
									"PAYEE_ACCT.s": debitEnter.reCardNo,
									"faceRecogn.s": debitEnter.faceRecogn, //人脸识别
									"BussinessCode.s": '01', //身份证联网核查业务编号
									"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
					                "ReviewUserId.s": lianwanghechaData.ReviewUserId, //远程复核用户ID
					                "platGlobalSeq.s": debitEnter.platGlobalSeq
								}]
							};
							iestablishCustomerInformationServiceFun(sendJson, function(msg) {
								iestablishCustomerInformationServiceSucc(msg);
							}, function(err) {
								pad_exception(err);
								// funFail(err);
							});
						}
					},300);
				}
			}
		});
	} else {
		hideLoader();
		changeUploadStatus("03", debitEnter.mediaTime, debitEnter.signTime);
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {
				fun: function() {
					$.mobile.changePage('xinka-product.html', {
						reverse: true
					});
				}
			}
		});
	}
}
//虚拟卡卡号获取 成功回调
function idebitCardInfoServiceSucc(msg) {
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '00') {
		debitEnter.CardNo = responseCode[1].hashMap[0].CARD_NO; //获取卡号
		debitEnter.CVVNCODE = responseCode[1].hashMap[0].CVVN_CODE; //获取cvvn码
		debitEnter.CARDTYPE = responseCode[1].hashMap[0].CARD_TYPE; //获取卡类型
		//发起电话银行
		showLoader('等待客户设置密码中...');
		debitEnter.telBankSet = true;
		//$(".duanX_con,.footter").css('visibility','hidden');
		if ($("#loaderCancel").length) {
			$("#loaderCancel").remove();
		}
		//$(".ui-loader").append('<div id="loaderCancel" style="width:300px; height:40px; line-height:40px; text-align:center;background-color:#ccc; position:absolute; bottom:80px; left:50%; margin-left:-150px;">取消</div>');
		$(".ui-loader").append('<div id="loaderCancel" style="width:300px; height:40px; line-height:40px; text-align:center; border:1px solid #FFFFFF; position:absolute; bottom:220px; left:50%; margin-left:-150px;color: #FFFFFF;">放弃</div>');
		$("#loaderCancel").off('click').on('click', function() {
			debitEnter.telBankSet = false;
			$('#xinka-customerConfirm #getMsg').removeClass('yzmGrey');
			/*if(timer){
			    clearInterval(timer);
			}*/
			//$(".duanX_con,.footter").css('visibility','visible');
			hideLoader();
		})
		var sendJson = {
			"b": [{
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"orgId.s": commonJson.orgId, //机构号
				"moduleId.s": debitEnter.moduleID, //模块编号
				"tranId.s": debitEnter.tranId1, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"PAITYPE.s": "A", //密码类型
				"DOCUMENT_ID.s": debitEnter.cerNO, //身份证号
				"ACCT_NO.s": debitEnter.CardNo, //卡账号
				"CLIENT_ID.s": "", //客户号
				"BUSI_TYPE.s": "01", //标识 电子卡01  电子渠道02
				"PHONE_NUMBER.s": debitEnter.tel, //电话号码 "0"+debitEnter.tel
				"faceRecogn.s": debitEnter.faceRecogn //人脸识别
			}]
		};
		IAskTelPhPwdServiceFun(sendJson, function(msg) {
			IAskTelPhPwdServiceDebitSucc(msg);
		}, function(err) {
			// $(".duanX_con,.footter").css('visibility','visible');
			funFail(err);
		});

	}else if(responseCode[0].results == '08'){
		hideLoader();
		//GChange08
		showLoader('数字卡卡号查询中...');
		var sendJson = {
			"b": [{
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"orgId.s": commonJson.orgId, //机构号
				"moduleId.s": debitEnter.moduleID, //模块编号
				"tranId.s": debitEnter.tranId1, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"CLIENT_NAME.s": custermerInfo.name,
				"DOCUMENT_ID.s": custermerInfo.cerNO,
				"CARD_TYPE.s": debitEnter.cardType, //卡类型
				"PRO_CODE.s": debitEnter.proCode, //卡代码
				"faceRecogn.s": debitEnter.faceRecogn //人脸识别
			}]
		};
		idebitCardInfoServiceFun(sendJson, function(msg) {
			idebitCardInfoServiceSucc(msg);
		}, function(err) {
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
//虚拟卡影像上传成功
/*function debitMediaUploadSucc(msg){
    //alert(msg);
    hideLoader();
    msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
    var responseObj = JSON.parse(msg);
    var responseCode = responseObj.b;
    if(responseCode[0].results == '00'){
        $.mobile.changePage('xinka-complete.html');
    }else{
        showTags({
                'title' : '提示',
                'content' :responseCode[0].message,
                'ok' : {}
            });
    }
}*/
////虚拟卡获取短信验证码
//function imessageAuthentionServiceSucc(msg) {
//	//alert(msg);
//	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//	var responseObj = JSON.parse(msg);
//	var responseCode = responseObj.b;
//	if (responseCode[0].results == '00') {
//		debitEnter.MSG_INFO = responseCode[1].messageAuthentionVO[0].MSG_INFO; //获取短信验证码
//		debitEnter.USER_NO = responseCode[1].messageAuthentionVO[0].USER_NO; //获取用户唯一标识
//		//$('#xinka-customerConfirm #inp').val(debitEnter.MSG_INFO); //UAT DEL
//	}else if(responseCode[0].results == '08'){
//		hideLoader();
//		//GChange08
//		var sendJson={
//              "b" : [{
//                  "offlineOnline.s":commonJson.offlineOnline,//脱机/联机
//                  "workAddress.s":commonJson.workAddress,//工作地址
//                  "orgId.s":commonJson.orgId,//机构号
//                  "moduleId.s":debitEnter.moduleID,//模块编号
//                  "tranId.s":debitEnter.tranId1,//交易编号
//                  "operatorNo.s":commonJson.adminCount,//操作员
//                  "deviceNo.s":commonJson.udId,//设备编号
//                  "SUSER_ID.s": commonJson.orgId+commonJson.adminCount, //机构号+柜员号
//                  "Flags.s": "BBBB", //标记位
//                  "MOBILE_NO.s": debitEnter.tel, //手机号码debitEnter.tel
//                  "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
//                  "faceRecogn.s" : debitEnter.faceRecogn //人脸识别
//              }]
//          };
//      imessageAuthentionServiceFun(sendJson,function(msg){
//          imessageAuthentionServiceSucc(msg);
//      },function(err){
//          $('#xinka-customerConfirm #getMsg').removeClass('yzmGrey');
//          funFail(err);
//      });
//	} else {
//		showTags({
//			'title': '提示',
//			'content': responseCode[0].message,
//			'ok': {}
//		});
//	}
//}
////虚拟卡验证短信验证码 成功回调
//function imessageAuthentionServiceYSucc(msg) {
//	//alert(msg);
//	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//	var responseObj = JSON.parse(msg);
//	var responseCode = responseObj.b;
//	if (responseCode[0].results == '00') {
//		showLoader('数字卡卡号查询中...');
//		//开始查询虚拟卡卡号
//		var sendJson = {
//			"b": [{
//				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
//				"workAddress.s": commonJson.workAddress, //工作地址
//				"orgId.s": commonJson.orgId, //机构号
//				"moduleId.s": debitEnter.moduleID, //模块编号
//				"tranId.s": debitEnter.tranId1, //交易编号
//				"operatorNo.s": commonJson.adminCount, //操作员
//				"deviceNo.s": commonJson.udId, //设备编号
//				"CLIENT_NAME.s": custermerInfo.name,
//				"DOCUMENT_ID.s": custermerInfo.cerNO,
//				"CARD_TYPE.s": debitEnter.cardType, //卡类型
//				"PRO_CODE.s": debitEnter.proCode, //卡代码
//				"faceRecogn.s": debitEnter.faceRecogn //人脸识别
//			}]
//		};
//		idebitCardInfoServiceFun(sendJson, function(msg) {
//			idebitCardInfoServiceSucc(msg);
//		}, function(err) {
//			funFail(err);
//		})
//	}else if(responseCode[0].results == '08'){
//		hideLoader();
//	} else {
//		hideLoader();
//		$('#xinka-customerConfirm #getMsg').removeClass('yzmGrey');
//		showTags({
//			'title': '提示',
//			'content': responseCode[0].message,
//			'ok': {}
//		});
//	}
//}
//维护客户信息查询成功
function IEstablishCustomerInformationServiceFSucc(msg) {
	//alert(msg);
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '00') {
		debitEnter.querySuss=true;
		daikuanXINxi.resource = responseCode[0].resource;
		//客户号查询客户信息成功  返显信息 PHR  PHM
		debitEnter.xTel = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[1].contactInfo[0].CONTACT_ID); //手机号码
		debitEnter.xPCode = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].POSTAL_CODE); //邮编
		debitEnter.xPlaceDet = $.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].ADDRESS2); //通讯地址
		debitEnter.xOccup = $.trim(responseCode[1].clientDescVO[0].OCCUPATION_CODE); //职业
		debitEnter.issPlace = $.trim(responseCode[1].clientDescVO[1].DOCUMENT_INFO[0].documentInfo[0].ISS_PLACE); //签发地区
		debitEnter.distCode = $.trim(responseCode[1].clientDescVO[1].DOCUMENT_INFO[0].documentInfo[0].DIST_CODE); //签发地区代码
		//alert(debitEnter.issPlace+',,,,'+debitEnter.distCode);
		//$('#s_province,#s_city,#s_county').attr('disabled','disabled');
		if (daikuanXINxi.resource == '0' && ($.trim(responseCode[1].clientDescVO[0].CH_GIVEN_NAME) != $.trim(custermerInfo.name))) {
			showTags({
				'title': '提示',
				'content': '用户姓名与核心不一致，无法办理！',
				'ok': {
					fun: function() {
						$.mobile.changePage('xinka-product.html', {
							reverse: true
						});
					}
				}
			});
			return;
		}
		if (daikuanXINxi.resource == '0' && debitEnter.xTel == '') {
			showTags({
				'title': '提示',
				'content': '核心无法查询到手机号码，无法办理！',
				'ok': {
					fun: function() {
						$.mobile.changePage('xinka-product.html', {
							reverse: true
						});
					}
				}
			});
			return;
		}
		$.mobile.changePage('./xinka-agreement.html');
	}else if(responseCode[0].results == '03'){
		debitEnter.issPlace = '';
		debitEnter.distCode ='';
		$.mobile.changePage('./xinka-agreement.html');
	}else if(responseCode[0].results == '08'){
		hideLoader();
		//GChange08
//		var sendJson = {
//				"b": [{
//					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
//					"workAddress.s": commonJson.workAddress, //工作地址
//					"orgId.s": commonJson.orgId, //机构号
//					"moduleId.s": debitEnter.moduleID, //模块编号
//					"tranId.s": debitEnter.tranId1, //交易编号
//					"operatorNo.s": commonJson.adminCount, //操作员
//					"deviceNo.s": commonJson.udId, //设备编号
//					"CLIENT_NO.s": debitEnter.CLIENT_NO, //客户号debitEnter.CLIENT_NO   0700358223
//					"AGENT_FLAG.s": "", //法人代表
//					"CLIENT_TYPE.s": "P" //N单位 P个人
//				}]
//			};
		var sendJson = {
                "b": [{
                    "IDTYPE.s": "0", //证件类型
                    "IDNO.s": custermerInfo.cerNO,//证件号
                    "CLIENT_TYPE.s": 'P', //客户类型
                    "CLIENT_NO.s": debitEnter.CLIENT_NO, //客户号debitEnter.CLIENT_NO   0700358223
                    "AGENT_FLAG.s": '', //法人代表
                    "deviceNo.s": commonJson.udId, //设备编号
                    "orgId.s": commonJson.orgId, //机构号
                    "moduleId.s": debitEnter.moduleID, //模块编号
                    "tranId.s": debitEnter.tranId1, //交易编号
                    "operatorNo.s": commonJson.adminCount, //操作员
                }]
			            };
			IEstablishCustomerInformationServicetWOFFun(sendJson, function(msg) {
				IEstablishCustomerInformationServiceFSucc(msg);
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

//电话银行外呼 成功回调
function IAskTelPhPwdServiceDebitSucc(msg) {
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	
	if(debitEnter.telBankSet == false)
	{
		hideLoader();
		return false;
	}
	
	
	if (responseCode[0].results == '00') {
		debitEnter.SEQNUM = responseCode[1].pwdRecVO[0].SEQ_NUM;
		//发起电话银行
		showLoader("等待客户设置密码中...");
		
		if ($("#loaderCancel").length) {
			$("#loaderCancel").remove();
		}
		//$(".ui-loader").append('<div id="loaderCancel" style="width:300px; height:40px; line-height:40px; text-align:center;background-color:#ccc; position:absolute; bottom:80px; left:50%; margin-left:-150px;">取消</div>');
		$(".ui-loader").append('<div id="loaderCancel" style="width:300px; height:40px; line-height:40px; text-align:center; border:1px solid #FFFFFF; position:absolute; bottom:220px; left:50%; margin-left:-150px;color: #FFFFFF;">放弃</div>');
		$("#loaderCancel").off('click').on('click', function() {
			debitEnter.telBankSet = false;
			//$('#xinka-customerConfirm #getMsg').removeClass('yzmGrey');
			hideLoader();
		})
		
		
		var sendJson = {
			"b": [{
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"orgId.s": commonJson.orgId, //机构号
				"moduleId.s": debitEnter.moduleID, //模块编号
				"tranId.s": debitEnter.tranId1, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"SEQ_NUM.s": debitEnter.SEQNUM,
				"faceRecogn.s": debitEnter.faceRecogn //人脸识别
			}]
		};
		IAskTelPhPwdServiceGFun(sendJson, function(msg) {
			IAskTelPhPwdServiceDebitGSucc(msg);
		}, function(err) {
			//$(".duanX_con,.footter").css('visibility','visible');
			funFail(err);
		});
	}else if(responseCode[0].results == '08'){
		hideLoader();
	} else {
		hideLoader();
		//$(".duanX_con,.footter").css('visibility','visible');
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}
//电话银行获取密码 成功回调
function IAskTelPhPwdServiceDebitGSucc(msg) {
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;

	if (responseCode[0].results == '00') {
		if (!responseCode[0].message) {
			setTimeout(function() {
            	if (debitEnter.telBankSet == false) 
            	{
            		hideLoader();
            		return false;
            	}
				hideLoader();
				showLoader("等待客户设置密码中...");
				
				if ($("#loaderCancel").length) {
				$("#loaderCancel").remove();
				}
				//$(".ui-loader").append('<div id="loaderCancel" style="width:300px; height:40px; line-height:40px; text-align:center;background-color:#ccc; position:absolute; bottom:80px; left:50%; margin-left:-150px;">取消</div>');
				$(".ui-loader").append('<div id="loaderCancel" style="width:300px; height:40px; line-height:40px; text-align:center; border:1px solid #FFFFFF; position:absolute; bottom:220px; left:50%; margin-left:-150px;color: #FFFFFF;">放弃</div>');
				$("#loaderCancel").off('click').on('click', function() {
					debitEnter.telBankSet = false;
					//$('#xinka-customerConfirm #getMsg').removeClass('yzmGrey');
					hideLoader();
				})
				var sendJson = {
					"b": [{
						"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
						"workAddress.s": commonJson.workAddress, //工作地址
						"orgId.s": commonJson.orgId, //机构号
						"moduleId.s": debitEnter.moduleID, //模块编号
						"tranId.s": debitEnter.tranId1, //交易编号
						"operatorNo.s": commonJson.adminCount, //操作员
						"deviceNo.s": commonJson.udId, //设备编号
						"SEQ_NUM.s": debitEnter.SEQNUM,
						"faceRecogn.s": debitEnter.faceRecogn //人脸识别
					}]
				};
				IAskTelPhPwdServiceGFun(sendJson, function(msg) {
					IAskTelPhPwdServiceDebitGSucc(msg);
				}, function(err) {
					//$(".duanX_con,.footter").css('visibility','visible');
					funFail(err);
				});
			}, 5000);
		} else {
			debitEnter.A = responseCode[0].A;
			hideLoader();
			// $(".duanX_con,.footter").css('visibility','visible');
			showTags({
				'title': '提示',
				'content': '客户密码设置成功！',
				'ok': {
					title: '继续',
					fun: function() {
						if(debitEnter.platGlobalSeq != undefined && debitEnter.platGlobalSeq != null && debitEnter.platGlobalSeq != ''){
							digitalCardImgUpload(function(){
				    			submitDebitCardInfo();
							});
				    	} else {
				    		getPlatGlobalSeq(debitEnter, function(){
				    			digitalCardImgUpload(function(){
				    				submitDebitCardInfo();
				    			});
				    		});
				    	}
					}
				}
			});

			/*hideLoader();
			showTags({
			    'title' : '提示',
			    'content' :'取款密码设置成功!',
			    'ok' : {fun:function(){
			    }}
			});*/
		}

	}else if(responseCode[0].results == '08'){
		hideLoader();
	}else {
		hideLoader();
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}

function submitDebitCardInfo(){
	showLoader("信息提交中...");
	// debitEnter.imgUploaded = false;	//上传标记位，防止重复上传
	//提交数据
	if (debitEnter.isCoreHas) { //有客户号  维护客户信息
		var sendJson = {
			"b": [{
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"orgId.s": commonJson.orgId, //机构号
				"moduleId.s": debitEnter.moduleID, //模块编号
				"tranId.s": debitEnter.tranId1, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"CLIENT_NO.s": debitEnter.CLIENT_NO, //客户号
				"CLIENT_NAME.s": debitEnter.name, //客户中文名称
				//"SEX.s" : sexJson[debitEnter.sex], //性别
				"DOCUMENT_TYPE.s": "0", //证件类型
				"DOCUMENT_ID.s": debitEnter.cerNO, //证件号码
				"EXPIRY_DATE.s": debitEnter.cerExpDt.split('-')[1].replace(/\./g, ""), //证件到期日
				"ISS_CITY.s": debitEnter.placeSelResVal, //地区代码
				"ISS_PLACE.s": debitEnter.placeSelRes, //签发地区
				"CONTACT_ID.s": removeSpace(debitEnter.tel),//debitEnter.tel, //联系电话
				"ADDRESS.s": debitEnter.placeDet.replace(/\s/g, ""), //地址
				"POSTAL_CODE.s": debitEnter.pCode, //通讯地址邮编
				"OCCUPATION_CODE.s": debitEnter.occupVal, //职业
				"ACCT_NO.s": removeSpace(debitEnter.CardNo),//debitEnter.CardNo, //卡号
				"ACCT_EXEC.s": commonJson.ifsCManagerId, //客户经理01A
				"PASSWORD.s": debitEnter.A, //密码
				"CVVN_CODE.s": debitEnter.CVVNCODE,
				"CARD_TYPE.s": debitEnter.CARDTYPE,
				"recommender.s": debitEnter.recomm,
				"fileData.s": debitEnter.data,
				"PAYEE_ACCT.s": debitEnter.reCardNo,
				"faceRecogn.s": debitEnter.faceRecogn, //人脸识别
				"BussinessCode.s": '01', //身份证联网核查业务编号
				"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
				"ReviewUserId.s": lianwanghechaData.ReviewUserId, //远程复核用户ID
				"platGlobalSeq.s": debitEnter.platGlobalSeq,
				"longitude.s": commonJson.longitude,//客户经理轨迹定位
                "latitude.s": commonJson.latitude//客户经理轨迹定位
			}]
		};
		iestablishCustomerInformationServiceWFun(sendJson, function(msg) {
			iestablishCustomerInformationServiceSucc(msg);
		}, function(err) {
			pad_exception(err);
			// err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
   //          var responseObj = JSON.parse(err);
   //          var responseCode = responseObj.b[0].error[0];
   //      	var errMsg = $.trim(responseCode.message).toUpperCase();
   //          if (errMsg == 'THE REQUEST TIMED OUT' || errMsg == 'A CONNECTION FAILURE OCCURRED') {//全部改成大写即可捕获
   //          	debitEnter.imgUploaded = true;
   //          	changeUploadStatus("02", debitEnter.mediaTime, debitEnter.signTime);
	  //       }
		});
	} else { //没有客户号  建立客户信息
		var sendJson = {
			"b": [{
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"orgId.s": commonJson.orgId, //机构号
				"moduleId.s": debitEnter.moduleID, //模块编号
				"tranId.s": debitEnter.tranId1, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"deviceNo.s": commonJson.udId, //设备编号
				"CLIENT_NAME.s": debitEnter.name, //客户中文名称
				"SEX.s": sexJson[debitEnter.sex], //性别
				"DOCUMENT_TYPE.s": "0", //证件类型
				"DOCUMENT_ID.s": debitEnter.cerNO, //证件号码
				"EXPIRY_DATE.s": debitEnter.cerExpDt.split('-')[1].replace(/\./g, ""), //证件到期日
				"ISS_CITY.s": debitEnter.placeSelResVal, //地区代码
				"ISS_PLACE.s": debitEnter.placeSelRes, //签发地区
				"CONTACT_ID.s": removeSpace(debitEnter.tel),//debitEnter.tel, //联系电话
				"ADDRESS2.s": custermerInfo.address, //户籍地址
				//"ADDRESS.s" : debitEnter.province+debitEnter.city+debitEnter.placeDet.replace(/\s/g,""), //地址
				"ADDRESS.s": debitEnter.subAddress.replace(/\s/g, ""), //地址
				"POSTAL_CODE.s": debitEnter.pCode, //通讯地址邮编
				"OCCUPATION_CODE.s": debitEnter.occupVal, //职业
				"ISS_DATE.s": debitEnter.cerExpDt.split('-')[0].replace(/\./g, ""), //签发日期
				"ISS_AUTHORITY.s": custermerInfo.issAuthority, //签发机构
				"BIRTH_DATE.s": custermerInfo.birthday.replace(/\-/g, ""), //出生日期
				"ACCT_NO.s": removeSpace(debitEnter.CardNo),//debitEnter.CardNo, //卡号
				"ACCT_EXEC.s": commonJson.ifsCManagerId, //客户经理01A
				"PASSWORD.s": debitEnter.A, //密码
				"CVVN_CODE.s": debitEnter.CVVNCODE,
				"CARD_TYPE.s": debitEnter.CARDTYPE,
				"recommender.s": debitEnter.recomm,
				"fileData.s": debitEnter.data,
				"PAYEE_ACCT.s": debitEnter.reCardNo,
				"faceRecogn.s": debitEnter.faceRecogn, //人脸识别
				"BussinessCode.s": '01', //身份证联网核查业务编号
				"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
				"ReviewUserId.s": lianwanghechaData.ReviewUserId, //远程复核用户ID
				"platGlobalSeq.s": debitEnter.platGlobalSeq,
				"longitude.s": commonJson.longitude,//客户经理轨迹定位
                "latitude.s": commonJson.latitude//客户经理轨迹定位
			}]
		};
		iestablishCustomerInformationServiceFun(sendJson, function(msg) {
			iestablishCustomerInformationServiceSucc(msg);
		}, function(err) {
			pad_exception(err);
			// err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
   //          var responseObj = JSON.parse(err);
   //          var responseCode = responseObj.b[0].error[0];
   //          var errMsg = $.trim(responseCode.message).toUpperCase();
   //          if (errMsg == 'THE REQUEST TIMED OUT' || errMsg == 'A CONNECTION FAILURE OCCURRED') {//全部改成大写即可捕获
   //          	debitEnter.imgUploaded = true;
   //          	changeUploadStatus("02", debitEnter.mediaTime, debitEnter.signTime);
	  //       }
		});
	}
}

/*影像两两对比成功回调*/
function IFacelRecognitionServiceDebitSucc(msg) {
	//alert(msg);
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '0') {
		$('#xinka-personFace .previous:last').addClass('btn_next');
		debitEnter.platGlobalSeqP = responseCode[0].platGlobalSeq; //流水号
		debitEnter.cardResult = responseCode[1].photoCompareVO[0].CARD_RESULT; //联网核查结果
		debitEnter.chipResult = responseCode[1].photoCompareVO[0].CHIP_RESULT; //芯片结果
		if (responseCode[1].photoCompareVO[0].CHIP_RESULT == "0") { //芯片通过
			$("#xinka-personFace .face-result:eq(0)").text('通过');
		} else {
			$("#xinka-personFace .face-result:eq(0)").addClass('no-pass').text('未通过');
		}
		if (responseCode[1].photoCompareVO[0].CARD_RESULT == "0") { //联网核查通过
			$("#xinka-personFace .face-result:eq(1)").text('通过');
		} else {
			$("#xinka-personFace .face-result:eq(1)").addClass('no-pass').text('未通过');
		}
		if (responseCode[1].photoCompareVO[0].CHIP_RESULT == "0" && responseCode[1].photoCompareVO[0].CARD_RESULT == "0") {
			debitEnter.isTelCheck = true; //远程复核成功
			debitEnter.faceRecogn = '1'; //自动通过
			$("#xinka-personFace .center-header").text('人脸识别通过！');
			$("#xinka-managerList").hide();
		} else {
			debitEnter.faceRecogn = '2'; //自动不通过
			$("#xinka-personFace .center-header").text('人脸识别未通过！');
			$('#xinka-personFace .previous:last').text('远程复核');
			//debitEnter.isTelCheck = true;
		}


	}else if(responseCode[0].results == '08'){
		hideLoader();
	} else {
		//$("#xinka-personFace .center-header").text('人脸识别失败！');
		debitEnter.faceRecogn = '2'; //自动不通过
		$("#xinka-personFace .face-result").addClass('no-pass').text('未通过');
		$("#xinka-personFace .center-header").text('人脸识别未通过！');
		$('#xinka-personFace .previous:last').addClass('btn_next');
		$('#xinka-personFace .previous:last').text('远程复核');
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
	}
}
/*远程复核成功回调*/
function iissuesServiceSucc(msg) {
	//alert(msg);
	//hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '00' || responseCode[0].results == '66') {
		/*if(responseCode[0].status == '5'){
		    showTags({
		            'title' : '提示',
		            'content' :'远程复核通过！',
		            'ok' : {fun:function(){
		                debitEnter.isTelCheck = true; //远程复核成功
		                $.mobile.changePage('xinka-messageIn.html');
		            }}
		        });
		}else{
		    showTags({
		            'title' : '提示',
		            'content' : responseCode[0].message,
		            'ok' : {}
		        });
		}*/

		debitEnter.tsReviewId = responseCode[0].tsReviewId;
		$(".ui-loader").append('<div id="loaderCancel" style="width:300px; height:40px; line-height:40px; text-align:center; border:1px solid #FFFFFF; position:absolute; bottom:220px; left:50%; margin-left:-150px;color: #FFFFFF;">放弃<span id="time-daojishi"></div>');
		var timeout = new Timeout('loaderCancel', 15);
		timeout.blocking('time-daojishi'); //spanid:延迟过程中显示ID
		localStorage.intervalID = timeout.getIntervalID();
		$("#loaderCancel").off('click').on('click', function() {
			debitEnter.telCheck = false;
			hideLoader();
			var sendJson = {
				"b": [{
					"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
					"workAddress.s": commonJson.workAddress, //工作地址
					"orgId.s": commonJson.orgId, //机构号
					"moduleId.s": debitEnter.moduleID, //模块编号
					"tranId.s": debitEnter.tranId1, //交易编号
					"operatorNo.s": commonJson.adminCount, //操作员
					"deviceNo.s": commonJson.udId, //设备编号
					"tsReviewId.s": debitEnter.tsReviewId
				}]
			};
			iphotoServiceStopFun(sendJson, function(msg) {

			}, function(err) {

			});
			setTimeout(function(){
            		hideLoader();
            },3500)
		})
		var sendJson = {
			"b": [{
				"deviceNo.s": commonJson.udId, //设备编号
				"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				"workAddress.s": commonJson.workAddress, //工作地址
				"orgId.s": commonJson.orgId, //机构号
				"moduleId.s": debitEnter.moduleID, //模块编号
				"tranId.s": debitEnter.tranId1, //交易编号
				"operatorNo.s": commonJson.adminCount, //操作员
				"tsReviewId.s": debitEnter.tsReviewId,
				"userIds.s": $('#xinka-managerList select').val() //用户ID
			}]
		};
		getTsRevieweleSignFun(sendJson, function(msg) {
			getTsRevieweleDebitSucc(msg);
		}, function(err) {
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
/*远程复核获取客户经理列表*/
function ISysUserServiceManListDebitSucc(msg) {
	//alert(msg);
	hideLoader();
	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (responseCode[0].results == '00') {
		var textHtml = '<option></option>';
		//onlineFlag
		$.each(responseCode[1].TsReviewerVOs, function(index, el) {
			//if(index == 0) return;
			if (el.sysUserVO[0].onlineFlag != "1") return;
			textHtml += '<option realName="' + el.sysUserVO[0].realName + '" cellPhone="' + el.sysUserVO[0].cellPhone + '" value="' + el.sysUserVO[0].userId + '">' + el.sysUserVO[0].userId + el.sysUserVO[0].realName + '</option>';
		});
		$('#xinka-managerList select').html(textHtml).selectmenu('refresh');
	}else if(responseCode[0].results == '08'){
		hideLoader();
	} else {
		showTags({
			'title': '提示',
			'content': responseCode[0].message,
			'ok': {}
		});
		$('#xinka-managerList select').html('<option></option>').selectmenu('refresh');
	}
}
/*远程复核查询  成功回调*/
function getTsRevieweleDebitSucc(msg) {
	//alert(msg);

	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
	var responseObj = JSON.parse(msg);
	var responseCode = responseObj.b;
	if (debitEnter.telCheck == false) return;
	if (responseCode[0].results == '00') {
		if (responseCode[0].status == '5') {
			hideLoader();
			showTags({
				'title': '提示',
				'content': '远程复核通过！',
				'ok': {
					fun: function() {
						debitEnter.isTelCheck = true; //远程复核成功
						debitEnter.faceRecogn = '3'; //远程复核通过
                        		$.mobile.changePage('xinka-messageIn.html');
                        		lianwanghechaData.ReviewUserId = $('#xinka-managerList select').val();

					}
				}
			});
			clearInterval(localStorage.intervalID);
		} else if (responseCode[0].status == '2' || responseCode[0].status == '3') {
			setTimeout(function() {
				var sendJson = {
					"b": [{
						"deviceNo.s": commonJson.udId, //设备编号
						"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
						"workAddress.s": commonJson.workAddress, //工作地址
						"orgId.s": commonJson.orgId, //机构号
						"moduleId.s": debitEnter.moduleID, //模块编号
						"tranId.s": debitEnter.tranId1, //交易编号
						"operatorNo.s": commonJson.adminCount, //操作员
						"tsReviewId.s": debitEnter.tsReviewId,
						"userIds.s": $('#xinka-managerList select').val() //用户ID
					}]
				};
				getTsRevieweleSignFun(sendJson, function(msg) {
					getTsRevieweleDebitSucc(msg);
				}, function(err) {
					funFail(err);
				});
			}, 5000);
		} else {
			debitEnter.faceRecogn = '4'; //远程复核不通过
			hideLoader();
			showTags({
				'title': '提示',
				'content': responseCode[0].message,
				'ok': {}
			});
			clearInterval(localStorage.intervalID);
		}
	}else if(responseCode[0].results == '08'){
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
