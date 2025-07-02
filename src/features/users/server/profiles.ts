"use server";

import { generateSlug } from "@/lib/utils";
import { db } from "@/server/db";
import { and, eq, sql } from "drizzle-orm";
import {
  functions,
  moduleFunctions,
  modules,
  profileFunctions,
  profiles,
} from "../../../../drizzle/schema";

export interface Functions {
  id: number;
  name: string;
  selected: boolean;
}

export interface Group {
  id: string;
  functions: Functions[];
}

export interface ModuleDetail {
  id: number;
  group: Group[];
}

export interface ModuleSelect {
  id: number;
  name: string;
  group: Group[];
}

export interface ProfileDetailForm {
  id?: number;
  name?: string;
  description?: string;
  module?: ModuleSelect[];
  isSalesAgent?: boolean;
}

export interface ProfileList {
  profiles?: {
    id: number;
    slug: string;
    name: string;
    functions: ModuleSelect[];
    description: string;
    dtinsert: string;
    dtupdate: string;
    users: number;
  }[];
  totalCount?: number;
}

export async function getProfiles(
  name: string,
  page: number,
  pageSize: number
): Promise<ProfileList> {
  
  const offset = (page - 1) * pageSize;

  const result = await db.execute(sql`
    SELECT 
      p.id,
      p.slug,
      p.name,
      p.description,
      p.dtinsert,
      p.dtupdate,
      (SELECT COUNT(*) FROM users u WHERE u.id_profile = p.id AND u.active = true) as users,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', m.id,
              'name', m.name,
              'group', (
                SELECT json_agg(
                  json_build_object(
                    'id', f_grp."group",
                    'functions', f_grp.functions
                  )
                )
                FROM (
                  SELECT 
                    f."group",
                    json_agg(
                      json_build_object(
                        'id', f.id,
                        'name', f.name
                      )
                    ) AS functions
                  FROM functions f
                  JOIN module_functions mf ON f.id = mf.id_function
                  JOIN profile_functions pf ON pf.id_functions = f.id
                  WHERE mf.id_module = m.id
                    AND pf.id_profile = p.id
                  GROUP BY f."group"
                ) f_grp
              )
            )
          )
          FROM modules m
          WHERE m.id IN (
            SELECT DISTINCT mf.id_module
            FROM module_functions mf
            JOIN profile_functions pf ON mf.id_function = pf.id_functions
            WHERE pf.id_profile = p.id
          )
        ), '[]'
      ) AS modules
    FROM profiles p
    WHERE p.name ILIKE ${`%${name}%`}
    ORDER BY p.id DESC
    LIMIT ${pageSize}
    OFFSET ${offset}
  `);

  const totalCountResult = await db.execute(sql`
    SELECT count(*) AS count
    FROM profiles p
    WHERE p.name ILIKE ${`%${name}%`}
  `);
  const totalCount: number = (totalCountResult.rows[0]?.count as number) || 0;

  const profilesList = result.rows.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    dtinsert: row.dtinsert,
    dtupdate: row.dtupdate,
    users: row.users,
    functions: row.modules || [],
  }));

  return { profiles: profilesList, totalCount };
}

export async function getProfileById(id: number): Promise<
  | {
      id: number;
      slug: string;
      name: string;
      description: string;
      isSalesAgent: boolean;
      module: ModuleSelect[];
    }
  | undefined
> {
  const result = await db.execute(sql`
    SELECT 
      p.id,
      p.slug,
      p.name,
      p.description,
      p.is_sales_agent,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', m.id,
              'name', m.name,
              'group', (
                SELECT json_agg(
                  json_build_object(
                    'id', f_grp."group",
                    'functions', (
                      SELECT json_agg(
                        json_build_object(
                          'id', f.id,
                          'name', f.name,
                          'selected', (
                            SELECT EXISTS (
                              SELECT 1 
                              FROM profile_functions pf 
                              WHERE pf.id_functions = f.id 
                                AND pf.id_profile = p.id
                            )
                          )
                        )
                      )
                      FROM functions f
                      JOIN module_functions mf ON f.id = mf.id_function
                      WHERE mf.id_module = m.id 
                        AND f."group" = f_grp."group"
                    )
                  )
                )
                FROM (
                  SELECT DISTINCT f."group"
                  FROM functions f
                  JOIN module_functions mf ON f.id = mf.id_function
                  WHERE mf.id_module = m.id
                ) f_grp
              )
            )
          )
          FROM modules m
          WHERE m.id IN (
            SELECT DISTINCT mf.id_module
            FROM module_functions mf
            JOIN profile_functions pf ON mf.id_function = pf.id_functions
            WHERE pf.id_profile = p.id
          )
        ), '[]'
      ) AS modules
    FROM profiles p
    WHERE p.id = ${id}
  `);

  if (result.rows.length === 0) return;

  const row = result.rows[0] as any;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    isSalesAgent: row.is_sales_agent,
    module: row.modules || [],
  };
}

