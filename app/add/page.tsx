"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Lock, CheckCircle, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sanitizeInput } from "@/lib/utils";

export default function AddPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successKey, setSuccessKey] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("请输入内容");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/clipboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: sanitizeInput(content),
          password: password.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "创建失败");
      }

      const data = await response.json();
      setSuccessKey(data.key);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(successKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("复制失败");
    }
  };

  const handleViewContent = () => {
    if (successKey) {
      router.push(`/view?key=${encodeURIComponent(successKey)}`);
    }
  };

  const handleCreateNew = () => {
    setContent("");
    setPassword("");
    setSuccessKey("");
    setError("");
  };

  if (successKey) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card className="border-2 border-primary">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl">创建成功！</CardTitle>
            <CardDescription className="text-base">
              您的内容已安全保存
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                您的访问密钥
              </label>
              <div className="flex gap-2">
                <Input
                  value={successKey}
                  readOnly
                  className="text-center font-mono text-lg"
                />
                <Button
                  onClick={handleCopyKey}
                  variant="outline"
                  className="px-6"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      已复制
                    </>
                  ) : (
                    "复制"
                  )}
                </Button>
              </div>
            </div>

            {password && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  此内容已设置访问密码
                </p>
              </div>
            )}

            <div className="rounded-lg border border-warning bg-warning/10 p-4">
              <p className="flex items-center gap-2 text-sm text-warning-foreground">
                <Clock className="h-4 w-4" />
                内容将在10分钟后自动删除
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleViewContent}
                variant="default"
                className="flex-1"
              >
                查看内容
              </Button>
              <Button
                onClick={handleCreateNew}
                variant="outline"
                className="flex-1"
              >
                创建新内容
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="ghost"
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回首页
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <Plus className="h-6 w-6" />
            添加新内容
          </CardTitle>
          <CardDescription>
            创建一个新的剪贴板条目，可选设置访问密码
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              内容 *
            </label>
            <Textarea
              id="content"
              placeholder="在此输入您要保存的内容..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
              maxLength={10000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length} / 10,000
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4" />
              访问密码（可选）
            </label>
            <Input
              id="password"
              type="password"
              placeholder="设置密码后，查看内容需要输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground">
              留空表示无需密码即可访问
            </p>
          </div>

          <div className="rounded-lg border border-muted bg-muted/50 px-3 py-2">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              内容将在10分钟后自动删除
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="flex-1"
              size="lg"
            >
              {loading ? (
                "创建中..."
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  添加内容
                </>
              )}
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              返回首页
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
