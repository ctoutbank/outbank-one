import {markAllNotificationsAsReadByUser} from "@/features/notifications/server/notification";

export async function POST(){
    return await markAllNotificationsAsReadByUser()
}