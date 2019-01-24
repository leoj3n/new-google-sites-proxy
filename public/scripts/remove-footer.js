var removeFooter = function() {
  var footer = document.getElementsByTagName('footer')[0];
  footer.parentNode.removeChild(footer);
};

window.addEventListener('load', removeFooter, false);
