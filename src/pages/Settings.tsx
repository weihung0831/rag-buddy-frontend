import { useState } from "react";
import { Save, RefreshCw, Database, Shield, Bell, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Settings {
  // AI配置
  aiModel: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  
  // 檢索配置
  retrievalTopK: number;
  similarityThreshold: number;
  chunkSize: number;
  chunkOverlap: number;
  
  // 系統配置
  enableNotifications: boolean;
  autoBackup: boolean;
  logLevel: string;
  maxFileSize: number;
  
  // 安全配置
  enableAuth: boolean;
  sessionTimeout: number;
  maxRetries: number;
}

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    // AI配置
    aiModel: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: '你是一個專業的知識庫助手，請根據提供的文檔內容準確回答用戶問題。',
    
    // 檢索配置
    retrievalTopK: 5,
    similarityThreshold: 0.75,
    chunkSize: 1024,
    chunkOverlap: 200,
    
    // 系統配置
    enableNotifications: true,
    autoBackup: true,
    logLevel: 'INFO',
    maxFileSize: 50,
    
    // 安全配置
    enableAuth: true,
    sessionTimeout: 24,
    maxRetries: 3,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // 模擬保存配置
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "設置已保存",
        description: "系統配置已成功更新",
      });
    }, 1000);
  };

  const handleReset = () => {
    // 重置為默認值的邏輯
    toast({
      title: "設置已重置",
      description: "已恢復為默認配置",
    });
  };

  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">系統設置</h2>
          <p className="text-muted-foreground">配置RAG系統的各項參數</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            重置
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? '保存中...' : '保存設置'}
          </Button>
        </div>
      </div>

      {/* AI配置 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          AI模型配置
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="aiModel">AI模型</Label>
            <Select value={settings.aiModel} onValueChange={(value) => updateSetting('aiModel', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="claude-3">Claude-3</SelectItem>
                <SelectItem value="local-llm">本地模型</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="temperature">創造性 ({settings.temperature})</Label>
            <Input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))}
              className="cursor-pointer"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxTokens">最大令牌數</Label>
            <Input
              type="number"
              value={settings.maxTokens}
              onChange={(e) => updateSetting('maxTokens', parseInt(e.target.value))}
              min="512"
              max="8192"
            />
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <Label htmlFor="systemPrompt">系統提示詞</Label>
          <Textarea
            value={settings.systemPrompt}
            onChange={(e) => updateSetting('systemPrompt', e.target.value)}
            placeholder="設置AI助手的行為和回答風格..."
            rows={3}
          />
        </div>
      </Card>

      {/* 檢索配置 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Database className="h-5 w-5" />
          檢索配置
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="retrievalTopK">檢索結果數量</Label>
            <Input
              type="number"
              value={settings.retrievalTopK}
              onChange={(e) => updateSetting('retrievalTopK', parseInt(e.target.value))}
              min="1"
              max="20"
            />
            <p className="text-xs text-muted-foreground">每次檢索返回的文檔片段數量</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="similarityThreshold">相似度閾值 ({settings.similarityThreshold})</Label>
            <Input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.similarityThreshold}
              onChange={(e) => updateSetting('similarityThreshold', parseFloat(e.target.value))}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">低於此閾值的結果將被過濾</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chunkSize">文檔分塊大小</Label>
            <Input
              type="number"
              value={settings.chunkSize}
              onChange={(e) => updateSetting('chunkSize', parseInt(e.target.value))}
              min="256"
              max="4096"
            />
            <p className="text-xs text-muted-foreground">單位：字符數</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chunkOverlap">分塊重疊</Label>
            <Input
              type="number"
              value={settings.chunkOverlap}
              onChange={(e) => updateSetting('chunkOverlap', parseInt(e.target.value))}
              min="0"
              max="512"
            />
            <p className="text-xs text-muted-foreground">相鄰分塊的重疊字符數</p>
          </div>
        </div>
      </Card>

      {/* 系統配置 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          系統配置
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableNotifications">啟用通知</Label>
              <p className="text-sm text-muted-foreground">接收系統狀態和錯誤通知</p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoBackup">自動備份</Label>
              <p className="text-sm text-muted-foreground">每日自動備份系統數據</p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => updateSetting('autoBackup', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="logLevel">日誌級別</Label>
              <Select value={settings.logLevel} onValueChange={(value) => updateSetting('logLevel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEBUG">DEBUG</SelectItem>
                  <SelectItem value="INFO">INFO</SelectItem>
                  <SelectItem value="WARN">WARN</SelectItem>
                  <SelectItem value="ERROR">ERROR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">最大文件大小 (MB)</Label>
              <Input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => updateSetting('maxFileSize', parseInt(e.target.value))}
                min="1"
                max="100"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 安全配置 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          安全配置
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableAuth">啟用身份認證</Label>
              <p className="text-sm text-muted-foreground">要求用戶登錄才能使用系統</p>
            </div>
            <Switch
              checked={settings.enableAuth}
              onCheckedChange={(checked) => updateSetting('enableAuth', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">會話超時時間 (小時)</Label>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                min="1"
                max="168"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxRetries">最大重試次數</Label>
              <Input
                type="number"
                value={settings.maxRetries}
                onChange={(e) => updateSetting('maxRetries', parseInt(e.target.value))}
                min="1"
                max="10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 系統信息 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">系統信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium">版本</p>
            <p className="text-muted-foreground">v1.0.0</p>
          </div>
          <div>
            <p className="font-medium">部署時間</p>
            <p className="text-muted-foreground">2024-01-15 10:30:00</p>
          </div>
          <div>
            <p className="font-medium">數據庫狀態</p>
            <p className="text-success">正常運行</p>
          </div>
        </div>
      </Card>
    </div>
  );
}