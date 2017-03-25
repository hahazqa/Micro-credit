//客户信息录入界面显示从小贷，核心，meap平台查询回来的信息
function showSmallLoanCusMessage() {
	if(smallLoanCusManJson.updateInfo == '0') {//管户经理不同不可修改信息
		$("#smallLoanCus-mobile").val(telNum(smallLoanCusManJson.mobile)).attr('disabled','disabled'); //手机号码
		$("#smallLoanCus-zipcode").val(smallLoanCusManJson.zipcode).attr('disabled','disabled'); //邮编
		if(smallLoanCusManJson.addrHome) {
			$("#day_b").val("").selectmenu('refresh');
			$("#day_c").val("").selectmenu('refresh').attr('disabled', 'disabled');
			$("#smallLoanCus-addr-home").val(smallLoanCusManJson.addrHome).attr('disabled','disabled'); //经营地址详细地址
		}
		if(smallLoanCusManJson.addrDetail) {
			$("#s_city").val("").selectmenu('refresh');
			$("#s_county").val("").selectmenu('refresh').attr('disabled', 'disabled');
			$("#smallLoanCus-addr-detail").val(smallLoanCusManJson.addrDetail).attr('disabled','disabled'); //居住地址详细地址
		}
		$("#smallLoanCus-marriage").val(smallLoanCusManJson.marriage).selectmenu('refresh').attr('disabled', 'disabled'); //婚姻状况
		$("#smallLoanCus-occup").val(smallLoanCusManJson.occup).selectmenu('refresh').attr('disabled', 'disabled'); //职位
		$("#smallLoanCus-com-name").val(smallLoanCusManJson.companyName).attr('disabled', 'disabled'); //工作单位
		$("#ZhiWu").val(smallLoanCusManJson.ZhiWu).selectmenu('refresh').attr('disabled', 'disabled'); //职务
		$("#smallLoanCus-income").val(fmoney(smallLoanCusManJson.income)).attr('disabled', 'disabled'); //月收入
		$('#smallLoanCus-f-income').val(fmoney(smallLoanCusManJson.familyIncome)).attr('disabled', 'disabled');//家庭月收入
	}else{
		$("#smallLoanCus-mobile").val(telNum(smallLoanCusManJson.mobile)); //手机号码
		$("#smallLoanCus-zipcode").val(smallLoanCusManJson.zipcode); //邮编
		if(smallLoanCusManJson.addrHome) {
			$("#day_b").val("").selectmenu('refresh');
			$("#day_c").val("").selectmenu('refresh').attr('disabled', 'disabled');
			$("#smallLoanCus-addr-home").val(smallLoanCusManJson.addrHome); //经营地址详细地址
		}
		if(smallLoanCusManJson.addrDetail) {
			$("#s_city").val("").selectmenu('refresh');
			$("#s_county").val("").selectmenu('refresh').attr('disabled', 'disabled');
			$("#smallLoanCus-addr-detail").val(smallLoanCusManJson.addrDetail); //居住地址详细地址
		}
		$("#smallLoanCus-marriage").val(smallLoanCusManJson.marriage).selectmenu('refresh'); //婚姻状况
		$("#smallLoanCus-occup").val(smallLoanCusManJson.occup).selectmenu('refresh'); //职位
		$("#smallLoanCus-com-name").val(smallLoanCusManJson.companyName); //工作单位
		$("#ZhiWu").val(smallLoanCusManJson.ZhiWu).selectmenu('refresh'); //职务
		$("#smallLoanCus-income").val(fmoney(smallLoanCusManJson.income)); //月收入
		$('#smallLoanCus-f-income').val(fmoney(smallLoanCusManJson.familyIncome));//家庭月收入
	}

}


