export const userConfig = async (id) => {
  try {
    const response = await fetch(`/api/user/${id}`);
    if (!response.ok) {
      return console.error(`Error while fetching user Data`);
    }
    const userInfo = await response.json();
    return userInfo.user;

  } catch (error) {
    console.error(error);
  }
};
