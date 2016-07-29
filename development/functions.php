<?php

/* Load assets */
function load_assets() {
  /* CSS */
  wp_enqueue_style('main-style', get_stylesheet_uri(), array(), '1.0');

  /* JS */
  wp_enqueue_script('vendors', get_stylesheet_directory_uri() . '/js/vendor/vendor.min.js', array(), '1.0', true);
  wp_enqueue_script('main-script', get_stylesheet_directory_uri() . '/js/main.js', array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'load_assets');


/* Theme Support */
add_theme_support('post-thumbnails');
add_theme_support('menus');

/* Images Size */
// add_image_size('your-crop-name', 300, 200, true);

/**
 * Get the terms of post
 * @param  object $p         The post
 * @param  string $class     CSS Class
 * @param  string $separator
 * @return string            The terms
 */
function get_post_terms($p, $class = 'post-preview__cat', $separator = '') {
  $links = array();
  $p->cats = wp_get_post_categories($p->ID);

  foreach ($p->cats as $c) {
    $cat = get_category($c);

    $links[] = "<a href=\"" . get_category_link($cat->term_id) . "\" class=\"$class\">" . $cat->name . "</a>";
  }

  return implode($separator, $links);
}

/**
 * The page permalink by slug
 * @param  string $slug The page slug
 * @return string       The permalink
 */
function page_permalink_by_slug($slug) {
  return get_permalink( get_page_by_path( $slug ) );
}

/**
 * Remove wordpress version from wp_head
 * @return string Empty string
 */
function remove_version() {
  return '';
}
add_filter('the_generator', 'remove_version');

/**
 * The custom excerpt characters
 * @return string    The new excerpt more
 */
function custom_excerpt_more($more) {
  return '...';
}
add_filter('excerpt_more', 'custom_excerpt_more');

/**
 * Set a new excerpt characters
 * @return int         The new length of excerpt
 */
function new_excerpt_length($length) {
  return 100;
}
add_filter('excerpt_length', 'new_excerpt_length');
