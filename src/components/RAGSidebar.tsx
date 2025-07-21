import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  MessageCircle, 
  FileText, 
  Upload, 
  Search, 
  Settings, 
  BarChart3,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { 
    title: "智能問答", 
    url: "/", 
    icon: MessageCircle,
    description: "與知識庫對話"
  },
  { 
    title: "文檔管理", 
    url: "/documents", 
    icon: FileText,
    description: "管理文檔庫"
  },
  { 
    title: "文檔上傳", 
    url: "/upload", 
    icon: Upload,
    description: "上傳新文檔"
  },
  { 
    title: "搜索檢索", 
    url: "/search", 
    icon: Search,
    description: "檢索知識庫"
  },
  { 
    title: "使用統計", 
    url: "/analytics", 
    icon: BarChart3,
    description: "查看使用數據"
  },
  { 
    title: "系統設置", 
    url: "/settings", 
    icon: Settings,
    description: "配置系統參數"
  }
];

export function RAGSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className={cn(
      "bg-rag-sidebar text-rag-sidebar-foreground transition-all duration-300 ease-in-out flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold">RAG智能助手</h1>
              <p className="text-sm text-white/70">內部知識管理系統</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:bg-white/10 p-2"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.url}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-all hover:bg-white/10",
                  isActive(item.url) 
                    ? "bg-white/15 text-white font-medium" 
                    : "text-white/80 hover:text-white"
                )}
              >
                <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && (
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-white/60">{item.description}</div>
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-white/60">
            <p>版本 1.0.0</p>
            <p>© 2024 內部RAG系統</p>
          </div>
        </div>
      )}
    </div>
  );
}