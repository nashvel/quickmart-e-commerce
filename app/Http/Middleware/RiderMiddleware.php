<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RiderMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check() || Auth::user()->role !== 'rider') {
            return redirect('/')->with('error', 'Access denied. Rider privileges required.');
        }
        
        return $next($request);
    }
}