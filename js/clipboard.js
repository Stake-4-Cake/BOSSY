let clipboard;

$(document).ready(function () {
  if (!clipboard) {
    clipboard = new ClipboardJS('.walletAddress');

    clipboard.on('success', function (e) {
      activateTooltip();
    });
  }
});

function activateTooltip(btn) {
  $('.tooltip_tge').addClass('tooltip_active');

  setTimeout(function () {
    $('.tooltip_tge').removeClass('tooltip_active');
  }, 1000);
}
