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
        let range = 200;
        let frames = 100;

        for(let i = 0; i < 500; i++){
            let circle = {
                r : 2*Math.random(),
                x : canvas.width* Math.random(),
                y : canvas.height * Math.pow(Math.random(), 2),
                a : Math.random(),
                tx : 0,
                ty : 0,
                frames : 0
            };
            circle.tx = circle.x + range*Math.random() - range/2;
            circle.ty = circle.y + range*Math.random() - range/2;
            circles.push(circle);
        }
        let redraw = function(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
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