//页面跳转过程中缓存交易信息或暂存交易信息
function casheSmallLoanCusMessage(){
	smallLoanCusManJson.addrName = $.trim($("#smallLoanCus-addrName").val()); //地区名称
	smallLoanCusManJson.addrAll = $.trim($("#smallLoanCus-addr").html()); //签发地区所有选项
	smallLoanCusManJson.addrCode = $.trim($("#smallLoanCus-addr").val()); //签发地区名称
	smallLoanCusManJson.addr = $.trim($("#smallLoanCus-addr option:selected").text()); //签发地区名称
	smallLoanCusManJson.mobile = removeSpace($('#smallLoanCus-mobile').val()); //手机号码
	smallLoanCusManJson.zipcode = $.trim($("#smallLoanCus-zipcode").val()); //邮编
	smallLoanCusManJson.day_b = $.trim($("#day_b").val()); //经营地址市
	smallLoanCusManJson.day_c = $.trim($("#day_c").val()); //经营地址区
	smallLoanCusManJson.addrHome = $.trim($("#smallLoanCus-addr-home").val()); //经营地址详细地址
	smallLoanCusManJson.s_city = $.trim($("#s_city").val()); //居住地址市
	smallLoanCusManJson.s_county = $.trim($("#s_county").val()); //居住地址区
	smallLoanCusManJson.addrDetail = $.trim($("#smallLoanCus-addr-detail").val()); //居住地址详细地址
	smallLoanCusManJson.marriage = $.trim($("#smallLoanCus-marriage").val()); //婚姻状况
	smallLoanCusManJson.occup = $.trim($("#smallLoanCus-occup").val()); //职位
	smallLoanCusManJson.companyName = $.trim($("#smallLoanCus-com-name").val()); //工作单位
	smallLoanCusManJson.ZhiWu = $.trim($("#ZhiWu").val()); //职务
	smallLoanCusManJson.income = rmoney($("#smallLoanCus-income").val()); //月收入
	smallLoanCusManJson.familyIncome = rmoney($("#smallLoanCus-f-income").val()); //家庭月收入
//	smallLoan.peiName = $.trim($("#smallLoan-peiName").val()); //配偶姓名
//	smallLoan.peiPhone = removeSpace($('#smallLoan-peiPhone').val()); //配偶手机号码
//	smallLoan.peiCerNo = $.trim($("#smallLoan-peiCerNo").val()); //配偶证件号码
//	smallLoan.peiCompany = $.trim($("#smallLoan-peiCompany").val()); //配偶工作单位
//	smallLoan.loanMoney = $.trim(rmoney($("#smallLoan-loanMoney").val())); //贷款金额
//	smallLoan.loanTime = $.trim($("#smallLoan-loanTime").val()); //贷款期限
//	smallLoan.paymentMethod = $.trim($("#paymentMethod").val()); //还款方式
//	smallLoan.loanUse = $.trim($("#smallLoan-loanUse").val()); //贷款用途
}



