/**
 * 公共文件处理工具js
 */

/**
 * 保存并上传签名文件信息
 * @param json 对应模块的json对象
 * @param attchType 文件操作（0:打包传DX 1:不打包签名图片 2:其他）
 * @param appPath 自定义保存路径标志
 * @param param 附加参数
 */
function saveAndUploadSignFileInfo(json, attchType, appPath, param){
	//签名base64转路径
    Meap.transFormImage(json.platGlobalSeq + 'sign', json.data, 'picSty', function (msg) {
        //将要上传的签名插入到ios断点上传的数据库中
        //签名上传 业务参数
        var appBus = {
            'busiGloablaSeq': json.platGlobalSeq,//业务编号
            'attchType': attchType,//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': commonJson.udId,//设备编号
            'moduleId': json.moduleId,//模块编号
            'tranId': json.tranId,//交易编号
            'orgId': commonJson.orgId,//机构编号
            'operatorNo': commonJson.adminCount,//操作员
            'custName': custermerInfo.name,//客户名称
            'custCredType': '0',//客户证件类型
            'custCredNo': custermerInfo.cerNO,//客户证件号
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress//工作地址
        };
        if(param){
	        for(var key in param){
	        	json[key] = param[key];
	        }
        }
        appBus = JSON.stringify(appBus);
        var sendDataJson = {
            'databaseName': 'myDatabase',
            'tableName': 'up_download_info',
            'data': [{
                'fileToken': myTime.CurTime(),//文件唯一ID(可以为时间挫
                'pos': '0',//文件的断点信息(初始为0)
                'filePath': msg,//文件路径
                'appPath': appPath,//自定义文件路径
                'appBuss': appBus,//业务参数
                'downloadToken': '',//文件的下载ID(初始为空)
                'leng': '1',//文件的长度(初始为1)
                'isNotice': 'yes', //是否调用后台(一直是yes)
                "fileType":"1"
            }]
        };
        insertTableData(sendDataJson, function (msg) {
        }, function (err) {
            showTags({
                'title': '提示',
                'content': '插入数据库失败',
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

/**
 * 保存并上传影像文件信息
 * @param json 对应模块的json对象
 * @param attchType 文件操作（0:打包传DX 1:不打包签名图片 2:其他）
 * @param appPath 自定义保存路径标志
 * @param param 附加参数
 */
function saveAndUploadPhotoFileInfo(json, attchType, appPath, param){
	Meap.zipCompression(json.platGlobalSeq + 'image', json.picFileARR, function (msg) {
        //将要上传的影像插入到ios断点上传的数据库中
        //影像上传 业务参数
        var appBus = {
            'busiGloablaSeq': json.platGlobalSeq,//业务编号
            'attchType': attchType,//文件操作（0:打包传DX 1:不打包签名图片 2:其他）
            'deviceNo': commonJson.udId,//设备编号
            'moduleId': json.moduleId,//模块编号
            'tranId': json.tranId,//交易编号
            'orgId': commonJson.orgId,//机构编号
            'operatorNo': commonJson.adminCount,//操作员
            'custName': custermerInfo.name,//客户名称
            'custCredType': '0',//客户证件类型
            'custCredNo': custermerInfo.cerNO,//客户证件号
            'offlineOnline': commonJson.offlineOnline,//脱机/联机
            'workAddress': commonJson.workAddress//工作地址
        };
        if(param){
	        for(var key in param){
	        	json[key] = param[key];
	        }
        }
        appBus = JSON.stringify(appBus);
        var sendDataJson = {
            "databaseName": "myDatabase",
            "tableName": "up_download_info",
            "data": [{
                "fileToken": parseInt(myTime.CurTime()) + 1,//文件唯一ID(可以为时间挫
                "pos": "0",//文件的断点信息(初始为0)
                "filePath": msg,//文件路径
                "appPath": appPath,//自定义文件路径
                "appBuss": appBus,//业务参数
                "downloadToken": "",//文件的下载ID(初始为空)
                "leng": "1",//文件的长度(初始为1)
                "isNotice": "yes", //是否调用后台(一直是yes)
                "fileType": "0"
            }]
        };
        insertTableData(sendDataJson, function (msg) {
        }, function (err) {
            showTags({
                'title': '提示',
                'content': '插入数据库失败',
                'ok': {}
            });
        });
    }, function(err) {
		hideLoader();
		showTags({
			'title': '提示',
			'content': '压缩影像失败！',
			'ok': {}
		});
	});	
}
