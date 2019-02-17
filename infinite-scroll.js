/* global wp, enterView */

/**
 * Options
 * @typedef {object} Options
 * @property {string} container - Container element selector
 * @property {string} more - More button element selector
 * @property {object} data - Value of data object passed to wp.api.collection.Posts.fetch
 * @property {string} classPrefix - Class prefix used to deduplicate post elements
 * @property {string} moreDisplay - CSS display of more when it's visible
 * @property {function} createElement - Function that creates new elements given post attributes
 */

/**
 * Sets up infinite scrolling for WordPress
 * @global
 * @requires https://github.com/russellgoldenberg/enter-view
 * @function
 * @param {Options} options - Options for setting up infinite scroll
 */
window.infiniteScroll = function (options) {
  var defaults = {
    classPrefix: 'post-',
    moreDisplay: 'block'
  }
  options = Object.assign(defaults, options)
  wp.api.loadPromise.done(function () {
    var container = document.querySelector(options.container)
    var more = document.querySelector(options.more)
    var posts = new wp.api.collections.Posts()
    posts.fetch({ data: options.data })
    posts.on('add', function (post) {
      if (!document.querySelector('.' + options.classPrefix + post.id)) {
        var attr = post.attributes
        var el = options.createElement(attr)
        el.classList.add(options.classPrefix + attr.id)
        container.appendChild(el)
      }
    })
    posts.on('update', function () {
      more.style.display = posts.hasMore() ? options.moreDisplay : 'none'
    })
    more.addEventListener('click', function () {
      posts.more()
    })
    enterView({
      selector: options.more,
      enter: function () {
        posts.more()
      },
      offset: options.offset
    })
  })
}
