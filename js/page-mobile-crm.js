//CRM集成 BY SAVEN
$(document).on("pageshow", "#mobile-all", function() {
    //错误返回内容
    function errCRM(msg){
		var responseObj = null;
		var responseCode = null;
		var errResponseCode = null;
		try{
			msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
			responseObj = JSON.parse(msg);
			responseCode = responseObj.b[0].error[0];
			return '{"code":"-1","content":'+responseCode.message+'}';
		}finally{
			responseObj = null;
			responseCode = null;
		}
		return false;
	}
    //调用MEAP请求返回数据处理
	function opCRM(msg){
		var responseObj = null;
		var responseCode = null;
		var errResponseCode = null;
		try{
			msg = msg.replace(new RegExp("\\.[s]+\"", "g"), "\"");
			responseObj = JSON.parse(msg);
			responseCode = responseObj.b;
			if (responseCode[0].results == "00") {
				var crmResponseVO = responseCode[1].crmResponseVO[0];
				var content = crmResponseVO.content;
				document.write(content);
    				document.close();
			}else{
				showTags({
					'title': '提示',
					'content': responseCode[0].message,
					'ok': {}
				});
			}
		}finally{
			responseObj = null;
			responseCode = null;
			errResponseCode = null;
		}
	}
	
	CrmJson.param = "userCode=mobile&userPswd=1234qwer&moveType=move-c&module=custView&ownerId=Urliduo";
	CrmJson.offlineOnline=commonJson.offlineOnline;
	CrmJson.operatorNo=commonJson.adminCount;
	CrmJson.orgId=commonJson.orgId;
	CrmJson.workAddress=commonJson.workAddress;
	CrmJson.deviceNo=commonJson.udId;
//	showLoader('移动CRM加载中...');
	var b = {
				'offlineOnline.s':CrmJson.offlineOnline,
				'moduleID.s':CrmJson.moduleID,//模块编号
				'tranId.s':CrmJson.tranId,//交易编号
				'operatorNo.s':CrmJson.operatorNo,//操作员工号
				'orgId.s':CrmJson.orgId,//操作员所属机构号
				'workAddress.s':CrmJson.workAddress,//工作地址
				'deviceNo.s':CrmJson.deviceNo,//设备编号 
				'param.s':CrmJson.param//CRM参数	
			}
	var bodyJson = {"b": [b]};
	crmLogin(bodyJson,function(msg){
					hideLoader();
					opCRM(msg);
				},function(err){
					hideLoader();
					errCRM(err);
				});
});
