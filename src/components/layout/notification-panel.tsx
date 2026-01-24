'use client';
import React, { useState } from 'react';
import { useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, query, orderBy, updateDoc, doc, limit, deleteDoc } from 'firebase/firestore';
import { Bell, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

type Notification = {
    id: string;
    message: string;
    timestamp: any;
    isRead: boolean;
    type: 'Warning' | 'Alert';
    sensorName: string;
    currentValue: string;
    normalRange: string;
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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!firestore || !user?.uid) return;
    const ref = doc(firestore, `users/${user.uid}/notifications`, id);
    try {
      await deleteDoc(ref);
    } catch (error) {
      console.error("Error deleting notification:", error);
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
              className={cn("items-start gap-0 p-2 focus:bg-transparent cursor-pointer my-1 first:mt-0 last:mb-0")}
              onSelect={(e) => { e.preventDefault(); handleRead(msg.id); }}
            >
              <div className={cn(
                "relative p-3 rounded-lg w-full border",
                msg.type === 'Warning' ? 'bg-status-red/10 border-status-red/20' : 'bg-status-orange/10 border-status-orange/20',
                !msg.isRead && (msg.type === 'Warning' ? 'bg-status-red/20' : 'bg-status-orange/20')
              )}>
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <AlertCircle className={cn(msg.type === 'Warning' ? 'text-status-red' : 'text-status-orange', 'h-5 w-5 shrink-0')} />
                        {msg.sensorName}
                    </h4>
                    <div className="flex items-center gap-1">
                      {!msg.isRead && <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))] shrink-0"></div>}
                       <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-black/10 rounded-full z-10"
                          onClick={(e) => handleDelete(e, msg.id)}
                       >
                          <Trash2 size={14} />
                          <span className="sr-only">Delete notification</span>
                      </Button>
                    </div>
                </div>
                
                <div className="pl-7 space-y-2">
                  <p className={cn(
                      "text-sm font-semibold pr-6",
                      msg.type === 'Warning' ? 'text-status-red' : 'text-status-orange'
                  )}>
                      {msg.message}
                  </p>
        
                  <div className="grid grid-cols-2 gap-x-4 text-xs text-muted-foreground">
                      <div><span className='font-medium text-foreground/80'>Value:</span> {msg.currentValue}</div>
                      <div><span className='font-medium text-foreground/80'>Normal:</span> {msg.normalRange}</div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>
                          {msg.timestamp ? format(msg.timestamp.toDate(), 'PPp') : 'just now'}
                      </span>
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
