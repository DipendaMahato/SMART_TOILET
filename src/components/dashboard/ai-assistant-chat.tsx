'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { chatWithAi } from '@/lib/actions';
import { Skeleton } from '../ui/skeleton';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function AiAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, loading]);
  
  useEffect(() => {
    setMessages([{ role: 'model', content: "Hello! I'm Aqua, your AI health assistant. How can I help you today?" }]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    const chatHistory = [...messages, userMessage];

    try {
      const result = await chatWithAi(chatHistory.slice(1), input); // Exclude initial greeting
      if (result.error) {
        throw new Error(result.error);
      }
      const modelMessage: Message = { role: 'model', content: result.response };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'model', content: 'Sorry, I had trouble connecting. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Bot /> Ask with AI Assistance
        </CardTitle>
         <CardDescription>Get answers to your health and product questions.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn('flex items-start gap-3', {
                  'justify-end': message.role === 'user',
                })}
              >
                {message.role === 'model' && (
                  <Avatar className="h-8 w-8 border">
                     <AvatarFallback><Bot size={16} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs rounded-lg px-4 py-2 text-sm md:max-w-md',
                    {
                      'bg-primary text-primary-foreground': message.role === 'user',
                      'bg-muted': message.role === 'model',
                    }
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                 {message.role === 'user' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback><User size={16} /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {loading && (
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 border">
                        <AvatarFallback><Bot size={16} /></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-muted space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t pt-4">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about your health..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()}>
            <Send />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