//初始化字段
function smallLoanCusinitVariable() {
	smallLoanCusManJson.filePath = '';
	smallLoanCusManJson.zhengxinArr = [];
	smallLoanCusManJson.fillListArr = [];
	commonJson.longitude = ''; //经度
	commonJson.latitude = ''; //纬度
	smallLoanCusManJson.issPlace = false; //签发地区初始为空
	smallLoanCusManJson.isRead = false;
	smallLoanCusManJson.messageCache = false; //信息录入缓存
	smallLoanCusManJson.isPicturePage = false; //图片缓存
	creditJson.isPrev.LLDBisFromPrev = false; //如果点击了继续或者从信息录入页面返回 则下次不用进入两两对比页面 否则都是要进入两两对比
	custermerInfo = {};
	smallLoanCusManJson.addrName = ''; //地区名称
	smallLoanCusManJson.addr = ''; //签发地区名称
	smallLoanCusManJson.mobile = ''; //手机号码
	smallLoanCusManJson.zipcode = ''; //邮编
	smallLoanCusManJson.day_b = ''; //经营地址市
	smallLoanCusManJson.day_c = ''; //经营地址区
	smallLoanCusManJson.addrHome = ''; //经营地址详细地址
	smallLoanCusManJson.s_city = ''; //居住地址市
	smallLoanCusManJson.s_county = ''; //居住地址区
	smallLoanCusManJson.addrDetail = ''; //居住地址详细地址
	smallLoanCusManJson.marriage = ''; //婚姻状况
	smallLoanCusManJson.occup = ''; //职位
	smallLoanCusManJson.companyName = ''; //工作单位
	smallLoanCusManJson.ZhiWu = ''; //职务
	smallLoanCusManJson.income = ''; //月收入
	smallLoanCusManJson.peiPhone = ''; //配偶手机号码
	smallLoanCusManJson.peiName = ''; //配偶姓名
	smallLoanCusManJson.peiCerNo = ''; //配偶证件号码
	smallLoanCusManJson.peiCompany = ''; //配偶工作单位
	smallLoanCusManJson.familyIncome = '';//家庭月收入
//	smallLoan.loanMoney = ''; //贷款金额
//	smallLoan.loanTime = ''; //贷款期限
//	smallLoan.paymentMethod = ''; //还款方式
//	smallLoan.loanUse = ''; //贷款用途
	workbenchJson.isTemp = false;//暂存继续处理
	smallLoanCusManJson.customerId = ''; //客户ID
	smallLoanCusManJson.spouseId = ''; //配偶客户ID
	smallLoanCusManJson.branchId = ''; //
	commonJson.isCustermerInfoMultiplex = false;
	smallLoanCusManJson.signature = false;
	smallLoanCusManJson.signHref = '';
	smallLoanCusManJson.role = '';//客户角色信息
	smallLoanCusManJson.applyTo = '';//客户类型
	smallLoanCusManJson.updateInfo = '';//是否可以修改客户信息 0-否 1-是
	smallLoanCusManJson.applicationno = '';//小贷申请编号
	smallLoanCusManJson.originapplyform = '';//原申请书路径
}


