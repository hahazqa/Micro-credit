//文件路径
var MT_path;
//脱机登陆默认密码
var OFFLINEPWD = "961200";
//信用卡变量
var creditJson = {
    storage: {},//存储数据
    PRODUCTCD: '',//卡产品编码
    CLIENT_NO: '',//客户号
    isCoreHas: '',//判断客户号是否为空
    USER_NO: '',//用户唯一标识
    MSG_INFO: '',//动态口令
    moduleID: '19',//模块编号
    moduleId: '19',
    tranId: '20',//交易编号
    hasYZM: false,//是否填写验证码 true为已经填写
    hasQM: false,//是否填写签名 true为已经填写
    isReadCardSucc: false,//是否读卡成功,true读卡成功 false读卡失败
    isReadCardMsg: '',//读卡返回数据
    isPrev: {}

};
//贵宾理财变量
var citigoldJson = {
    isGMorDT: '',//购买流程or定投流程
    imageInfo: '',//存储影像信息 存储影像上传的参数
    moduleID: '26',//模块编号
    moduleId: '26',
    tranId: '28',//交易编号
    jjProInfo: {},//基金产品信息
    signStatus: '',//客户信息签约状态
    reversePage: '',//点击影像采集上一步应该返回页面
    isCanClickNEXT: {isSure: false, isRead: false, isVideo: false, isSign: false, isVerificationCode: false},//购买 定投 确认提交页面 是否可以点击提交按钮
    BankAcc: '',//客户签约银行账号
    ClientNo: '',//客户号 客户信息查询返回 签约使用
    riskCache: false, //风评缓存
    signCache: false, //签约缓存
    imageCache: false,//影像页面缓存
    GMCache: false, //购买页面缓存
    DTCache: false, //定投页面缓存
    msgSureCache: false //确认页面缓存
};
//理财风评
var financeJson = {
    moduleId: '26',  //模块
    tranId:'27' //交易编号
};
var commonJson = {
    mySex: '',//头像性别
    udId: '',//设备唯一标识
    adminCount: '',//登陆账号
    orgId: '',//操作员所属机构号
    TLRNAME: '',//操作员姓名
    SPRNUM: '',//操作员工号
    TLRCELLPHONE: '',//操作员手机号码
    offlineOnline: '',//判断是否联网 online 联网
    submitTime: '',//缓存个人信息 提交时间
    businessType: '',//缓存个人信息 业务类型
    isCustermerInfoMultiplex: false,//是否影像复用
    MultiplexCerNo: '',//影像复用的身份证号
    workAddress: '',//工作地址
    //submitTime:'',//影像复用的提交时间
    USER_NO: '',//获取验证码 用户唯一标识
    MSG_INFO: '',//获取验证码 动态口令
    roleId: '',//角色编号
    fundCmanagerId: '',
    noticeCount: '',
    tuojiPtLtNum: '',
    tinyLoanUserId:'',//查小贷系统需要
    //2016.05.10新增
    'orgname' : '' //机构名称
};

//虚拟卡信息变量
var debitEnter = {
    "readIDCache": false, //读取身份证页面缓存
    "agreeCache": false, //阅读协议页面缓存
    "imageCache": false, //影像采集页面缓存
    "messageCache": false, //信息录入页面缓存
    "moduleID": "22",//模块编号
    "tranId1": "23",//交易编号 1:虚拟卡开卡
    "moduleId": "22",
    "tranId": "23",
    "operatorNo": commonJson.adminCount,//操作员
    "deviceNo": commonJson.udId//设备编号
};//信用卡变量
//虚拟卡核心查询客户信息
//var icustomerInfo = {};
var custermerInfo = {//存储个人信息
    'nation': '汉族',//民族
    'cerNO': '452229198609065425',//身份证号
    'address': '深圳市罗湖区深南东路123号',//地址
    'name': '张三',//姓名
    'cerExpdDt': '2005.06.05-2025.04.04',//到期日期
    'birthday': '1988-11-11',//出生日期
    'sex': '男',//性别
    'issAuthority': '罗湖区公安局',//签发机关
    'image': ''//身份证头像图片
};

//性别
var sexJson = {
    '男': 'M',
    '女': 'F'
};
var sexJsonToWZ = {
    'M': '男',
    'F': '女'
};
var eduJson = {//教育程度
    '1': '初中及以下',
    '2': '高中',
    '3': '大专',
    '4': '本科',
    '5': '研究生及以上'

};
var roomStyleJson = {//住房类型
    '1': '商品房有按揭',
    '2': '商品房无按揭',
    '3': '已购公房',
    '4': '租用／月租房',
    '5': '单位集体宿舍',
    '6': '亲属／父母家',
    '7': '其它'
};
var compropertyJson = {//单位性质
    '1': '政府机关',
    '2': '事业单位',
    '3': '国企',
    '4': '股份制公司',
    '5': '外企',
    '6': '民企',
    '7': '其它'
};
var ndustryJson = {//行业类别
    'A': '公共管理、公共服务和社会组织',
    'B': '卫生、社会保障和社会福利业',
    'C': '水利、环境和公共设施管理',
    'D': '金融、水利、电力、燃气及水的生产供应业',
    'E': '信息传输、计算机服务及软件业',
    'F': '国防、部队',
    'G': '科学研究、技术服务和地质勘查业',
    'H': '租聘和商业服务业',
    'I': '文化、教育业',
    'J': '住宿、餐饮、娱乐业',
    'K': '房地产业',
    'L': '交通运输、仓储和邮政业',
    'M': '其他行业'
};
var cardAnnualfeeJson = {//年费类型
    '1': '首年免年费',
    '2': '每年收年费',
    '3': '终身免年费'
};
var isAutoPurchaseJson = {//自动还款功能
    '1': '是',
    '0': '否'
};

