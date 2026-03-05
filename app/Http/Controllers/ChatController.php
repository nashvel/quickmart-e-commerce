<?php

namespace App\Http\Controllers;

use App\Http\Requests\Chat\SendMessageRequest;
use App\Models\Chat\Chat;
use App\Models\Chat\Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * Get all chats for the authenticated user
     */
    public function index(Request $request)
    {
        $chats = Chat::where('customer_id', $request->user()->id)
            ->with(['store', 'lastMessage'])
            ->orderBy('last_message_at', 'desc')
            ->get();

        if ($request->wantsJson()) {
            return response()->json([
                'data' => $chats
            ]);
        }

        return response()->json(['chats' => $chats]);
    }

    /**
     * Get or create a chat with a store
     */
    public function getOrCreate(Request $request, $storeId)
    {
        $chat = Chat::firstOrCreate(
            [
                'customer_id' => $request->user()->id,
                'store_id' => $storeId,
            ],
            [
                'last_message_at' => now(),
            ]
        );

        $chat->load(['store', 'messages.sender']);

        return response()->json(['chat' => $chat]);
    }

    /**
     * Get messages for a specific chat
     */
    public function messages(Request $request, Chat $chat)
    {
        // Ensure user owns this chat
        if ($chat->customer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messages = $chat->messages()->with('sender')->get();

        // Mark messages as read
        $chat->messages()
            ->where('sender_id', '!=', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['messages' => $messages]);
    }

    /**
     * Send a message
     */
    public function sendMessage(SendMessageRequest $request, Chat $chat)
    {
        // Ensure user owns this chat
        if ($chat->customer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $message = Message::create([
            'chat_id' => $chat->id,
            'sender_id' => $request->user()->id,
            'message' => $request->validated()['message'],
        ]);

        // Update chat's last message timestamp
        $chat->update(['last_message_at' => now()]);

        $message->load('sender');

        return response()->json(['success' => true, 'message' => $message]);
    }

    /**
     * Delete a chat
     */
    public function destroy(Request $request, Chat $chat)
    {
        // Ensure user owns this chat
        if ($chat->customer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $chat->delete();

        return response()->json(['message' => 'Chat deleted successfully']);
    }
}
