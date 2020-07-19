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
                y : canvas.height * Math.random(),
                a : Math.random()
            };
            circles.push(circle);
        }
        for(let i = 0; i < circles.length; i++){
            ctx.beginPath();
            ctx.arc(circles[i].x, circles[i].y, circles[i].r, 0, 2 * Math.PI, false);
            ctx.fillStyle = "rgba(255, 255, 255, " + circles[i].a + ")";
            ctx.fill();
        }

    })
})