var cardRepaystyleJson = {//自动还款方式
    '01': '最低还款额',//最低还款额
    '02': '全额还款额'//全额还款额
};
var chunyinJson = {//婚姻状况
    '1': '未婚',//未婚
    '2': '已婚'//已婚
};
var jinjianlaiyuanJson = {//进件来源
    'SK': '散户',//
    'TJ': '推荐',//
    'TB': '团办',//
    'YQ': '邀请'//
};
var zhigangJson = {//职位、岗位
    '1': '一般员工',//
    '2': '一般管理人员',//
    '3': '中层管理人员',//
    '4': '企业负责人',//
    '5': '一般干部',//
    '6': '科级',//
    '7': '处级',//
    '8': '厅局级以上',//
    '9': '学生'//
};
var creditOFFICEJson = {  //lei 用于:信用卡业务办理情况查询的 信用卡业务办理情况
    '1': '一般员工',
    '2': '一般管理人员',
    '3': '中层管理人员',
    '4': '企业负责人',
    '5': '一般干部',
    '6': '科级',
    '7': '处级',
    '8': '厅局级以上'
};
var creditMARSTATUJson = { //lei 用于:信用卡业务办理情况查询的 信用卡业务办理情况
    '1': '未婚',
    '2': '已婚',
    '5': '其它'
};
var creditINTOSOURCEJson = {//lei 用于:信用卡业务办理情况查询的 信用卡业务办理情况
    'SK': '散户',
    'TJ': '推荐',
    'TB': '团办',
    'YQ': '邀请'
};
var creditDOMICILEJson = {//lei 用于:信用卡业务办理情况查询的 信用卡业务办理情况
    '01': '深户',
    '02': '广东非深户',
    '03': '广西',
    '04': '其他'
};

/*电子签约变量*/
var eleSignJson = {
    "moduleId": "24",//模块编号
    "tranId1": "25",//交易编号 2:
    "tranId": "25",
    "operatorNo": commonJson.adminCount,//操作员
    "deviceNo": commonJson.udId, //设备编号
    "picFileARR": [],//要打包的影像路径
    "B": '',        //查询密码
    "C": '',        //交易密码
    "USER_NO": '',
    "isModify": false, //修改是否回显
    "isOpen": false,    //开通情况回显
    "isAgree": false,    //协议回显
    "isPhoto": false,    //影像采集回显
    "userSign": false
};
var eleDta = {       //电子签约数据
    switchOne: '',     //六个开关状态
    switchTwo: '',
    switchThree: '',
    switchFour: '',
    switchFive: '',
    switchSix: ''
};

/*工作台变量*/
var workbenchJson = {
    moduleID: '31',//模块编号
    tranId1: '32', //交易编号     暂存业务
    tranId2: '33', //交易编号     脱机业务
    tranId3: '34', //交易编号     业务查询
    tranId4: '35', //交易编号     续传影像
    tranId5: '36', //交易编号     更新文档
    tranId6: '37', //交易编号     利率&汇率  利率和外汇牌价
    tranId7: '38', //交易编号     实用工具
    tranId8: '39', //交易编号     常见问题
    tranId9: '40', //交易编号     用户手册
    tranId10: '41',//交易编号     工作提醒
    tranId11: '42',//交易编号     通知公告
    tranId12: '43',//交易编号     我的业绩
    tranId13: '44',//交易编号     我的工作证
    tranId14: '45',//交易编号     人脸注册
    tranId15: '73',//交易编号     工作轨迹
    tranId16: '74',//交易编号     工作日志
    "temp": "",   //暂存数据
    "isTemp": false   //是否是暂存
};

