const {
  generatePassword,
  formatFileName,
  validateSelection,
  filterRootContent,
  formatProgress,
  prepareChoices,
} = require("../src/utils/utils");

describe("Utility Functions", () => {
  describe("generatePassword", () => {
    test("should generate a password of 14 characters", () => {
      const password = generatePassword();
      expect(password).toHaveLength(14);
    });

    test("should generate different passwords on each call", () => {
      const password1 = generatePassword();
      const password2 = generatePassword();
      expect(password1).not.toBe(password2);
    });

    test("should contain only allowed characters", () => {
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
      const password = generatePassword();
      for (const char of password) {
        expect(charset).toContain(char);
      }
    });
  });

  describe("formatFileName", () => {
    test("should add .zip extension if missing", () => {
      expect(formatFileName("mybackup")).toBe("mybackup.zip");
    });

    test("should not add .zip extension if already present", () => {
      expect(formatFileName("mybackup.zip")).toBe("mybackup.zip");
    });
  });

  describe("validateSelection", () => {
    test("should return true if at least one item is selected", () => {
      expect(validateSelection(["src", "package.json"])).toBe(true);
    });

    test("should return an error message if no items are selected", () => {
      expect(validateSelection([])).toBe(
        "Devi selezionare almeno un elemento.",
      );
    });
  });

  describe("filterRootContent", () => {
    test("should filter out excluded items and existing backups", () => {
      const content = [
        "src",
        "node_modules",
        "dist",
        "package.json",
        "backup_2023.zip",
        ".git",
      ];
      const excludeList = ["node_modules", "dist", ".git"];
      const result = filterRootContent(content, excludeList);

      expect(result).toContain("src");
      expect(result).toContain("package.json");
      expect(result).not.toContain("node_modules");
      expect(result).not.toContain("dist");
      expect(result).not.toContain("backup_2023.zip");
      expect(result).not.toContain(".git");
    });
  });

  describe("formatProgress", () => {
    test("should format progress string correctly", () => {
      const result = formatProgress(1024 * 1024, 2 * 1024 * 1024);
      expect(result).toContain("50.00%");
      expect(result).toContain("1.00 MB");
      expect(result).toContain("2.00 MB");
      expect(result).toMatch(/^\r/);
    });

    test("should handle zero total bytes", () => {
      const result = formatProgress(0, 0);
      expect(result).toContain("0.00%");
    });
  });

  describe("prepareChoices", () => {
    test("should label directories and files correctly", () => {
      const items = ["src", "README.md"];
      const isDirMock = (item: string) => item === "src";

      const choices = prepareChoices(items, isDirMock);

      expect(choices[0].name).toBe("[DIR]  src");
      expect(choices[1].name).toBe("[FILE] README.md");
    });

    test("should sort choices alphabetically by name", () => {
      const items = ["z.txt", "a.txt"];
      const isDirMock = () => false;
      const choices = prepareChoices(items, isDirMock);

      expect(choices[0].value).toBe("a.txt");
      expect(choices[1].value).toBe("z.txt");
    });
  });
});
