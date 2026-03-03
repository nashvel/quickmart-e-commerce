<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show login page
     */
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Show register page
     */
    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle registration
     */
    public function register(RegisterRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
            'is_verified' => false,
        ]);

        Auth::login($user);
        
        // Merge guest cart with new user cart
        $this->mergeGuestCart($request);

        // Return JSON response for AJAX requests
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Registration successful!',
                'user' => $user
            ], 201);
        }

        return redirect()->route('home')->with('success', 'Registration successful!');
    }

    /**
     * Handle login
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            
            // Merge guest cart with user cart
            $this->mergeGuestCart($request);

            // Return JSON response for AJAX requests
            if ($request->expectsJson()) {
                $user = Auth::user();
                return response()->json([
                    'success' => true,
                    'message' => 'Login successful!',
                    'user' => $user,
                    'token' => $user->createToken('auth-token')->plainTextToken
                ], 200);
            }

            return redirect()->intended('/')->with('success', 'Welcome back!');
        }

        // Return JSON error for AJAX requests
        if ($request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'The provided credentials do not match our records.'
            ], 401);
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }
    
    /**
     * Merge guest cart items with user cart on login
     */
    protected function mergeGuestCart(Request $request)
    {
        $sessionId = $request->session()->getId();
        $userId = Auth::id();
        
        // Get guest cart items
        $guestCartItems = \App\Models\Cart\CartItem::where('session_id', $sessionId)->get();
        
        foreach ($guestCartItems as $guestItem) {
            // Check if user already has this item in cart
            $existingItem = \App\Models\Cart\CartItem::where('user_id', $userId)
                ->where('product_id', $guestItem->product_id)
                ->where('variant_id', $guestItem->variant_id)
                ->first();
            
            if ($existingItem) {
                // Merge quantities
                $existingItem->quantity += $guestItem->quantity;
                $existingItem->save();
                $guestItem->delete();
            } else {
                // Transfer guest item to user
                $guestItem->user_id = $userId;
                $guestItem->session_id = null;
                $guestItem->save();
            }
        }
    }

    /**
     * Handle logout
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // For Inertia requests, return a redirect response
        if ($request->header('X-Inertia')) {
            return redirect('/')->with('success', 'Logged out successfully');
        }

        return redirect('/')->with('success', 'Logged out successfully');
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
