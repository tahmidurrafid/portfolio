'use strict';

function dp(hand, depth, str){
    if(depth == 5)
        return;
    for(let key in hand){
        if(hand[key] instanceof Curve){
            console.log(str);
            console.log(hand[key]);
        }else{
            dp(hand[key], depth+1, str + "." + key);
        }
    }
}

$(document).ready(function(){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.lineWidth = 6;
    let hand = new StickMan();
    let inter;
    function setIt(){
        inter = setInterval(
            function(e){
                ctx.clearRect(0,0,800, 800);
                e.show(ctx);
            } , 25, hand );
    }

    setIt();

});
