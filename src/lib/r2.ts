import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

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
  const base = process.env.R2_PUBLIC_BASE_URL;
  if (base) return `${base.replace(/\/+$/, "")}/${key.replace(/^\/+/, "")}`;
  const accountId = requiredEnv("R2_ACCOUNT_ID");
  const bucket = requiredEnv("R2_BUCKET_NAME");
  return `https://${bucket}.${accountId}.r2.dev/${key.replace(/^\/+/, "")}`;
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
