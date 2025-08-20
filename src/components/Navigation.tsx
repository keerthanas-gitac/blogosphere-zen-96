import { Settings, BookOpen, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentView: 'blog' | 'dashboard';
  onViewChange: (view: 'blog' | 'dashboard') => void;
}

export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  return (
    <nav className="bg-gradient-card border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Blog Platform
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={currentView === 'blog' ? 'default' : 'ghost'}
              onClick={() => onViewChange('blog')}
              className={currentView === 'blog' ? 'bg-gradient-primary' : ''}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Blog
            </Button>
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => onViewChange('dashboard')}
              className={currentView === 'dashboard' ? 'bg-gradient-primary' : ''}
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};