const checkpermission = (requestedUser, requestedId) => {
    // console.log(requestedUser, requestedId)
    if (requestedUser.UserRole === 'admin') return;
    if (requestedUser.UserId === requestedId.toString()) return;

    throw new Error("unauthorized access to route");


}

module.exports = { checkpermission };