var onOffline = { //脱机or联机
    '': '',
    'online': '联机',
    'offline': '脱机'
};
var bussinessType = {//业务类型
    '': '',
    '01': '信通数字卡',
    '02': '信用卡申请',
    '03': '按揭贷款申请',
    '27': '理财签约',
    '2': '基金销售',
    '10': '电子签约',
    '58':'视频拍摄',
    '62': '积分兑换',
    '63': '积分订单管理',
    '65': '社保待遇签约',
    '66': '特色产品签约',
    '68': '特惠商户',
    '71': '小微贷款申请',
    '72': '面签',
    '53': '征信查询',
    '81': '信用贷款申请'
};
var faceRecogn = {//人脸识别
    '': '',
    '1': '自动通过',
    '2': '自动不通过',
    '3': '远程复核通过',
    '4': '远程复核不通过',
    '5': '手动通过',
    '6': '手动不通过'
};
var currType = {//币种
    '': '',
    '156': '人民币',
    '250': '马克',
    '256': '法郎',
    '344': '港元',
    '392': '日元',
    '826': '英镑',
    '840': '美元',
    '954': '欧元'
};
var dealStatus = {//处理状态
    '': '',
    '00': '成功',
    '01': '失败',
    '09': '超时',
    '11': '部分成功'
};
var orgIdToUserId = {
    '00003': '9101',
    '00031': '9102',
    '00997': '9103',
    '00124': '9104',
    '00383': '9106',
    '00380': '9105'
};
var PrdAttr = {//基金类型
    '': '',
    '1': '股票型',
    '2': '配置型',
    '3': '债券型',
    '4': '货币型',
    '5': '保本型',
    '6': 'QDII',
    '7': '其他'
};
var riskLevel = { //风险等级
    '': '',
    '0': '未评定',
    '1': '低风险',
    '2': '中低风险',
    '3': '中风险',
    '4': '中高风险',
    '5': '高风险'
};
var riskLevelOne = {
    '': '',
    '0': '未评定',
    '1': '保守型',
    '2': '谨慎型',
    '3': '稳健型',
    '4': '进取型',
    '5': '激进型'
};
var riskLevelStar = { //风险等级星级  named by lei.
    '': ' 暂无',
    '0': '零星',
    '1': '一星',
    '2': '二星',
    '3': '三星',
    '4': '四星',
    '5': '五星'
};
//CRM变量
var CrmJson = {
    'offlineOnline': commonJson.offlineOnline,//判断是否联网 online 联网
    'moduleID': '46',//模块编号
    'tranId': '47',//交易编号
    'operatorNo': commonJson.adminCount,//操作员工号
    'orgId': commonJson.orgId,//操作员所属机构号
    'workAddress': commonJson.workAddress,//工作地址
    'deviceNo': commonJson.udId,//设备编号
    'param': ''//CRM参数
};
//控制菜单功能返回
var BackAttr = {
    'moduleID': '-1',
    'functionID': '-1'
};
//登陆后的功能菜单初次登陆缓存
var Menu = {
    'data': '',//菜单数据
    'init': false//菜单初始化标记
};
//登录变量
var loginAttr = {
    'proType': '-1'//产品类型

};

//信用卡申请进度数组
var pcardStatusObj = {
    '0': '申请中',
    '1': '申请中',
    '2': '审批中',
    '3': '审批通过',
    '4': '取消办卡',
    '5': '审批拒绝',
    '6': '审批通过制卡中',
    '7': '取消办卡',
    '8': '制卡成功',
    '-5': '待补件'
};
//信用卡申请进度数组
var pcardStatusObjj = {
    '00': '正常状态',
    '01': '待补件',
    '02': '补件成功'
};
//贷款申请进度数组
var daikuanpcardStatusObj = {
    '1': '贷款审批中',
    '2': '终审同意',
    '3': '终审否决'
};
//信用申请进度的申请类型数组
var paiTypeObj = {
    '1': '独立主卡',
    '2': '主附同申',
    '3': '独立附卡'
};

//信用卡 进度查询  数据对象
var applicationObj = {
    numIndex: '-1',
    responseCode: '',
    imageObj: {},     //照片路径对象
    videoable: '',     //视频路径对象
    isVideo: false,   //是否拍摄视频
    isPicture: false,  //是否拍摄照片
    picFileARR: [],
    pageIndex: 1     //分页查询当前页码
};
//贷款 进度查询  数据对象
var daikuanapplicationObj = {
    numIndex: '-1',
    responseCode: '',
    imageObj: {},     //照片路径对象
    videoable: '',     //视频路径对象
    isVideo: false,   //是否拍摄视频
    isPicture: false,  //是否拍摄照片
    picFileARR: [],
    apppicFileARR: [],//审批
    pageIndex: 1,     //分页查询当前页码
    custFileArr: [],  //客户资料数组
    approveFileArr: []  //审批资料数组

};

var daikuanapplicationObjon = new Array();


var jjPeriod = { //定投周期
    '': '',
    '0': '月',
    '1': '周',
    '2': '日'
};

