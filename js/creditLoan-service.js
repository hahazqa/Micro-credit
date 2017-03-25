/*
 * author LiChenglin
 * date 2016-06-23
 * 
 */
$CL.svc={
		//贷款产品服务查询
		queryRemoteProduct:function(bodyJson){//creditLoanProductRemoteQuery
			showLoader('产品信息查询中...');
			getCreditLoanProductListFun(bodyJson, function(msg) {
				hideLoader();
				$CL.svc.queryRemoteProductSucc(msg);
			}, function(err) {
				localStorage.creditLoanProductTime = 1;
				funFail(err);
			});
		},
		queryRemoteProductSucc:function(msg){//creditLoanProductRemoteQuerySuccCallBack
			var responseBody = responseBodySuccFormat(msg);
			var textHtml = '';
			if (responseBody[0].results == '00') {
				$.each(responseBody, function(index, el) {
					if (index == 0)
						return true;
					var respVo = el.creditLoanProdVO[0];
					var imgUrl = base64decode(respVo.attach);
					textHtml += '<div class="product_box">'
							+ '<img src="data:image/png;base64,' + imgUrl
							+ '" proREMARK1="' + respVo.remark
							+ '" class="product_img">'
							+ '<div class="product_content">'
							+ '<div class="product_register" proCode="'
							+ respVo.proCode + '" proName="'
							+ respVo.proName + '" proType="'
							+ respVo.proType + '" maxAmount="'
							+ respVo.maxAmount + '" minAmount="'
							+ respVo.minAmount + '" maxTerms="'
							+ respVo.maxTerms + '" minTerms="'
							+ respVo.minTerms + '" scoreCardNo="'
							+ respVo.scoreCardNo + '">立即申请</div>'
							+ '<p class="product_title">'
							+ respVo.proName + '</p>'
							+ '<div class="product_Intro">'
							+ respVo.description.replace(/\n/g, "<br/>") + '</div>' + '</div>'
							+ '</div>'
				});
				$('#creditLoan-product .conter-auto').html(textHtml);
				$('#creditLoan-product .product_register').on('click', function() {
					if (commonJson.losUserId == '') {
						showTags({
							'title' : '提示',
							'content' : '没有LOS用户号,无法办理贷款业务!',
							'ok' : {
								fun : function() {
									$.mobile.changePage('../main.html');
								}
							}
						});
					} else {
						$CL.applicationObj.proCODE = $(this).attr("proCode"); // 产品编码
						$CL.applicationObj.proType = $(this).attr("proType"); // 产品类型
						$CL.proName = $(this).attr("proName"); // 产品名称
						$CL.maxAmount = $(this).attr("maxAmount");
					    $CL.minAmount = $(this).attr("minAmount");
					    $CL.maxTerms = $(this).attr("maxTerms");
					    $CL.minTerms = $(this).attr("minTerms");
					    $CL.scoreCardNo = $(this).attr("scoreCardNo");
						$.mobile.changePage('creditLoan-reading.html');
					}
				});
				//营销话术
		        $('#creditLoan-product .product_img').on('taphold', function () {
		            productTapHold($(this));
		        });
		        $("#creditLoan-product").on('tap', function (ev) {
		            var oTarget = ev.target;
		            if ($(oTarget).closest('.product_img').length || $(oTarget).closest('.product_img_msg').length) {

		            } else {
		                $(".product_img_msg").remove();
		            }
		        })
				deleteTableData($CL.dat.getSql("creditLoan-product@delete",null,null),
						function(msg) {
							// 再插入数据库
							var dataNum = 1;
							$CL.svc.insertProduct(responseBody, dataNum);
						}, function(err) {

						});
			} else if (responseBody[0].results == '08') {
				hideLoader();
				$CL.svc.queryRemoteProduct($CL.dat.getReqJson("creditLoan-product",null));
			} else {
				localStorage.creditLoanProductTime = 1;
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
		insertProduct:function(sendDataJsonItem, dataNum){
			var obj = sendDataJsonItem[dataNum].creditLoanProdVO[0];
			var sendDataJson = $CL.dat.getSql("creditLoan-product@insert",obj, null);
			insertTableData(sendDataJson, function(msg) {
				var dataCount = 0;
				var objExt = sendDataJsonItem[dataNum];
				$CL.svc.insertProductExt(objExt,dataCount);
				
				dataNum++;
				if (dataNum == sendDataJsonItem.length)
					return;
				$CL.svc.insertProduct(sendDataJsonItem, dataNum);
			}, function(err) {
				alert('失败' + msg);
			});
		},
		insertProductExt:function(dateExt,dataCount){
			var objMain = dateExt.creditLoanProdVO[0];
			var objExt = dateExt.creditLoanProdVO[1].certList[dataCount].certificateVo[0];
			var proCode = objMain.proCode;
			var proType = objMain.proType;
			var dataJson = $CL.dat.getSql("creditLoan-product@insertExt",objExt, proCode+'@#@'+proType);
			insertTableData(dataJson, function(msg) {
				dataCount++;
				if (dataCount == dateExt.creditLoanProdVO[1].certList.length)
					return;
				$CL.svc.insertProductExt(dateExt, dataCount);
			}, function(err) {
				alert('失败' + msg);
			});
		},
		queryLocalProductSucc:function(msg){
			var textHtml = '';
			if (msg != '') {
				hideLoader();
				$.each(msg, function(index, el) {
					var imgUrl = base64decode(el.PRO_ATTACH);
					textHtml += '<div class="product_box">'
								+ '<img src="data:image/png;base64,' + imgUrl
								+ '" proREMARK1="' + el.proRemark1
								+ '" class="product_img">'
								+ '<div class="product_content">'
								+ '<div class="product_register" proCode="'
								+ el.PRODCODE + '" proName="'
								+ el.PRONAME + '" proType="'
								+ el.REMARK7 + '" maxAmount="'
								+ el.REMARK2 + '" minAmount="'
								+ el.REMARK3 + '" maxTerms="'
								+ el.REMARK4 + '" minTerms="'
								+ el.REMARK5 + '" scoreCardNo="'
								+ el.REMARK6 + '">立即申请</div>'
								+ '<p class="product_title">'
								+ el.PRONAME + '</p>'
								+ '<div class="product_Intro">'
								+ el.pro_description.replace(/\n/g, "<br/>") + '</div>' + '</div>'
								+ '</div>'
				});
				$('#creditLoan-product .conter-auto').html(textHtml);
				$('#creditLoan-product .product_register').on('click', function() {
					if (commonJson.losUserId == '') {
						showTags({
							'title' : '提示',
							'content' : '没有LOS用户号,无法办理贷款业务!',
							'ok' : {
								fun : function() {
									$.mobile.changePage('../main.html');
								}
							}
						});
					} else {
						$CL.applicationObj.proCODE = $(this).attr("proCode"); // 产品编码
						$CL.applicationObj.proType = $(this).attr("proType"); // 产品类型
						$CL.proName = $(this).attr("proName"); // 产品名称
						$CL.maxAmount = $(this).attr("maxAmount");
					    $CL.minAmount = $(this).attr("minAmount");
					    $CL.maxTerms = $(this).attr("maxTerms");
					    $CL.minTerms = $(this).attr("minTerms");
					    $CL.scoreCardNo = $(this).attr("scoreCardNo");
						$.mobile.changePage('creditLoan-reading.html');
//						$.mobile.changePage('creditLoan-testLimit.html');
						
					}

				});
				//营销话术
		        $('#creditLoan-product .product_img').on('taphold', function () {
		            productTapHold($(this));
		        });
		        $("#creditLoan-product").on('tap', function (ev) {
		            var oTarget = ev.target;
		            if ($(oTarget).closest('.product_img').length || $(oTarget).closest('.product_img_msg').length) {

		            } else {
		                $(".product_img_msg").remove();
		            }
		        })
			} else {
				$CL.svc.queryRemoteProduct($CL.dat.getReqJson("creditLoan-product",null));
			}
		},
		//******客户信息查询**********
		queryClientInfo:function(){
			showLoader('客户信息查询中...');
			// 核心联查
			icustomerInfoServiceFun(
					$CL.dat.getReqJson("creditLoan-read@khcx",null),
					function(msg) {
						hideLoader();
						var responseBody = responseBodySuccFormat(msg);
						if (responseBody[0].results == "00") {
							if ($
									.trim(responseBody[1].customerInfoVO[0].CH_CLIENT_NAME) != ''
									&& $
											.trim(responseBody[1].customerInfoVO[0].CH_CLIENT_NAME) != custermerInfo.name) {
								showTags({
									'title' : '提示',
									'content' : '核心系统已登记户名不一致！',
									'ok' : {
										fun : function() {
											$.mobile.changePage(
													'creditLoan-product.html', {
														reverse : true
													});
										}
									}
								});
								return;
							}
							$CL.CLIENT_NO = responseBody[1].customerInfoVO[0].CLIENT_NO; // 获取客户号
							if($CL.CLIENT_NO){
								$CL.isCoreCustomer = "Y";
							}else{
								$CL.isCoreCustomer = "N";
								$CL.canBuildCustomer = true;//默认提交时创建核心客户信息
							}
							$.mobile.changePage('creditLoan-testLimit.html');

						} else if (responseBody[0].results == "08") {
							$CL.svc.queryClientInfo();
						} else if (responseBody[0].results == "12") {
							showTags({
								'title' : '提示',
								'content' : '核心系统客户信息异常！',
								'ok' : {
									fun : function() {
										$.mobile.changePage('creditLoan-product.html',
												{
													reverse : true
												});
									}
								}
							});
						} else if (responseBody[0].results == "09") {

							showTags({
								'title' : '提示',
								'content' : '查询核心超时！是否继续？',
								'ok' : {
									'title' : '放弃',// 非必输 默认值：确认
									fun : function() {
										$.mobile.changePage('creditLoan-product.html',
												{
													reverse : true
												});
									}
								},
								'cancel' : {
									'title' : '继续',// 非必输 默认值：取消
									'fun' : function() { // 非必输 如果输入则执行此函数
										$CL.svc.queryClientInfo();
									}
								}
							});
						} else {
							showTags({
								'title' : '提示',
								'content' : responseBody[0].message,
								'ok' : {
									fun : function() {
										$.mobile.changePage('creditLoan-product.html',
												{
													reverse : true
												});
									}
								}
							});
						}
					}, function(err) {
						funFail(err);
					});
		},
		//******影像数据暂存到数据库**********
		insertData:function(pageName,flag){
			if(flag && flag == 'creditLoan-cusInfo-zancun'){
				$CL.isZancunSucc = true;
				insertTableData($CL.dat.getSql(pageName,null,null), function (msg) {
					//按照缺陷要求隐藏暂存按钮，其实用不着，只是为了统一现有风格
					$('#creditLoan-cusInfo .zancun').hide();
					dzhShouyeNo();
				}, function (err) {
					$CL.isZancunSucc = false;
					showMsg('存储个人信息失败' + msg);
				});
			}else{
				insertTableData($CL.dat.getSql(pageName,null,null), function (msg) {
					
				}, function (err) {
					showMsg('存储个人信息失败' + msg);
				});
			}
		},
		//******维护客户信息查询**********
		queryCreateClinetInfo:function(pageName){
			showLoader("客户信息查询中...");
			if(!pageName){
				showMsg('上送数据不完整');
			}
			var sendJson = $CL.dat.getReqJson(pageName,null);
			IEstablishCustomerInformationServicetWOFFun(
					sendJson,
					function(msg) {
						console.log(msg);
						hideLoader();
						msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
						var responseObj = JSON.parse(msg);
						var responseCode = responseObj.b;
						if (responseCode[0].results == '00') {
							$CL.mobile = $
									.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[1].contactInfo[0].CONTACT_ID); // 手机号码
							$CL.zipcode = $
									.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[0].contactInfo[0].POSTAL_CODE); // 邮编
							$CL.addrDetail = $
									.trim(responseCode[1].clientDescVO[2].CONTACT_INFO[1].contactInfo[0].ADDRESS2); // 居住地址
							$CL.occup = $
									.trim(responseCode[1].clientDescVO[0].OCCUPATION_CODE);// 职业
							$CL.issPlace = true;
							$CL.marriage = $
									.trim(responseCode[1].clientDescVO[0].MARITAL_STATUS);// 婚姻状况
							$CL.company = $
									.trim(responseCode[1].clientDescVO[0].EMPLOYER_NAME); // 单位全称
							$CL.office = $
									.trim(responseCode[1].clientDescVO[0].POST);// 职位

							$("#creditLoan-addrName").attr('disabled', 'disabled')
									.closest('.fm-item').css('display', 'none');// 地区名称
							$("#creditLoan-addr").attr('disabled', 'disabled').closest(
									'.fm-item').css('display', 'none');// 签发地区名称

							findLenderInfoSmallLoanFunSuss();// 此处查询贷款系统？？？
						} else if (responseCode[0].results == '08') {
							$CL.svc.queryCreateClinetInfo(pageName);
						} else if (responseCode[0].results == '09') {
							showTags({
								'title' : '提示', // 非必输 默认值：提示
								'content' : '查询信息超时！是否继续？',// 必输
								'ok' : {
									'title' : '放弃',// 非必输 默认值：取消
									'fun' : function() { // 非必输 如果输入则执行此函数
										$.mobile.changePage('creditLoan-product.html',
												{
													reverse : true
												});
									}

								},
								'cancel' : {
									'title' : '继续',// 非必输 默认值：确认
									'fun' : function() { // 非必输 如果输入则执行此函数
										$CL.svc.queryCreateClinetInfo(pageName);
									}
								}

							})

						} else {
							showTags({
								'title' : '提示',
								'content' : responseCode[0].message,
								'ok' : {
									'fun' : function() {
										$.mobile.changePage('creditlLoan-product.html',
												{
													reverse : true
												});
									}
								}
							});
						}
					}, function(err) {
						hideLoader();
						err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
						var responseObj = JSON.parse(err);
						var responseCode = responseObj.b[0].error[0];
						showTags({
							'title' : '提示',
							'content' : responseCode.message,
							'ok' : {
								'fun' : function() {
									$.mobile.changePage('creditLoan-product.html', {
										reverse : true
									});
								}
							}
						});
					});
		},
		//******签发地区查询**********
		queryFrp005Succ:function(pageName,city){
			var sendJson = $CL.dat.getReqJson(pageName,city);
			ifrp005ServicePFun(sendJson,
					function(msg) {
						hideLoader();
						msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
						var responseObj = JSON.parse(msg);
						var responseCode = responseObj.b;
						var textHtml = "";
						if (responseCode[0].results == "00") {
							$.each(responseCode, function(index, val) {
								if (index == 0)
									return;
								textHtml += '<option value="' + val.frp005[0].fvval
										+ '">' + val.frp005[0].fvdsc1 + '</option>'
							});
							$("#creditLoan-addr").html(
									'<option value=""></option>' + textHtml);
						} else if (responseCode[0].results == "08") {
							$CL.svc.queryFrp005Succ(pageName,city);
						} else {
							showTags({
								'title' : '提示',
								'content' : responseCode[0].message,
								'ok' : {}
							});
						}
					}, function(err) {
						funFail(err);
					});

		},
		//******人脸比对**********
		faceCompare:function(cusFacePic, custermerInfo, obj){
			//影像两两对比
		    var sendJson = $CL.dat.getReqJson("creditLoan-personFace",obj);
		    transFormBase64(cusFacePic, function (msg) { //面部图片转base64
		        custermerInfo.cusFaceBase64 = msg;
		        transFormBase64(custermerInfo.image, function (msg1) { //身份证图片转base64
		            custermerInfo.imageBase64 = msg1;
		            sendJson.b[0]['ID_CARD.s'] = custermerInfo.cerNO;
		            sendJson.b[0]['IMG_BASE.s'] = custermerInfo.cusFaceBase64;
		            sendJson.b[0]['CARD_IMG_BASE.s'] = custermerInfo.imageBase64;
		            showLoader("影像对比中...");
		            ifacelRecognitionSeFun(sendJson, function (msg) {
		            	hideLoader();
		                custermerInfo.MGCompareFace = true;  //人脸比对完成
		                var responseBody = responseBodySuccFormat(msg);
		                if (responseBody[0].results == '0') {
		                    if (responseBody[1].photoCompareVO[0].CHIP_RESULT == "0") { //芯片通过
		                        $(".face-result:eq(0)").text('通过');
		                    } else {
		                        $(".face-result:eq(0)").addClass('no-pass').text('未通过');
		                    }
		                    if (responseBody[1].photoCompareVO[0].CARD_RESULT == "0") { //联网核查通过
		                        $(".face-result:eq(1)").text('通过');
		                    } else {
		                        $(".face-result:eq(1)").addClass('no-pass').text('未通过');
		                    }
		                    if (responseBody[1].photoCompareVO[0].CHIP_RESULT == "0" && responseBody[1].photoCompareVO[0].CARD_RESULT == "0") {
		                        $(".center-header").text('人脸识别通过！');
		                    } else {
		                        $(".center-header").text('人脸识别未通过！');
		                    }
		                    $('.previous:last').addClass('btn_next');

		                } else if (responseBody[0].results == '08') {
		                	$CL.svc.faceCompare(cusFacePic,custermerInfo,obj);
		                } else {
		                    $(".center-header").text('人脸识别失败！');
		                    $(".face-result:eq(0)").addClass('no-pass').text('未通过');
		                    $(".face-result:eq(1)").addClass('no-pass').text('未通过');
		                    $('.previous:last').addClass('btn_next');
		                    showTags({
		                        'title': '提示',
		                        'content': responseBody[0].message,
		                        'ok': {}
		                    });
		                }
		            }, function (err) {
		                $(".center-header").text('人脸识别失败！');
		                $(".face-result:eq(0)").addClass('no-pass').text('未通过');
		                $(".face-result:eq(1)").addClass('no-pass').text('未通过');
		                $('.previous:last').addClass('btn_next');
		                funFail(err);
		            })
		        }, function (err) {
		            alert('影像转换失败！')
		        });
		    }, function (err) {
		        alert('影像转换失败！')
		    });
		},
		//******银行对账单查询INFO**********
		queryInfoBills:function(pageName){
			findStatementFun($CL.dat.getReqJson(pageName,null), function(msg) {
				var responseBody = responseBodySuccFormat(msg);
				if (responseBody[0].results == '00') { // 借口处理成功
					var textHtml = '';
					$
							.each(
									responseBody,
									function(index, val) {
										if (index == 0) {
											return;
										}
										var fileName = val.bkStatementInquiry[0].bkstFile
												.split('/');
										fileName = fileName[fileName.length - 1];
										textHtml += '<li sel="false" lcseqNum="'
												+ val.bkStatementInquiry[0].seqNum
												+ '" lcStatus="'
												+ val.bkStatementInquiry[0].status
												+ '" creditReferPath="'
												+ val.bkStatementInquiry[0].bkstFile
												+ '" remark="'
												+ val.bkStatementInquiry[0].remark
												+ '">'
												+ '<div style="width: 12%">'
												+ val.bkStatementInquiry[0].name
												+ '</div>'
												+ '<div style="width: 15%">'
												+ val.bkStatementInquiry[0].inquiryDate
														.split(' ')[0]
												+ '</div>'
												+ '<div style="width: 20%;">'
												+ val.bkStatementInquiry[0].account
												+ '</div>'
												+ '<div style="width: 43%">'
												+ fileName
												+ '</div>'
												+ '<div style="width: 10%" ><img class="dzdImg" src="../../images/ic_sqwc.png" alt=""></div>'
												+ '</li>';
									});
					$('#creditLoan-cusInfo .searchBank ul').empty();
					$('#creditLoan-cusInfo .searchBank ul').html(textHtml);
					$("#creditLoan-cusInfo .searchBank").show();
					/* 点击 click list */
					$("#creditLoan-cusInfo .searchBank ul>li")
							.on(
									"click",
									function() {
										var diaPlay = $(this).find('.dzdImg')
												.css('display');
										if (diaPlay == 'none') {
											$(this).attr('sel', 'true');
											$(this).find('.dzdImg').css('display', 'block');
											$("#creditLoan-cusInfo .searchBank a:last")
													.addClass('btn_next');
										} else {
											$(this).attr('sel', 'false');
											$(this).find('.dzdImg').css('display', 'none');
											if ($('#creditLoan-cusInfo .searchBank ul>li[sel=false]').length < 1) {
												$("#creditLoan-cusInfo .searchBank a:last")
														.removeClass('btn_next');
											}
										}
									});
				} else if (responseBody[0].results == '08') { //
					hideLoader();
				} else {
					showTags({
						'title' : '提示',
						'content' : responseBody[0].message,
						'ok' : {}
					});
				}
			}, function(err) {
				funFail(err);
			});
		},
		//******银行对账单查询FIN**********
		queryFinBills:function(pageName){
			showLoader("对账单查询中...");
			findStatementFun($CL.dat.getReqJson(pageName,null), function(msg) {
				hideLoader();
				var responseBody = responseBodySuccFormat(msg);
				if (responseBody[0].results == '00') {  //借口处理成功
			        var textHtml = '';
			        $.each(responseBody, function (index, val) {
			            if (index == 0) {
			                return;
			            }
			            var fileName = val.bkStatementInquiry[0].bkstFile.split('/');
			            fileName = fileName[fileName.length - 1];
			            textHtml += '<li inquiryDate="' + val.bkStatementInquiry[0].inquiryDate + '" lcseqNum="' + val.bkStatementInquiry[0].seqNum + '" lcStatus="' + val.bkStatementInquiry[0].status + '" creditReferPath="' + val.bkStatementInquiry[0].bkstFile + '" remark="' + val.bkStatementInquiry[0].remark + '">' +
			            //'<div style="width: 12%">' + val.bkStatementInquiry[0].name + '</div>' +
			            '<div style="width: 15%">' + val.bkStatementInquiry[0].inquiryDate.split(' ')[0] + '</div>' +
			            '<div style="width: 25%;">' + val.bkStatementInquiry[0].account + '</div>' +
			            '<div style="width: 50%"><u>' + fileName + '</u></div>' +
			            '<div style="width: 10%" ><img class="dzdImg" src="../../images/ic_sqwc.png" alt=""></div>' +
			            '</li>';
			        });
			        $(".searchBank ul").empty();
			        $(".searchBank ul").html(textHtml);
			        $(".searchBank").show();
			        $(".searchBank a:last").removeClass('btn_next');
			        /*点击 click list*/
			        $(".searchBank ul>li div:last-child").on("click", function () {
			            var diaPlay = $(this).find('.dzdImg').css('display');
			            if (diaPlay == 'none') {
			                $(this).find('.dzdImg').css('display', 'block');
			                $(this).closest('li').attr('sel', 'true');
			                $(".searchBank a:last").addClass('btn_next');

			            } else {
			                $(this).closest('li').attr('sel', 'false');
			                $(this).find('.dzdImg').css('display', 'none');
			                if ($('.searchBank ul>li[sel=true]').length < 1) {
			                    $(".searchBank a:last").removeClass('btn_next');
			                }
			            }
			        });

			    } else if(responseBody[0].results == '08') { //
					$CL.svc.queryFinBills(pageName);
			    } else {
			        showTags({
			            'title': '提示',
			            'content': responseBody[0].message,
			            'ok': {}
			        });
			    }
			}, function(err) {
				funFail(err);
			});
		},
		//信用贷款提交后 影像上传
		zipCompress:function(){
			showLoader('影像压缩中...');
			//影像上传文件打包压缩插件
            var compressCount = 0;  //压缩成功次数,为3或4时完成压缩
            $CL.phoneTime = myTime.CurTime();
            $CL.applyTime = $CL.phoneTime + 1;
            $CL.signTime = $CL.phoneTime + 2;
            //影像上传文件打包压缩插件--->客户资料
            var fileArr = $CL.dat.zipCompressionFilePathFun('customer');
            if(fileArr.length > 0){
            	MT_zipCompression('loanType', $CL.platGlobalSeq + 'CustInfo', $CL.dat.zipCompressionFilePathFun('customer'), function (msg) {
                    //将要上传的影像插入到ios断点上传的数据库中
                    //影像上传 业务参数
                    insertTableData($CL.dat.getSql('creditLoan-cusConfirm@cfile',msg,null), function (msg) {
                    	//影像上传文件打包压缩插件--->受理审批资料
                    	var fileArr = $CL.dat.zipCompressionFilePathFun('');
                    	if(fileArr.length > 0){
                    		$CL.svc.applyFileCompress(fileArr);
                    	}else{
                    		$CL.svc.signFileCompress($CL.signHref);
                    	}
                    }, function (err) {
                    	$CL.dat.showMessage('数据库读写失败[1]，请联系技术人员',true);
                    });
                }, function (err) {
                	$CL.dat.showMessage('文件压缩失败[1]',true);
                });
            }else{
            	var fileArr = $CL.dat.zipCompressionFilePathFun('');
            	if(fileArr.length > 0){
            		$CL.svc.applyFileCompress(fileArr);
            	}else{
            		$CL.svc.signFileCompress($CL.signHref);
            	}
            }
            
		},
		applyFileCompress:function(fileArr){
			//影像上传文件打包压缩插件--->受理审批资料
            MT_zipCompression('loanType', $CL.platGlobalSeq + 'Apply', fileArr, function (msg1) {
                //影像上传 业务参数
                insertTableData($CL.dat.getSql('creditLoan-cusConfirm@applyfile',msg1,null), function (msg) {
                    $CL.svc.signFileCompress($CL.signHref);
                }, function (err) {
                	$CL.dat.showMessage('数据库读写失败[2]，请联系技术人员',true);
                });
            }, function (err) {
            	$CL.dat.showMessage('文件压缩失败[2]',true);
            });
		},
		signFileCompress:function(fileArr){
			//签名base64转路径  主申请人
            Meap.transFormImage($CL.platGlobalSeq + 'mSign', fileArr, 'picSty', function (msg2) {
                //将要上传的签名插入到ios断点上传的数据库中
                //签名上传 业务参数
                insertTableData($CL.dat.getSql('creditLoan-cusConfirm@signfile',msg2,null), function (msg) {
                	hideLoader();
					$CL.svc.submit();
                }, function (err) {
                	$CL.dat.showMessage('数据库读写失败[3]，请联系技术人员',true);
                });
            }, function (err) {
            	$CL.dat.showMessage('签名文件格式转换失败',true);
            });
		},
		//信用贷款提交
		submit:function(){
			showLoader('用户信息提交中...');
			var sendJson = $CL.dat.getReqJson('creditLoan-cusConfirm@submit',null);
			creditLoanSubmitFun(sendJson, function (msg) {
				var responseBody = responseBodySuccFormat(msg);
			    if (responseBody[0].results == "00" || responseBody[0].results == "13") {
			    	hideLoader();
			    	if(lianwanghechaData.CheckResult == '00' || lianwanghechaData.CheckResult == '02'){
						$CL.svc.cacheCustermerInfo(responseBody);
					}else{
						$CL.svc.updateUploadAppBuss(responseBody);
					}
			        
			    }else if (responseBody[0].results == "08") {
			    	hideLoader();
			        $CL.svc.submit();
			    } else if (responseBody[0].results == "09") {
			    	hideLoader();
			        showTags({
			            'title': '提示',
			            'content': '业务处理超时!&nbsp;' + responseBody[0].message,
			            'ok': {
			                title: '继续处理',
			                fun: function () {
			                	$CL.svc.submit();
			                }
			            }
			        });
			    } else {
			    	hideLoader();
			        showTags({
			            'title': '提示',
			            'content': responseBody[0].message,
			            'ok': {
			                title: '确认',
			                fun: function () {
			                    changeUploadStatus("03",$CL.phoneTime, $CL.applyTime, $CL.signTime);
			                    $CL.uploadTime = "" + myTime.CurTime(); //本地上传时间???
			                }
			            }
			        });
			    }
		    }, function (err) {
		        hideLoader();
		        showTags({
		            'title': '提示',
		            'content': '业务处理超时!',
		            'ok': {
		                title: '继续处理',
		                fun: function() {
		                	$CL.svc.submit();
		                }
		            }
		        });
		    });
		},
		readPeiICCard:function(succFun,failFun){
			showLoader('配偶身份证读取中...');
			$CL.peiIcInfo = {}; //初始化个人信息
		    $CL.peiIcInfo.isReadCardSucc = false; //默认未读卡即是读卡失败
		    Meap.readCard('', function (msg) {
		    	hideLoader();
		        msg = JSON.parse(msg);
		        $CL.peiIcInfo = {
		            "nation": $.trim(msg.nation), //民族
		            "cerNO": $.trim(msg.cardNO), //身份证号
		            "address": $.trim(msg.address), //地址
		            "name": $.trim(msg.name), //姓名
		            "cerExpdDt": $.trim(msg.cerExpdDt), //到期日期
		            "birthday": $.trim(msg.birthday), //出生日期
		            "sex": $.trim(msg.sex), //性别
		            "issAuthority": $.trim(msg.issAuthority), //签发机关
		            "image": $.trim(msg.image) //身份证头像图片
		        }
		        $CL.peiIcInfo.isReadCardSucc = true;
		        $CL.peiIcInfo.isPeiRead = true;
		        //creditJson.storage.checkPhoto = custermerInfo.checkPhoto = ''; //联网核查返回照片
		        if (idCardIsExpired($CL.peiIcInfo.cerExpdDt)) { //判断身份证是否过期
		            showTags({
		                'title': '提示',
		                'content': '您的身份证已过期!',
		                'ok': {}
		            });
		            return;
		        }
		        succFun && succFun(msg);
		    }, function (err) {
		        hideLoader();
		        $CL.peiIcInfo.isReadCardSucc = false;
		        $CL.peiIcInfo.isReadCardMsg = err;
		        failFun && failFun(err);
		    });
		},
		queryPictureSucc:function(msg){
			var textHtml = '';
			if (msg != '') {
				$CL.biPai = 0;
				showLoader('页面加载中..');
				$CL.qtPicCode = [];
				$CL.qtPicName = [];
				$.each(msg, function(index, el) {
					var isGetFace = "";
					var rephoto = "";
					var certName = el.REMARK2;
					var certOption = el.REMARK3;
					var picName = el.REMARK4;
					var fileType = el.REMARK5;
					if(certName == '客户面部照片'){
						isGetFace = ' get-face';
					}
					if(!picName){
						picName = "";
					}
					if(!fileType){
						fileType = "";
					}
					if(certOption == "1" || certOption == "3"){
						rephoto = "必拍";
						textHtml += '<div class="img_box'+isGetFace+'">'
						+ '<div class="customer" picname="'+picName+'">'
						+ '<div class="rephoto">'+rephoto+'</div>'
						+ '<img class="camera" src="../../images/ic_camera.png" alt=""/>'
						+ '</div>'
						+ '<div class="img_notes">'+certName+'</div>'
						+ '</div>'
						$CL.biPai++;
					}else{
						$CL.qtPicCode.push(picName);
						$CL.qtPicName.push(certName);
					}
				});
				var qitaConClass = "qita-tanchuang-con";
				var qitaUlClass = "qita-tanchuang-ul";
				textHtml += '<div class="img_box" style="position: relative;">'
					+ '<div class="customer" picname="qitazhengming">'
					+ '<div class="rephoto">选拍，可多张拍摄</div>'
					+ '<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/>'
					+ '</div>'
					+ '<div class="img_notes qitazhengming" othername="qitazhengming">其他</div>'
					+ '<div class="qita-tanchuang-cbg"></div>'
					+ '<img src="../../images/crow_icon_win.png" class="crow_icon_win"/>'
					+ '<div class="'+qitaConClass+'">'
					+ '<div class="queren-quxiao">'
					+ '<div class="quxiao-ok quxiao-click">取消</div>'
					+ '<div class="quxiao-ok queding-click">确定</div>'
					+ '</div>'
					+ '<ul class="'+qitaUlClass+'">'
				if($CL.qtPicName.length > 0){
					$($CL.qtPicName).each(function(index){
						textHtml += '<li othername="'+$CL.qtPicCode[index]+'">'+$CL.qtPicName[index]+'</li>'
					});
				}
				textHtml += ''
					+ '</ul>'
					+ '</div>'
					+ '</div>'
				$('#creditLoan-cusPicture .img_content').html(textHtml);
				$CL.page.validatePicCss();
				$CL.page.initPicturePage();
			} else {
			}
			hideLoader();
			
		},
		queryFileDownloadSucc:function(msg, netFilePath,inquiryDate,sqFilePath,nameType,seqNum){
			if (msg != '') {
		        var maxTime = msg[0].fileTime;
		        var filePath = msg[0].filePath;
		        msg.forEach(function (ele) {
		            if (maxTime < ele.fileTime) {
		                maxTime = ele.fileTime;
		                filePath = ele.filePath;
		            }
		        });
		        var nameNumP = filePath.lastIndexOf('\/') +1;
		        var checkNameP = filePath.substring(nameNumP);
		        filePath = MT_path + checkNameP;
		        scanTheFiles(filePath, function (msg) {
		        }, function (err) {
		            showTags({
		                'title': '提示',
		                'content': '文件打开失败！',
		                'ok': {}
		            });
		        });
		    } else {
		        $CL.svc.getFileDataConF(netFilePath,inquiryDate,nameType,sqFilePath,seqNum);
		    }
		},
		getFileDataConF:function(filePath,inquiryDate,nameType,sqFilePath,seqNum){
			var _fileName = filePath.split('/');
		    var fileName = nameType+_fileName[_fileName.length - 1];
		    var sendJson = $CL.dat.getReqJson('creditLoan-cusConfirm@getFile',filePath);
		    showLoader('文件获取中...');
		    getFileDataFun(sendJson, function (msg) {
		    	hideLoader();
		    	$CL.svc.getFileLoansDataSucc(msg, fileName,inquiryDate,sqFilePath,seqNum);
		    }, function (err) {
		        funFail(err);
		    })
		},
		getScoreFileAndShow:function(flag){
			var filePath = '';
			var fileType = '';
			var message = '';
			if(flag == 'p'){//评分卡
				fileType = 'F0000';
				filePath = $CL.SCORE_CARD_PATH;
				message = '评分卡文件获取中...';
			}else if(flag == 's'){//申请表
				fileType = 'F0021';
				filePath = $CL.APPLY_TABLE_PATH;
				message = '申请表文件获取中...';
			}
			var _fileName = filePath.split('/');
		    var fileName = fileType + _fileName[_fileName.length - 1];//??????
			var sendJson = $CL.dat.getReqJson('creditLoan-cusConfirm@getFile',filePath);
			showLoader(message);
			getFileDataFun(sendJson, function (msg) {
				hideLoader();
				var responseBody = responseBodySuccFormat(msg);
				if (responseBody[0].results == "00") {
			        var fileStr = responseBody[1].hashMap[0].fileData;
			        transFormBase64Tofile(fileName, fileStr, function (msg) { //返回路径
			        	var filePath = msg;
			        	scanTheFiles(filePath, function (msg) {
			        		
		                }, function (err) {
		                    showTags({
		                        'title': '提示',
		                        'content': '文件打开失败！',
		                        'ok': {}
		                    });
		                });
			        }, function (err) {
			            showTags({
			                'title': '提示',
			                'content': '下载文件失败',
			                'ok': {}
			            });
			        });
			    }else if (responseBody[0].results == "08"){
			        $CL.svc.getScoreFileAndShow(flag);
			    } else {
			        showTags({
			            'title': '提示',
			            'content': responseBody[0].message,
			            'ok': {}
			        });
			    }
				
		    }, function (err) {
		        funFail(err);
		    })
		},
		getFileLoansDataSucc:function(msg, fileName, inquiryDate, sqFilePath, seqNum){
		    var responseBody = responseBodySuccFormat(msg);
		    if (responseBody[0].results == "00") {
		        var fileStr = responseBody[1].hashMap[0].fileData;
		        transFormBase64Tofile(fileName, fileStr, function (msg) { //返回路径
		            var filePath = msg;
		            //插入数据库
		            var obj = {
		            		"fileName": fileName,
		            		"filePath": filePath,
		            		"seqNum": seqNum,
		            		"fileTime": inquiryDate,
		            		"sqFilePath": sqFilePath
		            };
		            var sendDataJson = $CL.dat.getSql('creditLoan-cusConfirm@dzdwj',obj,null);
		            insertTableData(sendDataJson, function (msg) {
		                scanTheFiles(filePath, function (msg) {
		                }, function (err) {
		                    showTags({
		                        'title': '提示',
		                        'content': '文件打开失败！',
		                        'ok': {}
		                    });
		                });
		            }, function (err) {
		                alert('失败' + msg);

		            });
		        }, function (err) {
		            showTags({
		                'title': '提示',
		                'content': '下载文件失败',
		                'ok': {}
		            });
		        });
		    } else {
		        showTags({
		            'title': '提示',
		            'content': responseBody[0].message,
		            'ok': {}
		        });
		    }
		},
		queryScoreCardItem:function(){
			showLoader("评分卡数据查询中...");
			var reqJson = $CL.dat.getReqJson("creditLoan-testLimit@queryItem",null);
			queryCreditLoanScoreCardInfo(reqJson, function(msg) {
				hideLoader();
				$CL.page.initLimitTestPage(msg);
			}, function(err) {
				hideLoader();
				err = err.replace(new RegExp("\\.[s]+\"", "g"), "\"");
				var responseObj = JSON.parse(err);
				var responseCode = responseObj.b[0].error[0];
				if($.trim(responseCode.message).toUpperCase() == 'A CONNECTION FAILURE OCCURRED') {
					Meap.isNetConnect(function(msg) {
						if(msg == '01' || msg == '02') {
							responseCode.message = '未接收到后台响应!';
						} else if(msg == '03') {
							responseCode.message = '当前网络不可用,请检测网络是否畅通!是否继续？';
						}
						showTags({
							'title': '提示',
							'content': responseCode.message,
							'ok': {
								'title': '放弃',
								'fun': function() {
									dzhShouyeNo();
								}
							},
							'cancel': {
								'title': '继续',
								'fun': function() {
									$CL.svc.queryScoreCardItem();
								}
							}
						});
					}, function(err) {
						responseCode.message = '当前网络不可用,请检测网络是否畅通!是否继续？';
						showTags({
							'title': '提示',
							'content': responseCode.message,
							'ok': {
								'title': '放弃',
								'fun': function() {
									dzhShouyeNo();
								}
							},
							'cancel': {
								'title': '继续',
								'fun': function() {
									$CL.svc.queryScoreCardItem();
								}
							}
						});
					})
				}
				if($.trim(responseCode.message).toUpperCase() == 'THE REQUEST TIMED OUT') { //全部改成大写即可捕获
					responseCode.message = '系统超时,是否继续？';
					showTags({
						'title': '提示',
						'content': responseCode.message,
						'ok': {
							'title': '放弃',
							'fun': function() {
								dzhShouyeNo();
							}
						},
						'cancel': {
							'title': '继续',
							'fun': function() {
								$CL.svc.queryScoreCardItem();
							}
						}
					});
				} else if($.trim(responseCode.message).toUpperCase() == 'ERR_REQUEST_ABORTED') { //全部改成大写即可捕获
					responseCode.message = '接口服务处理异常,请重试!';
					showTags({
						'content': responseCode.message, //必输
						'ok': {}
					})
				}
			});
		},
		createAndCalculateScoreCard:function(obj){
			showLoader("评分卡测算提交中...");
			var reqJson = $CL.dat.getReqJson("creditLoan-testLimit@testScore",obj);
			testCreditLoanScoreCard(reqJson, function(msg) {
				hideLoader();
				$CL.page.testScoreSucc(msg,obj);
			}, function(err) {
				funFail(err);
			});
		},
		createScoreCardPdf:function(){
			showLoader("页面查询中...");
			var reqJson = $CL.dat.getReqJson("creditLoan-cusConfirm@CScorePdf",null);
			createScoreCardPdfFun(reqJson, function(msg) {
				hideLoader();
				$CL.page.saveSCPath(msg);
			}, function(err) {
				hideLoader();
				$CL.svc.createApplyTablePdf();//评分卡失败不影响申请表的生成
//				funFail(err);
			});
		},
		createApplyTablePdf:function(){
			showLoader("页面查询中...");
			var sendJson = $CL.dat.getReqJson('creditLoan-cusConfirm@submit',null);
			createApplyInfoPdfFun(sendJson, function(msg) {
				hideLoader();
				var responseBody = responseBodySuccFormat(msg);
				if (responseBody[0].results == '00') {
					$CL.APPLY_TABLE_PATH = responseBody[1].loan[0].lendingInfo;
				} else if (responseBody[0].results == '08') {
					$CL.svc.createApplyTablePdf();
				} else {
					$CL.APPLY_TABLE_PATH = '';
//					showTags({
//						'title' : '提示',
//						'content' : responseBody[0].message,
//						'ok' : {
//							fun : function() {
//								$CL.APPLY_TABLE_PATH = '';
//							}
//						}
//					});
				}
			}, function(err) {
				hideLoader();
//				funFail(err);
			});
		},
		creditLoanFindCreditReport:function(sendJson){
			showLoader("征信报告查询中...");
			findCreditReportInquiryFun(sendJson, function(msg) {
				hideLoader();
				$CL.page.findCreditReportSucc(msg);
			}, function(err) {
				funFail(err);
			});
		},
		showCreditReport:function(queryFileObj,creditReferPath,inquiryDate,accredit,lcseqNum){
			showLoader('文件查询中...');
			queryTableDataByConditions({
				"databaseName": "myDatabase", //数据库名
				"tableName": "loandownload_info", //表名
				"conditions": queryFileObj
			}, function(msg) {
				hideLoader();
				$CL.svc.queryFileDownloadSucc(msg, creditReferPath, inquiryDate, accredit, 'F0005', lcseqNum);
			}, function(err) {
				hideLoader();
				funDataFail(err);
			});
		},
		queryCoreClientInfo:function(){
			showLoader('客户信息查询中...');
            //核心联查
            icustomerInfoServiceFun($CL.dat.getReqJson('creditLoan-read@queryCoreInfo',null), function (msg) {
            	hideLoader();
            	$CL.dat.coreClienInfoQuerySucc(msg);
            }, function (err) {
                funFail(err);
            });
		},
		queryCoreClientLevelInfo:function(){
			showLoader('客户等级信息检查中...');
            //核心联查
			queryCoreClientLevelInfoFun($CL.dat.getReqJson('creditLoan-read@queryCoreLevelInfo',null), function (msg) {
				var responseBody = responseBodySuccFormat(msg);
				hideLoader();
				if (responseBody[0].results == "00") {
					$('#creditLoan-read .previous').addClass('btn_next');
				}else if (responseBody[0].results == "08") {
			        $CL.svc.queryCoreClientLevelInfo();
			    }else {
			        showTags({
			            'title': '提示',
			            'content': responseBody[0].message,
			            'ok': {
			                fun: function () {
//			                    $.mobile.changePage('creditLoan-product.html', {reverse: true});
			                	$('#creditLoan-read .previous').removeClass('btn_next');
//			                	$('#creditLoan-read .previous').addClass('btn_next');
			                }
			            }
			        });
			    }
            }, function (err) {
                funFail(err);
                $('#creditLoan-read .previous').removeClass('btn_next');
            });
		},
		queryUnionClientInfo:function(){
			showLoader("客户信息查询中...");
			queryLoanCustomerInfoFun($CL.dat.getReqJson('creditLoan-read@queryLosInfo',null), function (msg) {
				hideLoader();
				$CL.dat.unionClientInfoQuerySucc(msg);
		    }, function (err) {
		    	$CL.isLoanValue = '' + parseInt($CL.isLoanValue) | 4;
		        loan.inputLogo = false;
		        funFail(err);
		    })
		},
		queryAcctNo:function(){
			showLoader('卡账号查询中...');
			getDocLicenceListBankFun($CL.dat.getReqJson('creditLoan-read@queryAcctNo',null), function (msg) {
				hideLoader();
				$CL.dat.queryAcctNoSucc(msg);
		    }, function (err) {
		    	$CL.isLoanValue = '' + parseInt($CL.isLoanValue) | 1;
		        funFail(err);
		    });
		},
		checkPersonalID:function(sendJson){
			showLoader("配偶身份证联网核查中...");
			icitizenCertificateIdenifyFun(sendJson, function (msg) {
				hideLoader();
				$CL.polwhcjg2 = '';
				$CL.polwhcFlag2 = '';
				msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
				var responseObj = JSON.parse(msg);
			    var responseCode = responseObj.b;
			    if (responseCode[0].results == "00") {
			    	$CL.polwhcjg2 = responseCode[0].results;
			        if (responseCode[1].citizenCertificateIdentifyVO[0].CHECKRESULT == "00") { //联网核查成功
			        	//此处转下一步
			        	$CL.polwhcFlag2 = "true";
			        	$.mobile.changePage(
								'./creditLoan-cusConfirm.html',
								{
									transition : "slide"
						});
			        } else {
			        	$CL.dat.showMessage('配偶身份证联网核查审核失败!',false);
			        	$CL.polwhcFlag2 = "false";
			        }
			    } else if (responseCode[0].results == "08") {
			    	$CL.polwhcFlag2 = "false";
			    	$CL.svc.checkPersonalID(sendJson);
			    } else if (responseCode[0].results == "09") {
			    	$CL.polwhcjg2 = responseCode[0].results;
			    	showTags({
			            'title': '提示',
			            'content': '配偶身份证联网核查超时!，是否继续办理业务？',
			            'ok': {
			                'title': '放弃',
			                'fun': function () {
			                	$CL.polwhcFlag2 = "false";
			                }
			            },
			            'cancel': {
			                'title': '继续',
			                'fun': function () {
			                	$CL.polwhcFlag2 = "true";
			                	$.mobile.changePage(
										'./creditLoan-cusConfirm.html',
										{
											transition : "slide"
										});
			                }
			            }
		        	})
			    }else if (responseCode[0].results == "02") {
			    	$CL.polwhcjg2 = responseCode[0].results;
			    	showTags({
			            'title': '提示',
			            'content': '公民身份号码与姓名一致，但不存在照片，是否继续办理业务？',
			            'ok': {
			                'title': '放弃',
			                'fun': function () {
			                	$CL.polwhcFlag2 = "false";
			                }
			            },
			            'cancel': {
			                'title': '继续',
			                'fun': function () {
			                	$CL.polwhcFlag2 = "true";
			                	$.mobile.changePage(
										'./creditLoan-cusConfirm.html',
										{
											transition : "slide"
										});
			                }
			            }
		        	})
			    }else{
			    	$CL.dat.showMessage(responseCode[0].message,false);
			    	$CL.polwhcFlag2 = "false";
			    }
//			    if($CL.polwhcFlag == "true"){
//			    	$.mobile.changePage(
//							'./creditLoan-cusConfirm.html',
//							{
//								transition : "slide"
//							});
//			    }
            }, function (err) {
                funFail(err);
                $CL.polwhcFlag2 = "false";
            });
		},
		ckeckMessaService:function(json, codeTime, callback){
			var sendJson = {
			        "b": [{
			            "orgId.s": commonJson.orgId,
			            "moduleId.s": json.moduleId, //模块编号
			            "tranId.s": json.tranId, //交易编号
			            "operatorNo.s": commonJson.adminCount, //操作员
			            "deviceNo.s": commonJson.deviceNo, //设备编号
			            "SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
			            "USER_NO.s": json.USER_NO, //用户唯一标识
			            "EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
			            "MSG_INFO.s": json.msgInfo, //动态口令 取手工输入的值  //json.MSG_INFO, //动态口令
			            "Flags.s": "BBBB", //标记位
			            "MOBILE_NO.s": json.mobile, //手机号码debitEnter.tel
			            "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
			            "faceRecogn.s": json.faceRecogn //人脸识别状态
			        }]
			    };
			    imessageAuthentionServiceYFun(sendJson, function (msg) {
			        hideLoader();
			        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
			        var responseObj = JSON.parse(msg);
			        var responseCode = responseObj.b;
			        if (responseCode[0].results == '00') {
			            callback && callback();
			        } else if (responseCode[0].results == "08") {
			            ckeckImessageAuthentionServiceYFun(json, codeTime, callback);
			        } else {
			            if (codeTime) {
			                clearInterval(codeTime);
			                $('#getMsg').removeClass('cannt-click').text('重新获取');
			                $('.codetime').html('请在<span style="color:red;">0秒</span>内输入验证码');
			            }
			            showTags({
			                'title': '提示',
			                'content': responseCode[0].message,
			                'ok': {}
			            });
			        }
			    }, function (err) {
			        funFail(err);
			    });
		},
		creditLoanSubmitService:function(){
			var sendJson = $CL.dat.getReqJson('creditLoan-confirm@authMsg');
			showLoader('短信验证码验证中...');
			imessageAuthentionServiceYFun(sendJson, function (msg) {
			        hideLoader();
			        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
			        var responseObj = JSON.parse(msg);
			        var responseCode = responseObj.b;
			        if (responseCode[0].results == '00') {
			        	$CL.USER_NO = '';
			        	$CL.svc.getGlobalSeq();
			        } else if (responseCode[0].results == "08") {
			        	$CL.svc.creditLoanSubmitService();
			        } else {
			        	$CL.USER_NO = '';
			            showTags({
			                'title': '提示',
			                'content': responseCode[0].message,
			                'ok': {}
			            });
			        }
			    }, function (err) {
			    	$CL.USER_NO = '';
			        funFail(err);
			    });
		},
		getGlobalSeq:function(){
		    showLoader('获取交易流水号中..');
		    var sendJson = $CL.dat.getReqJson('creditLoan-confirm@getSeq');
		    getPlatGlobalSeqFun(sendJson, function (msg) {
		        hideLoader();
		        msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
		        var responseObj = JSON.parse(msg);
		        var responseBody = responseObj.b;
		        if (responseBody[0].results == '00') {
		        	$CL.platGlobalSeq = responseBody[0].platGlobalSeq;//获取平台流水号
		            $CL.svc.zipCompress();
		        } else {
		            showTags({
		                'title': '提示',
		                'content': '获取平台交易流水号超时!',
		                'cancel': {
		                    'title': '继续提交', //非必输  默认值：确认
		                    'fun': function () { //非必输  如果输入则执行此函数
		                    	$CL.svc.getGlobalSeq();
		                    }
		                },
		                'ok': {
		                    'title': '放弃提交', //非必输  默认值：取消
		                    'fun': function () { //非必输  如果输入则执行此函数
		                        if(url){
		                            $.mobile.changePage(url);
		                        }
		                    }
		                }
		            });
		        }
		    }, function (err) {
		        hideLoader();
		        showTags({
		            'title': '提示',
		            'content': '获取平台交易流水号超时!',
		            'ok': {
		                'fun': function () { //非必输  如果输入则执行此函数
		                    if(url){
		                        $.mobile.changePage(url);
		                    }
		                }
		            }
		        });
		    });
		},
		imessageAuthentionServiceConF:function(){
			showLoader('获取中...')
			var bodyJson = $CL.dat.getReqJson('creditLoan-confirm@getAuthCode');
		    imessageAuthentionServiceFun(bodyJson, function (msg) {
		    	 hideLoader();
		        $CL.dat.imessageAuthentionServiceBankSucc(msg, bodyJson);
		    }, function (err) {
		        funFail(err);
		        $('#getMsg').removeClass('cannt-click').text('重新获取');
		        if ($CL.BTime) {
		            clearInterval($CL.BTime);
		        }
	            $CL.hasYZM = false;
	            $('#inp').removeAttr('disabled').val('');
		    });
		},
		getFileDataAndOpen:function(data, nameType){
			showLoader('文件查询中...');
		    var _fileName = data.creditReferPath.split('/');
		    var fileName = nameType+_fileName[_fileName.length - 1];
		    var sendJson = {
		        "b": [{
		            "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
		            "workAddress.s": commonJson.workAddress, //工作地址
		            "orgId.s": commonJson.orgId, //机构号
		            "moduleId.s": data.moduleId,//creditJson.moduleID, //模块编号
		            "tranId.s": data.tranId, //交易编号
		            "operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
		            "deviceNo.s": commonJson.udId, //设备编号
		            "offOnline.s": commonJson.offlineOnline, //脱机/联机
		            "filePath.s": data.creditReferPath //附件路径
		        }]
		    };
		    getFileDataFun(sendJson, function (msg) {
		    	hideLoader();
		        var responseBody = responseBodySuccFormat(msg);
			    if (responseBody[0].results == "00") {
			        var fileStr = responseBody[1].hashMap[0].fileData;
			        transFormBase64Tofile(fileName, fileStr, function (path) { //返回路径
			            scanTheFiles(path, function (msg) {
			            }, function (err) {
			                showTags({
			                    'title': '提示',
			                    'content': '文件打开失败！',
			                    'ok': {}
			                });
			            });
			        }, function (err) {
			            showTags({
			                'title': '提示',
			                'content': '下载文件失败',
			                'ok': {}
			            });
			        });
			    } else if(responseBody[0].results == "08"){
			    	$CL.svc.getFileDataAndOpen(data, nameType);
			    }else {
			        showTags({
			            'title': '提示',
			            'content': responseBody[0].message,
			            'ok': {}
			        });
			    }
		    }, function (err) {
		        funFail(err);
		    })
		},
		cacheCustermerInfo:function(responseBody){
			showLoader('存储个人信息中...');
			//与客户合影照片转base64
			var sendDataJson = {
					"databaseName": "myDatabase",
					"tableName": "customer_info",
					"data": [{
						"ADMINCOUNT": commonJson.adminCount, //登陆账号
						"SUBMITTIME": myTime.CurTime(), //提交时间
						"BUSINESSTYPE": "申请信用贷款", //业务类型
						"NATION": custermerInfo.nation, //民族
						"CERTNUM": custermerInfo.cerNO, //身份证号码
						"ADDRESS": custermerInfo.address, //地址
						"MASCARDNAME": custermerInfo.name, //姓名
						"CERTVALIDDATE": custermerInfo.cerExpdDt, //有效日期
						"BIRTH": custermerInfo.birthday, //出生日期
						"SEX": custermerInfo.sex, //性别
						"ISSAUTHORITY": custermerInfo.issAuthority, //签发机关
						"IMAGE": custermerInfo.image, //身份证头像图片
						"CUSTANDCUSTOWNERPIC": $CL.applicationObj.custAndCustOwnerPic, //与客户合影照片
						"FRONTIDCARDPIC": $CL.applicationObj.frontIDCardMPic, //身份证正面
						"BACKIDCARDPIC": $CL.applicationObj.backIDCardMPic, //身份证反面
						"checkPhoto": $CL.applicationObj.lianPic //联网核查图片
					}]
				};
		    transFormBase64(sendDataJson.data[0].CUSTANDCUSTOWNERPIC, function(msg1) {
		        sendDataJson.data[0].CUSTANDCUSTOWNERPIC = msg1;
		        //身份证正面转base64
		        transFormBase64(sendDataJson.data[0].FRONTIDCARDPIC, function(msg2) {
		            sendDataJson.data[0].FRONTIDCARDPIC = msg2;
		            //身份证反面转base64
		            transFormBase64(sendDataJson.data[0].BACKIDCARDPIC, function(msg3) {
		                sendDataJson.data[0].BACKIDCARDPIC = msg3;
		                insertTableData(sendDataJson, function(msg) {
		                	hideLoader();
		                	$CL.svc.updateUploadAppBuss(responseBody);
		                }, function(err) {
		                	hideLoader();
		                    showMsg('存储个人信息失败' + msg);
		                    $CL.svc.updateUploadAppBuss(responseBody);
		                });
		            }, function(err) {
		            	hideLoader();
		                showMsg('与客户合影照片转base64失败');
		                $CL.svc.updateUploadAppBuss(responseBody);
		            })
		        }, function(err) {
		        	hideLoader();
		            showMsg('身份证正面转base64失败');
		            $CL.svc.updateUploadAppBuss(responseBody);

		        })
		    }, function(err) {
		    	hideLoader();
		        showMsg('身份证反面转base64失败');
		        $CL.svc.updateUploadAppBuss(responseBody);
		    })
		},
		changeUploadAppBus:function(fileToken,appBus,callback){
			appBus = JSON.stringify(appBus);
		    var sql = "UPDATE up_download_info SET appBuss = '" + appBus + "' WHERE fileToken = '" + fileToken + "'";
		    executeSqlString(sql, 'exe', function () {
		        if(callback){
		            callback();
		        }
		    }, function (err) {
		    	hideLoader();
		        funDataFail(err);
		    });
		},
		updateUploadAppBuss:function(responseBody){
			showLoader('更新本地信息中...');
			$CL.CUSTOMER_NO = responseBody[1].loan[0].CUSTOMER_NO;  //客户流水号
	        $CL.APPLY_NO = responseBody[1].loan[0].APPLY_NO; //业务申请编号
	        var lendingInfo = responseBody[1].loan[0].lendingInfo;   //贷款申请表
	        var scoreCardPdf = $CL.SCORE_CARD_PATH;  //评分卡
	        if(lendingInfo){
	        	$CL.fillListArr.push(lendingInfo);
	        }
	        if(scoreCardPdf){
	        	$CL.fillListArr.push(scoreCardPdf);
	        }
			//更新数据库appBus
	        $CL.svc.changeUploadAppBus($CL.phoneTime,$CL.dat.getAppBus('creditLoan-cusConfirm@cfileUpdate'),function(){
	        	$CL.svc.changeUploadAppBus($CL.applyTime,$CL.dat.getAppBus('creditLoan-cusConfirm@applyfileUpdate'),function(){
	        		$CL.svc.changeUploadAppBus($CL.signTime,$CL.dat.getAppBus('creditLoan-cusConfirm@signfileUpdate'),function(){
	        			var sql = "UPDATE up_download_info SET REMARK1 = '02' WHERE fileToken = '" + $CL.phoneTime + "'";
	        			sql += " OR fileToken = '" + $CL.applyTime + "'";
	        			sql += " OR fileToken = '" + $CL.signTime + "'";
	        		    executeSqlString(sql, 'exe', function () {
	        		    	hideLoader();
	        		    	if (responseBody[0].results == "13") {   //联网核查超时
	    			            showTags({
	    			                'title': '提示',
	    			                'content': responseBody[0].message,
	    			                'ok': {
	    			                    fun: function () {
	    			                        $.mobile.changePage('./creditLoan-complete.html', {transition: "slide"});
	    			                    }
	    			                }
	    			            });
	    			        } else {
	    			            $.mobile.changePage('./creditLoan-complete.html', {transition: "slide"});
	    			        }
	        		    }, function (err) {
	        		    	hideLoader();
	        		        funDataFail(err);
	        		    });
	        		});
	        	});
	        });
		}
		
		
}
