import { useState } from 'react';
import { Calendar, Clock, User, ArrowRight, Hash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBlogData } from '@/hooks/useBlogData';
import { BlogPost } from '@/types/blog';
import heroImage from '@/assets/hero-ai-blog.jpg';

interface BlogProps {
  onManage?: () => void;
}

export const Blog = ({ onManage }: BlogProps) => {
  const { blogPosts, categories } = useBlogData();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const publishedPosts = blogPosts.filter(post => post.isPublished);
  
  const filteredPosts = publishedPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderBlogPost = (post: BlogPost) => (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            {post.category}
          </Badge>
          <span className="text-muted-foreground">•</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {post.publishedAt.toLocaleDateString()}
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          {post.title}
        </h1>
        
        <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
        
        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {post.author}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readTime} min read
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Hash className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Table of Contents */}
      {post.tableOfContents && post.tableOfContents.length > 0 && (
        <Card className="mb-8 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Table of Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {post.tableOfContents.map((item, index) => (
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

      {/* Content */}
      <Card className="mb-8 bg-gradient-card border-border/50">
        <CardContent className="pt-6">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {post.content}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      {post.faqs && post.faqs.length > 0 && (
        <Card className="mb-8 bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">
              FAQs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {post.faqs.map((faq) => (
                <div key={faq.id} className="border-l-2 border-primary/30 pl-4">
                  <h4 className="font-semibold text-foreground mb-2">{faq.question}</h4>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button variant="outline" onClick={() => setSelectedPost(null)}>
          ← Back to Blog
        </Button>
      </div>
    </div>
  );

  const renderBlogList = () => (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero rounded-xl mb-12">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="AI Blog Hero" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        </div>
        <div className="relative px-8 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            AI-Powered Insights
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover the latest trends, strategies, and innovations shaping the future of enterprise technology
          </p>
          {onManage && (
            <Button onClick={onManage} className="bg-gradient-primary hover:shadow-glow-primary">
              Manage Blog <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-card/50 border-border/50"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card 
            key={post.id} 
            className="bg-gradient-card border-border/50 hover:shadow-elevated transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedPost(post)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {post.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {post.readTime}m
                </div>
              </div>
              <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </CardTitle>
              <CardDescription className="line-clamp-3">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {post.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.publishedAt.toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-1 flex-wrap">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 2}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm || selectedCategory !== 'all' 
              ? 'No articles match your search criteria.' 
              : 'No published articles yet.'
            }
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6">
        {selectedPost ? renderBlogPost(selectedPost) : renderBlogList()}
      </div>
    </div>
  );
};