/**
 * Created by lei on 2/20/16.
 * 贷款模块请求函数
 */

/*人行征信搜索*/
function findCreditReportInquiryConF(bodyJson) {
    findCreditReportInquiryFun(bodyJson, function (msg) {
        findCreditReportInquirySucc(msg);
    }, function (err) {
        funFail(err);
    });
}

/*人行征信删除*/
function delCreditReportInquiryConF(bodyJson) {
    delCreditReportInquiryFun(bodyJson, function (msg) {
        delCreditReportInquirySucc(msg);
    }, function (err) {
        funFail(err);
    });
}

/*人行征信新查询*/
function createCreditReportInquiryConF(bodyJson) {
    createCreditReportInquiryFun(bodyJson, function (msg) {
        createCreditReportInquirySucc(msg);
    }, function (err) {
        funFail(err);
    });
}

/*银行对账单查询*/
function findStatementConF(bodyJson,successBackFun) {
    findStatementFun(bodyJson, function (msg) {
        successBackFun(msg);
    }, function (err) {
        funFail(err);
    });
}

/*银行对账单删除*/
function delStatementConF(bodyJson) {
    delStatementFun(bodyJson, function (msg) {
        delStatementSucc(msg);
    }, function (err) {
        funFail(err);
    });
}

/*银行对账单新查询*/
function createStatementConF(bodyJson) {
    createStatementFun(bodyJson);
}

/*卡账号查询*/
function getDocLicenceListBankConF(bodyJson) {
    getDocLicenceListBankFun(bodyJson, function (msg) {
        getDocLicenceListLoanSucc(msg);
    }, function (err) {
        loan.inputLogo = false;
        funFail(err);
    });
}


/*贷款产品查询*/
function getLoanProductListConF(bodyJson) {
    getLoanProductListFun(bodyJson, function (msg) {
        getLoanProductListSucc(msg);
    }, function (err) {
        queryTableDataByConditions({
            "databaseName": "myDatabase", //数据库名
            "tableName": "" //表名
        }, function (msg) {
            if (msg == '') {
                localStorage.loanProductTime = 1;
            }
        }, function (err) {
            funDataFail(err);
        });
        localStorage.loanProductTime = 1;
        funFail(err);
    });
}


/*贷款人信息查询 LOS AND ICBS*/
function queryLoanCustomerInfoConF(bodyJson) {
    queryLoanCustomerInfoFun(bodyJson, function (msg) {
        queryLoanCustomerInfoSucc(msg);
    }, function (err) {
        loan.inputLogo = false;
        funFail(err);
    })
}

/*楼盘信息查询*/
function findBuildingInfoConF(bodyJson,successCallBackFun) {
    findBuildingInfoFun(bodyJson, function (msg) {
        successCallBackFun(msg);
    }, function (err) {
        loan.inputLogo = false;
        funFail(err);
    });
}

/*添加楼盘信息*/
function insertBuildingInfoConF(bodyJson) {
    insertBuildingInfoFun(bodyJson, function (msg) {
        insertBuildingInfoSucc(msg);
    }, function (err) {
        funFail(err);
    });
}

/*删除楼盘信息*/
function deleteBuildingInfoConF(bodyJson) {
    deleteBuildingInfoFun(bodyJson, function (msg) {
        deleteBuildingInfoSucc(msg);
    }, function (err) {
        funFail(err);
    });
}

/*同步楼盘信息查询*/
function seekBuildingInfoConF(bodyJson) {
    seekBuildingInfoFun(bodyJson, function (msg) {
        seekBuildingInfoSucc(msg);
    }, function (err) {
        funFail(err);
    });
}

/*更新贷款人信息*/
function updateLenderInfoConF(bodyJson) {
    updateLenderInfoFun(bodyJson, function (msg) {
        updateLenderInfoSucc(msg);
    }, function (err) {
        funFail(err);
    });
}