export async function insertProfile(
  profileData: ProfileDetailForm
): Promise<number> {
  const newProfile = {
    slug: generateSlug(),
    name: profileData.name,
    description: profileData.description,
    isSalesAgent: profileData.isSalesAgent,
    dtinsert: new Date().toISOString(),
    dtupdate: new Date().toISOString(),
    active: true,
  };

  const profileResult = await db
    .insert(profiles)
    .values(newProfile)
    .returning({ id: profiles.id });
  const profileId = profileResult[0].id;

  // Process modules and their associated functions
  for (const moduleVar of profileData.module ? profileData.module : []) {
    for (const groupItem of moduleVar.group) {
      for (const func of groupItem.functions) {
        // First, verify that the function belongs to the specified module
        const moduleFunction = await db
          .select()
          .from(moduleFunctions)
          .where(
            and(
              eq(moduleFunctions.idModule, moduleVar.id),
              eq(moduleFunctions.idFunction, func.id)
            )
          );

        if (moduleFunction.length > 0) {
          await db.insert(profileFunctions).values({
            slug: generateSlug(),
            idProfile: profileId,
            idFunctions: func.id,
            dtinsert: new Date().toISOString(),
            dtupdate: new Date().toISOString(),
            active: true,
          });
        }
      }
    }
  }

  return profileId;
}

export async function updateProfile(
  id: number,
  profileData: Partial<ProfileDetailForm>
): Promise<void> {
  // Update basic profile data
  const updateData: any = {};

  if (profileData.name) {
    updateData.name = profileData.name;
  }

  if (profileData.description) {
    updateData.description = profileData.description;
  }

  if (profileData.isSalesAgent !== undefined) {
    updateData.isSalesAgent = profileData.isSalesAgent;
  }

  updateData.dtupdate = new Date().toISOString();

  await db.update(profiles).set(updateData).where(eq(profiles.id, id));

  // Delete all existing profile-function associations
  await db.delete(profileFunctions).where(eq(profileFunctions.idProfile, id));

  // Only insert new associations if modules are provided and have functions
  if (profileData.module && profileData.module.length > 0) {
    for (const moduleVar of profileData.module) {
      for (const groupItem of moduleVar.group) {
        // Only process functions that are selected
        const selectedFunctions = groupItem.functions.filter(
          (func) => func.selected
        );

        for (const func of selectedFunctions) {
          // Verify that the function belongs to the specified module
          const moduleFunction = await db
            .select()
            .from(moduleFunctions)
            .where(
              and(
                eq(moduleFunctions.idModule, moduleVar.id),
                eq(moduleFunctions.idFunction, func.id)
              )
            );

          if (moduleFunction.length > 0) {
            // The function belongs to this module, so add it to the profile
            await db.insert(profileFunctions).values({
              slug: generateSlug(),
              idProfile: id,
              idFunctions: func.id,
              dtinsert: new Date().toISOString(),
              dtupdate: new Date().toISOString(),
              active: true,
            });
          }
        }
      }
    }
  }
}

export async function deleteProfile(id: number): Promise<void> {
  // Delete associations in profile_functions
  await db.delete(profileFunctions).where(eq(profileFunctions.idProfile, id));

  // Delete the profile
  await db.delete(profiles).where(eq(profiles.id, id));
}

export async function getModules(profileId?: number): Promise<ModuleSelect[]> {
  const result = await db.execute(sql`
    SELECT 
      m.id, 
      m.name,
     (
        SELECT json_agg(
          json_build_object(
            'id', f."group",
            'functions', (
              SELECT json_agg(
                json_build_object(
                   'id', f2.id,
                  'name', f2.name
                )
              )
              FROM ${functions} f2
              JOIN ${moduleFunctions} mf2 ON mf2.id_function = f2.id
              WHERE mf2.id_module = m.id AND f2."group" = f."group"
            )
          )
        )
        FROM (
          SELECT DISTINCT f."group"
          FROM ${functions} f
          JOIN ${moduleFunctions} mf ON mf.id_function = f.id
          WHERE mf.id_module = m.id
        ) f
      ) AS groups
    FROM ${modules} m
    WHERE ${
      profileId
        ? sql`m.id NOT IN (
      SELECT DISTINCT mf.id_module
      FROM module_functions mf
      JOIN profile_functions pf ON mf.id_function = pf.id_functions
      WHERE pf.id_profile = ${profileId}
    )`
        : sql`1=1`
    }
    ORDER BY m.id DESC;
  `);

  const modulesList = result.rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    group: row.groups || [],
  }));

  return modulesList;
}
