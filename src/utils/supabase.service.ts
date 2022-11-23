import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  public clientInstance: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    this.clientInstance = createClient(
      this.configService.get('SUPABASE_URL'),
      this.configService.get('SUPABASE_KEY')
    );
  }
}
