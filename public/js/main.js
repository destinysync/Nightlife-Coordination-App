$(document).ready(function() {

    $(document).keypress(
        function(event) {
            if (event.which == '13') {
                event.preventDefault();
            }
        });

    function showSearchResult() {
        var str = $("form").serialize();
        str = str.match(/searchValue=(.*)/)[1];
        str = str.split('+').join(' ');
        $.post('/searchResult/' + str, function(data, status) {
            $('.searchResult').html(data);
        });
    }

    var typingTimer;
    var doneTypingInterval = 2000;
    var $input = $("input[type='text']");

    $input.on('keyup', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    $input.on('keydown', function() {
        clearTimeout(typingTimer);
    });

    function doneTyping() {
        showSearchResult();
    }

    $(".container-fluid").on("click", ".going", function() {
        var barID = this.id;
        $.post("/ifLoggedIn", function(data, status) {
            if (data == 'n') {
                window.location.replace("/logginViaTwitter");
            }
            else {
                $.post('/iAmGoing/' + barID, function(data, status) {
                    $("#" + barID).html(data + ' GOING');
                });
            }
        });


    });
});
