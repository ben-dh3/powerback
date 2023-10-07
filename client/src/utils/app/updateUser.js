import API from '@API';

export const updateUser = (
  { id, donations },
  info,
  setUserData,
  switchToErrorScreen
) => {
  if (!id || !donations) {
    return;
  } else {
    let updatesObj = info;
    const userDonations = donations;
    API.updateUser(id, info) // api call
      .then(() => {
        updatesObj.donations = userDonations;
        setUserData((u) => ({ ...u, ...updatesObj })); // update user state and re-attach donations array
      })
      .catch((err) => switchToErrorScreen(err));
  }
};
