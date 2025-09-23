import {
    deleteNotifications,
    updateNotification
} from "@/features/notifications/server/notification";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return await updateNotification(req, { params: resolvedParams });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = await params;
   return await deleteNotifications(req, { params: resolvedParams });
}