//图片界面点击暂存
function smallLoanCusZanCunPictureInfo(TEMPFROM) {//TEMPFROM-点击暂存的页面
	var sendDataJson = {
		"databaseName": "myDatabase",
		"tableName": "loanapply_info",
		"data": [{
			'proCODE': smallLoanCusManJson.applicationno, //申请编号-进度查询查回来参数
			'proType': smallLoanCusManJson.applyTo,
			'mCLIENT_NO': smallLoanCusManJson.CLIENT_NO, //客户号
			'BUSINESSTYPE': '小贷客户信息管理', //
			'TEMPFROM': TEMPFROM,
			'YWXS': smallLoanCusManJson.proName, //业务线索,贷款产品名称
			'SUBMITTIME': myTime.CurTime(),
			'isPicturePage': smallLoanCusManJson.isPicturePage,
			'mCheckResult': lianwanghechaData.CheckResult, //联网核查
			//基础的
			'mfaceRecogn': smallLoanCusManJson.faceRecogn,
			'offlineOnline': commonJson.offlineOnline, //脱机/联机
			'workAddress': commonJson.workAddress, //工作地址
			'moduleId': smallLoanCusManJson.moduleId, //模块编号
			'tranId': smallLoanCusManJson.tranId, //交易编号
			'operatorNo': commonJson.adminCount, //操作员
			'deviceNo': commonJson.udId, //设备编号
			'orgId': commonJson.orgId,
			//主身份证信息
			'mNation': custermerInfo.nation, //
			'mcerNo': custermerInfo.cerNO,
			'maddress': custermerInfo.address,
			'mname': custermerInfo.name,
			'mcerExpdDt': custermerInfo.cerExpdDt,
			'mbirthday': custermerInfo.birthday,
			'msex': custermerInfo.sex,
			'missAuthority': custermerInfo.issAuthority,
			'mimage': custermerInfo.image,

			//主影像
			"mcustFacePic": smallLoanCusManJson.applicationObj.mPicFileARR[0], //客户面部照片
			"mcustAndCustOwnerPic": smallLoanCusManJson.applicationObj.mPicFileARR[1], //与客户合影照片
			"mfrontIDCardPic": smallLoanCusManJson.applicationObj.mPicFileARR[2], //身份证正面
			"mbackIDCardPic": smallLoanCusManJson.applicationObj.mPicFileARR[3], //身份证反面
			"mpicFileARR": smallLoanCusManJson.applicationObj.mPicFileARR.join("&&"), //要打包的影像路径
			"mpicFileInfoARR": JSON.stringify(smallLoanCusManJson.applicationObj.mPicFileInfoARR), //每个图片的名称和类型
			"mpicFileMsgType": smallLoanCusManJson.applicationObj.mPicFileMsgType.join("&&"), //其他图片对象的证明类型
			"mcheckPhoto": smallLoanCusManJson.mInfo.lianPic, //联网核查图片

			

			'REMARK13': commonJson.isCustermerInfoMultiplex, //
			'REMARK1': commonJson.longitude, //经度
			'REMARK2': commonJson.latitude, //纬度
			'REMARK3': smallLoanCusManJson.role, //客户角色
			'REMARK4': smallLoanCusManJson.originapplyform, //原申请书路径
			'REMARK5': smallLoanCusManJson.updateInfo //是否可修改客户信息
//			'REMARK3': smallLoan.fixedAmount, //最大额度
//			'REMARK4': smallLoan.fixedTerms, //最大期限
//			'REMARK14': smallLoan.minAmount, //最小额度
//			'REMARK15': smallLoan.minTerms //最小期限

		}]
	};
	insertTableData(sendDataJson, function(msg) {
		smallLoanCusinitVariable();
	}, function(err) {
		showMsg('存储个人信息失败' + msg);
	});
}

