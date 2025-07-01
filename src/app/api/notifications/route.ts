import {getNotificationsByUser} from "@/features/notifications/server/notification";

export async function GET(){
  return await getNotificationsByUser()
}