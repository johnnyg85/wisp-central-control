Template.wtAccordionPageContent.helpers({
  in: function (open) {
    if (open == 'true') return 'in';
  }
});

Template.wtAccordionPage.onRendered(function () {
  $('.panel-collapse')
    .on('show.bs.collapse', function (e) {
      $(e.target).prev('.wt-accodion-heading').addClass('active');
      $(e.target).parent().prevAll('.wt-accodion-panel').find('.wt-accodion-heading').addClass('above');
      $(e.target).parent().nextAll('.wt-accodion-panel').find('.wt-accodion-heading').removeClass('above');
    })
    .on('hide.bs.collapse', function (e) {
      $(e.target).prev('.wt-accodion-heading').removeClass('active');
    });
  $('#wt_accordion_page .collapse.in').prev('.wt-accodion-heading').addClass('active');
})