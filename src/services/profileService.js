import api from "../api/axios";

export const updateProfileImage = async (imageUrl, imageId) => {
  const res = await api.patch(
    "/users/profile/update-image/",
    {
      profile_image: imageUrl,
      profile_image_id: imageId,
    }
  );
  return res.data;
};

export const deleteProfileImage = async () => {
  const res = await api.delete("/users/profile/update-image/");
  return res.data;
};
