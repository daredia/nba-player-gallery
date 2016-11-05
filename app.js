var app = {
  init: function() {
    // Cache selectors
    app.content = document.getElementsByClassName('content')[0];
    app.lightbox = document.getElementsByClassName('lightbox')[0];
    app.lightboxImage = app.lightbox.querySelector('img');

    // Add listeners
    app.content.addEventListener('click', function(e) {
      if (e.target && e.target.nodeName === 'IMG') {
        app.openLightbox(e.target.src);
      }
    });

    app.lightbox.addEventListener('click', app.closeLightbox);

    document.onkeydown = function(e) {
      e = e || window.event;
      // close lightbox on ESC
      if (e.keyCode === 27 && app.lightbox.style.display === 'block') {
        app.closeLightbox();
      }
    };

    // Fetch and render images
    app.fetchImages('steph curry', function(images) {
      // TODO: store images in memory on the client
      // array of objects, keyed by thumbnail link
      // maybe each image only needs to keep track of the next and prev image
      console.log(images);
      app.renderImages(images);
    }, function(err) {
      console.log('error:', err);
    });
  },

  fetchImages: function(searchTerm, callback, errorCallback) {
    var query = encodeURIComponent(searchTerm);
    var searchUrl = 'https://www.googleapis.com/customsearch/v1?key=';
    searchUrl += window.GOOGLE_API_KEY;
    searchUrl += '&cx=013429950514050259067:exhwha2stxm&searchType=image&imgSize=large&q=';
    searchUrl += query;

    var x = new XMLHttpRequest();
    x.open('GET', searchUrl);
    x.responseType = 'json';
    
    x.onload = function() {
      var response = x.response;
      if (!response || !response.items || response.items.length === 0) {
        errorCallback('No response from Google Image search!');
        return;
      }
      callback(response.items);
    };

    x.onerror = function() {
      errorCallback('Network error.');
    };

    x.send();
  },

  renderImages: function(images) {
    var newHtml = '';
    for (var i = 0; i < images.length; i++) {
      newHtml += '<li><img src="';
      newHtml += images[i].link;
      newHtml += '" alt="';
      newHtml += images[i].title;
      newHtml += '" /></li>';
    }
    app.content.innerHTML += newHtml;
  },

  openLightbox: function(imageSource) {
    app.lightboxImage.src = imageSource;
    app.lightbox.style.display = 'block';
  },

  closeLightbox: function() {
    app.lightbox.style.display = 'none';
  }
};