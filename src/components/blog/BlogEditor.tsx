import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Eye, Plus, Trash2, Settings, Upload, Image } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './BlogEditor.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBlogData } from '@/hooks/useBlogData';
import { BlogPost, FAQ, TableOfContentsItem } from '@/types/blog';
import { useToast } from '@/hooks/use-toast';

interface BlogEditorProps {
  post?: BlogPost | null;
  onBack: () => void;
}

export const BlogEditor = ({ post, onBack }: BlogEditorProps) => {
  const { categories, addBlogPost, updateBlogPost } = useBlogData();
  const { toast } = useToast();
  const [isPreview, setIsPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [author, setAuthor] = useState(post?.author || '');
  const [category, setCategory] = useState(post?.category || '');
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isPublished, setIsPublished] = useState(post?.isPublished || false);
  const [faqs, setFaqs] = useState<FAQ[]>(post?.faqs || []);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(post?.tableOfContents || []);
  
  // Image handling
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        // Insert image into content at cursor position
        const imageTag = `<img src="${imageUrl}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`;
        setContent(content + '\n\n' + imageTag + '\n\n');
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate read time based on content
  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addFAQ = () => {
    setFaqs([...faqs, {
      id: Date.now().toString(),
      question: '',
      answer: ''
    }]);
  };

  const updateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ));
  };

  const removeFAQ = (id: string) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  const generateTableOfContents = () => {
    const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
    const toc: TableOfContentsItem[] = headings.map((heading, index) => {
      const level = heading.match(/^#+/)?.[0].length || 1;
      const title = heading.replace(/^#+\s+/, '');
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      return {
        id,
        title,
        level
      };
    });
    
    setTableOfContents(toc);
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title for your blog post.",
        variant: "destructive"
      });
      return;
    }

    const blogPostData = {
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + '...',
      author: author || 'Anonymous',
      category: category || 'Technology',
      tags,
      isPublished,
      readTime: calculateReadTime(content),
      tableOfContents,
      faqs
    };

    if (post) {
      updateBlogPost(post.id, blogPostData);
      toast({
        title: "Post Updated",
        description: "Your blog post has been updated successfully.",
      });
    } else {
      addBlogPost(blogPostData);
      toast({
        title: "Post Created",
        description: "Your new blog post has been created successfully.",
      });
    }

    onBack();
  };

  // Auto-generate table of contents when content changes
  useEffect(() => {
    if (content) {
      generateTableOfContents();
    }
  }, [content]);

  const renderPreview = () => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Badge className="mb-4 bg-primary/20 text-primary">{category}</Badge>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground mb-6">{excerpt}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>By {author}</span>
          <span>•</span>
          <span>{calculateReadTime(content)} min read</span>
          <span>•</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {tableOfContents.length > 0 && (
        <Card className="mb-8 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Table of Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tableOfContents.map((item, index) => (
                <div 
                  key={index}
                  className={`text-sm hover:text-primary cursor-pointer transition-colors ${
                    item.level === 1 ? 'font-semibold' : 
                    item.level === 2 ? 'ml-4' : 'ml-8 text-muted-foreground'
                  }`}
                >
                  {item.title}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

        <Card className="mb-8 bg-gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="prose max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-blockquote:text-muted-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-ol:text-foreground prose-ul:text-foreground prose-li:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </CardContent>
        </Card>

      {faqs.length > 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.id}>
                  <h4 className="font-semibold text-foreground mb-2">{faq.question}</h4>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderEditor = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>Write your blog post content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your blog post title..."
                className="mt-1 bg-card/50"
              />
            </div>
            
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description of your post..."
                className="mt-1 bg-card/50"
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="content">Content</Label>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  onClick={handleImageUpload}
                  className="gap-1"
                >
                  <Image className="w-4 h-4" />
                  Add Image
                </Button>
              </div>
              <div className="border rounded-lg bg-card/50">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  placeholder="Write your blog post content here..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, 4, false] }],
                      [{ 'size': ['small', false, 'large', 'huge'] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'script': 'sub'}, { 'script': 'super' }],
                      [{ 'indent': '-1'}, { 'indent': '+1' }],
                      [{ 'align': [] }],
                      ['blockquote', 'code-block'],
                      ['link', 'image', 'video'],
                      ['clean']
                    ],
                  }}
                  formats={[
                    'header', 'font', 'size',
                    'bold', 'italic', 'underline', 'strike', 'blockquote',
                    'list', 'bullet', 'indent',
                    'link', 'image', 'video',
                    'align', 'color', 'background',
                    'script', 'code-block'
                  ]}
                  style={{ minHeight: '400px' }}
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* FAQs Section */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>FAQs</CardTitle>
                <CardDescription>Add frequently asked questions</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addFAQ}>
                <Plus className="w-4 h-4 mr-1" />
                Add FAQ
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="p-4 border border-border/50 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label>Question {index + 1}</Label>
                        <Input
                          value={faq.question}
                          onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                          placeholder="Enter question..."
                          className="mt-1 bg-card/50"
                        />
                      </div>
                      <div>
                        <Label>Answer</Label>
                        <Textarea
                          value={faq.answer}
                          onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                          placeholder="Enter answer..."
                          className="mt-1 bg-card/50"
                          rows={3}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFAQ(faq.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Post Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                className="mt-1 bg-card/50"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1 bg-card/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="bg-card/50"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button variant="outline" size="sm" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="published">Published</Label>
              <Switch
                id="published"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <div>Read time: {calculateReadTime(content)} minutes</div>
              <div>Word count: {content.split(/\s+/).length} words</div>
            </div>
          </CardContent>
        </Card>

        {tableOfContents.length > 0 && (
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Table of Contents</CardTitle>
              <CardDescription>Auto-generated from headings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                {tableOfContents.map((item, index) => (
                  <div 
                    key={index}
                    className={`${
                      item.level === 1 ? 'font-semibold' : 
                      item.level === 2 ? 'ml-4' : 'ml-8 text-muted-foreground'
                    }`}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {post ? 'Edit Post' : 'Create New Post'}
              </h1>
              <p className="text-muted-foreground">
                {post ? 'Update your blog post' : 'Write and publish your new blog post'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button onClick={handleSave} className="bg-gradient-primary">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Content */}
        {isPreview ? renderPreview() : renderEditor()}
      </div>
    </div>
  );
};