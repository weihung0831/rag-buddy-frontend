import { useState, useCallback } from "react";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface UploadFile {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export function DocumentUpload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validTypes = ['.pdf', '.doc', '.docx', '.txt', '.md'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    const processedFiles = newFiles.map(file => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        return {
          id: Date.now().toString() + Math.random(),
          file,
          status: 'error' as const,
          progress: 0,
          error: '不支持的文件格式'
        };
      }
      
      if (file.size > maxSize) {
        return {
          id: Date.now().toString() + Math.random(),
          file,
          status: 'error' as const,
          progress: 0,
          error: '文件大小超過50MB限制'
        };
      }

      return {
        id: Date.now().toString() + Math.random(),
        file,
        status: 'pending' as const,
        progress: 0
      };
    });

    setFiles(prev => [...prev, ...processedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    for (const uploadFile of pendingFiles) {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ));

      // 模擬上傳過程
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, progress }
            : f
        ));
      }

      // 模擬上傳結果
      const success = Math.random() > 0.2; // 80% 成功率
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { 
              ...f, 
              status: success ? 'success' : 'error',
              error: success ? undefined : '上傳失敗，請重試'
            }
          : f
      ));
    }

    const successCount = pendingFiles.length;
    toast({
      title: "上傳完成",
      description: `成功處理 ${successCount} 個文件`,
    });
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: UploadFile['status']) => {
    switch (status) {
      case 'success':
        return 'border-success';
      case 'error':
        return 'border-destructive';
      case 'uploading':
        return 'border-primary';
      default:
        return 'border-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">文檔上傳</h2>
        <p className="text-muted-foreground">上傳文檔到知識庫，支持 PDF、Word、文本等格式</p>
      </div>

      {/* Upload Zone */}
      <Card 
        className={cn(
          "border-2 border-dashed p-8 text-center transition-colors",
          isDragging ? "border-primary bg-accent" : "border-muted"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">拖拽文件到此處或點擊選擇</h3>
        <p className="text-muted-foreground mb-4">
          支持 PDF、DOC、DOCX、TXT、MD 格式，單文件最大 50MB
        </p>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.md"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <Button asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            選擇文件
          </label>
        </Button>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">待處理文件 ({files.length})</h3>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setFiles([])}
                disabled={files.some(f => f.status === 'uploading')}
              >
                清空
              </Button>
              <Button 
                onClick={uploadFiles}
                disabled={!files.some(f => f.status === 'pending') || files.some(f => f.status === 'uploading')}
              >
                開始上傳
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {files.map((uploadFile) => (
              <div 
                key={uploadFile.id}
                className={cn(
                  "flex items-center gap-3 p-3 border rounded-lg",
                  getStatusColor(uploadFile.status)
                )}
              >
                {getStatusIcon(uploadFile.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadFile.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  {uploadFile.status === 'uploading' && (
                    <Progress value={uploadFile.progress} className="mt-2" />
                  )}
                  {uploadFile.error && (
                    <p className="text-xs text-destructive mt-1">{uploadFile.error}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(uploadFile.id)}
                  disabled={uploadFile.status === 'uploading'}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tips */}
      <Card className="p-4 bg-accent">
        <h4 className="font-semibold text-accent-foreground mb-2">上傳提示</h4>
        <ul className="text-sm text-accent-foreground space-y-1">
          <li>• 文檔將自動進行向量化處理，用於智能檢索</li>
          <li>• 處理時間取決於文檔大小和複雜度</li>
          <li>• 建議文檔內容結構清晰，便於提取關鍵信息</li>
          <li>• 重複文檔會自動去重處理</li>
        </ul>
      </Card>
    </div>
  );
}