$(document).ready(function() {
  $('.thin.sidebar').on('mouseenter', function() {
    var transition = $(this).data('transition');
    $('.sidebar.labeled')
      .not('.styled')
      .sidebar('setting', {
        transition       : transition,
        mobileTransition : transition
      });
    $('.sidebar.labeled').not('.styled').sidebar('toggle');
  });
});
