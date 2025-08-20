import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Blog } from '@/components/blog/Blog';
import { BlogDashboard } from '@/components/blog/BlogDashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<'blog' | 'dashboard'>('blog');

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      {currentView === 'blog' ? (
        <Blog onManage={() => setCurrentView('dashboard')} />
      ) : (
        <BlogDashboard />
      )}
    </div>
  );
};

export default Index;
