// Estende le opzioni di archiver con la password del formato "zip-encryptable".
import "archiver";

declare module "archiver" {
  interface ZipOptions {
    password?: string;
  }
}
