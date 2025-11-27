const pool = require("./db");

async function createKycTable() {
  const queryText = `
  CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doc_kind VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,    
  fullname VARCHAR(100) NOT NULL, 
  address TEXT NOT NULL,     
  nidNumber VARCHAR(50) UNIQUE,
  front_image_url TEXT, 
  back_image_url TEXT,
  selfie_image_url TEXT,
  status VARCHAR(20) DEFAULT 'PENDING',   
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_user_doc_kind UNIQUE (user_id, doc_kind)
);`;

  try {
    await pool.query(queryText);
    console.log("KYC table created or already exists");
  } catch (err) {
    console.error("Error creating KYC table:", err);
  }
}

async function saveFrontImageDocument(user_id, doc_kind, front_image_url) {
  const queryText = `
    UPDATE kyc_documents
    SET front_image_url = $3,
        updated_at      = NOW()
    WHERE user_id = $1
      AND doc_kind = $2
    RETURNING *;
  `;
  const res = await pool.query(queryText, [user_id, doc_kind, front_image_url]);
  return res.rows[0];
}

async function saveBackImageDocument(user_id, doc_kind, back_image_url) {
  const queryText = `
    UPDATE kyc_documents
    SET back_image_url = $3,
        updated_at      = NOW()
    WHERE user_id = $1
      AND doc_kind = $2
    RETURNING *;
  `;
  const res = await pool.query(queryText, [user_id, doc_kind, back_image_url]);
  return res.rows[0];
}

async function saveSelfieImageDocument(user_id, doc_kind, selfie_image_url) {
  const queryText = `
    UPDATE kyc_documents
    SET selfie_image_url = $3,
        updated_at      = NOW()
    WHERE user_id = $1
      AND doc_kind = $2
    RETURNING *;
  `;
  const res = await pool.query(queryText, [user_id, doc_kind, selfie_image_url]);
  return res.rows[0];
}

async function updateUserFullname(userId, fullName) {
  const res = await pool.query(
    "UPDATE users SET fullname = $2, updated_at = NOW() WHERE id = $1 RETURNING *",
    [userId, fullName]
  );
  return res.rows[0];
}

async function saveBasicInfo(user_id, fullName, doc_kind,  date_of_birth, address, nidNumber) {
  const queryText = `
    INSERT INTO kyc_documents (user_id, fullname, doc_kind, date_of_birth, address, nidNumber)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (user_id, doc_kind)
    DO UPDATE SET
     fullname      = EXCLUDED.fullname,
      date_of_birth = EXCLUDED.date_of_birth,
      address       = EXCLUDED.address,
      nidNumber     = EXCLUDED.nidNumber,
      updated_at    = NOW()
    RETURNING *;
  `;
  await updateUserFullname(user_id, fullName);
  const res = await pool.query(queryText, [user_id, fullName, doc_kind,  date_of_birth, address, nidNumber]);
  return res.rows[0];
}

module.exports = {
  createKycTable,
  saveFrontImageDocument,
  saveSelfieImageDocument,
  saveBackImageDocument,
  saveBasicInfo
};
