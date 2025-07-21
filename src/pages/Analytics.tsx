import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  FileText, 
  Search,
  Calendar,
  Activity
} from "lucide-react";

const analyticsData = {
  overview: {
    totalQuestions: 1247,
    totalDocuments: 156,
    totalUsers: 28,
    avgResponseTime: 2.3
  },
  recentActivity: [
    { time: '10:30', user: '張三', action: '搜索了「API文檔」', type: 'search' },
    { time: '10:25', user: '李四', action: '上傳了「新產品說明書.pdf」', type: 'upload' },
    { time: '10:20', user: '王五', action: '詢問了關於員工政策的問題', type: 'chat' },
    { time: '10:15', user: '趙六', action: '下載了「技術規範.docx」', type: 'download' },
    { time: '10:10', user: '錢七', action: '搜索了「會議記錄」', type: 'search' }
  ],
  popularQuestions: [
    { question: '如何申請年假？', count: 45, trend: 'up' },
    { question: 'API接口如何認證？', count: 38, trend: 'up' },
    { question: '員工福利有哪些？', count: 32, trend: 'down' },
    { question: '技術規範要求是什麼？', count: 28, trend: 'up' },
    { question: '會議室預訂流程？', count: 24, trend: 'stable' }
  ],
  documentStats: [
    { type: 'PDF', count: 67, percentage: 43 },
    { type: 'Word', count: 45, percentage: 29 },
    { type: 'Markdown', count: 32, percentage: 20 },
    { type: '文本', count: 12, percentage: 8 }
  ]
};

export default function Analytics() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'search':
        return <Search className="h-4 w-4 text-primary" />;
      case 'upload':
        return <FileText className="h-4 w-4 text-success" />;
      case 'chat':
        return <MessageCircle className="h-4 w-4 text-accent-foreground" />;
      case 'download':
        return <Activity className="h-4 w-4 text-warning" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-success" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-destructive rotate-180" />;
      default:
        return <div className="h-3 w-3 bg-muted-foreground rounded-full" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">使用統計</h2>
        <p className="text-muted-foreground">查看系統使用情況和數據分析</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{analyticsData.overview.totalQuestions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">總問題數</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <FileText className="h-6 w-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold">{analyticsData.overview.totalDocuments}</div>
              <div className="text-sm text-muted-foreground">文檔總數</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Users className="h-6 w-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold">{analyticsData.overview.totalUsers}</div>
              <div className="text-sm text-muted-foreground">活躍用戶</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg">
              <BarChart3 className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold">{analyticsData.overview.avgResponseTime}s</div>
              <div className="text-sm text-muted-foreground">平均響應時間</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            最近活動
          </h3>
          <div className="space-y-3">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user} · {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Popular Questions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            熱門問題
          </h3>
          <div className="space-y-3">
            {analyticsData.popularQuestions.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.question}</p>
                  <p className="text-xs text-muted-foreground">被詢問 {item.count} 次</p>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(item.trend)}
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Statistics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            文檔類型分布
          </h3>
          <div className="space-y-4">
            {analyticsData.documentStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{stat.type}</span>
                  <span>{stat.count} 個 ({stat.percentage}%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Health */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            系統狀態
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <span className="text-sm font-medium">API服務</span>
              <Badge className="bg-success text-success-foreground">正常</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <span className="text-sm font-medium">數據庫</span>
              <Badge className="bg-success text-success-foreground">正常</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
              <span className="text-sm font-medium">向量數據庫</span>
              <Badge className="bg-warning text-warning-foreground">負載較高</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <span className="text-sm font-medium">文檔處理</span>
              <Badge className="bg-success text-success-foreground">正常</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Usage Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          使用趨勢
        </h3>
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="mx-auto h-12 w-12 mb-4" />
          <p>圖表功能開發中...</p>
          <p className="text-sm">將顯示每日使用量、問題類型分布等詳細統計</p>
        </div>
      </Card>
    </div>
  );
}