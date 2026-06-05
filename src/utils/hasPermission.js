export const hasPermission = (permissionName) => {
  const profilesStr = localStorage.getItem("profiles");
  if (!profilesStr) return false;
  try {
    const profiles = JSON.parse(profilesStr);
    // Dev profile gets all permissions by default
    const isDev = profiles.some(p => p.profile_name?.toLowerCase() === 'dev');
    if (isDev) return true;

    // Check if the requested permission exists in any of the user's profiles
    return profiles.some(p => p.accesses && p.accesses.includes(permissionName));
  } catch (e) {
    console.error("Error parsing profiles from localStorage:", e);
    return false;
  }
};
