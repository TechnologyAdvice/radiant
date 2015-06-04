$(document).ready(function() {
  $('.ui.checkbox').checkbox();
  // Pop Overs on Sidebar elements
  $('.ui.thin.sidebar .blue.item').popup();
  // Add Interaction History Modal Show
  $('.ui.interaction.modal').modal('attach events', '.add.interaction', 'show').modal('hide dimmer');
  $('.ui.project.log.modal').modal('attach events', '.add.project', 'show');
});