/*申请贷款*/
function applyLendingLoanConF(event, compressCount) {
    if(loan.mInfo.maritalStatus == '20' || loan.mInfo.maritalStatus == '21' || loan.mInfo.maritalStatus == '40' || loan.mInfo.maritalStatus == '23'){
        if(!compressCount || compressCount != 4){
            return; 
        }
    }else{
        if(!compressCount || compressCount != 3){
            return;
        } 
    }
    showLoader('贷款信息提交中...');
    // 事件发布执行回调方法前，取订事件，避免重复发布
    topicUtil.unsubscribe("loan/applyLendingLoanConF");
    var faceType = '';
    if(loan.gInfo.isTrue){
        if(loan.mInfo.faceRecogn =='1' && loan.gInfo.faceRecogn =='1'){
            faceType = '1';
        }else{
            faceType = '5';
        }
    }else{
        faceType = loan.mInfo.faceRecogn;
        loan.mInfo.consortCellphone = '';//配偶手机号
        loan.mInfo.consortIncome = '';//配偶月均稳定收入
        loan.mInfo.consortHeadship = '';
        loan.mInfo.peiHeadship = '';
    }
    //后台取数规则变更，文件列表不再从appBuss里获取，而是从提交接口取  2016-7-13
    var customerFileList = [];//征信文件  征信授权书
	if (loan.mInfo.cFileStr && loan.mInfo.cFileStr.length > 0) {
    	$.each(loan.mInfo.cFileStr, function (index, creditInfo) {
			if(creditInfo.creditReferPath) {
				$.each(creditInfo.creditReferPath.split(';'), function(index, path) {
					customerFileList.push(path);
				});
			}
	        if(creditInfo.accredit){
	            customerFileList.push(creditInfo.accredit);
	        }
	    });
	}
    customerFileList = JSON.stringify(customerFileList);
    var fileList = [];
    if (loan.dzd.length !== 0) {
        $.each(loan.dzd, function (index, ele) {
            fileList.push(ele);
        });
    }
    if (loan.fdzd.length !== 0) {
        $.each(loan.fdzd, function (index, ele) {
            fileList.push(ele);
        });
    }
    fileList = JSON.stringify(fileList);
    var sendJson = {
        "b": [{
            "longitude.s":commonJson.longitude,//经度
            "latitude.s":commonJson.latitude,//纬度
            "CheckResult.s":'',//身份证联网核查结果
            "BussinessCode.s":'02', //联网核查 业务类型
            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
            "workAddress.s": commonJson.workAddress,//工作地址
            "moduleId.s": loan.moduleId, //模块编号
            "tranId.s": loan.tranId, //交易编号
            "operatorNo.s": commonJson.adminCount, //操作员
            "deviceNo.s": commonJson.udId, //设备编号
            "orgId.s": commonJson.orgId,
            "clientNo.s": loan.mCLIENT_NO,//客户号
            "certType.s": 'Ind01',//证件类型 身份证
            "certNum.s": loan.mInfo.cerNO,//证件号码
            "name.s":loan.mInfo.name,//姓名
            "country.s":loan.mInfo.country,//国籍
            "nativePlace.s":loan.mInfo.address,//户籍地址
            "sex.s":loanSexJson[loan.mInfo.sex],//性别
            "birthday.s":loan.mInfo.birthday.replace(/-/g, '/'),//出生日期
            "eduExp.s":loan.mInfo.eduExp,//最高学历
            "dwellingAddr.s":loan.mInfo.dwellingAddr,//居民地址
            "dwellingZip.s": loan.mInfo.dwellingZip,//居住地址邮编
            "corporation.s": loan.mInfo.corporation,//单位名称
            "creditCategory.s": loan.mInfo.creditCategory,//授信客户分类
            "clStencil.s": loan.mInfo.clStencil,//信用等级评估模板名称
            "maritalStatus.s": loan.mInfo.maritalStatus,//婚姻状况
            "degree.s": loan.mInfo.degree,//最高学位
            "dwellingStatus.s": loan.mInfo.dwellingStatus,//居住状况
            "dwellYear.s": loan.mInfo.dwellYear.substr(0, 4),//现地址居住开始年份
            "industry.s": loan.mInfo.industry,//单位所属行业
            "occupation.s": loan.mInfo.occupation,//职业
            "headship.s": loan.mInfo.headship,//职务
            "position.s": loan.mInfo.position,//loanPosition[loan.mInfo.position],//职称
            "income.s": ''+Number(loan.mInfo.income)*12,//工资收入
            "remark.s": loan.mInfo.remark,//房产证号码
            "consortName.s": loan.gInfo.name,//配偶姓名
            "consortCertType.s": '',//配偶证件类型
            "consortCertId.s": loan.gInfo.cerNO,//配偶证件号码
            "consortSex.s": loanSexJson[loan.gInfo.sex],//配偶性别
            "consortHeadship.s": loan.mInfo.consortHeadship,//配偶职务
            "consortCellphone.s": loan.mInfo.consortCellphone,//配偶手机号码
            "consortIncome.s": '',//配偶月均稳定收入
            "minorChildren.s": loan.mInfo.minorChildren,//未成年子女
            "support.s": ''+loan.mInfo.support,//供养人数
            "debtBalance.s": ''+loan.mInfo.debtBalance,//现有负债余额
            "houses.s": loan.mInfo.houses,//现有住房数
            "housesArea.s": loan.applicationObj.hadHouseArea,//现住房面积
            "mailingAddr.s": loan.mInfo.mailingAddr,//通讯地址
            "homeTel.s": loan.mInfo.homeTel,//家庭电话
            "workTel.s": loan.mInfo.workTel,//工作电话
            "cellphone.s": loan.mInfo.cellphone,//手机号码
            "isCoborrower.s": '0',//loan.mInfo.isCoborrower,//配偶是否共借人 0否 1 s是
            "prodType.s": loan.applicationObj.proType,//业务品种 401001010 
            "prodCode.s": loan.applicationObj.proCODE,//营销产品 010540
            "relativeAgreement.s": loan.applicationObj.relativeAgreement,//第三方额度号
            "channelCode.s": '',//渠道编号
            "buildingAddr.s":loan.applicationObj.buildingAddr,//面谈地址
            "buildingName.s": loan.applicationObj.summary,//楼盘项目
            "address.s": loan.applicationObj.buildingAddress,//房屋地址
            "buildingStatus.s": loan.applicationObj.buildingStau,//房屋状态 1 预售 2 现货 3二手楼
            "buildingUsage.s": loan.applicationObj.buildingPurpose,//房屋用途 1 自住  0 非自住
            "coveredArea.s": ''+loan.applicationObj.buildingSea,//建筑面积
            "unitPrice.s": ''+loan.applicationObj.buildingDan,//单价
            "totalPrice.s": ''+loan.applicationObj.buildingZong,//房屋总价
            "initialPayment.s": ''+loan.applicationObj.buildingFMoney,//首付款金额
            "loanAmounts.s": ''+loan.applicationObj.buildingFuMoney,//借款金额
            "loanTerm.s": ''+(loan.applicationObj.buildingFuTime)*12,//借款期限  按月送
            "repaymentMode.s": loan.applicationObj.buildingType,//还款方式
            "repaymentSchedule.s": loan.applicationObj.buildingExplain,//还款计划说明
            "autoReimbursementAcct.s": loan.applicationObj.accout,//还款账号
            "documentType.s": loan.applicationObj.accoutType,//凭证类型
            "fileName.s": loan.applicationObj.fuJian,//上传附件
            "customerManager.s": loan.applicationObj.manager,//客户经理
            "localeTimestamp.s": loan.applicationObj.uploadTime,//本地上传时间
            "signature.s":loan.mInfo.signaData,//主申请人签名
            "conSign.s":'',//配偶签名
            "manager.s":commonJson.TLRNAME,//登录名
            "mortgagesArea.s":loan.applicationObj.shopHouseArea,//建筑面积 --->银行贷款购买面积
            "mortgages.s":loan.applicationObj.shopHouseNum,//建筑 --->银行贷款购买套数
            "consortCorporation.s":loan.mInfo.peiHeadship,  //配偶工作单位
            "faceRecogn.s": faceType, //人脸识别
            "modifiable.s":loan.applicationObj.modifiable, //是否可修改
            "FILE_COUNT.s":'3',//文件上传数量
            "workCountry.s": commonJson.workCountry,    //国籍
            "workProvince.s": commonJson.workState,     //省份
            "workCity.s": commonJson.workCity,          //城市
            "workArea.s": commonJson.workSubLocality,   //地区
            "developers.s":loan.applicationObj.developer,//开发商
            "platGlobalSeq.s":loan.applicationObj.platGlobalSeq,
            "FILE_LIST.s": fileList,    //申请类文件清单
            "CUSTOMER_FILE_LIST.s": customerFileList    //客户类文件清单
        }]
    };
    if (loan.gInfo.isTrue) {
        sendJson.b[0]['consortIncome.s'] = ''+Number(loan.mInfo.consortIncome)*12;//配偶月均收入
        sendJson.b[0]['consortCertType.s'] = 'Ind01';
        sendJson.b[0]['consortCertId.s'] = loan.gInfo.cerNO;

        if(loan.mInfo.CheckResult == '09' || loan.gInfo.CheckResult == '09'){
            sendJson.b[0]['CheckResult.s'] = '09';
        }else if(loan.mInfo.CheckResult == '01' || loan.gInfo.CheckResult == '01'){
            sendJson.b[0]['CheckResult.s'] = '01';
        }else if(loan.mInfo.CheckResult == '00' && loan.gInfo.CheckResult == '00'){
            sendJson.b[0]['CheckResult.s'] = '00';
        }
    }else{
        sendJson.b[0]['CheckResult.s'] = loan.mInfo.CheckResult;
    }
    if(loan.mInfo.maritalStatus == '20' || loan.mInfo.maritalStatus == '21' || loan.mInfo.maritalStatus == '40' || loan.mInfo.maritalStatus == '23') {
        sendJson.b[0]['conSign.s'] = loan.gInfo.signaData;
        sendJson.b[0]['FILE_COUNT.s'] ='4';
    }
    applyLendingLoanFun(sendJson, function (msg) {
        applyLendingLoanSucc(msg,event, compressCount);
    }, function (err) {
        hideLoader();
        showTags({
            'title': '提示',
            'content': '业务处理超时!',
            'ok': {
                title: '继续处理',
                fun: function() {
                    applyLendingLoanConF(event, compressCount);
                }
            }
        });
    });
}

