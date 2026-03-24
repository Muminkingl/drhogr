'use client';

import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

type ActivityGroup = {
  id: string;
  action: string;
  user: string;
  time: string;
  icon: any;
  color: string;
};

export const RecentActivity = memo(() => {
  const [activities, setActivities] = useState<ActivityGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      // Fetch latest posts to simulate activity
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, author, created_at, image_url')
        .order('created_at', { ascending: false })
        .limit(5);

      if (data && !error) {
        const parsed = data.map((post) => {
          const hasImage = !!post.image_url;
          return {
            id: post.id,
            action: `Published: ${post.title}`,
            user: post.author || 'Admin',
            time: timeAgo(post.created_at),
            icon: hasImage ? ImageIcon : FileText,
            color: 'text-primary',
          };
        });
        setActivities(parsed);
      }
      setLoading(false);
    };

    fetchActivities();
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card/40 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">Recent Post Activity</h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
           <div className="w-6 h-6 rounded-full animate-spin border-2 border-muted border-t-primary" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No recent activity found.
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id + index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-accent/50 group"
              >
                <div className="rounded-xl p-2.5 bg-accent/50 group-hover:bg-background transition-colors">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate text-foreground">{activity.action}</div>
                  <div className="text-xs truncate text-muted-foreground mt-0.5">
                    By {activity.user}
                  </div>
                </div>
                <div className="text-xs font-medium text-muted-foreground">
                  {activity.time}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
});

RecentActivity.displayName = 'RecentActivity';
