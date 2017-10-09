/*jslint browser: true*/
/*global $, jQuery, alert, console, window, document */

/*
 * This javascript file uses the Revealing Module Pattern to
 * protect its methods and fields.
 */


var topPos = 0;

$(document).ready(function () {
    "use strict";

    //launch functions
    DOMModule.init();
    starModule.init(10 * window.innerHeight * window.innerWidth / 100000,
        6,
        "rgba(255,230,230,0.8)");


    function animate() {
        //update the current scroll variable every frame
        topPos = $(window).scrollTop();

        //update the mountains position every frame
        mountainsModule.animate();

        //update the stars every frame
        starModule.animate();


        window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);


});


var DOMModule = (function () {
    "use strict";

    function init() {
        hamburgerMenu();
    }

    function hamburgerMenu() {
        $(".navigation__hamburger").on("click", function () {
            $(this).find("i").toggleClass("fa-bars").toggleClass("fa-times");
            $(".navigation__menu").fadeToggle(100);
        });

        $(".innermenu__item--link").on("click", function () {
            $(".navigation__hamburger").find("i").toggleClass("fa-bars").toggleClass("fa-times");
            $(".navigation__menu").fadeToggle(100);
        });
    }

    return {
        init: init
    };

}());

var mountainsModule = (function () {
    "use strict";
    var speed;

    function animate() {
        $(".landing__layer").each(function () {
            speed = $(this).attr("data-scrollspeed");
            $(this).css("transform", "translateY(" + speed * topPos + "px)");
        });
    }


    return {
        animate: animate
    };

}());

var starModule = (function () {
    "use strict";

    var stars = [],
        cv,
        ctx,
        seconds;


    /*
     *
     *
     */
    function init(amount, secs, color) {
        //set defaults
        seconds = secs;

        //grab canvas & context
        cv = $(".stars")[0];
        ctx = cv.getContext("2d");


        //set dimensions
        cv.width = window.innerWidth;
        cv.height = window.innerHeight;


        //set styles

        ctx.fillStyle = color;

        //make initial stars
        for (var i = 0; i < amount; i++) {
            stars.push(new Star());
        }


        //stars.push(new Star(seconds));
    }

    function Star() {
        this.posx = cv.width * Math.random();
        this.posy = cv.height * Math.random();
        this.speedx = Math.random() / 10;
        this.speedy = Math.random() / 10;
        this.finalsize = 1 + Math.random() * 1.2;
        this.size = 0;
        this.grow = this.finalsize / (60 * seconds * (0.75 + 0.50 * Math.random()));
    }

    Star.prototype.update = function () {
        //update position
        this.posx += this.speedx;
        this.posy += this.speedy;

        //update size
        if (this.size >= this.finalsize) {
            this.grow = -this.grow;
        }

        this.size += this.grow;



    };



    Star.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.posx, this.posy, this.size, 0, 2 * Math.PI);
        ctx.fill();
    };

    function animate() {
        ctx.clearRect(0, 0, cv.width, cv.height);

        for (var i = 0; i < stars.length; i += 1) {
            stars[i].update();
            if (stars[i].size >= 0) {
                stars[i].draw();
            } else {
                stars[i] = new Star(seconds);
            }
        }
    }

    return {
        init: init,
        animate: animate
    };

}());
