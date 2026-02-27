<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api/v1', function ($routes) {
    // Multi-tier economy routing logic block
    $routes->post('economy/mint', 'EconomyController::mint');
    $routes->post('economy/transfer', 'EconomyController::transfer');
    $routes->get('economy/balance/(:num)', 'EconomyController::balance/$1');
    $routes->post('economy/settle_match', 'EconomyController::settleMatch');
    $routes->post('economy/manual_fiat_settlement', 'EconomyController::manualFiatSettlement');

    // Auth and Security logic block
    $routes->post('auth/verify_otp', 'AuthController::verifyOtp');
});
