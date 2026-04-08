<?php
/**
 * VibeBuy Lite - Uninstall Implementation
 * Triggered when the plugin is deleted.
 *
 * @package VibeBuy
 */

// If uninstall not called from WordPress, exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/**
 * Clean up the database.
 * 1. Remove the custom leads table.
 * 2. Remove all plugin settings/options.
 */

global $wpdb;

// 1. Remove Table
$table_name = $wpdb->prefix . 'vibebuy_leads';
$wpdb->query( "DROP TABLE IF EXISTS $table_name" );

// 2. Remove Options
$options = array(
	'vibebuy_lite_settings',
	'vibebuy_license_key',
	'vibebuy_db_version',
	'vibebuy_pro_enabled',
    'vibebuy_total_connections_count'
);

foreach ( $options as $option ) {
	delete_option( $option );
}

// 3. Clean up cache (optional but good practice)
wp_cache_flush();
