import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Type exports from database
export type RoomRow = Database["public"]["Tables"]["rooms"]["Row"];
export type RoomInsert = Database["public"]["Tables"]["rooms"]["Insert"];
export type RoomUpdate = Database["public"]["Tables"]["rooms"]["Update"];

export type MaintenanceReportRow = Database["public"]["Tables"]["maintenance_reports"]["Row"];
export type MaintenanceReportInsert = Database["public"]["Tables"]["maintenance_reports"]["Insert"];
export type MaintenanceReportUpdate = Database["public"]["Tables"]["maintenance_reports"]["Update"];

export type MissingItemReportRow = Database["public"]["Tables"]["missing_items_reports"]["Row"];
export type MissingItemReportInsert = Database["public"]["Tables"]["missing_items_reports"]["Insert"];
export type MissingItemReportUpdate = Database["public"]["Tables"]["missing_items_reports"]["Update"];

export const REPORT_IMAGE_BUCKET = "report-images";

export async function uploadReportImage(file: File | Blob, path: string) {
  const { data, error } = await supabase.storage
    .from(REPORT_IMAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: true });

  if (error) throw error;

  const { data: urlData, error: urlError } = await supabase.storage
    .from(REPORT_IMAGE_BUCKET)
    .getPublicUrl(path);

  if (urlError) throw urlError;
  return urlData.publicUrl;
}



export async function fetchMissingItemReports() {
  try {
    const { data, error } = await supabase
      .from("missing_items_reports")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) throw error;
    return data as MissingItemReportRow[];
  } catch (error) {
    console.error("Error fetching missing item reports:", error);
    throw error;
  }
}

export async function createMissingItemReport(report: MissingItemReportInsert) {
  try {
    const { data, error } = await supabase
      .from("missing_items_reports")
      .insert([report])
      .select()
      .single();

    if (error) throw error;
    return data as MissingItemReportRow;
  } catch (error) {
    console.error("Error creating missing item report:", error);
    throw error;
  }
}

export async function updateMissingItemReport(id: string, updates: MissingItemReportUpdate) {
  try {
    const { data, error } = await supabase
      .from("missing_items_reports")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as MissingItemReportRow;
  } catch (error) {
    console.error("Error updating missing item report:", error);
    throw error;
  }
}

// Rooms CRUD operations
export async function fetchRooms() {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("number", { ascending: true });
    
    if (error) throw error;
    return data as RoomRow[];
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
}

export async function createRoom(room: RoomInsert) {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .insert([room])
      .select()
      .single();
    
    if (error) throw error;
    return data as RoomRow;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

export async function updateRoom(id: string, updates: RoomUpdate) {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data as RoomRow;
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
}

export async function deleteRoom(id: string) {
  try {
    const { error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
}

// Maintenance reports CRUD operations
export async function fetchMaintenanceReports() {
  try {
    const { data, error } = await supabase
      .from("maintenance_reports")
      .select("*")
      .order("timestamp", { ascending: false });
    
    if (error) throw error;
    return data as MaintenanceReportRow[];
  } catch (error) {
    console.error("Error fetching maintenance reports:", error);
    throw error;
  }
}

export async function createMaintenanceReport(report: MaintenanceReportInsert) {
  try {
    const { data, error } = await supabase
      .from("maintenance_reports")
      .insert([report])
      .select()
      .single();
    
    if (error) throw error;
    return data as MaintenanceReportRow;
  } catch (error) {
    console.error("Error creating maintenance report:", error);
    throw error;
  }
}

export async function updateMaintenanceReport(id: string, updates: MaintenanceReportUpdate) {
  try {
    const { data, error } = await supabase
      .from("maintenance_reports")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data as MaintenanceReportRow;
  } catch (error) {
    console.error("Error updating maintenance report:", error);
    throw error;
  }
}