var jjOverFlag = {//期满条件
    '': '',
    '0': '总投资次数',
    '1': '到期日',
    '2': '成功次数'
};
//我们的银行
var womendeyinhang = {
    markType: '01'//01-银行介绍／02品牌宣传／03客户活动／04关注我们
};
var
    offlineHANDLESTATEJson = {//脱机业务继续处理,业务处理状态
    '': '客户经理终止办理',
    '00': '处理中',//'初始化状态',
    '01': '联网核查成功',
    '02': '处理中',//'联网核查超时',
    '03': '联网核查失败',
    '04': '人脸识别成功',
    '05': '处理中',//'人脸识别超时',
    '06': '人脸识别失败',
    '07': '处理中',//'手工人脸识别通过',
    '08': '手工人脸识别不通过',
    '09': '核心信息成功',
    '10': '处理中',//'核心信息超时',
    '11': '核心信息失败',
    '12': '处理中',//'影像未上传',
    '13': '黑名单',
    '14': '操作员不存在',
    '15': '存在多个客户号',
    '16': '用户名称与核心不一致',
    '22': '处理成功'
};
var offlineBUSINESSTYPEJson = {//脱机业务继续处理,业务处理状态
    '01': '申请信用卡'
};
var PicWordCache = {//产品展页和我们的银行缓存数据
    'data': '',
    'init': false,
    'picdata': ''
};
//外汇牌价
var CCYJson = {
    '000': '人民币（RMB）',
    '344': '港币（HKD）',
    '840': '美元（USD）',
    '978': '欧元（EUR）'
};
//货币代号
var RTCYNOJson = {
    '01': '人民币（RMB）',
    '13': '港币（HKD）',
    '14': '美元（USD）',
    '15': '欧元（EUR）'
};
//存期
var RTPERDJson = {
    'M00': '六个月以内（含六个月）',
    'M06': '六个月至一年（含一年）',
    'Y03': '一年至三年（含三年）',
    'Y05': '三年至五年（含五年）',
    'Y99': '五年以上'
};


var jjStatus = {
    "": "",
    "0": "开放期",
    "1": "募集期",
    "2": "发行成功",
    "3": "发行失败",
    "4": "停止交易",
    "5": "停止申购",
    "6": "停止赎回",
    "7": "权益登记",
    "8": "红利发放",
    "9": "产品封闭期",
    "a": "产品终止",
    "b": "预约认购期"
};

/*基金产品说明书 named by lei.*/
var goldInsJson = {};
var downSideRisk = {
    "": '暂无',
    "L": '低风险',
    "B": '中低风险',
    "M": '中风险',
    "H": '高风险'
};
var xinyonfkaJsonone = {
    shijianChuo: ''
};
var xinyonfkaJson = {
    shijianChuo: '-1'
};

//续传影像模块数组
var moduleObj = {
    "20": '信用卡申请',
    "21": '信用卡补件',
    "23": '信通数字卡',
    "25": '电子渠道',
    "27": '理财签约',
    "28": '基金',
    "33": '脱机业务',
    '32': '暂存业务',
    // "46": '移动CRM',
    "56": '按揭贷款',
    "57": '贷款补件',
    "59": '视频拍摄',
    "62": '积分兑换',
    "63": '订单管理',
    "65": '社保待遇',
    "66": '特色产品',
    "69": '特惠商户',
    "71": '小微贷款',
    "72": '面签',
    "81": '信用贷款',
    "82": '信用贷款补件',
    "83": '小贷客户信息管理'

};
var attchTypeObj = {
    "0": '影像文件',
    "1": '签名文件',
    "2": '其他',
    "3": '身份文件',
    "4": '申请文件'
    
};
//筛选的数据2015-12-28－丁宗花
var citigoldSortData = {
    BianLiangPanDuan: '－1',//变量拿来判断是否是筛选
    CompanyName: '',//基金公司名称
    CitigoldType: '',//基金类型
    citigoldJingZhi: '',//基金净值
    inputTestCon: '',//基金代码
    CenXingPingJi: '',//辰星评级
    CenXingPingJiZhi: '',//辰星评级值
    CXFengxianXiShu: '',//辰星风险系数
    CXFengxianXiShuZhi: '',//辰星风险系数值
    TZHuiBaoLue: '',//投资回报率
    TZHuiBaoLueZhi: '',//投资回报率值
    TZHuiBaoLuePH: '',//投资回报率排行
    TZHuiBaoLuePHZhi: ''//投资回报率排行值
};
//身份证联网核查参数
var lianwanghechaData = {
    CheckResult: '',//联网核查结果
    ReviewUserId: '',//远程复核用户id
    dianzixinyongkaDX: ''//区分电子信用卡联网核查
};

