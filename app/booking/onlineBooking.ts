export const CONTACT_ONLY_BARBER_ID = "win-dread";

export function isOnlineBookableBarber(barberId: string) {
  return barberId !== CONTACT_ONLY_BARBER_ID;
}
