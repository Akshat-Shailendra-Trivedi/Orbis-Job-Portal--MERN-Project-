export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const options = {
      httpOnly: true,
      expires: expires
    };
    res.cookie("token", token, options);
    res.status(statusCode).json({
      success: true,
      user,
      message,
      token
    });
  };