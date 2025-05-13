import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export const uploadImageToFirebase = async (file, folder = "images") => {
  const uniqueName = `${folder}/${Date.now()}-${file.name}`;
  const imageRef = ref(storage, uniqueName);
  await uploadBytes(imageRef, file);
  const url = await getDownloadURL(imageRef);
  return url;
};
