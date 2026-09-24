import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Newspaper, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBlogPosts,
  useDeleteBlogPost,
  useIsAdmin,
  useSaveBlogPost,
  type BlogPost,
} from "@/community/hooks/queries";
import { uploadBlogImage, validateImage } from "@/community/lib/storage";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function excerptFrom(content: string) {
  const flat = content.replace(/\s+/g, " ").trim();
  return flat.length > 160 ? `${flat.slice(0, 160)}…` : flat;
}

type FormState = {
  id?: string;
  title: string;
  content: string;
  coverImageUrl: string | null;
  galleryImageUrls: string[];
  published: boolean;
  publishedAt: string | null;
  originalSlug: string | null;
};

const EMPTY_FORM: FormState = {
  title: "",
  content: "",
  coverImageUrl: null,
  galleryImageUrls: [],
  published: false,
  publishedAt: null,
  originalSlug: null,
};

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("sk-SK", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export default function CommunityAdminBlog() {
  const { data: isAdmin, isLoading: loadingRole } = useIsAdmin();
  const enabled = isAdmin === true;
  const { data: posts, isLoading } = useBlogPosts(enabled ? true : false);
  const saveBlogPost = useSaveBlogPost();
  const deleteBlogPost = useDeleteBlogPost();

  const [form, setForm] = useState<FormState | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  if (loadingRole) return <Skeleton className="h-64 w-full" />;

  if (!isAdmin) {
    return (
      <div className="space-y-4 py-10 text-center">
        <h1 className="font-display text-3xl">Táto časť je len pre administrátora</h1>
        <Link to="/community" className="inline-block text-sm uppercase tracking-[0.16em] underline">
          Domov
        </Link>
      </div>
    );
  }

  const startNew = () => setForm({ ...EMPTY_FORM });
  const startEdit = (post: BlogPost) =>
    setForm({
      id: post.id,
      title: post.title,
      content: post.content,
      coverImageUrl: post.cover_image_url,
      galleryImageUrls: post.gallery_image_urls,
      published: post.published,
      publishedAt: post.published_at,
      originalSlug: post.slug,
    });

  const pickCover = async (file: File) => {
    const problem = validateImage(file);
    if (problem) return toast.error(problem);
    setUploadingCover(true);
    try {
      const url = await uploadBlogImage(file);
      setForm((f) => (f ? { ...f, coverImageUrl: url } : f));
    } catch {
      toast.error("Fotku sa nepodarilo nahrať.");
    } finally {
      setUploadingCover(false);
    }
  };

  const pickGallery = async (files: File[]) => {
    setUploadingGallery(true);
    try {
      for (const file of files) {
        const problem = validateImage(file);
        if (problem) {
          toast.error(problem);
          continue;
        }
        const url = await uploadBlogImage(file);
        setForm((f) => (f ? { ...f, galleryImageUrls: [...f.galleryImageUrls, url] } : f));
      }
    } finally {
      setUploadingGallery(false);
    }
  };

  const save = async () => {
    if (!form) return;
    const title = form.title.trim();
    const content = form.content.trim();
    if (!title) return toast.error("Napíš názov článku.");
    if (!content) return toast.error("Napíš text článku.");

    let slug = form.originalSlug ?? slugify(title);
    if (!form.originalSlug) {
      const base = slugify(title) || "clanok";
      const existingSlugs = new Set((posts ?? []).map((p) => p.slug));
      slug = base;
      let i = 2;
      while (existingSlugs.has(slug)) {
        slug = `${base}-${i}`;
        i += 1;
      }
    }

    const nowPublishing = form.published && !form.publishedAt;

    try {
      await saveBlogPost.mutateAsync({
        id: form.id,
        slug,
        title,
        content,
        excerpt: excerptFrom(content),
        cover_image_url: form.coverImageUrl,
        gallery_image_urls: form.galleryImageUrls,
        published: form.published,
        published_at: nowPublishing ? new Date().toISOString() : form.publishedAt,
      });
      toast.success(form.published ? "Článok je publikovaný." : "Článok je uložený ako koncept.");
      setForm(null);
    } catch {
      toast.error("Článok sa nepodarilo uložiť.");
    }
  };

  const remove = async (post: BlogPost) => {
    if (!window.confirm(`Naozaj zmazať článok „${post.title}“?`)) return;
    try {
      await deleteBlogPost.mutateAsync(post.id);
      toast.success("Článok je zmazaný.");
    } catch {
      toast.error("Článok sa nepodarilo zmazať.");
    }
  };

  if (form) {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between gap-3">
          <h1 className="font-display text-2xl">{form.id ? "Upraviť článok" : "Nový článok"}</h1>
          <Button variant="ghost" size="sm" onClick={() => setForm(null)}>
            Zrušiť
          </Button>
        </header>

        <div className="space-y-2">
          <Label htmlFor="blog-title">Názov</Label>
          <Input
            id="blog-title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Napr. Návrat k sebe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="blog-content">Text</Label>
          <Textarea
            id="blog-content"
            rows={12}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Napíš svoj článok. Prázdny riadok = nový odsek."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="blog-cover" className="cursor-pointer underline">
            {uploadingCover ? "Nahrávam..." : "Hlavná fotka"}
          </Label>
          <input
            id="blog-cover"
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploadingCover}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void pickCover(file);
            }}
          />
          {form.coverImageUrl && (
            <div className="relative">
              <img src={form.coverImageUrl} alt="Náhľad hlavnej fotky" className="h-48 w-full rounded-lg object-cover" />
              <button
                type="button"
                aria-label="Odstrániť hlavnú fotku"
                onClick={() => setForm({ ...form, coverImageUrl: null })}
                className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 text-foreground shadow"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="blog-gallery" className="cursor-pointer underline">
            {uploadingGallery ? "Nahrávam..." : "Ďalšie fotky (nepovinné)"}
          </Label>
          <input
            id="blog-gallery"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={uploadingGallery}
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              e.target.value = "";
              if (files.length) void pickGallery(files);
            }}
          />
          {form.galleryImageUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {form.galleryImageUrls.map((url) => (
                <div key={url} className="relative">
                  <img src={url} alt="Náhľad fotky" className="aspect-square w-full rounded-md object-cover" />
                  <button
                    type="button"
                    aria-label="Odstrániť fotku"
                    onClick={() =>
                      setForm({ ...form, galleryImageUrls: form.galleryImageUrls.filter((u) => u !== url) })
                    }
                    className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-foreground shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-card p-4 shadow-elevated-sm">
          <div>
            <p className="font-medium">Publikovať</p>
            <p className="text-sm text-muted-foreground">
              {form.published ? "Článok je verejne viditeľný na blogu." : "Zostane ako koncept, len pre teba."}
            </p>
          </div>
          <Switch
            checked={form.published}
            onCheckedChange={(checked) => setForm({ ...form, published: checked })}
            aria-label="Publikovať"
          />
        </div>

        <Button className="w-full" size="lg" onClick={save} disabled={saveBlogPost.isPending}>
          {saveBlogPost.isPending ? "Ukladám..." : "Uložiť"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/community/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Admin
      </Link>

      <header className="flex items-center gap-3">
        <Newspaper className="h-6 w-6 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div className="flex-1">
          <h1 className="font-display text-3xl">Blog</h1>
          <p className="text-sm text-muted-foreground">Píš a publikuj priamo z appky.</p>
        </div>
      </header>

      <Button className="w-full" size="lg" onClick={startNew}>
        <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
        Nový článok
      </Button>

      {isLoading && <Skeleton className="h-40 w-full" />}

      <ul className="divide-y divide-border rounded-2xl border border-border/50 bg-card shadow-elevated-sm">
        {posts?.map((post) => (
          <li key={post.id} className="flex items-center gap-3 px-4 py-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{post.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {post.published ? `Publikované ${post.published_at ? formatDate(post.published_at) : ""}` : "Koncept"}
              </p>
            </div>
            <button
              type="button"
              aria-label="Upraviť"
              onClick={() => startEdit(post)}
              className="p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Zmazať"
              onClick={() => remove(post)}
              className="p-2 text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
        {!isLoading && posts?.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-muted-foreground">Zatiaľ žiadne články.</li>
        )}
      </ul>
    </div>
  );
}
