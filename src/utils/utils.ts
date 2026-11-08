/**
 * Generates the choices list by filtering excluded items.
 */
export function filterRootContent(
  rootContent: string[],
  excludeList: string[],
): string[] {
  return rootContent.filter(
    (item: string) =>
      !excludeList.includes(item) && !item.startsWith("backup_"),
  );
}

/**
 * Generates a random 14-character password with alphanumeric and special characters.
 */
export function generatePassword(): string {
  const length = 14;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