/*获取短信验证码*/
function imessageAuthentionServiceConF(bodyJson) {
    showLoader('获取中...')
    imessageAuthentionServiceFun(bodyJson, function (msg) {
        imessageAuthentionServiceBankSucc(msg, bodyJson);
    }, function (err) {
        hideLoader();
        loan.getBankYZM = true;
        $('#getMsg').addClass('disMsg').removeClass('disgua-btn');
        funFail(err);
    });
}

/*校验短信验证码*/
function imessageAuthentionServiceYConF(bodyJson) {
    imessageAuthentionServiceYFun(bodyJson, function (msg) {
        imessageAuthentionServiceYLoanSucc(msg);
    }, function (err) {
        loan.BUSER_NO = "";
        funFail(err);
    })
}

/*文件下载并打开*/
function getFileDataAndOpen(data, nameType) {
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
	    } else if (responseBody[0].results == "08") {
	    	getFileDataAndOpen(data, nameType);
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
}
/*贷款申请表*/
function lendingInfoConF(bodyJson) {
    lendingInfoFun(bodyJson, function (msg) {
        var responseBody = responseBodySuccFormat(msg);
        if (responseBody[0].results == '00') {
            var fileStr = responseBody[1].hashMap[0].file;
            loan.creditReferPath = responseBody[1].hashMap[0].fileName;
            var netFilePath = responseBody[1].hashMap[0].fileName.split('/');
            var fileName = netFilePath[netFilePath.length - 1];
            transFormBase64Tofile(fileName, fileStr, function (path) { //返回路径
                scanTheFiles(path, function (msg) {
                }, function (err) {
                    showTags({
                        'title': '提示',
                        'content': '文件打开失败！',
                        'ok': {}
                    });
                });
            });
        }else if(responseBody[0].results == '08'){
            var sendJson ={
                "b":[{
                    "deviceNo.s": commonJson.udId, //设备编号
                    "moduleId.s": loan.moduleId, //模块编号
                    "tranId.s": loan.tranId, //交易编号
                    "orgId.s": commonJson.orgId,//机构号
                    "operatorNo.s": commonJson.adminCount,//操作员
                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
                    "workAddress.s": commonJson.workAddress,//工作地址
                    "certType.s":'Ind01',
                    "certNum.s":loan.mInfo.cerNO,//证件号码
                    "isCoborrower.s":loan.mInfo.isCoborrower,//配偶是否共借人 0否 1 是
                    "buildingStatus.s":loan.applicationObj.buildingStau,//房屋状态 1 预售 2 现货 3二手楼
                    "buildingUsage.s":loan.applicationObj.buildingPurpose,//房屋用途 1 自住  0 非自住
                    "coveredArea.s":loan.applicationObj.buildingSea,//建筑面积
                    "unitPrice.s":loan.applicationObj.buildingDan,//单价
                    "totalPrice.s":loan.applicationObj.buildingZong,//房屋总价
                    "initialPayment.s":loan.applicationObj.buildingFMoney,//首付款金额
                    "loanAmounts.s":loan.applicationObj.buildingFuMoney,//借款金额
                    "loanTerm.s":loan.applicationObj.buildingFuTime,//借款期限  按月送
                    "repaymentMode.s":loan.applicationObj.buildingType,//还款方式
                    "autoReimbursementAcct.s":loan.applicationObj.accout,//还款账号
                    "signature.s":loan.mInfo.signaData,//签名文件
                    "conSign.s":'',
                    "localeTimestamp.s":loan.applicationObj.uploadTime,//本地上传时间
                    "manager.s":commonJson.TLRNAME //操作员姓名
                }]
            };
            showLoader('贷款申请表查询中...');
            if(loan.gInfo.isTrue){
                sendJson.b[0]['conSign.s'] = loan.gInfo.signaData;
            }
            lendingInfoConF(sendJson);
        }else {
            showTags({
                'title': '提示',
                'content': '文件打开失败！',
                'ok': {}
            });
        }
    }, function (err) {
        funFail(err);
    })
}
/*面谈笔录*/
function investigativeRecordConF(bodyJson) {
    investigativeRecordFun(bodyJson, function (msg) {
        var responseBody = responseBodySuccFormat(msg);
        if (responseBody[0].results == '00') {
            var fileStr = responseBody[1].hashMap[0].file;
            loan.creditReferPath = responseBody[1].hashMap[0].fileName;
            var netFilePath = responseBody[1].hashMap[0].fileName.split('/');
            var fileName = netFilePath[netFilePath.length - 1];
            transFormBase64Tofile(fileName, fileStr, function (path) { //返回路径
                scanTheFiles(path, function (msg) {
                }, function (err) {
                    showTags({
                        'title': '提示',
                        'content': '文件打开失败！',
                        'ok': {}
                    });
                });
            });
        } else {
            showTags({
                'title': '提示',
                'content': '文件打开失败！',
                'ok': {}
            });
        }
    }, function (err) {
        funFail(err);
    });
}
/*征信授权书*/
function accreditConF(bodyJson) {
    accreditFun(bodyJson, function (msg) {
        var responseBody = responseBodySuccFormat(msg);
        if (responseBody[0].results == '00') {
            var fileStr = responseBody[0].file;
            var netFilePath = responseBody[0].fileName.split('/');
            var fileName = netFilePath[netFilePath.length - 1];
            transFormBase64Tofile('F0006'+fileName, fileStr, function (msg) { //返回路径
                var filePath = msg;
           //插入数据库
                var sendDataJson = {
                    "databaseName": "myDatabase",
                    "tableName": "loandownload_info",
                    "data": [{
                        "name": $('.input-test-con:last').val(),
                        "cerType": $('#c-com-property option:selected').val(),
                        "cerNO": $('.input-test-con:first').val(),
                        "fileName": fileName,
                        "filePath": filePath,
                        "fileType": '004', //授权书
                        "seqNum":'',
                        "netFilePath":loan.creditReferPath,
                        "fileTime": fileName.substr(fileName.lastIndexOf('_')),
                        "insertTime": myTime.CurTime()
                    }]
                };
                insertTableData(sendDataJson, function (msg) {}, function (err) {
                    alert('失败' + msg);
                });
            })
        } else {
            showTags({
                'title': '提示',
                'content': '人行授权书下载失败!',
                'ok': {}
            });
        }
    }, function (err) {
        funDataFail(err);
    });
}

