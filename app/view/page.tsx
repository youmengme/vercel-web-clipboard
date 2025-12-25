"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Copy, Trash2, Search, Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function ViewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const pwd = searchParams.get("pwd");

  const [content, setContent] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(!!key);
  const [error, setError] = useState("");
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordInput, setPasswordInput] = useState(pwd || "");
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (key) {
      fetchContent(key, pwd || undefined);
    }
  }, [key, pwd]);

  const fetchContent = async (queryKey: string, password?: string) => {
    setLoading(true);
    setError("");
    setNotFound(false);

    try {
      const url = new URL(`/api/clipboard/${queryKey}`, window.location.origin);
      if (password) {
        url.searchParams.set("pwd", password);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        if (response.status === 404) {
          setNotFound(true);
          setError("内容不存在或已被删除");
        } else {
          setError("获取内容失败，请重试");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.passwordRequired) {
        setPasswordRequired(true);
        if (data.error) {
          setError("密码错误，请重试");
        }
      } else {
        setPasswordRequired(false);
        setContent(data.content || "");
        setViewCount(data.viewCount || 0);
      }
    } catch (err) {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = () => {
    if (key) {
      router.push(`/view?key=${encodeURIComponent(key)}&pwd=${encodeURIComponent(passwordInput)}`);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("复制失败，请手动复制");
    }
  };

  const handleDelete = async () => {
    if (!key || !confirm("确定要删除这条内容吗？此操作不可恢复。")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/clipboard/${key}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("删除成功");
        router.push("/");
      } else {
        setError("删除失败，请重试");
      }
    } catch (err) {
      setError("删除失败，请重试");
    } finally {
      setDeleting(false);
    }
  };

  if (!key) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card className="border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="mb-4 h-16 w-16 text-destructive" />
            <p className="text-lg text-muted-foreground">未提供查询密钥</p>
            <Button onClick={() => router.push("/")} className="mt-6">
              返回首页
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6" />
            查看内容
          </CardTitle>
          <CardDescription>
            密钥: <code className="rounded bg-muted px-2 py-1 text-sm">{key}</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">加载中...</p>
            </div>
          ) : notFound ? (
            <div className="flex flex-col items-center justify-center py-12">
              <XCircle className="mb-4 h-16 w-16 text-destructive" />
              <p className="text-lg text-muted-foreground">{error}</p>
              <Button onClick={() => router.push("/")} className="mt-6">
                返回首页
              </Button>
            </div>
          ) : passwordRequired ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-warning bg-warning/10 p-4">
                <p className="text-sm text-warning-foreground">
                  此内容设置了访问密码，请输入密码查看。
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="请输入密码"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                  className="flex-1"
                />
                <Button onClick={handlePasswordSubmit} disabled={!passwordInput.trim()}>
                  <Search className="mr-2 h-4 w-4" />
                  查询
                </Button>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <XCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={content}
                readOnly
                className="min-h-[200px] resize-none font-mono text-sm"
                placeholder="内容将显示在这里"
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  查看次数: {viewCount}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleCopy}
                    disabled={!content}
                    variant="default"
                    className="flex-1 sm:flex-none"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        一键复制
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleDelete}
                    disabled={deleting}
                    variant="destructive"
                  >
                    {deleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" onClick={() => router.push("/")}>
          返回首页
        </Button>
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ViewPageContent />
    </Suspense>
  );
}
