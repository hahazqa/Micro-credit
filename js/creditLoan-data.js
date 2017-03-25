/**
 * Created by LiChenglin on 2016.6.23
 */
$CL.dat={
		// 初始化数据
		initData:function(pageName){//creditLoanDataInit
			if(pageName == "creditLoan-product"){
				$CL.BTime = null;
			    $CL.applicationObj = {};
			    $CL.pfkjgxObj = {};
			    $CL.isInputChange = false;
			    $CL.isMaster = true;
			    $CL.mInfo.isTrue = false;
			    $CL.MorG = 'm';
			    $CL.inputLogo = false;
			    lianwanghechaData.dianzixinyongkaDX = "9";
			    $CL.buildArr = [];
			    $CL.accountArr = [];
			    $CL.dzd = [];
			    $CL.isPicturePage = false;
			    $CL.ispeiPicturePage = false;
			    $CL.faceSQBS = false;
			    $CL.faceSQBM = false;
			    $CL.proName='';
			    $CL.biPai= 0;
			    $CL.qtPicCode = [];
			    $CL.qtPicName = [];
			    $CL.zhengxinArr = [];
			    $CL.creditArr = [];
			    $CL.fillListArr = [];
			    $CL.houseArr = [];
			    $CL.client_no = '';
			    $CL.maxAmount = '';
			    $CL.minAmount = '';
			    $CL.maxTerms = '';
			    $CL.minTerms = '';
			    $CL.scoreCardNo = '';
			}else if(pageName == "creditLoan-reading"){
				$CL.issPlace = false;// 签发地区初始为空
				$CL.canBuildCustomer = false;// 是否需要建立客户信息
				$CL.isCoreCustomer = "X";//是否是核心存在的客户 X 未知，Y 存在，N 不存在
				$CL.isRead = false;// ?????
				$CL.messageCache = false;// 信息录入缓存 ??????
				$CL.isPicturePage = false;// 图片缓存
				creditJson.isPrev.LLDBisFromPrev = false; // 如果点击了继续或者从信息录入页面返回
				custermerInfo = {};
				$CL.peiIcInfo = {};
				$CL.addrName = '';// 地区名称
				$CL.addr = '';// 签发地区名称
				$CL.mobile = '';// 手机号码
				$CL.telephone = '';//固定电话
				$CL.zipcode = '';// 邮编
				$CL.s_city = '';// 居住地址市
				$CL.s_county = '';// 居住地址区
				$CL.addrDetail = '';// 居住地址详细地址
				$CL.marriage = '';// 婚姻状况
				$CL.occup = '';// 职业  先从评分卡中获取
				$CL.company = '';// 工作单位
				$CL.office = '';// 职务
				$CL.income = '';// 月收入
				$CL.peiPhone = '';// 配偶手机号码
				$CL.peiName = '';// 配偶姓名
				$CL.peiCerNo = '';// 配偶证件号码
				$CL.peiCompany = '';// 配偶工作单位
				$CL.peiCerType = '';// 配偶证件类型
				$CL.peiIncome = '';// 配偶月收入
				$CL.wyType = '';// 物业类型
				$CL.wyNo = '';// 物业编号
				$CL.wyStatus = '';// 物业状态
				$CL.wyType1 = '';// 物业1类型
				$CL.wyNo1 = '';// 物业1编号
				$CL.wyStatus1 = '';// 物业1状态
				$CL.wyCount = 0;// 物业数量
				$CL.loanMoney = '';// 贷款金额
				$CL.loanTime = '';// 贷款期限
				$CL.paymentMethod = '';// 还款方式
				$CL.loanUse = '';// 贷款用途
				$CL.loanUseOther = '';
				$CL.country = '';//国籍
				$CL.huji = '';//hu籍
				commonJson.isCustermerInfoMultiplex = false;// /
				$CL.peiIcInfo.isPeiRead = false;
				$CL.peiIcInfo.isReadCardSucc = false;
				$CL.loanLimit = '';
				$CL.client_no = '';
				$CL.acctNo = '';
				$CL.acctType = '';
				$CL.oiSrc = '';//家庭其他收入来源
				$CL.oiAmt = '';//家庭其他月收入
				$CL.dwellYear = '';
				$CL.eduExp = '';
				$CL.cuzgxw = '';
				$CL.industry = '';
				$CL.position = '';
				$CL.peiOffice = '';
				$CL.dwellingStatus = '';
				$CL.polwhcjg = '';
				$CL.polwhcjg2 = '';
				$CL.polwhcFlag = '';
				$CL.polwhcFlag2 = '';
				$CL.SCORE_CARD_PATH = '';
				$CL.APPLY_TABLE_PATH = '';
				$CL.isLoanValue = '0';
				$CL.isScoreValue = '0';
				$CL.isLoanPeiValue = '0';
				$CL.SCORE_CARD_ID = '';
			}else if(pageName == "creditLoan-cusInfo"){
				$CL.country = 'CHN';
				var html = $CL.dat.createOptionHtml(certTypeImaging,false);
				$('#creditLoan-peiCerType').html(html).selectmenu('refresh', true);
				html = $CL.dat.createOptionHtml(_occupListObj,true);
				$('#creditLoan-occup').html(html).selectmenu('refresh', true);
				html = $CL.dat.createOptionHtml(_officeListObj,false);
				$('#creditLoan-office').html(html).selectmenu('refresh', true);
				html = $CL.dat.createOptionHtml(_officeListObj,true);
				$('#creditLoan-peiOffice').html(html).selectmenu('refresh', true);
				html = $CL.dat.createOptionHtml(_marriageListObj,true);
				$('#creditLoan-marriage').html(html).selectmenu('refresh', true);
//				html = $CL.dat.createOptionHtml(_wyType,true);
//				$('#creditLoan-wyType').html(html).selectmenu('refresh', true);
//				$('#creditLoan-wyType1').html(html).selectmenu('refresh', true);
				html = $CL.dat.createOptionHtml(_wyDyStatus,true);
				$('#creditLoan-wyStatus').html(html).selectmenu('refresh', true);
				$('#creditLoan-wyStatus1').html(html).selectmenu('refresh', true);
				html = $CL.dat.createOptionHtml(_paymentMethod,false);
				$('#creditLoan-paymentMethod').html(html).selectmenu('refresh', true);
				$("#creditLoan-office").val('3').selectmenu('refresh');
				$("#creditLoan-peiOffice").val('').selectmenu('refresh');
				$('#creditLoan-paymentMethod').val('1').selectmenu('refresh');
				html = $CL.dat.createOptionHtml(_eduExp,false);
				$('#creditLoan-eduExp').html(html).selectmenu('refresh', true);
				$("#creditLoan-eduExp").val('20').selectmenu('refresh');
//				html = $CL.dat.createOptionHtml(_cuzgxw,false);
//				$('#creditLoan-cuzgxw').html(html).selectmenu('refresh', true);
//				$("#creditLoan-cuzgxw").val('99').selectmenu('refresh');
				html = $CL.dat.createOptionHtml(_industry,false);
				$('#creditLoan-industry').html(html).selectmenu('refresh', true);
				$("#creditLoan-industry").val('C').selectmenu('refresh');
//				html = $CL.dat.createOptionHtml(_position,false);
//				$('#creditLoan-position').html(html).selectmenu('refresh', true);
				html = $CL.dat.createOptionHtml(_dwellingStatus,false);
				$('#creditLoan-dwellingStatus').html(html).selectmenu('refresh', true);
				$("#creditLoan-dwellingStatus").val('5').selectmenu('refresh');
				html = $CL.dat.createOptionHtml(_oIncomeSrc,true);
				$('#creditLoan-oiSrc').html(html).selectmenu('refresh', true);
				html = $CL.dat.createOptionHtml(_loanUsage,true);
				$('#creditLoan-loanUse').html(html).selectmenu('refresh', true);
			}
		},
		getSql:function(pageName,obj,index){//获取本地数据库执行sql，getCreditLoanLocalDBSql
			var sql='';
			if(pageName == "creditLoan-product"){// 贷款产品查询
				sql = "SELECT * FROM productdisplay_info WHERE PRO_TYPE = 'creditLoan' and REMARK8 = '0' order by CAST(REMARK1 AS int) asc";
			}else if(pageName == "creditLoan-product@delete"){
				sql = {
						"databaseName": "myDatabase", // 数据库名
		                "tableName": "productdisplay_info", // 表名
		                "conditions": [{"PRO_TYPE": 'creditLoan'}]
				};
			}else if(pageName == "creditLoan-cusPicture@queryPic"){
				sql = "SELECT * FROM productdisplay_info WHERE PRO_TYPE = 'creditLoan' and REMARK8 = '1' and REMARK7 = '"+$CL.applicationObj.proType+"' and PRODCODE = '"+$CL.applicationObj.proCODE+"' order by CAST(REMARK1 AS int) asc";
			}else if(pageName == "creditLoan-product@insert"){
				sql = {
						"databaseName" : "myDatabase",
						"tableName" : "productdisplay_info",
						"data" : [ {
							"PRO_TYPE": 'creditLoan',
							"PRONAME": obj.proName,
							"proRemark1": obj.remark,
							"pro_description": obj.description,
				            "PRO_ATTACH": obj.attach,
				            "PRODCODE": obj.proCode,
							"REMARK1": obj.seqNum,
							"REMARK2": obj.maxAmount,
							"REMARK3": obj.minAmount,
							"REMARK4": obj.maxTerms,
							"REMARK5": obj.minTerms,
							"REMARK6": obj.scoreCardNo,
							"REMARK7": obj.proType,
							"REMARK8": '0'
						// 营销产品
						} ]
					};
			}else if(pageName == "creditLoan-product@insertExt"){
				var code = '';
				var type = '';
				var temStr = index.split('@#@');
				if(temStr.length > 1){
					code = temStr[0];
					type = temStr[1];
				}else{
					code = index;
					type = '';
				}
				sql = {
						"databaseName" : "myDatabase",
						"tableName" : "productdisplay_info",
						"data" : [ {
							"PRO_TYPE": 'creditLoan',
				            "PRODCODE": code,
							"REMARK1": obj.seqNum,
							"REMARK2": obj.certName,
							"REMARK3": obj.optionValue,
							"REMARK4": obj.picName,
							"REMARK5": obj.fileType,
							"REMARK7": type,
							"REMARK8": '1'
						// 营销产品
						} ]
					};
			}else if(pageName == "creditLoan-cusPicture"){//影像数据暂存数据库
				sql = {
						"databaseName": "myDatabase",
				        "tableName": "loanapply_info",
				        "data": [{
				            'proCODE': $CL.applicationObj.proCODE,  //产品代买
				            'proType': $CL.applicationObj.proType,//$CL.applyTo,
				            'mCLIENT_NO': $CL.client_no,    //客户号
				            'BUSINESSTYPE': '申请信用贷款',//
				            'TEMPFROM': pageName+".html",
				            'YWXS': $CL.proName,//业务线索
				            'SUBMITTIME': myTime.CurTime(),
				            'isPicturePage': $CL.isPicturePage,
				            'mCheckResult': lianwanghechaData.CheckResult, //联网核查
				            //基础的
				            'mfaceRecogn': $CL.faceRecogn,//影像对比结果
				            'offlineOnline': commonJson.offlineOnline,//脱机/联机
				            'workAddress': commonJson.workAddress,//工作地址
				            'moduleId': $CL.moduleId, //模块编号
				            'tranId': $CL.tranId, //交易编号
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
				            "mcustFacePic": $CL.applicationObj.cusFacePic, //客户面部照片
				            "mcustAndCustOwnerPic": $CL.applicationObj.custAndCustOwnerPic, //与客户合影照片
				            "mfrontIDCardPic": $CL.applicationObj.frontIDCardMPic, //身份证正面
				            "mbackIDCardPic": $CL.applicationObj.backIDCardMPic, //身份证反面
				            "mpicFileARR": $CL.applicationObj.mPicFileARR.join("&&"), //要打包的影像路径
				            "mpicFileInfoARR": JSON.stringify($CL.applicationObj.mPicFileInfoARR), //每个图片的名称和类型
				            "mpicFileMsgType": $CL.applicationObj.mPicFileMsgType.join("&&"), //其他图片对象的证明类型
				            "mcheckPhoto": $CL.applicationObj.lianPic, //联网核查图片

				            'REMARK1': commonJson.longitude,//经度
				            'REMARK2': commonJson.latitude,//纬度
				            'REMARK25': ''+$CL.biPai,//纬度
				            'REMARK26': $CL.qtPicCode.join("&&"),//纬度
				            'REMARK27': $CL.qtPicName.join("&&"),//纬度
				            'REMARK3': $CL.loanLimit,//测试额度
				            'REMARK4': $CL.occup,//职业
				            'REMARK5': $CL.office,//职位
				            'REMARK6': $CL.income,//月收入
				            'REMARK7': $CL.marriage,//家庭状况
				            'REMARK8': $CL.loanMoney,//申请金额
				            'REMARK9': $CL.loanTime,//申请期限
				            'REMARK10': $CL.oiSrc,//申请期限
				            'REMARK11': $CL.oiAmt,//申请期限
				            'REMARK12': $CL.isScoreValue,//申请期限
				            'REMARK13': commonJson.isCustermerInfoMultiplex,//
				            'REMARK14': $CL.maxAmount,//申请期限
				            'REMARK15': $CL.minAmount,//申请期限
				            'REMARK16': $CL.maxTerms,//申请期限
				            'REMARK17': $CL.minTerms,//申请期限
				            'REMARK18': $CL.huji,//户籍
				            'REMARK19': $CL.scoreCardNo,//评分卡类型
				            'REMARK20': $CL.SCORE_CARD_ID//评分卡ID
				        }]	
				};
			}else if(pageName == "creditLoan-cusInfo"){//保存客户信息到数据库
				sql = {
						"databaseName" : "myDatabase",
						"tableName" : "loanapply_info",
						"data" : [ {
							'proCODE' : $CL.applicationObj.proCODE, // 产品代买
							'proType' : $CL.applicationObj.proType,
							'gisTrue' : creditJson.isPrev.LLDBisFromPrev, // 联网核查结果
							'mCLIENT_NO' : $CL.client_no, // 客户号
							'BUSINESSTYPE' : '申请信用贷款',//
							'TEMPFROM' : 'creditLoan-cusInfo.html',
							'YWXS' : $CL.proName,// 业务线索
							'SUBMITTIME' : myTime.CurTime(),
							'mCheckResult' : lianwanghechaData.CheckResult, // 联网核查
							'isPicturePage' : $CL.isPicturePage,
							// 基础的
							'mfaceRecogn' : $CL.faceRecogn,
							'offlineOnline' : commonJson.offlineOnline,// 脱机/联机
							'workAddress' : commonJson.workAddress,// 工作地址
							'moduleId' : $CL.moduleId, // 模块编号
							'tranId' : $CL.tranId, // 交易编号
							'operatorNo' : commonJson.adminCount, // 操作员
							'deviceNo' : commonJson.udId, // 设备编号
							'orgId' : commonJson.orgId,
							// 主身份证信息
							'mNation' : custermerInfo.nation, //
							'mcerNo' : custermerInfo.cerNO,
							'maddress' : custermerInfo.address,
							'mname' : custermerInfo.name,
							'mcerExpdDt' : custermerInfo.cerExpdDt,
							'mbirthday' : custermerInfo.birthday,
							'msex' : custermerInfo.sex,
							'missAuthority' : custermerInfo.issAuthority,
							'mimage' : custermerInfo.image,

							// 主影像
							"mcustFacePic" : $CL.applicationObj.cusFacePic, // 客户面部照片
							"mcustAndCustOwnerPic" : $CL.applicationObj.custAndCustOwnerPic, // 与客户合影照片
							"mfrontIDCardPic" : $CL.applicationObj.frontIDCardMPic, // 身份证正面
							"mbackIDCardPic" : $CL.applicationObj.backIDCardMPic, // 身份证反面
							"mpicFileARR" : $CL.applicationObj.mPicFileARR.join("&&"), // 要打包的影像路径
							"mpicFileInfoARR" : JSON
									.stringify($CL.applicationObj.mPicFileInfoARR), // 每个图片的名称和类型
							"mpicFileMsgType" : $CL.applicationObj.mPicFileMsgType
									.join("&&"), // 其他图片对象的证明类型
							"mcheckPhoto" : $CL.applicationObj.lianPic, // 联网核查图片

							// 输入的字段
							'maritalStatus' : $CL.marriage,// 家庭状况
							'dwellYear': $CL.dwellYear,//何时来本地
							'corporation' : $CL.company,
							'headship' : $CL.occup,// 职业
							'eduExp': $CL.eduExp,//最高学历
							'degree': $CL.cuzgxw,//最高学位
							'cellphone' : $CL.mobile,
							'homeTel' : $CL.telephone,
							'dwellingZip' : $CL.zipcode,
							'mailingAddr' : $CL.s_city ? ($CL.s_city + $CL.s_county + $CL.addrDetail) : $CL.addrDetail,// 居住地址

							'income' : $CL.income,// 月收入
							'accountArr': JSON.stringify($CL.accountArr),

							'consortCellphone' : $CL.peiPhone,// 配偶电话
							'consortIncome' : $CL.peiIncome,// 配偶月收入
							'peiHeadship' : $CL.peiCompany, // 配偶工作单位
							'gcerNo' : $CL.peiCerNo,// 配偶证件号码
							'gname' : $CL.peiName,// 配偶名称
							'gissAuthority' : $CL.peiOffice, //配偶职务
							'dwellingStatus': $CL.dwellingStatus,//居住状况
							'support': $CL.oiSrc,//家庭其他收入来源
							'debtBalance': $CL.oiAmt,//家庭其他月收入
							'buildingFuMoney' : $CL.loanMoney,// 借款金额
							'buildingFuTime' : $CL.loanTime,// 借款期限
							'buildingType' : $CL.paymentMethod,// 还款方式
							'buildingExplain' : $CL.loanUse,// 还款计划说明

							'uploadTime' : '', // 本地上传时间
							'country' : $CL.country,// 国籍

							'industry' : $CL.office,// 职务
							'manager' : $CL.industry,//行业
							'position': $CL.position,//职称
							
							'hadHouseArea' : $CL.addrCode,// 地区名称
							'buildingAddr' : $CL.addrName,// 签发地区
							'REMARK1' : commonJson.longitude,// 经度
							'REMARK2' : commonJson.latitude,// 纬度

							'REMARK13' : commonJson.isCustermerInfoMultiplex,//
							'REMARK8' : $CL.addrAll,// 签发地区全部
							'REMARK9' : $CL.issPlace,// 签发地区判断用
							'REMARK10' : $CL.branchId,// jigouhao
							// 'REMARK5': $CL.canBuildCustomer,//是否新建小贷信息
							'REMARK3' : $CL.peiCerType,// 配偶证件类型
							'REMARK14' : $CL.wyType,// 
							'REMARK15' : $CL.wyNo,
							'REMARK16' : $CL.wyStatus,
							'REMARK17' : $CL.wyType1,
							'REMARK18' : $CL.wyNo1,
							'REMARK19' : $CL.wyStatus1,
							'accout': $CL.acctNo,//还款账号
				            'accoutType': $CL.acctType,//凭证类型
				            
				            'REMARK20' : JSON.stringify($CL.fillListArr),//对账单
				            'REMARK21' : JSON.stringify($CL.zhengxinArr),//征信报告
				            'REMARK22' : $CL.loanLimit,
				            'REMARK23' : $CL.polwhcjg,
				            'REMARK24' : $CL.polwhcFlag,
				            'REMARK25' : $CL.loanUseOther,
				            'REMARK26' : $CL.isLoanValue,
				            'REMARK27' : $CL.isScoreValue,
				            'REMARK28' : $CL.isLoanPeiValue,
				            'REMARK5' : $CL.maxAmount,
				            'REMARK6' : $CL.minAmount,
				            'REMARK7' : $CL.maxTerms,
				            'REMARK8' : $CL.minTerms,
				            'REMARK11' : $CL.huji,
				            'REMARK12' : $CL.scoreCardNo,
				            'REMARK4' : $CL.SCORE_CARD_ID
						} ]
				}
			}else if(pageName == 'creditLoan-cusConfirm@file'){
				var sql = {
						'databaseName' : 'myDatabase',
						'tableName' : 'up_download_info',
						'data' : [ {
							'fileToken' : smallLoan.phoneTime,// 文件唯一ID(可以为时间挫
							'pos' : '0',// 文件的断点信息(初始为0)
							'filePath' : obj,// 文件路径
							'appPath' : 'tl001',// 自定义文件路径
							'appBuss' : index,// 业务参数
							'downloadToken' : '',// 文件的下载ID(初始为空)
							'leng' : '1',// 文件的长度(初始为1)
							'isNotice' : 'yes', // 是否调用后台(一直是yes)
							"fileType" : '0',
							'REMARK1' : '01'
						} ]
					};
			}else if(pageName == 'creditLoan-cusConfirm@fileSign'){
				var sql = {
						"databaseName" : "myDatabase",
						"tableName" : "up_download_info",
						"data" : [ {
							"fileToken" : smallLoan.signTime, // 文件唯一ID(可以为时间挫
							"pos" : "0", // 文件的断点信息(初始为0)
							"filePath" : obj, // 文件路径
							"appPath" : "tl002", // 自定义文件路径
							"appBuss" : index, // 业务参数
							"downloadToken" : "", // 文件的下载ID(初始为空)
							"leng" : "1", // 文件的长度(初始为1)
							"isNotice" : "yes", // 是否调用后台(一直是yes)
							"fileType" : "1",
							'REMARK1' : '01'
						} ]
					};
			}else if(pageName == 'creditLoan-cusConfirm@uinfo'){
				var sql = {
                        "databaseName": "myDatabase",
                        "tableName": "customer_info",
                        "data": [{
                            "ADMINCOUNT": commonJson.adminCount,//登陆账号
                            "SUBMITTIME": myTime.CurTime(),//提交时间
                            "BUSINESSTYPE": "申请小微贷款",//业务类型
                            "NATION": custermerInfo.nation,//民族
                            "CERTNUM": custermerInfo.cerNO,//身份证号码
                            "ADDRESS": custermerInfo.address,//地址
                            "MASCARDNAME": custermerInfo.name,//姓名
                            "CERTVALIDDATE": custermerInfo.cerExpdDt,//有效日期
                            "BIRTH": custermerInfo.birthday,//出生日期
                            "SEX": custermerInfo.sex,//性别
                            "ISSAUTHORITY": custermerInfo.issAuthority,//签发机关
                            "IMAGE": custermerInfo.image,//身份证头像图片
                            "CUSTANDCUSTOWNERPIC": smallLoan.applicationObj.mPicFileARR[1],//与客户合影照片
                            "FRONTIDCARDPIC": smallLoan.applicationObj.mPicFileARR[2],//身份证正面
                            "BACKIDCARDPIC": smallLoan.applicationObj.mPicFileARR[3],//身份证反面
                            "checkPhoto": smallLoan.mInfo.lianPic //联网核查图片
                        }]
					};
			}else if(pageName == 'creditLoan-cusConfirm@dzdwj'){
				var sql = {
						"databaseName": "myDatabase",
		                "tableName": "loandownload_info",
		                "data": [{
		                    "name": $CL.queryFileObj.name,
		                    "cerType": $CL.queryFileObj.cerType,
		                    "cerNO": '' + $CL.queryFileObj.cerNO,
		                    "fileName": obj.fileName,
		                    "filePath": obj.filePath,
		                    "fileType": $CL.queryFileObj.fileType,
		                    "seqNum": obj.seqNum,
		                    "netFilePath": $CL.creditReferPath,
		                    "fileTime": obj.inquiryDate,
		                    "sqFilePath": obj.sqFilePath,
		                    "insertTime": myTime.CurTime()
		                }]
					};
			}else if(pageName == 'creditLoan-cusConfirm@cfile'){
				var sql = {
	                    'databaseName': 'myDatabase',
	                    'tableName': 'up_download_info',
	                    'data': [{
	                        'fileToken': $CL.phoneTime,//文件唯一ID(可以为时间挫
	                        'pos': '0',//文件的断点信息(初始为0)
	                        'filePath': obj,//文件路径
	                        'appPath': 'cl001',//自定义文件路径
	                        'appBuss': JSON.stringify($CL.dat.getAppBus('creditLoan-cusConfirm@cfile')),//业务参数
	                        'downloadToken': '',//文件的下载ID(初始为空)
	                        'leng': '1',//文件的长度(初始为1)
	                        'isNotice': 'yes', //是否调用后台(一直是yes)
	                        "fileType": '3',
	                        "REMARK1": "01" //上传状态01-默认
	                    }]
	                };
			}else if(pageName == 'creditLoan-cusConfirm@applyfile'){
				var sql = {
	                    'databaseName': 'myDatabase',
	                    'tableName': 'up_download_info',
	                    'data': [{
	                        'fileToken': $CL.applyTime,//文件唯一ID(可以为时间挫
	                        'pos': '0',//文件的断点信息(初始为0)
	                        'filePath': obj,//文件路径
	                        'appPath': 'cl001',//自定义文件路径
	                        'appBuss': JSON.stringify($CL.dat.getAppBus('creditLoan-cusConfirm@applyfile')),//业务参数
	                        'downloadToken': '',//文件的下载ID(初始为空)
	                        'leng': '1',//文件的长度(初始为1)
	                        'isNotice': 'yes', //是否调用后台(一直是yes)
	                        "fileType": '4',
	                        "REMARK1": "01" //上传状态01-默认
	                    }]
	                };
			}else if(pageName == 'creditLoan-cusConfirm@signfile'){
				var sql = {
	                    'databaseName': 'myDatabase',
	                    'tableName': 'up_download_info',
	                    'data': [{
	                        'fileToken': $CL.signTime,//文件唯一ID(可以为时间挫
	                        'pos': '0',//文件的断点信息(初始为0)
	                        'filePath': obj,//文件路径
	                        'appPath': 'cl002',//自定义文件路径
	                        'appBuss': JSON.stringify($CL.dat.getAppBus('creditLoan-cusConfirm@signfile')),//业务参数
	                        'downloadToken': '',//文件的下载ID(初始为空)
	                        'leng': '1',//文件的长度(初始为1)
	                        'isNotice': 'yes', //是否调用后台(一直是yes)
	                        "fileType": '1',
	                        "REMARK1": "01" //上传状态01-默认
	                    }]
	                };
			}
			return sql;
		},
		getReqJson:function(pageName,obj){//getCreditLoanRequestJson
			var requestJson = '';
			if(pageName == "creditLoan-product"){// 贷款产品查询
				requestJson = {
						"b" : [ {
							"deviceNo.s" : commonJson.udId, // 设备编号
							"moduleId.s" : $CL.moduleId, // 模块编号
							"tranId.s" : $CL.tranId, // 交易编号
							"orgId.s" : commonJson.orgId,// 机构号
							"operatorNo.s" : commonJson.adminCount,// 操作员
							"offlineOnline.s" : commonJson.offlineOnline,// 脱机/联机
							"workAddress.s" : commonJson.workAddress
						// 工作地址
						} ]
				};
			}else if(pageName == "creditLoan-read@lwhc"){// 省份证联网核查
				requestJson = {
						"b" : [ {
							"offlineOnline.s" : commonJson.offlineOnline,// 脱机/联机
							"workAddress.s" : commonJson.workAddress,// 工作地址
							"moduleId.s" : $CL.moduleId, // 模块编号
							"tranId.s" : $CL.tranId, // 交易编号
							"operatorNo.s" : commonJson.adminCount, // 操作员
							"deviceNo.s" : commonJson.udId, // 设备编号
							"orgId.s" : commonJson.orgId,
							"DOCUMENT_TYPE.s" : "0", // 证件类型
							"DOCUMENT_ID.s" : custermerInfo.cerNO, // 身份证号码
							"CLIENT_NAME.s" : custermerInfo.name, // 被核对人姓名
							// "NAME12223964",//
							"BUSSINESSCODE.s" : "02", // 业务总类
							"BRANCH_ID.s" : commonJson.orgId
						// 机构号
						} ]
				};
			}else if(pageName == "creditLoan-read@polwhc"){// 省份证联网核查
				requestJson = {
						"b" : [ {
							"offlineOnline.s" : commonJson.offlineOnline,// 脱机/联机
							"workAddress.s" : commonJson.workAddress,// 工作地址
							"moduleId.s" : $CL.moduleId, // 模块编号
							"tranId.s" : $CL.tranId, // 交易编号
							"operatorNo.s" : commonJson.adminCount, // 操作员
							"deviceNo.s" : commonJson.udId, // 设备编号
							"orgId.s" : commonJson.orgId,
							"DOCUMENT_TYPE.s" : "0", // 证件类型
							"DOCUMENT_ID.s" : $CL.peiCerNo, // 身份证号码
							"CLIENT_NAME.s" : $CL.peiName, // 被核对人姓名
							// "NAME12223964",//
							"BUSSINESSCODE.s" : "02", // 业务总类
							"BRANCH_ID.s" : commonJson.orgId
						// 机构号
						} ]
				};
			}else if(pageName == "creditLoan-read@khcx"){// 客户信息查询
				requestJson = {
						"b" : [ {
							"offlineOnline.s" : commonJson.offlineOnline,// 脱机/联机
							"workAddress.s" : commonJson.workAddress,// 工作地址
							"moduleId.s" : $CL.moduleId, // 模块编号 4
							"tranId.s" : $CL.tranId, // 交易编号 2
							"operatorNo.s" : commonJson.adminCount, // 操作员 admin
							"deviceNo.s" : commonJson.udId, // 设备编号 ""
							"orgId.s" : commonJson.orgId,
							"CLIENT_TYPE.s" : "P", // 客户类型 N组织 P个人
							"CARD.s" : "", // 卡号
							"ACCT_NO.s" : "", // 账号
							"CLIENT_NO.s" : "", // 客户号
							"DOC_TYPE.s" : "0", // 证件类型
							"DOC_ID.s" : custermerInfo.cerNO, // 证件号
							"CLIENT_SHORT.s" : "", // 简称
							"BIRTH_DATE.s" : "", // 出生日
							"CELL_PHONE.s" : "", // 手机
							"PHONE.s" : "", // 住宅电话
							"LEGAL_REP.s" : "", // 法人代表
							"REVERSE_FLAG.s" : "D" // 证件号内部检查标志 默认D
						} ]
				};
			}else if(pageName == "creditLoan-personFace"){// 人脸对比查询
				requestJson = {
						"b": [{
				            "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				            "workAddress.s": commonJson.workAddress, //工作地址
				            "orgId.s": commonJson.orgId,//机构号
				            "moduleId.s": obj.moduleId, //模块编号
				            "tranId.s": obj.tranId, //交易编号
				            "operatorNo.s": commonJson.adminCount, //操作员
				            "deviceNo.s": commonJson.udId, //设备编号
				            "OPERATOR_NO.s": commonJson.adminCount, //业务经办人工号
				            "TRANS_SCENE.s": "0001", //交易场景
				            "COMPARE_TYPE.s": "2", //    比对类型1-客户经理比对，2-客户比对
				            "WS_TYPE.s": "2", // 终端类型1-PC，2-IOS，3-Android
				            "WSNO.s": commonJson.udId, //    终端号
				            "VERSION.s": "v1.1.4", //当前控件版本
				            "TRANS_CHANNEL.s": "301", //   渠道301
				            "ID_CARD.s": '',// 身份证号码
				            "IMG_BASE.s": '',//      现场照片
				            "CRYPT_TYPE.s": "0", //   图像是否经过加密0-未加密，1-加密方式一，2加密方式二
				            "ID_IMG_BASE.s": $(".camera:eq(3)").attr('src'), //联网核查照片
				            "CARD_IMG_BASE.s": '', //  芯片照片
				            "BUSI_TYPE.s": "03" //

				        }]
				};
			}else if(pageName == "creditLoan-cusInfo@khcx"){//客户信息查询
				requestJson = {
						"b" : [ {
							"offlineOnline.s" : commonJson.offlineOnline,// 脱机/联机
							"workAddress.s" : commonJson.workAddress,// 工作地址
							"orgId.s" : commonJson.orgId,// 机构号
							"moduleId.s" : $CL.moduleId,// 模块编号
							"tranId.s" : $CL.tranId,// 交易编号
							"operatorNo.s" : commonJson.adminCount,// 操作员
							"deviceNo.s" : commonJson.udId,// 设备编号
							"IDTYPE.s" : "0",// 证件类型
							"IDNO.s" : custermerInfo.cerNO,// 证件号
							'CLIENT_TYPE.s' : 'P',
							'CLIENT_NO.s' : $CL.CLIENT_NO
						} ]
				};
			}else if(pageName == "creditLoan-cusInfo@qfdq"){//签发地区联动查询
				requestJson = {
						"b" : [ {
							"offlineOnline.s" : commonJson.offlineOnline,// 脱机/联机
							"workAddress.s" : commonJson.workAddress,// 工作地址
							"orgId.s" : commonJson.orgId,// 机构号
							"moduleId.s" : $CL.moduleId,// 模块编号
							"tranId.s" : $CL.tranId,// 交易编号
							"operatorNo.s" : commonJson.adminCount,// 操作员
							"deviceNo.s" : commonJson.udId,// 设备编号
							"DOCUMENT_TYPE.s" : "0",// 证件类型
							"CITY.s" : obj,
							"CLIENT_NAME.s" : custermerInfo.name,
							"DOCUMENT_ID.s" : custermerInfo.cerNO
						} ]
				};
			}else if(pageName == "creditLoan-cusInfo@dzdcx" || pageName == "creditLoan-cusConfirm@dzdcx"){
				if($CL.isSimulate2){
					requestJson = {
							"b" : [ {
								"deviceNo.s" : commonJson.udId, // 设备编号
								"moduleId.s" : $CL.moduleId, // 模块编号
								"tranId.s" : $CL.tranId, // 交易编号
								"orgId.s" : commonJson.orgId,// 机构号
								"operatorNo.s" : commonJson.adminCount,// 操作员
								"offlineOnline.s" : commonJson.offlineOnline,// 脱机/联机
								"workAddress.s" : commonJson.workAddress,// 工作地址
								"inquiryDateMin.s" : '',// dateYYYYMMDD(dateGetYMD(10)[1]),
								// //查询日期时间
								"inquiryDateMax.s" : '',// dateYYYYMMDD(dateGetYMD(10)[0]),
								// //查询日期时间
								"name.s" : '老王',//custermerInfo.name,// 姓名
								"certNum.s" : '440306198805040863',//custermerInfo.cerNO,// 证件号码
								"account.s" : '',// 账号
								"status.s" : '1',// 状态
								"page.s" : ''// 页码
							} ]
					};
				}else{
					requestJson = {
							"b" : [ {
								"deviceNo.s" : commonJson.udId, // 设备编号
								"moduleId.s" : $CL.moduleId, // 模块编号
								"tranId.s" : $CL.tranId, // 交易编号
								"orgId.s" : commonJson.orgId,// 机构号
								"operatorNo.s" : commonJson.adminCount,// 操作员
								"offlineOnline.s" : commonJson.offlineOnline,// 脱机/联机
								"workAddress.s" : commonJson.workAddress,// 工作地址
								"inquiryDateMin.s" : '',// dateYYYYMMDD(dateGetYMD(10)[1]),
								// //查询日期时间
								"inquiryDateMax.s" : '',// dateYYYYMMDD(dateGetYMD(10)[0]),
								// //查询日期时间
								"name.s" : custermerInfo.name,// 姓名
								"certNum.s" : custermerInfo.cerNO,// 证件号码
								"account.s" : '',// 账号
								"status.s" : '1',// 状态
								"page.s" : ''// 页码
							} ]
					};
				}
			}else if(pageName == "creditLoan-cusConfirm@submit"){
				var loanUsage = '';
				if($CL.loanUse && $CL.loanUse != '2'){
					loanUsage = _loanUsage[$CL.loanUse];
				}else if($CL.loanUseOther){
					loanUsage = $CL.loanUseOther;
				}
				var expDate = custermerInfo.cerExpdDt;
				var expDateAry = expDate.split('-');
				if(expDateAry.length > 1){
					expDate = expDateAry[1];
					var expDateArys = expDate.split('.');
					var temp = '';
					for(var i=0;i<expDateArys.length;i++){
						temp += expDateArys[i];
					}
					expDate = temp;
				}
				var dwellYear = $CL.dwellYear;
				var dwellYearAry = dwellYear.split('-');
				if(dwellYearAry.length > 1){
					dwellYear = dwellYearAry[0];
				}
				$CL.creditArr = [];
		        if ($CL.zhengxinArr && $CL.zhengxinArr.length > 0) {  //征信文件  征信授权书
		        	$.each($CL.zhengxinArr, function (index, data) {
		        		if(data.creditReferPath) {
							$.each(data.creditReferPath.split(';'), function(index, path) {
								$CL.creditArr.push(path);
							});
						}
			            if(data.accredit){
			                $CL.creditArr.push(data.accredit);
			            }
			        });
		        }
				var requestJson = {
				        "b": [{
				        	"deviceNo.s": commonJson.udId, //设备编号
				        	"moduleId.s": $CL.moduleId, //模块编号
				        	"tranId.s": $CL.tranId, //交易编号
				        	"orgId.s": commonJson.orgId, //机构号
				        	"operatorNo.s": commonJson.adminCount, //操作员
				        	"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				        	"workAddress.s": commonJson.workAddress, //工作地址
				        	"longitude.s": commonJson.longitude,//经度
				            "latitude.s": commonJson.latitude,//纬度
				            "platGlobalSeq.s": $CL.platGlobalSeq,//流水号
				            "clientNo.s": $CL.client_no,//客户号
				            "country.s": 'CHN',//国籍
				        	"CERTTYPE.s": '0', //证件类型
				        	"CERTID.s": custermerInfo.cerNO, //证件号码
				        	'name.s': custermerInfo.name,
				        	'nativePlace.s': custermerInfo.address,//户籍地址
				        	'sex.s':loanSexJson[custermerInfo.sex], //XINGBIE
				        	'dwellingAddr.s': $CL.addrDetail,//家庭住址
				        	'dwellingZip.s': $CL.zipcode,//邮编
				        	'corporation.s': $CL.company,//工作单位
				        	'maritalStatus.s': $CL.marriage,//婚姻状况
				        	'dwellingStatus.s': $CL.dwellingStatus,//家庭状况
				        	'industry.s': $CL.industry,//行业
				        	'occupation.s': $CL.occup,//职业
				        	'headship.s': $CL.office,//职务
				        	'position.s': $CL.position,//职位
				        	'income.s': $CL.incomeX,//月收入
				        	'consortName.s': $CL.peiName,//配偶
				        	'consortCertType.s': $CL.peiCerType,//配偶证件类型
				        	'consortCertId.s': $CL.peiCerNo,//配偶证件号码
				        	'consortCellphone.s': $CL.peiPhone,//配偶电话号码
				        	'consortHeadship.s': $CL.peiOffice,//配偶职务
				        	'consortIncome.s': $CL.peiIncomeX,//配偶月收入
				        	'mailingAddr.s': $CL.addrDetail,//通讯地址
				        	'homeTel.s': '',//家庭电话
				        	'cellphone.s': $CL.mobile,//手机号吗
				        	'customerManager.s': commonJson.losUserId,//客户经理
				        	"SCORE_CARD_ID.s": $CL.SCORE_CARD_ID || '', //评分卡记录ID
				        	"BUSINESSTYPE.s": $CL.applicationObj.proType, //业务品种
				        	"MARKETPRODUCT.s": $CL.applicationObj.proCODE, //营销产品
				        	"BUSINESSSUM.s": $CL.loanMoneyX, //贷款金额
				        	"TERMMONTH.s": $CL.loanTime, //贷款期限
				        	"SUB_AMOUNT_PAYCYC.s": $CL.paymentMethod, //还款方式
				        	"SUB_AMOUNT_PURPOSE.s": loanUsage, //用途
				        	"FILE_LIST.s": JSON.stringify($CL.fillListArr), //申请类文件
				        	"CUSTOMER_FILE_LIST.s": JSON.stringify($CL.creditArr), //客户类文件
				        	"houseInfo.s": JSON.stringify($CL.houseArr), //物业信息
				        	"FILE_COUNT.s": '3',
				        	"platGlobalSeq.s": $CL.platGlobalSeq,
				        	"CheckResult.s": lianwanghechaData.CheckResult, //身份证联网核查结果
				            "faceRecogn.s": $CL.faceRecogn,//
				            "REPAYMENTACCOUNTNO.s": $CL.acctNo,//还款账号
				            "workTel.s": $CL.telephone,//单位电话
				            "eduExperience.s": $CL.eduExp,//最高学历
				            "eduDegree.s": $CL.cuzgxw,//最高学位
				            "addressbeginYear.s": dwellYear,//何时来本地
				            "consortCorporation.s": $CL.peiCompany,//配偶单位
				            "homeOthersIncome.s": $CL.oiSrc,//家庭其他收入来源
				            "othersMonthIncome.s": $CL.oiAmtX,//家庭其他月收入
				            "signature.s": $CL.signHref,//签名文件
				            "proName.s": $CL.proName,//产品名称
				            "censusRegister.s": $CL.huji,//户籍
				            "EXPIRY_DATE.s": expDate//证件到期日
				        }]
				    };
			}else if(pageName == 'creditLoan-cusConfirm@getFile'){
				var requestJson = {
						"b": [{
				            "offlineOnline.s": commonJson.offlineOnline, //脱机/联机
				            "workAddress.s": commonJson.workAddress, //工作地址
				            "orgId.s": commonJson.orgId, //机构号
				            "moduleId.s": $CL.moduleId,//creditJson.moduleID, //模块编号
				            "tranId.s": $CL.tranId, //交易编号
				            "operatorNo.s": commonJson.adminCount, //操作员commonJson.adminCount
				            "deviceNo.s": commonJson.udId, //设备编号
				            "offOnline.s": commonJson.offlineOnline, //脱机/联机
				            "filePath.s": obj //附件路径
				        }]
				};
			}else if(pageName == 'creditLoan-testLimit@queryItem'){
				if($CL.isSimulate2){
					requestJson = {
							"b" : [ {
								"deviceNo.s" : commonJson.udId, // 设备编号
								"moduleId.s" : $CL.moduleId, // 模块编号
								"tranId.s" : $CL.tranId, // 交易编号
								"orgId.s" : '00212',//commonJson.orgId,// 机构号
								"operatorNo.s" : commonJson.adminCount,// 操作员
								"offlineOnline.s" : commonJson.offlineOnline,// 脱机/联机
								"workAddress.s" : commonJson.workAddress,
								"SCORE_CARD_NO.s" : $CL.scoreCardNo,
								"CUSTNAME.s" : '陈风帆',//custermerInfo.name,
								"CERTTYPE.s" : "0",// 证件类型
								"CERTID.s" : '360425199104044916',//custermerInfo.cerNO,
								"SCORE_CARD_ID.s" : ""
							} ]
					};
				}else{
					requestJson = {
							"b" : [ {
								"deviceNo.s" : commonJson.udId, // 设备编号
								"moduleId.s" : $CL.moduleId, // 模块编号
								"tranId.s" : $CL.tranId, // 交易编号
								"orgId.s" : commonJson.orgId,// 机构号
								"operatorNo.s" : commonJson.adminCount,// 操作员
								"offlineOnline.s" : commonJson.offlineOnline,// 脱机/联机
								"workAddress.s" : commonJson.workAddress,
								"SCORE_CARD_NO.s" : $CL.scoreCardNo,
								"CUSTNAME.s" : custermerInfo.name,
								"CERTTYPE.s" : "0",// 证件类型
								"CERTID.s" : custermerInfo.cerNO,
								"SCORE_CARD_ID.s" : ""
							} ]
					};
				}
			}else if(pageName == 'creditLoan-testLimit@testScore'){
				if($CL.isSimulate2){
					requestJson = {
							"b": [{
								"deviceNo.s": commonJson.udId, //设备编号
								"moduleId.s": $CL.moduleId, //模块编号
								"tranId.s": $CL.tranId, //交易编号
								"orgId.s": '00212',//commonJson.orgId, //机构号
								"operatorNo.s": commonJson.adminCount, //操作员
								"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
								"workAddress.s": commonJson.workAddress, //工作地址
								"SCORE_CARD_ID.s": $CL.SCORE_CARD_ID || '', //小贷评分卡记录ID
								"CUSTNAME.s": '陈风帆',//custermerInfo.name, //身份证上姓名
								"CERTTYPE.s": "0",
								"CERTID.s": '360425199104044916',//custermerInfo.cerNO, //身份证号码
								"SCORE_CARD_NO.s": $CL.scoreCardNo, //小微贷评分卡类型
								"IN_MAP.s": JSON.stringify(obj) //选择的答案
							}]
					};
				}else{
					requestJson = {
							"b": [{
								"deviceNo.s": commonJson.udId, //设备编号
								"moduleId.s": $CL.moduleId, //模块编号
								"tranId.s": $CL.tranId, //交易编号
								"orgId.s": commonJson.orgId, //机构号
								"operatorNo.s": commonJson.adminCount, //操作员
								"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
								"workAddress.s": commonJson.workAddress, //工作地址
								"SCORE_CARD_ID.s": $CL.SCORE_CARD_ID || '', //小贷评分卡记录ID
								"CUSTNAME.s": custermerInfo.name, //身份证上姓名
								"CERTTYPE.s": "0",
								"CERTID.s": custermerInfo.cerNO, //身份证号码
								"SCORE_CARD_NO.s": $CL.scoreCardNo, //小微贷评分卡类型
								"IN_MAP.s": JSON.stringify(obj) //选择的答案
							}]
					};
				}
			}else if(pageName == 'creditLoan-cusConfirm@CScorePdf'){
				requestJson = {
						"b": [{
							"deviceNo.s": commonJson.udId, //设备编号
							"moduleId.s": $CL.moduleId, //模块编号
							"tranId.s": $CL.tranId, //交易编号
							"orgId.s": commonJson.orgId, //机构号
							"operatorNo.s": commonJson.adminCount, //操作员
							"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
							"workAddress.s": commonJson.workAddress, //工作地址
							"scoreCardId.s": $CL.SCORE_CARD_ID || '', //小贷评分卡记录ID
							"customerName.s": custermerInfo.name, //身份证上姓名
							"prodSummary.s": $CL.proName,
							"CERTID.s": custermerInfo.cerNO,
							"occupation.s": $CL.occup
						}]
				};
			}else if(pageName == 'creditLoan-cusConfirm@creditReport'){
				if($CL.isSimulate2){
					requestJson = {
							"b": [{
								"deviceNo.s": commonJson.udId, //设备编号
								"moduleId.s": $CL.moduleId, //模块编号
								"tranId.s": $CL.tranId1, //交易编号
								"orgId.s": commonJson.orgId, //机构号
								"operatorNo.s": commonJson.adminCount, //操作员
								"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
								"workAddress.s": commonJson.workAddress, //工作地址
								"inquiryDateMin.s": dateYYYYMMDD(obj[1]), //申请日期开始
								"inquiryDateMax.s": dateYYYYMMDD(obj[0]), //申请日期结束
								"name.s": '朱雷',//custermerInfo.name, //姓名
								"certNum.s": '131082199111194115',//custermerInfo.cerNO, //证件号码
								"status.s": '1,3', //状态(成功和不需查询征信报告)
								"page.s": '', //页码
								"username.s": '',
								'creditType.s': '',	//征信类型
	            				'supplementInd.s': '' //是否允许补查
							}]
					};
				}else{
					requestJson = {
							"b": [{
								"deviceNo.s": commonJson.udId, //设备编号
								"moduleId.s": $CL.moduleId, //模块编号
								"tranId.s": $CL.tranId1, //交易编号
								"orgId.s": commonJson.orgId, //机构号
								"operatorNo.s": commonJson.adminCount, //操作员
								"offlineOnline.s": commonJson.offlineOnline, //脱机/联机
								"workAddress.s": commonJson.workAddress, //工作地址
								"inquiryDateMin.s": dateYYYYMMDD(obj[1]), //申请日期开始
								"inquiryDateMax.s": dateYYYYMMDD(obj[0]), //申请日期结束
								"name.s": custermerInfo.name, //姓名
								"certNum.s": custermerInfo.cerNO, //证件号码
								"status.s": '1,3', //状态(成功和不需查询征信报告)
								"page.s": '', //页码
								"username.s": '',
								'creditType.s': '',	//征信类型
	            				'supplementInd.s': '' //是否允许补查
							}]
					};
				}
			}else if(pageName == 'creditLoan-read@queryCoreInfo'){
				requestJson = {
						"b": [{
				            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
				            "workAddress.s": commonJson.workAddress,//工作地址
				            "moduleId.s": $CL.moduleId, //模块编号
							"tranId.s": $CL.tranId1, //交易编号
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
			}else if(pageName == 'creditLoan-read@queryCoreLevelInfo'){
				requestJson = {
						"b": [{
				            "deviceNo.s": commonJson.udId, //设备编号       ""
				            "moduleId.s": $CL.moduleId, //模块编号
							"tranId.s": $CL.tranId1, //交易编号
				            "orgId.s": commonJson.orgId,
				            "operatorNo.s": commonJson.adminCount, //操作员  admin
				            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
				            "workAddress.s": commonJson.workAddress,//工作地址
				            "proCode.s": $CL.applicationObj.proCODE,//产品编号
				            "proType.s": $CL.applicationObj.proType,//产品类型
				            "CLIENT_NO.s": $CL.client_no, //客户号
				            "CLIENT_TYPE.s": "P", //客户类型 N组织 P个人
				            "AGENT_FLAG.s": "1",//客户类型 N组织 P个人
				            "IDTYPE.s": "0",//证件类型
				            "IDNO.s": custermerInfo.cerNO,//证件号码
				            "customerName.s": custermerInfo.name//客户姓名
				        }]
				};
			}else if(pageName == 'creditLoan-read@queryLosInfo'){
				requestJson = {
						"b": [{
			                "deviceNo.s": commonJson.udId, //设备编号
			                "moduleId.s": $CL.moduleId, //模块编号
			                "tranId.s": $CL.tranId, //交易编号
			                "orgId.s": commonJson.orgId,//机构号
			                "operatorNo.s": commonJson.adminCount,//操作员
			                "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
			                "workAddress.s": commonJson.workAddress,//工作地址
			                "IDTYPE.s": '0',//证件类型
			                "IDNO.s": custermerInfo.cerNO,//证件号码
			                "CLIENT_TYPE.s": "P", //N单位 P个人
			                "CLIENT_NO.s": $CL.client_no, //客户号
			                "AGENT_FLAG.s": "" //法人代表
			            }]
				};
			} else if(pageName == 'creditLoan-read@queryAcctNo'){
				requestJson = {
						"b": [{
		                    "deviceNo.s": commonJson.udId, //设备编号
		                    "moduleId.s": $CL.moduleId, //模块编号
		                    "tranId.s": $CL.tranId, //交易编号
		                    "orgId.s": commonJson.orgId,//机构号
		                    "operatorNo.s": commonJson.adminCount,//操作员
		                    "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
		                    "workAddress.s": commonJson.workAddress,//工作地址
		                    "CLIENT_NO.s": $CL.client_no //客户号
		                }]
				};
			} else if(pageName == 'creditLoan-confirm@authMsg'){
				requestJson = {
				        "b": [{
				            "orgId.s": commonJson.orgId,
				            "moduleId.s": $CL.moduleId, //模块编号
				            "tranId.s": $CL.tranId, //交易编号
				            "operatorNo.s": commonJson.adminCount, //操作员
				            "deviceNo.s": commonJson.deviceNo, //设备编号
				            "SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
				            "USER_NO.s": $CL.USER_NO, //用户唯一标识
				            "EPay_PassType.s": "ST", //认证类型 ST短信  NT令牌
				            "MSG_INFO.s": $CL.msgInfo, //动态口令 取手工输入的值  //json.MSG_INFO, //动态口令
				            "Flags.s": "BBBB", //标记位
				            "MOBILE_NO.s": $CL.mobile, //手机号码debitEnter.tel
				            "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
				            "faceRecogn.s": $CL.faceRecogn //人脸识别状态
				        }]
				    };
			} else if(pageName == 'creditLoan-confirm@getSeq'){
				var requestJson = {
				        "b": [{
				            "deviceNo.s": commonJson.udId, //设备编号
				            "moduleId.s": $CL.moduleId, //模块编号
				            "tranId.s": $CL.tranId,//loan.tranId, //交易编号
				            "orgId.s": commonJson.orgId,//机构号
				            "operatorNo.s": commonJson.adminCount,//操作员
				            "offlineOnline.s": commonJson.offlineOnline,//脱机/联机
				            "workAddress.s": commonJson.workAddress,//工作地址
				            "CLIENT_NAME.s": custermerInfo.name,//客户姓名
				            "DOCUMENT_TYPE.s": '0',//证件类型
				            "DOCUMENT_ID.s": custermerInfo.cerNO//证件号码
				        }]
				    };
			}else if(pageName == 'creditLoan-confirm@getAuthCode'){
				var requestJson = {
				        "b": [{
				            "orgId.s": commonJson.orgId,
				            "moduleId.s": $CL.moduleId, //模块编号
				            "tranId.s": $CL.tranId, //交易编号
				            "operatorNo.s": commonJson.adminCount, //操作员
				            "deviceNo.s": commonJson.deviceNo, //设备编号
				            "SUSER_ID.s": commonJson.orgId + commonJson.adminCount, //机构号+柜员号
				            "Flags.s": "BBBB", //标记位
				            "MOBILE_NO.s": $CL.mobile, //手机号码debitEnter.tel
				            "REMARK_INFO.s": "1111111111111111111111111111111111111113", //备注
				            "faceRecogn.s": $CL.faceRecogn //人脸识别状态
				        }]
				};
			}
			return requestJson;
		},
		getAppBus:function(pageName){
			var appBus = '';
			if(pageName == 'creditLoan-cusConfirm@file'){
				var appBus = {
						'busiGloablaSeq': $CL.platGlobalSeq, //业务编号
						'attchType': '4', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
						'CUSTOMER_ID': '',//客户ID
						"OWNER": commonJson.tinyLoanUserId, //所属管理员标识符
						'FILE_LIST': '',
						'deviceNo': commonJson.udId, //设备编号
						'moduleId': $CL.moduleId, //模块编号
						'tranId': $CL.tranId, //交易编号
						'orgId': commonJson.orgId, //机构编号
						'operatorNo': commonJson.adminCount, //操作员
						'custName': custermerInfo.name, //客户名称
						'custCredType': '0', //客户证件类型
						'custCredNo': custermerInfo.cerNO, //客户证件号
						'offlineOnline': commonJson.offlineOnline, //脱机/联机
						'workAddress': commonJson.workAddress //工作地址
						//'FILE_ADD': creditJson.storage.picFileInfoARR[0].b, //每个图片的名称和类型
				};
				
			}else if(pageName == 'creditLoan-cusConfirm@fileSign'){
				var appBus = {
						'busiGloablaSeq' : smallLoan.platGlobalSeq, // 业务编号
						'attchType' : '1', // 文件操作（0:打包传DX
						// 1:不打包签名图片 2:其他）
						'deviceNo' : commonJson.deviceNo, // 设备编号
						'moduleId' : smallLoan.moduleId, // 模块编号
						'tranId' : smallLoan.tranId, // 交易编号
						'orgId' : commonJson.orgId, // 机构编号
						'operatorNo' : commonJson.adminCount, // 操作员
						'custName' : custermerInfo.name, // 客户名称
						'custCredType' : '0', // 客户证件类型
						'custCredNo' : custermerInfo.cerNO, // 客户证件号
						'offlineOnline' : commonJson.offlineOnline, // 脱机/联机
						'workAddress' : commonJson.workAddress
				};
			}else if(pageName == 'creditLoan-cusConfirm@fileUpdate'){
				var appBus = {
						'busiGloablaSeq': smallLoan.platGlobalSeq, //业务编号
		                'attchType': '4', //文件操作（0:打包传DX 1:不打包签名图片 2:其他）
		                'CUSTOMER_ID': smallLoan.customerId,//客户ID
		                "OWNER": commonJson.tinyLoanUserId, //所属管理员标识符
		                'FILE_LIST': smallLoan.appliform,
		                'deviceNo': commonJson.udId, //设备编号
		                'moduleId': smallLoan.moduleId, //模块编号
		                'tranId': smallLoan.tranId, //交易编号
		                'orgId': commonJson.orgId, //机构编号
		                'operatorNo': commonJson.adminCount, //操作员
		                'custName': custermerInfo.name, //客户名称
		                'custCredType': '0', //客户证件类型
		                'custCredNo': custermerInfo.cerNO, //客户证件号
		                'offlineOnline': commonJson.offlineOnline, //脱机/联机
		                'workAddress': commonJson.workAddress //工作地址
		                //'FILE_ADD': creditJson.storage.picFileInfoARR[0].b, //每个图片的名称和类型
				};
			}else if(pageName == 'creditLoan-cusConfirm@cfile'){
				var appBus = {
	                    'busiGloablaSeq': $CL.platGlobalSeq,//业务编号
	                    'TRADE_TYPE': '00005',//客户资料
	                    'APPLY_NO': '',//业务申请编号
	                    'CUSTOMER_NO': '',//客户流水号
	                    'attchType': '0',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
	                    'deviceNo': commonJson.udId,//设备编号
	                    'moduleId': $CL.moduleId,//模块编号
	                    'tranId': $CL.tranId,//交易编号
	                    'orgId': commonJson.orgId,//机构编号
	                    'operatorNo': commonJson.adminCount,//操作员
	                    'custName': custermerInfo.name,//客户名称
	                    'custCredType': '0',//客户证件类型
	                    'custCredNo': custermerInfo.cerNO,//客户证件号
	                    'offlineOnline': commonJson.offlineOnline,//脱机/联机
	                    'workAddress': commonJson.workAddress,//工作地址
	                    'userId': commonJson.losUserId,  //los用户
	                    'OPER_TYPE': 'ADD',//操作类型 add-->表示新增  mod-->表示修改
	                    'FILE_LIST': []//$CL.zhengxinArr  正信文件，授权证书
	                };
			}else if(pageName == 'creditLoan-cusConfirm@cfileUpdate'){
				var appBus = {
	                    'busiGloablaSeq': $CL.platGlobalSeq,//业务编号
	                    'TRADE_TYPE': '00005',//客户资料
	                    'APPLY_NO': $CL.APPLY_NO,//业务申请编号
	                    'CUSTOMER_NO': $CL.CUSTOMER_NO,//客户流水号
	                    'attchType': '0',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
	                    'deviceNo': commonJson.udId,//设备编号
	                    'moduleId': $CL.moduleId,//模块编号
	                    'tranId': $CL.tranId,//交易编号
	                    'orgId': commonJson.orgId,//机构编号
	                    'operatorNo': commonJson.adminCount,//操作员
	                    'custName': custermerInfo.name,//客户名称
	                    'custCredType': '0',//客户证件类型
	                    'custCredNo': custermerInfo.cerNO,//客户证件号
	                    'offlineOnline': commonJson.offlineOnline,//脱机/联机
	                    'workAddress': commonJson.workAddress,//工作地址
	                    'userId': commonJson.losUserId,  //los用户
	                    'OPER_TYPE': 'ADD',//操作类型 add-->表示新增  mod-->表示修改
	                    'FILE_LIST': $CL.creditArr//$CL.zhengxinArr  正信文件，授权证书
	                };
			}else if(pageName == 'creditLoan-cusConfirm@applyfile'){
				var appBus = {
	                    'busiGloablaSeq': $CL.platGlobalSeq,//loan.platGlobalSeq,//业务编号
	                    'TRADE_TYPE': '00006',//受理审批资料
	                    'APPLY_NO': '',//业务申请编号
	                    'CUSTOMER_NO': '',//客户流水号
	                    'attchType': '0',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
	                    'deviceNo': commonJson.udId,//设备编号
	                    'moduleId': $CL.moduleId,//模块编号
	                    'tranId': $CL.tranId,//交易编号
	                    'orgId': commonJson.orgId,//机构编号
	                    'operatorNo': commonJson.adminCount,//操作员
	                    'custName': custermerInfo.name,//客户名称
	                    'custCredType': '0',//客户证件类型
	                    'custCredNo': custermerInfo.cerNO,//客户证件号
	                    'offlineOnline': commonJson.offlineOnline,//脱机/联机
	                    'workAddress': commonJson.workAddress,//工作地址
	                    'userId': commonJson.losUserId,  //los用户
	                    'OPER_TYPE': 'ADD',//操作类型 add-->表示新增  mod-->表示修改
	                    'FILE_LIST': []//arrFile 对账单
	                };
			}else if(pageName == 'creditLoan-cusConfirm@applyfileUpdate'){
				var appBus = {
	                    'busiGloablaSeq': $CL.platGlobalSeq,//loan.platGlobalSeq,//业务编号
	                    'TRADE_TYPE': '00006',//受理审批资料
	                    'APPLY_NO': $CL.APPLY_NO,//业务申请编号
	                    'CUSTOMER_NO': $CL.CUSTOMER_NO,//客户流水号
	                    'attchType': '0',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
	                    'deviceNo': commonJson.udId,//设备编号
	                    'moduleId': $CL.moduleId,//模块编号
	                    'tranId': $CL.tranId,//交易编号
	                    'orgId': commonJson.orgId,//机构编号
	                    'operatorNo': commonJson.adminCount,//操作员
	                    'custName': custermerInfo.name,//客户名称
	                    'custCredType': '0',//客户证件类型
	                    'custCredNo': custermerInfo.cerNO,//客户证件号
	                    'offlineOnline': commonJson.offlineOnline,//脱机/联机
	                    'workAddress': commonJson.workAddress,//工作地址
	                    'userId': commonJson.losUserId,  //los用户
	                    'OPER_TYPE': 'ADD',//操作类型 add-->表示新增  mod-->表示修改
	                    'FILE_LIST': $CL.fillListArr//arrFile 对账单deng
	                };
			}else if(pageName == 'creditLoan-cusConfirm@signfile'){
				var appBus = {
						'busiGloablaSeq': $CL.platGlobalSeq,//业务编号
	                    'APPLY_NO': '',//业务申请编号
	                    'CUSTOMER_NO': '',//客户流水号
	                    'attchType': '1',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
	                    'deviceNo': commonJson.udId,//设备编号
	                    'moduleId': $CL.moduleId,//模块编号
	                    'tranId': $CL.tranId,//交易编号
	                    'orgId': commonJson.orgId,//机构编号
	                    'operatorNo': commonJson.adminCount,//操作员
	                    'custName': custermerInfo.name,//客户名称
	                    'custCredType': '0',//客户证件类型
	                    'custCredNo': custermerInfo.cerNO,//客户证件号
	                    'offlineOnline': commonJson.offlineOnline,//脱机/联机
	                    'workAddress': commonJson.workAddress//工作地址
	                };
			}else if(pageName == 'creditLoan-cusConfirm@signfileUpdate'){
				var appBus = {
						'busiGloablaSeq': $CL.platGlobalSeq,//业务编号
						'APPLY_NO': $CL.APPLY_NO,//业务申请编号
	                    'CUSTOMER_NO': $CL.CUSTOMER_NO,//客户流水号
	                    'attchType': '1',//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
	                    'deviceNo': commonJson.udId,//设备编号
	                    'moduleId': $CL.moduleId,//模块编号
	                    'tranId': $CL.tranId,//交易编号
	                    'orgId': commonJson.orgId,//机构编号
	                    'operatorNo': commonJson.adminCount,//操作员
	                    'custName': custermerInfo.name,//客户名称
	                    'custCredType': '0',//客户证件类型
	                    'custCredNo': custermerInfo.cerNO,//客户证件号
	                    'offlineOnline': commonJson.offlineOnline,//脱机/联机
	                    'workAddress': commonJson.workAddress//工作地址
	                };
			}
			return appBus;
		},
		SaveToObj:function(pageName,obj){
			if(pageName == "creditLoan-cusPicture"){
				commonJson.longitude = obj.REMARK1;//经度
			    commonJson.latitude = obj.REMARK2;//纬度
//			    $CL.fixedAmount = obj.REMARK3;//最大额度
//			    $CL.fixedTerms = obj.REMARK4;//最大期限
//			    $CL.minAmount = obj.REMARK14;//最小额度
//			    $CL.minTerms = obj.REMARK15;//最小期限
			    custermerInfo.nation = obj.mNation;//
			    custermerInfo.cerNO = obj.mcerNo;
			    custermerInfo.address = obj.maddress;
			    custermerInfo.name = obj.mname;
			    custermerInfo.cerExpdDt = obj.mcerExpdDt;
			    custermerInfo.birthday = obj.mbirthday;
			    custermerInfo.sex = obj.msex;
			    custermerInfo.issAuthority = obj.missAuthority;
			    custermerInfo.image = MT_path + obj.mimage.substring(obj.mimage.lastIndexOf('\/') + 1);
			    $CL.applicationObj.mPicFileARR = obj.mpicFileARR.split('&&');//要打包的影像路径
			    $CL.applicationObj.mPicFileInfoARR = JSON.parse(obj.mpicFileInfoARR);
			    $CL.applicationObj.mPicFileMsgType = obj.mpicFileMsgType.split('&&');
			    $CL.applicationObj.lianPic = obj.mcheckPhoto;
			    lianwanghechaData.CheckResult = obj.mCheckResult;
			    $CL.faceRecogn = obj.mfaceRecogn;
			    $CL.applicationObj.proCODE = obj.proCODE;  //产品代买
			    $CL.applicationObj.proType = obj.proType;
//			    $CL.applyTo = obj.proType;
			    $CL.proName = obj.YWXS;
			    commonJson.isCustermerInfoMultiplex = obj.REMARK13;
			    $CL.loanLimit = obj.REMARK3;
			    $CL.occup = obj.REMARK4;
			    $CL.office = obj.REMARK5;
			    $CL.income = obj.REMARK6;
			    $CL.marriage = obj.REMARK7;
			    $CL.loanMoney = obj.REMARK8;
			    $CL.loanTime = obj.REMARK9;
			    $CL.client_no = obj.mCLIENT_NO;
			    $CL.oiSrc = obj.REMARK10;
			    $CL.oiAmt = obj.REMARK11;
			    $CL.isScoreValue = obj.REMARK12;
			    $CL.maxAmount = obj.REMARK14;
			    $CL.minAmount = obj.REMARK15;
			    $CL.maxTerms = obj.REMARK16;
			    $CL.minTerms = obj.REMARK17;
			    $CL.huji = obj.REMARK18;
			    $CL.scoreCardNo = obj.REMARK19;
			    $CL.SCORE_CARD_ID = obj.REMARK20;
			    for (var k = 0; k < $CL.applicationObj.mPicFileARR.length; k++) {
			        if ($CL.applicationObj.mPicFileARR[k] != '') {
			            var elIndex = $CL.applicationObj.mPicFileARR[k].lastIndexOf('\/') + 1;
			            var fileName = $CL.applicationObj.mPicFileARR[k].substring(elIndex);
			            $CL.applicationObj.mPicFileARR[k] = MT_path + fileName;
			        } else {
			            $CL.applicationObj.mPicFileARR[k] = '';
			        }
			    }
			    
//			    $CL.biPai = parseInt(obj.REMARK25);
//			    $CL.qtPicCode = obj.REMARK26.split('&&');
//			    $CL.qtPicName = obj.REMARK27.split('&&');
			}else if(pageName == "creditLoan-cusInfo@wb"){
				$CL.applicationObj.proCODE = obj.proCODE;  // 产品代买
			    $CL.applicationObj.proType = obj.proType;
			    creditJson.isPrev.LLDBisFromPrev = obj.gisTrue;  // 联网核查结果
			    $CL.proName = obj.YWXS;
			    lianwanghechaData.CheckResult = obj.mCheckResult;
			    $CL.isPicturePage = obj.isPicturePage;
			    $CL.faceRecogn = obj.mfaceRecogn;
			    custermerInfo.nation = obj.mNation;//
			    custermerInfo.cerNO = obj.mcerNo;
			    custermerInfo.address = obj.maddress;
			    custermerInfo.name = obj.mname;
			    custermerInfo.cerExpdDt = obj.mcerExpdDt;
			    custermerInfo.birthday = obj.mbirthday;
			    custermerInfo.sex = obj.msex;
			    custermerInfo.issAuthority = obj.missAuthority;
			    custermerInfo.image = MT_path + obj.mimage.substring(obj.mimage.lastIndexOf('\/') + 1);
			    $CL.applicationObj.mPicFileARR = obj.mpicFileARR.split('&&');// 要打包的影像路径
			    $CL.applicationObj.mPicFileInfoARR = JSON.parse(obj.mpicFileInfoARR);
			    $CL.applicationObj.mPicFileMsgType = obj.mpicFileMsgType.split('&&');
			    $CL.applicationObj.lianPic = obj.mcheckPhoto;
			    for (var k = 0; k < $CL.applicationObj.mPicFileARR.length; k++) {
			    	if ($CL.applicationObj.mPicFileARR[k] != '') {
			    		var elIndex = $CL.applicationObj.mPicFileARR[k].lastIndexOf('\/') + 1;
			    		var fileName = $CL.applicationObj.mPicFileARR[k].substring(elIndex);
			    		$CL.applicationObj.mPicFileARR[k] = MT_path + fileName;
			    	} else {
			    		$CL.applicationObj.mPicFileARR[k] = '';
			    	}
			    }
			    $CL.marriage = obj.maritalStatus;
			    $CL.company = obj.corporation;
			    $CL.occup = obj.headship;
			    $CL.mobile = obj.cellphone;
			    $CL.telephone = obj.homeTel;
			    $CL.zipcode = obj.dwellingZip;
			    if (obj.mailingAddr.indexOf('深圳市') == 0) {
			        $CL.s_city = obj.mailingAddr.slice(0, 3);
			        var index = obj.mailingAddr.indexOf('区');
			        $CL.s_county = obj.mailingAddr.slice(3, index + 1);
			        $CL.addrDetail = obj.mailingAddr.slice(index + 1);
			    } else {
			        $CL.addrDetail = obj.mailingAddr;
			    }
			    $CL.income = obj.income;// 月收入
			    $CL.peiPhone = obj.consortCellphone;
			    $CL.peiIncome = obj.consortIncome;// 配偶月收入
			    $CL.peiCompany = obj.peiHeadship; // 配偶工作单位
			    $CL.peiCerNo = obj.gcerNo;  // 证件号码
			    $CL.peiName = obj.gname;// 配偶名称
			    $CL.loanMoney = obj.buildingFuMoney;// 借款金额
			    $CL.loanTime = obj.buildingFuTime;// 借款期限
			    $CL.paymentMethod = obj.buildingType;// 还款方式
			    $CL.loanUse = obj.buildingExplain;// 还款计划说明
			    $CL.country = obj.country;//国籍
			    $CL.office = obj.industry;// 职务
			    $CL.addrCode = obj.hadHouseArea;// 地区名称
			    $CL.addrName = obj.buildingAddr;// 签发地区
			    commonJson.longitude = obj.REMARK1;// 经度
			    commonJson.latitude = obj.REMARK2;// 纬度
			    $CL.addrAll = obj.REMARK8;// 签发地区全部
			    $CL.issPlace = obj.REMARK9;
			    commonJson.isCustermerInfoMultiplex = obj.REMARK13;//
			    $CL.branchId = obj.REMARK10;// jigouhao
			    // $CL.canBuildCustomer = obj.REMARK5;//是否新建小贷信息
			// $CL.customerId = obj.REMARK6;//客户id
			// $CL.spouseId = obj.REMARK7;//配偶id
			    $CL.peiCerType = obj.REMARK3;// 配偶证件类型
			    $CL.wyType = obj.REMARK14;// 
				$CL.wyNo = obj.REMARK15;
				$CL.wyStatus = obj.REMARK16;
				$CL.wyType1 = obj.REMARK17;
				$CL.wyNo1 = obj.REMARK18;
				$CL.wyStatus1 = obj.REMARK19;
				$CL.accountArr = JSON.parse(obj.accountArr);
				$CL.acctNo = obj.accout;
				$CL.acctType = obj.accoutType;
//				$CL.fillListArr = JSON.parse(obj.REMARK20);//对账单
//				$CL.zhengxinArr = JSON.parse(obj.REMARK21);//征信报告
				$CL.zhengxinArr = [];
			    $CL.creditArr = [];
			    $CL.fillListArr = [];
				$CL.dwellYear = obj.dwellYear;
				$CL.eduExp = obj.eduExp;
				$CL.cuzgxw = obj.degree;
				$CL.industry = obj.manager;
				$CL.position = obj.position;
				$CL.peiOffice = obj.gissAuthority;
				$CL.dwellingStatus = obj.dwellingStatus;
				$CL.oiSrc = obj.support;
				$CL.oiAmt = obj.debtBalance;
				$CL.loanLimit = obj.REMARK22;
				$CL.polwhcjg = obj.REMARK23;
				$CL.polwhcFlag = obj.REMARK24;
				$CL.loanUseOther = obj.REMARK25;
				$CL.isLoanValue = obj.REMARK26;
				$CL.isScoreValue = obj.REMARK27;
				$CL.client_no = obj.mCLIENT_NO;
				$CL.isLoanPeiValue = obj.REMARK28;
				$CL.maxAmount = obj.REMARK5;
			    $CL.minAmount = obj.REMARK6;
			    $CL.maxTerms = obj.REMARK7;
			    $CL.minTerms = obj.REMARK8;
			    $CL.huji = obj.REMARK11;
			    $CL.scoreCardNo = obj.REMARK12;
			    $CL.SCORE_CARD_ID = obj.REMARK4;
			}else if(pageName == "creditLoan-cusInfo@page"){
//				$CL.addrName = $.trim($("#creditLoan-addrName").val());// 地区名称
//				$CL.addrAll = $.trim($("#creditLoan-addr").html());// 签发地区所有选项
//				$CL.addrCode = $.trim($("#creditLoan-addr").val());// 签发地区名称
//				$CL.addr = $.trim($("#creditLoan-addr option:selected").text());// 签发地区名称
				// <!--联系方式-->
				$CL.mobile = removeSpace($('#creditLoan-mobile').val());// 手机号码
				$CL.telephone = removeSpace($('#creditLoan-telephone').val());// 固定电话
				$CL.zipcode = $.trim($("#creditLoan-zipcode").val());// 邮编
				$CL.s_city = $.trim($("#s_city").val());// 居住地址市
				$CL.s_county = $.trim($("#s_county").val());// 居住地址区
				$CL.addrDetail = $.trim($("#creditLoan-addr-detail").val());// 居住地址详细地址
				// <!-- 职业信息 -->
				$CL.occup = $.trim($("#creditLoan-occup").val());// 职业
				$CL.company = $.trim($("#creditLoan-company").val());// 工作单位
				$CL.office = $.trim($("#creditLoan-office").val());// 职务
				$CL.income = $("#creditLoan-income").val();// 月收入
				// <!-- 家庭状况 -->
				$CL.marriage = $.trim($("#creditLoan-marriage").val());// 婚姻状况
				$CL.peiName = $.trim($("#creditLoan-peiName").val());// 配偶姓名
				$CL.peiCerType = $.trim($("#creditLoan-peiCerType").val());// 配偶证件类型
				$CL.peiPhone = removeSpace($('#creditLoan-peiPhone').val());// 配偶手机号码
				$CL.peiCerNo = $.trim($("#creditLoan-peiCerNo").val());// 配偶证件号码
				$CL.peiCompany = $.trim($("#creditLoan-peiCompany").val());// 配偶工作单位
				$CL.peiIncome = $.trim($("#creditLoan-peiIncome").val());// 配偶月收入
				// <!-- 物业信息 -->
				$CL.wyType = $.trim($("#creditLoan-wyType").val());// 物业类型
				$CL.wyNo = $.trim($("#creditLoan-wyNo").val());// 物业编号
				$CL.wyStatus = $.trim($("#creditLoan-wyStatus").val());// 物业状态
				$CL.wyCount = $('#creditLoan-wuyexinxi').children('li').size();
				if ($('#creditLoan-wuyexinxi').children('li[title=wuye1]').css('display')=='block') {
					$CL.wyType1 = $.trim($("#creditLoan-wyType1").val());// 物业1类型
					$CL.wyNo1 = $.trim($("#creditLoan-wyNo1").val());// 物业1编号
					$CL.wyStatus1 = $.trim($("#creditLoan-wyStatus1").val());// 物业1状态
				}else{
					$CL.wyType1 = "";// 物业1类型
					$CL.wyNo1 = "";// 物业1编号
					$CL.wyStatus1 = "";// 物业1状态
				}
				// <!--贷款信息-->
				$CL.loanMoney = $.trim(rmoney($("#creditLoan-loanMoney").val()));// 贷款金额
				$CL.loanTime = $.trim($("#creditLoan-loanTime").val());// 贷款期限
				$CL.paymentMethod = $.trim($("#creditLoan-paymentMethod").val());// 还款方式
				$CL.loanUse = $.trim($("#creditLoan-loanUse").val());// 贷款用途
				$CL.loanUseOther = $.trim($("#creditLoan-otherUse").val());// 贷款其他用途
				$CL.acctNo = $.trim($("#creditLoan-cardAccount").val());// 还款账号
				$CL.acctType = $.trim($("#creditLoan-cardAccount option:selected").attr('docType'));// 凭证类型
				
				$CL.dwellYear = $.trim($("#creditLoan-dwellYear").val());
				$CL.eduExp = $.trim($("#creditLoan-eduExp").val());
				$CL.cuzgxw = $.trim($("#creditLoan-cuzgxw").val());
				$CL.industry = $.trim($("#creditLoan-industry").val());
				$CL.position = $.trim($("#creditLoan-position").val());
				$CL.peiOffice = $.trim($("#creditLoan-peiOffice").val());
				$CL.dwellingStatus = $.trim($("#creditLoan-dwellingStatus").val());
				$CL.oiSrc = $.trim($("#creditLoan-oiSrc").val());
				$CL.oiAmt = $.trim($("#creditLoan-oiAmt").val());
			}
		},
		fillDataToPage:function(pageName){
			if(pageName == "creditLoan-cusConfirm"){
				$('#creditLoan-name').text(custermerInfo.name);
			    $('#creditLoan-cerNo').text(custermerInfo.cerNO);
			    $("#creditLoan-mobile").text($CL.mobile);// 手机号码
			    $("#creditLoan-telephone").text($CL.telephone);// 固定电话
			    $("#creditLoan-addr-detail").text($CL.s_city ? ($CL.s_city + $CL.s_county + $CL.addrDetail) : $CL.addrDetail);// 居住地址详细地址
//			    $("#creditLoan-marriage").text($CL.marriage);// 家庭状况
			    $("#creditLoan-marriage").text(_marriageListObj[$CL.marriage]);// 家庭状况
			    $("#creditLoan-occup").text(_occupListObj[$CL.occup]);// 职业
			    $("#creditLoan-income").text($CL.page.creditLoanFmoney($CL.income)+'元');// 月收入
			    $("#creditLoan-oiSrc").text(_oIncomeSrc[$CL.oiSrc]);// 家庭其他收入来源
			    $("#creditLoan-oiAmt").text($CL.page.creditLoanFmoney($CL.oiAmt)+'元');// 家庭其他收入
			    
			    if($CL.peiName && $CL.peiCerNo && $CL.peiPhone){
			    	$("#creditLoan-peiName").text($CL.peiName);// 配偶姓名
			    	$("#creditLoan-peiCerNo").text($CL.peiCerNo);// 配偶证件号码
			    	$("#creditLoan-peiPhone").text($CL.peiPhone);// 配偶手机号码
			    	$("#creditLoan-peiIncome").text($CL.page.creditLoanFmoney($CL.peiIncome)+'元');// 月收入
			    }else{
			    	$('#peiInfo-div').hide();
			    }
			    
			    var html = "";
			    var count = 0;
			    if($CL.wyType){
			    	count++;
			    }
			    if($CL.wyType1){
			    	count++;
			    }
			    if($CL.wyType){
			    	if($CL.wyType == __wyType['SFDZ'] || $CL.wyType == __wyType['YBDQ'] || $CL.wyType == __wyType['WFCZ']){
			    		if($CL.wyType == __wyType['WFCZ']){
			    			if(count == 1){
			    				html += "<span style='color:#666666'>"+_wyType[$CL.wyType] +"</span>";
			    			}else{
			    				html += "<span style='color:#666666'>1. "+_wyType[$CL.wyType] +"</span>";
			    			}
			    		}else{
			    			if(count == 1){
			    				html += "<span style='color:#666666'>"+_wyType[$CL.wyType]+" 第 "+$CL.wyNo+" 号 "+_wyDyStatus[$CL.wyStatus]+"</span>";
			    			}else{
			    				html += "<span style='color:#666666'>1. "+_wyType[$CL.wyType]+" 第 "+$CL.wyNo+" 号 "+_wyDyStatus[$CL.wyStatus]+"</span>";
			    			}
			    		}
			    	}
			    }
			    if($CL.wyType1){
			    	if($CL.wyType1 == __wyType['SFDZ'] || $CL.wyType1 == __wyType['YBDQ'] || $CL.wyType1 == __wyType['WFCZ']){
			    		if($CL.wyType1 == __wyType['WFCZ']){
			    			html += "</br><span style='color:#666666'>2. "+_wyType[$CL.wyType1]+"</span>";
			    		}else{
			    			html += "</br><span style='color:#666666'>2. "+_wyType[$CL.wyType1]+" 第 "+$CL.wyNo1+" 号 "+_wyDyStatus[$CL.wyStatus1]+"</span>";
			    		}
			    	}
			    }
//			    alert(html);
			    if(html){
			    	$("#creditLoan-wuye").html(html);
			    }else{
			    	$('#wyxx-div').hide();
			    }
			    
			    $("#creditLoan-loanLimit").text($CL.page.creditLoanFmoney($CL.loanLimit)+'元');// 授信额度
			    
			    $("#creditLoan-loanMoney").text($CL.page.creditLoanFmoney($CL.loanMoney)+'元');// 贷款金额
			    if($CL.loanTime){
			    	$("#creditLoan-loanTime").text($CL.loanTime + '月');// 贷款期限
			    }else{
			    	$("#creditLoan-loanTime").text('');// 贷款期限
			    }
			    
			    $("#creditLoan-paymentMethod").text(_paymentMethod[$CL.paymentMethod]);// 还款方式
			    $("#creditLoan-cardAccount").text($CL.acctNo);// 账号
			    if($CL.loanUse != '2'){
			    	$("#creditLoan-loanUse").text(_loanUsage[$CL.loanUse]);// 贷款用途
			    } else {
			    	$("#creditLoan-loanUse").text($CL.loanUseOther);// 贷款用途
			    }
			    $('#creditLoan-proName').text($CL.proName);
			    $('#creditLoan-proName2').text($CL.proName);
			    
			    if ($CL.fillListArr.length != 0) {
			        var textHtml = '';
			        $.each($CL.fillListArr, function (index, ele) {
			            var netFilePath = ele.split('/');
			            var fileName = netFilePath[netFilePath.length - 1];
			            textHtml += '<li filePath="' + ele + '">' +
			            '<div class="list_row_1">' + custermerInfo.name + '</div>' +
			            '<div class="list_row_2">' + custermerInfo.cerNO + '</div>' +
		                '<div class="list_row_3">' + fileName + '</div>' +
		                '<div class="list_row_4"><div>查看</div></div></li>';
			        });
			        $('#jkrdzd').append(textHtml);
			    }else{
			    	$('#jkrdzd-div').hide();
			    }
			    if($CL.zhengxinArr.length != 0 ){
			    	var textHtml = '';
			        $.each($CL.zhengxinArr, function (index, data) {
			            if(data.creditReferPath){
				            var creditFile = "";
				            $.each(data.creditReferPath.split(';'), function(index, path){
				            	var fileName = path.split('/');
				            	creditFile += fileName[fileName.length - 1] + ',';
				            });
				                
				            var li = $('<li>').data('creditInfo', data)
				            	.append($('<div>').addClass('list_row_1').html(custermerInfo.name))
				            	.append($('<div>').addClass('list_row_2').html(custermerInfo.cerNO))
				            	.append($('<div>').addClass('list_row_2-1').html(creditTypeJson[data.creditType]))
				            	.append($('<div>').addClass('list_row_3-1').html(creditFile.substr(0, creditFile.length - 1)))
				            	.append($('<div>').addClass('list_row_4').append($('<div>').html('查看')));
				            $('#jkrzx').append(li);
			    		} else {
				            var li = $('<li>').data('creditInfo', data)
				            	.append($('<div>').addClass('list_row_1').html(custermerInfo.name))
				            	.append($('<div>').addClass('list_row_2').html(custermerInfo.cerNO))
				            	.append($('<div>').addClass('list_row_2-1').html(creditTypeJson[data.creditType]))
				            	.append($('<div>').addClass('list_row_3-1'))
				            	.append($('<div>').addClass('list_row_4').append($('<div>').html('查看')));
				            $('#jkrzx').append(li);
			    		}
			        });
			    }else{
			    	$('#jkrzx-div').hide();
			    }
			    
			}else if(pageName == "creditLoan-cusInfo"){
				// <!--证件信息-->
			    $('#creditLoan-name').text(custermerInfo.name);
			    $('#creditLoan-sex').text(custermerInfo.sex);
			    $('#creditLoan-cerTime').text(custermerInfo.cerExpdDt.split('-')[1]);
			    $('#creditLoan-cerNo').text(custermerInfo.cerNO);
//			    if ($CL.issPlace && $CL.issPlace != 0) {
//			        $("#creditLoan-addrName").attr('disabled', 'disabled').closest('.fm-item').css('display', 'none');// 地区名称
//			        $("#creditLoan-addr").attr('disabled', 'disabled').closest('.fm-item').css('display', 'none');// 签发地区名称
//			    } else {
//			        $("#creditLoan-addrName").val($CL.addrName);// 地区名称
//			        $("#creditLoan-addr").html($CL.addrAll).val($CL.addrCode).selectmenu('refresh');// 签发地区名称
//			    }
			    // <!--联系方式-->
			    $("#creditLoan-mobile").val(telNum($CL.mobile));// 手机号码
			    $("#creditLoan-telephone").val($CL.telephone);// 手机号码
			    $("#creditLoan-zipcode").val($CL.zipcode);// 邮编
			    if (!$CL.s_city) {
			        $("#s_city").val("").selectmenu('refresh');
			        $("#s_county").val("").selectmenu('refresh').attr('disabled', 'disabled');
			        $("#creditLoan-addr-detail").val($CL.addrDetail);// 居住地址详细地址
			    } else {
			        $("#s_county").val($CL.s_county).selectmenu('refresh');// 居住地址省份
			        $("#s_city").val($CL.s_city).selectmenu('refresh');// 居住地址市
			        $("#creditLoan-addr-detail").val($CL.addrDetail);// 居住地址详细地址
			    }
			    // <!-- 职业信息 -->
			    $("#creditLoan-occup").val($CL.occup).selectmenu('refresh');// 职位
			    $("#creditLoan-company").val($CL.company);// 工作单位
			    $("#creditLoan-office").val($CL.office).selectmenu('refresh');// 职务
			    $("#creditLoan-income").val($CL.page.creditLoanFmoney($CL.income));// 月收入
			    // <!-- 家庭状况 -->
			    $("#creditLoan-marriage").val($CL.marriage).selectmenu('refresh');// 婚姻状况
			    if($CL.isLoanPeiValue == "1"){
			    	$('#creditLoan-peiName').val($CL.peiName).attr('disabled','disabled');
		    		$("#creditLoan-peiCerType").val($CL.peiCerType).attr('disabled','disabled').selectmenu('refresh');
		    		$('#creditLoan-peiCerNo').val($CL.peiCerNo).attr('disabled','disabled');
		    		$('#creditLoan-peiPhone').val(telNum($CL.peiPhone)).attr('disabled','disabled');
		    		$('#creditLoan-peiOffice').val($CL.peiOffice).attr('disabled','disabled').selectmenu('refresh');
		    		$('#creditLoan-peiIncome').val($CL.page.creditLoanFmoney($CL.peiIncome)).attr('disabled','disabled');
//		    		$('#creditLoan-peioushenfen').hide();
		    		$CL.dat.yingcangAndXianshipeiOu(true);
			    }else{
			    	$("#creditLoan-peiName").val($CL.peiName);// 配偶姓名
			    	$("#creditLoan-peiCerType").val($CL.peiCerType).selectmenu('refresh');// 配偶证件类型
			    	$("#creditLoan-peiPhone").val(telNum($CL.peiPhone));// 配偶手机号码
			    	$("#creditLoan-peiCerNo").val($CL.peiCerNo);// 配偶证件号码
			    	$("#creditLoan-peiIncome").val($CL.page.creditLoanFmoney($CL.peiIncome));// 配偶月收入
			    	$("#creditLoan-peiOffice").val($CL.peiOffice).selectmenu('refresh');//
			    }
			    $("#creditLoan-peiCompany").val($CL.peiCompany);// 配偶工作单位
			    // <!-- 物业信息 -->
			    if($CL.wyType){
			    	$("#creditLoan-wyType").val($CL.wyType).selectmenu('refresh');
					if($CL.wyType == __wyType['SFDZ'] || $CL.wyType == __wyType['YBDQ']){
						$('#creditLoan-wyNo').val($CL.wyNo).attr('disabled',false);
						$('#creditLoan-wyStatus_txt').html('<span class="required-stars">*</span>');
						$('#creditLoan-wyStatus').val($CL.wyStatus).attr('disabled',false).selectmenu('refresh');
					}else{
						$('#creditLoan-wyNo').val('').attr('disabled',true);
						$('#creditLoan-wyStatus_txt').html('');
						$('#creditLoan-wyStatus').val('').attr('disabled',true).selectmenu('refresh');
					}
			    }
			    if($CL.wyType1){
			    	$('li[title=wuye1]').css("display",'block');
			    	$("#creditLoan-wyType1").val($CL.wyType1).selectmenu('refresh');
					if($CL.wyType1 == __wyType['SFDZ'] || $CL.wyType1 == __wyType['YBDQ']){
						$('#creditLoan-wyNo1').val($CL.wyNo1).attr('disabled',false);
						$('#creditLoan-wyStatus1_txt').html('<span class="required-stars">*</span>');
						$('#creditLoan-wyStatus1').val($CL.wyStatus1).attr('disabled',false).selectmenu('refresh');
					}else{
						$('#creditLoan-wyNo1').val('').attr('disabled',true);
						$('#creditLoan-wyStatus1_txt').html('');
						$('#creditLoan-wyStatus1').val('').attr('disabled',true).selectmenu('refresh');
					}
			    	$('#creditLoan-wuyedelete').on('click', function() {
			    		$('li[title=wuye1]').css("display",'none');
					});
			    }
			    // <!--贷款信息-->
			    $("#creditLoan-loanMoney").val($CL.page.creditLoanFmoney($CL.loanMoney));// 贷款金额
			    if($CL.loanTime){
			    	$("#creditLoan-loanTime").val($CL.loanTime).selectmenu('refresh');// 贷款期限
			    }else{
			    	$("#creditLoan-loanTime").val('').selectmenu('refresh');// 贷款期限
			    }
			    $("#creditLoan-paymentMethod").val($CL.paymentMethod).selectmenu('refresh');// 还款方式
			    $("#creditLoan-loanUse").val($CL.loanUse).selectmenu('refresh');// 贷款用途
			    if($CL.loanUse == '2'){
			    	 $("#creditLoan-otherUse").val($CL.loanUseOther).attr('disabled',false);// 贷款用途
			    	 $('#creditLoan-otherUse_txt').html('<span class="required-stars">*</span>其他用途');
			    }
			    
			    var accountTextHtml = '<option></option>'; //accountSelect
			    $.each($CL.accountArr, function (index, val) {
			        var docType;
			        if (val.docLicenceVO[0].DOC_TYPE == '001') {
			            docType = '1';
			        } else if (val.docLicenceVO[0].DOC_TYPE == '') {
			            docType = '2';
			        }
			        if (val.docLicenceVO[0].ACCT_NO != '') {
			            if (val.docLicenceVO[0].ACCT_NO == loan.applicationObj.accout) {
			                accountTextHtml += '<option selected="true" docType ="' + docType + '" value="' + val.docLicenceVO[0].ACCT_NO + '">' + val.docLicenceVO[0].ACCT_NO + '</option>';
			            } else {
			                accountTextHtml += '<option docType ="' + docType + '" value="' + val.docLicenceVO[0].ACCT_NO + '">' + val.docLicenceVO[0].ACCT_NO + '</option>';
			            }
			        }
			        if (val.docLicenceVO[0].ISSUE_ACCT_NO != '') {
			            if (val.docLicenceVO[0].ISSUE_ACCT_NO == loan.applicationObj.accout) {
			                accountTextHtml += '<option selected="true" docType ="' + docType + '" value="' + val.docLicenceVO[0].ISSUE_ACCT_NO + '">' + val.docLicenceVO[0].ISSUE_ACCT_NO + '</option>';
			            } else {
			                accountTextHtml += '<option docType ="' + docType + '" value="' + val.docLicenceVO[0].ISSUE_ACCT_NO + '">' + val.docLicenceVO[0].ISSUE_ACCT_NO + '</option>';
			            }
			        }
			    });
			    $("#creditLoan-cardAccount").html(accountTextHtml).selectmenu('refresh', true);
			    $('#creditLoan-cardAccount').val($CL.acctNo).selectmenu('refresh');// 还款方式
			    $("#creditLoan-dwellYear").val($CL.dwellYear);// 
			    $("#creditLoan-eduExp").val($CL.eduExp).selectmenu('refresh');// 
			    $("#creditLoan-cuzgxw").val($CL.cuzgxw).selectmenu('refresh');// 
			    $("#creditLoan-industry").val($CL.industry).selectmenu('refresh');// 
			    $("#creditLoan-position").val($CL.position).selectmenu('refresh');// 
			    $("#creditLoan-dwellingStatus").val($CL.dwellingStatus).selectmenu('refresh');// 
			    $("#creditLoan-oiSrc").val($CL.oiSrc);// 
			    $("#creditLoan-oiAmt").val($CL.page.creditLoanFmoney($CL.oiAmt));// 
			    $("#creditLoan-loanLimit").val($CL.page.creditLoanFmoney($CL.loanLimit));//
			}
		},
		imageAcq:{
			imgSrc: '', //记录照片路径,
		    curParentObj: '', //记录要删除的对象
		    delImg: function (curParentObj, imgSrc) {
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
		            if (curParentObj.find('.cameraMul').length > 0) { //如果是其他
		                curParentObj.closest('.img_box').remove();
		            }
		            //监测下一步是否可点击
		            var ind = 0;
		            for (var i = 0; i < $CL.biPai; i++) {
		                if ($('.customer:eq(' + i + ')').find("img").length == 2) {
		                    ind++;

		                    if (ind >= $CL.biPai) {
		                        $('#creditLoan-cusPicture #btn_next').addClass('btn_next');
		                    } else {
		                        $('#creditLoan-cusPicture #btn_next').removeClass('btn_next');
		                    }

		                }
		            }
		            $CL.page.validatePicCss();
		        }, function (err) {

		        })
		    },
		    getFace: function (curParentObj) {
		    	if($CL.isSimulate){
		    		var msg = '../../images/iman.png';
		    		//alert(msg);
		    		$CL.dat.imageAcq.imgSrc = msg;
		    		curParentObj.find('.camera').hide();
		    		curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
		    		curParentObj.find('.rephoto').text('重拍');
		    		//监测下一步是否可点击
		    		var ind = 0;
		    		for (var i = 0; i < 4; i++) {
		    			if ($('.customer:eq(' + i + ')').find("img").length == 2) {
		    				ind++;
		    				
		    				if (ind >= 4) {
		    					$('#creditLoan-cusPicture #btn_next').addClass('btn_next');
		    				} else {
		    					$('#creditLoan-cusPicture #btn_next').removeClass('btn_next');
		    				}
		    			}
		    			
		    		}
		    	}else{
		    		faceDistinguish('trans', function (msg) {
		    			$CL.dat.imageAcq.imgSrc = msg;
		    			curParentObj.find('.camera').hide();
		    			curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
		    			curParentObj.find('.rephoto').text('重拍');
		    			//监测下一步是否可点击
		    			var ind = 0;
		    			for (var i = 0; i < $CL.biPai; i++) {
		    				if ($('.customer:eq(' + i + ')').find("img").length == 2) {
		    					ind++;
		    					
		    					if (ind >= $CL.biPai) {
		    						$('#creditLoan-cusPicture #btn_next').addClass('btn_next');
		    					} else {
		    						$('#creditLoan-cusPicture #btn_next').removeClass('btn_next');
		    					}
		    				}
		    				
		    			}
		    			$CL.page.validatePicCss();
		    		}, function (err) {
		    			showMsg('拍照失败');
		    		})
		    	}
		    },
		    getImg: function (curParentObj) { //拍照
		    	if($CL.isSimulate){
		    		var msg = '../../images/iman.png';
		    		creditJson.isPrev.LLDBisFromPrev = false;
		    		$CL.dat.imageAcq.imgSrc = msg;
		    		curParentObj.find('.camera').hide();
		    		curParentObj.find('.camera-pic').remove();
		    		curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
		    		curParentObj.find('.rephoto').text('重拍');
		    		var ele = $('.img_box:last').find('.rephoto').text();
		    		if (curParentObj.find('.cameraMul').length > 0 && ele != '选拍，可多张拍摄') { //如果是其他
		    			
		    			var htmlText = "";
		    			htmlText += '<div class="img_box" style="position: relative;">' +
		    			'<div class="customer customer_six" picname="qitazhengming">' +
		    			'<div class="rephoto">选拍，可多张拍摄</div>' +
		    			'<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/>' +
		    			'</div>' +
		    			'<div class="img_notes qitazhengming" othername="qitazhengming">其他</div>' +
		    			'<div class="qita-tanchuang-cbg"></div>' +
		    			'<img src="../../images/crow_icon_win.png" class="crow_icon_win" />' +
		    			'<div class="qita-tanchuang-con">' +
		    			'<div class="queren-quxiao">' +
		    			'<div class="quxiao-ok quxiao-click">取消</div>' +
		    			'<div class="quxiao-ok queding-click">确定</div>' +
		    			'</div>' +
		    			'<ul class="qita-tanchuang-ul">'
		    			if($CL.qtPicName.length > 0){
							$($CL.qtPicName).each(function(index){
								htmlText += '<li othername="'+$CL.qtPicCode[index]+'">'+$CL.qtPicName[index]+'</li>'
							});
						}
		    			htmlText += '' +
		    			'</ul>' +
		    			'</div>' +
		    			'</div>';
		    			$('.img_content').append(htmlText).trigger("create");
		    			
		    		}
		    		//监测下一步是否可点击
		    		var ind = 0;
		    		for (var i = 0; i < $CL.biPai; i++) {
		    			if ($('.customer:eq(' + i + ')').find("img").length == 2) {
		    				ind++;
		    				if (ind >= 4) {
		    					$('#creditLoan-cusPicture #btn_next').addClass('btn_next');
		    				} else {
		    					$('#creditLoan-cusPicture #btn_next').removeClass('btn_next');
		    				}
		    				
		    			}
		    		}
		    		$CL.page.validatePicCss();
		    	}else{
		    		if ($('#creditLoan-cusPicture .cameraMul').length == 16) {
		                $('#creditLoan-cusPicture .cameraMul').eq(15).parents(".img_box").remove();
		                showTags({
		                    'title': '提示',
		                    'content': "拍摄照片已到最大限度[最大限度为20张]",
		                    'ok': {}
		                });
		                return;

		            }
		    		Meap.media('camera', curParentObj.attr('picname'), function (msg) {
		    			creditJson.isPrev.LLDBisFromPrev = false;
		    			$CL.dat.imageAcq.imgSrc = msg;
		    			curParentObj.find('.camera').hide();
		    			curParentObj.find('.camera-pic').remove();
		    			curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
		    			curParentObj.find('.rephoto').text('重拍');
		    			var ele = $('.img_box:last').find('.rephoto').text();
		    			if (curParentObj.find('.cameraMul').length > 0 && ele != '选拍，可多张拍摄') { //如果是其他
		    				
		    				var htmlText = "";
		    				htmlText += '<div class="img_box" style="position: relative;">' +
		    				'<div class="customer customer_six" picname="qitazhengming">' +
		    				'<div class="rephoto">选拍，可多张拍摄</div>' +
		    				'<img class="camera cameraMul" src="../../images/ic_camera.png" alt=""/>' +
		    				'</div>' +
		    				'<div class="img_notes qitazhengming" othername="qitazhengming">其他</div>' +
		    				'<div class="qita-tanchuang-cbg"></div>' +
		    				'<img src="../../images/crow_icon_win.png" class="crow_icon_win" />' +
		    				'<div class="qita-tanchuang-con">' +
		    				'<div class="queren-quxiao">' +
		    				'<div class="quxiao-ok quxiao-click">取消</div>' +
		    				'<div class="quxiao-ok queding-click">确定</div>' +
		    				'</div>' +
		    				'<ul class="qita-tanchuang-ul">'
		    				if($CL.qtPicName.length > 0){
								$($CL.qtPicName).each(function(index){
									htmlText += '<li othername="'+$CL.qtPicCode[index]+'">'+$CL.qtPicName[index]+'</li>'
								});
							}
		    				htmlText += '' +
		    				'</ul>' +
		    				'</div>' +
		    				'</div>';
		    				$('.img_content').append(htmlText).trigger("create");
		    				
		    			}
		    			//监测下一步是否可点击
		    			var ind = 0;
		    			for (var i = 0; i < $CL.biPai; i++) {
		    				if ($('.customer:eq(' + i + ')').find("img").length == 2) {
		    					ind++;
		    					if (ind >= $CL.biPai) {
		    						$('#creditLoan-cusPicture #btn_next').addClass('btn_next');
		    					} else {
		    						$('#creditLoan-cusPicture #btn_next').removeClass('btn_next');
		    					}
		    					
		    				}
		    			}
		    			
		    			$CL.page.validatePicCss();
		    		}, function (err) {
		    			showMsg('拍照失败');
		    		})
		    	}
		    },
		    reGetImg: function (curParentObj, imgSrc) { //重拍
		        if (curParentObj.parent().hasClass('get-face')) {
		            faceDistinguish('trans', function (returnGetMsg) {
		            	creditJson.isPrev.LLDBisFromPrev = false;
		                deletePhoto([imgSrc], function (returnDelMsg) {
		                    $CL.dat.imageAcq.imgSrc = returnGetMsg;
		                    curParentObj.find('.camera-pic').attr('src', returnGetMsg);
		                    $('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
		                }, function (err) {

		                })
		            }, function (err) {
		                showMsg('重拍失败');
		            })
		        } else {
		            Meap.media('camera', curParentObj.attr('picname'), function (returnGetMsg) {
		                creditJson.isPrev.LLDBisFromPrev = false;
		                imgSrc = curParentObj.find('.camera-pic').attr('src');
		                deletePhoto([imgSrc], function (returnDelMsg) {
		                    $CL.dat.imageAcq.imgSrc = returnGetMsg;
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
		},
		dataListing:function(maritalStatus, isCoborrower){
			var sqwc = '<img src="../../images/ic_sqwc.png" alt=""/></li>'; // 存在
			var yuan = '<img src="../../images/ic_yuan.png" alt=""/></li>'; // 不存在
			var textHtml = '';
			var isMarry = false;
			var isFlag = 0;
			$($CL.tempPicName).each(function(index){
				var code = $CL.tempPicCode[index];
				var name = $CL.tempPicName[index];
				if(code == _pictureClass['2']){
					isFlag |= 16;
				}else if(code == _pictureClass['3']){
					isFlag |= 8;
				}else if(code == _pictureClass['4']){
					isFlag |= 4;
				}else if(code == _pictureClass['5']){
					isFlag |= 2;
				}else if(code == _pictureClass['6']){
					isFlag |= 1;
				}
			});
			if($CL.fillListArr.length > 0){
				isFlag |= 2;
			}
			if((isFlag & 16) == 16){
				textHtml += '<li><span>'+_pictureClassName['2']+'</span>'+sqwc;
			}else{
				textHtml += '<li><span>'+_pictureClassName['2']+'</span>'+yuan;
			}
			if((isFlag & 8) == 8){
				textHtml += '<li><span>'+_pictureClassName['3']+'</span>'+sqwc;
			}else{
				textHtml += '<li><span>'+_pictureClassName['3']+'</span>'+yuan;
			}
			if((isFlag & 4) == 4){
				textHtml += '<li><span>'+_pictureClassName['4']+'</span>'+sqwc;
			}else{
				textHtml += '<li><span>'+_pictureClassName['4']+'</span>'+yuan;
			}
			if((isFlag & 2) == 2){
				textHtml += '<li><span>'+_pictureClassName['5']+'</span>'+sqwc;
			}else{
				textHtml += '<li><span>'+_pictureClassName['5']+'</span>'+yuan;
			}
			if(maritalStatus == __marriageListObj['YHY'] || maritalStatus == __marriageListObj['YHW']){
				if((isFlag & 1) == 1){
					textHtml += '<li><span>'+_pictureClassName['6']+'</span>'+sqwc;
				}else{
					textHtml += '<li><span>'+_pictureClassName['6']+'</span>'+yuan;
				}
			}
			return textHtml;
		},
		createOptionHtml:function(obj,isblank){
			var html = "";
			if(isblank){
				html += "<option value=''></option>";
			}
			if(obj){
				for(var p in obj){
					html += "<option value='"+p+"'>"+obj[p]+"</option>";
				}
			}
			return html;
		},
		cachePictureCreditLoan:function(PicFileARR,PicFileInfoARR,PicFileMsgType,idName){
			$CL.tempPicCode = [];
			$CL.tempPicName = [];
			for(var i = 0;i < $CL.biPai;i++){
				var pic = '';
				if( $(idName+' .img_box:eq('+i+') .camera-pic:eq(0)').length>0){
					pic = $(idName+' .img_box:eq('+i+') .camera-pic:eq(0)').attr('src'); //客户面部照片
			    }
				var picName = $(idName+' .img_box:eq('+i+')').find('.customer').attr('picname');
				var picText = $(idName+' .img_box:eq('+i+')').find('.img_notes').text();
				if(picName != 'qitazhengming'){
					$CL.tempPicCode.push(picName);
					$CL.tempPicName.push(picText);
				}
				if(picName == _pictureClass['0']){
					$CL.applicationObj.cusFacePic = pic;
				}else if(picName == _pictureClass['1']){
					$CL.applicationObj.custAndCustOwnerPic = pic;
				}else if(picName == _pictureClass['2']){
					$CL.applicationObj.frontIDCardMPic = pic;
				}else if(picName == _pictureClass['3']){
					$CL.applicationObj.backIDCardMPic = pic;
				}
				PicFileARR.push(pic);
			}
			
		    var len = $(idName+' .img_box').length;
		    if (len - $CL.biPai > 0) {
		        for (var i = $CL.biPai; i < len; i++) {
		        	var pico = '';
		            if ($(idName+' .img_box:eq(' + i + ') .camera-pic').length > 0) {
		            	pico = $(idName+' .img_box:eq(' + i + ') .camera-pic:eq(0)').attr('src');
		                PicFileARR.push(pico);
		                PicFileMsgType.push($(idName+' .img_box:eq(' + i + ') .camera-pic:eq(0)').closest('.customer').attr('picname'));
		            }
		            var picName = $(idName+' .img_box:eq('+i+')').find('.customer').attr('picname');
		            var picText = $(idName+' .img_box:eq('+i+')').find('.img_notes').text();
					if(picName != 'qitazhengming'){
						$CL.tempPicCode.push(picName);
						$CL.tempPicName.push(picText);
					}
					if(picName == _pictureClass['0']){
						$CL.applicationObj.cusFacePic = pico;
					}else if(picName == _pictureClass['1']){
						$CL.applicationObj.custAndCustOwnerPic = pico;
					}else if(picName == _pictureClass['2']){
						$CL.applicationObj.frontIDCardMPic = pico;
					}else if(picName == _pictureClass['3']){
						$CL.applicationObj.backIDCardMPic = pico;
					}
		        }
		    }
		    if(!$CL.applicationObj.cusFacePic){
		    	$CL.applicationObj.cusFacePic = '';
		    }
		    if(!$CL.applicationObj.custAndCustOwnerPic){
		    	$CL.applicationObj.custAndCustOwnerPic = '';
		    }
		    if(!$CL.applicationObj.frontIDCardMPic){
		    	$CL.applicationObj.frontIDCardMPic = '';
		    }
		    if(!$CL.applicationObj.backIDCardMPic){
		    	$CL.applicationObj.backIDCardMPic = '';
		    }
		    $.each(PicFileARR, function (index, el) {
		        if (!el) return true;
		        var elIndex = el.lastIndexOf('\/') + 1;
		        PicFileInfoARR[0].b.push({
		            FILE_NAME: el.substring(elIndex),
		            FILE_TYPE: 'F0000'
		        });
		    });
		},
		zipCompressionFilePathFun:function(type){
			var arr = [];
		    if (type == 'customer') {  //
		        $.each($CL.applicationObj.mPicFileARR, function (index, e) {
		            var fileName = e.substring(e.lastIndexOf('\/') + 1);
		            if(fileName.indexOf('frontIDCardMPic') != -1 ||fileName.indexOf('backIDCardMPic') != -1||fileName.indexOf('hukoubuPic') != -1 ||fileName.indexOf('marryzhengming') != -1 ||fileName.indexOf('shouruzhengmingM') != -1 ||fileName.indexOf('zichanzhengmingM') != -1 ||fileName.indexOf('fangchanzhengming') != -1){
		                arr.push(e);
		            }
		        });
		    } else {
		        $.each($CL.applicationObj.mPicFileARR,function (index,e) {
		            if (index == 0) {
		                arr.push(e);
		            }else{
		                var fileName = e.substring(e.lastIndexOf('\/') + 1);
		                if(fileName.indexOf('custAndCustOwnerPic') != -1 ||fileName.indexOf('canbaozhengming') != -1||fileName.indexOf('pingzhengPic') != -1 ||fileName.indexOf('qitazhengming') != -1||fileName.indexOf('bankstatements') != -1){
		                    arr.push(e);
		                }
		            }
		        });
		    }
		    return arr;
		},
		showMessage:function(msg,ishidden){
			if(ishidden){
				hideLoader();
			}
            showTags({
                'title': '提示',
                'content': msg,
                'ok': {}
            });
		},
		coreClienInfoQuerySucc:function(msg){
		    var responseBody = responseBodySuccFormat(msg);
		    if (responseBody[0].results == "00") {
		    	$CL.client_no = responseBody[1].customerInfoVO[0].CLIENT_NO; //获取客户号
	            if ($CL.client_no == '' || $.trim($CL.client_no) == '') {
	                showTags({
	                    'title': '提示',
	                    'content': '该产品不适用新客户!',
	                    'ok': {
	                        fun: function () {
	                            $.mobile.changePage('creditLoan-product.html', {reverse: true});
	                        }
	                    }
	                });
	                return;
	            }
		        if ($.trim(responseBody[1].customerInfoVO[0].CH_CLIENT_NAME) != '' && $.trim(responseBody[1].customerInfoVO[0].CH_CLIENT_NAME) != custermerInfo.name) {
		            showTags({
		                'title': '提示',
		                'content': '身份证姓名与核心姓名不一致,无法办理',
		                'ok': {
		                    fun: function () {
		                        $.mobile.changePage('creditLoan-reading.html', {
		                            reverse: true
		                        });
		                    }
		                }
		            });
		            return;
		        }
		        //此处查询客户等级
		        $CL.svc.queryCoreClientLevelInfo();
		    } else if (responseBody[0].results == "08") {
		        $CL.svc.queryCoreClientInfo();
		    } else {
		        showTags({
		            'title': '提示',
		            'content': responseBody[0].message,
		            'ok': {
		                fun: function () {
		                    $.mobile.changePage('creditLoan-reading.html', {reverse: true});
		                }
		            }
		        });
		    }
		},
		unionClientInfoQuerySucc:function(msg){
		    var responseBody = responseBodySuccFormat(msg);
		    if (responseBody[0].results == '00') {
		    	$CL.dat.fillDataByLosQuery(responseBody[1], responseBody[0].resource);
		    	if($CL.isLoanPeiValue == '1'){
		    		showTags({
		                'title': '提示',
		                'content': '配偶信息已存在，无法修改，但业务可以正常办理，请及时更新LOS系统相关信息！',
		                'ok': {
		                    fun: function () {
		                    	if (responseBody[0].resource == '3' && responseBody[1].clientDescVO[0].ORGAN_CODE != '' && commonJson.superOrgId != responseBody[1].clientDescVO[0].ORGAN_CODE) {  // 判断 LOS机构(在不为空的情况下) 和 登录机构(信息源来自LOS且LOS机构和登录机构不一致)
		    		    			$('#creditLoan-mobile').attr('disabled', 'disabled');  //手机号码
		    		    			showTags({
		    		    				'title': '提示',
		    		    				'content': '客户为['+responseBody[1].clientDescVO[0].ORGAN_CODE+']一级支行客户，请向该支行申请贷款!',
		    		    				'ok': {
		    		    					fun: function () {
		    		    						$CL.modifiable = '0';  //登录机构不一致 不允许修改
		    		                        	                dzhShouyeNo();
//		    		    						$CL.svc.queryAcctNo();
		    		    					}
		    		    				}
		    		    			});
		    		    		} else {
		    		    			if (responseBody[0].resource == '3') {
		    		    				$('#creditLoan-mobile').attr('disabled', 'disabled');  //手机号码
		    		    			} else {
		    		    				$('#creditLoan-mobile').removeAttr('disabled', 'disabled');  //手机号码
//		    		                $('.information-input input').removeAttr('disabled', 'disabled');
//		    		                $('.information-input select').removeAttr('disabled', 'disabled');
		    		    			}
		    		    			$CL.modifiable = '1';
		    		    			$CL.svc.queryAcctNo();
		    		    		}
		                    }
		                }
		            });
		    	}else{
		    		if (responseBody[0].resource == '3' && responseBody[1].clientDescVO[0].ORGAN_CODE != '' && commonJson.superOrgId != responseBody[1].clientDescVO[0].ORGAN_CODE) {  // 判断 LOS机构(在不为空的情况下) 和 登录机构(信息源来自LOS且LOS机构和登录机构不一致)
		    			$('#creditLoan-mobile').attr('disabled', 'disabled');  //手机号码
		    			showTags({
		    				'title': '提示',
		    				'content': '客户为['+responseBody[1].clientDescVO[0].ORGAN_CODE+']一级支行客户，请向该支行申请贷款!',
		    				'ok': {
		    					fun: function () {
		    						$CL.modifiable = '0';  //登录机构不一致 不允许修改
		                                                dzhShouyeNo();
//		    						$CL.svc.queryAcctNo();
		    					}
		    				}
		    			});
		    		} else {
		    			if (responseBody[0].resource == '3') {
		    				$('#creditLoan-mobile').attr('disabled', 'disabled');  //手机号码
		    			} else {
		    				$('#creditLoan-mobile').removeAttr('disabled', 'disabled');  //手机号码
//		                $('.information-input input').removeAttr('disabled', 'disabled');
//		                $('.information-input select').removeAttr('disabled', 'disabled');
		    			}
		    			$CL.modifiable = '1';
		    			$CL.svc.queryAcctNo();
		    		}
		    	}
		    } else if (responseBody[0].results == '08') {
		        $CL.svc.queryUnionClientInfo();
		    } else if (responseBody[0].results == 'LOS0060') {
		        $CL.inputLogo = false;
		        $CL.isLoanValue = '' + parseInt($CL.isLoanValue) | 4;//query fail
		        showTags({
		            'title': '提示',
		            'content': responseBody[0].message,
		            'ok': {
		                fun: function () {
		                    $.mobile.changePage('creditLoan-product.html', {
		                        reverse: true
		                    });
		                }
		            }
		        });
		    } else {
		        $CL.inputLogo = false;
		        $CL.isLoanValue = '' + parseInt($CL.isLoanValue) | 4;//query fail
		        showTags({
		            'title': '提示',
		            'content': responseBody[0].message,
		            'ok': {}
		        });
                $CL.svc.queryAcctNo();
		    }
		},
		fillDataByLosQuery:function(obj, resource){
			$CL.isLoanPeiValue = '0';
		    if (obj.clientDescVO[0].OCCUPATION_CODE != '') {
		        $('#creditLoan-occup').val(obj.clientDescVO[0].OCCUPATION_CODE).selectmenu('refresh');//职业
		    }
		    $('#creditLoan-company').val($.trim(obj.clientDescVO[0].EMPLOYER_NAME)); //工作单位
		    $('#creditLoan-zipcode').val($.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].POSTAL_CODE)); //邮政编码--->通讯地址邮编
		    
		    if(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CONTACT_ID != ''){
		    	if($.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CITY_TEL) !='' && $.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CONTACT_ID) !=''){
		    		$('#creditLoan-telephone').val(''+$.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CITY_TEL)+'-'+$.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CONTACT_ID)); //家庭电话
		    	}else{
		    		$('#creditLoan-telephone').val(''+$.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CITY_TEL)+$.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].CONTACT_ID)); //家庭电话
		    	}
		    }else{
		    	$('#creditLoan-telephone').val($.trim(obj.clientDescVO[0].EMPLOYER_PHONE)); //办公电话
		    }
		    var dwtel = $.trim(obj.clientDescVO[0].EMPLOYER_PHONE);
		    if(dwtel){
		    	$('#creditLoan-telephone').val($.trim(obj.clientDescVO[0].EMPLOYER_PHONE)); //单位电话
		    	var dt = $('#creditLoan-telephone').val();
		    	if(dt.indexOf('-') != -1){
		    		var dtAry = dt.split('-');
		    		var index = dtAry[0].indexOf('0');
		    		if(index != 0){
		    			$('#creditLoan-telephone').val('0'+dt); //单位电话
		    		}
		    	}
		    }
		    var mobile = $.trim(obj.clientDescVO[2].CONTACT_INFO[1].contactInfo[0].CONTACT_ID);
		    if(mobile){
		    	$CL.isLoanValue = '' + parseInt($CL.isLoanValue) | 2;
		    	mobile = telNum(mobile);
		    }else{
		    	$CL.isLoanValue = '' + parseInt($CL.isLoanValue) | 0;
		    	mobile = '';
		    }
		    if (resource == '3') {
		    	var addr = $.trim(obj.clientDescVO[2].CONTACT_INFO[1].contactInfo[0].ADDRESS2);
		    	if(!addr){
		    		addr = '';
		    	}
		    	$('#creditLoan-addr-detail').val(addr); //通讯地址
		    }else{
		    	var addr = $.trim(obj.clientDescVO[2].CONTACT_INFO[0].contactInfo[0].ADDRESS2);
		    	if(!addr){
		    		addr = '';
		    	}
		    	$('#creditLoan-addr-detail').val(addr); //通讯地址
		    }
		    if (resource == '3') {
		        $('#creditLoan-mobile').val(telNum(mobile)).attr('disabled', 'disabled');
		    } else {
		        $('#creditLoan-mobile').val(telNum(mobile)).removeAttr('disabled', 'disabled');
		    }
		    var detailAddress = $('#creditLoan-addr-detail').val();
		    if(detailAddress){
		    	$("#s_city").val("").attr('disabled','disabled').selectmenu('refresh');
				$("#s_county").val("").attr('disabled','disabled').selectmenu('refresh');
		    }
		    var peiCertType = obj.clientDescVO[0].consortCertType;
		    var peiCertId = obj.clientDescVO[0].consortCertId;
		    var peiName = obj.clientDescVO[0].consortName;
		    var peiMobile = obj.clientDescVO[0].consortCellphone;
		    var peiShip = obj.clientDescVO[0].consortHeadship;
		    var peiIncome = obj.clientDescVO[0].consortIncome;
		    if(peiIncome && parseFloat(peiIncome) <= 0){
		    	peiIncome = '';
		    }
		    if(resource == '3'){
		    	if(peiCertType && peiCertId && peiName){
		    		$CL.isLoanPeiValue = '1';
		    		$('#creditLoan-peiName').val(peiName).attr('disabled','disabled');
		    		$('#creditLoan-peiCerNo').val(peiCertId).attr('disabled','disabled');
		    		$('#creditLoan-peiPhone').val(telNum(peiMobile)).attr('disabled','disabled');
		    		$('#creditLoan-peiIncome').val($CL.page.creditLoanFmoney(peiIncome)).attr('disabled','disabled');
		    		$CL.dat.cllistDisabled('creditLoan-peiOffice',true);
					$CL.dat.cllistDisabled('creditLoan-peiCerType',true);
					$("#creditLoan-peiCerType").val(peiCertType).selectmenu('refresh');
					$('#creditLoan-peiOffice').val(peiShip).selectmenu('refresh');
//		    		$('#creditLoan-peioushenfen').hide();
					$CL.dat.yingcangAndXianshipeiOu(true);
		    	}else{
		    		$('#creditLoan-peiName').val(peiName);
		    		$("#creditLoan-peiCerType").val(peiCertType).selectmenu('refresh');
		    		$('#creditLoan-peiCerNo').val(peiCertId);
		    		$('#creditLoan-peiPhone').val(telNum(peiMobile));
		    		$('#creditLoan-peiOffice').val(peiShip).selectmenu('refresh');
		    		$('#creditLoan-peiIncome').val($CL.page.creditLoanFmoney(peiIncome));
		    		$CL.isLoanPeiValue = '0';
		    	}
		    }else{
		    	$('#creditLoan-peiName').val(peiName);
	    		$("#creditLoan-peiCerType").val(peiCertType).selectmenu('refresh');
	    		$('#creditLoan-peiCerNo').val(peiCertId);
	    		$('#creditLoan-peiPhone').val(telNum(peiMobile));
	    		$('#creditLoan-peiOffice').val(peiShip).selectmenu('refresh');
	    		$('#creditLoan-peiIncome').val($CL.page.creditLoanFmoney(peiIncome));
	    		$CL.isLoanPeiValue = '0';
//	    		$('#creditLoan-peioushenfen').show();
	    		$CL.dat.yingcangAndXianshipeiOu(false);
		    }
		    var zgxl = $.trim(obj.clientDescVO[0].EDUCATION);//最高学历
	    	if(zgxl){
	    		$('#creditLoan-eduExp').val(zgxl).selectmenu('refresh');
	    	}
	    	var zgxw = $.trim(obj.clientDescVO[0].CUZGXW);//最高学历
	    	if(zgxw){
	    		$('#creditLoan-cuzgxw').val(zgxw).selectmenu('refresh');
	    	}
	    	var hy = $.trim(obj.clientDescVO[0].INDUSTRY);//
	    	if(hy){
	    		$('#creditLoan-industry').val(hy).selectmenu('refresh');
	    	}
	    	var zy = $.trim(obj.clientDescVO[0].OCCUPATION_CODE);//
	    	if(zy){
	    		$('#creditLoan-occup').val(zy).selectmenu('refresh');
	    	}
	    	var gzdw = $.trim(obj.clientDescVO[0].EMPLOYER_NAME);//
	    	if(gzdw){
	    		$('#creditLoan-company').val(gzdw);
	    	}
	    	var zhiwu = $.trim(obj.clientDescVO[0].POST);//
	    	if(zhiwu){
	    		$('#creditLoan-office').val(zhiwu).selectmenu('refresh');
	    	}
	    	var zhich = $.trim(obj.clientDescVO[0].QUALIFICATION);//
	    	if(zhich){
	    		$('#creditLoan-position').val(zhich).selectmenu('refresh');
	    	}
//	    	var yzbianma = $.trim(obj.clientDescVO[0].EMPLOYER_POSTAL_CODE);//
//	    	if(yzbianma){
//	    		$('#creditLoan-zipcode').val(yzbianma);
//	    	}
	    	var juzhuzk = $.trim(obj.clientDescVO[0].dwellingStatus);//
	    	if(juzhuzk){
	    		$('#creditLoan-dwellingStatus').val(juzhuzk).selectmenu('refresh');
	    	}
	    	var hshilaibd = $.trim(obj.clientDescVO[0].dwellYear);//
	    	if(hshilaibd){
	    		var tmp = hshilaibd.split('-');
	    		if(tmp.length > 1){
	    			hshilaibd = tmp[0];
	    			$('#creditLoan-dwellYear').val(hshilaibd+'-01');
	    		}else{
	    			$('#creditLoan-dwellYear').val(hshilaibd+'-01');
	    		}
	    	}
//	    	var niansr = obj.clientDescVO[0].ANNUALEARNING;//
//	    	if(niansr){
//	    		$('#creditLoan-income').val($CL.page.creditLoanFmoney(parseFloat(niansr/12)));
//	    	}
		},
		queryAcctNoSucc:function(msg){
		    var responseBody = responseBodySuccFormat(msg);
		    var textHtml = '<option></option>';
		    if (responseBody[0].results == "00") {
		    	$CL.accountArr = [];
		        $.each(responseBody, function (index, val) {
		            if (index == 0) return;
		            $CL.accountArr.push(val);
		            var docType;
		            if (val.docLicenceVO[0].DOC_TYPE == '001') {
		                docType = '1';
		            } else if (val.docLicenceVO[0].DOC_TYPE == '') {
		                docType = '2';
		            }
		            if (val.docLicenceVO[0].ACCT_NO != '') {
		                textHtml += '<option docType ="' + docType + '" value="' + val.docLicenceVO[0].ACCT_NO + '">' + val.docLicenceVO[0].ACCT_NO + '</option>';
		            }
		            if (val.docLicenceVO[0].ISSUE_ACCT_NO != '') {
		                textHtml += '<option docType ="' + docType + '" value="' + val.docLicenceVO[0].ISSUE_ACCT_NO + '">' + val.docLicenceVO[0].ISSUE_ACCT_NO + '</option>';
		            }
		        });
		        $("#creditLoan-cardAccount").html(textHtml).selectmenu('refresh', true);
		    } else if (responseBody[0].results == "08") {
		        $CL.svc.queryAcctNo();
		    } else if (responseBody[0].results == "03") {   //还款账号无凭证
		        $CL.inputLogo = false;
		        $CL.isLoanValue = '' + parseInt($CL.isLoanValue) | 1;
		        showTags({
		            'title': '提示',
		            'content': responseBody[0].message,
		            'ok': {
		                fun: function () {
		                    $.mobile.changePage('./creditLoan-product.html', {reverse: true});
		                }
		            }
		        });
		    } else {
		        $CL.inputLogo = false;
		        $CL.isLoanValue = '' + parseInt($CL.isLoanValue) | 1;
		        showTags({
		            'title': '提示',
		            'content': responseBody[0].message,
		            'ok': {}
		        })
		    }
		},
		imessageAuthentionServiceBankSucc:function(msg, sendJson){
		    var responseBody = responseBodySuccFormat(msg);
		    if (responseBody[0].results == "00") {
		        $CL.MSG_INFO = responseBody[1].messageAuthentionVO[0].MSG_INFO; //获取短信验证码
		        $CL.USER_NO = responseBody[1].messageAuthentionVO[0].USER_NO; //获取用户唯一标识
		        var num = 80; //设置验证码有效时间 80秒
		        $CL.BTime = setInterval(function () {
		            num--;
		            $('.codetime').html('请在<span style="color:red;">' + num + '秒</span>内输入验证码');
		            if (num == 0) {
		            	$CL.USER_NO = '';
		                clearInterval($CL.BTime);
		                $('#getMsg').removeClass('cannt-click').text('重新获取');
		                $('.codetime').html('请在<span style="color:red;">0秒</span>内输入验证码');
		                $CL.hasYZM = false;
		                $('#inp').removeAttr('disabled').val('');
		            }
		        }, 1000);
		    } else if (responseBody[0].results == "08") {
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
		            $('.footter .previous').removeClass('btn_next');
		            $('#inp').removeAttr('disabled').val('');
			    });
		    } else {
		    	if($CL.BTime){
                    clearInterval($CL.BTime);
                }
		        $('#getMsg').removeClass('cannt-click').text('重新获取');
		        showTags({
		            'title': '提示',
		            'content': responseBody[0].message,
		            'ok': {}
		        });
		    }
		},
		cllistDisabled:function(id,flag,value){
			if(id == 'creditLoan-peiOffice'){
				var htmlStr = '';
				if(flag){
					htmlStr = '<select id="'+id+'" class="drop-down" disabled>';
				}else{
					htmlStr = '<select id="'+id+'" class="drop-down">';
				}
				htmlStr += '<option value="1">高级领导(行政级别局级局级以上领导或大公司高级管理人员)</option>';
				htmlStr += '<option value="2">中级领导(行政级别局级以下领导或大公司中级管理人员)</option>';
				htmlStr += '<option value="3">一般员工</option>';
				htmlStr += '<option value="4">其他</option>';
				htmlStr += '<option value="9">未知</option>';
				htmlStr += '</select>';
				$('#'+id+'-div').html(htmlStr).trigger('create');
				if(value){
					$("#creditLoan-peiOffice").val(value).selectmenu('refresh');
				}
			}else if(id == 'creditLoan-peiCerType'){
				var htmlStr = '';
				if(flag){
					htmlStr = '<select id="'+id+'" class="drop-down" disabled>';
				}else{
					htmlStr = '<select id="'+id+'" class="drop-down">';
				}
				htmlStr += '<option value="0">身份证</option>';
				htmlStr += '<option value="1">户口簿</option>';
				htmlStr += '<option value="2">护照</option>';
				htmlStr += '<option value="3">军官证</option>';
				htmlStr += '<option value="4">士兵证</option>';
				htmlStr += '<option value="5">港澳居民来往内地通行证</option>';
				htmlStr += '<option value="6">台湾同胞来往内地通行证</option>';
				htmlStr += '<option value="8">外国人居留证</option>';
				htmlStr += '<option value="9">警官证</option>';
				htmlStr += '<option value="L">文职干部证</option>';
				htmlStr += '<option value="X">其它</option>';
				htmlStr += '</select>';
				$('#'+id+'-div').html(htmlStr).trigger('create');
				if(value){
					$("#creditLoan-peiCerType").val(value).selectmenu('refresh');
				}
			}
		},
		yingcangAndXianshipeiOu:function(isHidden){
			if(isHidden){
				$('#creditLoan-peioushenfen-div').html('');
			}else{
				$('#creditLoan-peioushenfen-div').html('<div id="creditLoan-peioushenfen" style="display:block;width:60px;height:40px;background:url(../../images/ic-dzpao-ing.png) left no-repeat;background-size:35px;"></div>');
				$("#creditLoan-peioushenfen").click(
						function() {
							if($CL.isLoanPeiValue == '1'){
								return;
							}
							var _married = $('#creditLoan-marriage').val();
							if(_married == __marriageListObj['YHY'] || _married == __marriageListObj['YHW']){//已婚
								//先缓存页面信息
								$CL.messageCache = true;
								$CL.peiIcInfo.isPeiRead = false;
								$CL.peiIcInfo = {}; //初始化个人信息
								if($CL.isSimulate2){
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
									$CL.peiIcInfo.isPeiRead = false;
									if($CL.peiIcInfo.isReadCardSucc){
										if($CL.peiIcInfo.cerNO == custermerInfo.cerNO){
											$CL.dat.showMessage('申请人身份证号码与其配偶身份证号码不能相同!',false);
										}else{
											$("#creditLoan-peiName").val($CL.peiIcInfo.name);// 配偶姓名
											$("#creditLoan-peiCerNo").val($CL.peiIcInfo.cerNO);// 配偶证件号码
											$("#creditLoan-peiCerType").val("0").selectmenu('refresh');// 配偶证件类型；身份证
										}
									}else{
										$CL.dat.showMessage('配偶身份证读取失败!',false);
									}
								}else{
									$CL.svc.readPeiICCard(function() {
										$CL.peiIcInfo.isReadCardSucc=true;
										$CL.peiIcInfo.isPeiRead = false;
										if($CL.peiIcInfo.isReadCardSucc){
											if($CL.peiIcInfo.cerNO == custermerInfo.cerNO){
												$CL.dat.showMessage('申请人身份证号码与其配偶身份证号码不能相同!',false);
											}else{
												$("#creditLoan-peiName").val($CL.peiIcInfo.name);// 配偶姓名
												$("#creditLoan-peiCerNo").val($CL.peiIcInfo.cerNO);// 配偶证件号码
												$("#creditLoan-peiCerType").val("0").selectmenu('refresh');// 配偶证件类型；身份证
											}
										}else{
											$CL.dat.showMessage('配偶身份证读取失败!',false);
										}
									}, function(err) {
										$CL.peiIcInfo.isReadCardSucc=false;
										$CL.peiIcInfo.isPeiRead = false;
										$CL.dat.showMessage('配偶身份证读取失败!',false);
									});
								}
							}
							
						});
			}
		}
}

