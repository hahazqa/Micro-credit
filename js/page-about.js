/**
 *丁宗花－2015-9-25
 */
//产品展业
$(document).on("pageshow", "#about-showIndustry", function () {
	$("#chanpinzhanye_00").html('');
//选中当前导航选项
    $(".navigation-con li").eq(parseInt(loginAttr.proType) - 1).addClass("navigation-bgcolor").siblings('li').removeClass("navigation-bgcolor");

//  function sendIproduct(_id) {
//      //		showLoader('数据初始化中...');
//      var aboutJson = { //发送请求的参数
//          "b": [{
//              "deviceNo.s": '', //设备编号commonJson.udId
//              "moduleId.s": '', //模块名
//              "tranId.s": '', //交易名
//              "orgId.s": '', //机构号commonJson.orgId
//              "operatorNo.s": '', //操作员commonJson.adminCount
//              "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
//              "workAddress.s": "", //工作地址
//              "proType.s": _id || loginAttr.proType //产品类型
//
//          }]
//      };
//      //var picWord = new PicWord('C', _id || loginAttr.proType);
//      //var flag = picWord.pushData('C', _id || loginAttr.proType);
//      //if (!flag) {
//          showLoader('数据初始化中...');
//          if (commonJson.offlineOnline == 'offline') { //脱机情况下
//
//          } else { //联机情况下
//              $("#chanpinzhanye_00").html('');
//              iproductServiceFun(aboutJson, function (msg) {
////              	alert(msg);
//                  chanpinzanye(msg);
//                 // picWord.cache('C', _id || loginAttr.proType, msg);
//              }, function (err) {
//              if ($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
//						hideLoader();
//				        responseCode.message = '当前网络不可用,请检测网络!';
//				    }
//					if($.trim(responseCode.message).toUpperCase() == 'THE REQUEST TIMED OUT') {
//						hideLoader();
//						responseCode.message = '系统超时,请重新操作!';
//					}
//                  hideLoader();
//                  funFail(err);
//              });
//          }
//      //}
//  }
function sendIproduct(_id) { //产品展业
		$("#chanpinzhanye_00").html('');
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
					$("#chanpinzhanye_00").html('');
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

    sendIproduct(loginAttr.proType);

//  function chanpinzanye(msg) {
//      //$(".navigation-con li").removeClass("navigation-bgcolor");
//      hideLoader();
//      msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//      var responseObj = JSON.parse(msg);
//      var responseCode = responseObj.b;
//      if (responseCode[0].results == "00") {
//          var j = 1;
//          var _roPicture;
//          //			var proId;
//          for (j = 1; j < responseCode.length; j++) {
//              var _productVOArray = responseCode[j].productVO;
//              $.each(_productVOArray, function (i, d) {
//                  _roPicture = d.protepPicture;
//                  _roPicture = _roPicture.replace(/\\/g, "").replace('data:image/png;base64,', '');
//                  //					proId = d.proId;
//
//                  $("#chanpinzhanye_00").append('<a name="after_a_' + d.proId + '" data-type="' + d.proType + '" data-picindex="" data-proId="' + d.proId + '"  href="javascript:;" class="chanpinzhanshi-click" data-proname="' + d.proName + '" data-image="' + d.proPicture + '"><div class="dispaly-cpzynone">' + d.proReferral + '</div><img src="data:image/png;base64,' + _roPicture + '" class="womendeyinhang-img" /><div class="womendeyinhang-title">' + d.proName + '</div></a>');
//
////                  Meap.transFormImage(d.proId+'ba', _roPicture, 'picSty', function (msg) {
////                      $("a[name='after_a_" + d.proId + "']").attr("data-image", msg);
////                      $("a[name='after_a_" + d.proId + "']>img").attr("src", msg);
////                  }, function (err) {
////                  });
//                  //					var ImgJson = { //发送请求的参数
//                  //						"b": [{
//                  //							"deviceNo.s": '', //设备编号commonJson.udId
//                  //							"moduleId.s": '', //模块名
//                  //							"tranId.s": '', //交易名
//                  //							"orgId.s": '', //机构号commonJson.orgId
//                  //							"operatorNo.s": '', //操作员commonJson.adminCount
//                  //							"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
//                  //							"workAddress.s": "", //工作地址
//                  //							"proId.s": proId, //
//                  //							"ProPicture.s": _roPicture //图片路径
//                  //
//                  //						}]
//                  //					};
//                  //					var imageLoad = new ImageLoad(ImgJson);
//                  //					imageLoad.show();
//                  //					IProductServiceImgFun(ImgJson, function(msg) {
//                  //						alert(msg);
//                  //						chanpinzhanyeImg(msg);
//                  //					}, function(err) {
//                  //						hideLoader();
//                  //						funFail(err);
//                  //					});
//
//              });
//          }
//
//          //$("#chanpinzhanye_00").html(html);
//          //			$("#"+loginAttr.proType).addClass("navigation-bgcolor");//.siblings("li").removeClass("navigation-bgcolor");
//
//      } else {
//          hideLoader();
//          showTags({
//              'title': '提示',
//              'content': responseCode[0].message,
//              'ok': {}
//          });
//      }
//  }
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

			//$("#chanpinzhanye_00").html(html);
			//			$("#"+loginAttr.proType).addClass("navigation-bgcolor");//.siblings("li").removeClass("navigation-bgcolor");

		} else if (responseCode[0].results == "08") {
			$("#chanpinzhanye_00").html('');
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
		$("#chanpinzhanye_00").append('<a name="after_a_' + d.proId + '" data-type="' + d.proType + '" data-picindex="" data-proId="' + d.proId + '"  href="javascript:;" class="chanpinzhanshi-click" data-proname="' + d.proName + '" data-image="' + d.protepPicture + '"><div class="dispaly-cpzynone">' + d.proReferral + '</div><img src="data:image/png;base64,' + _roPicture + '" class="womendeyinhang-img" /><div class="womendeyinhang-title">' + d.proName + '</div></a>');

	}

//function chanpinzhanyeImg(msg) { //图片信息
//	msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//	var responseObj = JSON.parse(msg);
//	var responseCode = responseObj.b;
//	if (responseCode[0].results == "00") {
//		var pic = responseCode[1].productPictureVO[0];
//
//		var CUSTANDCUSTOWNERPICBase64 = pic.proPicture.replace(/\\/g, "").replace('data:image/png;base64,', '');
//		Meap.transFormImage(pic.proId, CUSTANDCUSTOWNERPICBase64, 'picSty', function(msg) {
//			alert(msg);
//			$("a[name='after_a_" + pic.proId + "']").attr("data-image", msg);
//			$("a[name='after_a_" + pic.proId + "']>img").attr("src", msg);
//			//alert(msg);
//			//$("#chanpinzhanye_00").append('<img src="'+ msg +'" class="womendeyinhang-img" />');
//			//$("#chanpinzhanye_00").append('<a href="javascript:;" class="chanpinzhanshi-click" data-proname="'+d.proName+'" data-proReferral="'+d.proReferral+'" data-image="'+msg+'"><img src="'+ msg +'" class="womendeyinhang-img" /><div class="womendeyinhang-title">'+d.proName+'</div></a>');
//		}, function(err) {
//			showTags({
//				'title': '提示',
//				'content': '图片转换失败',
//				'ok': {}
//			});
//		});
//	} else {
//		hideLoader();
//		showTags({
//			'title': '提示',
//			'content': responseCode[0].message,
//			'ok': {}
//		});
//	};
//};

//	var ImageLoad = function(data){
//		var ImgJson = data;
//		var ImageOp = {
//			show:function(){
//				//alert(ImgJson.b[0]["proId.s"]);
//				IProductServiceImgFun(ImgJson, function(msg) {
//					msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
//					var responseObj = JSON.parse(msg);
//					var responseCode = responseObj.b;
//					if (responseCode[0].results == "00") {
//						var pic = responseCode[1].productPictureVO[0];
//						var CUSTANDCUSTOWNERPICBase64 = pic.proPicture.replace(/\\/g, "").replace('data:image/png;base64,', '');
//						//alert("IProductServiceImgFun.proId = " + pic.proId);
//						Meap.transFormImage(pic.proId, CUSTANDCUSTOWNERPICBase64, 'picSty', function(_msg) {
//							//alert("proId = " +pic.proId +" | " + "_msg = " + _msg);
//							$("a[name='after_a_" + pic.proId + "']").attr("data-image", _msg);
//							$("a[name='after_a_" + pic.proId + "']>img").attr("src", _msg);
//						}, function(err) {
//							showTags({
//								'title': '提示',
//								'content': '图片转换失败',
//								'ok': {}
//							});
//						});
//					} else {
//						showTags({
//							'title': '提示',
//							'content': responseCode[0].message,
//							'ok': {}
//						});
//					};
//				}, function(err) {
//				});
//			}
//		}
//		return ImageOp;
//	}

    $(".navigation-con>li").unbind().on("click", function () { //产品展业头部导航点击变换
    	$("#chanpinzhanye_00").html('');
		//		showLoader('数据初始化中...');
		var _id = $(this).attr('data-id');
		if (loginAttr.proType != _id) {
			sendIproduct(_id);
		}

		$(this).addClass("navigation-bgcolor").siblings("li").removeClass("navigation-bgcolor");

	});

}).on('pageinit', "#about-showIndustry", function () {
var swiperTwoOneWindow = new Swiper('.containerafter', { //弹窗左右划屏
                    pagination: '.pagination-after',
                    paginationClickable: true,
                    spaceBetween: 30,
                    initialSlide :0,
                    noSwiping: false
                });
    $("#chanpinzhanye_00").on('click', '.chanpinzhanshi-click', function () { //产品展业弹窗
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

});

