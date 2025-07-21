import { useState } from "react";
import { Search, FileText, Download, Trash2, Eye, Calendar, FileIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  status: 'processed' | 'processing' | 'error';
  tags: string[];
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: '公司政策手冊.pdf',
    type: 'pdf',
    size: 2.5 * 1024 * 1024,
    uploadDate: new Date('2024-01-15'),
    status: 'processed',
    tags: ['政策', '人事']
  },
  {
    id: '2',
    name: '技術文檔_API接口.docx',
    type: 'docx',
    size: 1.2 * 1024 * 1024,
    uploadDate: new Date('2024-01-14'),
    status: 'processed',
    tags: ['技術', 'API']
  },
  {
    id: '3',
    name: '產品需求說明.md',
    type: 'md',
    size: 0.5 * 1024 * 1024,
    uploadDate: new Date('2024-01-13'),
    status: 'processing',
    tags: ['產品', '需求']
  },
  {
    id: '4',
    name: '會議記錄_2024Q1.txt',
    type: 'txt',
    size: 0.3 * 1024 * 1024,
    uploadDate: new Date('2024-01-12'),
    status: 'processed',
    tags: ['會議', '記錄']
  }
];

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'processed':
        return <Badge variant="secondary" className="bg-success text-success-foreground">已處理</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">處理中</Badge>;
      case 'error':
        return <Badge variant="destructive">錯誤</Badge>;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileIcon className="h-5 w-5 text-destructive" />;
      case 'docx':
      case 'doc':
        return <FileIcon className="h-5 w-5 text-primary" />;
      case 'txt':
        return <FileIcon className="h-5 w-5 text-success" />;
      case 'md':
        return <FileIcon className="h-5 w-5 text-accent-foreground" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'date':
        default:
          return b.uploadDate.getTime() - a.uploadDate.getTime();
      }
    });

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "文檔已刪除",
      description: "文檔已從知識庫中移除",
    });
  };

  const handleDownload = (document: Document) => {
    toast({
      title: "開始下載",
      description: `正在下載 ${document.name}`,
    });
  };

  const handleView = (document: Document) => {
    toast({
      title: "預覽文檔",
      description: `正在打開 ${document.name}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-foreground">文檔管理</h2>
        <p className="text-muted-foreground">管理知識庫中的所有文檔</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索文檔名稱或標籤..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部狀態</SelectItem>
                <SelectItem value="processed">已處理</SelectItem>
                <SelectItem value="processing">處理中</SelectItem>
                <SelectItem value="error">錯誤</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">上傳時間</SelectItem>
                <SelectItem value="name">文件名稱</SelectItem>
                <SelectItem value="size">文件大小</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">{documents.length}</div>
          <div className="text-sm text-muted-foreground">總文檔數</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-success">
            {documents.filter(d => d.status === 'processed').length}
          </div>
          <div className="text-sm text-muted-foreground">已處理</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-warning">
            {documents.filter(d => d.status === 'processing').length}
          </div>
          <div className="text-sm text-muted-foreground">處理中</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-foreground">
            {formatFileSize(documents.reduce((total, doc) => total + doc.size, 0))}
          </div>
          <div className="text-sm text-muted-foreground">總大小</div>
        </Card>
      </div>

      {/* Document List */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            文檔列表 ({filteredDocuments.length})
          </h3>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? '沒有找到匹配的文檔' : '暫無文檔'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  {getFileIcon(document.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{document.name}</h4>
                      {getStatusBadge(document.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {document.uploadDate.toLocaleDateString()}
                      </span>
                      <span>{formatFileSize(document.size)}</span>
                      <span>{document.type.toUpperCase()}</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {document.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(document)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(document.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}