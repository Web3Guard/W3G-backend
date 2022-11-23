import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { PrismaService } from "src/utils/prisma.service";
import { SupabaseService } from "src/utils/supabase.service";

@Injectable()
export class WalletAddressStrategy extends PassportStrategy(Strategy, "wallet_address") {
  constructor(private prisma: PrismaService, private supabase: SupabaseService) {
    super();
  }

  async validate(req: Request) {
    const wallet = await this.prisma.wallets.findUnique({
      //TODO: get wallet address and chain id from requset 
      where: { address_chain_id: { 
        address: req.json()["address"],
        chain_id: req.json()["chain_id"]
      }}
    })

    if(!wallet) throw new UnauthorizedException("Wallet address not registered with any user");
    return (await this.supabase.clientInstance.auth.admin.getUserById(wallet.user_id)).data.user;
  }
}