'use client';
import React, { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, updateDoc, doc, limit } from 'firebase/firestore';
import { Bell, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

type Notification = {
    id: string;
    message: string;
    timestamp: any;
    isRead: boolean;
    type: 'Warning' | 'Alert';
    sensorName: string;
};

export const NotificationPanel = () => {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isOpen, setIsOpen] = useState(false);

  const notificationsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, `users/${user.uid}/notifications`),
      orderBy("timestamp", "desc"),
      limit(20)
    );
  }, [firestore, user?.uid]);

  const { data: notifications, isLoading } = useCollection<Notification>(notificationsQuery);
  
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  const handleRead = async (id: string) => {
    if (!firestore || !user?.uid) return;
    const ref = doc(firestore, `users/${user.uid}/notifications`, id);
    try {
      await updateDoc(ref, { isRead: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!firestore || !user?.uid || !notifications) return;
    const unreadNotifications = notifications.filter(n => !n.isRead);
    for (const notif of unreadNotifications) {
      const ref = doc(firestore, `users/${user.uid}/notifications`, notif.id);
      await updateDoc(ref, { isRead: true });
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute top-1 right-1 h-4 w-4 justify-center rounded-full p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96">
        <DropdownMenuLabel className="flex justify-between items-center p-3">
          <span className="font-headline">Live Alerts</span>
          {unreadCount > 0 && <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={markAllAsRead}>Mark all as read</Button>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {isLoading && <p className="p-4 text-center text-sm text-muted-foreground">Loading alerts...</p>}
          {!isLoading && notifications?.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">No new warnings.</p>
          )}
          {notifications?.map((msg) => (
            <DropdownMenuItem
              key={msg.id}
              className={cn("items-start gap-3 p-3 focus:bg-accent cursor-pointer", !msg.isRead && 'bg-primary/5')}
              onSelect={(e) => { e.preventDefault(); handleRead(msg.id); }}
            >
              <div className={cn(msg.type === 'Warning' ? 'text-red-500' : 'text-yellow-400', 'mt-1')}>
                <AlertCircle size={18} />
              </div>
              <div className="flex-1 space-y-1">
                <p className={cn('text-sm font-medium leading-tight', !msg.isRead ? 'text-foreground' : 'text-muted-foreground')}>
                  {msg.message}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={12} />
                  <span>
                    {msg.timestamp ? formatDistanceToNow(msg.timestamp.toDate(), { addSuffix: true }) : 'just now'}
                  </span>
                </div>
              </div>
              {!msg.isRead && <div className="mt-1 h-2 w-2 self-start rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"></div>}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
