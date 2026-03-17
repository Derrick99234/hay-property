import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} environment variable.`);
  return v;
}

export function getR2Client() {
  const accountId = requiredEnv("R2_ACCOUNT_ID");
  const accessKeyId = requiredEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requiredEnv("R2_SECRET_ACCESS_KEY");

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function getPublicUrl(key: string) {
  const base = (process.env.R2_PUBLIC_BASE_URL ?? "").trim();
  if (!base) throw new Error("Missing R2_PUBLIC_BASE_URL environment variable.");
  return `${base.replace(/\/+$/, "")}/${key.replace(/^\/+/, "")}`;
}

export function rewriteToPublicBaseUrl(urlOrKey: string) {
  const base = (process.env.R2_PUBLIC_BASE_URL ?? "").trim();
  if (!base) return urlOrKey;
  const cleanBase = base.replace(/\/+$/, "");

  const raw = String(urlOrKey ?? "").trim();
  if (!raw) return raw;

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      const u = new URL(raw);
      const key = u.pathname.replace(/^\/+/, "");
      if (!key) return raw;
      return `${cleanBase}/${key}`;
    } catch {
      return raw;
    }
  }

  return `${cleanBase}/${raw.replace(/^\/+/, "")}`;
}

export async function putPublicObject(params: { key: string; body: Uint8Array; contentType: string }) {
  const bucket = requiredEnv("R2_BUCKET_NAME");
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
}

export async function deletePublicObject(key: string) {
  const bucket = requiredEnv("R2_BUCKET_NAME");
  const client = getR2Client();
  const cleanKey = String(key ?? "").replace(/^\/+/, "");
  if (!cleanKey) throw new Error("Missing key.");
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: cleanKey }));
}
