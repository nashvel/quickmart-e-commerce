<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectBasedOnRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();
            $currentPath = $request->path();
            
            // Define role-based path prefixes
            $rolePaths = [
                'admin' => 'admin',
                'client' => 'seller',
                'rider' => 'rider',
            ];
            
            // Get the expected path prefix for the user's role
            $expectedPrefix = $rolePaths[$user->role] ?? 'seller';
            
            // Check if user is accessing a dashboard route that doesn't match their role
            foreach ($rolePaths as $role => $prefix) {
                if (str_starts_with($currentPath, $prefix . '/') && $user->role !== $role) {
                    // Redirect to their appropriate dashboard
                    return redirect('/' . $expectedPrefix . '/dashboard');
                }
            }
        }
        
        return $next($request);
    }
}