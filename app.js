var app = {
  imageList: [],
  imageCount: 0,

  init: function() {
    // Cache selectors
    app.content = document.getElementsByClassName('content')[0];
    app.lightbox = document.getElementsByClassName('lightbox')[0];

    // Add listeners
    app.content.addEventListener('click', function(e) {
      if (e.target && e.target.nodeName === 'IMG') {
        app.updateLightbox(parseInt(e.target.dataset.index), false);
      }
    });

    app.lightbox.addEventListener('click', app.handleLightboxClick);

    document.onkeydown = function(e) {
      e = e || window.event;
      // close lightbox on ESC
      if (e.keyCode === 27 && app.lightbox.style.display === 'block') {
        app.closeLightbox();
      }
    };

    // Fetch and render images
    app.fetchImages('nba player', function(images) {
      app.imageList = app.imageList.concat(images.map(
        function(image) {
          return {
            link: image.link,
            title: image.title
          };
        })
      );
      var oldCount = app.imageCount;
      app.imageCount += images.length;
      app.renderImages(oldCount);
    }, function(err) {
      app.content.innerHTML = '<h3>Something went wrong - please try again!</h3>';
      console.error('error:', err);
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
      var response = (x.response.items) ? x.response : JSON.parse(x.response);
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

  renderImages: function(startIndex) {
    var newHtml = '';
    for (var i = startIndex; i < app.imageCount; i++) {
      newHtml += '<li><img src="';
      newHtml += app.imageList[i].link;
      newHtml += '" alt="';
      newHtml += app.imageList[i].title;
      newHtml += '" data-index="';
      newHtml += i;
      newHtml += '" /></li>';
    }
    app.content.innerHTML += newHtml;
  },

  updateLightbox: function(index, isOpen) {
    var prevIndex = (index - 1 < 0) ? app.imageCount - 1 : index - 1;
    var nextIndex = (index + 1 >= app.imageCount) ? 0 : index + 1;

    var html = '<p>Click anywhere or hit ESC to close</p>';
    html += '<i class="fa fa-chevron-left" aria-hidden="true" data-index="';
    html += prevIndex + '"></i>';
    html += '<div class="wrapper">';
    html += '<h3>' + app.imageList[index].title + '</h3>';
    html += '<img src="' + app.imageList[index].link;
    html += '" alt="' + app.imageList[index].title + '" />';
    html += '</div>';
    html += '<i class="fa fa-chevron-right" aria-hidden="true" data-index="';
    html += nextIndex + '"></i>';
    app.lightbox.innerHTML = html;
    
    if (isOpen === false) {
      app.lightbox.style.display = 'block';
    }
  },

  closeLightbox: function() {
    app.lightbox.style.display = 'none';
  },

  handleLightboxClick: function(e) {
    if (e.target) {
      if (e.target.nodeName === 'I') {
        // chevron was clicked
        app.updateLightbox(parseInt(e.target.dataset.index), true);
      } else {
        // something else was clicked - close lightbox
        app.closeLightbox();
      }
    } 
  }
};




