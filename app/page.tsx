"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sanitizeKey } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const [searchKey, setSearchKey] = useState("");

  const handleSearch = () => {
    const sanitized = sanitizeKey(searchKey);
    if (sanitized) {
      router.push(`/view?key=${encodeURIComponent(sanitized)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAdd = () => {
    router.push("/add");
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          在线剪贴板
        </h1>
        <p className="text-muted-foreground">
          简单、快速的临时内容分享工具
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Search Card */}
        <Card className="border-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">查找</CardTitle>
            <CardDescription>
              输入密钥快速获取存储的内容
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="text"
              placeholder="请输入密钥"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              maxLength={100}
            />
            <Button
              onClick={handleSearch}
              className="w-full"
              disabled={!searchKey.trim()}
            >
              查找
            </Button>
          </CardContent>
        </Card>

        {/* Add Card */}
        <Card className="border-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">添加</CardTitle>
            <CardDescription>
              创建一个新的剪贴板条目
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleAdd}
              className="w-full"
            >
              添加一个
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>内容将在 10 分钟后自动删除 · 支持密码保护</p>
      </div>
    </div>
  );
}
