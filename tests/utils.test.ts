import { describe, expect, test } from "vitest";
import { ignorePatternsFor } from "../src/shared/devFilters";
import { filterRootContent, generatePassword } from "../src/utils/utils";

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

  describe("ignorePatternsFor", () => {
    test("restituisce i pattern delle sole categorie escluse", () => {
      const patterns = ignorePatternsFor(["github"]);
      expect(patterns).toContain("**/.github/**");
      expect(patterns).not.toContain("**/.env");
    });
  });
});
