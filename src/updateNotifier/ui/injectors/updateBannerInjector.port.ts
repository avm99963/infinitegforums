export type UpdateBannerInjectReason = 'install' | 'update';

export interface UpdateBannerInjectorPort {
  execute(reason: UpdateBannerInjectReason): void;
}
