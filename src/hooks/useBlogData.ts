import { useState, useEffect } from 'react';
import { BlogPost, BlogCategory } from '@/types/blog';

// Mock data for demonstration
const mockCategories: BlogCategory[] = [
  { id: '1', name: 'Technology', description: 'Latest tech trends and insights', color: 'primary' },
  { id: '2', name: 'AI & Machine Learning', description: 'Artificial Intelligence developments', color: 'accent' },
  { id: '3', name: 'Business Strategy', description: 'Enterprise and business insights', color: 'success' },
];

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How AI Transformed Fortune 500 Operations: 4 Proven Levers for Enterprise Efficiency',
    content: `# Introduction

AI isn't simply another tech trend; it's becoming the invisible engine behind how Fortune 500 companies operate, innovate, and grow. From personalised customer journeys to intelligent product development and proactive security, AI is reshaping the enterprise playbook.

## Why Fortune 500 Rely on AI

So, if the world's most successful companies are treating AI like their operating system for efficiency, what's stopping you? Whether you're scaling or moving past getting started, the right AI-first approach can unlock serious value. At doublethie, we help you make that leap - strategically, seamlessly, and at speed.

## The 4 Proven AI Strategies

### 1. Process Automation
Fortune 500 companies use artificial intelligence for process automation, predictive analytics, risk management, and personalised customer experiences. They integrate AI into workflows to boost efficiency, cut costs, and drive faster innovation.

### 2. Predictive Analytics
A few years ago, AI was mostly stuck in innovation labs and boardroom decks. Today, it's powering real-world operations, from how companies streamline global supply chains to how they personalise customer experiences at scale.

### 3. Risk Management
Companies like Netflix, Uber, Ford, Johnson & Johnson aren't just experimenting; they're scaling AI-first approaches to cut costs, move faster, and stay ahead of the curve.

### 4. Customer Experience
So, what exactly are they doing differently? And more importantly, what does this mean for your business?`,
    excerpt: 'Discover how Fortune 500 companies are leveraging AI to transform their operations and drive unprecedented efficiency gains.',
    author: 'Tech Insights Team',
    category: 'AI & Machine Learning',
    tags: ['AI', 'Fortune 500', 'Enterprise', 'Efficiency'],
    publishedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    isPublished: true,
    readTime: 8,
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'why-fortune-500-rely-on-ai', title: 'Why Fortune 500 Rely on AI', level: 2 },
      { id: 'the-4-proven-ai-strategies', title: 'The 4 Proven AI Strategies', level: 2 },
      { id: 'process-automation', title: 'Process Automation', level: 3 },
      { id: 'predictive-analytics', title: 'Predictive Analytics', level: 3 },
      { id: 'risk-management', title: 'Risk Management', level: 3 },
      { id: 'customer-experience', title: 'Customer Experience', level: 3 },
    ],
    faqs: [
      {
        id: '1',
        question: 'How are Fortune 500 companies using artificial intelligence?',
        answer: 'Fortune 500 companies use artificial intelligence for process automation, predictive analytics, risk management, and personalised customer experiences. They integrate AI into workflows to boost efficiency, cut costs, and drive faster innovation.'
      },
      {
        id: '2',
        question: 'What is AI-driven enterprise efficiency?',
        answer: 'AI-driven enterprise efficiency refers to the strategic implementation of artificial intelligence technologies to streamline operations, reduce costs, and improve productivity across all business functions.'
      },
      {
        id: '3',
        question: 'What are the benefits of AI in enterprise operations?',
        answer: 'AI in enterprise operations provides benefits including automated processes, predictive insights, improved decision-making, enhanced customer experiences, reduced operational costs, and faster innovation cycles.'
      }
    ]
  },
  {
    id: '2',
    title: 'Wrapping Up: AI as the Operating System for Enterprise Efficiency',
    content: `# The Future of Enterprise AI

AI isn't just another tech upgrade—it's the foundation of tomorrow's most successful enterprises. Companies that embrace AI as their operating system today will lead their industries tomorrow.

## Key Takeaways

- AI integration should be strategic, not reactive
- Process automation delivers immediate ROI
- Predictive analytics enables proactive decision-making
- Customer experience is the ultimate differentiator

## Next Steps

Ready to transform your enterprise with AI? Start with a strategic assessment of your current processes and identify high-impact automation opportunities.`,
    excerpt: 'Understanding why AI has become the invisible operating system powering Fortune 500 success stories.',
    author: 'Enterprise AI Team',
    category: 'Business Strategy',
    tags: ['AI', 'Strategy', 'Enterprise', 'Operations'],
    publishedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    isPublished: true,
    readTime: 5,
    tableOfContents: [
      { id: 'the-future-of-enterprise-ai', title: 'The Future of Enterprise AI', level: 1 },
      { id: 'key-takeaways', title: 'Key Takeaways', level: 2 },
      { id: 'next-steps', title: 'Next Steps', level: 2 },
    ],
    faqs: [
      {
        id: '1',
        question: 'Why should AI be considered an operating system?',
        answer: 'AI acts as an operating system because it integrates across all business functions, enabling seamless automation, intelligence, and optimization at every level of the organization.'
      }
    ]
  }
];

export const useBlogData = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [categories, setCategories] = useState<BlogCategory[]>(mockCategories);
  const [loading, setLoading] = useState(false);

  const addBlogPost = (post: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt'>) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      publishedAt: new Date(),
      updatedAt: new Date(),
    };
    setBlogPosts([newPost, ...blogPosts]);
    return newPost;
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts(posts => 
      posts.map(post => 
        post.id === id 
          ? { ...post, ...updates, updatedAt: new Date() }
          : post
      )
    );
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(posts => posts.filter(post => post.id !== id));
  };

  const getBlogPost = (id: string) => {
    return blogPosts.find(post => post.id === id);
  };

  return {
    blogPosts,
    categories,
    loading,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getBlogPost,
  };
};