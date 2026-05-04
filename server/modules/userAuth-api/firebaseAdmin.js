import admin from "firebase-admin";
import serviceAccount from "../../serviceAccountKey.json" with { type: "json" };

const firebaseCredentials = {
  projectId: serviceAccount.project_id || serviceAccount.projectId,
  clientEmail: serviceAccount.client_email,
  privateKey: serviceAccount.private_key?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
  });
}

export default admin;