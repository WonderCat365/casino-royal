
var $inner = $('.inner'),
  $spin = $('#spin'),
  $reset = $('#reset'),
  $data = $('.data'),
  $mask = $('.mask'),
  maskDefault = 'Place Your Bets',
  timer = 9000;

var red = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];
var sec = 0, min = 0;
var globalTimer;

$reset.hide();
$mask.text(maskDefault);

$spin.on('click', function () {

  globalTimer = setInterval(() => {
    $("#timerM").text(min);
    $("#timerS").text(sec);
    sec++;
    if (sec === 60) {
      min++;
      sec = 0;
    }
  }, 1000);

  // get a random number between 0 and 36 and apply it to the nth-child selector
  var randomNumber = Math.floor(Math.random() * 36),
    color = null;
  $inner.attr('data-spinto', randomNumber).find('li:nth-child(' + randomNumber + ') input').prop('checked', 'checked');
  // prevent repeated clicks on the spin button by hiding it
  $(this).hide();
  // disable the reset button until the ball has stopped spinning
  $reset.addClass('disabled').prop('disabled', 'disabled').show();

  $('.placeholder').remove();


  setTimeout(function () {
    $mask.text('No More Bets');
  }, timer / 2);

  setTimeout(function () {
    $mask.text(maskDefault);
  }, timer + 500);



  // remove the disabled attribute when the ball has stopped
  setTimeout(function () {
    $reset.removeClass('disabled').prop('disabled', '');

    if ($.inArray(randomNumber, red) !== -1) {
      color = 'red'
    } else { color = 'black' };
    if (randomNumber == 0) color = 'green';

    $('.result-number').text(randomNumber);
    $('.result-color').text(color);
    $('.result').css({ 'background-color': '' + color + '' });
    $data.addClass('reveal');
    $inner.addClass('rest');

    $thisResult = '<li class="previous-result color-' + color +
      '"><span class="previous-number">' + randomNumber +
      '</span><span class="previous-color">' + color + '</span></li>';


    $('.previous-list').prepend($thisResult);


    var bet = 0;
    for (var i = 0; i < bets.length; i++)if (bets[i] != 0) bet += bets[i];

    bet *= CurrentTier;

    if (bet > balance) {
      var betdiv = document.getElementById("result");
      betdiv.innerHTML = "Insufficient balance!";
      return;
    }


    var win = 0;
    if (bets[randomNumber] != 0) win += bets[randomNumber] * 36;
    for (var i = 37; i < bets.length; i++)if (bets[i] != 0) win += bets[i] * sectormultipliers[i - 37][randomNumber];

    win *= CurrentTier;
    win -= bet;

    console.log("BET: " + bet + " WIN: " + win);

    var betdiv = document.getElementById("result");
    if (win >= bet) betdiv.innerHTML = " You won " + win.toFixed(2) + " ETH!";
    else betdiv.innerHTML = " You lost " + win.toFixed(2) + " ETH!";

    balance += win;
    UpdateBalance();



  }, timer);

});


$reset.on('click', function () {
  clearInterval(globalTimer);
  min=0;
  sec=0;
  $("#timerM").text(0);
  $("#timerS").text(0);
  // remove the spinto data attr so the ball 'resets'
  $inner.attr('data-spinto', '').removeClass('rest');
  $(this).hide();
  $spin.show();
  $data.removeClass('reveal');
});