/*获取流水号*/
function getPlatGlobalSeqConF(bodyJson){
    getPlatGlobalSeqFun(bodyJson, function (msg) {
        var responseBody = responseBodySuccFormat(msg);
        if(responseBody[0].results == '00') {
            loan.applicationObj.globalSeq = responseBody[0].platGlobalSeq;//获取平台流水号
            applyLendingLoanConF();
        } else{
            hideLoader();
            showTags({
                'title': '提示',
                'content': '获取平台交易流水号超时!',
                'cancel': {
                    'title': '继续提交', //非必输  默认值：确认
                    'fun': function() { //非必输  如果输入则执行此函数
                        showLoader('贷款信息提交中...');
                        getPlatGlobalSeqConF(bodyJson);
                    }
                },
                'ok': {
                    'title': '放弃提交', //非必输  默认值：取消
                    'fun': function() { //非必输  如果输入则执行此函数
                        hideTags(); //关闭提示信息
                        hideLoader();
                    }
                }
            });
        }
    }, function (err) {
        hideLoader();
        showTags({
            'title': '提示',
            'content': '获取平台交易流水号超时!',
            'ok': {}
        });
    });
}

//弹出鹏元征信报告文件列表框
function showPyCreditBox(json, type){
	var list = json.creditInfo.expList;
	if($('#pyCreditListBox').is(':hidden')){
		$('#creditList').empty();
		$.each(list, function(index, data) {
			data = data.creditInquiryExp[0];
			var fileName = data.filePath.split('/');
			$('#creditList').append($('<li>')
				.append($('<div>').css('width', '30%').html(index + 1))
				.append($('<div>').css('width', '70%').append($('<u>').data('filePath', data.filePath).html(fileName[fileName.length - 1]))));
		});
		$('#pyCreditListBox').show();
	} else {
		//遮罩层
		var maskDiv = $('<div>').attr('id', 'pyCreditListBox').addClass('pop-up-mask-div');
		
		//弹出框
		var boxDiv = $('<div>').addClass('pop-up-box-div');
		
		//标题
		var titleDiv = $('<div>').addClass('py-title-div').html('鹏元征信列表');
		
		//内容
		var contextDiv = $('<div>').addClass('py-context-div');
		contextDiv.append($('<div>').addClass('py-header')
			.append($('<div>').css('width', '30%').html('序号'))
			.append($('<div>').css('width', '70%').html('征信文件')));
			
		var contextUl = $('<ul>').attr('id', 'creditList').addClass('py-context-list');
		$.each(list, function(index, data) {
			data = data.creditInquiryExp[0];
			var fileName = data.filePath.split('/');
			contextUl.append($('<li>')
				.append($('<div>').css('width', '30%').html(index + 1))
				.append($('<div>').css('width', '70%').append($('<u>').data('filePath', data.filePath).html(fileName[fileName.length - 1]))));
		});
		contextDiv.append(contextUl);
		
		//底部返回按钮
		var footterDiv = $('<div>').addClass('footter').css('border-radius', '0px 0px 8px 8px')
			.append($('<a>').attr('id', 'pyCloseBtn').addClass('previous back-1 ui-link').css('float', 'none').html('返回'));
		
		boxDiv.append(titleDiv).append(contextDiv).append(footterDiv);
		maskDiv.append(boxDiv);
		$('div[data-role="page"]').append(maskDiv);
		
		$('#pyCloseBtn').click(function(){
			$('#pyCreditListBox').hide();
		});
		
		$('#pyCreditListBox').on('click', '#creditList u', function(){
			json.creditReferPath = $(this).data('filePath');
			getFileDataAndOpen(json, type);
		});
	}
}

//打开征信文件
function openCreditReportFile(json, type){
	if(json.creditInfo.creditType == 'PY'){
    	var list = json.creditInfo.expList;
    	//鹏元征信文件只有一个就直接显示，多个弹出鹏元征信报告文件列表框
    	if(list.length == 1){
    		json.creditReferPath = list[0].creditInquiryExp[0].filePath;
    		getFileDataAndOpen(json, type);
    	} else {
    		showPyCreditBox(json, type);
    	}
    } else {
    	getFileDataAndOpen(json, type);
    }
}
