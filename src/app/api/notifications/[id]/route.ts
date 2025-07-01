import {
    deleteNotifications,
    updateNotification
} from "@/features/notifications/server/notification";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    return await updateNotification(req, { params });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
   return await deleteNotifications(req, { params });
}

