$(function () {
    var $audio=$("audio");
    var player=new Player($audio);


    $("body").delegate(".song ul li","mouseenter",function () {
        $(this).find(".list").stop().fadeIn(100);
        $(this).find(".info_four>a").stop().fadeIn(100);
        $(this).find(".info_four>span").stop().fadeOut(100);
    });

    $("body").delegate(".song ul li","mouseleave",function () {
        $(this).find(".list").stop().fadeOut(100);
        $(this).find(".info_four>a").stop().fadeOut(100);
        $(this).find(".info_four>span").stop().fadeIn(100);
    });

    $("body").delegate(".info_one span","click",function () {
        $(this).toggleClass("check");
    });


    $("body").delegate(".list_play","click",function () {
        $(this).toggleClass("list_play2");
        var i=$(this).parents(".musiclist");
        i.siblings().find(".list_play").removeClass("list_play2");
        i.find(".number").toggleClass("number2");
        i.siblings().find(".number").removeClass("number2");

        for(var j=0;j<player.musicList.length;j++){
            if(player.musicList[j].name==i.find(".songname").text()){
                $(".song_singer").text(player.musicList[j].name+'/'+player.musicList[j].singer);
                $(".song_time").text('00:00/'+player.musicList[j].time);
                $(".detail_one").text('歌曲名称：'+player.musicList[j].name);
                $(".detail_two").text('歌手名：'+player.musicList[j].singer);
                $(".detail_three").text('专辑名：'+player.musicList[j].album);
                $(".album_image").attr("src",player.musicList[j].cover);
                $(".mask_bg").css({"background":"url("+player.musicList[j].cover+") no-repeat","background-size":"cover"});
            }
        }



        if($(this).attr("class").indexOf("list_play2") >0 ){
            $(".play1").addClass("play2");
        }else {
            $(".play1").removeClass("play2");
            i.siblings().find(".number").removeClass("number2");
        }

        player.playMusic(i.get(0).index,i.get(0).ele);
    });

    //上一首点击
    $(".pre").click(function () {

        $(".musiclist").eq(player.preIndex()).find(".list_play").trigger("click");
    });
    //下一首点击

    $(".next").click(function () {
        $(".musiclist").eq(player.nextIndex()).find(".list_play").trigger("click");
    });
    //播放按钮点击
    $(".play1").click(function () {
        if(player.currentIndex == -1){
            //没有播放过音乐
            $(".musiclist").eq(0).find(".list_play").trigger("click");
        }else{
            //播放过音乐
            $(".musiclist").eq(player.currentIndex).find(".list_play").trigger("click");

        }

    });

    $("body").delegate(".musicdel","click",function () {
        var i=$(this).parents(".musiclist");
        if(i.get(0).index == player.currentIndex){
           $(".next").trigger("click");
        }
        i.remove();
        player.changemusic(i.get(0).index);

        //重新排序
        $(".musiclist").each(function (index,ele) {
            ele.index=index;
            $(ele).find(".number").text(index+1);
        })

    });








    //加载歌曲列表
    getPlayList();
    function getPlayList() {
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success: function (data) {
                player.musicList=data;
                var $musicList=$(".song ul");
                $.each(data,function (index,ele) {
                    var item=creatItem(index,ele);
                    $musicList.append(item);

                });
            },
            error: function (e) {
                console.log(e);
            }
        });

    }

    function creatItem(index, ele) {
        var item = $("<li class='musiclist'> <div class=\"info_one\"><span></span></div>\n" +
            "                    <div class=\"number\">" + (index + 1) + "</div>\n" +
            "                    <div class=\"info_two\">" + "<span class=\"songname\">"+ele.name + "</span>\n" +
            "                        <div class=\"list\">\n" +
            "                            <a href=\"#\" title=\"播放\" class='list_play'></a>\n" +
            "                            <a href=\"#\" title=\"添加\"></a>\n" +
            "                            <a href=\"#\" title=\"下载\"></a>\n" +
            "                            <a href=\"#\" title=\"分享\"></a>\n" +
            "                        </div></div>\n" +
            "                    <div class=\"info_three\">" + ele.singer + "</div>\n" +
            "                    <div class=\"info_four\">\n" +
            "                        <a href=\"#\" title=\"删除\" class='musicdel'></a>\n" +
            "                        <span class=\"songtime\">" + ele.time + "</span>\n" +
            "                    </div>\n" +
            "                </li>")
        item.get(0).index=index;
        item.get(0).ele=ele;
        return item;

    }




});








