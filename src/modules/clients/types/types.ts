export interface ClientDTO {
  id: string;
  name: string;
  lastName: string;
  ciOrPassport: string;
  birthDate: string;
  phone: string;
  observations: string;
}

export type CreateClientDTO = Omit<ClientDTO, "id">;
export type UpdateClientDTO = Partial<CreateClientDTO>;
