/**
 * Created by LiChenglin on 2016/6/23.
 */
/**
 * 创建命名空间
 */
var meapNameSpace = meapNameSpace || {};
(function () {
	var global = window;
	/**
	 * 
	 * @param {} nsStr
	 * @return {}
	 */
	meapNameSpace.ns = function (nsStr) {
		var parts = nsStr.split("."),
		root = global,
		max,
		i;
		for (i = 0, max = parts.length ; i < max ; i++) {
		//如果不存在，就创建一个属性
			if (typeof root[parts[i]] === "undefined") {
				root[parts[i]] = {};
			}
			root = root[parts[i]];
		}
		return root;
	};
})();
//信用贷款主命名空间
meapNameSpace.ns("$CL");
//信用贷款服务处理命名空间
meapNameSpace.ns("$CL.svc");
//信用贷款完成命名空间data
meapNameSpace.ns("$CL.dat");
//创建主命名空间
$CL={
		moduleId: '52', //模块编号
	    tranId: '81',  //交易编号
	    applicationObj: {},
	    mInfo: {},
	    peiIcInfo:{},
	    isSimulate: false, //是否启用模拟器
	    isSimulate2: false, //是否启用模拟器
	    queryFileObj: {//贷款的文件查询条件
	        name: '',
	        cerType: '',
	        cerNO: '',
	        fileType: ''
	    }
	};