//贷款
var loan = {
    moduleId: '52', //模块编号
    tranId: '56',  //按揭贷款交易编号
    tranId1: '53',  //人行征信交易编号
    tranId2: '54',  //银行对账单交易编号
    tranId3: '57',  //进度查询(按揭贷款)交易编号
    isCreditCusInfoInput: false,//个人征信新查询客户信息选择方式
    isCreditCusNo: false,  //个人征信新查询客户证件号码
    isCreditCusName: false,//个人征信新查询客户姓名
    isCreditAgree: false,  //个人征信新查询协议
    isCreditSign: false,    //个人征信新查询签名
    isBankCusInfoInput: true, //对账单新查询客户信息选择方式
    isBankCusNo: false,     //对账单新查询客户证件号码
    isBankCusName: false,     //对账单新查询客户姓名
    BTime: null,           //对账单新查询验证码时间
    getBankYZM: true,      //验证码
    xTel: '',//手机号
    creditErrRea: '',      //人行征信查询失败原因
    isCardT: false,        //卡账号加载完成
    headerTitle: '',      //
    applicationObj: {},
    isProRequest: true,
    isInputChange: false,  //输入字段的变化
    isMaster: true,
    isLoanMaster: true,    //当前界面情况
    mInfo: {
        isTrue: false,
        cFileStr: [],//征信文件
        MGCompareFace: false,
        isSignaData:false
    },
    gInfo: {
        isTrue: false,
        cFileStr: [],//征信文件
        MGCompareFace: false,
        isSignaData:false
    },
    creditInfo: {
    	accredit : '', //征信授权书文件路径
    	signature : '' //征信签名文件路径
    },
    inputLogo:false,
    MorG:'m',
    buildArr:[], // 房屋信息
    accountArr:[], //还款账号
    filePath:'',  //文件路径
    faceTalkRecode:'',//面谈笔录名字
    dzd:[],//对账单文件路径
    fdzd:[], //配偶对账单
	BUSER_NO:'' //用户唯一标识
};
/*贷款面签*/
var loanFaceSign = {
    moduleId: '52', //模块编号
    tranId: '72',  //交易编号
    isContractNo:false,//默认是读身份证的
    roleArrObj:[],//角色人数据对象
    noOption:[],//待验证的角色数组
    curOption:'0',//当前待验证的角色数组的索引
    curRoleNum:'',//当前待验证的角色编号  和 贷款面签客户角色一直
    curRole:'', // role+curRoleNum
    temp:{},//临时变量
    isCachePage: { isChoseT:false,isFacePic:false, isAudio: false, isScreenPic: false,isFirst:true},//缓存
    contractNo:'',//合同号
    groupRole:[],//角色添加
    groupOption:[] //分组
};

var idCardType = {/*面签证件类型*/
    'Ind01':'身份证',
    'Ind02':'户口簿',
    'Ind03':'护照',
    'Ind04':'军官证',//
    'Ind05':'士官证',//
    'Ind06':'港澳居民来往内地通证',//
    'Ind07':'台湾同胞来往内地通证',//
    'Ind08':'临时身份证',//
    'Ind09':'外国人居留证',//
    'Ind10':'警官证',//
    'Ind11':'其他个人证件',//
    'Ind12':'香港身份证',//
    'Ind13':'澳门身份证',//
    'Ind14':'台湾身份证',//
    'Ent01':'组织机构代码'
};
var roleType = {  //贷款面签客户角色
    '1':'主借人',
    '2':'共借人',
    '3':'保证人',
    '4':'抵质押人'
}
/*个人征信搜索证件类型*/
var certTypeObj = {
    '0': '身份证',
    '1': '户口本',
    '2': '护照',
    '3': '军官证',
    '4': '士兵证',
    '5': '港澳居民来往内地通行证',
    '6': '台湾同胞来往内地通行证',
    '7': '临时身份证',
    '8': '外国人居留证',
    '9': '警官证',
    'A': '香港身份证',
    'B': '澳门身份证',
    'C': '台湾身份证',
    'X': '其他证件'
};
/*对账单查询结果*/
var statusResultObj = {
    '0': '查询中',
    '-2': '失败',
    '1': '成功',
    '-1': '删除',
    '-3': '无流水'
};
/*征信查询结果*/
var creditStatusResult = {
    '0': '查询中',
    '-2': '失败',
    '1': '成功',
    '-1': '删除',
    '-3': 'LOS查询中',
    '3': 'LOS查询成功'
};
/*核心婚姻状况--->LOS*/
var MarIcbsToLos = {
    "": '10',   //默认未婚
    "1": '10',  //未婚
    "2": '21',  //已婚
    "3": '20',  //初婚
    "4": '40',  //再婚
    "5": '23',  //复婚
    "6": '30',  //丧偶
    "7": '22',  //离婚
    "*": '90'  //未说明婚姻状况
};
var MarIcbsToLosCHN = {
    '10':'未婚',
    '20':'已婚',
    '21':'已婚',
    '22':'离异',
    '23':'已婚',
    '30':'离异',
    '40':'已婚',
    '90':'其他'
}
var loanSexJson = {
    '男': '1',
    '女': '0'
};
var smallLoanSexJson = {
    '男': '1',
    '女': '2'
};
var dwellingStatus = {  //现住房性质
    '1':'自有',
    '2':'自有',
    '3':'其他',
    '4':'其他',
    '5':'租赁',
    '6':'共有',
    '7':'其他',
    '9':'其他'
}
var horseType = {  //房屋状态
    '02':'现楼',
    '01':'预售',
    '03':'二手楼'
}
var horseTo ={ //房屋用途---面谈笔录
    '1':'自住',
    '2':'改善型自住',
    '3':'出租',
    '4':'投资',
    '5':'其他'
}
var Loanhorse = {//房屋用途---贷款申请表
    '1':'自住',
    '2':'自住',
    '3':'非自住',
    '4':'非自住',
    '5':'非自住'
}
var minorChildren = {  //未成年子女
    '1':'有',
    '0':'无'
}
var headship = {  //工作职位
    '1':'高级领导',
    '2':'中级领导',
    '3':'一般员工',
    '4':'其他',
    '9':'未知'
}
var maxXL = {  //最高学历
    '10':'研究生及以上',
    '20':'本科',
    '30':'大专',
    '40':'其他',
    '50':'其他',
    '60':'其他',
    '70':'其他',
    '80':'其他',
    '90':'其他',
    '99':'其他'
}
var buildingType = {  //还款方式
    '1': '按月等额还本息',
    '2': '按月等额还本'
};
var loanCardVal = {
    '身份证':'0',
    '户口本':'1',
    '护照':'2',
    '军官证':'3',
    '士兵证':'4',
    '港澳居民来往内地通行证':'5',
    '台湾同胞来往内地通行证':'6',
    '临时身份证':'7',
    '外国人居留证':'8',
    '警官证':'9',
    '香港身份证':'A',
    '澳门身份证':'B',
    '台湾身份证':'C',
    '其他证件':'X'
}

