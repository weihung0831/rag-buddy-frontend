import { useState } from "react";
import { Search as SearchIcon, FileText, Clock, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SearchResult {
  id: string;
  title: string;
  content: string;
  document: string;
  score: number;
  highlights: string[];
  page?: number;
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: '員工假期政策',
    content: '根據公司政策，所有全職員工每年享有21天年假，可在入職滿一年後開始申請使用。病假不超過14天可不扣薪資...',
    document: '公司政策手冊.pdf',
    score: 0.95,
    highlights: ['年假', '21天', '病假'],
    page: 15
  },
  {
    id: '2',
    title: 'API接口認證機制',
    content: '系統採用JWT令牌進行身份認證，每個API請求都需要在header中包含有效的Bearer token。令牌有效期為24小時...',
    document: '技術文檔_API接口.docx',
    score: 0.87,
    highlights: ['JWT', 'API', '認證'],
    page: 3
  },
  {
    id: '3',
    title: '產品功能需求',
    content: '用戶管理模組需要支持角色權限控制，包括管理員、編輯者、查看者三種角色。每種角色具有不同的操作權限...',
    document: '產品需求說明.md',
    score: 0.76,
    highlights: ['用戶管理', '角色權限', '管理員'],
    page: null
  }
];

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([
    '員工假期政策',
    'API接口文檔',
    '角色權限管理',
    '數據庫設計'
  ]);
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // 模擬搜索
    setTimeout(() => {
      setResults(mockResults);
      setIsLoading(false);
      
      // 添加到搜索歷史
      if (!searchHistory.includes(query)) {
        setSearchHistory(prev => [query, ...prev.slice(0, 9)]);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const highlightText = (text: string, highlights: string[]) => {
    let highlightedText = text;
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-warning/30 px-1 rounded">$1</mark>');
    });
    return highlightedText;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-foreground">搜索檢索</h2>
        <p className="text-muted-foreground">在知識庫中快速找到您需要的信息</p>
      </div>

      {/* Search Input */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="輸入關鍵詞搜索..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
              {isLoading ? '搜索中...' : '搜索'}
            </Button>
          </div>

          {/* Advanced Filters */}
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                高級篩選
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">排序方式</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">相關度</SelectItem>
                      <SelectItem value="date">更新時間</SelectItem>
                      <SelectItem value="name">文檔名稱</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">文檔類型</label>
                  <div className="space-y-2">
                    {['PDF', 'Word', 'Markdown', '文本'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTypes(prev => [...prev, type]);
                            } else {
                              setSelectedTypes(prev => prev.filter(t => t !== type));
                            }
                          }}
                        />
                        <label htmlFor={type} className="text-sm">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search History */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              搜索歷史
            </h3>
            <div className="space-y-2">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(item)}
                  className="block w-full text-left text-sm p-2 rounded hover:bg-accent transition-colors truncate"
                >
                  {item}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          {results.length > 0 && (
            <div className="mb-4 text-sm text-muted-foreground">
              找到 {results.length} 個相關結果
            </div>
          )}
          
          <div className="space-y-4">
            {results.map((result) => (
              <Card key={result.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-primary hover:underline cursor-pointer">
                      {result.title}
                    </h3>
                    <Badge variant="outline">
                      相關度: {(result.score * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  
                  <p 
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightText(result.content, result.highlights) 
                    }}
                  />
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      {result.document}
                    </div>
                    {result.page && (
                      <span className="text-muted-foreground">第 {result.page} 頁</span>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    {result.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {results.length === 0 && query && !isLoading && (
            <Card className="p-8 text-center">
              <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">沒有找到相關結果</h3>
              <p className="text-muted-foreground mb-4">
                試試其他關鍵詞或檢查拼寫
              </p>
              <div className="text-sm text-muted-foreground">
                <p>搜索技巧：</p>
                <ul className="mt-2 space-y-1">
                  <li>• 使用多個關鍵詞提高準確性</li>
                  <li>• 嘗試同義詞或相關詞彙</li>
                  <li>• 使用引號搜索完整短語</li>
                </ul>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}