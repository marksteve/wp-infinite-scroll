/* global wp, enterView */

/**
 * Options
 * @typedef {object} Options
 * @property {string} collection - Backbone collection to use (defaults to Posts)
 * @property {object} data - Value of data object passed to fetch
 * @property {string} container - Container element selector
 * @property {string} more - More button element selector
 * @property {string} classPrefix - Class prefix used to deduplicate post elements
 * @property {string} moreDisplay - CSS display of the more button when it's visible
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
    collection: 'Posts',
    classPrefix: 'post-',
    moreDisplay: 'block'
  }
  options = Object.assign(defaults, options)
  wp.api.loadPromise.done(function () {
    var container = document.querySelector(options.container)
    var more = document.querySelector(options.more)
    var collection = new wp.api.collections[options.collection]()
    collection.fetch({ data: options.data })
    collection.on('add', function (model) {
      if (!document.querySelector('.' + options.classPrefix + model.id)) {
        var attr = model.attributes
        var el = options.createElement(attr)
        el.classList.add(options.classPrefix + attr.id)
        container.appendChild(el)
      }
    })
    collection.on('update', function () {
      more.style.display = collection.hasMore() ? options.moreDisplay : 'none'
    })
    more.addEventListener('click', function () {
      collection.more()
    })
    enterView({
      selector: options.more,
      enter: function () {
        collection.more()
      },
      offset: options.offset
    })
  })
}