//信息录入页面点击暂存
function smallLoanCusZanCunCustermerInfo() {
	var sendDataJson = {
		"databaseName": "myDatabase",
		"tableName": "loanapply_info",
		"data": [{
			//'organCode': '',
			//'modifiable': '',
			'proCODE': smallLoanCusManJson.applicationno, //小贷申请编号
			'proType': smallLoanCusManJson.applyTo,
			//'isInputChange': '',  //字段变化
			'gisTrue': creditJson.isPrev.LLDBisFromPrev, //联网核查结果
			'mCLIENT_NO': smallLoanCusManJson.CLIENT_NO, //客户号
			'BUSINESSTYPE': '小贷客户信息管理', //
			'TEMPFROM': 'smallLoanCusManage-messageinput.html',
			'YWXS': smallLoanCusManJson.proName, //业务线索
			'SUBMITTIME': myTime.CurTime(),
			'mCheckResult': lianwanghechaData.CheckResult, //联网核查
			'isPicturePage': smallLoanCusManJson.isPicturePage,
			//基础的
			'mfaceRecogn': smallLoanCusManJson.faceRecogn,
			'offlineOnline': commonJson.offlineOnline, //脱机/联机
			'workAddress': commonJson.workAddress, //工作地址
			'moduleId': smallLoanCusManJson.moduleId, //模块编号
			'tranId': smallLoanCusManJson.tranId, //交易编号
			'operatorNo': commonJson.adminCount, //操作员
			'deviceNo': commonJson.udId, //设备编号
			'orgId': commonJson.orgId,
			//主身份证信息
			'mNation': custermerInfo.nation, //
			'mcerNo': custermerInfo.cerNO,
			'maddress': custermerInfo.address,
			'mname': custermerInfo.name,
			'mcerExpdDt': custermerInfo.cerExpdDt,
			'mbirthday': custermerInfo.birthday,
			'msex': custermerInfo.sex,
			'missAuthority': custermerInfo.issAuthority,
			'mimage': custermerInfo.image,

			//主影像
			"mcustFacePic": smallLoanCusManJson.applicationObj.mPicFileARR[0], //客户面部照片
			"mcustAndCustOwnerPic": smallLoanCusManJson.applicationObj.mPicFileARR[1], //与客户合影照片
			"mfrontIDCardPic": smallLoanCusManJson.applicationObj.mPicFileARR[2], //身份证正面
			"mbackIDCardPic": smallLoanCusManJson.applicationObj.mPicFileARR[3], //身份证反面
			"mpicFileARR": smallLoanCusManJson.applicationObj.mPicFileARR.join("&&"), //要打包的影像路径
			"mpicFileInfoARR": JSON.stringify(smallLoanCusManJson.applicationObj.mPicFileInfoARR), //每个图片的名称和类型
			"mpicFileMsgType": smallLoanCusManJson.applicationObj.mPicFileMsgType.join("&&"), //其他图片对象的证明类型
			"mcheckPhoto": smallLoanCusManJson.mInfo.lianPic, //联网核查图片

			//输入的字段
			'maritalStatus': smallLoanCusManJson.marriage,

			'corporation': smallLoanCusManJson.companyName,
			'headship': smallLoanCusManJson.occup,

			'cellphone': smallLoanCusManJson.mobile,
			'dwellingZip': smallLoanCusManJson.zipcode,
			'dwellingAddr': smallLoanCusManJson.addrHome, //经营地址
			'mailingAddr': smallLoanCusManJson.addrDetail, //居住地址
			'REMARK16': smallLoanCusManJson.day_b,
			'REMARK17': smallLoanCusManJson.day_c,
			'REMARK18': smallLoanCusManJson.s_city,
			'REMARK19': smallLoanCusManJson.s_county,
			'income': smallLoanCusManJson.income, //月收入

			'consortCellphone': smallLoanCusManJson.peiPhone, //配偶电话
			'consortIncome': smallLoanCusManJson.familyIncome, //家月收入
			'peiHeadship': smallLoanCusManJson.peiCompany, //配偶工作单位

			'gcerNo': smallLoanCusManJson.peiCerNo, //配偶证件号码
			'gname': smallLoanCusManJson.peiName, //配偶名称

//			'buildingFuMoney': smallLoan.loanMoney, //借款金额
//			'buildingFuTime': smallLoan.loanTime, //借款期限
//			'buildingType': smallLoan.paymentMethod, //还款方式
//			'buildingExplain': smallLoan.loanUse, //还款计划说明

			'uploadTime': '', //本地上传时间
			//未显示在页面上的上传字段
			'country': '', //国籍

			'industry': smallLoanCusManJson.ZhiWu, //职务


			'hadHouseArea': smallLoanCusManJson.addrCode, //地区名称
			'buildingAddr': smallLoanCusManJson.addrName, //签发地区
			'REMARK1': commonJson.longitude, //经度
			'REMARK2': commonJson.latitude, //纬度

			'REMARK13': commonJson.isCustermerInfoMultiplex, //
			'REMARK8': smallLoanCusManJson.addrAll, //签发地区全部
			'REMARK9': smallLoanCusManJson.issPlace, //签发地区判断用
			'REMARK10': smallLoanCusManJson.branchId, //jigouhao
			//'REMARK5': smallLoan.canBuildCustomer,//是否新建小贷信息
			'REMARK6': smallLoanCusManJson.customerId, //客户id
			'REMARK7': smallLoanCusManJson.spouseId, //配偶id
			'REMARK3': smallLoanCusManJson.role, //最大额度
			'REMARK4': smallLoanCusManJson.originapplyform, //原申请书路径
			'REMARK5': smallLoanCusManJson.updateInfo //是否可修改客户信息
//			'REMARK4': smallLoan.fixedTerms, //最大期限
//			'REMARK14': smallLoan.minAmount, //最小额度
//			'REMARK15': smallLoan.minTerms //最小期限
		}]
	};

	insertTableData(sendDataJson, function(msg) {
		smallLoanCusinitVariable();
	}, function(err) {
		showMsg('存储个人信息失败' + msg);
	});
}

