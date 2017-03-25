/**
 * Created by lei on 5/3/16.
 * 该采集影像的方法 只适用于采集必拍图片
 */

var commonImageAcquisition = {
    imgSrc: '', //记录照片路径,
    curParentObj: '', //记录要删除的对象
    delImg: function (curParentObj, imgSrc, num) { //删除照片
        deletePhoto([imgSrc], function (msg) {
            curParentObj.find('.camera-pic').remove();
            curParentObj.find('.camera').show();
            curParentObj.find('.rephoto').html('必拍');
            $('.bigpic-review-box').animate({
                    opacity: '0'
                },
                200,
                function () {
                    $('.bigpic-review-box').hide();
                });
            //监测下一步是否可点击
            if (num != '') {
                var ind = 0;
                for (var i = 0; i < num; i++) {
                    if ($('.customer:eq(' + i + ')').find("img").length == 2) {
                        ind++;
                        if (ind >= num) {
                            $('.footter .previous:eq(1)').addClass('btn_next');
                        } else {
                            $('.footter .previous:eq(1)').removeClass('btn_next');
                        }
                    }
                }
            } else {  //如果传入的为空,则只要有一个即可点击
                var imgLen = $('.customerP .img_content').find('.camera-pic').length;  //拍摄图片的个数
                if (imgLen > 0) {
                    $('.footter .previous:eq(1)').addClass('btn_next');
                } else {
                    $('.footter .previous:eq(1)').removeClass('btn_next');
                }
            }

        }, function (err) {
        })

    },
    getImg: function (curParentObj, num, textHtml) { //拍照
        Meap.media('camera', curParentObj.attr('picName'), function (msg) {
            commonImageAcquisition.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.find('.camera-pic').remove();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');
            var ele = $('.img_box:last').find('.rephoto').text();
            if (textHtml != '' && textHtml != undefined) {
                if (curParentObj.find('.cameraMul').length > 0 && ele != '选拍，可多张拍摄') { //如果是其他证明
                    $('.customerP .img_content').append(textHtml).trigger("create");
                }
            }
            //监测下一步是否可点击
            if (num != '') {
                var ind = 0;
                for (var i = 0; i < num; i++) {
                    if ($('.customer:eq(' + i + ')').find("img").length == 2) {
                        ind++;
                        if (ind >= num) {
                            $('.footter .previous:eq(1)').addClass('btn_next');
                        } else {
                            $('.footter .previous:eq(1)').removeClass('btn_next');
                        }
                    }
                }
            } else {  //如果传入的为空,则只要有一个即可点击
                var imgLen = $('.customerP .img_content').find('.camera-pic').length;  //拍摄图片的个数
                if (imgLen > 0) {
                    $('.footter .previous:eq(1)').addClass('btn_next');
                } else {
                    $('.footter .previous:eq(1)').removeClass('btn_next');
                }
            }

        }, function (err) {
            showMsg(err);
        })
    },
    getFace: function (curParentObj, num, businessObj) {
        faceDistinguish('trans', function (msg) {
            commonImageAcquisition.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');
            businessObj.isCompress = false;    //影响对比标识
            if (num != '') {
                var ind = 0;
                for (var i = 0; i < num; i++) {
                    if ($('.customer:eq(' + i + ')').find("img").length == 2) {
                        ind++;
                        if (ind >= num) {
                            $('.footter .previous:eq(1)').addClass('btn_next');
                        } else {
                            $('.footter .previous:eq(1)').removeClass('btn_next');
                        }
                    }
                }
            } else {  //如果传入的为空,则只要有一个即可点击
                var imgLen = $('.customerP .img_content').find('.camera-pic').length;  //拍摄图片的个数
                if (imgLen > 0) {
                    $('.footter .previous:eq(1)').addClass('btn_next');
                } else {
                    $('.footter .previous:eq(1)').removeClass('btn_next');
                }
            }
        }, function (err) {
            showMsg(err);
        })
    },
    reGetImg: function (curParentObj, imgSrc, businessObj) { //重拍
        if (curParentObj.parent().hasClass('get-face')) {
            faceDistinguish('trans', function (returnGetMsg) {
                deletePhoto([imgSrc], function (returnDelMsg) {
                    commonImageAcquisition.imgSrc = returnGetMsg;
                    curParentObj.find('.camera-pic').attr('src', returnGetMsg);
                    $('.bigpic-review').html('<img src=' + returnGetMsg + ' height="100%">');
                    businessObj.isCompress = false;    //影响对比标识
                }, function (err) {

                })
            }, function (err) {
                showMsg('重拍失败');
            })
        } else {
            Meap.media('camera', curParentObj.attr('picName'), function (returnGetMsg) {
                imgSrc = curParentObj.find('.camera-pic').attr('src');
                deletePhoto([imgSrc], function (returnDelMsg) {
                    commonImageAcquisition.imgSrc = returnGetMsg;
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
    },
    addGetImg: function (curParentObj, num, textHtml) {   //TODO  这个是添加拍照盒子
        Meap.media('camera', curParentObj.attr('picName'), function (msg) {
            commonImageAcquisition.imgSrc = msg;
            curParentObj.find('.camera').hide();
            curParentObj.find('.camera-pic').remove();
            curParentObj.append('<img src="' + msg + '" width="100%" height="115px"  class="camera-pic">');
            curParentObj.find('.rephoto').text('重拍');
            var ele = $('.img_box:last').find('.rephoto').text();
            if (curParentObj.find('.cameraMul').length > 0 && ele != '选拍，可多张拍摄') { //如果是其他证明
                $('.customerP .img_content').append(textHtml).trigger("create");
            }
            //监测下一步是否可点击
            var imgLen = $('.customerP .img_content').find('.camera-pic').length;
            if (imgLen > 0) {
                $('.footter .previous:eq(0)').addClass('btn_next');
            } else {
                $('.footter .previous:eq(0)').removeClass('btn_next');
            }
        }, function (err) {
            showMsg(err);
        })
    },
    delImgBox:function (curParentObj, imgSrc, num) {  //TODO 删除图片 And 图片盒子
        deletePhoto([imgSrc], function (msg) {
            curParentObj.parent('.img_box').remove();  //删除盒子
            $('.bigpic-review-box').animate({
                    opacity: '0'
                },
                200,
                function () {
                    $('.bigpic-review-box').hide();
                });
            //监测下一步是否可点击
            if (num != '') {
                var ind = 0;
                for (var i = 0; i < num; i++) {
                    if ($('.customer:eq(' + i + ')').find("img").length == 2) {
                        ind++;
                        if (ind >= num) {
                            $('.footter .previous:eq(1)').addClass('btn_next');
                        } else {
                            $('.footter .previous:eq(1)').removeClass('btn_next');
                        }
                    }
                }
            } else {  //如果传入的为空,则只要有一个即可点击
                var imgLen = $('.customerP .img_content').find('.camera-pic').length;  //拍摄图片的个数
                if (imgLen > 0) {
                    $('.footter .previous:eq(0)').addClass('btn_next');
                } else {
                    $('.footter .previous:eq(0)').removeClass('btn_next');
                }
            }

        }, function (err) {
        })
    }
};