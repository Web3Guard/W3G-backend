import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ExtractJwt } from 'passport-jwt';

/**
 * Supabase client
 * Reference: https://github.com/andriishupta/nestjs-supabase-setup/blob/main/src/common/supabase/supabase.ts
 */

@Injectable({ scope: Scope.REQUEST })
export class Supabase {
  private readonly logger = new Logger(Supabase.name);
  private clientInstance: SupabaseClient;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService,
  ) {}

  getClient() {
    if (this.clientInstance) {
      return this.clientInstance;
    }

    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(this.request);
    this.clientInstance = createClient(
      this.configService.get('SUPABASE_URL'),
      this.configService.get('SUPABASE_KEY'),
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        },
        auth: {
          detectSessionInUrl: false,
        },
      }
    );
    return this.clientInstance;
  }
}
