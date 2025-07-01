import {createUserNotification} from "@/features/notifications/server/notification";

export async function POST(){
    return await createUserNotification()
}
