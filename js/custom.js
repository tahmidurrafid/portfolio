'use strict';

$(document).ready(function(){

    // $("#works, #about, #contact").hide();

    // $("#nav a").click(function(e){
    //     e.preventDefault();        
    //     let id = $(this).attr("href");
    //     $("#home, #works, #about, #contact").hide();
    //     $(id).show();
    // });



    $(window).load(function(){
        var selector = $(".treeset");

        var canvas = selector.find(".connector canvas")[0];
        canvas.width  = selector.find(".connector").width();
        canvas.height = selector.find(".connector").height();

        var ctx = selector.find(".connector canvas")[0].getContext('2d');
        var from = selector.find(".item_list .item.selected").position();
        var fromDim = {width : selector.find(".item_list .item.selected").width(), 
                    height : selector.find(".item_list .item.selected").height()};
        var canvasFrom = selector.find(".connector canvas").position();
        var arr = selector.find(".subtree.added .subitem");
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2; 
        var posFrom = {x : from.left + fromDim.width/2 - canvasFrom.left, y: from.top + fromDim.height - canvasFrom.top + 3};        
        ctx.beginPath();
        ctx.arc(posFrom.x, posFrom.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        for(var i = 0; i < arr.length; i++){
            ctx.beginPath();
            var to = arr.eq(i).position();
            var toDim = {width: arr.eq(i).outerWidth(true), height : arr.eq(i).height()};
            var posTo = {x : to.left + toDim.width/2 - canvasFrom.left, y : to.top - canvasFrom.top};
            ctx.moveTo(posFrom.x, posFrom.y)
            ctx.bezierCurveTo(posTo.x , posFrom.y + (posTo.y - posFrom.y)/2, 
                        posTo.x, posTo.y, posTo.x, posTo.y);
            ctx.stroke();
        }
    })


    $(window).load(function(){

        let canvas = document.getElementById("stars");
        window.addEventListener('resize', resizeCanvas, false);
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();

        var ctx = canvas.getContext("2d");

        let circles = [];
        let range = 200;
        let frames = 100;

        for(let i = 0; i < 300; i++){
            let circle = {
                r : 2*Math.random(),
                x : canvas.width* Math.random(),
                y : canvas.height * Math.pow(Math.random(), 2),
                a : Math.random()*.8,
                tx : 0,
                ty : 0,
                frames : 0
            };
            circle.tx = circle.x + range*Math.random() - range/2;
            circle.ty = circle.y + range*Math.random() - range/2;
            circles.push(circle);
        }

        let comet = {x : Math.random() * canvas.width , y : 1, size : 100, width: 2};

        let redraw = function(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if(comet.y <= canvas.height){
                let move = (comet.y/canvas.height)*10;
                move++;
                comet.x -= move;
                comet.y += move;
            }else{
                comet.y = 1;
                comet.x = Math.random() * canvas.width;
            }

            let grd = ctx.createLinearGradient( comet.x , comet.y , 
                                                comet.x + comet.size, comet.y - comet.size);        
            grd.addColorStop(0,"rgba(255,255,255, " + 
                    (canvas.height - comet.y)/canvas.height + ")");
            grd.addColorStop(1,"rgba(255,255,255, 0)");
            ctx.beginPath();
            ctx.moveTo( comet.x , comet.y );
            ctx.lineTo(comet.x + comet.size, comet.y - comet.size);
            ctx.lineTo(comet.x + comet.size + comet.width, comet.y - comet.size);
            ctx.lineTo(comet.x + comet.width, comet.y);
            ctx.moveTo( comet.x , comet.y );
            ctx.fillStyle = grd;
            ctx.fill();

            for(let i = 0; i < circles.length; i++){
                ctx.beginPath();
                ctx.arc(circles[i].x + ( circles[i].tx - circles[i].x)* circles[i].frames/frames, 
                        circles[i].y + ( circles[i].ty - circles[i].y)*circles[i].frames/frames, 
                        circles[i].r, 
                        0, 2 * Math.PI, false);
                ctx.fillStyle = "rgba(255, 255, 255, " + circles[i].a + ")";
                ctx.fill();
                if(circles[i].frames == frames){
                    circles[i].frames = 0;
                    let temp = circles[i].x;
                    circles[i].x = circles[i].tx;
                    circles[i].tx = temp;

                    temp = circles[i].y;
                    circles[i].y = circles[i].ty;
                    circles[i].ty = temp;
                }else{
                    circles[i].frames++;
                }

            }
        };
        redraw();

        setInterval(redraw, 50);
    })
})