var daikuanXINxi = {//0:icbs 1:平台 2:信用卡核心  3:los核心
    resource: '1'//记录状态
};
/**
 * 运营影像变量
 */
var ImagingOperaTions = {//运营影像变量
    moduleId: '58',//模块编号
    tranId: '59',//交易编号
    BUSSINESS_TYPE: '',//业务类型=> 01-开户（单位）(Y001)/02-购买理财（单位）(Y002)等等。。。。
    CLIENT_TYPE: '',//客户类型==>p个人／N单位
    DOCUMENT_TYPE: '',//证件类型==>0-身份证，1-户口本，2-护照
    DOCUMENT_ID: '',//证件号码
    CLIENT_NAME: '',//姓名
    PRODUCT_NAME: '',//产品名称
    PRODUCT_NO: ''//产品编号
};
var DOCUMENT_TYPE = {//营业执照
	'A':'工商营业执照',
	'B':'社会团体登记证书',
	'C':'民办非企业登记证书',
	'D':'驻在地主管部门同意设立临时机构批文',
	'E':'其他证件或文件'
};
var bussinessTypeImaging={
  'Y001':'开户',
  //'Y002':'购买理财(非个人)',
  'Y003':'其他',
  'Y004':'本人开户',
  'Y005':'代理开户',
  'Y006':'购买理财',
  'Y007':'购买保险',
  'Y008':'其他',
  'Y009':'代买理财'
};
var clientTypeImaging = {
    'P': '个人',
    'N': '非个人'
};
var certTypeImaging = {
    '0': '身份证',
    '1': '户口簿',
    '2': '护照',
    '3': '军官证',
    '4': '士兵证',
    '5': '港澳居民来往内地通行证',
    '6': '台湾同胞来往内地通行证',

    '8': '外国人居留证',
    '9': '警官证',
    'L': '文职干部证',
    'X': '其它'
};
var currencyTypeImaging={
    "000": "人民币",
    "344": "港币",
    "840": "美元",
    "978": "欧元"
};
//特惠商户变量
var preferentialJson = {
    moduleID: '68',//模块编号
    tranId: '69'//交易编号
};
//商户类型
var MERCHANTTYPE = {
    "01": "餐饮类",
    "02": "消费购物类",
    "03": "首饰珠宝类",
    "04": "健康美容类",
    "05": "娱乐休闲类",
    "06": "商旅类",
    "07": "教育培训类",
    "08": "汽车服务类",
    "09": "线上服务类",
    "10": "其他类"
};
//便民签约变量
var convenienceContract = {
    whichPage : ''
}
//社保待遇变量
var socialSecurity = {
    storage : {},
    moduleId : '64',
    tranId : '65',
    ZJLX : '身份证'
}
//特色产品变量
var characteristicProduct = {
    moduleId : '64',
    tranId : '66'
}
//工作日志
var dailyLog = {
    isComplete : {
        '1' : '已完成',
        '0' : '已变更',
        '-1' : '未完成'
    }
}
// y 通用状态 true or false
var statusY = {
    isSpecial : false,  //判断是否为特殊产品（特色产品）
    isReadCardSucc : false, //读取身份证是否成功
    isPersonFaceSucc : false, //人脸比对成功
    isCachePic : false,//是否需要缓存照片
    hasQM : false, //是否签名
    hasYZM : false, //是否有输入验证码
    hasYDXY : false  //是否同意协议
}
// y 通用客户信息
var customerInfoY = {
    CLIENT_NO : '' ,//客户号
    MOBILEPHONE : '', //客户电话号码
    USER_NO : '', //用户唯一标识
    MSG_INFO : '',//动态口令
    signature : '',//用户签名链接
}
/*积分变量*/
var jifenJson = {
	"isModify": false, //修改是否回显
    "isOpen": false,    //开通情况回显
    "isAgree": false,    //协议回显
    "isPhoto": false,    //影像采集回显
    "userSign": false,
    "moduleId": "61",//模块编号
    "tranId": "62",
    "operatorNo": commonJson.adminCount,//操作员
    "deviceNo": commonJson.udId, //设备编号
    "picFileARR": [],//要打包的影像路径
    "USER_NO": ''
};
var orderStatus = {
	'0': '待处理',
	'1': '已取消',
	'2': '已下单',
	'3': '已收货',
	'4': '退货待审核',
	'5': '退货审核未通过',
	'6': '已退货'
};
var orderOperate = {
	'1': '收货确认',
	'2': '取消订单',
	'3': '礼品退货'
};
var jifenCompleteTitle = {
	'gift1': '礼品兑换成功，感谢您对我行的支持！',
	'gift2': '预定成功，积分已扣减，请于一周内至约定网点领取礼品！<br/>感谢您对我行的支持！',
	'order1': '收货确认成功，期待您的再次光临！',
	'order2': '订单取消成功，扣除的积分已返回至您的积分账户！',
	'order3': '退货成功，扣除的积分已返回至您的积分账户！'
};
var smallLoan = {
    moduleId: '52', //模块编号
    tranId: '71',  //交易编号
    USER_NO: '', //用户唯一标识
    applicationObj: {},
    mInfo: {},
    SCORE_CARD_ID: '',//评分卡编号
    smallLoanScorePdfObjon: [],//评分完成后存储生成pdf所需的值
    IsNeedScore: ''//是否需要评分
    
};

