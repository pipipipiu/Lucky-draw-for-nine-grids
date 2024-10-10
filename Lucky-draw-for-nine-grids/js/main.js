/**
* 2016-1-20
* by @oulafen
* */
Zepto(function () {
    //获取用户信息
    getUserInfo();
   initPage();
    //create a new instance of shake.js.
    var myShakeEvent = new Shake({
        threshold: 15
    });
    // start listening to device motion
    myShakeEvent.start();
    // register a shake event
    window.addEventListener('shake', shakeEventDidOccur, false);
});

let activityId='-1'
let skyId=''
let token=''
let baseUrl =location.href.substring(0, location.href.indexOf('/nsns-plat-h5'))
// let baseUrl ='http://172.16.4.23:7015'
function shakeEventDidOccur(){
    if (!lottery.rolling) {
        lottery.start();
    }
    return false;
}

function initPage(){
    lottery.init('lottery');

    $('.J-again-btn').on('tap',function(){
        notice.hide();
        window.addEventListener('shake', shakeEventDidOccur, false);
    });

    $('.J-achieve-btn').on('tap',function(){
        notice.hide();
        $('.J-achieve-tip').show();
    });

    $('.J-share-btn').on('tap',function(){
        notice.hide();
        $('.J-share-tip').show();
    });
    $('.top-right').on('tap',function(){
        //console.log('点击历史记录')
        // fetch(`${baseUrl}/nsns-member-mall-server/prize/record.do`,{
        //     method: "POST",
        //     body: JSON.stringify({'skyId':skyId,'activityId':activityId}),
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'userId':skyId,
        //         'token':token
        //     }})
        //     .then(response => response.json())
        //     .then(data => {
        //         //console.log("---------------------",data)
        //         if(data['code']=='2000')
        //         {
        //              //console.log(data.data)
        //             let recordVoList =data.data['recordVoList']
        //             let historyListEle=document.getElementById('historyList')
        //             //console.log(recordVoList,historyListEle)
        //              let htmlEle = `<div  class="historyList">${recordVoList.map(t=>{
        //                     return `<div class="historyUnit">
        //                     <p class="historyUnitText" >${t['prizeVo']['prizeName']}</p>
        //                      <p  class="historyUnitText" style="top:calc(170 / 210 * 100%);font-size: 0.6rem">抽奖时间：${t['deliveryTime']}</p>
        //                         </div>`
        //                 }
        //             )}</div>`
        //             //console.log(htmlEle)
        //             historyListEle.insertAdjacentHTML('beforeend', htmlEle);
        //
        //             $('.J-share-tip').show();
        //         }
        //         else
        //         {
        //             alert(data['msg'])
        //         }
        //     })
        $('.J-share-tip').show();
    });

}
function getUserInfo(){
    const userInfo = getQuerys(location.href)
   if(!!userInfo)
   {
       skyId=userInfo['skyId'];
       token=userInfo['token'];
       prizeActivity(skyId,token)
   }
   else{
       alert("请从官方入口进入")
   }
}
function prizeActivity(skyId,token){
    // fetch(`${baseUrl}/nsns-member-mall-server/prize/activity.do`,{
    //     method: "POST",
    //     body: JSON.stringify({'skyId':skyId}),
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'userId':skyId,
    //         'token':token
    //     }})
    //     .then(response => response.json())
    //     .then(data => {
    //         //console.log("---------------------",data)
    //         if(data['code']=='2000')
    //         {
    //             let prizeVoList = data.data['prizeVoList'].sort((a, b) => a.prizeId - b.prizeId)
    //             prizeVoList.map((t,index)=>{
    //                 prize[index]['title']=t['prizeName'];
    //                 prize[index]['desc-html']=t['desc-html']= `<p class="title-2">${t['prizeName']}</p>`
    //                 prize[index]['prize-img'] = `<img class="prize-img" src=${t['prizeIcon']}>`;
    //                 prize[index]['prizeId'] =t['prizeId'];;
    //                 const ele =document.getElementsByClassName('lottery-unit-'+index)
    //                 ele[0].style.backgroundImage=`url("${t['prizeIcon']}")`;
    //                 ele[0].style. backgroundPositionY=`0%`;
    //                 const eleText =document.getElementById('text-unit-'+index)
    //                 eleText.innerText=t['prizeName'];
    //             })
    //             //console.log(prize)
    //             const leftTimes =document.getElementById('leftTimes');
    //             leftTimes.innerText=data.data['leftTimes'];
    //             activityId=data.data['activityId'];
        //     }
        //     else{
        //         alert(data['msg'])
        //     }
        // })
    let prizeVoList = prizeVoListTemp.sort((a, b) => a.prizeId - b.prizeId)
    prizeVoList.map((t,index)=>{
        prize[index]['title']=t['prizeName'];
        prize[index]['desc-html']=t['desc-html']= `<p class="title-2">${t['prizeName']}</p>`
        prize[index]['prize-img'] = `<img class="prize-img" src=${t['prizeIcon']}>`;
        prize[index]['prizeId'] =t['prizeId'];;
        const ele =document.getElementsByClassName('lottery-unit-'+index)
        ele[0].style.backgroundImage=`url("${t['prizeIcon']}")`;
        ele[0].style. backgroundPositionY=`0%`;
        const eleText =document.getElementById('text-unit-'+index)
        eleText.innerText=t['prizeName'];
    })
    const leftTimes =document.getElementById('leftTimes');
    leftTimes.innerText=100;
    // activityId=data.data['activityId'];
}
var lottery = {
    index: -1,	//当前转动到哪个位置，起点位置
    count: 0,	//总共有多少个位置
    timer: 0,	//setTimeout的ID，用clearTimeout清除
    speed: 20,	//初始转动速度
    times: 0,	//转动次数
    cycle: 50,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize: -1,	//中奖位置
    rolling: false,  //记录在转奖的状态
    init: function (id) {
        if ($("#" + id).find(".lottery-unit").length > 0) {
            $lottery = $("#" + id);
            $units = $lottery.find(".lottery-unit");
            this.obj = $lottery;
            this.count = $units.length;
            $lottery.find(".lottery-unit-" + this.index).addClass("active");
        }
    },
    roll: function () {
        var index = this.index;
        var count = this.count;
        var lottery = this.obj;
        $(lottery).find(".lottery-unit-" + index).removeClass("active");
        index += 1;
        if (index > count - 1) {
            index = 0;
        }
        $(lottery).find(".lottery-unit-" + index).addClass("active");
        this.index = index;
        return false;
    },

    stop: function () {
        clearTimeout(lottery.timer);
        notice.show();

        lottery.prize = -1;
        lottery.times = 0;
        lottery.rolling = false;

        window.removeEventListener('shake', shakeEventDidOccur, false);
    },

    start: function(){
        //console.log('开始抽奖')
        const leftTimes =document.getElementById('leftTimes');
        if(leftTimes.innerText==='0')
        {
            alert("今日次数已达上限");
            return;
        }
        // fetch(`${baseUrl}/nsns-member-mall-server//prize/draw.do`,{
        //     method: "POST",
        //     body: JSON.stringify({'skyId':skyId,'activityId':activityId}),
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'userId':skyId,
        //         'token':token
        //     }})
        //     .then(response => response.json())
        //     .then(data => {
        //         //console.log("---------------------",data)
        //         if(data['code']=='2000')
        //         {
        //             winningPosition=prize.findIndex(t=>t['prizeId']==data.data['prizeVo']['prizeId'])
        //             //console.log(winningPosition)
        //             this.speed = 20;
        //             roll();
        //             this.rolling = true;
        //             const leftTimes =document.getElementById('leftTimes');
        //             leftTimes.innerText=Number(leftTimes.innerText)-1
        //         }
        //          else{
        //             alert(data['msg'])
        //         }
        //     })
        winningPosition= Math.random() * (lottery.count) | 0;
        console.log(winningPosition)
        this.speed = 20;
        roll();
        this.rolling = true;
        leftTimes.innerText=Number(leftTimes.innerText)-1
    }
};
let winningPosition=-1
function roll() {
    lottery.times += 1;
    lottery.roll();
    if (lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
        lottery.stop();
    } else {
        if (lottery.times < lottery.cycle) {
            lottery.speed -= 10;
        } else if (lottery.times == lottery.cycle) {
            // var index = Math.random() * (lottery.count) | 0;
            lottery.prize = winningPosition;
            notice.setContent();
        } else {
            if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                lottery.speed += 110;
            } else {
                lottery.speed += 20;
            }
        }
        if (lottery.speed < 40) {
            lottery.speed = 40;
        }
        lottery.timer = setTimeout(roll, lottery.speed);
    }
    return false;
}

