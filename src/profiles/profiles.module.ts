import { Module } from "@nestjs/common";
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { ProfilesGuard } from './profiles.guard';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfilesGuard]
})
export class ProfilesModule {}
