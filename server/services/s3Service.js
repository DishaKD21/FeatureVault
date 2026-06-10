import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a file from memory buffer to Amazon S3.
 * @param {Object} file - The file object from multer (memory storage)
 * @returns {Promise<string>} - The S3 object URL
 */
export async function uploadToS3(file) {
  const fileKey = `diagrams/${Date.now()}-${file.originalname}`;
  const bucketName = process.env.AWS_BUCKET_NAME;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);

  // Return the public S3 URL
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
}

/**
 * Deletes a file from Amazon S3 based on its public S3 URL.
 * @param {string} fileUrl - The public S3 URL of the file
 * @returns {Promise<void>}
 */
export async function deleteFromS3(fileUrl) {
  if (!fileUrl) return;

  const bucketName = process.env.AWS_BUCKET_NAME;
  const urlPrefix = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

  if (!fileUrl.startsWith(urlPrefix)) {
    console.warn("File is not stored in S3 or has a different bucket structure:", fileUrl);
    return;
  }

  // Extract key by removing the URL prefix
  const fileKey = fileUrl.replace(urlPrefix, "");

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  await s3Client.send(command);
}

/**
 * Retrieves a readable stream of an object from S3.
 * @param {string} fileUrl - The public S3 URL of the file
 * @returns {Promise<stream.Readable>} - The S3 object stream
 */
export async function getS3ObjectStream(fileUrl) {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const urlPrefix = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

  if (!fileUrl.startsWith(urlPrefix)) {
    throw new Error("File is not stored in S3 or has a different bucket structure");
  }

  const fileKey = fileUrl.replace(urlPrefix, "");

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  const response = await s3Client.send(command);
  return response.Body;
}

