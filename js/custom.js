'use strict';

$(document).ready(function(){
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
        for(let i = 0; i < 500; i++){
            let circle = {
                r : 2*Math.random(),
                x : canvas.width* Math.random(),
                y : canvas.height * Math.pow(Math.random(), 2),
                a : Math.random(),
                tx : 0,
                ty : 0,
            };
            circles.push(circle);
        }

        let range = 100;
        let redraw = function(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for(let i = 0; i < circles.length; i++){
                let val = Math.random() > .5 ? 2 : -2;
                if(circles[i].tx + val <= range && circles[i].tx + val >= -range){
                    circles[i].tx += val;
                }else{
                    circles[i].tx -= val;
                }

                if(circles[i].ty + val <= range && circles[i].ty + val >= -range){
                    circles[i].ty += val;
                }else{
                    circles[i].ty -= val;
                }
                ctx.beginPath();
                ctx.arc(circles[i].x + circles[i].tx, circles[i].y + circles[i].ty, circles[i].r, 
                        0, 2 * Math.PI, false);
                ctx.fillStyle = "rgba(255, 255, 255, " + circles[i].a + ")";
                ctx.fill();
            }
        };
        redraw();

        setInterval(redraw, 50);
    })
})