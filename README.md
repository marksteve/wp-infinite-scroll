# wp-infinite-scroll

Quick and easy infinite scrolling in WordPress. This library uses [enter-view.js](https://github.com/russellgoldenberg/enter-view/) to trigger loading on scroll and retireves posts through [WordPress' REST API](https://developer.wordpress.org/rest-api/) with the [Backbone.js client](https://developer.wordpress.org/rest-api/using-the-rest-api/backbone-javascript-client/).

[Documentation](https://marksteve.com/wp-infinite-scroll) -
[License](LICENSE)

## Setup

Just copy directly into your theme directory along with
[enter-view.js](https://github.com/russellgoldenberg/enter-view/blob/master/enter-view.min.js).  You can then load it in your templates by adding these lines to `functions.php`:

```php
wp_enqueue_script('wp-api');
wp_enqueue_script('enter-view', get_template_directory_uri() . '/js/enter-view.min.js', array(), '2.0.0', true);
wp_enqueue_script('infinite-scroll', get_template_directory_uri() . '/js/infinite-scroll.js', array('wp-api', 'enter-view'), '0.0.1', true);
```

## Usage

You can use [any](https://github.com/wycats/handlebars.js) [templating](https://github.com/janl/mustache.js) [library](https://github.com/mde/ejs) for creating the post elements. In this example, we clone an existing post node and replace content and attributes with new post values.

```js
document.addEventListener('DOMContentLoaded', function () {
  var template = document.querySelector('.posts > .post').cloneNode(true)
  function createElement (post) {
    var el = template.cloneNode(true)
    var featuredImage = post._embedded['wp:featuredmedia'][0].source_url
    el.querySelector('.link').href = post.link
    el.querySelector('.title').innerHTML = post.title.rendered
    el.querySelector('.featured-image').src = featuredImage
    el.querySelector('.excerpt').innerHTML = post.excerpt.rendered
    el.querySelector('.date').textContent = new Date(post.date).toLocaleString(undefined, {
      'year': 'numeric',
      'month': 'long',
      'day': 'numeric'
    })
    return el
  }
  infiniteScroll({
    container: '.posts',
    more: '.more',
    moreDisplay: 'inline-block',
    data: {
      _embed: true,
      per_page: 10,
      filter: { order: 'DESC' }
    },
    offset: 0.25,
    createElement: createElement
  })
})
```
