const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

export async function uploadVideoToCloudinary(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (!CLOUD_NAME || CLOUD_NAME === "your_cloud_name") {
    throw new Error(
      "Cloudinary non configuré. Ajoutez VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET dans .env"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("resource_type", "video");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText) as { secure_url: string };
        resolve(res.secure_url);
      } else {
        const err = JSON.parse(xhr.responseText) as { error?: { message: string } };
        reject(new Error(err.error?.message ?? `Cloudinary error ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Erreur réseau lors de l'upload Cloudinary"));
    xhr.send(formData);
  });
}
