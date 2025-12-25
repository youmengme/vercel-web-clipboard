"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { sanitizeKey } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    <div className="w-[100vw] h-[100vh] flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader className="w-full">
          <CardTitle className="text-center">网络剪切板</CardTitle>
          <CardDescription className="text-center">
            简单、快速的临时内容分享工具
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">查询秘钥</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="请输入查询秘钥"
                  required
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 w-full">
          <Button type="button" onClick={handleSearch} className="w-full">
            查询
          </Button>
          <Button variant="outline" className="w-full" onClick={handleAdd}>
            添加
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
