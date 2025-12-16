import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../api/user.api";

export const useProfile = () => {
  const client = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["profile"] });
    }
  });

  return { profileQuery, updateMutation };
};
