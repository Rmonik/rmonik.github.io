/*global $, console */


var chordModule = (function () {
    "use strict";

    var interval, 
        opts = {
            auto: false,
            time: 6,
            seven: true,
            extensions: false,
            scales: false,
            extra: false
        },
        chords = [],
        chordbuilder = {
            letters: ["C", "C", "D", "D","E", "E", "F", "F", "G", "G", "A", "A", "B", "B", "C#", "Db", "D#", "Eb", "F#", "Gb", "G#", "Ab", "A#", "Bb"],
            extensions: ["", "m", "7", "maj7", "m7", "m7(b5)", "dim7", "9", "m9", "maj9"],
            l: [2, 7, 10]
        };



    function makeChord() {
        var l, chord;
        if (opts.extensions) {
            l = chordbuilder.l[2];
        } else if (opts.seven)  {
            l = chordbuilder.l[1];
        } else {
            l = chordbuilder.l[0];
        }
        chord = "";
        chord += chordbuilder.letters[Math.floor(Math.random() * chordbuilder.letters.length)];
        chord += chordbuilder.extensions[Math.floor(Math.random() * l)];

        return chord;
    }

    function formListener() {
        $(".options").on("change", function () {
            opts.auto = ($(".options__timer").prop("checked"));
            opts.time = ($(".options__timeset").val());
            opts.seven = ($(".options__sevenchords").prop("checked"));
            opts.extensions = ($(".options__extensions").prop("checked"));
            opts.scales = ($(".options__scales").prop("checked"));
            opts.extra = ($(".options__extra").prop("checked"));
            $(':focus').blur()
            changeBPM();
            interValListener();
        });
    }

    function changeBPM () {
        var bpm = {
            1: 120,
            2: 120,
            3: 80,
            4: 60,
            6: 80,
            8: 60,
            10: 96
        };
        
        $(".options__BPM").text("(" + bpm[opts.time] + " BPM)");
    }
    
    function printChord () {
        $(".chord").text(makeChord());
    }
    
    function printScale () {
        
        var scale = chordbuilder.letters[Math.floor(Math.random()*chordbuilder.letters.length)];
        
        scale += [" min", " maj"][Math.floor(Math.random()*2)];
        
        $(".chord").text(scale);
        
    }

    function pressListener() {

        $(document).on("keypress", function () {
            if(!opts.scales){
                    printChord();
                }
                else {
                    printScale();
                }
            interValListener();
        });
        
        $(document).on("click", function () {
            if(!opts.scales){
                    printChord();
                }
                else {
                    printScale();
                }
            interValListener();
        });
    }
    
    function interValListener() {
        if(opts.auto) {
            clearInterval(interval);
            interval = setInterval(function () {
                if(!opts.scales){
                    printChord();
                }
                else {
                    printScale();
                }
            }, parseInt(opts.time) * 1000);
        } else {
            clearInterval(interval);
        }
    }

    function init() {
        printChord();
        formListener();
        pressListener();
        interValListener();
    }




    return {
        init: init
    }


})();

$(document).ready(function () {
    "use strict";

    chordModule.init();
    $(".helpwindowbutton").on("click", function() {
        $(".helpwindow").toggle();
    });
    $(".helpwindow").on("click", function() {
        $(this).hide();
    })
    
});
