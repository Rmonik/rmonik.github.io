/*jslint browser: true*/
/*global $, jQuery, alert, console, window, document*/

/*
 * This javascript file uses the Revealing Module Pattern
 * to protect its methods and fields. It relies on
 * Immediately Invoked Function Expressions.
 */



/*
 * global variables
 */

// the current scroll position of the page.
var topPos = 0;


/*
 * Main function that calls module acces methods
 * as soon as the page has loaded.
 */
$(document).ready(function () {
    "use strict";

    //launch functions
    DOMModule.init();
    starModule.init(10 * window.innerHeight * window.innerWidth / 100000,
        6,
        "rgba(255,230,230,0.8)");



    /*
    * function to be repeated every frame.
    * Calls repeated functions from other modules
    */
    function animate() {
        //update the current scroll variable every frame
        topPos = $(window).scrollTop();

        //update the mountains position every frame
        mountainsModule.animate();

        //update the stars every frame
        starModule.animate();


        window.requestAnimationFrame(animate);
    }
    // Launch the animation
    window.requestAnimationFrame(animate);


});

/*
* This module handles all small animations and event
* listeners on the DOM.
*/
var DOMModule = (function () {
    "use strict";

    function init() {
        hamburgerMenu();
    }

    /*
    * Shows and hides the navigation (hamburger) menu
    * upon clicking the icon. Also changes the icon.
    */
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

/*
* This module handles the animation of the mountains
* on the landing page.
*/
var mountainsModule = (function () {
    "use strict";
    // variable pulled from html
    // describes speed at which each layer moves
    var speed;

    /*
    * Updates the CSS transform property every frame of
    * each layer.
    */
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

/*
* This module handles the stars on the background of
* the landing page.
*/
var starModule = (function () {
    "use strict";

    var stars = [], //holds each star
        cv, //canvas element
        ctx, //context of canvas
        seconds; //number of seconds (average) stars stay visible


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


    }

    /*
    * Star constructor.
    * Randomizes speed, position, and maximum size of star
    */
    function Star() {
        this.posx = cv.width * Math.random();
        this.posy = cv.height * Math.random();
        this.speedx = Math.random() / 10;
        this.speedy = Math.random() / 10;
        this.finalsize = 1 + Math.random() * 1.2;
        this.size = 0;
        this.grow = this.finalsize / (60 * seconds * (0.75 + 0.50 * Math.random()));
    }

    /*
    * Star method to be called each frame per star.
    * Changes size and position of star.
    */
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


    /*
    * Star method to be called each frame per star.
    * Draws star on canvas.
    */
    Star.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.posx, this.posy, this.size, 0, 2 * Math.PI);
        ctx.fill();
    };

    /*
    * Module function to be called every frame.
    * Checks star size and acts accordingly,
    * and calls animation methods.
    */
    function animate() {
        ctx.clearRect(0, 0, cv.width, cv.height);

        for (var i = 0; i < stars.length; i += 1) {
            stars[i].update();

            if (stars[i].size >= 0) {
                stars[i].draw();
            } else {
                // destroy star and make new one when size below 0
                stars[i] = new Star();
            }
        }
    }

    return {
        init: init,
        animate: animate
    };

}());
