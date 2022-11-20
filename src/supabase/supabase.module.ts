import { Module } from '@nestjs/common';

import { SupabaseStrategy } from './supabase.strategy';
import { SupabaseGuard } from './supabase.guard';
import { Supabase } from './supabase';

@Module({
  providers: [Supabase, SupabaseStrategy, SupabaseGuard],
  exports: [Supabase, SupabaseGuard],
})
export class SupabaseModule {}