var notice = {
    show: function () {
        var status = prize[lottery.prize]['status'];
        this.hide();

        setTimeout(function(){
            $('.J-' + status + '-tip').show();
        },1000);
    },
    hide: function () {
        $('.tip-box').hide();
    },
    setContent : function(){
        //console.log(lottery.prize)
        var status = prize[lottery.prize]['status'];

        $('.J-' + status + '-tip .' + status + '-box').empty().append(prize[lottery.prize]['prize-img']);
        $('.J-' + status + '-tip .desc-box').empty().append(prize[lottery.prize]['desc-html']);
    }
};

const prizeVoListTemp=[
    {
        "prizeId": "1",
        "prizeName": "一等奖",
        "prizeIcon": "https://zytvcdn.51mrp.com/group1/M01/00/6D/CsADhWbzgSSAf4OIAADWr3jFOdw752.jpg",
        "desc-html": "<p class=\"title-2\">一等奖</p>"
    },
    {
        "prizeId": "2",
        "prizeName": "二等奖",
        "prizeIcon": "https://zytvcdn.51mrp.com/group1/M01/00/6D/CsADhWbzgSSAf4OIAADWr3jFOdw752.jpg",
        "desc-html": "<p class=\"title-2\">二等奖</p>"
    },
    {
        "prizeId": "3",
        "prizeName": "三等奖",
        "prizeIcon": "https://zytvcdn.51mrp.com/group1/M01/00/6D/CsADhWbzgSSAf4OIAADWr3jFOdw752.jpg",
        "desc-html": "<p class=\"title-2\">三等奖</p>"
    },
    {
        "prizeId": "4",
        "prizeName": "四等奖",
        "prizeIcon": "https://zytvcdn.51mrp.com/group1/M01/00/4E/CsADhWUJD9WAE4v7AAA3PAFPuFk107.png",
        "desc-html": "<p class=\"title-2\">四等奖</p>"
    },
    {
        "prizeId": "5",
        "prizeName": "谢谢参与",
        "prizeIcon": "https://zytvcdn.51mrp.com/group1/M01/00/6C/CsADhWbxJxCAYBJVAABx5AgJplI135.png",
        "desc-html": "<p class=\"title-2\">谢谢参与</p>"
    },
    {
        "prizeId": "6",
        "prizeName": "五等奖",
        "prizeIcon": "https://zytvcdn.51mrp.com/group1/M01/00/4E/CsADhWUJC8yAexLdAAAvWFqLiSo157.png",
        "desc-html": "<p class=\"title-2\">五等奖</p>"
    },
    {
        "prizeId": "7",
        "prizeName": "六等奖",
        "prizeIcon": "https://zytvcdn.51mrp.com/group1/M01/00/6D/CsADhWbzgR6AeVhpAABAiVfW2IQ569.jpg",
        "desc-html": "<p class=\"title-2\">六等奖</p>"
    },
    {
        "prizeId": "9",
        "prizeName": "七等奖",
        "prizeIcon": "https://zytvcdn.51mrp.com/group1/M01/00/6D/CsADhWbzgR6AeVhpAABAiVfW2IQ569.jpg",
        "desc-html": "<p class=\"title-2\">七等奖</p>"
    }
]