var acctSort = {
    'A': '支票户',
    'B': '存折户'
};
var lastAcctStatus = {
    '1': '正常',
    '2': '已清除',
    '3': '不允许借记',
    '4': '已销户',
    '5': '久悬户',
    '6': '本月新开户',
    '7': '不允许借贷记',
    '8': '死亡户'
};
var smallLoanHeadShip = {
    '01': '法人代表',
    '02': '董事长',
    '03': '总经理',
    '04': '财务负责人',
    '05': '授权经办人',
    '06': '部门经理',
    '07': '董事',
    '08': '监事'
};
var smallLoanPaymentMethod = {
    '1': '按月等额本息',
    '2': '按月付息到期还本',
    '3': '其他'
};
var smallLoanMarriage = {
    '10': '未婚',
    '20': '已婚有子女',
    '21': '已婚无子女',
    '22': '再婚',
    '30': '丧偶',
    '40': '离婚'
};
var smallLoanStatusObj = {
    "1": "新申请",
    "2": "申请待分配",
    "3": "废弃",
    "4": "自动初审拒绝",
    "5": "申请待调查",
    "6": "申请待审查",
    "7": "自动评审拒绝",
    "8": "申请审核拒绝",
    "9": "放款准备",
    "10": "待放款审批",
    "11": "放款拒绝",
    "12": "等待支付",
    "13": "贷款期",
    "14": "结清",
    "15": "注销",
    "16": "超时拒绝",
    "17": "客户经理建议拒绝",
    "18": "审贷会建议拒绝"
};
//信用贷款开始
//职业
var _occupListObj = {
		"000": "国家党政机关、事业单位负责人",
	    "001": "IT/网络/计算机工程技术人员",
	    "003": "国家和地方公务员、事业单位工作人员",
	    "004": "商业/贸易从业人员",
	    "005": "旅游/餐饮/娱乐/体育从业人员",
	    "006": "农、林、牧、渔生产人员",
	    "007": "生产制造从业人员",
	    "024": "军人、警察、武警",
	    "025": "未知",
	    "026": "不便分类的其他从业人员"
};
var _marriageListObj = {
	    '01-未婚或离异': '未婚或离异',
	    '02-已婚无子女': '已婚无子女',
	    '03-已婚有子女': '已婚有子女'
};
var __marriageListObj = {
	    'WEH': '01-未婚或离异',
	    'YHY': '03-已婚有子女',
	    'YHW': '02-已婚无子女'
};
var _officeListObj = {
	  '1':'高级领导(行政级别局级局级以上领导或大公司高级管理人员)',
      '2':'中级领导(行政级别局级以下领导或大公司中级管理人员)',
      '3':'一般员工',
      '4':'其他',
      '9':'未知'
};
var _wyType = {
	  '10':'深房第字',
      '11':'粤不动产权',
      '12':'无房产证',
      '13':'无物业'
};
var __wyType = {
		'SFDZ':'10',
      'YBDQ':'11',
      'WFCZ':'12',
      'WWYE':'13'
};
var _wyDyStatus = {
		'10':'未抵押',
      '11':'已抵押'
};
var __wyDyStatus = {
		'WDY':'10',
      'YDY':'11'
};
var _paymentMethod = {
	  '1':'按月等额还本息',
      '2':'按月等额还本金',
      '3':'按月付息到期还本',
      '4':'按月定额(1.5%)还本金'
};
var _pictureClass = {
	'0':'cusFacePic',//客户面部照片
	'1':'custAndCustOwnerPic',//与客户合影照片
	'2':'frontIDCardMPic',//身份证正面
	'3':'backIDCardMPic',//身份证反面
	'4':'fangchanzhengming',//房产证明
	'5':'bankstatements',//银行对账单
	'6':'marryzhengming'//婚姻证明
};
var _pictureClassName = {
	'0':'客户面部照片',
	'1':'与客户合影照片',
	'2':'身份证正面',
	'3':'身份证反面',
	'4':'房产证明',
	'5':'银行对账单',
	'6':'婚姻证明'
}
var _eduExp = {
	'10':'研究生',
	'20':'大学本科',
	'30':'大学专科',
	'40':'中专/中等校',
	'50':'技术学校',
	'60':'高中',
	'70':'初中',
	'80':'小学',
	'90':'文盲或半盲',
	'99':'未知'
};
var _cuzgxw = {
		'01':'名誉博士',
		'02':'博士',
		'03':'硕士',
		'04':'学士',
		'09':'未知',
		'99':'其他'
};
var _industry = {
		'A':'农、林、牧、渔业',
		'B':'采矿业',
		'C':'制造业',
		'D':'电力、热力、燃气及水生产和供应业',
		'E':'建筑业',
		'F':'批发和零售业',
		'G':'交通运输、仓储和邮政业',
		'H':'住宿、餐饮业',
		'I':'信息传输、软件和信息技术服务业',
		'J':'金融业',
		'K':'房地产业',
		'L':'租赁和商务服务业',
		'M':'科学研究和技术服务业',
		'N':'水利、环境和公共设施管理',
		'O':'居民服务、修理和其他服务',
		'P':'教育',
		'Q':'卫生和社会工作',
		'R':'文化、体育和娱乐业',
		'S':'公共管理、社会保障和社会组织',
		'T':'国际组织',
		'Z':'未知'
	};
