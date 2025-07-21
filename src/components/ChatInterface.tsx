import { useState } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  sources?: string[];
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '您好！我是RAG智能助手，可以幫您檢索和分析文檔庫中的信息。請問有什麼可以幫助您的？',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 模擬AI回復
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `根據您的問題"${userMessage.content}"，我在知識庫中找到了相關信息。這是一個模擬回復，實際使用時會連接到RAG後端服務進行文檔檢索和生成回答。`,
        timestamp: new Date(),
        sources: ['文檔A.pdf', '手冊B.docx', '政策C.txt']
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <h2 className="text-lg font-semibold text-card-foreground">智能問答</h2>
        <p className="text-sm text-muted-foreground">基於知識庫的智能對話系統</p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.type === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.type === 'bot' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              )}
              
              <div className={cn(
                "max-w-[70%] space-y-2",
                message.type === 'user' ? "order-2" : ""
              )}>
                <Card className={cn(
                  "p-3",
                  message.type === 'user' 
                    ? "bg-rag-message-user text-white" 
                    : "bg-rag-message-bot"
                )}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </Card>
                
                {message.sources && (
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium mb-1">參考文檔：</p>
                    <div className="flex flex-wrap gap-1">
                      {message.sources.map((source, index) => (
                        <span 
                          key={index}
                          className="bg-accent px-2 py-1 rounded text-accent-foreground"
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="flex-shrink-0 order-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
              <Card className="bg-rag-message-bot p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">正在思考中...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="bg-card border-t p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="輸入您的問題..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-6"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          按 Enter 發送消息，Shift + Enter 換行
        </p>
      </div>
    </div>
  );
}