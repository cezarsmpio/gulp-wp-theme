<?php

/* Load assets */
function load_assets() {
  /* CSS */
  wp_enqueue_style('main-style', get_stylesheet_uri(), array(), '1.0');

  /* JS */
  wp_enqueue_script('main-script', get_stylesheet_directory_uri() . '/js/main.js', array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'load_assets');


/* Theme Support */
add_theme_support('post-thumbnails');
add_theme_support('menus');

/* Images Size */
// add_image_size('your-crop-name', 300, 200, true);

/**
 * Get the terms of specific post in a list
 * @param  object $p      The post
 * @param  array  $params An array of params
 * @return string         The HTML result
 */
function get_post_terms($p, $params = array()) {
  $defaults = array(
    'class' => 'term-item',
    'separator' => ', ',
    'taxonomy' => 'category',
    'links' => true,
    'args' => array()
  );
  $options = array_merge($defaults, $params);

  $elements = array();
  $p->cats = wp_get_post_terms($p->ID, $options['taxonomy'], $options['args']);

  foreach ($p->cats as $c) {
    $cat = get_category($c);

    if ($options['links']) {
      $elements[] = "<a href=\"" . get_category_link($cat->term_id) . "\" class=\"" . $options['class'] . "\">" . $cat->name . "</a>";
    }
    else {
      $elements[] = "<span class=\"" . $options['class'] . "\">" . $cat->name . "</span>";
    }
  }

  return implode($options['separator'], $elements);
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

/**
 * Remove query string version from assets to cache optimizing
 */
function remove_assets_version( $src ){
  $parts = explode( '?ver', $src );

  return $parts[0];
}
add_filter( 'script_loader_src', 'remove_assets_version', 15, 1 );
add_filter( 'style_loader_src', 'remove_assets_version', 15, 1 );