//暂存回到拍摄页面
function smallLoanCusTempORpreToPic(obj) {
	smallLoanCusinitVariable();
	commonJson.longitude = obj.REMARK1; //经度
	commonJson.latitude = obj.REMARK2; //纬度
	custermerInfo.nation = obj.mNation; //
	custermerInfo.cerNO = obj.mcerNo;
	custermerInfo.address = obj.maddress;
	custermerInfo.name = obj.mname;
	custermerInfo.cerExpdDt = obj.mcerExpdDt;
	custermerInfo.birthday = obj.mbirthday;
	custermerInfo.sex = obj.msex;
	custermerInfo.issAuthority = obj.missAuthority;
	custermerInfo.image = MT_path + obj.mimage.substring(obj.mimage.lastIndexOf('\/') + 1);
	smallLoanCusManJson.applicationObj.mPicFileARR = obj.mpicFileARR.split('&&'); //要打包的影像路径
	smallLoanCusManJson.applicationObj.mPicFileInfoARR = JSON.parse(obj.mpicFileInfoARR);
	smallLoanCusManJson.applicationObj.mPicFileMsgType = obj.mpicFileMsgType.split('&&');
	smallLoanCusManJson.mInfo.lianPic = obj.mcheckPhoto;
	lianwanghechaData.CheckResult = obj.mCheckResult;
	smallLoanCusManJson.faceRecogn = obj.mfaceRecogn;
	smallLoanCusManJson.applicationno = obj.proCODE; //产品代买
	smallLoanCusManJson.applyTo = obj.proType;
	smallLoanCusManJson.proName = obj.YWXS;
	commonJson.isCustermerInfoMultiplex = obj.REMARK13; //
	smallLoanCusManJson.CLIENT_NO = obj.mCLIENT_NO; //客户号
	smallLoanCusManJson.originapplyform = obj.REMARK4;//原申请书路径
	smallLoanCusManJson.role = obj.REMARK3;
	smallLoanCusManJson.updateInfo = obj.REMARK5;

	for(var k = 0; k < smallLoanCusManJson.applicationObj.mPicFileARR.length; k++) {
		if(smallLoanCusManJson.applicationObj.mPicFileARR[k] != '') {
			var elIndex = smallLoanCusManJson.applicationObj.mPicFileARR[k].lastIndexOf('\/') + 1;
			var fileName = smallLoanCusManJson.applicationObj.mPicFileARR[k].substring(elIndex);
			smallLoanCusManJson.applicationObj.mPicFileARR[k] = MT_path + fileName;
		} else {
			smallLoanCusManJson.applicationObj.mPicFileARR[k] = '';
		}
	}
}


