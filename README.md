If given more time, these are potential areas to invest in.

UX Enhancements:
- add right and left arrow key listeners
- improve responsiveness of lightbox
- add loading indicators on images as they are loading
- load images from left to right rather than down each column
- smoother transition for showing lightbox (zoom/fade combination)
- infinite scroll (though google's API limits are pretty constraining)
- initial app loading spinner (even DOMContentLoaded is triggered after ~1 second)

Performance Enhancements:
- use CSS IDs for elements that stay on the page forever and are not going to change (such as content and lightbox divs), since getElementsByClassName is much slower than getElementById
- lazy load images as they come into view
- concatenate, minify, and gzip the js, and serve it from a cdn
- once infinite scroll is implemented, 'innerHTML' will be costly and slow (used in renderImages). better to use createElement and appendChild
- cache the API response in local/session storage or in memory based on API cache headers

Compatibility
- to support IE9, CORS won't work. will need to use JSONP or my own server in-between
- DOMContentLoaded isn't supported below IE9

Security
- Google API key is public and susceptible to abuse. Backend as a proxy would be helpful here

Code maintainability
- As app grows larger, separate the different layers (API, lightbox, etc) into their own namespaces/classes
