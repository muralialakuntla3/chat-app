const QueryKeys = {
  auth: {
    sign_in: "sign_in",
    sign_up: "sign_up",
  },
  users: {
    users_list: "users_list",
    update_user: "update_user",
    forgot_password: "forgot_password",
  },
  messages: {
    get_messages: "get_messages",
  },
  channels: {
    create_channel: "create_channel",
    delete_channel: "delete_channel",
    channels_list: "channels_list",
  },
} as const;

export default QueryKeys;
