import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Message } from "@shared/schema";
import { Mail, MailOpen, Trash2, Calendar } from "lucide-react";

export default function MessagesView() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["/api/messages"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PUT", `/api/messages/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({ title: "Message marked as read" });
    },
    onError: () => {
      toast({ title: "Failed to mark message as read", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({ title: "Message deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete message", variant: "destructive" });
    },
  });

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div>Loading messages...</div>;
  }

  const unreadCount = messages?.filter((m: Message) => !m.read).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Messages</h2>
          <p className="text-muted-foreground">
            Contact form submissions from your portfolio
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            Total: {messages?.length || 0}
          </Badge>
          {unreadCount > 0 && (
            <Badge variant="destructive">
              Unread: {unreadCount}
            </Badge>
          )}
        </div>
      </div>

      {messages?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-muted-foreground">
              Messages from your contact form will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages?.map((message: Message) => (
            <Card key={message.id} className={!message.read ? "border-primary/50" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{message.name}</CardTitle>
                      {!message.read && (
                        <Badge variant="destructive" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{message.email}</span>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(message.createdAt!)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!message.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(message.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                        <MailOpen className="w-4 h-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(message.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Subject</h4>
                    <p className="font-medium">{message.subject}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Message</h4>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>You can reply directly to: {message.email}</span>
                    <span>ID: {message.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