//暂存回到客户信息录入界面
function smallLoanCusTempORpreToObject(obj) {
	smallLoanCusinitVariable();
	commonJson.longitude = obj.REMARK1; //经度
	commonJson.latitude = obj.REMARK2; //纬度
	smallLoanCusManJson.day_b = obj.REMARK16;
	smallLoanCusManJson.day_c = obj.REMARK17;
	smallLoanCusManJson.s_city = obj.REMARK18;
	smallLoanCusManJson.s_county = obj.REMARK19;
	custermerInfo.nation = obj.mNation; //
	custermerInfo.cerNO = obj.mcerNo;
	custermerInfo.address = obj.maddress;
	custermerInfo.name = obj.mname;
	custermerInfo.cerExpdDt = obj.mcerExpdDt;
	custermerInfo.birthday = obj.mbirthday;
	custermerInfo.sex = obj.msex;
	custermerInfo.issAuthority = obj.missAuthority;
	custermerInfo.image = MT_path + obj.mimage.substring(obj.mimage.lastIndexOf('\/') + 1);
	smallLoanCusManJson.applicationObj.mPicFileARR = obj.mpicFileARR.split('&&'); //要打包的影像路径
	smallLoanCusManJson.applicationObj.mPicFileInfoARR = JSON.parse(obj.mpicFileInfoARR);
	smallLoanCusManJson.applicationObj.mPicFileMsgType = obj.mpicFileMsgType.split('&&');
	smallLoanCusManJson.mInfo.lianPic = obj.mcheckPhoto;
	lianwanghechaData.CheckResult = obj.mCheckResult;
	smallLoanCusManJson.faceRecogn = obj.mfaceRecogn;
	creditJson.isPrev.LLDBisFromPrev = obj.gisTrue; //联网核查结果
	smallLoanCusManJson.role = obj.REMARK3; //客户角色
	smallLoanCusManJson.originapplyform = obj.REMARK4; //原申请书路径

	for(var k = 0; k < smallLoanCusManJson.applicationObj.mPicFileARR.length; k++) {
		if(smallLoanCusManJson.applicationObj.mPicFileARR[k] != '') {
			var elIndex = smallLoanCusManJson.applicationObj.mPicFileARR[k].lastIndexOf('\/') + 1;
			var fileName = smallLoanCusManJson.applicationObj.mPicFileARR[k].substring(elIndex);
			smallLoanCusManJson.applicationObj.mPicFileARR[k] = MT_path + fileName;
		} else {
			smallLoanCusManJson.applicationObj.mPicFileARR[k] = '';
		}
	}
	smallLoanCusManJson.marriage = obj.maritalStatus;
	smallLoanCusManJson.CLIENT_NO = obj.mCLIENT_NO; //客户号
	smallLoanCusManJson.companyName = obj.corporation;
	smallLoanCusManJson.occup = obj.headship;

	smallLoanCusManJson.mobile = obj.cellphone;
	smallLoanCusManJson.zipcode = obj.dwellingZip;
	smallLoanCusManJson.addrHome = obj.dwellingAddr;
	smallLoanCusManJson.addrDetail = obj.mailingAddr;
	smallLoanCusManJson.applicationno = obj.proCODE; //产品代买
	smallLoanCusManJson.applyTo = obj.proType;
	smallLoanCusManJson.income = obj.income; //月收入
	smallLoanCusManJson.peiPhone = obj.consortCellphone;
	smallLoanCusManJson.familyIncome = obj.consortIncome; //家月收入
	smallLoanCusManJson.peiCompany = obj.peiHeadship; //配偶工作单位
	smallLoanCusManJson.peiCerNo = obj.gcerNo; //证件号码
	smallLoanCusManJson.peiName = obj.gname; //配偶名称
	//'country': '',//国籍
	smallLoanCusManJson.ZhiWu = obj.industry; //职务
	smallLoanCusManJson.addrCode = obj.hadHouseArea; //地区名称
	smallLoanCusManJson.addrName = obj.buildingAddr; //签发地区
	smallLoanCusManJson.addrAll = obj.REMARK8; //签发地区全部
	smallLoanCusManJson.isPicturePage = obj.isPicturePage;
	smallLoanCusManJson.issPlace = obj.REMARK9;
	//smallLoan.canBuildCustomer = obj.REMARK5;//是否新建小贷信息
	smallLoanCusManJson.customerId = obj.REMARK6 || ''; //客户id
	smallLoanCusManJson.spouseId = obj.REMARK7 || ''; //配偶id
	smallLoanCusManJson.branchId = obj.REMARK10 || ''; //jigouhao
	smallLoanCusManJson.proName = obj.YWXS;
	commonJson.isCustermerInfoMultiplex = obj.REMARK13; //
	smallLoanCusManJson.updateInfo = obj.REMARK5;
}