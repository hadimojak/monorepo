import { IsUUID } from 'class-validator';
import type { UUID } from 'crypto';

export class RefreshDto {
  @IsUUID()
  refreshToken: UUID;
}
