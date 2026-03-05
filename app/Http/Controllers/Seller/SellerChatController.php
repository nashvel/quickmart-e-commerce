<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Chat\SendMessageRequest;
use App\Models\Chat\Chat;
use App\Models\Chat\Message;
use App\Models\Store\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SellerChatController extends Controller
{
    /**
     * Get messages for a specific chat
     */
    public function messages(Request $request, Chat $chat)
    {
        $userId = Auth::id();
        
        // Verify seller owns the store associated with this chat
        $store = Store::where('client_id', $userId)
            ->where('id', $chat->store_id)
            ->first();
        
        if (!$store) {
            return response()->json([
                'message' => 'Unauthorized. You do not own this store.'
            ], 403);
        }
        
        // Load messages with sender information
        $messages = $chat->messages()
            ->with('sender:id,first_name,last_name')
            ->orderBy('created_at', 'asc')
            ->get();
        
        // Mark messages as read (messages from customer to seller)
        $chat->messages()
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);
        
        return response()->json([
            'success' => true,
            'messages' => $messages
        ]);
    }
    
    /**
     * Send a message in a chat
     */
    public function sendMessage(SendMessageRequest $request, Chat $chat)
    {
        $userId = Auth::id();
        
        // Verify seller owns the store associated with this chat
        $store = Store::where('client_id', $userId)
            ->where('id', $chat->store_id)
            ->first();
        
        if (!$store) {
            return response()->json([
                'message' => 'Unauthorized. You do not own this store.'
            ], 403);
        }
        
        // Create the message
        $message = Message::create([
            'chat_id' => $chat->id,
            'sender_id' => $userId,
            'message' => $request->validated()['message'],
            'is_read' => false,
        ]);
        
        // Update chat's last message timestamp
        $chat->update([
            'last_message_at' => now()
        ]);
        
        // Load sender relationship
        $message->load('sender:id,first_name,last_name');
        
        return response()->json([
            'success' => true,
            'message' => $message
        ], 201);
    }
    
    /**
     * Get all chats for the seller's stores
     */
    public function index(Request $request)
    {
        $userId = Auth::id();
        
        // Get seller's store IDs
        $storeIds = Store::where('client_id', $userId)
            ->pluck('id');
        
        if ($storeIds->isEmpty()) {
            return response()->json([
                'success' => true,
                'chats' => []
            ]);
        }
        
        // Get chats for seller's stores
        $chats = Chat::whereIn('store_id', $storeIds)
            ->with(['customer:id,first_name,last_name', 'store:id,name'])
            ->withCount(['messages as unread_count' => function ($query) use ($userId) {
                $query->where('sender_id', '!=', $userId)
                    ->where('is_read', false);
            }])
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function ($chat) {
                return [
                    'id' => $chat->id,
                    'customer_id' => $chat->customer_id,
                    'store_id' => $chat->store_id,
                    'customer_name' => $chat->customer 
                        ? $chat->customer->first_name . ' ' . $chat->customer->last_name 
                        : 'Unknown Customer',
                    'store_name' => $chat->store ? $chat->store->name : 'Unknown Store',
                    'last_message_at' => $chat->last_message_at,
                    'unread_count' => $chat->unread_count ?? 0,
                ];
            });
        
        return response()->json([
            'success' => true,
            'chats' => $chats
        ]);
    }
}
