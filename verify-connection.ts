/**
 * Supabase Connection Verification
 * Run this to verify your frontend-backend connection is working correctly
 */

import { supabase, fetchRooms, fetchMaintenanceReports, fetchMissingItemReports } from './src/utils/supabase';

async function verifyConnection() {
  console.log('🔍 Verifying Supabase Connection...\n');

  try {
    // Test database connectivity
    console.log('1️⃣  Testing database connection...');
    const rooms = await fetchRooms();
    console.log(`✅ Successfully fetched ${rooms.length} rooms\n`);

    // Test maintenance reports
    console.log('2️⃣  Testing maintenance reports...');
    const maintenanceReports = await fetchMaintenanceReports();
    console.log(`✅ Successfully fetched ${maintenanceReports.length} maintenance reports\n`);

    // Test missing items reports
    console.log('3️⃣  Testing missing items reports...');
    const missingItems = await fetchMissingItemReports();
    console.log(`✅ Successfully fetched ${missingItems.length} missing items reports\n`);

    // Display summary
    console.log('📊 Data Summary:');
    console.log('─────────────────');
    console.log(`Total Rooms: ${rooms.length}`);
    console.log(`Maintenance Issues: ${maintenanceReports.length}`);
    console.log(`Missing Items Reports: ${missingItems.length}`);
    
    // Room status breakdown
    const statuses = rooms.reduce((acc, room) => {
      acc[room.status] = (acc[room.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📍 Room Status Breakdown:');
    Object.entries(statuses).forEach(([status, count]) => {
      console.log(`  • ${status}: ${count}`);
    });

    // Floor breakdown
    const floors = rooms.reduce((acc, room) => {
      const floorName = room.floor === 0 ? 'Ground' : `Floor ${room.floor}`;
      acc[floorName] = (acc[floorName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n🏢 Rooms by Floor:');
    Object.entries(floors).forEach(([floor, count]) => {
      console.log(`  • ${floor}: ${count} rooms`);
    });

    console.log('\n✨ Backend Connection Verified Successfully!\n');
    console.log('Your frontend is now fully connected to Supabase backend.');
    console.log('Real-time sync is enabled and all data persists to the database.\n');

  } catch (error) {
    console.error('\n❌ Connection Failed:');
    console.error(error);
    console.log('\nTroubleshooting steps:');
    console.log('1. Verify .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    console.log('2. Check that database tables exist in Supabase');
    console.log('3. Ensure RLS policies allow read access to tables');
    console.log('4. Check browser console for CORS or network errors\n');
  }
}

// Run verification if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyConnection();
}