var _position = {
		'01':'无',
		'02':'高级',
		'03':'中级',
		'04':'初级',
		'99':'未知'
};
var _dwellingStatus = {
		'1':'自置',
		'2':'按揭',
		'3':'亲属楼宇',
		'4':'集体宿舍',
		'5':'租房',
		'6':'共有住宅',
		'7':'其他',
		'9':'未知'
};
var _oIncomeSrc = {
	'01-租金':'租金',
	'02-分红':'分红',
	'03-经营':'经营',
	'04-其他':'其他'
};
var _loanUsage = {
		'0':'经营周转',
		'1':'消费',
		'2':'其他'
	};
var _creditLoanTemp = {
		'sex':'01-男',
		'age':'36',
		'household_register':'01-深户',
		'marriage':'02-已婚无子女',
		'occupation_type':'01-公职人员',
		'post':'01-正处级',
		'in_the_unit_to_pay_social_security_months':'60',
		'property':'02-有有房产，未抵押\/抵押在他行',
		'with_a_history_of_loans_and_credit':'01-有',
		'cumulative_number_of_overdue_loans_24_months':'0',
		'the_maximum_number_of_overdue_loans_24_months':'0',
		'credit_card_records_in_24_months':'0',
		'credit_card_24_overdue_in_24_months':'0',
		'credit_card_24_months_overdue_number_of_times':'0',
		'overdue_in_6_months':'0',
		'query_times_in_6_months':'0',
		'license_mortgage_in_our_bank':'0',
		'license_no_mortgage_mortgage_area_less_then_40':'0',
		'non_complete_property_or_in_the_delivery_room':'0',
		'whether_a_co_applicant':'02-否',
		'whether_providing_security':'02-否',
		'other_sources_of_income':'02-分红',
		'whether_the_borrower_bad':'02-否'
	};
//信用贷款结束

//信用贷款 进度查询  数据对象
var creditloanapplicationObj = {
    numIndex: '-1',
    responseCode: '',
    transId:'82',
    menuId: '81',
    imageObj: {},     //照片路径对象
    videoable: '',     //视频路径对象
    isVideo: false,   //是否拍摄视频
    isPicture: false,  //是否拍摄照片
    picFileARR: [],
    apppicFileARR: [],//审批
    pageIndex: 1,     //分页查询当前页码
    custFileArr: [],  //客户资料数组
    approveFileArr: []  //审批资料数组

}

//征信类型
var creditTypeJson = {
	'RH': '人行',
	'PY': '鹏元'
}

//是或否
var yesOrNoJson = {
	'1': '是',
	'0': '否'
}
var usrStatistic = {
		'offlineCount':'0',
		'isSucess':'0',
		'noticeCount':'0',
		'alertAry':[]
}

//小贷客户信息管理
var smallLoanCusManJson = {
    moduleId: '52', //模块编号
    tranId: '84',  //交易编号
    USER_NO: '', //用户唯一标识
    businessType: '2',//查询业务类型
    state:'1,2,5,6,9',//查询可补签的状态
    applicationObj: {},
    mInfo: {},
    responseCode: '',//
    index: '0',
    role:''//小贷客户信息角色，平台生成签名用
    
};

//小贷客户信息管理角色
var smallLoanCusType = {
	'2': 'JieKuan',
	'3': 'DanBao'
};

//小贷客户信息管理客户类型对应
var smallLoanCustomerType = {
	'1': '个体工商户',
	'2': '个人',
	'3': '小企业'
};

//小贷申请房产情况类型
var smallLoanhoueproperty = {
	'1': '商品房',
	'2': '小产权',
	'3': '无房产'
};

//
var smallLoanPaymentMethodTwo = {
    '1': '按月',
    '2': '按季',
    '3': '其他'
};