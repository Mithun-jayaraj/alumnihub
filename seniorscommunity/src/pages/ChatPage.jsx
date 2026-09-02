import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatCard from '../components/ChatCard';
import ChatMessage from '../components/ChatMessage';
import axios from 'axios';
import {
  ArrowLeft,
  Send,
  Search,
  Phone,
  Video,
  Info,
  Paperclip,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  MessageCircle,
  Loader2
} from 'lucide-react';

const ChatPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const storedUserDetails = JSON.parse(localStorage.getItem("data"));
  const currentUserEmail = storedUserDetails?.Email;

  useEffect(() => {
    if (currentUserEmail) {
      fetchUserChats();
    }
  }, [currentUserEmail]);

  useEffect(() => {
    if (selectedChat) {
      fetchChatMessages(selectedChat._id);
      markMessagesAsRead(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper function to safely get unread count
const getUnreadCountSafe = (chat, userEmail) => {
  if (!chat || !chat.unreadCount || !Array.isArray(chat.unreadCount)) {
    return 0;
  }
  const unreadItem = chat.unreadCount.find(u => u.userEmail === userEmail);
  return unreadItem ? unreadItem.count : 0;
};


  const fetchUserChats = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`/api/v1/chats/user/${currentUserEmail}`);
    
    if (response.data.success) {
      // Ensure all chats have proper unreadCount array
      const normalizedChats = response.data.data.map(chat => ({
        ...chat,
        unreadCount: Array.isArray(chat.unreadCount) ? chat.unreadCount : []
      }));
      setChats(normalizedChats);
    }
  } catch (error) {
    console.error('Error fetching chats:', error);
  } finally {
    setLoading(false);
  }
};


  const fetchChatMessages = async (chatId) => {
    try {
      const response = await axios.get(`/api/v1/chats/messages/${chatId}`);
      
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessagesAsRead = async (chatId) => {
  try {
    await axios.put('/api/v1/chats/read', {
      chatId,
      userEmail: currentUserEmail
    });
    
    // Update local chat state with proper array handling
    setChats(prevChats => prevChats.map(chat => {
      if (chat._id === chatId) {
        // Ensure unreadCount is an array
        const unreadArray = Array.isArray(chat.unreadCount) ? chat.unreadCount : [];
        
        return {
          ...chat,
          unreadCount: unreadArray.map(u => 
            u.userEmail === currentUserEmail 
              ? { ...u, count: 0 }
              : u
          )
        };
      }
      return chat;
    }));
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};


  const sendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;

    const otherParticipant = selectedChat.participants.find(p => p !== currentUserEmail);

    try {
      setSendingMessage(true);
      const response = await axios.post('/api/v1/chats/message', {
        chatId: selectedChat._id,
        sender: currentUserEmail,
        senderName: storedUserDetails.Name,
        receiver: otherParticipant,
        content: messageText
      });

      if (response.data.success) {
        setMessages([...messages, response.data.data]);
        setMessageText('');
        
        // Update chat list
        fetchUserChats();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredChats = chats.filter(chat => {
    const otherParticipant = chat.participants.find(p => p !== currentUserEmail);
    return otherParticipant?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p !== currentUserEmail);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className='min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] flex items-center justify-center'>
          <Loader2 className='w-12 h-12 text-orange-400 animate-spin' />
        </div>
      </>
    );
  }

  return (
    <div className='h-screen bg-slate-50 flex flex-col font-sans overflow-hidden'>
      <Navbar />
      
      <div className='flex-1 flex overflow-hidden'>
        {/* Main Chat Area */}
        <div className='flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full border-x border-slate-200 bg-white shadow-sm'>
          
          {/* Chat List Sidebar */}
          <div className='w-full sm:w-80 md:w-96 bg-white border-r border-slate-200 flex flex-col z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]'>
            
            {/* Sidebar Header & Search */}
            <div className='p-4 border-b border-slate-100'>
              <div className='flex items-center gap-3 mb-4'>
                <button
                  onClick={() => navigate('/home')}
                  className='text-slate-400 hover:text-slate-700 transition-colors p-2 hover:bg-slate-50 rounded-full'
                >
                  <ArrowLeft className='w-5 h-5' />
                </button>
                <h1 className='text-xl font-bold text-slate-900'>Messages</h1>
              </div>
              <div className='relative'>
                <Search className='absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
                <input
                  type='text'
                  placeholder='Search conversations...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 focus:outline-none transition-all text-sm font-medium'
                />
              </div>
            </div>

            {/* Chats List */}
            <div className='flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300'>
              {filteredChats.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full text-center p-8'>
                  <div className='w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4'>
                    <MessageCircle className='w-8 h-8 text-slate-400' />
                  </div>
                  <p className='text-slate-900 font-semibold mb-1'>No conversations yet</p>
                  <p className='text-slate-500 text-sm'>Start chatting with your network</p>
                </div>
              ) : (
                <div className="py-2">
                  {filteredChats.map((chat) => (
                    <ChatCard
                      key={chat._id}
                      chat={chat}
                      currentUserEmail={currentUserEmail}
                      onClick={() => setSelectedChat(chat)}
                      isActive={selectedChat?._id === chat._id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className='flex-1 flex flex-col bg-slate-50/50 relative'>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className='bg-white border-b border-slate-200 p-4 px-6 flex items-center justify-between z-10 shadow-sm'>
                  <div className='flex items-center gap-4'>
                    <div className='relative'>
                      <div className='w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-inner'>
                        {getOtherParticipant(selectedChat)?.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className='text-slate-900 font-bold text-lg leading-tight'>
                        {getOtherParticipant(selectedChat)?.split('@')[0]}
                      </h3>
                      <p className='text-slate-500 text-xs font-medium'>
                        {getOtherParticipant(selectedChat)}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-1 sm:gap-2'>
                    <button className='text-slate-400 hover:text-primary-600 p-2.5 hover:bg-primary-50 rounded-full transition-all'>
                      <Phone className='w-5 h-5' />
                    </button>
                    <button className='text-slate-400 hover:text-primary-600 p-2.5 hover:bg-primary-50 rounded-full transition-all'>
                      <Video className='w-5 h-5' />
                    </button>
                    <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
                    <button className='text-slate-400 hover:text-slate-700 p-2.5 hover:bg-slate-100 rounded-full transition-all hidden sm:block'>
                      <Info className='w-5 h-5' />
                    </button>
                    <button className='text-slate-400 hover:text-slate-700 p-2.5 hover:bg-slate-100 rounded-full transition-all'>
                      <MoreVertical className='w-5 h-5' />
                    </button>
                  </div>
                </div>

                {/* Messages Container */}
                <div
                  ref={messagesContainerRef}
                  className='flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-200'
                >
                  {messages.length === 0 ? (
                    <div className='flex flex-col items-center justify-center h-full text-center'>
                      <div className='w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-4'>
                        <MessageCircle className='w-10 h-10 text-primary-400' />
                      </div>
                      <p className='text-slate-900 font-bold text-lg mb-1'>Say Hello!</p>
                      <p className='text-slate-500'>Start the conversation with {getOtherParticipant(selectedChat)?.split('@')[0]}</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <ChatMessage
                        key={message._id}
                        message={message}
                        isOwnMessage={message.sender === currentUserEmail}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Message Input */}
                <div className='bg-white border-t border-slate-200 p-4 sm:px-6 shadow-[0_-4px_24px_-12px_rgba(0,0,0,0.05)] z-10'>
                  <div className='flex items-end gap-3 max-w-4xl mx-auto'>
                    
                    <div className="flex gap-1 mb-2 hidden sm:flex">
                      <button className='text-slate-400 hover:text-primary-600 p-2 hover:bg-primary-50 rounded-full transition-all'>
                        <Paperclip className='w-5 h-5' />
                      </button>
                      <button className='text-slate-400 hover:text-primary-600 p-2 hover:bg-primary-50 rounded-full transition-all'>
                        <ImageIcon className='w-5 h-5' />
                      </button>
                    </div>

                    <div className='flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex items-end p-1 transition-all focus-within:ring-4 focus-within:ring-primary-500/10 focus-within:border-primary-300 focus-within:bg-white'>
                      <button className='text-slate-400 hover:text-primary-600 p-2.5 hover:bg-primary-50 rounded-full transition-all sm:hidden'>
                        <Paperclip className='w-5 h-5' />
                      </button>
                      
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder='Type a message...'
                        rows={1}
                        className='flex-1 max-h-32 px-3 py-3 bg-transparent text-slate-900 focus:outline-none resize-none'
                        style={{ minHeight: '48px' }}
                      />
                      
                      <button className='text-slate-400 hover:text-primary-600 p-2.5 hover:bg-primary-50 rounded-full transition-all hidden sm:block'>
                        <Smile className='w-5 h-5' />
                      </button>
                    </div>

                    <button
                      onClick={sendMessage}
                      disabled={!messageText.trim() || sendingMessage}
                      className='w-12 h-12 flex-shrink-0 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary-600/20 mb-0.5'
                    >
                      {sendingMessage ? (
                        <Loader2 className='w-5 h-5 animate-spin' />
                      ) : (
                        <Send className='w-5 h-5 ml-1' />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className='flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50'>
                <div className='w-24 h-24 bg-white shadow-sm border border-slate-100 rounded-3xl flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform'>
                  <MessageCircle className='w-12 h-12 text-primary-500' />
                </div>
                <h3 className='text-3xl font-bold text-slate-900 mb-3'>Your Messages</h3>
                <p className='text-slate-500 max-w-sm'>
                  Select a conversation from the sidebar or start a new one to connect with peers and alumni.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
