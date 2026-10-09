export class UserProfile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public firstName: string,
    public lastName: string,
    public phone: string,
    public updatedAt: string
  ) {}

  actualizarPerfil(
    firstName: string,
    lastName: string,
    phone: string
  ): void {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.updatedAt = new Date().toISOString();
  }

  consultarPerfil(): UserProfile {
    return this;
  }
}
