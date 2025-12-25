"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Search Module */}
      <Card className="border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl">查找剪贴板内容</CardTitle>
          <CardDescription className="text-base">
            输入密钥快速获取存储的内容
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="请输入查询 key"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-base"
              maxLength={100}
            />
            <Button
              onClick={handleSearch}
              size="default"
              className="px-6"
              disabled={!searchKey.trim()}
            >
              <Search className="mr-2 h-5 w-5" />
              查找
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Module */}
      <Card className="border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl">添加新内容</CardTitle>
          <CardDescription className="text-base">
            创建一个新的剪贴板条目并分享
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleAdd}
            size="lg"
            className="w-full md:w-auto md:min-w-[200px]"
          >
            <Plus className="mr-2 h-5 w-5" />
            添加内容
          </Button>
        </CardContent>
      </Card>

      {/* Info Section */}
      <div className="rounded-lg border bg-muted/50 p-6 text-center text-muted-foreground">
        <p className="text-sm">
          简单、快速的在线剪贴板工具。支持设置访问密码，内容安全可靠。
        </p>
      </div>
    </div>
  );
}
