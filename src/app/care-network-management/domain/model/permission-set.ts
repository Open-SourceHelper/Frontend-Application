
export class PermissionSet {
  constructor(
    readonly canReadChildProfile: boolean = true,
    readonly canEditChildProfile: boolean = false
  ) {}

  static readonly(): PermissionSet {
    return new PermissionSet(true, false);
  }
}
