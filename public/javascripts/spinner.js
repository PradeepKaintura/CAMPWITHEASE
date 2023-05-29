window.onload = function() {
    var spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'none';
  };
  
  document.onreadystatechange = function() {
    var spinner = document.getElementById('loading-spinner');
    if (document.readyState !== 'complete') {
      spinner.style.display = 'block';
    } else {
      spinner.style.display = 'none';
    }
  };