var prize = [{
        'status': 'prize',
        'title': '一等奖',
        'desc': '一等奖',
        'prize-img': '<img class="prize-img" src="">',
        'desc-html': '<p>获得<span class="warning">“一等奖”</span></p>'
    },
   {
       'status': 'prize',
       'title': '一等奖',
       'desc': '一等奖',
       'prize-img': '<img class="prize-img" src="">',
       'desc-html': '<p>获得<span class="warning">“一等奖”</span></p>'
    },
   {
       'status': 'prize',
       'title': '一等奖',
       'desc': '一等奖',
       'prize-img': '<img class="prize-img" src="">',
       'desc-html': '<p>获得<span class="warning">“一等奖”</span></p>'
    },
    {
        'status': 'prize',
        'title': '一等奖',
        'desc': '一等奖',
        'prize-img': '<img class="prize-img" src="">',
        'desc-html': '<p>获得<span class="warning">“一等奖”</span></p>'
    },
    {
        'status': 'prize',
        'title': '一等奖',
        'desc': '一等奖',
        'prize-img': '<img class="prize-img" src="">',
        'desc-html': '<p>获得<span class="warning">“一等奖”</span></p>'
    },
    {
        'status': 'prize',
        'title': '一等奖',
        'desc': '一等奖',
        'prize-img': '<img class="prize-img" src="">',
        'desc-html': '<p>获得<span class="warning">“一等奖”</span></p>'
    },
   {
       'status': 'prize',
       'title': '一等奖',
       'desc': '一等奖',
       'prize-img': '<img class="prize-img" src="">',
       'desc-html': '<p>获得<span class="warning">“一等奖”</span></p>'
    },
    {
        'status': 'prize',
        'title': '一等奖',
        'desc': '一等奖',
        'prize-img': '<img class="prize-img" src="">',
        'desc-html': '<p>获得<span class="warning">“一等奖”</span></p>'
    }
]

function getQuerys(e) {
    if (!e) return "";
    var t = {},
        r = [],
        n = "",
        a = "";
    try {
        var i = [];
        if (e.indexOf("?") >= 0 && (i = e.substring(e.indexOf("?") + 1, e.length).split("&")), i.length > 0) for (var o in i) n = (r = i[o].split("="))[0],
            a = r[1],
            t[n] = a
    } catch(s) {
        t = {}
    }
    return t
}


